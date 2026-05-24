#!/usr/bin/env python3
"""
Strip Kadence/Gutenberg inline styles from homepage.html and apply hp-* classes.

Re-run after exporting messy markup from the block editor (Code editor copy/paste)
to remove inline style="" attributes and block JSON "style" objects again.

Usage (from repo root):
  python3 scripts/refactor-homepage-html.py

Reads and overwrites: wp-theme/content/homepage.html
Then paste the file into Pages → Homepage → Code editor in WordPress.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "wp-theme/content/homepage.html"


def parse_wp_line(line: str) -> tuple[str, str, dict, str] | None:
    m = re.match(r"^(\s*)<!-- wp:([^\s]+) ", line)
    if not m:
        return None
    indent, name = m.group(1), m.group(2)
    rest = line[m.end():]
    if rest.endswith("/-->"):
        suffix = " /-->"
        json_str = rest[: -len("/-->")].rstrip()
    elif rest.endswith("-->"):
        suffix = " -->"
        json_str = rest[: -len("-->")].rstrip()
    else:
        return None
    if not json_str.startswith("{"):
        return None
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        return None
    return indent, name, data, suffix


def emit_wp_line(indent: str, name: str, data: dict, suffix: str) -> str:
    return f'{indent}<!-- wp:{name} {json.dumps(data, separators=(",", ":"))}{suffix}'


INLINE_WP = re.compile(r"<!-- wp:([^\s]+) (\{.*?\})( ?/)?-->")


def strip_inline_blocks(line: str) -> str:
    def repl(match: re.Match[str]) -> str:
        name, json_str, self_close = match.group(
            1), match.group(2), match.group(3)
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            return match.group(0)
        strip_block_data(data)
        suffix = " /-->" if self_close else " -->"
        return f'<!-- wp:{name} {json.dumps(data, separators=(",", ":"))}{suffix}'

    # Greedy won't work for nested JSON — find by brace depth
    result = []
    pos = 0
    while True:
        start = line.find("<!-- wp:", pos)
        if start == -1:
            result.append(line[pos:])
            break
        result.append(line[pos:start])
        brace = line.find("{", start)
        if brace == -1:
            result.append(line[start:])
            break
        depth = 0
        end = brace
        for i in range(brace, len(line)):
            if line[i] == "{":
                depth += 1
            elif line[i] == "}":
                depth -= 1
                if depth == 0:
                    end = i
                    break
        close = line.find("-->", end)
        if close == -1:
            result.append(line[start:])
            break
        chunk = line[start: close + 3]
        inner = re.match(r"<!-- wp:([^\s]+) (.+)( ?/)?-->$", chunk)
        if inner:
            name, json_str, self_close = inner.group(
                1), inner.group(2), inner.group(3)
            try:
                data = json.loads(json_str)
                strip_block_data(data)
                suffix = " /-->" if self_close else " -->"
                result.append(
                    f'<!-- wp:{name} {json.dumps(data, separators=(",", ":"))}{suffix}'
                )
            except json.JSONDecodeError:
                result.append(chunk)
        else:
            result.append(chunk)
        pos = close + 3
    return "".join(result)


def set_class(data: dict, *classes: str) -> None:
    existing = data.get("className", "").split()
    for c in classes:
        if c and c not in existing:
            existing.append(c)
    data["className"] = " ".join(existing)


def strip_block_data(data: dict) -> None:
    data.pop("style", None)
    data.pop("textColor", None)
    data.pop("backgroundColor", None)


def main() -> None:
    raw = PATH.read_text()
    if "hp-* classes" not in raw:
        raw = raw.replace(
            '  - Homepage-specific CSS lives in wp-theme/assets/css/theme.css (section "Homepage (Kadence blocks)").',
            '  - Homepage-specific CSS lives in wp-theme/assets/css/theme.css (section "Homepage (Kadence blocks)").\n'
            "  - Styling uses hp-* classes in theme.css — do not re-add colours via the block Styles panel.",
        )

    raw = re.sub(r',?"bgColor":"#[0-9a-fA-F]{3,8}"', "", raw)
    raw = re.sub(r',"kadenceBlockCSS":"[^"]*"', "", raw)
    raw = re.sub(r"\s+style=\"[^\"]*\"", "", raw)

    lines_out: list[str] = []
    i = 0
    all_lines = raw.splitlines()

    while i < len(all_lines):
        line = all_lines[i]
        parsed = parse_wp_line(line)
        if parsed:
            indent, name, data, suffix = parsed
            strip_block_data(data)
            lines_out.append(emit_wp_line(indent, name, data, suffix))
        else:
            lines_out.append(strip_inline_blocks(line))
        i += 1

    text = "\n".join(lines_out)

    # ── HTML + selective block className patches ──
    replacements = [
        # Hero
        (
            '<!-- wp:heading {"level":1} -->',
            '<!-- wp:heading {"level":1,"className":"hp-display"} -->',
        ),
        (
            '<h1 class="wp-block-heading has-text-color">',
            '<h1 class="wp-block-heading hp-display">',
        ),
        (
            '<p class="has-text-color">Test Automation </p>',
            '<p class="hp-display-line">Test Automation</p>',
        ),
        (
            '<p class="has-text-color">\n      with confidence</p>',
            '<p class="hp-display-line">with confidence</p>',
        ),
        (
            "<!-- wp:freeform -->\n<p><span>Built by 60+ test automation experts",
            '<!-- wp:paragraph {"className":"hp-lead"} -->\n<p class="hp-lead">Built by 60+ test automation experts',
        ),
        (
            "rapidly evolving landscape.</span></p>\n<!-- /wp:freeform -->",
            "rapidly evolving landscape.</p>\n<!-- /wp:paragraph -->",
        ),
        (
            '<!-- wp:buttons {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"left"}} -->',
            '<!-- wp:buttons {"className":"hp-buttons--hero","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"left"}} -->',
        ),
        (
            '<motion.div class="wp-block-buttons">',
            '<div class="wp-block-buttons hp-buttons--hero">',
        ),
        (
            '<div class="wp-block-buttons"><!-- wp:button -->',
            '<motion.div class="wp-block-buttons hp-buttons--hero"><!-- wp:button {"className":"hp-btn"} -->',
        ),
        (
            '<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-background has-custom-font-size wp-element-button" href="/techradar">Explore\n          the radar →</a>',
            '<div class="wp-block-button hp-btn"><a class="wp-block-button__link wp-element-button" href="/techradar">Explore the radar →</a>',
        ),
        (
            '<hr class="wp-block-separator has-text-color has-white-color has-alpha-channel-opacity has-white-background-color has-background is-style-wide"/>',
            '<hr class="wp-block-separator has-text-color has-white-color has-alpha-channel-opacity has-white-background-color has-background is-style-wide hp-separator"/>',
        ),
        (
            "<!-- wp:freeform -->\n<p><br />\n      <span>Made by TAG",
            '<!-- wp:paragraph {"className":"hp-tagline"} -->\n<p class="hp-tagline"><span>Made by TAG',
        ),
        (
            "Test Automation Group</span></p>\n<!-- /wp:freeform -->",
            "Test Automation Group</span></p>\n<!-- /wp:paragraph -->",
        ),
        # Why eyebrow
        (
            "<!-- wp:freeform -->\n<h5>Why we built this</h5>\n<!-- /wp:freeform -->",
            '<!-- wp:heading {"level":5,"className":"hp-eyebrow"} -->\n<h5 class="wp-block-heading hp-eyebrow">Why we built this</h5>\n<!-- /wp:heading -->',
        ),
        (
            '<h2 class="wp-block-heading has-text-color">Cut through the noise',
            '<h2 class="wp-block-heading hp-title hp-title--lg">Cut through the noise',
        ),
        (
            '<!-- wp:button {"className":"is-style-outline"} -->',
            '<!-- wp:button {"className":"hp-btn hp-btn--outline-techniques"} -->',
        ),
        (
            '<motion.div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-text-color has-border-color has-custom-font-size wp-element-button" href="/techradar">Open',
            '<div class="wp-block-button hp-btn hp-btn--outline-techniques"><a class="wp-block-button__link wp-element-button" href="/techradar">Open',
        ),
        # Cards - groups
        (
            '<!-- wp:group {"layout":{"type":"constrained"}} -->\n<div class="wp-block-group has-border-color has-background">',
            '<!-- wp:group {"className":"hp-card","layout":{"type":"constrained"}} -->\n<div class="wp-block-group hp-card">',
        ),
    ]

    text = text.replace('<motion.div', '<div').replace(
        '</motion.div>', '</motion.div>')  # cleanup accidents
    text = text.replace('</motion.div>', '</div>')

    for old, new in replacements:
        text = text.replace(old, new)

    # Card variants via regex
    text = re.sub(
        r'<div class="wp-block-group has-border-color has-background">',
        '<div class="wp-block-group hp-card">',
        text,
    )

    text = re.sub(
        r'<h3 class="wp-block-heading has-text-color">(Informed decisions|Stay ahead|Faster releases|Cost savings)</h3>',
        r'<h3 class="wp-block-heading hp-card-title">\1</h3>',
        text,
    )

    quadrant_titles = {
        "Techniques": "hp-quadrant-title--techniques",
        "Tools": "hp-quadrant-title--tools",
        "Languages &amp;\n            Frameworks": "hp-quadrant-title--languages",
        "Languages &amp; Frameworks": "hp-quadrant-title--languages",
        "Platforms": "hp-quadrant-title--platforms",
        "Adopt": "hp-quadrant-title--techniques",
        "Trial": "hp-quadrant-title--languages",
        "Assess": "hp-quadrant-title--platforms",
        "Hold": "hp-quadrant-title--tools",
    }
    for title, cls in quadrant_titles.items():
        text = text.replace(
            f'<h3 class="wp-block-heading has-text-color">{title}</h3>',
            f'<h3 class="wp-block-heading hp-quadrant-title {cls}">{title}</h3>',
        )

    # Section eyebrows
    text = re.sub(
        r"<!-- wp:freeform -->\n<h5 class=\"has-text-align-center\">How it works</h5>\n<!-- /wp:freeform -->",
        '<!-- wp:heading {"level":5,"className":"hp-eyebrow hp-eyebrow--center"} -->\n<h5 class="wp-block-heading hp-eyebrow hp-eyebrow--center">How it works</h5>\n<!-- /wp:heading -->',
        text,
    )
    text = re.sub(
        r"<!-- wp:freeform -->\n<h5 class=\"has-text-align-center\">Who is it for\?</h5>\n<!-- /wp:freeform -->",
        '<!-- wp:heading {"level":5,"className":"hp-eyebrow hp-eyebrow--center"} -->\n<h5 class="wp-block-heading hp-eyebrow hp-eyebrow--center">Who is it for?</h5>\n<!-- /wp:heading -->',
        text,
    )
    text = re.sub(
        r"<!-- wp:freeform -->\n<h5>customer case</h5>\n<!-- /wp:freeform -->",
        '<!-- wp:heading {"level":5,"className":"hp-eyebrow"} -->\n<h5 class="wp-block-heading hp-eyebrow">customer case</h5>\n<!-- /wp:heading -->',
        text,
    )
    text = re.sub(
        r"<!-- wp:freeform -->\n<h5 class=\"has-text-align-center\">The team behind it</h5>\n<!-- /wp:freeform -->",
        '<!-- wp:heading {"level":5,"className":"hp-eyebrow hp-eyebrow--muted hp-eyebrow--center"} -->\n<h5 class="wp-block-heading hp-eyebrow hp-eyebrow--muted hp-eyebrow--center">The team behind it</h5>\n<!-- /wp:heading -->',
        text,
    )
    text = re.sub(
        r"<!-- wp:freeform -->\n<h2>Quadrants — What is it\?</h2>\n<!-- /wp:freeform -->",
        '<!-- wp:heading {"level":2,"className":"hp-label"} -->\n<h2 class="wp-block-heading hp-label">Quadrants — What is it?</h2>\n<!-- /wp:heading -->',
        text,
    )
    text = re.sub(
        r"<!-- wp:freeform -->\n<h2>Rings — What to do with it\?</h2>\n<!-- /wp:freeform -->",
        '<!-- wp:heading {"level":2,"className":"hp-label"} -->\n<h2 class="wp-block-heading hp-label">Rings — What to do with it?</h2>\n<!-- /wp:heading -->',
        text,
    )

    # Section titles
    text = text.replace(
        '<h2 class="wp-block-heading has-text-align-center has-text-color">Two dimensions',
        '<h2 class="wp-block-heading has-text-align-center hp-title hp-title--md hp-title--section">Two dimensions',
    )
    text = text.replace(
        '<h2 class="wp-block-heading has-text-align-center has-text-color">Built for everyone',
        '<h2 class="wp-block-heading has-text-align-center hp-title hp-title--md hp-title--section">Built for everyone',
    )
    text = text.replace(
        '<h2 class="wp-block-heading has-text-align-left has-text-color">How the',
        '<h2 class="wp-block-heading has-text-align-left hp-title hp-title--lg">How the',
    )
    text = text.replace(
        '<h2 class="wp-block-heading has-text-align-center has-text-color">\n      TAG',
        '<h2 class="wp-block-heading has-text-align-center hp-title hp-title--tag">\n      TAG',
    )
    text = text.replace(
        '<h2 class="wp-block-heading has-text-align-center has-black-color has-text-color">',
        '<h2 class="wp-block-heading has-text-align-center hp-title hp-title--md">',
    )

    # Who cards
    text = re.sub(
        r'<h3 class="wp-block-heading has-text-align-left has-text-color">',
        '<h3 class="wp-block-heading has-text-align-left hp-card-title hp-card-title--loose">',
        text,
    )

    # Compact cards - add modifiers (first pass made all hp-card; fix spacing)
    # Cards with margin in original were every other in 2x2 - use hp-card--spaced on first of pair
    text = text.replace(
        '<div class="wp-block-group hp-card"><!-- wp:heading {"level":3,"className":"hp-card-title"} -->\n<h3 class="wp-block-heading hp-card-title">Informed decisions',
        '<motion.div class="wp-block-group hp-card hp-card--spaced"><!-- wp:heading {"level":3,"className":"hp-card-title"} -->\n<h3 class="wp-block-heading hp-card-title">Informed decisions',
    )
    text = text.replace('<motion.div class="wp-block-group',
                        '<div class="wp-block-group')

    # How-it-works compact cards
    text = re.sub(
        r'(<div class="wp-block-group hp-card">.*?Techniques)',
        r'<motion.div class="wp-block-group hp-card hp-card--compact hp-card--stack">\g<1>',
        text,
        count=1,
    )
    text = text.replace('<motion.div class="wp-block-group',
                        '<div class="wp-block-group')

    # homepage-case rows
    text = text.replace(
        '"kbVersion":2} -->\n<!-- wp:kadence/column {"borderWidth":["","","",""],"uniqueID":"6_ed44a2-d4"',
        '"kbVersion":2,"className":"wp-block-kadence-rowlayout kb-row-layout-wrap homepage-case alignfull"} -->\n<!-- wp:kadence/column {"borderWidth":["","","",""],"uniqueID":"6_ed44a2-d4"',
        1,
    )
    text = text.replace(
        '"padding":[null,"",120,""],"kbVersion":2} -->\n<!-- wp:kadence/column {"borderWidth":["","","",""],"uniqueID":"6_aec931-a2"',
        '"padding":[null,"",120,""],"kbVersion":2,"className":"wp-block-kadence-rowlayout kb-row-layout-wrap homepage-case alignfull"} -->\n<!-- wp:kadence/column {"borderWidth":["","","",""],"uniqueID":"6_aec931-a2"',
        1,
    )

    # TAG cards + links
    text = text.replace(
        '<div class="wp-block-group tag-card-detesters has-background">',
        '<div class="wp-block-group tag-card-detesters hp-card">',
    )
    text = text.replace(
        '<motion.div class="wp-block-group tag-card-testcoders has-background">',
        '<div class="wp-block-group tag-card-testcoders hp-card">',
    )
    text = text.replace(
        '<div class="wp-block-group tag-card-techchamps has-background">',
        '<div class="wp-block-group tag-card-techchamps hp-card">',
    )
    text = re.sub(
        r'<p><a href="(https://detesters\.nl[^"]*)"[^>]*>Visit website →</a></p>',
        r'<p class="hp-tag-card-footer"><a class="hp-link" href="\1" target="_blank" rel="noopener noreferrer">Visit website →</a></p>',
        text,
    )
    text = re.sub(
        r'<p><a href="(https://testcoders\.nl[^"]*)"[^>]*>Visit website →</a></p>',
        r'<p class="hp-tag-card-footer"><a class="hp-link" href="\1" target="_blank" rel="noopener noreferrer">Visit website →</a></p>',
        text,
    )
    text = re.sub(
        r'<p><a href="(https://techchamps\.io[^"]*)"[^>]*>Visit website →</a></p>',
        r'<p class="hp-tag-card-footer"><a class="hp-link" href="\1" target="_blank" rel="noopener noreferrer">Visit website →</a></p>',
        text,
    )

    # Fix nested p in tag cards
    text = re.sub(
        r"<!-- wp:freeform -->\n<p>\n<p><a class=\"hp-link\"",
        '<!-- wp:paragraph {"className":"hp-tag-card-footer"} -->\n<p class="hp-tag-card-footer"><a class="hp-link"',
        text,
    )
    text = re.sub(
        r"</a></p>\n</p>\n<!-- /wp:freeform -->",
        "</a></p>\n<!-- /wp:paragraph -->",
        text,
    )

    # Sofius + CTA
    text = text.replace(
        '<p class="has-text-align-center"><a href="https://www.sofius.com"',
        '<p class="has-text-align-center"><a class="hp-sofius-link" href="https://www.sofius.com"',
    )
    text = text.replace(
        '<p>Explore all [techradar_blip_count] blips across 4 quadrants.</p>',
        '<p class="hp-text-center">Explore all [techradar_blip_count] blips across 4 quadrants.</p>',
    )
    text = text.replace(
        '<div class="wp-block-group">',
        '<div class="wp-block-group hp-cta-wrap">',
        1,
    )

    # Buttons
    text = text.replace(
        '<div class="wp-block-buttons"><!-- wp:button -->\n<div class="wp-block-button"><a class="wp-block-button__link has-text-color has-background',
        '<div class="wp-block-buttons"><!-- wp:button {"className":"hp-btn hp-btn--wide"} -->\n<div class="wp-block-button hp-btn hp-btn--wide"><a class="wp-block-button__link wp-element-button',
    )
    text = text.replace(
        '<div class="wp-block-buttons hp-buttons--spaced-top">',
        '<div class="wp-block-buttons hp-buttons--spaced-top">',
    )
    text = text.replace(
        '<div class="wp-block-buttons"><!-- wp:button {"className":"hp-btn hp-btn--wide"} -->',
        '<div class="wp-block-buttons hp-buttons--spaced-top"><!-- wp:button {"className":"hp-btn hp-btn--wide"} -->',
        1,
    )

    text = text.replace(
        'Read the full case →</a></motion.div>',
        'Read the full case →</a></div>',
    )
    text = text.replace(
        '<!-- wp:button {"className":"is-style-outline"} -->\n<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-text-color has-border-color has-custom-font-size wp-element-button" href="/techradar">Read',
        '<!-- wp:button {"className":"hp-btn hp-btn--outline-techniques"} -->\n<div class="wp-block-button hp-btn hp-btn--outline-techniques"><a class="wp-block-button__link wp-element-button" href="/customer-cases/port-of-rotterdam/">Read',
    )

    # Add hp-card--lg to who section groups
    text = re.sub(
        r'kb-row-layout-idhp_who_grid who-four-columns.*?<div class="wp-block-group hp-card">',
        lambda m: m.group(0).replace('hp-card">', 'hp-card hp-card--lg">'),
        text,
        flags=re.DOTALL,
    )

    PATH.write_text(text + "\n")
    style_blocks = sum(1 for l in text.splitlines()
                       if '"style"' in l and "<!-- wp:" in l)
    print("Block lines with style:", style_blocks)
    print("HTML style= count:", text.count("style="))


if __name__ == "__main__":
    main()

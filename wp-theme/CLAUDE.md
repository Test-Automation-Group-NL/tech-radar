# wp-theme/ — WordPress Theme

## Overview
Classic WP theme. Page content (except the radar) is managed in the Gutenberg block editor + Kadence Blocks. The radar page uses a dedicated page template that only renders the `[techradar]` shortcode — no Gutenberg content on that page.

## Site header (primary `<header class="site-header">`)
- **Layout**: like the `TechRadar Website.html` prototype — header **PNG wordmark** (zw.wit, **zonder pay-off** — black type / white-accent *C*: readable at nav size) plus **typed** tagline *Choose wiser, test smarter*. **Primary nav visually centred** (absolute centre on wide viewports). **Quadrant tabs** stay in `.techradar-nav` (plugin), not here.
- **Style**: **brand bar** (`--color-nav` = `--color-brand-blue` from the PDF palette) — same hues you already use for the radar nav, **not** the dark navy from the sample file. White text + `color-mix` / `--color-brand-blue-muted` for pills and tagline. Second row (`.techradar-nav`) is the **same** `--color-nav` with a light hairline separator (prototype’s two-row layout, your colours).
- **Width**: inner row `max-width: 1400px` (`--site-container-max`), horizontal padding `clamp(16px, 3vw, 32px)`.
- **Logo**: `assets/images/branding/techradar-wordmark.png` — Dropbox `design-hardcopy/logo/zonder pay-off/rgb/zwart.wit/tech radar logo zw.wit.rgb zonder payoff.png`. Pay-off is **HTML/CSS**, not in the raster (keeps caption legible). Optional circle mark: `assets/images/techradar-logo-mark.svg`.
- **Primary nav**: `theme_location` `primary`. Fallback: `inc/header-nav.php` → Home, TechRadar (radar template page), Contact.
- **Sticky offset**: `theme.css` sets `--site-header-height` / `--site-header-offset` so `.techradar-nav` (same `--color-nav` strip) sticks **under** this header — `src/styles/nav.css` uses `top: var(--site-header-offset, 0)`.
- **Mobile (≤900px)**: hamburger opens a **drawer** under the bar; **backdrop** (`.site-header__backdrop` after `wp_body_open`), **body scroll lock**, **Esc** / backdrop tap / nav link tap to close, Tab **focus trap** between toggle and links, animated hamburger → close icon. `theme.js`.
- **Standalone** (`standalone/index.html`): same header markup + `theme.css` (dummy links).

## Footer (`<footer class="site-footer">`)
- **Layout**: Three columns — all **left-aligned**: brand (white wordmark via CSS filter + intro), **Navigate** links, **Made by TAG** (partner marks + Sofius row). Divider + copyright row.
- **Surface**: **`--color-nav`** (same **`--color-brand-blue`** as `.site-header`). Muted copy via `color-mix` with **`--color-brand-blue`** like the header tagline.
- **Wordmark**: `assets/images/branding/techradar-wordmark.png` (colour, zonder payoff from Dropbox → same source family as kleur RGB); **`filter: brightness(0) invert(1)`** in `theme.css` for an all-white silhouette on navy.
- **Sofius**: visible **Part of** + small white SVG (`assets/images/branding/sofius-logo-white.svg`); link `aria-label` *Part of Sofius*. Hidden when `sofius_show` is off.
- **Copyright**: `wp_date('Y')` in PHP (`template-parts/footer.php`). Standalone uses `<span data-dynamic-year>` filled by `theme.js`.
- **`inc/header-nav.php`**: `techradar_theme_footer_nav_fallback()` mirrors primary links + Privacy when a privacy page exists.

## Plugin radar nav (inside `#techradar-root`)
- Quadrant navigation remains `.techradar-nav` in the built radar — separate from the WordPress site header.

## Page templates
| Template | File | Editor |
|---|---|---|
| Landing page | `page-templates/landing-page.php` | Gutenberg + Kadence Blocks; markup backup in `content/homepage.html` |
| Tech Radar | `page-templates/radar-page.php` | No editor — only `[techradar]` shortcode |
| Contact & PDF request | `page-templates/contact.php` | Gutenberg + CF7 shortcode |
| Customer use cases | `page-templates/use-cases.php` | Gutenberg + CPT archive |
| Privacy policy | `page-templates/privacy.php` | Gutenberg |

## Popup
Use **Popup Maker** (free WP plugin) for the bottom-right "Get a copy" popup. Configure the trigger and form inside Popup Maker's admin UI. Do not build a custom popup — Popup Maker handles accessibility, z-index, and mobile correctly out of the box.

## SEO
- Install **Rank Math** (free) — do not use Yoast.
- All page templates must use semantic HTML: `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<nav>` with meaningful `aria-label` attributes.
- The radar page: the SVG chart is `aria-hidden` from screen readers; the blip listing below it (static HTML) is the SEO-indexable content.
- Open Graph and Twitter Card meta tags are handled by Rank Math — no custom meta needed in templates.

## Cookie consent
Custom lightweight implementation in `template-parts/cookie-banner.php`:
- Consent stored in `localStorage` key `techradar_cookie_consent`
- Values: `accepted` | `declined`
- Analytics and any tracking scripts must check `localStorage.getItem('techradar_cookie_consent') === 'accepted'` before loading
- No third-party cookie plugin

## Custom post type: use_case
Registered in `inc/custom-post-types.php`. Fields: title, thumbnail (company logo), excerpt (short description), body (full case study), custom field `company_name`.

## Key files
| File | Responsibility |
|---|---|
| `style.css` | WP theme declaration header |
| `functions.php` | Requires all `inc/` files |
| `inc/header-nav.php` | Primary + footer menu fallbacks + radar/contact URL helpers |
| `assets/images/branding/techradar-wordmark.png` | Header wordmark |
| `assets/images/branding/partner-*.png` | Footer TAG partner marks (`@2x` from tech-radar repo) |
| `assets/images/branding/techradar-wordmark.png` | Footer wordmark source (colour); CSS makes it white |
| `assets/images/branding/sofius-logo-white.svg` | Sofius white wordmark |
| `assets/images/techradar-logo-mark.svg` | Optional circle mark / legacy |
| `header.php` | `<head>` + calls `template-parts/header.php` |
| `footer.php` | Calls `template-parts/footer.php` + `popup-pdf.php` + `wp_footer()` |
| `inc/setup.php` | Theme supports, nav menus |
| `inc/enqueue.php` | Front-end + block editor assets; `add_editor_style()` loads palette + theme + editor CSS in wp-admin |
| `assets/css/editor.css` | Editor-only tweaks (canvas padding, hero min-height); hp-* rules live in `theme.css` (also apply in `.editor-styles-wrapper`) |
| `assets/css/palette.css` | **Keep in sync** with `src/styles/variables.css` `:root` — no ad‑hoc hex in `theme.css` |
| `inc/custom-post-types.php` | `use_case` CPT |
| `inc/gdpr.php` | Hooks cookie banner into `wp_footer` |
| `inc/required-plugins.php` | Admin notice listing missing required plugins with Install/Activate links |
| `template-parts/header.php` | Sticky site header: logo + primary nav, hamburger ≤900px |
| `template-parts/footer.php` | Three-column footer: wordmark, nav, TAG + Sofius, legal |
| `template-parts/cookie-banner.php` | GDPR cookie consent UI |
| `content/homepage.html` | Gutenberg/Kadence block markup for the Landing Page — git source of truth; restore via WP Code editor. Re-clean after messy exports: `python3 scripts/refactor-homepage-html.py` (see README) |

## PHP requirements
- PHP 8.1+, no Composer dependencies
- All output escaped
- `get_template_part()` for all partials — no inline `include`

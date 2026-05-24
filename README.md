# Test Automation Tech Radar

WordPress plugin + theme for the [Test Automation Technology Radar](https://www.testautomationtechradar.com/), built by **TAG** (Test Automation Group) — deTesters, TestCoders & TechChamps, part of [Sofius](https://www.sofius.com).

This repository is the single source of truth for both the **radar content** (blip files) and the **WordPress plugin + theme** that powers the website.

---

## Requirements

- Node.js 18+
- PHP 8.1+
- A local WordPress install (e.g. [Local by Flywheel](https://localwp.com/))

---

## First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Link the plugin and theme into your local WP install
npm run setup
```

`npm run setup` is interactive — it will ask for the path to your local WordPress install and creates symlinks so changes to the source are immediately reflected in WP. You only need to run this once per machine.

After setup, activate the **Tech Radar** plugin and the **Test Automation Tech Radar** theme in your WP Admin.

---

## Daily development

### Option A — Preview without WordPress

The fastest way to see the radar. No WP install needed.

```bash
# Generate radar.json from blip content, then build assets
npm run radar:generate-json:prod
npm run build

# Start the preview server
npm run preview
```

The server starts on **http://localhost:3000** by default. If that port is already in use it automatically picks the next available one.

> **Note:** Do not open `standalone/index.html` directly via `file://` — browsers block `fetch()` on local files. Always use `npm run preview`.

### Option B — Live development inside WordPress

```bash
npm run local:dev
```

This runs two processes concurrently:
- Watches `radar/content/` and rebuilds `standalone/radar.json` on every blip change
- Watches `src/` for TypeScript/CSS changes, compiles to `wp-plugin-radar/assets/dist/` and `wp-theme/assets/dist/`, and starts a BrowserSync proxy that auto-reloads your local WP site

Set the `WP_URL` environment variable if your local site URL differs from the default:

```bash
WP_URL=http://techradar.local npm run local:dev
```

---

## Build for production

```bash
npm run build
```

Outputs minified assets to:
- `wp-plugin-radar/assets/dist/radar.js` + `radar.css` (compiled from `src/`)
- `wp-theme/assets/dist/theme.js` + `theme.css` (bundled from `wp-theme/assets/css/` + `wp-theme/assets/js/`)

These files are **not committed** — they are built by CI and deployed directly to the server.

---

## Type checking

```bash
npm run typecheck
```

Runs `tsc --noEmit` — checks all TypeScript source files without producing output.

---

## Project structure

```
radar/                    Blip content + JSON build
  content/
    techniques/           Testing techniques & methodologies
    tools/                Testing tools & utilities
    platforms/            Testing platforms & services
    languages-frameworks/ Programming languages & frameworks
  build.radar.json.js     Build script: HTML → radar.json
  radar.watch.js          Development watcher

src/                      TypeScript + CSS source (plugin)
  styles/                 CSS (variables, nav, radar SVG, panel, listing)
  types/radar.ts          All shared TypeScript types
  data-loader.ts          Fetches and normalises radar.json
  renderer.ts             SVG radar chart (plain JS, no D3)
  positioner.ts           Blip placement (seeded PRNG + collision avoidance)
  interaction.ts          State machine: FULL → FOCUSED → BLIP_DETAIL
  search.ts               Live search
  listing.ts              Blip list below radar
  index.ts                Entry point
  theme-entry.js          Entry point for theme CSS/JS bundle

wp-plugin-radar/          WordPress plugin — use [techradar] shortcode
  assets/dist/            Compiled output (built by CI, not committed)
  admin/                  WP Admin settings page (Settings → Tech Radar)
  includes/               Shortcode registration + asset enqueue

wp-theme/                 WordPress theme
  assets/dist/            Compiled output (built by CI, not committed)
  assets/css/             Source CSS (palette, theme, editor)
  assets/js/              Source JS
  page-templates/         Landing, Radar, Contact, Customer Cases, Privacy
  content/homepage.html   Homepage block markup (git source of truth)
  template-parts/         Header, Footer, Cookie banner, PDF popup
  inc/                    Setup, enqueue, CPT, GDPR helpers

standalone/               No-WP browser preview
  index.html              Loads theme CSS + plugin JS (relative paths to dist/)
  radar.json              Generated on the fly — not committed

scripts/
  setup-dev.js                  Interactive symlink setup (run once per machine)
  serve-standalone.js           Local HTTP server for standalone preview
  refactor-homepage-html.py     Strip Kadence inline styles; apply hp-* on homepage.html
```

---

## How radar.json is generated

The interactive radar is powered by a single `radar.json` file. It is never committed — it is always generated from the blip HTML files in `radar/content/`.

### The pipeline

```
radar/content/[quadrant]/*.html
        ↓  (build.radar.json.js)
standalone/radar.json
        ↓  (CI: FTP upload on merge to master)
https://testautomationtechradar.com/radar.json
        ↓  (WordPress plugin fetches live)
Interactive radar on the website
```

### How the build script works

`radar/build.radar.json.js` reads every `.html` file from the four quadrant directories, parses the YAML front matter, and writes a minified JSON array to `standalone/radar.json`.

Each blip becomes one object in the array:

```json
{
  "name": "Playwright",
  "ring": "Adopt",
  "quadrant": "languages-and-frameworks",
  "isNew": "FALSE",
  "status": "No Change",
  "description": "<h4>Description</h4><p>…</p>"
}
```

The WordPress plugin fetches this file at runtime — no server restart is needed after a content update.

### Generating radar.json manually

```bash
npm run radar:generate-json:prod
```

### Watching for changes during development

```bash
npm run radar:watch
```

This watches all files in `radar/content/` and rebuilds `standalone/radar.json` automatically whenever a blip file is added or changed. Run alongside `npm run dev` (or use `npm run local:dev` to start both together).

---

## Adding or editing a blip

Blip content lives in `radar/content/[quadrant]/[blip-name].html`. Each file uses YAML frontmatter + HTML:

```html
---
name: "Your Technology Name"
ring: "Adopt|Trial|Assess|Hold"
isNew: "TRUE|FALSE"
status: "New|Moved In|Moved Out|No Change"
---

<h4>Description</h4>
<p>Brief description of the technology and its purpose.</p>

<h4>Pros:</h4>
<ul>
  <li><strong>Advantage 1:</strong> Description</li>
</ul>

<h4>Cons:</h4>
<ul>
  <li><strong>Limitation 1:</strong> Description</li>
</ul>

<h4>Conclusion:</h4>
<p>Summary recommendation for teams.</p>
```

| Field | Values | Description |
|---|---|---|
| `name` | String | Display name of the technology |
| `ring` | `Adopt`, `Trial`, `Assess`, `Hold` | Recommendation level |
| `isNew` | `TRUE`, `FALSE` | Whether this is a new addition |
| `status` | `New`, `Moved In`, `Moved Out`, `No Change` | Movement since last radar |

Use kebab-case filenames: `page-object-model.html`, `ai-assistants.html`.

To add a blip via Claude Code, run `/add-blip` in the project.

---

## Deploying

Deployment is fully automated via GitHub Actions on every merge to `master`.

| What changed | What gets deployed |
|---|---|
| `radar/content/**` or `radar/build.radar.json.js` | `radar.json` → FTP to site root |
| `wp-theme/**` | Theme (built + minified) → FTP to `wp-content/themes/techradar/` |
| `src/**` or `wp-plugin-radar/**` | Plugin (built + minified) → FTP to `wp-content/plugins/techradar/` |

You can also trigger a manual deploy from the **Actions** tab in GitHub using the `Deploy to WordPress` workflow, with per-component force-deploy checkboxes.

Required GitHub secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_RADAR_PATH`, `FTP_THEME_PATH`, `FTP_PLUGIN_PATH`.

---

## Building pages in WordPress

Most marketing pages use **Gutenberg + Kadence Blocks** and CSS classes defined in `wp-theme/assets/css/theme.css`. Colours come from design tokens in `wp-theme/assets/css/palette.css` (kept in sync with `src/styles/variables.css`).

### Page templates

Create a page in **Pages → Add New**, then choose a template under **Page attributes → Template**:

| Template | Use for | Content |
|---|---|---|
| **Landing Page** | Homepage and similar long-form marketing pages | Full block editor (Kadence). Reference markup: `wp-theme/content/homepage.html` |
| **Tech Radar** | Interactive radar only | Leave the editor empty — template outputs `[techradar]` only |
| **Contact** | Contact page | Optional intro in editor; form + partner cards are in the template (CF7) |
| **Customer Cases** | Cases overview | Page title + optional lead text in editor; case cards come from the **Customer Cases** CPT |
| **Privacy** | Privacy policy | Standard block editor content |

**Customer case detail pages** are not a page template — add posts under **Customer Cases** in the admin menu (`customer_case` post type). URL pattern: `/customer-cases/{slug}/`.

### Editor workflow (important)

1. Prefer **Advanced → Additional CSS class(es)** on blocks for styling.
2. **Do not** use the block **Styles** panel for colours, typography, or spacing on class-based components — Kadence saves those as inline CSS and overrides the theme.
3. The block editor loads the same `hp-*` styles as the front end (see `wp-theme/assets/css/editor.css` and `inc/enqueue.php`), so you get a live preview while editing.
4. For large homepage changes, edit `wp-theme/content/homepage.html` in git and paste into **Pages → Homepage → ⋮ → Code editor**, or duplicate an existing section in the visual editor and swap classes/content.

### Cleaning up Kadence inline styles (re-runnable)

If the homepage picks up inline `style=""` or block **Styles** JSON again (common after visual editing), normalize it in git and re-paste into WordPress:

```bash
# Optional: paste Code editor export into wp-theme/content/homepage.html first
python3 scripts/refactor-homepage-html.py
```

The script **overwrites** `wp-theme/content/homepage.html`: removes inline styles, trims Kadence `style` objects where safe, and restores `hp-*` / `hp-section--*` classes.

### Section backgrounds (Kadence row)

Add **one** class on the **Row layout** block:

| Class | Background | Typical use |
|---|---|---|
| `hp-section--brand` | Brand blue (`--color-nav`) | Hero |
| `hp-section--page` | Page blue (`--color-page-bg`) | Why / Who / Team sections |
| `hp-section--panel` | Panel green (`--color-panel-bg`) | How it works / Customer case / CTA |

### Typography and components

| Class | Element | Purpose |
|---|---|---|
| `hp-eyebrow` | Heading (h5) | Blue uppercase label |
| `hp-display` | h1 | Hero headline (white, on brand section) |
| `hp-lead` | p | Hero intro paragraph |
| `hp-title` | h2 | Section title |
| `hp-card` | Group | White bordered card |
| `hp-btn` | Button | Primary CTA (`--color-accent`) |

More classes and layout helpers: `wp-theme/CLAUDE.md`.

### Plugin shortcodes

Requires the **Tech Radar** plugin. Use in a **Shortcode** block or Classic shortcode block.

| Shortcode | Example | Output |
|---|---|---|
| `[techradar]` | On **Tech Radar** template page only (auto) | Full interactive radar |
| `[techradar_blip_count]` | `Explore all [techradar_blip_count] blips →` | Current number of blips from `radar.json` |
| `[techradar_case_blips]` | See below | Card listing blips with quadrant colour + ring badge |

**Customer case blips card:**

```
[techradar_case_blips company="Port of Rotterdam" blips="Playwright, Storybook, Component Testing"]
```

---

## Made by

**TAG — Test Automation Group**
deTesters · TestCoders · TechChamps · part of [Sofius](https://www.sofius.com)

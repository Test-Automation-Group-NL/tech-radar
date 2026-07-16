# wp-plugin-radar/ — WordPress Plugin

## Entry point
`techradar.php` — plugin header, constants, requires, activation/deactivation hooks.

## Key files
| File | Responsibility |
|---|---|
| `techradar.php` | Plugin entry, `TECHRADAR_VERSION`, default settings, `techradar_get_settings()` |
| `includes/shortcode.php` | Registers `[techradar]` shortcode, enqueues assets, injects `window.TechRadarConfig` |
| `admin/settings-page.php` | WP Admin → Settings → Tech Radar (page registration) |
| `admin/settings-fields.php` | Field registration, sanitisation callback |
| `assets/dist/` | Compiled JS + CSS — committed to repo, built by CI on release |
| `assets/images/logos/` | TAG partner logos (deTesters, TestCoders, TechChamps) + Sofius |

## Settings (stored as `get_option('techradar_settings')`)
Injected as `window.TechRadarConfig` inline before `radar.js` loads.

| Key | Type | Default |
|---|---|---|
| `json_url` | URL | `{site_url}/radar.json` |
| `quadrant_{1-4}_title` | string | Techniques / Platforms / Tools / Languages & Frameworks |
| `quadrant_{1-4}_description` | string | Corner label descriptions |
| `ring_{adopt,trial,assess,hold}_label` | string | Adopt / Trial / Assess / Hold |
| `contact_url` | URL | `/contact` |
| `logo_radar` | attachment ID | 0 |
| `logos_partners` | JSON array | deTesters, TestCoders, TechChamps |
| `sofius_show` | bool | true |
| `sofius_url` | URL | https://www.sofius.com |

## WP Admin — "Add a Blip" page
There is a custom admin page (under the Tech Radar menu) titled "Add a Blip" that displays instructions for contributors. It explains that blip content is maintained in the separate tech-radar project at `/Users/wimselles/Git/techchamps/tech-radar/` and links to that repo. It does NOT scaffold files — it is purely informational.

## Shortcode
`[techradar]` — renders `<div id="techradar-root">`. No attributes needed; config comes from WP options via `window.TechRadarConfig`. Future per-instance overrides can be added as shortcode attributes.

### Narrow screens (≤ 900px wide)
The in-radar **quadrant tab strip is hidden** (no hamburger menu). Users cannot switch to a zoomed quadrant without choosing a blip first; navigation is via **blip taps**, **search**, **listing**, and **corner-label modals** for quadrant copy.

### Focused desktop panel behavior
When a quadrant is focused (via nav tab or listing “ZOOM IN”), the side panel first shows all blips in that quadrant grouped by ring. Selecting a blip from the chart or that panel list switches the panel to full blip detail. Closing returns to the full radar view.

## Asset loading
Assets are only enqueued on pages that contain the `[techradar]` shortcode (checked via `has_shortcode()`). Google Fonts (Plus Jakarta Sans) are loaded by both the plugin and the theme — WP deduplicates by handle.

## PHP requirements
- PHP 8.1+
- No Composer dependencies — WP core only
- All output escaped with `esc_html()`, `esc_url()`, `esc_attr()`, `wp_kses_post()`
- Nonces on all admin form submissions

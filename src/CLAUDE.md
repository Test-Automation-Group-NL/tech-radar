# src/ — TypeScript source

## Build
- Entry point: `src/index.ts` → bundles to `wp-plugin-radar/assets/dist/radar.js` + `radar.css`
- Build tool: esbuild (see root `esbuild.config.js`)
- `npm run dev` — watch mode + **sourcemaps** + BrowserSync (use this for development and debugging)
- `npm run build` — minified production output
- `npm run typecheck` — `tsc --noEmit` (no output, just type checking)

## TypeScript and debugging
All source code is TypeScript (`.ts` files in `src/`). esbuild compiles them to `radar.js`.
- **Development mode** (`npm run dev`) emits sourcemaps so DevTools shows the original `.ts` source
- **Production mode** (`npm run build`) minifies without sourcemaps
- To add new features, edit the `.ts` source files — never edit the compiled `dist/radar.js` directly

## Source files
| File | Responsibility |
|---|---|
| `types/radar.ts` | All shared TypeScript interfaces and types |
| `data-loader.ts` | `fetch()` radar.json → validate → normalise to typed model |
| `positioner.ts` | Assign x/y coords to blips (seeded PRNG + collision avoidance) |
| `renderer.ts` | Create SVG radar chart using `document.createElementNS` — no D3 |
| `interaction.ts` | State machine: FULL → FOCUSED → BLIP_DETAIL + cross-side animation |
| `search.ts` | Live search: dim non-matching blips, hide non-matching list items |
| `listing.ts` | Render blip list below radar; click → scroll + focus + detail |
| `index.ts` | Entry point: wires everything together, renders into `#techradar-root` |
| `styles/variables.css` | All CSS custom properties (colours, spacing, typography) |
| `styles/radar.css` | Radar SVG layout, ring/quadrant/blip styles, desktop layout overrides |
| `styles/panel.css` | Blip detail panel — desktop slide-in and mobile overlay |
| `styles/listing.css` | Blip listing below radar |

## State machine (interaction.ts)
```
FULL → FOCUSED(quadrant) → BLIP_DETAIL(blip)
```
Transitions are driven by `dispatch()`. All DOM updates happen in `applyState()` inside `index.ts`.

### Desktop behaviour
| Trigger | Transition | Visual |
|---|---|---|
| Click quadrant nav tab or listing "ZOOM IN" | FULL → FOCUSED | SVG zooms; panel slides in from the side and shows all blips in that quadrant (grouped by ring) |
| Left quadrants (techniques=top-left, platforms=bottom-left) | — | panel on left, SVG on right |
| Right quadrants (tools=top-right, languages-and-frameworks=bottom-right) | — | panel on right, SVG on left |
| Hover blip | — | Tooltip with blip name above dot; other quadrant sectors dim |
| Click blip (on chart or in focused panel list) | → BLIP_DETAIL | Panel shows name + ring + description; other blips dim |
| Blip marker shape | — | **No change** = solid circle; **New** = hollow ▲; **Moved in/out** = filled ▼ (same shapes in the legend below the chart). IDs stay in the listing and panel, not on the SVG dots |
| Click different blip | — | Panel updates in place |
| Click X or press ESC | any → FULL | Immediately returns to full radar (skips FOCUSED intermediate state) |
| Click "All quadrants" | any → FULL | Full radar restores with CSS transition |
| Click quadrant on **opposite side** while panel open | — | Chart animates back to FULL, then forward to new side (cross-side switch, ~300 ms gap) |

### Cross-side switch animation (interaction.ts)
When the panel is open and the user navigates to a quadrant on the **opposite side** (e.g. from `techniques` → `tools`), a `crossSwitchTimeout` fires:
1. `dispatch(FULL)` → triggers the reverse close animation
2. After 300 ms: `dispatch(FOCUSED/BLIP_DETAIL, newQuadrant)` → triggers the open animation on the new side

Same-side switches (techniques ↔ platforms, tools ↔ languages-and-frameworks) dispatch directly with no intermediate step.

### Narrow viewports (≤ 900px)
- The **quadrant nav bar** (All quadrants + tab strip) is **not shown** — there is no hamburger alternative. Quadrant zoom is only reachable via desktop-style flows; on narrow layouts you open detail by **tapping a blip** (full radar stays visible; panel overlays with slide animation).
- **Corner labels**: title always visible; tap → modal with full quadrant description + close.
- **Search** and **blip listing** remain available; listing opens blip detail without quadrant zoom on narrow (same as a direct blip tap).
- **Escape** closes the corner modal, then animates closed the blip panel if open.

## Quadrant positions on SVG
- Top-left: `techniques` (SVG angles 180°–270°)
- Top-right: `tools` (SVG angles 270°–360°)
- Bottom-right: `languages-and-frameworks` (SVG angles 0°–90°)
- Bottom-left: `platforms` (SVG angles 90°–180°)

## Config injection
`window.TechRadarConfig` is injected by the WP plugin before the script loads (see `wp-plugin-radar/CLAUDE.md`). The standalone preview sets it inline in `standalone/index.html`. All defaults live in `src/index.ts`.

## Viewport height sizing
The chart must always fit within the viewport without scrolling. This is handled by `syncViewportVars(root?)` in `index.ts`, called:
- Once early (before data fetch) — measures WP admin bar height only
- Again after `buildShell()` — measures chart-shell and legend positions
- On every `resize` event

### How it works
```
--radar-available-height = window.innerHeight
                         - .techradar-chart-shell document-top   (all headers above)
                         - .techradar-blip-legend height          (legend below chart)
```
All values are measured via `getBoundingClientRect()` — no hardcoded pixel values. The result is written as a concrete `px` value to `--radar-available-height` on `<html>` inline style.

### CSS custom properties set by JS
| Property | Element | Purpose |
|---|---|---|
| `--wpadminbar-height` | `<html>` | WP admin bar height; `0px` when not fixed (mobile or not logged in) |
| `--radar-available-height` | `<html>` | Computed available height for the chart-shell |

### CSS fallback
`variables.css` defines a CSS-only `--radar-available-height` fallback (`calc(100dvh - headers - padding)`) used before JS runs. JS overrides it with a concrete `px` value once the DOM is laid out.

## Desktop layout (≥ 901px)
- `.techradar-body`: `flex-wrap: nowrap; padding: 0; min-height: 0` — no padding so the chart-shell starts immediately below the page header
- `.techradar-chart-shell`: `flex: 0 0 100%` in FULL state; `flex: 0 0 66.67%` when panel open
- `.techradar-panel`: `flex: 0 0 33.33%` when open; `flex: 0 0 0%; height: 0` when hidden (prevents body overflow)
- Panel height uses `var(--radar-available-height)` — same as the chart — so body height = `availH` = viewport bottom exactly

## Panel layout (panel.css)
The panel is divided into three vertical regions (always in this order in the DOM):
1. **`panel__head`** — quadrant label + blip title + close button (flex-shrink: 0)
2. **`panel__meta`** — ring badge + "New" badge; shown only in BLIP_DETAIL state (flex-shrink: 0, border-bottom separates from scroll)
3. **`panel__scroll`** — scrollable description content (flex: 1, overflow-y: auto)
4. **`panel__back`** — "← Back to [Quadrant]" button, pinned at bottom (flex-shrink: 0, border-top)

The panel is always 1/3 of the body width on desktop (`flex: 0 0 33.33%`). Slide-in direction follows the quadrant side (left quadrants → panel on left, right → panel on right).

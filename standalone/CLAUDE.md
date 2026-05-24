# standalone/ — No-WP Preview

## Purpose
Open `standalone/index.html` in any browser to preview the radar without a WordPress install. Works from `file://` — no server required.

## How it works
- Loads compiled JS + CSS from `../wp-plugin-radar/assets/dist/` (relative path)
- Reads `./radar.json` as the data source
- Sets `window.TechRadarConfig` inline with the same defaults as the WP plugin
- All radar functionality is identical to the WP-embedded version

## radar.json
`standalone/radar.json` is a copy of the current production data from `/Users/wimselles/Git/techchamps/tech-radar/dist/radar.json`. Update it manually when testing with new blip data. It is committed to the repo as sample data.

## Usage during development
1. Run `npm run build` (or `npm run dev` and let it compile once)
2. Open `standalone/index.html` in a browser
3. No BrowserSync needed — just refresh manually after rebuilds

## Note
The standalone preview does not include the WP theme (no fixed nav, no footer, no cookie banner). It only renders the radar plugin output. This is intentional — it is a plugin preview tool, not a full site preview.

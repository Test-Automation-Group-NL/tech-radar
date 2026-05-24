/**
 * SVG radar renderer — plain TypeScript, no D3.
 *
 * Quadrant layout (SVG coordinate space, origin top-left, y-axis points down):
 *   top-left     = techniques               (180°–270°)
 *   top-right    = tools                    (270°–360°)
 *   bottom-right = languages-and-frameworks (0°–90°)
 *   bottom-left  = platforms                (90°–180°)
 */
import type { Blip, ChartDimensions, QuadrantId, RadarConfig, RingId } from './types/radar';

const SVG_NS = 'http://www.w3.org/2000/svg';

export const QUADRANT_ANGLES: Record<QuadrantId, { start: number; end: number }> = {
    'techniques':               { start: 180, end: 270 },
    'tools':                    { start: 270, end: 360 },
    'languages-and-frameworks': { start: 0,   end: 90  },
    'platforms':                { start: 90,  end: 180 },
};

export const RING_RADII: Record<RingId, { inner: number; outer: number }> = {
    adopt:  { inner: 0,    outer: 0.30 },
    trial:  { inner: 0.30, outer: 0.55 },
    assess: { inner: 0.55, outer: 0.75 },
    hold:   { inner: 0.75, outer: 1.00 },
};

// Per-quadrant, per-ring fill colors — matches original tech-radar _quadrants.scss ring-arc-0..3
// adopt (innermost) = base hue, each outer ring lightens progressively
// Ring fills: adopt (inner) = quadrant base → hold (outer) = PDF light-1 (palest arc)
const RING_COLORS: Record<QuadrantId, Record<RingId, string>> = {
    'techniques': {
        adopt: '#5b907e', trial: '#709e8e', assess: '#8db1a5', hold: '#ccdcd6',
    },
    'tools': {
        adopt: '#9e5b7b', trial: '#ab6f8c', assess: '#bd8ba3', hold: '#e3ccd7',
    },
    'languages-and-frameworks': {
        adopt: '#638ca3', trial: '#7699ae', assess: '#91abbd', hold: '#cdd8e2',
    },
    'platforms': {
        adopt: '#dc7f6a', trial: '#e1907a', assess: '#e8a794', hold: '#f6dace',
    },
};

function toRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

function annulusSectorPath(
    cx: number, cy: number,
    r1: number, r2: number,
    startDeg: number, endDeg: number
): string {
    const s  = toRad(startDeg);
    const e  = toRad(endDeg);
    const x1 = cx + r1 * Math.cos(s); const y1 = cy + r1 * Math.sin(s);
    const x2 = cx + r2 * Math.cos(s); const y2 = cy + r2 * Math.sin(s);
    const x3 = cx + r2 * Math.cos(e); const y3 = cy + r2 * Math.sin(e);
    const x4 = cx + r1 * Math.cos(e); const y4 = cy + r1 * Math.sin(e);
    return `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, String(v));
    }
    return el;
}

export function buildDimensions(containerWidth: number): ChartDimensions {
    const size = containerWidth;
    const cx   = size / 2;
    const cy   = size / 2;
    // Outer ring as close to the viewBox edge as blip placement allows (positioner floor ≈ 49).
    const outerRadius = Math.max(52, size / 2 - 5);
    return { size, cx, cy, outerRadius, ringRadii: RING_RADII };
}

export function createRadarSVG(
    dim: ChartDimensions,
    config: RadarConfig,
    blips: Blip[]
): SVGSVGElement {
    const { size, cx, cy, outerRadius } = dim;

    const svg = svgEl('svg', {
        viewBox: `0 0 ${size} ${size}`,
        class:   'techradar-svg',
        role:    'img',
        'aria-label': 'Technology Radar chart',
    });

    // ── Background ────────────────────────────────────────────────────────────
    svg.appendChild(svgEl('rect', { width: size, height: size, class: 'radar-bg' }));

    // ── Quadrant sectors — 4 ring-banded annulus sectors per quadrant ─────────
    const rings: RingId[] = ['adopt', 'trial', 'assess', 'hold'];

    for (const q of config.quadrants) {
        const { start, end } = QUADRANT_ANGLES[q.id];
        const colors = RING_COLORS[q.id];

        const group = svgEl('g', {
            class:          `radar-quadrant-group radar-quadrant-group--${q.id}`,
            'data-quadrant': q.id,
        });

        for (const ringId of rings) {
            const { inner, outer } = RING_RADII[ringId];
            const r1 = inner * outerRadius;
            const r2 = outer * outerRadius;
            // adopt starts at center (inner=0), so draw a full pie wedge
            const d = inner === 0
                ? arcPath(cx, cy, r2, start, end)
                : annulusSectorPath(cx, cy, r1, r2, start, end);
            group.appendChild(svgEl('path', {
                d,
                fill:          colors[ringId],
                class:         `radar-quadrant radar-quadrant--${q.id} radar-sector--${ringId}`,
                'data-quadrant': q.id,
                'data-ring':   ringId,
            }));
        }

        svg.appendChild(group);
    }

    // ── Ring separator circles ────────────────────────────────────────────────
    for (const ringId of rings) {
        const r = RING_RADII[ringId].outer * outerRadius;
        if (r >= outerRadius) continue;
        svg.appendChild(svgEl('circle', {
            cx, cy, r,
            class: `radar-ring-border radar-ring-border--${ringId}`,
            fill:  'none',
        }));
    }

    // ── Axis lines ────────────────────────────────────────────────────────────
    svg.appendChild(svgEl('line', { x1: cx - outerRadius, y1: cy, x2: cx + outerRadius, y2: cy, class: 'radar-axis' }));
    svg.appendChild(svgEl('line', { x1: cx, y1: cy - outerRadius, x2: cx, y2: cy + outerRadius, class: 'radar-axis' }));

    // ── Ring labels along the horizontal axis (both sides) ────────────────────
    // font-size in SVG user units — scales with the SVG when CSS-scaled to a
    // narrower container. Factor 0.044 keeps adjacent labels + info circles from
    // overlapping across the full size range (verified against ASSESS/HOLD gap).
    const labelFontSize = Math.max(7, Math.min(14, outerRadius * 0.044));
    const infoR = labelFontSize * 0.44;

    for (const ringConf of config.rings) {
        const { inner, outer } = RING_RADII[ringConf.id as RingId];
        const midRadius = ((inner + outer) / 2) * outerRadius;

        for (const xOffset of [midRadius, -midRadius]) {
            const side = xOffset > 0 ? 'east' : 'west';
            const lx   = cx + xOffset;

            const group = svgEl('g', {
                class:        `radar-ring-label radar-ring-label--${ringConf.id} radar-ring-label--${side}`,
                'data-ring':  ringConf.id,
                role:         'button',
                tabindex:     '0',
                'aria-label': `${ringConf.label}. Show ring guidance`,
            });

            // Factor 0.36 approximates Plus Jakarta Sans 700 uppercase + letter-spacing.
            const textHalfW = ringConf.label.length * labelFontSize * 0.36;
            // Shift text left so the text + info circle are visually centred on midRadius.
            const textCx = lx - infoR;

            const labelText = svgEl('text', {
                x:                   textCx,
                y:                   cy,
                'font-size':         labelFontSize,
                'text-anchor':       'middle',
                'dominant-baseline': 'central',
            });
            labelText.textContent = ringConf.label;
            group.appendChild(labelText);

            const ix = textCx + textHalfW + infoR + 2;

            const infoGroup = svgEl('g', { 'aria-hidden': 'true' });
            // Outer ring
            infoGroup.appendChild(svgEl('circle', {
                cx: ix, cy, r: infoR,
                fill: 'none', stroke: 'currentColor', 'stroke-width': '1.2',
            }));
            // "i" as SVG primitives: dot (top) + stem (bottom), with generous padding
            const dotR   = infoR * 0.14;
            const dotCy  = cy - infoR * 0.56;  // 30 % from inner top edge
            const stemW  = infoR * 0.20;
            const stemH  = infoR * 0.80;
            const stemY  = cy - infoR * 0.30;  // gap below dot, top of stem
            infoGroup.appendChild(svgEl('circle', {
                cx: ix, cy: dotCy, r: dotR, fill: 'currentColor',
            }));
            infoGroup.appendChild(svgEl('rect', {
                x: ix - stemW / 2, y: stemY, width: stemW, height: stemH,
                fill: 'currentColor',
            }));

            group.appendChild(infoGroup);
            svg.appendChild(group);
        }
    }

    // ── Blips ─────────────────────────────────────────────────────────────────
    for (const blip of blips) {
        svg.appendChild(createBlipElement(blip));
    }

    return svg;
}

/** Triangles slightly larger than r=5 circle to compensate for hollow vs filled visual weight. */
const BLIP_TRI_UP   = '0,-9 -9,8 9,8';
const BLIP_TRI_DOWN = '0,9 -9,-8 9,-8';

function createBlipElement(blip: Blip): SVGGElement {
    const marker: 'new' | 'moved' | 'default' = blip.isNew
        ? 'new'
        : blip.status === 'Moved In' || blip.status === 'Moved Out'
            ? 'moved'
            : 'default';

    const g = svgEl('g', {
        class:          `radar-blip radar-blip--${blip.ring} radar-blip--${blip.quadrant}`,
        'data-id':       blip.id,
        'data-quadrant': blip.quadrant,
        'data-ring':     blip.ring,
        'data-name':     blip.name,
        'data-marker':   marker,
        transform:      `translate(${blip.x}, ${blip.y})`,
        role:           'button',
        tabindex:       '0',
        'aria-label':   `${blip.id}. ${blip.name}`,
    });

    const r = 5;
    if (marker === 'new') {
        g.appendChild(svgEl('polygon', { points: BLIP_TRI_UP, class: 'radar-blip__tri radar-blip__tri--new' }));
    } else if (marker === 'moved') {
        g.appendChild(svgEl('polygon', { points: BLIP_TRI_DOWN, class: 'radar-blip__tri radar-blip__tri--moved' }));
    } else {
        g.appendChild(svgEl('circle', { r, class: 'radar-blip__circle radar-blip__circle--default' }));
    }

    return g;
}

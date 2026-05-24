/**
 * Assigns x/y coordinates to each blip using a seeded PRNG.
 * Same blip always lands in the same position (deterministic by name hash).
 * Includes collision avoidance and axis-clearance enforcement.
 */
import type { Blip, ChartDimensions, QuadrantId, RingId } from './types/radar';
import { QUADRANT_ANGLES, RING_RADII } from './renderer';

const BLIP_RADIUS = 5;       // circle radius — used for adopt ring floor (MIN_RADIUS)
const BLIP_VISUAL_MAX = 9;   // triangle bounding radius — collision, ring-border and axis margins
const MIN_DISTANCE = 26;     // sparser center-to-center spacing, well clear of shape edges
const MAX_ITERATIONS = 50;
// Axis clearance based on the largest shape (triangle) + half axis stroke-width (12) + buffer (6)
const AXIS_CLEAR = BLIP_VISUAL_MAX + 18; // 27 SVG units

// At r = AXIS_CLEAR*√2 the required dynamic margin is exactly 45° leaving 0° range.
// Add BLIP_RADIUS so the smallest-radius blips always have a usable angular range.
const MIN_RADIUS = Math.ceil(AXIS_CLEAR * Math.SQRT2) + BLIP_RADIUS; // ≈ 44 SVG units

/** Simple hash → deterministic float in [0,1) */
function seededRandom(seed: string, index: number): () => number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    h ^= index * 2654435761;
    return function () {
        h ^= h << 13; h ^= h >> 17; h ^= h << 5;
        return ((h >>> 0) / 4294967296);
    };
}

function toCartesian(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/**
 * Enforce that a blip sits at least AXIS_CLEAR units from both axis center lines.
 * Clamps each signed axis-offset directly without rescaling to original radius.
 */
function enforceAxisClearance(
    cx: number, cy: number,
    x: number, y: number,
    q: QuadrantId,
): { x: number; y: number } {
    const signX = (q === 'techniques' || q === 'platforms') ? -1 : 1;
    const signY = (q === 'techniques' || q === 'tools')     ? -1 : 1;

    let dx = (x - cx) * signX;
    let dy = (y - cy) * signY;

    if (dx < AXIS_CLEAR) dx = AXIS_CLEAR;
    if (dy < AXIS_CLEAR) dy = AXIS_CLEAR;

    return { x: cx + dx * signX, y: cy + dy * signY };
}

/**
 * After collision avoidance nudging, clamp the blip back into its ring's radial bounds.
 * Uses the ring's fractional boundaries so blips never visually cross a ring separator.
 */
function clampToRing(
    blip: Blip,
    cx: number, cy: number, outerRadius: number,
): { x: number; y: number } {
    const { inner, outer } = RING_RADII[blip.ring];
    const innerAbs = inner * outerRadius;
    const outerAbs = outer * outerRadius;

    const dx = blip.x - cx;
    const dy = blip.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r < 1) return { x: blip.x, y: blip.y };

    const clampedR = Math.max(innerAbs, Math.min(outerAbs, r));
    if (Math.abs(clampedR - r) < 0.5) return { x: blip.x, y: blip.y };

    const scale = clampedR / r;
    return { x: cx + dx * scale, y: cy + dy * scale };
}

export function positionBlips(blips: Blip[], dim: ChartDimensions): Blip[] {
    const { cx, cy, outerRadius } = dim;
    const positioned: Blip[] = [];

    for (const blip of blips) {
        const rng = seededRandom(blip.name, blip.id);

        // --- Radius ---
        // Adopt ring: start at MIN_RADIUS (axis-clearance constraint).
        // Other rings: add BLIP_RADIUS margin inside each ring border so the
        // blip circle doesn't visually overlap the ring separator line.
        const { inner, outer } = RING_RADII[blip.ring];
        const ringInnerAbs = inner === 0
            ? MIN_RADIUS
            : inner * outerRadius + BLIP_VISUAL_MAX;
        const ringOuterAbs = outer * outerRadius - BLIP_VISUAL_MAX;
        const r = ringInnerAbs + rng() * Math.max(0, ringOuterAbs - ringInnerAbs);

        // --- Angle with dynamic margin derived from actual radius ---
        // Angular gap needed so the blip stays >= AXIS_CLEAR from each axis.
        const dynamicMarginDeg = (180 / Math.PI) * Math.asin(Math.min(1, AXIS_CLEAR / r));
        const { start, end } = QUADRANT_ANGLES[blip.quadrant];
        const safeRange = (end - start) - dynamicMarginDeg * 2;
        const angle = start + dynamicMarginDeg + (safeRange > 0 ? rng() * safeRange : 0);

        let { x, y } = toCartesian(cx, cy, r, angle);
        ({ x, y } = enforceAxisClearance(cx, cy, x, y, blip.quadrant));
        positioned.push({ ...blip, angle, radius: r, x, y });
    }

    // Collision avoidance — restricted to within-quadrant pairs only
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        let moved = false;
        for (let i = 0; i < positioned.length; i++) {
            for (let j = i + 1; j < positioned.length; j++) {
                const a = positioned[i]!;
                const b = positioned[j]!;
                if (a.quadrant !== b.quadrant) continue;
                const ddx = b.x - a.x;
                const ddy = b.y - a.y;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                if (dist < MIN_DISTANCE && dist > 0) {
                    const nx = ddx / dist;
                    const ny = ddy / dist;
                    const push = (MIN_DISTANCE - dist) / 2;
                    positioned[i] = { ...a, x: a.x - nx * push, y: a.y - ny * push };
                    positioned[j] = { ...b, x: b.x + nx * push, y: b.y + ny * push };
                    moved = true;
                }
            }
        }
        if (!moved) break;
    }

    // Clamp each blip back into its ring's radial bounds after collision nudging
    for (let i = 0; i < positioned.length; i++) {
        const blip = positioned[i]!;
        const { x, y } = clampToRing(blip, cx, cy, outerRadius);
        if (x !== blip.x || y !== blip.y) {
            positioned[i] = { ...blip, x, y };
        }
    }

    // Final pass: re-enforce axis clearance after collision nudging
    for (let i = 0; i < positioned.length; i++) {
        const blip = positioned[i]!;
        const { x, y } = enforceAxisClearance(cx, cy, blip.x, blip.y, blip.quadrant);
        if (x !== blip.x || y !== blip.y) {
            positioned[i] = { ...blip, x, y };
        }
    }

    return positioned;
}

import type { Blip, QuadrantId, RadarConfig, RawBlip, RingId } from './types/radar';

const VALID_QUADRANTS: QuadrantId[] = ['techniques', 'platforms', 'tools', 'languages-and-frameworks'];
const VALID_RINGS: RingId[]         = ['adopt', 'trial', 'assess', 'hold'];

function normaliseQuadrant(raw: string): QuadrantId | null {
    const s = raw.toLowerCase().trim().replace(/\s+/g, '-');
    return VALID_QUADRANTS.includes(s as QuadrantId) ? (s as QuadrantId) : null;
}

function normaliseRing(raw: string): RingId | null {
    const s = raw.toLowerCase().trim();
    return VALID_RINGS.includes(s as RingId) ? (s as RingId) : null;
}

function normaliseIsNew(raw: boolean | 'TRUE' | 'FALSE'): boolean {
    if (typeof raw === 'boolean') return raw;
    return raw === 'TRUE';
}

function parseRawRadarItems(rawItems: unknown): Blip[] {
    if (!Array.isArray(rawItems)) {
        throw new Error('[TechRadar] radar.json must be an array');
    }

    let id = 1;
    const blips: Blip[] = [];

    for (const raw of rawItems) {
        if (!raw || typeof raw !== 'object') continue;
        const item = raw as RawBlip;
        const quadrant = normaliseQuadrant(item.quadrant);
        const ring     = normaliseRing(item.ring);

        if (!quadrant) {
            console.warn(`[TechRadar] Unknown quadrant "${item.quadrant}" for "${item.name}" — skipped`);
            continue;
        }
        if (!ring) {
            console.warn(`[TechRadar] Unknown ring "${item.ring}" for "${item.name}" — skipped`);
            continue;
        }

        blips.push({
            id:          id++,
            name:        item.name,
            ring,
            quadrant,
            isNew:       normaliseIsNew(item.isNew),
            status:      item.status,
            description: item.description,
            // Positioning filled in by positioner.ts
            angle:  0,
            radius: 0,
            x:      0,
            y:      0,
        });
    }

    return blips;
}

export async function loadRadarData(config: RadarConfig): Promise<Blip[]> {
    try {
        const res = await fetch(config.jsonUrl, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return parseRawRadarItems(await res.json());
    } catch (err) {
        console.error('[TechRadar] Failed to load radar data:', err);
        throw err;
    }
}

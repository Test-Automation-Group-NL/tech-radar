export type BlipStatus = 'New' | 'No Change' | 'Moved In' | 'Moved Out';

export type RingId = 'adopt' | 'trial' | 'assess' | 'hold';

export type QuadrantId =
    | 'techniques'
    | 'platforms'
    | 'tools'
    | 'languages-and-frameworks';

export interface RawBlip {
    name: string;
    ring: string;
    quadrant: string;
    isNew: boolean | 'TRUE' | 'FALSE';
    status: BlipStatus;
    description: string;
}

export interface Blip {
    id: number;
    name: string;
    ring: RingId;
    quadrant: QuadrantId;
    isNew: boolean;
    status: BlipStatus;
    description: string;
    /** Polar coords within the quadrant arc, assigned by positioner */
    angle: number;
    radius: number;
    /** Cartesian coords on the SVG, assigned by renderer */
    x: number;
    y: number;
}

export interface QuadrantConfig {
    id: QuadrantId;
    title: string;
    description: string;
}

export interface RingConfig {
    id: RingId;
    label: string;
}

export interface RadarConfig {
    jsonUrl: string;
    contactUrl: string;
    quadrants: QuadrantConfig[];
    rings: RingConfig[];
    /** Main H1 on the radar page */
    heroTitle: string;
    /** Label centered on the rule between legend and listing */
    allBlipsSectionLabel: string;
}

export type RadarState =
    | { type: 'FULL' }
    | { type: 'FOCUSED'; quadrant: QuadrantId }
    | { type: 'BLIP_DETAIL'; quadrant: QuadrantId; blip: Blip };

/** SVG chart dimensions */
export interface ChartDimensions {
    size: number;
    cx: number;
    cy: number;
    /** Outer radius of the Hold ring */
    outerRadius: number;
    /** Fractional inner radii for each ring band */
    ringRadii: Record<RingId, { inner: number; outer: number }>;
}

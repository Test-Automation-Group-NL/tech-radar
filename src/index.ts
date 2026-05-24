import './styles/variables.css';
import './styles/nav.css';
import './styles/radar.css';
import './styles/panel.css';
import './styles/listing.css';

import type { Blip, ChartDimensions, QuadrantId, RadarConfig, RadarState, RingId } from './types/radar';
import { loadRadarData } from './data-loader';
import { buildDimensions, createRadarSVG, RING_RADII, QUADRANT_ANGLES } from './renderer';
import { bindEvents, focusQuadrant, getState, isNarrowViewport, onStateChange, panelSide, requestCloseRadar, selectBlip } from './interaction';
import { initSearch } from './search';
import { renderListing } from './listing';
import { positionBlips } from './positioner';

declare global {
    interface Window {
        TechRadarConfig?: Partial<RadarConfig>;
    }
}

const DEFAULT_CONFIG: RadarConfig = {
    jsonUrl:    './radar.json',
    contactUrl: '#contact',
    heroTitle:            'Test Automation TechRadar',
    allBlipsSectionLabel: 'All blips',
    quadrants: [
        { id: 'techniques',               title: 'Techniques',             description: 'Testing methodologies and approaches used in modern test automation.' },
        { id: 'platforms',                title: 'Platforms',              description: 'Cloud services and infrastructure platforms supporting test automation.' },
        { id: 'tools',                    title: 'Tools',                  description: 'Software utilities and platforms that support test automation workflows.' },
        { id: 'languages-and-frameworks', title: 'Languages & Frameworks', description: 'Programming languages and test frameworks used to build automation solutions.' },
    ],
    rings: [
        { id: 'adopt',  label: 'Adopt' },
        { id: 'trial',  label: 'Trial' },
        { id: 'assess', label: 'Assess' },
        { id: 'hold',   label: 'Hold' },
    ],
};

function mergeConfig(override?: Partial<RadarConfig>): RadarConfig {
    if (!override) return DEFAULT_CONFIG;
    return {
        ...DEFAULT_CONFIG,
        ...override,
        quadrants: override.quadrants ?? DEFAULT_CONFIG.quadrants,
        rings:     override.rings     ?? DEFAULT_CONFIG.rings,
        heroTitle:            override.heroTitle ?? DEFAULT_CONFIG.heroTitle,
        allBlipsSectionLabel: override.allBlipsSectionLabel ?? DEFAULT_CONFIG.allBlipsSectionLabel,
    };
}

function syncViewportVars(root?: HTMLElement): void {
    // WP admin bar is position:fixed on desktop only; scrolls with page on mobile
    const bar = document.getElementById('wpadminbar');
    const adminBarH = (bar && window.getComputedStyle(bar).position === 'fixed')
        ? bar.getBoundingClientRect().height
        : 0;
    document.documentElement.style.setProperty('--wpadminbar-height', `${adminBarH}px`);

    if (!root) return;
    const shell  = root.querySelector<HTMLElement>('.techradar-chart-shell');
    const legend = root.querySelector<HTMLElement>('.techradar-blip-legend');
    if (!shell) return;

    // vh − shell document-top − legend height = space the chart can occupy.
    // All values are measured, no hardcoded numbers. Legend height is 0 when
    // the element isn't present (e.g. removed in a future config).
    const shellDocTop = shell.getBoundingClientRect().top + window.scrollY;
    const legendH     = legend ? legend.getBoundingClientRect().height : 0;
    const availH      = Math.max(200, window.innerHeight - shellDocTop - legendH);
    document.documentElement.style.setProperty('--radar-available-height', `${availH}px`);
}

async function init(): Promise<void> {
    syncViewportVars(); // admin bar only — root not available yet

    const root = document.getElementById('techradar-root');
    if (!root) return;

    // Loader lives as a sibling in .techradar-wrap (output by the PHP shortcode)
    const loader = root.parentElement?.querySelector<HTMLElement>('.techradar-loader') ?? null;

    const config = mergeConfig(window.TechRadarConfig);

    try {
        const rawBlips = await loadRadarData(config);

        // Suppress transitions so the initial size measurement doesn't animate
        root.classList.add('techradar-root--no-anim');
        root.innerHTML = buildShell(config);

        // Hide the loader before measuring: while visible it pushes the root below the
        // fold, making syncViewportVars compute --radar-available-height as the 200px
        // minimum (window.innerHeight − shellDocTop would be negative). All remaining
        // steps are synchronous so the browser won't repaint between hiding the loader
        // and revealing the root — no visible gap.
        loader?.setAttribute('hidden', '');
        syncViewportVars(root);

        const chartEl = root.querySelector<HTMLElement>('.techradar-chart')!;
        const dim     = buildDimensions(chartEl.clientWidth || 800);
        const blips   = positionBlips(rawBlips, dim);
        const svg     = createRadarSVG(dim, config, blips);
        chartEl.appendChild(svg);

        renderListing(root, blips, config);
        initSearch(root, blips);
        bindEvents(root, blips);

        onStateChange((state) => {
            applyState(root, state, blips, config, dim);
            updateUrlHash(state);
        });

        const initialHash = window.location.hash.slice(1);
        if (initialHash) {
            const targetBlip = blips.find((b) => slugifyBlipName(b.name) === initialHash);
            if (targetBlip) selectBlip(targetBlip.quadrant, targetBlip);
        }

        window.addEventListener('resize', () => {
            syncViewportVars(root);
            if (getState().type !== 'BLIP_DETAIL') return;
            setHtmlScrollLocked(window.innerWidth <= MOBILE_PANEL_MAX_PX);
        }, { passive: true });

        // Commit the layout, re-enable transitions, then fade in the radar
        void root.offsetHeight; // force reflow
        root.classList.remove('techradar-root--no-anim');
        root.classList.add('techradar-root--ready');

    } catch (err) {
        loader?.setAttribute('hidden', '');
        root.classList.remove('techradar-root--no-anim');
        root.innerHTML = `<div class="techradar-error">
            <p>Could not load radar data. Please try again later.</p>
        </div>`;
        void root.offsetHeight;
        root.classList.add('techradar-root--ready');
    }
}

/** Dot before title (west quadrants) vs after title (east quadrants) */
function cornerLabelDotPosition(id: string): 'lead' | 'trail' {
    return id === 'techniques' || id === 'platforms' ? 'lead' : 'trail';
}

function cornerLabelBlock(q: { id: string; title: string; description: string }): string {
    const pos = cornerLabelDotPosition(q.id);
    const heading =
        pos === 'lead'
            ? `<span class="radar-corner-label__heading radar-corner-label__heading--lead-dot">
            <span class="radar-corner-label__dot" aria-hidden="true"></span>
            <span class="radar-corner-label__title">${escHtml(q.title)}</span>
        </span>`
            : `<span class="radar-corner-label__heading radar-corner-label__heading--trail-dot">
            <span class="radar-corner-label__title">${escHtml(q.title)}</span>
            <span class="radar-corner-label__dot" aria-hidden="true"></span>
        </span>`;
    return `
        <div class="radar-corner-label radar-corner-label--${q.id}"
             data-quadrant="${q.id}"
             role="button" tabindex="0"
             aria-label="${escHtml(q.title)} quadrant">
            ${heading}
            <span class="radar-corner-label__desc">${escHtml(q.description)}</span>
        </div>`;
}

function buildShell(config: RadarConfig): string {
    const quadrant = (id: string) => config.quadrants.find((x) => x.id === id)!;

    const navTabs = [
        `<button type="button" class="techradar-nav__tab techradar-nav__tab--active" data-nav-quadrant="all">All quadrants</button>`,
        ...config.quadrants.map(
            (q) => `<button type="button" class="techradar-nav__tab" data-nav-quadrant="${q.id}">${escHtml(q.title)}</button>`,
        ),
    ].join('\n            ');

    const techniques            = quadrant('techniques');
    const tools                 = quadrant('tools');
    const platforms             = quadrant('platforms');
    const languagesAndFrameworks = quadrant('languages-and-frameworks');

    return `
        <nav class="techradar-nav" aria-label="Radar navigation">
            <div class="techradar-nav__inner">
                <div class="techradar-nav__drawer">
                    ${navTabs}
                </div>
            </div>
        </nav>

        <div class="techradar-main">
            <header class="techradar-page-header">
                <h1 class="techradar-page-header__title">${escHtml(config.heroTitle)}</h1>
            </header>

            <div class="techradar-body">
                <div class="techradar-focused-header" hidden>
                    <h2 class="techradar-focused-header__title"></h2>
                </div>
                <div class="techradar-chart-shell">
                    <div class="radar-labels-row radar-labels-row--top">
                        ${cornerLabelBlock(techniques)}
                        ${cornerLabelBlock(tools)}
                    </div>
                    <div class="techradar-chart-wrap">
                        <div class="techradar-chart" aria-hidden="false"></div>
                    </div>
                    <div class="radar-labels-row radar-labels-row--bottom">
                        ${cornerLabelBlock(platforms)}
                        ${cornerLabelBlock(languagesAndFrameworks)}
                    </div>
                </div>
                <div class="techradar-panel" aria-live="polite" hidden>
                    <div class="techradar-panel__layout">
                        <div class="techradar-panel__head">
                            <button type="button" class="techradar-panel__close" aria-label="Close detail">×</button>
                            <div class="techradar-panel__header" hidden>
                                <p class="techradar-panel__quadrant"></p>
                                <h2 class="techradar-panel__blip-heading"></h2>
                            </div>
                        </div>
                        <div class="techradar-panel__meta" hidden></div>
                        <div class="techradar-panel__scroll">
                            <div class="techradar-panel__content"></div>
                        </div>
                        <button type="button" class="techradar-panel__back" hidden></button>
                    </div>
                </div>
            </div>

            <div class="techradar-blip-legend" aria-label="Meaning of blip markers">
                <span class="techradar-blip-legend__item">
                    <svg class="techradar-blip-legend__icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <polygon points="16,7 25,25 7,25" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                    <span class="techradar-blip-legend__text">New</span>
                </span>
                <span class="techradar-blip-legend__item">
                    <svg class="techradar-blip-legend__icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <polygon points="16,25 25,7 7,7" fill="currentColor" fill-opacity="0.55" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                    <span class="techradar-blip-legend__text">Moved in/out</span>
                </span>
                <span class="techradar-blip-legend__item">
                    <svg class="techradar-blip-legend__icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <circle cx="16" cy="16" r="7" fill="currentColor"/>
                    </svg>
                    <span class="techradar-blip-legend__text">No change</span>
                </span>
            </div>

            <div class="techradar-section-rule">
                <span class="techradar-section-rule__line" aria-hidden="true"></span>
                <h2 id="techradar-all-blips-heading" class="techradar-section-rule__label">${escHtml(config.allBlipsSectionLabel)}</h2>
                <span class="techradar-section-rule__line" aria-hidden="true"></span>
            </div>

            <div id="techradar-ring-guide-modal" class="techradar-ring-guide__modal" role="dialog" aria-modal="true" aria-labelledby="techradar-ring-guide-title" hidden>
                <div class="techradar-ring-guide__content">
                    <button type="button" class="techradar-ring-guide__close" aria-label="Close ring guidance">×</button>
                    <h3 id="techradar-ring-guide-title" class="techradar-ring-guide__title">Ring guidance</h3>
                    <p class="techradar-ring-guide__item-copy"></p>
                </div>
            </div>

            <div class="techradar-search-bar">
                <input type="search" class="techradar-search__input" placeholder="Search blips…" aria-label="Search radar items">
            </div>

            <div class="techradar-listing" aria-labelledby="techradar-all-blips-heading"></div>
        </div>
    `;
}

/** Match CSS breakpoint for mobile overlay panel + scroll lock */
const MOBILE_PANEL_MAX_PX = 900;
const RING_ORDER: RingId[] = ['adopt', 'trial', 'assess', 'hold'];
/** Tracks which quadrant and side were last active so the close animation is the exact reverse. */
let activePanelSide: 'left' | 'right' | null = null;
let activeFocusedQuadrant: QuadrantId | null = null;
let closeAnimTimeout: ReturnType<typeof setTimeout> | undefined;

let _lockedScrollY = 0;
let _touchMoveHandler: ((e: TouchEvent) => void) | null = null;

function setHtmlScrollLocked(lock: boolean): void {
    if (lock) {
        // Cancel any in-flight iOS momentum scroll before locking.
        // scrollTo(currentX, currentY) is a no-op visually but tells WebKit
        // the scroll is "done", which stops rubber-band deceleration immediately.
        window.scrollTo(window.scrollX, window.scrollY);

        _lockedScrollY = window.scrollY;
        document.body.style.top = `-${_lockedScrollY}px`;
        document.documentElement.classList.add('techradar-html-lock');

        // CSS overflow:hidden alone cannot stop iOS's native touch-driven scroll.
        // A non-passive touchmove listener with preventDefault() is the only
        // reliable way to block rubber-band/momentum on WebKit.
        if (!_touchMoveHandler) {
            _touchMoveHandler = (e: TouchEvent) => {
                const target = e.target as Element | null;
                if (!target?.closest?.('.techradar-panel__scroll')) {
                    e.preventDefault();
                }
            };
            document.addEventListener('touchmove', _touchMoveHandler, { passive: false });
        }
    } else {
        document.body.style.top = '';
        document.documentElement.classList.remove('techradar-html-lock');
        window.scrollTo(0, _lockedScrollY);
        _lockedScrollY = 0;

        if (_touchMoveHandler) {
            document.removeEventListener('touchmove', _touchMoveHandler);
            _touchMoveHandler = null;
        }
    }
}

function applyState(
    root: HTMLElement,
    state: RadarState,
    blips: ReturnType<typeof positionBlips>,
    config: RadarConfig,
    dim: ChartDimensions,
): void {
    const body           = root.querySelector<HTMLElement>('.techradar-body')!;
    const panel          = root.querySelector<HTMLElement>('.techradar-panel')!;
    const panelMeta      = root.querySelector<HTMLElement>('.techradar-panel__meta')!;
    const content        = root.querySelector<HTMLElement>('.techradar-panel__content')!;
    const backBtn        = root.querySelector<HTMLButtonElement>('.techradar-panel__back')!;
    const panelHeader    = root.querySelector<HTMLElement>('.techradar-panel__header')!;
    const panelQuadrant  = root.querySelector<HTMLElement>('.techradar-panel__quadrant')!;
    const panelBlipTitle = root.querySelector<HTMLElement>('.techradar-panel__blip-heading')!;
    const focusedHdr     = root.querySelector<HTMLElement>('.techradar-focused-header')!;
    const svg            = root.querySelector<SVGSVGElement>('.techradar-svg')!;
    const allBlips = root.querySelectorAll<SVGGElement>('.radar-blip');
    const allTabs  = root.querySelectorAll<HTMLElement>('[data-nav-quadrant]');

    // Full viewBox is always used — no SVG zoom/crop in any state
    svg.setAttribute('viewBox', `0 0 ${dim.size} ${dim.size}`);

    // Cancel any in-flight close animation
    if (closeAnimTimeout !== undefined) {
        clearTimeout(closeAnimTimeout);
        closeAnimTimeout = undefined;
    }

    // Remove all state classes first
    body.className = 'techradar-body';

    if (state.type === 'FULL') {
        setHtmlScrollLocked(false);
        panel.classList.remove('techradar-panel--closing');
        panel.setAttribute('hidden', '');
        panelHeader.setAttribute('hidden', '');
        panelMeta.setAttribute('hidden', '');
        focusedHdr.setAttribute('hidden', '');
        backBtn.setAttribute('hidden', '');
        allBlips.forEach((el) => {
            el.classList.remove('radar-blip--dimmed', 'radar-blip--selected');
        });
        allTabs.forEach((t) => t.classList.toggle('techradar-nav__tab--active', t.dataset['navQuadrant'] === 'all'));

        // Restore the full set of focused body classes for the duration of the close
        // animation so the layout and SVG state are the exact reverse of the open.
        // --closing overrides the chart-shell back to 100% while --focused/-quadrant
        // keep the SVG dimming and panel order intact.
        const closingSide     = !isNarrowViewport() ? activePanelSide : null;
        const closingQuadrant = !isNarrowViewport() ? activeFocusedQuadrant : null;
        if (closingSide && closingQuadrant) {
            body.classList.add(
                'techradar-body--focused',
                `techradar-body--focused-${closingQuadrant}`,
                `techradar-body--panel-${closingSide}`,
                'techradar-body--closing',
            );
            closeAnimTimeout = setTimeout(() => {
                body.classList.remove(
                    'techradar-body--focused',
                    `techradar-body--focused-${closingQuadrant}`,
                    `techradar-body--panel-${closingSide}`,
                    'techradar-body--closing',
                );
                activePanelSide = null;
                activeFocusedQuadrant = null;
                closeAnimTimeout = undefined;
            }, 480);
        }

    } else if (state.type === 'FOCUSED') {
        setHtmlScrollLocked(false);
        const side = panelSide(state.quadrant);
        activePanelSide = side;
        activeFocusedQuadrant = state.quadrant;
        body.classList.add(`techradar-body--focused`, `techradar-body--focused-${state.quadrant}`, `techradar-body--panel-${side}`);
        panel.classList.remove('techradar-panel--closing');
        panel.removeAttribute('hidden');
        focusedHdr.setAttribute('hidden', '');
        panelMeta.setAttribute('hidden', '');
        backBtn.setAttribute('hidden', '');

        // Show the quadrant name as the panel heading
        const quadrantConfig = config.quadrants.find((q) => q.id === state.quadrant);
        panelQuadrant.textContent  = 'Quadrant';
        panelBlipTitle.textContent = quadrantConfig?.title ?? state.quadrant;
        panelHeader.removeAttribute('hidden');

        renderFocusedQuadrantBlipList(content, state.quadrant, blips, config);

        allBlips.forEach((el) => {
            const isThisQuadrant = el.dataset['quadrant'] === state.quadrant;
            el.classList.toggle('radar-blip--dimmed', !isThisQuadrant);
            el.classList.remove('radar-blip--selected');
        });
        allTabs.forEach((t) => t.classList.toggle('techradar-nav__tab--active', t.dataset['navQuadrant'] === state.quadrant));

    } else if (state.type === 'BLIP_DETAIL') {
        // Lock scroll on mobile BEFORE the panel becomes visible so the page cannot
        // snap/jump during the slide-in animation on iOS Safari.
        setHtmlScrollLocked(isNarrowViewport());

        // Desktop: side-by-side layout + dimming. Mobile: panel is full-screen overlay.
        if (!isNarrowViewport()) {
            const side = panelSide(state.quadrant);
            activePanelSide = side;
            activeFocusedQuadrant = state.quadrant;
            body.classList.add(`techradar-body--focused`, `techradar-body--focused-${state.quadrant}`, `techradar-body--panel-${side}`);
        }
        panel.classList.remove('techradar-panel--closing');
        panel.removeAttribute('hidden');
        focusedHdr.setAttribute('hidden', '');

        const quadrantConfig = config.quadrants.find((q) => q.id === state.quadrant);
        const quadrantTitle = quadrantConfig?.title ?? state.quadrant;

        panelHeader.removeAttribute('hidden');
        panelQuadrant.textContent  = quadrantTitle;
        panelBlipTitle.textContent = `${state.blip.id}. ${state.blip.name}`;

        panelMeta.innerHTML = `
            <span class="techradar-panel__ring techradar-panel__ring--${state.blip.ring}">${escHtml(state.blip.ring)}</span>
            ${state.blip.isNew ? '<span class="techradar-panel__badge">New</span>' : ''}
        `;
        panelMeta.removeAttribute('hidden');
        content.innerHTML = `<div class="techradar-panel__description">${state.blip.description}</div>`;

        const quadrant = state.quadrant;
        backBtn.textContent = `← Back to ${quadrantTitle}`;
        backBtn.onclick = () => {
            if (isNarrowViewport()) {
                requestCloseRadar(root);
            } else {
                focusQuadrant(quadrant);
            }
        };
        backBtn.removeAttribute('hidden');

        allBlips.forEach((el) => {
            const id = Number(el.dataset['id']);
            el.classList.toggle('radar-blip--dimmed', el.dataset['quadrant'] !== state.quadrant);
            el.classList.toggle('radar-blip--selected', id === state.blip.id);
        });
        allTabs.forEach((t) => t.classList.toggle('techradar-nav__tab--active', t.dataset['navQuadrant'] === state.quadrant));
    }
}

function renderFocusedQuadrantBlipList(
    content: HTMLElement,
    quadrant: QuadrantId,
    blips: Blip[],
    config: RadarConfig,
): void {
    const quadrantBlips = blips.filter((b) => b.quadrant === quadrant);
    if (quadrantBlips.length === 0) {
        content.innerHTML = '<p class="techradar-panel__empty">No blips available in this quadrant.</p>';
        return;
    }

    let html = '<div class="techradar-panel__list">';
    for (const ringId of RING_ORDER) {
        const ringBlips = quadrantBlips
            .filter((b) => b.ring === ringId)
            .sort((a, b) => a.name.localeCompare(b.name));
        if (ringBlips.length === 0) continue;

        const ringLabel = config.rings.find((r) => r.id === ringId)?.label ?? ringId;
        html += `
            <section class="techradar-panel__list-ring">
                <h3 class="techradar-panel__list-ring-title techradar-panel__list-ring-title--${ringId}">${escHtml(ringLabel)}</h3>
                <ul class="techradar-panel__list-items">
                    ${ringBlips.map((blip) => `
                        <li class="techradar-panel__list-item">
                            <button
                                type="button"
                                class="techradar-panel__list-btn"
                                data-blip-id="${blip.id}"
                                aria-label="Open details for ${escAttr(blip.name)}">
                                ${blip.id}. ${escHtml(blip.name)}
                                ${blip.isNew ? '<span class="techradar-panel__list-badge">New</span>' : ''}
                            </button>
                        </li>
                    `).join('')}
                </ul>
            </section>
        `;
    }
    html += '</div>';
    content.innerHTML = html;

    content.querySelectorAll<HTMLButtonElement>('.techradar-panel__list-btn').forEach((btn) => {
        const blipId = Number(btn.dataset['blipId']);
        const blipEl = document.querySelector<SVGGElement>(`.radar-blip[data-id="${blipId}"]`);

        const emphasize = (): void => {
            blipEl?.classList.add('radar-blip--panel-hover');
            showBlipTooltip(blipEl);
        };
        const clearEmphasis = (): void => {
            blipEl?.classList.remove('radar-blip--panel-hover');
            removeBlipTooltip();
        };

        btn.addEventListener('mouseenter', emphasize);
        btn.addEventListener('mouseleave', clearEmphasis);
        btn.addEventListener('focus', emphasize);
        btn.addEventListener('blur', clearEmphasis);

        btn.addEventListener('click', () => {
            const blip = quadrantBlips.find((b) => b.id === blipId);
            if (!blip) return;
            removeBlipTooltip();
            selectBlip(quadrant, blip);
        });
    });
}

function showBlipTooltip(blipEl: SVGGElement | null): void {
    if (!blipEl) return;
    const name = blipEl.dataset['name'];
    if (!name) return;

    removeBlipTooltip();
    const tip = document.createElement('div');
    tip.id = 'radar-blip-tooltip';
    tip.className = 'radar-blip-tooltip';
    tip.textContent = name;
    tip.style.position = 'fixed';
    tip.style.pointerEvents = 'none';
    document.body.appendChild(tip);

    const rect = blipEl.getBoundingClientRect();
    tip.style.left = `${rect.left + rect.width / 2}px`;
    tip.style.top = `${rect.top}px`;
    tip.style.transform = 'translateX(-50%) translateY(calc(-100% - 6px))';
}

function removeBlipTooltip(): void {
    document.getElementById('radar-blip-tooltip')?.remove();
}

function slugifyBlipName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function updateUrlHash(state: RadarState): void {
    if (state.type === 'BLIP_DETAIL') {
        history.replaceState(null, '', `#${slugifyBlipName(state.blip.name)}`);
    } else if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
}

function escHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escAttr(str: string): string {
    return escHtml(str).replace(/'/g, '&#39;');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

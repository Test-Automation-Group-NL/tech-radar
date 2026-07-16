/**
 * Interaction state machine for the radar.
 *
 * States:
 *   FULL          — complete radar, all blips visible
 *   FOCUSED       — one quadrant zoomed; detail panel visible (empty)
 *   BLIP_DETAIL   — focused + one blip's info shown in the panel
 */
import type { Blip, QuadrantId, RadarState, RingId } from './types/radar';

type StateChangeHandler = (state: RadarState) => void;

let currentState: RadarState = { type: 'FULL' };
const listeners: StateChangeHandler[] = [];

export function getState(): RadarState {
    return currentState;
}

export function onStateChange(handler: StateChangeHandler): void {
    listeners.push(handler);
}

function dispatch(next: RadarState): void {
    currentState = next;
    listeners.forEach((fn) => fn(next));
}

let crossSwitchTimeout: ReturnType<typeof setTimeout> | undefined;
let quadrantHoverClearTimer: ReturnType<typeof setTimeout> | null = null;

function setQuadrantHover(body: HTMLElement | null, quadrant: QuadrantId): void {
    if (quadrantHoverClearTimer !== null) {
        clearTimeout(quadrantHoverClearTimer);
        quadrantHoverClearTimer = null;
    }
    if (body) body.dataset['blipHover'] = quadrant;
}

function clearQuadrantHoverDeferred(body: HTMLElement | null): void {
    quadrantHoverClearTimer = setTimeout(() => {
        if (body) delete body.dataset['blipHover'];
        quadrantHoverClearTimer = null;
    }, 50);
}

function currentPanelSide(): 'left' | 'right' | null {
    const state = getState();
    if (state.type === 'FULL') return null;
    return panelSide(state.quadrant);
}

export function focusQuadrant(quadrant: QuadrantId): void {
    if (!isNarrowViewport()) {
        const from = currentPanelSide();
        const to   = panelSide(quadrant);
        if (from !== null && from !== to) {
            if (crossSwitchTimeout !== undefined) {
                clearTimeout(crossSwitchTimeout);
                crossSwitchTimeout = undefined;
            }
            dispatch({ type: 'FULL' });
            crossSwitchTimeout = setTimeout(() => {
                crossSwitchTimeout = undefined;
                dispatch({ type: 'FOCUSED', quadrant });
            }, 300);
            return;
        }
    }
    dispatch({ type: 'FOCUSED', quadrant });
}

export function selectBlip(quadrant: QuadrantId, blip: Blip): void {
    const state = getState();
    if (state.type === 'BLIP_DETAIL' && state.blip.id === blip.id) return;
    if (!isNarrowViewport()) {
        const from = currentPanelSide();
        const to   = panelSide(quadrant);
        if (from !== null && from !== to) {
            if (crossSwitchTimeout !== undefined) {
                clearTimeout(crossSwitchTimeout);
                crossSwitchTimeout = undefined;
            }
            dispatch({ type: 'FULL' });
            crossSwitchTimeout = setTimeout(() => {
                crossSwitchTimeout = undefined;
                dispatch({ type: 'BLIP_DETAIL', quadrant, blip });
            }, 300);
            return;
        }
    }
    dispatch({ type: 'BLIP_DETAIL', quadrant, blip });
}

export function closeQuadrant(): void {
    if (crossSwitchTimeout !== undefined) {
        clearTimeout(crossSwitchTimeout);
        crossSwitchTimeout = undefined;
    }
    dispatch({ type: 'FULL' });
}

let panelCloseFallback: ReturnType<typeof setTimeout> | undefined;

/**
 * Close the panel one step at a time:
 *   desktop BLIP_DETAIL → FOCUSED (back to quadrant list)
 *   desktop FOCUSED     → FULL
 *   narrow              → animate panel out then FULL
 */
export function requestCloseRadar(root: HTMLElement): void {
    if (!isNarrowViewport()) {
        const state = getState();
        if (state.type === 'BLIP_DETAIL') {
            focusQuadrant(state.quadrant);
        } else {
            closeQuadrant();
        }
        return;
    }
    if (getState().type === 'FULL') return;

    const panel = root.querySelector<HTMLElement>('.techradar-panel');
    if (!panel || panel.hasAttribute('hidden')) {
        closeQuadrant();
        return;
    }
    if (panel.classList.contains('techradar-panel--closing')) return;

    panel.classList.add('techradar-panel--closing');

    const onAnimEnd = (e: AnimationEvent): void => {
        if (e.animationName !== 'panel-mobile-out') return;
        finish();
    };

    const finish = (): void => {
        if (panelCloseFallback !== undefined) {
            clearTimeout(panelCloseFallback);
            panelCloseFallback = undefined;
        }
        panel.removeEventListener('animationend', onAnimEnd);
        /* Re-opened while closing: applyState strips --closing; do not dispatch FULL */
        if (!panel.classList.contains('techradar-panel--closing')) return;
        panel.classList.remove('techradar-panel--closing');
        closeQuadrant();
    };

    panel.addEventListener('animationend', onAnimEnd);
    panelCloseFallback = setTimeout(() => {
        panel.removeEventListener('animationend', onAnimEnd);
        finish();
    }, 450);
}

/** Always returns to FULL — skips FOCUSED intermediate state */
export function stepBack(): void {
    closeQuadrant();
}

/**
 * Determines which side the detail panel slides in from.
 * Left quadrants (techniques=top-left, platforms=bottom-left) → panel on left.
 * Right quadrants (tools=top-right, languages-and-frameworks=bottom-right) → panel on right.
 */
export function panelSide(quadrant: QuadrantId): 'left' | 'right' {
    return quadrant === 'techniques' || quadrant === 'platforms'
        ? 'left'
        : 'right';
}

/** Breakpoint: compact radar layout, no quadrant nav bar, corner modals, no hover tooltips */
export const NARROW_MAX_PX = 900;

export function isNarrowViewport(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= NARROW_MAX_PX;
}

/** Wire up all DOM event listeners — called once after initial render */
export function bindEvents(
    root: HTMLElement,
    blips: Blip[],
): void {
    const body = root.querySelector<HTMLElement>('.techradar-body');
    const ringGuideModal = root.querySelector<HTMLElement>('.techradar-ring-guide__modal');
    const ringGuideTitle = root.querySelector<HTMLElement>('.techradar-ring-guide__title');
    const ringGuideCopy = root.querySelector<HTMLElement>('.techradar-ring-guide__item-copy');
    let ringGuideOpener: (HTMLElement | SVGElement) | null = null;

    const ringGuidance: Record<RingId, { title: string; copy: string }> = {
        adopt: {
            title: 'Adopt',
            copy: 'Proven technologies that we recommend for immediate use wherever they meet project requirements.',
        },
        trial: {
            title: 'Trial',
            copy: 'Emerging technologies worth exploring in projects that allow for experimentation and manageable risks.',
        },
        assess: {
            title: 'Assess',
            copy: 'Promising technologies to monitor and evaluate for future potential. Too early for widespread adoption.',
        },
        hold: {
            title: 'Hold',
            copy: 'Technologies we suggest avoiding for new projects. Continue using them only if they are already in place.',
        },
    };

    const openRingGuide = (ring: RingId, opener?: HTMLElement | SVGElement): void => {
        if (!ringGuideModal || !ringGuideTitle || !ringGuideCopy) return;
        const guidance = ringGuidance[ring];
        if (!guidance) return;
        ringGuideTitle.textContent = `${guidance.title} ring`;
        ringGuideCopy.textContent = guidance.copy;
        ringGuideModal.removeAttribute('hidden');
        ringGuideOpener = opener ?? null;
        ringGuideModal.querySelector<HTMLElement>('.techradar-ring-guide__close')?.focus();
    };

    const closeRingGuide = (): void => {
        if (!ringGuideModal || ringGuideModal.hasAttribute('hidden')) return;
        ringGuideModal.setAttribute('hidden', '');
        ringGuideOpener?.focus();
        ringGuideOpener = null;
    };

    root.querySelectorAll<SVGGElement>('.radar-ring-label').forEach((labelEl) => {
        const ring = labelEl.dataset['ring'] as RingId | undefined;
        if (!ring) return;

        const activate = (): void => openRingGuide(ring, labelEl);
        labelEl.addEventListener('click', activate);
        labelEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });

    root.querySelector<HTMLElement>('.techradar-ring-guide__close')
        ?.addEventListener('click', closeRingGuide);

    ringGuideModal?.addEventListener('click', (e) => {
        if (e.target === ringGuideModal) closeRingGuide();
    });

    // Quadrant nav tabs (hidden on narrow viewports — see nav.css)
    root.querySelectorAll<HTMLElement>('[data-nav-quadrant]').forEach((tab) => {
        tab.addEventListener('click', () => {
            const q = tab.dataset['navQuadrant'] as QuadrantId | 'all';
            if (q === 'all') closeQuadrant();
            else focusQuadrant(q);
        });
    });

    // Quadrant sectors are not clickable — only blips open the detail panel on narrow; desktop nav / listing still zoom.

    // Desktop hover: hovering anywhere over a quadrant dims the other three.
    // Blips sit outside the quadrant-group <g> in the SVG, so both the group and the
    // blip mouseenter/mouseleave call the same debounced helpers to avoid a flash when
    // the pointer moves between the sector fill and a blip in the same quadrant.
    root.querySelectorAll<SVGGElement>('.radar-quadrant-group').forEach((el) => {
        const quadrant = el.dataset['quadrant'] as QuadrantId;
        el.addEventListener('mouseenter', () => {
            if (isNarrowViewport()) return;
            setQuadrantHover(body, quadrant);
        });
        el.addEventListener('mouseleave', () => {
            clearQuadrantHoverDeferred(body);
        });
    });

    // SVG blip clicks
    root.querySelectorAll<SVGGElement>('.radar-blip').forEach((el) => {
        const id   = Number(el.dataset['id']);
        const blip = blips.find((b) => b.id === id);
        if (!blip) return;

        el.addEventListener('mousedown', (e) => { e.preventDefault(); });

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            selectBlip(blip.quadrant, blip);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
        });

        // Desktop hover: tooltip above blip; also maintain quadrant dimming while on a blip.
        el.addEventListener('mouseenter', () => {
            if (isNarrowViewport()) return;

            setQuadrantHover(body, blip.quadrant);

            // Tooltip
            const existing = document.getElementById('radar-blip-tooltip');
            existing?.remove();

            const tip = document.createElement('div');
            tip.id        = 'radar-blip-tooltip';
            tip.className = 'radar-blip-tooltip';
            tip.textContent = blip.name;
            tip.style.position  = 'fixed';
            tip.style.pointerEvents = 'none';
            document.body.appendChild(tip);

            const rect = el.getBoundingClientRect();
            tip.style.left      = `${rect.left + rect.width / 2}px`;
            tip.style.top       = `${rect.top}px`;
            tip.style.transform = 'translateX(-50%) translateY(calc(-100% - 6px))';
        });

        el.addEventListener('mouseleave', () => {
            clearQuadrantHoverDeferred(body);
            document.getElementById('radar-blip-tooltip')?.remove();
        });
    });

    root.querySelector<HTMLElement>('.techradar-panel__close')
        ?.addEventListener('click', () => requestCloseRadar(root));

    // Corner labels: narrow = info modal; desktop = focus/unfocus quadrant (toggles)
    root.querySelectorAll<HTMLElement>('.radar-corner-label').forEach((el) => {
        const handleActivate = () => {
            const quadrant = el.dataset['quadrant'] as QuadrantId;
            if (isNarrowViewport()) {
                openCornerModal(root, quadrant);
                return;
            }
            const state = getState();
            const alreadyFocused =
                (state.type === 'FOCUSED' || state.type === 'BLIP_DETAIL') &&
                state.quadrant === quadrant;
            if (alreadyFocused) {
                closeQuadrant();
            } else {
                focusQuadrant(quadrant);
            }
        };

        el.addEventListener('click', handleActivate);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleActivate();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (ringGuideModal && !ringGuideModal.hasAttribute('hidden')) {
            closeRingGuide();
            e.preventDefault();
            return;
        }
        if (root.querySelector('.radar-corner-modal')) {
            root.querySelector('.radar-corner-modal')?.remove();
            e.preventDefault();
            return;
        }
        requestCloseRadar(root);
    });
}

function openCornerModal(root: HTMLElement, quadrant: QuadrantId): void {
    const existing = root.querySelector('.radar-corner-modal');
    existing?.remove();

    const labelEl = root.querySelector<HTMLElement>(`.radar-corner-label--${quadrant}`);
    const title   = labelEl?.querySelector('.radar-corner-label__title')?.textContent ?? '';
    const desc    = labelEl?.querySelector('.radar-corner-label__desc')?.textContent  ?? '';

    const modal = document.createElement('div');
    modal.className = 'radar-corner-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', title);

    const content = document.createElement('div');
    content.className = 'radar-corner-modal__content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'radar-corner-modal__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => modal.remove());

    const h3 = document.createElement('h3');
    h3.className   = 'radar-corner-modal__title';
    h3.textContent = title;

    const p = document.createElement('p');
    p.className   = 'radar-corner-modal__desc';
    p.textContent = desc;

    content.appendChild(closeBtn);
    content.appendChild(h3);
    content.appendChild(p);
    modal.appendChild(content);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    root.appendChild(modal);
    closeBtn.focus();
}

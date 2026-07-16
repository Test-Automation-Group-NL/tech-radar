import type { Blip, QuadrantId, RadarConfig, RingId } from './types/radar';
import { focusQuadrant, isNarrowViewport, selectBlip } from './interaction';

const RING_ORDER: RingId[] = ['adopt', 'trial', 'assess', 'hold'];

export function renderListing(root: HTMLElement, blips: Blip[], config: RadarConfig): void {
    const container = root.querySelector<HTMLElement>('.techradar-listing');
    if (!container) return;

    container.innerHTML = '';

    for (const quadrantConf of config.quadrants) {
        const quadrantBlips = blips.filter((b) => b.quadrant === quadrantConf.id);
        if (quadrantBlips.length === 0) continue;

        const section = document.createElement('section');
        section.className = `techradar-listing-quadrant techradar-listing-quadrant--${quadrantConf.id}`;

        // Header: title + zoom button
        const header = document.createElement('div');
        header.className = 'techradar-listing-quadrant__header';

        const heading = document.createElement('h3');
        heading.className = 'techradar-listing-quadrant__title';
        heading.textContent = quadrantConf.title;
        header.appendChild(heading);

        if (!isNarrowViewport()) {
            const zoomBtn = document.createElement('button');
            zoomBtn.className = 'techradar-listing-quadrant__zoom';
            zoomBtn.setAttribute('aria-label', `Zoom into ${quadrantConf.title}`);
            zoomBtn.textContent = 'ZOOM IN';
            zoomBtn.addEventListener('click', () => {
                const radarEl = root.querySelector<HTMLElement>('.techradar-chart-shell');
                radarEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                focusQuadrant(quadrantConf.id as QuadrantId);
            });
            header.appendChild(zoomBtn);
        }
        section.appendChild(header);

        // Rings container — horizontal flex so rings sit side-by-side
        const ringsContainer = document.createElement('div');
        ringsContainer.className = 'techradar-listing-quadrant__rings';

        for (const ringId of RING_ORDER) {
            const ringBlips = quadrantBlips.filter((b) => b.ring === ringId);
            if (ringBlips.length === 0) continue;

            const ringLabel = config.rings.find((r) => r.id === ringId)?.label ?? ringId;

            const ringSection = document.createElement('div');
            ringSection.className = `techradar-listing-ring techradar-listing-ring--${ringId}`;

            const ringTitle = document.createElement('span');
            ringTitle.className = `techradar-listing-ring__title techradar-listing-ring__title--${ringId}`;
            ringTitle.textContent = ringLabel;
            ringSection.appendChild(ringTitle);

            const ul = document.createElement('ul');
            ul.className = 'techradar-listing-ring__list';

            for (const blip of ringBlips.sort((a, b) => a.name.localeCompare(b.name))) {
                const li = document.createElement('li');
                li.className = 'techradar-list-item';
                li.dataset['blipId'] = String(blip.id);

                const btn = document.createElement('button');
                btn.className = 'techradar-list-item__btn';
                btn.textContent = `${blip.id}. ${blip.name}`;
                if (blip.isNew) {
                    const badge = document.createElement('span');
                    badge.className = 'techradar-list-item__badge';
                    badge.textContent = 'New';
                    btn.appendChild(badge);
                }

                btn.addEventListener('click', () => {
                    if (isNarrowViewport()) {
                        selectBlip(blip.quadrant, blip);
                    } else {
                        const radarEl = root.querySelector<HTMLElement>('.techradar-chart-shell');
                        radarEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        focusQuadrant(blip.quadrant);
                        setTimeout(() => selectBlip(blip.quadrant, blip), 400);
                    }
                });

                li.appendChild(btn);
                ul.appendChild(li);
            }

            ringSection.appendChild(ul);
            ringsContainer.appendChild(ringSection);
        }

        section.appendChild(ringsContainer);
        container.appendChild(section);
    }
}

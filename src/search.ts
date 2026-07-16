import type { Blip } from './types/radar';

export function initSearch(root: HTMLElement, blips: Blip[]): void {
    const input = root.querySelector<HTMLInputElement>('.techradar-search__input');
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        applySearch(root, blips, query);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            input.value = '';
            applySearch(root, blips, '');
        }
    });
}

function applySearch(root: HTMLElement, blips: Blip[], query: string): void {
    const allBlipEls = root.querySelectorAll<SVGGElement>('.radar-blip');
    const allListItems = root.querySelectorAll<HTMLElement>('.techradar-list-item');

    if (!query) {
        allBlipEls.forEach((el) => el.classList.remove('radar-blip--dimmed', 'radar-blip--highlighted'));
        allListItems.forEach((el) => el.classList.remove('techradar-list-item--hidden'));
        return;
    }

    const matchingIds = new Set(
        blips
            .filter((b) =>
                b.name.toLowerCase().includes(query) ||
                b.description.toLowerCase().includes(query)
            )
            .map((b) => b.id)
    );

    allBlipEls.forEach((el) => {
        const id = Number(el.dataset['id']);
        if (matchingIds.has(id)) {
            el.classList.add('radar-blip--highlighted');
            el.classList.remove('radar-blip--dimmed');
        } else {
            el.classList.add('radar-blip--dimmed');
            el.classList.remove('radar-blip--highlighted');
        }
    });

    allListItems.forEach((el) => {
        const id = Number(el.dataset['blipId']);
        el.classList.toggle('techradar-list-item--hidden', !matchingIds.has(id));
    });
}

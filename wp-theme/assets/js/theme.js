(() => {
    document.querySelectorAll('[data-dynamic-year]').forEach((el) => {
        el.textContent = String(new Date().getFullYear());
    });
})();

(() => {
    const picker = document.querySelector('.contact-picker');
    if (!picker) return;

    const pickerCards = [...picker.querySelectorAll('.contact-picker__card')];
    const panels = [...document.querySelectorAll('.contact-form-wrap[data-intent]')];

    function scrollPickerToCard(id, behavior) {
        const card = pickerCards.find((c) => c.dataset.intent === id);
        if (!card) return;
        const pickerLeft = picker.getBoundingClientRect().left;
        const cardLeft   = card.getBoundingClientRect().left;
        picker.scrollTo({ left: picker.scrollLeft + cardLeft - pickerLeft, behavior: behavior || 'smooth' });
    }

    function activateIntent(id) {
        pickerCards.forEach((card) => {
            const isThis = card.dataset.intent === id;
            card.setAttribute('aria-selected', isThis ? 'true' : 'false');
            card.classList.toggle('contact-picker__card--active', isThis);
        });

        panels.forEach((panel) => {
            const isThis = panel.dataset.intent === id;
            panel.toggleAttribute('hidden', !isThis);
            panel.classList.toggle('contact-form-wrap--active', isThis);
        });

        history.replaceState(null, '', '?intent=' + id);

        scrollPickerToCard(id, 'smooth');

        requestAnimationFrame(() => {
            const active = panels.find((p) => p.dataset.intent === id);
            if (!active) return;
            const first = active.querySelector(
                'input:not([type="hidden"]), select, textarea'
            );
            if (first) first.focus({ preventScroll: true });
        });
    }

    // Scroll the initially active card into view on load (handles ?intent= direct links).
    const initialActive = pickerCards.find((c) => c.getAttribute('aria-selected') === 'true');
    if (initialActive) {
        requestAnimationFrame(() => scrollPickerToCard(initialActive.dataset.intent, 'instant'));
    }

    pickerCards.forEach((card) => {
        card.addEventListener('click', () => {
            if (card.dataset.intent) activateIntent(card.dataset.intent);
        });
    });

    // Arrow-key navigation on the tablist.
    picker.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const focused = pickerCards.indexOf(
            document.activeElement instanceof Element
                ? (document.activeElement.closest('.contact-picker__card') || null)
                : null
        );
        if (focused === -1) return;
        const next =
            e.key === 'ArrowRight'
                ? (focused + 1) % pickerCards.length
                : (focused - 1 + pickerCards.length) % pickerCards.length;
        e.preventDefault();
        pickerCards[next].focus();
        activateIntent(pickerCards[next].dataset.intent);
    });

    // Partner picker inside intent-03.
    const partnerPicker = document.querySelector('.contact-partner-picker');
    if (partnerPicker) {
        const partnerCards = [
            ...partnerPicker.querySelectorAll('.contact-partner-picker__card'),
        ];

        const partnerEmails = {
            detesters:  'info@detesters.nl',
            testcoders: 'info@testcoders.nl',
            techchamps: 'info@techchamps.io',
        };

        function syncCf7PartnerFields(pid) {
            const panel = document.getElementById('contact-panel-partner');
            if (!panel) return;
            const idField    = panel.querySelector('.wpcf7-form input[name="your-partner"]');
            const emailField = panel.querySelector('.wpcf7-form input[name="partner-email"]');
            if (idField)    idField.value    = pid;
            if (emailField) emailField.value = partnerEmails[pid] || '';
        }

        function selectPartner(pid) {
            partnerCards.forEach((c) => {
                const isThis = c.dataset.partner === pid;
                c.setAttribute('aria-pressed', isThis ? 'true' : 'false');
                c.classList.toggle('contact-partner-picker__card--active', isThis);
            });

            syncCf7PartnerFields(pid);

            const url = new URL(window.location.href);
            url.searchParams.set('intent', 'partner');
            if (pid) {
                url.searchParams.set('partner', pid);
            } else {
                url.searchParams.delete('partner');
            }
            history.replaceState(null, '', url.toString());
        }

        partnerCards.forEach((card) => {
            card.addEventListener('click', () => selectPartner(card.dataset.partner));
        });

        // Honour ?partner= on load (PHP already sets visual state; sync CF7 fields).
        const prePartner = new URLSearchParams(window.location.search).get('partner');
        if (prePartner) syncCf7PartnerFields(prePartner);
    }
})();

(() => {
    const CONSENT_KEY = 'techradar_cookie_consent';
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    if (!banner || !acceptBtn || !declineBtn) return;

    function dismiss(value) {
        localStorage.setItem(CONSENT_KEY, value);
        window.gtag?.('consent', 'update', {
            analytics_storage: value === 'accepted' ? 'granted' : 'denied',
        });
        banner.classList.remove('cookie-banner--visible');
        document.body.classList.remove('cookie-banner--open');
        window.setTimeout(() => banner.setAttribute('hidden', ''), 320);
    }

    if (!localStorage.getItem(CONSENT_KEY)) {
        banner.removeAttribute('hidden');
        requestAnimationFrame(() => {
            banner.classList.add('cookie-banner--visible');
            document.body.classList.add('cookie-banner--open');
        });
    }

    acceptBtn.addEventListener('click', () => dismiss('accepted'));
    declineBtn.addEventListener('click', () => dismiss('declined'));
})();

// Privacy policy TOC scroll-spy (IntersectionObserver)
(function initPrivacyToc() {
    const toc = document.querySelector('.privacy-toc');
    if (!toc) return;

    const links = toc.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    // Bail on reduced motion — leave first link active and skip observer.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        links[0]?.classList.add('is-active');
        return;
    }

    const map = new Map();
    links.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) map.set(target, link);
    });

    const headerOffset = parseInt(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--site-header-height') || '82',
        10
    );

    const visible = new Set();

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(e => {
                if (e.isIntersecting) visible.add(e.target);
                else visible.delete(e.target);
            });

            if (!visible.size) return;

            // Multiple sections can enter the zone simultaneously (e.g. on a
            // click-jump). Always activate the first visible one in DOM order.
            let active = null;
            map.forEach((_, target) => {
                if (!active && visible.has(target)) active = target;
            });

            links.forEach(l => l.classList.remove('is-active'));
            map.get(active)?.classList.add('is-active');
        },
        {
            rootMargin: `-${headerOffset + 24}px 0px -65% 0px`,
            threshold: 0,
        }
    );

    map.forEach((_, target) => observer.observe(target));
})();

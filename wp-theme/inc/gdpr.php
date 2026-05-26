<?php
defined( 'ABSPATH' ) || exit;

/**
 * Lightweight GDPR cookie consent.
 * Consent is stored in localStorage key "techradar_cookie_consent".
 * Consent Mode v2 defaults are injected in <head> before Site Kit loads;
 * theme.js updates the state when the user makes a choice.
 */
add_action( 'wp_head', 'techradar_consent_mode_defaults', 1 );
add_action( 'wp_footer', 'techradar_cookie_banner' );

/**
 * Output Google Consent Mode v2 defaults before any gtag script runs.
 * Reads the stored choice from localStorage; defaults to denied when unknown.
 */
function techradar_consent_mode_defaults(): void {
    ?>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    (function () {
        var stored = '';
        try { stored = localStorage.getItem('techradar_cookie_consent') || ''; } catch (e) {}
        gtag('consent', 'default', {
            analytics_storage:  stored === 'accepted' ? 'granted' : 'denied',
            ad_storage:         'denied',
            ad_user_data:       'denied',
            ad_personalization: 'denied',
        });
    })();
    </script>
    <?php
}

function techradar_cookie_banner(): void {
    get_template_part( 'template-parts/cookie-banner' );
}

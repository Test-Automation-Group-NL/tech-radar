<?php
defined( 'ABSPATH' ) || exit;

/**
 * Lightweight GDPR cookie consent.
 * Consent is stored in localStorage key "techradar_cookie_consent".
 * Analytics scripts must check for consent before loading, see cookie-banner.php.
 */
add_action( 'wp_footer', 'techradar_cookie_banner' );

function techradar_cookie_banner(): void {
    get_template_part( 'template-parts/cookie-banner' );
}

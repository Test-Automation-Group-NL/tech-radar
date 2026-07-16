<?php
defined( 'ABSPATH' ) || exit;

/**
 * Highlight the Customer Cases menu item when viewing a single customer_case post.
 * Works for both WP-managed menus (nav_menu_css_class) and the fallback nav
 * (is_singular check already present in the fallback functions below).
 */
add_filter( 'nav_menu_css_class', 'techradar_theme_cases_nav_class', 10, 2 );

function techradar_theme_cases_nav_class( array $classes, WP_Post $item ): array {
    if ( is_singular( 'customer_case' ) && $item->object === 'page' ) {
        $cases_url = techradar_theme_get_cases_url();
        if ( rtrim( get_permalink( $item->object_id ), '/' ) === rtrim( $cases_url, '/' ) ) {
            $classes[] = 'current-menu-item';
        }
    }
    return $classes;
}

/**
 * URL of the Customer Cases page (page template first, then CPT archive fallback).
 */
function techradar_theme_get_cases_url(): string {
    $pages = get_pages(
        [
            'meta_key'   => '_wp_page_template',
            'meta_value' => 'page-templates/customer-cases.php',
            'number'     => 1,
        ]
    );
    if ( ! empty( $pages ) ) {
        return get_permalink( $pages[0]->ID );
    }

    $archive = get_post_type_archive_link( 'customer_case' );
    return $archive ?: home_url( '/customer-cases/' );
}

/**
 * URL of the page using the Tech Radar template (first match).
 */
function techradar_theme_get_radar_page_url(): string {
    $pages = get_pages(
        [
            'meta_key'   => '_wp_page_template',
            'meta_value' => 'page-templates/radar-page.php',
            'number'     => 1,
        ]
    );
    if ( ! empty( $pages ) ) {
        return get_permalink( $pages[0]->ID );
    }

    return home_url( '/' );
}

/**
 * Contact page URL if a page with slug `contact` exists, else /contact/.
 */
function techradar_theme_get_contact_url(): string {
    $contact = get_page_by_path( 'contact' );
    if ( $contact instanceof WP_Post ) {
        return get_permalink( $contact );
    }

    return home_url( '/contact/' );
}

/**
 * Primary menu fallback when no menu is assigned (Home / TechRadar / Contact).
 */
function techradar_theme_primary_nav_fallback(): void {
    $home    = home_url( '/' );
    $radar   = techradar_theme_get_radar_page_url();
    $cases   = techradar_theme_get_cases_url();
    $contact = techradar_theme_get_contact_url();

    $radar_active = is_page_template( 'page-templates/radar-page.php' );
    $cases_active = is_page_template( 'page-templates/customer-cases.php' )
        || is_singular( 'customer_case' )
        || is_post_type_archive( 'customer_case' );

    echo '<ul class="site-header__menu">';
    printf(
        '<li class="menu-item %s"><a href="%s">%s</a></li>',
        is_front_page() ? 'is-active' : '',
        esc_url( $home ),
        esc_html__( 'Home', 'techradar-theme' )
    );
    printf(
        '<li class="menu-item %s"><a href="%s">%s</a></li>',
        $radar_active ? 'is-active' : '',
        esc_url( $radar ),
        esc_html__( 'TechRadar', 'techradar-theme' )
    );
    printf(
        '<li class="menu-item %s"><a href="%s">%s</a></li>',
        $cases_active ? 'is-active' : '',
        esc_url( $cases ),
        esc_html__( 'Customer Cases', 'techradar-theme' )
    );
    printf(
        '<li class="menu-item"><a href="%s">%s</a></li>',
        esc_url( $contact ),
        esc_html__( 'Contact', 'techradar-theme' )
    );
    echo '</ul>';
}

/**
 * Pull every <h2 id="..."> out of the rendered page content and return
 * [ ['id' => '...', 'text' => '...'], ... ] for the TOC sidebar on the
 * privacy policy page. Headings without an `id` are silently skipped.
 */
function techradar_theme_extract_toc( string $html ): array {
	if ( ! $html ) {
		return [];
	}
	preg_match_all(
		'/<h2[^>]*\sid="([^"]+)"[^>]*>(.*?)<\/h2>/is',
		$html,
		$matches,
		PREG_SET_ORDER
	);
	$out = [];
	foreach ( $matches as $m ) {
		$out[] = [
			'id'   => sanitize_html_class( $m[1] ),
			'text' => wp_strip_all_tags( $m[2] ),
		];
	}
	return $out;
}

/**
 * Footer menu fallback aligned with primary + Privacy Policy when set.
 */
function techradar_theme_footer_nav_fallback(): void {
    $home    = home_url( '/' );
    $radar   = techradar_theme_get_radar_page_url();
    $cases   = techradar_theme_get_cases_url();
    $contact = techradar_theme_get_contact_url();
    $privacy = get_privacy_policy_url();

    echo '<ul class="site-footer__menu">';
    printf(
        '<li class="menu-item %s"><a href="%s">%s</a></li>',
        is_front_page() ? 'is-active' : '',
        esc_url( $home ),
        esc_html__( 'Home', 'techradar-theme' )
    );
    printf(
        '<li class="menu-item %s"><a href="%s">%s</a></li>',
        is_page_template( 'page-templates/radar-page.php' ) ? 'is-active' : '',
        esc_url( $radar ),
        esc_html__( 'TechRadar', 'techradar-theme' )
    );
    printf(
        '<li class="menu-item %s"><a href="%s">%s</a></li>',
        ( is_page_template( 'page-templates/customer-cases.php' ) || is_singular( 'customer_case' ) || is_post_type_archive( 'customer_case' ) ) ? 'is-active' : '',
        esc_url( $cases ),
        esc_html__( 'Customer Cases', 'techradar-theme' )
    );
    printf(
        '<li class="menu-item %s"><a href="%s">%s</a></li>',
        is_page_template( 'page-templates/contact.php' ) || is_page( 'contact' )
            ? 'is-active'
            : '',
        esc_url( $contact ),
        esc_html__( 'Contact', 'techradar-theme' )
    );
    if ( $privacy ) {
        printf(
            '<li class="menu-item %s"><a href="%s">%s</a></li>',
            is_privacy_policy() ? 'is-active' : '',
            esc_url( $privacy ),
            esc_html__( 'Privacy Policy', 'techradar-theme' )
        );
    }
    echo '</ul>';
}

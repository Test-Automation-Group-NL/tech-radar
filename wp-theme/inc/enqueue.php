<?php
defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', 'techradar_theme_register_editor_styles', 20 );

add_action( 'wp_enqueue_scripts', 'techradar_theme_enqueue' );

add_action( 'enqueue_block_editor_assets', 'techradar_theme_enqueue_editor' );

/**
 * Block editor iframe: palette, homepage hp-* rules, editor tweaks.
 */
function techradar_theme_register_editor_styles(): void {
    add_editor_style(
        [
            'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap',
            'assets/css/palette.css',
            'assets/css/theme.css',
            'assets/css/editor.css',
        ]
    );
}

/**
 * Load fonts in the editor chrome (outside the content iframe).
 */
function techradar_theme_enqueue_editor(): void {
    wp_enqueue_style(
        'techradar-theme-editor-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap',
        [],
        null
    );
}

function techradar_theme_enqueue(): void {
    wp_enqueue_style(
        'techradar-theme-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap',
        [],
        null
    );

    // Bundled + minified CSS (palette + theme, built by esbuild)
    wp_enqueue_style(
        'techradar-theme',
        TECHRADAR_THEME_URL . '/assets/dist/theme.css',
        [ 'techradar-theme-fonts' ],
        TECHRADAR_THEME_VERSION
    );

    // Bundled + minified JS (built by esbuild)
    wp_enqueue_script(
        'techradar-theme',
        TECHRADAR_THEME_URL . '/assets/dist/theme.js',
        [],
        TECHRADAR_THEME_VERSION,
        true
    );
}

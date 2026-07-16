<?php
defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', 'techradar_theme_setup' );

function techradar_theme_setup(): void {
    load_theme_textdomain( 'techradar-theme', TECHRADAR_THEME_DIR . '/languages' );

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ] );
    add_theme_support( 'customize-selective-refresh-widgets' );
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'editor-styles' );

    register_nav_menus( [
        'primary' => __( 'Primary Navigation', 'techradar-theme' ),
        'footer'  => __( 'Footer Navigation', 'techradar-theme' ),
    ] );

    // Expose the Excerpt field in the block editor for pages (used by the
    // Privacy Policy template as the hero lead paragraph).
    add_post_type_support( 'page', 'excerpt' );
}

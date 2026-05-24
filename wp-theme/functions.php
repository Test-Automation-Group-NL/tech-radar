<?php
defined( 'ABSPATH' ) || exit;

define( 'TECHRADAR_THEME_VERSION', '1.0.0' );
define( 'TECHRADAR_THEME_DIR', get_template_directory() );
define( 'TECHRADAR_THEME_URL', get_template_directory_uri() );

require_once TECHRADAR_THEME_DIR . '/inc/setup.php';
require_once TECHRADAR_THEME_DIR . '/inc/header-nav.php';
require_once TECHRADAR_THEME_DIR . '/inc/enqueue.php';
require_once TECHRADAR_THEME_DIR . '/inc/custom-post-types.php';
require_once TECHRADAR_THEME_DIR . '/inc/gdpr.php';
require_once TECHRADAR_THEME_DIR . '/inc/hero-decor.php';
require_once TECHRADAR_THEME_DIR . '/inc/required-plugins.php';

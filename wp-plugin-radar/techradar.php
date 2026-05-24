<?php
/**
 * Plugin Name:       Test Automation Tech Radar
 * Plugin URI:        https://github.com/wswebcreation/testautomationtechradar
 * Description:       Renders the Test Automation Technology Radar. Use the [techradar] shortcode.
 * Version:           1.0.0
 * Author:            TAG: Test Automation Group (deTesters, TestCoders, TechChamps)
 * Author URI:        https://www.testautomationtechradar.com/
 * License:           MIT
 * Text Domain:       techradar
 */

defined( 'ABSPATH' ) || exit;

define( 'TECHRADAR_VERSION', '1.0.0' );
define( 'TECHRADAR_DIR', plugin_dir_path( __FILE__ ) );
define( 'TECHRADAR_URL', plugin_dir_url( __FILE__ ) );

require_once TECHRADAR_DIR . 'includes/shortcode.php';
require_once TECHRADAR_DIR . 'admin/settings-page.php';
require_once TECHRADAR_DIR . 'admin/settings-fields.php';

register_activation_hook( __FILE__, 'techradar_activate' );
register_deactivation_hook( __FILE__, 'techradar_deactivate' );

function techradar_activate(): void {
    // Set default options on first activation
    if ( ! get_option( 'techradar_settings' ) ) {
        update_option( 'techradar_settings', techradar_default_settings() );
    }
}

function techradar_deactivate(): void {
    // Nothing to clean up, options persist for re-activation
}

function techradar_default_settings(): array {
    return [
        'json_url'                    => get_site_url() . '/radar.json',
        'quadrant_1_title'            => 'Techniques',
        'quadrant_1_description'      => 'Testing methodologies and approaches used in modern test automation.',
        'quadrant_2_title'            => 'Platforms',
        'quadrant_2_description'      => 'Cloud services and infrastructure platforms supporting test automation.',
        'quadrant_3_title'            => 'Tools',
        'quadrant_3_description'      => 'Software utilities and platforms that support test automation workflows.',
        'quadrant_4_title'            => 'Languages & Frameworks',
        'quadrant_4_description'      => 'Programming languages and test frameworks used to build automation solutions.',
        'ring_adopt_label'            => 'Adopt',
        'ring_trial_label'            => 'Trial',
        'ring_assess_label'           => 'Assess',
        'ring_hold_label'             => 'Hold',
        'hero_title'                  => 'Test Automation TechRadar',
        'all_blips_label'             => 'All blips',
        'contact_url'                 => '/contact',
        'logo_radar'                  => 0,
        'logos_partners'              => wp_json_encode( [
            [ 'name' => 'deTesters',   'attachment_id' => 0 ],
            [ 'name' => 'TestCoders',  'attachment_id' => 0 ],
            [ 'name' => 'TechChamps',  'attachment_id' => 0 ],
        ] ),
        'sofius_show'                 => true,
        'sofius_url'                  => 'https://www.sofius.com',
        'contact_form_id_pdf'         => '',
        'contact_form_id_help'        => '',
        'contact_form_id_partner'     => '',
        'contact_form_id_case'        => '',
    ];
}

function techradar_get_settings(): array {
    $defaults = techradar_default_settings();
    $saved    = get_option( 'techradar_settings', [] );
    return wp_parse_args( $saved, $defaults );
}

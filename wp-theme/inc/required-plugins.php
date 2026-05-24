<?php
defined( 'ABSPATH' ) || exit;

/**
 * Declare plugins required by this theme and surface an admin notice for any
 * that are not yet installed or active.
 *
 * Each entry:
 *   file   – plugin-folder/main-file.php, used by is_plugin_active()
 *   name   – human-readable label shown in the notice
 *   slug   – wordpress.org slug, used to build the install/activate URL
 */
add_action( 'admin_notices', 'techradar_required_plugins_notice' );

function techradar_required_plugins_notice(): void {
	if ( ! current_user_can( 'install_plugins' ) ) {
		return;
	}

	if ( ! function_exists( 'is_plugin_active' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	$required = [
		[
			'file' => 'all-in-one-wp-migration/all-in-one-wp-migration.php',
			'name' => 'All-in-One WP Migration and Backup',
			'slug' => 'all-in-one-wp-migration',
		],
		[
			'file' => 'contact-form-7/wp-contact-form-7.php',
			'name' => 'Contact Form 7',
			'slug' => 'contact-form-7',
		],
		[
			'file' => 'cf7-conditional-fields/conditional-fields.php',
			'name' => 'Conditional Fields for Contact Form 7',
			'slug' => 'cf7-conditional-fields',
		],
		[
			'file' => 'flamingo/flamingo.php',
			'name' => 'Flamingo',
			'slug' => 'flamingo',
		],
		[
			'file' => 'kadence-blocks/kadence-blocks.php',
			'name' => 'Kadence Blocks',
			'slug' => 'kadence-blocks',
		],
		[
			'file' => 'google-site-kit/google-site-kit.php',
			'name' => 'Site Kit by Google',
			'slug' => 'google-site-kit',
		],
	];

	$missing = array_filter( $required, fn( $p ) => ! is_plugin_active( $p['file'] ) );

	if ( empty( $missing ) ) {
		return;
	}

	$items = array_map( function ( $p ) {
		$install_url = wp_nonce_url(
			admin_url( 'update.php?action=install-plugin&plugin=' . rawurlencode( $p['slug'] ) ),
			'install-plugin_' . $p['slug']
		);
		$activate_url = admin_url( 'plugins.php?plugin_status=inactive' );

		$plugin_path = WP_PLUGIN_DIR . '/' . $p['file'];
		if ( file_exists( $plugin_path ) ) {
			$action_url   = $activate_url;
			$action_label = __( 'Activate', 'techradar-theme' );
		} else {
			$action_url   = $install_url;
			$action_label = __( 'Install', 'techradar-theme' );
		}

		return sprintf(
			'<li><strong>%s</strong> &mdash; <a href="%s">%s</a></li>',
			esc_html( $p['name'] ),
			esc_url( $action_url ),
			esc_html( $action_label )
		);
	}, $missing );

	printf(
		'<div class="notice notice-warning"><p><strong>%s</strong></p><ul>%s</ul></div>',
		esc_html__( 'The TechRadar theme requires the following plugins:', 'techradar-theme' ),
		implode( '', $items )
	);
}

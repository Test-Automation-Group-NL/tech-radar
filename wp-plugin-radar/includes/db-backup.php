<?php
defined( 'ABSPATH' ) || exit;

const TECHRADAR_BACKUP_HOOK  = 'techradar_weekly_db_backup';
const TECHRADAR_BACKUP_EMAIL = 'info@testautomationtechradar.com';

add_action( TECHRADAR_BACKUP_HOOK, 'techradar_run_db_backup' );
add_action( 'admin_post_techradar_manual_backup', 'techradar_handle_manual_backup' );
add_action( 'update_option_techradar_settings', 'techradar_reschedule_on_settings_update', 10, 2 );

function techradar_handle_manual_backup(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'techradar' ) );
	}
	check_admin_referer( 'techradar_manual_backup' );

	techradar_run_db_backup();

	wp_safe_redirect( add_query_arg( 'techradar_backup', '1', admin_url( 'options-general.php?page=techradar' ) ) );
	exit;
}

function techradar_schedule_backup(): void {
	$settings = techradar_get_settings();
	if ( empty( $settings['backup_enabled'] ) ) {
		techradar_unschedule_backup();
		return;
	}
	if ( ! wp_next_scheduled( TECHRADAR_BACKUP_HOOK ) ) {
		wp_schedule_event( techradar_next_monday_midnight(), 'weekly', TECHRADAR_BACKUP_HOOK );
	}
}

function techradar_unschedule_backup(): void {
	$timestamp = wp_next_scheduled( TECHRADAR_BACKUP_HOOK );
	if ( $timestamp ) {
		wp_unschedule_event( $timestamp, TECHRADAR_BACKUP_HOOK );
	}
}

function techradar_reschedule_on_settings_update( mixed $old, mixed $new ): void {
	techradar_unschedule_backup();
	if ( ! empty( $new['backup_enabled'] ) ) {
		wp_schedule_event( techradar_next_monday_midnight(), 'weekly', TECHRADAR_BACKUP_HOOK );
	}
}

function techradar_next_monday_midnight(): int {
	return (int) ( new DateTimeImmutable( 'next monday', new DateTimeZone( 'UTC' ) ) )
		->setTime( 0, 0, 0 )
		->getTimestamp();
}

function techradar_run_db_backup(): void {
	global $wpdb;

	$sql      = techradar_generate_sql_dump( $wpdb );
	$dir      = wp_upload_dir()['basedir'];
	$filename = $dir . '/techradar-db-' . gmdate( 'Y-m-d' ) . '.sql';

	file_put_contents( $filename, $sql ); // phpcs:ignore WordPress.WP.AlternativeFunctions

	$sent = wp_mail(
		TECHRADAR_BACKUP_EMAIL,
		'Tech Radar DB Backup - ' . gmdate( 'Y-m-d' ),
		'Weekly WordPress database backup is attached.',
		[],
		[ $filename ]
	);

	wp_delete_file( $filename );

	if ( ! $sent ) {
		error_log( 'Tech Radar: weekly DB backup email failed to send.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions
	}
}

function techradar_generate_sql_dump( wpdb $wpdb ): string {
	$sql  = "-- Tech Radar Database Backup\n";
	$sql .= '-- Generated: ' . gmdate( 'Y-m-d H:i:s' ) . " UTC\n\n";
	$sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

	foreach ( $wpdb->get_col( 'SHOW TABLES' ) as $table ) {
		$create = $wpdb->get_row( "SHOW CREATE TABLE `{$table}`", ARRAY_N );
		$sql   .= "DROP TABLE IF EXISTS `{$table}`;\n";
		$sql   .= $create[1] . ";\n\n";

		foreach ( $wpdb->get_results( "SELECT * FROM `{$table}`", ARRAY_A ) as $row ) {
			$values = array_map(
				function ( $val ) {
					if ( null === $val ) {
						return 'NULL';
					}
					return "'" . str_replace(
						[ '\\', "'", "\n", "\r", "\0" ],
						[ '\\\\', "\\'", '\\n', '\\r', '\\0' ],
						$val
					) . "'";
				},
				array_values( $row )
			);
			$sql .= 'INSERT INTO `' . $table . '` VALUES (' . implode( ', ', $values ) . ");\n";
		}

		$sql .= "\n";
	}

	$sql .= "SET FOREIGN_KEY_CHECKS=1;\n";
	return $sql;
}

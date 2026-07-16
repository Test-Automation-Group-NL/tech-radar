<?php
defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', 'techradar_add_settings_page' );

function techradar_add_settings_page(): void {
    add_options_page(
        'Tech Radar Settings',
        'Tech Radar',
        'manage_options',
        'techradar',
        'techradar_render_settings_page'
    );
}

function techradar_render_settings_page(): void {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Tech Radar Settings', 'techradar' ); ?></h1>

        <?php if ( isset( $_GET['techradar_backup'] ) && '1' === $_GET['techradar_backup'] ) : // phpcs:ignore WordPress.Security.NonceVerification ?>
            <div class="notice notice-success is-dismissible">
                <p><?php esc_html_e( 'Database backup sent to info@testautomationtechradar.com.', 'techradar' ); ?></p>
            </div>
        <?php endif; ?>

        <form method="post" action="options.php">
            <?php
            settings_fields( 'techradar_settings_group' );
            do_settings_sections( 'techradar' );
            submit_button();
            ?>
        </form>

        <hr>
        <h2><?php esc_html_e( 'Database Backup', 'techradar' ); ?></h2>
        <p><?php esc_html_e( 'Enable the weekly schedule under "Database Backup" above and save settings. Use the button below to trigger a backup immediately regardless of the schedule.', 'techradar' ); ?></p>
        <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
            <input type="hidden" name="action" value="techradar_manual_backup">
            <?php wp_nonce_field( 'techradar_manual_backup' ); ?>
            <?php submit_button( __( 'Send Backup Now', 'techradar' ), 'secondary', 'submit', false ); ?>
        </form>
    </div>
    <?php
}

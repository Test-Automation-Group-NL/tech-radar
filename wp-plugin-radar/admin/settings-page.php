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
        <form method="post" action="options.php">
            <?php
            settings_fields( 'techradar_settings_group' );
            do_settings_sections( 'techradar' );
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

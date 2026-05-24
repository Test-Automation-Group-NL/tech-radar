<?php
defined( 'ABSPATH' ) || exit;

add_action( 'admin_init', 'techradar_register_settings' );

function techradar_register_settings(): void {
    register_setting(
        'techradar_settings_group',
        'techradar_settings',
        [ 'sanitize_callback' => 'techradar_sanitize_settings' ]
    );

    // ── Data ─────────────────────────────────────────────────────────────────
    add_settings_section( 'techradar_data', 'Radar Data', '__return_false', 'techradar' );

    techradar_field( 'json_url', 'Radar JSON URL', 'techradar_data',
        'Full URL to your radar.json file. Updated via FTP: the radar always reads this live.',
        'url' );

    techradar_field( 'contact_url', 'Contact / PDF request page URL', 'techradar_data',
        'URL of the page where visitors can request a downloadable copy of the radar.' );

    // ── Quadrants ─────────────────────────────────────────────────────────────
    add_settings_section( 'techradar_quadrants', 'Quadrant Labels', '__return_false', 'techradar' );

    foreach ( [ 1 => 'Top-left (Techniques)', 2 => 'Top-right (Tools)', 3 => 'Bottom-right (Languages & Frameworks)', 4 => 'Bottom-left (Platforms)' ] as $n => $label ) {
        techradar_field( "quadrant_{$n}_title", "{$label}: Title", 'techradar_quadrants' );
        techradar_field( "quadrant_{$n}_description", "{$label}: Corner description", 'techradar_quadrants',
            'Shown in the quadrant corner on the radar chart.', 'textarea' );
    }

    // ── Rings ─────────────────────────────────────────────────────────────────
    add_settings_section( 'techradar_rings', 'Ring Labels', '__return_false', 'techradar' );

    foreach ( [ 'adopt' => 'Adopt (innermost)', 'trial' => 'Trial', 'assess' => 'Assess', 'hold' => 'Hold (outermost)' ] as $id => $label ) {
        techradar_field( "ring_{$id}_label", $label, 'techradar_rings' );
    }

    // ── Hero copy ─────────────────────────────────────────────────────────────
    add_settings_section( 'techradar_hero', 'Hero Copy', '__return_false', 'techradar' );
    techradar_field( 'hero_title', 'Hero title', 'techradar_hero',
        'Main heading shown above the radar chart.' );
    techradar_field( 'all_blips_label', 'All blips section label', 'techradar_hero',
        'Text centered on the divider line above the listing (example: All blips).' );

    // ── Branding ──────────────────────────────────────────────────────────────
    add_settings_section( 'techradar_branding', 'Branding', '__return_false', 'techradar' );

    techradar_field( 'sofius_show', 'Show Sofius credit in footer', 'techradar_branding',
        'Displays "Part of Sofius" with a link in the site footer.', 'checkbox' );

    techradar_field( 'sofius_url', 'Sofius URL', 'techradar_branding', '', 'url' );

    // ── Contact Forms ─────────────────────────────────────────────────────────
    add_settings_section( 'techradar_contact_forms', 'Contact Forms (CF7 form IDs)', '__return_false', 'techradar' );

    foreach ( [
        'contact_form_id_pdf'     => 'PDF intent (01): "Get the TechRadar PDF"',
        'contact_form_id_help'    => 'Help intent (02): "Help navigating the TechRadar"',
        'contact_form_id_partner' => 'Partner intent (03): "Question for one of our partners"',
        'contact_form_id_case'    => 'Case intent (04): "Share your story"',
    ] as $key => $label ) {
        techradar_field( $key, $label, 'techradar_contact_forms',
            'Enter the CF7 form ID or hash (e.g. "123" or "b1f2564"): copy it from the shortcode shown in Contact → Contact Forms.' );
    }
}

function techradar_field( string $key, string $label, string $section, string $description = '', string $type = 'text' ): void {
    add_settings_field(
        "techradar_{$key}",
        $label,
        function () use ( $key, $description, $type ) {
            $settings = techradar_get_settings();
            $value    = $settings[ $key ] ?? '';
            $id       = esc_attr( "techradar_{$key}" );
            $name     = esc_attr( "techradar_settings[{$key}]" );

            if ( $type === 'textarea' ) {
                echo "<textarea id='{$id}' name='{$name}' rows='3' class='regular-text'>" . esc_textarea( $value ) . '</textarea>';
            } elseif ( $type === 'checkbox' ) {
                $checked = checked( $value, true, false );
                echo "<input type='checkbox' id='{$id}' name='{$name}' value='1' {$checked} />";
            } else {
                echo "<input type='{$type}' id='{$id}' name='{$name}' value='" . esc_attr( $value ) . "' class='regular-text' />";
            }

            if ( $description ) {
                echo "<p class='description'>" . esc_html( $description ) . '</p>';
            }
        },
        'techradar',
        $section
    );
}

function techradar_sanitize_settings( mixed $input ): array {
    $defaults  = techradar_default_settings();
    $sanitized = [];

    foreach ( $defaults as $key => $default ) {
        $raw = $input[ $key ] ?? $default;

        if ( str_ends_with( $key, '_url' ) ) {
            $sanitized[ $key ] = esc_url_raw( $raw );
        } elseif ( $key === 'sofius_show' ) {
            $sanitized[ $key ] = (bool) $raw;
        } elseif ( str_ends_with( $key, '_description' ) ) {
            $sanitized[ $key ] = sanitize_textarea_field( $raw );
        } elseif ( str_starts_with( $key, 'contact_form_id_' ) ) {
            $sanitized[ $key ] = sanitize_text_field( $raw );
        } else {
            $sanitized[ $key ] = sanitize_text_field( $raw );
        }
    }

    return $sanitized;
}

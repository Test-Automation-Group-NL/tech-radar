<?php
defined( 'ABSPATH' ) || exit;

add_action( 'init', 'techradar_register_shortcode' );
add_action( 'wp_enqueue_scripts', 'techradar_enqueue_assets' );

function techradar_register_shortcode(): void {
    add_shortcode( 'techradar',             'techradar_render_shortcode' );
    add_shortcode( 'techradar_blip_count',  'techradar_blip_count_shortcode' );
    add_shortcode( 'techradar_case_blips',  'techradar_case_blips_shortcode' );
}

/**
 * Fetches and caches all blips from radar.json.
 * Two-layer cache: static var (per request) + transient (across requests, 1 h).
 * Returns null if the fetch fails or the JSON is invalid.
 *
 * @return list<array{name:string,ring:string,quadrant:string,isNew:bool}>|null
 */
function techradar_fetch_blips(): ?array {
    static $blips = null;

    if ( $blips !== null ) {
        return $blips;
    }

    $cached = get_transient( 'techradar_all_blips' );
    if ( is_array( $cached ) ) {
        $blips = $cached;
        return $blips;
    }

    $settings = techradar_get_settings();
    $response = wp_remote_get( esc_url_raw( $settings['json_url'] ), [ 'timeout' => 10 ] );

    if ( is_wp_error( $response ) ) {
        return null;
    }

    $data = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( ! is_array( $data ) ) {
        return null;
    }

    $blips = $data;
    set_transient( 'techradar_all_blips', $blips, HOUR_IN_SECONDS );

    return $blips;
}

/** [techradar_blip_count]: inline blip count, auto-updated from radar.json. */
function techradar_blip_count_shortcode(): string {
    $blips = techradar_fetch_blips();
    return $blips !== null ? (string) count( $blips ) : '';
}

/**
 * [techradar_case_blips company="Acme Corp" blips="Playwright, Storybook, Component Testing"]
 *
 * Renders a card listing the named blips with their quadrant dot colour and
 * ring badge. Blip names are matched case-insensitively against radar.json.
 * Unknown names are silently skipped.
 */
function techradar_case_blips_shortcode( array $atts ): string {
    $atts = shortcode_atts(
        [ 'company' => '', 'blips' => '' ],
        $atts,
        'techradar_case_blips'
    );

    if ( empty( $atts['blips'] ) ) {
        return '';
    }

    $all_blips = techradar_fetch_blips();
    if ( $all_blips === null ) {
        return '';
    }

    // Index radar.json blips by lowercase name for O(1) lookup
    $index = [];
    foreach ( $all_blips as $b ) {
        if ( isset( $b['name'] ) ) {
            $index[ strtolower( (string) $b['name'] ) ] = $b;
        }
    }

    $names = array_filter( array_map( 'trim', explode( ',', $atts['blips'] ) ) );
    $items = '';

    foreach ( $names as $name ) {
        $blip = $index[ strtolower( $name ) ] ?? null;
        if ( ! $blip ) {
            continue;
        }

        // Mirror the JS data-loader normalisation so CSS class suffixes always match.
        // radar.json stores "Techniques", "Trial" etc.; CSS rules use lowercase slugs.
        $quadrant = esc_attr( preg_replace( '/\s+/', '-', strtolower( trim( (string) ( $blip['quadrant'] ?? '' ) ) ) ) );
        $ring     = esc_attr( strtolower( trim( (string) ( $blip['ring'] ?? '' ) ) ) );
        $label    = esc_html( (string) ( $blip['name'] ?? $name ) );
        $badge    = esc_html( ucfirst( $ring ) );

        $items .= sprintf(
            '<li class="case-radar-card__item">' .
                '<span class="case-radar-card__dot case-radar-card__dot--%s" aria-hidden="true"></span>' .
                '<span class="case-radar-card__name">%s</span>' .
                '<span class="case-radar-card__badge case-radar-card__badge--%s">%s</span>' .
            '</li>',
            $quadrant,
            $label,
            $ring,
            $badge
        );
    }

    if ( $items === '' ) {
        return '';
    }

    $company_html = $atts['company'] !== ''
        ? '<p class="case-radar-card__company">' . esc_html( $atts['company'] ) . '</p>'
        : '';

    return sprintf(
        '<div class="case-radar-card">%s<ul class="case-radar-card__list">%s</ul>' .
        '<p class="case-radar-card__footer">Relevant components from the radar</p></div>',
        $company_html,
        $items
    );
}

function techradar_enqueue_assets(): void {
    if ( ! techradar_page_has_shortcode() ) {
        return;
    }

    wp_enqueue_style(
        'techradar',
        TECHRADAR_URL . 'assets/dist/radar.css',
        [],
        TECHRADAR_VERSION
    );

    // Google Fonts: Plus Jakarta Sans
    wp_enqueue_style(
        'techradar-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap',
        [],
        null
    );

    wp_enqueue_script(
        'techradar',
        TECHRADAR_URL . 'assets/dist/radar.js',
        [],
        TECHRADAR_VERSION,
        true
    );

    // Inject runtime config before the script runs
    $settings = techradar_get_settings();
    // Values go into JSON (wp_json_encode handles encoding). Do NOT esc_html() here:
    // that would double-encode ampersands (& → &amp; in PHP, then &amp;amp; in JS).
    // URLs are the only exception: esc_url() is safe and expected for URL values.
    $config   = [
        'jsonUrl'    => esc_url( $settings['json_url'] ),
        'contactUrl' => esc_url( $settings['contact_url'] ),
        'heroTitle'            => $settings['hero_title'],
        'allBlipsSectionLabel' => $settings['all_blips_label'],
        'quadrants'  => [
            [ 'id' => 'techniques',               'title' => $settings['quadrant_1_title'], 'description' => $settings['quadrant_1_description'] ],
            [ 'id' => 'platforms',                'title' => $settings['quadrant_2_title'], 'description' => $settings['quadrant_2_description'] ],
            [ 'id' => 'tools',                    'title' => $settings['quadrant_3_title'], 'description' => $settings['quadrant_3_description'] ],
            [ 'id' => 'languages-and-frameworks', 'title' => $settings['quadrant_4_title'], 'description' => $settings['quadrant_4_description'] ],
        ],
        'rings'      => [
            [ 'id' => 'adopt',  'label' => $settings['ring_adopt_label'] ],
            [ 'id' => 'trial',  'label' => $settings['ring_trial_label'] ],
            [ 'id' => 'assess', 'label' => $settings['ring_assess_label'] ],
            [ 'id' => 'hold',   'label' => $settings['ring_hold_label'] ],
        ],
    ];

    wp_add_inline_script(
        'techradar',
        'window.TechRadarConfig = ' . wp_json_encode( $config ) . ';',
        'before'
    );
}

function techradar_page_has_shortcode(): bool {
    global $post;
    if ( ! is_a( $post, 'WP_Post' ) ) return false;
    return has_shortcode( $post->post_content, 'techradar' )
        || get_page_template_slug( $post->ID ) === 'page-templates/radar-page.php';
}

function techradar_render_shortcode( array $atts ): string {
    // $atts reserved for future per-shortcode overrides (e.g. [techradar json_url="..."])
    ob_start();
    ?>
    <div class="techradar-wrap">
        <div class="techradar-loader" aria-live="polite" aria-label="<?php esc_attr_e( 'Loading radar data', 'techradar' ); ?>">
            <div class="techradar-loader__spinner" aria-hidden="true"></div>
            <span class="techradar-loader__text"><?php esc_html_e( 'Loading radar data…', 'techradar' ); ?></span>
        </div>
        <div id="techradar-root" class="techradar-root" aria-label="<?php esc_attr_e( 'Technology Radar', 'techradar' ); ?>" role="main"></div>
    </div>
    <?php
    return ob_get_clean();
}

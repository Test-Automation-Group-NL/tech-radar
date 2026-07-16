<?php
defined( 'ABSPATH' ) || exit;

add_action( 'init', 'techradar_register_post_types' );
add_action( 'init', 'techradar_register_customer_case_cpt' );
add_action( 'add_meta_boxes', 'techradar_customer_case_meta_boxes' );
add_action( 'save_post_customer_case', 'techradar_save_customer_case_meta', 10, 2 );

function techradar_register_post_types(): void {
    register_post_type( 'use_case', [
        'labels'      => [
            'name'               => __( 'Use Cases', 'techradar-theme' ),
            'singular_name'      => __( 'Use Case', 'techradar-theme' ),
            'add_new_item'       => __( 'Add New Use Case', 'techradar-theme' ),
            'edit_item'          => __( 'Edit Use Case', 'techradar-theme' ),
            'view_item'          => __( 'View Use Case', 'techradar-theme' ),
            'search_items'       => __( 'Search Use Cases', 'techradar-theme' ),
            'not_found'          => __( 'No use cases found.', 'techradar-theme' ),
            'not_found_in_trash' => __( 'No use cases found in trash.', 'techradar-theme' ),
        ],
        'public'      => true,
        'has_archive' => true,
        'rewrite'     => [ 'slug' => 'use-cases' ],
        'supports'    => [ 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ],
        'menu_icon'   => 'dashicons-groups',
        'show_in_rest'=> true,
    ] );
}

/* ── Customer Case CPT ─────────────────────────────────────── */

function techradar_register_customer_case_cpt(): void {
    register_post_type( 'customer_case', [
        'labels'      => [
            'name'               => __( 'Customer Cases', 'techradar-theme' ),
            'singular_name'      => __( 'Customer Case', 'techradar-theme' ),
            'add_new_item'       => __( 'Add New Customer Case', 'techradar-theme' ),
            'edit_item'          => __( 'Edit Customer Case', 'techradar-theme' ),
            'view_item'          => __( 'View Customer Case', 'techradar-theme' ),
            'search_items'       => __( 'Search Customer Cases', 'techradar-theme' ),
            'not_found'          => __( 'No customer cases found.', 'techradar-theme' ),
            'not_found_in_trash' => __( 'No customer cases found in trash.', 'techradar-theme' ),
        ],
        'public'       => true,
        'has_archive'  => false,
        'rewrite'      => [ 'slug' => 'customer-cases' ],
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'menu_icon'    => 'dashicons-businessperson',
        'show_in_rest' => true,
    ] );

    foreach ( [ '_cc_industry', '_cc_summary', '_cc_pull_quote', '_cc_pull_quote_attribution', '_cc_customer_blurb', '_cc_related_blips' ] as $key ) {
        register_post_meta( 'customer_case', $key, [
            'single'        => true,
            'type'          => 'string',
            'auth_callback' => fn() => current_user_can( 'edit_posts' ),
            'show_in_rest'  => true,
        ] );
    }
}

function techradar_customer_case_meta_boxes(): void {
    add_meta_box(
        'cc_details',
        __( 'Customer Case Details', 'techradar-theme' ),
        'techradar_render_cc_meta_box',
        'customer_case',
        'normal',
        'high'
    );
}

function techradar_render_cc_meta_box( WP_Post $post ): void {
    wp_nonce_field( 'techradar_cc_meta_save', 'techradar_cc_nonce' );
    $fields = [
        '_cc_industry'               => [ 'Industry',                  'text',     'e.g. Financial Services, Maritime (comma-separated, shown with · between them)' ],
        '_cc_summary'                => [ 'Summary (hero subline)',     'textarea', 'One-paragraph company overview, shown in the hero and on the index card.' ],
        '_cc_pull_quote'             => [ 'Pull Quote',                 'textarea', 'Prominent quote displayed in the article body.' ],
        '_cc_pull_quote_attribution' => [ 'Pull Quote Attribution',     'text',     'e.g. Jane Doe, QA Lead at Acme Corp' ],
        '_cc_customer_blurb'         => [ 'Customer Blurb (sidebar)',   'textarea', 'Short company description shown in the detail sidebar.' ],
        '_cc_related_blips'          => [ 'Related Blips',              'textarea', "Comma-separated blip names, same as the shortcode blips attribute.\nExample: Playwright, Storybook, Component Testing, Visual Regression Testing" ],
    ];
    foreach ( $fields as $key => [ $label, $type, $placeholder ] ) :
        $value = (string) get_post_meta( $post->ID, $key, true );
        ?>
        <p style="margin-bottom:16px">
            <label for="<?php echo esc_attr( $key ); ?>" style="display:block;font-weight:600;margin-bottom:4px;">
                <?php echo esc_html( $label ); ?>
            </label>
            <?php if ( $type === 'textarea' ) : ?>
                <textarea id="<?php echo esc_attr( $key ); ?>"
                          name="<?php echo esc_attr( $key ); ?>"
                          rows="4"
                          placeholder="<?php echo esc_attr( $placeholder ); ?>"
                          style="width:100%;font-family:monospace;font-size:12px;line-height:1.5"
                ><?php echo esc_textarea( $value ); ?></textarea>
            <?php else : ?>
                <input type="text"
                       id="<?php echo esc_attr( $key ); ?>"
                       name="<?php echo esc_attr( $key ); ?>"
                       value="<?php echo esc_attr( $value ); ?>"
                       placeholder="<?php echo esc_attr( $placeholder ); ?>"
                       style="width:100%" />
            <?php endif; ?>
        </p>
        <?php
    endforeach;
}

function techradar_save_customer_case_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['techradar_cc_nonce'] )
        || ! wp_verify_nonce(
            sanitize_text_field( wp_unslash( $_POST['techradar_cc_nonce'] ) ),
            'techradar_cc_meta_save'
        )
    ) {
        return;
    }

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    foreach ( [ '_cc_industry', '_cc_summary', '_cc_pull_quote_attribution', '_cc_customer_blurb' ] as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
        }
    }

    foreach ( [ '_cc_pull_quote', '_cc_related_blips' ] as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) ) );
        }
    }
}

/**
 * Resolve a comma-separated list of blip names (same format as the
 * [techradar_case_blips] shortcode's `blips` attribute) against radar.json.
 *
 * Builds a lowercase-name index once per request (techradar_fetch_blips uses
 * static + transient caching), then returns one entry per recognised name.
 * Unknown names are silently skipped: keeps parity with the shortcode.
 *
 * @return list<array{blip_name:string,ring:string,quadrant:string,color:string}>
 */
function techradar_cc_resolve_blips( string $csv ): array {
    $color_map = [
        'techniques'               => 'var(--color-techniques)',
        'platforms'                => 'var(--color-platforms)',
        'tools'                    => 'var(--color-tools)',
        'languages-and-frameworks' => 'var(--color-languages)',
    ];

    $names = array_filter( array_map( 'trim', explode( ',', $csv ) ) );
    if ( empty( $names ) ) {
        return [];
    }

    $index = [];
    if ( function_exists( 'techradar_fetch_blips' ) ) {
        $all = techradar_fetch_blips();
        if ( is_array( $all ) ) {
            foreach ( $all as $b ) {
                if ( isset( $b['name'] ) ) {
                    $index[ strtolower( (string) $b['name'] ) ] = $b;
                }
            }
        }
    }

    $result = [];
    foreach ( $names as $name ) {
        $b = $index[ strtolower( $name ) ] ?? null;
        if ( ! $b ) {
            continue;
        }
        // Normalise quadrant to slug (mirrors JS data-loader + shortcode).
        $quadrant = preg_replace( '/\s+/', '-', strtolower( trim( (string) ( $b['quadrant'] ?? '' ) ) ) );
        $ring     = strtolower( trim( (string) ( $b['ring'] ?? '' ) ) );
        $result[] = [
            'blip_name' => (string) ( $b['name'] ?? $name ),
            'ring'      => $ring,
            'quadrant'  => $quadrant,
            'color'     => $color_map[ $quadrant ] ?? 'var(--color-dark-60)',
        ];
    }
    return $result;
}

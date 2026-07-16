<?php
/**
 * Homepage hero decorative radar.
 *
 * Injected via render_block (Kadence rows do not reliably host custom blocks).
 * Editor preview uses editor.css on .hero-block, no Gutenberg block required.
 */
defined( 'ABSPATH' ) || exit;

add_shortcode( 'techradar_hero_decor', 'techradar_theme_render_hero_decor' );

add_filter( 'render_block', 'techradar_theme_hero_decor_strip_legacy_block', 9, 2 );
add_filter( 'render_block', 'techradar_theme_hero_decor_inject_into_row', 10, 2 );

/**
 * Remove legacy hero-decor block markup (avoids duplicate decor + editor warning).
 */
function techradar_theme_hero_decor_strip_legacy_block( string $block_content, array $block ): string {
    if ( ( $block['blockName'] ?? '' ) === 'techradar-theme/hero-decor' ) {
        return '';
    }

    return $block_content;
}

/**
 * Prepend radar + gradients inside the homepage hero Kadence row.
 */
function techradar_theme_hero_decor_inject_into_row( string $block_content, array $block ): string {
    if ( ( $block['blockName'] ?? '' ) !== 'kadence/rowlayout' ) {
        return $block_content;
    }

    $class = $block['attrs']['className'] ?? '';
    if ( ! is_string( $class ) || strpos( $class, 'hero-block' ) === false ) {
        return $block_content;
    }

    $decor = techradar_theme_render_hero_decor();
    if ( $decor === '' ) {
        return $block_content;
    }

    // Kadence output often starts with overlay/wrappers, hero-block is not always first.
    if ( preg_match( '/(<div[^>]*\bhero-block\b[^>]*>)/i', $block_content, $matches, PREG_OFFSET_CAPTURE ) ) {
        $insert_at = $matches[0][1] + strlen( $matches[0][0] );
        return substr( $block_content, 0, $insert_at ) . $decor . substr( $block_content, $insert_at );
    }

    return $block_content;
}

function techradar_theme_render_hero_decor(): string {
    $render_file = TECHRADAR_THEME_DIR . '/blocks/hero-decor/render.php';
    if ( ! is_readable( $render_file ) ) {
        return '';
    }

    ob_start();
    include $render_file;
    return (string) ob_get_clean();
}

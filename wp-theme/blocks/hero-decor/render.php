<?php
/**
 * Server-side render: homepage hero radar decor (inline static SVG).
 *
 * @package techradar-theme
 */

defined( 'ABSPATH' ) || exit;

$svg_path = get_theme_file_path( 'assets/images/hero-radar-mini.svg' );
if ( ! is_readable( $svg_path ) ) {
    return;
}

$svg = (string) file_get_contents( $svg_path );
$svg = preg_replace( '/<\?xml[^?]*\?\>\s*/', '', $svg );
?>
<div class="hero-block__radar-wrap" aria-hidden="true">
    <?php
    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted static theme asset
    echo $svg;
    ?>
</div>
<div class="hero-block__gradient hero-block__gradient--right" aria-hidden="true"></div>
<div class="hero-block__gradient hero-block__gradient--left" aria-hidden="true"></div>

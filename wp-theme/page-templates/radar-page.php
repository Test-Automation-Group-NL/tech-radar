<?php
/**
 * Template Name: Tech Radar
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main-content" class="site-main site-main--radar">
    <?php echo do_shortcode( '[techradar]' ); ?>
</main>
<?php
get_footer();

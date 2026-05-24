<?php
/**
 * Template Name: Landing Page
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main-content" class="site-main site-main--landing">
    <?php
    // Full-width Gutenberg/Kadence Blocks content, no sidebar
    while ( have_posts() ) :
        the_post();
        the_content();
    endwhile;
    ?>
</main>
<?php
get_footer();

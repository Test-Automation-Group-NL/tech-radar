<?php
/**
 * Template Name: Customer Use Cases
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
get_header();

$use_cases = new WP_Query( [
    'post_type'      => 'use_case',
    'posts_per_page' => -1,
    'orderby'        => 'date',
    'order'          => 'DESC',
] );
?>
<main id="main-content" class="site-main site-main--use-cases">
    <div class="container">
        <h1 class="page-title"><?php the_title(); ?></h1>
        <?php the_content(); ?>

        <?php if ( $use_cases->have_posts() ) : ?>
            <div class="use-cases-grid">
                <?php while ( $use_cases->have_posts() ) : $use_cases->the_post(); ?>
                    <article class="use-case-card">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="use-case-card__logo">
                                <?php the_post_thumbnail( 'medium', [ 'alt' => get_the_title() ] ); ?>
                            </div>
                        <?php endif; ?>
                        <div class="use-case-card__content">
                            <h2 class="use-case-card__title"><?php the_title(); ?></h2>
                            <div class="use-case-card__excerpt"><?php the_excerpt(); ?></div>
                        </div>
                    </article>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
        <?php else : ?>
            <p><?php esc_html_e( 'No use cases have been published yet.', 'techradar-theme' ); ?></p>
        <?php endif; ?>
    </div>
</main>
<?php
get_footer();

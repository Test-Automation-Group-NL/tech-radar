<?php
/**
 * Template Name: Customer Cases
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
get_header();

// Capture page meta before any secondary query changes the global post.
the_post();
$page_title   = get_the_title();
$page_content = apply_filters( 'the_content', get_the_content() );

$cases      = new WP_Query( [
    'post_type'      => 'customer_case',
    'posts_per_page' => -1,
    'orderby'        => 'date',
    'order'          => 'DESC',
] );
$case_count = $cases->found_posts;
?>
<main id="main-content" class="site-main site-main--customer-cases">

    <header class="cases-hero" aria-label="<?php esc_attr_e( 'Customer Cases', 'techradar-theme' ); ?>">
        <div class="cases-hero__inner">
            <div class="cases-hero__eyebrow"><?php esc_html_e( 'Customer Cases', 'techradar-theme' ); ?></div>
            <h1 class="cases-hero__title"><?php echo esc_html( $page_title ); ?></h1>
            <?php if ( $page_content ) : ?>
                <div class="cases-hero__lead"><?php echo wp_kses_post( $page_content ); ?></div>
            <?php endif; ?>
        </div>
    </header>

    <section class="cases-body" aria-label="<?php esc_attr_e( 'Cases list', 'techradar-theme' ); ?>">
        <div class="cases-body__inner">

            <?php if ( $cases->have_posts() ) : ?>
                <div class="cases-grid<?php echo $case_count === 1 ? ' cases-grid--single' : ''; ?>">
                    <?php while ( $cases->have_posts() ) : $cases->the_post(); ?>
                        <?php
                        $industry      = (string) get_post_meta( get_the_ID(), '_cc_industry', true );
                        $summary       = (string) get_post_meta( get_the_ID(), '_cc_summary', true );
                        $raw_blips     = (string) get_post_meta( get_the_ID(), '_cc_related_blips', true );
                        $related_blips = techradar_cc_resolve_blips( $raw_blips );
                        $show_blips    = array_slice( $related_blips, 0, 4 );
                        $extra         = max( 0, count( $related_blips ) - 4 );
                        $display_text  = $summary ?: get_the_excerpt();
                        ?>
                        <article class="case-card">
                            <a href="<?php the_permalink(); ?>"
                               class="case-card__link"
                               aria-label="<?php echo esc_attr( sprintf( __( 'Read customer case: %s', 'techradar-theme' ), get_the_title() ) ); ?>">

                                <div class="case-card__top">
                                    <div class="case-card__meta">
                                        <div class="case-card__eyebrow"><?php esc_html_e( 'Customer Case', 'techradar-theme' ); ?></div>
                                        <h2 class="case-card__company"><?php the_title(); ?></h2>
                                        <?php if ( $industry ) : ?>
                                            <div class="case-card__industry">
                                                <?php echo esc_html( implode( ' · ', array_filter( array_map( 'trim', explode( ',', $industry ) ) ) ) ); ?>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                    <span class="case-card__arrow" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                </div>

                                <?php if ( $display_text ) : ?>
                                    <p class="case-card__summary"><?php echo esc_html( $display_text ); ?></p>
                                <?php endif; ?>

                                <?php if ( $show_blips ) : ?>
                                    <div class="case-card__blips">
                                        <?php foreach ( $show_blips as $blip ) : ?>
                                            <span class="case-card__pill">
                                                <span class="case-card__pill-dot"
                                                      style="background:<?php echo esc_attr( $blip['color'] ); ?>"></span>
                                                <?php echo esc_html( $blip['blip_name'] ); ?>
                                            </span>
                                        <?php endforeach; ?>
                                        <?php if ( $extra > 0 ) : ?>
                                            <span class="case-card__pill case-card__pill--more">
                                                +<?php echo esc_html( (string) $extra ); ?> more
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>

                            </a>
                        </article>
                    <?php endwhile; wp_reset_postdata(); ?>
                </div>
            <?php else : ?>
                <p class="cases-empty"><?php esc_html_e( 'No customer cases have been published yet.', 'techradar-theme' ); ?></p>
            <?php endif; ?>

            <div class="cases-cta" role="complementary" aria-label="<?php esc_attr_e( 'Share your story', 'techradar-theme' ); ?>">
                <p class="cases-cta__eyebrow"><?php esc_html_e( 'More cases coming soon', 'techradar-theme' ); ?></p>
                <h2 class="cases-cta__title"><?php esc_html_e( 'Want to share your story?', 'techradar-theme' ); ?></h2>
                <p class="cases-cta__body"><?php esc_html_e( "Working with TAG on your test automation strategy? We'd love to feature your case here.", 'techradar-theme' ); ?></p>
                <a href="<?php echo esc_url( add_query_arg( 'intent', 'case', techradar_theme_get_contact_url() ) ); ?>" class="cases-cta__button">
                    <?php esc_html_e( 'Get in touch', 'techradar-theme' ); ?>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>

        </div>
    </section>

</main>
<?php get_footer(); ?>

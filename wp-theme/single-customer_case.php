<?php
/**
 * Single template for the `customer_case` CPT.
 * Layout: dark hero strip → 1fr/280px article+sidebar grid.
 */
defined( 'ABSPATH' ) || exit;
get_header();

if ( ! have_posts() ) {
    get_footer();
    return;
}

the_post();

$industry      = (string) get_post_meta( get_the_ID(), '_cc_industry', true );
$summary       = (string) get_post_meta( get_the_ID(), '_cc_summary', true );
$pull_quote    = (string) get_post_meta( get_the_ID(), '_cc_pull_quote', true );
$attribution   = (string) get_post_meta( get_the_ID(), '_cc_pull_quote_attribution', true );
$customer_blurb = (string) get_post_meta( get_the_ID(), '_cc_customer_blurb', true );
$raw_blips     = (string) get_post_meta( get_the_ID(), '_cc_related_blips', true );
$related_blips = techradar_cc_resolve_blips( $raw_blips );

$quadrant_labels = [
    'techniques'               => 'Techniques',
    'platforms'                => 'Platforms',
    'tools'                    => 'Tools',
    'languages-and-frameworks' => 'Languages & Frameworks',
];

$cases_url = get_post_type_archive_link( 'customer_case' ) ?: techradar_theme_get_cases_url();
$radar_url = techradar_theme_get_radar_page_url();
$contact_url = techradar_theme_get_contact_url();

$industry_formatted = $industry
    ? implode( ' · ', array_filter( array_map( 'trim', explode( ',', $industry ) ) ) )
    : '';
$eyebrow = $industry_formatted
    ? sprintf(
        /* translators: %s: industry label(s) */
        esc_html__( 'Customer Case · %s', 'techradar-theme' ),
        $industry_formatted
    )
    : esc_html__( 'Customer Case', 'techradar-theme' );
?>
<main id="main-content" class="site-main site-main--customer-case">

    <header class="case-hero">
        <div class="case-hero__inner">
            <a href="<?php echo esc_url( $cases_url ); ?>" class="case-hero__back">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <?php esc_html_e( 'All cases', 'techradar-theme' ); ?>
            </a>
            <p class="case-hero__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
            <h1 class="case-hero__title">
                <?php
                printf(
                    /* translators: %s: company name */
                    esc_html__( 'About %s', 'techradar-theme' ),
                    get_the_title()
                );
                ?>
            </h1>
            <?php if ( $summary ) : ?>
                <p class="case-hero__summary"><?php echo esc_html( $summary ); ?></p>
            <?php endif; ?>
        </div>
    </header>

    <div class="case-detail">
        <div class="case-detail__inner">
            <div class="case-detail__grid">

                <article class="case-prose" aria-label="<?php echo esc_attr( get_the_title() ); ?>">
                    <?php the_content(); ?>

                    <?php if ( $pull_quote ) : ?>
                        <blockquote class="case-pull-quote">
                            <span class="case-pull-quote__mark" aria-hidden="true">&ldquo;</span>
                            <p class="case-pull-quote__text"><?php echo esc_html( $pull_quote ); ?></p>
                            <?php if ( $attribution ) : ?>
                                <cite class="case-pull-quote__attribution">
                                    <?php echo esc_html( $attribution ); ?>
                                </cite>
                            <?php endif; ?>
                        </blockquote>
                    <?php endif; ?>
                </article>

                <aside class="case-sidebar" aria-label="<?php esc_attr_e( 'About the customer', 'techradar-theme' ); ?>">

                    <div class="case-sidebar__customer">
                        <p class="case-sidebar__eyebrow"><?php esc_html_e( 'Customer', 'techradar-theme' ); ?></p>
                        <h2 class="case-sidebar__company"><?php the_title(); ?></h2>
                        <?php if ( $customer_blurb ) : ?>
                            <p class="case-sidebar__blurb"><?php echo esc_html( $customer_blurb ); ?></p>
                        <?php endif; ?>

                        <?php if ( $related_blips ) : ?>
                            <hr class="case-sidebar__divider" aria-hidden="true">
                            <p class="case-sidebar__eyebrow"><?php esc_html_e( 'Relevant Components', 'techradar-theme' ); ?></p>
                            <div class="case-sidebar__blips">
                                <?php foreach ( $related_blips as $blip ) :
                                    $focus_url = $blip['quadrant']
                                        ? add_query_arg( 'focus', rawurlencode( $blip['quadrant'] ), $radar_url )
                                        : $radar_url;
                                    if ( ! empty( $blip['blip_name'] ) ) {
                                        $blip_slug = preg_replace( '/[^a-z0-9]+/', '-', strtolower( $blip['blip_name'] ) );
                                        $blip_slug = trim( $blip_slug, '-' );
                                        if ( $blip_slug ) {
                                            $focus_url .= '#' . $blip_slug;
                                        }
                                    }
                                    $quadrant_label = $quadrant_labels[ $blip['quadrant'] ] ?? ucfirst( $blip['quadrant'] );
                                ?>
                                    <a href="<?php echo esc_url( $focus_url ); ?>"
                                       class="case-sidebar__blip"
                                       style="--blip-color:<?php echo esc_attr( $blip['color'] ); ?>">
                                        <span class="case-sidebar__blip-dot" style="background:<?php echo esc_attr( $blip['color'] ); ?>"></span>
                                        <span class="case-sidebar__blip-info">
                                            <span class="case-sidebar__blip-name"><?php echo esc_html( $blip['blip_name'] ); ?></span>
                                            <?php if ( $quadrant_label ) : ?>
                                                <span class="case-sidebar__blip-quadrant"><?php echo esc_html( $quadrant_label ); ?></span>
                                            <?php endif; ?>
                                        </span>
                                        <?php if ( $blip['ring'] ) : ?>
                                            <span class="case-sidebar__ring case-sidebar__ring--<?php echo esc_attr( $blip['ring'] ); ?>">
                                                <?php echo esc_html( ucfirst( $blip['ring'] ) ); ?>
                                            </span>
                                        <?php endif; ?>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="case-sidebar__help">
                        <p class="case-sidebar__help-eyebrow"><?php esc_html_e( 'Need help?', 'techradar-theme' ); ?></p>
                        <h3 class="case-sidebar__help-title"><?php esc_html_e( 'Stuck in the test tool landscape?', 'techradar-theme' ); ?></h3>
                        <p class="case-sidebar__help-body"><?php esc_html_e( 'Our experts help you discover which tools truly fit your organization and goals.', 'techradar-theme' ); ?></p>
                        <a href="<?php echo esc_url( add_query_arg( 'intent', 'help', $contact_url ) ); ?>" class="case-sidebar__help-cta">
                            <?php esc_html_e( 'Get in touch', 'techradar-theme' ); ?>
                            &rarr;
                        </a>
                    </div>

                </aside>

            </div>
        </div>
    </div>

    <div class="cases-body">
        <div class="cases-body__inner">
            <div class="cases-cta">
                <p class="cases-cta__eyebrow"><?php esc_html_e( 'Your turn', 'techradar-theme' ); ?></p>
                <h2 class="cases-cta__title"><?php esc_html_e( 'Want to share your story?', 'techradar-theme' ); ?></h2>
                <p class="cases-cta__body"><?php esc_html_e( "If you've used the TechRadar guidance in practice, we'd love to feature your team. A short outline is all it takes to get started.", 'techradar-theme' ); ?></p>
                <a href="<?php echo esc_url( add_query_arg( 'intent', 'case', $contact_url ) ); ?>" class="cases-cta__button">
                    <?php esc_html_e( 'Share your story', 'techradar-theme' ); ?> &rarr;
                </a>
            </div>
        </div>
    </div>

</main>
<?php get_footer(); ?>

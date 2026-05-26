<?php
/**
 * Template Name: Contact
 * Template Post Type: page
 *
 * Multi-intent contact hub. Active intent driven by ?intent= query param.
 * PHP renders the correct panel; JS enhances picker switching + URL sync.
 */
defined( 'ABSPATH' ) || exit;
get_header();

// Capture page meta before rendering (hero copy comes from the block editor).
the_post();
$page_title   = get_the_title();
$page_content = apply_filters( 'the_content', get_the_content() );

$valid_intents  = [ 'pdf', 'help', 'partner', 'case' ];
$valid_partners = [ 'detesters', 'testcoders', 'techchamps' ];

$initial_intent  = ( isset( $_GET['intent'] ) && in_array( $_GET['intent'], $valid_intents, true ) )
    ? sanitize_key( $_GET['intent'] ) : 'pdf';
$initial_partner = ( isset( $_GET['partner'] ) && in_array( $_GET['partner'], $valid_partners, true ) )
    ? sanitize_key( $_GET['partner'] ) : '';

$settings = function_exists( 'techradar_get_settings' ) ? techradar_get_settings() : [];

$form_ids = [
    'pdf'     => sanitize_text_field( $settings['contact_form_id_pdf']     ?? '' ),
    'help'    => sanitize_text_field( $settings['contact_form_id_help']    ?? '' ),
    'partner' => sanitize_text_field( $settings['contact_form_id_partner'] ?? '' ),
    'case'    => sanitize_text_field( $settings['contact_form_id_case']    ?? '' ),
];

$intents = [
    'pdf'     => [
        'badge' => '01',
        'title' => __( 'Get the TechRadar PDF', 'techradar-theme' ),
        'desc'  => __( 'Download the full 2025 report. Your details help us tailor follow-ups to your context.', 'techradar-theme' ),
        'intro' => __( 'A few details so we can send the right version and stay in touch about new editions.', 'techradar-theme' ),
        'color' => 'var(--color-platforms)',
    ],
    'help'    => [
        'badge' => '02',
        'title' => __( 'Help navigating the TechRadar', 'techradar-theme' ),
        'desc'  => __( 'Book a working session, our experts translate the radar into practical steps for your team.', 'techradar-theme' ),
        'intro' => __( "Tell us about your context. We'll match you with the right expert and propose a working session.", 'techradar-theme' ),
        'color' => 'var(--color-techniques)',
    ],
    'partner' => [
        'badge' => '03',
        'title' => __( 'Question for one of our partners', 'techradar-theme' ),
        'desc'  => __( 'Reach deTesters, TestCoders, or TechChamps directly: pick the team that fits.', 'techradar-theme' ),
        'intro' => __( "Pick the partner you'd like to reach. Each team has its own specialism, and we'll route this directly to them.", 'techradar-theme' ),
        'color' => 'var(--color-languages)',
    ],
    'case'    => [
        'badge' => '04',
        'title' => __( 'Share your story', 'techradar-theme' ),
        'desc'  => __( 'Working with TAG and want to be featured in a future customer case? Tell us a bit about it.', 'techradar-theme' ),
        'intro' => __( "A short outline is enough to start. We'll schedule a call to dig in and co-write the case study with you.", 'techradar-theme' ),
        'color' => 'var(--color-tools)',
    ],
];

$partners_data = [
    'detesters'  => [
        'name'  => 'deTesters',
        'email' => 'info@detesters.nl',
        'site'  => 'https://www.detesters.nl',
        'img'   => 'logo-detesters-color.png',
    ],
    'testcoders' => [
        'name'  => 'TestCoders',
        'email' => 'info@testcoders.nl',
        'site'  => 'https://www.testcoders.nl',
        'img'   => 'logo-testcoders-color.png',
    ],
    'techchamps' => [
        'name'  => 'TechChamps',
        'email' => 'info@techchamps.io',
        'site'  => 'https://www.techchamps.io',
        'img'   => 'logo-techchamps-color.png',
    ],
];

$theme_uri   = get_template_directory_uri();
$privacy_url = get_privacy_policy_url();
?>
<main id="main-content" class="site-main site-main--contact">

    <header class="contact-hero" aria-label="<?php esc_attr_e( 'Contact', 'techradar-theme' ); ?>">
        <div class="contact-hero__inner">
            <p class="contact-hero__eyebrow"><?php esc_html_e( 'Get in touch', 'techradar-theme' ); ?></p>
            <h1 class="contact-hero__title"><?php echo esc_html( $page_title ); ?></h1>
            <?php if ( $page_content ) : ?>
                <div class="contact-hero__lead"><?php echo wp_kses_post( $page_content ); ?></div>
            <?php else : ?>
                <p class="contact-hero__lead"><?php esc_html_e( 'Pick the option that fits best: each routes your message to the right team and asks for the details we need to be useful.', 'techradar-theme' ); ?></p>
            <?php endif; ?>
        </div>
    </header>

    <section class="contact-body">
        <div class="contact-body__inner">

            <!-- ── Intent picker ── -->
            <div
                class="contact-picker"
                role="tablist"
                aria-label="<?php esc_attr_e( 'Contact intent', 'techradar-theme' ); ?>"
            >
                <?php foreach ( $intents as $id => $intent ) :
                    $is_active = ( $id === $initial_intent );
                ?>
                <button
                    type="button"
                    class="contact-picker__card<?php echo $is_active ? ' contact-picker__card--active' : ''; ?>"
                    role="tab"
                    aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>"
                    aria-controls="contact-panel-<?php echo esc_attr( $id ); ?>"
                    data-intent="<?php echo esc_attr( $id ); ?>"
                    style="--intent-color:<?php echo esc_attr( $intent['color'] ); ?>"
                >
                    <div class="contact-picker__accent" aria-hidden="true"></div>
                    <div class="contact-picker__card-top">
                        <span class="contact-picker__badge"><?php echo esc_html( $intent['badge'] ); ?></span>
                        <span class="contact-picker__check" aria-hidden="true">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <path d="M2 5.5l2 2 5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </div>
                    <div class="contact-picker__title"><?php echo esc_html( $intent['title'] ); ?></div>
                    <div class="contact-picker__desc"><?php echo esc_html( $intent['desc'] ); ?></div>
                </button>
                <?php endforeach; ?>
            </div>

            <!-- ── Form area + sidebar ── -->
            <div class="contact-body__grid">

                <div class="contact-forms-area">
                    <?php foreach ( $intents as $id => $intent ) :
                        $is_active = ( $id === $initial_intent );
                    ?>
                    <div
                        class="contact-form-wrap<?php echo $is_active ? ' contact-form-wrap--active' : ''; ?>"
                        data-intent="<?php echo esc_attr( $id ); ?>"
                        id="contact-panel-<?php echo esc_attr( $id ); ?>"
                        role="tabpanel"
                        <?php echo $is_active ? '' : 'hidden'; ?>
                    >
                        <header class="contact-form-wrap__head">
                            <span class="contact-form-wrap__badge"><?php echo esc_html( $intent['badge'] ); ?></span>
                            <h2 class="contact-form-wrap__title"><?php echo esc_html( $intent['title'] ); ?></h2>
                        </header>
                        <p class="contact-form-wrap__intro"><?php echo esc_html( $intent['intro'] ); ?></p>

                        <?php if ( $id === 'partner' ) : ?>
                        <div
                            class="contact-partner-picker"
                            role="group"
                            aria-label="<?php esc_attr_e( 'Pick a partner', 'techradar-theme' ); ?>"
                        >
                            <?php foreach ( $partners_data as $pid => $partner ) :
                                $is_picked = ( $pid === $initial_partner );
                            ?>
                            <button
                                type="button"
                                class="contact-partner-picker__card<?php echo $is_picked ? ' contact-partner-picker__card--active' : ''; ?>"
                                data-partner="<?php echo esc_attr( $pid ); ?>"
                                aria-pressed="<?php echo $is_picked ? 'true' : 'false'; ?>"
                                style="--partner-color:var(--color-partner-<?php echo esc_attr( $pid ); ?>)"
                            >
                                <img
                                    src="<?php echo esc_url( $theme_uri . '/assets/images/branding/' . $partner['img'] ); ?>"
                                    alt="<?php echo esc_attr( $partner['name'] ); ?>"
                                    height="36"
                                    loading="lazy"
                                >
                                <span class="contact-partner-picker__email"><?php echo esc_html( $partner['email'] ); ?></span>
                            </button>
                            <?php endforeach; ?>
                        </div>
                        <?php endif; ?>

                        <?php if ( $form_ids[ $id ] ) : ?>
                            <?php echo do_shortcode( "[contact-form-7 id='{$form_ids[$id]}']" ); ?>
                        <?php else : ?>
                            <p class="contact-form-wrap__notice">
                                <em><?php
                                    printf(
                                        /* translators: %s: intent id */
                                        esc_html__( 'Form not configured. Go to Settings → Tech Radar → Contact Forms and set the CF7 form ID for the "%s" intent.', 'techradar-theme' ),
                                        esc_html( $id )
                                    );
                                ?></em>
                            </p>
                        <?php endif; ?>

                        <?php if ( $privacy_url ) : ?>
                        <p class="contact-form-wrap__privacy">
                            <?php
                            printf(
                                /* translators: %s: privacy policy URL */
                                wp_kses(
                                    __( 'Your data is handled in accordance with our <a href="%s">privacy policy</a>.', 'techradar-theme' ),
                                    [ 'a' => [ 'href' => [] ] ]
                                ),
                                esc_url( $privacy_url )
                            );
                            ?>
                        </p>
                        <?php endif; ?>
                    </div>
                    <?php endforeach; ?>
                </div>

                <!-- Sidebar -->
                <aside class="contact-sidebar" aria-label="<?php esc_attr_e( 'Reach us directly', 'techradar-theme' ); ?>">

                    <div class="contact-sidebar__invite">
                        <p class="contact-sidebar__invite-eyebrow"><?php esc_html_e( 'Prefer email?', 'techradar-theme' ); ?></p>
                        <h3 class="contact-sidebar__invite-title"><?php esc_html_e( 'Reach a partner directly', 'techradar-theme' ); ?></h3>
                        <p class="contact-sidebar__invite-body"><?php esc_html_e( 'Skip the form and email the team that best matches what you need.', 'techradar-theme' ); ?></p>
                    </div>

                    <ul class="contact-sidebar__partners" role="list">
                        <?php foreach ( $partners_data as $pid => $partner ) : ?>
                        <li class="contact-partner-card" data-partner="<?php echo esc_attr( $pid ); ?>">
                            <div class="contact-partner-card__top">
                                <div class="contact-partner-card__logo">
                                    <img
                                        src="<?php echo esc_url( $theme_uri . '/assets/images/branding/' . $partner['img'] ); ?>"
                                        alt="<?php echo esc_attr( $partner['name'] ); ?>"
                                        height="36"
                                        loading="lazy"
                                    >
                                </div>
                                <div class="contact-partner-card__dot" aria-hidden="true"></div>
                            </div>
<div class="contact-partner-card__links">
                                <a href="mailto:<?php echo esc_attr( $partner['email'] ); ?>" class="contact-partner-card__email">
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                        <rect x="1" y="2.5" width="11" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                                        <path d="M1 5l5.5 3.5L12 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <?php echo esc_html( $partner['email'] ); ?>
                                </a>
                                <a href="<?php echo esc_url( $partner['site'] ); ?>" target="_blank" rel="noopener noreferrer" class="contact-partner-card__website">
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                        <path d="M5.5 2.5H2.5a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M8.5 1.5h3v3M11.5 1.5L7 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <?php echo esc_html( str_replace( 'https://', '', $partner['site'] ) ); ?>
                                </a>
                            </div>
                        </li>
                        <?php endforeach; ?>
                    </ul>

                </aside>

            </div>
        </div>
    </section>

</main>
<?php get_footer(); ?>

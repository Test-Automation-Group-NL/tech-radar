<?php
defined( 'ABSPATH' ) || exit;

$settings     = function_exists( 'techradar_get_settings' ) ? techradar_get_settings() : [];
$sofius_show  = $settings['sofius_show'] ?? true;
$sofius_url   = $settings['sofius_url']  ?? 'https://www.sofius.com';
$theme_uri    = get_template_directory_uri();
$footer_logo  = $theme_uri . '/assets/images/branding/techradar-wordmark.png';
$sofius_logo  = $theme_uri . '/assets/images/branding/sofius-logo-white.svg';

$partner_logos = [
    [
        'name' => 'deTesters',
        'url'  => 'https://www.detesters.nl/',
        'file' => 'partner-detesters@2x.png',
        'w'    => 1826,
        'h'    => 778,
    ],
    [
        'name' => 'TestCoders',
        'url'  => 'https://www.testcoders.nl/',
        'file' => 'partner-testcoders@2x.png',
        'w'    => 1800,
        'h'    => 722,
    ],
    [
        'name'      => 'TechChamps',
        'url'       => 'https://www.techchamps.io/',
        'file'      => 'partner-techchamps@2x.png',
        'w'         => 1800,
        'h'         => 1090,
        'logo_tall' => true,
    ],
];
?>
<footer class="site-footer" role="contentinfo">
    <div class="site-footer__inner">
        <div class="site-footer__grid">
            <div class="site-footer__col site-footer__col--brand">
                <a class="site-footer__brand-mark" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <img
                        class="site-footer__wordmark"
                        src="<?php echo esc_url( $footer_logo ); ?>"
                        width="678"
                        height="331"
                        alt="<?php echo esc_attr( __( 'Test Automation TechRadar', 'techradar-theme' ) ); ?>"
                        decoding="async"
                    />
                </a>
                <p class="site-footer__intro">
                    <?php esc_html_e( 'Choose wiser, test smarter.', 'techradar-theme' ); ?><br />
                    <?php esc_html_e( 'Built by 60+ test automation experts.', 'techradar-theme' ); ?>
                </p>
            </div>

            <div class="site-footer__col site-footer__col--nav">
                <p class="site-footer__heading"><?php esc_html_e( 'Navigate', 'techradar-theme' ); ?></p>
                <nav class="site-footer__nav" aria-label="<?php esc_attr_e( 'Footer navigation', 'techradar-theme' ); ?>">
                    <?php
                    wp_nav_menu(
                        [
                            'theme_location' => 'footer',
                            'menu_class'     => 'site-footer__menu',
                            'container'      => false,
                            'fallback_cb'    => 'techradar_theme_footer_nav_fallback',
                            'depth'          => 1,
                        ]
                    );
                    ?>
                </nav>
            </div>

            <div class="site-footer__col site-footer__col--tag">
                <p class="site-footer__heading"><?php esc_html_e( 'Made by TAG', 'techradar-theme' ); ?></p>
                <div class="site-footer__partner-logos">
                    <?php foreach ( $partner_logos as $partner ) : ?>
                        <a
                            href="<?php echo esc_url( $partner['url'] ); ?>"
                            class="site-footer__partner-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                class="site-footer__partner-logo<?php echo ! empty( $partner['logo_tall'] ) ? ' site-footer__partner-logo--tall' : ''; ?>"
                                src="<?php echo esc_url( $theme_uri . '/assets/images/branding/' . $partner['file'] ); ?>"
                                width="<?php echo (int) $partner['w']; ?>"
                                height="<?php echo (int) $partner['h']; ?>"
                                alt="<?php echo esc_attr( $partner['name'] ); ?>"
                                decoding="async"
                            />
                        </a>
                    <?php endforeach; ?>
                </div>
                <?php if ( $sofius_show ) : ?>
                    <a
                        class="site-footer__sofius-link"
                        href="<?php echo esc_url( $sofius_url ); ?>"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="<?php esc_attr_e( 'Part of Sofius', 'techradar-theme' ); ?>"
                    >
                        <span class="site-footer__sofius-text"><?php esc_html_e( 'Part of', 'techradar-theme' ); ?></span>
                        <img
                            class="site-footer__sofius-logo"
                            src="<?php echo esc_url( $sofius_logo ); ?>"
                            width="528"
                            height="156"
                            alt=""
                            aria-hidden="true"
                            decoding="async"
                        />
                    </a>
                <?php endif; ?>
            </div>
        </div>

        <div class="site-footer__divider" role="presentation"></div>

        <p class="site-footer__legal">
            <?php
            printf(
                /* translators: %s: current year (four digits). */
                esc_html__( '© %s TAG: Test Automation Group. All rights reserved.', 'techradar-theme' ),
                esc_html( wp_date( 'Y' ) )
            );
            ?>
        </p>
    </div>
</footer>

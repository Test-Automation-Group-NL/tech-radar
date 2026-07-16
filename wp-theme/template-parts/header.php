<?php
defined( 'ABSPATH' ) || exit;

$home_url  = home_url( '/' );
$theme_uri = get_template_directory_uri();
$wordmark  = $theme_uri . '/assets/images/branding/techradar-wordmark.png';
?>
<header class="site-header" role="banner">
    <div class="site-header__inner">
        <a class="site-header__brand" href="<?php echo esc_url( $home_url ); ?>" aria-label="<?php echo esc_attr( __( 'TechRadar: Home', 'techradar-theme' ) ); ?>">
            <img
                class="site-header__wordmark"
                src="<?php echo esc_url( $wordmark ); ?>"
                width="678"
                height="331"
                alt="<?php echo esc_attr( __( 'Test Automation TechRadar', 'techradar-theme' ) ); ?>"
                decoding="async"
            />
            <span class="site-header__logo-tagline"><?php esc_html_e( 'Choose wiser, test smarter', 'techradar-theme' ); ?></span>
        </a>

        <nav id="primary-nav" class="site-header__nav" role="navigation" aria-label="<?php esc_attr_e( 'Primary', 'techradar-theme' ); ?>">
            <?php
            wp_nav_menu(
                [
                    'theme_location' => 'primary',
                    'menu_class'     => 'site-header__menu',
                    'container'      => false,
                    'fallback_cb'    => 'techradar_theme_primary_nav_fallback',
                    'depth'          => 1,
                ]
            );
            ?>
        </nav>

        <a
            class="pdf-popup__trigger pdf-popup__trigger--header"
            href="<?php echo esc_url( add_query_arg( 'intent', 'pdf', techradar_theme_get_contact_url() ) ); ?>"
        >
            <span class="pdf-popup__trigger-icon" aria-hidden="true">&#128196;</span>
            <span class="pdf-popup__trigger-label"><?php esc_html_e( 'Get a copy', 'techradar-theme' ); ?></span>
        </a>
    </div>
</header>

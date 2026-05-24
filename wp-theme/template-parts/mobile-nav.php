<?php
defined( 'ABSPATH' ) || exit;

$home    = home_url( '/' );
$radar   = techradar_theme_get_radar_page_url();
$cases   = techradar_theme_get_cases_url();
$contact = techradar_theme_get_contact_url();

$home_active    = is_front_page();
$radar_active   = is_page_template( 'page-templates/radar-page.php' );
$cases_active   = is_page_template( 'page-templates/customer-cases.php' )
    || is_singular( 'customer_case' )
    || is_post_type_archive( 'customer_case' );
$contact_active = is_page_template( 'page-templates/contact.php' ) || is_page( 'contact' );
?>
<nav class="site-bottom-nav" aria-label="<?php esc_attr_e( 'Mobile navigation', 'techradar-theme' ); ?>">

    <a class="site-bottom-nav__item<?php echo $home_active ? ' is-active' : ''; ?>"
       href="<?php echo esc_url( $home ); ?>"
       <?php echo $home_active ? 'aria-current="page"' : ''; ?>>
        <svg class="site-bottom-nav__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
            <path d="M9 21v-7h6v7" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
        </svg>
        <span><?php esc_html_e( 'Home', 'techradar-theme' ); ?></span>
    </a>

    <a class="site-bottom-nav__item<?php echo $radar_active ? ' is-active' : ''; ?>"
       href="<?php echo esc_url( $radar ); ?>"
       <?php echo $radar_active ? 'aria-current="page"' : ''; ?>>
        <svg class="site-bottom-nav__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75"/>
            <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            <line x1="12" y1="18" x2="12" y2="21" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            <line x1="3" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            <line x1="18" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        </svg>
        <span><?php esc_html_e( 'Radar', 'techradar-theme' ); ?></span>
    </a>

    <a class="site-bottom-nav__item<?php echo $cases_active ? ' is-active' : ''; ?>"
       href="<?php echo esc_url( $cases ); ?>"
       <?php echo $cases_active ? 'aria-current="page"' : ''; ?>>
        <svg class="site-bottom-nav__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <rect x="2" y="8" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.75"/>
            <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
            <line x1="2" y1="14" x2="22" y2="14" stroke="currentColor" stroke-width="1.75"/>
        </svg>
        <span><?php esc_html_e( 'Cases', 'techradar-theme' ); ?></span>
    </a>

    <a class="site-bottom-nav__item<?php echo $contact_active ? ' is-active' : ''; ?>"
       href="<?php echo esc_url( $contact ); ?>"
       <?php echo $contact_active ? 'aria-current="page"' : ''; ?>>
        <svg class="site-bottom-nav__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.75"/>
            <path d="M2 8l10 7 10-7" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
        </svg>
        <span><?php esc_html_e( 'Contact', 'techradar-theme' ); ?></span>
    </a>

</nav>

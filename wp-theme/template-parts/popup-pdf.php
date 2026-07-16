<?php
defined( 'ABSPATH' ) || exit;

$pdf_url = add_query_arg( 'intent', 'pdf', techradar_theme_get_contact_url() );
?>
<div class="pdf-popup">
    <a class="pdf-popup__trigger pdf-popup__trigger--float" href="<?php echo esc_url( $pdf_url ); ?>">
        <span class="pdf-popup__trigger-icon" aria-hidden="true">&#128196;</span>
        <span class="pdf-popup__trigger-label"><?php esc_html_e( 'Get a copy', 'techradar-theme' ); ?></span>
    </a>
</div>

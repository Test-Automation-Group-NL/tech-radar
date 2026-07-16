<?php
/**
 * Template part: Privacy policy, "Still have questions?" CTA block.
 *
 * Included at the bottom of the privacy-content article by
 * page-templates/privacy.php.
 */
defined( 'ABSPATH' ) || exit;

$contact_url = function_exists( 'techradar_theme_get_contact_url' )
	? techradar_theme_get_contact_url()
	: home_url( '/contact/' );
?>
<aside class="privacy-cta" aria-label="<?php esc_attr_e( 'Privacy contact', 'techradar-theme' ); ?>">
	<div class="privacy-cta__copy">
		<h3 class="privacy-cta__title"><?php esc_html_e( 'Still have questions?', 'techradar-theme' ); ?></h3>
		<p class="privacy-cta__lead"><?php esc_html_e( "Privacy isn't a checkbox for us. If anything on this page is unclear, or you'd like more detail on a specific processing activity, we'll get back to you within one business day.", 'techradar-theme' ); ?></p>
	</div>
	<a class="privacy-cta__btn"
	   href="<?php echo esc_url( add_query_arg( 'intent', 'help', $contact_url ) ); ?>">
		<?php esc_html_e( 'Ask a privacy question', 'techradar-theme' ); ?>
		<span class="privacy-cta__btn-arrow" aria-hidden="true">&#8594;</span>
	</a>
</aside>

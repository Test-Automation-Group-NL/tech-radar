<?php
/**
 * Template Name: Privacy Policy
 * Template Post Type: page
 *
 * Renders the privacy hero chrome + sticky TOC sidebar and lets Gutenberg own
 * the legal body. Every <h2 id="..."> in the editor becomes a TOC entry
 * automatically via techradar_theme_extract_toc().
 */
defined( 'ABSPATH' ) || exit;
get_header();
the_post();

$page_title   = get_the_title();
$page_lead    = get_the_excerpt();
$page_content = apply_filters( 'the_content', get_the_content() );

// Hero metadata: update these when the policy version changes.
$meta = [
	'effective'    => __( '15 May 2026', 'techradar-theme' ),
	'updated'      => get_the_modified_date( 'j F Y' ),
	'version'      => __( '2.1', 'techradar-theme' ),
	'jurisdiction' => __( 'EU · NL', 'techradar-theme' ),
	'controllers'  => __( 'deTesters · TestCoders · TechChamps', 'techradar-theme' ),
];

// Build TOC from <h2 id="..."> headings in the editor content.
$toc = techradar_theme_extract_toc( $page_content );
?>
<main id="primary" class="site-main site-main--privacy" data-pum-skip>

	<header class="privacy-hero">
		<div class="privacy-hero__inner">
			<div class="privacy-hero__copy">
				<p class="privacy-hero__eyebrow">
					<span class="privacy-hero__eyebrow-dot" aria-hidden="true"></span>
					<?php esc_html_e( 'Legal · GDPR compliant', 'techradar-theme' ); ?>
				</p>
				<h1 class="privacy-hero__title"><?php echo wp_kses_post( $page_title ); ?></h1>
				<?php if ( $page_lead ) : ?>
					<p class="privacy-hero__lead"><?php echo esc_html( $page_lead ); ?></p>
				<?php endif; ?>
			</div>

			<aside class="privacy-hero__meta" aria-label="<?php esc_attr_e( 'Policy metadata', 'techradar-theme' ); ?>">
				<dl>
					<div>
						<dt><?php esc_html_e( 'Effective', 'techradar-theme' ); ?></dt>
						<dd><?php echo esc_html( $meta['effective'] ); ?></dd>
					</div>
					<div>
						<dt><?php esc_html_e( 'Last updated', 'techradar-theme' ); ?></dt>
						<dd><?php echo esc_html( $meta['updated'] ); ?></dd>
					</div>
					<div>
						<dt><?php esc_html_e( 'Version', 'techradar-theme' ); ?></dt>
						<dd><?php echo esc_html( $meta['version'] ); ?></dd>
					</div>
					<div>
						<dt><?php esc_html_e( 'Jurisdiction', 'techradar-theme' ); ?></dt>
						<dd><?php echo esc_html( $meta['jurisdiction'] ); ?></dd>
					</div>
					<div class="full">
						<dt><?php esc_html_e( 'Data controllers', 'techradar-theme' ); ?></dt>
						<dd><?php echo esc_html( $meta['controllers'] ); ?></dd>
					</div>
				</dl>
			</aside>
		</div>
	</header>

	<section class="privacy-body">
		<div class="privacy-body__inner">

			<?php if ( $toc ) : ?>
			<!--
				<details> without `open` collapses on mobile (native toggle).
				CSS forces the TOC visible on desktop via display: block !important
				and hides the summary. No JS needed for the open/close behaviour.
			-->
			<details class="privacy-toc-collapse" open>
				<summary><?php esc_html_e( 'On this page', 'techradar-theme' ); ?></summary>
				<aside class="privacy-toc" aria-label="<?php esc_attr_e( 'On this page', 'techradar-theme' ); ?>">
					<div class="privacy-toc__label"><?php esc_html_e( 'On this page', 'techradar-theme' ); ?></div>
					<ol>
						<?php foreach ( $toc as $entry ) : ?>
							<li>
								<a href="#<?php echo esc_attr( $entry['id'] ); ?>">
									<?php echo esc_html( $entry['text'] ); ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ol>
				</aside>
			</details>
			<?php endif; ?>

			<article class="privacy-content">
				<?php echo $page_content; // already run through apply_filters( 'the_content' ) ?>
				<?php get_template_part( 'template-parts/privacy', 'cta' ); ?>
			</article>

		</div>
	</section>

</main>
<?php get_footer(); ?>

<?php
defined( 'ABSPATH' ) || exit;

$privacy_url = get_privacy_policy_url();
?>
<div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="<?php esc_attr_e( 'Cookie consent', 'techradar-theme' ); ?>" hidden>
    <div class="cookie-banner__inner">
        <p class="cookie-banner__text">
            <?php esc_html_e( 'We use cookies to improve your experience and analyse site usage.', 'techradar-theme' ); ?>
            <?php if ( $privacy_url ) : ?>
                <a href="<?php echo esc_url( $privacy_url ); ?>"><?php esc_html_e( 'Read our privacy policy', 'techradar-theme' ); ?></a>.
            <?php endif; ?>
        </p>
        <div class="cookie-banner__actions">
            <button id="cookie-accept" class="cookie-banner__btn cookie-banner__btn--accept">
                <?php esc_html_e( 'Accept', 'techradar-theme' ); ?>
            </button>
            <button id="cookie-decline" class="cookie-banner__btn cookie-banner__btn--decline">
                <?php esc_html_e( 'Decline', 'techradar-theme' ); ?>
            </button>
        </div>
    </div>
</div>


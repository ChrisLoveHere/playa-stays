<?php
/**
 * Site settings / options (scaffold only — no full admin UI yet).
 *
 * Future: phone, whatsapp, email, address, trust stats, social links exposed via REST or options.
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Option key for grouped headless settings. */
const PLAYASTAYS_HEADLESS_OPTION_KEY = 'playastays_headless_settings';

/**
 * Default structure for settings (extend as needed).
 *
 * @return array<string, mixed>
 */
function playastays_headless_default_settings() {
	return array(
		'phone'   => '',
		'whatsapp' => '',
		'email'   => '',
		'address' => '',
		// Trust stats (placeholders).
		'trust_properties_count' => '',
		'trust_years'            => '',
		// Social (placeholders — URLs or handles as strings).
		'social_facebook'  => '',
		'social_instagram' => '',
		'social_linkedin'  => '',
	);
}

/**
 * Register settings with WordPress (Settings API scaffold).
 * Full admin UI: TODO.
 */
function playastays_headless_register_settings() {
	register_setting(
		'playastays_headless',
		PLAYASTAYS_HEADLESS_OPTION_KEY,
		array(
			'type'              => 'array',
			'description'       => 'PlayaStays headless public site settings.',
			'sanitize_callback' => 'playastays_headless_sanitize_settings',
			'default'           => playastays_headless_default_settings(),
			'show_in_rest'      => false, // TODO: custom REST route for public config when ready.
		)
	);
}

/**
 * Sanitize settings array on save.
 *
 * @param mixed $value Raw option value.
 * @return array<string, mixed>
 */
function playastays_headless_sanitize_settings( $value ) {
	$defaults = playastays_headless_default_settings();
	if ( ! is_array( $value ) ) {
		return $defaults;
	}
	$out = array();
	foreach ( $defaults as $key => $default ) {
		$raw = isset( $value[ $key ] ) ? $value[ $key ] : $default;
		if ( 'email' === $key ) {
			$out[ $key ] = sanitize_email( (string) $raw );
		} elseif ( strpos( $key, 'social_' ) === 0 ) {
			$url = esc_url_raw( (string) $raw );
			$out[ $key ] = $url ? $url : sanitize_text_field( (string) $raw );
		} else {
			$out[ $key ] = sanitize_text_field( (string) $raw );
		}
	}
	return $out;
}

/**
 * Get merged settings (for future REST exposure).
 *
 * @return array<string, mixed>
 */
function playastays_headless_get_settings() {
	$stored = get_option( PLAYASTAYS_HEADLESS_OPTION_KEY, array() );
	if ( ! is_array( $stored ) ) {
		$stored = array();
	}
	return wp_parse_args( $stored, playastays_headless_default_settings() );
}

<?php
/**
 * Post meta registration (REST-visible examples; extend by object type).
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register meta for REST.
 */
function playastays_headless_register_meta() {
	$string_args = array(
		'show_in_rest'       => true,
		'single'             => true,
		'type'               => 'string',
		'sanitize_callback'  => 'sanitize_text_field',
		// Public marketing copy; readable in REST for published posts. TODO: split sensitive meta with stricter auth.
		'auth_callback'      => '__return_true',
	);

	// Cities / services / properties: bilingual market notes (example fields).
	foreach ( array( 'ps_city', 'ps_service', 'properties' ) as $post_type ) {
		register_post_meta( $post_type, 'ps_market_note', $string_args );
		register_post_meta( $post_type, 'ps_market_note_es', $string_args );
	}

	// Service canonical slug for headless routing (EN slug).
	register_post_meta( 'ps_service', 'ps_service_slug', $string_args );

	// Hero lines (example).
	foreach ( array( 'ps_service', 'ps_city' ) as $post_type ) {
		register_post_meta( $post_type, 'ps_hero_headline', $string_args );
		register_post_meta( $post_type, 'ps_hero_headline_es', $string_args );
	}

	// FAQ answers (question often in title/content).
	register_post_meta( 'ps_faq', 'ps_answer', $string_args );
	register_post_meta( 'ps_faq', 'ps_answer_es', $string_args );

	// TODO: register remaining fields (SEO, CTAs, property details) in groups as the schema stabilizes.
}

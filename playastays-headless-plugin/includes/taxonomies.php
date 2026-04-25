<?php
/**
 * Custom taxonomies (placeholders for city tagging and future relationships).
 *
 * The Next.js frontend may expect a taxonomy slug aligned with existing content;
 * this uses ps_city_tag as a simple shared tag for services/FAQs/properties by city.
 * Adjust slugs in a later iteration if WP content already uses different keys.
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register taxonomies.
 */
function playastays_headless_register_taxonomies() {
	$city_labels = array(
		'name'          => __( 'City tags', 'playastays-headless' ),
		'singular_name' => __( 'City tag', 'playastays-headless' ),
	);

	// Shared city dimension: assign city slug as term slug for REST filtering (e.g. ps_city_tag=playa-del-carmen).
	register_taxonomy(
		'ps_city_tag',
		array( 'ps_service', 'ps_faq', 'ps_testimonial', 'properties' ),
		array(
			'labels'            => $city_labels,
			'public'            => true,
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => 'ps-city-tag' ),
		)
	);

	// Placeholder: extend with e.g. ps_service_category, ps_neighborhood when product needs them.
}

<?php
/**
 * Computed REST fields (scaffold only).
 *
 * Future: add ps_computed (or similar) for city, service, property with resolved images, links, etc.
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Attach placeholder computed fields to REST responses.
 */
function playastays_headless_register_rest_fields() {
	// TODO: ps_city — e.g. featured image URL, permalink path, related service IDs.
	register_rest_field(
		'ps_city',
		'ps_computed',
		array(
			'get_callback'    => 'playastays_headless_rest_computed_city',
			'schema'          => array(
				'description' => __( 'Computed city fields for headless consumers.', 'playastays-headless' ),
				'type'        => 'object',
				'context'     => array( 'view', 'edit' ),
				'properties'  => array(
					'_placeholder' => array( 'type' => 'string' ),
				),
			),
			'update_callback' => null,
		)
	);

	// TODO: ps_service — e.g. hero asset URLs, CTA URLs, city term resolution.
	register_rest_field(
		'ps_service',
		'ps_computed',
		array(
			'get_callback'    => 'playastays_headless_rest_computed_service',
			'schema'          => array(
				'description' => __( 'Computed service fields for headless consumers.', 'playastays-headless' ),
				'type'        => 'object',
				'context'     => array( 'view', 'edit' ),
				'properties'  => array(
					'_placeholder' => array( 'type' => 'string' ),
				),
			),
			'update_callback' => null,
		)
	);

	// TODO: properties — e.g. gallery URLs, booking links, neighborhood labels.
	register_rest_field(
		'properties',
		'ps_computed',
		array(
			'get_callback'    => 'playastays_headless_rest_computed_property',
			'schema'          => array(
				'description' => __( 'Computed property fields for headless consumers.', 'playastays-headless' ),
				'type'        => 'object',
				'context'     => array( 'view', 'edit' ),
				'properties'  => array(
					'_placeholder' => array( 'type' => 'string' ),
				),
			),
			'update_callback' => null,
		)
	);
}
add_action( 'rest_api_init', 'playastays_headless_register_rest_fields' );

/**
 * @param array<string,mixed> $obj REST object.
 * @return array<string,mixed>
 */
function playastays_headless_rest_computed_city( $obj ) {
	return array(
		'_placeholder' => 'city_computed_todo',
	);
}

/**
 * @param array<string,mixed> $obj REST object.
 * @return array<string,mixed>
 */
function playastays_headless_rest_computed_service( $obj ) {
	return array(
		'_placeholder' => 'service_computed_todo',
	);
}

/**
 * @param array<string,mixed> $obj REST object.
 * @return array<string,mixed>
 */
function playastays_headless_rest_computed_property( $obj ) {
	return array(
		'_placeholder' => 'property_computed_todo',
	);
}

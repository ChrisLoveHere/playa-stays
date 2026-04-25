<?php
/**
 * Lead submission REST API (scaffold).
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register /playastays/v1/submit-lead
 */
function playastays_headless_register_lead_routes() {
	register_rest_route(
		PLAYASTAYS_HEADLESS_REST_NAMESPACE,
		'/submit-lead',
		array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => 'playastays_headless_submit_lead_callback',
			'permission_callback' => '__return_true', // TODO: rate limit, honeypot, or capability for internal use.
			'args'                => array(
				// TODO: define validated args (name, email, phone, message, source, etc.).
			),
		)
	);
}
add_action( 'rest_api_init', 'playastays_headless_register_lead_routes' );

/**
 * Placeholder success response.
 *
 * @param \WP_REST_Request $request Request.
 * @return \WP_REST_Response|\WP_Error
 */
function playastays_headless_submit_lead_callback( $request ) {
	// TODO: validate nonce / origin if exposed to browsers.
	// TODO: sanitize all inputs.
	// TODO: store as CPT, custom table, or wp_mail to CRM.
	// $body available via $request->get_json_params() / get_body_params() when implementing persistence.

	return new \WP_REST_Response(
		array(
			'success' => true,
			'message' => __( 'Lead received (placeholder). No persistence yet.', 'playastays-headless' ),
		),
		200
	);
}

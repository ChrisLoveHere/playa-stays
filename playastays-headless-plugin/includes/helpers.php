<?php
/**
 * Shared helpers (minimal scaffolding).
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Sanitize a simple string for REST/meta output.
 *
 * @param mixed $value Raw value.
 * @return string
 */
function playastays_headless_sanitize_string( $value ) {
	return is_string( $value ) ? sanitize_text_field( $value ) : '';
}

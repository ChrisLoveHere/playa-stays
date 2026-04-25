<?php
/**
 * Plugin Name:       PlayaStays Headless
 * Description:       Custom post types, taxonomies, meta, REST, settings, and lead endpoints for the PlayaStays headless CMS (Next.js frontend).
 * Version:           0.1.0
 * Author:            PlayaStays
 * Text Domain:       playastays-headless
 * Requires at least: 6.0
 * Requires PHP:      7.4
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PLAYASTAYS_HEADLESS_VERSION', '0.1.0' );
define( 'PLAYASTAYS_HEADLESS_PLUGIN_FILE', __FILE__ );
define( 'PLAYASTAYS_HEADLESS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PLAYASTAYS_HEADLESS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PLAYASTAYS_HEADLESS_REST_NAMESPACE', 'playastays/v1' );

require_once PLAYASTAYS_HEADLESS_PLUGIN_DIR . 'includes/helpers.php';
require_once PLAYASTAYS_HEADLESS_PLUGIN_DIR . 'includes/settings.php';
require_once PLAYASTAYS_HEADLESS_PLUGIN_DIR . 'includes/post-types.php';
require_once PLAYASTAYS_HEADLESS_PLUGIN_DIR . 'includes/taxonomies.php';
require_once PLAYASTAYS_HEADLESS_PLUGIN_DIR . 'includes/meta.php';
require_once PLAYASTAYS_HEADLESS_PLUGIN_DIR . 'includes/rest-fields.php';
require_once PLAYASTAYS_HEADLESS_PLUGIN_DIR . 'includes/leads.php';

/**
 * Bootstrap plugin modules.
 */
function playastays_headless_init() {
	playastays_headless_register_post_types();
	playastays_headless_register_taxonomies();
	playastays_headless_register_meta();
	// REST routes and register_rest_field are wired on rest_api_init in includes/rest-fields.php and includes/leads.php.
}
add_action( 'init', 'playastays_headless_init', 5 );

/**
 * Settings API registration (admin_init is the recommended hook for register_setting).
 */
add_action( 'admin_init', 'playastays_headless_register_settings' );

<?php
/**
 * Custom post types (REST-enabled).
 *
 * @package PlayaStays_Headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register CPTs for headless CMS.
 */
function playastays_headless_register_post_types() {
	$common = array(
		'public'       => true,
		'show_ui'      => true,
		'show_in_rest' => true,
		'has_archive'  => false,
		'menu_icon'    => 'dashicons-admin-site-alt3',
		'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions' ),
	);

	register_post_type(
		'ps_city',
		array_merge(
			$common,
			array(
				'labels'       => array(
					'name'          => __( 'Cities', 'playastays-headless' ),
					'singular_name' => __( 'City', 'playastays-headless' ),
				),
				'description'  => __( 'Destination / market cities.', 'playastays-headless' ),
				'rewrite'      => array( 'slug' => 'ps-city' ),
			)
		)
	);

	register_post_type(
		'ps_service',
		array_merge(
			$common,
			array(
				'labels'       => array(
					'name'          => __( 'Services', 'playastays-headless' ),
					'singular_name' => __( 'Service', 'playastays-headless' ),
				),
				'description'  => __( 'Service landing content.', 'playastays-headless' ),
				'rewrite'      => array( 'slug' => 'ps-service' ),
			)
		)
	);

	register_post_type(
		'ps_faq',
		array_merge(
			$common,
			array(
				'labels'       => array(
					'name'          => __( 'FAQs', 'playastays-headless' ),
					'singular_name' => __( 'FAQ', 'playastays-headless' ),
				),
				'description'  => __( 'FAQ entries.', 'playastays-headless' ),
				'rewrite'      => array( 'slug' => 'ps-faq' ),
			)
		)
	);

	register_post_type(
		'ps_testimonial',
		array_merge(
			$common,
			array(
				'labels'       => array(
					'name'          => __( 'Testimonials', 'playastays-headless' ),
					'singular_name' => __( 'Testimonial', 'playastays-headless' ),
				),
				'description'  => __( 'Client testimonials.', 'playastays-headless' ),
				'rewrite'      => array( 'slug' => 'ps-testimonial' ),
			)
		)
	);

	register_post_type(
		'properties',
		array_merge(
			$common,
			array(
				'labels'       => array(
					'name'          => __( 'Properties', 'playastays-headless' ),
					'singular_name' => __( 'Property', 'playastays-headless' ),
				),
				'description'  => __( 'Rental / listing properties.', 'playastays-headless' ),
				'rewrite'      => array( 'slug' => 'property' ),
			)
		)
	);
}

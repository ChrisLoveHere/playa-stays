<?php
/**
 * Plugin Name: PlayaStays Content Model
 * Description: Registers all CPTs, meta fields, REST extensions,
 *              bilingual metaboxes, ISR webhook, and lead endpoints
 *              for the PlayaStays headless Next.js site.
 * Version:     2.0.0
 * Author:      PlayaStays
 * Text Domain: playastays
 */

defined( 'ABSPATH' ) || exit;

// ============================================================
// Security (headless: Next.js is the public site; REST user list not required)
//
// - XML-RPC: disabled at plugin level (not theme) — persists via repo deploy.
// - REST /wp/v2/users*: removed for guests — fallback if other security plugins are off.
// - Author archives: noindex below — WP is CMS only; public SEO lives on Next.js.
// ============================================================

add_filter( 'xmlrpc_enabled', '__return_false' );

/**
 * Hide public REST user enumeration for unauthenticated requests (editors use wp-admin).
 *
 * @param array<string,mixed> $endpoints Registered REST routes.
 * @return array<string,mixed>
 */
function playastays_rest_filter_user_endpoints_for_guests( $endpoints ) {
	if ( is_user_logged_in() ) {
		return $endpoints;
	}
	if ( isset( $endpoints['/wp/v2/users'] ) ) {
		unset( $endpoints['/wp/v2/users'] );
	}
	if ( isset( $endpoints['/wp/v2/users/(?P<id>[\\d]+)'] ) ) {
		unset( $endpoints['/wp/v2/users/(?P<id>[\\d]+)'] );
	}
	return $endpoints;
}
add_filter( 'rest_endpoints', 'playastays_rest_filter_user_endpoints_for_guests', 99 );

/**
 * Noindex author archives only (backend-scoped; does not replace AIOSEO or Next.js SEO).
 *
 * @param array<string,bool|string> $robots Robots keys for wp_robots().
 * @return array<string,bool|string>
 */
function playastays_wp_robots_noindex_author_archives( $robots ) {
	if ( is_author() ) {
		$robots['noindex'] = true;
	}
	return $robots;
}
add_filter( 'wp_robots', 'playastays_wp_robots_noindex_author_archives', 20 );

// ============================================================
// 0. CONSTANTS
// ============================================================

define( 'PS_VERSION',      '2.0.0' );
define( 'PS_PREFIX',       'ps_' );
define( 'PS_REVALIDATE_URL', get_option( 'ps_revalidate_url', 'https://www.playastays.com/api/revalidate' ) );
define( 'PS_REVALIDATE_SECRET', get_option( 'ps_revalidate_secret', '' ) );

// ============================================================
// 1. CUSTOM POST TYPES
// ============================================================

add_action( 'init', 'ps_register_post_types' );

function ps_register_post_types() {

    // ── ps_property ──────────────────────────────────────────
    register_post_type( 'ps_property', [
        'label'               => 'Properties',
        'labels'              => [
            'name'            => 'Properties',
            'singular_name'   => 'Property',
            'add_new_item'    => 'Add New Property',
            'edit_item'       => 'Edit Property',
        ],
        'public'              => true,
        'show_in_rest'        => true,
        'rest_base'           => 'properties',
        'supports'            => [ 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ],
        'has_archive'         => false,
        'rewrite'             => [ 'slug' => 'property', 'with_front' => false ],
        'menu_icon'           => 'dashicons-building',
        'menu_position'       => 5,
    ] );

    // ── ps_city ───────────────────────────────────────────────
    register_post_type( 'ps_city', [
        'label'               => 'Cities',
        'labels'              => [
            'name'            => 'Cities',
            'singular_name'   => 'City',
        ],
        'public'              => true,
        'show_in_rest'        => true,
        'rest_base'           => 'ps_city',
        'supports'            => [ 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ],
        'has_archive'         => false,
        'menu_icon'           => 'dashicons-location',
        'menu_position'       => 6,
    ] );

    // ── ps_service ────────────────────────────────────────────
    register_post_type( 'ps_service', [
        'label'               => 'Services',
        'labels'              => [
            'name'            => 'Services',
            'singular_name'   => 'Service',
        ],
        'public'              => true,
        'show_in_rest'        => true,
        'rest_base'           => 'ps_service',
        'supports'            => [ 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ],
        'has_archive'         => false,
        'menu_icon'           => 'dashicons-star-filled',
        'menu_position'       => 7,
    ] );

    // ── ps_faq ────────────────────────────────────────────────
    register_post_type( 'ps_faq', [
        'label'               => 'FAQs',
        'public'              => false,
        'show_in_rest'        => true,
        'rest_base'           => 'ps_faq',
        'supports'            => [ 'title', 'custom-fields' ],
        'menu_icon'           => 'dashicons-editor-help',
        'menu_position'       => 8,
    ] );

    // ── ps_testimonial ────────────────────────────────────────
    register_post_type( 'ps_testimonial', [
        'label'               => 'Testimonials',
        'public'              => false,
        'show_in_rest'        => true,
        'rest_base'           => 'ps_testimonial',
        'supports'            => [ 'title', 'editor', 'custom-fields' ],
        'menu_icon'           => 'dashicons-format-quote',
        'menu_position'       => 9,
    ] );

    // ── ps_lead ───────────────────────────────────────────────
    register_post_type( 'ps_lead', [
        'label'               => 'Leads',
        'labels'              => [
            'name'            => 'Leads',
            'singular_name'   => 'Lead',
        ],
        'public'              => false,
        'show_in_rest'        => false,   // Never expose leads via REST
        'supports'            => [ 'title', 'custom-fields' ],
        'capability_type'     => 'ps_lead',
        'capabilities'        => [ 'create_posts' => 'do_not_allow' ], // No front-end creation
        'map_meta_cap'        => true,
        'menu_icon'           => 'dashicons-email',
        'menu_position'       => 20,
    ] );
}

// ============================================================
// 2. TAXONOMIES
// ============================================================

add_action( 'init', 'ps_register_taxonomies' );

function ps_register_taxonomies() {

    // Shared city tag — links properties, services, FAQs to cities
    register_taxonomy( 'ps_city_tag', [ 'ps_property', 'ps_service', 'ps_faq', 'post' ], [
        'label'         => 'City',
        'hierarchical'  => false,
        'show_in_rest'  => true,
        'rest_base'     => 'ps_city_tag',
        'rewrite'       => false,
    ] );

    // Property type taxonomy
    register_taxonomy( 'ps_property_type', 'ps_property', [
        'label'         => 'Property Type',
        'hierarchical'  => false,
        'show_in_rest'  => true,
        'rest_base'     => 'ps_property_type',
        'rewrite'       => false,
    ] );

    // Bedrooms
    register_taxonomy( 'ps_bedrooms', 'ps_property', [
        'label'         => 'Bedrooms',
        'hierarchical'  => false,
        'show_in_rest'  => true,
        'rest_base'     => 'ps_bedrooms',
        'rewrite'       => false,
    ] );

    // Property features (beachfront, pool, pet-friendly, etc.)
    register_taxonomy( 'ps_feature', 'ps_property', [
        'label'         => 'Features',
        'hierarchical'  => false,
        'show_in_rest'  => true,
        'rest_base'     => 'ps_feature',
        'rewrite'       => false,
    ] );

    // Neighborhood
    register_taxonomy( 'ps_neighborhood', 'ps_property', [
        'label'         => 'Neighborhood',
        'hierarchical'  => false,
        'show_in_rest'  => true,
        'rest_base'     => 'ps_neighborhood',
        'rewrite'       => false,
    ] );

    // FAQ category
    register_taxonomy( 'ps_faq_category', 'ps_faq', [
        'label'         => 'FAQ Category',
        'hierarchical'  => false,
        'show_in_rest'  => true,
        'rest_base'     => 'ps_faq_category',
        'rewrite'       => false,
    ] );

    // Service category (groups service types across cities)
    register_taxonomy( 'ps_service_category', 'ps_service', [
        'label'         => 'Service Category',
        'hierarchical'  => false,
        'show_in_rest'  => true,
        'rest_base'     => 'ps_service_category',
        'rewrite'       => false,
    ] );

    // Blog — editorial topics (assign in wp-admin on Posts)
    register_taxonomy( 'ps_blog_topic', [ 'post' ], [
        'label'             => 'Blog topic',
        'hierarchical'      => true,
        'show_in_rest'      => true,
        'rest_base'         => 'ps_blog_topic',
        'show_admin_column' => true,
        'rewrite'           => false,
    ] );

    // Blog — area / market (riviera destinations)
    register_taxonomy( 'ps_blog_area', [ 'post' ], [
        'label'             => 'Blog area',
        'hierarchical'      => true,
        'show_in_rest'      => true,
        'rest_base'         => 'ps_blog_area',
        'show_admin_column' => true,
        'rewrite'           => false,
    ] );
}

/**
 * One-time seed of default blog topic/area terms (idempotent).
 */
function ps_maybe_seed_blog_taxonomies() {
    if ( get_option( 'ps_blog_taxonomies_v2_seeded' ) ) {
        return;
    }
    $topics = [
        'owner-guides'          => 'Owner Guides',
        'property-management'   => 'Property Management',
        'vacation-rentals'      => 'Vacation Rentals',
        'long-term-rentals'     => 'Long-Term Rentals',
        'market-insights'       => 'Market Insights',
    ];
    foreach ( $topics as $slug => $name ) {
        if ( ! term_exists( $slug, 'ps_blog_topic' ) ) {
            wp_insert_term( $name, 'ps_blog_topic', [ 'slug' => $slug ] );
        }
    }
    $areas = [
        'playa-del-carmen' => 'Playa del Carmen',
        'tulum'            => 'Tulum',
        'puerto-morelos'   => 'Puerto Morelos',
        'akumal'           => 'Akumal',
        'cozumel'          => 'Cozumel',
        'isla-mujeres'     => 'Isla Mujeres',
        'xpu-ha'           => 'Xpu-Ha',
    ];
    foreach ( $areas as $slug => $name ) {
        if ( ! term_exists( $slug, 'ps_blog_area' ) ) {
            wp_insert_term( $name, 'ps_blog_area', [ 'slug' => $slug ] );
        }
    }
    update_option( 'ps_blog_taxonomies_v2_seeded', 1 );
}
add_action( 'init', 'ps_maybe_seed_blog_taxonomies', 100 );

// ============================================================
// 3. META FIELDS — registered for REST API exposure
// ============================================================

add_action( 'init', 'ps_register_meta_fields' );

function ps_register_meta_fields() {

    // ── Property meta ──────────────────────────────────────
    $property_meta = [
        // Location
        'ps_city'               => 'string',
        'ps_neighborhood'       => 'string',
        'ps_state'              => 'string',
        'ps_country'            => 'string',
        'ps_address_line_1'     => 'string',
        'ps_address_line_2'     => 'string',
        'ps_postal_code'        => 'string',
        'ps_lat'                => 'number',
        'ps_lng'                => 'number',
        'ps_map_display_mode'   => 'string',   // exact | approximate | hidden

        // Specs
        'ps_property_type'      => 'string',
        'ps_bedrooms'           => 'integer',
        'ps_bathrooms'          => 'number',
        'ps_guests'             => 'integer',
        'ps_beds'               => 'integer',
        'ps_sqm'                => 'integer',
        'ps_floor'              => 'integer',

        // Listing & status
        'ps_listing_type'       => 'string',   // rent | sale | both
        /** Rental strategy (separate from listing type): vacation_rental | long_term | hybrid */
        'ps_rental_strategy'    => 'string',
        'ps_listing_status'     => 'string',   // active | draft | archived
        'ps_managed_by_ps'      => 'boolean',
        'ps_featured'           => 'boolean',

        // Pricing
        'ps_nightly_rate'       => 'number',
        'ps_monthly_rate'       => 'number',
        'ps_sale_price'         => 'number',
        'ps_cleaning_fee'       => 'number',
        'ps_currency'           => 'string',
        'ps_min_stay_nights'    => 'integer',

        // Performance / reviews
        'ps_avg_occupancy'      => 'number',
        'ps_avg_rating'         => 'number',
        'ps_review_count'       => 'integer',
        'ps_monthly_income'     => 'number',

        // Booking URLs
        'ps_airbnb_url'         => 'string',
        'ps_vrbo_url'           => 'string',
        'ps_booking_url'        => 'string',
        'ps_direct_url'         => 'string',
        'ps_booking_mode'       => 'string',   // instant | inquiry | external

        // Availability / calendar
        'ps_availability_json'      => 'string',  // JSON: { version, blocks, nextAvailable, minStayNights }
        'ps_next_available_date'    => 'string',  // ISO YYYY-MM-DD

        // Structured amenities — JSON array of keys from shared taxonomy
        'ps_amenity_keys'       => 'string',   // e.g. '["wifi","pool","balcony"]'

        // Guest-facing details
        'ps_check_in_time'      => 'string',
        'ps_check_out_time'     => 'string',
        'ps_house_rules'        => 'string',
        'ps_house_rules_es'     => 'string',

        // Owner / operations
        'ps_owner_id'           => 'integer',
        'ps_manager_id'         => 'integer',
        'ps_building_name'      => 'string',
        'ps_ops_status'         => 'string',   // active | needs-attention | maintenance | onboarding | inactive
        'ps_last_inspection_date' => 'string', // ISO YYYY-MM-DD

        // SEO / bilingual
        'ps_seo_title'          => 'string',
        'ps_seo_desc'           => 'string',
        'ps_title_es'           => 'string',
        'ps_excerpt_es'         => 'string',
        'ps_content_es'         => 'string',
    ];

    // Internal notes — writable via REST only for authenticated users (auth_callback enforces edit_post)
    register_post_meta( 'ps_property', 'ps_internal_notes', [
        'single'        => true,
        'type'          => 'string',
        'show_in_rest'  => true,
        'auth_callback' => 'ps_meta_auth_callback',
    ] );

    /** Operational activity log — JSON array of { id, at, category, body } */
    register_post_meta( 'ps_property', 'ps_ops_activity_log', [
        'single'        => true,
        'type'          => 'string',
        'show_in_rest'  => true,
        'auth_callback' => 'ps_meta_auth_callback',
    ] );

    /** Operational issues / tickets — JSON array, admin-only */
    register_post_meta( 'ps_property', 'ps_ops_issues', [
        'single'        => true,
        'type'          => 'string',
        'show_in_rest'  => true,
        'auth_callback' => 'ps_meta_auth_callback',
    ] );

    // Gallery — JSON array of attachment IDs, powers ps_computed.gallery read
    register_post_meta( 'ps_property', 'ps_gallery', [
        'single'        => true,
        'type'          => 'string',
        'show_in_rest'  => true,
        'auth_callback' => 'ps_meta_auth_callback',
    ] );

    foreach ( $property_meta as $key => $type ) {
        register_post_meta( 'ps_property', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => 'ps_meta_auth_callback',
        ] );
    }

    // ── City meta ──────────────────────────────────────────
    $city_meta = [
        'ps_country'              => 'string',
        'ps_state'                => 'string',
        'ps_lat'                  => 'number',
        'ps_lng'                  => 'number',
        'ps_market_note'          => 'string',
        'ps_market_note_es'       => 'string',
        'ps_best_for'             => 'string',
        'ps_best_for_es'          => 'string',
        'ps_peak_season'          => 'string',
        'ps_peak_season_es'       => 'string',
        'ps_avg_nightly'          => 'string',
        'ps_avg_occupancy'        => 'string',
        'ps_avg_monthly_income'   => 'string',
        'ps_seo_title'            => 'string',
        'ps_seo_desc'             => 'string',
        'ps_title_es'             => 'string',
        'ps_excerpt_es'           => 'string',
        'ps_content_es'           => 'string',
        'ps_neighborhoods'        => 'string',  // JSON
        'ps_neighborhoods_es'     => 'string',  // JSON
    ];
    foreach ( $city_meta as $key => $type ) {
        register_post_meta( 'ps_city', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => 'ps_meta_auth_callback',
        ] );
    }

    // ── Service meta ───────────────────────────────────────
    $service_meta = [
        'ps_service_slug'          => 'string',
        'ps_city_id'               => 'integer',
        'ps_hero_headline'         => 'string',
        'ps_hero_subheadline'      => 'string',
        'ps_cta_primary_text'      => 'string',
        'ps_cta_primary_url'       => 'string',
        'ps_seo_title'             => 'string',
        'ps_seo_desc'              => 'string',
        'ps_hero_headline_es'      => 'string',
        'ps_hero_subheadline_es'   => 'string',
        'ps_content_es'            => 'string',
        'ps_seo_title_es'          => 'string',
        'ps_seo_desc_es'           => 'string',
    ];
    foreach ( $service_meta as $key => $type ) {
        register_post_meta( 'ps_service', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => 'ps_meta_auth_callback',
        ] );
    }

    // ── FAQ meta ───────────────────────────────────────────
    $faq_meta = [
        'ps_answer'       => 'string',
        'ps_question_es'  => 'string',
        'ps_answer_es'    => 'string',
        'ps_sort_order'   => 'integer',
        'ps_service_ids'  => 'string',
        'ps_city_ids'     => 'string',
    ];
    foreach ( $faq_meta as $key => $type ) {
        register_post_meta( 'ps_faq', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => 'ps_meta_auth_callback',
        ] );
    }

    // ── Testimonial meta ───────────────────────────────────
    $testimonial_meta = [
        'ps_author_name'     => 'string',
        'ps_author_role'     => 'string',
        'ps_author_initials' => 'string',
        'ps_rating'          => 'number',
        'ps_featured'        => 'boolean',
        'ps_sort_order'      => 'integer',
        'ps_content_es'      => 'string',
    ];
    foreach ( $testimonial_meta as $key => $type ) {
        register_post_meta( 'ps_testimonial', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => 'ps_meta_auth_callback',
        ] );
    }

    // ── Blog post meta ─────────────────────────────────────
    $post_meta = [
        'ps_seo_title'   => 'string',
        'ps_seo_desc'    => 'string',
        'ps_title_es'    => 'string',
        'ps_excerpt_es'  => 'string',
        'ps_content_es'  => 'string',
        'ps_author_es'   => 'string',
        /** Next.js BlogPostTemplate sidebar internal links — public EN slugs */
        'ps_primary_city'    => 'string',
        'ps_primary_service' => 'string',
    ];
    foreach ( $post_meta as $key => $type ) {
        register_post_meta( 'post', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => 'ps_meta_auth_callback',
        ] );
    }
}

function ps_meta_auth_callback( $allowed, $meta_key, $post_id, $user_id ) {
    return current_user_can( 'edit_post', $post_id );
}

// ============================================================
// 4. REST API — ps_computed fields + custom endpoints
// ============================================================

add_action( 'rest_api_init', 'ps_register_rest_fields' );

function ps_register_rest_fields() {

    // ── ps_computed on ps_property ────────────────────────
    register_rest_field( 'ps_property', 'ps_computed', [
        'get_callback' => function ( $post_arr ) {
            $id = $post_arr['id'];

            $featured_image = null;
            $thumb_id = get_post_thumbnail_id( $id );
            if ( $thumb_id ) {
                $data = wp_get_attachment_image_src( $thumb_id, 'large' );
                $featured_image = [
                    'id'     => $thumb_id,
                    'url'    => $data ? $data[0] : '',
                    'alt'    => get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) ?: get_the_title( $id ),
                    'width'  => $data ? $data[1] : 0,
                    'height' => $data ? $data[2] : 0,
                    'sizes'  => [
                        'thumbnail'  => wp_get_attachment_image_url( $thumb_id, 'thumbnail' ),
                        'medium'     => wp_get_attachment_image_url( $thumb_id, 'medium' ),
                        'large'      => wp_get_attachment_image_url( $thumb_id, 'large' ),
                        'ps_card'    => wp_get_attachment_image_url( $thumb_id, 'ps_card' ),
                        'ps_hero'    => wp_get_attachment_image_url( $thumb_id, 'ps_hero' ),
                        'full'       => wp_get_attachment_image_url( $thumb_id, 'full' ),
                    ],
                ];
            }

            // Gallery — stored as JSON array of attachment IDs in ps_gallery meta
            $gallery_ids = json_decode( get_post_meta( $id, 'ps_gallery', true ) ?: '[]', true );
            $gallery     = [];
            foreach ( (array) $gallery_ids as $gid ) {
                $url = wp_get_attachment_image_url( $gid, 'large' );
                if ( $url ) {
                    $gallery[] = [
                        'id'  => $gid,
                        'url' => $url,
                        'alt' => get_post_meta( $gid, '_wp_attachment_image_alt', true ) ?: '',
                    ];
                }
            }

            // Booking links
            $booking_links = [
                'airbnb'  => get_post_meta( $id, 'ps_airbnb_url',  true ) ?: null,
                'vrbo'    => get_post_meta( $id, 'ps_vrbo_url',    true ) ?: null,
                'booking' => get_post_meta( $id, 'ps_booking_url', true ) ?: null,
                'direct'  => get_post_meta( $id, 'ps_direct_url',  true ) ?: null,
            ];

            // Amenities — stored as JSON string array
            $amenities = json_decode( get_post_meta( $id, 'ps_amenities', true ) ?: '[]', true );

            // Owner
            $owner_id = (int) get_post_meta( $id, 'ps_owner_id', true );
            $owner    = null;
            if ( $owner_id ) {
                $u     = get_userdata( $owner_id );
                $owner = $u ? [ 'id' => $owner_id, 'display_name' => $u->display_name ] : null;
            }

            // Manager
            $manager_id = (int) get_post_meta( $id, 'ps_manager_id', true );
            $manager    = null;
            if ( $manager_id ) {
                $u       = get_userdata( $manager_id );
                $manager = $u ? [ 'id' => $manager_id, 'display_name' => $u->display_name ] : null;
            }

            return compact( 'featured_image', 'gallery', 'booking_links', 'amenities', 'owner', 'manager' );
        },
        'schema' => [ 'type' => 'object' ],
    ] );

    // ── ps_computed on ps_city ────────────────────────────
    register_rest_field( 'ps_city', 'ps_computed', [
        'get_callback' => function ( $post_arr ) {
            $id = $post_arr['id'];

            $featured_image = null;
            $thumb_id = get_post_thumbnail_id( $id );
            if ( $thumb_id ) {
                $data = wp_get_attachment_image_src( $thumb_id, 'large' );
                $featured_image = [
                    'id'  => $thumb_id,
                    'url' => $data ? $data[0] : '',
                    'alt' => get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) ?: '',
                ];
            }

            $stats         = json_decode( get_post_meta( $id, 'ps_stats', true )         ?: '[]', true );
            $neighborhoods = json_decode( get_post_meta( $id, 'ps_neighborhoods', true ) ?: '[]', true );

            return compact( 'featured_image', 'stats', 'neighborhoods' );
        },
        'schema' => [ 'type' => 'object' ],
    ] );

    // ── ps_computed on ps_service ─────────────────────────
    register_rest_field( 'ps_service', 'ps_computed', [
        'get_callback' => function ( $post_arr ) {
            $id       = $post_arr['id'];
            $stats    = json_decode( get_post_meta( $id, 'ps_stats',    true ) ?: '[]', true );
            $steps    = json_decode( get_post_meta( $id, 'ps_steps',    true ) ?: '[]', true );
            $features = json_decode( get_post_meta( $id, 'ps_features', true ) ?: '[]', true );
            $faq_ids  = json_decode( get_post_meta( $id, 'ps_faq_ids',  true ) ?: '[]', true );

            // Related services — other services with the same ps_city_tag
            $city_tags = wp_get_post_terms( $id, 'ps_city_tag' );
            $related   = [];
            if ( ! is_wp_error( $city_tags ) && $city_tags ) {
                $sibling_ids = get_posts( [
                    'post_type'   => 'ps_service',
                    'numberposts' => 8,
                    'exclude'     => [ $id ],
                    'tax_query'   => [ [
                        'taxonomy' => 'ps_city_tag',
                        'field'    => 'slug',
                        'terms'    => wp_list_pluck( $city_tags, 'slug' ),
                    ] ],
                    'fields' => 'ids',
                ] );
                foreach ( $sibling_ids as $sid ) {
                    $related[] = [
                        'id'              => $sid,
                        'title'           => get_the_title( $sid ),
                        'slug'            => get_post_field( 'post_name', $sid ),
                        'ps_service_slug' => get_post_meta( $sid, 'ps_service_slug', true ),
                    ];
                }
            }

            return compact( 'stats', 'steps', 'features', 'faq_ids', 'related' );
        },
        'schema' => [ 'type' => 'object' ],
    ] );
}

// ============================================================
// 5. CUSTOM REST ENDPOINTS
// ============================================================

add_action( 'rest_api_init', 'ps_register_routes' );

function ps_register_routes() {

    // Site config endpoint — phone, email, WhatsApp, social, trust stats
    register_rest_route( 'wp/v2', '/settings', [
        'methods'             => 'GET',
        'callback'            => 'ps_get_settings',
        'permission_callback' => '__return_true',
    ] );

    // Lead submission endpoint
    register_rest_route( 'playastays/v1', '/submit-lead', [
        'methods'             => 'POST',
        'callback'            => 'ps_handle_lead_submission',
        'permission_callback' => '__return_true',
    ] );
}

function ps_get_settings( WP_REST_Request $request ): WP_REST_Response {
    return new WP_REST_Response( [
        'phone'       => get_option( 'ps_phone',     '+52 984 123 4567' ),
        'whatsapp'    => get_option( 'ps_whatsapp',  '529841234567' ),
        'email'       => get_option( 'ps_email',     'hello@playastays.com' ),
        'address'     => get_option( 'ps_address',   'Playa del Carmen, Quintana Roo, Mexico' ),
        'trust_stats' => json_decode( get_option( 'ps_trust_stats', '[]' ), true ) ?: [
            [ 'val' => '4.9★',  'key' => 'Owner satisfaction' ],
            [ 'val' => '20%+',  'key' => 'Revenue uplift' ],
            [ 'val' => '24/7',  'key' => 'Local support' ],
            [ 'val' => 'ES/EN', 'key' => 'Bilingual team' ],
        ],
        'social' => [
            'facebook'  => get_option( 'ps_social_facebook',  '' ),
            'instagram' => get_option( 'ps_social_instagram', '' ),
            'linkedin'  => get_option( 'ps_social_linkedin',  '' ),
        ],
    ] );
}

function ps_handle_lead_submission( WP_REST_Request $request ): WP_REST_Response {
    $body = $request->get_json_params();

    // Honeypot — bots fill the 'website' field
    if ( ! empty( $body['website'] ) ) {
        return new WP_REST_Response( [ 'success' => true ], 200 ); // silent discard
    }

    $first_name = sanitize_text_field( $body['first_name'] ?? '' );
    $email      = sanitize_email( $body['email'] ?? '' );

    if ( ! $first_name || ! is_email( $email ) ) {
        return new WP_REST_Response( [ 'error' => 'Invalid submission.' ], 400 );
    }

    // Build post title
    $last_name   = sanitize_text_field( $body['last_name'] ?? '' );
    $city        = sanitize_text_field( $body['city'] ?? '' );
    $post_title  = trim( "$first_name $last_name" ) . " — $city — " . date( 'Y-m-d H:i' );

    $post_id = wp_insert_post( [
        'post_type'   => 'ps_lead',
        'post_title'  => $post_title,
        'post_status' => 'publish',
    ] );

    if ( is_wp_error( $post_id ) ) {
        return new WP_REST_Response( [ 'error' => 'Could not save lead.' ], 500 );
    }

    // Store all fields as post meta
    $meta_map = [
        'ps_first_name'    => $first_name,
        'ps_last_name'     => sanitize_text_field( $body['last_name']       ?? '' ),
        'ps_email'         => $email,
        'ps_phone'         => sanitize_text_field( $body['phone']           ?? '' ),
        'ps_city'          => $city,
        'ps_neighborhood'  => sanitize_text_field( $body['neighborhood']    ?? '' ),
        'ps_property_type' => sanitize_text_field( $body['property_type']   ?? '' ),
        'ps_current_status'=> sanitize_text_field( $body['current_status']  ?? '' ),
        'ps_source'        => sanitize_text_field( $body['source']          ?? '' ),
        'ps_source_path'   => sanitize_text_field( $body['source_path']     ?? '' ),
        'ps_utm_source'    => sanitize_text_field( $body['utm_source']      ?? '' ),
        'ps_utm_medium'    => sanitize_text_field( $body['utm_medium']      ?? '' ),
        'ps_utm_campaign'  => sanitize_text_field( $body['utm_campaign']    ?? '' ),
        'ps_utm_term'      => sanitize_text_field( $body['utm_term']        ?? '' ),
        'ps_utm_content'   => sanitize_text_field( $body['utm_content']     ?? '' ),
        'ps_referrer'      => sanitize_text_field( $body['referrer']        ?? '' ),
        'ps_locale'        => sanitize_text_field( $body['locale']          ?? 'en' ),
        'ps_notes'         => sanitize_textarea_field( $body['notes']       ?? '' ),
        'ps_ip_address'    => sanitize_text_field( $body['source_ip']       ?? '' ),
        'ps_user_agent'    => sanitize_text_field( $body['user_agent']      ?? '' ),
        'ps_submitted_at'  => sanitize_text_field( $body['submitted_at']    ?? current_time( 'mysql' ) ),
        'ps_lead_status'   => 'new',
    ];

    foreach ( $meta_map as $key => $value ) {
        update_post_meta( $post_id, $key, $value );
    }

    // Email notification to all ps_manager role users
    ps_notify_managers_of_lead( $post_id, $meta_map );

    return new WP_REST_Response( [ 'success' => true, 'id' => $post_id ], 200 );
}

function ps_notify_managers_of_lead( int $post_id, array $meta ): void {
    $managers = get_users( [ 'role' => 'ps_manager', 'fields' => 'user_email' ] );
    $managers = array_merge( $managers, get_users( [ 'role' => 'administrator', 'fields' => 'user_email' ] ) );

    if ( empty( $managers ) ) return;

    $subject = "[PlayaStays] New lead: {$meta['ps_first_name']} {$meta['ps_last_name']} — {$meta['ps_city']}";
    $body    = "New lead received:\n\n";
    foreach ( $meta as $k => $v ) {
        if ( $v ) $body .= "$k: $v\n";
    }
    $body .= "\nView in WP Admin: " . admin_url( "post.php?post=$post_id&action=edit" );

    wp_mail( array_unique( $managers ), $subject, $body );
}

// ============================================================
// 6. ISR WEBHOOK — fires after post save, runs in background
// ============================================================

add_action( 'save_post', 'ps_queue_isr_webhook', 20, 2 );

function ps_queue_isr_webhook( int $post_id, WP_Post $post ): void {
    // Skip auto-saves, revisions, and lead forms
    if ( wp_is_post_revision( $post_id ) )   return;
    if ( wp_is_post_autosave( $post_id ) )   return;
    if ( $post->post_type === 'ps_lead' )    return;
    if ( $post->post_status === 'auto-draft' ) return;

    $supported = [ 'ps_property', 'ps_city', 'ps_service', 'ps_faq', 'ps_testimonial', 'post' ];
    if ( ! in_array( $post->post_type, $supported, true ) ) return;

    // Build payload
    $city_tags    = wp_get_post_terms( $post_id, 'ps_city_tag', [ 'fields' => 'slugs' ] );
    $city_slug    = is_array( $city_tags ) && ! empty( $city_tags ) ? $city_tags[0] : '';
    $service_slug = get_post_meta( $post_id, 'ps_service_slug', true );

    $payload = wp_json_encode( [
        'post_type'    => $post->post_type,
        'post_id'      => $post_id,
        'slug'         => $post->post_name,
        'city_slug'    => $city_slug,
        'service_slug' => $service_slug ?: null,
        'action'       => $post->post_status === 'trash' ? 'deleted' : 'updated',
    ] );

    // Schedule background delivery — fires after shutdown hook so it never blocks the save
    wp_schedule_single_event( time() + 1, 'ps_send_isr_webhook', [ $payload ] );
}

add_action( 'ps_send_isr_webhook', 'ps_deliver_isr_webhook' );

function ps_deliver_isr_webhook( string $payload ): void {
    $secret = PS_REVALIDATE_SECRET;
    if ( ! $secret ) return;  // Skip if secret not configured

    $response = wp_remote_post( PS_REVALIDATE_URL, [
        'timeout'  => 5,
        'headers'  => [
            'Content-Type'  => 'application/json',
            'Authorization' => "Bearer $secret",
        ],
        'body'     => $payload,
    ] );

    // Log failures for retry
    if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
        $error = is_wp_error( $response ) ? $response->get_error_message() : wp_remote_retrieve_body( $response );
        ps_log_webhook_failure( $payload, $error );
        // Retry once after 60 seconds
        wp_schedule_single_event( time() + 60, 'ps_send_isr_webhook_retry', [ $payload ] );
    }
}

// Retry hook (fires once)
add_action( 'ps_send_isr_webhook_retry', 'ps_deliver_isr_webhook' );

function ps_log_webhook_failure( string $payload, string $error ): void {
    global $wpdb;
    $table = $wpdb->prefix . 'ps_webhook_log';
    // Create table if missing
    if ( $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) !== $table ) {
        $wpdb->query( "CREATE TABLE $table (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            payload text NOT NULL,
            error text NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )" );
    }
    $wpdb->insert( $table, [
        'payload' => $payload,
        'error'   => $error,
    ] );
}

// ============================================================
// 7. PUBLISHING GUARDS
// ============================================================

// Prevent ps_property from going live without a featured image
add_action( 'transition_post_status', 'ps_require_image_before_publish', 10, 3 );

function ps_require_image_before_publish( string $new_status, string $old_status, WP_Post $post ): void {
    if ( $post->post_type !== 'ps_property' ) return;
    if ( $new_status !== 'publish' ) return;
    if ( ! has_post_thumbnail( $post->ID ) ) {
        // Revert to draft and set admin notice
        remove_action( 'transition_post_status', 'ps_require_image_before_publish', 10 );
        wp_update_post( [ 'ID' => $post->ID, 'post_status' => 'draft' ] );
        set_transient( 'ps_publish_error_' . $post->ID, 'A featured image is required before publishing a property.', 60 );
    }
}

add_action( 'admin_notices', 'ps_show_publish_errors' );
function ps_show_publish_errors(): void {
    global $post;
    if ( ! $post ) return;
    $msg = get_transient( 'ps_publish_error_' . $post->ID );
    if ( $msg ) {
        echo '<div class="notice notice-error"><p>' . esc_html( $msg ) . '</p></div>';
        delete_transient( 'ps_publish_error_' . $post->ID );
    }
}

// Enforce unique (city_tag, service_slug) composite key
add_action( 'save_post_ps_service', 'ps_enforce_service_uniqueness', 10, 2 );
function ps_enforce_service_uniqueness( int $post_id, WP_Post $post ): void {
    if ( wp_is_post_revision( $post_id ) || $post->post_status === 'auto-draft' ) return;

    $service_slug = get_post_meta( $post_id, 'ps_service_slug', true );
    if ( ! $service_slug ) return;

    $city_tags = wp_get_post_terms( $post_id, 'ps_city_tag', [ 'fields' => 'slugs' ] );
    if ( is_wp_error( $city_tags ) || empty( $city_tags ) ) return;
    $city_slug = $city_tags[0];

    // Look for another service post with the same city+slug combo
    $duplicate = get_posts( [
        'post_type'   => 'ps_service',
        'exclude'     => [ $post_id ],
        'numberposts' => 1,
        'tax_query'   => [ [ 'taxonomy' => 'ps_city_tag', 'field' => 'slug', 'terms' => $city_slug ] ],
        'meta_query'  => [ [ 'key' => 'ps_service_slug', 'value' => $service_slug ] ],
        'fields'      => 'ids',
    ] );

    if ( $duplicate ) {
        set_transient( 'ps_service_error_' . $post_id, "A service with slug '$service_slug' already exists for city '$city_slug'. Post reverted to draft.", 60 );
        remove_action( 'save_post_ps_service', 'ps_enforce_service_uniqueness', 10 );
        wp_update_post( [ 'ID' => $post_id, 'post_status' => 'draft' ] );
    }
}

// ============================================================
// 8. ROLES & CAPABILITIES
// ============================================================

register_activation_hook( __FILE__, 'ps_create_roles' );

function ps_create_roles(): void {
    // ps_manager — manages all CPTs, cannot edit theme/plugins
    $editor = get_role( 'editor' );
    $caps   = $editor ? $editor->capabilities : [];

    $manager_extra = [
        'publish_posts'         => true,
        'edit_others_posts'     => true,
        'delete_posts'          => true,
        'read_ps_lead'          => true,
        'edit_ps_leads'         => true,
    ];

    add_role( 'ps_manager', 'PlayaStays Manager', array_merge( $caps, $manager_extra ) );

    // ps_editor — blog posts and FAQs only, cannot publish listings
    add_role( 'ps_editor', 'PlayaStays Editor', [
        'read'             => true,
        'edit_posts'       => true,
        'delete_posts'     => true,
        'upload_files'     => true,
        'manage_categories' => true,
    ] );

    // ps_owner — can submit properties (draft only), read own leads
    add_role( 'ps_owner', 'Property Owner', [
        'read'       => true,
        'edit_posts' => true,   // needed to submit CPT
    ] );
}

register_deactivation_hook( __FILE__, 'ps_remove_roles' );
function ps_remove_roles(): void {
    remove_role( 'ps_manager' );
    remove_role( 'ps_editor' );
    remove_role( 'ps_owner' );
}

// ============================================================
// 9. CUSTOM IMAGE SIZES
// ============================================================

add_action( 'after_setup_theme', 'ps_add_image_sizes' );
function ps_add_image_sizes(): void {
    add_image_size( 'ps_card', 600, 400, true );   // Property card grid
    add_image_size( 'ps_hero', 1200, 800, true );  // Property hero
}

// ============================================================
// 10. ADMIN METABOXES — Bilingual fields panel
// ============================================================

add_action( 'add_meta_boxes', 'ps_add_bilingual_metabox' );

function ps_add_bilingual_metabox(): void {
    $post_types = [ 'ps_city', 'ps_service', 'ps_property', 'post', 'ps_faq', 'ps_testimonial' ];
    foreach ( $post_types as $pt ) {
        add_meta_box(
            'ps_bilingual_fields',
            '🌐 PlayaStays — Bilingual Fields (EN / ES)',
            'ps_render_bilingual_metabox',
            $pt,
            'normal',
            'high'
        );
    }
}

function ps_render_bilingual_metabox( WP_Post $post ): void {
    wp_nonce_field( 'ps_save_bilingual', 'ps_bilingual_nonce' );
    $pt = $post->post_type;
    ?>
    <style>
        .ps-bi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .ps-bi-col h4 { margin: 0 0 12px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #777; }
        .ps-field { margin-bottom: 14px; }
        .ps-field label { display: block; font-size: 12px; font-weight: 600; color: #555; margin-bottom: 4px; }
        .ps-field input, .ps-field textarea { width: 100%; }
        .ps-field textarea { height: 120px; }
        .ps-field-note { font-size: 11px; color: #999; margin-top: 3px; }
    </style>

    <div class="ps-bi-grid">
        <!-- EN column -->
        <div class="ps-bi-col">
            <h4>🇬🇧 English (source of truth)</h4>
            <p style="font-size:12px;color:#888;">The EN content lives in the post Title and Content editor above. The fields below are SEO overrides.</p>

            <?php ps_text_field( 'ps_seo_title', 'SEO Title (EN)', $post->ID, 'Override the <title> tag for search engines' ); ?>
            <?php ps_textarea_field( 'ps_seo_desc', 'Meta Description (EN)', $post->ID, '150–160 characters recommended', 80 ); ?>

            <?php if ( $pt === 'post' ) : ?>
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid #ddd;">
                    <h4 style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555;">🔗 Next.js — sidebar internal links</h4>
                    <p style="font-size:12px;color:#888;margin:0 0 12px;">Optional. Matches <code>ps_city</code> slug and public EN service segment (same as URLs).</p>
                    <?php
                    ps_text_field( 'ps_primary_city', 'Primary city slug', $post->ID, 'e.g. playa-del-carmen, tulum' );
                    ps_text_field( 'ps_primary_service', 'Primary service slug', $post->ID, 'e.g. property-management, airbnb-management' );
                    ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- ES column -->
        <div class="ps-bi-col">
            <h4>🇲🇽 Español (required for ES ranking)</h4>
            <p style="font-size:12px;color:#e06c00;">⚠️ Leave blank = ES pages will be noindex until filled.</p>

            <?php
            if ( $pt === 'ps_city' || $pt === 'ps_property' || $pt === 'post' ):
                ps_text_field( 'ps_title_es',   'Título (ES)',   $post->ID );
                ps_textarea_field( 'ps_excerpt_es', 'Resumen corto (ES)', $post->ID, '', 80 );
                ps_textarea_field( 'ps_content_es', 'Contenido completo (ES)', $post->ID, 'HTML aceptado' );
            endif;

            if ( $pt === 'ps_service' ):
                ps_text_field( 'ps_hero_headline_es',    'Titular hero (ES)',    $post->ID );
                ps_text_field( 'ps_hero_subheadline_es', 'Subtitular hero (ES)', $post->ID );
                ps_textarea_field( 'ps_content_es', 'Contenido (ES)', $post->ID, 'HTML aceptado' );
                ps_text_field( 'ps_seo_title_es', 'SEO Title (ES)', $post->ID );
                ps_textarea_field( 'ps_seo_desc_es', 'Meta Descripción (ES)', $post->ID, '150–160 caracteres', 80 );
            endif;

            if ( $pt === 'ps_faq' ):
                ps_text_field( 'ps_question_es', 'Pregunta (ES)', $post->ID );
                ps_textarea_field( 'ps_answer_es', 'Respuesta (ES)', $post->ID, 'HTML aceptado' );
            endif;

            if ( $pt === 'ps_testimonial' ):
                ps_textarea_field( 'ps_content_es', 'Cita (ES)', $post->ID, '', 80 );
            endif;

            if ( $pt === 'ps_city' ):
                ps_textarea_field( 'ps_market_note_es', 'Nota de mercado (ES)', $post->ID );
                ps_text_field( 'ps_best_for_es',     'Mejor para (ES)',      $post->ID );
                ps_text_field( 'ps_peak_season_es',  'Temporada alta (ES)',  $post->ID );
            endif;
            ?>
        </div>
    </div>
    <?php
}

function ps_text_field( string $key, string $label, int $post_id, string $note = '' ): void {
    $val = esc_attr( get_post_meta( $post_id, $key, true ) );
    echo "<div class='ps-field'>";
    echo "<label for='$key'>$label</label>";
    echo "<input type='text' id='$key' name='$key' value='$val' />";
    if ( $note ) echo "<div class='ps-field-note'>$note</div>";
    echo "</div>";
}

function ps_textarea_field( string $key, string $label, int $post_id, string $note = '', int $height = 120 ): void {
    $val = esc_textarea( get_post_meta( $post_id, $key, true ) );
    echo "<div class='ps-field'>";
    echo "<label for='$key'>$label</label>";
    echo "<textarea id='$key' name='$key' style='height:{$height}px'>$val</textarea>";
    if ( $note ) echo "<div class='ps-field-note'>$note</div>";
    echo "</div>";
}

add_action( 'save_post', 'ps_save_bilingual_meta', 10, 2 );
function ps_save_bilingual_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['ps_bilingual_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['ps_bilingual_nonce'], 'ps_save_bilingual' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $text_fields = [
        'ps_seo_title', 'ps_seo_desc', 'ps_title_es', 'ps_excerpt_es',
        'ps_hero_headline_es', 'ps_hero_subheadline_es', 'ps_seo_title_es', 'ps_seo_desc_es',
        'ps_question_es', 'ps_best_for_es', 'ps_peak_season_es',
    ];
    $textarea_fields = [
        'ps_content_es', 'ps_answer_es', 'ps_market_note_es',
    ];

    foreach ( $text_fields as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_text_field( $_POST[ $key ] ) );
        }
    }
    foreach ( $textarea_fields as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, wp_kses_post( $_POST[ $key ] ) );
        }
    }

    foreach ( [ 'ps_primary_city', 'ps_primary_service' ] as $slug_key ) {
        if ( ! isset( $_POST[ $slug_key ] ) ) {
            continue;
        }
        $raw = trim( (string) wp_unslash( $_POST[ $slug_key ] ) );
        update_post_meta( $post_id, $slug_key, $raw === '' ? '' : sanitize_key( $raw ) );
    }
}

// ============================================================
// 11. PROPERTY OPERATIONS METABOX — structured amenities + ops fields
// ============================================================

add_action( 'add_meta_boxes', 'ps_add_property_ops_metabox' );

function ps_add_property_ops_metabox(): void {
    add_meta_box(
        'ps_property_ops',
        '🏠 Property Operations',
        'ps_render_property_ops_metabox',
        'ps_property',
        'normal',
        'default'
    );
}

function ps_render_property_ops_metabox( WP_Post $post ): void {
    wp_nonce_field( 'ps_save_property_ops', 'ps_property_ops_nonce' );

    // Current amenity keys
    $raw_keys = get_post_meta( $post->ID, 'ps_amenity_keys', true );
    $selected = json_decode( $raw_keys ?: '[]', true );
    if ( ! is_array( $selected ) ) $selected = [];
    $selected_map = array_flip( $selected );

    // Ops fields
    $ops_status   = get_post_meta( $post->ID, 'ps_ops_status', true ) ?: 'active';
    $manager_id   = (int) get_post_meta( $post->ID, 'ps_manager_id', true );
    $building     = get_post_meta( $post->ID, 'ps_building_name', true );
    $notes        = get_post_meta( $post->ID, 'ps_internal_notes', true );
    $check_in     = get_post_meta( $post->ID, 'ps_check_in_time', true );
    $check_out    = get_post_meta( $post->ID, 'ps_check_out_time', true );
    $house_rules  = get_post_meta( $post->ID, 'ps_house_rules', true );
    $map_mode     = get_post_meta( $post->ID, 'ps_map_display_mode', true ) ?: 'exact';
    $listing_type    = get_post_meta( $post->ID, 'ps_listing_type', true ) ?: 'rent';
    $rental_strategy = get_post_meta( $post->ID, 'ps_rental_strategy', true ) ?: '';

    // Amenity taxonomy — mirrors amenity-taxonomy.ts AMENITY_CATEGORIES
    $amenity_groups = [
        'Guest favorites' => [
            'wifi'             => 'WiFi',
            'tv'               => 'TV',
            'kitchen'          => 'Kitchen',
            'washer-dryer'     => 'Washer / dryer',
            'air-conditioning' => 'Air conditioning',
            'workspace'        => 'Dedicated workspace',
            'parking'          => 'Parking',
            'furnished'        => 'Furnished',
        ],
        'Standout amenities' => [
            'pool'              => 'Pool',
            'hot-tub-private'   => 'Private hot tub',
            'hot-tub-shared'    => 'Shared hot tub',
            'balcony'           => 'Balcony / terrace',
            'patio'             => 'Patio',
            'bbq-grill'         => 'BBQ grill',
            'outdoor-dining'    => 'Outdoor dining area',
            'exercise-equipment'=> 'Exercise equipment',
            'beach-access'      => 'Beach access',
        ],
        'Location & views' => [
            'beachfront'       => 'Beachfront',
            'waterfront'       => 'Waterfront',
            'ocean-view'       => 'Ocean view',
            'walk-beach'       => 'Walk to beach',
            'downtown'         => 'Downtown / Centro',
            'gated-community'  => 'Gated community',
            'quiet-area'       => 'Quiet area',
        ],
        'Safety' => [
            'smoke-alarm'          => 'Smoke alarm',
            'fire-extinguisher'    => 'Fire extinguisher',
            'first-aid-kit'        => 'First aid kit',
            'carbon-monoxide-alarm'=> 'CO alarm',
        ],
        'Stay preferences' => [
            'pet-friendly'     => 'Pet-friendly',
            'family-friendly'  => 'Family-friendly',
            'elevator'         => 'Elevator',
        ],
    ];

    ?>
    <style>
        .ps-ops-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; }
        .ps-ops-section { margin-bottom: 20px; }
        .ps-ops-section h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #666; border-bottom: 1px solid #eee; padding-bottom: 6px; }
        .ps-amenity-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 4px 12px; }
        .ps-amenity-grid label { font-size: 13px; display: flex; align-items: center; gap: 5px; padding: 2px 0; cursor: pointer; }
        .ps-amenity-grid label:hover { color: #0073aa; }
        .ps-amenity-group { margin-bottom: 14px; }
        .ps-amenity-group-title { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 6px; }
        .ps-ops-row { margin-bottom: 10px; }
        .ps-ops-row label { display: block; font-size: 12px; font-weight: 600; color: #555; margin-bottom: 3px; }
        .ps-ops-row select, .ps-ops-row input, .ps-ops-row textarea { width: 100%; }
        .ps-ops-row textarea { height: 80px; }
        .ps-ops-note { font-size: 11px; color: #999; margin-top: 2px; }
    </style>

    <h3 style="margin-top:4px;">Structured Amenities</h3>
    <p style="font-size:12px;color:#666;">Check amenities that this property actually has. This powers browse filters, detail page display, and smart tags.</p>

    <?php foreach ( $amenity_groups as $group_name => $items ) : ?>
        <div class="ps-amenity-group">
            <div class="ps-amenity-group-title"><?php echo esc_html( $group_name ); ?></div>
            <div class="ps-amenity-grid">
                <?php foreach ( $items as $key => $label ) : ?>
                    <label>
                        <input type="checkbox" name="ps_amenity_keys_selected[]" value="<?php echo esc_attr( $key ); ?>"
                            <?php checked( isset( $selected_map[ $key ] ) ); ?> />
                        <?php echo esc_html( $label ); ?>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endforeach; ?>

    <hr style="margin: 20px 0;" />

    <div class="ps-ops-grid">
        <div>
            <h4 style="margin-top:0;">Operations</h4>

            <div class="ps-ops-row">
                <label for="ps_listing_type">Listing Type</label>
                <select id="ps_listing_type" name="ps_listing_type">
                    <option value="rent" <?php selected( $listing_type, 'rent' ); ?>>For Rent</option>
                    <option value="sale" <?php selected( $listing_type, 'sale' ); ?>>For Sale</option>
                    <option value="both" <?php selected( $listing_type, 'both' ); ?>>Both</option>
                </select>
            </div>

            <div class="ps-ops-row">
                <label for="ps_rental_strategy">Rental strategy</label>
                <select id="ps_rental_strategy" name="ps_rental_strategy">
                    <option value="" <?php selected( $rental_strategy, '' ); ?>>— Not set (infer from rates in app) —</option>
                    <option value="vacation_rental" <?php selected( $rental_strategy, 'vacation_rental' ); ?>>Vacation / short-term</option>
                    <option value="long_term" <?php selected( $rental_strategy, 'long_term' ); ?>>Long-term rental</option>
                    <option value="hybrid" <?php selected( $rental_strategy, 'hybrid' ); ?>>Both / hybrid</option>
                </select>
                <div class="ps-ops-note">Separate from listing type. Used for browse filters and badges (not in public URLs).</div>
            </div>

            <div class="ps-ops-row">
                <label for="ps_ops_status">Ops Status</label>
                <select id="ps_ops_status" name="ps_ops_status">
                    <option value="active" <?php selected( $ops_status, 'active' ); ?>>Active</option>
                    <option value="needs-attention" <?php selected( $ops_status, 'needs-attention' ); ?>>Needs Attention</option>
                    <option value="maintenance" <?php selected( $ops_status, 'maintenance' ); ?>>Maintenance</option>
                    <option value="onboarding" <?php selected( $ops_status, 'onboarding' ); ?>>Onboarding</option>
                    <option value="inactive" <?php selected( $ops_status, 'inactive' ); ?>>Inactive</option>
                </select>
            </div>

            <div class="ps-ops-row">
                <label for="ps_map_display_mode">Map Display</label>
                <select id="ps_map_display_mode" name="ps_map_display_mode">
                    <option value="exact" <?php selected( $map_mode, 'exact' ); ?>>Exact</option>
                    <option value="approximate" <?php selected( $map_mode, 'approximate' ); ?>>Approximate</option>
                    <option value="hidden" <?php selected( $map_mode, 'hidden' ); ?>>Hidden</option>
                </select>
            </div>

            <div class="ps-ops-row">
                <label for="ps_building_name">Building / Development</label>
                <input type="text" id="ps_building_name" name="ps_building_name" value="<?php echo esc_attr( $building ); ?>" />
            </div>

            <div class="ps-ops-row">
                <label for="ps_manager_id">Assigned Manager (User ID)</label>
                <input type="number" id="ps_manager_id" name="ps_manager_id" value="<?php echo esc_attr( $manager_id ?: '' ); ?>" min="0" />
                <div class="ps-ops-note">WP user ID of the assigned property manager</div>
            </div>
        </div>

        <div>
            <h4 style="margin-top:0;">Guest Details</h4>

            <div class="ps-ops-row">
                <label for="ps_check_in_time">Check-in Time</label>
                <input type="text" id="ps_check_in_time" name="ps_check_in_time" value="<?php echo esc_attr( $check_in ); ?>" placeholder="3:00 PM" />
            </div>

            <div class="ps-ops-row">
                <label for="ps_check_out_time">Check-out Time</label>
                <input type="text" id="ps_check_out_time" name="ps_check_out_time" value="<?php echo esc_attr( $check_out ); ?>" placeholder="11:00 AM" />
            </div>

            <div class="ps-ops-row">
                <label for="ps_house_rules">House Rules</label>
                <textarea id="ps_house_rules" name="ps_house_rules"><?php echo esc_textarea( $house_rules ); ?></textarea>
            </div>

            <div class="ps-ops-row">
                <label for="ps_internal_notes">Internal Notes (admin-only)</label>
                <textarea id="ps_internal_notes" name="ps_internal_notes" style="background:#fff8e1;"><?php echo esc_textarea( $notes ); ?></textarea>
                <div class="ps-ops-note">Never shown publicly. For internal team use only.</div>
            </div>
        </div>
    </div>
    <?php
}

add_action( 'save_post_ps_property', 'ps_save_property_ops_meta', 15, 2 );
function ps_save_property_ops_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['ps_property_ops_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['ps_property_ops_nonce'], 'ps_save_property_ops' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    // Amenity keys → JSON array
    $keys = isset( $_POST['ps_amenity_keys_selected'] ) && is_array( $_POST['ps_amenity_keys_selected'] )
        ? array_map( 'sanitize_key', $_POST['ps_amenity_keys_selected'] )
        : [];
    update_post_meta( $post_id, 'ps_amenity_keys', wp_json_encode( array_values( $keys ) ) );

    // Ops fields
    $text_fields = [
        'ps_listing_type', 'ps_rental_strategy', 'ps_ops_status', 'ps_map_display_mode',
        'ps_building_name', 'ps_check_in_time', 'ps_check_out_time',
    ];
    foreach ( $text_fields as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_text_field( $_POST[ $key ] ) );
        }
    }

    if ( isset( $_POST['ps_manager_id'] ) ) {
        update_post_meta( $post_id, 'ps_manager_id', absint( $_POST['ps_manager_id'] ) );
    }

    $textarea_fields = [ 'ps_house_rules', 'ps_internal_notes' ];
    foreach ( $textarea_fields as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta( $post_id, $key, sanitize_textarea_field( $_POST[ $key ] ) );
        }
    }
}

// ============================================================
// 12. SETTINGS PAGE
// ============================================================

add_action( 'admin_menu', 'ps_settings_menu' );
function ps_settings_menu(): void {
    add_options_page( 'PlayaStays Settings', 'PlayaStays', 'manage_options', 'playastays-settings', 'ps_render_settings_page' );
}

function ps_render_settings_page(): void {
    if ( isset( $_POST['ps_settings_nonce'] ) && wp_verify_nonce( $_POST['ps_settings_nonce'], 'ps_save_settings' ) ) {
        update_option( 'ps_phone',              sanitize_text_field( $_POST['ps_phone'] ?? '' ) );
        update_option( 'ps_whatsapp',           sanitize_text_field( $_POST['ps_whatsapp'] ?? '' ) );
        update_option( 'ps_email',              sanitize_email( $_POST['ps_email'] ?? '' ) );
        update_option( 'ps_address',            sanitize_text_field( $_POST['ps_address'] ?? '' ) );
        update_option( 'ps_social_facebook',    esc_url_raw( $_POST['ps_social_facebook'] ?? '' ) );
        update_option( 'ps_social_instagram',   esc_url_raw( $_POST['ps_social_instagram'] ?? '' ) );
        update_option( 'ps_revalidate_url',     esc_url_raw( $_POST['ps_revalidate_url'] ?? '' ) );
        update_option( 'ps_revalidate_secret',  sanitize_text_field( $_POST['ps_revalidate_secret'] ?? '' ) );
        echo '<div class="updated"><p>Settings saved.</p></div>';
    }
    ?>
    <div class="wrap">
        <h1>PlayaStays Settings</h1>
        <form method="post">
            <?php wp_nonce_field( 'ps_save_settings', 'ps_settings_nonce' ); ?>
            <table class="form-table">
                <tr><th>Phone</th><td><input type="text" name="ps_phone" value="<?php echo esc_attr(get_option('ps_phone')); ?>" class="regular-text" /></td></tr>
                <tr><th>WhatsApp number</th><td><input type="text" name="ps_whatsapp" value="<?php echo esc_attr(get_option('ps_whatsapp')); ?>" class="regular-text" /><p class="description">E.g. 529841234567 (no + or spaces)</p></td></tr>
                <tr><th>Email</th><td><input type="email" name="ps_email" value="<?php echo esc_attr(get_option('ps_email')); ?>" class="regular-text" /></td></tr>
                <tr><th>Address</th><td><input type="text" name="ps_address" value="<?php echo esc_attr(get_option('ps_address')); ?>" class="regular-text" /></td></tr>
                <tr><th>Facebook URL</th><td><input type="url" name="ps_social_facebook" value="<?php echo esc_attr(get_option('ps_social_facebook')); ?>" class="regular-text" /></td></tr>
                <tr><th>Instagram URL</th><td><input type="url" name="ps_social_instagram" value="<?php echo esc_attr(get_option('ps_social_instagram')); ?>" class="regular-text" /></td></tr>
                <tr><th>ISR Revalidate URL</th><td><input type="url" name="ps_revalidate_url" value="<?php echo esc_attr(get_option('ps_revalidate_url', 'https://www.playastays.com/api/revalidate')); ?>" class="large-text" /></td></tr>
                <tr><th>ISR Revalidate Secret</th><td><input type="text" name="ps_revalidate_secret" value="<?php echo esc_attr(get_option('ps_revalidate_secret')); ?>" class="regular-text" /></td></tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// == REST COLLECTION PARAM EXTENSIONS ==
//
// Register custom query args so REST validation accepts the headless frontend contract (avoids 400 before rest_*_query runs).

/**
 * Widen taxonomy REST params to accept slug strings (and merge with core schema when present).
 *
 * @param array<string,mixed>|null $existing Existing param schema from core.
 * @param string                   $param_name Parameter key (for description).
 * @return array<string,mixed>
 */
function ps_rest_collection_param_tax_slug_or_id( $existing, $param_name ) {
    // Widen past core’s integer-only taxonomy param (e.g. ps_city_tag[0] must be int).
    // Accept a slug string, a single ID, or an array of slug(s) and/or ID(s).
    return [
        'description' => sprintf( __( 'Term slug(s) or ID(s) (%s).' ), $param_name ),
        'type'        => [ 'string', 'integer', 'array' ],
        'items'       => [ 'type' => [ 'integer', 'string' ] ],
        'required'    => false,
    ];
}

/**
 * Drop REST-generated ps_city_tag clauses (term_id) so we can re-apply with slug/ID.
 *
 * @param array<string, mixed> $args WP_Query args.
 * @return array<string, mixed>
 */
function ps_rest_strip_ps_city_tag_clauses( array $args ): array {
    if ( empty( $args['tax_query'] ) || ! is_array( $args['tax_query'] ) ) {
        return $args;
    }
    $args['tax_query'] = array_values(
        array_filter(
            $args['tax_query'],
            static function ( $q ) {
                return ! ( is_array( $q ) && isset( $q['taxonomy'] ) && 'ps_city_tag' === $q['taxonomy'] );
            }
        )
    );
    return $args;
}

/**
 * Apply ?ps_city_tag= from the request (slug, ID, or list) on top of a stripped tax_query.
 *
 * @param array<string, mixed> $args    WP_Query args.
 * @param WP_REST_Request      $request Request.
 * @return array<string, mixed>
 */
function ps_rest_merge_ps_city_tag_tax( array $args, WP_REST_Request $request ): array {
    $raw = $request->get_param( 'ps_city_tag' );
    if ( null === $raw || '' === $raw || ( is_array( $raw ) && array() === $raw ) ) {
        return $args;
    }
    $args = ps_rest_strip_ps_city_tag_clauses( $args );
    $vals = is_array( $raw ) ? $raw : [ $raw ];
    $vals = array_values(
        array_filter(
            array_map(
                static function ( $v ) {
                    return trim( (string) $v );
                },
                $vals
            ),
            static function ( $v ) {
                return '' !== $v;
            }
        )
    );
    if ( array() === $vals ) {
        return $args;
    }
    $is_slug = false;
    foreach ( $vals as $v ) {
        if ( ! is_numeric( $v ) ) {
            $is_slug = true;
            break;
        }
    }
    if ( ! isset( $args['tax_query'] ) || ! is_array( $args['tax_query'] ) ) {
        $args['tax_query'] = [];
    }
    if ( $is_slug ) {
        $terms = array_map( 'sanitize_title', array_map( 'strval', $vals ) );
    } else {
        $terms = array_map( 'absint', $vals );
    }
    $args['tax_query'][] = [
        'taxonomy' => 'ps_city_tag',
        'field'    => $is_slug ? 'slug' : 'term_id',
        'terms'    => 1 === count( $terms ) ? $terms[0] : $terms,
    ];
    return $args;
}

/**
 * @param array<string,mixed> $params Collection params for ps_faq.
 * @param WP_Post_Type        $post_type Post type object.
 * @return array<string,mixed>
 */
function ps_rest_ps_faq_collection_params( $params, $post_type ) {
    if ( isset( $params['orderby']['enum'] ) && is_array( $params['orderby']['enum'] ) ) {
        if ( ! in_array( 'meta_value_num', $params['orderby']['enum'], true ) ) {
            $params['orderby']['enum'][] = 'meta_value_num';
        }
    }
    if ( ! isset( $params['meta_key'] ) ) {
        $params['meta_key'] = [
            'description' => __( 'Meta key for ordering or filtering.' ),
            'type'        => 'string',
        ];
    }
    $params['ps_faq_category'] = ps_rest_collection_param_tax_slug_or_id( $params['ps_faq_category'] ?? null, 'ps_faq_category' );
    $params['ps_city_tag']     = ps_rest_collection_param_tax_slug_or_id( $params['ps_city_tag'] ?? null, 'ps_city_tag' );

    return $params;
}

/**
 * @param array<string,mixed> $params Collection params for ps_testimonial.
 * @param WP_Post_Type        $post_type Post type object.
 * @return array<string,mixed>
 */
function ps_rest_ps_testimonial_collection_params( $params, $post_type ) {
    if ( isset( $params['orderby']['enum'] ) && is_array( $params['orderby']['enum'] ) ) {
        if ( ! in_array( 'meta_value_num', $params['orderby']['enum'], true ) ) {
            $params['orderby']['enum'][] = 'meta_value_num';
        }
    }
    if ( ! isset( $params['meta_key'] ) ) {
        $params['meta_key'] = [
            'description' => __( 'Meta key for ordering or filtering.' ),
            'type'        => 'string',
        ];
    }
    if ( ! isset( $params['meta_value'] ) ) {
        $params['meta_value'] = [
            'description' => __( 'Meta value.' ),
            'type'        => 'string',
        ];
    }

    return $params;
}

/**
 * @param array<string,mixed> $params Collection params for ps_service.
 * @param WP_Post_Type        $post_type Post type object.
 * @return array<string,mixed>
 */
function ps_rest_ps_service_collection_params( $params, $post_type ) {
    $params['ps_city_tag'] = ps_rest_collection_param_tax_slug_or_id( $params['ps_city_tag'] ?? null, 'ps_city_tag' );
    if ( ! isset( $params['meta_key'] ) ) {
        $params['meta_key'] = [
            'description' => __( 'Meta key for ordering or filtering.' ),
            'type'        => 'string',
        ];
    }
    if ( ! isset( $params['meta_value'] ) ) {
        $params['meta_value'] = [
            'description' => __( 'Meta value.' ),
            'type'        => 'string',
        ];
    }

    return $params;
}

/**
 * @param array<string,mixed> $params Collection params for ps_property (REST base: properties).
 * @param WP_Post_Type        $post_type Post type object.
 * @return array<string,mixed>
 */
function ps_rest_ps_property_collection_params( $params, $post_type ) {
    $params['ps_city_tag'] = ps_rest_collection_param_tax_slug_or_id( $params['ps_city_tag'] ?? null, 'ps_city_tag' );
    if ( ! isset( $params['meta_key'] ) ) {
        $params['meta_key'] = [
            'description' => __( 'Meta key for ordering or filtering.' ),
            'type'        => 'string',
        ];
    }
    if ( ! isset( $params['meta_value'] ) ) {
        $params['meta_value'] = [
            'description' => __( 'Meta value.' ),
            'type'        => 'string',
        ];
    }

    return $params;
}

add_filter( 'rest_ps_faq_collection_params', 'ps_rest_ps_faq_collection_params', 10, 2 );
add_filter( 'rest_ps_testimonial_collection_params', 'ps_rest_ps_testimonial_collection_params', 10, 2 );
add_filter( 'rest_ps_service_collection_params', 'ps_rest_ps_service_collection_params', 10, 2 );
add_filter( 'rest_ps_property_collection_params', 'ps_rest_ps_property_collection_params', 10, 2 );

// == REST QUERY FILTERS ==
//
// Map validated query params into WP_Query $args. REST route for properties is /wp/v2/properties; filter uses CPT slug ps_property.

/**
 * @param array<string,mixed> $args    Query args for WP_Query.
 * @param WP_REST_Request     $request Request object.
 * @return array<string,mixed>
 */
function ps_rest_ps_faq_query( $args, $request ) {
    if ( ! $request instanceof WP_REST_Request ) {
        return $args;
    }
    $q = $request->get_query_params();
    if ( isset( $q['orderby'] ) && 'meta_value_num' === $q['orderby'] ) {
        $args['orderby'] = 'meta_value_num';
    }
    if ( isset( $q['meta_key'] ) && '' !== $q['meta_key'] ) {
        $args['meta_key'] = sanitize_key( (string) $q['meta_key'] );
    }
    if ( isset( $q['ps_faq_category'] ) && '' !== $q['ps_faq_category'] ) {
        if ( ! isset( $args['tax_query'] ) || ! is_array( $args['tax_query'] ) ) {
            $args['tax_query'] = [];
        }
        $args['tax_query'][] = [
            'taxonomy' => 'ps_faq_category',
            'field'    => 'slug',
            'terms'    => sanitize_title( (string) $q['ps_faq_category'] ),
        ];
    }

    return ps_rest_merge_ps_city_tag_tax( $args, $request );
}

/**
 * @param array<string,mixed> $args    Query args for WP_Query.
 * @param WP_REST_Request     $request Request object.
 * @return array<string,mixed>
 */
function ps_rest_ps_testimonial_query( $args, $request ) {
    if ( ! $request instanceof WP_REST_Request ) {
        return $args;
    }
    $q = $request->get_query_params();
    if ( isset( $q['orderby'] ) && 'meta_value_num' === $q['orderby'] ) {
        $args['orderby'] = 'meta_value_num';
    }
    if ( isset( $q['meta_key'] ) && '' !== $q['meta_key'] ) {
        $args['meta_key'] = sanitize_key( (string) $q['meta_key'] );
    }
    if ( isset( $q['meta_value'] ) && '' !== $q['meta_value'] ) {
        $args['meta_value'] = sanitize_text_field( (string) $q['meta_value'] );
    }

    return $args;
}

/**
 * @param array<string,mixed> $args    Query args for WP_Query.
 * @param WP_REST_Request     $request Request object.
 * @return array<string,mixed>
 */
function ps_rest_ps_service_query( $args, $request ) {
    if ( ! $request instanceof WP_REST_Request ) {
        return $args;
    }
    $q = $request->get_query_params();
    if ( isset( $q['meta_key'] ) && '' !== $q['meta_key'] ) {
        $args['meta_key'] = sanitize_key( (string) $q['meta_key'] );
    }
    if ( isset( $q['meta_value'] ) && '' !== $q['meta_value'] ) {
        $args['meta_value'] = sanitize_text_field( (string) $q['meta_value'] );
    }
    if ( isset( $q['orderby'] ) && 'meta_value_num' === $q['orderby'] ) {
        $args['orderby'] = 'meta_value_num';
    }

    return ps_rest_merge_ps_city_tag_tax( $args, $request );
}

/**
 * @param array<string,mixed> $args    Query args for WP_Query.
 * @param WP_REST_Request     $request Request object.
 * @return array<string,mixed>
 */
function ps_rest_ps_property_query( $args, $request ) {
    if ( ! $request instanceof WP_REST_Request ) {
        return $args;
    }
    $q = $request->get_query_params();
    if ( isset( $q['orderby'] ) && 'meta_value_num' === $q['orderby'] ) {
        $args['orderby'] = 'meta_value_num';
    }
    if ( isset( $q['meta_key'] ) && '' !== $q['meta_key'] ) {
        $args['meta_key'] = sanitize_key( (string) $q['meta_key'] );
    }
    if ( isset( $q['meta_value'] ) && '' !== $q['meta_value'] ) {
        $args['meta_value'] = sanitize_text_field( (string) $q['meta_value'] );
    }

    return ps_rest_merge_ps_city_tag_tax( $args, $request );
}

/**
 * REST collection params for standard posts — blog topic/area filters (slug or ID).
 *
 * @param array<string,mixed> $params Collection params.
 * @param WP_Post_Type        $post_type Post type object.
 * @return array<string,mixed>
 */
function ps_rest_post_collection_params( $params, $post_type ) {
    if ( ! $post_type || 'post' !== $post_type->name ) {
        return $params;
    }
    $params['ps_blog_topic'] = ps_rest_collection_param_tax_slug_or_id( $params['ps_blog_topic'] ?? null, 'ps_blog_topic' );
    $params['ps_blog_area']  = ps_rest_collection_param_tax_slug_or_id( $params['ps_blog_area'] ?? null, 'ps_blog_area' );
    $params['ps_city_tag']   = ps_rest_collection_param_tax_slug_or_id( $params['ps_city_tag'] ?? null, 'ps_city_tag' );
    return $params;
}

/**
 * Apply blog taxonomy filters to post REST queries (slug or numeric ID).
 *
 * @param array<string,mixed> $args    Query args.
 * @param WP_REST_Request     $request Request.
 * @return array<string,mixed>
 */
function ps_rest_post_query_blog_tax( $args, $request ) {
    if ( ! $request instanceof WP_REST_Request ) {
        return $args;
    }
    $q       = $request->get_query_params();
    $clauses = [];
    foreach ( [ 'ps_blog_topic' => 'ps_blog_topic', 'ps_blog_area' => 'ps_blog_area' ] as $param => $taxonomy ) {
        if ( ! isset( $q[ $param ] ) || '' === $q[ $param ] ) {
            continue;
        }
        $raw = $q[ $param ];
        if ( is_numeric( $raw ) ) {
            $clauses[] = [
                'taxonomy' => $taxonomy,
                'field'    => 'term_id',
                'terms'    => (int) $raw,
            ];
        } else {
            $clauses[] = [
                'taxonomy' => $taxonomy,
                'field'    => 'slug',
                'terms'    => sanitize_title( (string) $raw ),
            ];
        }
    }
    if ( ! empty( $clauses ) ) {
        if ( count( $clauses ) > 1 ) {
            $args['tax_query'] = array_merge( [ 'relation' => 'AND' ], $clauses );
        } else {
            $args['tax_query'] = $clauses;
        }
    }
    return $args;
}

/**
 * Headless ?ps_city_tag= on blog post collections (slug / ID / list).
 *
 * @param array<string, mixed> $args    Query args.
 * @param WP_REST_Request      $request Request.
 * @return array<string, mixed>
 */
function ps_rest_post_query_ps_city_tag( $args, $request ) {
    if ( ! $request instanceof WP_REST_Request ) {
        return $args;
    }
    return ps_rest_merge_ps_city_tag_tax( $args, $request );
}

add_filter( 'rest_post_collection_params', 'ps_rest_post_collection_params', 10, 2 );
add_filter( 'rest_post_query', 'ps_rest_post_query_blog_tax', 10, 2 );
add_filter( 'rest_post_query', 'ps_rest_post_query_ps_city_tag', 15, 2 );

add_filter( 'rest_ps_faq_query', 'ps_rest_ps_faq_query', 10, 2 );
add_filter( 'rest_ps_testimonial_query', 'ps_rest_ps_testimonial_query', 10, 2 );
add_filter( 'rest_ps_service_query', 'ps_rest_ps_service_query', 10, 2 );
add_filter( 'rest_ps_property_query', 'ps_rest_ps_property_query', 10, 2 );

// == TEMPORARY DEBUG — remove after deployment verification ==
add_action( 'rest_api_init', 'ps_register_debug_rest_route' );

/**
 * Registers GET /wp-json/playastays/v1/debug-rest (temporary).
 */
function ps_register_debug_rest_route() {
    register_rest_route(
        'playastays/v1',
        '/debug-rest',
        [
            'methods'             => 'GET',
            'callback'            => 'ps_debug_rest_callback',
            'permission_callback' => '__return_true',
        ]
    );
}

/**
 * @return WP_REST_Response
 */
function ps_debug_rest_callback() {
    return new WP_REST_Response(
        [
            'ok'                 => true,
            'source'             => 'playastays-content-model.php',
            'rest_patch_version' => 'v2-collection-params',
        ],
        200
    );
}

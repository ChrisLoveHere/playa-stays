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
}

// ============================================================
// 3. META FIELDS — registered for REST API exposure
// ============================================================

add_action( 'init', 'ps_register_meta_fields' );

function ps_register_meta_fields() {

    // ── Property meta ──────────────────────────────────────
    $property_meta = [
        'ps_city'            => 'string',
        'ps_neighborhood'    => 'string',
        'ps_property_type'   => 'string',
        'ps_bedrooms'        => 'integer',
        'ps_bathrooms'       => 'number',
        'ps_guests'          => 'integer',
        'ps_sqm'             => 'integer',
        'ps_nightly_rate'    => 'number',
        'ps_monthly_rate'    => 'number',
        'ps_cleaning_fee'    => 'number',
        'ps_currency'        => 'string',
        'ps_min_stay_nights' => 'integer',
        'ps_lat'             => 'number',
        'ps_lng'             => 'number',
        'ps_airbnb_url'      => 'string',
        'ps_vrbo_url'        => 'string',
        'ps_booking_url'     => 'string',
        'ps_direct_url'      => 'string',
        'ps_managed_by_ps'   => 'boolean',
        'ps_featured'        => 'boolean',
        'ps_listing_status'  => 'string',
        'ps_avg_occupancy'   => 'number',
        'ps_avg_rating'      => 'number',
        'ps_review_count'    => 'integer',
        'ps_monthly_income'  => 'number',
        'ps_owner_id'        => 'integer',
        'ps_seo_title'       => 'string',
        'ps_seo_desc'        => 'string',
        'ps_title_es'        => 'string',
        'ps_excerpt_es'      => 'string',
        'ps_content_es'      => 'string',
    ];
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

            return compact( 'featured_image', 'gallery', 'booking_links', 'amenities', 'owner' );
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
            [ 'val' => '200+',  'key' => 'Properties managed' ],
            [ 'val' => '4.9★',  'key' => 'Owner satisfaction' ],
            [ 'val' => '22%+',  'key' => 'Net income uplift' ],
            [ 'val' => '24/7',  'key' => 'Local support' ],
            [ 'val' => 'ES/EN', 'key' => 'Bilingual team' ],
            [ 'val' => '<5min', 'key' => 'Guest inquiry response' ],
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
}

// ============================================================
// 11. SETTINGS PAGE
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

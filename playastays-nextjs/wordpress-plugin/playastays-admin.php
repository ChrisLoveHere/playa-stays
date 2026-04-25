<?php
/**
 * Plugin Name: PlayaStays Admin Layer
 * Description: Admin workflow, tabbed field UIs, gallery manager,
 *              list columns, validation, roles, and front-end property
 *              submission for the PlayaStays headless site.
 *              Requires: PlayaStays Content Model (playastays-content-model.php)
 * Version:     1.0.0
 * Author:      PlayaStays
 * Text Domain: playastays-admin
 */

defined( 'ABSPATH' ) || exit;

// ============================================================
// 0.  CONSTANTS & HELPERS
// ============================================================

define( 'PSA_PATH', plugin_dir_path( __FILE__ ) );
define( 'PSA_URL',  plugin_dir_url( __FILE__ ) );

/** City slugs used throughout for dropdowns */
function psa_city_options(): array {
    return [
        'playa-del-carmen' => 'Playa del Carmen',
        'tulum'            => 'Tulum',
        'cozumel'          => 'Cozumel',
        'isla-mujeres'     => 'Isla Mujeres',
        'akumal'           => 'Akumal',
        'puerto-morelos'   => 'Puerto Morelos',
        'xpu-ha'           => 'Xpu-Ha',
        'chetumal'         => 'Chetumal',
    ];
}

/** Canonical EN service slugs */
function psa_service_slug_options(): array {
    return [
        'property-management'  => 'Property Management',
        'airbnb-management'    => 'Airbnb Management',
        'vacation-rentals'     => 'Vacation Rentals',
        'condos-for-rent'      => 'Condos for Rent',
        'beachfront-rentals'   => 'Beachfront Rentals',
        'investment-property'  => 'Investment Property',
        'sell-property'        => 'Sell Property',
    ];
}

// ============================================================
// 1.  ENQUEUE ADMIN SCRIPTS & STYLES
// ============================================================

add_action( 'admin_enqueue_scripts', 'psa_enqueue_admin_assets' );

function psa_enqueue_admin_assets( string $hook ): void {
    // Only on post edit screens for our CPTs
    if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) return;

    $screen = get_current_screen();
    if ( ! in_array( $screen->post_type, [ 'ps_property', 'ps_city', 'ps_service' ], true ) ) return;

    // WordPress media uploader (needed for gallery)
    wp_enqueue_media();

    // Our admin CSS
    wp_add_inline_style( 'wp-admin', psa_admin_css() );

    // Our admin JS (tabs + gallery + neighborhoods)
    wp_add_inline_script( 'jquery', psa_admin_js() );
}

function psa_admin_css(): string {
    return <<<CSS
/* ── PlayaStays Admin UI ──────────────────────────────── */

/* Tabs */
.psa-tabs { display: flex; border-bottom: 2px solid #ddd; margin-bottom: 0; flex-wrap: wrap; }
.psa-tab {
    padding: 9px 18px; cursor: pointer; font-size: 13px; font-weight: 600;
    color: #555; border: 2px solid transparent; border-bottom: none;
    margin-bottom: -2px; background: none; border-radius: 4px 4px 0 0;
    transition: all .15s;
}
.psa-tab:hover  { color: #186870; }
.psa-tab.active { background: #fff; border-color: #ddd; color: #186870; }
.psa-tab-badge  {
    display: inline-block; background: #e05a36; color: #fff;
    border-radius: 9px; font-size: 10px; font-weight: 700;
    padding: 1px 6px; margin-left: 5px; vertical-align: middle; line-height: 1.4;
}

/* Panels */
.psa-panel { display: none; padding: 20px 0; }
.psa-panel.active { display: block; }

/* Field layout */
.psa-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
.psa-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px 20px; }
.psa-field { margin-bottom: 0; }
.psa-field label {
    display: block; font-size: 12px; font-weight: 600; color: #444;
    margin-bottom: 5px; text-transform: uppercase; letter-spacing: .05em;
}
.psa-field input[type=text],
.psa-field input[type=number],
.psa-field input[type=url],
.psa-field input[type=email],
.psa-field select,
.psa-field textarea { width: 100%; }
.psa-field textarea { height: 100px; resize: vertical; }
.psa-field textarea.tall { height: 180px; }
.psa-field-note { font-size: 11px; color: #888; margin-top: 4px; line-height: 1.4; }
.psa-field-required label::after { content: ' *'; color: #e05a36; }
.psa-section-title {
    font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .08em; color: #186870; margin: 20px 0 12px;
    border-bottom: 1px solid #eee; padding-bottom: 6px;
}

/* Gallery manager */
.psa-gallery-wrap { position: relative; }
.psa-gallery-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr));
    gap: 8px; margin-bottom: 14px;
}
.psa-gallery-item {
    position: relative; border-radius: 4px; overflow: hidden;
    aspect-ratio: 4/3; background: #f0f0f0; cursor: grab;
    border: 2px solid transparent; transition: border-color .15s;
}
.psa-gallery-item:hover { border-color: #186870; }
.psa-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.psa-gallery-item .remove-img {
    position: absolute; top: 3px; right: 3px; width: 20px; height: 20px;
    background: rgba(0,0,0,.65); color: #fff; border: none; border-radius: 50%;
    font-size: 13px; line-height: 20px; text-align: center; cursor: pointer;
    display: none;
}
.psa-gallery-item:hover .remove-img { display: block; }
.psa-gallery-count { font-size: 12px; color: #666; margin-bottom: 10px; }
.psa-gallery-count.warn { color: #e05a36; font-weight: 600; }
#psa-add-gallery { font-size: 13px; }

/* Status badge in list table */
.psa-status-live    { color: #fff; background: #186870; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; }
.psa-status-pending { color: #fff; background: #c8a44a; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; }
.psa-status-draft   { color: #fff; background: #888;    padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; }
.psa-status-inactive{ color: #fff; background: #c0392b; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; }
.psa-featured-yes   { color: #c8a44a; font-size: 16px; }
.psa-featured-no    { color: #ddd;    font-size: 16px; }

/* Validation notice */
.psa-validation-notice {
    background: #fff3cd; border-left: 4px solid #e05a36; padding: 12px 16px;
    margin-bottom: 16px; border-radius: 0 4px 4px 0;
}
.psa-validation-notice ul { margin: 8px 0 0 16px; }
.psa-validation-notice li { font-size: 13px; color: #555; }

/* Neighborhoods repeater */
.psa-nbhd-row {
    display: grid; grid-template-columns: 1fr 1fr 2fr 80px; gap: 10px;
    align-items: end; padding: 10px; background: #f9f9f9;
    border: 1px solid #eee; border-radius: 4px; margin-bottom: 8px;
}
.psa-nbhd-row input { width: 100%; }
.psa-nbhd-row button.remove-row { color: #c0392b; background: none; border: none; cursor: pointer; font-size: 18px; }
#psa-add-nbhd { font-size: 13px; margin-top: 6px; }

/* Translation progress bar */
.psa-translation-status { margin-bottom: 16px; }
.psa-translation-bar { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; }
.psa-translation-fill { height: 100%; background: #186870; transition: width .3s; }
.psa-translation-label { font-size: 11px; color: #666; margin-top: 4px; }
CSS;
}

function psa_admin_js(): string {
    return <<<JS
jQuery(function($) {

    // ── Tab switching ─────────────────────────────────────
    $(document).on('click', '.psa-tab', function() {
        var panel = $(this).data('panel');
        var wrap  = $(this).closest('.psa-tab-wrap');
        wrap.find('.psa-tab').removeClass('active');
        wrap.find('.psa-panel').removeClass('active');
        $(this).addClass('active');
        wrap.find('#psa-panel-' + panel).addClass('active');
    });

    // ── Gallery manager ───────────────────────────────────
    var galleryFrame;

    $('#psa-add-gallery').on('click', function(e) {
        e.preventDefault();
        if (galleryFrame) { galleryFrame.open(); return; }

        galleryFrame = wp.media({
            title:    'Select Gallery Images',
            button:   { text: 'Add to Gallery' },
            multiple: true
        });

        galleryFrame.on('select', function() {
            var attachments = galleryFrame.state().get('selection').toJSON();
            attachments.forEach(function(att) {
                if ($('#psa-gallery-grid .psa-gallery-item[data-id="' + att.id + '"]').length) return;
                var thumb = att.sizes && att.sizes.thumbnail ? att.sizes.thumbnail.url : att.url;
                $('#psa-gallery-grid').append(
                    '<div class="psa-gallery-item" data-id="' + att.id + '">' +
                    '<img src="' + thumb + '" alt="" />' +
                    '<button type="button" class="remove-img" title="Remove">×</button>' +
                    '</div>'
                );
            });
            psaUpdateGalleryInput();
        });

        galleryFrame.open();
    });

    $(document).on('click', '.psa-gallery-item .remove-img', function(e) {
        e.preventDefault();
        $(this).closest('.psa-gallery-item').remove();
        psaUpdateGalleryInput();
    });

    function psaUpdateGalleryInput() {
        var ids = [];
        $('#psa-gallery-grid .psa-gallery-item').each(function() {
            ids.push($(this).data('id'));
        });
        $('#psa-gallery-ids').val(JSON.stringify(ids));
        var count = ids.length;
        var label = count === 1 ? '1 image' : count + ' images';
        $('#psa-gallery-count').text(label).toggleClass('warn', count < 3);
    }

    // Drag-and-drop reorder (requires jQuery UI Sortable — loaded in WP admin)
    if ($.fn.sortable) {
        $('#psa-gallery-grid').sortable({
            items: '.psa-gallery-item',
            cursor: 'grabbing',
            update: function() { psaUpdateGalleryInput(); }
        });
    }

    // Initialise count on load
    psaUpdateGalleryInput();

    // ── Neighborhoods repeater ────────────────────────────
    $(document).on('click', '#psa-add-nbhd', function(e) {
        e.preventDefault();
        var row = '<div class="psa-nbhd-row">' +
            '<div class="psa-field"><label>Name (EN)</label><input type="text" class="nbhd-name" placeholder="Centro" /></div>' +
            '<div class="psa-field"><label>Slug</label><input type="text" class="nbhd-slug" placeholder="centro" /></div>' +
            '<div class="psa-field"><label>Description (EN)</label><input type="text" class="nbhd-desc" placeholder="Short description…" /></div>' +
            '<div class="psa-field"><label>&nbsp;</label><button type="button" class="remove-row" title="Remove row">✕</button></div>' +
            '</div>';
        $('#psa-nbhd-rows').append(row);
        psaUpdateNbhdInput();
    });

    $(document).on('input change', '.nbhd-name, .nbhd-slug, .nbhd-desc', function() {
        psaUpdateNbhdInput();
    });

    $(document).on('click', '.psa-nbhd-row .remove-row', function() {
        $(this).closest('.psa-nbhd-row').remove();
        psaUpdateNbhdInput();
    });

    function psaUpdateNbhdInput() {
        var data = [];
        $('.psa-nbhd-row').each(function() {
            var name = $(this).find('.nbhd-name').val();
            var slug = $(this).find('.nbhd-slug').val();
            var desc = $(this).find('.nbhd-desc').val();
            if (name) data.push({ name: name, slug: slug, desc: desc, image_id: 0 });
        });
        $('#psa-neighborhoods-json').val(JSON.stringify(data));
    }

    // Auto-slug from name
    $(document).on('input', '.nbhd-name', function() {
        var slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        $(this).closest('.psa-nbhd-row').find('.nbhd-slug').val(slug);
    });

    // ── Validate before publish ───────────────────────────
    $('#publish').on('click', function(e) {
        if ($('body').hasClass('post-type-ps_property')) {
            var errors = [];

            if (!$('#ps_nightly_rate').val() || parseFloat($('#ps_nightly_rate').val()) <= 0) {
                errors.push('Nightly rate is required (must be greater than 0)');
            }
            if (!$('#ps_city_select').val()) {
                errors.push('City is required');
            }
            var galleryCount = $('#psa-gallery-grid .psa-gallery-item').length;
            if (galleryCount < 3) {
                errors.push('At least 3 gallery images are required (currently ' + galleryCount + ')');
            }

            if (errors.length > 0) {
                e.preventDefault();
                var html = '<div class="psa-validation-notice"><strong>Cannot publish — fix these issues first:</strong><ul>';
                errors.forEach(function(err) { html += '<li>' + err + '</li>'; });
                html += '</ul></div>';
                if ($('.psa-validation-notice').length) {
                    $('.psa-validation-notice').replaceWith(html);
                } else {
                    $('#psa-tabs-wrap').before(html);
                }
                $('html, body').animate({ scrollTop: 0 }, 200);
            }
        }
    });

    // ── Translation completion indicator ─────────────────
    function psaUpdateTranslationProgress() {
        var fields = [
            '#ps_title_es', '#ps_excerpt_es', '#ps_content_es',
            '#ps_hero_headline_es', '#ps_hero_subheadline_es'
        ];
        var filled = 0;
        fields.forEach(function(sel) {
            if ($(sel).length && $(sel).val().trim().length > 0) filled++;
        });
        var total    = fields.filter(function(sel) { return $(sel).length; }).length;
        var pct      = total > 0 ? Math.round((filled / total) * 100) : 0;
        var label    = pct === 100 ? '✓ Translation complete' : pct + '% translated (' + filled + '/' + total + ' fields)';
        $('.psa-translation-fill').css('width', pct + '%');
        $('.psa-translation-label').text(label);
    }

    $(document).on('input', '[id$="_es"]', function() {
        psaUpdateTranslationProgress();
    });

    psaUpdateTranslationProgress();
});
JS;
}

// ============================================================
// 2.  CUSTOM POST STATUSES
// ============================================================

add_action( 'init', 'psa_register_post_statuses' );

function psa_register_post_statuses(): void {
    register_post_status( 'ps_inactive', [
        'label'                     => _x( 'Inactive', 'post status', 'playastays-admin' ),
        'public'                    => false,
        'exclude_from_search'       => true,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop( 'Inactive <span class="count">(%s)</span>', 'Inactive <span class="count">(%s)</span>' ),
    ] );
}

// Show custom statuses in the publish box dropdown
add_action( 'post_submitbox_misc_actions', 'psa_add_status_to_publish_box' );

function psa_add_status_to_publish_box(): void {
    global $post;
    if ( $post->post_type !== 'ps_property' ) return;
    ?>
    <script>
    jQuery(function($) {
        $('#post-status-select').prepend(
            '<option value="ps_inactive" <?php selected( $post->post_status, "ps_inactive" ); ?>>Inactive</option>'
        );
        // Relabel 'pending' to 'Needs Approval' and 'publish' to 'Live'
        $('#post-status-select option[value="pending"]').text('Needs Approval');
        $('#post-status-select option[value="publish"]').text('Live');
        var currentLabel = {
            'publish':    'Live',
            'pending':    'Needs Approval',
            'draft':      'Draft',
            'ps_inactive':'Inactive'
        }[$('#post-status-display').text().trim().toLowerCase()] || $('#post-status-display').text();
        $('#post-status-display').text(currentLabel);
    });
    </script>
    <?php
}

// ============================================================
// 3.  TABBED METABOX — PROPERTIES (ps_property)
// ============================================================

add_action( 'add_meta_boxes', 'psa_add_property_metabox' );

function psa_add_property_metabox(): void {
    add_meta_box(
        'psa_property_fields',
        '🏠 Property Details',
        'psa_render_property_metabox',
        'ps_property',
        'normal',
        'high'
    );
}

function psa_render_property_metabox( WP_Post $post ): void {
    wp_nonce_field( 'psa_save_property', 'psa_property_nonce' );
    $id = $post->ID;

    // Load existing values
    $city          = get_post_meta( $id, 'ps_city',            true );
    $neighborhood  = get_post_meta( $id, 'ps_neighborhood',    true );
    $prop_type     = get_post_meta( $id, 'ps_property_type',   true );
    $bedrooms      = get_post_meta( $id, 'ps_bedrooms',        true );
    $bathrooms     = get_post_meta( $id, 'ps_bathrooms',       true );
    $guests        = get_post_meta( $id, 'ps_guests',          true );
    $sqm           = get_post_meta( $id, 'ps_sqm',             true );
    $nightly       = get_post_meta( $id, 'ps_nightly_rate',    true );
    $monthly       = get_post_meta( $id, 'ps_monthly_rate',    true );
    $cleaning      = get_post_meta( $id, 'ps_cleaning_fee',    true );
    $min_stay      = get_post_meta( $id, 'ps_min_stay_nights', true );
    $airbnb_url    = get_post_meta( $id, 'ps_airbnb_url',      true );
    $vrbo_url      = get_post_meta( $id, 'ps_vrbo_url',        true );
    $booking_url   = get_post_meta( $id, 'ps_booking_url',     true );
    $direct_url    = get_post_meta( $id, 'ps_direct_url',      true );
    $lat           = get_post_meta( $id, 'ps_lat',             true );
    $lng           = get_post_meta( $id, 'ps_lng',             true );
    $occupancy     = get_post_meta( $id, 'ps_avg_occupancy',   true );
    $income        = get_post_meta( $id, 'ps_monthly_income',  true );
    $rating        = get_post_meta( $id, 'ps_avg_rating',      true );
    $review_count  = get_post_meta( $id, 'ps_review_count',    true );
    $seo_title     = get_post_meta( $id, 'ps_seo_title',       true );
    $seo_desc      = get_post_meta( $id, 'ps_seo_desc',        true );
    $title_es      = get_post_meta( $id, 'ps_title_es',        true );
    $excerpt_es    = get_post_meta( $id, 'ps_excerpt_es',      true );
    $content_es    = get_post_meta( $id, 'ps_content_es',      true );
    $owner_id      = (int) get_post_meta( $id, 'ps_owner_id',  true );
    $featured      = (bool) get_post_meta( $id, 'ps_featured', true );
    $listing_status = get_post_meta( $id, 'ps_listing_status', true ) ?: 'draft';
    $managed       = (bool) get_post_meta( $id, 'ps_managed_by_ps', true );

    // Gallery — stored as JSON array of IDs in ps_gallery meta
    $gallery_raw = get_post_meta( $id, 'ps_gallery', true );
    $gallery_ids = json_decode( $gallery_raw ?: '[]', true );

    // Translation completeness
    $es_fields_filled = array_filter( [ $title_es, $excerpt_es, $content_es ] );
    $es_pct = count($es_fields_filled) > 0 ? round( count($es_fields_filled) / 3 * 100 ) : 0;

    $city_options    = psa_city_options();
    $property_types  = [ '' => '— Select —', 'studio' => 'Studio', 'condo' => 'Condo', 'villa' => 'Villa', 'penthouse' => 'Penthouse', 'house' => 'House', 'apartment' => 'Apartment' ];
    $status_options  = [ 'draft' => 'Draft', 'active' => 'Active (Live)', 'inactive' => 'Inactive', 'pending_review' => 'Pending Review' ];

    // Owners list (ps_owner + admin roles)
    $owners = get_users( [ 'role__in' => [ 'ps_owner', 'ps_manager', 'administrator' ] ] );
    ?>
    <div id="psa-tabs-wrap" class="psa-tab-wrap">

        <!-- Translation progress bar -->
        <div class="psa-translation-status" style="margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="flex:1;">
                    <div class="psa-translation-bar">
                        <div class="psa-translation-fill" style="width:<?php echo $es_pct; ?>%"></div>
                    </div>
                    <div class="psa-translation-label"><?php echo $es_pct === 100 ? '✓ Translation complete' : "$es_pct% translated"; ?></div>
                </div>
                <div style="font-size:12px;color:#888;">Spanish content progress</div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="psa-tabs">
            <button type="button" class="psa-tab active" data-panel="basic">📋 Basic Info</button>
            <button type="button" class="psa-tab" data-panel="pricing">💰 Pricing</button>
            <button type="button" class="psa-tab" data-panel="media">📸 Media <?php if ( empty($gallery_ids) ) echo '<span class="psa-tab-badge">!</span>'; ?></button>
            <button type="button" class="psa-tab" data-panel="booking">🔗 Booking Links</button>
            <button type="button" class="psa-tab" data-panel="location">📍 Location</button>
            <button type="button" class="psa-tab" data-panel="performance">📊 Performance</button>
            <button type="button" class="psa-tab" data-panel="seo">🔍 SEO</button>
            <button type="button" class="psa-tab" data-panel="spanish">🇲🇽 Spanish <?php if ( $es_pct < 100 ) echo '<span class="psa-tab-badge">' . (100 - $es_pct) . '%</span>'; ?></button>
            <button type="button" class="psa-tab" data-panel="internal">⚙️ Internal</button>
        </div>

        <!-- ── TAB: Basic Info ──────────────────────────── -->
        <div id="psa-panel-basic" class="psa-panel active">
            <div class="psa-grid-2">
                <div class="psa-field psa-field-required">
                    <label for="ps_city_select">City</label>
                    <select id="ps_city_select" name="ps_city">
                        <option value="">— Select city —</option>
                        <?php foreach ( $city_options as $slug => $label ) : ?>
                            <option value="<?php echo esc_attr( $slug ); ?>" <?php selected( $city, $slug ); ?>><?php echo esc_html( $label ); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <div class="psa-field-note">Also set the City taxonomy term on the right sidebar.</div>
                </div>
                <div class="psa-field">
                    <label for="ps_neighborhood">Neighborhood</label>
                    <input type="text" id="ps_neighborhood" name="ps_neighborhood" value="<?php echo esc_attr( $neighborhood ); ?>" placeholder="e.g. Centro, Playacar" />
                </div>
                <div class="psa-field psa-field-required">
                    <label for="ps_property_type_select">Property Type</label>
                    <select id="ps_property_type_select" name="ps_property_type">
                        <?php foreach ( $property_types as $val => $lbl ) : ?>
                            <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $prop_type, $val ); ?>><?php echo esc_html( $lbl ); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="psa-field">
                    <label for="ps_bedrooms">Bedrooms</label>
                    <input type="number" id="ps_bedrooms" name="ps_bedrooms" value="<?php echo esc_attr( $bedrooms ); ?>" min="0" max="20" placeholder="0 = Studio" />
                    <div class="psa-field-note">Enter 0 for Studio</div>
                </div>
                <div class="psa-field">
                    <label for="ps_bathrooms">Bathrooms</label>
                    <input type="number" id="ps_bathrooms" name="ps_bathrooms" value="<?php echo esc_attr( $bathrooms ); ?>" min="0" max="20" step="0.5" />
                </div>
                <div class="psa-field">
                    <label for="ps_guests">Max Guests</label>
                    <input type="number" id="ps_guests" name="ps_guests" value="<?php echo esc_attr( $guests ); ?>" min="1" max="50" />
                </div>
                <div class="psa-field">
                    <label for="ps_sqm">Size (m²)</label>
                    <input type="number" id="ps_sqm" name="ps_sqm" value="<?php echo esc_attr( $sqm ); ?>" min="0" placeholder="Optional" />
                </div>
            </div>
        </div>

        <!-- ── TAB: Pricing ─────────────────────────────── -->
        <div id="psa-panel-pricing" class="psa-panel">
            <div class="psa-grid-3">
                <div class="psa-field psa-field-required">
                    <label for="ps_nightly_rate">Nightly Rate (USD)</label>
                    <input type="number" id="ps_nightly_rate" name="ps_nightly_rate" value="<?php echo esc_attr( $nightly ); ?>" min="0" step="1" placeholder="120" />
                </div>
                <div class="psa-field">
                    <label for="ps_monthly_rate">Monthly Rate (USD)</label>
                    <input type="number" id="ps_monthly_rate" name="ps_monthly_rate" value="<?php echo esc_attr( $monthly ); ?>" min="0" step="1" placeholder="Optional" />
                </div>
                <div class="psa-field">
                    <label for="ps_cleaning_fee">Cleaning Fee (USD)</label>
                    <input type="number" id="ps_cleaning_fee" name="ps_cleaning_fee" value="<?php echo esc_attr( $cleaning ); ?>" min="0" step="1" placeholder="Optional" />
                </div>
                <div class="psa-field">
                    <label for="ps_min_stay_nights">Minimum Stay (nights)</label>
                    <input type="number" id="ps_min_stay_nights" name="ps_min_stay_nights" value="<?php echo esc_attr( $min_stay ); ?>" min="1" step="1" placeholder="1" />
                </div>
            </div>
        </div>

        <!-- ── TAB: Media ───────────────────────────────── -->
        <div id="psa-panel-media" class="psa-panel">
            <p style="font-size:13px;color:#555;margin-bottom:16px;">
                <strong>Featured image:</strong> Set using the "Featured Image" box in the right sidebar.<br>
                <strong>Gallery:</strong> Add photos below. Drag to reorder. Minimum 3 photos required before publishing.
            </p>

            <div class="psa-gallery-wrap">
                <div id="psa-gallery-grid" class="psa-gallery-grid">
                    <?php foreach ( $gallery_ids as $gid ) :
                        $url = wp_get_attachment_image_url( $gid, 'thumbnail' );
                        if ( ! $url ) continue;
                    ?>
                        <div class="psa-gallery-item" data-id="<?php echo (int) $gid; ?>">
                            <img src="<?php echo esc_url( $url ); ?>" alt="" />
                            <button type="button" class="remove-img" title="Remove">×</button>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div id="psa-gallery-count" class="psa-gallery-count <?php echo count($gallery_ids) < 3 ? 'warn' : ''; ?>">
                    <?php echo count($gallery_ids); ?> image<?php echo count($gallery_ids) !== 1 ? 's' : ''; ?> — minimum 3 required
                </div>
                <input type="hidden" id="psa-gallery-ids" name="ps_gallery" value="<?php echo esc_attr( json_encode( $gallery_ids ) ); ?>" />
                <button type="button" id="psa-add-gallery" class="button">+ Add / Replace Gallery Images</button>
            </div>
        </div>

        <!-- ── TAB: Booking Links ───────────────────────── -->
        <div id="psa-panel-booking" class="psa-panel">
            <div class="psa-grid-2">
                <div class="psa-field">
                    <label for="ps_airbnb_url">Airbnb URL</label>
                    <input type="url" id="ps_airbnb_url" name="ps_airbnb_url" value="<?php echo esc_url( $airbnb_url ); ?>" placeholder="https://www.airbnb.com/rooms/…" />
                </div>
                <div class="psa-field">
                    <label for="ps_vrbo_url">VRBO URL</label>
                    <input type="url" id="ps_vrbo_url" name="ps_vrbo_url" value="<?php echo esc_url( $vrbo_url ); ?>" placeholder="https://www.vrbo.com/…" />
                </div>
                <div class="psa-field">
                    <label for="ps_booking_url">Booking.com URL</label>
                    <input type="url" id="ps_booking_url" name="ps_booking_url" value="<?php echo esc_url( $booking_url ); ?>" placeholder="https://www.booking.com/hotel/…" />
                </div>
                <div class="psa-field">
                    <label for="ps_direct_url">Direct Booking URL</label>
                    <input type="url" id="ps_direct_url" name="ps_direct_url" value="<?php echo esc_url( $direct_url ); ?>" placeholder="https://playastays.com/…" />
                </div>
            </div>
            <p style="font-size:12px;color:#888;margin-top:16px;">Leave blank any platform where this property is not listed.</p>
        </div>

        <!-- ── TAB: Location ────────────────────────────── -->
        <div id="psa-panel-location" class="psa-panel">
            <div class="psa-grid-2">
                <div class="psa-field">
                    <label for="ps_lat">Latitude</label>
                    <input type="text" id="ps_lat" name="ps_lat" value="<?php echo esc_attr( $lat ); ?>" placeholder="20.6534" />
                </div>
                <div class="psa-field">
                    <label for="ps_lng">Longitude</label>
                    <input type="text" id="ps_lng" name="ps_lng" value="<?php echo esc_attr( $lng ); ?>" placeholder="-87.0742" />
                </div>
            </div>
            <p style="font-size:12px;color:#888;margin-top:12px;">Used for map display. Find coordinates at <a href="https://www.latlong.net/" target="_blank">latlong.net</a>.</p>
        </div>

        <!-- ── TAB: Performance ─────────────────────────── -->
        <div id="psa-panel-performance" class="psa-panel">
            <p style="font-size:13px;color:#555;margin-bottom:16px;">These fields are updated by the PlayaStays team based on actual booking data. Do not edit manually unless correcting an error.</p>
            <div class="psa-grid-3">
                <div class="psa-field">
                    <label for="ps_avg_occupancy">Avg Occupancy (%)</label>
                    <input type="number" id="ps_avg_occupancy" name="ps_avg_occupancy" value="<?php echo esc_attr( $occupancy ); ?>" min="0" max="100" step="0.1" placeholder="82.5" />
                </div>
                <div class="psa-field">
                    <label for="ps_monthly_income">Monthly Income (USD)</label>
                    <input type="number" id="ps_monthly_income" name="ps_monthly_income" value="<?php echo esc_attr( $income ); ?>" min="0" step="1" />
                </div>
                <div class="psa-field">
                    <label for="ps_avg_rating">Avg Rating (0–5)</label>
                    <input type="number" id="ps_avg_rating" name="ps_avg_rating" value="<?php echo esc_attr( $rating ); ?>" min="0" max="5" step="0.01" placeholder="4.91" />
                </div>
                <div class="psa-field">
                    <label for="ps_review_count">Review Count</label>
                    <input type="number" id="ps_review_count" name="ps_review_count" value="<?php echo esc_attr( $review_count ); ?>" min="0" step="1" />
                </div>
            </div>
        </div>

        <!-- ── TAB: SEO ──────────────────────────────────── -->
        <div id="psa-panel-seo" class="psa-panel">
            <div class="psa-field">
                <label for="ps_seo_title">SEO Title (EN)</label>
                <input type="text" id="ps_seo_title" name="ps_seo_title" value="<?php echo esc_attr( $seo_title ); ?>" placeholder="Leave blank to use post title" maxlength="70" />
                <div class="psa-field-note">Recommended: 50–60 characters. Appears in Google search results.</div>
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_seo_desc">Meta Description (EN)</label>
                <textarea id="ps_seo_desc" name="ps_seo_desc" placeholder="Leave blank to use excerpt" maxlength="165"><?php echo esc_textarea( $seo_desc ); ?></textarea>
                <div class="psa-field-note">Recommended: 150–160 characters. Appears in Google search results below the title.</div>
            </div>
        </div>

        <!-- ── TAB: Spanish ──────────────────────────────── -->
        <div id="psa-panel-spanish" class="psa-panel">
            <div style="background:#fff3cd;border-left:3px solid #c8a44a;padding:10px 14px;margin-bottom:18px;font-size:12px;">
                ⚠️ <strong>If any field below is blank, the Spanish version of this page will be noindex.</strong>
                Google will not rank it until all three fields are filled.
            </div>
            <div class="psa-field">
                <label for="ps_title_es">Property Name (ES)</label>
                <input type="text" id="ps_title_es" name="ps_title_es" value="<?php echo esc_attr( $title_es ); ?>" placeholder="e.g. Estudio moderno en el centro de Playa del Carmen" />
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_excerpt_es">Short Description (ES)</label>
                <textarea id="ps_excerpt_es" name="ps_excerpt_es" placeholder="2–3 sentences in Spanish…"><?php echo esc_textarea( $excerpt_es ); ?></textarea>
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_content_es">Full Description (ES)</label>
                <textarea id="ps_content_es" name="ps_content_es" class="tall" placeholder="Full property description in Spanish (HTML accepted)…"><?php echo esc_textarea( $content_es ); ?></textarea>
            </div>
        </div>

        <!-- ── TAB: Internal ─────────────────────────────── -->
        <div id="psa-panel-internal" class="psa-panel">
            <div class="psa-grid-2">
                <div class="psa-field">
                    <label for="ps_owner_select">Property Owner</label>
                    <select id="ps_owner_select" name="ps_owner_id">
                        <option value="">— No owner assigned —</option>
                        <?php foreach ( $owners as $u ) : ?>
                            <option value="<?php echo (int) $u->ID; ?>" <?php selected( $owner_id, $u->ID ); ?>>
                                <?php echo esc_html( $u->display_name . ' (' . $u->user_email . ')' ); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                    <div class="psa-field-note">The owner can view their own property in the dashboard.</div>
                </div>
                <div class="psa-field">
                    <label for="ps_listing_status_select">Listing Status</label>
                    <select id="ps_listing_status_select" name="ps_listing_status">
                        <?php foreach ( $status_options as $val => $lbl ) : ?>
                            <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $listing_status, $val ); ?>><?php echo esc_html( $lbl ); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <div class="psa-field-note">
                        <strong>Active</strong> = visible on site · <strong>Inactive</strong> = hidden from site but data retained
                    </div>
                </div>
                <div class="psa-field">
                    <label>
                        <input type="checkbox" name="ps_featured" value="1" <?php checked( $featured ); ?> style="width:auto;margin-right:6px;" />
                        Feature this property on homepage &amp; city pages
                    </label>
                    <div class="psa-field-note">Featured properties appear first in grids. Max ~12 recommended across the portfolio.</div>
                </div>
                <div class="psa-field">
                    <label>
                        <input type="checkbox" name="ps_managed_by_ps" value="1" <?php checked( $managed ); ?> style="width:auto;margin-right:6px;" />
                        Managed by PlayaStays
                    </label>
                    <div class="psa-field-note">Shows "PlayaStays Managed" badge on listing cards.</div>
                </div>
            </div>
        </div>

    </div><!-- /.psa-tab-wrap -->
    <?php
}

// Save property meta
add_action( 'save_post_ps_property', 'psa_save_property_meta', 10, 2 );

function psa_save_property_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['psa_property_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['psa_property_nonce'], 'psa_save_property' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $text_fields = [
        'ps_city', 'ps_neighborhood', 'ps_property_type', 'ps_listing_status',
        'ps_seo_title', 'ps_seo_desc', 'ps_title_es', 'ps_excerpt_es',
    ];
    $number_fields = [
        'ps_bedrooms', 'ps_guests', 'ps_sqm', 'ps_review_count',
    ];
    $float_fields = [
        'ps_bathrooms', 'ps_nightly_rate', 'ps_monthly_rate', 'ps_cleaning_fee',
        'ps_min_stay_nights', 'ps_lat', 'ps_lng', 'ps_avg_occupancy',
        'ps_monthly_income', 'ps_avg_rating',
    ];
    $url_fields = [
        'ps_airbnb_url', 'ps_vrbo_url', 'ps_booking_url', 'ps_direct_url',
    ];

    foreach ( $text_fields as $f ) {
        update_post_meta( $post_id, $f, sanitize_text_field( $_POST[$f] ?? '' ) );
    }
    foreach ( $number_fields as $f ) {
        update_post_meta( $post_id, $f, (int) ( $_POST[$f] ?? 0 ) );
    }
    foreach ( $float_fields as $f ) {
        update_post_meta( $post_id, $f, (float) ( $_POST[$f] ?? 0 ) );
    }
    foreach ( $url_fields as $f ) {
        update_post_meta( $post_id, $f, esc_url_raw( $_POST[$f] ?? '' ) );
    }

    // Content ES (allows HTML)
    update_post_meta( $post_id, 'ps_content_es', wp_kses_post( $_POST['ps_content_es'] ?? '' ) );

    // Gallery — JSON array of IDs
    $raw_gallery = sanitize_text_field( $_POST['ps_gallery'] ?? '[]' );
    $gallery_ids = json_decode( $raw_gallery, true );
    if ( is_array( $gallery_ids ) ) {
        update_post_meta( $post_id, 'ps_gallery', wp_json_encode( array_map( 'intval', $gallery_ids ) ) );
    }

    // Booleans
    update_post_meta( $post_id, 'ps_featured',       isset( $_POST['ps_featured'] ) ? 1 : 0 );
    update_post_meta( $post_id, 'ps_managed_by_ps',  isset( $_POST['ps_managed_by_ps'] ) ? 1 : 0 );

    // Owner
    update_post_meta( $post_id, 'ps_owner_id', (int) ( $_POST['ps_owner_id'] ?? 0 ) );
}

// ============================================================
// 4.  TABBED METABOX — CITIES (ps_city)
// ============================================================

add_action( 'add_meta_boxes', 'psa_add_city_metabox' );

function psa_add_city_metabox(): void {
    add_meta_box(
        'psa_city_fields',
        '🌆 City Details',
        'psa_render_city_metabox',
        'ps_city',
        'normal',
        'high'
    );
}

function psa_render_city_metabox( WP_Post $post ): void {
    wp_nonce_field( 'psa_save_city', 'psa_city_nonce' );
    $id = $post->ID;

    $country     = get_post_meta( $id, 'ps_country',            true );
    $state       = get_post_meta( $id, 'ps_state',              true );
    $lat         = get_post_meta( $id, 'ps_lat',                true );
    $lng         = get_post_meta( $id, 'ps_lng',                true );
    $avg_nightly = get_post_meta( $id, 'ps_avg_nightly',        true );
    $avg_occ     = get_post_meta( $id, 'ps_avg_occupancy',      true );
    $avg_income  = get_post_meta( $id, 'ps_avg_monthly_income', true );
    $market_note = get_post_meta( $id, 'ps_market_note',        true );
    $best_for    = get_post_meta( $id, 'ps_best_for',           true );
    $peak_season = get_post_meta( $id, 'ps_peak_season',        true );
    $seo_title   = get_post_meta( $id, 'ps_seo_title',          true );
    $seo_desc    = get_post_meta( $id, 'ps_seo_desc',           true );
    $title_es    = get_post_meta( $id, 'ps_title_es',           true );
    $excerpt_es  = get_post_meta( $id, 'ps_excerpt_es',         true );
    $content_es  = get_post_meta( $id, 'ps_content_es',         true );
    $mkt_note_es = get_post_meta( $id, 'ps_market_note_es',     true );
    $best_for_es = get_post_meta( $id, 'ps_best_for_es',        true );
    $peak_es     = get_post_meta( $id, 'ps_peak_season_es',     true );

    // Neighborhoods — stored as JSON
    $nbhd_raw  = get_post_meta( $id, 'ps_neighborhoods', true );
    $nbhd_list = json_decode( $nbhd_raw ?: '[]', true );
    ?>
    <div class="psa-tab-wrap">
        <div class="psa-tabs">
            <button type="button" class="psa-tab active" data-panel="city-overview">📋 Overview</button>
            <button type="button" class="psa-tab" data-panel="city-market">📈 Market Data</button>
            <button type="button" class="psa-tab" data-panel="city-nbhd">🗺️ Neighborhoods</button>
            <button type="button" class="psa-tab" data-panel="city-seo">🔍 SEO</button>
            <button type="button" class="psa-tab" data-panel="city-spanish">🇲🇽 Spanish</button>
        </div>

        <!-- Overview -->
        <div id="psa-panel-city-overview" class="psa-panel active">
            <div class="psa-grid-2">
                <div class="psa-field">
                    <label for="ps_country">Country</label>
                    <input type="text" id="ps_country" name="ps_country" value="<?php echo esc_attr( $country ); ?>" placeholder="Mexico" />
                </div>
                <div class="psa-field">
                    <label for="ps_state">State</label>
                    <input type="text" id="ps_state" name="ps_state" value="<?php echo esc_attr( $state ); ?>" placeholder="Quintana Roo" />
                </div>
                <div class="psa-field">
                    <label for="ps_city_lat">Latitude</label>
                    <input type="text" id="ps_city_lat" name="ps_lat" value="<?php echo esc_attr( $lat ); ?>" placeholder="20.6534" />
                </div>
                <div class="psa-field">
                    <label for="ps_city_lng">Longitude</label>
                    <input type="text" id="ps_city_lng" name="ps_lng" value="<?php echo esc_attr( $lng ); ?>" placeholder="-87.0742" />
                </div>
            </div>
        </div>

        <!-- Market Data -->
        <div id="psa-panel-city-market" class="psa-panel">
            <div class="psa-grid-3">
                <div class="psa-field">
                    <label for="ps_avg_nightly_city">Avg Nightly Rate Range</label>
                    <input type="text" id="ps_avg_nightly_city" name="ps_avg_nightly" value="<?php echo esc_attr( $avg_nightly ); ?>" placeholder="$110–$260" />
                </div>
                <div class="psa-field">
                    <label for="ps_avg_occupancy_city">Avg Occupancy Range</label>
                    <input type="text" id="ps_avg_occupancy_city" name="ps_avg_occupancy" value="<?php echo esc_attr( $avg_occ ); ?>" placeholder="78–88%" />
                </div>
                <div class="psa-field">
                    <label for="ps_avg_monthly_income">Avg Monthly Income Range</label>
                    <input type="text" id="ps_avg_monthly_income" name="ps_avg_monthly_income" value="<?php echo esc_attr( $avg_income ); ?>" placeholder="$2,500–$6,000" />
                </div>
            </div>
            <div class="psa-field" style="margin-top:16px;">
                <label for="ps_market_note">Market Note (EN)</label>
                <textarea id="ps_market_note" name="ps_market_note" class="tall" placeholder="1–2 paragraphs about the local rental market…"><?php echo esc_textarea( $market_note ); ?></textarea>
            </div>
            <div class="psa-grid-2" style="margin-top:14px;">
                <div class="psa-field">
                    <label for="ps_best_for">Best For (EN)</label>
                    <input type="text" id="ps_best_for" name="ps_best_for" value="<?php echo esc_attr( $best_for ); ?>" placeholder="Investors seeking premium rental yields…" />
                </div>
                <div class="psa-field">
                    <label for="ps_peak_season">Peak Season (EN)</label>
                    <input type="text" id="ps_peak_season" name="ps_peak_season" value="<?php echo esc_attr( $peak_season ); ?>" placeholder="December – April" />
                </div>
            </div>
        </div>

        <!-- Neighborhoods repeater -->
        <div id="psa-panel-city-nbhd" class="psa-panel">
            <p style="font-size:13px;color:#555;margin-bottom:14px;">Add the key neighborhoods for this city. Name and description appear on the city hub page.</p>
            <input type="hidden" id="psa-neighborhoods-json" name="ps_neighborhoods" value="<?php echo esc_attr( json_encode( $nbhd_list ) ); ?>" />
            <div id="psa-nbhd-rows">
                <?php foreach ( $nbhd_list as $nbhd ) : ?>
                <div class="psa-nbhd-row">
                    <div class="psa-field"><label>Name (EN)</label><input type="text" class="nbhd-name" value="<?php echo esc_attr( $nbhd['name'] ?? '' ); ?>" /></div>
                    <div class="psa-field"><label>Slug</label><input type="text" class="nbhd-slug" value="<?php echo esc_attr( $nbhd['slug'] ?? '' ); ?>" /></div>
                    <div class="psa-field"><label>Description (EN)</label><input type="text" class="nbhd-desc" value="<?php echo esc_attr( $nbhd['desc'] ?? '' ); ?>" /></div>
                    <div class="psa-field"><label>&nbsp;</label><button type="button" class="remove-row" title="Remove">✕</button></div>
                </div>
                <?php endforeach; ?>
            </div>
            <button type="button" id="psa-add-nbhd" class="button">+ Add Neighborhood</button>
        </div>

        <!-- SEO -->
        <div id="psa-panel-city-seo" class="psa-panel">
            <div class="psa-field">
                <label for="ps_city_seo_title">SEO Title (EN)</label>
                <input type="text" id="ps_city_seo_title" name="ps_seo_title" value="<?php echo esc_attr( $seo_title ); ?>" maxlength="70" />
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_city_seo_desc">Meta Description (EN)</label>
                <textarea id="ps_city_seo_desc" name="ps_seo_desc" maxlength="165"><?php echo esc_textarea( $seo_desc ); ?></textarea>
            </div>
        </div>

        <!-- Spanish -->
        <div id="psa-panel-city-spanish" class="psa-panel">
            <div style="background:#fff3cd;border-left:3px solid #c8a44a;padding:10px 14px;margin-bottom:18px;font-size:12px;">
                ⚠️ Leave any field blank = Spanish city page will be noindex.
            </div>
            <div class="psa-field">
                <label for="ps_city_title_es">City Name / Page Title (ES)</label>
                <input type="text" id="ps_city_title_es" name="ps_title_es" value="<?php echo esc_attr( $title_es ); ?>" />
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_city_excerpt_es">Short Excerpt (ES)</label>
                <textarea id="ps_city_excerpt_es" name="ps_excerpt_es"><?php echo esc_textarea( $excerpt_es ); ?></textarea>
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_city_content_es">Full Content (ES)</label>
                <textarea id="ps_city_content_es" name="ps_content_es" class="tall"><?php echo esc_textarea( $content_es ); ?></textarea>
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_market_note_es">Market Note (ES)</label>
                <textarea id="ps_market_note_es" name="ps_market_note_es" class="tall"><?php echo esc_textarea( $mkt_note_es ); ?></textarea>
            </div>
            <div class="psa-grid-2" style="margin-top:14px;">
                <div class="psa-field">
                    <label for="ps_best_for_es">Best For (ES)</label>
                    <input type="text" id="ps_best_for_es" name="ps_best_for_es" value="<?php echo esc_attr( $best_for_es ); ?>" />
                </div>
                <div class="psa-field">
                    <label for="ps_peak_season_es">Peak Season (ES)</label>
                    <input type="text" id="ps_peak_season_es" name="ps_peak_season_es" value="<?php echo esc_attr( $peak_es ); ?>" />
                </div>
            </div>
        </div>
    </div>
    <?php
}

add_action( 'save_post_ps_city', 'psa_save_city_meta', 10, 2 );

function psa_save_city_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['psa_city_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['psa_city_nonce'], 'psa_save_city' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $text = [ 'ps_country','ps_state','ps_avg_nightly','ps_avg_occupancy','ps_avg_monthly_income',
              'ps_best_for','ps_peak_season','ps_seo_title','ps_seo_desc',
              'ps_title_es','ps_excerpt_es','ps_best_for_es','ps_peak_season_es' ];
    $float = [ 'ps_lat','ps_lng' ];
    $html  = [ 'ps_market_note','ps_content_es','ps_market_note_es','ps_excerpt_es' ];

    foreach ( $text  as $f ) update_post_meta( $post_id, $f, sanitize_text_field( $_POST[$f] ?? '' ) );
    foreach ( $float as $f ) update_post_meta( $post_id, $f, (float)( $_POST[$f] ?? 0 ) );
    foreach ( $html  as $f ) update_post_meta( $post_id, $f, wp_kses_post( $_POST[$f] ?? '' ) );

    // Neighborhoods JSON
    $raw = sanitize_text_field( $_POST['ps_neighborhoods'] ?? '[]' );
    $arr = json_decode( $raw, true );
    if ( is_array( $arr ) ) update_post_meta( $post_id, 'ps_neighborhoods', wp_json_encode( $arr ) );
}

// ============================================================
// 5.  TABBED METABOX — SERVICES (ps_service)
// ============================================================

add_action( 'add_meta_boxes', 'psa_add_service_metabox' );

function psa_add_service_metabox(): void {
    add_meta_box(
        'psa_service_fields',
        '⭐ Service Details',
        'psa_render_service_metabox',
        'ps_service',
        'normal',
        'high'
    );
}

function psa_render_service_metabox( WP_Post $post ): void {
    wp_nonce_field( 'psa_save_service', 'psa_service_nonce' );
    $id = $post->ID;

    $service_slug  = get_post_meta( $id, 'ps_service_slug',        true );
    $hero_h1       = get_post_meta( $id, 'ps_hero_headline',       true );
    $hero_sub      = get_post_meta( $id, 'ps_hero_subheadline',    true );
    $cta_text      = get_post_meta( $id, 'ps_cta_primary_text',    true );
    $cta_url       = get_post_meta( $id, 'ps_cta_primary_url',     true );
    $seo_title     = get_post_meta( $id, 'ps_seo_title',           true );
    $seo_desc      = get_post_meta( $id, 'ps_seo_desc',            true );
    $hero_h1_es    = get_post_meta( $id, 'ps_hero_headline_es',    true );
    $hero_sub_es   = get_post_meta( $id, 'ps_hero_subheadline_es', true );
    $content_es    = get_post_meta( $id, 'ps_content_es',          true );
    $seo_title_es  = get_post_meta( $id, 'ps_seo_title_es',        true );
    $seo_desc_es   = get_post_meta( $id, 'ps_seo_desc_es',         true );

    $service_slugs = psa_service_slug_options();
    ?>
    <div class="psa-tab-wrap">
        <div class="psa-tabs">
            <button type="button" class="psa-tab active" data-panel="svc-basic">📋 Basic Info</button>
            <button type="button" class="psa-tab" data-panel="svc-hero">🦸 Hero Content</button>
            <button type="button" class="psa-tab" data-panel="svc-seo">🔍 SEO</button>
            <button type="button" class="psa-tab" data-panel="svc-spanish">🇲🇽 Spanish</button>
        </div>

        <!-- Basic Info -->
        <div id="psa-panel-svc-basic" class="psa-panel active">
            <div class="psa-field psa-field-required">
                <label for="ps_service_slug_select">Service Type</label>
                <select id="ps_service_slug_select" name="ps_service_slug">
                    <option value="">— Select service type —</option>
                    <?php foreach ( $service_slugs as $val => $lbl ) : ?>
                        <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $service_slug, $val ); ?>><?php echo esc_html( $lbl ); ?></option>
                    <?php endforeach; ?>
                </select>
                <div class="psa-field-note">Must match one of the 7 canonical service types. Also set the City taxonomy term.</div>
            </div>
        </div>

        <!-- Hero Content -->
        <div id="psa-panel-svc-hero" class="psa-panel">
            <div class="psa-field">
                <label for="ps_hero_headline">Hero Headline (EN)</label>
                <input type="text" id="ps_hero_headline" name="ps_hero_headline" value="<?php echo esc_attr( $hero_h1 ); ?>" placeholder="Property Management in Playa del Carmen" />
                <div class="psa-field-note">The H1 on the service page. Keep under 70 characters.</div>
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_hero_subheadline">Hero Subheadline (EN)</label>
                <input type="text" id="ps_hero_subheadline" name="ps_hero_subheadline" value="<?php echo esc_attr( $hero_sub ); ?>" placeholder="Full-service management from 15% of gross revenue…" />
            </div>
            <div class="psa-grid-2" style="margin-top:14px;">
                <div class="psa-field">
                    <label for="ps_cta_primary_text">CTA Button Label (EN)</label>
                    <input type="text" id="ps_cta_primary_text" name="ps_cta_primary_text" value="<?php echo esc_attr( $cta_text ); ?>" placeholder="Get Free Estimate" />
                </div>
                <div class="psa-field">
                    <label for="ps_cta_primary_url">CTA Button URL</label>
                    <input type="url" id="ps_cta_primary_url" name="ps_cta_primary_url" value="<?php echo esc_url( $cta_url ); ?>" placeholder="/list-your-property/" />
                </div>
            </div>
        </div>

        <!-- SEO -->
        <div id="psa-panel-svc-seo" class="psa-panel">
            <div class="psa-field">
                <label for="ps_svc_seo_title">SEO Title (EN)</label>
                <input type="text" id="ps_svc_seo_title" name="ps_seo_title" value="<?php echo esc_attr( $seo_title ); ?>" maxlength="70" />
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_svc_seo_desc">Meta Description (EN)</label>
                <textarea id="ps_svc_seo_desc" name="ps_seo_desc" maxlength="165"><?php echo esc_textarea( $seo_desc ); ?></textarea>
            </div>
        </div>

        <!-- Spanish -->
        <div id="psa-panel-svc-spanish" class="psa-panel">
            <div style="background:#fff3cd;border-left:3px solid #c8a44a;padding:10px 14px;margin-bottom:18px;font-size:12px;">
                ⚠️ Leave blank = Spanish service page will be noindex.
            </div>
            <div class="psa-field">
                <label for="ps_hero_headline_es">Hero Headline (ES)</label>
                <input type="text" id="ps_hero_headline_es" name="ps_hero_headline_es" value="<?php echo esc_attr( $hero_h1_es ); ?>" />
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_hero_subheadline_es">Hero Subheadline (ES)</label>
                <input type="text" id="ps_hero_subheadline_es" name="ps_hero_subheadline_es" value="<?php echo esc_attr( $hero_sub_es ); ?>" />
            </div>
            <div class="psa-field" style="margin-top:14px;">
                <label for="ps_svc_content_es">Content (ES) — HTML accepted</label>
                <textarea id="ps_svc_content_es" name="ps_content_es" class="tall"><?php echo esc_textarea( $content_es ); ?></textarea>
            </div>
            <div class="psa-grid-2" style="margin-top:14px;">
                <div class="psa-field">
                    <label for="ps_svc_seo_title_es">SEO Title (ES)</label>
                    <input type="text" id="ps_svc_seo_title_es" name="ps_seo_title_es" value="<?php echo esc_attr( $seo_title_es ); ?>" maxlength="70" />
                </div>
                <div class="psa-field">
                    <label for="ps_svc_seo_desc_es">Meta Description (ES)</label>
                    <textarea id="ps_svc_seo_desc_es" name="ps_seo_desc_es" style="height:60px;" maxlength="165"><?php echo esc_textarea( $seo_desc_es ); ?></textarea>
                </div>
            </div>
        </div>
    </div>
    <?php
}

add_action( 'save_post_ps_service', 'psa_save_service_meta', 10, 2 );

function psa_save_service_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['psa_service_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['psa_service_nonce'], 'psa_save_service' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $text = [ 'ps_service_slug','ps_hero_headline','ps_hero_subheadline','ps_cta_primary_text',
              'ps_seo_title','ps_seo_desc','ps_hero_headline_es','ps_hero_subheadline_es',
              'ps_seo_title_es','ps_seo_desc_es' ];
    $url  = [ 'ps_cta_primary_url' ];
    $html = [ 'ps_content_es' ];

    foreach ( $text as $f ) update_post_meta( $post_id, $f, sanitize_text_field( $_POST[$f] ?? '' ) );
    foreach ( $url  as $f ) update_post_meta( $post_id, $f, esc_url_raw( $_POST[$f] ?? '' ) );
    foreach ( $html as $f ) update_post_meta( $post_id, $f, wp_kses_post( $_POST[$f] ?? '' ) );
}

// ============================================================
// 6.  ADMIN LIST COLUMNS — PROPERTIES
// ============================================================

add_filter( 'manage_ps_property_posts_columns',       'psa_property_columns' );
add_action( 'manage_ps_property_posts_custom_column', 'psa_property_column_content', 10, 2 );
add_filter( 'manage_sortable_columns',                'psa_property_sortable_columns' );
add_action( 'pre_get_posts',                          'psa_property_column_orderby' );

function psa_property_columns( array $cols ): array {
    $new = [];
    $new['cb']        = $cols['cb'];
    $new['title']     = 'Property';
    $new['ps_city_col']  = 'City';
    $new['ps_beds_col']  = 'Beds';
    $new['ps_rate_col']  = 'Nightly (USD)';
    $new['ps_status_col']= 'Status';
    $new['ps_feat_col']  = '⭐';
    $new['ps_owner_col'] = 'Owner';
    $new['date']         = 'Added';
    return $new;
}

function psa_property_column_content( string $column, int $post_id ): void {
    switch ( $column ) {
        case 'ps_city_col':
            $city = get_post_meta( $post_id, 'ps_city', true );
            echo esc_html( psa_city_options()[$city] ?? $city );
            break;
        case 'ps_beds_col':
            $beds = (int) get_post_meta( $post_id, 'ps_bedrooms', true );
            echo $beds === 0 ? '<em style="color:#888">Studio</em>' : esc_html( $beds );
            break;
        case 'ps_rate_col':
            $rate = (float) get_post_meta( $post_id, 'ps_nightly_rate', true );
            echo $rate > 0 ? '$' . number_format( $rate ) : '—';
            break;
        case 'ps_status_col':
            $status = get_post_meta( $post_id, 'ps_listing_status', true );
            $labels = [
                'active'         => [ 'Live',           'psa-status-live' ],
                'pending_review' => [ 'Needs Approval', 'psa-status-pending' ],
                'draft'          => [ 'Draft',           'psa-status-draft' ],
                'inactive'       => [ 'Inactive',        'psa-status-inactive' ],
            ];
            [ $lbl, $cls ] = $labels[$status] ?? [ ucfirst( $status ), 'psa-status-draft' ];
            echo "<span class='$cls'>$lbl</span>";
            break;
        case 'ps_feat_col':
            $featured = (bool) get_post_meta( $post_id, 'ps_featured', true );
            echo $featured ? '<span class="psa-featured-yes" title="Featured">★</span>' : '<span class="psa-featured-no">★</span>';
            break;
        case 'ps_owner_col':
            $owner_id = (int) get_post_meta( $post_id, 'ps_owner_id', true );
            if ( $owner_id ) {
                $u = get_userdata( $owner_id );
                echo $u ? esc_html( $u->display_name ) : "User #$owner_id";
            } else {
                echo '—';
            }
            break;
    }
}

function psa_property_sortable_columns( array $cols ): array {
    $cols['ps_city_col']  = 'ps_city';
    $cols['ps_rate_col']  = 'ps_nightly_rate';
    $cols['ps_status_col']= 'ps_listing_status';
    return $cols;
}

function psa_property_column_orderby( WP_Query $query ): void {
    if ( ! is_admin() || ! $query->is_main_query() ) return;
    if ( $query->get( 'post_type' ) !== 'ps_property' ) return;
    $orderby = $query->get( 'orderby' );
    if ( in_array( $orderby, [ 'ps_city', 'ps_listing_status' ], true ) ) {
        $query->set( 'meta_key',  $orderby );
        $query->set( 'orderby',   'meta_value' );
    } elseif ( $orderby === 'ps_nightly_rate' ) {
        $query->set( 'meta_key',  'ps_nightly_rate' );
        $query->set( 'orderby',   'meta_value_num' );
    }
}

// ── Admin filters (dropdowns above the list table) ────────
add_action( 'restrict_manage_posts', 'psa_property_list_filters' );
add_filter( 'parse_query',           'psa_apply_property_filters' );

function psa_property_list_filters(): void {
    $screen = get_current_screen();
    if ( $screen->post_type !== 'ps_property' ) return;

    // City filter
    $selected_city = sanitize_key( $_GET['ps_city_filter'] ?? '' );
    echo '<select name="ps_city_filter"><option value="">All Cities</option>';
    foreach ( psa_city_options() as $slug => $label ) {
        echo '<option value="' . esc_attr( $slug ) . '"' . selected( $selected_city, $slug, false ) . '>' . esc_html( $label ) . '</option>';
    }
    echo '</select>&nbsp;';

    // Status filter
    $selected_status = sanitize_key( $_GET['ps_status_filter'] ?? '' );
    $statuses = [ '' => 'All Statuses', 'active' => 'Active (Live)', 'pending_review' => 'Needs Approval', 'draft' => 'Draft', 'inactive' => 'Inactive' ];
    echo '<select name="ps_status_filter">';
    foreach ( $statuses as $val => $lbl ) {
        echo '<option value="' . esc_attr( $val ) . '"' . selected( $selected_status, $val, false ) . '>' . esc_html( $lbl ) . '</option>';
    }
    echo '</select>&nbsp;';

    // Property type filter
    $selected_type = sanitize_key( $_GET['ps_type_filter'] ?? '' );
    $types = [ '' => 'All Types', 'studio' => 'Studio', 'condo' => 'Condo', 'villa' => 'Villa', 'penthouse' => 'Penthouse' ];
    echo '<select name="ps_type_filter">';
    foreach ( $types as $val => $lbl ) {
        echo '<option value="' . esc_attr( $val ) . '"' . selected( $selected_type, $val, false ) . '>' . esc_html( $lbl ) . '</option>';
    }
    echo '</select>';
}

function psa_apply_property_filters( WP_Query $query ): void {
    if ( ! is_admin() || ! $query->is_main_query() ) return;
    if ( $query->get( 'post_type' ) !== 'ps_property' ) return;

    $meta_query = (array) ( $query->get( 'meta_query' ) ?: [] );

    if ( ! empty( $_GET['ps_city_filter'] ) ) {
        $meta_query[] = [ 'key' => 'ps_city', 'value' => sanitize_key( $_GET['ps_city_filter'] ) ];
    }
    if ( ! empty( $_GET['ps_status_filter'] ) ) {
        $meta_query[] = [ 'key' => 'ps_listing_status', 'value' => sanitize_key( $_GET['ps_status_filter'] ) ];
    }
    if ( ! empty( $_GET['ps_type_filter'] ) ) {
        $meta_query[] = [ 'key' => 'ps_property_type', 'value' => sanitize_key( $_GET['ps_type_filter'] ) ];
    }

    if ( count( $meta_query ) > 1 ) {
        $meta_query['relation'] = 'AND';
        $query->set( 'meta_query', $meta_query );
    } elseif ( count( $meta_query ) === 1 ) {
        $query->set( 'meta_query', $meta_query );
    }
}

// ============================================================
// 7.  ENHANCED PUBLISH VALIDATION (SERVER SIDE)
// ============================================================

add_action( 'transition_post_status', 'psa_validate_before_publish', 5, 3 );

function psa_validate_before_publish( string $new_status, string $old_status, WP_Post $post ): void {
    if ( $post->post_type !== 'ps_property' ) return;
    if ( $new_status !== 'publish' ) return;

    $errors = [];

    if ( ! has_post_thumbnail( $post->ID ) ) {
        $errors[] = 'A featured image is required.';
    }
    $city = get_post_meta( $post->ID, 'ps_city', true );
    if ( ! $city ) {
        $errors[] = 'City must be selected on the Basic Info tab.';
    }
    $rate = (float) get_post_meta( $post->ID, 'ps_nightly_rate', true );
    if ( $rate <= 0 ) {
        $errors[] = 'Nightly rate must be greater than 0 on the Pricing tab.';
    }
    $gallery_ids = json_decode( get_post_meta( $post->ID, 'ps_gallery', true ) ?: '[]', true );
    if ( count( $gallery_ids ) < 3 ) {
        $errors[] = 'At least 3 gallery images are required (currently ' . count( $gallery_ids ) . '). Add more on the Media tab.';
    }

    if ( $errors ) {
        // Revert to pending review — not draft, so manager can see it
        remove_action( 'transition_post_status', 'psa_validate_before_publish', 5 );
        wp_update_post( [ 'ID' => $post->ID, 'post_status' => 'pending' ] );
        $msg = implode( ' | ', $errors );
        set_transient( 'psa_publish_error_' . $post->ID, $msg, 120 );
    }
}

add_action( 'admin_notices', 'psa_show_validation_notice' );
function psa_show_validation_notice(): void {
    global $post;
    if ( ! $post ) return;
    $msg = get_transient( 'psa_publish_error_' . $post->ID );
    if ( ! $msg ) return;
    $items = array_map( 'esc_html', explode( ' | ', $msg ) );
    echo '<div class="psa-validation-notice notice notice-error"><strong>⚠️ Property cannot be published — fix these issues first:</strong><ul>';
    foreach ( $items as $item ) echo '<li>' . $item . '</li>';
    echo '</ul></div>';
    delete_transient( 'psa_publish_error_' . $post->ID );
}

// ============================================================
// 8.  ROLES — complete capability definitions
// ============================================================

register_activation_hook( __FILE__, 'psa_setup_roles' );
register_deactivation_hook( __FILE__, 'psa_teardown_roles' );

function psa_setup_roles(): void {

    // Remove and recreate to ensure capability lists are current
    remove_role( 'ps_manager' );
    remove_role( 'ps_editor' );
    remove_role( 'ps_owner' );

    // ── ps_manager ────────────────────────────────────────
    // Full editorial control: properties, cities, services, leads. No theme/plugin access.
    add_role( 'ps_manager', 'PlayaStays Manager', [
        'read'                     => true,
        'upload_files'             => true,

        // Posts (blog)
        'edit_posts'               => true,
        'edit_others_posts'        => true,
        'publish_posts'            => true,
        'delete_posts'             => true,
        'delete_others_posts'      => true,
        'read_private_posts'       => true,
        'edit_private_posts'       => true,
        'delete_private_posts'     => true,

        // Properties
        'edit_ps_properties'       => true,
        'edit_others_ps_properties'=> true,
        'publish_ps_properties'    => true,
        'delete_ps_properties'     => true,
        'read_private_ps_properties' => true,

        // Cities
        'edit_ps_cities'           => true,
        'publish_ps_cities'        => true,
        'delete_ps_cities'         => true,

        // Services
        'edit_ps_services'         => true,
        'publish_ps_services'      => true,
        'delete_ps_services'       => true,

        // Leads (read only — no delete)
        'read_ps_leads'            => true,
        'edit_ps_leads'            => false,
        'delete_ps_leads'          => false,

        // Misc
        'manage_categories'        => true,
        'moderate_comments'        => true,
    ] );

    // ── ps_editor ─────────────────────────────────────────
    // Blog posts, FAQs, testimonials. Cannot touch listings or leads.
    add_role( 'ps_editor', 'PlayaStays Editor', [
        'read'             => true,
        'upload_files'     => true,
        'edit_posts'       => true,
        'edit_others_posts'=> true,
        'publish_posts'    => true,
        'delete_posts'     => true,
        'manage_categories'=> true,
        'moderate_comments'=> true,
    ] );

    // ── ps_owner ──────────────────────────────────────────
    // Can submit new properties (status = pending). Can edit only their own.
    // Cannot publish, delete, or see other post types.
    add_role( 'ps_owner', 'Property Owner', [
        'read'               => true,
        'upload_files'       => true,
        'edit_ps_properties' => true,       // own posts only (enforced below)
    ] );
}

function psa_teardown_roles(): void {
    remove_role( 'ps_manager' );
    remove_role( 'ps_editor' );
    remove_role( 'ps_owner' );
}

// Map CPT meta capabilities for ps_property
add_filter( 'map_meta_cap', 'psa_map_property_caps', 10, 4 );

function psa_map_property_caps( array $caps, string $cap, int $user_id, array $args ): array {
    $map = [
        'edit_ps_property'              => 'edit_ps_properties',
        'read_ps_property'              => 'read',
        'delete_ps_property'            => 'delete_ps_properties',
        'edit_ps_properties'            => 'edit_ps_properties',
        'publish_ps_properties'         => 'publish_ps_properties',
        'read_private_ps_properties'    => 'read_private_ps_properties',
        'delete_ps_properties'          => 'delete_ps_properties',
        'edit_others_ps_properties'     => 'edit_others_ps_properties',
    ];

    if ( ! isset( $map[ $cap ] ) ) return $caps;
    $required = $map[ $cap ];

    // ps_owner: can only edit their own properties, cannot publish or delete
    if ( user_can( $user_id, 'ps_owner' ) ) {
        if ( $cap === 'edit_ps_property' && ! empty( $args[0] ) ) {
            $post = get_post( $args[0] );
            if ( $post && $post->post_author != $user_id ) {
                return [ 'do_not_allow' ];
            }
        }
        if ( in_array( $cap, [ 'publish_ps_properties', 'delete_ps_properties', 'edit_others_ps_properties' ], true ) ) {
            return [ 'do_not_allow' ];
        }
    }

    return [ $required ];
}

// Restrict ps_owner admin menu to only Properties
add_action( 'admin_menu', 'psa_restrict_owner_menu', 999 );

function psa_restrict_owner_menu(): void {
    if ( ! current_user_can( 'ps_owner' ) || current_user_can( 'ps_manager' ) ) return;

    global $menu, $submenu;
    $allowed_pages = [ 'edit.php?post_type=ps_property', 'post-new.php?post_type=ps_property', 'index.php', 'profile.php' ];

    foreach ( $menu as $key => $item ) {
        if ( isset( $item[2] ) && ! in_array( $item[2], $allowed_pages, true ) ) {
            remove_menu_page( $item[2] );
        }
    }
}

// ============================================================
// 9.  FRONT-END PROPERTY SUBMISSION ENDPOINT
// ============================================================

add_action( 'rest_api_init', 'psa_register_submission_route' );

function psa_register_submission_route(): void {
    register_rest_route( 'playastays/v1', '/submit-property', [
        'methods'             => 'POST',
        'callback'            => 'psa_handle_property_submission',
        'permission_callback' => '__return_true',  // Auth checked inside
    ] );
}

function psa_handle_property_submission( WP_REST_Request $request ): WP_REST_Response {
    $body = $request->get_json_params();

    // ── Auth: accept logged-in user OR public form with owner email ──
    $user_id = 0;
    if ( is_user_logged_in() ) {
        $user_id = get_current_user_id();
    } elseif ( ! empty( $body['owner_email'] ) ) {
        // Look up existing owner by email; create account if first submission
        $user = get_user_by( 'email', sanitize_email( $body['owner_email'] ) );
        if ( ! $user ) {
            $user_id = wp_create_user(
                sanitize_email( $body['owner_email'] ),
                wp_generate_password(),
                sanitize_email( $body['owner_email'] )
            );
            if ( ! is_wp_error( $user_id ) ) {
                $u = new WP_User( $user_id );
                $u->set_role( 'ps_owner' );
                wp_new_user_notification( $user_id, null, 'user' );
            }
        } else {
            $user_id = $user->ID;
        }
    }

    // Required fields
    $title = sanitize_text_field( $body['title'] ?? '' );
    $city  = sanitize_key( $body['city']  ?? '' );
    if ( ! $title || ! $city ) {
        return new WP_REST_Response( [ 'error' => 'Property name and city are required.' ], 400 );
    }

    // Create as pending
    $post_args = [
        'post_type'   => 'ps_property',
        'post_title'  => $title,
        'post_status' => 'pending',
        'post_author' => $user_id ?: 1,
    ];
    $post_id = wp_insert_post( $post_args );
    if ( is_wp_error( $post_id ) ) {
        return new WP_REST_Response( [ 'error' => 'Could not create property.' ], 500 );
    }

    // Save meta from submission
    $meta_map = [
        'ps_city'          => sanitize_key( $body['city'] ?? '' ),
        'ps_neighborhood'  => sanitize_text_field( $body['neighborhood'] ?? '' ),
        'ps_property_type' => sanitize_key( $body['property_type'] ?? '' ),
        'ps_bedrooms'      => (int)( $body['bedrooms'] ?? 0 ),
        'ps_bathrooms'     => (float)( $body['bathrooms'] ?? 0 ),
        'ps_guests'        => (int)( $body['guests'] ?? 0 ),
        'ps_nightly_rate'  => (float)( $body['nightly_rate'] ?? 0 ),
        'ps_airbnb_url'    => esc_url_raw( $body['airbnb_url'] ?? '' ),
        'ps_listing_status'=> 'pending_review',
        'ps_owner_id'      => $user_id,
    ];
    foreach ( $meta_map as $key => $val ) {
        update_post_meta( $post_id, $key, $val );
    }

    // Set city taxonomy
    if ( $city ) {
        wp_set_post_terms( $post_id, [ $city ], 'ps_city_tag' );
    }

    // Notify managers
    $managers = get_users( [ 'role__in' => [ 'ps_manager', 'administrator' ], 'fields' => 'user_email' ] );
    if ( $managers ) {
        $subject = "[PlayaStays] New property submission: $title ($city)";
        $body_text = "A new property has been submitted for review.\n\n" .
            "Title: $title\nCity: $city\n" .
            "Review: " . admin_url( "post.php?post=$post_id&action=edit" );
        wp_mail( array_unique( $managers ), $subject, $body_text );
    }

    return new WP_REST_Response( [
        'success'    => true,
        'post_id'    => $post_id,
        'status'     => 'pending',
        'message'    => 'Your property has been submitted. Our team will review it within 24 hours.',
    ], 201 );
}

// ============================================================
// 10.  ADMIN UX CLEANUP
// ============================================================

// Remove default Custom Fields meta box (we have our own tabbed UI)
add_action( 'add_meta_boxes', 'psa_remove_default_metaboxes', 99 );

function psa_remove_default_metaboxes(): void {
    $pts = [ 'ps_property', 'ps_city', 'ps_service' ];
    foreach ( $pts as $pt ) {
        remove_meta_box( 'postcustom',       $pt, 'normal' );   // Custom Fields
        remove_meta_box( 'commentstatusdiv', $pt, 'normal' );   // Discussion
        remove_meta_box( 'commentsdiv',      $pt, 'normal' );   // Comments
        remove_meta_box( 'trackbacksdiv',    $pt, 'normal' );   // Trackbacks
        remove_meta_box( 'revisionsdiv',     $pt, 'normal' );   // Revisions
        remove_meta_box( 'authordiv',        $pt, 'normal' );   // Author (for property — owner is in our UI)
        // Keep: title, editor, thumbnail, publish box, taxonomies
    }
}

// Add a helpful notice on the property list page if no properties
add_action( 'admin_footer-edit.php', 'psa_empty_property_notice' );
function psa_empty_property_notice(): void {
    $screen = get_current_screen();
    if ( $screen->post_type !== 'ps_property' ) return;
    ?>
    <script>
    jQuery(function($) {
        if ($('#the-list tr.no-items').length) {
            $('#the-list tr.no-items td').html(
                '<div style="padding:24px;text-align:center;">' +
                '<p style="font-size:15px;color:#555;margin-bottom:12px;">No properties yet. Add your first property to get started.</p>' +
                '<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=ps_property' ) ); ?>" class="button button-primary button-large">+ Add First Property</a>' +
                '</div>'
            );
        }
    });
    </script>
    <?php
}

// Admin notices for incomplete ES translations on city/service pages
add_action( 'admin_notices', 'psa_translation_notices' );
function psa_translation_notices(): void {
    global $post;
    if ( ! $post ) return;
    if ( ! in_array( $post->post_type, [ 'ps_city', 'ps_service', 'ps_property' ], true ) ) return;
    if ( $post->post_status !== 'publish' ) return;

    $missing = [];

    if ( $post->post_type === 'ps_city' || $post->post_type === 'ps_property' ) {
        if ( ! get_post_meta( $post->ID, 'ps_title_es', true ) ) $missing[] = 'Title (ES)';
        if ( ! get_post_meta( $post->ID, 'ps_excerpt_es', true ) ) $missing[] = 'Excerpt (ES)';
    }
    if ( $post->post_type === 'ps_service' ) {
        if ( ! get_post_meta( $post->ID, 'ps_hero_headline_es', true ) ) $missing[] = 'Hero Headline (ES)';
    }

    if ( $missing ) {
        $fields = implode( ', ', $missing );
        echo '<div class="notice notice-warning"><p>';
        echo '🇲🇽 <strong>Spanish translation incomplete:</strong> ';
        echo esc_html( "Missing: $fields. The Spanish version of this page is currently noindex. " );
        echo 'Edit the <strong>Spanish</strong> tab to fix this.';
        echo '</p></div>';
    }
}

// ============================================================
// 11.  LEAD LIST VIEW IMPROVEMENTS
// ============================================================

add_filter( 'manage_ps_lead_posts_columns',       'psa_lead_columns' );
add_action( 'manage_ps_lead_posts_custom_column', 'psa_lead_column_content', 10, 2 );

function psa_lead_columns( array $cols ): array {
    return [
        'cb'              => $cols['cb'],
        'title'           => 'Lead',
        'ps_lead_email'   => 'Email',
        'ps_lead_phone'   => 'Phone',
        'ps_lead_city'    => 'City',
        'ps_lead_type'    => 'Property Type',
        'ps_lead_source'  => 'Source',
        'ps_lead_locale'  => 'Lang',
        'ps_lead_status'  => 'Status',
        'date'            => 'Received',
    ];
}

function psa_lead_column_content( string $column, int $post_id ): void {
    $map = [
        'ps_lead_email'  => 'ps_email',
        'ps_lead_phone'  => 'ps_phone',
        'ps_lead_city'   => 'ps_city',
        'ps_lead_type'   => 'ps_property_type',
        'ps_lead_source' => 'ps_source',
        'ps_lead_locale' => 'ps_locale',
    ];
    if ( isset( $map[$column] ) ) {
        echo esc_html( get_post_meta( $post_id, $map[$column], true ) ?: '—' );
    } elseif ( $column === 'ps_lead_status' ) {
        $status = get_post_meta( $post_id, 'ps_lead_status', true ) ?: 'new';
        $colors = [ 'new' => '#186870', 'contacted' => '#c8a44a', 'qualified' => '#2e7d32', 'closed_won' => '#1565c0', 'closed_lost' => '#888' ];
        $color  = $colors[$status] ?? '#888';
        echo "<span style='color:#fff;background:$color;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;text-transform:capitalize;'>" . esc_html( str_replace('_',' ',$status) ) . '</span>';
    }
}

// Lead status quick-edit
add_action( 'post_submitbox_misc_actions', 'psa_lead_status_select' );
function psa_lead_status_select(): void {
    global $post;
    if ( ! $post || $post->post_type !== 'ps_lead' ) return;
    $current = get_post_meta( $post->ID, 'ps_lead_status', true ) ?: 'new';
    $opts    = [ 'new' => 'New', 'contacted' => 'Contacted', 'qualified' => 'Qualified', 'closed_won' => 'Closed – Won', 'closed_lost' => 'Closed – Lost' ];
    echo '<div style="padding:6px 10px;"><label style="font-size:12px;font-weight:600;">Lead Status<br/>';
    echo '<select name="ps_lead_status_select" style="margin-top:4px;">';
    foreach ( $opts as $val => $lbl ) {
        echo '<option value="' . esc_attr($val) . '"' . selected($current,$val,false) . '>' . esc_html($lbl) . '</option>';
    }
    echo '</select></label></div>';
}

add_action( 'save_post_ps_lead', 'psa_save_lead_status', 10, 2 );
function psa_save_lead_status( int $post_id ): void {
    if ( ! empty( $_POST['ps_lead_status_select'] ) ) {
        $allowed = [ 'new', 'contacted', 'qualified', 'closed_won', 'closed_lost' ];
        $val = sanitize_key( $_POST['ps_lead_status_select'] );
        if ( in_array( $val, $allowed, true ) ) {
            update_post_meta( $post_id, 'ps_lead_status', $val );
        }
    }
}

<?php
/**
 * Plugin Name: PlayaStays Operations Layer
 * Description: Revenue tracking, internal notes, performance repeater,
 *              lead–property linking, quick-add form, lead assignment,
 *              and dashboard widget.
 *              Requires: PlayaStays Admin Layer (playastays-admin.php)
 * Version:     1.0.0
 * Author:      PlayaStays
 * Text Domain: playastays-ops
 */

defined( 'ABSPATH' ) || exit;

// ============================================================
// 0.  REGISTER NEW META FIELDS (REST-exposed, non-breaking)
// ============================================================

add_action( 'init', 'pso_register_meta_fields' );

function pso_register_meta_fields(): void {

    // ── Property revenue & contract fields ────────────────
    $prop_fields = [
        'pso_mgmt_tier'        => 'string',   // core | plus | premium
        'pso_mgmt_fee_pct'     => 'number',   // 10, 15, 20 — editable
        'pso_addl_services'    => 'string',   // JSON array of service keys
        'pso_contract_start'   => 'string',   // YYYY-MM-DD
        'pso_contract_months'  => 'integer',  // 6, 12, 24
        'pso_source_lead_id'   => 'integer',  // lead post ID that originated this property
        'pso_notes'            => 'string',   // JSON array of {ts, user, text}
        'pso_monthly_perf'     => 'string',   // JSON array of monthly records
    ];
    foreach ( $prop_fields as $key => $type ) {
        register_post_meta( 'ps_property', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => true,
            'auth_callback' => function ( $allowed, $meta_key, $post_id, $user_id ) {
                return current_user_can( 'edit_post', $post_id );
            },
        ] );
    }

    // ── Lead fields ────────────────────────────────────────
    $lead_fields = [
        'pso_converted_property_id' => 'integer',  // property post ID created from this lead
        'pso_assigned_manager_id'   => 'integer',  // WP user ID of assigned manager
    ];
    foreach ( $lead_fields as $key => $type ) {
        register_post_meta( 'ps_lead', $key, [
            'single'        => true,
            'type'          => $type,
            'show_in_rest'  => false,  // leads never exposed via REST
            'auth_callback' => '__return_true',
        ] );
    }
}

// ============================================================
// 1.  ENQUEUE OPS ASSETS (only on ps_property / ps_lead edits)
// ============================================================

add_action( 'admin_enqueue_scripts', 'pso_enqueue_assets' );

function pso_enqueue_assets( string $hook ): void {
    if ( ! in_array( $hook, [ 'post.php', 'post-new.php', 'index.php' ], true ) ) return;

    $screen = get_current_screen();
    $is_prop = isset( $screen->post_type ) && $screen->post_type === 'ps_property';
    $is_lead = isset( $screen->post_type ) && $screen->post_type === 'ps_lead';
    $is_dash = $hook === 'index.php';

    if ( ! $is_prop && ! $is_lead && ! $is_dash ) return;

    wp_add_inline_style( 'wp-admin', pso_css() );
    wp_add_inline_script( 'jquery', pso_js() );
}

function pso_css(): string {
    return <<<CSS
/* ── PlayaStays Ops layer ─────────────────────────────── */

/* Revenue tab */
.pso-tier-card {
    padding: 14px 18px; border: 2px solid #ddd; border-radius: 6px;
    cursor: pointer; transition: all .15s; background: #fff;
}
.pso-tier-card:hover { border-color: #186870; }
.pso-tier-card.selected { border-color: #186870; background: #f0f8f8; }
.pso-tier-card .tier-name { font-size: 13px; font-weight: 700; color: #186870; }
.pso-tier-card .tier-pct  { font-size: 22px; font-weight: 800; color: #0a2b2f; line-height: 1.1; }
.pso-tier-card .tier-desc { font-size: 11px; color: #888; margin-top: 3px; }
.pso-tier-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px; }
.pso-fee-override { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
.pso-fee-override label { font-size: 12px; font-weight: 600; color: #444; min-width: 100px; }
.pso-fee-override input { width: 80px; }
.pso-addl-services { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 6px; margin-top: 4px; }
.pso-addl-services label { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #555; font-weight: normal; text-transform: none; letter-spacing: 0; cursor: pointer; }
.pso-addl-services input[type=checkbox] { width: auto; margin: 0; }
.pso-contract-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pso-revenue-summary {
    display: flex; gap: 20px; padding: 12px 16px; margin-bottom: 16px;
    background: #0a2b2f; border-radius: 6px; flex-wrap: wrap;
}
.pso-rev-stat { text-align: center; }
.pso-rev-stat .rv { font-size: 18px; font-weight: 800; color: #c8a44a; line-height: 1; }
.pso-rev-stat .rk { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.5); margin-top: 3px; }

/* Notes log */
.pso-notes-log { max-height: 320px; overflow-y: auto; margin-bottom: 14px; border: 1px solid #eee; border-radius: 4px; }
.pso-note-entry { padding: 10px 14px; border-bottom: 1px solid #f5f5f5; }
.pso-note-entry:last-child { border-bottom: none; }
.pso-note-meta { font-size: 11px; color: #888; margin-bottom: 4px; }
.pso-note-meta strong { color: #555; }
.pso-note-text { font-size: 13px; color: #333; line-height: 1.55; }
.pso-note-add { display: flex; gap: 10px; align-items: flex-end; }
.pso-note-add textarea { flex: 1; height: 72px; resize: vertical; }

/* Monthly performance */
.pso-perf-summary {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    padding: 14px; background: #f9f9f9; border: 1px solid #eee;
    border-radius: 6px; margin-bottom: 16px;
}
.pso-perf-stat .pv { font-size: 18px; font-weight: 700; color: #186870; }
.pso-perf-stat .pk { font-size: 10px; text-transform: uppercase; letter-spacing: .07em; color: #888; margin-top: 2px; }
.pso-perf-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 36px; gap: 8px;
    align-items: end; padding: 8px 10px; background: #fff;
    border: 1px solid #eee; border-radius: 4px; margin-bottom: 6px;
}
.pso-perf-row input { width: 100%; }
.pso-perf-row .rm-perf { color: #c0392b; background: none; border: none; cursor: pointer; font-size: 16px; padding: 0; }
.pso-perf-head {
    display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 36px; gap: 8px;
    padding: 6px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .06em; color: #888;
}

/* Lead linking badge */
.pso-linked-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; background: #e8f5f3; border: 1px solid #186870;
    border-radius: 20px; font-size: 12px; color: #186870; font-weight: 600;
    text-decoration: none;
}
.pso-linked-badge:hover { background: #d0eeea; color: #186870; }

/* Quick-add modal */
.pso-quick-modal-overlay {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,.55);
    z-index: 99998; align-items: center; justify-content: center;
}
.pso-quick-modal-overlay.open { display: flex; }
.pso-quick-modal {
    background: #fff; border-radius: 8px; padding: 28px 32px; width: 480px;
    max-width: 94vw; box-shadow: 0 12px 40px rgba(0,0,0,.3); position: relative;
}
.pso-quick-modal h2 { margin: 0 0 20px; font-size: 17px; color: #0a2b2f; }
.pso-quick-modal .pso-mfield { margin-bottom: 14px; }
.pso-quick-modal .pso-mfield label { display: block; font-size: 12px; font-weight: 600; color: #444; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .05em; }
.pso-quick-modal .pso-mfield input,
.pso-quick-modal .pso-mfield select { width: 100%; padding: 7px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; }
.pso-quick-modal .pso-mfield input:focus,
.pso-quick-modal .pso-mfield select:focus { outline: none; border-color: #186870; box-shadow: 0 0 0 2px rgba(24,104,112,.15); }
.pso-qm-actions { display: flex; gap: 10px; margin-top: 20px; }
.pso-qm-close { position: absolute; top: 14px; right: 16px; background: none; border: none; font-size: 20px; color: #888; cursor: pointer; }
.pso-qm-close:hover { color: #333; }

/* Dashboard widget */
.pso-dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.pso-dash-stat { padding: 12px 14px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #186870; }
.pso-dash-stat.warn { border-color: #c8a44a; }
.pso-dash-stat.alert { border-color: #e05a36; }
.pso-dash-stat .ds-val { font-size: 22px; font-weight: 800; color: #0a2b2f; line-height: 1; }
.pso-dash-stat .ds-key { font-size: 11px; color: #888; margin-top: 3px; }
.pso-dash-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
CSS;
}

function pso_js(): string {
    // Localise nonce and admin URL for AJAX calls
    $ajax_url   = admin_url( 'admin-ajax.php' );
    $nonce      = wp_create_nonce( 'pso_ajax' );
    $new_prop   = admin_url( 'post-new.php?post_type=ps_property' );
    $city_opts  = '';
    foreach ( [ 'playa-del-carmen' => 'Playa del Carmen', 'tulum' => 'Tulum', 'akumal' => 'Akumal', 'puerto-morelos' => 'Puerto Morelos', 'xpu-ha' => 'Xpu-Ha', 'chetumal' => 'Chetumal' ] as $v => $l ) {
        $city_opts .= "<option value='$v'>$l</option>";
    }

    return <<<JS
(function($) {

var PSO_AJAX = '$ajax_url';
var PSO_NONCE = '$nonce';

// ── Tier card selection ──────────────────────────────────
$(document).on('click', '.pso-tier-card', function() {
    $('.pso-tier-card').removeClass('selected');
    $(this).addClass('selected');
    var tier = $(this).data('tier');
    var pct  = $(this).data('pct');
    $('#pso_mgmt_tier').val(tier);
    $('#pso_mgmt_fee_pct').val(pct);
});

// Keep fee % in sync if user manually edits
$(document).on('input', '#pso_mgmt_fee_pct', function() {
    $('.pso-tier-card').removeClass('selected');
});

// ── Performance repeater ─────────────────────────────────
$(document).on('click', '#pso-add-perf', function(e) {
    e.preventDefault();
    var now = new Date();
    var month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    var row = '<div class="pso-perf-row">' +
        '<input type="text" class="pf-month" placeholder="YYYY-MM" value="' + month + '" />' +
        '<input type="number" class="pf-revenue" placeholder="0" min="0" step="1" />' +
        '<input type="number" class="pf-occ" placeholder="0" min="0" max="100" step="0.1" />' +
        '<input type="number" class="pf-nightly" placeholder="0" min="0" step="1" />' +
        '<button type="button" class="rm-perf" title="Remove">✕</button>' +
        '</div>';
    $('#pso-perf-rows').append(row);
    psoUpdatePerfInput();
    psoUpdatePerfSummary();
});

$(document).on('click', '.rm-perf', function() {
    $(this).closest('.pso-perf-row').remove();
    psoUpdatePerfInput();
    psoUpdatePerfSummary();
});

$(document).on('input', '.pf-month, .pf-revenue, .pf-occ, .pf-nightly', function() {
    psoUpdatePerfInput();
    psoUpdatePerfSummary();
});

function psoUpdatePerfInput() {
    var data = [];
    $('.pso-perf-row').each(function() {
        data.push({
            month:   $(this).find('.pf-month').val(),
            revenue: parseFloat($(this).find('.pf-revenue').val()) || 0,
            occ:     parseFloat($(this).find('.pf-occ').val()) || 0,
            nightly: parseFloat($(this).find('.pf-nightly').val()) || 0
        });
    });
    $('#pso-monthly-perf-json').val(JSON.stringify(data));
}

function psoUpdatePerfSummary() {
    var rows = [];
    $('.pso-perf-row').each(function() {
        rows.push({
            revenue: parseFloat($(this).find('.pf-revenue').val()) || 0,
            occ:     parseFloat($(this).find('.pf-occ').val()) || 0
        });
    });
    // Last 12 months (or all if fewer)
    var last12 = rows.slice(-12);
    var totalRev = last12.reduce(function(s, r) { return s + r.revenue; }, 0);
    var avgOcc   = last12.length ? (last12.reduce(function(s, r) { return s + r.occ; }, 0) / last12.length) : 0;
    var months   = last12.length;

    $('#pso-sum-revenue').text('$' + totalRev.toLocaleString());
    $('#pso-sum-occ').text(avgOcc.toFixed(1) + '%');
    $('#pso-sum-months').text(months);
}

// Initialise on load
psoUpdatePerfSummary();

// ── Notes — append only ──────────────────────────────────
$(document).on('click', '#pso-add-note-btn', function(e) {
    e.preventDefault();
    var text = $('#pso-new-note').val().trim();
    if (!text) { alert('Note cannot be empty.'); return; }

    var btn = $(this).prop('disabled', true).text('Saving…');
    $.post(PSO_AJAX, {
        action:   'pso_add_note',
        post_id:  $('#pso-note-post-id').val(),
        note:     text,
        _wpnonce: PSO_NONCE
    }, function(resp) {
        btn.prop('disabled', false).text('Add Note');
        if (resp.success) {
            var entry = '<div class="pso-note-entry">' +
                '<div class="pso-note-meta"><strong>' + $('<span/>').text(resp.data.user).html() + '</strong> · ' + resp.data.ts + '</div>' +
                '<div class="pso-note-text">' + $('<span/>').text(resp.data.text).html() + '</div>' +
                '</div>';
            $('#pso-notes-log').append(entry);
            $('#pso-notes-log').scrollTop($('#pso-notes-log')[0].scrollHeight);
            $('#pso-new-note').val('');
        } else {
            alert('Could not save note: ' + (resp.data || 'Unknown error'));
        }
    });
});

// ── Quick-add modal ──────────────────────────────────────
$(document).on('click', '#pso-quick-add-btn', function(e) {
    e.preventDefault();
    // Create modal if not present
    if (!$('#pso-quick-modal-overlay').length) {
        var cityOpts = '<option value="">— Select city —</option>$city_opts';
        var html = '<div id="pso-quick-modal-overlay" class="pso-quick-modal-overlay">' +
            '<div class="pso-quick-modal">' +
            '<button type="button" class="pso-qm-close">✕</button>' +
            '<h2>⚡ Quick Add Property</h2>' +
            '<div class="pso-mfield"><label>Property Title *</label>' +
            '<input type="text" id="pso-qa-title" placeholder="e.g. Beachfront Studio Playa del Carmen" /></div>' +
            '<div class="pso-mfield"><label>City *</label><select id="pso-qa-city">' + cityOpts + '</select></div>' +
            '<div class="pso-mfield"><label>Nightly Rate (USD) *</label>' +
            '<input type="number" id="pso-qa-nightly" placeholder="120" min="0" step="1" /></div>' +
            '<div class="pso-mfield"><label>Owner Email (optional — creates owner account)</label>' +
            '<input type="email" id="pso-qa-owner" placeholder="owner@email.com" /></div>' +
            '<div class="pso-qm-actions">' +
            '<button type="button" id="pso-qa-submit" class="button button-primary">Create Draft Property</button>' +
            '<button type="button" class="pso-qm-close button">Cancel</button>' +
            '</div></div></div>';
        $('body').append(html);
    }
    $('#pso-quick-modal-overlay').addClass('open');
});

$(document).on('click', '.pso-qm-close', function() {
    $('#pso-quick-modal-overlay').removeClass('open');
});

$(document).on('click', '#pso-qa-submit', function() {
    var title   = $('#pso-qa-title').val().trim();
    var city    = $('#pso-qa-city').val();
    var nightly = parseFloat($('#pso-qa-nightly').val()) || 0;
    var owner   = $('#pso-qa-owner').val().trim();

    if (!title)   { alert('Property title is required.'); return; }
    if (!city)    { alert('City is required.'); return; }
    if (!nightly) { alert('Nightly rate is required.'); return; }

    $(this).prop('disabled', true).text('Creating…');
    $.post(PSO_AJAX, {
        action:       'pso_quick_add',
        title:        title,
        city:         city,
        nightly_rate: nightly,
        owner_email:  owner,
        _wpnonce:     PSO_NONCE
    }, function(resp) {
        if (resp.success && resp.data.edit_url) {
            window.location.href = resp.data.edit_url;
        } else {
            alert('Error: ' + (resp.data || 'Could not create property.'));
            $('#pso-qa-submit').prop('disabled', false).text('Create Draft Property');
        }
    });
});

// Close modal on overlay click
$(document).on('click', '#pso-quick-modal-overlay', function(e) {
    if ($(e.target).is('#pso-quick-modal-overlay')) {
        $(this).removeClass('open');
    }
});

})(jQuery);
JS;
}

// ============================================================
// 2.  REVENUE TAB — injected as a separate metabox on ps_property
// ============================================================

add_action( 'add_meta_boxes', 'pso_add_revenue_metabox' );

function pso_add_revenue_metabox(): void {
    add_meta_box(
        'pso_revenue_fields',
        '💼 Revenue & Contract',
        'pso_render_revenue_metabox',
        'ps_property',
        'normal',
        'default'   // renders after the main psa_property_fields (high priority)
    );
}

function pso_render_revenue_metabox( WP_Post $post ): void {
    wp_nonce_field( 'pso_save_revenue', 'pso_revenue_nonce' );
    $id = $post->ID;

    $tier           = get_post_meta( $id, 'pso_mgmt_tier',       true ) ?: 'plus';
    $fee_pct        = get_post_meta( $id, 'pso_mgmt_fee_pct',    true );
    $addl_raw       = get_post_meta( $id, 'pso_addl_services',   true );
    $addl_services  = json_decode( $addl_raw ?: '[]', true );
    $contract_start = get_post_meta( $id, 'pso_contract_start',  true );
    $contract_months= get_post_meta( $id, 'pso_contract_months', true ) ?: 12;

    // Default fee % per tier
    $tier_defaults = [ 'core' => 10, 'plus' => 15, 'premium' => 20 ];
    if ( ! $fee_pct ) $fee_pct = $tier_defaults[ $tier ] ?? 15;

    $tiers = [
        'core'    => [ 'pct' => 10, 'name' => 'Core',    'desc' => 'Essential management' ],
        'plus'    => [ 'pct' => 15, 'name' => 'Plus',    'desc' => 'Full service · most popular' ],
        'premium' => [ 'pct' => 20, 'name' => 'Premium', 'desc' => 'Luxury & portfolio' ],
    ];

    $addl_options = [
        'furnishing'       => '🪑 Furnishing assistance',
        'maintenance'      => '🔧 Maintenance coordination',
        'guest_messaging'  => '💬 Guest messaging (enhanced)',
        'photography'      => '📸 Photography package',
        'deep_cleaning'    => '🧹 Deep cleaning',
        'tax_filing'       => '📋 SAT tax filing',
        'concierge'        => '🎩 Guest concierge',
        'owner_portal'     => '📊 Enhanced owner portal',
    ];

    ?>
    <div class="psa-tab-wrap">
        <div class="psa-tabs">
            <button type="button" class="psa-tab active" data-panel="rev-contract">📄 Contract</button>
            <button type="button" class="psa-tab" data-panel="rev-services">➕ Additional Services</button>
        </div>

        <!-- ── Contract & Tier ──────────────────────────── -->
        <div id="psa-panel-rev-contract" class="psa-panel active">
            <p style="font-size:12px;color:#888;margin-bottom:16px;">
                Select the management plan for this property. The fee % auto-fills but can be overridden for negotiated rates.
            </p>

            <!-- Tier cards -->
            <div class="pso-tier-row">
                <?php foreach ( $tiers as $t_key => $t ) : ?>
                <div class="pso-tier-card <?php echo $tier === $t_key ? 'selected' : ''; ?>" data-tier="<?php echo esc_attr($t_key); ?>" data-pct="<?php echo $t['pct']; ?>">
                    <div class="tier-name"><?php echo esc_html( $t['name'] ); ?></div>
                    <div class="tier-pct"><?php echo $t['pct']; ?>%</div>
                    <div class="tier-desc"><?php echo esc_html( $t['desc'] ); ?></div>
                </div>
                <?php endforeach; ?>
            </div>
            <input type="hidden" id="pso_mgmt_tier" name="pso_mgmt_tier" value="<?php echo esc_attr( $tier ); ?>" />

            <!-- Fee override -->
            <div class="pso-fee-override">
                <label for="pso_mgmt_fee_pct">Management Fee %</label>
                <input type="number" id="pso_mgmt_fee_pct" name="pso_mgmt_fee_pct" value="<?php echo esc_attr( $fee_pct ); ?>" min="0" max="50" step="0.5" />
                <span style="font-size:12px;color:#888;">Override the tier default if needed (e.g. negotiated rate)</span>
            </div>

            <!-- Contract dates -->
            <div class="pso-contract-grid" style="margin-top:20px;">
                <div class="psa-field">
                    <label for="pso_contract_start">Contract Start Date</label>
                    <input type="date" id="pso_contract_start" name="pso_contract_start" value="<?php echo esc_attr( $contract_start ); ?>" />
                </div>
                <div class="psa-field">
                    <label for="pso_contract_months">Contract Length (months)</label>
                    <select id="pso_contract_months" name="pso_contract_months">
                        <?php foreach ( [ 1 => '1 month', 3 => '3 months', 6 => '6 months', 12 => '12 months', 24 => '24 months' ] as $v => $l ) : ?>
                            <option value="<?php echo $v; ?>" <?php selected( $contract_months, $v ); ?>><?php echo esc_html($l); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
        </div>

        <!-- ── Additional Services ──────────────────────── -->
        <div id="psa-panel-rev-services" class="psa-panel">
            <p style="font-size:12px;color:#888;margin-bottom:14px;">
                Check all additional services included in this management agreement.
            </p>
            <div class="pso-addl-services">
                <?php foreach ( $addl_options as $key => $label ) : ?>
                <label>
                    <input type="checkbox" name="pso_addl_services[]" value="<?php echo esc_attr($key); ?>"
                        <?php echo in_array( $key, (array)$addl_services, true ) ? 'checked' : ''; ?> />
                    <?php echo esc_html( $label ); ?>
                </label>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php
}

add_action( 'save_post_ps_property', 'pso_save_revenue_meta', 15, 2 );

function pso_save_revenue_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['pso_revenue_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['pso_revenue_nonce'], 'pso_save_revenue' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $allowed_tiers = [ 'core', 'plus', 'premium' ];
    $tier = sanitize_key( $_POST['pso_mgmt_tier'] ?? 'plus' );
    update_post_meta( $post_id, 'pso_mgmt_tier', in_array( $tier, $allowed_tiers, true ) ? $tier : 'plus' );
    update_post_meta( $post_id, 'pso_mgmt_fee_pct', (float)( $_POST['pso_mgmt_fee_pct'] ?? 15 ) );
    update_post_meta( $post_id, 'pso_contract_start',  sanitize_text_field( $_POST['pso_contract_start']  ?? '' ) );
    update_post_meta( $post_id, 'pso_contract_months', (int)( $_POST['pso_contract_months'] ?? 12 ) );

    $allowed_services = [ 'furnishing','maintenance','guest_messaging','photography','deep_cleaning','tax_filing','concierge','owner_portal' ];
    $selected = array_intersect( (array)( $_POST['pso_addl_services'] ?? [] ), $allowed_services );
    update_post_meta( $post_id, 'pso_addl_services', wp_json_encode( array_values( $selected ) ) );
}

// ============================================================
// 3.  INTERNAL NOTES — append-only log metabox
// ============================================================

add_action( 'add_meta_boxes', 'pso_add_notes_metabox' );

function pso_add_notes_metabox(): void {
    add_meta_box(
        'pso_notes_box',
        '📝 Internal Notes',
        'pso_render_notes_metabox',
        'ps_property',
        'side',
        'default'
    );
}

function pso_render_notes_metabox( WP_Post $post ): void {
    $notes_raw = get_post_meta( $post->ID, 'pso_notes', true );
    $notes     = json_decode( $notes_raw ?: '[]', true );
    ?>
    <input type="hidden" id="pso-note-post-id" value="<?php echo (int) $post->ID; ?>" />

    <?php if ( empty( $notes ) ) : ?>
        <p style="font-size:12px;color:#aaa;font-style:italic;">No notes yet.</p>
    <?php else : ?>
        <div id="pso-notes-log" class="pso-notes-log">
            <?php foreach ( $notes as $note ) : ?>
                <div class="pso-note-entry">
                    <div class="pso-note-meta">
                        <strong><?php echo esc_html( $note['user'] ?? 'Unknown' ); ?></strong>
                        &nbsp;·&nbsp;
                        <?php echo esc_html( $note['ts'] ?? '' ); ?>
                    </div>
                    <div class="pso-note-text"><?php echo esc_html( $note['text'] ?? '' ); ?></div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="pso-note-add">
        <textarea id="pso-new-note" placeholder="Type a note… (cannot be edited once saved)"></textarea>
        <button type="button" id="pso-add-note-btn" class="button">Add Note</button>
    </div>
    <p style="font-size:10px;color:#aaa;margin-top:6px;">Notes are permanent and cannot be edited or deleted.</p>
    <?php
}

// AJAX handler: append a note
add_action( 'wp_ajax_pso_add_note', 'pso_ajax_add_note' );

function pso_ajax_add_note(): void {
    if ( ! wp_verify_nonce( $_POST['_wpnonce'] ?? '', 'pso_ajax' ) ) {
        wp_send_json_error( 'Invalid nonce.' );
    }

    $post_id = (int)( $_POST['post_id'] ?? 0 );
    $text    = sanitize_textarea_field( $_POST['note'] ?? '' );

    if ( ! $post_id || ! $text ) {
        wp_send_json_error( 'Missing data.' );
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        wp_send_json_error( 'Permission denied.' );
    }

    $user    = wp_get_current_user();
    $ts      = current_time( 'mysql' );
    $ts_disp = date( 'M j, Y g:ia', strtotime( $ts ) );

    $notes_raw = get_post_meta( $post_id, 'pso_notes', true );
    $notes     = json_decode( $notes_raw ?: '[]', true );
    $notes[]   = [ 'ts' => $ts_disp, 'user' => $user->display_name, 'text' => $text ];

    update_post_meta( $post_id, 'pso_notes', wp_json_encode( $notes ) );

    wp_send_json_success( [ 'ts' => $ts_disp, 'user' => $user->display_name, 'text' => $text ] );
}

// ============================================================
// 4.  MONTHLY PERFORMANCE REPEATER + SUMMARY
// ============================================================

add_action( 'add_meta_boxes', 'pso_add_performance_metabox' );

function pso_add_performance_metabox(): void {
    add_meta_box(
        'pso_performance_box',
        '📊 Monthly Performance',
        'pso_render_performance_metabox',
        'ps_property',
        'normal',
        'default'
    );
}

function pso_render_performance_metabox( WP_Post $post ): void {
    wp_nonce_field( 'pso_save_perf', 'pso_perf_nonce' );
    $raw     = get_post_meta( $post->ID, 'pso_monthly_perf', true );
    $records = json_decode( $raw ?: '[]', true );
    if ( ! is_array( $records ) ) $records = [];

    // Compute summary from last 12 months
    $last12   = array_slice( $records, -12 );
    $tot_rev  = array_sum( array_column( $last12, 'revenue' ) );
    $avg_occ  = count($last12) ? array_sum( array_column( $last12, 'occ' ) ) / count($last12) : 0;
    $months   = count($last12);
    ?>

    <!-- Summary bar -->
    <div class="pso-perf-summary">
        <div class="pso-perf-stat">
            <div class="pv" id="pso-sum-revenue">$<?php echo number_format( $tot_rev ); ?></div>
            <div class="pk">Revenue (last <?php echo $months; ?> mo)</div>
        </div>
        <div class="pso-perf-stat">
            <div class="pv" id="pso-sum-occ"><?php echo number_format( $avg_occ, 1 ); ?>%</div>
            <div class="pk">Avg occupancy</div>
        </div>
        <div class="pso-perf-stat">
            <div class="pv" id="pso-sum-months"><?php echo $months; ?></div>
            <div class="pk">Months recorded</div>
        </div>
        <?php if ( $months >= 6 ) :
            $monthly_avg = $tot_rev / $months;
            $proj = $monthly_avg * 12;
        ?>
        <div class="pso-perf-stat">
            <div class="pv">$<?php echo number_format( $proj ); ?></div>
            <div class="pk">Projected annual</div>
        </div>
        <?php endif; ?>
    </div>

    <!-- Column headers -->
    <div class="pso-perf-head">
        <span>Month</span>
        <span>Revenue (USD)</span>
        <span>Occupancy (%)</span>
        <span>Avg Nightly</span>
        <span></span>
    </div>

    <!-- Rows -->
    <div id="pso-perf-rows">
        <?php foreach ( $records as $rec ) : ?>
        <div class="pso-perf-row">
            <input type="text" class="pf-month"   value="<?php echo esc_attr( $rec['month']   ?? '' ); ?>" placeholder="YYYY-MM" />
            <input type="number" class="pf-revenue" value="<?php echo esc_attr( $rec['revenue'] ?? 0  ); ?>" min="0" step="1" />
            <input type="number" class="pf-occ"     value="<?php echo esc_attr( $rec['occ']     ?? 0  ); ?>" min="0" max="100" step="0.1" />
            <input type="number" class="pf-nightly" value="<?php echo esc_attr( $rec['nightly'] ?? 0  ); ?>" min="0" step="1" />
            <button type="button" class="rm-perf" title="Remove">✕</button>
        </div>
        <?php endforeach; ?>
    </div>

    <input type="hidden" id="pso-monthly-perf-json" name="pso_monthly_perf" value="<?php echo esc_attr( $raw ?: '[]' ); ?>" />
    <button type="button" id="pso-add-perf" class="button" style="margin-top:10px;">+ Add Month</button>
    <p style="font-size:11px;color:#888;margin-top:8px;">Data is saved with the property. Summary updates live as you type.</p>
    <?php
}

add_action( 'save_post_ps_property', 'pso_save_performance_meta', 16, 2 );

function pso_save_performance_meta( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['pso_perf_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['pso_perf_nonce'], 'pso_save_perf' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;

    $raw  = sanitize_text_field( $_POST['pso_monthly_perf'] ?? '[]' );
    $data = json_decode( $raw, true );
    if ( ! is_array( $data ) ) return;

    $clean = [];
    foreach ( $data as $rec ) {
        $month = preg_match( '/^\d{4}-\d{2}$/', $rec['month'] ?? '' ) ? $rec['month'] : '';
        if ( ! $month ) continue;
        $clean[] = [
            'month'   => $month,
            'revenue' => max( 0, (float)( $rec['revenue'] ?? 0 ) ),
            'occ'     => max( 0, min( 100, (float)( $rec['occ'] ?? 0 ) ) ),
            'nightly' => max( 0, (float)( $rec['nightly'] ?? 0 ) ),
        ];
    }
    // Keep sorted by month ascending
    usort( $clean, fn( $a, $b ) => strcmp( $a['month'], $b['month'] ) );
    update_post_meta( $post_id, 'pso_monthly_perf', wp_json_encode( $clean ) );

    // Update ps_avg_occupancy and ps_monthly_income on the core meta for REST exposure
    $last12 = array_slice( $clean, -12 );
    if ( $last12 ) {
        $avg_occ = array_sum( array_column( $last12, 'occ' ) ) / count( $last12 );
        $avg_rev = array_sum( array_column( $last12, 'revenue' ) ) / count( $last12 );
        update_post_meta( $post_id, 'ps_avg_occupancy',  round( $avg_occ, 1 ) );
        update_post_meta( $post_id, 'ps_monthly_income', round( $avg_rev ) );
    }
}

// ============================================================
// 5.  LEAD ↔ PROPERTY LINKING
// ============================================================

// ── Metabox on ps_property: "Source Lead" ─────────────────
add_action( 'add_meta_boxes', 'pso_add_property_lead_metabox' );

function pso_add_property_lead_metabox(): void {
    add_meta_box(
        'pso_source_lead_box',
        '🔗 Source Lead',
        'pso_render_property_lead_metabox',
        'ps_property',
        'side',
        'default'
    );
}

function pso_render_property_lead_metabox( WP_Post $post ): void {
    wp_nonce_field( 'pso_save_link', 'pso_link_nonce' );
    $lead_id = (int) get_post_meta( $post->ID, 'pso_source_lead_id', true );

    echo '<p style="font-size:12px;color:#888;margin-bottom:10px;">The lead that originated this property submission.</p>';

    if ( $lead_id && get_post( $lead_id ) ) {
        $lead = get_post( $lead_id );
        echo '<a href="' . esc_url( admin_url( "post.php?post=$lead_id&action=edit" ) ) . '" class="pso-linked-badge">🔗 Lead: ' . esc_html( $lead->post_title ) . '</a>';
        echo '<br><br>';
    } else {
        echo '<p style="font-size:12px;color:#aaa;font-style:italic;margin-bottom:10px;">No source lead linked.</p>';
    }

    // Manual link field
    echo '<label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;">Link to Lead ID</label>';
    echo '<input type="number" name="pso_source_lead_id" value="' . esc_attr( $lead_id ?: '' ) . '" placeholder="Leave blank if none" min="1" style="width:100%;" />';
    echo '<p style="font-size:10px;color:#aaa;margin-top:4px;">Enter the Lead post ID to link this property to a lead.</p>';
}

// ── Metabox on ps_lead: "Converted Property" ──────────────
add_action( 'add_meta_boxes', 'pso_add_lead_property_metabox' );

function pso_add_lead_property_metabox(): void {
    add_meta_box(
        'pso_converted_property_box',
        '🏠 Converted Property',
        'pso_render_lead_property_metabox',
        'ps_lead',
        'side',
        'default'
    );
}

function pso_render_lead_property_metabox( WP_Post $post ): void {
    $prop_id = (int) get_post_meta( $post->ID, 'pso_converted_property_id', true );
    wp_nonce_field( 'pso_save_lead_link', 'pso_lead_link_nonce' );

    if ( $prop_id && get_post( $prop_id ) ) {
        $prop = get_post( $prop_id );
        echo '<a href="' . esc_url( admin_url( "post.php?post=$prop_id&action=edit" ) ) . '" class="pso-linked-badge">🏠 ' . esc_html( $prop->post_title ) . '</a>';
        echo '<br><br>';
    } else {
        echo '<p style="font-size:12px;color:#aaa;font-style:italic;margin-bottom:10px;">Not yet converted to a property.</p>';
    }

    echo '<label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;">Property Post ID</label>';
    echo '<input type="number" name="pso_converted_property_id" value="' . esc_attr( $prop_id ?: '' ) . '" placeholder="Leave blank if none" min="1" style="width:100%;" />';
}

// Save both sides of the link
add_action( 'save_post_ps_property', 'pso_save_property_lead_link', 17, 2 );
function pso_save_property_lead_link( int $post_id, WP_Post $post ): void {
    if ( ! isset( $_POST['pso_link_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['pso_link_nonce'], 'pso_save_link' ) ) return;
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) return;

    $lead_id = (int)( $_POST['pso_source_lead_id'] ?? 0 );
    update_post_meta( $post_id, 'pso_source_lead_id', $lead_id );

    // Mirror the reverse link on the lead
    if ( $lead_id && get_post( $lead_id ) ) {
        update_post_meta( $lead_id, 'pso_converted_property_id', $post_id );
        // Auto-update lead status to 'converted' when linked
        $current_status = get_post_meta( $lead_id, 'ps_lead_status', true );
        if ( ! in_array( $current_status, [ 'converted', 'closed_lost' ], true ) ) {
            update_post_meta( $lead_id, 'ps_lead_status', 'converted' );
        }
    }
}

add_action( 'save_post_ps_lead', 'pso_save_lead_property_link', 15, 2 );
function pso_save_lead_property_link( int $post_id ): void {
    if ( ! isset( $_POST['pso_lead_link_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['pso_lead_link_nonce'], 'pso_save_lead_link' ) ) return;

    $prop_id = (int)( $_POST['pso_converted_property_id'] ?? 0 );
    update_post_meta( $post_id, 'pso_converted_property_id', $prop_id );

    if ( $prop_id ) {
        update_post_meta( $post_id, 'ps_lead_status', 'converted' );
        update_post_meta( $prop_id, 'pso_source_lead_id', $post_id );
    }
}

// Auto-link when property submission endpoint creates a property
add_action( 'pso_property_created_from_lead', 'pso_auto_link_lead', 10, 2 );
function pso_auto_link_lead( int $prop_id, int $lead_id ): void {
    update_post_meta( $prop_id, 'pso_source_lead_id',          $lead_id );
    update_post_meta( $lead_id, 'pso_converted_property_id',   $prop_id );
}

// ============================================================
// 6.  LEAD EXTENDED — assigned manager + 'converted' status
//     + admin filters for both
// ============================================================

// Extend lead columns to show assigned manager
add_filter( 'manage_ps_lead_posts_columns', 'pso_extend_lead_columns', 20 );
function pso_extend_lead_columns( array $cols ): array {
    // Insert 'Manager' and 'Property' columns before 'date'
    $new = [];
    foreach ( $cols as $k => $v ) {
        $new[$k] = $v;
        if ( $k === 'ps_lead_status' ) {
            $new['pso_lead_manager']  = 'Manager';
            $new['pso_lead_property'] = 'Property';
        }
    }
    return $new;
}

add_action( 'manage_ps_lead_posts_custom_column', 'pso_lead_extended_column_content', 10, 2 );
function pso_lead_extended_column_content( string $column, int $post_id ): void {
    if ( $column === 'pso_lead_manager' ) {
        $uid = (int) get_post_meta( $post_id, 'pso_assigned_manager_id', true );
        if ( $uid ) {
            $u = get_userdata( $uid );
            echo $u ? esc_html( $u->display_name ) : "User #$uid";
        } else {
            echo '<span style="color:#aaa">Unassigned</span>';
        }
    } elseif ( $column === 'pso_lead_property' ) {
        $pid = (int) get_post_meta( $post_id, 'pso_converted_property_id', true );
        if ( $pid && get_post( $pid ) ) {
            echo '<a href="' . esc_url( admin_url( "post.php?post=$pid&action=edit" ) ) . '" style="color:#186870;font-size:12px;">' . esc_html( get_the_title( $pid ) ) . '</a>';
        } else {
            echo '—';
        }
    }
}

// Assigned manager selector in the lead publish box
add_action( 'post_submitbox_misc_actions', 'pso_lead_manager_selector', 5 );
function pso_lead_manager_selector(): void {
    global $post;
    if ( ! $post || $post->post_type !== 'ps_lead' ) return;

    $current_mgr = (int) get_post_meta( $post->ID, 'pso_assigned_manager_id', true );
    $managers    = get_users( [ 'role__in' => [ 'ps_manager', 'administrator' ] ] );

    echo '<div style="padding:6px 10px;border-bottom:1px solid #eee;">';
    echo '<label style="font-size:12px;font-weight:600;">Assigned Manager<br/>';
    echo '<select name="pso_assigned_manager_id" style="margin-top:4px;width:100%;">';
    echo '<option value="">— Unassigned —</option>';
    foreach ( $managers as $m ) {
        echo '<option value="' . $m->ID . '"' . selected( $current_mgr, $m->ID, false ) . '>' . esc_html( $m->display_name ) . '</option>';
    }
    echo '</select></label></div>';
}

add_action( 'save_post_ps_lead', 'pso_save_lead_manager', 16 );
function pso_save_lead_manager( int $post_id ): void {
    if ( isset( $_POST['pso_assigned_manager_id'] ) ) {
        update_post_meta( $post_id, 'pso_assigned_manager_id', (int) $_POST['pso_assigned_manager_id'] );
    }
}

// Lead list filters — status and manager
add_action( 'restrict_manage_posts', 'pso_lead_list_filters' );
function pso_lead_list_filters(): void {
    $screen = get_current_screen();
    if ( $screen->post_type !== 'ps_lead' ) return;

    // Status filter — includes 'converted'
    $sel_status = sanitize_key( $_GET['pso_lead_status'] ?? '' );
    $statuses   = [ '' => 'All Statuses', 'new' => 'New', 'contacted' => 'Contacted', 'qualified' => 'Qualified', 'converted' => 'Converted', 'closed_won' => 'Closed – Won', 'closed_lost' => 'Closed – Lost' ];
    echo '<select name="pso_lead_status"><option value="">All Statuses</option>';
    foreach ( $statuses as $v => $l ) {
        if ( ! $v ) continue;
        echo '<option value="' . esc_attr($v) . '"' . selected( $sel_status, $v, false ) . '>' . esc_html($l) . '</option>';
    }
    echo '</select>&nbsp;';

    // Manager filter
    $sel_mgr  = (int)( $_GET['pso_lead_manager'] ?? 0 );
    $managers = get_users( [ 'role__in' => [ 'ps_manager', 'administrator' ] ] );
    echo '<select name="pso_lead_manager"><option value="">All Managers</option>';
    foreach ( $managers as $m ) {
        echo '<option value="' . $m->ID . '"' . selected( $sel_mgr, $m->ID, false ) . '>' . esc_html( $m->display_name ) . '</option>';
    }
    echo '</select>';
}

add_filter( 'parse_query', 'pso_apply_lead_filters' );
function pso_apply_lead_filters( WP_Query $query ): void {
    if ( ! is_admin() || ! $query->is_main_query() ) return;
    if ( $query->get( 'post_type' ) !== 'ps_lead' ) return;

    $mq = (array)( $query->get( 'meta_query' ) ?: [] );

    if ( ! empty( $_GET['pso_lead_status'] ) ) {
        $mq[] = [ 'key' => 'ps_lead_status', 'value' => sanitize_key( $_GET['pso_lead_status'] ) ];
    }
    if ( ! empty( $_GET['pso_lead_manager'] ) ) {
        $mq[] = [ 'key' => 'pso_assigned_manager_id', 'value' => (int) $_GET['pso_lead_manager'] ];
    }

    if ( count( $mq ) > 1 ) { $mq['relation'] = 'AND'; }
    if ( count( $mq ) >= 1 ) { $query->set( 'meta_query', $mq ); }
}

// ============================================================
// 7.  QUICK ADD PROPERTY — AJAX + admin bar button
// ============================================================

// Register AJAX action
add_action( 'wp_ajax_pso_quick_add', 'pso_ajax_quick_add' );

function pso_ajax_quick_add(): void {
    if ( ! wp_verify_nonce( $_POST['_wpnonce'] ?? '', 'pso_ajax' ) ) {
        wp_send_json_error( 'Invalid nonce.' );
    }
    if ( ! current_user_can( 'edit_ps_properties' ) ) {
        wp_send_json_error( 'Permission denied.' );
    }

    $title   = sanitize_text_field( $_POST['title']       ?? '' );
    $city    = sanitize_key( $_POST['city']               ?? '' );
    $nightly = (float)( $_POST['nightly_rate']            ?? 0 );
    $email   = sanitize_email( $_POST['owner_email']      ?? '' );

    if ( ! $title || ! $city || ! $nightly ) {
        wp_send_json_error( 'Title, city, and nightly rate are required.' );
    }

    // Resolve owner
    $owner_id = 0;
    if ( $email ) {
        $user = get_user_by( 'email', $email );
        if ( $user ) {
            $owner_id = $user->ID;
        } else {
            $uid = wp_create_user( $email, wp_generate_password(), $email );
            if ( ! is_wp_error( $uid ) ) {
                $u = new WP_User( $uid );
                $u->set_role( 'ps_owner' );
                $owner_id = $uid;
            }
        }
    }

    $post_id = wp_insert_post( [
        'post_type'   => 'ps_property',
        'post_title'  => $title,
        'post_status' => 'draft',
        'post_author' => $owner_id ?: get_current_user_id(),
    ] );

    if ( is_wp_error( $post_id ) ) {
        wp_send_json_error( 'Could not create property.' );
    }

    update_post_meta( $post_id, 'ps_city',          $city );
    update_post_meta( $post_id, 'ps_nightly_rate',  $nightly );
    update_post_meta( $post_id, 'ps_listing_status','draft' );
    if ( $owner_id ) update_post_meta( $post_id, 'ps_owner_id', $owner_id );

    wp_set_post_terms( $post_id, [ $city ], 'ps_city_tag' );

    wp_send_json_success( [
        'post_id'  => $post_id,
        'edit_url' => admin_url( "post.php?post=$post_id&action=edit" ),
    ] );
}

// Add "Quick Add Property" button to the Properties list page
add_action( 'admin_footer-edit.php', 'pso_quick_add_button' );
function pso_quick_add_button(): void {
    $screen = get_current_screen();
    if ( $screen->post_type !== 'ps_property' ) return;
    ?>
    <script>
    jQuery(function($) {
        // Inject button next to "Add New"
        var btn = '<a href="#" id="pso-quick-add-btn" class="page-title-action" style="background:#c8a44a;color:#0a2b2f;border-color:#c8a44a;">⚡ Quick Add</a>';
        $('.wrap .wp-heading-inline').after(btn);
    });
    </script>
    <?php
}

// ============================================================
// 8.  DASHBOARD WIDGET
// ============================================================

add_action( 'wp_dashboard_setup', 'pso_register_dashboard_widget' );

function pso_register_dashboard_widget(): void {
    wp_add_dashboard_widget(
        'pso_overview_widget',
        '🏡 PlayaStays — Operations Overview',
        'pso_render_dashboard_widget'
    );
}

function pso_render_dashboard_widget(): void {
    // ── Active properties ────────────────────────────────
    $active_count = (int) ( new WP_Query( [
        'post_type'      => 'ps_property',
        'post_status'    => 'publish',
        'meta_query'     => [ [ 'key' => 'ps_listing_status', 'value' => 'active' ] ],
        'fields'         => 'ids',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
    ] ) )->post_count;

    // ── Pending properties ───────────────────────────────
    $pending_count = (int) ( new WP_Query( [
        'post_type'      => 'ps_property',
        'post_status'    => [ 'pending', 'draft' ],
        'fields'         => 'ids',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
    ] ) )->post_count;

    // ── New leads (last 7 days) ───────────────────────────
    $new_leads = (int) ( new WP_Query( [
        'post_type'      => 'ps_lead',
        'post_status'    => 'publish',
        'date_query'     => [ [ 'after' => '7 days ago', 'inclusive' => true ] ],
        'fields'         => 'ids',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
    ] ) )->post_count;

    // ── Converted leads ───────────────────────────────────
    $converted_leads = (int) ( new WP_Query( [
        'post_type'      => 'ps_lead',
        'post_status'    => 'publish',
        'meta_query'     => [ [ 'key' => 'ps_lead_status', 'value' => 'converted' ] ],
        'fields'         => 'ids',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
    ] ) )->post_count;

    // ── All leads ─────────────────────────────────────────
    $total_leads = (int) ( new WP_Query( [
        'post_type'      => 'ps_lead',
        'post_status'    => 'publish',
        'fields'         => 'ids',
        'posts_per_page' => -1,
        'no_found_rows'  => true,
    ] ) )->post_count;

    // ── Estimated monthly revenue ─────────────────────────
    // Sum ps_monthly_income from all active properties
    global $wpdb;
    $est_revenue = (float) $wpdb->get_var(
        "SELECT SUM(CAST(meta_value AS DECIMAL(10,2)))
         FROM {$wpdb->postmeta} pm
         INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
         WHERE pm.meta_key = 'ps_monthly_income'
           AND p.post_status = 'publish'
           AND p.post_type = 'ps_property'"
    );

    // ── Unassigned leads ─────────────────────────────────
    $unassigned = (int) $wpdb->get_var(
        "SELECT COUNT(DISTINCT p.ID)
         FROM {$wpdb->posts} p
         WHERE p.post_type = 'ps_lead'
           AND p.post_status = 'publish'
           AND p.ID NOT IN (
               SELECT post_id FROM {$wpdb->postmeta}
               WHERE meta_key = 'pso_assigned_manager_id' AND meta_value != '0' AND meta_value != ''
           )"
    );

    $conv_rate = $total_leads > 0 ? round( $converted_leads / $total_leads * 100 ) : 0;
    ?>
    <div class="pso-dash-grid">
        <div class="pso-dash-stat">
            <div class="ds-val"><?php echo esc_html( $active_count ); ?></div>
            <div class="ds-key">Active Properties</div>
        </div>
        <div class="pso-dash-stat <?php echo $pending_count > 0 ? 'warn' : ''; ?>">
            <div class="ds-val"><?php echo esc_html( $pending_count ); ?></div>
            <div class="ds-key">Pending Review</div>
        </div>
        <div class="pso-dash-stat">
            <div class="ds-val">$<?php echo number_format( $est_revenue ); ?></div>
            <div class="ds-key">Est. Monthly Revenue</div>
        </div>
        <div class="pso-dash-stat <?php echo $new_leads > 0 ? 'warn' : ''; ?>">
            <div class="ds-val"><?php echo esc_html( $new_leads ); ?></div>
            <div class="ds-key">New Leads (7 days)</div>
        </div>
        <div class="pso-dash-stat">
            <div class="ds-val"><?php echo esc_html( $converted_leads ); ?></div>
            <div class="ds-key">Converted Leads</div>
        </div>
        <div class="pso-dash-stat">
            <div class="ds-val"><?php echo esc_html( $conv_rate ); ?>%</div>
            <div class="ds-key">Lead Conversion Rate</div>
        </div>
        <?php if ( $unassigned > 0 ) : ?>
        <div class="pso-dash-stat alert" style="grid-column:1/-1;">
            <div class="ds-val">⚠️ <?php echo esc_html( $unassigned ); ?></div>
            <div class="ds-key">Unassigned leads — assign a manager</div>
        </div>
        <?php endif; ?>
    </div>

    <div class="pso-dash-actions">
        <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=ps_property' ) ); ?>" class="button">
            🏠 All Properties
        </a>
        <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=ps_lead' ) ); ?>" class="button">
            📬 All Leads
        </a>
        <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=ps_lead&pso_lead_status=new' ) ); ?>" class="button button-primary">
            🔔 Review New Leads
        </a>
        <?php if ( $pending_count > 0 ) : ?>
        <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=ps_property&post_status=pending' ) ); ?>" class="button" style="background:#c8a44a;color:#0a2b2f;border-color:#c8a44a;">
            ⏳ Review Pending (<?php echo $pending_count; ?>)
        </a>
        <?php endif; ?>
    </div>

    <p style="font-size:11px;color:#aaa;margin-top:12px;margin-bottom:0;">
        Revenue estimate based on ps_monthly_income values across all published properties.
        Updated each time a property is saved.
    </p>
    <?php
}

// ============================================================
// Property completeness — listing quality / readiness scoring
//
// Computes a structured readiness report for any property,
// identifying which fields are populated vs missing.
//
// Used by:
//  • future admin dashboard "properties missing data" module
//  • future property-entry validation
//  • potential listing quality badges on public pages
//
// Does NOT import from @/types to avoid circular deps —
// uses a minimal interface for the property shape it needs.
// ============================================================

interface CompleteMeta {
  ps_city: string
  ps_neighborhood?: string
  ps_property_type?: string
  ps_listing_type?: string
  ps_bedrooms: number
  ps_bathrooms: number
  ps_guests: number
  ps_beds?: number
  ps_sqm?: number
  ps_nightly_rate: number
  ps_monthly_rate?: number
  ps_sale_price?: number
  ps_cleaning_fee?: number
  ps_managed_by_ps: boolean
  ps_avg_rating: number
  ps_review_count: number
  ps_listing_status?: string
  ps_lat?: number
  ps_lng?: number
  ps_map_display_mode?: string
  ps_airbnb_url?: string
  ps_vrbo_url?: string
  ps_booking_url?: string
  ps_direct_url?: string
  ps_booking_mode?: string
  ps_availability_json?: string
  ps_next_available_date?: string
  ps_amenity_keys?: string
  ps_check_in_time?: string
  ps_check_out_time?: string
  ps_house_rules?: string
  ps_owner_id?: number
  ps_manager_id?: number
  ps_building_name?: string
  ps_ops_status?: string
  ps_seo_title?: string
  ps_seo_desc?: string
  ps_title_es?: string
  ps_content_es?: string
}

interface CompleteComputed {
  featured_image?: { url: string }
  gallery: Array<{ url: string }>
  amenities: string[]
  booking_links: {
    airbnb?: string
    vrbo?: string
    booking?: string
    direct?: string
  }
}

interface CompleteProperty {
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  meta: CompleteMeta
  ps_computed: CompleteComputed
}

// ── Field categories ──────────────────────────────────────

export type FieldCategory =
  | 'identity'
  | 'location'
  | 'specs'
  | 'pricing'
  | 'media'
  | 'amenities'
  | 'booking'
  | 'availability'
  | 'guest_info'
  | 'operations'
  | 'seo'

export interface FieldCheck {
  key: string
  label: string
  category: FieldCategory
  required: boolean
  present: boolean
}

export interface CompletenessReport {
  /** 0–100 overall score */
  score: number
  /** Number of required fields that are missing */
  requiredMissing: number
  /** Number of optional fields that are missing */
  optionalMissing: number
  /** Total fields checked */
  totalChecked: number
  /** Detailed per-field results */
  fields: FieldCheck[]
  /** Human-readable tier: complete | good | needs-work | incomplete */
  tier: 'complete' | 'good' | 'needs-work' | 'incomplete'
}

function hasStr(v: unknown): boolean {
  return typeof v === 'string' && v.trim().length > 0
}

function hasNum(v: unknown, minExclusive = 0): boolean {
  return typeof v === 'number' && v > minExclusive
}

function hasContent(html: string): boolean {
  const text = html.replace(/<[^>]*>/g, '').trim()
  return text.length > 30
}

export function getPropertyCompleteness(p: CompleteProperty): CompletenessReport {
  const m = p.meta
  const c = p.ps_computed

  const isRental = m.ps_listing_type !== 'sale'
  const isSale = m.ps_listing_type === 'sale' || m.ps_listing_type === 'both'

  const fields: FieldCheck[] = [
    // Identity
    { key: 'title',          label: 'Title',                category: 'identity', required: true,  present: hasStr(p.title.rendered) },
    { key: 'description',    label: 'Description',          category: 'identity', required: true,  present: hasContent(p.content.rendered) },
    { key: 'excerpt',        label: 'Short excerpt',        category: 'identity', required: false, present: hasContent(p.excerpt.rendered) },
    { key: 'listing_type',   label: 'Listing type',         category: 'identity', required: true,  present: hasStr(m.ps_listing_type) },
    { key: 'property_type',  label: 'Property type',        category: 'identity', required: true,  present: hasStr(m.ps_property_type) },
    { key: 'listing_status', label: 'Listing status',       category: 'identity', required: false, present: hasStr(m.ps_listing_status) },

    // Location
    { key: 'city',           label: 'City',                 category: 'location', required: true,  present: hasStr(m.ps_city) },
    { key: 'neighborhood',   label: 'Neighborhood',         category: 'location', required: false, present: hasStr(m.ps_neighborhood) },
    { key: 'lat_lng',        label: 'GPS coordinates',      category: 'location', required: false, present: hasNum(m.ps_lat) && hasNum(m.ps_lng) },
    { key: 'map_mode',       label: 'Map display mode',     category: 'location', required: false, present: hasStr(m.ps_map_display_mode) },

    // Specs
    { key: 'bedrooms',       label: 'Bedrooms',             category: 'specs',    required: true,  present: typeof m.ps_bedrooms === 'number' },
    { key: 'bathrooms',      label: 'Bathrooms',            category: 'specs',    required: true,  present: hasNum(m.ps_bathrooms, -1) },
    { key: 'guests',         label: 'Guests / sleeps',      category: 'specs',    required: true,  present: hasNum(m.ps_guests, 0) },
    { key: 'beds',           label: 'Bed count',            category: 'specs',    required: false, present: hasNum(m.ps_beds, 0) },
    { key: 'sqm',            label: 'Square meters',        category: 'specs',    required: false, present: hasNum(m.ps_sqm, 0) },

    // Pricing
    ...(isRental ? [
      { key: 'nightly_rate',   label: 'Nightly rate',       category: 'pricing' as FieldCategory, required: true,  present: hasNum(m.ps_nightly_rate, 0) },
      { key: 'monthly_rate',   label: 'Monthly rate',       category: 'pricing' as FieldCategory, required: false, present: hasNum(m.ps_monthly_rate, 0) },
      { key: 'cleaning_fee',   label: 'Cleaning fee',       category: 'pricing' as FieldCategory, required: false, present: hasNum(m.ps_cleaning_fee, 0) },
    ] : []),
    ...(isSale ? [
      { key: 'sale_price',     label: 'Sale price',         category: 'pricing' as FieldCategory, required: true,  present: hasNum(m.ps_sale_price, 0) },
    ] : []),

    // Media
    { key: 'featured_image', label: 'Featured image',       category: 'media',    required: true,  present: hasStr(c.featured_image?.url) },
    { key: 'gallery',        label: 'Gallery (2+ photos)',  category: 'media',    required: true,  present: c.gallery.length >= 2 },
    { key: 'gallery_5',      label: 'Gallery (5+ photos)',  category: 'media',    required: false, present: c.gallery.length >= 5 },

    // Amenities
    { key: 'amenities_blob', label: 'Amenities text list',  category: 'amenities', required: false, present: c.amenities.length > 0 },
    { key: 'amenity_keys',   label: 'Structured amenities', category: 'amenities', required: false, present: hasStr(m.ps_amenity_keys) && JSON.parse(m.ps_amenity_keys || '[]').length > 0 },

    // Booking
    { key: 'booking_link',   label: 'At least one booking link', category: 'booking', required: false, present: !!(c.booking_links.airbnb || c.booking_links.vrbo || c.booking_links.booking || c.booking_links.direct) },
    { key: 'booking_mode',   label: 'Booking mode',              category: 'booking', required: false, present: hasStr(m.ps_booking_mode) },

    // Availability
    { key: 'availability',   label: 'Availability data',         category: 'availability', required: false, present: hasStr(m.ps_availability_json) },
    { key: 'next_available', label: 'Next available date',       category: 'availability', required: false, present: hasStr(m.ps_next_available_date) },

    // Guest info
    { key: 'check_in_time',  label: 'Check-in time',        category: 'guest_info', required: false, present: hasStr(m.ps_check_in_time) },
    { key: 'check_out_time', label: 'Check-out time',       category: 'guest_info', required: false, present: hasStr(m.ps_check_out_time) },
    { key: 'house_rules',    label: 'House rules',          category: 'guest_info', required: false, present: hasStr(m.ps_house_rules) },

    // Operations
    { key: 'managed',        label: 'Managed by PlayaStays',category: 'operations', required: false, present: m.ps_managed_by_ps === true },
    { key: 'owner_id',       label: 'Owner assigned',       category: 'operations', required: false, present: hasNum(m.ps_owner_id, 0) },
    { key: 'manager_id',     label: 'Manager assigned',     category: 'operations', required: false, present: hasNum(m.ps_manager_id, 0) },
    { key: 'ops_status',     label: 'Operations status',    category: 'operations', required: false, present: hasStr(m.ps_ops_status) },

    // SEO
    { key: 'seo_title',      label: 'SEO title',            category: 'seo', required: false, present: hasStr(m.ps_seo_title) },
    { key: 'seo_desc',       label: 'SEO description',      category: 'seo', required: false, present: hasStr(m.ps_seo_desc) },
    { key: 'title_es',       label: 'Spanish title',        category: 'seo', required: false, present: hasStr(m.ps_title_es) },
    { key: 'content_es',     label: 'Spanish content',      category: 'seo', required: false, present: hasStr(m.ps_content_es) },
  ]

  const requiredFields = fields.filter(f => f.required)
  const optionalFields = fields.filter(f => !f.required)

  const requiredPresent = requiredFields.filter(f => f.present).length
  const optionalPresent = optionalFields.filter(f => f.present).length

  const requiredWeight = 0.7
  const optionalWeight = 0.3

  const requiredScore = requiredFields.length > 0
    ? (requiredPresent / requiredFields.length) * requiredWeight * 100
    : requiredWeight * 100
  const optionalScore = optionalFields.length > 0
    ? (optionalPresent / optionalFields.length) * optionalWeight * 100
    : optionalWeight * 100

  const score = Math.round(requiredScore + optionalScore)

  let tier: CompletenessReport['tier']
  if (score >= 90) tier = 'complete'
  else if (score >= 70) tier = 'good'
  else if (score >= 45) tier = 'needs-work'
  else tier = 'incomplete'

  return {
    score,
    requiredMissing: requiredFields.length - requiredPresent,
    optionalMissing: optionalFields.length - optionalPresent,
    totalChecked: fields.length,
    fields,
    tier,
  }
}

/** Summarize missing fields by category for admin display */
export function getMissingByCategory(report: CompletenessReport): Record<FieldCategory, string[]> {
  const result: Record<string, string[]> = {}
  for (const f of report.fields) {
    if (f.present) continue
    if (!result[f.category]) result[f.category] = []
    result[f.category].push(f.label)
  }
  return result as Record<FieldCategory, string[]>
}

// ============================================================
// PlayaStays — shared app types (single barrel: `@/types`)
//
// WordPress REST entity shapes, UI primitives, SEO helpers, forms.
// Keep aligned with `lib/wordpress.ts` and `lib/seo.ts`.
// ============================================================

// ── App & i18n ────────────────────────────────────────────

/** Supported site locales (re-exported from `@/lib/i18n` for convenience) */
export type Locale = 'en' | 'es'

/** Optional locale on templates / cards */
export type WithLocale<P = object> = P & { locale?: Locale }

// ── SEO / metadata (Next `generateMetadata` / `buildMetadata` inputs) ──

/** Common `ps_*` SEO fields on CMS entities */
export interface EntitySeoFields {
  ps_seo_title?: string
  ps_seo_desc?: string
}

/** Options passed to `buildMetadata()` in `lib/seo.ts` */
export interface SeoMetadataInput {
  title: string
  description: string
  canonical: string
  hreflangEs?: string
  hreflangEn?: string
  noindex?: boolean
  ogImage?: string
}

// ── Navigation / layout ───────────────────────────────────

export interface BreadcrumbItem {
  label: string
  href?: string | null
}

// ── Forms & API payloads ──────────────────────────────────

/** Lead form body: `/api/lead` POST + WP `submit-lead` */
export interface LeadFormData {
  first_name: string
  email: string
  phone?: string
  property_type?: string
  current_status?: string
  city?: string
  source?: string
}

/** Alias — same shape as `LeadFormData` */
export type LeadPayload = LeadFormData

/**
 * Full payload after `/api/lead` merges client metadata + server fields.
 * HubSpot + WordPress receive this shape (HubSpot maps fields in `hubspot-leads.ts`).
 * Future ops sync hook: `lib/integrations/lead-handoff.ts`.
 */
export interface LeadSubmissionPayload extends LeadFormData {
  locale?: string
  page_url?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  /** ISO timestamp — set by API route */
  submitted_at?: string
  source_ip?: string
  user_agent?: string
}

// ── Pricing UI (PricingGrid + pricing-data) ───────────────

export interface PricingPlan {
  tier: string
  name: string
  unit?: string
  desc: string
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
  badge?: string
  /**
   * Universal pricing hub: Property Care (monthly) + commission block.
   * When true, `PricingGrid` renders `propertyCare*`, `commission*`, and `audience` instead of legacy `name`+`unit` as the only price.
   */
  hubFeeLayout?: boolean
  /** Muted one-line audience under tier name. */
  audience?: string
  /** Primary price line, e.g. "$125/mo" or "Custom" */
  propertyCareAmount?: string
  /** Subline under primary, e.g. "Property Care included" */
  propertyCareIncludedLabel?: string
  /** Shown before commission amount, usually "+" */
  commissionPrefix?: string
  /** Hub: primary BIG value — revenue % (10%, 15%) or "Custom" on Pro */
  commissionAmount?: string
  /** Hub: one line under the primary % (or under "Custom" on Pro) */
  commissionLabel?: string
  /** Hub: secondary line, e.g. "+ $125/mo Property Care" */
  propertyCareAddOnLine?: string
}

// ── WordPress REST primitives ─────────────────────────────

/** Standard WP `title` / `excerpt` / `content` fields */
export interface WpRendered {
  rendered: string
}

export interface WpMediaSize {
  /** WP attachment ID — present in ps_computed REST responses */
  id?: number
  url: string
  alt?: string
}

/** Trust bar / hero / site config stat line */
export interface Stat {
  /** Display value — may come from CMS as string or number */
  val: string | number
  key: string
}

export interface CtaLink {
  label: string
  href: string
}

export interface Neighborhood {
  name: string
  desc: string
  /** Future deep link: /[city]/[neighborhood-slug]/ — optional until neighborhood pages exist */
  slug?: string
}

// ── Cities ─────────────────────────────────────────────────

export interface CityMeta extends EntitySeoFields {
  ps_title_es?: string
  ps_excerpt_es?: string
  ps_market_note?: string
  ps_market_note_es?: string
  ps_best_for?: string
  ps_peak_season?: string
  ps_avg_occupancy?: string
  ps_avg_nightly?: string
  ps_avg_monthly_income?: string
  ps_state?: string
  [key: string]: unknown
}

export interface CityComputed {
  stats: Stat[]
  neighborhoods: Neighborhood[]
}

export interface City {
  id: number
  slug: string
  title: WpRendered
  excerpt: WpRendered
  content: WpRendered
  meta: CityMeta
  ps_computed: CityComputed
}

// ── Services ──────────────────────────────────────────────

export interface ServiceMeta extends EntitySeoFields {
  ps_service_slug: string
  ps_seo_title_es?: string
  ps_hero_headline?: string
  ps_hero_subheadline?: string
  ps_hero_headline_es?: string
  ps_hero_subheadline_es?: string
  ps_content_es?: string
  ps_cta_primary_text?: string
  ps_cta_primary_url?: string
  [key: string]: unknown
}

export interface ServiceStep {
  title: string
  desc: string
}

export interface ServiceComputed {
  stats: Stat[]
  steps: ServiceStep[]
}

export interface Service {
  id: number
  title: WpRendered
  excerpt: WpRendered
  content: WpRendered
  meta: ServiceMeta
  ps_computed: ServiceComputed
}

// ── Properties ────────────────────────────────────────────

export interface PropertyMeta extends EntitySeoFields {
  // ── Identity / bilingual ────────────────────────────────
  ps_title_es?: string
  ps_excerpt_es?: string
  ps_content_es?: string

  // ── Location ────────────────────────────────────────────
  ps_city: string
  ps_neighborhood?: string
  ps_state?: string
  ps_country?: string
  ps_address_line_1?: string
  ps_address_line_2?: string
  ps_postal_code?: string
  ps_lat?: number
  ps_lng?: number
  /** exact | approximate | hidden — legacy map display hint */
  ps_map_display_mode?: 'exact' | 'approximate' | 'hidden'
  /**
   * Listing map embed policy: public condo/development vs private residence.
   * Unknown/missing → treated as private (approximate) on the public site.
   */
  ps_location_type?: 'public_building' | 'private_address' | string
  /** Free-text query for Embed API when no `ps_google_place_id`. */
  ps_map_query?: string
  /** Google Place ID for public building embeds (preferred when set). */
  ps_google_place_id?: string
  /** Approximate center for private listings (view-mode embed). */
  ps_approximate_lat?: number
  ps_approximate_lng?: number
  /** Broader area label (e.g. region) when neighborhood is insufficient. */
  ps_service_area?: string

  // ── Specs ───────────────────────────────────────────────
  /** CMS: condo | villa | penthouse | studio | … — used for browse type filter */
  ps_property_type?: string
  ps_bedrooms: number
  ps_bathrooms: number
  ps_guests: number
  /** Actual bed count (distinct from bedrooms) */
  ps_beds?: number
  /** Square meters — present in CMS, not yet surfaced on frontend */
  ps_sqm?: number
  /** Building floor / level (condos, penthouses) */
  ps_floor?: number

  // ── Listing & status ────────────────────────────────────
  /**
   * rent = short-term / vacation listing; sale = purchase; both = shown in either mode when filtered.
   * If absent, inferred from ps_nightly_rate / ps_sale_price in browse helpers.
   */
  ps_listing_type?: 'rent' | 'sale' | 'both'
  /**
   * How the rental is positioned: vacation (short-term), long-term, or hybrid.
   * Separate from ps_listing_type; not used in URL paths.
   */
  ps_rental_strategy?: 'vacation_rental' | 'long_term' | 'hybrid' | string
  ps_listing_status?: string
  ps_managed_by_ps: boolean
  ps_featured?: boolean

  // ── Pricing ─────────────────────────────────────────────
  ps_nightly_rate: number
  ps_monthly_rate?: number
  /** Listing price in USD when for-sale inventory is enabled in CMS */
  ps_sale_price?: number
  ps_cleaning_fee?: number
  ps_currency?: string
  ps_min_stay_nights?: number

  // ── Performance / reviews ───────────────────────────────
  ps_avg_rating: number
  ps_review_count: number
  ps_monthly_income: number
  ps_avg_occupancy: number

  // ── Booking ─────────────────────────────────────────────
  ps_airbnb_url?: string
  ps_vrbo_url?: string
  ps_booking_url?: string
  ps_direct_url?: string
  /** instant | inquiry | external — how guests confirm dates */
  ps_booking_mode?: string

  // ── Availability / calendar ─────────────────────────────
  /**
   * JSON: see AvailabilityJsonPayload — blocked/booked spans for rental calendar.
   * Owner/admin/PMS sync can populate; headless parses in lib/availability.ts
   */
  ps_availability_json?: string
  /** ISO date — optional quick display before full calendar JSON exists */
  ps_next_available_date?: string

  // ── Structured amenities ────────────────────────────────
  /**
   * JSON array of canonical kebab-case keys from `lib/amenity-taxonomy.ts`
   * (`AMENITY_CATEGORIES`). When populated, keys are merged with regex matches
   * on the amenities text blob. Snake_case entries are normalized to kebab-case.
   * Example: `["wifi","pool","air-conditioning","balcony","beachfront"]`
   */
  ps_amenity_keys?: string

  // ── Guest-facing details ────────────────────────────────
  ps_check_in_time?: string
  ps_check_out_time?: string
  /** JSON or plain text — house rules for guests */
  ps_house_rules?: string
  ps_house_rules_es?: string

  // ── Owner / operations ──────────────────────────────────
  /** WP user ID of the property owner */
  ps_owner_id?: number
  /** Assigned property manager WP user ID */
  ps_manager_id?: number
  /** HOA or building/development name */
  ps_building_name?: string
  /** Private notes visible only to admin/managers — never exposed to REST public */
  ps_internal_notes?: string
  /** JSON array: operational activity log (append-only notes), admin-only */
  ps_ops_activity_log?: string
  /** JSON array: lightweight ops issues / maintenance tracker, admin-only */
  ps_ops_issues?: string
  /** active | needs-attention | maintenance | onboarding | inactive */
  ps_ops_status?: string
  /** ISO date — last time property was inspected or physically checked */
  ps_last_inspection_date?: string
}

export interface PropertyComputed {
  featured_image?: WpMediaSize
  gallery: WpMediaSize[]
  amenities: string[]
  booking_links: {
    airbnb?: string
    vrbo?: string
    booking?: string
    direct?: string
  }
  /** Owner display info resolved from ps_owner_id */
  owner?: {
    id: number
    display_name: string
  }
  /** Manager display info resolved from ps_manager_id */
  manager?: {
    id: number
    display_name: string
  }
  /**
   * Optional REST-computed mirror of parsed availability (if plugin adds it).
   * App primarily derives calendar from meta via getPropertyAvailabilitySummary().
   */
  availability?: import('./availability').PropertyAvailabilitySummary
}

export interface Property {
  id: number
  slug: string
  /** WordPress `post_modified` when REST returns it — used for sitemap lastmod. */
  modified?: string
  title: WpRendered
  excerpt: WpRendered
  content: WpRendered
  meta: PropertyMeta
  ps_computed: PropertyComputed
}

// ── FAQs & testimonials ─────────────────────────────────────

export interface FAQMeta {
  ps_answer: string
  ps_question_es?: string
  ps_answer_es?: string
  [key: string]: unknown
}

export interface FAQ {
  id: number
  title: WpRendered
  meta: FAQMeta
}

export interface TestimonialMeta {
  ps_rating?: number
  ps_author_name: string
  ps_author_initials?: string
  ps_author_role?: string
  [key: string]: unknown
}

export interface Testimonial {
  id: number
  content: WpRendered
  meta: TestimonialMeta
}

// ── Blog ──────────────────────────────────────────────────

export interface BlogPostMeta extends EntitySeoFields {
  ps_title_es?: string
  ps_excerpt_es?: string
  ps_content_es?: string
  /** WP: sidebar deep links on blog article (public EN slugs). */
  ps_primary_city?: string
  ps_primary_service?: string
  [key: string]: unknown
}

export interface BlogPostEmbedded {
  'wp:featuredmedia'?: Array<{
    source_url?: string
    alt_text?: string
  }>
  author?: Array<{ name?: string }>
}

/** WordPress REST term (blog topic / area taxonomies). */
export interface WpTerm {
  id: number
  name: string
  slug: string
  taxonomy?: string
}

export interface BlogPost {
  id: number
  slug: string
  date: string
  modified: string
  title: WpRendered
  excerpt: WpRendered
  content: WpRendered
  meta: BlogPostMeta
  /** Term IDs from `ps_blog_topic` taxonomy (WordPress REST). */
  ps_blog_topic?: number[]
  /** Term IDs from `ps_blog_area` taxonomy (WordPress REST). */
  ps_blog_area?: number[]
  _embedded?: BlogPostEmbedded
}

// ── Site config (footer / nav / trust) ───────────────────

export interface SiteConfigSocial {
  facebook?: string
  instagram?: string
  linkedin?: string
}

export interface SiteConfig {
  phone: string
  whatsapp: string
  email: string
  address: string
  trust_stats: Stat[]
  social: SiteConfigSocial
}

// ── Card / template prop helpers (optional composition) ───

export type PropertyCardProps = WithLocale<{ property: Property }>

export type TestimonialCardProps = { testimonial: Testimonial }

export type BlogCardProps = { post: BlogPost }

// ── Availability (calendar / PMS) ───────────────────────────
export type {
  AvailabilityBlock,
  AvailabilityBlockKind,
  AvailabilityJsonPayload,
  PropertyAvailabilitySummary,
} from './availability'

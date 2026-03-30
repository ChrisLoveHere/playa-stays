// ============================================================
// PlayaStays â TypeScript Types
// All WP REST API responses are typed here.
// ps_computed fields are resolved server-side in the WP plugin.
// ============================================================

// ââ Shared primitives âââââââââââââââââââââââââââââââââââââ

export interface WPImage {
  id: number
  url: string
  alt: string
  width?: number
  height?: number
}

export interface Stat {
  val: string
  key: string
}

export interface CtaLink {
  label: string
  href: string
}

// ââ Property âââââââââââââââââââââââââââââââââââââââââââââ

export interface BookingLinks {
  airbnb?: string
  vrbo?: string
  booking?: string
  direct?: string
}

export interface PropertyMeta {
  ps_city: string
  ps_city_id: number
  ps_neighborhood: string
  ps_bedrooms: number
  ps_bathrooms: number
  ps_guests: number
  ps_sqm: number
  ps_nightly_rate: number
  ps_monthly_rate: number
  ps_currency: string
  ps_min_stay_nights: number
  ps_avg_occupancy: number
  ps_avg_rating: number
  ps_review_count: number
  ps_monthly_income: number
  ps_listing_status: 'active' | 'inactive' | 'pending_review' | 'draft'
  ps_managed_by_ps: boolean
  ps_seo_title: string
  ps_seo_desc: string
  ps_title_es: string
  ps_excerpt_es: string
  ps_content_es: string
}

export interface PropertyComputed {
  featured_image: WPImage | null
  gallery: WPImage[]
  booking_links: BookingLinks
  amenities: string[]
  owner: { id: number; display_name: string } | null
}

export interface Property {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  meta: PropertyMeta
  ps_computed: PropertyComputed
  ps_property_type: number[]
  ps_bedrooms: number[]
  ps_feature: number[]
  ps_neighborhood: number[]
}

// ââ City âââââââââââââââââââââââââââââââââââââââââââââââââ

export interface Neighborhood {
  name: string
  slug: string
  desc: string
  image_id: number
}

export interface CityMeta {
  ps_country: string
  ps_state: string
  ps_lat: number
  ps_lng: number
  ps_market_note: string
  ps_best_for: string
  ps_peak_season: string
  ps_avg_nightly: string
  ps_avg_occupancy: string
  ps_avg_monthly_income: string
  ps_seo_title: string
  ps_seo_desc: string
  ps_title_es: string
  ps_excerpt_es: string
  ps_content_es: string
  ps_neighborhoods_es: string
}

export interface CityComputed {
  featured_image: WPImage | null
  stats: Stat[]
  neighborhoods: Neighborhood[]
}

export interface City {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  meta: CityMeta
  ps_computed: CityComputed
}

// ââ Service âââââââââââââââââââââââââââââââââââââââââââââââ

export type ServiceSlug =
  | 'property-management'
  | 'airbnb-management'
  | 'vacation-rentals'
  | 'condos-for-rent'
  | 'beachfront-rentals'
  | 'investment-property'
  | 'sell-property'

export interface ServiceStep {
  icon: string  // SVG path string
  title: string
  desc: string
}

export interface ServiceFeature {
  icon: string
  title: string
  desc: string
}

export interface ServiceMeta {
  ps_service_slug: ServiceSlug
  ps_city_id: number
  ps_hero_headline: string
  ps_hero_subheadline: string
  ps_cta_primary_text: string
  ps_cta_primary_url: string
  ps_schema_type: string
  ps_seo_title: string
  ps_seo_desc: string
  ps_seo_title_es: string
  ps_seo_desc_es: string
  ps_hero_headline_es: string
  ps_hero_subheadline_es: string
  ps_content_es: string
}

export interface ServiceComputed {
  featured_image: WPImage | null
  stats: Stat[]
  steps: ServiceStep[]
  features: ServiceFeature[]
  faq_ids: number[]
  related_services: Array<{ id: number; title: string; slug: string; ps_service_slug: ServiceSlug }>
}

export interface Service {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  meta: ServiceMeta
  ps_computed: ServiceComputed
  ps_city_tag: number[]
}

// ââ FAQ âââââââââââââââââââââââââââââââââââââââââââââââââââ

export interface FAQMeta {
  ps_answer: string
  ps_service_ids: string   // JSON int[]
  ps_city_ids: string      // JSON int[]
  ps_sort_order: number
  ps_answer_es: string
  ps_question_es: string
}

export interface FAQ {
  id: number
  title: { rendered: string }
  meta: FAQMeta
}

// ââ Testimonial âââââââââââââââââââââââââââââââââââââââââââ

export interface TestimonialMeta {
  ps_author_name: string
  ps_author_role: string
  ps_author_initials: string
  ps_rating: number
  ps_property_id: number
  ps_service_id: number
  ps_sort_order: number
  ps_featured: boolean
}

export interface Testimonial {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  meta: TestimonialMeta
}

// ââ Blog Post âââââââââââââââââââââââââââââââââââââââââââââ

export interface BlogPostMeta {
  ps_seo_title: string
  ps_seo_desc: string
  ps_title_es: string
  ps_excerpt_es: string
  ps_content_es: string
}

export interface BlogPost {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
  modified: string
  featured_media: number
  meta: BlogPostMeta
  ps_city_tag: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>
    author?: Array<{ name: string; avatar_urls?: Record<string, string> }>
  }
}

// ââ Lead form âââââââââââââââââââââââââââââââââââââââââââââ

export interface LeadFormData {
  first_name: string
  last_name?: string
  email: string
  phone?: string
  property_type?: string
  neighborhood?: string
  city: string
  source: string
  current_status?: string
  notes?: string
}

// ââ Site config (from WP Options API) ââââââââââââââââââââ

export interface SiteConfig {
  phone: string
  whatsapp: string
  email: string
  address: string
  trust_stats: Stat[]
  social: { facebook?: string; instagram?: string; linkedin?: string }
}

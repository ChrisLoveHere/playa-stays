// ============================================================
// City hub pillar content — locale-specific copy keyed by city slug
// Add new cities by registering in city-hubs/index.ts
// ============================================================

import type { Neighborhood } from '@/types'

/** Image used in gallery strips (Unsplash, CMS, or future CDN) */
export interface CityHubImageAsset {
  src: string
  alt: string
}

export interface CityHubServiceHighlight {
  /** WordPress ps_service_slug (e.g. vacation-rentals → vacation-rental-management URL) */
  psServiceSlug: string
  title: string
  desc: string
  ctaLabel?: string
}

export interface CityHubLocaleContent {
  heroHeadline: string
  heroSub: string
  heroTag?: string
  /** Optional coastal / city hero (Unsplash or CMS URL) */
  heroImageUrl?: string
  /** Compact strip above neighborhood cards (3–4 images typical) */
  neighborhoodGalleryImages?: CityHubImageAsset[]
  /** Optional OSM/Google Maps iframe src — shown near neighborhoods when set */
  mapEmbedUrl?: string
  /** When false, map is hidden even if a URL exists in merged content (rare override) */
  mapEnabled?: boolean
  /** Screen-reader / caption for map (locale-specific) */
  mapCaption?: string
  /** Optional 2–3 images under local insights title — adds visual balance without clutter */
  insightsGalleryImages?: CityHubImageAsset[]
  primaryCta: string
  secondaryCta: string
  tertiaryCta: string
  /** Optional fourth hero control — e.g. Call us (uses siteConfig.phone) */
  phoneCtaLabel?: string
  marketEyebrow?: string
  marketTitle: string
  /** Full HTML body — when set, replaces WP market section for this city+locale */
  marketBodyHtml: string
  neighborhoodsEyebrow?: string
  neighborhoodsTitle: string
  neighborhoodsIntro: string
  neighborhoods: Neighborhood[]
  servicesEyebrow?: string
  servicesTitle: string
  servicesIntro: string
  services: CityHubServiceHighlight[]
  whyEyebrow?: string
  whyTitle: string
  whyItems: Array<{ title: string; desc: string }>
  insightsEyebrow?: string
  insightsTitle: string
  insightItems: Array<{ title: string; desc: string }>
  faqEyebrow?: string
  faqTitle: string
  faqs: Array<{ question: string; answer: string }>
  finalEyebrow?: string
  finalTitle: string
  finalSub: string
  leadFormTitle?: string
  leadFormSubtitle?: string
  footerLeadTitle?: string
  footerLeadSubtitle?: string
  blogHint?: string
  ctaStripEyebrow?: string
  ctaStripHeadline?: string
  /** Short line under cross-city heading (explains link order / scope) */
  crossCityIntro?: string
}

/** Registry row: partial overrides per locale (merged onto universal fallback). */
export type CityHubRegistryEntry = {
  en: Partial<CityHubLocaleContent>
  es: Partial<CityHubLocaleContent>
}

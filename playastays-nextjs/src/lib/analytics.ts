// ============================================================
// PlayaStays — Analytics helpers
//
// Thin wrapper around window.gtag.
// Gracefully no-ops when gtag is unavailable (SSR, test env,
// or user has blocked GA).
//
// All event names follow GA4 recommended event taxonomy.
// ============================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// ── Core event dispatcher ─────────────────────────────────

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

// ── Typed event helpers ───────────────────────────────────

/** Fire after lead form submits successfully. */
export function trackLeadGeneration(opts: {
  source:        string   // e.g. "pricing-bottom-playa-del-carmen"
  city:          string
  propertyType?: string
  locale:        string
}) {
  gtag('event', 'generate_lead', {
    event_category: 'conversion',
    event_label:    opts.source,
    city:           opts.city,
    property_type:  opts.propertyType ?? 'unknown',
    locale:         opts.locale,
  })
}

/** Fire when user clicks any gold or coral CTA button. */
export function trackCtaClick(opts: {
  label:    string   // human-readable button text
  location: string   // e.g. "pricing-hero", "calculator"
  city?:    string
}) {
  gtag('event', 'cta_click', {
    event_category: 'engagement',
    event_label:    opts.label,
    cta_location:   opts.location,
    city:           opts.city ?? 'unknown',
  })
}

/** Fire when WhatsApp link is clicked. */
export function trackWhatsAppClick(opts: { page: string; locale: string }) {
  gtag('event', 'whatsapp_click', {
    event_category: 'engagement',
    page_path:      opts.page,
    locale:         opts.locale,
  })
}

/** Fire when booking link (Airbnb/VRBO/direct) is clicked on a property page. */
export function trackBookingClick(opts: {
  platform:     string   // "airbnb" | "vrbo" | "booking" | "direct"
  propertySlug: string
  city:         string
}) {
  gtag('event', 'booking_click', {
    event_category: 'conversion',
    platform:       opts.platform,
    property_slug:  opts.propertySlug,
    city:           opts.city,
  })
}

/** Fire when the revenue calculator produces a result. */
export function trackCalculatorUpdate(opts: {
  citySlug:        string
  propertySize:    string
  hasCustomNightly: boolean
}) {
  gtag('event', 'calculator_update', {
    event_category: 'engagement',
    event_label:    `${opts.citySlug}-${opts.propertySize}`,
    city_slug:      opts.citySlug,
    property_size:  opts.propertySize,
    has_custom_nightly: opts.hasCustomNightly,
  })
}

/** Fire when rental filter is changed on listing pages. */
export function trackFilterApplied(opts: {
  filterType:  string
  filterValue: string
  city?:       string
}) {
  gtag('event', 'filter_applied', {
    event_category: 'engagement',
    filter_type:    opts.filterType,
    filter_value:   opts.filterValue,
    city:           opts.city ?? 'global',
  })
}

/** Fire when language toggle is clicked. */
export function trackLanguageSwitch(opts: {
  fromLocale: string
  toLocale:   string
  pagePath:   string
}) {
  gtag('event', 'language_switch', {
    event_category: 'engagement',
    from_locale:    opts.fromLocale,
    to_locale:      opts.toLocale,
    page_path:      opts.pagePath,
  })
}

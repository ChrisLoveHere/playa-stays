// ============================================================
// PlayaStays — Internationalisation helpers
//
// Single source of truth for:
//   - EN ↔ ES service slug mapping
//   - EN ↔ ES city slug mapping (identical — same slugs in ES)
//   - EN ↔ ES route conversion
//   - UI string dictionaries for both locales
//   - Locale detection helpers
// ============================================================

import type { Locale } from '@/types'
import {
  SERVICE_HUB_EN_TO_ES,
  SERVICE_HUB_ES_TO_EN,
  SERVICE_HUB_IDS,
  type ServiceHubId,
} from '@/lib/service-hub-constants'
export type { Locale }

// ── Service slug maps ─────────────────────────────────────
// EN slug → ES slug
export const SERVICE_SLUG_EN_TO_ES: Record<string, string> = {
  'property-management':        'administracion-de-propiedades',
  'airbnb-management':          'administracion-airbnb',
  'vacation-rental-management': 'gestion-rentas-vacacionales',
  'sell-property':              'vender-propiedad',
}

// ES slug → EN slug
export const SERVICE_SLUG_ES_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICE_SLUG_EN_TO_ES).map(([en, es]) => [es, en])
)

// All ES service slugs
export const ES_SERVICE_SLUGS = Object.values(SERVICE_SLUG_EN_TO_ES)

// ── Static ES slugs that don't mirror EN exactly ─────────
export const STATIC_SLUG_MAP = {
  blog:              'blog',          // same in both
  rentals:           'rentas',
  'list-your-property': 'publica-tu-propiedad',
  contact:           'contacto',
}

// ── Route converters ──────────────────────────────────────
/**
 * Convert an EN route to its ES equivalent.
 * e.g. '/playa-del-carmen/property-management/' → '/es/playa-del-carmen/administracion-de-propiedades/'
 */
export function enRouteToEs(enRoute: string): string {
  // Strip trailing slash, split
  const parts = enRoute.replace(/\/$/, '').split('/').filter(Boolean)

  if (parts.length === 0) return '/es/'

  // blog/[slug]
  if (parts[0] === 'blog') {
    return parts.length === 1 ? '/es/blog/' : `/es/blog/${parts[1]}/`
  }

  // rentals/[...params] — preserve full path depth (city/neighborhood/slug)
  if (parts[0] === 'rentals') {
    return parts.length === 1 ? '/es/rentas/' : `/es/rentas/${parts.slice(1).join('/')}/`
  }

  // list-your-property
  if (parts[0] === 'list-your-property') return '/es/publica-tu-propiedad/'

  // contact
  if (parts[0] === 'contact') return '/es/contacto/'

  if (parts[0] === 'about') return '/es/acerca-de-playastays/'
  if (parts[0] === 'privacy') return '/es/privacidad/'
  if (parts[0] === 'terms') return '/es/terminos/'

  // property-management-pricing (global hub)
  if (parts[0] === 'property-management-pricing') return '/es/precios-administracion-propiedades/'

  // Top-level service hubs (EN) → ES hub URLs (before single-segment city mapping)
  if (parts.length === 1 && parts[0] in SERVICE_HUB_EN_TO_ES) {
    return `/es/${SERVICE_HUB_EN_TO_ES[parts[0] as ServiceHubId]}/`
  }

  // [city]
  if (parts.length === 1) return `/es/${parts[0]}/`

  // [city]/property-management-cost/
  if (parts.length === 2 && parts[1] === 'property-management-cost') {
    return `/es/${parts[0]}/costo-administracion-propiedades/`
  }

  // [city]/rentals (guest browse) → [ciudad]/rentas
  if (parts.length === 2 && parts[1] === 'rentals') {
    return `/es/${parts[0]}/rentas/`
  }

  // [city]/[service]
  if (parts.length === 2) {
    const esSvc = SERVICE_SLUG_EN_TO_ES[parts[1]] ?? parts[1]
    return `/es/${parts[0]}/${esSvc}/`
  }

  // fallback
  return `/es/${parts.join('/')}/`
}

/**
 * Convert an ES route to its EN equivalent.
 * e.g. '/es/playa-del-carmen/administracion-de-propiedades/' → '/playa-del-carmen/property-management/'
 */
export function esRouteToEn(esRoute: string): string {
  // `usePathname()` is often `/es` with no trailing slash; `/^\/es\//` does not match, which
  // incorrectly produced parts `['es']` and href `/es/` (same locale) — breaking EN on the toggle.
  const trimmed = esRoute.replace(/\/$/, '') || '/'
  if (trimmed === '/es') {
    return '/'
  }
  // Remove leading /es/
  const without = esRoute.replace(/^\/es\//, '').replace(/\/$/, '')
  const parts = without.split('/').filter(Boolean)

  if (parts.length === 0) return '/'

  if (parts[0] === 'blog') return parts.length === 1 ? '/blog/' : `/blog/${parts[1]}/`
  if (parts[0] === 'rentas') return parts.length === 1 ? '/rentals/' : `/rentals/${parts.slice(1).join('/')}/`
  if (parts[0] === 'publica-tu-propiedad') return '/list-your-property/'
  if (parts[0] === 'contacto') return '/contact/'

  if (parts[0] === 'acerca-de-playastays') return '/about/'
  if (parts[0] === 'privacidad') return '/privacy/'
  if (parts[0] === 'terminos') return '/terms/'

  if (parts[0] === 'precios-administracion-propiedades') return '/property-management-pricing/'

  // Top-level ES service hubs → EN hub URLs (before single-segment city mapping)
  if (parts.length === 1 && parts[0] in SERVICE_HUB_ES_TO_EN) {
    return `/${SERVICE_HUB_ES_TO_EN[parts[0]]}/`
  }

  if (parts.length === 1) return `/${parts[0]}/`

  // [ciudad]/costo-administracion-propiedades
  if (parts.length === 2 && parts[1] === 'costo-administracion-propiedades') {
    return `/${parts[0]}/property-management-cost/`
  }

  // [ciudad]/rentas (guest browse) → [city]/rentals
  if (parts.length === 2 && parts[1] === 'rentas') {
    return `/${parts[0]}/rentals/`
  }

  if (parts.length === 2) {
    const enSvc = SERVICE_SLUG_ES_TO_EN[parts[1]] ?? parts[1]
    return `/${parts[0]}/${enSvc}/`
  }

  return `/${parts.join('/')}/`
}

/**
 * Given the current pathname, return the href for the alternate language.
 * Used by Nav component.
 */
export function getAltLangHref(pathname: string): string {
  const p = pathname || '/'
  if (p.startsWith('/es/') || p === '/es') {
    return esRouteToEn(p)
  }
  return enRouteToEs(p)
}

/**
 * Detect locale from a pathname.
 * Safe when pathname is briefly null during client navigation (App Router).
 */
export function localeFromPath(pathname: string | null | undefined): Locale {
  if (!pathname || typeof pathname !== 'string') return 'en'
  return pathname.startsWith('/es') ? 'es' : 'en'
}

// ── Complete EN/ES route map ───────────────────────────────
// Used to validate toggle links and generate sitemaps.
// Cities × services, plus static pages.
/** Canonical ordering for routing helpers / hub cross-links (includes all known markets) */
export const CITY_SLUGS = [
  'playa-del-carmen',
  'tulum',
  'akumal',
  'puerto-morelos',
  'xpu-ha',
  'chetumal',
  'isla-mujeres',
  'cozumel',
] as const

export type CitySlug = typeof CITY_SLUGS[number]

export const EN_SERVICE_SLUGS = Object.keys(SERVICE_SLUG_EN_TO_ES) as string[]

/** Full EN route map */
export function buildEnRouteMap(): string[] {
  const routes: string[] = [
    '/',
    '/rentals/',
    '/blog/',
    '/list-your-property/',
    '/contact/',
    '/about/',
    '/privacy/',
    '/terms/',
  ]
  routes.push('/property-management-pricing/')
  for (const hub of SERVICE_HUB_IDS) {
    routes.push(`/${hub}/`)
    routes.push(`/es/${SERVICE_HUB_EN_TO_ES[hub]}/`)
  }
  for (const city of CITY_SLUGS) {
    routes.push(`/${city}/`)
    routes.push(`/${city}/property-management-cost/`)
    routes.push(`/${city}/rentals/`)
    for (const svc of EN_SERVICE_SLUGS) {
      routes.push(`/${city}/${svc}/`)
    }
  }
  return routes
}

/** Full ES route map */
export function buildEsRouteMap(): string[] {
  return buildEnRouteMap().map(enRouteToEs)
}

// ── UI string dictionaries ────────────────────────────────

export interface Strings {
  // Nav
  navServices: string
  navCities: string
  navPricing: string
  navBrowseRentals: string
  navBlog: string
  navGetEstimate: string
  navContact: string
  navLangEN: string
  navLangES: string

  // Trust bar
  trustProperties: string
  trustSatisfaction: string
  trustRevenue: string
  trustSupport: string
  trustBilingual: string
  trustResponse: string

  // CTA
  ctaGetEstimate: string
  ctaGetEstimateLong: string
  ctaWhatsApp: string
  ctaManagementServices: string
  ctaBrowseRentals: string
  ctaLearnMore: string
  ctaFreeEstimateNoCommit: string

  // Lead form
  formTitle: string
  formSubtitle: string
  formFirstName: string
  formEmail: string
  formPhone: string
  formPropertyType: string
  formStatus: string
  formCity: string
  formSubmit: string
  formSubmitting: string
  formSuccess: string
  formSuccessSub: string
  formError: string
  formDisclaimer: string

  // Footer
  footerTagline: string
  footerServices: string
  footerLocations: string
  footerCompany: string
  footerCopy: string

  // Cities
  cityHeroTag: string
  cityMarket: string
  cityPeakSeason: string
  cityInvestmentGuide: string
  cityNeighborhoods: string
  cityWhere: string
  cityFreeEstimate: string
  cityAlsoIn: string
  cityOperate: string

  // Service pages
  svcHowItWorks: string
  svcDays: string
  svcPricing: string
  svcPricingBody: string
  svcFaq: string
  svcTestimonials: string

  // Blog
  blogInsights: string
  blogReadMore: string
  blogAllArticles: string
  blogPrevious: string
  blogNext: string
  blogCategory: string

  // Rental/property
  propNight: string
  propMonth: string
  propBed: string
  propBath: string
  propSleeps: string
  propStudio: string
  propManaged: string
  propVerified: string
  propBookAirbnb: string
  propBookVrbo: string
  propBookBooking: string
  propBookDirect: string
  propEnquire: string
  propAmenities: string
  propAbout: string
  propMonthly: string
  propForRent: string
  propForSale: string
  propFrom: string

  // Browse rentals / filters
  browseResultsCount: string
  browseListingType: string
  browseListingAll: string
  browseListingRent: string
  browseListingSale: string
  browseRentalStrategy: string
  browseRentalStrategyHint: string
  browseRentalStrategyVacation: string
  browseRentalStrategyLongTerm: string
  browseRentalStrategyHybrid: string
  browseRentalStrategyAny: string
  browseBedrooms: string
  browsePropertyType: string
  browseBathrooms: string
  browseGuests: string
  browseNeighborhood: string
  browseNeighborhoodAny: string
  browsePriceMinPh: string
  browsePriceMaxPh: string
  browseAmenities: string
  browseManagedOnly: string
  browseSortRecommended: string
  browseSortNewest: string
  browseSortPriceAsc: string
  browseSortPriceDesc: string
  browseSortRating: string
  browseSortBedsDesc: string
  browseSortBedsAsc: string
  browseSortBy: string
  browseCalendarHint: string
  browseRelatedTitle: string
  browseAvailabilityNote: string
  availabilityHeading: string
  availabilitySaleOnly: string
  availabilityConnectedIntro: string
  availabilityNextLabel: string
  availabilityMinStayLabel: string
  availabilityBookingModeLabel: string
  availabilityBlocksSummary: string
  availabilityMoreBlocks: string
  availabilityCalendarFuture: string
  availabilityPlaceholderBody: string
  browseSearchEyebrow: string
  browseSearchTitle: string
  browseCheckIn: string
  browseCheckOut: string
  browseCity: string
  browseCityAll: string
  browseSearchAllAreas: string
  browseSecondaryLabel: string
  browseMoreFilters: string
  browseActiveFilters: string
  browseClearAll: string
  browseHotTubSection: string
  browseHotTubHint: string
  browseNoResultsBody: string

  // Contact
  contactSend: string
  contactDirect: string
  contactWhatsApp: string
  contactPhone: string
  contactEmail: string
  contactOffice: string

  // List your property
  listTitle: string
  listSub: string
  listHowItWorks: string
  listStep1Title: string
  listStep1Desc: string
  listStep2Title: string
  listStep2Desc: string
  listStep3Title: string
  listStep3Desc: string
  listStep4Title: string
  listStep4Desc: string

  // Homepage coverage (cities grid)
  homeCoverageEyebrow: string
  homeCoverageTitle: string
  homeCoverageBody: string
  homeCoverageAvgNight: string
  homeCoverageOccupancy: string

  // Nav / footer extras
  navAriaMain: string
  navAriaMobile: string
  navAriaCloseMenu: string
  navAriaOpenMenu: string
  navLanguageLabel: string

  footerPm: string
  footerAirbnb: string
  footerVacationRental: string
  footerFreeEstimate: string
  footerSellProperty: string
  footerBrowseRentals: string
  footerBlog: string
  footerContact: string
  footerAbout: string
  footerListProperty: string
  footerLogin: string
  footerWhatsAppHours: string
  footerLegalPrivacy: string
  footerLegalTerms: string
  footerLegalSitemap: string
  footerOffice: string
  footerMapAriaLabel: string
  footerDirections: string

  // Misc
  home: string
  noResults: string
  filterAny: string
  filterBedrooms: string
  filterType: string
  filterSort: string
  sortRecommended: string
  sortPriceLow: string
  sortPriceHigh: string
  sortRating: string
}

const EN: Strings = {
  navServices: 'Services',
  navCities: 'Cities',
  navPricing: 'Pricing',
  navBrowseRentals: 'Browse Rentals',
  navBlog: 'Blog',
  navGetEstimate: 'Get Free Estimate',
  navContact: 'Contact',
  navLangEN: 'EN',
  navLangES: 'ES',

  trustProperties: 'Properties managed',
  trustSatisfaction: 'Owner satisfaction',
  trustRevenue: 'Revenue uplift',
  trustSupport: 'Local support',
  trustBilingual: 'Bilingual team',
  trustResponse: 'Guest inquiry response',

  ctaGetEstimate: 'Get Free Estimate',
  ctaGetEstimateLong: 'Get My Free Estimate →',
  ctaWhatsApp: 'WhatsApp',
  ctaManagementServices: 'Management Services',
  ctaBrowseRentals: 'Browse Rentals',
  ctaLearnMore: 'Learn More',
  ctaFreeEstimateNoCommit: 'Get a free revenue estimate — no commitment required.',

  formTitle: 'Get a free revenue estimate',
  formSubtitle: 'Based on real market data. No commitment required.',
  formFirstName: 'First Name',
  formEmail: 'Email',
  formPhone: 'Phone / WhatsApp',
  formPropertyType: 'Property Type',
  formStatus: 'Current Situation',
  formCity: 'City',
  formSubmit: 'Get My Free Estimate →',
  formSubmitting: 'Sending…',
  formSuccess: "We'll be in touch within 24 hours",
  formSuccessSub: 'Check WhatsApp or email for your free revenue estimate.',
  formError: 'Something went wrong. Please contact us on WhatsApp.',
  formDisclaimer: 'Response within 24 hours. No commitment required.',

  footerTagline: 'Professional vacation rental management across the Riviera Maya. Local team. Maximum income.',
  footerServices: 'Services',
  footerLocations: 'Locations',
  footerCompany: 'Company',
  footerCopy: `© ${new Date().getFullYear()} PlayaStays. Playa del Carmen, Quintana Roo, Mexico.`,

  cityHeroTag: 'Quintana Roo',
  cityMarket: 'Market',
  cityPeakSeason: 'Peak Season',
  cityInvestmentGuide: 'Investment Guide',
  cityNeighborhoods: 'Neighborhoods',
  cityWhere: 'Where properties perform best',
  cityFreeEstimate: 'Get Free Revenue Estimate',
  cityAlsoIn: 'Also in the Riviera Maya',
  cityOperate: 'PlayaStays operates across Quintana Roo',

  svcHowItWorks: 'How It Works',
  svcDays: 'From listing to revenue in 7 days',
  svcPricing: 'Management Plans',
  svcPricingBody: 'All plans are performance-based — we earn when you earn.',
  svcFaq: 'FAQ',
  svcTestimonials: 'What owners say',

  blogInsights: 'Owner Insights',
  blogReadMore: 'Read more →',
  blogAllArticles: 'All Articles',
  blogPrevious: '← Previous',
  blogNext: 'Next →',
  blogCategory: 'Insights',

  propNight: '/night',
  propMonth: '/mo',
  propBed: 'Bed',
  propBath: 'Bath',
  propSleeps: 'Sleeps',
  propStudio: 'Studio',
  propManaged: 'PlayaStays Managed',
  propVerified: 'Verified',
  propBookAirbnb: 'Book on Airbnb',
  propBookVrbo: 'Book on VRBO',
  propBookBooking: 'Book on Booking',
  propBookDirect: 'Book Direct',
  propEnquire: 'Enquire on WhatsApp',
  propAmenities: 'Amenities',
  propAbout: 'About this property',
  propMonthly: 'Monthly rate available',
  propForRent: 'For Rent',
  propForSale: 'For Sale',
  propFrom: 'From',

  browseResultsCount: '{count} properties match your filters',
  browseListingType: 'Listing',
  browseListingAll: 'All',
  browseListingRent: 'For rent',
  browseListingSale: 'For sale',
  browseRentalStrategy: 'Rental strategy',
  browseRentalStrategyHint: 'Short-term vs long-term positioning — separate from for rent / for sale.',
  browseRentalStrategyVacation: 'Vacation rental',
  browseRentalStrategyLongTerm: 'Long-term rental',
  browseRentalStrategyHybrid: 'Both / hybrid',
  browseRentalStrategyAny: 'Any strategy',
  browseBedrooms: 'Bedrooms',
  browsePropertyType: 'Property type',
  browseBathrooms: 'Bathrooms',
  browseGuests: 'Guests',
  browseNeighborhood: 'Neighborhood',
  browseNeighborhoodAny: 'All neighborhoods',
  browsePriceMinPh: 'Min $ / night',
  browsePriceMaxPh: 'Max $ / night',
  browseAmenities: 'Amenities',
  browseManagedOnly: 'PlayaStays managed',
  browseSortRecommended: 'Recommended',
  browseSortNewest: 'Newest',
  browseSortPriceAsc: 'Price: Low to high',
  browseSortPriceDesc: 'Price: High to low',
  browseSortRating: 'Top rated',
  browseSortBedsDesc: 'Bedrooms (most)',
  browseSortBedsAsc: 'Bedrooms (fewest)',
  browseSortBy: 'Sort by',
  browseCalendarHint:
    'Date search uses live calendars when CMS availability is connected — filters below use listing data today.',
  browseRelatedTitle: 'More in this area',
  browseAvailabilityNote:
    'Live night-by-night availability may appear here when your CMS supplies calendar data. Use booking links for confirmed dates today.',
  availabilityHeading: 'Availability',
  availabilitySaleOnly:
    'This listing is offered for purchase. For travel dates and nightly availability, browse vacation rentals or contact us for similar managed homes.',
  availabilityConnectedIntro:
    'Calendar data is connected for this home. Unavailable spans below come from our records — always confirm final dates before booking.',
  availabilityNextLabel: 'Next available:',
  availabilityMinStayLabel: 'Minimum stay:',
  availabilityBookingModeLabel: 'Booking:',
  availabilityBlocksSummary: 'Recorded unavailable periods (check-in dates use half-open nights):',
  availabilityMoreBlocks: '+ {n} more periods on file',
  availabilityCalendarFuture:
    'Interactive month view and live sync with channel calendars are planned as soon as your data pipeline is connected.',
  availabilityPlaceholderBody:
    'Live calendar data is not connected for this listing yet. Use the booking links for confirmed dates, or enquire and our team will verify availability.',
  browseSearchEyebrow: 'Search stays',
  browseSearchTitle: 'Find a place that fits your trip',
  browseCheckIn: 'Check-in',
  browseCheckOut: 'Check-out',
  browseCity: 'Destination',
  browseCityAll: 'All destinations',
  browseSearchAllAreas: 'Search all destinations',
  browseSecondaryLabel: 'Listing & home details',
  browseMoreFilters: 'More filters',
  browseActiveFilters: 'Active filters',
  browseClearAll: 'Clear all',
  browseHotTubSection: 'Hot tub',
  browseHotTubHint:
    'Matches keywords in the listing (private vs shared). Add clearer CMS tags later for precision.',
  browseNoResultsBody: 'Try adjusting dates, guests, or filters — or browse all destinations.',

  contactSend: 'Send Us a Message',
  contactDirect: 'Direct Contact',
  contactWhatsApp: 'WhatsApp',
  contactPhone: 'Phone',
  contactEmail: 'Email',
  contactOffice: 'Office location',

  listTitle: 'Maximize your rental income in paradise',
  listSub: 'Full-service vacation rental management across the Riviera Maya. We handle everything — you collect the revenue.',
  listHowItWorks: 'How It Works',
  listStep1Title: 'Tell us about your property',
  listStep1Desc: 'Fill in the form. It takes 2 minutes. We review every submission the same day.',
  listStep2Title: 'We send your revenue estimate',
  listStep2Desc: 'A personalised income projection based on real market data — within 24 hours.',
  listStep3Title: 'We set everything up',
  listStep3Desc: 'Photography, listing, pricing, compliance. Live on Airbnb, VRBO, and Booking.com within 7 days.',
  listStep4Title: 'You collect monthly income',
  listStep4Desc: 'Monthly deposits to your account. Full transparency via your owner portal.',

  home: 'Home',
  noResults: 'No properties found.',
  filterAny: 'Any',
  filterBedrooms: 'Bedrooms',
  filterType: 'Type',
  filterSort: 'Sort',
  sortRecommended: 'Recommended',
  sortPriceLow: 'Price: Low',
  sortPriceHigh: 'Price: High',
  sortRating: 'Top Rated',

  homeCoverageEyebrow: 'Where We Operate',
  homeCoverageTitle: 'Across Quintana Roo',
  homeCoverageBody:
    'PlayaStays manages vacation rental properties across 6 cities in Quintana Roo. One team. One standard. Wherever your property is.',
  homeCoverageAvgNight: 'avg/night',
  homeCoverageOccupancy: 'occupancy',

  navAriaMain: 'Main navigation',
  navAriaMobile: 'Mobile navigation',
  navAriaCloseMenu: 'Close menu',
  navAriaOpenMenu: 'Open menu',
  navLanguageLabel: 'Language',

  footerPm: 'Property Management',
  footerAirbnb: 'Airbnb Management',
  footerVacationRental: 'Vacation rental management',
  footerFreeEstimate: 'Free Revenue Estimate',
  footerSellProperty: 'Sell Your Property',
  footerBrowseRentals: 'Browse Rentals',
  footerBlog: 'Blog',
  footerContact: 'Contact',
  footerAbout: 'About',
  footerListProperty: 'List Your Property',
  footerLogin: 'Login',
  footerWhatsAppHours: 'WhatsApp (7am – 10pm)',
  footerLegalPrivacy: 'Privacy',
  footerLegalTerms: 'Terms',
  footerLegalSitemap: 'Sitemap',
  footerOffice: 'Office',
  footerMapAriaLabel: 'Map showing PlayaStays office in Playa del Carmen, Mexico',
  footerDirections: 'Open in Google Maps →',
}

const ES: Strings = {
  navServices: 'Servicios',
  navCities: 'Ciudades',
  navPricing: 'Precios',
  navBrowseRentals: 'Ver rentas',
  navBlog: 'Blog',
  navGetEstimate: 'Obtener estimado gratis',
  navContact: 'Contacto',
  navLangEN: 'EN',
  navLangES: 'ES',

  trustProperties: 'Propiedades administradas',
  trustSatisfaction: 'Satisfacción de propietarios',
  trustRevenue: 'Aumento de ingresos',
  trustSupport: 'Soporte local',
  trustBilingual: 'Equipo bilingüe',
  trustResponse: 'Respuesta a huéspedes',

  ctaGetEstimate: 'Obtener estimado gratis',
  ctaGetEstimateLong: 'Obtener mi estimado gratis →',
  ctaWhatsApp: 'WhatsApp',
  ctaManagementServices: 'Servicios de gestión',
  ctaBrowseRentals: 'Ver rentas',
  ctaLearnMore: 'Más información',
  ctaFreeEstimateNoCommit: 'Obtén un estimado de ingresos gratis — sin compromisos.',

  formTitle: 'Obtén un estimado de ingresos gratis',
  formSubtitle: 'Basado en datos reales del mercado. Sin compromiso.',
  formFirstName: 'Nombre',
  formEmail: 'Correo electrónico',
  formPhone: 'Teléfono / WhatsApp',
  formPropertyType: 'Tipo de propiedad',
  formStatus: 'Situación actual',
  formCity: 'Ciudad',
  formSubmit: 'Obtener mi estimado gratis →',
  formSubmitting: 'Enviando…',
  formSuccess: 'Nos pondremos en contacto en 24 horas',
  formSuccessSub: 'Revisa tu WhatsApp o correo electrónico para tu estimado gratuito.',
  formError: 'Algo salió mal. Contáctanos por WhatsApp.',
  formDisclaimer: 'Respuesta en 24 horas. Sin compromiso.',

  footerTagline: 'Administración profesional de rentas vacacionales en la Riviera Maya. Equipo local. Ingresos máximos.',
  footerServices: 'Servicios',
  footerLocations: 'Ubicaciones',
  footerCompany: 'Empresa',
  footerCopy: `© ${new Date().getFullYear()} PlayaStays. Playa del Carmen, Quintana Roo, México.`,

  cityHeroTag: 'Quintana Roo',
  cityMarket: 'Mercado',
  cityPeakSeason: 'Temporada alta',
  cityInvestmentGuide: 'Guía de inversión',
  cityNeighborhoods: 'Colonias',
  cityWhere: 'Dónde rinden más las propiedades',
  cityFreeEstimate: 'Estimado de ingresos gratis',
  cityAlsoIn: 'También en la Riviera Maya',
  cityOperate: 'PlayaStays opera en todo Quintana Roo',

  svcHowItWorks: 'Cómo funciona',
  svcDays: 'Del anuncio a los ingresos en 7 días',
  svcPricing: 'Planes de administración',
  svcPricingBody: 'Todos los planes son basados en desempeño — ganamos cuando tú ganas.',
  svcFaq: 'Preguntas frecuentes',
  svcTestimonials: 'Lo que dicen los propietarios',

  blogInsights: 'Información para propietarios',
  blogReadMore: 'Leer más →',
  blogAllArticles: 'Todos los artículos',
  blogPrevious: '← Anterior',
  blogNext: 'Siguiente →',
  blogCategory: 'Artículos',

  propNight: '/noche',
  propMonth: '/mes',
  propBed: 'Rec',
  propBath: 'Baño',
  propSleeps: 'Huéspedes',
  propStudio: 'Estudio',
  propManaged: 'Gestionado por PlayaStays',
  propVerified: 'Verificado',
  propBookAirbnb: 'Reservar en Airbnb',
  propBookVrbo: 'Reservar en VRBO',
  propBookBooking: 'Reservar en Booking',
  propBookDirect: 'Reserva directa',
  propEnquire: 'Consultar por WhatsApp',
  propAmenities: 'Amenidades',
  propAbout: 'Sobre esta propiedad',
  propMonthly: 'Tarifa mensual disponible',
  propForRent: 'En renta',
  propForSale: 'En venta',
  propFrom: 'Desde',

  browseResultsCount: '{count} propiedades coinciden con tus filtros',
  browseListingType: 'Tipo de anuncio',
  browseListingAll: 'Todos',
  browseListingRent: 'En renta',
  browseListingSale: 'En venta',
  browseRentalStrategy: 'Estrategia de renta',
  browseRentalStrategyHint: 'Corta vs larga estancia — independiente de en renta / en venta.',
  browseRentalStrategyVacation: 'Renta vacacional',
  browseRentalStrategyLongTerm: 'Renta a largo plazo',
  browseRentalStrategyHybrid: 'Mixta / ambas',
  browseRentalStrategyAny: 'Cualquier estrategia',
  browseBedrooms: 'Recámaras',
  browsePropertyType: 'Tipo de propiedad',
  browseBathrooms: 'Baños',
  browseGuests: 'Huéspedes',
  browseNeighborhood: 'Colonia',
  browseNeighborhoodAny: 'Todas las colonias',
  browsePriceMinPh: 'Mín $ / noche',
  browsePriceMaxPh: 'Máx $ / noche',
  browseAmenities: 'Amenidades',
  browseManagedOnly: 'Gestionado por PlayaStays',
  browseSortRecommended: 'Recomendado',
  browseSortNewest: 'Más recientes',
  browseSortPriceAsc: 'Precio: menor a mayor',
  browseSortPriceDesc: 'Precio: mayor a menor',
  browseSortRating: 'Mejor calificados',
  browseSortBedsDesc: 'Recámaras (más)',
  browseSortBedsAsc: 'Recámaras (menos)',
  browseSortBy: 'Ordenar',
  browseCalendarHint:
    'La búsqueda por fechas usará calendarios en vivo cuando el CMS esté conectado — hoy los filtros usan datos del anuncio.',
  browseRelatedTitle: 'Más en la zona',
  browseAvailabilityNote:
    'La disponibilidad noche a noche puede mostrarse aquí cuando el CMS envíe datos de calendario. Por ahora usa los enlaces de reserva para fechas confirmadas.',
  availabilityHeading: 'Disponibilidad',
  availabilitySaleOnly:
    'Este anuncio es de venta. Para fechas de viaje y estancias por noches, explora rentas vacacionales o contáctanos por casas gestionadas similares.',
  availabilityConnectedIntro:
    'El calendario está conectado para esta propiedad. Los periodos no disponibles provienen de nuestros registros — confirma siempre las fechas finales antes de reservar.',
  availabilityNextLabel: 'Próxima disponibilidad:',
  availabilityMinStayLabel: 'Estancia mínima:',
  availabilityBookingModeLabel: 'Reserva:',
  availabilityBlocksSummary: 'Periodos no disponibles registrados (noches en formato inicio → fin):',
  availabilityMoreBlocks: '+ {n} periodos más en archivo',
  availabilityCalendarFuture:
    'La vista mensual interactiva y la sincronización en vivo con canales están planeadas al conectar el flujo de datos.',
  availabilityPlaceholderBody:
    'Aún no hay calendario en vivo para este anuncio. Usa los enlaces de reserva para fechas confirmadas o consulta y nuestro equipo verificará disponibilidad.',
  browseSearchEyebrow: 'Buscar estancias',
  browseSearchTitle: 'Encuentra el lugar ideal para tu viaje',
  browseCheckIn: 'Entrada',
  browseCheckOut: 'Salida',
  browseCity: 'Destino',
  browseCityAll: 'Todos los destinos',
  browseSearchAllAreas: 'Buscar en todos los destinos',
  browseSecondaryLabel: 'Anuncio y vivienda',
  browseMoreFilters: 'Más filtros',
  browseActiveFilters: 'Filtros activos',
  browseClearAll: 'Borrar todo',
  browseHotTubSection: 'Jacuzzi / hot tub',
  browseHotTubHint:
    'Coincide con palabras en el anuncio (privado vs compartido). Etiquetas CMS más claras mejorarán la precisión.',
  browseNoResultsBody:
    'Prueba ajustar fechas, huéspedes o filtros — o explora todos los destinos.',

  contactSend: 'Envíanos un mensaje',
  contactDirect: 'Contacto directo',
  contactWhatsApp: 'WhatsApp',
  contactPhone: 'Teléfono',
  contactEmail: 'Correo electrónico',
  contactOffice: 'Ubicación de la oficina',

  listTitle: 'Maximiza tus ingresos de renta en el paraíso',
  listSub: 'Administración integral de rentas vacacionales en la Riviera Maya. Nosotros nos encargamos de todo — tú recibes los ingresos.',
  listHowItWorks: 'Cómo funciona',
  listStep1Title: 'Cuéntanos sobre tu propiedad',
  listStep1Desc: 'Llena el formulario. Son 2 minutos. Revisamos cada solicitud el mismo día.',
  listStep2Title: 'Te enviamos tu estimado de ingresos',
  listStep2Desc: 'Una proyección de ingresos personalizada basada en datos reales del mercado — en 24 horas.',
  listStep3Title: 'Nosotros lo configuramos todo',
  listStep3Desc: 'Fotografía, anuncio, precios, cumplimiento legal. En Airbnb, VRBO y Booking.com en 7 días.',
  listStep4Title: 'Recibes ingresos mensuales',
  listStep4Desc: 'Depósitos mensuales en tu cuenta. Transparencia total a través de tu portal de propietario.',

  home: 'Inicio',
  noResults: 'No se encontraron propiedades.',
  filterAny: 'Cualquiera',
  filterBedrooms: 'Recámaras',
  filterType: 'Tipo',
  filterSort: 'Ordenar',
  sortRecommended: 'Recomendados',
  sortPriceLow: 'Precio: menor',
  sortPriceHigh: 'Precio: mayor',
  sortRating: 'Mejor valorados',

  homeCoverageEyebrow: 'Dónde operamos',
  homeCoverageTitle: 'En Quintana Roo',
  homeCoverageBody:
    'PlayaStays administra rentas vacacionales en 6 ciudades de Quintana Roo. Un solo equipo. Un solo estándar. Donde esté tu propiedad.',
  homeCoverageAvgNight: 'prom./noche',
  homeCoverageOccupancy: 'ocupación',

  navAriaMain: 'Navegación principal',
  navAriaMobile: 'Navegación móvil',
  navAriaCloseMenu: 'Cerrar menú',
  navAriaOpenMenu: 'Abrir menú',
  navLanguageLabel: 'Idioma',

  footerPm: 'Administración de propiedades',
  footerAirbnb: 'Administración Airbnb',
  footerVacationRental: 'Gestión de rentas vacacionales',
  footerFreeEstimate: 'Estimado gratis',
  footerSellProperty: 'Vender tu propiedad',
  footerBrowseRentals: 'Ver rentas',
  footerBlog: 'Blog',
  footerContact: 'Contacto',
  footerAbout: 'Acerca de',
  footerListProperty: 'Publica tu propiedad',
  footerLogin: 'Iniciar sesión',
  footerWhatsAppHours: 'WhatsApp (7am – 10pm)',
  footerLegalPrivacy: 'Privacidad',
  footerLegalTerms: 'Términos',
  footerLegalSitemap: 'Mapa del sitio',
  footerOffice: 'Oficina',
  footerMapAriaLabel: 'Mapa de la oficina PlayaStays en Playa del Carmen, México',
  footerDirections: 'Abrir en Google Maps →',
}

export const STRINGS: Record<Locale, Strings> = { en: EN, es: ES }

export function t(locale: Locale): Strings {
  return STRINGS[locale]
}

/**
 * English trust-stat labels from CMS or static fallbacks → Spanish for TrustBar / hero.
 * Unknown keys pass through unchanged.
 */
const TRUST_STAT_LABEL_ES: Record<string, string> = {
  'Properties managed':       'Propiedades administradas',
  'Owner satisfaction':       'Satisfacción de propietarios',
  'Revenue uplift':           'Aumento de ingresos',
  'Net income uplift':        'Aumento de ingresos netos',
  'Local support':            'Soporte local',
  'Bilingual team':           'Equipo bilingüe',
  'Guest inquiry response':   'Respuesta a huéspedes',
  'Bilingual hosts':          'Anfitriones bilingües',
  'Avg. portfolio rating':    'Calificación promedio del portafolio',
  'Guest support':            'Atención a huéspedes',
  'Professionally managed':   'Gestión profesional',
}

export function localizeTrustStatKey(key: string, locale: Locale): string {
  if (locale !== 'es') return key
  return TRUST_STAT_LABEL_ES[key] ?? key
}

// ── Spanish service label map ─────────────────────────────
export const SERVICE_LABEL_ES: Record<string, string> = {
  'property-management':        'Administración de Propiedades',
  'airbnb-management':            'Administración Airbnb',
  'vacation-rental-management': 'Gestión de Rentas Vacacionales',
  'sell-property':                'Vender tu Propiedad',
}

export const SERVICE_LABEL_EN: Record<string, string> = {
  'property-management':        'Property Management',
  'airbnb-management':          'Airbnb Management',
  'vacation-rental-management': 'Vacation Rental Management',
  'sell-property':              'Sell Your Property',
}

export function serviceLabel(slug: string, locale: Locale): string {
  return locale === 'es'
    ? (SERVICE_LABEL_ES[slug] ?? slug)
    : (SERVICE_LABEL_EN[slug] ?? slug)
}

/** Nav dropdown: labels, localized paths, short descriptions (matches root layout). */
export interface NavServiceLink {
  label: string
  href: string
  desc: string
}

const NAV_DROPDOWN_DESC: Record<
  Locale,
  {
    propertyManagement: string
    airbnbManagement: string
    vacationRentals: string
    sellProperty: string
  }
> = {
  en: {
    propertyManagement: 'Riviera Maya overview — ownership & operations',
    airbnbManagement: 'STR listing, pricing & guest ops',
    vacationRentals: 'Multi-channel vacation rental performance',
    sellProperty: 'Buyer-ready positioning & exit support',
  },
  es: {
    propertyManagement: 'Vista general Riviera Maya — operación integral',
    airbnbManagement: 'Anuncio, precios y operación renta corta',
    vacationRentals: 'Desempeño multicanal de renta vacacional',
    sellProperty: 'Salida al mercado con presentación sólida',
  },
}

export function buildNavServices(locale: Locale): NavServiceLink[] {
  const isEs = locale === 'es'
  const h = (enPath: string) => (isEs ? enRouteToEs(enPath) : enPath)
  const d = NAV_DROPDOWN_DESC[locale]
  return [
    {
      label: serviceLabel('property-management', locale),
      href:  h('/property-management/'),
      desc:  d.propertyManagement,
    },
    {
      label: serviceLabel('airbnb-management', locale),
      href:  h('/airbnb-management/'),
      desc:  d.airbnbManagement,
    },
    {
      label: serviceLabel('vacation-rental-management', locale),
      href:  h('/vacation-rental-management/'),
      desc:  d.vacationRentals,
    },
    {
      label: serviceLabel('sell-property', locale),
      href:  h('/sell-property/'),
      desc:  d.sellProperty,
    },
  ]
}

/** Canonical slug for global service hub cards (homepage — not city-scoped). */
export type HomeServiceHubSlug =
  | 'property-management'
  | 'airbnb-management'
  | 'vacation-rental-management'
  | 'sell-property'

/** Map CMS `ps_service_slug` (any market) to the global hub it represents on the homepage. */
export function normalizeHomeServiceCardSlug(slug: string): HomeServiceHubSlug {
  if (slug === 'airbnb-management') return 'airbnb-management'
  if (
    slug === 'vacation-rental-management' ||
    slug === 'vacation-rentals' ||
    slug === 'condo-rental-management' ||
    slug === 'beachfront-rental-management' ||
    slug === 'condos-for-rent' ||
    slug === 'beachfront-rentals'
  ) {
    return 'vacation-rental-management'
  }
  if (slug === 'sell-property' || slug === 'sell-your-property') return 'sell-property'
  if (slug === 'listing-optimization') return 'property-management'
  if (slug === 'property-management' || slug === 'investment-property') return 'property-management'
  return 'property-management'
}

const HOME_HUB_EN_PATH: Record<HomeServiceHubSlug, string> = {
  'property-management': '/property-management/',
  'airbnb-management': '/airbnb-management/',
  'vacation-rental-management': '/vacation-rental-management/',
  'sell-property': '/sell-property/',
}

/** Global service hub URL for the homepage cards (matches top-level hub routes, not /[city]/…). */
export function homeServiceHubHref(slug: string, locale: Locale): string {
  const hub = normalizeHomeServiceCardSlug(slug)
  const enPath = HOME_HUB_EN_PATH[hub]
  return locale === 'es' ? enRouteToEs(enPath) : enPath
}

/** Homepage service card blurbs — locale-neutral, no city names (canonical hub keys). */
const HOME_SERVICE_CARD_DESC_EN: Record<HomeServiceHubSlug, string> = {
  'property-management':
    'Full-service vacation rental operations: reservations, housekeeping, pricing, and guest support — professionally managed across Quintana Roo.',
  'airbnb-management':
    'Listing optimization, messaging, and hotel-grade performance on Airbnb and short-term channels.',
  'vacation-rental-management':
    'Multi-channel vacation rental strategy and execution — from positioning to occupancy — built for owners who want scale without the daily grind.',
  'sell-property':
    'Buyer-ready marketing, pricing guidance, and local market expertise when you are ready to exit or reposition.',
}

const HOME_SERVICE_CARD_DESC_ES: Record<HomeServiceHubSlug, string> = {
  'property-management':
    'Administración integral de rentas vacacionales: reservas, limpieza, precios y atención al huésped — con equipo profesional en Quintana Roo.',
  'airbnb-management':
    'Listados optimizados, mensajería y desempeño tipo hotel en Airbnb y canales de renta corta.',
  'vacation-rental-management':
    'Estrategia y operación multicanal de renta vacacional — del posicionamiento a la ocupación — para dueños que buscan escala sin el día a día.',
  'sell-property':
    'Marketing listo para compradores, orientación de precios y experiencia de mercado local cuando quieras vender o reposicionar.',
}

export function homeServiceCardDesc(slug: string, locale: Locale, wpExcerptPlain: string): string {
  const hub = normalizeHomeServiceCardSlug(slug)
  if (locale === 'es') return HOME_SERVICE_CARD_DESC_ES[hub] ?? wpExcerptPlain
  return HOME_SERVICE_CARD_DESC_EN[hub] ?? wpExcerptPlain
}

// ── Property type options (bilingual) ────────────────────
export const PROPERTY_TYPE_OPTIONS: Array<{ value: string; en: string; es: string }> = [
  { value: '',          en: 'Select',           es: 'Seleccionar' },
  { value: 'studio-1br',en: 'Studio / 1-Bedroom',es: 'Estudio / 1 Recámara' },
  { value: '2br',       en: '2-Bedroom Condo',  es: 'Condominio 2 Recámaras' },
  { value: '3br-villa', en: '3BR+ / Villa',     es: '3+ Rec / Villa' },
  { value: 'penthouse', en: 'Penthouse',        es: 'Penthouse' },
]

export const CURRENT_STATUS_OPTIONS: Array<{ value: string; en: string; es: string }> = [
  { value: '',              en: 'Select',              es: 'Seleccionar' },
  { value: 'self-managing', en: 'Self-managing now',   es: 'Autogestionando actualmente' },
  { value: 'other-company', en: 'With another company',es: 'Con otra empresa' },
  { value: 'not-renting',   en: 'Not currently renting',es: 'Sin rentar actualmente' },
  { value: 'pre-con',       en: 'Pre-construction / buying soon', es: 'Preventa / comprando pronto' },
]

export const CITY_DISPLAY_NAMES: Record<string, string> = {
  'playa-del-carmen': 'Playa del Carmen',
  'tulum':            'Tulum',
  'akumal':           'Akumal',
  'puerto-morelos':   'Puerto Morelos',
  'xpu-ha':           'Xpu-Ha',
  'chetumal':         'Chetumal',
  'isla-mujeres':     'Isla Mujeres',
  'cozumel':          'Cozumel',
}

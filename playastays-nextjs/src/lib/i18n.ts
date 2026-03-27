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

export type Locale = 'en' | 'es'

// ── Service slug maps ─────────────────────────────────────
// EN slug → ES slug
export const SERVICE_SLUG_EN_TO_ES: Record<string, string> = {
  'property-management':  'administracion-de-propiedades',
  'airbnb-management':    'administracion-airbnb',
  'vacation-rentals':     'rentas-vacacionales',
  'condos-for-rent':      'condominios-en-renta',
  'beachfront-rentals':   'rentas-frente-al-mar',
  'investment-property':  'propiedades-de-inversion',
  'sell-property':        'vender-propiedad',
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

  // rentals/[slug]
  if (parts[0] === 'rentals') {
    return parts.length === 1 ? '/es/rentas/' : `/es/rentas/${parts[1]}/`
  }

  // list-your-property
  if (parts[0] === 'list-your-property') return '/es/publica-tu-propiedad/'

  // contact
  if (parts[0] === 'contact') return '/es/contacto/'

  // property-management-pricing (global hub)
  if (parts[0] === 'property-management-pricing') return '/es/precios-administracion-propiedades/'

  // [city]
  if (parts.length === 1) return `/es/${parts[0]}/`

  // [city]/property-management-cost/
  if (parts.length === 2 && parts[1] === 'property-management-cost') {
    return `/es/${parts[0]}/costo-administracion-propiedades/`
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
  // Remove leading /es/
  const without = esRoute.replace(/^\/es\//, '').replace(/\/$/, '')
  const parts = without.split('/').filter(Boolean)

  if (parts.length === 0) return '/'

  if (parts[0] === 'blog') return parts.length === 1 ? '/blog/' : `/blog/${parts[1]}/`
  if (parts[0] === 'rentas') return parts.length === 1 ? '/rentals/' : `/rentals/${parts[1]}/`
  if (parts[0] === 'publica-tu-propiedad') return '/list-your-property/'
  if (parts[0] === 'contacto') return '/contact/'

  if (parts[0] === 'precios-administracion-propiedades') return '/property-management-pricing/'

  if (parts.length === 1) return `/${parts[0]}/`

  // [ciudad]/costo-administracion-propiedades
  if (parts.length === 2 && parts[1] === 'costo-administracion-propiedades') {
    return `/${parts[0]}/property-management-cost/`
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
  if (pathname.startsWith('/es/') || pathname === '/es') {
    return esRouteToEn(pathname)
  }
  return enRouteToEs(pathname)
}

/**
 * Detect locale from a pathname.
 */
export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith('/es') ? 'es' : 'en'
}

// ── Complete EN/ES route map ───────────────────────────────
// Used to validate toggle links and generate sitemaps.
// Cities × services, plus static pages.
export const CITY_SLUGS = [
  'playa-del-carmen',
  'tulum',
  'akumal',
  'puerto-morelos',
  'xpu-ha',
  'chetumal',
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
  ]
  routes.push('/property-management-pricing/')
  for (const city of CITY_SLUGS) {
    routes.push(`/${city}/`)
    routes.push(`/${city}/property-management-cost/`)
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
}

const ES: Strings = {
  navServices: 'Servicios',
  navCities: 'Ciudades',
  navBrowseRentals: 'Ver Rentas',
  navBlog: 'Blog',
  navGetEstimate: 'Estimado Gratis',
  navContact: 'Contacto',
  navLangEN: 'EN',
  navLangES: 'ES',

  trustProperties: 'Propiedades administradas',
  trustSatisfaction: 'Satisfacción de propietarios',
  trustRevenue: 'Aumento de ingresos',
  trustSupport: 'Soporte local',
  trustBilingual: 'Equipo bilingüe',
  trustResponse: 'Respuesta a huéspedes',

  ctaGetEstimate: 'Estimado Gratis',
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
}

export const STRINGS: Record<Locale, Strings> = { en: EN, es: ES }

export function t(locale: Locale): Strings {
  return STRINGS[locale]
}

// ── Spanish service label map ─────────────────────────────
export const SERVICE_LABEL_ES: Record<string, string> = {
  'property-management':  'Administración de Propiedades',
  'airbnb-management':    'Administración de Airbnb',
  'vacation-rentals':     'Rentas Vacacionales',
  'condos-for-rent':      'Condominios en Renta',
  'beachfront-rentals':   'Rentas Frente al Mar',
  'investment-property':  'Propiedad de Inversión',
  'sell-property':        'Vender tu Propiedad',
}

export const SERVICE_LABEL_EN: Record<string, string> = {
  'property-management':  'Property Management',
  'airbnb-management':    'Airbnb Management',
  'vacation-rentals':     'Vacation Rentals',
  'condos-for-rent':      'Condos for Rent',
  'beachfront-rentals':   'Beachfront Rentals',
  'investment-property':  'Investment Property',
  'sell-property':        'Sell Your Property',
}

export function serviceLabel(slug: string, locale: Locale): string {
  return locale === 'es'
    ? (SERVICE_LABEL_ES[slug] ?? slug)
    : (SERVICE_LABEL_EN[slug] ?? slug)
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
}

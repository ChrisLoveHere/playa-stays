// ============================================================
// PlayaStays — Pricing Data
//
// Single source of truth for all pricing page content.
// No fetch calls — this is static market intelligence data
// that updates on redeploy. For individual city data that
// needs to be CMS-editable, fall back to City.meta fields.
// ============================================================

import type { Locale } from '@/lib/i18n'
import type { PricingPlan } from '@/components/sections/PricingGrid'

// ── Types ─────────────────────────────────────────────────

export interface EarningsExample {
  type: string       // "Studio", "2BR Condo", "Villa"
  typeEs: string
  nightlyRange: string
  monthlyWithout: string  // gross before management
  managementFee: string   // e.g. "15% = $420/mo"
  monthlyWith: string     // net after fee (higher due to better occupancy)
  uplift: string          // e.g. "+$680/mo"
}

export interface CityPricingData {
  slug: string
  name: string
  nameEs: string
  avgOccupancy: string
  avgNightly: string
  competitionLevel: string
  competitionLevelEs: string
  marketNote: string
  marketNoteEs: string
  earnings: EarningsExample[]
  peakSeason: string
  peakSeasonEs: string
  // Fees are identical across cities — only market notes differ
}

// ── Pricing plans (same structure as ServicePageTemplate) ─
// Core / Plus / Pro match the existing PricingGrid design exactly.

export function getPricingPlans(
  locale: Locale,
  cityName: string,
  estimateHref: string
): PricingPlan[] {
  const isEs = locale === 'es'
  const city  = isEs ? cityName : cityName  // display name same

  if (isEs) {
    return [
      {
        tier:  'Core',
        name:  '10%',
        unit:  'sobre ingresos brutos',
        badge: undefined,
        featured: false,
        desc:  `Ideal para propietarios que quieren rentar ${city} de forma simple y sin complicaciones.`,
        features: [
          'Anuncio en Airbnb, VRBO y Booking.com',
          'Precio dinámico básico',
          'Comunicación con huéspedes',
          'Coordinación de limpieza',
          'Reporte mensual de ingresos',
          'Apoyo con cumplimiento legal',
        ],
        cta: { label: 'Comenzar → ', href: estimateHref },
      },
      {
        tier:  'Plus',
        name:  '15%',
        unit:  'sobre ingresos brutos',
        badge: 'Más popular',
        featured: true,
        desc:  `Máxima visibilidad y optimización de tarifas para tu propiedad en ${city}.`,
        features: [
          'Todo lo del plan Core',
          'Fotografía profesional incluida',
          'Optimización de precio en tiempo real',
          'Copywriting y SEO del anuncio',
          'Limpieza interna (estándar hotelero)',
          'Línea de emergencia 24/7 para huéspedes',
          'Coordinación de mantenimiento',
        ],
        cta: { label: 'Comenzar →', href: estimateHref },
      },
      {
        tier:  'Pro',
        name:  'Personalizado',
        unit:  'para inversores y portfolios',
        badge: undefined,
        featured: false,
        desc:  `Para villas de lujo, penthouses y portfolios de propiedades en ${city}.`,
        features: [
          'Todo lo del plan Plus',
          'Gerente de cuenta dedicado',
          'Servicios de concierge para huéspedes',
          'Consultoría de diseño de interiores',
          'Mantenimiento prioritario (< 4 hrs)',
          'Declaración SAT y contabilidad',
          'Estrategia de portafolio multi-propiedad',
        ],
        cta: { label: 'Hablemos →', href: estimateHref },
      },
    ]
  }

  return [
    {
      tier:  'Core',
      name:  '10%',
      unit:  'of gross revenue',
      badge: undefined,
      featured: false,
      desc:  `For owners who want a simple, hands-off rental in ${city} without complexity.`,
      features: [
        'Airbnb, VRBO & Booking.com listing',
        'Basic dynamic pricing',
        'Guest communication & screening',
        'Cleaning coordination',
        'Monthly income report',
        'Legal compliance assistance',
      ],
      cta: { label: 'Get Started →', href: estimateHref },
    },
    {
      tier:  'Plus',
      name:  '15%',
      unit:  'of gross revenue',
      badge: 'Most Popular',
      featured: true,
      desc:  `Maximum visibility and rate optimisation for your ${city} property.`,
      features: [
        'Everything in Core',
        'Professional photography (included)',
        'Real-time rate optimisation',
        'Listing copywriting & SEO',
        'In-house cleaning (hotel standard)',
        '24/7 guest emergency line',
        'Maintenance coordination',
      ],
      cta: { label: 'Get Started →', href: estimateHref },
    },
    {
      tier:  'Pro',
      name:  'Custom',
      unit:  'for investors & portfolios',
      badge: undefined,
      featured: false,
      desc:  `For luxury villas, penthouses, and multi-property portfolios in ${city}.`,
      features: [
        'Everything in Plus',
        'Dedicated account manager',
        'Guest concierge services',
        'Interior design consultation',
        'Priority maintenance (< 4hrs)',
        'SAT tax filing & accounting',
        'Multi-property portfolio strategy',
      ],
      cta: { label: 'Talk to Us →', href: estimateHref },
    },
  ]
}

// ── City-specific market data ─────────────────────────────

export const CITY_PRICING: Record<string, CityPricingData> = {
  'playa-del-carmen': {
    slug: 'playa-del-carmen',
    name: 'Playa del Carmen',
    nameEs: 'Playa del Carmen',
    avgOccupancy: '78–88%',
    avgNightly: '$110–$260',
    competitionLevel: 'High',
    competitionLevelEs: 'Alta',
    marketNote: 'Playa del Carmen is the Riviera Maya\'s most liquid rental market. High tourist volume year-round means strong occupancy, but listing quality and pricing strategy matter — professional management typically adds 22–35% to self-managed income.',
    marketNoteEs: 'Playa del Carmen es el mercado de renta más activo de la Riviera Maya. El alto volumen de turistas durante todo el año genera ocupación sólida, pero la calidad del anuncio y la estrategia de precios son clave — la gestión profesional suele agregar un 22–35% sobre el ingreso autogestionado.',
    peakSeason: 'December – April (winter), July – August (Mexican summer)',
    peakSeasonEs: 'Diciembre – Abril (invierno), Julio – Agosto (verano mexicano)',
    earnings: [
      {
        type: 'Studio / 1BR',
        typeEs: 'Estudio / 1 Rec',
        nightlyRange: '$110–$160',
        monthlyWithout: '$1,900/mo (self-managed)',
        managementFee: '15% = ~$420/mo',
        monthlyWith: '$2,580/mo net (after fee)',
        uplift: '+$680/mo',
      },
      {
        type: '2BR Condo',
        typeEs: 'Condo 2 Rec',
        nightlyRange: '$160–$220',
        monthlyWithout: '$2,800/mo (self-managed)',
        managementFee: '15% = ~$630/mo',
        monthlyWith: '$3,570/mo net (after fee)',
        uplift: '+$770/mo',
      },
      {
        type: 'Villa / 3BR+',
        typeEs: 'Villa / 3+ Rec',
        nightlyRange: '$220–$380',
        monthlyWithout: '$4,200/mo (self-managed)',
        managementFee: '15% = ~$1,080/mo',
        monthlyWith: '$6,000/mo net (after fee)',
        uplift: '+$1,800/mo',
      },
    ],
  },

  'tulum': {
    slug: 'tulum',
    name: 'Tulum',
    nameEs: 'Tulum',
    avgOccupancy: '65–82%',
    avgNightly: '$150–$450',
    competitionLevel: 'Medium-High',
    competitionLevelEs: 'Media-Alta',
    marketNote: 'Tulum commands the highest nightly rates in Quintana Roo. Eco-luxury positioning, the new international airport, and global media attention make it a premium rental market. Management fees are offset by 30–40% higher nightly rates versus self-managed listings.',
    marketNoteEs: 'Tulum tiene las tarifas nocturnas más altas de Quintana Roo. El posicionamiento eco-lujo, el nuevo aeropuerto internacional y la atención mediática global lo convierten en un mercado premium. Las comisiones de gestión se compensan con tarifas nocturnas 30–40% superiores a los anuncios autogestionados.',
    peakSeason: 'December – March (dry season), July (international tourism peak)',
    peakSeasonEs: 'Diciembre – Marzo (temporada seca), Julio (pico de turismo internacional)',
    earnings: [
      {
        type: 'Studio / 1BR',
        typeEs: 'Estudio / 1 Rec',
        nightlyRange: '$150–$250',
        monthlyWithout: '$2,600/mo (self-managed)',
        managementFee: '15% = ~$580/mo',
        monthlyWith: '$3,280/mo net (after fee)',
        uplift: '+$680/mo',
      },
      {
        type: '2BR Eco-Villa',
        typeEs: 'Eco-Villa 2 Rec',
        nightlyRange: '$280–$420',
        monthlyWithout: '$4,500/mo (self-managed)',
        managementFee: '15% = ~$1,050/mo',
        monthlyWith: '$5,950/mo net (after fee)',
        uplift: '+$1,450/mo',
      },
      {
        type: 'Luxury Villa',
        typeEs: 'Villa de Lujo',
        nightlyRange: '$450–$900',
        monthlyWithout: '$7,200/mo (self-managed)',
        managementFee: '20% = ~$2,400/mo',
        monthlyWith: '$9,600/mo net (after fee)',
        uplift: '+$2,400/mo',
      },
    ],
  },

  'akumal': {
    slug: 'akumal',
    name: 'Akumal',
    nameEs: 'Akumal',
    avgOccupancy: '72–85%',
    avgNightly: '$120–$320',
    competitionLevel: 'Low',
    competitionLevelEs: 'Baja',
    marketNote: 'Akumal\'s supply-constrained market creates a loyal repeat-guest base. The sea turtle snorkelling bay draws nature tourists willing to pay premium rates for beachfront access. Low competition means well-managed listings dominate the top of Airbnb search.',
    marketNoteEs: 'El mercado de oferta limitada de Akumal genera una base de huéspedes recurrentes leales. La bahía de tortugas marinas atrae turistas de naturaleza dispuestos a pagar tarifas premium por acceso a la playa. La baja competencia hace que los anuncios bien gestionados dominen los primeros resultados de Airbnb.',
    peakSeason: 'November – April (dry season), June–July (Mexican school holidays)',
    peakSeasonEs: 'Noviembre – Abril (temporada seca), Junio–Julio (vacaciones escolares mexicanas)',
    earnings: [
      {
        type: 'Studio',
        typeEs: 'Estudio',
        nightlyRange: '$120–$170',
        monthlyWithout: '$2,000/mo (self-managed)',
        managementFee: '15% = ~$450/mo',
        monthlyWith: '$2,550/mo net (after fee)',
        uplift: '+$550/mo',
      },
      {
        type: '2BR Beachfront',
        typeEs: 'Frente al Mar 2 Rec',
        nightlyRange: '$200–$300',
        monthlyWithout: '$3,200/mo (self-managed)',
        managementFee: '15% = ~$720/mo',
        monthlyWith: '$4,080/mo net (after fee)',
        uplift: '+$880/mo',
      },
      {
        type: '3BR+ Villa',
        typeEs: 'Villa 3+ Rec',
        nightlyRange: '$300–$480',
        monthlyWithout: '$4,800/mo (self-managed)',
        managementFee: '15% = ~$1,080/mo',
        monthlyWith: '$6,120/mo net (after fee)',
        uplift: '+$1,320/mo',
      },
    ],
  },

  'puerto-morelos': {
    slug: 'puerto-morelos',
    name: 'Puerto Morelos',
    nameEs: 'Puerto Morelos',
    avgOccupancy: '68–80%',
    avgNightly: '$90–$220',
    competitionLevel: 'Low',
    competitionLevelEs: 'Baja',
    marketNote: 'Puerto Morelos sits between Cancún airport and Playa del Carmen, offering a quieter alternative with strong repeat-visitor rates. The biosphere reserve and world-class reef attract a high-spending, eco-conscious demographic willing to pay above-market rates for quality.',
    marketNoteEs: 'Puerto Morelos se ubica entre el aeropuerto de Cancún y Playa del Carmen, ofreciendo una alternativa tranquila con altas tasas de huéspedes recurrentes. La reserva de la biosfera y el arrecife de clase mundial atraen a un perfil de alto gasto, consciente del medio ambiente, dispuesto a pagar tarifas superiores al mercado por calidad.',
    peakSeason: 'December – April, July',
    peakSeasonEs: 'Diciembre – Abril, Julio',
    earnings: [
      {
        type: 'Studio / 1BR',
        typeEs: 'Estudio / 1 Rec',
        nightlyRange: '$90–$140',
        monthlyWithout: '$1,600/mo (self-managed)',
        managementFee: '15% = ~$360/mo',
        monthlyWith: '$2,040/mo net (after fee)',
        uplift: '+$440/mo',
      },
      {
        type: '2BR Condo',
        typeEs: 'Condo 2 Rec',
        nightlyRange: '$140–$200',
        monthlyWithout: '$2,400/mo (self-managed)',
        managementFee: '15% = ~$540/mo',
        monthlyWith: '$3,060/mo net (after fee)',
        uplift: '+$660/mo',
      },
      {
        type: 'Beachfront Villa',
        typeEs: 'Villa Frente al Mar',
        nightlyRange: '$200–$320',
        monthlyWithout: '$3,600/mo (self-managed)',
        managementFee: '15% = ~$810/mo',
        monthlyWith: '$4,590/mo net (after fee)',
        uplift: '+$990/mo',
      },
    ],
  },

  'xpu-ha': {
    slug: 'xpu-ha',
    name: 'Xpu-Ha',
    nameEs: 'Xpu-Ha',
    avgOccupancy: '60–78%',
    avgNightly: '$180–$650',
    competitionLevel: 'Very Low',
    competitionLevelEs: 'Muy Baja',
    marketNote: 'Xpu-Ha is Quintana Roo\'s highest-ceiling villa market. Zero hotel competition, pristine cenote-fed beach, and exclusivity draw ultra-high-net-worth guests who pay $500–$900+/night without negotiating. Management is essential here — guests expect concierge-level service.',
    marketNoteEs: 'Xpu-Ha es el mercado de villas con mayor potencial de ingresos en Quintana Roo. Sin competencia hotelera, playa alimentada por cenotes y exclusividad que atrae a huéspedes de altísimo patrimonio que pagan $500–$900+/noche sin negociar. La gestión profesional es esencial — los huéspedes esperan servicio de nivel concierge.',
    peakSeason: 'December – April (high season), all-year for premium villas',
    peakSeasonEs: 'Diciembre – Abril (temporada alta), todo el año para villas premium',
    earnings: [
      {
        type: 'Studio / 1BR',
        typeEs: 'Estudio / 1 Rec',
        nightlyRange: '$180–$280',
        monthlyWithout: '$2,800/mo (self-managed)',
        managementFee: '15% = ~$630/mo',
        monthlyWith: '$3,570/mo net (after fee)',
        uplift: '+$770/mo',
      },
      {
        type: '3BR+ Villa',
        typeEs: 'Villa 3+ Rec',
        nightlyRange: '$450–$700',
        monthlyWithout: '$7,000/mo (self-managed)',
        managementFee: '20% = ~$2,100/mo',
        monthlyWith: '$8,400/mo net (after fee)',
        uplift: '+$1,400/mo',
      },
      {
        type: 'Luxury Villa (pool + beach)',
        typeEs: 'Villa de Lujo (piscina + playa)',
        nightlyRange: '$700–$1,200',
        monthlyWithout: '$10,500/mo (self-managed)',
        managementFee: '20% = ~$3,500/mo',
        monthlyWith: '$14,000/mo net (after fee)',
        uplift: '+$3,500/mo',
      },
    ],
  },

  'chetumal': {
    slug: 'chetumal',
    name: 'Chetumal',
    nameEs: 'Chetumal',
    avgOccupancy: '62–75%',
    avgNightly: '$55–$140',
    competitionLevel: 'Very Low',
    competitionLevelEs: 'Muy Baja',
    marketNote: 'Chetumal is Quintana Roo\'s capital and the gateway to Belize. Lower price points are offset by minimal competition, zero existing professional management presence, and steady business travel demand. First-mover advantage is significant here.',
    marketNoteEs: 'Chetumal es la capital de Quintana Roo y la puerta de entrada a Belice. Los precios más bajos se compensan con la competencia mínima, la ausencia de gestión profesional existente y la demanda constante de viajes de negocios. La ventaja de ser pionero aquí es significativa.',
    peakSeason: 'November – April, August (border commerce peaks)',
    peakSeasonEs: 'Noviembre – Abril, Agosto (picos de comercio fronterizo)',
    earnings: [
      {
        type: 'Studio / 1BR',
        typeEs: 'Estudio / 1 Rec',
        nightlyRange: '$55–$90',
        monthlyWithout: '$1,000/mo (self-managed)',
        managementFee: '10% = ~$160/mo',
        monthlyWith: '$1,440/mo net (after fee)',
        uplift: '+$440/mo',
      },
      {
        type: '2BR Apartment',
        typeEs: 'Departamento 2 Rec',
        nightlyRange: '$90–$130',
        monthlyWithout: '$1,600/mo (self-managed)',
        managementFee: '10% = ~$240/mo',
        monthlyWith: '$2,160/mo net (after fee)',
        uplift: '+$560/mo',
      },
      {
        type: '3BR House',
        typeEs: 'Casa 3 Rec',
        nightlyRange: '$120–$180',
        monthlyWithout: '$2,200/mo (self-managed)',
        managementFee: '10% = ~$330/mo',
        monthlyWith: '$2,970/mo net (after fee)',
        uplift: '+$770/mo',
      },
    ],
  },
}

// ── FAQ items — city-aware, full EN+ES ────────────────────

export interface PricingFAQItem {
  question: string
  answer:   string
}

export function getPricingFAQs(
  locale: Locale,
  cityName: string
): PricingFAQItem[] {
  if (locale === 'es') {
    return [
      {
        question: `¿Cuánto cobra PlayaStays por administrar una propiedad en ${cityName}?`,
        answer: `PlayaStays cobra entre el 10% y el 25% de los ingresos brutos de renta dependiendo del plan y el tipo de propiedad. No hay comisión de configuración ni tarifa de retención mensual. Ganamos cuando tú ganas.`,
      },
      {
        question: `¿El porcentaje de comisión se aplica sobre los ingresos brutos o netos?`,
        answer: `La comisión se aplica sobre los ingresos brutos — es decir, lo que paga el huésped antes de descontar limpieza u otros gastos. Esto mantiene la estructura simple y completamente transparente.`,
      },
      {
        question: `¿Qué incluye la tarifa de administración en ${cityName}?`,
        answer: `El plan Plus (15%), el más popular, incluye: fotografía profesional, anuncio en Airbnb/VRBO/Booking.com, precio dinámico en tiempo real, comunicación con huéspedes, limpieza interna, coordinación de mantenimiento, portal del propietario y soporte de emergencia 24/7.`,
      },
      {
        question: `¿Vale la pena la gestión profesional en ${cityName}?`,
        answer: `En promedio, los propietarios bajo gestión profesional de PlayaStays generan 22–38% más ingresos netos que autogestionando, incluso después de descontar la comisión. Esto se debe a mejor ocupación, precios dinámicos y mayor calificación de huéspedes.`,
      },
      {
        question: `¿Existen contratos de permanencia o penalizaciones?`,
        answer: `No hay contratos de largo plazo. Puedes pausar o cancelar el servicio con 30 días de aviso. No se cobra comisión de salida. Nuestro incentivo es que estés satisfecho, no atrapado.`,
      },
      {
        question: `¿Cómo se compara la tarifa de ${cityName} con otras empresas de administración?`,
        answer: `Las empresas de administración de propiedades en la Riviera Maya generalmente cobran entre 15% y 35%. PlayaStays se posiciona en el rango de 10–25% con un nivel de servicio superior al promedio del mercado: equipo local, fotógrafos propios y soporte bilingüe real.`,
      },
    ]
  }

  return [
    {
      question: `How much does PlayaStays charge to manage a property in ${cityName}?`,
      answer: `PlayaStays charges between 10% and 25% of gross rental revenue depending on the plan and property type. There is no setup commission and no monthly retainer. We earn when you earn.`,
    },
    {
      question: `Is the management fee percentage applied to gross or net revenue?`,
      answer: `The fee applies to gross revenue — that is, what the guest pays before cleaning fees or other costs are deducted. This keeps the structure simple and fully transparent.`,
    },
    {
      question: `What's included in the management fee in ${cityName}?`,
      answer: `The Plus plan (15%), our most popular, includes: professional photography, listing on Airbnb/VRBO/Booking.com, real-time dynamic pricing, guest communication, in-house cleaning, maintenance coordination, owner portal, and 24/7 emergency support.`,
    },
    {
      question: `Is professional management worth it in ${cityName}?`,
      answer: `On average, PlayaStays-managed properties earn 22–38% more net income than self-managed equivalents, even after the management fee. This is driven by better occupancy, dynamic pricing, and higher guest ratings that attract premium bookings.`,
    },
    {
      question: `Are there long-term contracts or exit penalties?`,
      answer: `No long-term contracts. You can pause or cancel the service with 30 days' notice. No exit fee is charged. Our incentive is that you stay because you're happy, not because you're locked in.`,
    },
    {
      question: `How does ${cityName} management pricing compare to other companies?`,
      answer: `Property management companies in the Riviera Maya typically charge 15–35%. PlayaStays sits in the 10–25% range with above-market service: local team, in-house photographers, and real bilingual support — not a call centre.`,
    },
  ]
}

// ── Value proposition items ───────────────────────────────

export function getValueItems(locale: Locale) {
  if (locale === 'es') {
    return [
      {
        icon: '📈',
        title: 'Precio dinámico',
        desc: 'Algoritmos en tiempo real ajustan tu tarifa diariamente según la demanda local, eventos y la competencia. El resultado promedio es un 18% más de ingresos vs tarifa fija.',
      },
      {
        icon: '💬',
        title: 'Comunicación con huéspedes',
        desc: 'Respondemos a toda consulta en menos de 5 minutos. Filtrado de huéspedes, gestión de reseñas y resolución de conflictos — todo incluido.',
      },
      {
        icon: '🧹',
        title: 'Limpieza y mantenimiento',
        desc: 'Equipo de limpieza interna certificado bajo estándar hotelero. Coordinación de mantenimiento con red de proveedores verificados en toda la Riviera Maya.',
      },
      {
        icon: '📸',
        title: 'Fotografía y optimización del anuncio',
        desc: 'Fotografía profesional, descripción redactada para conversión y optimización continua para los algoritmos de Airbnb, VRBO y Booking.com.',
      },
      {
        icon: '📊',
        title: 'Portal del propietario',
        desc: 'Dashboard en tiempo real con ingresos, reservas, ocupación y gastos. Depósitos mensuales directos a tu cuenta, con reporte detallado.',
      },
      {
        icon: '⚖️',
        title: 'Cumplimiento legal',
        desc: 'Gestión del RFC turístico, licencias locales y declaraciones de impuestos. Operamos en cumplimiento total con la normativa de Quintana Roo.',
      },
    ]
  }

  return [
    {
      icon: '📈',
      title: 'Dynamic pricing',
      desc: 'Real-time algorithms adjust your rate daily based on local demand, events, and competition. Average outcome: 18% more revenue versus fixed-rate pricing.',
    },
    {
      icon: '💬',
      title: 'Guest communication',
      desc: 'Every enquiry answered in under 5 minutes. Guest screening, review management, and conflict resolution — all included.',
    },
    {
      icon: '🧹',
      title: 'Cleaning & maintenance',
      desc: 'In-house cleaning team certified to hotel standard. Maintenance coordination with a vetted provider network across the Riviera Maya.',
    },
    {
      icon: '📸',
      title: 'Photography & listing optimisation',
      desc: 'Professional photography, conversion-optimised descriptions, and continuous refinement for Airbnb, VRBO, and Booking.com algorithms.',
    },
    {
      icon: '📊',
      title: 'Owner portal',
      desc: 'Real-time dashboard showing income, bookings, occupancy, and expenses. Monthly direct deposits to your account with a full itemised report.',
    },
    {
      icon: '⚖️',
      title: 'Legal compliance',
      desc: 'Tourist RFC registration, local licences, and tax filing managed. We operate in full compliance with Quintana Roo regulations.',
    },
  ]
}

// ── Global hub summary data ───────────────────────────────
// Used on the global /property-management-pricing/ page

export const GLOBAL_CITY_SUMMARY = CITY_PRICING // re-export for hub page

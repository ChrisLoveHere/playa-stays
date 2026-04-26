// ============================================================
// PlayaStays — Pricing Data
//
// Single source of truth for all pricing page content.
// No fetch calls — this is static market intelligence data
// that updates on redeploy. For individual city data that
// needs to be CMS-editable, fall back to City.meta fields.
// ============================================================

import type { Locale } from '@/lib/i18n'
import type { PricingPlan } from '@/types'

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
  /** What drives management fee variability in this market */
  whatAffectsPricing: string[]
  whatAffectsPricingEs: string[]
  /** Appended after base pricing FAQs on city pages */
  extraFaqs: { en: PricingFAQItem[]; es: PricingFAQItem[] }
  /** Why owners in this market benefit from professional management (honest framing, no invented stats) */
  whyMgmtValue: string
  whyMgmtValueEs: string
  /** Condo vs villa / inventory fit — localized, not generic */
  inventoryCondoVilla: string
  inventoryCondoVillaEs: string
  /** Seasonality & demand framing — ranges, not fake precision */
  seasonalityDemand: string
  seasonalityDemandEs: string
  // Fees are identical across cities — only market notes differ
}

/** Primary Riviera Maya resort markets surfaced on the global pricing hub (ordered). */
export const PRICING_HUB_PRIMARY_SLUGS = [
  'playa-del-carmen',
  'tulum',
  'puerto-morelos',
  'akumal',
  'xpu-ha',
  'cozumel',
  'isla-mujeres',
] as const

/** Chetumal remains in CITY_PRICING for calculator + legacy URLs but is a different market profile (state capital / Belize gateway) — see product notes. */

// ── Property Care (all tiers) — used on universal pricing hub "What's included" ─

export type PropertyCareIconId =
  | 'inspection'
  | 'utilities'
  | 'essentials'
  | 'emergency'
  | 'keys'
  | 'vendors'

export interface PropertyCareItemRow {
  id: PropertyCareIconId
  title: string
  description: string
}

const PROPERTY_CARE_ROWS: {
  id: PropertyCareIconId
  title: { en: string; es: string }
  description: { en: string; es: string }
}[] = [
  {
    id: 'inspection',
    title: { en: 'Monthly Property Inspection', es: 'Inspección Mensual de la Propiedad' },
    description: {
      en: 'Walk-throughs on a regular cadence so issues are caught before they get expensive.',
      es: 'Recorridos con calendario fijo para detectar problemas antes de que cuesten más.',
    },
  },
  {
    id: 'utilities',
    title: { en: 'Utility & Condo Fee Management', es: 'Gestión de Servicios y Cuotas de Condominio' },
    description: {
      en: 'Condo / HOA and utility accounts tracked and paid on time — with clear owner visibility.',
      es: 'Cuentas de condominio, HOA y servicios con seguimiento y pago a tiempo, con visibilidad clara para ti.',
    },
  },
  {
    id: 'essentials',
    title: { en: 'Restocking Household Essentials', es: 'Reabastecimiento de Insumos del Hogar' },
    description: {
      en: 'Paper products, hand and bath soap, and other consumables that keep the home turn-key for guests and support strong reviews.',
      es: 'Papel de cocina y baño, jabones para manos y baño, y otros consumibles que mantienen el hogar listo para huéspedes y las reseñas altas.',
    },
  },
  {
    id: 'emergency',
    title: { en: '24/7 Emergency Line', es: 'Línea de Emergencia 24/7' },
    description: {
      en: 'A real contact path for urgent property issues — not a voicemail black hole.',
      es: 'Un canal de contacto real para urgencias, no un buzón sin respuesta.',
    },
  },
  {
    id: 'keys',
    title: { en: 'Local Key & Access Management', es: 'Gestión Local de Llaves y Accesos' },
    description: {
      en: 'Key custody, handoffs, and access aligned with guests, tenants, and your calendar.',
      es: 'Custodia, entregas y accesos alineados con huéspedes, inquilinos y tu calendario.',
    },
  },
  {
    id: 'vendors',
    title: { en: 'Vendor Coordination', es: 'Coordinación de Proveedores' },
    description: {
      en: 'Scheduling, access, and follow-up with trusted local trades and service partners.',
      es: 'Agenda, acceso y seguimiento con técnicos y proveedores locales de confianza.',
    },
  },
]

export function getPropertyCareItems(locale: Locale): PropertyCareItemRow[] {
  return PROPERTY_CARE_ROWS.map((row) => {
    const isEs = locale === 'es'
    return {
      id: row.id,
      title: isEs ? row.title.es : row.title.en,
      description: isEs ? row.description.es : row.description.en,
    }
  })
}

/** One line per item (title only) for lists that expect the legacy string shape. */
export function getPropertyCareDeliverables(locale: Locale): string[] {
  return getPropertyCareItems(locale).map((r) => r.title)
}

// ── Universal pricing hub: CORE / PLUS / PRO (Property Care + % or custom) ─

export function getPricingPlans(
  locale: Locale,
  _cityName: string,
  contactHref: string
): PricingPlan[] {
  if (locale === 'es') {
    return [
      {
        tier: 'CORE',
        name: '10%',
        unit: '',
        hubFeeLayout: true,
        audience: 'Para quienes rentan su propiedad a largo plazo',
        commissionAmount: '10%',
        commissionLabel: 'sobre ingresos de renta a largo plazo',
        propertyCareAddOnLine: '+ $2,150 MXN al mes Cuidado de propiedad',
        badge: undefined,
        featured: false,
        desc: '',
        features: [
          'Inspección Mensual de la Propiedad',
          'Selección y colocación de inquilinos a largo plazo',
          'Cumplimiento y renovación de arrendamientos',
          'Coordinación de entrada y salida',
        ],
        cta: { label: 'Comenzar', href: contactHref },
      },
      {
        tier: 'PLUS',
        name: '15%',
        unit: '',
        hubFeeLayout: true,
        audience: 'Administración activa de renta corta',
        commissionAmount: '15%',
        commissionLabel: 'sobre ingresos de renta corta',
        propertyCareAddOnLine: '+ $2,150 MXN al mes Cuidado de propiedad',
        badge: 'Más popular',
        featured: true,
        desc: '',
        features: [
          'Listado multicanal (Airbnb, VRBO, Booking, directo)',
          'Precio nocturno dinámico',
          'Soporte bilingüe 24/7 a huéspedes',
          'Fotografía profesional y optimización del anuncio',
        ],
        cta: { label: 'Comenzar', href: contactHref },
      },
      {
        tier: 'PRO',
        name: 'Custom',
        unit: '',
        hubFeeLayout: true,
        audience: 'Personalizado para inversionistas y portafolios',
        commissionAmount: 'A medida',
        commissionLabel: 'Personalizado para portafolios',
        propertyCareAddOnLine: '+ $2,150 MXN al mes Cuidado de propiedad (menor en portafolios grandes)',
        badge: undefined,
        featured: false,
        desc: '',
        features: [
          'Todo lo de PLUS',
          'Gerente de cuenta dedicado',
          'Estrategia y reportes de portafolio',
          'Mantenimiento prioritario y coordinación de proveedores',
        ],
        cta: { label: 'Contáctanos', href: contactHref },
      },
    ]
  }

  return [
    {
      tier: 'CORE',
      name: '10%',
      unit: '',
      hubFeeLayout: true,
      audience: 'For owners renting their property long-term',
      commissionAmount: '10%',
      commissionLabel: 'of long-term lease revenue',
      propertyCareAddOnLine: '+ $125/mo Property Care',
      badge: undefined,
      featured: false,
      desc: '',
      features: [
        'Monthly Property Inspection',
        'Long-term tenant placement & screening',
        'Lease compliance & renewals',
        'Move-in / move-out coordination',
      ],
      cta: { label: 'Get started', href: contactHref },
    },
    {
      tier: 'PLUS',
      name: '15%',
      unit: '',
      hubFeeLayout: true,
      audience: 'Active short-term rental management',
      commissionAmount: '15%',
      commissionLabel: 'of short-term rental revenue',
      propertyCareAddOnLine: '+ $125/mo Property Care',
      badge: 'Most Popular',
      featured: true,
      desc: '',
      features: [
        'Multi-channel listing (Airbnb, VRBO, Booking, direct)',
        'Dynamic nightly pricing',
        '24/7 bilingual guest support',
        'Professional photography & listing optimization',
      ],
      cta: { label: 'Get started', href: contactHref },
    },
    {
      tier: 'PRO',
      name: 'Custom',
      unit: '',
      hubFeeLayout: true,
      audience: 'Tailored for investors and portfolios',
      commissionAmount: 'Custom',
      commissionLabel: 'Tailored for portfolios',
      propertyCareAddOnLine: '+ $125/mo Property Care (lower for larger portfolios)',
      badge: undefined,
      featured: false,
      desc: '',
      features: [
        'Everything in PLUS',
        'Dedicated account manager',
        'Portfolio strategy & reporting',
        'Priority maintenance & vendor coordination',
      ],
      cta: { label: 'Talk to us', href: contactHref },
    },
  ]
}

// ── City-specific market data ─────────────────────────────

/** City hub / calculators — undefined when a WP city has no static market block yet. */
export function getCityPricing(citySlug: string): CityPricingData | undefined {
  return CITY_PRICING[citySlug]
}

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
    whatAffectsPricing: [
      'Property type: studios vs larger condos vs villas changes turnover time and cleaning load.',
      'Location within the city (beach zone vs inland) shifts achievable ADR and competition.',
      'Seasonality is strong — winter and summer peaks reward dynamic pricing and fast guest response.',
    ],
    whatAffectsPricingEs: [
      'Tipo de propiedad: estudios vs condominios más grandes vs villas cambia tiempo de turnover y carga de limpieza.',
      'Ubicación (zona de playa vs interior) mueve la ADR alcanzable y la competencia.',
      'La estacionalidad es fuerte — picos de invierno y verano premian precio dinámico y respuesta rápida.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'What does property management cost in Playa del Carmen?',
          answer: 'Most owners see total management in the 10–25% of gross revenue range depending on plan and inventory. The fee buys listing optimisation, guest operations, and local coordination — not a distant call centre.',
        },
        {
          question: 'Are fees higher for beachfront or larger homes?',
          answer: 'Higher nightly rates and more bedrooms usually mean more guest messaging, housekeeping, and maintenance coordination. We quote scope after reviewing the property so the percentage matches the work.',
        },
        {
          question: 'Does seasonality change the value of management?',
          answer: 'Yes. When demand swings between peak and shoulder seasons, dynamic pricing and fast turnaround matter more — that is where professional management typically pays for itself.',
        },
      ],
      es: [
        {
          question: '¿Cuánto cuesta la administración de propiedades en Playa del Carmen?',
          answer: 'La mayoría de los propietarios se sitúa en un rango del 10–25% sobre ingresos brutos según plan e inventario. La tarifa cubre optimización del anuncio, operación con huéspedes y coordinación local.',
        },
        {
          question: '¿Son mayores las comisiones frente al mar o en casas grandes?',
          answer: 'Tarifas nocturnas más altas y más recámaras suelen implicar más mensajería, limpieza y mantenimiento. Cotizamos el alcance tras revisar la propiedad.',
        },
        {
          question: '¿La estacionalidad cambia el valor de la gestión?',
          answer: 'Sí. Cuando la demanda varía entre temporada alta y media, el precio dinámico y la rapidez de respuesta importan más — ahí la gestión profesional suele pagarse sola.',
        },
      ],
    },
    whyMgmtValue:
      'High listing counts mean small gaps in photos, pricing, or response time cost bookings. Local operations handle turnovers, guest messaging, and maintenance so the home stays competitive without you managing calendars from abroad.',
    whyMgmtValueEs:
      'Muchos anuncios implican que pequeños huecos en fotos, precio o tiempo de respuesta cuestan reservas. Operación local maneja turnovers, mensajes y mantenimiento para que la propiedad compita sin que administres calendarios desde el extranjero.',
    inventoryCondoVilla:
      'Studios and two-bedroom condos are the volume segment; larger condos and villas can support higher ADR in beach-adjacent zones but add housekeeping and vendor coordination.',
    inventoryCondoVillaEs:
      'Estudios y condominios de dos recámaras mueven volumen; condominios grandes y villas pueden sostener ADR más alto cerca de la playa, con más limpieza y coordinación de proveedores.',
    seasonalityDemand:
      'Winter and summer peaks are the main lifts; shoulder months reward dynamic pricing, minimum stays, and fast guest response rather than a flat year-round rate.',
    seasonalityDemandEs:
      'Invierno y verano marcan los picos; los meses intermedios premian precio dinámico, estadías mínimas y respuesta rápida frente a una tarifa plana todo el año.',
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
    whatAffectsPricing: [
      'Eco-luxury positioning and amenity level (pool, jungle setting) drive nightly rate and upkeep.',
      'Airport and road access continue to shift booking patterns — marketing and distribution matter.',
      'Villas and larger homes need more coordination than compact condos.',
    ],
    whatAffectsPricingEs: [
      'El posicionamiento eco-lujo y el nivel de amenidades (alberca, entorno selvático) mueven tarifa y mantenimiento.',
      'El acceso aéreo y carretero sigue cambiando patrones de reserva — marketing y canales importan.',
      'Villas y casas grandes requieren más coordinación que condominios compactos.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'Why can nightly rates in Tulum be higher than elsewhere?',
          answer: 'Guests often book for design, privacy, and experience — not just beds. Listings that present well and price dynamically capture that premium; self-managed calendars often leave money on the table.',
        },
        {
          question: 'Are management fees higher for jungle villas?',
          answer: 'Larger homes usually mean more guest support, housekeeping, and vendor coordination. We align the plan to the property so the fee reflects real workload.',
        },
        {
          question: 'Does seasonality affect Tulum more than Playa del Carmen?',
          answer: 'Both markets are seasonal, but the mix of international travellers and eco-tourism in Tulum can sharpen peaks. Professional pricing and response times help capture demand when it appears.',
        },
      ],
      es: [
        {
          question: '¿Por qué las tarifas en Tulum pueden ser más altas?',
          answer: 'Los huéspedes suelen pagar por diseño, privacidad y experiencia. Los anuncios bien presentados y con precio dinámico capturan esa prima.',
        },
        {
          question: '¿Son mayores las comisiones en villas en la selva?',
          answer: 'Las casas grandes suelen implicar más soporte, limpieza y coordinación de proveedores. Ajustamos el plan a la propiedad.',
        },
        {
          question: '¿La estacionalidad afecta más a Tulum que a Playa del Carmen?',
          answer: 'Ambos mercados son estacionales; en Tulum los picos pueden acentuarse. Precio dinámico y respuesta rápida ayudan a capturar la demanda.',
        },
      ],
    },
    whyMgmtValue:
      'Wide nightly ranges and sharp seasonality mean self-managed calendars often underprice peaks or miss occupancy in slower weeks. Distribution, photography, and response discipline matter as much as the headline rate.',
    whyMgmtValueEs:
      'Rangos nocturnos amplios y estacionalidad fuerte hacen que calendarios autogestionados a menudo dejen dinero en picos o pierdan ocupación en semanas lentas. Distribución, fotos y disciplina de respuesta importan tanto como la tarifa.',
    inventoryCondoVilla:
      'Eco-style condos and smaller homes move booking volume; jungle and beach villas trade on privacy and amenities with more housekeeping, pool care, and guest support.',
    inventoryCondoVillaEs:
      'Condominios eco y casas pequeñas mueven volumen; villas en selva o playa venden privacidad y amenidades con más limpieza, alberca y soporte al huésped.',
    seasonalityDemand:
      'Dry season and holiday clusters lift rates; shoulder periods need deliberate pricing and stay rules rather than copying peak numbers year-round.',
    seasonalityDemandEs:
      'Temporada seca y fechas festivas levantan tarifas; los hombros necesitan precio y reglas de estadía deliberadas, no copiar picos todo el año.',
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
    whatAffectsPricing: [
      'Beachfront and snorkelling demand create premium weekends — listings must stay review-strong.',
      'Smaller inventory means fewer comps — photography and positioning matter more.',
      'Turnover between nature-focused guests can be steady; cleaning standards stay high.',
    ],
    whatAffectsPricingEs: [
      'La demanda frente al mar y de snorkel crea fines de semana premium — hay que mantener reseñas fuertes.',
      'Menor inventario implica menos comparables — fotografía y posicionamiento importan más.',
      'El turnover entre huéspedes de naturaleza puede ser estable; la limpieza debe mantenerse alta.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'Is Akumal less competitive than Playa del Carmen?',
          answer: 'Often yes in terms of listing count, but guests still compare you to the whole Riviera Maya online. Professional listing quality and pricing keep you visible.',
        },
        {
          question: 'Are beachfront units harder to manage?',
          answer: 'Sand, salt air, and guest expectations for views mean housekeeping and maintenance checks are more frequent — scope is reflected in how we operate the home.',
        },
        {
          question: 'Does guest profile differ in Akumal?',
          answer: 'Many guests prioritise nature and quieter stays. Messaging and house rules help set the right expectations and protect your asset.',
        },
      ],
      es: [
        {
          question: '¿Akumal es menos competitivo que Playa del Carmen?',
          answer: 'A menudo sí en número de anuncios, pero los huéspedes comparan toda la Riviera en línea. Calidad del anuncio y precio mantienen visibilidad.',
        },
        {
          question: '¿Es más difícil gestionar frente al mar?',
          answer: 'Arena, sal y expectativas de vistas implican limpieza y mantenimiento más frecuentes.',
        },
        {
          question: '¿El perfil del huésped es distinto?',
          answer: 'Muchos buscan naturaleza y estadías tranquilas. Mensajería y reglas claras protegen tu propiedad.',
        },
      ],
    },
    whyMgmtValue:
      'Fewer direct comps mean your listing quality and review velocity matter more, not less — guests still shop the whole corridor online. On-the-ground coordination for beach access, snorkel guests, and maintenance protects income and asset condition.',
    whyMgmtValueEs:
      'Menos comparables directos hacen que calidad del anuncio y reseñas importen más, no menos — los huéspedes comparan todo el corredor. Coordinación local para playa, snorkel y mantenimiento protege ingresos y el activo.',
    inventoryCondoVilla:
      'Compact condos suit weekend and repeat demand; larger beachfront homes need tighter housekeeping cadence and more vendor touchpoints than a mid-city apartment.',
    inventoryCondoVillaEs:
      'Condominios compactos encajan con fines de semana y huéspedes recurrentes; casas frente al mar requieren limpieza más estricta y más proveedores que un departamento céntrico.',
    seasonalityDemand:
      'Dry season and school holidays lift weekends; quieter months still draw nature-focused travellers — pricing should reflect realistic shoulder demand, not generic “Riviera” averages.',
    seasonalityDemandEs:
      'Temporada seca y vacaciones escolares levantan fines de semana; meses tranquilos aún traen huéspedes de naturaleza — el precio debe reflejar hombros realistas, no promedios genéricos.',
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
    whatAffectsPricing: [
      'Proximity to Cancún airport vs beach tranquillity — guests balance convenience and calm.',
      'Reef and eco positioning supports mid-premium ADR when listings are well maintained.',
      'Smaller town feel means repeat guests and reputation matter for occupancy.',
    ],
    whatAffectsPricingEs: [
      'Cercanía al aeropuerto de Cancún vs tranquilidad en la playa — los huéspedes equilibran conveniencia y calma.',
      'Arrecife y posicionamiento eco sostienen ADR medio-alto con inventario bien cuidado.',
      'Ambiente de pueblo pequeño: huéspedes recurrentes y reputación importan para ocupación.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'How does Puerto Morelos compare for fees vs larger cities?',
          answer: 'The percentage range is the same PlayaStays band (10–25%) — what changes is achievable ADR and occupancy for your specific home. We quote after reviewing the asset.',
        },
        {
          question: 'Is maintenance coordination different here?',
          answer: 'Salt air and humidity affect all coastal homes. We coordinate vendors proactively so small issues do not become review problems.',
        },
        {
          question: 'Do guests stay longer?',
          answer: 'Some markets skew slightly longer stays. That can reduce turnover cost but changes how you price weeks — we model both.',
        },
      ],
      es: [
        {
          question: '¿Cómo se comparan las tarifas con ciudades más grandes?',
          answer: 'El rango de porcentaje es el mismo (10–25%) — cambia la ADR y ocupación de tu casa. Cotizamos tras revisar la propiedad.',
        },
        {
          question: '¿El mantenimiento es distinto?',
          answer: 'Salitre y humedad afectan toda costa. Coordinamos proveedores para que problemas pequeños no se vuelvan malas reseñas.',
        },
        {
          question: '¿Los huéspedes se quedan más días?',
          answer: 'Algunos mercados inclinan a estancias más largas — modelamos precios por semana y por noche.',
        },
      ],
    },
    whyMgmtValue:
      'Repeat guests and word-of-mouth matter in a smaller market — inconsistent cleaning or slow replies show up in occupancy fast. Professional ops keep standards steady while you are not on site.',
    whyMgmtValueEs:
      'Huéspedes recurrentes y reputación importan en un mercado pequeño — limpieza irregular o respuestas lentas se notan en ocupación. Operación profesional mantiene estándares sin que estés en sitio.',
    inventoryCondoVilla:
      'Condos near the reef and town centre skew mid-market volume; beachfront villas capture premium weeks with higher salt-air upkeep and turnover coordination.',
    inventoryCondoVillaEs:
      'Condominios cerca del arrecife y del centro mueven volumen medio; villas frente al mar capturan semanas premium con más mantenimiento por salitre y coordinación de turnovers.',
    seasonalityDemand:
      'Winter sun-seekers and summer family travel create predictable peaks; eco-minded guests often favour slightly longer stays than party strips — calendars should match that mix.',
    seasonalityDemandEs:
      'Busca de sol en invierno y familias en verano marcan picos; huéspedes eco suelen favorecer estancias algo más largas que zonas de fiesta — el calendario debe reflejar esa mezcla.',
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
    whatAffectsPricing: [
      'Ultra-low competition at the top end — presentation and service level drive reviews and rebooking.',
      'Large homes imply pool, grounds, and vendor coordination — scope scales with square metres.',
      'Guest expectations for privacy and concierge-style support are higher than in a standard condo.',
    ],
    whatAffectsPricingEs: [
      'Competencia baja en el segmento alto — presentación y servicio mueven reseñas y re-reservas.',
      'Casas grandes implican alberca, jardines y más coordinación de proveedores.',
      'Mayor expectativa de privacidad y apoyo estilo concierge frente a un condominio estándar.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'Why are Xpu-Ha nightly ranges so wide?',
          answer: 'The market spans compact beach condos through large pool villas. Your achievable rate depends on size, finish level, and how well the listing converts — we model that in a quote.',
        },
        {
          question: 'Is management more intensive for villas?',
          answer: 'Yes: more moving parts (pool, landscaping, multiple bathrooms). The fee reflects coordinated operations, not just a percentage on paper.',
        },
        {
          question: 'Do guests expect faster response times?',
          answer: 'Premium guests expect rapid answers and smooth check-in. Our local team is structured for that workload.',
        },
      ],
      es: [
        {
          question: '¿Por qué el rango nocturno en Xpu-Ha es tan amplio?',
          answer: 'El mercado va de condominios frente al mar hasta villas grandes. La tarifa depende de tamaño, acabados y conversión del anuncio.',
        },
        {
          question: '¿La gestión es más intensiva en villas?',
          answer: 'Sí: más piezas móviles (alberca, jardines). La tarifa refleja operación coordinada.',
        },
        {
          question: '¿Los huéspedes esperan respuesta más rápida?',
          answer: 'Los huéspedes premium esperan respuestas y check-in fluidos. El equipo local está estructurado para esa carga.',
        },
      ],
    },
    whyMgmtValue:
      'Guest expectations for privacy, pool/beach standards, and rapid support run high — remote owners rarely want to coordinate vendors and turnovers for large homes alone. The fee aligns to real workload, not just a percentage on paper.',
    whyMgmtValueEs:
      'Las expectativas de privacidad, alberca/playa y soporte rápido son altas — pocos propietarios remotos quieren coordinar proveedores y turnovers solos. La tarifa refleja carga real, no solo un porcentaje.',
    inventoryCondoVilla:
      'Beach condos exist, but the segment is villa-heavy: pools, grounds, and beach access scale operations faster than bedroom count. Larger homes need staffing and vendor rhythms matched to the asset.',
    inventoryCondoVillaEs:
      'Hay condominios frente al mar, pero el mercado es muy de villas: alberca, jardín y playa escalan operación más rápido que el número de recámaras. Las casas grandes necesitan ritmo de personal y proveedores acorde al activo.',
    seasonalityDemand:
      'Holiday weeks and dry season concentrate demand; premium homes can still earn in off-peak with the right minimum stays and service positioning — but peak/off-peak spreads are real.',
    seasonalityDemandEs:
      'Semanas festivas y temporada seca concentran demanda; casas premium aún pueden ganar en temporada baja con estadías mínimas y servicio — pero los spreads alto/bajo son reales.',
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
    whatAffectsPricing: [
      'Mix of business and border-adjacent travel — weekday vs weekend demand can differ from beach resorts.',
      'Lower ADR than Riviera beach markets — fee percentage is the same band, but net dollars per booking differ.',
      'Property condition and long-stay vs short-stay strategy change operational intensity.',
    ],
    whatAffectsPricingEs: [
      'Mezcla de viajes de negocios y frontera — la demanda entre semana vs fin de semana difiere de los destinos de playa.',
      'ADR más baja que en playas de la Riviera — el porcentaje es el mismo rango, pero los dólares netos por reserva cambian.',
      'Condición de la propiedad y estancias largas vs cortas cambian la intensidad operativa.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'Is Chetumal priced like Playa del Carmen?',
          answer: 'Nightly rates and occupancy profiles are different — Chetumal is not a beach-resort strip. The management fee is still performance-based (10–25% band); we model realistic revenue for the asset class.',
        },
        {
          question: 'Who is the typical guest?',
          answer: 'Expect a blend of business travellers, regional visitors, and Belize-crossing trips depending on the property. Messaging and minimum stays should match that reality.',
        },
        {
          question: 'Does PlayaStays still use the same inclusions?',
          answer: 'Core services are the same owner-first stack — scaled to what the home actually needs in this market.',
        },
      ],
      es: [
        {
          question: '¿Chetumal se precifica como Playa del Carmen?',
          answer: 'Las tarifas y ocupación son distintas — no es una franja de playa resort. La comisión sigue siendo por desempeño (banda 10–25%); modelamos ingresos realistas.',
        },
        {
          question: '¿Quién es el huésped típico?',
          answer: 'Mezcla de negocios, visitantes regionales y cruces a Belice según la propiedad.',
        },
        {
          question: '¿Los servicios incluidos son los mismos?',
          answer: 'El mismo enfoque para propietarios — escalado a lo que la casa necesita en este mercado.',
        },
      ],
    },
    whyMgmtValue:
      'Guest mix and trip purpose differ from beach resorts — playbooks copied from Playa or Cancún often misfire. Clear messaging, realistic pricing, and dependable turnovers matter for steady performance without beach-style ADR.',
    whyMgmtValueEs:
      'La mezcla de huéspedes y el motivo del viaje difieren de playas — copiar guiones de Playa o Cancún suele fallar. Mensajes claros, precio realista y turnovers confiables importan sin ADR estilo resort.',
    inventoryCondoVilla:
      'Smaller apartments near services suit business and midweek patterns; larger homes may lean groups or longer stays — we scope workload to the asset, not a one-size template.',
    inventoryCondoVillaEs:
      'Departamentos cerca de servicios encajan negocios y entre semana; casas grandes pueden inclinar grupos o estancias largas — el alcance sigue al activo, no a una plantilla única.',
    seasonalityDemand:
      'Peaks follow regional travel and border-adjacent patterns more than classic “winter sun” beach curves — calendars should reflect weekday vs weekend demand honestly.',
    seasonalityDemandEs:
      'Los picos siguen viajes regionales y frontera más que curvas clásicas de sol invernal — el calendario debe reflejar demanda entre semana vs fin de semana con honestidad.',
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

  'isla-mujeres': {
    slug: 'isla-mujeres',
    name: 'Isla Mujeres',
    nameEs: 'Isla Mujeres',
    avgOccupancy: '72–85%',
    avgNightly: '$140–$340',
    competitionLevel: 'Medium',
    competitionLevelEs: 'Media',
    marketNote: 'Isla Mujeres is a small island with constrained supply and year-round demand driven by day-trippers, honeymooners, and divers. North Beach commands the highest rates — its calm, shallow water is famous throughout the Caribbean. Well-managed listings consistently outperform self-managed ones because guest arrival logistics (the ferry from Cancún) reward owners who handle communication proactively.',
    marketNoteEs: 'Isla Mujeres es una isla pequeña con oferta limitada y demanda durante todo el año impulsada por visitantes de un día, lunamieleros y buzos. Playa Norte obtiene las tarifas más altas — su agua tranquila y poco profunda es famosa en todo el Caribe. Los anuncios bien gestionados superan consistentemente a los autogestionados porque la logística de llegada de huéspedes (el ferry desde Cancún) recompensa a los propietarios que gestionan la comunicación de forma proactiva.',
    peakSeason: 'December – April (high season), July – August (summer peak)',
    peakSeasonEs: 'Diciembre – Abril (temporada alta), Julio – Agosto (pico de verano)',
    whatAffectsPricing: [
      'Constrained island supply: small shifts in service quality, reviews, and photo conversion move ADR and occupancy more than in spread-out mainland markets.',
      'Ferry timing from Cancún: arrival windows, luggage, and guest messaging are part of the product — not a footnote.',
      'North Beach vs. interior: calm-water positioning commands premium, but also guest density and weekend noise patterns differ.',
    ],
    whatAffectsPricingEs: [
      'Oferta isleña acotada: pequeños cambios en servicio, reseñas y conversión de fotos mueven ADR y ocupación más que en mercados amplios en tierra.',
      'Horarios de ferry desde Cancún: ventanas de llegada, equipaje y mensajería son parte del producto.',
      'Playa Norte vs interior: el posicionamiento de agua calma pide premio, pero la densidad de huéspedes y el ruido de fin de semana cambian.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'Is management pricing different on Isla Mujeres?',
          answer: 'The percentage band is the same 10–25% performance model — workload shifts toward ferry timing, high-frequency turnovers, and guest communication. We scope the home in a property review.',
        },
        {
          question: 'Do North Beach homes need different pricing rules?',
          answer: 'They often can carry higher ADR, but you still need the right minimum stays, weekend curves, and proactive messaging when weather or ferry schedules wobble.',
        },
        {
          question: 'Can owners manage the island from abroad without hurting revenue?',
          answer: 'It is possible but high-friction: ferries, golf carts, and guest expectations for fast answers. Most owners we see scale faster with local ops and tight playbooks than DIY inbox + cleaners.',
        },
      ],
      es: [
        {
          question: '¿El precio de gestión en Isla Mujeres es distinto?',
          answer: 'El rango porcentual sigue 10–25% por desempeño; la carga se mueve a ferry, turnovers y mensajería. Ajustamos en revisión de propiedad.',
        },
        {
          question: '¿Playa Norte necesita reglas de precio distintas?',
          answer: 'A menudo soporta ADR más altos, pero siguen haciendo falta estadías mínimas, curvas de fin de semana y mensajería activa con clima o ferry.',
        },
        {
          question: '¿Puedo operar en remoto sin perder ingresos?',
          answer: 'Es posible pero con fricción: ferries, carritos y expectativas de respuesta. La mayoría escala más rápido con operación local y playbooks ajustados que DIY.',
        },
      ],
    },
    whyMgmtValue:
      'Ferry-based arrivals turn guest communication and check-in into revenue drivers. Owners who are proactive and consistent on messaging turn fewer “where is the dock?” threads into review risk — and North Beach’s premium is lost fast when the guest journey feels chaotic.',
    whyMgmtValueEs:
      'Llegadas con ferries hacen de la mensajería y el check-in un motor de ingresos. La proactividad reduce hilos de “¿dónde muelle?” en riesgo de reseñas; el premio de Playa Norte se pierde si el viaje del huésped se siente caótico.',
    inventoryCondoVilla:
      'From compact in-town units to high-ADR beachfront, inventory is small-island: tight housekeeping timing, easy golf-cart access, and salt/UV wear show up in maintenance faster than in comparable mainland condos.',
    inventoryCondoVillaEs:
      'Desde unidades compactas en pueblo hasta frente de playa, el inventario es de isla chica: turnovers en tiempo, acceso con carrito y desgaste por sal/UV se notan más que en un condo similar en tierra.',
    seasonalityDemand:
      'All-season day-trip and long-weekend pressure mixes with high-season “fly-and-ferry” travel — your calendar and minimum stays have to be honest to both, not a mainland default.',
    seasonalityDemandEs:
      'Presión todo el año por excursiones y fines de largos mezclada con temporada alta vuelo+ferry — el calendario y estadías mínimas deben ser honestos a ambos, no un default continental.',
    earnings: [
      {
        type: 'Studio / 1BR',
        typeEs: 'Estudio / 1 Rec',
        nightlyRange: '$140–$220',
        monthlyWithout: '$2,400/mo (self-managed)',
        managementFee: '15% = ~$540/mo',
        monthlyWith: '$3,060/mo net (after fee)',
        uplift: '+$660/mo',
      },
      {
        type: '2BR Condo',
        typeEs: 'Condominio 2 Rec',
        nightlyRange: '$220–$340',
        monthlyWithout: '$3,800/mo (self-managed)',
        managementFee: '15% = ~$855/mo',
        monthlyWith: '$4,845/mo net (after fee)',
        uplift: '+$1,045/mo',
      },
      {
        type: 'Beachfront Villa',
        typeEs: 'Villa Frente al Mar',
        nightlyRange: '$340–$650',
        monthlyWithout: '$6,400/mo (self-managed)',
        managementFee: '20% = ~$1,760/mo',
        monthlyWith: '$7,040/mo net (after fee)',
        uplift: '+$640/mo',
      },
    ],
  },

  'cozumel': {
    slug: 'cozumel',
    name: 'Cozumel',
    nameEs: 'Cozumel',
    avgOccupancy: '65–80%',
    avgNightly: '$110–$280',
    competitionLevel: 'Medium',
    competitionLevelEs: 'Media',
    marketNote: 'Cozumel is driven by two very different guest profiles: cruise-ship day visitors and multi-night stays from divers and return travelers. San Miguel and the west-side beachfront corridor see the strongest rental demand. Cruise seasonality creates predictable peaks and valleys — professional management smooths revenue by capturing the longer-stay dive and leisure market that overlaps with cruise weekdays.',
    marketNoteEs: 'Cozumel es impulsado por dos perfiles de huéspedes muy distintos: visitantes de crucero por un día y estancias de varias noches de buzos y viajeros recurrentes. San Miguel y el corredor frente al mar del lado oeste tienen la mayor demanda de renta. La estacionalidad de los cruceros crea picos y valles predecibles — la gestión profesional equilibra los ingresos capturando el mercado de estancias más largas de buceo y ocio que se superpone con los días de crucero.',
    peakSeason: 'December – April (high season + cruise peak), July (dive peak)',
    peakSeasonEs: 'Diciembre – Abril (temporada alta + pico de cruceros), Julio (pico de buceo)',
    whatAffectsPricing: [
      'Cruise week patterns vs. multi-night divers: the calendar is not a single “beach high season” — minimum stays, messaging, and turnover buffers must follow both.',
      'Location on the west side / San Miguel vs. quieter areas changes ADR, walkability, and how fast guests expect answers on dive gear and access.',
      'Air and salt exposure: maintenance intensity varies materially by elevation to the water and the building envelope.',
    ],
    whatAffectsPricingEs: [
      'Calendario de cruceros vs buzos con varias noches: no es una sola curva de playa — estadías, mensajería y colchón de turnovers deben servir a ambas.',
      'Lado oeste / San Miguel vs zonas calmadas: distinto ADR, caminabilidad y expectativa de respuesta (buceo, acceso).',
      'Sal y humedad: la carga de mantenimiento varía con cercanía al mar y el envolvente del inmueble.',
    ],
    extraFaqs: {
      en: [
        {
          question: 'How do you price around cruise days without chasing noise?',
          answer: 'We use stay rules, weekend vs weekday curves, and minimum nights that line up to real demand. The goal is capture without burning cleaning capacity on impossible turn windows.',
        },
        {
          question: 'Is Cozumel management the same as Playa del Carmen?',
          answer: 'Same 10–25% band and owner-first inclusions, but the workload profile differs: more cruise-adjacent peaks, dive trip messaging, and island vendor constraints.',
        },
        {
          question: 'Do west-side homes always earn more than interior?',
          answer: 'They often can, but not automatically — it depends on finish, guest capacity, and how the listing competes. We model a realistic comp set for the exact unit.',
        },
      ],
      es: [
        {
          question: '¿Cómo se precifica con días de crucero sin ruido?',
          answer: 'Reglas de estadía, curvas fin de semana y noches mínimas alineadas a la demanda real. El objetivo es capturar sin quemar limpieza en ventanas de turnover imposibles.',
        },
        {
          question: '¿Cozumel se gestiona como Playa del Carmen?',
          answer: 'Mismo rango 10–25% e inclusiones, pero con más picos por cruceros, mensajes de buceo y proveedores en isla.',
        },
        {
          question: '¿Siempre gana más el frente oeste que el interior?',
          answer: 'A menudo puede, no automáticamente: acabado, capacidad y competencia del anuncio. Modelamos un comp set real a la unidad.',
        },
      ],
    },
    whyMgmtValue:
      'Cruise seasonality and dive-trip guests create a two-speed calendar. Professional management protects revenue on the “bridge” days between peaks — when DIY hosts often over-discount to fill awkward gaps, or under-communicate and take review hits on ferry timing.',
    whyMgmtValueEs:
      'La estacionalidad de cruceros y los viajes de buceo crean un calendario a dos ritmos. La gestión profesional protege ingresos en días “puente” entre picos, donde el DIY suele descontar de más o fallar en mensajería con el ferry y las reseñas lo pagan.',
    inventoryCondoVilla:
      'Condos near the ferry and town support shorter, logistics-heavy stays; larger west-beach and villa inventory rewards proactive maintenance and high-touch guest comms, especially for dive and multi-night groups.',
    inventoryCondoVillaEs:
      'Condominios cerca del ferry y el pueblo encajan estancias más cortas y logísticas; inventario de playa oeste y villas premia mantenimiento proactivo y atención al huésped, en especial con buzo y grupos de varias noches.',
    seasonalityDemand:
      'Cruise weeks lift demand in predictable surges, while the dive/returning guest market rewards consistent multi-night performance — the best operators price for both, not a single “Caribbean high season” template.',
    seasonalityDemandEs:
      'Los cruceros levantan demanda en rachas predecibles, mientras el mercado de buzo y recurrencia exige desempeño en estancias largas. Los mejores operadores precifican para ambos, no un único pico “caribeño”.',
    earnings: [
      {
        type: 'Studio / 1BR',
        typeEs: 'Estudio / 1 Rec',
        nightlyRange: '$110–$180',
        monthlyWithout: '$2,000/mo (self-managed)',
        managementFee: '15% = ~$450/mo',
        monthlyWith: '$2,550/mo net (after fee)',
        uplift: '+$550/mo',
      },
      {
        type: '2BR Beachfront',
        typeEs: 'Frente al Mar 2 Rec',
        nightlyRange: '$180–$300',
        monthlyWithout: '$3,300/mo (self-managed)',
        managementFee: '15% = ~$740/mo',
        monthlyWith: '$4,160/mo net (after fee)',
        uplift: '+$860/mo',
      },
      {
        type: '3BR+ Villa',
        typeEs: 'Villa 3+ Rec',
        nightlyRange: '$300–$520',
        monthlyWithout: '$5,400/mo (self-managed)',
        managementFee: '20% = ~$1,440/mo',
        monthlyWith: '$5,760/mo net (after fee)',
        uplift: '+$360/mo',
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
): PricingFAQItem[] {
  if (locale === 'es') {
    return [
      {
        question: '¿Cuánto cobra PlayaStays?',
        answer:
          'Cada plan incluye una tarifa de $2,150 MXN al mes de Cuidado de Propiedad. Adicionalmente, CORE es 10% sobre ingresos de renta a largo plazo cuando hay inquilino; PLUS es 15% sobre ingresos de renta corta; PRO es personalizado para portafolios. No hay cuotas iniciales ni contratos largos.',
      },
      {
        question: '¿El porcentaje de comisión se aplica sobre los ingresos brutos o netos?',
        answer: `La comisión se aplica sobre los ingresos brutos — es decir, lo que paga el huésped antes de descontar limpieza u otros gastos. Esto mantiene la estructura simple y completamente transparente.`,
      },
      {
        question: '¿Qué incluye la tarifa de administración?',
        answer:
          'La tarifa de $2,150 MXN al mes de Cuidado de Propiedad incluye inspección mensual, gestión de servicios y cuotas de condominio, reabastecimiento de insumos del hogar (papel, jabones y consumibles esenciales para huéspedes), línea de emergencia 24/7, gestión local de llaves y accesos, y coordinación de proveedores. El porcentaje sobre ingresos de renta cubre la administración activa — listado, precios, comunicación con huéspedes, fotografía, coordinación de limpieza, y reportes.',
      },
      {
        question: '¿La limpieza, el mantenimiento y los insumos están incluidos en la tarifa?',
        answer:
          'Limpieza y mantenimiento se facturan aparte: los paga el propietario o el huésped, según el caso y cómo esté estructurada la reserva. Sí cubrimos reabastecer lo esencial: papel higiénico y de cocina, jabones de manos y de baño, y demás consumibles que mantengan la propiedad impecable y las reseñas altas — sin sorpresas al inventario básico.',
      },
      {
        question: '¿Vale la pena la administración profesional?',
        answer:
          'Para la mayoría de los propietarios, sí. Las propiedades autogestionadas suelen reservar entre 60–70% del ingreso de las gestionadas profesionalmente debido a respuestas inconsistentes con huéspedes, precios mal ajustados y menor velocidad de reseñas. Además del ingreso, el costo de tiempo es significativo — los huéspedes escriben a toda hora, surgen problemas, y los cambios de huésped no se pausan en vacaciones. PlayaStays existe para quitarte eso de encima.',
      },
      {
        question: '¿Existen contratos de permanencia o penalizaciones?',
        answer: `No hay contratos de largo plazo. Puedes pausar o cancelar el servicio con 30 días de aviso. No se cobra comisión de salida. Nuestro incentivo es que estés satisfecho, no atrapado.`,
      },
      {
        question: '¿Puedo cambiar de plan si mis necesidades cambian?',
        answer:
          'Sí. Si empezaste en CORE para cuidado de propiedad y decides comenzar con renta corta, te movemos a PLUS. Lo opuesto también funciona — si dejas la renta corta y prefieres inquilinos a largo plazo, puedes bajar a CORE. No atamos a los propietarios a planes que ya no encajan con su uso.',
      },
      {
        question: '¿Cómo se compara el precio de PlayaStays con el de otras empresas?',
        answer:
          'Las empresas de administración en la Riviera Maya suelen cobrar entre 15–35% del ingreso más cuotas mensuales, frecuentemente atadas a contratos de varios años. PlayaStays cobra 10% sobre rentas a largo plazo, 15% sobre rentas cortas, más una tarifa fija de $2,150 MXN al mes de Cuidado de Propiedad — sin contratos largos. Más un equipo local real, fotógrafos internos y soporte bilingüe real — no un call center.',
      },
    ]
  }

  return [
    {
      question: 'How much does PlayaStays charge?',
      answer:
        "Every plan includes a $125/mo Property Care fee. On top of that, CORE is 10% of long-term lease revenue when a tenant is in place; PLUS is 15% of short-term rental revenue; PRO is custom for portfolios. There are no setup fees and no long-term contracts.",
    },
    {
      question: 'Is the management fee percentage applied to gross or net revenue?',
      answer: `The fee applies to gross revenue — that is, what the guest pays before cleaning fees or other costs are deducted. This keeps the structure simple and fully transparent.`,
    },
    {
      question: "What's included in the management fee?",
      answer:
        "The $125/mo Property Care fee includes monthly property inspection, utility & condo fee management, restocking household essentials (paper products, hand and bath soap, and other consumables for turn-key guest readiness), 24/7 emergency line, local key & access management, and vendor coordination. The percentage on rental revenue covers active management — listing, pricing, guest communication, photography, cleaning coordination, and reporting.",
    },
    {
      question: 'Are cleaning, maintenance, and supplies included in the fee?',
      answer:
        "Cleaning and maintenance are billed separately — the owner or the guest covers them, depending on the situation and how the stay is set up. What we do include is restocking household essentials: paper products, hand and bath soap, and other consumables that keep the home turn-key for guests and support strong reviews.",
    },
    {
      question: 'Is professional management worth it?',
      answer:
        "For most owners, yes. Self-managed listings typically book 60–70% as much revenue as professionally managed ones because of inconsistent guest response, undertuned pricing, and lower review velocity. Beyond revenue, the time cost is significant — guests message at every hour, issues happen, and turnovers don't pause for vacations. PlayaStays exists to take that off your plate.",
    },
    {
      question: 'Are there long-term contracts or exit penalties?',
      answer: `No long-term contracts. You can pause or cancel the service with 30 days' notice. No exit fee is charged. Our incentive is that you stay because you're happy, not because you're locked in.`,
    },
    {
      question: 'Can I switch tiers if my needs change?',
      answer: `Yes. If you started on CORE for property care and decide to start short-term renting, we'll move you to PLUS. The reverse also works — if you stop short-term renting and want long-term tenants, you can drop to CORE. We don't lock owners into tiers that don't fit their use anymore.`,
    },
    {
      question: "How does PlayaStays' pricing compare to other companies?",
      answer:
        "Property management companies in the Riviera Maya typically charge 15–35% of revenue with monthly fees on top, often locked into multi-year contracts. PlayaStays charges 10% on long-term lease revenue, 15% on short-term rentals, plus a flat $125/mo Property Care fee — with no long-term contract. Plus a real local team, in-house photographers, and bilingual support — not a call center.",
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

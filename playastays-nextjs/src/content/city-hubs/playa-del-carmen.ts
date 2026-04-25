// ============================================================
// Playa del Carmen — pillar city hub (EN + ES)
// ============================================================

import { HERO_JPG } from '@/lib/public-assets'
import type { CityHubRegistryEntry } from './types'

const HERO_IMAGE = HERO_JPG

/** OSM embed — Playa del Carmen core; replace later with CMS or static asset */
const PDC_MAP_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=-87.12%2C20.58%2C-87.02%2C20.68&layer=mapnik'

const NEIGHBORHOOD_GALLERY_EN = [
  { src: HERO_JPG, alt: 'Walkable streets and coastal light near downtown Playa del Carmen' },
  { src: HERO_JPG, alt: 'Residential street with palms in a Riviera Maya community' },
  { src: HERO_JPG, alt: 'Resort-style pool and landscaping typical of gated developments' },
  { src: HERO_JPG, alt: 'Calm shoreline and horizon along the Caribbean coast' },
]

const NEIGHBORHOOD_GALLERY_ES = [
  { src: HERO_JPG, alt: 'Calles caminables y luz costera cerca del centro de Playa del Carmen' },
  { src: HERO_JPG, alt: 'Calle residencial con palmeras en comunidad de la Riviera Maya' },
  { src: HERO_JPG, alt: 'Alberca tipo resort y paisaje en desarrollo cerrado' },
  { src: HERO_JPG, alt: 'Orilla tranquila y horizonte en el Caribe' },
]

const INSIGHTS_GALLERY_EN = [
  { src: HERO_JPG, alt: 'Coastal home exterior — maintenance and finishes matter in humid air' },
  { src: HERO_JPG, alt: 'Open living space suited to vacation rental guests' },
]

const INSIGHTS_GALLERY_ES = [
  { src: HERO_JPG, alt: 'Fachada costera — acabados y mantenimiento importan con humedad salina' },
  { src: HERO_JPG, alt: 'Espacio habitable amplio para huéspedes de renta vacacional' },
]

const MARKET_EN = `
<p>Playa del Carmen sits at the center of the Riviera Maya rental market, combining beach access, walkability, international tourism, and strong year-round appeal. Owners benefit from demand driven by vacation travelers, remote workers, and repeat international visitors who want a central location with easy access to dining, nightlife, shopping, beach clubs, ferry connections, and nearby destinations like Cozumel and Tulum.</p>
<p>For many investors, Playa offers one of the most balanced ownership opportunities in the region: better year-round occupancy than purely seasonal markets, broad demand across studios, one-bedroom, and two-bedroom units, and a strong mix of lifestyle value and rental potential. Well-positioned properties near the beach, Fifth Avenue, Playacar, and the Coco Beach corridor often perform especially well when pricing, guest communication, photography, and operations are handled professionally.</p>
<p>At the same time, Playa del Carmen is not a market where owners should rely on autopilot. Competition is higher than it was a few years ago, guest expectations are rising, and success depends on details like listing quality, fast communication, spotless turnovers, preventative maintenance, and strong understanding of building-specific rental rules. Owners also need to stay aware of Quintana Roo requirements such as tourism-related compliance, lodging taxes, and property-specific operational standards.</p>
<p>Remote and absentee ownership adds another layer: you need visibility into performance, reliable vendor coordination, and responsive local execution when guests, HOAs, or maintenance issues need attention. When you are ready to compare a specific service in depth—scope, commercial detail, and FAQs—use the city + service links in the grid below.</p>
`

const MARKET_ES = `
<p>Playa del Carmen se ubica en el corazón del mercado de rentas de la Riviera Maya: playa, caminabilidad, turismo internacional y demanda sólida durante gran parte del año. Los propietarios se benefician de viajeros de vacaciones, nómadas digitales y visitantes internacionales que buscan una base céntrica con acceso a restaurantes, vida nocturna, compras, beach clubs, ferry y destinos cercanos como Cozumel y Tulum.</p>
<p>Para muchos inversionistas, Playa ofrece una de las oportunidades más equilibradas de la región: ocupación más estable que en mercados puramente estacionales, demanda amplia en estudios y departamentos de una y dos recámaras, y una mezcla fuerte de estilo de vida y potencial de renta. Propiedades bien ubicadas cerca de la playa, la Quinta Avenida, Playacar y el corredor Coco Beach suelen rendir mejor cuando precios, comunicación con huéspedes, fotografía y operación diaria están profesionalizados.</p>
<p>Al mismo tiempo, Playa no es un mercado para el piloto automático. La competencia es mayor que hace unos años, las expectativas de los huéspedes suben y el éxito depende de detalles: calidad del anuncio, respuesta rápida, limpiezas impecables, mantenimiento preventivo y comprensión de las reglas de renta de cada condominio. Los propietarios también deben considerar requisitos en Quintana Roo vinculados al turismo, impuestos de hospedaje y estándares operativos del inmueble.</p>
<p>La propiedad a distancia añade otra capa: necesitas visibilidad sobre resultados, coordinación confiable de proveedores y ejecución local ágil. Cuando quieras comparar un servicio en profundidad—alcance, detalle comercial y FAQs—usa los enlaces ciudad + servicio en la cuadrícula de abajo.</p>
`

export const playaDelCarmenHub: CityHubRegistryEntry = {
  en: {
    heroHeadline: 'PlayaStays in Playa del Carmen: <em>Local Context and Owner Services</em>',
    heroSub:
      'Understand Playa del Carmen as a market, review key areas, and choose the right service path. City + service pages carry scope, pricing, and FAQs.',
    heroTag: 'Market guide · Playa del Carmen',
    heroImageUrl: HERO_IMAGE,
    primaryCta: 'Explore services in Playa del Carmen →',
    secondaryCta: 'Browse neighborhoods and service paths →',
    tertiaryCta: 'WhatsApp',
    marketEyebrow: 'Why this city matters',
    marketTitle: 'Market context for owners in Playa del Carmen',
    marketBodyHtml: MARKET_EN,
    neighborhoodsEyebrow: 'Areas we cover',
    neighborhoodsTitle: 'Neighborhoods We Serve in Playa del Carmen',
    neighborhoodsIntro:
      'Each zone has different guest profiles, HOA rules, and demand patterns. We operate across central corridors, beach-adjacent communities, and gated developments—so your listing strategy matches the neighborhood.',
    neighborhoodGalleryImages: NEIGHBORHOOD_GALLERY_EN,
    mapEmbedUrl: PDC_MAP_EMBED,
    mapCaption:
      'Approximate coverage — we confirm your address, HOA rules, and rental setup with you before onboarding.',
    neighborhoods: [
      {
        slug: 'centro-downtown',
        name: 'Centro / Downtown',
        desc:
          'High walkability, strong tourist demand, and close proximity to Fifth Avenue make Centro one of the most active short-term rental areas in Playa del Carmen. Studios and one- to two-bedroom condos often perform well here when listings are optimized for convenience, nightlife, and beach access.',
      },
      {
        slug: 'gonzalo-guerrero',
        name: 'Gonzalo Guerrero',
        desc:
          'A dense, central corridor between Fifth Avenue and the beach that attracts travelers who want to be in the middle of the action. Compact condos are common; success usually comes down to noise management, clear house rules, and polished guest communication.',
      },
      {
        slug: 'playacar-phase-1',
        name: 'Playacar Phase 1',
        desc:
          'Established resort-style setting with strong security and mature landscaping—appealing to families and longer-stay guests. Villas and larger condos can perform well when operations emphasize reliability, pool and grounds care, and HOA coordination.',
      },
      {
        slug: 'playacar-phase-2',
        name: 'Playacar Phase 2',
        desc:
          'A more residential feel with continued premium demand for gated-community peace of mind. Guest expectations often skew toward space, parking, and a quieter stay—positioning and amenities matter as much as nightly rate.',
      },
      {
        slug: 'zazil-ha-coco-beach',
        name: 'Zazil-Ha / Coco Beach',
        desc:
          'This corridor attracts guests who want a quieter but still highly desirable beach-adjacent location. Boutique condos and well-finished apartments here often benefit from premium positioning, strong photography, and a calm guest experience.',
      },
      {
        slug: 'colosio',
        name: 'Colosio',
        desc:
          'Growing mix of value-oriented inventory and evolving guest demand. Yields can be attractive for owners who understand the asset, invest in fit-out and maintenance, and price for the right traveler segment.',
      },
      {
        slug: 'ejidal',
        name: 'Ejidal',
        desc:
          'Often stronger value and yield opportunities for owners who understand the product and guest profile—sometimes digital nomads, budget-conscious travelers, or longer stays depending on the exact property. Clear expectations in the listing reduce friction.',
      },
      {
        slug: 'corasol-luxury-gated',
        name: 'Corasol & luxury gated communities',
        desc:
          'Premium security, resort-grade amenities, and elevated guest expectations. These homes and condos require meticulous operations, vendor standards, and compliance with community rules to protect reviews and long-term asset value.',
      },
    ],
    servicesEyebrow: 'Services',
    servicesTitle: 'Services available in Playa del Carmen',
    servicesIntro:
      'Concise overviews below—each service page goes deeper on scope, process, and what you can expect in this market.',
    services: [
      {
        psServiceSlug: 'property-management',
        title: 'Full Property Management',
        desc: 'Ownership, reporting, and vendors—scoped for Playa del Carmen on the next page.',
        ctaLabel: 'View Playa del Carmen property management',
      },
      {
        psServiceSlug: 'airbnb-management',
        title: 'Airbnb & Short-Term Rental Management',
        desc: 'Listings, guests, and turnovers—run locally in Playa del Carmen.',
        ctaLabel: 'View Playa del Carmen Airbnb management',
      },
      {
        psServiceSlug: 'vacation-rentals',
        title: 'Vacation Rental Management',
        desc: 'Multi-channel guest operations in Playa del Carmen.',
        ctaLabel: 'View Playa del Carmen vacation rental management',
      },
      {
        psServiceSlug: 'sell-your-property',
        title: 'Sell Your Property',
        desc: 'Exit positioning and seller support in Playa del Carmen.',
        ctaLabel: 'View Playa del Carmen selling support',
      },
    ],
    whyEyebrow: 'Why PlayaStays',
    whyTitle: 'Why Owners Choose PlayaStays in Playa del Carmen',
    whyItems: [
      {
        title: 'Local expertise',
        desc:
          'We understand Playa del Carmen’s neighborhoods, building dynamics, seasonality, guest expectations, and operational realities better than distant managers or generic national firms.',
      },
      {
        title: 'Reliable owner communication',
        desc:
          'Owners want visibility without stress. We provide clear communication, reporting, and on-the-ground accountability.',
      },
      {
        title: 'Strong guest experience',
        desc:
          'Fast responses, smooth check-ins, clean turnovers, and strong issue resolution help improve reviews and occupancy.',
      },
      {
        title: 'Vendor & maintenance coordination',
        desc:
          'We coordinate the cleaners, maintenance teams, and service providers needed to keep properties performing well in a coastal environment.',
      },
    ],
    insightsEyebrow: 'Local insights',
    insightsTitle: 'Local Insights for Playa del Carmen Property Owners',
    insightsGalleryImages: INSIGHTS_GALLERY_EN,
    insightItems: [
      {
        title: 'Peak season preparation',
        desc:
          'Properties near walkable demand centers often benefit from more aggressive dynamic pricing during high season—paired with minimum stays and staffing plans that protect review quality.',
      },
      {
        title: 'Humidity & coastal maintenance',
        desc:
          'Preventative maintenance matters in Playa’s climate—especially AC systems, finishes, and moisture-prone areas. Small issues become expensive fast in salt air and humidity.',
      },
      {
        title: 'Sargassum & beach positioning',
        desc:
          'Beach access is a major demand driver, but conditions can vary seasonally. We help set guest expectations and adjust positioning when beach experience is part of your promise.',
      },
      {
        title: 'HOA & building rules',
        desc:
          'Building-level short-term rental policies can matter as much as city- or state-level expectations. We align operations with what your HOA and neighbors require.',
      },
      {
        title: 'Dynamic pricing & occupancy strategy',
        desc:
          'In a competitive condo-heavy market, revenue is won through pricing discipline, calendar hygiene, and fast guest communication—not “set and forget” rates.',
      },
      {
        title: 'Compliance in Quintana Roo',
        desc:
          'We help owners understand the operational side of running a rental responsibly—so you can focus on performance with fewer surprises.',
      },
    ],
    faqEyebrow: 'FAQ',
    faqTitle: 'Common questions about Playa del Carmen (navigation & context)',
    faqs: [
      {
        question: 'I’m researching Playa del Carmen—where should I start on this site?',
        answer:
          '<p>Use this hub for neighborhoods and market context. When you want service-specific scope, pricing signals, and FAQs, open the city + service page that matches your decision.</p>',
      },
      {
        question: 'Where are fees and service scope explained for Playa del Carmen?',
        answer:
          '<p>Each city-specific service page is the right place for commercial detail. We also publish city pricing guidance for management when you want ranges before a consultation.</p>',
      },
      {
        question: 'Do you manage properties in Playacar and gated communities?',
        answer:
          '<p>Yes. We work with owners in secured communities and understand the extra coordination often required with HOAs, access rules, and property-specific operating requirements.</p>',
      },
      {
        question: 'Can you manage my property if I live abroad?',
        answer:
          '<p>Absolutely. Many owners are outside Mexico for most or all of the year. Our role is to reduce the operational burden and give you local visibility without needing to be on-site.</p>',
      },
      {
        question: 'Do you help with local compliance and lodging-tax related processes?',
        answer:
          '<p>We help owners understand the operational side of staying compliant and managing their rental responsibly in Quintana Roo—so expectations are clear and day-to-day execution is handled professionally.</p>',
      },
      {
        question: 'How do you improve occupancy and revenue?',
        answer:
          '<p>Through better listing presentation, faster response times, a stronger guest experience, disciplined pricing strategy, and more consistent operations—so reviews, ranking, and revenue move in the right direction together.</p>',
      },
    ],
    finalEyebrow: 'Next step',
    finalTitle: 'What’s next in Playa del Carmen?',
    finalSub:
      'Explore the service paths above, or request a free revenue estimate—24-hour response.',
    leadFormTitle: 'Own property in Playa del Carmen?',
    leadFormSubtitle: 'Get a free property management quote. We respond within 24 hours—no obligation.',
    footerLeadTitle: 'Request your free quote',
    footerLeadSubtitle: 'Tell us about your property—we’ll follow up within 24 hours.',
    blogHint: 'More owner guides & market notes on the blog soon.',
    ctaStripEyebrow: 'Playa del Carmen owners',
    ctaStripHeadline: 'Get a free rental income estimate—no commitment required.',
  },
  es: {
    heroHeadline: 'PlayaStays en Playa del Carmen: <em>contexto local y servicios para propietarios</em>',
    heroSub:
      'Entiende Playa del Carmen como mercado, revisa áreas clave y elige la ruta de servicio adecuada. Las páginas ciudad + servicio llevan alcance, honorarios y FAQs.',
    heroTag: 'Guía del mercado · Playa del Carmen',
    heroImageUrl: HERO_IMAGE,
    primaryCta: 'Ver servicios en Playa del Carmen →',
    secondaryCta: 'Explorar colonias y rutas de servicio →',
    tertiaryCta: 'WhatsApp',
    marketEyebrow: 'Por qué importa este mercado',
    marketTitle: 'Contexto de mercado para propietarios en Playa del Carmen',
    marketBodyHtml: MARKET_ES,
    neighborhoodsEyebrow: 'Zonas',
    neighborhoodsTitle: 'Colonias y zonas donde operamos en Playa del Carmen',
    neighborhoodsIntro:
      'Cada zona tiene perfiles de huéspedes, reglas de condominio y dinámicas de demanda distintas. Operamos en corredores céntricos, zonas cercanas a la playa y desarrollos cerrados para alinear estrategia y realidad local.',
    neighborhoodGalleryImages: NEIGHBORHOOD_GALLERY_ES,
    mapEmbedUrl: PDC_MAP_EMBED,
    mapCaption:
      'Cobertura aproximada — confirmamos tu dirección, reglas de condominio y configuración de renta antes del onboarding.',
    neighborhoods: [
      {
        slug: 'centro-downtown',
        name: 'Centro / Downtown',
        desc:
          'Alta caminabilidad, demanda turística fuerte y proximidad a la Quinta Avenida hacen del Centro una de las zonas de renta vacacional más activas. Estudios y departamentos de 1–2 recámaras suelen rendir bien cuando el anuncio comunica conveniencia, acceso a playa y reglas claras.',
      },
      {
        slug: 'gonzalo-guerrero',
        name: 'Gonzalo Guerrero',
        desc:
          'Corredor céntrico entre Quinta y playa, con alta densidad y vida urbana. Predominan departamentos compactos; el éxito suele depender de gestión de ruido, reglas de casa y comunicación impecable con huéspedes.',
      },
      {
        slug: 'playacar-phase-1',
        name: 'Playacar Fase 1',
        desc:
          'Entorno tipo resort con seguridad consolidada y vegetación madura—atractivo para familias y estancias más largas. Villas y departamentos amplios se benefician de operación confiable y coordinación con el HOA.',
      },
      {
        slug: 'playacar-phase-2',
        name: 'Playacar Fase 2',
        desc:
          'Perfil más residencial con demanda premium por tranquilidad en comunidad cerrada. Los huéspedes suelen valorar espacio, estacionamiento y estadía más calmada: la propuesta y amenidades pesan tanto como la tarifa.',
      },
      {
        slug: 'zazil-ha-coco-beach',
        name: 'Zazil-Ha / Coco Beach',
        desc:
          'Corredor con fuerte atractivo “cerca de la playa” con tono más tranquilo. Departamentos boutique y acabados sólidos suelen requerir posicionamiento premium, fotografía fuerte y experiencia de huésped cuidada.',
      },
      {
        slug: 'colosio',
        name: 'Colosio',
        desc:
          'Mezcla en evolución de inventario con buen valor y demanda diversa. Puede ofrecer rendimiento atractivo para quien invierte en acabados, mantenimiento y precio alineado al perfil de huésped correcto.',
      },
      {
        slug: 'ejidal',
        name: 'Ejidal',
        desc:
          'Oportunidades de valor y rendimiento para propietarios que entienden el activo—a veces nómadas digitales, viajeros con presupuesto o estancias largas. Expectativas claras en el anuncio reducen fricción.',
      },
      {
        slug: 'corasol-luxury-gated',
        name: 'Corasol y comunidades cerradas de lujo',
        desc:
          'Seguridad elevada, amenidades tipo resort y expectativas altas de huéspedes. Requiere operación impecable, proveedores de nivel y cumplimiento estricto de reglas para proteger reseñas y valor del activo.',
      },
    ],
    servicesEyebrow: 'Servicios',
    servicesTitle: 'Servicios disponibles en Playa del Carmen',
    servicesIntro:
      'Resúmenes breves; cada página de servicio profundiza alcance y proceso para este mercado.',
    services: [
      {
        psServiceSlug: 'property-management',
        title: 'Administración integral de propiedades',
        desc: 'Operación, reportes y proveedores—detalle local en la siguiente página para Playa del Carmen.',
        ctaLabel: 'Ver administración integral en Playa del Carmen',
      },
      {
        psServiceSlug: 'airbnb-management',
        title: 'Administración Airbnb y renta corta',
        desc: 'Anuncios, huéspedes y limpiezas—ejecución local en Playa del Carmen.',
        ctaLabel: 'Ver administración Airbnb en Playa del Carmen',
      },
      {
        psServiceSlug: 'vacation-rentals',
        title: 'Gestión de rentas vacacionales',
        desc: 'Operación multicanal de huéspedes en Playa del Carmen.',
        ctaLabel: 'Ver gestión de rentas en Playa del Carmen',
      },
      {
        psServiceSlug: 'sell-your-property',
        title: 'Vender tu propiedad',
        desc: 'Salida al mercado y apoyo al vendedor en Playa del Carmen.',
        ctaLabel: 'Ver apoyo para venta en Playa del Carmen',
      },
    ],
    whyEyebrow: 'Por qué PlayaStays',
    whyTitle: 'Por qué los propietarios eligen PlayaStays en Playa del Carmen',
    whyItems: [
      {
        title: 'Experiencia local',
        desc:
          'Conocemos colonias, dinámica de edificios, estacionalidad y operación cotidiana mejor que gestores remotos o firmas genéricas.',
      },
      {
        title: 'Comunicación clara con el propietario',
        desc:
          'Visibilidad sin ruido: reportes y responsabilidad en terreno.',
      },
      {
        title: 'Mejor experiencia de huésped',
        desc:
          'Respuesta rápida, check-ins ordenados, limpiezas impecables y resolución de incidencias para proteger reseñas y ocupación.',
      },
      {
        title: 'Proveedores y mantenimiento',
        desc:
          'Coordinamos limpieza, mantenimiento y servicios que un clima costero exige.',
      },
    ],
    insightsEyebrow: 'Contexto local',
    insightsTitle: 'Ideas para propietarios en Playa del Carmen',
    insightsGalleryImages: INSIGHTS_GALLERY_ES,
    insightItems: [
      {
        title: 'Preparación de temporada alta',
        desc:
          'Las zonas muy caminables suelen beneficiarse de precios dinámicos más agresivos en temporada alta—con mínimos de estancia y staffing que protegen calidad y reseñas.',
      },
      {
        title: 'Humedad y mantenimiento costero',
        desc:
          'El mantenimiento preventivo importa: A/C, acabados y zonas húmedas. En ambiente salino, los detalles pequeños escalan rápido.',
      },
      {
        title: 'Sargazo y promesa de playa',
        desc:
          'La playa impulsa demanda, pero las condiciones varían. Ajustamos expectativas y mensaje cuando la experiencia de playa es parte central de la oferta.',
      },
      {
        title: 'HOA y reglas de condominio',
        desc:
          'Las políticas del edificio pueden ser tan importantes como normas municipales o estatales. Operamos en sintonía con tu comunidad.',
      },
      {
        title: 'Precios dinámicos y ocupación',
        desc:
          'En un mercado de muchos condominios, el ingreso se gana con precios disciplinados, calendario limpio y respuesta rápida—no con tarifas fijas olvidadas.',
      },
      {
        title: 'Cumplimiento en Quintana Roo',
        desc:
          'Ayudamos a entender el lado operativo de rentar de forma responsable—menos sorpresas en el día a día.',
      },
    ],
    faqEyebrow: 'Preguntas frecuentes',
    faqTitle: 'Preguntas frecuentes sobre Playa del Carmen (navegación y contexto)',
    faqs: [
      {
        question: 'Estoy evaluando Playa del Carmen—¿por dónde empiezo en el sitio?',
        answer:
          '<p>Usa este hub para zonas y contexto de mercado. Cuando necesites alcance, rangos y FAQs por servicio, abre la página ciudad + servicio que corresponda.</p>',
      },
      {
        question: '¿Dónde están honorarios y alcance para Playa del Carmen?',
        answer:
          '<p>La página específica de cada servicio en Playa del Carmen es el lugar adecuado para detalle comercial. También publicamos orientación de precios de administración por ciudad si quieres rangos antes de agendar.</p>',
      },
      {
        question: '¿Trabajan en Playacar y comunidades cerradas?',
        answer:
          '<p>Sí. Entendemos la coordinación extra con HOAs, accesos y reglas internas del desarrollo.</p>',
      },
      {
        question: '¿Pueden administrar si vivo en el extranjero?',
        answer:
          '<p>Por supuesto. Muchos propietarios están fuera de México la mayor parte del año; nuestro rol es reducir carga operativa y darte visibilidad local sin que tengas que estar presente.</p>',
      },
      {
        question: '¿Ayudan con cumplimiento e impuestos de hospedaje?',
        answer:
          '<p>Ayudamos a entender el lado operativo de mantener una renta responsable en Quintana Roo—con procesos claros y ejecución profesional.</p>',
      },
      {
        question: '¿Cómo mejoran ocupación e ingresos?',
        answer:
          '<p>Con mejor presentación del anuncio, tiempos de respuesta, experiencia de huésped, estrategia de precios y operación consistente—reseñas, posicionamiento e ingresos suelen moverse juntos.</p>',
      },
    ],
    finalEyebrow: 'Siguiente paso',
    finalTitle: '¿Siguiente paso en Playa del Carmen?',
    finalSub:
      'Explora las rutas de servicio arriba o solicita un estimado sin compromiso. Respuesta en 24 h.',
    leadFormTitle: '¿Propiedad en Playa del Carmen?',
    leadFormSubtitle: 'Cotización gratuita de administración. Respuesta en 24 horas, sin compromiso.',
    footerLeadTitle: 'Solicitar cotización gratuita',
    footerLeadSubtitle: 'Cuéntanos sobre tu propiedad—te contactamos en 24 horas.',
    blogHint: 'Próximamente más guías para propietarios en el blog.',
    ctaStripEyebrow: 'Propietarios en Playa del Carmen',
    ctaStripHeadline: 'Obtén un estimado de ingresos por renta—sin compromiso.',
  },
}

// ============================================================
// Playa del Carmen — /airbnb-management pillar (EN + ES)
// Blueprint for future /[city]/airbnb-management/ pages
// ============================================================

import { HERO_JPG } from '@/lib/public-assets'

export const PLAYA_AIRBNB_HERO_IMAGE = HERO_JPG

export const PLAYA_AIRBNB_SEO = {
  en: {
    title: 'Airbnb Management in Playa del Carmen | Short-Term Rental Optimization & Guest Services',
    description:
      'Professional Airbnb and short-term rental management in Playa del Carmen, Quintana Roo. We optimize listings, handle guest communication, ensure RETUR-Q compliance, and maximize occupancy for better returns. Free consultation for owners.',
  },
  es: {
    title: 'Administración Airbnb en Playa del Carmen | Optimización de renta corta y atención a huéspedes',
    description:
      'Administración profesional de Airbnb y renta corta en Playa del Carmen, Quintana Roo. Optimizamos anuncios, mensajería con huéspedes, cumplimiento RETUR-Q y ocupación para mejores rendimientos. Consulta gratuita para propietarios.',
  },
} as const

export type AirbnbManagementPillarCopy = {
  heroTag: string
  heroHeadline: string
  heroSub: string
  primaryCta: string
  secondaryCta: string
  tertiaryCta: string
  heroAuxPmLink: string
  heroAuxVacationLink: string
  heroAuxSchedule: string
  introEyebrow: string
  introTitle: string
  introBody: string[]
  includesEyebrow: string
  includesTitle: string
  includesLead: string
  includesItems: Array<{ title: string; desc: string }>
  pmBridgeTitle: string
  pmBridgeBody: string
  pmBridgeCta: string
  includesPricingNote: string
  includesPricingBeforeLinks: string
  includesPricingLinkLabel: string
  includesPricingBetweenLinks: string
  includesPricingAfterLinks: string
  processEyebrow: string
  processTitle: string
  processBody: string
  processSteps: Array<{ title: string; desc: string }>
  whyEyebrow: string
  whyTitle: string
  whyLead: string
  whyItems: Array<{ title: string; desc: string }>
  nbhdEyebrow: string
  nbhdTitle: string
  nbhdIntro: string
  nbhdZones: Array<{ name: string; body: string }>
  nbhdLink: string
  faqEyebrow: string
  faqTitle: string
  finalEyebrow: string
  finalTitle: string
  finalSub: string
  finalTrustPoints: string[]
  finalQuote: string
  finalContact: string
  finalExplorePm: string
  finalExploreVacation: string
  finalWhatsApp: string
  formTitle: string
  formSubtitle: string
}

export const PLAYA_AIRBNB_COPY: Record<'en' | 'es', AirbnbManagementPillarCopy> = {
  en: {
    heroTag: 'Airbnb & short-term rentals · Playa del Carmen',
    heroHeadline: 'Airbnb &amp; Short-Term Rental Management in Playa del Carmen',
    heroSub:
      'Our local team runs your Playa del Carmen short-term rental end to end—listing optimization, dynamic pricing, 24/7 guest support, turnovers, and 2026 Quintana Roo compliance—so you earn more with less owner stress.',
    primaryCta: 'Get a Free Airbnb Management Quote',
    secondaryCta: 'Submit Your Property Details',
    tertiaryCta: 'WhatsApp',
    heroAuxPmLink: 'Explore full property management →',
    heroAuxVacationLink: 'Vacation rental management (multi-channel) →',
    heroAuxSchedule: 'Schedule a consultation →',
    introEyebrow: 'Why specialized Airbnb management',
    introTitle: 'Why professional Airbnb management matters in Playa del Carmen',
    introBody: [
      'Playa del Carmen remains one of the Riviera Maya’s strongest short-term rental markets—walkable downtown, beach access, Quinta Avenida, and easy reach to Cozumel ferries, Tulum day trips, and cenote country. That mix attracts couples, families, digital nomads, and repeat visitors who expect fast responses, spotless turnovers, and listings that match what they actually get.',
      'Success is no longer “create an Airbnb listing and wait.” Competition is fierce, guest expectations are high, and ratings directly affect visibility. At the same time, short-term rental compliance in Quintana Roo—including registration, recordkeeping, and lodging-tax obligations—requires disciplined execution, not guesswork.',
      'Professional management improves what owners actually care about: search visibility, booking pace, revenue per available night, review quality, and fewer preventable disasters. We handle the daily operational load: calendars, messaging, pricing moves, cleaner coordination, and issue resolution—built for owners who want passive short-term income without running a hospitality desk from abroad.',
      'This page is dedicated to Airbnb and short-term platform execution. For broader ownership support—long-term leasing, hybrid strategies, full maintenance programs, and holistic financial operations—our property management team is the right home base.',
    ],
    includesEyebrow: 'What we run for you',
    includesTitle: 'What our Airbnb management service includes in Playa del Carmen',
    includesLead:
      'These pillars are the operational layer of short-term performance: visibility, pricing, guest experience, cleanliness, and compliance. They are intentionally deeper than general property oversight.',
    includesItems: [
      {
        title: 'Listing creation & optimization',
        desc: 'Photography direction, amenity accuracy, SEO-friendly titles, house rules, and ongoing updates so listings stay competitive as algorithms and guest expectations shift.',
      },
      {
        title: 'Dynamic pricing & revenue management',
        desc: 'Rate strategy tied to seasonality, local events, competitive sets, and minimum-stay rules—balanced to protect reviews while capturing upside.',
      },
      {
        title: 'Guest communication & experience',
        desc: 'Fast inquiry response, screening where appropriate, pre-arrival messaging, in-stay support, and post-stay review strategy—so guests feel professionally hosted.',
      },
      {
        title: 'Turnover & cleaning coordination',
        desc: 'Hotel-standard cleaning windows, inspections, linen and supplies, and damage documentation—because short-term revenue depends on consistency between stays.',
      },
      {
        title: 'Performance tracking & reporting',
        desc: 'Occupancy, ADR, revenue, fee visibility, and variance notes—so you understand performance without micromanaging channels.',
      },
      {
        title: 'Compliance & regulatory support',
        desc: 'Practical coordination around short-term rental registration (including RETUR-Q workflows where applicable), lodging tax obligations, and condominium rules—so operations stay defensible.',
      },
      {
        title: 'Marketing & channel management',
        desc: 'Airbnb-first execution with coordinated presence on Booking.com, VRBO, or other channels when appropriate—without fragmenting your operating standards.',
      },
    ],
    pmBridgeTitle: 'Need broader ownership and asset management?',
    pmBridgeBody:
      'Long-term leasing, hybrid calendars, capital-heavy maintenance programs, and holistic owner reporting live under our property management service—not duplicated here.',
    pmBridgeCta: 'Explore general property management',
    includesPricingNote:
      'Short-term management fees typically reflect revenue share or performance-based structures—scoped to your property type and service level. We provide a clear quote after review.',
    includesPricingBeforeLinks: 'For orientation on fees and examples, see',
    includesPricingLinkLabel: 'Playa del Carmen management pricing',
    includesPricingBetweenLinks: '—then we align the Airbnb management scope to your property.',
    includesPricingAfterLinks: '',
    processEyebrow: 'How we work',
    processTitle: 'Our Airbnb management process in Playa del Carmen',
    processBody:
      'This is the short-term rental operating lifecycle—distinct from the broader property-management onboarding path.',
    processSteps: [
      {
        title: 'Property evaluation & strategy session',
        desc: 'We review the unit, competition, HOA constraints, and your revenue goals—then define channel strategy and compliance checkpoints.',
      },
      {
        title: 'Setup & optimization',
        desc: 'Listing build or overhaul, photography coordination, pricing baselines, messaging templates, and housekeeping standards.',
      },
      {
        title: 'Launch & active management',
        desc: 'Go-live with monitored performance: messaging SLAs, calendar hygiene, and rapid issue resolution during peak demand.',
      },
      {
        title: 'Ongoing optimization',
        desc: 'Continuous pricing adjustments, listing experiments, review response, and turnover quality control.',
      },
      {
        title: 'Monthly reporting',
        desc: 'Owner-ready summaries of revenue, occupancy, and key drivers—plus clear next actions.',
      },
      {
        title: 'Annual review & strategy refresh',
        desc: 'A structured look at capex, positioning, and channel mix—so the listing stays competitive year over year.',
      },
    ],
    whyEyebrow: 'Why PlayaStays',
    whyTitle: 'Why owners choose us for Airbnb management in Playa del Carmen',
    whyLead:
      'Short-term management is judged on speed, consistency, and guest outcomes. We are built for that—local, accountable, and performance-minded.',
    whyItems: [
      {
        title: 'Deep local knowledge',
        desc: 'Micro-market dynamics by neighborhood and building—so pricing and positioning match real guest demand, not generic comps.',
      },
      {
        title: 'Compliance expertise',
        desc: 'We treat short-term rental compliance as operational reality—documented, coordinated, and aligned with condominium rules.',
      },
      {
        title: 'Guest-focused operations',
        desc: 'Hospitality is the product. We manage the experience like a professional host team—because reviews are the engine.',
      },
      {
        title: 'Transparency & systems',
        desc: 'Clear reporting and predictable processes—owners should not be chasing updates.',
      },
      {
        title: 'Results-oriented execution',
        desc: 'We optimize for sustainable revenue: not gimmicks, not reckless discounting—disciplined hospitality economics.',
      },
      {
        title: 'Integrated turnover quality',
        desc: 'Cleaning and inspections are not separate— they are part of revenue protection.',
      },
    ],
    nbhdEyebrow: 'Neighborhood insights',
    nbhdTitle: 'Neighborhood insights for Airbnb success in Playa del Carmen',
    nbhdIntro:
      'The right Airbnb strategy depends on the address. Demand, noise, HOA rules, and guest profile vary by zone—so we position and operate the listing from real neighborhood context.',
    nbhdZones: [
      {
        name: 'Centro & Quinta corridor',
        body: 'High visibility and strong demand—often paired with noise and access constraints. Success depends on guest communication, strict house rules, and rapid issue resolution.',
      },
      {
        name: 'Playacar',
        body: 'Gated context, family-oriented demand, and strong HOA coordination. Listings often emphasize security, amenities, and quiet guest behavior.',
      },
      {
        name: 'Zazil-Ha / Coco Beach',
        body: 'Beach-adjacent appeal with a quieter tone. Premium positioning and immaculate turnovers are common differentiators.',
      },
      {
        name: 'Emerging & mixed-use pockets',
        body: 'Yield can be strong with realistic positioning and disciplined operations—especially when expectations are set clearly in the listing.',
      },
    ],
    nbhdLink: 'See full city context & coverage on the Playa del Carmen hub →',
    faqEyebrow: 'Airbnb & STR FAQ',
    faqTitle: 'Short-term rental management — common questions',
    finalEyebrow: 'Next step',
    finalTitle: 'Ready to improve your Playa del Carmen Airbnb performance while staying fully compliant?',
    finalSub:
      'Get a tailored plan for listing optimization, guest operations, and revenue performance—backed by a local team that knows Playa del Carmen.',
    finalTrustPoints: [
      'Local team in Playa del Carmen',
      'Short-term rental compliance support',
      'Riviera Maya ownership expertise',
    ],
    finalQuote: 'Get Your Free Quote',
    finalContact: 'Schedule a Strategy Call',
    finalExplorePm: 'Explore general property management',
    finalExploreVacation: 'Explore vacation rental management',
    finalWhatsApp: 'WhatsApp',
    formTitle: 'Request an Airbnb management quote',
    formSubtitle: 'Local team · Response within 24 hours · No obligation',
  },
  es: {
    heroTag: 'Airbnb y renta corta · Playa del Carmen',
    heroHeadline: 'Administración de <em>Airbnb</em> y renta corta en Playa del Carmen',
    heroSub:
      'Nuestro equipo local opera tu renta corta de punta a punta: optimización de anuncio, precios dinámicos, atención a huéspedes, limpiezas y cumplimiento en Quintana Roo (2026)—para que ganes más con menos estrés.',
    primaryCta: 'Cotización gratuita de administración Airbnb',
    secondaryCta: 'Enviar datos de tu propiedad',
    tertiaryCta: 'WhatsApp',
    heroAuxPmLink: 'Ver administración integral de propiedades →',
    heroAuxVacationLink: 'Gestión de rentas vacacionales (multicanal) →',
    heroAuxSchedule: 'Agendar consulta →',
    introEyebrow: 'Por qué especializarse en Airbnb',
    introTitle: 'Por qué importa la administración profesional de Airbnb en Playa del Carmen',
    introBody: [
      'Playa del Carmen sigue siendo uno de los mercados de renta corta más sólidos de la Riviera Maya: centro caminable, playa, Quinta Avenida y acceso a ferry a Cozumel, Tulum y cenotes. Eso atrae parejas, familias, nómadas digitales y visitantes recurrentes que esperan respuesta rápida, limpiezas impecables y anuncios que coincidan con la realidad.',
      'El éxito ya no es “crear un anuncio y esperar.” La competencia es fuerte, las expectativas de huéspedes son altas y las reseñas mueven visibilidad. Además, el cumplimiento de renta corta en Quintana Roo—registro, expediente e impuestos de hospedaje—exige disciplina, no improvisación.',
      'La administración profesional mejora lo que importa: visibilidad, ritmo de reservas, ingreso por noche disponible, calidad de reseñas y menos incidentes evitables. Gestionamos el día a día: calendarios, mensajes, precios, limpieza y resolución de incidencias—pensado para propietarios que buscan ingresos pasivos sin operar hospitalidad desde el extranjero.',
      'Esta página está dedicada a la ejecución en plataformas de renta corta. Para administración amplia—renta larga, modelos híbridos, mantenimiento integral y operación financiera holística—nuestro servicio de administración de propiedades es la base correcta.',
    ],
    includesEyebrow: 'Qué gestionamos',
    includesTitle: 'Qué incluye nuestra administración de Airbnb en Playa del Carmen',
    includesLead:
      'Estos pilares son la capa operativa del desempeño en renta corta: visibilidad, precio, experiencia de huésped, limpieza y cumplimiento—más profunda que la supervisión general del activo.',
    includesItems: [
      {
        title: 'Creación y optimización de anuncios',
        desc: 'Dirección de fotografía, precisión de amenidades, títulos SEO, reglas de casa y actualizaciones continuas para mantener competitividad.',
      },
      {
        title: 'Precios dinámicos y revenue management',
        desc: 'Estrategia de tarifas según temporada, eventos, competencia y mínimos de estancia—equilibrando ingreso y protección de reseñas.',
      },
      {
        title: 'Comunicación y experiencia de huésped',
        desc: 'Respuesta rápida, mensajería pre-llegada, soporte durante la estancia y estrategia de reseñas.',
      },
      {
        title: 'Turnovers y limpieza',
        desc: 'Ventanas de limpieza tipo hotel, inspección, blancos y documentación de daños—la renta corta depende de consistencia entre estancias.',
      },
      {
        title: 'Seguimiento y reportes',
        desc: 'Ocupación, ADR, ingresos y notas de variación—para entender resultados sin microgestionar canales.',
      },
      {
        title: 'Cumplimiento y apoyo regulatorio',
        desc: 'Coordinación práctica con registro de renta corta (incluyendo RETUR-Q cuando aplica), impuestos de hospedaje y reglas de condominio.',
      },
      {
        title: 'Marketing y canales',
        desc: 'Ejecución centrada en Airbnb con presencia coordinada en Booking, VRBO u otros cuando aplica—sin fragmentar estándares operativos.',
      },
    ],
    pmBridgeTitle: '¿Necesitas administración amplia del activo?',
    pmBridgeBody:
      'Renta larga, calendarios híbridos, mantenimiento de capital y reportes financieros integrales viven en administración de propiedades—no se duplican aquí.',
    pmBridgeCta: 'Ver administración integral de propiedades',
    includesPricingNote:
      'Las tarifas de renta corta suelen reflejar participación en ingresos o estructuras por desempeño—según tipo de unidad y alcance. Cotizamos con claridad tras revisión.',
    includesPricingBeforeLinks: 'Para orientación sobre tarifas y ejemplos, consulta',
    includesPricingLinkLabel: 'precios de administración en Playa del Carmen',
    includesPricingBetweenLinks: '—luego alineamos el alcance de administración Airbnb a tu propiedad.',
    includesPricingAfterLinks: '',
    processEyebrow: 'Proceso',
    processTitle: 'Nuestro proceso de administración Airbnb en Playa del Carmen',
    processBody:
      'Ciclo operativo de renta corta—distinto del onboarding amplio de administración de propiedades.',
    processSteps: [
      {
        title: 'Evaluación y sesión de estrategia',
        desc: 'Revisamos unidad, competencia, restricciones del condominio y metas de ingreso—definimos canales y puntos de cumplimiento.',
      },
      {
        title: 'Configuración y optimización',
        desc: 'Anuncio nuevo o renovación, fotografía, precios base, plantillas de mensajes y estándares de limpieza.',
      },
      {
        title: 'Lanzamiento y gestión activa',
        desc: 'Salida con monitoreo: SLA de mensajes, higiene de calendario y resolución rápida en picos de demanda.',
      },
      {
        title: 'Optimización continua',
        desc: 'Ajustes de precios, experimentos en anuncio, respuesta a reseñas y control de calidad en turnovers.',
      },
      {
        title: 'Reportes mensuales',
        desc: 'Resúmenes de ingreso, ocupación y drivers clave—con próximos pasos claros.',
      },
      {
        title: 'Revisión anual y estrategia',
        desc: 'Capex, posicionamiento y mix de canales—para mantener competitividad año a año.',
      },
    ],
    whyEyebrow: 'Por qué PlayaStays',
    whyTitle: 'Por qué nos eligen para administración Airbnb en Playa del Carmen',
    whyLead:
      'La renta corta se juzga por velocidad, consistencia y resultado para huéspedes. Estamos construidos para eso: locales, responsables y con mentalidad de desempeño.',
    whyItems: [
      {
        title: 'Conocimiento local profundo',
        desc: 'Dinámica por colonia y edificio—precios y posicionamiento alineados a demanda real.',
      },
      {
        title: 'Experiencia en cumplimiento',
        desc: 'Tratamos renta corta como operación documentada y alineada con reglas de condominio.',
      },
      {
        title: 'Operación centrada en huésped',
        desc: 'La hospitalidad es el producto: mensajes, estancias y reseñas como motor.',
      },
      {
        title: 'Transparencia y sistemas',
        desc: 'Reportes claros y procesos predecibles—sin perseguir actualizaciones.',
      },
      {
        title: 'Ejecución orientada a resultados',
        desc: 'Optimizamos ingresos sostenibles: sin trucos ni descuentos irresponsables.',
      },
      {
        title: 'Calidad integrada en turnovers',
        desc: 'Limpieza e inspección son parte de proteger ingresos.',
      },
    ],
    nbhdEyebrow: 'Insights por zona',
    nbhdTitle: 'Insights por colonia para Airbnb en Playa del Carmen',
    nbhdIntro:
      'La estrategia correcta depende de la dirección. Demanda, ruido, HOA y perfil de huésped cambian—posicionamos y operamos desde contexto real.',
    nbhdZones: [
      {
        name: 'Centro y Quinta',
        body: 'Alta visibilidad y demanda—con ruido y accesos exigentes. El éxito depende de comunicación, reglas claras y resolución rápida.',
      },
      {
        name: 'Playacar',
        body: 'Entorno cerrado y demanda familiar. Se enfatizan seguridad, amenidades y comportamiento tranquilo del huésped.',
      },
      {
        name: 'Zazil-Ha / Coco Beach',
        body: 'Cerca de la playa con tono más tranquilo. Posicionamiento premium y turnovers impecables suelen marcar la diferencia.',
      },
      {
        name: 'Zonas emergentes y mixtas',
        body: 'Rendimiento puede ser fuerte con posicionamiento realista y operación disciplinada—expectativas claras en el anuncio.',
      },
    ],
    nbhdLink: 'Contexto completo en el hub de Playa del Carmen →',
    faqEyebrow: 'Preguntas Airbnb y renta corta',
    faqTitle: 'Administración de renta corta — dudas frecuentes',
    finalEyebrow: 'Siguiente paso',
    finalTitle: '¿Listo para mejorar tu Airbnb en Playa del Carmen con cumplimiento sólido?',
    finalSub:
      'Obtén un plan a medida para anuncio, operación con huéspedes y desempeño de ingresos—con equipo local que conoce el mercado.',
    finalTrustPoints: [
      'Equipo local en Playa del Carmen',
      'Apoyo en cumplimiento de renta corta',
      'Experiencia en propiedad en Riviera Maya',
    ],
    finalQuote: 'Solicitar cotización',
    finalContact: 'Agendar llamada de estrategia',
    finalExplorePm: 'Ver administración integral',
    finalExploreVacation: 'Ver gestión de rentas vacacionales',
    finalWhatsApp: 'WhatsApp',
    formTitle: 'Solicitar cotización de administración Airbnb',
    formSubtitle: 'Equipo local · Respuesta en 24 h · Sin compromiso',
  },
}

export type PlayaAirbnbFaqItem = { question: string; answer: string }

export const PLAYA_AIRBNB_FALLBACK_FAQS: Record<'en' | 'es', PlayaAirbnbFaqItem[]> = {
  en: [
    {
      question: 'How much does Airbnb management cost in Playa del Carmen?',
      answer:
        '<p>Fees typically reflect a percentage of gross revenue or a performance-based structure, depending on scope and property type. We provide a clear quote after review. For orientation, see <a href="/playa-del-carmen/property-management-cost/">Playa del Carmen management pricing</a>.</p>',
    },
    {
      question: 'What is RETUR-Q and do I need it for my Airbnb?',
      answer:
        '<p>RETUR-Q refers to Quintana Roo’s tourism registration system for certain rental activity. Whether your listing requires registration—and how it interacts with your condominium rules—depends on your property and operating model. We help coordinate the operational side of compliance and documentation; for legal certainty, we recommend qualified local counsel when needed.</p>',
    },
    {
      question: 'How do you handle the 6% lodging tax and other compliance?',
      answer:
        '<p>We help owners understand the operational requirements for recordkeeping and remittance workflows tied to short-term stays. Exact obligations vary by situation; we keep your operation organized so accountants and tax professionals can work efficiently.</p>',
    },
    {
      question: 'What occupancy and revenue can I realistically expect?',
      answer:
        '<p>Results depend on neighborhood, unit quality, amenities, reviews, and pricing discipline. We provide realistic benchmarking during onboarding—without promising “guaranteed” numbers. The goal is sustainable performance, not a headline that breaks in 90 days.</p>',
    },
    {
      question: 'Do you manage properties on multiple platforms?',
      answer:
        '<p>Yes—when it makes sense for your property. We coordinate Airbnb with Booking.com, VRBO, and other channels while maintaining consistent housekeeping and guest standards. For broader multi-channel business strategy and guest-experience positioning, see <a href="/playa-del-carmen/vacation-rental-management/">vacation rental management</a>.</p>',
    },
    {
      question: 'What if I want to use my property personally sometimes?',
      answer:
        '<p>We set owner blocks and calendar rules so personal stays do not conflict with guest commitments. If you need broader hybrid ownership planning across maintenance and long-term strategy, see <a href="/playa-del-carmen/property-management/">property management</a>.</p>',
    },
    {
      question: 'How do you coordinate cleaning and maintenance for turnovers?',
      answer:
        '<p>Turnovers are scheduled with buffer windows, inspection checklists, and vendor accountability. Maintenance issues are triaged with urgency tiers—safety and guest experience first—then documented for owners.</p>',
    },
    {
      question: 'Can I switch to long-term rentals later?',
      answer:
        '<p>Yes—many owners evolve their model. Long-term leasing changes calendars, pricing, and tenant coordination. For a full transition plan across maintenance and tenant operations, <a href="/playa-del-carmen/property-management/">property management</a> is the right home.</p>',
    },
  ],
  es: [
    {
      question: '¿Cuánto cuesta la administración de Airbnb en Playa del Carmen?',
      answer:
        '<p>Las tarifas suelen reflejar un porcentaje de ingresos brutos o estructura por desempeño, según alcance y tipo de unidad. Cotizamos tras revisión. Consulta <a href="/es/playa-del-carmen/costo-administracion-propiedades/">precios de administración en Playa del Carmen</a> para orientación.</p>',
    },
    {
      question: '¿Qué es RETUR-Q y lo necesito para mi Airbnb?',
      answer:
        '<p>RETUR-Q se refiere al registro turístico en Quintana Roo para cierta actividad de renta. Si aplica a tu modelo y cómo interactúa con tu condominio depende del inmueble. Coordinamos el lado operativo del cumplimiento; para certeza legal recomendamos asesoría local calificada.</p>',
    },
    {
      question: '¿Cómo manejan el 6% de hospedaje y otros requisitos?',
      answer:
        '<p>Ayudamos a entender requisitos operativos de expediente y flujos de remisión vinculados a estancias cortas. Las obligaciones exactas varían; mantenemos la operación ordenada para contadores y profesionales fiscales.</p>',
    },
    {
      question: '¿Qué ocupación e ingresos puedo esperar?',
      answer:
        '<p>Depende de colonia, calidad de unidad, amenidades, reseñas y disciplina de precios. Damos benchmarking realista en onboarding—sin prometer “garantías” poco creíbles.</p>',
    },
    {
      question: '¿Administran varias plataformas?',
      answer:
        '<p>Sí—cuando tiene sentido. Coordinamos Airbnb con Booking, VRBO y otros canales manteniendo estándares de limpieza y huésped. Para estrategia multicanal más amplia, ve <a href="/es/playa-del-carmen/gestion-rentas-vacacionales/">gestión de rentas vacacionales</a>.</p>',
    },
    {
      question: '¿Y si quiero usar la propiedad a veces?',
      answer:
        '<p>Configuramos bloques de uso propio y reglas de calendario. Si necesitas planificación híbrida amplia con mantenimiento y estrategia, ve <a href="/es/playa-del-carmen/administracion-de-propiedades/">administración de propiedades</a>.</p>',
    },
    {
      question: '¿Cómo coordinan limpieza y mantenimiento en turnovers?',
      answer:
        '<p>Turnovers con ventanas de tiempo, listas de inspección y responsabilidad de proveedores. Mantenimiento se triage por urgencia—seguridad y experiencia de huésped primero—y se documenta.</p>',
    },
    {
      question: '¿Puedo pasar a renta larga después?',
      answer:
        '<p>Sí. La renta larga cambia calendario, precios y coordinación con inquilinos. Para transición completa, <a href="/es/playa-del-carmen/administracion-de-propiedades/">administración de propiedades</a> es el camino adecuado.</p>',
    },
  ],
}

export type PlayaAirbnbLocaleCopy = AirbnbManagementPillarCopy

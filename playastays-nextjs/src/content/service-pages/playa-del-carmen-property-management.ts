// ============================================================
// Playa del Carmen — property management pillar (EN + ES)
// Blueprint for future /[city]/property-management/ pages
// ============================================================

import { HERO_JPG } from '@/lib/public-assets'

export const PLAYA_PM_HERO_IMAGE = HERO_JPG

/** Shape is reusable for other cities — swap copy, keep keys */
export type PropertyManagementPillarCopy = {
  heroTag: string
  heroHeadline: string
  heroSub: string
  primaryCta: string
  secondaryCta: string
  shortTermLink: string
  shortTermVacationLink: string
  introEyebrow: string
  introTitle: string
  /** Long-form introduction — multiple paragraphs */
  introBody: string[]
  includesEyebrow: string
  includesTitle: string
  includesLead: string
  includesItems: Array<{ title: string; desc: string }>
  strBridgeTitle: string
  strBridgeBody: string
  includesPricingNote: string
  /** Sentence fragments around inline links (pricing page + optional sell) */
  includesPricingBeforeLinks: string
  includesPricingLinkLabel: string
  includesPricingBetweenLinks: string
  includesSellLinkLabel: string
  includesPricingAfterLinks: string
  includesCtaAirbnb: string
  includesCtaVacation: string
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
  finalExploreAirbnb: string
  finalExploreVacation: string
  finalWhatsApp: string
  formTitle: string
  formSubtitle: string
}

export const PLAYA_PM_COPY: Record<'en' | 'es', PropertyManagementPillarCopy> = {
  en: {
    heroTag: 'Property management · Playa del Carmen',
    heroHeadline: 'Property Management in Playa del Carmen',
    heroSub:
      'PlayaStays delivers property management in Playa del Carmen—maintenance, compliance, vendors, and owner reporting for your asset in this market.',
    primaryCta: 'Get a Free Property Management Quote',
    secondaryCta: 'Tell Us About Your Property',
    shortTermLink: 'Airbnb & short-term management',
    shortTermVacationLink: 'Vacation rental management',
    introEyebrow: 'Why it matters here',
    introTitle: 'Why this service matters in Playa del Carmen',
    introBody: [
      'Playa del Carmen sits at the heart of the Riviera Maya—one of the strongest ownership and rental markets in the region. Walkability, beach access, Quinta Avenida, steady international tourism, expat demand, and remote-work travelers all create opportunity. But opportunity without disciplined operations is where properties quietly lose money: missed maintenance, strained HOAs, compliance gaps, and frustrated guests or tenants.',
      'Successful ownership here is rarely “post a listing and collect.” Coastal humidity, salt air, seasonal wear, and condominium rules interact every month. Long-term leases, short-term vacation stays, and hybrid models (personal use part of the year, rental the rest) each require different coordination—access, documentation, vendor standards, and communication cadence.',
      'Absentee owners face the same reality: the asset is in Mexico, but decisions, emergencies, and quality control still need a trusted local team. That is the gap professional management closes. PlayaStays operates as your on-the-ground partner—coordinating inspections, maintenance, vendors, and reporting so small issues do not become expensive surprises.',
      'Our focus is the full ownership lifecycle: protect the property, reduce preventable vacancy, improve compliance posture, and keep you informed with transparent reporting. When your strategy emphasizes short-term performance—listing optimization, pricing velocity, guest messaging, reviews—we route you to our dedicated Airbnb and vacation rental management tracks so this page stays anchored in broad operational excellence.',
      'Whether you are an investor optimizing yield, a part-time resident balancing personal use with rental income, or an owner transitioning between long-term and short-term strategies, we tailor scope to your goals. Playa del Carmen rewards owners who combine local knowledge with consistent execution—exactly what this service is built to deliver.',
    ],
    includesEyebrow: 'Scope of service',
    includesTitle: 'What our property management service includes',
    includesLead:
      'These pillars apply across ownership strategies. They are designed to be broader than channel tactics—maintenance, money, compliance, and risk come first. Short-term execution depth lives on our Airbnb and vacation rental pages.',
    includesItems: [
      {
        title: 'Regular inspections & preventive maintenance',
        desc: 'Scheduled walkthroughs, AC and moisture checks, and preventative work aligned to coastal conditions—so minor issues are caught before they damage finishes, systems, or guest/tenant experience.',
      },
      {
        title: 'Financial management & transparent reporting',
        desc: 'Income and expense tracking, owner-ready summaries, and clear variance notes. You should always understand performance without digging through spreadsheets.',
      },
      {
        title: 'Compliance & regulatory support',
        desc: 'Practical guidance on condominium rules, rental registration expectations, and operational recordkeeping—including coordination around lodging-tax obligations and tourism registry workflows where they apply to your rental model.',
      },
      {
        title: 'Vendor & contractor oversight',
        desc: 'Vetted cleaners, maintenance, and specialists—scoped, scheduled, and held to standards that match your building and property tier.',
      },
      {
        title: 'Tenant & stay coordination',
        desc: 'Long-term tenant communication, lease-aligned coordination, or guest-stay operations—structured so access, keys, and handoffs do not fall through the cracks.',
      },
      {
        title: 'Risk & insurance coordination',
        desc: 'Incident documentation, sensible escalation, and coordination with insurers when claims arise—reducing ambiguity during stressful events.',
      },
      {
        title: 'Property value protection',
        desc: 'Decisions framed around asset longevity, neighbor and HOA relationships, and sustainable economics—not short-term shortcuts that erode the home.',
      },
      {
        title: 'Ongoing owner visibility',
        desc: 'Predictable communication rhythms and a single accountable local team—especially important when you are not in Playa del Carmen.',
      },
    ],
    strBridgeTitle: 'Need deeper short-term execution?',
    strBridgeBody:
      'Guest operations, listing optimization, dynamic pricing, review generation, and turnover performance are covered in depth on our dedicated pages—not duplicated here.',
    includesPricingNote:
      'Fees depend on property type, service scope, and whether the home is long-term leased, short-term rented, owner-occupied part-time, or mixed use. We quote clearly after assessment.',
    includesPricingBeforeLinks: 'For ballpark ranges, see',
    includesPricingLinkLabel: 'Playa del Carmen management pricing',
    includesPricingBetweenLinks: '—and if you are evaluating an exit, explore',
    includesSellLinkLabel: 'sell your property',
    includesPricingAfterLinks: 'We then align scope to your strategy.',
    includesCtaAirbnb: 'Airbnb & short-term rental management',
    includesCtaVacation: 'Vacation rental management',
    processEyebrow: 'Our process',
    processTitle: 'Our property management process',
    processBody:
      'A lifecycle built for owners—not a listing-launch checklist. Expect clarity from first conversation through ongoing operations and annual strategy review.',
    processSteps: [
      {
        title: 'Free consultation & property assessment',
        desc: 'We review your goals, property condition, HOA context, and whether you are leaning long-term, short-term, hybrid, or undecided—then outline realistic options.',
      },
      {
        title: 'Customized management plan',
        desc: 'Scope, cadence, vendor stack, reporting format, and communication preferences—aligned to how involved you want to be.',
      },
      {
        title: 'Onboarding & property setup',
        desc: 'Access, documentation, baseline photos, vendor handoffs, and operational checklists so work starts clean—whether the unit is vacant, tenant-occupied, or in rental rotation.',
      },
      {
        title: 'Ongoing operations & oversight',
        desc: 'Day-to-day coordination: maintenance triage, inspections, vendor quality, and tenant or stay coordination with local accountability.',
      },
      {
        title: 'Reporting & owner reviews',
        desc: 'Financial and operational summaries on an agreed cadence—plus structured check-ins when strategy or market conditions shift.',
      },
      {
        title: 'Annual optimization & strategy adjustment',
        desc: 'Periodic review of capex, positioning, and rental model fit—so the property stays competitive as Playa del Carmen evolves.',
      },
    ],
    whyEyebrow: 'Trust & fit',
    whyTitle: 'Why owners choose PlayaStays in Playa del Carmen',
    whyLead:
      'Owners stay when execution is consistent. We are built for Riviera Maya realities—not distant call centers or one-channel playbooks.',
    whyItems: [
      {
        title: 'Local expertise you can feel',
        desc: 'Neighborhood dynamics, building reputations, seasonal patterns, and what actually breaks in salt air—we plan around real conditions, not generic checklists.',
      },
      {
        title: 'Flexible strategies',
        desc: 'Long-term, short-term, or hybrid—we align operations to your goals and adjust as your life or investment thesis changes.',
      },
      {
        title: 'Compliance without theatrics',
        desc: 'Practical alignment with HOA rules and rental expectations—documented and coordinated to reduce neighbor friction and regulatory surprises.',
      },
      {
        title: 'Transparency in reporting',
        desc: 'You should never wonder what happened last month. Clear numbers, clear notes, clear next steps.',
      },
      {
        title: 'Less stress for absentee owners',
        desc: 'A single accountable team on the ground—so you are not coordinating vendors from another time zone.',
      },
      {
        title: 'Operational consistency',
        desc: 'Repeatable processes beat heroics. We build systems so quality does not depend on “who answered the phone today.”',
      },
    ],
    nbhdEyebrow: 'Neighborhood intelligence',
    nbhdTitle: 'Neighborhood considerations in Playa del Carmen',
    nbhdIntro:
      'The right strategy depends on the address. Guest profiles, HOA posture, noise tolerance, and maintenance load vary block by block. We plan from your exact building and zone—not a city-average stereotype.',
    nbhdZones: [
      {
        name: 'Downtown / Centro & Quinta corridor',
        body: 'High foot traffic, strong hospitality demand, and dense condominiums. Operations often emphasize access control, noise management, and rapid vendor response—whether the unit is long-term or short-term.',
      },
      {
        name: 'Playacar',
        body: 'Gated context, family-oriented demand, and strong HOA coordination. Management emphasizes security procedures, amenity care, and guest or tenant expectations aligned to a master-planned community.',
      },
      {
        name: 'Zazil-Ha / Coco Beach',
        body: 'Beach-adjacent appeal with a quieter tone than the core tourist strip. Positioning and maintenance standards often skew premium; neighbor sensitivity can matter as much as nightly rate.',
      },
      {
        name: 'Ejidal, Colosio & emerging corridors',
        body: 'More diverse inventory and evolving guest or tenant mixes. Success depends on realistic positioning, disciplined maintenance, and clear expectations—especially when strategies shift between long-term and short-term.',
      },
    ],
    nbhdLink: 'Go deeper on city-wide coverage & context on the Playa del Carmen hub →',
    faqEyebrow: 'Owner FAQ',
    faqTitle: 'Property management in Playa del Carmen — common questions',
    finalEyebrow: 'Ready when you are',
    finalTitle: 'Simplify ownership of your Playa del Carmen property',
    finalSub:
      'Whether you prioritize long-term leases, short-term vacation stays, or a smart combination—we will build an operational plan that matches your goals and keeps the asset protected.',
    finalTrustPoints: [
      'Local team based in Playa del Carmen',
      'Riviera Maya ownership & compliance experience',
      'Bilingual ES / EN support',
    ],
    finalQuote: 'Get Your Free Customized Quote',
    finalContact: 'Schedule a Consultation',
    finalExploreAirbnb: 'Explore Airbnb management',
    finalExploreVacation: 'Explore vacation rental management',
    finalWhatsApp: 'WhatsApp',
    formTitle: 'Request a management conversation',
    formSubtitle: 'We respond within 24 hours · No obligation',
  },
  es: {
    heroTag: 'Administración de propiedades · Playa del Carmen',
    heroHeadline: 'Administración de propiedades en Playa del Carmen',
    heroSub:
      'PlayaStays ejecuta administración de propiedades en Playa del Carmen: mantenimiento, cumplimiento, proveedores y reportes al propietario para tu inmueble en este mercado.',
    primaryCta: 'Cotización gratuita de administración',
    secondaryCta: 'Cuéntanos sobre tu propiedad',
    shortTermLink: 'Administración Airbnb y renta corta',
    shortTermVacationLink: 'Gestión de rentas vacacionales',
    introEyebrow: 'Por qué importa aquí',
    introTitle: 'Por qué este servicio importa en Playa del Carmen',
    introBody: [
      'Playa del Carmen está en el corazón de la Riviera Maya—uno de los mercados de inversión y renta más sólidos de la región. Caminabilidad, playa, Quinta Avenida, turismo internacional, demanda de expatriados y trabajo remoto generan oportunidad. Pero la oportunidad sin operación disciplinada es donde muchas propiedades pierden dinero en silencio: mantenimiento pospuesto, fricción con condominios, huecos de cumplimiento y huéspedes o inquilinos frustrados.',
      'El éxito rara vez es “publicar y cobrar.” La humedad costera, el salitre, el desgaste por temporada y las reglas de condominio se combinan cada mes. Renta larga, vacacional o modelos híbridos (uso propio parte del año y renta el resto) exigen coordinación distinta: accesos, documentación, estándares de proveedores y ritmo de comunicación.',
      'Los propietarios a distancia enfrentan el mismo reto: el activo está en México, pero decisiones, emergencias y control de calidad requieren un equipo local de confianza. Ahí entra la administración profesional. PlayaStays actúa como tu socio en terreno: inspecciones, mantenimiento, proveedores y reportes para que los detalles pequeños no se conviertan en reparaciones costosas.',
      'Nuestro enfoque es el ciclo completo del propietario: proteger la unidad, reducir vacancia evitable, mejorar el cumplimiento práctico e informarte con transparencia. Cuando tu estrategia prioriza desempeño de renta corta—anuncio, precios, mensajería, reseñas—te conectamos con nuestras rutas dedicadas de Airbnb y rentas vacacionales; esta página se centra en excelencia operativa amplia.',
      'Ya busques maximizar rendimiento, combinar uso personal con ingresos o transicionar entre renta larga y corta, adaptamos el alcance a tus metas. Playa del Carmen premia a quien combina conocimiento local con ejecución consistente—precisamente lo que este servicio está diseñado para ofrecer.',
    ],
    includesEyebrow: 'Alcance del servicio',
    includesTitle: 'Qué incluye nuestra administración de propiedades',
    includesLead:
      'Estos pilares aplican a cualquier estrategia de propiedad. Van más allá de tácticas de canal: primero el activo, el dinero y el cumplimiento. La profundidad de renta corta está en nuestras páginas de Airbnb y rentas vacacionales.',
    includesItems: [
      {
        title: 'Inspecciones y mantenimiento preventivo',
        desc: 'Recorridos programados, revisión de climatización y humedad, y trabajo preventivo alineado al clima costero—para detectar problemas antes de que dañen acabados, sistemas o experiencia de inquilino/huésped.',
      },
      {
        title: 'Gestión financiera y reportes transparentes',
        desc: 'Seguimiento de ingresos y gastos, resúmenes listos para el propietario y notas de variación claras—sin esconder números en hojas interminables.',
      },
      {
        title: 'Cumplimiento y apoyo regulatorio',
        desc: 'Orientación práctica sobre reglas de condominio, registro de rentas y expediente operativo—incluida coordinación con obligaciones fiscales de hospedaje y trámites de registro turístico cuando aplican a tu modelo.',
      },
      {
        title: 'Supervisión de proveedores y contratistas',
        desc: 'Limpieza, mantenimiento y especialistas validados—programados y exigidos según el nivel de tu desarrollo y unidad.',
      },
      {
        title: 'Coordinación inquilino / estancia',
        desc: 'Comunicación con inquilino de largo plazo o operación de estancias cortas—con accesos y entregas estructurados.',
      },
      {
        title: 'Riesgo y coordinación con seguros',
        desc: 'Documentación de incidentes, escalamiento sensato y coordinación con aseguradoras cuando hay siniestros.',
      },
      {
        title: 'Protección del valor del inmueble',
        desc: 'Decisiones pensadas en longevidad del activo, relación con vecinos y HOA y economía sostenible—no atajos que dañen la propiedad.',
      },
      {
        title: 'Visibilidad continua para el propietario',
        desc: 'Ritmo de comunicación predecible y un equipo local responsable—especialmente si no estás en Playa del Carmen.',
      },
    ],
    strBridgeTitle: '¿Necesitas ejecución profunda en renta corta?',
    strBridgeBody:
      'Operación con huéspedes, optimización de anuncio, precios dinámicos, reseñas y turnovers se desarrollan en páginas dedicadas—no se duplican aquí.',
    includesPricingNote:
      'Las tarifas dependen del tipo de propiedad, alcance y si la unidad es renta larga, corta, uso propio parcial o mixto. Cotizamos con claridad tras evaluación.',
    includesPricingBeforeLinks: 'Para rangos orientativos, consulta',
    includesPricingLinkLabel: 'precios de administración en Playa del Carmen',
    includesPricingBetweenLinks: '—y si evalúas vender, explora',
    includesSellLinkLabel: 'vender tu propiedad',
    includesPricingAfterLinks: 'Luego alineamos el alcance a tu estrategia.',
    includesCtaAirbnb: 'Administración Airbnb y renta corta',
    includesCtaVacation: 'Gestión de rentas vacacionales',
    processEyebrow: 'Proceso',
    processTitle: 'Nuestro proceso de administración',
    processBody:
      'Un ciclo pensado para propietarios: claridad desde la primera conversación hasta la operación continua y la revisión anual de estrategia.',
    processSteps: [
      {
        title: 'Consulta y evaluación gratuita',
        desc: 'Revisamos objetivos, estado del inmueble, contexto del condominio y si orientas a renta larga, corta, híbrida o aún estás decidiendo.',
      },
      {
        title: 'Plan de administración personalizado',
        desc: 'Alcance, cadencia, proveedores, formato de reportes y comunicación—según tu nivel de involucramiento.',
      },
      {
        title: 'Onboarding y puesta en marcha',
        desc: 'Accesos, documentación, fotos base, proveedores y listas operativas para arrancar ordenado—incluida unidad vacante, con inquilino o en rotación.',
      },
      {
        title: 'Operación y supervisión continua',
        desc: 'Coordinación diaria: mantenimiento, inspecciones, calidad de proveedores y coordinación con inquilino o estancias.',
      },
      {
        title: 'Reportes y revisiones con el propietario',
        desc: 'Resúmenes financieros y operativos en la cadencia acordada—más revisiones cuando cambian mercado o estrategia.',
      },
      {
        title: 'Optimización anual y ajuste de estrategia',
        desc: 'Revisión periódica de capex, posicionamiento y ajuste del modelo de renta ante cambios en Playa del Carmen.',
      },
    ],
    whyEyebrow: 'Confianza y encaje',
    whyTitle: 'Por qué los propietarios eligen PlayaStays en Playa del Carmen',
    whyLead:
      'Los propietarios se quedan cuando la ejecución es consistente. Estamos hechos para la realidad de la Riviera Maya—no para call centers lejanos ni un solo canal.',
    whyItems: [
      {
        title: 'Experiencia local tangible',
        desc: 'Dinámica por colonia, reputación de edificios, estacionalidad y qué falla con salitre—planificamos con condiciones reales.',
      },
      {
        title: 'Estrategias flexibles',
        desc: 'Larga, corta o híbrida—alineamos operación a tus metas y ajustamos cuando cambia tu vida o tesis de inversión.',
      },
      {
        title: 'Cumplimiento sin drama',
        desc: 'Alineación práctica con HOA y expectativas de renta—documentada y coordinada para reducir fricción.',
      },
      {
        title: 'Transparencia en reportes',
        desc: 'Números y notas claras: qué pasó el mes pasado y qué sigue.',
      },
      {
        title: 'Menos estrés a distancia',
        desc: 'Un solo equipo responsable en terreno—sin coordinar proveedores desde otra zona horaria.',
      },
      {
        title: 'Consistencia operativa',
        desc: 'Procesos repetibles vencen al heroísmo: la calidad no depende de quién contestó el teléfono hoy.',
      },
    ],
    nbhdEyebrow: 'Inteligencia por zona',
    nbhdTitle: 'Consideraciones por colonia en Playa del Carmen',
    nbhdIntro:
      'La estrategia correcta depende de la dirección. Perfil de huésped o inquilino, postura del condominio, ruido y carga de mantenimiento cambian calle a calle. Planificamos desde tu edificio y zona—no desde un promedio genérico.',
    nbhdZones: [
      {
        name: 'Centro y corredor de la Quinta',
        body: 'Alto flujo peatonal, demanda hotelera fuerte y condominios densos. La operación suele enfatizar control de accesos, gestión de ruido y respuesta rápida de proveedores—independientemente de renta larga o corta.',
      },
      {
        name: 'Playacar',
        body: 'Entorno cerrado, demanda familiar y coordinación fuerte con HOA. Se enfatizan procedimientos de seguridad, cuidado de amenidades y expectativas alineadas a comunidad planificada.',
      },
      {
        name: 'Zazil-Ha / Coco Beach',
        body: 'Atractivo cercano a la playa con tono más tranquilo que el núcleo turístico. Posicionamiento y mantenimiento suelen ser más premium; la sensibilidad vecinal puede pesar tanto como la tarifa.',
      },
      {
        name: 'Ejidal, Colosio y corredores en evolución',
        body: 'Inventario más diverso y perfiles de huésped o inquilino en cambio. El éxito exige posicionamiento realista, mantenimiento disciplinado y expectativas claras—especialmente si alternas entre renta larga y corta.',
      },
    ],
    nbhdLink: 'Más contexto y cobertura en el hub de Playa del Carmen →',
    faqEyebrow: 'Preguntas frecuentes',
    faqTitle: 'Administración de propiedades en Playa del Carmen',
    finalEyebrow: 'Cuando estés listo',
    finalTitle: 'Simplifica la propiedad de tu inmueble en Playa del Carmen',
    finalSub:
      'Priorices renta larga, estancias vacacionales o una combinación inteligente—construiremos un plan operativo acorde a tus metas y a la protección del activo.',
    finalTrustPoints: [
      'Equipo local en Playa del Carmen',
      'Experiencia en propiedad y cumplimiento en Riviera Maya',
      'Atención bilingüe ES / EN',
    ],
    finalQuote: 'Solicitar cotización personalizada',
    finalContact: 'Agendar consulta',
    finalExploreAirbnb: 'Ver administración Airbnb',
    finalExploreVacation: 'Ver rentas vacacionales',
    finalWhatsApp: 'WhatsApp',
    formTitle: 'Solicitar conversación de administración',
    formSubtitle: 'Respuesta en 24 horas · Sin compromiso',
  },
}

export type PlayaPmFaqItem = { question: string; answer: string }

export const PLAYA_PM_FALLBACK_FAQS: Record<'en' | 'es', PlayaPmFaqItem[]> = {
  en: [
    {
      question: 'What is the difference between long-term and short-term property management in Playa del Carmen?',
      answer:
        '<p><strong>Long-term</strong> management emphasizes stable leasing, tenant relations, lease compliance, and predictable maintenance cadence. <strong>Short-term</strong> management adds higher-frequency turnovers, guest messaging, and channel execution. <strong>Hybrid</strong> models blend personal-use windows with rental periods—requiring clear calendars and vendor coordination. This page covers the operational foundation for all three; deep short-term tactics live on our <a href="/playa-del-carmen/airbnb-management/">Airbnb management</a> and <a href="/playa-del-carmen/vacation-rental-management/">vacation rental management</a> pages.</p>',
    },
    {
      question: 'How do you help with RETUR-Q registration and the lodging tax (e.g. the 6% hospitality tax)?',
      answer:
        '<p>Requirements evolve, and your exact obligations depend on property type, rental model, and current state and municipal rules. We help owners understand the <em>operational</em> side: documentation cadence, practical recordkeeping, and coordination with your filing approach—so you are not guessing from abroad. For tax positions specific to your situation, we recommend a qualified local accountant; we keep operations organized so professionals can work efficiently.</p>',
    },
    {
      question: 'What are typical management fees?',
      answer:
        '<p>Fees vary by scope: long-term oversight differs from short-term programs with frequent turnovers. We provide clear pricing after understanding your property and strategy. For orientation, see <a href="/playa-del-carmen/property-management-cost/">Playa del Carmen management pricing</a>—then we align the plan to your goals.</p>',
    },
    {
      question: 'Can I switch between long-term and short-term strategies later?',
      answer:
        '<p>Yes—many owners evolve their model. The right move is a planned transition: vendor stack, calendar rules, HOA notifications, and guest-or-tenant expectations. We help you retool operations responsibly rather than improvising mid-season.</p>',
    },
    {
      question: 'What if I want to use the property personally part of the year?',
      answer:
        '<p>Hybrid ownership is common. We set up calendars, access protocols, and maintenance windows so personal use and rental periods do not conflict—and vendors know when the unit is owner-occupied versus guest-occupied.</p>',
    },
    {
      question: 'What happens during hurricane season?',
      answer:
        '<p>We emphasize preparedness: exterior checks when appropriate, contingency communication, vendor availability context, and documentation if weather affects the property. Exact protocols depend on your building and management plan—but the goal is always safety first, then asset protection, then guest/tenant communication.</p>',
    },
    {
      question: 'How quickly do you respond to maintenance issues?',
      answer:
        '<p>Urgent issues (water intrusion, electrical safety, security) are triaged immediately and escalated on a clear path. Non-urgent items are scheduled and documented. Response expectations are set in onboarding so you know what “urgent” means for your building tier.</p>',
    },
    {
      question: 'Where should I go for Airbnb listing optimization and review generation?',
      answer:
        '<p>Those topics are channel-execution focused. Start with <a href="/playa-del-carmen/airbnb-management/">Airbnb & short-term rental management</a> for platform-centric execution, and <a href="/playa-del-carmen/vacation-rental-management/">vacation rental management</a> for broader multi-channel performance and guest experience depth.</p>',
    },
  ],
  es: [
    {
      question: '¿En qué se diferencia la administración para renta larga y renta corta en Playa del Carmen?',
      answer:
        '<p>La renta <strong>larga</strong> enfatiza arrendamiento estable, relación con inquilino, cumplimiento de contrato y mantenimiento con cadencia predecible. La renta <strong>corta</strong> añade más turnovers, mensajería con huéspedes y ejecución por canales. Los modelos <strong>híbridos</strong> combinan uso propio con renta—requieren calendario claro y proveedores coordinados. Esta página cubre la base operativa; la profundidad de renta corta está en <a href="/es/playa-del-carmen/administracion-airbnb/">administración Airbnb</a> y <a href="/es/playa-del-carmen/gestion-rentas-vacacionales/">gestión de rentas vacacionales</a>.</p>',
    },
    {
      question: '¿Cómo ayudan con el registro RETUR y el impuesto de hospedaje (p. ej. 6%)?',
      answer:
        '<p>Los requisitos evolucionan y dependen del tipo de propiedad, modelo de renta y normativa vigente. Ayudamos en el lado <em>operativo</em>: cadencia de documentación, expediente y coordinación con tu enfoque de declaración—para no adivinar a distancia. Para posiciones fiscales específicas recomendamos contador local calificado; mantenemos la operación ordenada para que los profesionales trabajen con claridad.</p>',
    },
    {
      question: '¿Cuáles son las tarifas típicas de administración?',
      answer:
        '<p>Varían según alcance: la supervisión de renta larga difiere de programas de renta corta con turnovers frecuentes. Cotizamos con claridad tras conocer tu propiedad y estrategia. Para orientación visita <a href="/es/playa-del-carmen/costo-administracion-propiedades/">precios de administración en Playa del Carmen</a>.</p>',
    },
    {
      question: '¿Puedo cambiar después entre renta larga y corta?',
      answer:
        '<p>Sí—muchos propietarios evolucionan el modelo. Lo importante es una transición planificada: proveedores, calendario, avisos al condominio y expectativas de huésped o inquilino. Reconfiguramos operación con responsabilidad, no a improvisación.</p>',
    },
    {
      question: '¿Y si quiero usar la propiedad parte del año?',
      answer:
        '<p>El uso híbrido es frecuente. Configuramos calendarios, accesos y ventanas de mantenimiento para que uso personal y renta no choquen—y los proveedores sepan cuándo la unidad es uso propio versus renta.</p>',
    },
    {
      question: '¿Qué pasa en temporada de huracanes?',
      answer:
        '<p>Priorizamos preparación: revisiones cuando aplica, comunicación de contingencia, contexto de disponibilidad de proveedores y documentación si el clima afecta el inmueble. Los protocolos exactos dependen de tu edificio y plan—seguridad primero, luego protección del activo y comunicación con huésped o inquilino.</p>',
    },
    {
      question: '¿Qué tan rápido responden a mantenimiento?',
      answer:
        '<p>Incidencias urgentes (humedad, electricidad insegura, seguridad) se triage de inmediato con escalamiento claro. Lo no urgente se programa y documenta. En el onboarding definimos expectativas para que “urgente” sea claro según tu desarrollo.</p>',
    },
    {
      question: '¿Dónde profundizan en anuncio Airbnb y reseñas?',
      answer:
        '<p>Es ejecución de canal. Ve a <a href="/es/playa-del-carmen/administracion-airbnb/">administración Airbnb y renta corta</a> y <a href="/es/playa-del-carmen/gestion-rentas-vacacionales/">gestión de rentas vacacionales</a> para el detalle de plataformas y experiencia de huésped.</p>',
    },
  ],
}

/** Re-export type alias for this city */
export type PlayaPmLocaleCopy = PropertyManagementPillarCopy

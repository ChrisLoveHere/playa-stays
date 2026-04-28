// ============================================================
// Global service hub copy — broad positioning (not city pillars)
// ============================================================

import type { ServiceHubRegistry } from './types'
import type { ServiceHubId } from '@/lib/service-hub-constants'
import { HERO_JPG } from '@/lib/public-assets'

const IMG_PM = HERO_JPG
const IMG_AB = HERO_JPG
const IMG_VR = HERO_JPG
const IMG_SELL = HERO_JPG

export const SERVICE_HUB_REGISTRY: ServiceHubRegistry = {
  'property-management': {
    en: {
      seo: {
        title: 'Property Management in the Riviera Maya | PlayaStays',
        description:
          'Full-service vacation rental and property management across Quintana Roo. Long-term, short-term, and hybrid strategies—maintenance, compliance, vendors, and owner reporting. Outcomes vary by property versus self-managing; choose your city for local execution and next steps.',
      },
      heroTag: 'Riviera Maya · Owner operations',
      heroHeadline: 'Property Management Across the <em>Riviera Maya</em>',
      heroSub:
        'Full-service property management across Quintana Roo—maintenance, compliance, vendors, and owner reporting. Choose your city for local execution; this page stays regional.',
      primaryCta: 'Get a free management quote',
      secondaryCta: 'Choose your city',
      whatEyebrow: 'What this is',
      whatTitle: 'Property management designed for real owner operations',
      whatBody: [
        'This regional page now focuses on the practical baseline every owner gets with PlayaStays. For neighborhood-level dynamics and demand context, use the city cards above and open your local page.',
      ],
      includesEyebrow: 'Base property care',
      includesTitle: 'What’s included with every PlayaStays property',
      includesLead:
        'Your $125/mo Property Care fee covers the operational baseline. Every property we manage gets all of this — no surprises, no upcharges for the basics.',
      includesItems: [
        {
          title: 'Consumables restocking',
          desc: 'Toiletries, paper goods, and cleaning supplies kept stocked so guests arrive to a ready property. We track usage and replenish during turnovers.',
        },
        {
          title: 'Preventive maintenance & quarterly inspections',
          desc: 'Scheduled walk-throughs catch issues before guests do. Plumbing, electrical, appliances, and structural checks every 90 days.',
        },
        {
          title: 'AC system maintenance',
          desc: 'Filter changes, condenser cleaning, and refrigerant checks. AC failure is the fastest way to a bad review in Quintana Roo — we stay ahead of it.',
        },
        {
          title: 'Professional photography',
          desc: 'One professional photoshoot at onboarding. Sharp, well-lit listings outperform amateur photos by a wide margin on every booking platform.',
        },
        {
          title: 'Marketing & listing optimization',
          desc: 'Listing copy, photo selection, pricing input, and ongoing optimization across the platforms your strategy uses.',
        },
        {
          title: 'Bilingual owner reporting',
          desc: 'Monthly reports in English or Spanish covering income, expenses, occupancy, and any property issues. Direct deposits arrive monthly.',
        },
        {
          title: 'Vendor coordination & oversight',
          desc: 'Trusted local trades for cleaning, repairs, and maintenance. We manage them, you do not.',
        },
        {
          title: 'HOA & permit compliance',
          desc: 'Tourist tax, RFC coordination, HOA bylaw adherence, and insurance documentation. The boring work that protects your asset.',
        },
      ],
      processEyebrow: 'Our process',
      processTitle: 'How we onboard owners and run properties',
      processLead: 'Most owners are running with us inside 30 days. Here’s the path from first call to monthly reporting.',
      processSteps: [
        {
          title: 'Discovery & goals',
          desc: 'We align on ownership objectives, property condition, and the right rental model for your situation.',
        },
        {
          title: 'Scope & compliance check',
          desc: 'HOA, insurance, and regulatory context are reviewed before we commit to timelines.',
        },
        {
          title: 'Handover & systems',
          desc: 'Access, vendors, and reporting cadence are set—so nothing depends on informal follow-ups.',
        },
        {
          title: 'Operate & report',
          desc: 'Monthly visibility into performance, spend, and issues—with clear escalation paths.',
        },
        {
          title: 'Quarterly review',
          desc: 'We adjust strategy as markets shift—occupancy, rates, capex, and owner use windows.',
        },
      ],
      whyEyebrow: 'Who it helps',
      whyTitle: 'Owners who need accountable operations—not inbox chaos',
      whyLead:
        'Owners choose us when they want one accountable partner—not a rotating cast of remote coordinators.',
      whyItems: [
        {
          title: 'Integrated teams',
          desc: 'Management, guest operations, and maintenance share systems—fewer handoffs, faster fixes.',
        },
        {
          title: 'Transparent reporting',
          desc: 'Owners should never wonder what happened last month—or why.',
        },
        {
          title: 'Ethical growth',
          desc: 'We build sustainable performance: strong assets, strong reviews, strong returns.',
        },
      ],
      citiesEyebrow: 'Choose your market',
      citiesTitle: 'Where we deliver property management',
      citiesIntro:
        'Pick your market. The main link opens property management in that city. Want neighborhoods and demand context first? Use the subtle market link.',
      relatedEyebrow: 'Related services',
      relatedTitle: 'Often paired with property management',
      relatedIntro:
        'These services overlap in places—but each page has a distinct job. Use them together when your strategy requires it.',
      addOnsEyebrow: 'Beyond the basics',
      addOnsTitle: 'Add-on service packages for owners who want more',
      addOnsIntro:
        'These optional packages layer on top of base Property Care. Each is a complete program — install, configure, monitor, maintain.',
      addOnsItems: [
        {
          title: 'Smart Home Package',
          desc: 'Make your property smarter, safer, and more guest-friendly.',
          bullets: [
            'Smart locks & keyless entry',
            'Security cameras (exterior)',
            'Wi-Fi optimization & mesh network',
            'Streaming TV & entertainment setup',
          ],
          cta: 'Learn more →',
        },
        {
          title: 'Pool & Hot Tub Care',
          desc: 'Properties with water features need specialized attention.',
          bullets: [
            'Weekly chemical balance & cleaning',
            'Equipment monitoring & maintenance',
            'Pre-arrival temperature & cleanliness checks',
            'Off-season covers & winterization',
          ],
          cta: 'Learn more →',
        },
        {
          title: 'Hurricane Prep & Backup Power',
          desc: 'Quintana Roo’s storm season is real. Be ready before the forecast goes red.',
          bullets: [
            'Battery backup & generator install',
            'Storm shutter inspection & deployment',
            'Pre-storm property securing',
            'Post-storm assessment & cleanup',
          ],
          cta: 'Learn more →',
        },
      ],
      addOnsNote:
        'Each package is a custom quote based on your property’s size and existing infrastructure. Contact us for a walk-through.',
      faqEyebrow: 'FAQ',
      faqTitle: 'Property management — common questions',
      faqs: [
        {
          question: 'Is this the same as Airbnb management?',
          answer:
            '<p>No. <strong>Property management</strong> is the broad ownership layer—maintenance, strategy across rental models, reporting, and vendors. <a href="/airbnb-management/">Airbnb management</a> focuses on short-term listing performance and guest operations. Many owners use both.</p>',
        },
        {
          question: 'Do you cover all of Quintana Roo?',
          answer:
            '<p>We operate across the markets listed below. If your address is adjacent or emerging, ask—we’ll be direct about coverage and timelines.</p>',
        },
        {
          question: 'Where are fees explained?',
          answer:
            '<p>See <a href="/property-management-pricing/">management pricing</a> for fee orientation. Final scope is quoted after property review.</p>',
        },
        {
          question: 'I currently have another manager — can I switch to PlayaStays?',
          answer:
            '<p>Yes. We help owners switch managers regularly. We coordinate the handover—including booking calendar transitions, vendor relationships, and access. Most switches complete within about 30 days.</p>',
        },
        {
          question: 'Do you only manage short-term vacation rentals, or long-term too?',
          answer:
            '<p>Both. Some owners prefer the higher revenue of vacation rental management; others prefer the stability of long-term leases (3–12 months). Many use a hybrid: vacation in high season and long-term in low season. We help you choose based on your property and goals.</p>',
        },
        {
          question: 'How are owner reports delivered?',
          answer:
            '<p>Monthly reports include income, expenses, occupancy, and any property issues. Direct deposits arrive monthly. Owners on our PRO tier get on-demand reporting through their owner portal.</p>',
        },
        {
          question: 'What if my property has HOA restrictions on rentals?',
          answer:
            '<p>We review HOA bylaws before taking on a property. Many Quintana Roo HOAs set rules on minimum stays or rental platforms. We work within those rules and flag conflicts upfront—no surprises.</p>',
        },
        {
          question: 'Do I need an RFC or specific Mexican tax documentation to rent legally?',
          answer:
            '<p>For short-term vacation rentals, owners typically need a tourist tax setup, and depending on your structure, an RFC. We help foreign owners coordinate with their Mexican accountant. We don’t provide tax advice, but we can point you to professionals who do.</p>',
        },
      ],
      finalEyebrow: 'Next step',
      finalTitle: 'Tell us about your property—we’ll propose a clear plan',
      finalSub:
        'No obligation. Our team responds quickly with next steps and the right city lead for your address.',
      formTitle: 'Request a management quote',
      formSubtitle: 'Riviera Maya team · Response within 24 hours',
      relatedHubIds: ['airbnb-management', 'vacation-rental-management', 'sell-property'],
    },
    es: {
      seo: {
        title: 'Administración de propiedades en Riviera Maya | PlayaStays',
        description:
          'Administración integral de rentas vacacionales en Quintana Roo. Estrategias de renta larga, corta o híbridas; mantenimiento, cumplimiento y reportes. Los resultados varían frente a la autogestión según tu inmueble; elige tu ciudad para ejecución local y siguientes pasos.',
      },
      heroTag: 'Riviera Maya · Operación para propietarios',
      heroHeadline: 'Administración de propiedades en la <em>Riviera Maya</em>',
      heroSub:
        'Administración integral de propiedades en Quintana Roo: mantenimiento, cumplimiento, proveedores y reportes al propietario. Elige tu ciudad para ejecución local; esta página es regional.',
      primaryCta: 'Solicitar cotización',
      secondaryCta: 'Elige tu ciudad',
      whatEyebrow: 'Qué es esto',
      whatTitle: 'Administración diseñada para la operación real del propietario',
      whatBody: [
        'Esta página regional ahora prioriza el piso operativo que recibe cada propietario con PlayaStays. Para dinámica por colonia y contexto local de demanda, usa las tarjetas de ciudad de arriba y abre tu página específica.',
      ],
      includesEyebrow: 'Base de cuidado del inmueble',
      includesTitle: 'Qué incluye cada propiedad con PlayaStays',
      includesLead: 'Tu cuota Property Care de $125/mes cubre la base operativa. Toda propiedad que administramos recibe esto — sin sorpresas ni cargos extra en lo básico.',
      includesItems: [
        { title: 'Reposición de consumibles', desc: 'Amenidades, papelería y suministros de limpieza siempre listos para la llegada del huésped. Monitoreamos consumo y reponemos en cada rotación.' },
        { title: 'Mantenimiento preventivo e inspecciones trimestrales', desc: 'Recorridos programados detectan problemas antes que el huésped. Revisiones de plomería, electricidad, electrodomésticos y estructura cada 90 días.' },
        { title: 'Mantenimiento de aire acondicionado', desc: 'Cambio de filtros, limpieza de condensador y revisión de refrigerante. En Quintana Roo, una falla de A/C es la vía más rápida a malas reseñas.' },
        { title: 'Fotografía profesional', desc: 'Una sesión profesional al inicio. Imágenes nítidas y bien iluminadas superan por amplio margen a fotos amateur en cualquier plataforma.' },
        { title: 'Marketing y optimización del anuncio', desc: 'Copy del listing, selección de fotos, insumos de precios y optimización continua en las plataformas que use tu estrategia.' },
        { title: 'Reportes bilingües al propietario', desc: 'Reportes mensuales en inglés o español con ingresos, gastos, ocupación e incidencias del inmueble. Depósitos directos cada mes.' },
        { title: 'Coordinación y supervisión de proveedores', desc: 'Red local de limpieza, reparación y mantenimiento. Nosotros los coordinamos; tú no tienes que hacerlo.' },
        { title: 'Cumplimiento HOA y permisos', desc: 'Impuesto al hospedaje, coordinación RFC, reglamento de condominio y documentación de seguros. Lo “aburrido” que protege tu activo.' },
      ],
      processEyebrow: 'Nuestro proceso',
      processTitle: 'Cómo incorporamos propietarios y operamos inmuebles',
      processLead: 'La mayoría de propietarios está operando con nosotros en 30 días o menos. Este es el camino de la primera llamada al reporte mensual.',
      processSteps: [
        { title: 'Diagnóstico y metas', desc: 'Alineamos objetivos, estado del inmueble y modelo de renta.' },
        { title: 'Alcance y cumplimiento', desc: 'Condominio, seguros y marco regulatorio antes de comprometer plazos.' },
        { title: 'Entrega y sistemas', desc: 'Accesos, proveedores y cadencia de reportes sin depender del improvisado.' },
        { title: 'Operar y reportar', desc: 'Visibilidad mensual de desempeño, gasto e incidencias.' },
        { title: 'Revisión trimestral', desc: 'Ajustamos estrategia según mercado y uso del propietario.' },
      ],
      whyEyebrow: 'Para quién es',
      whyTitle: 'Propietarios que necesitan operación seria—no ruido en el correo',
      whyLead: 'Un solo socio operativo—no coordinadores remotos rotativos.',
      whyItems: [
        { title: 'Equipos integrados', desc: 'Administración, huéspedes y mantenimiento comparten sistemas.' },
        { title: 'Reportes transparentes', desc: 'Claridad sobre lo ocurrido cada mes.' },
        { title: 'Crecimiento sostenible', desc: 'Activos, reseñas y rendimiento que duran.' },
      ],
      citiesEyebrow: 'Elige tu mercado',
      citiesTitle: 'Dónde administramos',
      citiesIntro:
        'Elige tu mercado. El enlace principal abre administración en esa ciudad. ¿Prefieres colonias y contexto primero? Usa el enlace de mercado.',
      relatedEyebrow: 'Servicios relacionados',
      relatedTitle: 'Suele combinarse con',
      relatedIntro: 'Cada página tiene un rol distinto; combínalas cuando tu estrategia lo requiera.',
      addOnsEyebrow: 'Más allá de lo básico',
      addOnsTitle: 'Paquetes adicionales para propietarios que quieren más',
      addOnsIntro:
        'Estos paquetes opcionales se montan sobre la base Property Care. Cada uno es un programa completo: instalar, configurar, monitorear y mantener.',
      addOnsItems: [
        {
          title: 'Paquete Smart Home',
          desc: 'Haz tu propiedad más inteligente, segura y cómoda para huéspedes.',
          bullets: [
            'Cerraduras inteligentes y acceso sin llaves',
            'Cámaras de seguridad (exterior)',
            'Optimización Wi-Fi y red mesh',
            'Configuración de TV streaming y entretenimiento',
          ],
          cta: 'Conocer más →',
        },
        {
          title: 'Cuidado de alberca y jacuzzi',
          desc: 'Las propiedades con amenidades de agua requieren atención especializada.',
          bullets: [
            'Balance químico y limpieza semanal',
            'Monitoreo y mantenimiento de equipos',
            'Verificación de temperatura y limpieza antes de llegada',
            'Cubiertas y preparación de temporada baja',
          ],
          cta: 'Conocer más →',
        },
        {
          title: 'Preparación para huracanes y energía de respaldo',
          desc: 'La temporada de tormentas en Quintana Roo es real. Prepárate antes de que el pronóstico se ponga en rojo.',
          bullets: [
            'Instalación de baterías de respaldo y generador',
            'Inspección y despliegue de protecciones anticiclónicas',
            'Aseguramiento del inmueble previo a tormenta',
            'Evaluación y limpieza post-tormenta',
          ],
          cta: 'Conocer más →',
        },
      ],
      addOnsNote:
        'Cada paquete se cotiza a medida según tamaño de la propiedad e infraestructura existente. Contáctanos para una evaluación guiada.',
      faqEyebrow: 'Preguntas',
      faqTitle: 'Administración de propiedades',
      faqs: [
        {
          question: '¿Es lo mismo que administración Airbnb?',
          answer:
            '<p>No. La <strong>administración de propiedades</strong> es la capa amplia: mantenimiento, estrategia, reportes y proveedores. La <a href="/es/administracion-airbnb/">administración Airbnb</a> se centra en anuncio y huéspedes en renta corta. Muchos propietarios usan ambas.</p>',
        },
        {
          question: '¿Cubren todo Quintana Roo?',
          answer:
            '<p>Operamos en los mercados listados abajo. Si tu dirección es colindante, pregunta: seremos claros sobre cobertura.</p>',
        },
        {
          question: '¿Dónde veo honorarios?',
          answer:
            '<p>Consulta <a href="/es/precios-administracion-propiedades/">precios de administración</a>. La cotización final es tras revisar la propiedad.</p>',
        },
        {
          question: 'Ya tengo otro administrador — ¿puedo cambiarme a PlayaStays?',
          answer:
            '<p>Sí. Ayudamos con frecuencia a propietarios que cambian de administrador. Coordinamos la transición: calendario de reservas, proveedores y accesos. La mayoría de los cambios se concretan en unos 30 días.</p>',
        },
        {
          question: '¿Solo administran renta vacacional o también renta larga?',
          answer:
            '<p>Ambas. Algunos propietarios priorizan el ingreso de renta vacacional; otros, la estabilidad de arrendamiento de 3 a 12 meses. Muchos combinan: vacacional en temporada alta y largo plazo en baja. Te orientamos según tu propiedad y tus metas.</p>',
        },
        {
          question: '¿Cómo recibo los reportes para el propietario?',
          answer:
            '<p>Los reportes mensuales incluyen ingresos, gastos, ocupación e incidencias del inmueble. Los depósitos suelen ser mensuales. En el nivel PRO, el portal del propietario permite consultas bajo demanda.</p>',
        },
        {
          question: '¿Qué pasa si el condominio restringe rentas?',
          answer:
            '<p>Revisamos el reglamento antes de asumir una propiedad. En Quintana Roo muchos condominios fijan estancias mínimas o plataformas permitidas. Trabajamos dentro de esas reglas y te advertimos conflictos desde el inicio.</p>',
        },
        {
          question: '¿Necesito RFC u otro trámite fiscal en México para rentar en regla?',
          answer:
            '<p>En renta vacacional de corto plazo suele requerirse el esquema de impuesto al hospedaje y, según tu estructura, RFC. Ayudamos a propietarios extranjeros a coordinarse con su contador en México. No damos asesoría fiscal, pero te conectamos con quien sí la brinda.</p>',
        },
      ],
      finalEyebrow: 'Siguiente paso',
      finalTitle: 'Cuéntanos tu propiedad — te proponemos un plan claro',
      finalSub: 'Sin compromiso. Respuesta rápida con el contacto correcto por ciudad.',
      formTitle: 'Solicitar cotización de administración',
      formSubtitle: 'Equipo Riviera Maya · Respuesta en 24 h',
      relatedHubIds: ['airbnb-management', 'vacation-rental-management', 'sell-property'],
    },
  },

  'airbnb-management': {
    en: {
      seo: {
        title: 'Airbnb & Short-Term Rental Management | PlayaStays — Riviera Maya',
        description:
          'Listing optimization, dynamic pricing, guest messaging, turnovers, and STR compliance support across Quintana Roo. Pick your city for local execution and market-specific guidance.',
      },
      heroTag: 'Short-term rentals · Performance',
      heroHeadline: 'Airbnb Management for Owners in <em>Quintana Roo</em>',
      heroSub:
        'We run listings, pricing, calendars, guest communication, turnovers, and STR discipline. This page is regional—choose your city for local execution, compliance nuances, and FAQs.',
      primaryCta: 'Get an STR management quote',
      secondaryCta: 'WhatsApp the team',
      whatEyebrow: 'Role of this page',
      whatTitle: 'Platform execution—not general property oversight',
      whatBody: [
        'Short-term success is won in the details: response times, photo accuracy, rate moves, review recovery, and spotless turnovers. This service is purpose-built for that pace—distinct from broader property management (maintenance programs, long-term leasing strategy, holistic asset operations).',
        'If you need both, we coordinate them—but the Airbnb page stays focused on booking performance and guest operations. For whole-portfolio vacation rental strategy, see vacation rental management.',
      ],
      includesEyebrow: 'What we run',
      includesTitle: 'Short-term rental execution',
      includesLead: 'The operational stack owners feel every day on Airbnb, Booking.com, VRBO, and similar channels.',
      includesItems: [
        { title: 'Listing optimization', desc: 'Titles, amenities, photography direction, and ongoing tuning as algorithms shift.' },
        { title: 'Dynamic pricing', desc: 'Seasonality, events, competitive sets, and minimum stays—balanced for revenue and review stability.' },
        { title: 'Guest messaging', desc: 'Inquiry-to-checkout communication with hospitality standards that protect ratings.' },
        { title: 'Turnovers', desc: 'Cleaning windows, inspections, linen, and damage documentation between stays.' },
        { title: 'Channel coordination', desc: 'Calendar hygiene and multi-channel execution without fragmenting standards.' },
        { title: 'Compliance support', desc: 'Practical coordination around registration, lodging tax workflows, and HOA rules—where applicable.' },
      ],
      processEyebrow: 'How it works',
      processTitle: 'Short-term operations lifecycle',
      processLead: 'Designed for speed-to-performance without skipping compliance checkpoints.',
      processSteps: [
        { title: 'Strategy & unit review', desc: 'Comp sets, positioning, and constraints (HOA, noise, access).' },
        { title: 'Listing build & pricing baselines', desc: 'Assets, copy, house rules, and opening rate strategy.' },
        { title: 'Go-live & active hosting', desc: 'Messaging SLAs, issue resolution, and quality control in peak windows.' },
        { title: 'Optimize continuously', desc: 'Experiments, review responses, and revenue diagnostics.' },
        { title: 'Monthly reporting', desc: 'Occupancy, ADR, revenue drivers—plain language for owners.' },
      ],
      whyEyebrow: 'Who it helps',
      whyTitle: 'Owners competing on listing performance and guest experience',
      whyLead: 'Short-term rentals punish inconsistency—we build systems that scale without losing the human touch.',
      whyItems: [
        { title: 'Hospitality mindset', desc: 'Guests buy experiences; we manage the operational detail behind five-star outcomes.' },
        { title: 'Data-informed pricing', desc: 'Not guesswork—structured rules with human oversight in volatile weeks.' },
        { title: 'Defensible operations', desc: 'Documentation and process so your listing stays resilient under scrutiny.' },
      ],
      citiesEyebrow: 'Choose your market',
      citiesTitle: 'Airbnb management by city',
      citiesIntro:
        'Pick your market. The main link opens Airbnb / short-term management in that city. For neighborhoods and demand context first, use the market link.',
      relatedEyebrow: 'Related services',
      relatedTitle: 'Adjacent offerings',
      relatedIntro: 'Move between hubs when your strategy spans more than short-term execution alone.',
      faqEyebrow: 'FAQ',
      faqTitle: 'Airbnb management — common questions',
      faqs: [
        {
          question: 'How is this different from property management?',
          answer:
            '<p><a href="/property-management/">Property management</a> covers broader ownership operations (maintenance, long-term strategy, reporting across models). This hub focuses on short-term booking performance and guest operations.</p>',
        },
        {
          question: 'What about vacation rental management?',
          answer:
            '<p><a href="/vacation-rental-management/">Vacation rental management</a> emphasizes multi-channel business performance and guest experience across the whole rental business—often broader than Airbnb-only execution.</p>',
        },
      ],
      finalEyebrow: 'Ready',
      finalTitle: 'Improve listing performance with a team that stays in the market',
      finalSub: 'Tell us your address—we’ll route you to the right city lead and next steps.',
      formTitle: 'Request Airbnb management info',
      formSubtitle: 'STR specialists · 24-hour response',
      relatedHubIds: ['property-management', 'vacation-rental-management', 'sell-property'],
    },
    es: {
      seo: {
        title: 'Administración Airbnb y renta corta | PlayaStays — Riviera Maya',
        description:
          'Optimización de anuncios, precios dinámicos, mensajería, limpiezas y apoyo en cumplimiento de renta corta en Quintana Roo. Elige tu ciudad para ejecución local.',
      },
      heroTag: 'Renta corta · Desempeño',
      heroHeadline: 'Administración Airbnb para propietarios en <em>Quintana Roo</em>',
      heroSub:
        'Anuncios, precios, calendarios, mensajes, limpiezas y disciplina operativa de renta corta. Página regional—tu ciudad lleva ejecución local, cumplimiento y FAQs.',
      primaryCta: 'Cotización renta corta',
      secondaryCta: 'WhatsApp',
      whatEyebrow: 'Enfoque',
      whatTitle: 'Ejecución en plataformas — no administración general',
      whatBody: [
        'El éxito en renta corta vive en los detalles: tiempos de respuesta, fotos veraces, tarifas y turnovers impecables. Este servicio está hecho para ese ritmo—distinto de la administración amplia (mantenimiento integral, arrendamiento largo plazo, operación holística del activo).',
        'Si necesitas ambos, coordinamos; esta página se mantiene enfocada en desempeño de reservas y huéspedes.',
      ],
      includesEyebrow: 'Qué cubrimos',
      includesTitle: 'Ejecución de renta corta',
      includesLead: 'El día a día en Airbnb, Booking, VRBO y canales similares.',
      includesItems: [
        { title: 'Optimización de anuncio', desc: 'Títulos, amenidades, fotografía y ajustes continuos.' },
        { title: 'Precios dinámicos', desc: 'Temporada, eventos, competencia y mínimos de estancia.' },
        { title: 'Mensajería', desc: 'Comunicación con estándares de hospitalidad.' },
        { title: 'Turnovers', desc: 'Limpieza, inspección y documentación entre estancias.' },
        { title: 'Canales', desc: 'Calendario y multicanal sin perder estándares.' },
        { title: 'Cumplimiento', desc: 'Coordinación práctica de registro e impuestos de hospedaje cuando aplica.' },
      ],
      processEyebrow: 'Cómo funciona',
      processTitle: 'Ciclo operativo de renta corta',
      processLead: 'Rapidez con puntos de cumplimiento claros.',
      processSteps: [
        { title: 'Estrategia y revisión', desc: 'Competencia, posicionamiento y restricciones (HOA, ruido).' },
        { title: 'Anuncio y precios base', desc: 'Activos, copy, reglas y apertura de tarifas.' },
        { title: 'Salida y operación', desc: 'SLA de mensajes e incidencias en picos.' },
        { title: 'Optimización continua', desc: 'Experimentos, reseñas y diagnóstico de ingresos.' },
        { title: 'Reporte mensual', desc: 'Ocupación, ADR y drivers en lenguaje claro.' },
      ],
      whyEyebrow: 'Para quién es',
      whyTitle: 'Dueños que compiten en anuncio y experiencia de huésped',
      whyLead: 'La renta corta castiga la inconsistencia—construimos sistemas con toque humano.',
      whyItems: [
        { title: 'Hospitalidad', desc: 'Experiencias que se sienten bien operadas.' },
        { title: 'Precios con datos', desc: 'Reglas estructuradas con supervisión humana.' },
        { title: 'Operación defendible', desc: 'Proceso y expediente ante revisiones.' },
      ],
      citiesEyebrow: 'Tu mercado',
      citiesTitle: 'Administración Airbnb por ciudad',
      citiesIntro:
        'Elige tu mercado. El enlace principal abre administración Airbnb en esa ciudad. ¿Colonias y contexto primero? Usa el enlace de mercado.',
      relatedEyebrow: 'Relacionados',
      relatedTitle: 'Servicios cercanos',
      relatedIntro: 'Navega entre hubs si tu estrategia supera solo renta corta.',
      faqEyebrow: 'Preguntas',
      faqTitle: 'Administración Airbnb',
      faqs: [
        {
          question: '¿Diferencia con administración de propiedades?',
          answer:
            '<p>La <a href="/es/administracion-de-propiedades/">administración de propiedades</a> cubre operación amplia del activo. Esta página se centra en desempeño de reservas y huéspedes en renta corta.</p>',
        },
        {
          question: '¿Y gestión de rentas vacacionales?',
          answer:
            '<p>La <a href="/es/gestion-rentas-vacacionales/">gestión de rentas vacacionales</a> enfatiza negocio multicanal y experiencia de huésped a nivel portafolio—a menudo más amplio que solo Airbnb.</p>',
        },
      ],
      finalEyebrow: 'Listo',
      finalTitle: 'Mejora tu anuncio con un equipo que está en el destino',
      finalSub: 'Indica tu dirección—te conectamos con el lead de ciudad correcto.',
      formTitle: 'Solicitar información Airbnb',
      formSubtitle: 'Especialistas renta corta · 24 h',
      relatedHubIds: ['property-management', 'vacation-rental-management', 'sell-property'],
    },
  },

  'vacation-rental-management': {
    en: {
      seo: {
        title: 'Vacation Rental Management — Multi-Channel Performance | PlayaStays',
        description:
          'Holistic vacation rental business management in Quintana Roo: multi-channel distribution, guest experience, revenue performance, and owner reporting. Select your city for localized playbooks.',
      },
      heroTag: 'Vacation rentals · Portfolio performance',
      heroHeadline: 'Vacation Rental Management Across the <em>Riviera Maya</em>',
      heroSub:
        'Multi-channel booking performance, guest experience, and owner reporting—without losing operational standards. This page is regional; city pages carry local playbooks and FAQs.',
      primaryCta: 'Discuss your portfolio',
      secondaryCta: 'See Airbnb management',
      whatEyebrow: 'Positioning',
      whatTitle: 'Business performance—not only listing tactics',
      whatBody: [
        'Vacation rental management sits between narrow Airbnb execution and full asset property management. It is for owners who care about occupancy, ADR, guest satisfaction, and channel mix as a system—not isolated tactics.',
        'If you primarily need listing- and guest-speed execution, Airbnb management may be the tighter fit. If you need capex, long-term leasing, and whole-asset oversight, start with property management.',
      ],
      includesEyebrow: 'What we optimize',
      includesTitle: 'The vacation rental operating stack',
      includesLead: 'How we help owners improve outcomes across channels and touchpoints.',
      includesItems: [
        { title: 'Channel strategy', desc: 'Mix, positioning, and calendar rules that protect rate integrity.' },
        { title: 'Guest experience design', desc: 'Standards, messaging, and recovery playbooks that lift repeat and referral demand.' },
        { title: 'Revenue diagnostics', desc: 'Understanding variance: seasonality, competition, product gaps, and promotions.' },
        { title: 'Operations alignment', desc: 'Housekeeping, maintenance handoffs, and issue resolution without guest friction.' },
        { title: 'Owner reporting', desc: 'Business-level summaries—not only channel dashboards.' },
        { title: 'Growth guardrails', desc: 'Sustainable scaling: quality first, discounts second.' },
      ],
      processEyebrow: 'How it works',
      processTitle: 'How we partner with vacation rental owners',
      processLead: 'Structured discovery so we match service depth to portfolio complexity.',
      processSteps: [
        { title: 'Portfolio review', desc: 'Properties, channels, pain points, and financial goals.' },
        { title: 'Baseline & plan', desc: 'Targets, constraints, and 90-day priorities.' },
        { title: 'Execute & measure', desc: 'Weekly operating rhythm with monthly business reviews.' },
        { title: 'Optimize quarterly', desc: 'Channel mix, positioning, and capex decisions tied to returns.' },
      ],
      whyEyebrow: 'Who it helps',
      whyTitle: 'Owners running a portfolio—not a single listing',
      whyLead: 'Because that is what guests pay for—and what owners need to compete in Quintana Roo.',
      whyItems: [
        { title: 'Integrated ops', desc: 'Revenue, guest, and field teams share context—fewer dropped balls.' },
        { title: 'Market memory', desc: 'We’ve seen cycles; we plan for seasonality honestly.' },
        { title: 'Owner clarity', desc: 'Decisions backed by data you can explain to partners and lenders.' },
      ],
      citiesEyebrow: 'Choose your market',
      citiesTitle: 'Vacation rental management by city',
      citiesIntro:
        'Pick your market. The main link opens vacation rental management in that city. Want the city market first? Use the market link.',
      relatedEyebrow: 'Related services',
      relatedTitle: 'Also explore',
      relatedIntro: 'Move across hubs based on whether you need asset-wide, channel-specific, or exit support.',
      faqEyebrow: 'FAQ',
      faqTitle: 'Vacation rental management',
      faqs: [
        {
          question: 'Is this different from Airbnb management?',
          answer:
            '<p>Yes. <a href="/airbnb-management/">Airbnb management</a> focuses on short-term platform execution. This hub emphasizes multi-channel business performance and guest experience across your vacation rental operation.</p>',
        },
        {
          question: 'When do I need full property management?',
          answer:
            '<p>When long-term leasing, heavy maintenance programs, or holistic asset operations are central—see <a href="/property-management/">property management</a>.</p>',
        },
      ],
      finalEyebrow: 'Next',
      finalTitle: 'Build a stronger vacation rental business—with local operators',
      finalSub: 'Share your portfolio context; we’ll recommend scope and the right city team.',
      formTitle: 'Talk to vacation rental management',
      formSubtitle: 'Portfolio owners · Riviera Maya',
      relatedHubIds: ['property-management', 'airbnb-management', 'sell-property'],
    },
    es: {
      seo: {
        title: 'Gestión de rentas vacacionales — desempeño multicanal | PlayaStays',
        description:
          'Gestión integral del negocio de rentas vacacionales en Quintana Roo: canales, experiencia de huéspedes e ingresos. Elige tu ciudad para estrategia local.',
      },
      heroTag: 'Rentas vacacionales · Negocio',
      heroHeadline: 'Gestión de rentas vacacionales en la <em>Riviera Maya</em>',
      heroSub:
        'Desempeño multicanal, experiencia de huéspedes y reportes al propietario—con estándares claros. Página regional; cada ciudad aporta playbook local y FAQs.',
      primaryCta: 'Hablar de tu portafolio',
      secondaryCta: 'Ver administración Airbnb',
      whatEyebrow: 'Posicionamiento',
      whatTitle: 'Desempeño del negocio — no solo tácticas de anuncio',
      whatBody: [
        'Esta gestión se sitúa entre la ejecución Airbnb puntual y la administración integral del activo. Es para dueños que miran ocupación, ADR, satisfacción y mix de canales como sistema.',
        'Si necesitas velocidad de anuncio y huésped, <a href="/es/administracion-airbnb/">administración Airbnb</a> puede bastar. Si dominan arrendamiento largo plazo y mantenimiento pesado, ve a <a href="/es/administracion-de-propiedades/">administración de propiedades</a>.',
      ],
      includesEyebrow: 'Qué optimizamos',
      includesTitle: 'Stack operativo de renta vacacional',
      includesLead: 'Cómo mejoramos resultados en canales y puntos de contacto.',
      includesItems: [
        { title: 'Estrategia de canales', desc: 'Mix, posicionamiento y reglas de calendario.' },
        { title: 'Experiencia de huésped', desc: 'Estándares y recuperación de servicio.' },
        { title: 'Diagnóstico de ingresos', desc: 'Varianza: temporada, competencia y producto.' },
        { title: 'Alineación operativa', desc: 'Limpieza, mantenimiento e incidencias sin fricción.' },
        { title: 'Reportes al propietario', desc: 'Resúmenes de negocio, no solo dashboards.' },
        { title: 'Crecimiento sano', desc: 'Calidad primero; promociones con criterio.' },
      ],
      processEyebrow: 'Cómo funciona',
      processTitle: 'Cómo trabajamos con propietarios',
      processLead: 'Descubrimiento estructurado según complejidad del portafolio.',
      processSteps: [
        { title: 'Revisión de portafolio', desc: 'Propiedades, canales y metas.' },
        { title: 'Línea base y plan', desc: 'Restricciones y prioridades a 90 días.' },
        { title: 'Ejecutar y medir', desc: 'Ritmo semanal con revisión mensual.' },
        { title: 'Optimizar trimestral', desc: 'Mix, posicionamiento y capex ligado a retorno.' },
      ],
      whyEyebrow: 'Para quién es',
      whyTitle: 'Dueños con portafolio—no un solo anuncio',
      whyLead: 'Por eso pagan los huéspedes—y por eso compites en Quintana Roo.',
      whyItems: [
        { title: 'Operación integrada', desc: 'Ingresos, huéspedes y campo comparten contexto.' },
        { title: 'Memoria de mercado', desc: 'Estacionalidad con honestidad.' },
        { title: 'Claridad al propietario', desc: 'Decisiones con datos explicables.' },
      ],
      citiesEyebrow: 'Tu mercado',
      citiesTitle: 'Gestión de rentas vacacionales por ciudad',
      citiesIntro:
        'Elige tu mercado. El enlace principal abre gestión de rentas vacacionales en esa ciudad. ¿Mercado primero? Usa el enlace de contexto local.',
      relatedEyebrow: 'Relacionados',
      relatedTitle: 'Explora también',
      relatedIntro: 'Navega según activo, canal o salida.',
      faqEyebrow: 'Preguntas',
      faqTitle: 'Gestión de rentas vacacionales',
      faqs: [
        {
          question: '¿Diferencia con administración Airbnb?',
          answer:
            '<p>Sí. La <a href="/es/administracion-airbnb/">administración Airbnb</a> se centra en ejecución de plataforma. Aquí enfatizamos desempeño multicanal y experiencia en el negocio de renta vacacional.</p>',
        },
        {
          question: '¿Cuándo administración integral?',
          answer:
            '<p>Cuando arrendamiento largo plazo o mantenimiento holístico dominen—ve <a href="/es/administracion-de-propiedades/">administración de propiedades</a>.</p>',
        },
      ],
      finalEyebrow: 'Siguiente',
      finalTitle: 'Fortalece tu negocio de renta vacacional con operadores locales',
      finalSub: 'Cuéntanos tu contexto; recomendamos alcance y equipo por ciudad.',
      formTitle: 'Hablar de gestión de rentas vacacionales',
      formSubtitle: 'Portafolios · Riviera Maya',
      relatedHubIds: ['property-management', 'airbnb-management', 'sell-property'],
    },
  },

  'sell-property': {
    en: {
      seo: {
        title: 'Sell Your Property in the Riviera Maya | PlayaStays Owner Services',
        description:
          'Owner-focused support to prepare and position your Quintana Roo property for sale—buyer-ready presentation and local market context. Choose your city for street-level guidance.',
      },
      heroTag: 'Exit · Owner advocacy',
      heroHeadline: 'Seller Support Across the <em>Riviera Maya</em>',
      heroSub:
        'We help owners exit well: pricing context, presentation, and coordination so your property shows at its best—without losing sight of timing and disclosure realities. This hub is regional; city pages carry micro-market detail.',
      primaryCta: 'Request a seller conversation',
      secondaryCta: 'List your property for rent',
      whatEyebrow: 'What this is (and isn’t)',
      whatTitle: 'Seller support within a property company—not a substitute for legal counsel',
      whatBody: [
        'PlayaStays brings operational credibility and local demand insight that many traditional listings miss: how guests experience a home, what buyers compare online, and how to reduce friction during diligence.',
        'We are not a law firm; for contracts and notarial process you should rely on qualified counsel. We complement that with marketing readiness and practical coordination.',
      ],
      includesEyebrow: 'How we help',
      includesTitle: 'Seller services (regional scope)',
      includesLead: 'Delivered with nuance per market—select your city for the full playbook.',
      includesItems: [
        { title: 'Positioning & narrative', desc: 'Clear story: lifestyle, income potential (where appropriate), and differentiation.' },
        { title: 'Presentation readiness', desc: 'Photography direction, staging guidance, and punch-list triage.' },
        { title: 'Buyer journey', desc: 'Smooth access, information packets, and responsiveness that protects momentum.' },
        { title: 'Local context', desc: 'Neighborhood comps and buyer objections we see in the field.' },
        { title: 'Coordination', desc: 'Handoffs with brokers and counsel when you bring partners in.' },
        { title: 'Post-sale continuity', desc: 'If rental income matters pre-close, we align timelines responsibly.' },
      ],
      processEyebrow: 'How it works',
      processTitle: 'From first call to a market-ready listing',
      processLead: 'Lightweight when you are early; deeper when you are close to market.',
      processSteps: [
        { title: 'Goals & timeline', desc: 'Price expectations, constraints, and target window.' },
        { title: 'Property review', desc: 'Condition, documentation gaps, and presentation priorities.' },
        { title: 'Go-to-market plan', desc: 'Channels, materials, and responsibilities—aligned to your advisors.' },
        { title: 'Iterate with feedback', desc: 'Adjust positioning as the market responds.' },
      ],
      whyEyebrow: 'Who it helps',
      whyTitle: 'Owners preparing a disciplined exit',
      whyLead: 'Buyers compare ruthlessly online—we help you win the first impression and the second look.',
      whyItems: [
        { title: 'Hospitality eye', desc: 'We know what makes homes feel “turnkey” to travelers and buyers alike.' },
        { title: 'Market breadth', desc: 'Perspective across Quintana Roo—not a single-street lens.' },
        { title: 'Ethical representation', desc: 'No inflated promises; clear tradeoffs.' },
      ],
      citiesEyebrow: 'Choose your market',
      citiesTitle: 'Sell property — city-specific guidance',
      citiesIntro:
        'Pick your market. The main link opens seller support in that city. For comps and neighborhood context first, use the market link.',
      relatedEyebrow: 'Related services',
      relatedTitle: 'Before or after the sale',
      relatedIntro: 'Many sellers still care about rental performance during the process—connect the right service hub.',
      faqEyebrow: 'FAQ',
      faqTitle: 'Selling in Quintana Roo',
      faqs: [
        {
          question: 'Do you replace a real estate agent?',
          answer:
            '<p>No. We add readiness and operational insight. Many sellers pair us with a licensed broker; we coordinate where helpful.</p>',
        },
        {
          question: 'I’m still renting—what should I read first?',
          answer:
            '<p>Review <a href="/property-management/">property management</a> or <a href="/vacation-rental-management/">vacation rental management</a> depending on your income strategy while listed.</p>',
        },
      ],
      finalEyebrow: 'Talk to us',
      finalTitle: 'Plan a cleaner exit—with local execution behind you',
      finalSub: 'Share the city and property basics; we’ll route the right specialist.',
      formTitle: 'Seller inquiry — Riviera Maya',
      formSubtitle: 'Confidential · Local team',
      relatedHubIds: ['property-management', 'airbnb-management', 'vacation-rental-management'],
    },
    es: {
      seo: {
        title: 'Vender tu propiedad en Riviera Maya | PlayaStays',
        description:
          'Apoyo a propietarios para preparar y posicionar tu inmueble en Quintana Roo: presentación lista para compradores y contexto de mercado. Elige tu ciudad.',
      },
      heroTag: 'Salida · Enfoque al propietario',
      heroHeadline: 'Apoyo al vendedor en la <em>Riviera Maya</em>',
      heroSub:
        'Contexto de precios, presentación y coordinación para que tu propiedad luzca bien—con honestidad sobre tiempos y disclosure. Hub regional; la ciudad aporta micro-mercado.',
      primaryCta: 'Conversación vendedor',
      secondaryCta: 'Publicar propiedad en renta',
      whatEyebrow: 'Qué es esto',
      whatTitle: 'Apoyo al vendedor—no sustituto legal',
      whatBody: [
        'PlayaStays aporta credibilidad operativa e insight de demanda: cómo se vive la casa, qué comparan los compradores en línea y cómo reducir fricción en diligencia.',
        'No somos despacho jurídico; contratos y notaría requieren asesoría calificada. Nosotros complementamos con marketing práctico y coordinación.',
      ],
      includesEyebrow: 'Cómo ayudamos',
      includesTitle: 'Servicios al vendedor (alcance regional)',
      includesLead: 'Con matices por mercado—elige ciudad para el playbook completo.',
      includesItems: [
        { title: 'Posicionamiento', desc: 'Historia clara: estilo de vida y diferenciación.' },
        { title: 'Preparación', desc: 'Fotografía, staging y lista de detalles.' },
        { title: 'Recorrido del comprador', desc: 'Acceso e información que mantienen momentum.' },
        { title: 'Contexto local', desc: 'Comparables y objeciones frecuentes.' },
        { title: 'Coordinación', desc: 'Con brokers y abogados cuando los traes.' },
        { title: 'Continuidad', desc: 'Si el ingreso por renta importa antes del cierre, alineamos tiempos.' },
      ],
      processEyebrow: 'Cómo funciona',
      processTitle: 'De la primera llamada al listado listo',
      processLead: 'Ligero al inicio; más profundo cerca del mercado.',
      processSteps: [
        { title: 'Metas y plazo', desc: 'Expectativas de precio y ventana objetivo.' },
        { title: 'Revisión del inmueble', desc: 'Condición y prioridades de presentación.' },
        { title: 'Plan de salida', desc: 'Canales, materiales y responsabilidades.' },
        { title: 'Iterar con feedback', desc: 'Ajustar según respuesta del mercado.' },
      ],
      whyEyebrow: 'Para quién es',
      whyTitle: 'Propietarios preparando una salida ordenada',
      whyLead: 'Los compradores comparan en línea—ayudamos a ganar la primera impresión.',
      whyItems: [
        { title: 'Ojo de hospitalidad', desc: 'Qué se siente “llave en mano”.' },
        { title: 'Amplitud de mercado', desc: 'Perspectiva en Quintana Roo.' },
        { title: 'Representación ética', desc: 'Sin promesas infladas.' },
      ],
      citiesEyebrow: 'Tu mercado',
      citiesTitle: 'Vender propiedad — guía por ciudad',
      citiesIntro:
        'Elige tu mercado. El enlace principal abre apoyo al vendedor en esa ciudad. ¿Comparables y colonias primero? Usa el enlace de mercado.',
      relatedEyebrow: 'Relacionados',
      relatedTitle: 'Antes o después de la venta',
      relatedIntro: 'Muchos vendedores siguen pensando en renta durante el proceso.',
      faqEyebrow: 'Preguntas',
      faqTitle: 'Vender en Quintana Roo',
      faqs: [
        {
          question: '¿Reemplazan al agente inmobiliario?',
          answer:
            '<p>No. Sumamos preparación e insight operativo. Muchos vendedores nos combinan con un broker licenciado.</p>',
        },
        {
          question: '¿Sigo rentando?',
          answer:
            '<p>Revisa <a href="/es/administracion-de-propiedades/">administración de propiedades</a> o <a href="/es/gestion-rentas-vacacionales/">gestión de rentas vacacionales</a> según tu estrategia de ingreso.</p>',
        },
      ],
      finalEyebrow: 'Hablemos',
      finalTitle: 'Planifica una salida más ordenada — con ejecución local',
      finalSub: 'Indica ciudad y datos básicos; derivamos al especialista adecuado.',
      formTitle: 'Consulta vendedor — Riviera Maya',
      formSubtitle: 'Confidencial · Equipo local',
      relatedHubIds: ['property-management', 'airbnb-management', 'vacation-rental-management'],
    },
  },
}

export function getServiceHubCopy(hubId: ServiceHubId, locale: 'en' | 'es') {
  return SERVICE_HUB_REGISTRY[hubId][locale]
}

export function getServiceHubHeroImage(hubId: ServiceHubId): string {
  const map: Record<ServiceHubId, string> = {
    'property-management': IMG_PM,
    'airbnb-management': IMG_AB,
    'vacation-rental-management': IMG_VR,
    'sell-property': IMG_SELL,
  }
  return map[hubId]
}

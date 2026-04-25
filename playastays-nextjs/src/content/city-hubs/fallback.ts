// ============================================================
// Universal city hub fallback — same section model as PDC.
// Replace per city later via registry partial overrides (merge).
// ============================================================

import type { City, Neighborhood } from '@/types'
import type { Locale } from '@/lib/i18n'
import { HERO_JPG } from '@/lib/public-assets'
import type { CityHubImageAsset, CityHubLocaleContent, CityHubServiceHighlight } from './types'

/** EN/ES arrays are index-paired (same structure, same count) for locale parity. */

/** Local hero art — /public/hero.jpg (add/replace file on disk; no hotlinked stock URLs). */
const HERO_IMAGES = [HERO_JPG, HERO_JPG, HERO_JPG]

export function heroImageForCitySlug(slug: string): string {
  let h = 0
  for (let i = 0; i < slug.length; i++) h += slug.charCodeAt(i)
  return HERO_IMAGES[Math.abs(h) % HERO_IMAGES.length]
}

/** Shared strip imagery — locale-specific alt; distinct from hero rotation for visual variety */
function neighborhoodGalleryFallback(locale: Locale): CityHubImageAsset[] {
  const es = locale === 'es'
  return [
    { src: HERO_JPG, alt: es ? 'Costa y palmeras en la Riviera Maya' : 'Palm-lined coast along the Riviera Maya' },
    { src: HERO_JPG, alt: es ? 'Piscina y amenidades en desarrollo residencial costero' : 'Pool and amenities at a coastal residential development' },
    { src: HERO_JPG, alt: es ? 'Interior luminoso de renta vacacional' : 'Bright vacation rental interior' },
    { src: HERO_JPG, alt: es ? 'Playa y horizonte al atardecer' : 'Beach and horizon at sunset' },
  ]
}

function insightsGalleryFallback(locale: Locale): CityHubImageAsset[] {
  const es = locale === 'es'
  return [
    { src: HERO_JPG, alt: es ? 'Detalle de propiedad costera bien mantenida' : 'Well-kept coastal property detail' },
    { src: HERO_JPG, alt: es ? 'Ambiente tranquilo de vecindario residencial' : 'Quiet residential neighborhood setting' },
  ]
}

const GENERIC_NEIGHBORHOODS_EN = [
  {
    name: 'Central corridor & downtown',
    desc:
      'Walkable cores and main corridors typically see the highest short-stay velocity. Studios and one- to two-bedroom condos often perform well when listings emphasize convenience, clear house rules, and fast guest communication.',
  },
  {
    name: 'Beach & coastal zone',
    desc:
      'Proximity to the beach remains a primary demand driver. Premium positioning, strong photography, and realistic guest expectations around access and seasonal conditions help protect reviews.',
  },
  {
    name: 'Residential neighborhoods',
    desc:
      'Quieter residential pockets can attract longer stays and repeat guests when the product matches the promise—parking, space, and neighborhood norms matter as much as nightly rate.',
  },
  {
    name: 'Gated communities & resort-style developments',
    desc:
      'Security, amenities, and HOA coordination are central. These properties often require disciplined operations and vendor standards to match elevated guest expectations.',
  },
  {
    name: 'Emerging corridors',
    desc:
      'Newer inventory can offer yield opportunities for owners who invest in fit-out, maintenance, and pricing aligned to the right traveler segment.',
  },
  {
    name: 'Value-oriented pockets',
    desc:
      'Stronger value segments can work well when owners understand the asset, set expectations clearly in the listing, and operate with consistency.',
  },
]

const GENERIC_NEIGHBORHOODS_ES = [
  {
    name: 'Corredor céntrico y downtown',
    desc:
      'Los núcleos caminables suelen concentrar mayor rotación de estancias cortas. Estudios y departamentos de 1–2 recámaras rinden mejor con reglas claras, comunicación rápida y anuncios bien calibrados.',
  },
  {
    name: 'Zona de playa y costa',
    desc:
      'La proximidad a la playa sigue siendo motor de demanda. Posicionamiento, fotografía y expectativas realistas sobre acceso y temporada protegen reseñas.',
  },
  {
    name: 'Colonias residenciales',
    desc:
      'Zonas más tranquilas pueden atraer estancias largas cuando el producto coincide con la promesa: estacionamiento, espacio y normas del entorno.',
  },
  {
    name: 'Comunidades cerradas y desarrollos tipo resort',
    desc:
      'Seguridad, amenidades y coordinación con HOA son centrales. Suelen exigir operación disciplinada y proveedores de nivel.',
  },
  {
    name: 'Corredores en desarrollo',
    desc:
      'Nuevo inventario puede ofrecer rendimiento para quien invierte en acabados, mantenimiento y precio alineado al segmento correcto.',
  },
  {
    name: 'Segmentos de valor',
    desc:
      'Pueden funcionar muy bien con expectativas claras en el anuncio y operación consistente.',
  },
]

/**
 * Coerce WP JSON / partial REST payloads into Neighborhood. Drops unusable rows.
 * CMS may send: null slots, bare strings, or objects with title/label instead of name.
 */
function neighborhoodFromUnknown(input: unknown): Neighborhood | null {
  if (input == null) return null
  if (typeof input === 'string') {
    const name = input.trim()
    return name ? { name, desc: '' } : null
  }
  if (typeof input !== 'object' || Array.isArray(input)) return null
  const o = input as Record<string, unknown>
  const nameRaw = o.name ?? o.title ?? o.label
  const name =
    typeof nameRaw === 'string'
      ? nameRaw.trim()
      : nameRaw != null
        ? String(nameRaw).trim()
        : ''
  if (!name) return null
  const descRaw = o.desc ?? o.description ?? o.body
  const desc =
    typeof descRaw === 'string'
      ? descRaw.trim()
      : descRaw != null
        ? String(descRaw).trim()
        : ''
  const slugRaw = o.slug
  const slug = typeof slugRaw === 'string' && slugRaw.trim() ? slugRaw.trim() : undefined
  const row: Neighborhood = { name, desc }
  if (slug) row.slug = slug
  return row
}

function dedupeNeighborhoods(list: unknown[]): Neighborhood[] {
  const seen = new Set<string>()
  const out: Neighborhood[] = []
  for (const item of list) {
    const x = neighborhoodFromUnknown(item)
    if (!x) continue
    const k = x.name.toLowerCase().trim()
    if (!k || seen.has(k)) continue
    seen.add(k)
    out.push({
      name: x.name.trim(),
      desc: (x.desc || '').trim(),
      ...(x.slug?.trim() ? { slug: x.slug.trim() } : {}),
    })
  }
  return out
}

/** When CMS sends a short blurb, pad with a credible local line (EN/ES paired intent). */
function enrichNeighborhoodDesc(desc: string, locale: Locale, cityName: string): string {
  const d = desc.trim()
  if (d.length >= 72) return d
  if (!d) {
    return locale === 'es'
      ? `Zona de referencia en ${cityName}: demanda, reglas de condominio y perfil de huésped definen la estrategia.`
      : `Reference area in ${cityName}: demand, HOA rules, and guest profile shape the strategy.`
  }
  return locale === 'es'
    ? `${d} En ${cityName} alineamos operación con demanda, reglas y expectativas de huéspedes.`
    : `${d} In ${cityName}, we align operations with demand, rules, and guest expectations.`
}

function neighborhoodsForCity(city: City, locale: Locale): Neighborhood[] {
  const cityName = city.title.rendered
  const raw = city.ps_computed?.neighborhoods
  const rawList = Array.isArray(raw) ? raw : []
  const T = locale === 'es' ? GENERIC_NEIGHBORHOODS_ES : GENERIC_NEIGHBORHOODS_EN
  const generic = T.map(n => ({ name: n.name, desc: n.desc }))

  const existing = dedupeNeighborhoods(rawList).map(n => ({
    name: n.name,
    desc: enrichNeighborhoodDesc(n.desc, locale, cityName),
    ...(n.slug ? { slug: n.slug } : {}),
  }))

  if (existing.length >= 4) {
    return existing.slice(0, 8)
  }
  if (existing.length === 0) {
    return generic.slice(0, 6)
  }
  return dedupeNeighborhoods([...existing, ...generic]).slice(0, 8)
}

function marketHtmlEn(name: string) {
  return `
<p>${name} sits within Quintana Roo’s international tourism economy—where short-term rental demand, remote-work travel, and repeat visitors intersect. Owners benefit when their asset is positioned for the right guest segment, supported by disciplined operations, and maintained for a coastal climate.</p>
<p>For investors, the opportunity is rarely “set and forget.” Success depends on listing quality, response times, spotless turnovers, preventative maintenance, and a clear understanding of building-specific rules. In many developments, HOA policies shape what’s possible as much as broad municipal expectations—especially in gated communities and condo towers.</p>
<p>Seasonality still matters, even in markets with strong year-round appeal. Holidays, summer travel, and local events can shift minimum stays, nightly rates, and the competitive set you’re priced against. The owners who treat pricing, calendar hygiene, and guest experience as one system tend to protect both revenue and review scores.</p>
<p>Remote ownership adds another layer: you need visibility, predictable vendor coordination, and responsive local execution when guests, neighbors, or maintenance issues need attention. Use the service links below when you are ready to compare scope and pricing for a specific offering in ${name}—those pages are built for exact service + city intent.</p>
`.trim()
}

function marketHtmlEs(name: string) {
  return `
<p>${name} forma parte de la economía turística internacional de Quintana Roo, donde conviven demanda de renta corta, viajeros de trabajo remoto y visitantes recurrentes. Los propietarios ganan cuando el activo está bien posicionado para el segmento correcto, con operación disciplinada y mantenimiento adecuado para clima costero.</p>
<p>Rara vez basta con “activar y olvidar”. El resultado depende de calidad del anuncio, tiempos de respuesta, limpiezas impecables, mantenimiento preventivo y comprensión de reglas por edificio. En muchos desarrollos, las políticas del condominio definen tanto o más que la normativa general—especialmente en comunidades cerradas y torres.</p>
<p>La estacionalidad sigue importando aunque haya demanda durante gran parte del año. Fiestas, verano y eventos locales pueden mover mínimos de estancia, tarifas y el conjunto competitivo contra el que compites. Quienes integran precios, calendario y experiencia de huésped suelen proteger ingresos y reseñas.</p>
<p>La propiedad a distancia añade otra capa: necesitas visibilidad, proveedores confiables y ejecución local ágil. Cuando quieras comparar alcance y honorarios por servicio en ${name}, usa los enlaces de servicios más abajo: esas páginas están pensadas para intención exacta de ciudad + servicio.</p>
`.trim()
}

function servicesEn(name: string): CityHubServiceHighlight[] {
  return [
    {
      psServiceSlug: 'property-management',
      title: 'Full property management',
      desc: `Ownership, reporting, and vendors—scoped for ${name} on the next page.`,
      ctaLabel: 'View property management',
    },
    {
      psServiceSlug: 'airbnb-management',
      title: 'Airbnb & short-term rental management',
      desc: `Listings, guests, and turnovers—run locally in ${name}.`,
      ctaLabel: 'View Airbnb management',
    },
    {
      psServiceSlug: 'vacation-rentals',
      title: 'Vacation rental management',
      desc: `Multi-channel guest operations for ${name}.`,
      ctaLabel: 'View vacation rental management',
    },
    {
      psServiceSlug: 'sell-your-property',
      title: 'Sell your property',
      desc: `Exit positioning and seller support in ${name}.`,
      ctaLabel: 'View selling support',
    },
  ]
}

function servicesEs(name: string): CityHubServiceHighlight[] {
  return [
    {
      psServiceSlug: 'property-management',
      title: 'Administración integral de propiedades',
      desc: `Operación, reportes y proveedores—detalle local en la página siguiente para ${name}.`,
      ctaLabel: 'Ver administración integral',
    },
    {
      psServiceSlug: 'airbnb-management',
      title: 'Administración Airbnb y renta corta',
      desc: `Anuncios, huéspedes y limpiezas—ejecución local en ${name}.`,
      ctaLabel: 'Ver administración Airbnb',
    },
    {
      psServiceSlug: 'vacation-rentals',
      title: 'Gestión de rentas vacacionales',
      desc: `Operación multicanal de huéspedes en ${name}.`,
      ctaLabel: 'Ver gestión de rentas',
    },
    {
      psServiceSlug: 'sell-your-property',
      title: 'Vender tu propiedad',
      desc: `Salida al mercado y apoyo al vendedor en ${name}.`,
      ctaLabel: 'Ver apoyo para venta',
    },
  ]
}

function whyEn(name: string) {
  return [
    {
      title: 'Local expertise',
      desc: `We understand ${name}’s neighborhoods, building dynamics, seasonality, and guest expectations better than distant managers or generic national firms.`,
    },
    {
      title: 'Reliable owner communication',
      desc: 'Clear reporting and on-the-ground accountability—visibility without noise.',
    },
    {
      title: 'Strong guest experience',
      desc: 'Fast responses, smooth check-ins, clean turnovers, and solid issue resolution to protect reviews and occupancy.',
    },
    {
      title: 'Vendor & maintenance coordination',
      desc: 'Trusted cleaners, maintenance, and service providers—coordinated for coastal realities.',
    },
  ]
}

function whyEs(name: string) {
  return [
    {
      title: 'Experiencia local',
      desc: `Conocemos colonias, dinámica de edificios y estacionalidad en ${name} mejor que gestores remotos o firmas genéricas.`,
    },
    {
      title: 'Comunicación con el propietario',
      desc: 'Reportes claros y responsabilidad en terreno: visibilidad sin ruido.',
    },
    {
      title: 'Experiencia de huésped',
      desc: 'Respuesta rápida, check-ins ordenados, limpiezas impecables y resolución de incidencias.',
    },
    {
      title: 'Proveedores y mantenimiento',
      desc: 'Coordinación con proveedores de confianza para un entorno costero.',
    },
  ]
}

function insightsEn(name: string) {
  return [
    {
      title: 'Peak season preparation',
      desc: `In competitive markets like ${name}, dynamic pricing during high season works best when paired with staffing plans and minimum stays that protect review quality.`,
    },
    {
      title: 'Humidity & coastal maintenance',
      desc: 'Preventative care for AC, finishes, and moisture-prone areas protects asset value—small issues escalate quickly in salt air.',
    },
    {
      title: 'HOA & building rules',
      desc: 'Building-level policies can be as important as city-level expectations—especially in condos and gated communities.',
    },
    {
      title: 'Seasonality & events',
      desc: 'Local calendars shift demand; disciplined calendar management beats static annual rates.',
    },
    {
      title: 'Listing quality & response speed',
      desc: 'Photography, accuracy, and fast communication are ranking inputs—not nice-to-haves.',
    },
    {
      title: 'Responsible rental operations',
      desc: 'We help owners run rentals responsibly—clear processes and professional execution day to day.',
    },
  ]
}

function insightsEs(name: string) {
  return [
    {
      title: 'Preparación de temporada alta',
      desc: `En mercados competitivos como ${name}, el precio dinámico funciona mejor con mínimos de estancia y staffing que protejan reseñas.`,
    },
    {
      title: 'Humedad y mantenimiento costero',
      desc: 'Cuidado preventivo de A/C, acabados y zonas húmedas protege el activo.',
    },
    {
      title: 'HOA y reglas de condominio',
      desc: 'Las políticas del edificio pueden ser tan importantes como la normativa municipal.',
    },
    {
      title: 'Estacionalidad y eventos',
      desc: 'El calendario local mueve demanda; la disciplina en calendario supera tarifas fijas anuales.',
    },
    {
      title: 'Calidad de anuncio y respuesta',
      desc: 'Fotografía, precisión y velocidad de respuesta afectan ranking y conversión.',
    },
    {
      title: 'Operación responsable',
      desc: 'Procesos claros y ejecución profesional en el día a día.',
    },
  ]
}

function faqsEn(name: string) {
  return [
    {
      question: `I'm researching ${name}—where should I start on this site?`,
      answer:
        '<p>Use this hub for neighborhoods and market context. When you want service-specific scope, pricing signals, and FAQs, open the city + service page that matches your decision (property management, Airbnb management, vacation rentals, or selling).</p>',
    },
    {
      question: `Where are fees and service scope explained for ${name}?`,
      answer:
        '<p>Each city-specific service page is the right place for commercial detail. We also publish city pricing guidance for management when you want ranges before a consultation.</p>',
    },
    {
      question: 'Do you work in gated communities?',
      answer:
        '<p>Yes. We regularly coordinate with HOAs, access rules, and property-specific operating requirements.</p>',
    },
    {
      question: 'Can you manage my property if I live abroad?',
      answer:
        '<p>Absolutely. Many owners are outside Mexico for most of the year. Our role is to reduce operational burden and provide local visibility without requiring you to be on-site.</p>',
    },
    {
      question: 'Do you help with compliance and lodging-tax related processes?',
      answer:
        '<p>We help owners understand the operational side of staying compliant and running a rental responsibly in Quintana Roo.</p>',
    },
    {
      question: 'How do you improve occupancy and revenue?',
      answer:
        '<p>Through stronger listing presentation, faster response times, better guest experience, disciplined pricing, and consistent operations—so reviews, ranking, and revenue move together.</p>',
    },
  ]
}

function faqsEs(name: string) {
  return [
    {
      question: `Estoy evaluando ${name}—¿por dónde empiezo en el sitio?`,
      answer:
        '<p>Usa este hub para zonas y contexto de mercado. Cuando necesites alcance, rangos y FAQs por servicio, abre la página ciudad + servicio que corresponda (administración, Airbnb, rentas vacacionales o venta).</p>',
    },
    {
      question: `¿Dónde están honorarios y alcance para ${name}?`,
      answer:
        '<p>La página específica de cada servicio en tu ciudad es el lugar adecuado para detalle comercial. También publicamos orientación de precios de administración por ciudad si quieres rangos antes de agendar.</p>',
    },
    {
      question: '¿Trabajan en comunidades cerradas?',
      answer:
        '<p>Sí. Coordinamos con HOAs, accesos y requisitos específicos del desarrollo.</p>',
    },
    {
      question: '¿Pueden administrar si vivo en el extranjero?',
      answer:
        '<p>Por supuesto. Muchos propietarios están fuera de México la mayor parte del año; reducimos carga operativa y damos visibilidad local.</p>',
    },
    {
      question: '¿Ayudan con cumplimiento e impuestos de hospedaje?',
      answer:
        '<p>Ayudamos a entender el lado operativo de rentar de forma responsable en Quintana Roo.</p>',
    },
    {
      question: '¿Cómo mejoran ocupación e ingresos?',
      answer:
        '<p>Con mejor anuncio, tiempos de respuesta, experiencia de huésped, precios disciplinados y operación consistente.</p>',
    },
  ]
}

export function buildFallbackCityHubContent(city: City, locale: Locale): CityHubLocaleContent {
  const name = city.title.rendered
  const es = locale === 'es'

  return {
    heroHeadline: es
      ? `PlayaStays en ${name}: <em>contexto local y servicios para propietarios</em>`
      : `PlayaStays in ${name}: <em>Local Context and Owner Services</em>`,
    heroSub: es
      ? `Entiende ${name} como mercado, revisa áreas clave y elige la ruta de servicio adecuada. Las páginas ciudad + servicio llevan alcance, honorarios y FAQs.`
      : `Understand ${name} as a market, review key areas, and choose the right service path. City + service pages carry scope, pricing, and FAQs.`,
    heroTag: es ? `Guía del mercado · ${name}` : `Market guide · ${name}`,
    heroImageUrl: heroImageForCitySlug(city.slug),
    primaryCta: es ? `Ver servicios en ${name} →` : `Explore services in ${name} →`,
    secondaryCta: es ? `Explorar colonias y rutas de servicio →` : `Browse neighborhoods and service paths →`,
    tertiaryCta: 'WhatsApp',
    marketEyebrow: es ? 'Por qué importa este mercado' : 'Why this city matters',
    marketTitle: es
      ? `Contexto de mercado para propietarios en ${name}`
      : `Market context for owners in ${name}`,
    marketBodyHtml: es ? marketHtmlEs(name) : marketHtmlEn(name),
    neighborhoodsEyebrow: es ? 'Zonas' : 'Areas we cover',
    neighborhoodsTitle: es ? `Colonias y zonas donde operamos en ${name}` : `Neighborhoods we serve in ${name}`,
    neighborhoodsIntro: es
      ? 'Las tarjetas combinan patrones típicos de la Riviera Maya con lo que vemos en tu mercado. Si tu colonia tiene otro nombre en nuestro inventario, adaptamos la estrategia a tu dirección y tipo de unidad.'
      : 'These cards blend typical Riviera Maya patterns with what we see in your market. If your area is labeled differently in our portfolio, we still tailor strategy to your exact address and unit type.',
    neighborhoods: neighborhoodsForCity(city, locale),
    servicesEyebrow: es ? 'Servicios' : 'Services',
    servicesTitle: es ? `Servicios disponibles en ${name}` : `Services available in ${name}`,
    servicesIntro: es
      ? 'Resúmenes breves: cada página de servicio profundiza alcance y proceso.'
      : 'Concise overviews—each service page goes deeper on scope and how we execute locally.',
    services: es ? servicesEs(name) : servicesEn(name),
    whyEyebrow: es ? 'Por qué PlayaStays' : 'Why PlayaStays',
    whyTitle: es ? `Por qué los propietarios eligen PlayaStays en ${name}` : `Why owners choose PlayaStays in ${name}`,
    whyItems: es ? whyEs(name) : whyEn(name),
    insightsEyebrow: es ? 'Contexto local' : 'Local insights',
    insightsTitle: es
      ? `Ideas para propietarios en ${name}`
      : `Local insights for ${name} property owners`,
    insightsGalleryImages: insightsGalleryFallback(locale),
    insightItems: es ? insightsEs(name) : insightsEn(name),
    faqEyebrow: es ? 'Preguntas frecuentes' : 'FAQ',
    faqTitle: es
      ? `Preguntas frecuentes sobre ${name} (navegación y contexto)`
      : `Common questions about ${name} (navigation & context)`,
    faqs: es ? faqsEs(name) : faqsEn(name),
    finalEyebrow: es ? 'Siguiente paso' : 'Next step',
    finalTitle: es
      ? `¿Siguiente paso en ${name}?`
      : `What’s next in ${name}?`,
    finalSub: es
      ? 'Explora servicios arriba o solicita un estimado sin compromiso. Respuesta en 24 h.'
      : 'Explore the service paths above, or request a free revenue estimate—24-hour response.',
    leadFormTitle: es ? `¿Propiedad en ${name}?` : `Own property in ${name}?`,
    leadFormSubtitle: es
      ? 'Cotización gratuita de administración. Respuesta en 24 horas, sin compromiso.'
      : 'Free property management quote. 24-hour response, no commitment.',
    footerLeadTitle: es ? 'Solicitar cotización gratuita' : 'Request your free quote',
    footerLeadSubtitle: es
      ? 'Cuéntanos sobre tu propiedad—te contactamos en 24 horas.'
      : 'Tell us about your property—we’ll follow up within 24 hours.',
    blogHint: es
      ? 'Próximamente: guías para propietarios y datos del mercado en el blog.'
      : 'More owner guides & market notes on the blog soon.',
    ctaStripEyebrow: es ? `Propietarios en ${name}` : `${name} owners`,
    ctaStripHeadline: es
      ? 'Obtén un estimado de ingresos por renta—sin compromiso.'
      : 'Get a free rental income estimate—no commitment required.',
    crossCityIntro: es
      ? 'Explora otros mercados donde operamos en Quintana Roo: mismo equipo, operación local en cada destino.'
      : 'Explore more Quintana Roo markets where we operate—same team, local execution in each destination.',
  }
}

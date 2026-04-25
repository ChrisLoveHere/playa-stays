// ============================================================
// Service page — generic copy when WordPress fields are empty.
// PDC bespoke pages short-circuit before ServicePageTemplate; they are unaffected.
// ============================================================

import type { City, Service } from '@/types'
import { PUBLIC_FAQ_LIMIT_CITY, type FaqAccordionItem } from '@/lib/faq-helpers'
import { serviceLabel } from '@/lib/i18n'
import { publicEnSlugFromPs } from '@/lib/service-url-slugs'

const OWNER_PSY_SERVICE_SLUGS = new Set([
  'property-management',
  'airbnb-management',
  'investment-property',
  'sell-property',
])

const GUEST_PSY_RENTAL_SLUGS = new Set([
  'vacation-rentals',
  'condos-for-rent',
  'beachfront-rentals',
])

function strip(s: string): string {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function normQ(s: string): string {
  return s.toLowerCase().replace(/\?+$/, '').replace(/\s+/g, ' ').trim()
}

/**
 * When hero subhead and excerpt are empty, one line under the H1.
 */
export function genericHeroSubhead(
  cityName: string,
  _serviceTitlePlain: string,
  psSlug: string,
  isEs: boolean
): string {
  if (isEs) {
    if (psSlug === 'property-management' || psSlug === 'airbnb-management') {
      return `Equipo local en ${cityName}: anuncio, reservas, limpieza y transparencia para propietarios.`
    }
    if (GUEST_PSY_RENTAL_SLUGS.has(psSlug)) {
      return `Encuentra ${serviceLabel(publicEnSlugFromPs(psSlug), 'es').toLowerCase()} en ${cityName} con criterio claro.`
    }
    return `Cómo PlayaStays apoya tu caso en ${cityName} con ejecución de campo.`
  }
  if (psSlug === 'property-management' || psSlug === 'airbnb-management') {
    return `On-the-ground ${cityName} team for listings, guest stays, and owner reporting you can trust.`
  }
  if (GUEST_PSY_RENTAL_SLUGS.has(psSlug)) {
    return `Browse ${serviceLabel(publicEnSlugFromPs(psSlug), 'en').toLowerCase()} in ${cityName} with a focused local team.`
  }
  return `How PlayaStays supports your goals in ${cityName} with local execution.`
}

/**
 * Longer default meta description for generic service pages (EN).
 */
export function defaultServicePageDescription(
  svcTitle: string,
  cityTitle: string,
  psSlug: string
): string {
  if (psSlug === 'property-management') {
    return `${svcTitle} in ${cityTitle}: on-site operators, transparent fees, guest coverage, and monthly owner reporting. Get a free revenue assessment.`
  }
  if (psSlug === 'airbnb-management') {
    return `${svcTitle} in ${cityTitle}: channel-ready listings, 24/7 guest messaging, dynamic pricing, and local turnovers—without you running the inbox.`
  }
  if (psSlug === 'investment-property') {
    return `Investment and rental context for ${cityTitle}: where demand pools, what operators change, and how to underwrite income realistically.`
  }
  if (psSlug === 'sell-property') {
    return `Sell or keep renting in ${cityTitle}? A clear read on market signals, rent vs. sale tradeoffs, and no-pressure next steps.`
  }
  if (GUEST_PSY_RENTAL_SLUGS.has(psSlug)) {
    return `${svcTitle} in ${cityTitle} — find stays with local expertise and a guest-first process.`
  }
  return `${svcTitle} in ${cityTitle} with PlayaStays: local team, clear communication, destination-focused service.`
}

/**
 * When Spanish SEO fields are missing, indexed fallbacks (not thin noindex).
 */
export function buildEsServicePageMetadataFallbacks(
  city: City,
  service: Service,
  publicEnSegment: string
): { title: string; description: string } {
  const cityName = strip(city.title.rendered)
  const labelEs = serviceLabel(publicEnSegment, 'es')
  const title = `${labelEs} en ${cityName} | PlayaStays`
  const desc = defaultEsServicePageDescription(cityName, publicEnSegment)
  return { title, description: desc }
}

function defaultEsServicePageDescription(
  cityName: string,
  publicEn: string
): string {
  const m = publicEn
  if (m === 'property-management') {
    return `Administración y operación en ${cityName}: tarifas claras, cobertura a huéspedes y reportes al propietario. Solicita un estimado.`
  }
  if (m === 'airbnb-management') {
    return `Administración de Airbnb y renta corta en ${cityName}: anuncio, precios, mensajería y operación local.`
  }
  if (m === 'investment-property') {
    return `Inversión y renta en ${cityName}: contexto de demanda, ocupación y operación con equipo local.`
  }
  if (m === 'sell-property') {
    return `Vender o seguir rentando en ${cityName}: señales de mercado y próximos pasos sin presión.`
  }
  if (m === 'condo-rental-management' || m === 'beachfront-rental-management' || m === 'vacation-rental-management') {
    return `Rentas y estadías en ${cityName}: selección, claridad y respaldo local.`
  }
  return `Servicio en ${cityName} con PlayaStays: equipo local y comunicación clara.`
}

/**
 * Owner banner: avoid "undefined" when market income meta is empty.
 */
export function ownerBannerHeadlineForServicePage(
  cityName: string,
  income: string | undefined,
  isEs: boolean
): string {
  const n = (income || '').trim()
  const hasIncome = Boolean(
    n && n !== '—' && !/^undefined/i.test(n) && n.toLowerCase() !== 'null'
  )
  if (hasIncome) {
    return isEs
      ? `Propiedades en ${cityName} suelen alcanzar ${n} al mes bajo administración con PlayaStays`
      : `${cityName} properties often land around ${n} monthly with PlayaStays management`
  }
  return isEs
    ? `En ${cityName}, la operación local disciplinada sostiene ingresos y reseñas sólidas`
    : `In ${cityName}, disciplined local operations sustain revenue and review quality`
}

/** Investment / city meta — when ps_market_note is empty. */
export function fallbackMarketContextLine(cityName: string, isEs: boolean): string {
  return isEs
    ? `El mercado de ${cityName} varía por temporada y submercado; conectamos la demanda con listados y operación que convierten.`
    : `${cityName} demand shifts with season and submarket — we connect listings and operations to what actually converts.`
}

export function fallbackBestForLine(cityName: string, isEs: boolean): string {
  return isEs
    ? `Propietarios que quieren crecer ingresos sin microgestionar cada reserva o incidencia en ${cityName}.`
    : `Owners who want to grow income without running every stay and every guest issue in ${cityName}.`
}

/**
 * Pads with generic Q&A (WP first). Used only for non-bespoke routes in ServicePageTemplate.
 */
export function padServicePageFaqs(
  wpItems: FaqAccordionItem[],
  cityName: string,
  psSlug: string,
  isEs: boolean
): FaqAccordionItem[] {
  const min =
    GUEST_PSY_RENTAL_SLUGS.has(psSlug) ? 3
    : OWNER_PSY_SERVICE_SLUGS.has(psSlug) ? 4
    : 0
  if (min === 0) return wpItems.slice(0, PUBLIC_FAQ_LIMIT_CITY)
  if (wpItems.length >= min) return wpItems.slice(0, PUBLIC_FAQ_LIMIT_CITY)

  const gen = genericServiceFaqs(cityName, psSlug, isEs)
  const out: FaqAccordionItem[] = [...wpItems]
  const existing = new Set(out.map(x => normQ(x.question)))
  for (const g of gen) {
    if (out.length >= min) break
    const nq = normQ(g.question)
    if (existing.has(nq)) continue
    out.push(g)
    existing.add(nq)
  }
  return out.slice(0, PUBLIC_FAQ_LIMIT_CITY)
}

function genericServiceFaqs(
  cityName: string,
  psSlug: string,
  isEs: boolean
): FaqAccordionItem[] {
  if (psSlug === 'airbnb-management') {
    return isEs
      ? [
        { question: `¿Cuánto tarda poner viva mi propiedad en ${cityName}?`, answer: `Suele ser 5–7 días hábiles desde el onboard: medios, anuncio, reglas y calendario. En temporada alta priorizamos lo esencial para capturar reservas.` },
        { question: `¿Qué incluye la administración de Airbnb en ${cityName}?`, answer: `Precios, mensajería, limpieza coordinada, registro de acceso y resolución de incidencias. Tú no corres el hilo 24/7.` },
        { question: `¿Cómo veo ingresos y costos?`, answer: `Portal de propietario y reporte mensual con ingresos, descuentos de plataformas, tarifas de gestión y comprobantes de limpieza cuando aplique.` },
        { question: `¿Puedo usar mi unidad a veces?`, answer: `Sí, con bloqueos y reglas de condominio respetados. Sincronizamos calendario para evitar dobles reservas y conflicto con huéspedes.` },
        { question: `¿Cómo manejan precios en ${cityName}?`, answer: `Modelo dinámico con verificación de competencia, eventos y estacionalidad; sin depender de una tarifa fija obsoleta.` },
        { question: `¿Cuándo se depositan ingresos?`, answer: `Ciclos y depósitos según el canal. Te damos un calendario claro y seguimiento si hay retención de plataforma.` },
      ]
      : [
        { question: `How fast can a listing go live in ${cityName}?`, answer: `Typically 5–7 business days from onboarding: media, listing, access rules, and calendar. In peak season we sequence must-haves first so you capture bookings fast.` },
        { question: `What does ${cityName} Airbnb management include?`, answer: `Pricing, guest messaging, coordinated housekeeping, access instructions, and issue resolution. You are not the 24/7 thread.` },
        { question: `How do I see revenue and fees?`, answer: `Owner portal plus a monthly view of gross, platform fees, management fees, and cleaning charges where applicable.` },
        { question: `Can I still use the property?`, answer: `Yes—with calendar blocks and HOA rules. We keep calendars in sync to prevent double books and guest conflicts.` },
        { question: `How is nightly pricing set?`, answer: `Dynamic model with comp checks, seasonality, and event signals—not a set-and-forget static rate.` },
        { question: `When do I get paid?`, answer: `Channel-specific payout windows; we set expectations up front and track holds if a platform applies them.` },
      ]
  }
  if (psSlug === 'property-management') {
    return isEs
      ? [
        { question: `¿En cuánto tiempo queda listo mi listado en ${cityName}?`, answer: `La mayoría en 1–2 semanas según acceso, fotos y aprobación de anuncio. Aceleramos en temporada alta con prioridad en bloqueo de reservas.` },
        { question: `¿Qué incluye la administración?`, answer: `Anuncio multicanal, precio, reservas, limpieza, inspecciones, mantenimiento coordinado e informe de propietario. Los detalles se alinean a tu unidad y reglas de condominio.` },
        { question: `¿Cómo se comunican ustedes con huéspedes?`, answer: `Canales de plataformas, SMS u orientación on-site. Tiempo de respuesta acotado; escalamos solo cuando hace falta decisiones tuyas o del condominio.` },
        { question: `¿Cómo manejan reservas y reglas de condominio?`, answer: `Filtro de reservas, respeto a políticas, acceso, ruido y registro según aplica. Lo documentamos para dejar pistas claras al equipo de limpieza y guardia.` },
        { question: `¿Qué pasa con mantenimiento?`, answer: `Triaje con proveedores locales; aprobación para obras mayores, ejecución coordinada, facturas en el hilo con el owner.` },
        { question: `¿Cuál es su modelo de comisión?`, answer: `Porcentual sobre bruto, canales transparentes. En la página de precios y en consulta dices qué aplica a tu inmueble.` },
      ]
      : [
        { question: `How long until my ${cityName} listing is live?`, answer: `Most in 1–2 weeks depending on access, media, and channel approvals. In peak season we sequence blockers so you can take bookings first.` },
        { question: `What is included in management?`, answer: `Multi-channel listing, rates, guest ops, cleaning, light inspections, maintenance coordination, and owner reporting. Details align to your unit and HOA rules.` },
        { question: `How do you run guest communication?`, answer: `Platform inboxes, SMS, and on-staff coordination. Tight response windows; we escalate when condo rules, damage, or owner decisions are needed.` },
        { question: `How do you handle HOAs?`, answer: `Guest rules, check-in, noise, and registration (where applicable) are documented and handed to vendors and building staff to reduce friction.` },
        { question: `How is maintenance triaged?`, answer: `Local vendor routing; you approve non-routine work. We keep receipts in one thread and flag repeat issues on the home.` },
        { question: `How does your fee model work?`, answer: `Performance-based on gross, with clear channel and fee line items. See the pricing page and your estimate for your exact case.` },
      ]
  }
  if (psSlug === 'investment-property') {
    return isEs
      ? [
        { question: `¿Qué hace atractivo invertir cerca de ${cityName}?`, answer: `Demanda de viajeros, estacionalidad y mezcla de listados. Modelamos con ocupación, tarifa noche e ingresos con operación realista, no hojas de cálculo ficción.` },
        { question: `¿Qué buscan inversores típicos?`, answer: `Márgenes sostenidos, riesgo operativo bajo, y claro con equipos de campo. Ajustamos expectativas a el submercado real.` },
        { question: `¿PlayaStays además administra?`, answer: `Sí — con la misma base operativa. La proyección y la adquisición deben conectar a una operación que pueda ejecutar.` },
        { question: `¿Qué datos pido antes de ofertar?`, answer: `Ocupación reciente, tarifas comparables, reglas de condominio y obras pendientes. Sin eso, el número es ficción.` },
      ]
      : [
        { question: `What makes the ${cityName} investment case?`, answer: `Traveler demand, seasonality, and listing mix. We stress-test assumptions with real occupancy, nightly rates, and an operator that can actually execute.` },
        { question: `What do investors care about first?`, answer: `Sustainable margins, operational risk, and a field team. We calibrate to the submarket, not a fantasy spreadsheet.` },
        { question: `Does PlayaStays also operate?`, answer: `Yes—same on-the-ground machine. The thesis should connect to a team that can run the asset.` },
        { question: `What data should I verify before I buy?`, answer: `Recent occupancy, comparable ADRs, HOA rules, and capital needs. Without that, the pro forma is a guess.` },
      ]
  }
  if (psSlug === 'sell-property') {
    return isEs
      ? [
        { question: `¿Necesito vender para ganar?`, answer: `No. Si el flujo y la tesis siguen, retener a veces gana. Si el capital pide otra asignación, el mercado manda; te damos lectura con datos.` },
        { question: `¿PlayaStays lista propiedades?`, answer: `Nos enfoquamos en alquiler y asesoría; conéctate al estimado o consulta y te decimos alianzas si aplica en ${cityName}.` },
        { question: `¿Cómo comparan ustedes renta vs. venta?`, answer: `Renta neta, horizonte, y costos de salida. Sin agenda oculta de corretaje — primero claro, luego ruta.` },
        { question: `¿Qué pasa con impuestas y títulos?`, answer: `Te orientamos a quien tenga nicho legal/fiscal. No reemplazamos a tu abogado, pero conectamos el hilo con rentas reales de la unidad si conviene.` },
      ]
      : [
        { question: `Do I have to sell to win?`, answer: `Not always. If cash flow and strategy still work, keeping can be right. If capital needs a new home, the market has the final say—we give a clear read on both paths.` },
        { question: `Do you list properties?`, answer: `We focus on rentals and advisory. Start with an estimate; we can point to partners in ${cityName} when a sale is the move.` },
        { question: `How do you compare rent vs. sale?`, answer: `Net rent, time horizon, and exit costs. No hidden brokerage push—clarity first, then the route you choose.` },
        { question: `What about tax and title?`, answer: `We route you to specialists. We are not a law firm, but we can align rental performance context if it affects your choice.` },
      ]
  }
  if (GUEST_PSY_RENTAL_SLUGS.has(psSlug)) {
    return isEs
      ? [
        { question: `¿Cómo elijo zona en ${cityName}?`, answer: `Mapeamos barrios, playa vs. interior, y qué ajusta a tu grupo. Puedes ir al hub de la ciudad o consultar criterio directo con el equipo.` },
        { question: `¿Qué incluyen las rentas?`, answer: `Varía por unidad. En la ficha: camas, cocina, estacionamiento, piscina, y reglas de condominio. Preguntamos por políticas concretas antes de reservar.` },
        { question: `¿Soporte durante la estancia?`, answer: `Línea y coordinación con limpieza y acceso. Si algo falla, abrimos el hilo y priorizamos habitabilidad y seguridad.` },
      ]
      : [
        { question: `How do I pick an area in ${cityName}?`, answer: `We map neighborhoods, beach vs. downtown, and what fits your group. See the city hub for depth or message us for a direct filter.` },
        { question: `What is included?`, answer: `Varies by unit. Listing pages spell out beds, kitchen, parking, pool, and HOA rules. We confirm specifics before you book.` },
        { question: `Is there in-stay support?`, answer: `Yes—access and housekeeping threads. If something breaks, we triage and prioritize safety and comfort first.` },
      ]
  }
  return []
}

// ============================================================
// PricingTemplate — server component
//
// One template handles all pricing pages:
//   /[city]/property-management-cost/
//   /es/[ciudad]/costo-administracion-propiedades/
//   /property-management-pricing/       (global hub)
//   /es/precios-administracion-propiedades/
//
// Section order (strict, per spec):
//   1. Hero
//   2. Pricing cards (Core / Plus / Pro)
//   3. Real income examples
//   4. Value breakdown
//   5. FAQ with FAQPage schema
//   6. Final CTA
// ============================================================

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import type { City } from '@/types'
import { TrustBar, OwnerBanner, CtaStrip } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { RevenueCalculator } from '@/components/forms/RevenueCalculator'
import { Breadcrumb, type BreadcrumbItem } from '@/components/layout/Breadcrumb'
import {
  CITY_PRICING,
  getPricingPlans,
  getPricingFAQs,
  getValueItems,
  type CityPricingData,
} from '@/lib/pricing-data'
import { ComparisonTable } from '@/components/content/ComparisonTable'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { OwnerDashboardPreview } from '@/components/trust/OwnerDashboardPreview'
import { TransparencySection } from '@/components/trust/TransparencySection'
import { TrustStack } from '@/components/trust/TrustStack'
import { getDisplayStats, FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'
import type { Property } from '@/types'

// ── Props ──────────────────────────────────────────────────

interface PricingTemplateProps {
  properties?: Property[]
  locale:       Locale
  city:         City           // WP city object for CMS-driven data
  cityData:     CityPricingData // static market intelligence
  breadcrumbs:  BreadcrumbItem[]
  estimateHref: string         // locale-correct lead form href
  pmPageHref:   string         // link to the PM service page
  isGlobalHub?: boolean        // true on the hub page, false on city pages
}

// ── FAQ schema builder (FAQPage JSON-LD) ──────────────────

function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, ''), // strip any HTML for schema
      },
    })),
  }
}

// ── Copy helpers ──────────────────────────────────────────

function copy(locale: Locale) {
  const isEs = locale === 'es'
  return {
    heroTag:        isEs ? '💰 Precios de Administración' : '💰 Management Pricing',
    heroH1:         (city: string) => isEs
      ? `¿Cuánto cuesta la administración de propiedades en ${city}?`
      : `How Much Does Property Management Cost in ${city}?`,
    heroSub:        (city: string) => isEs
      ? `Las tarifas de gestión en ${city} oscilan entre el 10% y el 25% de los ingresos brutos. La gestión profesional de PlayaStays genera en promedio un 22–38% más de ingresos netos que la autogestión, incluso después de la comisión.`
      : `Management fees in ${city} range from 10% to 25% of gross revenue. PlayaStays-managed properties earn 22–38% more net income on average than self-managed — even after the fee.`,
    heroCtaLabel:   isEs ? 'Obtener estimado de ingresos gratis →' : 'Get Free Revenue Estimate →',
    trustStats: [
      { val: '4.9★', key: 'Owner satisfaction' },
      { val: '22%+', key: 'Net income uplift' },
      { val: '24/7', key: 'Local support' },
      { val: 'ES/EN', key: 'Bilingual team' },
    ],
    pricingEyebrow: isEs ? 'Planes de Administración' : 'Management Plans',
    pricingH2:      isEs ? 'Tarifas claras. Sin sorpresas.' : 'Clear fees. No surprises.',
    pricingBody:    isEs
      ? 'Todos los planes son basados en desempeño — ganamos cuando tú ganas. Sin cuota de instalación, sin retención mensual, sin contratos a largo plazo.'
      : 'All plans are performance-based — we earn when you earn. No setup fee, no monthly retainer, no long-term contract.',
    earningsEyebrow:(city: string) => isEs
      ? `Ingresos reales en ${city}`
      : `Real Earnings in ${city}`,
    earningsH2:     (city: string) => isEs
      ? `Ejemplos de ingresos de Airbnb en ${city}`
      : `Example Airbnb Earnings in ${city}`,
    earningsSub:    isEs
      ? 'Estimaciones basadas en datos reales de nuestro portafolio gestionado. Los montos son ingresos netos después de la comisión de gestión, con gestión profesional (mayor ocupación + precio dinámico).'
      : 'Estimates based on real data from our managed portfolio. Amounts shown are net income after the management fee, under professional management (higher occupancy + dynamic pricing).',
    withoutMgmt:    isEs ? 'Sin gestión profesional' : 'Without professional management',
    withMgmt:       isEs ? 'Con PlayaStays' : 'With PlayaStays',
    upliftLabel:    isEs ? 'Ingreso neto adicional' : 'Extra net income',
    peakSeasonLabel:isEs ? 'Temporada alta' : 'Peak season',
    occupancyLabel: isEs ? 'Ocupación promedio' : 'Avg occupancy',
    nightlyLabel:   isEs ? 'Tarifa nocturna' : 'Nightly rate',
    valueEyebrow:   isEs ? 'Lo que incluye tu tarifa' : 'What your fee covers',
    valueH2:        isEs ? 'Lo que obtienes por tu comisión' : 'What You Get for Your Management Fee',
    valueSub:       isEs
      ? 'No subcontratamos. Nuestro equipo local en la Riviera Maya maneja todo.'
      : 'We don\'t outsource. Our local team in the Riviera Maya handles everything.',
    faqEyebrow:     isEs ? 'Preguntas frecuentes' : 'Common questions',
    faqH2:          isEs ? 'FAQ sobre precios' : 'Pricing FAQ',
    ctaEyebrow:     isEs ? 'Propietarios en la Riviera Maya' : 'Property owners in the Riviera Maya',
    ctaH2:          (city: string) => isEs
      ? `Descubre cuánto podría ganar tu propiedad en ${city}`
      : `See what your ${city} property could earn`,
    ctaBody:        isEs
      ? 'Estimado gratis basado en datos reales de mercado de nuestro portafolio gestionado. Sin compromiso.'
      : 'Free estimate based on real market data from our managed portfolio. No commitment.',
    ctaBtn:         isEs ? 'Obtener mi estimado gratis →' : 'Get My Free Estimate →',
    pmLinkLabel:    isEs ? 'Ver servicios completos de administración →' : 'See full management services →',
    pricingLinkLabel: isEs ? '¿Qué cuesta la gestión?' : 'What does management cost?',
    depthWhyTitle:    isEs ? 'Por qué importa la gestión profesional aquí' : 'Why professional management matters here',
    depthInvTitle:    isEs ? 'Condominios vs villas y qué encaja' : 'Condos vs villas & what fits this market',
    depthSeasonTitle: isEs ? 'Estacionalidad y demanda local' : 'Seasonality & local demand',
  }
}

// ── Main template ─────────────────────────────────────────

export function PricingTemplate({
  locale, city, cityData, breadcrumbs, estimateHref, pmPageHref, isGlobalHub = false, properties = [],
}: PricingTemplateProps) {
  const c           = copy(locale)
  const cityName    = city.title.rendered
  const plans       = getPricingPlans(locale, cityName, estimateHref)
  const faqs        = getPricingFAQs(locale, cityName, city.slug)
  const valueItems  = getValueItems(locale)
  const pricingHubHref = locale === 'es' ? '/es/precios-administracion-propiedades/' : '/property-management-pricing/'
  const cityHubHref    = locale === 'es' ? `/es/${city.slug}/` : `/${city.slug}/`
  const faqSchema   = buildFaqSchema(faqs)
  const portfolioStats = getDisplayStats(properties, city.slug)

  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── SECTION 1: HERO ─────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <Breadcrumb crumbs={breadcrumbs} />

          <div className="svc-hero-grid" style={{ marginTop: 12 }}>
            {/* Left: pitch */}
            <div>
              <div className="hero-tag fade-1">{c.heroTag}</div>
              <h1
                className="display-title fade-2"
                style={{ fontSize: 'clamp(2rem,4vw,3.4rem)', marginBottom: 18 }}
              >
                {c.heroH1(cityName)}
              </h1>
              <p className="fade-3" style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.77, maxWidth: 440, marginBottom: 28,
              }}>
                {c.heroSub(cityName)}
              </p>

              {/* Key market stats */}
              <div className="hero-inline-stats fade-4">
                <div>
                  <div className="stat-val">{cityData.avgNightly}</div>
                  <div className="stat-key">{c.nightlyLabel}</div>
                </div>
                <div>
                  <div className="stat-val">{cityData.avgOccupancy}</div>
                  <div className="stat-key">{c.occupancyLabel}</div>
                </div>
                <div>
                  <div className="stat-val">10–25%</div>
                  <div className="stat-key">{locale === 'es' ? 'Rango de comisión' : 'Fee range'}</div>
                </div>
              </div>

              <div className="fade-5" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
                <Link href={estimateHref} className="btn btn-gold btn-lg">
                  {c.heroCtaLabel}
                </Link>
                <a
                  href="https://wa.me/529841234567"
                  className="btn btn-wa"
                  target="_blank"
                  rel="noopener"
                >
                  {locale === 'es' ? '💬 Hablar con un asesor' : '💬 Talk to a Local Manager'}
                </a>
              </div>
              <div className="fade-5" style={{ marginTop: 14 }}>
                <Link href={pmPageHref} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
                  {c.pmLinkLabel}
                </Link>
              </div>
            </div>

            {/* Right: lead form */}
            <div className="hero-form-card" id="estimate-form">
              <LeadForm
                variant="dark"
                city={cityName}
                source={`pricing-hero-${city.slug}`}
                title={locale === 'es' ? `Estimado gratis · ${cityName}` : `Free estimate · ${cityName}`}
                subtitle={locale === 'es'
                  ? 'Sin compromiso. Respuesta en 24 horas.'
                  : 'No commitment. Response within 24 hours.'
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ──────────────────────────────────── */}
      <TrustBar stats={c.trustStats} locale={locale} />

      {/* ── LOCAL CONTEXT + PARENT HUB (city pages only) ─ */}
      {!isGlobalHub && (
        <section className="pad-lg bg-ivory">
          <div className="container" style={{ maxWidth: 880 }}>
            <div className="eyebrow mb-8">
              {locale === 'es' ? 'Guía de precios Riviera Maya' : 'Riviera Maya pricing guide'}
            </div>
            <p className="body-text mb-24" style={{ maxWidth: 720 }}>
              {locale === 'es' ? (
                <>Esta página profundiza en <strong>{cityName}</strong>. Para la vista regional, la calculadora y la comparativa de mercados, visita la </>
              ) : (
                <>This page focuses on <strong>{cityName}</strong>. For the regional overview, calculator, and how fees work across markets, see the </>
              )}
              <Link href={pricingHubHref} style={{ color: 'var(--teal)', fontWeight: 600 }}>
                {locale === 'es' ? 'guía principal de precios de administración' : 'property management pricing hub'}
              </Link>
              {locale === 'es' ? '.' : '.'}
            </p>

            <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.35rem,2.5vw,1.85rem)' }}>
              {locale === 'es'
                ? `Cómo se determina la comisión en ${cityName}`
                : `How management pricing works in ${cityName}`}
            </h2>
            <ul style={{ margin: '0 0 28px', paddingLeft: 22, color: 'var(--mid)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              {(locale === 'es' ? cityData.whatAffectsPricingEs : cityData.whatAffectsPricing).map((line, i) => (
                <li key={i} style={{ marginBottom: 10 }}>{line}</li>
              ))}
            </ul>

            <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.35rem,2.5vw,1.85rem)' }}>
              {locale === 'es' ? 'Contexto del mercado' : 'Local market snapshot'}
            </h2>
            <p className="body-text" style={{ maxWidth: 720, marginBottom: 28 }}>
              {locale === 'es' ? cityData.marketNoteEs : cityData.marketNote}
            </p>

            <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.35rem,2.5vw,1.85rem)' }}>
              {c.depthWhyTitle}
            </h2>
            <p className="body-text" style={{ maxWidth: 720, marginBottom: 28 }}>
              {locale === 'es' ? cityData.whyMgmtValueEs : cityData.whyMgmtValue}
            </p>

            <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.35rem,2.5vw,1.85rem)' }}>
              {c.depthInvTitle}
            </h2>
            <p className="body-text" style={{ maxWidth: 720, marginBottom: 28 }}>
              {locale === 'es' ? cityData.inventoryCondoVillaEs : cityData.inventoryCondoVilla}
            </p>

            <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.35rem,2.5vw,1.85rem)' }}>
              {c.depthSeasonTitle}
            </h2>
            <p className="body-text" style={{ maxWidth: 720, marginBottom: 12 }}>
              {locale === 'es' ? cityData.seasonalityDemandEs : cityData.seasonalityDemand}
            </p>
            <p className="body-sm" style={{ maxWidth: 720, marginBottom: 28, color: 'var(--light)' }}>
              <strong style={{ color: 'var(--mid)' }}>{c.peakSeasonLabel}:</strong>{' '}
              {locale === 'es' ? cityData.peakSeasonEs : cityData.peakSeason}
            </p>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
              paddingTop: 8, borderTop: '1px solid var(--sand-dark)',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {locale === 'es' ? 'Enlaces útiles' : 'Related'}
              </span>
              <Link href={pricingHubHref} className="btn btn-ghost btn-sm">
                {locale === 'es' ? 'Guía de precios (región)' : 'Regional pricing hub →'}
              </Link>
              <Link href={cityHubHref} className="btn btn-ghost btn-sm">
                {locale === 'es' ? `Guía ${cityName}` : `${cityName} city guide →`}
              </Link>
              <Link href={pmPageHref} className="btn btn-ghost btn-sm">
                {locale === 'es' ? 'Administración de propiedades' : 'Property management →'}
              </Link>
              <Link href={estimateHref} className="btn btn-ghost btn-sm">
                {locale === 'es' ? 'Estimado gratuito' : 'Free estimate →'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 2: PRICING CARDS ────────────────────── */}
      <PricingGrid
        eyebrow={c.pricingEyebrow}
        headline={c.pricingH2}
        body={c.pricingBody}
        plans={plans}
      />

      {/* ── CALCULATOR SECTION ──────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">
                {locale === 'es' ? 'Herramienta gratuita' : 'Free tool'}
              </div>
              <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                {locale === 'es'
                  ? `¿Cuánto podría ganar tu propiedad en ${cityName}?`
                  : `How much could your ${cityName} property earn?`}
              </h2>
              <p className="body-text mb-24">
                {locale === 'es'
                  ? `Ajusta el tipo de propiedad y tarifa para ver tu estimado de ingresos mensuales y anuales bajo gestión profesional, con cada nivel de plan. No se requiere correo electrónico.`
                  : `Adjust property type and rate to see your estimated monthly and annual income under professional management, at each plan tier. No email required.`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  locale === 'es' ? 'Precio dinámico aumenta tu ocupación en promedio un 15%' : 'Dynamic pricing lifts your occupancy by 15% on average',
                  locale === 'es' ? 'La fotografía profesional aumenta las reservas hasta un 40%' : 'Professional photography increases bookings by up to 40%',
                  locale === 'es' ? 'La tasa de respuesta <5 min mejora la posición en Airbnb' : '<5 min response rate improves Airbnb search ranking',
                ].map((point, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.83rem', color: 'var(--mid)' }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <RevenueCalculator
              locale={locale}
              defaultCitySlug={city.slug}
              estimateHref={estimateHref}
            />
          </div>
        </div>
      </section>

            {/* ── PERFORMANCE PROOF ── */}
      <PerformanceProof
        stats={portfolioStats}
        cityName={cityName}
        locale={locale}
        estimateHref={estimateHref}
      />

      {/* ── OWNER DASHBOARD PREVIEW ── */}
      <OwnerDashboardPreview
        locale={locale}
        cityName={cityName}
        estimateHref={estimateHref}
      />

      {/* ── SECTION 3: REAL INCOME EXAMPLES ─────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 48px' }}>
            <div className="eyebrow mb-8">{c.earningsEyebrow(cityName)}</div>
            <h2 className="section-title mt-12 mb-8">
              {c.earningsH2(cityName)}
            </h2>
            <p className="body-text">{c.earningsSub}</p>
          </div>

          {/* Market context chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 'var(--r-pill)',
              background: 'var(--sand)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)',
            }}>
              🌍 {c.occupancyLabel}: {cityData.avgOccupancy}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 'var(--r-pill)',
              background: 'var(--sand)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)',
            }}>
              🌴 {c.peakSeasonLabel}: {locale === 'es' ? cityData.peakSeasonEs : cityData.peakSeason}
            </span>
          </div>

          {/* Earnings comparison cards */}
          <div className="service-cards">
            {cityData.earnings.map((ex, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                border: '1px solid var(--sand-dark)',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--sh-sm)',
              }}>
                {/* Card header */}
                <div style={{
                  background: 'var(--deep)',
                  padding: '16px 24px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem', fontWeight: 600, color: 'var(--white)',
                  }}>
                    {locale === 'es' ? ex.typeEs : ex.type}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                    {ex.nightlyRange} {locale === 'es' ? 'por noche' : 'per night'}
                  </div>
                </div>

                {/* Without management */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--sand-dark)' }}>
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--light)', marginBottom: 6,
                  }}>
                    {c.withoutMgmt}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem', fontWeight: 600, color: 'var(--mid)',
                  }}>
                    {ex.monthlyWithout.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--light)', marginTop: 2 }}>
                    {locale === 'es' ? 'autogestión · menor ocupación' : 'self-managed · lower occupancy'}
                  </div>
                </div>

                {/* With management */}
                <div style={{ padding: '16px 24px', background: 'rgba(24,104,112,0.04)' }}>
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 6,
                  }}>
                    {c.withMgmt}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem', fontWeight: 700, color: 'var(--teal)',
                  }}>
                    {ex.monthlyWith.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--mid)', marginTop: 2 }}>
                    {ex.managementFee}
                  </div>
                </div>

                {/* Uplift */}
                <div style={{
                  padding: '12px 24px',
                  background: 'var(--gold)', textAlign: 'center',
                }}>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 700, color: 'var(--deep)',
                  }}>
                    {c.upliftLabel}: {ex.uplift}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: 'center', fontSize: '0.75rem', color: 'var(--light)',
            marginTop: 24, fontStyle: 'italic',
          }}>
            {locale === 'es'
              ? '* Estimaciones basadas en datos del portafolio de PlayaStays. Los ingresos reales varían según la propiedad, temporada y condiciones del mercado.'
              : '* Estimates based on PlayaStays portfolio data. Actual income varies by property, season, and market conditions.'}
          </p>
        </div>
      </section>

      {/* ── SECTION 4: VALUE BREAKDOWN ───────────────────── */}
      <section className="pad-lg bg-sand">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
            <div className="eyebrow mb-8">{c.valueEyebrow}</div>
            <h2 className="section-title mt-12 mb-8">{c.valueH2}</h2>
            <p className="body-text">{c.valueSub}</p>
          </div>

          <div className="service-cards">
            {valueItems.map((item, i) => (
              <div key={i} className="service-card">
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                <div className="service-card-title">{item.title}</div>
                <div className="service-card-text">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
            <div className="eyebrow mb-8">
              {locale === 'es' ? 'La diferencia' : 'The difference'}
            </div>
            <h2 className="section-title mt-12 mb-8">
              {locale === 'es'
                ? 'Empresa típica vs PlayaStays'
                : 'Typical Property Manager vs PlayaStays'}
            </h2>
            <p className="body-text">
              {locale === 'es'
                ? 'Una comparación directa y profesional de lo que ofrecemos.'
                : 'A straightforward, professional comparison of what we offer.'}
            </p>
          </div>

          <ComparisonTable locale={locale} />
        </div>
      </section>

      {/* ── MID-PAGE CTA ─────────────────────────────────── */}
      <OwnerBanner
        eyebrow={locale === 'es' ? `Estimado gratis · ${cityName}` : `Free estimate · ${cityName}`}
        headline={locale === 'es'
          ? `Descubre cuánto podría ganar tu propiedad en ${cityName}`
          : `Find out what your ${cityName} property could earn`}
        body={locale === 'es'
          ? 'Basado en datos reales de mercado de nuestro portafolio gestionado. 2 minutos. Sin compromiso.'
          : 'Based on real market data from our managed portfolio. 2 minutes. No obligation.'
        }
        primaryCta={{ label: c.ctaBtn, href: estimateHref }}
        secondaryCta={{ label: c.pmLinkLabel, href: pmPageHref }}
      />

            {/* ── TRANSPARENCY SECTION ── */}
      <TransparencySection
        locale={locale}
        estimateHref={estimateHref}
        cityName={cityName}
      />

      {/* ── SECTION 5: FAQ ───────────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 56,
          alignItems: 'start',
        }}>
          <FaqAccordion
            eyebrow={c.faqEyebrow}
            headline={c.faqH2}
            items={faqs}
          />

          {/* Sidebar: form */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--r-lg)',
            padding: 32,
            boxShadow: 'var(--sh-sm)',
            border: '1px solid var(--sand-dark)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem', fontWeight: 600,
              color: 'var(--charcoal)', marginBottom: 8,
            }}>
              {locale === 'es'
                ? `¿Cuánto ganaría tu propiedad en ${cityName}?`
                : `What would your ${cityName} property earn?`}
            </h3>
            <p className="body-sm mb-20">
              {locale === 'es'
                ? 'Estimado personalizado gratis basado en datos reales. Sin compromiso — solo un panorama claro de tu potencial de ingresos.'
                : 'Free personalised estimate based on real data. No commitment — just a clear picture of your income potential.'
              }
            </p>
            <LeadForm
              variant="light"
              city={cityName}
              source={`pricing-faq-${city.slug}`}
            />
          </div>
        </div>
      </section>

      {/* ── BOTTOM LEAD CAPTURE ──────────────────────────── */}
      <section className="pad-lg bg-sand" id="get-estimate">
        <div className="container" style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="eyebrow mb-8">
              {locale === 'es' ? 'Estimado personalizado' : 'Personalised estimate'}
            </div>
            <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              {locale === 'es'
                ? `¿Cuánto generaría tu propiedad en ${cityName}?`
                : `What would your ${cityName} property earn?`}
            </h2>
            <p className="body-text">
              {locale === 'es'
                ? 'Nuestro equipo local revisará tu propiedad y enviará una proyección de ingresos real — no un estimado genérico — en 24 horas.'
                : 'Our local team will review your specific property and send a real income projection — not a generic estimate — within 24 hours.'}
            </p>
          </div>

          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--r-lg)',
            padding: 40,
            boxShadow: 'var(--sh-md)',
            border: '1px solid var(--sand-dark)',
          }}>
            <LeadForm
              variant="light"
              city={cityName}
              source={`pricing-bottom-${city.slug}`}
              title={locale === 'es' ? 'Obtener estimado gratis' : 'Get Free Revenue Estimate'}
              subtitle={locale === 'es'
                ? 'Sin compromiso. Respuesta en 24 horas.'
                : 'No commitment. Response within 24 hours.'}
            />
          </div>
        </div>
      </section>

            {/* ── TRUST STACK ── */}
      <section className="pad-sm bg-ivory">
        <div className="container">
          <TrustStack locale={locale} variant="grid" theme="light" />
        </div>
      </section>

      {/* ── SECTION 6: FINAL CTA ─────────────────────────── */}
      <CtaStrip
        eyebrow={c.ctaEyebrow}
        headline={c.ctaH2(cityName)}
        cta={{ label: c.ctaBtn, href: estimateHref }}
      />
    </>
  )
}

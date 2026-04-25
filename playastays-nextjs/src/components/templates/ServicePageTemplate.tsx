// ============================================================
// ServicePageTemplate — server component
// One template drives all 42 city-service pages.
// Service type is detected from service.meta.ps_service_slug.
// Content differences are purely data-driven — no branching HTML.
// Page role: strongest commercial page for exact city + service (@/content/page-roles).
// ============================================================

import Link from 'next/link'
import type { City, Service, FAQ, Testimonial } from '@/types'
import { serviceLabel, SERVICE_SLUG_EN_TO_ES, type Locale } from '@/lib/i18n'
import { publicEnSlugFromPs } from '@/lib/service-url-slugs'
import { serviceHubHref, wpSlugToServiceHubId } from '@/lib/service-hub-routes'
import { Hero } from '@/components/hero/Hero'
import {
  StepsGrid, NeighborhoodList, CaseStats,
  OwnerBanner, InternalLinks, SvcList,
} from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import type { PricingPlan } from '@/types'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { serviceSchema } from '@/lib/seo'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'
import { PlayaDelCarmenPropertyManagement } from '@/components/templates/PlayaDelCarmenPropertyManagement'
import { PlayaDelCarmenAirbnbManagement } from '@/components/templates/PlayaDelCarmenAirbnbManagement'
import { getBilingualFaqItems, limitPublicFaqs, PUBLIC_FAQ_LIMIT_CITY } from '@/lib/faq-helpers'
import {
  genericHeroSubhead,
  ownerBannerHeadlineForServicePage,
  padServicePageFaqs,
  fallbackMarketContextLine,
  fallbackBestForLine,
} from '@/lib/service-page-fallbacks'

// Service types that show the lead form in the hero
const OWNER_INTENT_SERVICES = new Set([
  'property-management',
  'airbnb-management',
  'investment-property',
  'sell-property',
])

// Service types that show pricing cards
const PRICED_SERVICES = new Set([
  'property-management',
  'airbnb-management',
])

// Guest-intent rental listing pages — hero secondary should not duplicate city rentals nav
const GUEST_RENTAL_SERVICES = new Set([
  'vacation-rentals',
  'condos-for-rent',
  'beachfront-rentals',
])

interface ServicePageTemplateProps {
  city:         City
  service:      Service
  faqs:         FAQ[]
  testimonials: Testimonial[]
  relatedServices: Service[]
  locale?:      Locale
}

export function ServicePageTemplate({
  city,
  service,
  faqs,
  testimonials,
  relatedServices,
  locale = 'en',
}: ServicePageTemplateProps) {
  const isEs     = locale === 'es'
  const cityName  = city.title.rendered
  const citySlug  = city.slug
  const svcSlug   = service.meta.ps_service_slug
  const meta      = service.meta
  const computed  = service.ps_computed
  const isOwner   = OWNER_INTENT_SERVICES.has(svcSlug)
  const hasPricing = PRICED_SERVICES.has(svcSlug)

  // ES-aware content: use _es meta fields when locale='es', fall back to EN
  const serviceTitlePlain = service.title.rendered.replace(/<[^>]*>/g, '').trim()
  const cmsHeadlineRaw = isEs && meta.ps_hero_headline_es ? meta.ps_hero_headline_es : meta.ps_hero_headline
  const cmsHeadline = typeof cmsHeadlineRaw === 'string' ? cmsHeadlineRaw.trim() : ''
  const headline =
    cmsHeadline ||
    (svcSlug === 'property-management' || svcSlug === 'airbnb-management'
      ? `${serviceTitlePlain} in ${cityName}`
      : service.title.rendered)
  const rawSubhead =
    isEs && meta.ps_hero_subheadline_es
      ? meta.ps_hero_subheadline_es
      : (meta.ps_hero_subheadline || service.excerpt.rendered.replace(/<[^>]*>/g, ''))
  const subheadTrim = typeof rawSubhead === 'string' ? rawSubhead.replace(/\s+/g, ' ').trim() : ''
  const subhead =
    subheadTrim || genericHeroSubhead(cityName, serviceTitlePlain, svcSlug, isEs)
  const content   = isEs && meta.ps_content_es          ? meta.ps_content_es          : service.content.rendered
  const faqItems = padServicePageFaqs(
    limitPublicFaqs(getBilingualFaqItems(faqs, locale), PUBLIC_FAQ_LIMIT_CITY),
    cityName,
    svcSlug,
    isEs
  )

  // Locale-correct hrefs
  const base        = isEs ? '/es' : ''
  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const cityHref    = `${base}/${citySlug}/`
  const esServiceSlug = SERVICE_SLUG_EN_TO_ES[publicEnSlugFromPs(svcSlug)] ?? svcSlug
  const pricingHref  = isEs
    ? '/es/precios-administracion-propiedades/'
    : '/property-management-pricing/'
  const rentalsHref  = isEs ? '/es/rentas/' : '/rentals/'
  /** City-scoped guest browse — separate from management service URLs */
  const cityRentalsHref = isEs
    ? `/es/${citySlug}/rentas/`
    : `/${citySlug}/rentals/`
  const investHref   = `${base}/${citySlug}/${isEs ? 'propiedades-de-inversion' : 'investment-property'}/`
  const pmHref       = `${base}/${citySlug}/${isEs ? 'administracion-de-propiedades' : 'property-management'}/`
  const keepRentHref = pmHref

  if (citySlug === 'playa-del-carmen' && svcSlug === 'property-management') {
    return (
      <PlayaDelCarmenPropertyManagement
        city={city}
        service={service}
        faqs={faqs}
        testimonials={testimonials}
        relatedServices={relatedServices}
        locale={locale}
      />
    )
  }

  if (citySlug === 'playa-del-carmen' && svcSlug === 'airbnb-management') {
    return (
      <PlayaDelCarmenAirbnbManagement
        city={city}
        service={service}
        faqs={faqs}
        testimonials={testimonials}
        relatedServices={relatedServices}
        locale={locale}
      />
    )
  }

  const schema = serviceSchema(service, city, faqs)

  const relatedLinks = relatedServices.map(s => {
    const pubEn = publicEnSlugFromPs(s.meta.ps_service_slug)
    return {
      label: isEs
        ? `${s.title.rendered} en ${cityName}`
        : `${s.title.rendered} in ${cityName}`,
      href:  isEs
        ? `/es/${citySlug}/${SERVICE_SLUG_EN_TO_ES[pubEn] ?? pubEn}/`
        : `/${citySlug}/${pubEn}/`,
    }
  })

  // Default pricing plans for PM/Airbnb management pages
  // In production these should come from WP meta. Shown here as a typed fallback.
  const pricingPlans: PricingPlan[] = [
    {
      tier: 'Essential',
      name: '15%',
      unit: 'of gross revenue',
      desc: 'For condos and studios. Everything you need to start earning more, hands-off.',
      features: [
        'Airbnb, VRBO & Booking.com listing',
        'Dynamic pricing',
        'Guest communication & screening',
        'Cleaning coordination',
        'Owner dashboard & monthly reports',
        'Legal compliance assistance',
      ],
      cta: { label: 'Get Started', href: '#estimate-form' },
    },
    {
      tier: 'Professional',
      name: '20%',
      unit: 'of gross revenue',
      desc: 'Top-tier performance with in-house cleaning and concierge-level service.',
      features: [
        'Everything in Essential',
        'Professional photography (included)',
        'Listing copywriting & SEO',
        'In-house cleaning (hotel standard)',
        '24/7 guest emergency line',
        'Maintenance coordination',
        'Quarterly property inspection',
      ],
      cta: { label: 'Get Started', href: '#estimate-form' },
      featured: true,
      badge: 'Most Popular',
    },
    {
      tier: 'Premium',
      name: '25%',
      unit: 'of gross revenue',
      desc: 'For luxury villas and high-revenue properties. Dedicated account manager included.',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Guest concierge services',
        'Interior design consultation',
        'Priority maintenance (<4hr)',
        'SAT tax filing & accounting',
      ],
      cta: { label: 'Get Started', href: '#estimate-form' },
    },
  ]

  // Steps come from CMS (ps_computed.steps). Shown with fallback icons.
  const steps = computed.steps.length > 0
    ? computed.steps.map((s, i) => ({
        num: i + 1,
        icon: <StepIcon num={i + 1} />,
        title: s.title,
        desc: s.desc,
      }))
    : defaultSteps(cityName, isEs)

  const heroFormTitle = isEs
    ? `Estimado gratis · ${cityName}`
    : `Free estimate · ${cityName}`
  const stepsGridBody = isEs
    ? `Nuestro proceso de gestión en ${cityName} es sistemático y comprobado.`
    : `Our ${cityName} management process is systematic and proven.`
  const pricingTeaserTitle = isEs
    ? `¿Quieres un desglose completo de precios para ${cityName}?`
    : `Want a full pricing breakdown for ${cityName}?`
  const ownerBannerEyebrow = isEs
    ? `¿Tienes propiedad en ${cityName}?`
    : `Own property in ${cityName}?`
  const ownerBannerHeadline = ownerBannerHeadlineForServicePage(
    cityName,
    city.meta.ps_avg_monthly_income,
    isEs
  )
  const faqAsideSupportLine = isEs
    ? `Sin compromiso. Nuestro equipo en ${cityName} responde en 24 horas.`
    : `No obligation. Our ${cityName} team responds within 24 hours.`
  const internalLinksHeading = isEs
    ? `También en ${cityName}`
    : `Also in ${cityName}`
  const internalLinksCityHubLabel = isEs
    ? `Ver rentas en ${cityName}`
    : `Browse ${cityName} Rentals`
  const hubId = wpSlugToServiceHubId(svcSlug)
  const parentServiceHref = hubId ? serviceHubHref(locale, hubId) : undefined
  const labelSlug =
    hubId === 'vacation-rental-management' ? 'vacation-rentals' : hubId ?? ''
  const parentServiceLabel =
    hubId && labelSlug
      ? isEs
        ? `Ver todas: ${serviceLabel(labelSlug, 'es')}`
        : `View all ${serviceLabel(labelSlug, 'en')} services`
      : undefined
  const parentCityLabel = isEs ? `Volver a ${cityName}` : `Back to ${cityName}`
  const exploreHeading =
    relatedLinks.length > 0
      ? internalLinksHeading
      : isEs
        ? 'Seguir explorando'
        : 'Keep exploring'

  const heroTag = GUEST_RENTAL_SERVICES.has(svcSlug)
    ? `${serviceTitlePlain} · ${cityName}`
    : isEs
      ? `Gestión local · ${cityName}`
      : `Local management · ${cityName}`

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* HERO */}
      <Hero
        variant="split"
        locale={locale}
        breadcrumbs={[
          { label: isEs ? 'Inicio' : 'Home', href: isEs ? '/es/' : '/' },
          { label: cityName, href: cityHref },
          { label: headline, href: null },
        ]}
        tag={heroTag}
        headline={headline}
        sub={subhead}
        stats={computed.stats}
        primaryCta={{
          label: meta.ps_cta_primary_text || (isEs ? 'Obtener estimado gratis' : 'Get Free Revenue Estimate'),
          href:  meta.ps_cta_primary_url  || '#estimate-form',
        }}
        secondaryCta={
          GUEST_RENTAL_SERVICES.has(svcSlug)
            ? undefined
            : {
                label: isEs ? `Ver rentas en ${cityName}` : `Browse ${cityName} Rentals`,
                href: cityRentalsHref,
              }
        }
        formSlot={isOwner ? (
          <LeadForm
            variant="dark"
            city={cityName}
            source={`${citySlug}-${svcSlug}`}
            title={heroFormTitle}
            subtitle={isEs ? 'Sin compromiso. Respondemos en 24 horas.' : 'No commitment required. Our local team responds within 24 hours.'}
            locale={locale}
          />
        ) : null}
      />

      {/* ── SECTION GROUPS BY SERVICE TYPE ── */}

      {/* Property Management & Airbnb Management */}
      {(svcSlug === 'property-management' || svcSlug === 'airbnb-management') && (
        <>
          <section className="pad-lg bg-ivory">
            <div className="container city-hub-narrow">
              <div className="eyebrow mb-8">{isEs ? 'Por qué importa aquí' : 'Why it matters here'}</div>
              <h2 className="section-title mt-12 mb-24" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                {isEs ? `Por qué este servicio importa en ${cityName}` : `Why this service matters in ${cityName}`}
              </h2>
              <p className="body-text mb-20" style={{ maxWidth: 680 }}>
                {isEs
                  ? `Ejecutamos ${serviceTitlePlain} con equipos locales: turnovers, proveedores, mensajería y reglas de condominio alineadas a la demanda en ${cityName}.`
                  : `We deliver ${serviceTitlePlain} with on-the-ground operators in ${cityName}—turnovers, vendors, guest messaging, and HOA-aligned standards for real destination demand.`}
              </p>
              <p className="body-text mb-20" style={{ maxWidth: 680, color: 'var(--mid)', fontSize: '0.95rem' }}>
                {isEs
                  ? 'El directorio de zonas vive en el hub de la ciudad; aquí nos enfocamos en alcance, proceso y conversión.'
                  : 'Neighborhood-level mapping lives on the city hub—this page stays focused on scope, execution, and conversion.'}
              </p>
              <Link href={`${cityHref}#city-neighborhoods`} className="btn btn-ghost btn-sm">
                {isEs ? `Explorar el mercado de ${cityName} →` : `Explore the ${cityName} market →`}
              </Link>
            </div>
          </section>

          {hasPricing && (
            <>
              <PricingGrid
                eyebrow={isEs ? 'Qué incluye' : 'What’s included'}
                headline={isEs ? 'Planes de administración' : 'Management plans'}
                body={isEs ? 'Todos los planes son basados en desempeño — ganamos cuando tú ganas.' : 'All plans are performance-based — we earn when you earn.'}
                plans={pricingPlans}
              />
              <section className="pad-sm bg-ivory">
                <div className="container">
                  <div style={{
                    background: 'var(--sand)',
                    borderRadius: 'var(--r-md)',
                    padding: '18px 24px',
                    border: '1px solid var(--sand-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 14,
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 3 }}>
                        {pricingTeaserTitle}
                      </div>
                      <p style={{ fontSize: '0.83rem', color: 'var(--mid)', margin: 0 }}>
                        {isEs ? 'Ejemplos de ingresos reales, comparación de tarifas y contexto del mercado.' : 'Real income examples, fee comparisons, and market context — all in one page.'}
                      </p>
                    </div>
                    <Link href={pricingHref} className="btn btn-ghost" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {isEs ? 'Ver precios de gestión →' : 'See management pricing →'}
                    </Link>
                  </div>
                </div>
              </section>
            </>
          )}

          <StepsGrid
            eyebrow={isEs ? 'Proceso local' : 'Local process'}
            headline={isEs ? 'De la consulta a la operación' : 'From onboarding to execution'}
            body={stepsGridBody}
            steps={steps}
          />

          <PerformanceProof
            stats={FALLBACK_PORTFOLIO_STATS}
            cityName={cityName}
            locale={locale}
            estimateHref={estimateHref}
          />
        </>
      )}

      {/* Investment Property */}
      {svcSlug === 'investment-property' && (
        <section className="pad-lg bg-sand">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">{cityName} Investment Analysis</div>
              <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                The {cityName} investment case
              </h2>
              <p className="body-text mb-16">
                {city.meta.ps_market_note || fallbackMarketContextLine(cityName, isEs)}
              </p>
              <p className="body-text mb-16">
                <strong>{isEs ? 'Ideal para' : 'Best suited for:'}</strong>{' '}
                {city.meta.ps_best_for || fallbackBestForLine(cityName, isEs)}
              </p>
              <p className="body-text mb-32">
                <strong>{isEs ? 'Temporada alta' : 'Peak season:'}</strong>{' '}
                {city.meta.ps_peak_season || (isEs ? 'varía; lo segmentamos con datos recientes' : 'varies — we break it out with what is booking right now')}
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 16 }}>
                Top neighborhoods for investment
              </h3>
              <NeighborhoodList neighborhoods={city.ps_computed.neighborhoods} cityName={cityName} />
            </div>
            <CaseStats
              eyebrow={`${cityName} Market Data`}
              headline="Performance benchmarks"
              stats={[
                { val: city.meta.ps_avg_nightly ?? '—',        key: 'Nightly rate range' },
                { val: city.meta.ps_avg_occupancy ?? '—',      key: 'Occupancy range' },
                { val: city.meta.ps_avg_monthly_income ?? '—', key: 'Monthly income range' },
                { val: '4.9★',                          key: 'Portfolio guest rating' },
              ]}
              cta={{ label: 'Get Free ROI Estimate →', href: '/list-your-property/' }}
            />
          </div>
        </section>
      )}

      {/* Sell Property */}
      {svcSlug === 'sell-property' && (
        <section className="pad-lg bg-sand">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">Sell or Keep Renting?</div>
              <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                The honest question
              </h2>
              <p className="body-text mb-16">
                PlayaStays manages rentals and advises on sales. We give you the honest
                picture based on current {cityName} market data — no sales agenda.
              </p>
              <p className="body-text mb-16">
                <strong>Consider selling if:</strong> You need to redeploy capital, the property
                has significantly appreciated, or your investment horizon has concluded.
              </p>
                <p className="body-text mb-32">
                <strong>Consider keeping if:</strong>{' '}
                {isEs
                  ? (() => {
                    const n = (city.meta.ps_avg_monthly_income || '').trim()
                    if (n && n !== '—' && !/^undefined/i.test(n)) {
                      return `tu propiedad en ${cityName} gana aprox. ${n} al mes y no necesitas el capital. La plusvalía y el ingreso hacen que retener tenga sentido.`
                    }
                    return `la renta en ${cityName} es fuerte, no estás forzado a vender, y aún te conviene el flujo.`
                  })()
                  : (() => {
                    const n = (city.meta.ps_avg_monthly_income || '').trim()
                    if (n && n !== '—' && !/^undefined/i.test(n)) {
                      return `Your ${cityName} property earns around ${n} monthly and you don't need the capital. Appreciation and rental income can make holding compelling.`
                    }
                    return `Rental performance in ${cityName} is strong, you are not under pressure to sell, and the cash flow still makes sense.`
                  })()}
              </p>
              <Link href={keepRentHref} className="btn btn-ghost">
                {isEs ? 'Seguir rentando — ver servicios →' : 'Keep renting — see management services →'}
              </Link>
            </div>
            <div>
              <div className="eyebrow mb-8">{cityName} Market Prices</div>
              <h2 className="section-title mt-12 mb-24" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                What's selling right now
              </h2>
                <p className="body-text mb-24">
                  {city.meta.ps_market_note || fallbackMarketContextLine(cityName, isEs)}
                </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Studio / 1BR', '2-Bedroom Condo', '3BR+ / Villa', 'Penthouse'].map(type => (
                  <div key={type} style={{ padding: '14px 0', borderBottom: '1px solid var(--sand-dark)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.97rem', fontWeight: 600, color: 'var(--charcoal)' }}>
                      {type}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <Link href="#estimate-form" className="btn btn-gold">Get Free Valuation →</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vacation Rentals / Condos / Beachfront — guest-intent pages */}
      {(svcSlug === 'vacation-rentals' || svcSlug === 'condos-for-rent' || svcSlug === 'beachfront-rentals') && (
        <>
          <section className="pad-lg bg-sand">
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
              <div>
                <div className="eyebrow mb-8">{cityName} — {service.title.rendered}</div>
                <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                  Why {cityName}
                </h2>
                <p className="body-text mb-16">
                  {service.content.rendered
                    ? <span dangerouslySetInnerHTML={{ __html: service.content.rendered }} />
                    : city.meta.ps_market_note
                  }
                </p>
                <p className="body-text mb-32">
                  <strong>Best suited for:</strong> {city.meta.ps_best_for}
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Link href={rentalsHref} className="btn btn-coral">{isEs ? 'Ver Rentas' : 'Browse Rentals'}</Link>
                  <Link href={investHref} className="btn btn-ghost">{isEs ? 'Guía de Inversión' : 'Investment Guide'}</Link>
                </div>
              </div>
              <div>
                <div className="eyebrow mb-8">Neighborhoods</div>
                <h2 className="section-title mt-12 mb-20" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                  Where to stay in {cityName}
                </h2>
                <NeighborhoodList neighborhoods={city.ps_computed.neighborhoods} cityName={cityName} />
              </div>
            </div>
          </section>
          <OwnerBanner
            eyebrow={ownerBannerEyebrow}
            headline={ownerBannerHeadline}
            body={isEs ? 'Obtén un estimado gratuito basado en datos reales del mercado.' : 'Get a free estimate based on real market data.'}
            primaryCta={{ label: isEs ? 'Obtener estimado →' : 'Get Free Estimate →', href: estimateHref }}
            secondaryCta={{ label: isEs ? 'Servicios de gestión' : 'Management Services', href: pmHref }}
          />
        </>
      )}

      {/* WP Gutenberg content — appended after the above for any extra editorial copy */}
      {service.content.rendered && svcSlug !== 'vacation-rentals' && svcSlug !== 'condos-for-rent' && svcSlug !== 'beachfront-rentals' && (
        <section className="pad-lg bg-ivory">
          <div className="container" style={{ maxWidth: 880 }}>
            <div
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>
      )}

      {/* FAQ + parent / sibling pathways */}
      {(faqItems.length > 0 || relatedLinks.length > 0 || parentServiceHref) && (
        <section className="pad-lg bg-sand">
          <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
            {faqItems.length > 0 && (
              <FaqAccordion
                eyebrow={isEs ? 'Preguntas frecuentes' : 'FAQ'}
                headline={
                  isEs
                    ? `Sobre este servicio en ${cityName}`
                    : `About this service in ${cityName}`
                }
                items={faqItems}
              />
            )}
            <p className="body-text" style={{ marginTop: faqItems.length ? 28 : 0, marginBottom: 0 }}>
              <Link href={estimateHref} className="btn btn-ghost btn-sm" style={{ verticalAlign: 'middle' }}>
                {isEs ? 'Obtener estimado gratis →' : 'Get a free revenue estimate →'}
              </Link>
              <span className="body-sm" style={{ display: 'block', marginTop: 12, color: 'var(--mid)' }}>
                {faqAsideSupportLine}
              </span>
            </p>
            {(relatedLinks.length > 0 || parentServiceHref) && (
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--sand-dark)' }}>
                <InternalLinks
                  hubNavEyebrow={isEs ? 'Páginas padre' : 'Parent pages'}
                  parentCityHref={cityHref}
                  parentCityLabel={parentCityLabel}
                  parentServiceHref={parentServiceHref}
                  parentServiceLabel={parentServiceLabel}
                  heading={exploreHeading}
                  links={relatedLinks}
                  rentalsHref={cityRentalsHref}
                  rentalsLabel={isEs ? `Ver rentas en ${cityName}` : `Browse ${cityName} rentals`}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}

// ── Helpers ────────────────────────────────────────────────

function defaultSteps(cityName: string, isEs = false) {
  if (isEs) return [
    { num: 1, icon: <StepIcon num={1} />, title: 'Consulta gratuita', desc: `Revisamos tu propiedad en ${cityName} y enviamos una proyección realista de ingresos — sin compromiso.` },
    { num: 2, icon: <StepIcon num={2} />, title: 'Fotografía y anuncio', desc: 'Fotografía profesional y anuncio en múltiples plataformas en 5–7 días.' },
    { num: 3, icon: <StepIcon num={3} />, title: 'Precio dinámico y reservas', desc: 'Optimización de tarifas en tiempo real. Gestionamos cada consulta, filtrado y reserva.' },
    { num: 4, icon: <StepIcon num={4} />, title: 'Cobras mensualmente', desc: 'Depósitos mensuales en tu cuenta. Transparencia total en tu portal de propietario.' },
  ]
  return [
    { num: 1, icon: <StepIcon num={1} />, title: 'Free consultation', desc: `We review your ${cityName} property and send a realistic revenue forecast — no obligation.` },
    { num: 2, icon: <StepIcon num={2} />, title: 'Photography & listing', desc: `Professional photography and live multi-platform listing within 5–7 days.` },
    { num: 3, icon: <StepIcon num={3} />, title: 'Dynamic pricing & bookings', desc: `Real-time rate optimization. We handle every inquiry, screening, and booking.` },
    { num: 4, icon: <StepIcon num={4} />, title: 'You collect monthly', desc: 'Monthly deposits to your account. Full transparency via your owner portal.' },
  ]
}

function StepIcon({ num }: { num: number }) {
  const icons: Record<number, React.ReactNode> = {
    1: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a2 2 0 012-2z"/></svg>,
    2: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    3: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    4: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1"/></svg>,
  }
  return <>{icons[num] ?? <svg width="22" height="22" />}</>
}

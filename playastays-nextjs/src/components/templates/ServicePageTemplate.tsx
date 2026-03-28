// ============================================================
// ServicePageTemplate — server component
// One template drives all 42 city-service pages.
// Service type is detected from service.meta.ps_service_slug.
// Content differences are purely data-driven — no branching HTML.
// ============================================================

import Link from 'next/link'
import type { City, Service, FAQ, Testimonial } from '@/types'
import type { Locale } from '@/lib/i18n'
import { SERVICE_SLUG_EN_TO_ES } from '@/lib/i18n'
import { Hero } from '@/components/hero/Hero'
import {
  TrustBar, StepsGrid, NeighborhoodList, CaseStats,
  OwnerBanner, CtaStrip, InternalLinks, SvcList,
} from '@/components/sections'
import { PricingGrid, type PricingPlan } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { TestimonialCard } from '@/components/content/Cards'
import { LeadForm } from '@/components/forms/LeadForm'
import { serviceSchema } from '@/lib/seo'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { TrustStack } from '@/components/trust/TrustStack'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'

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
  const headline  = isEs && meta.ps_hero_headline_es   ? meta.ps_hero_headline_es   : (meta.ps_hero_headline || service.title.rendered)
  const subhead   = isEs && meta.ps_hero_subheadline_es ? meta.ps_hero_subheadline_es : (meta.ps_hero_subheadline || service.excerpt.rendered.replace(/<[^>]*>/g, ''))
  const content   = isEs && meta.ps_content_es          ? meta.ps_content_es          : service.content.rendered
  const faqItems  = faqs.map(f => ({
    question: isEs && f.meta.ps_question_es ? f.meta.ps_question_es : f.title.rendered,
    answer:   isEs && f.meta.ps_answer_es   ? f.meta.ps_answer_es   : f.meta.ps_answer,
  }))

  // Locale-correct hrefs
  const base        = isEs ? '/es' : ''
  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const cityHref    = `${base}/${citySlug}/`
  const esServiceSlug = SERVICE_SLUG_EN_TO_ES[svcSlug] ?? svcSlug
  const pricingHref  = isEs
    ? `/es/${citySlug}/costo-administracion-propiedades/`
    : `/${citySlug}/property-management-cost/`
  const rentalsHref  = isEs ? '/es/rentas/' : '/rentals/'
  const investHref   = `${base}/${citySlug}/${isEs ? 'propiedades-de-inversion' : 'investment-property'}/`
  const pmHref       = `${base}/${citySlug}/${isEs ? 'administracion-de-propiedades' : 'property-management'}/`
  const keepRentHref = pmHref

  const schema = serviceSchema(service, city, faqs)

  const relatedLinks = relatedServices.map(s => ({
    label: isEs ? `${s.title.rendered} en ${cityName}` : `${s.title.rendered} in ${cityName}`,
    href:  isEs
      ? `/es/${citySlug}/${SERVICE_SLUG_EN_TO_ES[s.meta.ps_service_slug] ?? s.meta.ps_service_slug}/`
      : `/${citySlug}/${s.meta.ps_service_slug}/`,
  }))

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
        breadcrumbs={[
          { label: isEs ? 'Inicio' : 'Home', href: isEs ? '/es/' : '/' },
          { label: cityName, href: cityHref },
          { label: headline, href: null },
        ]}
        tag={`${headline} · ${cityName}`}
        headline={headline}
        sub={subhead}
        stats={computed.stats}
        primaryCta={{
          label: meta.ps_cta_primary_text || (isEs ? 'Obtener estimado gratis' : 'Get Free Revenue Estimate'),
          href:  meta.ps_cta_primary_url  || '#estimate-form',
        }}
        secondaryCta={{ label: isEs ? `Hub ${cityName}` : `${cityName} Hub`, href: cityHref }}
        formSlot={isOwner ? (
          <LeadForm
            variant="dark"
            city={cityName}
            source={`${citySlug}-${svcSlug}`}
            title={isEs ? `Estimado gratis · ${cityName}` : `Free estimate · ${cityName}`}
            subtitle={isEs ? 'Sin compromiso. Respondemos en 24 horas.' : 'No commitment required. Our local team responds within 24 hours.'}
            locale={locale}
          />
        ) : null}
      />

      {/* TRUST BAR */}
      <TrustBar stats={isEs ? [
        { val: '200+', key: 'Propiedades administradas' },
        { val: '4.9★', key: 'Satisfacción del propietario' },
        { val: '20%+', key: 'Aumento de ingresos' },
        { val: '24/7', key: 'Soporte local' },
        { val: 'ES/EN', key: 'Equipo bilingüe' },
      ] : [
        { val: '200+', key: 'Properties managed' },
        { val: '4.9★', key: 'Owner satisfaction' },
        { val: '20%+', key: 'Revenue uplift' },
        { val: '24/7', key: 'Local support' },
        { val: 'ES/EN', key: 'Bilingual team' },
      ]} />

      {/* ── SECTION GROUPS BY SERVICE TYPE ── */}

      {/* Property Management & Airbnb Management */}
      {(svcSlug === 'property-management' || svcSlug === 'airbnb-management') && (
        <>
          <StepsGrid
            eyebrow={isEs ? 'Cómo funciona' : 'How It Works'}
            headline={isEs ? 'Del anuncio a los ingresos en 7 días' : 'From listing to revenue in 7 days'}
            body={isEs ? `Nuestro proceso de gestión en ${cityName} es sistemático y comprobado.` : `Our ${cityName} management process is systematic and proven.`}
            steps={steps}
          />

          <section className="pad-lg bg-ivory">
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
              <div>
                <div className="eyebrow mb-8">{cityName} Neighborhoods</div>
                <h2 className="section-title mt-12 mb-24" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                  Where we manage properties
                </h2>
                <p className="body-text mb-24">
                  PlayaStays manages properties across all major neighborhoods in {cityName}.
                  Our local team knows the micro-market dynamics of each area.
                </p>
                <NeighborhoodList
                  neighborhoods={city.ps_computed.neighborhoods}
                  cityName={cityName}
                />
                <div style={{ marginTop: 24 }}>
                  <Link href={`/${citySlug}/investment-property/`} className="btn btn-ghost">
                    {cityName} Investment Guide →
                  </Link>
                </div>
              </div>
              <CaseStats
                eyebrow={`Real Numbers · ${cityName}`}
                headline={`${cityName} portfolio performance`}
                stats={[
                  { val: city.meta.ps_avg_occupancy,      key: 'Avg. occupancy' },
                  { val: city.meta.ps_avg_nightly,        key: 'Nightly rate range' },
                  { val: '4.9★',                          key: 'Guest rating' },
                  { val: '0 hrs',                         key: 'Owner time/month' },
                ]}
                cta={{ label: 'Get Free Revenue Estimate →', href: '/list-your-property/' }}
              />
            </div>
          </section>
        </>
      )}

      {/* Pricing — PM and Airbnb management only */}
      {hasPricing && (
        <>
          <PricingGrid
            eyebrow={isEs ? 'Planes de Administración' : 'Management Plans'}
            headline={isEs ? 'Elige tu plan' : 'Choose your plan'}
            body={isEs ? 'Todos los planes son basados en desempeño — ganamos cuando tú ganas.' : 'All plans are performance-based — we earn when you earn.'}
            plans={pricingPlans}
          />
          {/* Deep-dive pricing link */}
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
                    {isEs ? `¿Quieres un desglose completo de precios para ${cityName}?` : `Want a full pricing breakdown for ${cityName}?`}
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

      {/* Investment Property */}
      {svcSlug === 'investment-property' && (
        <section className="pad-lg bg-sand">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">{cityName} Investment Analysis</div>
              <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                The {cityName} investment case
              </h2>
              <p className="body-text mb-16">{city.meta.ps_market_note}</p>
              <p className="body-text mb-16"><strong>Best suited for:</strong> {city.meta.ps_best_for}</p>
              <p className="body-text mb-32"><strong>Peak season:</strong> {city.meta.ps_peak_season}</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 16 }}>
                Top neighborhoods for investment
              </h3>
              <NeighborhoodList neighborhoods={city.ps_computed.neighborhoods} cityName={cityName} />
            </div>
            <CaseStats
              eyebrow={`${cityName} Market Data`}
              headline="Performance benchmarks"
              stats={[
                { val: city.meta.ps_avg_nightly,        key: 'Nightly rate range' },
                { val: city.meta.ps_avg_occupancy,      key: 'Occupancy range' },
                { val: city.meta.ps_avg_monthly_income, key: 'Monthly income range' },
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
                <strong>Consider keeping if:</strong> Your {cityName} property earns{' '}
                {city.meta.ps_avg_monthly_income} monthly and you don't need the capital.
                Appreciation and rental income make holding compelling.
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
              <p className="body-text mb-24">{city.meta.ps_market_note}</p>
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
            eyebrow={isEs ? `¿Tienes propiedad en ${cityName}?` : `Own property in ${cityName}?`}
            headline={isEs ? `Propiedades en ${cityName} generan ${city.meta.ps_avg_monthly_income} al mes con PlayaStays` : `${cityName} properties earn ${city.meta.ps_avg_monthly_income} monthly under PlayaStays management`}
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

      {/* ── PERFORMANCE PROOF (PM + Airbnb pages only) ── */}
      {(svcSlug === 'property-management' || svcSlug === 'airbnb-management') && (
        <PerformanceProof
          stats={FALLBACK_PORTFOLIO_STATS}
          cityName={cityName}
          locale={locale}
          estimateHref={estimateHref}
        />
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="pad-lg bg-deep">
          <div className="container">
            <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: 32 }}>
              What {cityName} owners say
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {testimonials.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* FAQ + Related Links sidebar */}
      {faqs.length > 0 && (
        <section className="pad-lg bg-sand">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            <FaqAccordion
              eyebrow={isEs ? 'Preguntas frecuentes' : 'Common Questions'}
              headline="FAQ"
              items={faqItems}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'var(--white)', borderRadius: 'var(--r-lg)', padding: 28, border: '1px solid var(--sand-dark)', boxShadow: 'var(--sh-sm)' }}>
                <TrustStack locale={locale} variant="row" theme="light" />
                <div style={{ height: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
                  {isEs ? '¿Listo para comenzar?' : 'Ready to get started?'}
                </h3>
                <p className="body-sm mb-20">
                  {isEs ? `Sin compromiso. Nuestro equipo en ${cityName} responde en 24 horas.` : `No obligation. Our ${cityName} team responds within 24 hours.`}
                </p>
                <Link href={estimateHref} className="btn btn-coral btn-full" style={{ marginBottom: 10 }}>
                  {isEs ? 'Obtener estimado gratis →' : 'Get a Free Revenue Estimate →'}
                </Link>
                <a
                  href="https://wa.me/529841234567"
                  className="btn btn-wa btn-full"
                  target="_blank" rel="noopener"
                >
                  {isEs ? 'Chatear por WhatsApp' : 'Chat on WhatsApp'}
                </a>
              </div>
              {relatedLinks.length > 0 && (
                <InternalLinks
                  heading={isEs ? `También en ${cityName}` : `Also in ${cityName}`}
                  links={relatedLinks}
                  cityHubLabel={isEs ? `Hub de ${cityName}` : `Back to ${cityName} hub`}
                  cityHubHref={cityHref}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Pre-footer CTA */}
      <CtaStrip
        eyebrow={isEs ? `Propietarios en ${cityName}` : `${cityName} Property Owners`}
        headline={isEs ? 'Obtén un estimado de ingresos gratis — sin compromisos.' : 'Get a free rental income estimate — no commitment required.'}
        cta={{ label: isEs ? 'Obtener mi estimado →' : 'Get My Free Estimate →', href: estimateHref }}
      />
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

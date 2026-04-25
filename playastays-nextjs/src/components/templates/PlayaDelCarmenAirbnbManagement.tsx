// ============================================================
// Playa del Carmen — Airbnb / short-term management pillar
// /playa-del-carmen/airbnb-management/ · ES mirror
// Same page role as ServicePageTemplate: city × service commercial intent only.
// Hero aux links are sibling city × service routes, not parent hub replacements.
// @/content/page-roles
// ============================================================

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { City, Service, FAQ, Testimonial } from '@/types'
import type { Locale } from '@/lib/i18n'
import { SERVICE_SLUG_EN_TO_ES, serviceLabel } from '@/lib/i18n'
import { serviceHubHref } from '@/lib/service-hub-routes'
import { publicEnSlugFromPs } from '@/lib/service-url-slugs'
import { Hero } from '@/components/hero/Hero'
import { StepsGrid, InternalLinks } from '@/components/sections'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { serviceSchema } from '@/lib/seo'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'
import { limitPublicFaqs, PUBLIC_FAQ_LIMIT_CITY } from '@/lib/faq-helpers'
import {
  PLAYA_AIRBNB_COPY,
  PLAYA_AIRBNB_FALLBACK_FAQS,
  PLAYA_AIRBNB_HERO_IMAGE,
} from '@/content/service-pages/playa-del-carmen-airbnb-management'

interface PlayaDelCarmenAirbnbManagementProps {
  city: City
  service: Service
  faqs: FAQ[]
  testimonials: Testimonial[]
  relatedServices: Service[]
  locale: Locale
}

export function PlayaDelCarmenAirbnbManagement({
  city,
  service,
  faqs,
  testimonials: _testimonials,
  relatedServices,
  locale,
}: PlayaDelCarmenAirbnbManagementProps) {
  const isEs = locale === 'es'
  const t = PLAYA_AIRBNB_COPY[isEs ? 'es' : 'en']
  const cityName = city.title.rendered
  const citySlug = 'playa-del-carmen'
  const base = isEs ? '/es' : ''
  const computed = service.ps_computed

  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const contactHref = isEs ? '/es/contacto/' : '/contact/'
  const cityHubHref = `${base}/${citySlug}/`
  const cityRentalsHref = isEs ? `/es/${citySlug}/rentas/` : `/${citySlug}/rentals/`
  const pricingHref = isEs
    ? `/es/${citySlug}/costo-administracion-propiedades/`
    : `/${citySlug}/property-management-cost/`

  const pmSeg = isEs ? 'administracion-de-propiedades' : 'property-management'
  const pmHref = `${base}/${citySlug}/${pmSeg}/`
  const vrSeg = isEs ? 'gestion-rentas-vacacionales' : 'vacation-rental-management'
  const vacationHref = `${base}/${citySlug}/${vrSeg}/`

  const waHref = 'https://wa.me/529841234567'

  const parentServiceHref = serviceHubHref(locale, 'airbnb-management')
  const parentServiceLabel = isEs
    ? `Ver todas: ${serviceLabel('airbnb-management', 'es')}`
    : `View all ${serviceLabel('airbnb-management', 'en')} services`
  const parentCityLabel = isEs ? `Volver a ${cityName}` : `Back to ${cityName}`

  const faqItems = PLAYA_AIRBNB_FALLBACK_FAQS[isEs ? 'es' : 'en']

  const relatedLinks = relatedServices.map(s => {
    const pubEn = publicEnSlugFromPs(s.meta.ps_service_slug)
    return {
      label: isEs ? `${s.title.rendered} en ${cityName}` : `${s.title.rendered} in ${cityName}`,
      href: isEs ? `/es/${citySlug}/${SERVICE_SLUG_EN_TO_ES[pubEn] ?? pubEn}/` : `/${citySlug}/${pubEn}/`,
    }
  })

  const schema = serviceSchema(service, city, faqs)

  const processSteps = t.processSteps.map((s, i) => ({
    num: i + 1,
    icon: <StepIcon num={i + 1} />,
    title: s.title,
    desc: s.desc,
  }))

  const heroBg = `linear-gradient(105deg, rgba(10,43,47,0.94) 0%, rgba(10,43,47,0.78) 45%, rgba(10,43,47,0.55) 100%), url(${PLAYA_AIRBNB_HERO_IMAGE})`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section
        className="page-hero page-hero--city"
        style={{
          backgroundImage: heroBg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Hero
          variant="split"
          locale={locale}
          breadcrumbs={[
            { label: isEs ? 'Inicio' : 'Home', href: isEs ? '/es/' : '/' },
            { label: cityName, href: cityHubHref },
            { label: isEs ? 'Administración Airbnb' : 'Airbnb management', href: null },
          ]}
          tag={t.heroTag}
          headline={t.heroHeadline}
          sub={t.heroSub}
          stats={computed.stats?.length ? computed.stats : undefined}
          primaryCta={{ label: t.primaryCta, href: '#estimate-form' }}
          secondaryCta={{ label: t.secondaryCta, href: estimateHref }}
          tertiaryCta={{ label: t.tertiaryCta, href: waHref }}
          formSlot={
            <LeadForm
              variant="dark"
              city={cityName}
              source="playa-del-carmen-airbnb-management"
              title={t.formTitle}
              subtitle={t.formSubtitle}
              locale={locale}
            />
          }
        />
        <div className="container pdc-pm-hero-aux">
          <p className="pdc-pm-hero-aux__links">
            <Link href={contactHref}>{t.heroAuxSchedule.replace(' →', '')}</Link>
            <span className="pdc-pm-hero-aux__sep" aria-hidden>
              ·
            </span>
            <Link href={pmHref}>{t.heroAuxPmLink.replace(' →', '')}</Link>
            <span className="pdc-pm-hero-aux__sep" aria-hidden>
              ·
            </span>
            <Link href={vacationHref}>{t.heroAuxVacationLink.replace(' →', '')}</Link>
          </p>
        </div>
      </section>

      <section className="pad-lg bg-ivory">
        <div className="container city-hub-narrow">
          <div className="eyebrow mb-8">{t.introEyebrow}</div>
          <h2 className="section-title mt-12 mb-24">{t.introTitle}</h2>
          <div className="city-hub-prose body-text">
            {t.introBody.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="mt-24" style={{ marginBottom: 0 }}>
              <Link href={pmHref} className="btn btn-ghost btn-sm">
                {isEs ? 'Administración integral de propiedades →' : 'Explore general property management →'}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">{t.includesEyebrow}</div>
          <h2 className="section-title mt-12 mb-16">{t.includesTitle}</h2>
          <p className="body-text mb-28" style={{ maxWidth: 720 }}>
            {t.includesLead}
          </p>

          <div className="pdc-pm-value-grid">
            {t.includesItems.map((item, i) => (
              <article key={i} className="pdc-pm-value-card">
                <div className="pdc-pm-value-card__icon" aria-hidden>
                  <IncludesGlyph i={i} />
                </div>
                <h3 className="pdc-pm-value-card__title">{item.title}</h3>
                <p className="pdc-pm-value-card__desc">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="pdc-pm-bridge">
            <h3 className="pdc-pm-bridge__title">{t.pmBridgeTitle}</h3>
            <p className="pdc-pm-bridge__body">{t.pmBridgeBody}</p>
            <Link href={pmHref} className="btn btn-ghost btn-sm">
              {t.pmBridgeCta} →
            </Link>
          </div>

          <div className="pdc-pm-pricing-note">
            <p className="body-text" style={{ margin: 0 }}>
              {t.includesPricingNote}{' '}
              {t.includesPricingBeforeLinks}{' '}
              <Link href={pricingHref}>{t.includesPricingLinkLabel}</Link>
              {t.includesPricingBetweenLinks}
              {t.includesPricingAfterLinks ? ` ${t.includesPricingAfterLinks}` : ''}
            </p>
          </div>
        </div>
      </section>

      <StepsGrid
        eyebrow={t.processEyebrow}
        headline={t.processTitle}
        body={t.processBody}
        steps={processSteps}
      />

      <section className="pad-lg bg-sand">
        <div className="container city-hub-narrow">
          <div className="eyebrow mb-8">{t.nbhdEyebrow}</div>
          <h2 className="section-title mt-12 mb-16">{t.nbhdTitle}</h2>
          <p className="body-text mb-20" style={{ maxWidth: 680 }}>
            {t.nbhdIntro}
          </p>
          <p className="body-text mb-20" style={{ maxWidth: 680, color: 'var(--mid)', fontSize: '0.95rem' }}>
            {isEs
              ? 'Para el mapa de colonias y contexto de mercado, usa el hub de la ciudad.'
              : 'For the full neighborhood map and market read, use the city hub.'}
          </p>
          <Link href={`${cityHubHref}#city-neighborhoods`} className="btn btn-ghost btn-sm">
            {t.nbhdLink}
          </Link>
        </div>
      </section>

      <PerformanceProof
        stats={FALLBACK_PORTFOLIO_STATS}
        cityName={cityName}
        locale={locale}
        estimateHref={estimateHref}
      />

      <section className="pad-lg bg-sand pdc-pm-faq">
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <FaqAccordion
            eyebrow={t.faqEyebrow}
            headline={t.faqTitle}
            items={limitPublicFaqs(faqItems, PUBLIC_FAQ_LIMIT_CITY)}
          />
          {relatedLinks.length > 0 && (
            <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--sand-dark)' }}>
              <InternalLinks
                hubNavEyebrow={isEs ? 'Páginas padre' : 'Parent pages'}
                parentCityHref={cityHubHref}
                parentCityLabel={parentCityLabel}
                parentServiceHref={parentServiceHref}
                parentServiceLabel={parentServiceLabel}
                heading={isEs ? `También en ${cityName}` : `Also in ${cityName}`}
                links={relatedLinks}
                rentalsLabel={isEs ? `Ver rentas en ${cityName}` : `Browse ${cityName} rentals`}
                rentalsHref={cityRentalsHref}
              />
            </div>
          )}
        </div>
      </section>

      <section className="pad-lg bg-deep" id="pdc-airbnb-final-cta">
        <div className="container city-hub-narrow">
          <div className="eyebrow light mb-8">{t.finalEyebrow}</div>
          <h2 className="section-title light mt-12 mb-16">{t.finalTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 20, maxWidth: 560, lineHeight: 1.7 }}>{t.finalSub}</p>
          <ul className="pdc-pm-trust-list">
            {t.finalTrustPoints.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <a href="#estimate-form" className="btn btn-gold">
              {t.finalQuote}
            </a>
            <Link href={contactHref} className="btn btn-outline">
              {t.finalContact}
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <Link href={pmHref} className="btn btn-ghost btn-sm">
              {t.finalExplorePm} →
            </Link>
            <Link href={vacationHref} className="btn btn-ghost btn-sm">
              {t.finalExploreVacation} →
            </Link>
          </div>
          <a href={waHref} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
            {t.finalWhatsApp}
          </a>
        </div>
      </section>
    </>
  )
}

function StepIcon({ num }: { num: number }) {
  const icons: Record<number, ReactNode> = {
    1: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a2 2 0 012-2z"/></svg>,
    2: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/></svg>,
    3: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>,
    4: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
    5: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    6: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  }
  return <>{icons[num] ?? <svg width="22" height="22" />}</>
}

function IncludesGlyph({ i }: { i: number }) {
  const icons: ReactNode[] = [
    <svg key="0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" d="M4 6h16v12H4V6zm2 2v8h12V8H6zm2 2h8v2H8v-2z"/></svg>,
    <svg key="1" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    <svg key="2" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
    <svg key="3" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>,
    <svg key="4" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    <svg key="5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
    <svg key="6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.018c1.01.121 1.94.361 2.77.705M7 6a4 4 0 00-4 4v1a2 2 0 002 2h1.018"/></svg>,
  ]
  return <>{icons[i % icons.length]}</>
}

// ============================================================
// CityHubTemplate — local owner-intent city landing hub
// Used by: app/[city]/page.tsx, app/es/[ciudad]/page.tsx
// Routes visitors into city-scoped service pages; not a service clone.
// Section contract: @/content/page-roles (PAGE_ROLE_DOC_VERSION).
// ============================================================

import Link from 'next/link'
import type { City, Service, Property, FAQ, SiteConfig } from '@/types'
import { SERVICE_SLUG_EN_TO_ES, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero/Hero'
import { ServiceGrid } from '@/components/sections'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { cityHubSchema } from '@/lib/seo'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { getDisplayStats } from '@/lib/portfolio-stats'
import { publicEnSlugFromPs } from '@/lib/service-url-slugs'
import { getCityHubMergedContent } from '@/content/city-hubs'
import { sortCitiesForHub } from '@/lib/city-hub-sort'
import { telHref } from '@/lib/telHref'
import { SITE_WHATSAPP } from '@/lib/site-contact'
import { limitPublicFaqs, PUBLIC_FAQ_LIMIT_CITY } from '@/lib/faq-helpers'
import { getCityPricing } from '@/lib/pricing-data'

function cityServiceHref(citySlug: string, psServiceSlug: string, locale: Locale): string {
  const pubEn = publicEnSlugFromPs(psServiceSlug)
  const esSeg = SERVICE_SLUG_EN_TO_ES[pubEn] ?? pubEn
  return locale === 'es' ? `/es/${citySlug}/${esSeg}/` : `/${citySlug}/${pubEn}/`
}

function hubCopy(locale: Locale, name: string) {
  const es = locale === 'es'
  return {
    heroHeadline: es
      ? `Propietarios e inversores en <em>${name}</em>`
      : `${name} vacation rentals — <em>built for owners</em>`,
    heroSubLead: es
      ? 'Gestión local, ingresos optimizados y tranquilidad para propietarios que rentan en la Riviera Maya.'
      : 'Local management, optimized revenue, and peace of mind for owners renting in Quintana Roo.',
    marketEyebrow: es ? 'Guía del mercado' : 'Market guide',
    marketTitle: es ? `${name}: contexto para propietarios` : `${name}: what owners should know`,
    neighborhoodsEyebrow: es ? 'Zonas' : 'Areas we cover',
    neighborhoodsTitle: es ? 'Colonias y zonas donde operamos' : 'Neighborhoods we serve',
    neighborhoodsIntro: es
      ? 'Cada zona tiene dinámica de demanda y reglas distintas. Conocemos las calles, los condominios y las expectativas de huéspedes por colonia.'
      : 'Each area has different demand patterns and rules. We know the streets, condos, and guest expectations block by block.',
    servicesEyebrow: es ? 'Siguiente paso' : 'Go deeper',
    servicesTitle: es ? `Servicios locales en ${name}` : `Local services in ${name}`,
    servicesIntro: es
      ? 'Elige el servicio que coincide con tu propiedad; cada página incluye alcance e ingresos para esta ciudad.'
      : 'Pick the path that fits your property — each page spells out scope and economics for this destination.',
    whyEyebrow: es ? 'Por qué PlayaStays' : 'Why PlayaStays here',
    whyTitle: es ? `Experiencia local en ${name}` : `Local expertise in ${name}`,
    insightsEyebrow: es ? 'Contexto del mercado' : 'Market context',
    insightsTitle: es ? 'Lo que todo propietario debe considerar' : 'What every owner should plan for',
    faqEyebrow: es ? 'Dudas locales' : 'Local questions',
    faqTitle: es ? `Antes de elegir un servicio en ${name}` : `Before you pick a service in ${name}`,
    finalEyebrow: es ? 'Siguiente paso' : 'Next step',
    finalTitle: es ? 'Hablemos de tu propiedad' : "Let's talk about your property",
    finalSub: es
      ? 'Respuesta en 24 h. Sin compromiso — WhatsApp o solicitud de estimado.'
      : 'We respond within 24 hours. No obligation — WhatsApp or a free estimate request.',
    estimateCtaLabel: es ? 'Solicitar estimado gratuito →' : 'Get a free revenue estimate →',
    primaryCta: es ? 'Ir al formulario de estimado →' : 'Go to the estimate form →',
    secondaryCta: es ? `Ver servicios en ${name} ↓` : `View services in ${name} ↓`,
    tertiaryCta: es ? 'WhatsApp' : 'WhatsApp',
    crossCities: es ? 'También en la Riviera Maya' : 'Also in the Riviera Maya',
    crossTitle: es ? 'PlayaStays en Quintana Roo' : 'PlayaStays across Quintana Roo',
    crossCityIntro: es
      ? 'Explora otros mercados donde operamos en Quintana Roo: mismo equipo, operación local en cada destino.'
      : 'Explore more Quintana Roo markets where we operate—same team, local execution in each destination.',
    blogHint: es ? 'Próximamente: guías y datos del mercado en el blog.' : 'More guides & market notes on the blog soon.',
    investmentCta: es ? `Guía de inversión · ${name} →` : `${name} investment guide →`,
    pricingCta: es ? 'Ver precios de gestión →' : 'See management pricing →',
    marketOppTitle: (city: string) =>
      es ? `Oportunidad de Mercado en ${city}` : `Market Opportunity in ${city}`,
    avgNightly: es ? 'Tarifa promedio' : 'Avg nightly',
    avgOccupancy: es ? 'Ocupación promedio' : 'Avg occupancy',
    peakSeason: es ? 'Temporada alta' : 'Peak season',
    competition: es ? 'Competencia' : 'Competition',
    earningsIllustrations: es ? 'Ilustraciones de ingresos' : 'Earnings illustrations',
    withoutMgmt: es ? 'Sin gestión profesional' : 'Without professional management',
    withMgmt: es ? 'Con PlayaStays' : 'With PlayaStays',
    uplift: es ? 'Ingreso neto adicional' : 'Extra net income',
    perNight: es ? 'por noche' : 'per night',
    seeFullPricing: es ? 'Ver precios completos →' : 'See full pricing →',
  }
}

function faqItemsFromWp(faqs: FAQ[], locale: Locale): Array<{ question: string; answer: string }> {
  return faqs.map(f => {
    const m = f.meta as { ps_question_es?: string; ps_answer_es?: string; ps_answer: string }
    const q =
      locale === 'es' && m.ps_question_es
        ? m.ps_question_es
        : f.title.rendered
    const a =
      locale === 'es' && m.ps_answer_es
        ? m.ps_answer_es
        : m.ps_answer
    return { question: q, answer: a }
  })
}

interface CityHubTemplateProps {
  city: City
  services: Service[]
  allCities: City[]
  properties?: Property[]
  /** City-tagged FAQs from CMS; fallback copy used when empty */
  faqs?: FAQ[]
  /** For WhatsApp + email in CTAs */
  siteConfig?: SiteConfig
  /** Optional hero background (CMS featured image URL when available) */
  heroImageUrl?: string
  locale?: Locale
}

export function CityHubTemplate({
  city,
  services: _services,
  allCities,
  properties = [],
  faqs = [],
  siteConfig,
  heroImageUrl,
  locale = 'en',
}: CityHubTemplateProps) {
  const name = city.title.rendered
  const portfolioStats = getDisplayStats(properties, city.slug)
  const estimateHref = locale === 'es' ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const slug = city.slug
  const computed = city.ps_computed
  const sortedOtherCities = sortCitiesForHub(allCities.filter(c => c.slug !== slug))
  const t = hubCopy(locale, name)
  const merged = getCityHubMergedContent(city, locale)
  const o = heroImageUrl ? { ...merged, heroImageUrl } : merged
  const contactHref = locale === 'es' ? '/es/contacto/' : '/contact/'
  const rentalsHref = locale === 'es' ? `/es/${slug}/rentas/` : `/${slug}/rentals/`
  const market = getCityPricing(slug)
  const pricingHubHref = locale === 'es' ? '/es/precios-administracion-propiedades/' : '/property-management-pricing/'

  const wa = siteConfig?.whatsapp ?? SITE_WHATSAPP
  const waHref = `https://wa.me/${wa}`

  const serviceItems = o.services.map(s => ({
    title: s.title,
    desc: s.desc,
    href: cityServiceHref(slug, s.psServiceSlug, locale),
    ctaLabel: s.ctaLabel,
  }))

  const faqResolved = limitPublicFaqs(
    faqs.length > 0 ? faqItemsFromWp(faqs, locale) : o.faqs,
    PUBLIC_FAQ_LIMIT_CITY,
  )

  const schema = cityHubSchema(city)

  const heroSub = o.heroSub

  const heroBg = o.heroImageUrl

  const phoneLink = siteConfig?.phone ? telHref(siteConfig.phone) : undefined
  const heroPhoneCta =
    o.phoneCtaLabel && phoneLink
      ? { label: o.phoneCtaLabel, href: phoneLink }
      : undefined

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* 1. Hero — market-level H1; pathway CTAs only (@/content/page-roles) */}
      <section
        className="page-hero page-hero--city"
        style={
          heroBg
            ? {
                backgroundImage: `linear-gradient(105deg, rgba(10,43,47,0.94) 0%, rgba(10,43,47,0.75) 45%, rgba(10,43,47,0.55) 100%), url(${heroBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <Hero
          variant="split"
          locale={locale}
          breadcrumbs={[
            { label: locale === 'es' ? 'Inicio' : 'Home', href: locale === 'es' ? '/es/' : '/' },
            { label: name, href: null },
          ]}
          tag={o.heroTag ?? `${name} · Quintana Roo`}
          headline={o.heroHeadline}
          sub={heroSub}
          primaryCta={{ label: o.primaryCta, href: '#city-services' }}
          secondaryCta={{ label: o.secondaryCta, href: '#city-neighborhoods' }}
          tertiaryCta={{ label: o.tertiaryCta, href: waHref }}
          phoneCta={heroPhoneCta}
        />
      </section>

      {/* 2. Why this city matters (market context — not service+city pitch) */}
      <section className="pad-lg bg-ivory">
        <div className="container city-hub-narrow">
          <div className="eyebrow mb-8">{o.marketEyebrow ?? t.marketEyebrow}</div>
          <h2 className="section-title mt-12 mb-20">{o.marketTitle}</h2>
          <div
            className="city-hub-prose body-text"
            dangerouslySetInnerHTML={{ __html: o.marketBodyHtml.trim() }}
          />
        </div>
      </section>

      {/* 3. Neighborhoods / areas served */}
      <section id="city-neighborhoods" className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">{o.neighborhoodsEyebrow ?? t.neighborhoodsEyebrow}</div>
          <h2 className="section-title mt-12 mb-16">{o.neighborhoodsTitle}</h2>
          <p className="body-text mb-24" style={{ maxWidth: 640 }}>{o.neighborhoodsIntro}</p>
          <div className="city-neighborhood-grid">
            {o.neighborhoods.map((n, i) => (
              <article key={i} className="city-neighborhood-card">
                <h3 className="city-neighborhood-card__title">{n.name}</h3>
                <p className="city-neighborhood-card__desc">{n.desc}</p>
                <Link href={rentalsHref} className="city-neighborhood-card__link">
                  {locale === 'es' ? 'Rentas en la zona →' : 'Rentals in this area →'}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services available in this city → city × service URLs */}
      <div id="city-services">
        <ServiceGrid
          eyebrow={o.servicesEyebrow ?? t.servicesEyebrow}
          headline={o.servicesTitle}
          body={o.servicesIntro}
          items={serviceItems}
          sectionClassName="bg-ivory city-hub-service-grid"
        />
      </div>

      {/* 5. One market snapshot / proof (limited — not full commercial stack) */}
      <PerformanceProof
        stats={portfolioStats}
        cityName={name}
        locale={locale}
        estimateHref={estimateHref}
        hubSnapshot
        showEstimateCta={false}
      />

      {market && (
        <section className="pad-lg bg-ivory" id="city-market-opportunity">
          <div className="container">
            <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.5rem,2.6vw,2.1rem)' }}>
              {t.marketOppTitle(name)}
            </h2>
            <p className="body-text mb-24" style={{ maxWidth: 720, lineHeight: 1.7 }}>
              {locale === 'es' ? market.marketNoteEs : market.marketNote}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 20,
                marginBottom: 32,
                maxWidth: 880,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--light)',
                    marginBottom: 6,
                  }}
                >
                  {t.avgNightly}
                </div>
                <div className="body-text" style={{ fontWeight: 600, color: 'var(--charcoal)', margin: 0 }}>
                  {market.avgNightly}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--light)',
                    marginBottom: 6,
                  }}
                >
                  {t.avgOccupancy}
                </div>
                <div className="body-text" style={{ fontWeight: 600, color: 'var(--charcoal)', margin: 0 }}>
                  {market.avgOccupancy}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--light)',
                    marginBottom: 6,
                  }}
                >
                  {t.peakSeason}
                </div>
                <div className="body-text" style={{ fontWeight: 600, color: 'var(--charcoal)', margin: 0 }}>
                  {locale === 'es' ? market.peakSeasonEs : market.peakSeason}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--light)',
                    marginBottom: 6,
                  }}
                >
                  {t.competition}
                </div>
                <div className="body-text" style={{ fontWeight: 600, color: 'var(--charcoal)', margin: 0 }}>
                  {locale === 'es' ? market.competitionLevelEs : market.competitionLevel}
                </div>
              </div>
            </div>

            <div className="eyebrow mb-8">{t.earningsIllustrations}</div>
            <div
              className="service-cards"
              style={{ alignItems: 'stretch' }}
            >
              {market.earnings.map((ex, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--sand-dark)',
                    borderRadius: 'var(--r-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--sh-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      background: 'var(--deep)',
                      padding: '14px 20px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--white)',
                      }}
                    >
                      {locale === 'es' ? ex.typeEs : ex.type}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>
                      {ex.nightlyRange} {t.perNight}
                    </div>
                  </div>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--sand-dark)' }}>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--light)',
                        marginBottom: 6,
                      }}
                    >
                      {t.withoutMgmt}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'var(--mid)',
                      }}
                    >
                      {ex.monthlyWithout.split(' ')[0]}
                    </div>
                  </div>
                  <div style={{ padding: '14px 20px', background: 'rgba(24,104,112,0.04)', flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--teal)',
                        marginBottom: 6,
                      }}
                    >
                      {t.withMgmt}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: 'var(--teal)',
                      }}
                    >
                      {ex.monthlyWith.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--mid)', marginTop: 4 }}>{ex.managementFee}</div>
                  </div>
                  <div
                    style={{
                      padding: '10px 20px',
                      background: 'var(--gold)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--deep)' }}>
                      {t.uplift}: {ex.uplift}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <Link href={pricingHubHref} className="btn btn-gold">
                {t.seeFullPricing}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. FAQ (max 6 via PUBLIC_FAQ_LIMIT_CITY) */}
      <section className="pad-lg bg-ivory">
        <div className="container city-hub-narrow">
          <FaqAccordion items={faqResolved} eyebrow={o?.faqEyebrow ?? t.faqEyebrow} headline={o?.faqTitle ?? t.faqTitle} />
        </div>
      </section>

      {/* 7. Final CTA — pathway first, then soft conversion (no competing primary stacks) */}
      <section className="pad-lg bg-deep" id="hub-footer-cta">
        <div className="container city-hub-narrow">
          <div className="eyebrow light mb-8">{o.finalEyebrow ?? t.finalEyebrow}</div>
          <h2 className="section-title light mt-12 mb-16">{o.finalTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 24, maxWidth: 520, lineHeight: 1.65 }}>{o.finalSub}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Link href="#city-services" className="btn btn-gold">
              {o.primaryCta}
            </Link>
            <Link href="#city-neighborhoods" className="btn btn-outline">
              {o.secondaryCta}
            </Link>
            <Link href={estimateHref} className="btn btn-outline">
              {t.estimateCtaLabel}
            </Link>
            <Link href={contactHref} className="btn btn-outline">
              {locale === 'es' ? 'Agendar llamada' : 'Schedule a call'}
            </Link>
            <a href={waHref} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
              {o.tertiaryCta}
            </a>
          </div>
        </div>
      </section>

      {/* 8. Cross-city peer hubs (appendix; not a competing CTA stack) */}
      <section className="pad-md bg-ivory">
        <div className="container">
          <div className="eyebrow mb-8">{t.crossCities}</div>
          <h2 className="section-title mt-12 mb-16">{t.crossTitle}</h2>
          <p className="body-text mb-32" style={{ maxWidth: 640, color: 'var(--mid)', fontSize: '0.92rem', lineHeight: 1.65 }}>
            {o.crossCityIntro ?? t.crossCityIntro}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {sortedOtherCities.map(c => (
              <Link
                key={c.slug}
                href={locale === 'es' ? `/es/${c.slug}/` : `/${c.slug}/`}
                className="btn btn-ghost btn-sm"
              >
                {c.title.rendered}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

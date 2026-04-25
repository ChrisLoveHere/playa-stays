// ============================================================
// ServiceHubTemplate — top-level /[service]/ pages (no city)
// Shared backbone for property, Airbnb, vacation rental, sell
// Section contract: @/content/page-roles (PAGE_ROLE_DOC_VERSION).
// ============================================================

import Link from 'next/link'
import type { City, SiteConfig } from '@/types'
import type { Locale } from '@/lib/i18n'
import type { ServiceHubId } from '@/lib/service-hub-constants'
import { cityServiceHrefForHub, serviceHubHref } from '@/lib/service-hub-routes'
import { getServiceHubCopy, getServiceHubHeroImage } from '@/content/service-hubs'
import { serviceLabel } from '@/lib/i18n'
import { Hero } from '@/components/hero/Hero'
import { StepsGrid, CtaStrip } from '@/components/sections'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'
import { sortCitiesForHub } from '@/lib/city-hub-sort'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceHubPageSchema } from '@/lib/seo'
import { limitPublicFaqs, PUBLIC_FAQ_LIMIT_CITY } from '@/lib/faq-helpers'

function labelSlugForHub(hubId: ServiceHubId): string {
  return hubId === 'vacation-rental-management' ? 'vacation-rentals' : hubId
}

interface ServiceHubTemplateProps {
  hubId: ServiceHubId
  locale: Locale
  cities: City[]
  siteConfig: SiteConfig
}

function StepIcon({ num }: { num: number }) {
  return (
    <span className="pdc-pm-step-icon" aria-hidden>
      {num}
    </span>
  )
}

export function ServiceHubTemplate({ hubId, locale, cities, siteConfig }: ServiceHubTemplateProps) {
  const isEs = locale === 'es'
  const t = getServiceHubCopy(hubId, isEs ? 'es' : 'en')
  const heroImage = getServiceHubHeroImage(hubId)
  const base = isEs ? '/es' : ''
  const homeHref = isEs ? '/es/' : '/'
  const contactHref = isEs ? '/es/contacto/' : '/contact/'
  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const pricingHref = isEs ? '/es/precios-administracion-propiedades/' : '/property-management-pricing/'
  const waHref = `https://wa.me/${siteConfig.whatsapp}`

  const sorted = sortCitiesForHub(cities)

  const secondaryIsWhatsApp =
    t.secondaryCta.toLowerCase().includes('whatsapp') || t.secondaryCta === 'WhatsApp'

  const secondaryHref = (() => {
    if (secondaryIsWhatsApp) return waHref
    if (hubId === 'vacation-rental-management') return serviceHubHref(locale, 'airbnb-management')
    if (hubId === 'sell-property') return estimateHref
    return contactHref
  })()

  const relatedLinks = t.relatedHubIds.map(id => ({
    label: serviceLabel(labelSlugForHub(id), locale),
    href: serviceHubHref(locale, id),
  }))

  const processSteps = t.processSteps.map((s, i) => ({
    num: i + 1,
    icon: <StepIcon num={i + 1} />,
    title: s.title,
    desc: s.desc,
  }))

  const heroBg = `linear-gradient(105deg, rgba(10,43,47,0.94) 0%, rgba(10,43,47,0.78) 45%, rgba(10,43,47,0.55) 100%), url(${heroImage})`

  return (
    <>
      <JsonLd data={serviceHubPageSchema(hubId, isEs ? 'es' : 'en')} />
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
            { label: isEs ? 'Inicio' : 'Home', href: homeHref },
            { label: serviceLabel(labelSlugForHub(hubId), locale), href: null },
          ]}
          tag={t.heroTag}
          headline={t.heroHeadline}
          sub={t.heroSub}
          primaryCta={{ label: t.primaryCta, href: '#estimate-form' }}
          secondaryCta={
            secondaryIsWhatsApp
              ? { label: t.secondaryCta, href: waHref }
              : hubId === 'property-management'
                ? { label: t.secondaryCta, href: '#choose-city' }
                : { label: t.secondaryCta, href: contactHref }
          }
          tertiaryCta={secondaryIsWhatsApp ? { label: isEs ? 'Contacto' : 'Contact', href: contactHref } : undefined}
          formSlot={
            <LeadForm
              variant="dark"
              city="Riviera Maya"
              source={`service-hub-${hubId}`}
              title={t.formTitle}
              subtitle={t.formSubtitle}
              locale={locale}
            />
          }
        />
      </section>

      {/* What this service is — regional definition (@/content/page-roles) */}
      <section className="pad-lg bg-ivory">
        <div className="container city-hub-narrow">
          <div className="eyebrow mb-8">{t.whatEyebrow}</div>
          <h2 className="section-title mt-12 mb-24">{t.whatTitle}</h2>
          {t.whatBody.map((p, i) => (
            <p key={i} className="body-text mb-20" style={{ maxWidth: 720 }}>
              {p}
            </p>
          ))}
          {hubId === 'property-management' && (
            <p className="body-text mt-24" style={{ maxWidth: 720 }}>
              <Link href={pricingHref} className="btn btn-ghost btn-sm">
                {isEs ? 'Ver precios de administración →' : 'See management pricing →'}
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* What’s included */}
      <section className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">{t.includesEyebrow}</div>
          <h2 className="section-title mt-12 mb-16">{t.includesTitle}</h2>
          <p className="body-text mb-32" style={{ maxWidth: 720 }}>
            {t.includesLead}
          </p>
          <div className="pdc-pm-value-grid">
            {t.includesItems.map((item, i) => (
              <article key={i} className="pdc-pm-value-card">
                <h3 className="pdc-pm-value-card__title">{item.title}</h3>
                <p className="pdc-pm-value-card__desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who it helps */}
      <section className="pad-lg bg-deep" style={{ color: 'var(--white)' }}>
        <div className="container">
          <div className="eyebrow light mb-8">{t.whyEyebrow}</div>
          <h2 className="section-title light mt-12 mb-16">{t.whyTitle}</h2>
          <p className="body-text light mb-32" style={{ maxWidth: 640, opacity: 0.92 }}>
            {t.whyLead}
          </p>
          <div className="city-why-grid">
            {t.whyItems.map((item, i) => (
              <div key={i} className="city-why-card">
                <h3 className="city-why-card__title">{item.title}</h3>
                <p className="city-why-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <StepsGrid
        eyebrow={t.processEyebrow}
        headline={t.processTitle}
        body={t.processLead}
        steps={processSteps}
      />

      {/* Cities — primary: city × service; secondary: city hub (no architecture essay) */}
      <section className="pad-lg bg-ivory" id="choose-city">
        <div className="container">
          <div className="eyebrow mb-8">{t.citiesEyebrow}</div>
          <h2 className="section-title mt-12 mb-16">{t.citiesTitle}</h2>
          <p className="body-text mb-32" style={{ maxWidth: 720 }}>
            {t.citiesIntro}
          </p>
          <div className="city-neighborhood-grid">
            {sorted.map(c => {
              const localSvcHref = cityServiceHrefForHub(c.slug, hubId, locale)
              const cityHubHref = `${base}/${c.slug}/`
              const svcName = serviceLabel(labelSlugForHub(hubId), locale)
              return (
                <article key={c.slug} className="city-neighborhood-card">
                  <h3 className="city-neighborhood-card__title">{c.title.rendered}</h3>
                  <p className="city-neighborhood-card__desc">
                    {isEs
                      ? `Ejecución local y operación en ${c.title.rendered}.`
                      : `Local execution and on-the-ground operations in ${c.title.rendered}.`}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                    <Link href={localSvcHref} className="city-neighborhood-card__link">
                      {isEs ? `Ver ${svcName} · ${c.title.rendered} →` : `View ${svcName} — ${c.title.rendered} →`}
                    </Link>
                    <Link href={cityHubHref} className="btn btn-ghost btn-sm" style={{ padding: '6px 0', fontWeight: 500 }}>
                      {isEs ? `Explorar mercado de ${c.title.rendered} →` : `Explore ${c.title.rendered} market →`}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
          <p className="body-text mt-32" style={{ maxWidth: 720 }}>
            <Link href={isEs ? '/es/' : '/'} className="btn btn-ghost btn-sm">
              {isEs ? 'Volver al inicio →' : 'Back to homepage →'}
            </Link>
          </p>
        </div>
      </section>

      {/* Related services (optional; not a substitute for city cards) */}
      <section className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">{t.relatedEyebrow}</div>
          <h2 className="section-title mt-12 mb-16">{t.relatedTitle}</h2>
          <p className="body-text mb-28" style={{ maxWidth: 720 }}>
            {t.relatedIntro}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {relatedLinks.map(l => (
              <Link key={l.href} href={l.href} className="btn btn-ghost btn-sm">
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* One regional proof snapshot — before FAQ */}
      <PerformanceProof
        stats={FALLBACK_PORTFOLIO_STATS}
        cityName="Riviera Maya"
        locale={locale}
        estimateHref={estimateHref}
      />

      {/* FAQ (max 6) */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className="eyebrow mb-8">{t.faqEyebrow}</div>
          <h2 className="section-title mt-12 mb-32">{t.faqTitle}</h2>
          <FaqAccordion items={limitPublicFaqs(t.faqs, PUBLIC_FAQ_LIMIT_CITY)} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="pad-lg bg-deep" style={{ color: 'var(--white)' }} id="service-hub-footer-form">
        <div className="container">
          <div className="eyebrow light mb-8">{t.finalEyebrow}</div>
          <h2 className="section-title light mt-12 mb-16">{t.finalTitle}</h2>
          <p className="body-text light mb-32" style={{ maxWidth: 640, opacity: 0.92 }}>
            {t.finalSub}
          </p>
          <div style={{ maxWidth: 440 }}>
            <LeadForm
              variant="dark"
              city="Riviera Maya"
              source={`service-hub-${hubId}-footer`}
              title={t.formTitle}
              subtitle={t.formSubtitle}
              locale={locale}
            />
          </div>
          <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a href={waHref} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <Link href={contactHref} className="btn btn-ghost">
              {isEs ? 'Contacto' : 'Contact'}
            </Link>
            <Link href={estimateHref} className="btn btn-ghost">
              {isEs ? 'Publicar propiedad →' : 'List your property →'}
            </Link>
          </div>
        </div>
      </section>

      {hubId === 'property-management' && (
        <CtaStrip
          eyebrow={isEs ? 'Precios' : 'Pricing'}
          headline={
            isEs
              ? '¿Necesitas orientación de honorarios antes de elegir ciudad?'
              : 'Want fee ranges before you pick a city?'
          }
          cta={{
            label: isEs ? 'Ver precios de administración →' : 'See management pricing →',
            href: pricingHref,
          }}
        />
      )}
    </>
  )
}

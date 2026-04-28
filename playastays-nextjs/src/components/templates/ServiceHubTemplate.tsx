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
import { StepsGrid, CtaStrip, TrustBar } from '@/components/sections'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'
import { sortCitiesForHub } from '@/lib/city-hub-sort'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceHubPageSchema } from '@/lib/seo'
import { limitPublicFaqs, PUBLIC_FAQ_LIMIT, PUBLIC_FAQ_LIMIT_CITY } from '@/lib/faq-helpers'
import { ServiceHubCityCards } from '@/components/serviceHub/ServiceHubCityCards'
import { ReviewCard } from '@/components/social-proof/ReviewCard'

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
          primaryCta={hubId === 'property-management' ? undefined : { label: t.primaryCta, href: '#estimate-form' }}
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

      {/* Property-management anchor section: Promise + 4 visual pillars. */}
      {hubId === 'property-management' ? (
        <section className="pad-lg bg-deep" style={{ color: 'var(--white)' }}>
          <div className="container">
            <div className="eyebrow light mb-8">{t.includesEyebrow}</div>
            <h2 className="section-title light mt-12 mb-16">{t.includesTitle}</h2>
            <p className="body-text light mb-32" style={{ maxWidth: 760, opacity: 0.92, color: 'rgba(255,255,255,0.92)' }}>
              {t.includesLead}
            </p>
            <div className="pdc-pm-value-grid">
              {t.includesItems.map(item => (
                <article
                  key={item.title}
                  className="pdc-pm-value-card"
                  style={{
                    background: 'rgba(255,255,255,0.98)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      height: 160,
                      backgroundImage: `linear-gradient(to top, rgba(10,43,47,0.48), rgba(10,43,47,0.12)), url('${item.photo || '/property-care/operations.jpg'}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    aria-hidden
                  />
                  <div style={{ padding: '18px 18px 20px' }}>
                    <h3 className="pdc-pm-value-card__title">{item.title}</h3>
                    <p className="pdc-pm-value-card__desc" style={{ marginBottom: 10 }}>{item.intro || item.desc}</p>
                    {item.bullets?.length ? (
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
                        {item.bullets.map(point => (
                          <li key={point} style={{ fontSize: '0.8rem', color: 'var(--mid)', lineHeight: 1.58, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>●</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
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
      )}

      {/* Property-management founder spotlight (after Promise). */}
      {hubId === 'property-management' && (
        <section className="pad-sm" style={{ background: 'var(--gold)' }} aria-label={isEs ? 'Fundador de PlayaStays' : 'PlayaStays founder'}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div
              style={{
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '116px 1fr',
                gap: 14,
                alignItems: 'center',
                background: 'var(--deep)',
                color: 'var(--white)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--r-lg)',
                boxShadow: '0 12px 30px rgba(10,43,47,0.2)',
                padding: '16px 18px',
              }}
            >
              <div
                style={{
                  width: 116,
                  height: 116,
                  borderRadius: '999px',
                  overflow: 'hidden',
                  border: '3px solid rgba(255,255,255,0.45)',
                  background: 'var(--sand)',
                }}
              >
                <img src="/team/chris-love.jpg" alt="" width={116} height={116} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div className="eyebrow light mb-8" style={{ color: 'var(--gold)' }}>{isEs ? 'Fundador' : 'Founder'}</div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--white)' }}>Chris Love</h3>
                <p className="body-text light" style={{ margin: '4px 0 6px', fontSize: '0.84rem', opacity: 0.95 }}>
                  {isEs ? 'Fundador · PlayaStays' : 'Founder · PlayaStays'}
                </p>
                <p className="body-text light" style={{ margin: '0 0 10px', fontSize: '0.84rem', opacity: 0.95 }}>
                  {isEs
                    ? 'Hola, soy Chris — fundador de PlayaStays. Superviso personalmente cómo incorporamos a los propietarios y operamos propiedades en toda la Riviera Maya. Cada compromiso de la Promesa, cada reporte, cada relación con proveedores pasa por nuestro equipo local. Si estás considerando contratarnos para administrar tu propiedad, me gustaría escucharte directamente.'
                    : 'Hi, I\'m Chris — founder of PlayaStays. I personally oversee how we onboard owners and operate properties across the Riviera Maya. Every Promise commitment, every report, every vendor relationship runs through our local team. If you\'re considering us to manage your property, I\'d like to hear about it directly.'}
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <a href={waHref} className="btn btn-wa" target="_blank" rel="noopener noreferrer">WhatsApp Chris →</a>
                  {siteConfig.social.linkedin && (
                    <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <IconLinkedIn />
                    </a>
                  )}
                  {siteConfig.social.facebook && (
                    <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <IconFacebook />
                    </a>
                  )}
                  {siteConfig.social.instagram && (
                    <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <IconInstagram />
                    </a>
                  )}
                  <Link href={isEs ? '/es/acerca-de-playastays/' : '/about/'} className="btn btn-ghost btn-sm" style={{ padding: 0, color: 'var(--white)' }}>
                    {isEs ? 'About Chris →' : 'About Chris →'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other hubs keep the “who it helps” section. Property-management removes it. */}
      {hubId !== 'property-management' && (
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
      )}

      {/* How it works */}
      {hubId === 'property-management' ? (
        <section className="pad-lg bg-ivory">
          <div className="container">
            <div className="mb-48">
              <div className="eyebrow mb-8">{t.processEyebrow}</div>
              <h2 className="section-title">{t.processTitle}</h2>
              <p className="body-text mt-12" style={{ maxWidth: 560, opacity: 0.9 }}>{t.processLead}</p>
            </div>
            <div className="pm-steps-grid">
              {processSteps.slice(0, 4).map(s => (
                <div key={s.num} className="pm-step">
                  <div className="pm-step-num" style={{ background: 'var(--gold)', color: 'var(--deep)' }}>{s.num}</div>
                  <div className="pm-step-icon" style={{ background: 'var(--sand)', color: 'var(--deep)' }}>{s.icon}</div>
                  <div className="pm-step-title">{s.title}</div>
                  <div className="pm-step-text">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <StepsGrid
          eyebrow={t.processEyebrow}
          headline={t.processTitle}
          body={t.processLead}
          steps={processSteps}
        />
      )}

      {/* Other hubs keep existing city grid location and card style */}
      {hubId !== 'property-management' && (
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
      )}

      {/* Property-management trust row in one cohesive deep section. */}
      {hubId === 'property-management' && (
        <section className="bg-deep" style={{ color: 'var(--white)' }}>
          <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
            <div className="eyebrow light" style={{ color: 'var(--gold)' }}>
              {isEs ? 'Por qué confían los propietarios' : 'Why owners trust us'}
            </div>
          </div>
          <TrustBar
            stats={siteConfig.trust_stats.filter(s => s.key.toLowerCase() !== 'properties managed')}
            locale={locale}
            className="service-hub-trustbar"
          />
        </section>
      )}

      {/* Related services for non-property hubs. PM uses add-on packages instead. */}
      {hubId !== 'property-management' && (
        <section className="pad-lg bg-ivory">
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
      )}

      {/* Property-management add-on packages */}
      {hubId === 'property-management' && t.addOnsItems && (
        <section className="pad-lg bg-sand">
          <div className="container">
            <div className="eyebrow mb-8">{t.addOnsEyebrow}</div>
            <h2 className="section-title mt-12 mb-16">{t.addOnsTitle}</h2>
            <p className="body-text mb-32" style={{ maxWidth: 760 }}>
              {t.addOnsIntro}
            </p>
            <div className="pdc-pm-value-grid pdc-pm-value-grid--three">
              {t.addOnsItems.map(item => {
                return (
                  <a key={item.title} href="#" className="pdc-pm-value-card" style={{ overflow: 'hidden', padding: 0, textDecoration: 'none' }}>
                    <div
                      style={{
                        height: 200,
                        backgroundImage: `linear-gradient(to top, rgba(10,43,47,0.45), rgba(10,43,47,0.05)), url('${item.photo || ''}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      aria-hidden
                    />
                    <div style={{ padding: '18px 18px 20px' }}>
                      <h3 className="pdc-pm-value-card__title">{item.title}</h3>
                      <p className="pdc-pm-value-card__desc" style={{ marginBottom: 10 }}>{item.desc}</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
                        {item.bullets.map(point => (
                          <li key={point} style={{ fontSize: '0.8rem', color: 'var(--mid)', lineHeight: 1.58, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>●</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {hubId === 'property-management' && (
        <section className="pad-lg bg-white">
          <div className="container" style={{ maxWidth: 920 }}>
            <div className="eyebrow mb-8">{isEs ? 'Reseña de Google' : 'Google review'}</div>
            <ReviewCard
              platform="google"
              reviewerName={isEs ? 'Sarah M., propietaria en Playa del Carmen' : 'Sarah M., Playa del Carmen owner'}
              reviewerPhotoSrc="/reviews/google-placeholder.jpg"
              rating={5}
              reviewText={
                isEs
                  ? 'PlayaStays administra nuestro condo en Playa del Carmen desde hace más de un año. La comunicación es constante, cuando visitamos el inmueble está impecable y nuestros ingresos han crecido de forma consistente. Recomiendo mucho a Chris y su equipo.'
                  : 'PlayaStays has managed our condo in Playa del Carmen for over a year. Communication is constant, the property is always immaculate when we visit, and our income has grown steadily. Highly recommend Chris and the team.'
              }
              reviewUrl="#"
              readMoreLabel={isEs ? 'Leer reseña completa' : 'Read full review'}
            />
          </div>
        </section>
      )}

      {/* Property-management: city cards after Google review. */}
      {hubId === 'property-management' && (
        <ServiceHubCityCards locale={isEs ? 'es' : 'en'} hubSlug={hubId} cities={cities} />
      )}

      {/* Regional proof block kept for non-property hubs. */}
      {hubId !== 'property-management' && (
        <PerformanceProof
          stats={FALLBACK_PORTFOLIO_STATS}
          cityName="Riviera Maya"
          locale={locale}
          estimateHref={estimateHref}
          variant="default"
        />
      )}

      {/* FAQ (PM wrapper aligned with site-wide listing FAQ spacing pattern). */}
      <section className={hubId === 'property-management' ? 'pad-lg bg-white' : 'pad-lg bg-ivory'}>
        <div className="container" style={hubId === 'property-management' ? { maxWidth: 900, margin: '0 auto' } : undefined}>
          <FaqAccordion
            eyebrow={t.faqEyebrow}
            headline={t.faqTitle}
            items={limitPublicFaqs(
              t.faqs,
              hubId === 'property-management' ? PUBLIC_FAQ_LIMIT : PUBLIC_FAQ_LIMIT_CITY,
            )}
            twoColumn={hubId === 'property-management'}
            initialOpenIndex={hubId === 'property-management' ? null : 0}
          />
        </div>
      </section>

      {hubId === 'property-management' && (
        <section className="pad-lg bg-ivory">
          <div className="container" style={{ maxWidth: 920 }}>
            <div className="eyebrow mb-8">{isEs ? 'Reseña de Yelp' : 'Yelp review'}</div>
            <ReviewCard
              platform="yelp"
              reviewerName={isEs ? 'Michael R., propietario en Tulum' : 'Michael R., Tulum owner'}
              reviewerPhotoSrc="/reviews/yelp-placeholder.jpg"
              rating={5}
              reviewText={
                isEs
                  ? 'Tuvimos una mala experiencia con otro administrador antes de PlayaStays. Chris es directo, transparente y realmente se involucra. Nuestros reportes son detallados y el equipo resuelve cada tema sin que tengamos que intervenir.'
                  : 'We had a rough experience with another manager before PlayaStays. Chris is direct, transparent, and actually cares. Our reports are detailed and the team handles every issue without us getting involved.'
              }
              reviewUrl="#"
              readMoreLabel={isEs ? 'Leer reseña completa' : 'Read full review'}
            />
          </div>
        </section>
      )}

      {hubId === 'property-management' && (
        <CtaStrip
          eyebrow={isEs ? 'Precios' : 'Pricing'}
          headline={
            isEs
              ? 'Precios transparentes. Sin sorpresas.'
              : 'Transparent pricing. No surprise fees.'
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

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.96 1.96 0 1 0 5.3 6.9 1.96 1.96 0 0 0 5.25 3ZM20 13.4c0-3.45-1.84-5.05-4.3-5.05-1.98 0-2.87 1.09-3.37 1.86V8.5H8.95V20h3.38v-6.43c0-1.7.32-3.35 2.43-3.35 2.08 0 2.1 1.94 2.1 3.46V20H20v-6.6Z" />
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.87.24-1.46 1.48-1.46h1.58V5a21.9 21.9 0 0 0-2.3-.12c-2.27 0-3.83 1.38-3.83 3.92V11H8v3h2.37v7h3.13Z" />
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.45 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.8A2.4 2.4 0 1 0 14.4 12 2.4 2.4 0 0 0 12 9.6Z" />
    </svg>
  )
}

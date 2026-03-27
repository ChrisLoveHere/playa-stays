// ============================================================
// CityHubTemplate — server component
// Used by: app/[city]/page.tsx
// Data: City + Services[] + Cities[] (for cross-links)
// ============================================================

import Link from 'next/link'
import type { City, Service, Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero/Hero'
import { TrustBar } from '@/components/sections'
import { ServiceGrid } from '@/components/sections'
import { NeighborhoodList } from '@/components/sections'
import { OwnerBanner } from '@/components/sections'
import { CtaStrip } from '@/components/sections'
import { LeadForm } from '@/components/forms/LeadForm'
import { cityHubSchema } from '@/lib/seo'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { TrustStack } from '@/components/trust/TrustStack'
import { getDisplayStats } from '@/lib/portfolio-stats'

const SERVICE_LABEL: Record<string, string> = {
  'property-management': 'Property Management',
  'airbnb-management':   'Airbnb Management',
  'vacation-rentals':    'Vacation Rentals',
  'condos-for-rent':     'Condos for Rent',
  'beachfront-rentals':  'Beachfront Rentals',
  'investment-property': 'Investment Property',
  'sell-property':       'Sell Your Property',
}

interface CityHubTemplateProps {
  city:       City
  services:   Service[]
  allCities:  City[]
  properties?: Property[]
  locale?:    Locale
}

export function CityHubTemplate({ city, services, allCities, properties = [], locale = 'en' }: CityHubTemplateProps) {
  const name     = city.title.rendered
  const portfolioStats = getDisplayStats(properties, city.slug)
  const estimateHref   = locale === 'es' ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const slug     = city.slug
  const meta     = city.meta
  const computed = city.ps_computed
  const otherCities = allCities.filter(c => c.slug !== slug)

  // Build service card items from CMS
  const serviceItems = services.map(svc => ({
    title: `${SERVICE_LABEL[svc.meta.ps_service_slug] ?? svc.title.rendered} in ${name}`,
    desc:  svc.excerpt.rendered.replace(/<[^>]*>/g, ''),
    href:  `/${slug}/${svc.meta.ps_service_slug}/`,
  }))

  const schema = cityHubSchema(city)

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li style={{ display: 'contents' }}>
                <Link href="/">Home</Link>
                <span className="breadcrumb-sep">›</span>
              </li>
              <li style={{ display: 'contents' }}>
                <span aria-current="page">{name}</span>
              </li>
            </ol>
          </nav>

          <div className="svc-hero-grid" style={{ marginTop: 12 }}>
            {/* Left: city pitch */}
            <div>
              <div className="hero-tag fade-1">📍 {name} · Quintana Roo</div>
              <h1 className="display-title fade-2" style={{ marginBottom: 18 }}>
                {name}<br /><em>rental market</em>
              </h1>
              <p className="fade-3" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.77, maxWidth: 440, marginBottom: 28 }}>
                {meta.ps_market_note || city.excerpt.rendered.replace(/<[^>]*>/g, '')}
              </p>
              <div className="fade-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/list-your-property/" className="btn btn-gold btn-lg">Get Free Revenue Estimate</Link>
                <Link href={`/${slug}/property-management/`} className="btn btn-outline">Management Services</Link>
              </div>
              {computed.stats.length > 0 && (
                <div className="hero-inline-stats fade-5">
                  {computed.stats.map((s, i) => (
                    <div key={i}>
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-key">{s.key}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: inline form */}
            <div className="hero-form-card" id="estimate-form">
              <LeadForm
                variant="dark"
                city={name}
                source={`${slug}-hub`}
                title={`Own property in ${name}?`}
                subtitle="Get a free rental income estimate. 24-hour response, no commitment required."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <TrustBar stats={computed.stats.length ? computed.stats : [
        { val: '200+', key: 'Properties managed' },
        { val: '4.9★', key: 'Owner satisfaction' },
        { val: '20%+', key: 'Revenue uplift' },
        { val: '24/7', key: 'Local support' },
        { val: 'ES/EN', key: 'Bilingual team' },
      ]} />

      {/* Services grid */}
      <ServiceGrid
        eyebrow={`Services in ${name}`}
        headline="Everything you need — one local team"
        body={city.content.rendered.replace(/<[^>]*>/g, '').slice(0, 200)}
        items={serviceItems}
      />

      {/* Market + neighborhoods */}
      <section className="pad-lg bg-sand">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="eyebrow mb-8">{name} Market</div>
            <h2 className="section-title mt-12" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', marginBottom: 20 }}>
              Who should invest here
            </h2>
            <p className="body-text mb-16">{meta.ps_best_for}</p>
            {meta.ps_peak_season && (
              <div style={{ background: 'var(--white)', borderRadius: 'var(--r-md)', padding: 18, border: '1px solid var(--sand-dark)', marginBottom: 20 }}>
                <div className="eyebrow mid mb-8">Peak Season</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--mid)' }}>{meta.ps_peak_season}</p>
              </div>
            )}
            <Link href={`/${slug}/investment-property/`} className="btn btn-ghost">
              Investment Guide for {name} →
            </Link>
          </div>
          <div>
            <div className="eyebrow mb-8">Neighborhoods</div>
            <h2 className="section-title mt-12" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', marginBottom: 20 }}>
              Where properties perform best
            </h2>
            <NeighborhoodList neighborhoods={computed.neighborhoods} cityName={name} />
          </div>
        </div>
      </section>

      {/* Pricing callout — locale-aware link to city pricing page */}
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
                {locale === 'es'
                  ? `¿Cuánto cuesta la administración de propiedades en ${name}?`
                  : `Wondering what property management costs in ${name}?`}
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--mid)', margin: 0 }}>
                {locale === 'es'
                  ? 'Ve rangos de tarifas, ejemplos de ingresos reales y qué incluye — todo en un lugar.'
                  : "See fee ranges, real income examples, and what's included — all in one place."}
              </p>
            </div>
            <Link
              href={locale === 'es'
                ? `/${slug}/costo-administracion-propiedades/`
                : `/${slug}/property-management-cost/`}
              className="btn btn-ghost"
              style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              {locale === 'es' ? 'Ver precios de gestión →' : 'See management pricing →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <OwnerBanner
        eyebrow={`Free Revenue Estimate · ${name}`}
        headline={`Find out what your ${name} property could earn`}
        body="Based on real market data from our managed portfolio. Takes 2 minutes. No obligation."
        primaryCta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
        secondaryCta={{ label: 'How Management Works', href: `/${slug}/property-management/` }}
      />

      {/* ── PERFORMANCE PROOF ── */}
      <PerformanceProof
        stats={portfolioStats}
        cityName={name}
        locale={locale}
        estimateHref={estimateHref}
      />

      {/* ── TRUST STACK ── */}
      <section className="pad-sm bg-sand">
        <div className="container">
          <TrustStack locale={locale} variant="row" theme="light" />
        </div>
      </section>

      {/* Other cities */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className="eyebrow mb-8">Also in the Riviera Maya</div>
          <h2 className="section-title mt-12 mb-24" style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)' }}>
            PlayaStays operates across Quintana Roo
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {otherCities.map(c => (
              <Link key={c.slug} href={`/${c.slug}/`} className="btn btn-ghost btn-sm">
                {c.title.rendered}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <CtaStrip
        eyebrow={`Own property in ${name}?`}
        headline={`Get a free rental income estimate — no commitment required.`}
        cta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
      />
    </>
  )
}

// ============================================================
// /property-management-pricing/
//
// Global pricing hub (all Quintana Roo markets). City-specific
// market illustrations live on each city hub (CITY_PRICING).
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { OwnerBanner } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { FounderWidget } from '@/components/contact/FounderWidget'
import {
  getPricingPlans,
  getPricingFAQs,
  getValueItems,
  getPropertyCareDeliverables,
  CITY_PRICING,
  PRICING_HUB_PRIMARY_SLUGS,
} from '@/lib/pricing-data'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Property Management Pricing in Quintana Roo — Core, Plus & Pro',
  description:
    'Property Care ($125/mo in Core and Plus) plus a performance share: 10% on long-term lease revenue in Core, 15% on short-term revenue in Plus, and custom terms in Pro. Same structure in every PlayaStays market in Quintana Roo.',
  canonical: 'https://www.playastays.com/property-management-pricing/',
  hreflangEs: 'https://www.playastays.com/es/precios-administracion-propiedades/',
})

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How are PlayaStays property management fees structured in Quintana Roo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every plan includes a monthly Property Care component plus a plan-specific performance share. Core: $125/mo Property Care plus 10% of long-term lease revenue if applicable, without short-term rental management. Plus: $125/mo Property Care plus 15% of short-term rental revenue, our most popular tier. Pro: custom Property Care and custom revenue share, often lower monthly Property Care for large portfolios. The same plan structure applies in every market we serve in Quintana Roo.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is professional management worth the management fee in the Riviera Maya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. PlayaStays-managed properties earn 22–38% more net income than self-managed equivalents, even after the management fee, due to dynamic pricing, higher occupancy, and premium listing optimisation where short-term management applies.',
          },
        },
      ],
    },
    {
      '@type': 'Service',
      name: 'Vacation Rental Property Management — Riviera Maya & Quintana Roo',
      provider: { '@id': 'https://www.playastays.com/#org' },
      areaServed: { '@type': 'State', name: 'Quintana Roo' },
      offers: [
        { '@type': 'Offer', name: 'Core — $125/mo Property Care + 10% long-term lease revenue' },
        { '@type': 'Offer', name: 'Plus — $125/mo Property Care + 15% short-term rental revenue' },
        { '@type': 'Offer', name: 'Pro — custom Property Care + custom revenue share by portfolio' },
      ],
    },
  ],
}

export default function PricingHubPage() {
  const plans = getPricingPlans('en', 'Playa del Carmen', '/contact/')
  const faqs = getPricingFAQs('en', 'Playa del Carmen / Riviera Maya')
  const valueItems = getValueItems('en')
  const propertyCare = getPropertyCareDeliverables('en')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <section className="page-hero">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Management Pricing', href: null },
          ]} />

          <div style={{ marginTop: 12, maxWidth: 720 }}>
            <div className="hero-tag fade-1">Property Management Pricing</div>
            <h1
              className="display-title fade-2"
              style={{ fontSize: 'clamp(1.75rem,3.8vw,3.1rem)', marginBottom: 18, lineHeight: 1.08 }}
            >
              Property Management Pricing in <em>Playa del Carmen &amp; the Riviera Maya</em>
            </h1>
            <p
              className="fade-3"
              style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.77,
                maxWidth: 520,
                marginBottom: 24,
              }}
            >
              Three plan tiers. Same structure in every Quintana Roo market.
              <br />
              No long-term management contracts. Property Care is included; revenue share is performance-based on what you earn.
            </p>
            <div className="fade-4">
              <Link href="/contact/" className="btn btn-gold btn-lg">
                Talk to a local manager →
              </Link>
            </div>
            <div style={{ marginTop: 14 }} className="fade-5">
              <Link href="/property-management/" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
                See full management services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div id="management-plans">
        <PricingGrid plans={plans} />
      </div>

      <section className="pad-lg bg-sand">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 32px' }}>
            <div className="eyebrow mb-8">Every plan</div>
            <h2 className="section-title mt-12 mb-8">What&apos;s included in every plan</h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto' }}>
              Plan tiers (Core, Plus, Pro) add services and depth. The fee model does not change by city within Quintana Roo; local market context lives on each destination hub. Core is for long-term and snowbird use; Plus is when you are earning short-term rental income.
            </p>
            <p className="body-text" style={{ maxWidth: 640, margin: '16px auto 0' }}>
              We don&apos;t outsource. Our local team in the Riviera Maya delivers the operational layer across all plans.
            </p>
          </div>

          <div
            style={{
              maxWidth: 640,
              margin: '0 auto 40px',
              background: 'var(--white)',
              border: '1px solid var(--sand-dark)',
              borderRadius: 'var(--r-lg)',
              padding: '24px 28px',
            }}
          >
            <h3
              className="section-title"
              style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', marginBottom: 12, textAlign: 'left' }}
            >
              Every plan includes Property Care
            </h3>
            <p className="body-text" style={{ marginBottom: 16, textAlign: 'left' }}>
              A fixed monthly line so your home is looked after. Included value, not a hidden tax on top of your revenue share.
            </p>
            <ul style={{ margin: 0, paddingLeft: 22, color: 'var(--mid)', lineHeight: 1.75, fontSize: '0.92rem' }}>
              {propertyCare.map((line, j) => (
                <li key={j} style={{ marginBottom: 8 }}>{line}</li>
              ))}
            </ul>
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

      <FounderWidget locale="en" />

      <section className="pad-lg bg-ivory">
        <div className="container" style={{ maxWidth: 720 }}>
          <FaqAccordion
            eyebrow="Common questions"
            headline="Pricing FAQ"
            items={faqs}
          />
        </div>
      </section>

      <OwnerBanner
        eyebrow="Owners in Quintana Roo"
        headline="Questions about your property or pricing?"
        body="We respond personally — no call centre, no runaround."
        primaryCta={{ label: 'Get in touch →', href: '/contact/' }}
        secondaryCta={{ label: 'See full management services', href: '/property-management/' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className="eyebrow mb-8">Local context</div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>
            See pricing in context for your destination
          </h2>
          <p className="body-text mb-24" style={{ maxWidth: 560 }}>
            Each city hub includes market-specific rate and occupancy context, example scenarios, and the same Core / Plus / Pro structure you see here.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PRICING_HUB_PRIMARY_SLUGS.map(slug => {
              const cityData = CITY_PRICING[slug]
              if (!cityData) return null
              return (
                <Link
                  key={cityData.slug}
                  href={`/${cityData.slug}/`}
                  className="btn btn-ghost"
                >
                  {cityData.name} — destination hub →
                </Link>
              )
            })}
            <Link href="/chetumal/" className="btn btn-ghost">
              Chetumal — destination hub →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

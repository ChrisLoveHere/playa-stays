// ============================================================
// /property-management-pricing/
//
// Global pricing hub (all Quintana Roo markets). City-specific
// market illustrations live on each city hub (CITY_PRICING).
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { FounderWidget } from '@/components/contact/FounderWidget'
import { getPricingPlans, getPricingFAQs, getValueItems } from '@/lib/pricing-data'
import { PropertyCareCard } from '@/components/sections/PropertyCareCard'
import { ChannelLogoStrip } from '@/components/trust/ChannelLogoStrip'
import { StatsBanner } from '@/components/trust/StatsBanner'
import { OwnerTestimonial } from '@/components/trust/OwnerTestimonial'
import { PricingPageOwnerQuestions } from '@/components/trust/PricingPageOwnerQuestions'

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
          name: 'How much does PlayaStays charge?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Every plan includes a $125/mo Property Care fee. On top of that, CORE is 10% of long-term lease revenue when a tenant is in place; PLUS is 15% of short-term rental revenue; PRO is custom for portfolios. There are no setup fees and no long-term contracts.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is professional management worth it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "For most owners, yes. Self-managed listings typically book 60–70% as much revenue as professionally managed ones because of inconsistent guest response, undertuned pricing, and lower review velocity. Beyond revenue, the time cost is significant. PlayaStays exists to take that off your plate.",
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
  const faqs = getPricingFAQs('en')
  const valueItems = getValueItems('en')

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

      <FounderWidget locale="en" />

      <ChannelLogoStrip locale="en" />

      <section className="pad-lg bg-deep">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 32px' }}>
            <h2
              className="section-title light mt-12 mb-8"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.85rem)', textShadow: '0 1px 2px rgba(10, 43, 47, 0.15)' }}
            >
              Property Care, included in every plan
            </h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto', color: 'rgba(255, 255, 255, 0.9)' }}>
              A fixed monthly line so your home is looked after — included value, not a hidden tax on top of your revenue share.
            </p>
          </div>

          <PropertyCareCard locale="en" />
        </div>
      </section>

      <section className="pad-lg bg-gold pricing-hub-value-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 32px' }}>
            <h2
              className="section-title light mt-12 mb-8"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.85rem)', textShadow: '0 1px 2px rgba(10, 43, 47, 0.15)' }}
            >
              Active Property Management Capabilities
            </h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto', color: 'rgba(255, 255, 255, 0.9)' }}>
              Available when your property is earning short-term rental revenue (PLUS and PRO plans).
            </p>
          </div>
          <div className="service-cards pricing-hub-value-cards">
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

      <OwnerTestimonial locale="en" />

      <StatsBanner locale="en" />

      <section className="pad-lg bg-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <FaqAccordion
            headline="Pricing FAQ"
            items={faqs}
            twoColumn
            initialOpenIndex={null}
          />
        </div>
      </section>

      <PricingPageOwnerQuestions
        eyebrow="Owners in Quintana Roo"
        headline="Questions about your property or pricing?"
        body="We respond personally — no call centre, no runaround."
        primaryCta={{ label: 'Get in touch →', href: '/contact/' }}
      />
    </>
  )
}

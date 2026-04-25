// ============================================================
// /property-management-pricing/
//
// Global pricing hub (all Quintana Roo markets). City-specific
// calculators and earnings live on /[city]/property-management-cost/
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { OwnerBanner } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getPricingPlans, getPricingFAQs, getValueItems, CITY_PRICING, PRICING_HUB_PRIMARY_SLUGS } from '@/lib/pricing-data'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Property Management Pricing in Quintana Roo — Core, Plus & Pro',
  description:
    'Three plan tiers: Core (10%), Plus (15%, most popular), and Pro (custom). Same management fees in every PlayaStays market in Quintana Roo. No setup fees, no long-term contracts — performance-based revenue share.',
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
            text: 'PlayaStays offers three plan tiers: Core (10% of gross rental revenue), Plus (15%, most popular), and Pro (custom for investors and multi-property portfolios). The same fee structure applies in every market we serve in Quintana Roo. There are no setup fees or long-term contracts. Fees are performance-based — we earn when you earn.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is professional management worth the management fee in the Riviera Maya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. PlayaStays-managed properties earn 22–38% more net income than self-managed equivalents, even after the management fee, due to dynamic pricing, higher occupancy, and premium listing optimisation.',
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
        { '@type': 'Offer', name: 'Core Plan', price: '10%', priceCurrency: 'percent' },
        { '@type': 'Offer', name: 'Plus Plan', price: '15%', priceCurrency: 'percent' },
        { '@type': 'Offer', name: 'Pro Plan',  price: 'Custom', priceCurrency: 'percent' },
      ],
    },
  ],
}

export default function PricingHubPage() {
  const plans = getPricingPlans('en', 'Playa del Carmen', '/list-your-property/')
  const faqs = getPricingFAQs('en', 'Playa del Carmen / Riviera Maya')
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
              Three plan tiers. Same fees in every Quintana Roo market.
              <br />
              No setup fees. No long-term contracts. Performance-based — we earn when you earn.
            </p>
            <div className="fade-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/list-your-property/" className="btn btn-gold btn-lg">
                Get Free Revenue Estimate →
              </Link>
              <a href="https://wa.me/529841234567" className="btn btn-wa" target="_blank" rel="noopener">
                Talk to a Local Manager
              </a>
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
        <PricingGrid
          eyebrow="Management Plans"
          headline="Clear fees. No surprises."
          body="All plans are performance-based — we earn when you earn. No setup fee, no monthly retainer."
          plans={plans}
          locale="en"
        />
      </div>

      <section className="pad-lg bg-ivory">
        <div className="container" style={{ maxWidth: 720 }}>
          <FaqAccordion
            eyebrow="Common questions"
            headline="Pricing FAQ"
            items={faqs}
          />
        </div>
      </section>

      <section className="pad-lg bg-sand">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
            <div className="eyebrow mb-8">Every plan</div>
            <h2 className="section-title mt-12 mb-8">What&apos;s included in every plan</h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto' }}>
              Plan tiers (Core, Plus, Pro) add services and support depth. The fee percentage does not change by city within Quintana Roo — only the local market examples and illustrations on each destination page differ.
            </p>
            <p className="body-text" style={{ maxWidth: 640, margin: '16px auto 0' }}>
              We don&apos;t outsource. Our local team in the Riviera Maya handles the operational core across plans.
            </p>
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

      <OwnerBanner
        eyebrow="Owners in Quintana Roo"
        headline="Get a free revenue estimate for your property"
        body="Share a few details and our local team will reply with a personalised income outlook — not a generic calculator printout."
        primaryCta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
        secondaryCta={{ label: 'See full management services', href: '/property-management/' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className="eyebrow mb-8">Local context</div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>
            See pricing in context for your destination
          </h2>
          <p className="body-text mb-24" style={{ maxWidth: 560 }}>
            Each city page includes market-specific rate and occupancy context, example scenarios, and the same Core / Plus / Pro structure you see here.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PRICING_HUB_PRIMARY_SLUGS.map(slug => {
              const cityData = CITY_PRICING[slug]
              if (!cityData) return null
              return (
                <Link
                  key={cityData.slug}
                  href={`/${cityData.slug}/property-management-cost/`}
                  className="btn btn-ghost"
                >
                  {cityData.name} — local pricing →
                </Link>
              )
            })}
            <Link href="/chetumal/property-management-cost/" className="btn btn-ghost">
              Chetumal — local pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// ============================================================
// /property-management-pricing/page.tsx
//
// Global pricing hub — covers all markets, links to every
// city pricing page. Core SEO hub for high-intent searches:
//   "property management pricing Mexico"
//   "vacation rental management fees Riviera Maya"
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getCities, getFAQs, getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { TrustBar, OwnerBanner, CtaStrip } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getPricingPlans, getPricingFAQs, getValueItems, CITY_PRICING } from '@/lib/pricing-data'
import { COMPARISON_ROWS } from '@/lib/calculator-data'
import { RevenueCalculator } from '@/components/forms/RevenueCalculator'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { OwnerDashboardPreview } from '@/components/trust/OwnerDashboardPreview'
import { TransparencySection } from '@/components/trust/TransparencySection'
import { BeforeAfter } from '@/components/trust/BeforeAfter'
import { TrustStack } from '@/components/trust/TrustStack'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Property Management Pricing in Mexico — Fees & Costs | PlayaStays',
  description: 'PlayaStays charges 10–25% of gross revenue for vacation rental management in Playa del Carmen, Tulum, Akumal, and across Quintana Roo. See real income examples and what\'s included.',
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
          name: 'How much does property management cost in Mexico?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In Quintana Roo, property management fees typically range from 10% to 35% of gross rental revenue. PlayaStays charges 10–25% depending on the plan, with no setup fees or long-term contracts.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is professional management worth the fee in Playa del Carmen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. PlayaStays-managed properties earn 22–38% more net income than self-managed equivalents, even after the management fee, due to dynamic pricing, higher occupancy, and premium listing optimisation.',
          },
        },
      ],
    },
    {
      '@type': 'Service',
      name: 'Vacation Rental Property Management — Quintana Roo',
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

const TRUST_STATS = [
  { val: '200+', key: 'Properties managed' },
  { val: '4.9★', key: 'Owner satisfaction' },
  { val: '22%+', key: 'Net income uplift' },
  { val: '24/7', key: 'Local support' },
  { val: 'ES/EN', key: 'Bilingual team' },
  { val: '<5min', key: 'Guest inquiry response' },
]

export default async function PricingHubPage() {
  const { isEnabled: preview } = draftMode()
  const [cities, config] = await Promise.all([getCities(preview), getSiteConfig()])

  // Use Playa del Carmen as the representative for the hub's pricing plans + FAQs
  const plans = getPricingPlans('en', 'Playa del Carmen', '/list-your-property/')
  const faqs  = getPricingFAQs('en', 'Playa del Carmen / Riviera Maya')
  const valueItems = getValueItems('en')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Management Pricing', href: null },
          ]} />

          <div className="svc-hero-grid" style={{ marginTop: 12 }}>
            <div>
              <div className="hero-tag fade-1">💰 Property Management Pricing</div>
              <h1
                className="display-title fade-2"
                style={{ fontSize: 'clamp(2rem,4vw,3.4rem)', marginBottom: 18 }}
              >
                What Does Property Management<br /><em>Cost in Mexico?</em>
              </h1>
              <p className="fade-3" style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.77, maxWidth: 440, marginBottom: 28,
              }}>
                PlayaStays charges 10–25% of gross rental revenue — performance-based, no setup fee, no long-term contract.
                Managed properties in the Riviera Maya earn 22–38% more net income than self-managed equivalents.
              </p>
              <div className="hero-inline-stats fade-4">
                <div><div className="stat-val">10–25%</div><div className="stat-key">Management fee range</div></div>
                <div><div className="stat-val">22–38%</div><div className="stat-key">Avg. net income uplift</div></div>
                <div><div className="stat-val">$0</div><div className="stat-key">Setup fee</div></div>
              </div>
              <div className="fade-5" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
                <Link href="/list-your-property/" className="btn btn-gold btn-lg">
                  Get Free Revenue Estimate →
                </Link>
                <a href="https://wa.me/529841234567" className="btn btn-wa" target="_blank" rel="noopener">
                  💬 Talk to a Local Manager
                </a>
              </div>
              <div style={{ marginTop: 14 }}>
                <Link href="/playa-del-carmen/property-management/" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
                  See full management services →
                </Link>
              </div>
            </div>
            <div className="hero-form-card" id="estimate-form">
              <LeadForm
                variant="dark"
                source="pricing-hub-hero"
                title="Free revenue estimate"
                subtitle="Real market data. No commitment. 24-hour response."
              />
            </div>
          </div>
        </div>
      </section>

      <TrustBar stats={TRUST_STATS} />

      {/* ── PERFORMANCE PROOF ── */}
      <PerformanceProof
        stats={FALLBACK_PORTFOLIO_STATS}
        cityName="Playa del Carmen"
        locale="en"
        estimateHref="/list-your-property/"
      />

      {/* ── OWNER DASHBOARD PREVIEW ── */}
      <OwnerDashboardPreview
        locale="en"
        cityName="Playa del Carmen"
        estimateHref="/list-your-property/"
      />

      {/* ── PRICING PLANS ────────────────────────────────── */}
      <PricingGrid
        eyebrow="Management Plans"
        headline="Clear fees. No surprises."
        body="All plans are performance-based — we earn when you earn. No setup fee, no monthly retainer."
        plans={plans}
      />

      {/* ── REVENUE CALCULATOR ───────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">Free tool</div>
              <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                Estimate your Riviera Maya rental income
              </h2>
              <p className="body-text mb-24">
                Select your city and property type to see an instant revenue estimate under professional management. Adjust your nightly rate for a customised result.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Dynamic pricing lifts occupancy by 15% on average',
                  'Professional photography increases bookings up to 40%',
                  '<5 min response rate improves Airbnb search ranking',
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.83rem', color: 'var(--mid)' }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
            <RevenueCalculator
              locale="en"
              estimateHref="/list-your-property/"
            />
          </div>
        </div>
      </section>

      {/* ── MARKET COMPARISON TABLE ───────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
            <div className="eyebrow mb-8">Market by Market</div>
            <h2 className="section-title mt-12 mb-8">
              Pricing & income potential across Quintana Roo
            </h2>
            <p className="body-text">
              Every market is different. Click any city for a detailed pricing breakdown and income examples.
            </p>
          </div>

          {/* City comparison cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {Object.values(CITY_PRICING).map(cityData => (
              <Link
                key={cityData.slug}
                href={`/${cityData.slug}/property-management-cost/`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'var(--white)',
                  border: '1px solid var(--sand-dark)',
                  borderRadius: 'var(--r-lg)',
                  padding: 24,
                  transition: 'all var(--t)',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem', fontWeight: 600,
                    color: 'var(--charcoal)', marginBottom: 12,
                  }}>
                    {cityData.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Nightly rate</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--teal)' }}>{cityData.avgNightly}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Occupancy</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--teal)' }}>{cityData.avgOccupancy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Competition</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)' }}>{cityData.competitionLevel}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Management fee</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)' }}>10–25%</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.78rem', fontWeight: 600, color: 'var(--teal)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    See full pricing breakdown →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <BeforeAfter
        locale="en"
        citySlug="playa-del-carmen"
        cityName="Playa del Carmen"
        estimateHref="/list-your-property/"
      />

      {/* ── TRANSPARENCY SECTION ── */}
      <TransparencySection
        locale="en"
        estimateHref="/list-your-property/"
        cityName="Playa del Carmen"
      />

      {/* ── WHY MEXICO IS HIGH ROI ────────────────────────── */}
      <section className="pad-lg bg-sand">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="eyebrow mb-8">Why the Riviera Maya</div>
            <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Why Playa del Carmen has some of the highest vacation rental ROI in Latin America
            </h2>
            <p className="body-text mb-16">
              The Riviera Maya receives 12+ million tourists per year. Tourism infrastructure — international airports, highways, healthcare — is first-world quality. Yet property prices remain a fraction of comparable US beach markets.
            </p>
            <p className="body-text mb-16">
              A $200,000 USD 2BR condo in Playa del Carmen generating $3,500/month is an 8.4% gross yield — nearly double what equivalent properties return in Florida or Cancún hotel zones.
            </p>
            <p className="body-text mb-32">
              The structural driver is supply: construction in the best neighbourhoods is constrained by the reef, cenotes, and existing development. As demand grows, well-managed properties in prime locations continue to appreciate and earn.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '12M+ annual tourists in the Riviera Maya',
                'Three international airports within 90 minutes',
                'Mexico\'s top-ranked short-term rental market',
                '8–12% gross rental yields in prime locations',
                'Strong USD and EUR demand — pricing in hard currency',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.85rem', color: 'var(--mid)' }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-8">Global vs. Mexico comparison</div>
            <h2 className="section-title mt-12 mb-20" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Management fee benchmarks
            </h2>
            {[
              { market: 'Playa del Carmen (PlayaStays)', range: '10–25%', note: 'Local team, no outsourcing' },
              { market: 'Riviera Maya (competitors)', range: '20–35%', note: 'Market average' },
              { market: 'Florida / US beach markets', range: '20–30%', note: 'Plus setup & cleaning fees' },
              { market: 'Spanish coast (Airbnb mgmt)', range: '15–25%', note: 'Varies by operator' },
              { market: 'Bali / Southeast Asia', range: '20–30%', note: 'Plus mandatory local expenses' },
              { market: 'Dubai short-term rental mgmt', range: '15–25%', note: 'DET license required' },
            ].map((row, i) => (
              <div key={i} style={{
                padding: '13px 0',
                borderBottom: i < 5 ? '1px solid var(--sand-dark)' : 'none',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 16,
                alignItems: 'start',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 2 }}>
                    {row.market}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--light)' }}>{row.note}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem', fontWeight: 700,
                  color: i === 0 ? 'var(--teal)' : 'var(--charcoal)',
                  whiteSpace: 'nowrap',
                }}>
                  {row.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE BREAKDOWN ──────────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
            <div className="eyebrow mb-8">What your fee covers</div>
            <h2 className="section-title mt-12 mb-8">What You Get for Your Management Fee</h2>
            <p className="body-text">We don't outsource. Our local team in the Riviera Maya handles everything.</p>
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

      {/* ── TYPICAL VS PLAYASTAYS ───────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
            <div className="eyebrow mb-8">The difference</div>
            <h2 className="section-title mt-12 mb-8">Typical Property Manager vs PlayaStays</h2>
            <p className="body-text">A straightforward comparison of what we offer.</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.83rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', background: 'var(--sand)', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--mid)', borderBottom: '2px solid var(--sand-dark)' }}>Criteria</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', background: 'var(--sand)', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--mid)', borderBottom: '2px solid var(--sand-dark)' }}>Typical Manager</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', background: 'var(--deep)', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-light)', borderBottom: '2px solid var(--teal)' }}>PlayaStays</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: '12px 16px', background: 'var(--white)', borderBottom: '1px solid var(--sand-dark)', fontWeight: 600, color: 'var(--charcoal)' }}>{row.feature}</td>
                    <td style={{ padding: '12px 16px', background: 'var(--white)', borderBottom: '1px solid var(--sand-dark)', color: 'var(--mid)', textAlign: 'center' }}>{row.typical}</td>
                    <td style={{ padding: '12px 16px', background: row.highlight ? 'rgba(24,104,112,0.07)' : 'var(--white)', borderBottom: '1px solid var(--sand-dark)', color: row.highlight ? 'var(--teal)' : 'var(--charcoal)', fontWeight: row.highlight ? 700 : 500, textAlign: 'center', borderLeft: '2px solid var(--teal)' }}>{row.playastays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CITY LINKS ────────────────────────────────────── */}
      <section className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">Pricing by City</div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)' }}>
            Detailed pricing for every market
          </h2>
          <p className="body-text mb-32" style={{ maxWidth: 500 }}>
            Pricing context and income examples differ by city. Choose yours for a specific breakdown.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {Object.values(CITY_PRICING).map(cityData => (
              <Link
                key={cityData.slug}
                href={`/${cityData.slug}/property-management-cost/`}
                className="btn btn-ghost"
              >
                {cityData.name} Management Pricing →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <FaqAccordion
            eyebrow="Common questions"
            headline="Pricing FAQ"
            items={faqs}
          />
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--r-lg)',
            padding: 32,
            boxShadow: 'var(--sh-sm)',
            border: '1px solid var(--sand-dark)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem', fontWeight: 600,
              color: 'var(--charcoal)', marginBottom: 8,
            }}>
              What would your property earn?
            </h3>
            <p className="body-sm mb-20">
              Free personalised estimate based on your city, property type, and current situation. No commitment.
            </p>
            <LeadForm variant="light" source="pricing-hub-faq" />
          </div>
        </div>
      </section>

      {/* ── TRUST STACK ── */}
      <section className="pad-sm bg-ivory">
        <div className="container">
          <TrustStack locale="en" variant="grid" theme="light" />
        </div>
      </section>

      {/* ── BOTTOM LEAD CAPTURE ──────────────────────────── */}
      <section className="pad-lg bg-sand" id="get-estimate">
        <div className="container" style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="eyebrow mb-8">Personalised estimate</div>
            <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              What would your property earn?
            </h2>
            <p className="body-text">
              Our local team will review your specific property and send a real income projection — not a generic estimate — within 24 hours.
            </p>
          </div>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-lg)', padding: 40, boxShadow: 'var(--sh-md)', border: '1px solid var(--sand-dark)' }}>
            <LeadForm
              variant="light"
              source="pricing-hub-bottom"
              title="Get Free Revenue Estimate"
              subtitle="No commitment. Response within 24 hours."
            />
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Ready to start?"
        headline="Get a free revenue estimate — no commitment, no sales pitch."
        cta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
      />
    </>
  )
}

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
import { getCitiesForNavigation, getFAQs, getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { TrustBar, OwnerBanner, CtaStrip } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getPricingPlans, getPricingFAQs, getValueItems, CITY_PRICING, PRICING_HUB_PRIMARY_SLUGS } from '@/lib/pricing-data'
import { ComparisonTable } from '@/components/content/ComparisonTable'
import { RevenueCalculator } from '@/components/forms/RevenueCalculator'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { OwnerDashboardPreview } from '@/components/trust/OwnerDashboardPreview'
import { TransparencySection } from '@/components/trust/TransparencySection'
import { BeforeAfter } from '@/components/trust/BeforeAfter'
import { TrustStack } from '@/components/trust/TrustStack'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Property Management Pricing in Playa del Carmen & the Riviera Maya — Fees & Calculator',
  description:
    'Transparent vacation rental management fees (10–25% of gross revenue) across Playa del Carmen, Tulum, Puerto Morelos, Akumal, Xpu-Ha, Cozumel, Isla Mujeres, and Quintana Roo. Compare markets, use the calculator, and see local income examples.',
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
          name: 'How much does vacation rental management cost in the Riviera Maya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Across Quintana Roo resort markets, property management fees typically range from 10% to 35% of gross rental revenue. PlayaStays charges 10–25% depending on the plan and property, with no setup fees or long-term contracts. Fees are performance-based — we earn when you earn.',
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

const TRUST_STATS = [
  { val: '4.9★', key: 'Owner satisfaction' },
  { val: '22%+', key: 'Net income uplift' },
  { val: '24/7', key: 'Local support' },
  { val: 'ES/EN', key: 'Bilingual team' },
]

export default async function PricingHubPage() {
  const { isEnabled: preview } = draftMode()
    const [cities, config] = await Promise.all([getCitiesForNavigation(preview), getSiteConfig()])

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
                style={{ fontSize: 'clamp(1.75rem,3.8vw,3.1rem)', marginBottom: 18, lineHeight: 1.08 }}
              >
                Property Management Pricing in<br /><em>Playa del Carmen &amp; the Riviera Maya</em>
              </h1>
              <p className="fade-3" style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.77, maxWidth: 480, marginBottom: 28,
              }}>
                Fees vary by market — even within Quintana Roo. PlayaStays charges 10–25% of gross rental revenue (performance-based, no setup fee, no long-term contract).
                Jump to the <a href="#revenue-calculator" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>calculator</a>,{' '}
                <a href="#choose-your-market" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>your market</a>, or{' '}
                <a href="#management-plans" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>plan tiers</a> — then open a local page for full context.
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
                <Link href="/property-management/" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
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

      <TrustBar stats={TRUST_STATS} locale="en" />

      {/* ── PRICING SUMMARY (quick orientation) ───────────── */}
      <section className="pad-sm bg-ivory" id="pricing-summary">
        <div className="container" style={{ maxWidth: 920 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            alignItems: 'center',
          }}>
            <div>
              <div className="eyebrow mb-8">How PlayaStays charges</div>
              <p className="body-text" style={{ marginBottom: 0 }}>
                <strong>10–25%</strong> of gross rental revenue — performance-based, no setup fee, no long-term contract. Same band across Quintana Roo;{' '}
                <Link href="#management-plans" style={{ color: 'var(--teal)', fontWeight: 600 }}>Core / Plus / Pro</Link>{' '}
                tiers reflect service depth, not a hidden markup by city.
              </p>
            </div>
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--sand-dark)',
              borderRadius: 'var(--r-lg)',
              padding: '18px 22px',
              fontSize: '0.88rem',
              color: 'var(--mid)',
              lineHeight: 1.65,
            }}>
              <strong style={{ color: 'var(--charcoal)' }}>What changes by market:</strong> achievable ADR and occupancy, guest logistics, turnover intensity, and competition — not the integrity of the fee model.
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW PRICING DIFFERS (local proof, short) ─────── */}
      <section className="pad-sm bg-sand">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="eyebrow mb-8">Riviera Maya &amp; Quintana Roo</div>
          <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.45rem,2.6vw,2rem)' }}>
            How pricing differs by market
          </h2>
          <p className="body-text mb-24" style={{ maxWidth: 720 }}>
            PlayaStays uses one transparent performance-based structure everywhere we operate — but <strong>your</strong> net outcome depends on local demand, seasonality, and how much operational work your property needs. City pages exist so you can self-select the market that matches your home instead of relying on a single generic &ldquo;Mexico&rdquo; average.
          </p>
          <ul className="pricing-hub-market-diff-list">
            <li><strong>Playa del Carmen</strong> — deep listing pool, strong ADR bands in prime zones; fees reward listing quality and fast operations.</li>
            <li><strong>Tulum</strong> — wide nightly variance and sharper seasonality; distribution and positioning matter as much as the rate.</li>
            <li><strong>Puerto Morelos</strong> — quieter strip, repeat-guest dynamics; consistency beats chasing volume.</li>
            <li><strong>Akumal &amp; Xpu-Ha</strong> — lower supply / different inventory mix (beach condos through large villas); workload scales with home size and guest expectations.</li>
            <li><strong>Cozumel &amp; Isla Mujeres</strong> — island logistics (ferry timing, arrivals, salt exposure); guest messaging and turnovers carry more friction than many mainland condos.</li>
          </ul>
        </div>
      </section>

      {/* ── REVENUE CALCULATOR (moved up) ─────────────────── */}
      <section className="pad-lg bg-ivory" id="revenue-calculator">
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

      {/* ── PRICING BY MARKET (prominent) ─────────────────── */}
      <section className="pad-lg bg-ivory" id="choose-your-market">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 40px' }}>
            <div className="eyebrow mb-8">Choose your market</div>
            <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.65rem,2.8vw,2.35rem)' }}>
              Compare local management pricing &amp; income ranges
            </h2>
            <p className="body-text">
              Every destination below has a dedicated breakdown: what drives fees there, occupancy and ADR context, and example scenarios — so you are not guessing from generic &ldquo;Mexico&rdquo; averages.
            </p>
          </div>
          <div className="pricing-hub-market-grid">
            {PRICING_HUB_PRIMARY_SLUGS.map(slug => {
              const cityData = CITY_PRICING[slug]
              if (!cityData) return null
              return (
                <Link
                  key={cityData.slug}
                  href={`/${cityData.slug}/property-management-cost/`}
                  className="pricing-hub-market-card"
                >
                  <div className="pricing-hub-market-card-inner">
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
                      See full local pricing breakdown →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <p className="body-sm" style={{ textAlign: 'center', marginTop: 28, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', color: 'var(--light)' }}>
            Looking for{' '}
            <Link href="/chetumal/property-management-cost/" style={{ color: 'var(--teal)', fontWeight: 600 }}>
              Chetumal
            </Link>
            ? It follows a different demand profile than the resort strip — we keep a separate local breakdown there.
          </p>
        </div>
      </section>

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
      <div id="management-plans">
        <PricingGrid
          eyebrow="Management Plans"
          headline="Clear fees. No surprises."
          body="All plans are performance-based — we earn when you earn. No setup fee, no monthly retainer."
          plans={plans}
        />
      </div>

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
          <ComparisonTable locale="en" />
        </div>
      </section>

      {/* ── CITY LINKS (quick index) ─────────────────────── */}
      <section className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">Local pricing pages</div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)' }}>
            Jump to a city breakdown
          </h2>
          <p className="body-text mb-16" style={{ maxWidth: 520 }}>
            Open the market that matches your property — each page explains local ADR and occupancy context, fee drivers, and example scenarios.
          </p>
          <p className="body-sm mb-32" style={{ maxWidth: 520, color: 'var(--light)' }}>
            Want the full card view with occupancy and rate snapshots?{' '}
            <a href="#choose-your-market" style={{ color: 'var(--teal)', fontWeight: 600 }}>
              Back to Choose your market
            </a>
            {' '}near the top of this hub.
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
                  {cityData.name} →
                </Link>
              )
            })}
            <Link href="/chetumal/property-management-cost/" className="btn btn-ghost">
              Chetumal (regional gateway) →
            </Link>
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

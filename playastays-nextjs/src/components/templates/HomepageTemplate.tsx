// ============================================================
// HomepageTemplate — server component
// Owner-first homepage. All content from WP via props.
// No hardcoded strings except structural labels.
// ============================================================

import Link from 'next/link'
import type { City, Service, Testimonial, BlogPost, SiteConfig, FAQ } from '@/types'
import { TrustBar, ServiceGrid, OwnerBanner, CtaStrip } from '@/components/sections'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { PropertyGrid, TestimonialCard, BlogCard } from '@/components/content/Cards'
import { LeadForm } from '@/components/forms/LeadForm'
import { CustomerSegmentationCards } from '@/components/home/CustomerSegmentationCards'
import type { Property } from '@/types'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { BeforeAfter } from '@/components/trust/BeforeAfter'
import { ActivityFeed } from '@/components/trust/ActivityFeed'
import { TrustStack } from '@/components/trust/TrustStack'
import { getDisplayStats } from '@/lib/portfolio-stats'

interface HomepageTemplateProps {
  config:       SiteConfig
  cities:       City[]
  services:     Service[]
  properties:   Property[]
  testimonials: Testimonial[]
  posts:        BlogPost[]
  faqs:         FAQ[]
  locale?:      import('@/lib/i18n').Locale
}

export function HomepageTemplate({
  config, cities, services, properties, testimonials, posts, faqs,
  locale = 'en',
}: HomepageTemplateProps) {
  const isEs         = locale === 'es'
  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const portfolioStats = getDisplayStats(properties)

  const heroTag = isEs
    ? '✦ Líder en administración de rentas — Playa del Carmen'
    : "✦ Playa del Carmen's #1 Property Manager"
  const heroSub = isEs
    ? 'Administración de rentas vacacionales de punta a punta: operamos el día a día, tú recibes los ingresos.'
    : 'Full-service vacation rental management in Playa del Carmen — we run operations, you collect the revenue.'
  const primaryCtaLabel = isEs ? 'Solicita un Estimado Gratuito' : 'Get Free Estimate'
  const primaryCtaHref  = isEs ? '/es/contacto/' : '/contact/'
  const secondaryCtaLabel = isEs ? 'Explorar Rentas' : 'Browse Rentals'
  const secondaryCtaHref  = isEs ? '/es/rentas/' : '/rentals/'

  // Map WP services to ServiceGrid items
  const serviceItems = services.slice(0, 6).map(s => ({
    title: s.title.rendered,
    desc:  s.excerpt.rendered.replace(/<[^>]*>/g, ''),
    href:  `/playa-del-carmen/${s.meta.ps_service_slug}/`,
  }))

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-left" />
          <div className="hero-bg-right">
            {/* Background slides — injected at build; static images in /public */}
            <div className="hero-slide active" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80')" }} />
            <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80')" }} />
            <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80')" }} />
          </div>
        </div>

        <div
          className="hero-content"
          style={{ gridTemplateColumns: 'minmax(0, 1fr)', maxWidth: 680 }}
        >
          <div>
            <div className="hero-tag fade-1">{heroTag}</div>
            <h1 className="display-title fade-2" style={{ marginBottom: 18 }}>
              {isEs ? (
                <>Maximiza tus <em>ingresos por renta</em> en el paraíso</>
              ) : (
                <>Maximize your <em>rental income</em> in paradise</>
              )}
            </h1>
            <p className="hero-sub fade-3">{heroSub}</p>
            <div className="hero-btns fade-4">
              <Link href={primaryCtaHref} className="btn btn-gold btn-lg">
                {primaryCtaLabel}
              </Link>
              <Link href={secondaryCtaHref} className="btn btn-outline">
                {secondaryCtaLabel}
              </Link>
            </div>
            <div className="hero-trust-row fade-5">
              {config.trust_stats.slice(0, 4).map((s, i) => (
                <div key={i} className="hero-trust-item">
                  <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)' }}>
                    {s.val} — {s.key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CustomerSegmentationCards locale={locale} />

      {/* ── TRUST BAR ── */}
      <TrustBar stats={config.trust_stats} locale={locale} />

      {/* ── SERVICES ── */}
      <ServiceGrid
        eyebrow="Full-Service Management"
        headline="We do everything. You earn more."
        body="From the moment a guest books to the moment they leave — our local team in Playa del Carmen handles it all."
        items={serviceItems}
      />

      {/* ── CITIES ── */}
      <section className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">Where We Operate</div>
          <h2 className="section-title mt-12 mb-8">
            Across Quintana Roo
          </h2>
          <p className="body-text mb-40" style={{ maxWidth: 560 }}>
            PlayaStays manages vacation rental properties across 6 cities in Quintana Roo.
            One team. One standard. Wherever your property is.
          </p>
          <div className="service-cards">
            {cities.map(city => (
              <Link
                key={city.slug}
                href={`/${city.slug}/`}
                className="service-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="service-card-title">{city.title.rendered}</div>
                <div className="service-card-text">
                  {city.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 110)}…
                </div>
                <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 600 }}>
                  {city.meta.ps_avg_nightly} avg/night · {city.meta.ps_avg_occupancy} occupancy
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MID-PAGE CTA ── */}
      <OwnerBanner
        eyebrow="Free Revenue Estimate"
        headline="Find out what your property could earn"
        body="Takes 2 minutes. Based on real market data. No obligation — just a clear picture of your income potential."
        primaryCta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
        secondaryCta={{ label: 'How It Works', href: '/playa-del-carmen/property-management/' }}
      />

      {/* ── PROPERTIES ── */}
      {properties.length > 0 && (
        <section className="pad-lg bg-ivory">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="eyebrow mb-8">Our Portfolio</div>
                <h2 className="section-title mt-8">Properties We Manage</h2>
                <p className="body-text mt-8" style={{ maxWidth: 460 }}>
                  Every property on PlayaStays is personally managed by our local team.
                </p>
              </div>
              <Link href="/rentals/" className="btn btn-ghost">Browse All Rentals</Link>
            </div>
            <PropertyGrid properties={properties} />
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="pad-lg bg-deep">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>
              <div>
                <div className="eyebrow" style={{ color: 'var(--gold-light)' }}>Why Property Owners Choose Us</div>
                <h2 className="section-title light mt-12 mb-32">
                  Local expertise.<br /><em style={{ color: 'var(--gold-light)' }}>Better results.</em>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {testimonials.slice(0, 2).map(t => (
                    <TestimonialCard key={t.id} testimonial={t} />
                  ))}
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ color: 'var(--gold)' }}>Real Owner. Real Numbers.</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--white)', margin: '10px 0 20px' }}>
                  Before vs. after PlayaStays
                </h3>
                <div className="case-stats">
                  <div className="case-stat"><div className="case-stat-val">+$2,500</div><div className="case-stat-key">Extra monthly income</div></div>
                  <div className="case-stat"><div className="case-stat-val">89%</div><div className="case-stat-key">Occupancy (was 61%)</div></div>
                  <div className="case-stat"><div className="case-stat-val">4.98★</div><div className="case-stat-key">Guest rating</div></div>
                  <div className="case-stat"><div className="case-stat-val">0 hrs</div><div className="case-stat-key">Owner time/month</div></div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Link href="/list-your-property/" className="btn btn-gold">Get a Free Revenue Estimate →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PERFORMANCE PROOF ── */}
      <PerformanceProof
        stats={portfolioStats}
        cityName="Playa del Carmen"
        locale={locale}
        estimateHref={estimateHref}
      />

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="pad-lg bg-ivory">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">Common Questions</div>
              <h2 className="section-title mt-12 mb-40" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                FAQ
              </h2>
              <FaqAccordion
                items={faqs.map(f => ({
                  question: f.title.rendered,
                  answer: f.meta.ps_answer,
                }))}
              />
            </div>
            <div style={{ background: 'var(--white)', borderRadius: 'var(--r-lg)', padding: 32, boxShadow: 'var(--sh-sm)', border: '1px solid var(--sand-dark)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
                Ready to start earning more?
              </h3>
              <p className="body-sm mb-20">
                Schedule a free 20-minute call. We'll review your property, give you a realistic revenue estimate, and explain exactly how we work.
              </p>
              <LeadForm variant="light" source="homepage-faq" />
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING CALLOUT ── */}
      <section className="pad-lg bg-sand">
        <div className="container">
          {/* Header with conversion hook */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'end', marginBottom: 40, flexWrap: 'wrap' }}>
            <div>
              <div className="eyebrow mb-8">
                {locale === 'es' ? 'Precios de Administración' : 'Management Pricing'}
              </div>
              <h2 className="section-title mt-12 mb-8">
                {locale === 'es'
                  ? '¿Cuánto cuesta la administración de propiedades?'
                  : 'What does property management cost?'}
              </h2>
              <p className="body-text" style={{ maxWidth: 520 }}>
                {locale === 'es'
                  ? 'PlayaStays cobra entre el 10% y el 25% — sin cuota de inicio, basado en desempeño. Las propiedades gestionadas generan en promedio un 22–38% más de ingresos netos. Elige tu ciudad para ver ejemplos reales.'
                  : 'PlayaStays charges 10–25% — no setup fee, performance-based. Managed properties earn 22–38% more net income on average. Choose your city to see real income examples.'}
              </p>
            </div>
            <a
              href={locale === 'es' ? '/es/precios-administracion-propiedades/' : '/property-management-pricing/'}
              className="btn btn-ghost"
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {locale === 'es' ? 'Ver guía completa de precios →' : 'Full pricing guide →'}
            </a>
          </div>

          {/* City cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
            {(locale === 'es'
              ? [
                  { city: 'Playa del Carmen', slug: 'playa-del-carmen', nightly: '$110–$260', occupancy: '78–88%', uplift: '+$680–$1,800/mes', href: '/es/playa-del-carmen/' },
                  { city: 'Tulum',            slug: 'tulum',            nightly: '$150–$450', occupancy: '65–82%', uplift: '+$680–$2,400/mes', href: '/es/tulum/' },
                  { city: 'Akumal',           slug: 'akumal',           nightly: '$120–$320', occupancy: '72–85%', uplift: '+$550–$1,320/mes', href: '/es/akumal/' },
                ]
              : [
                  { city: 'Playa del Carmen', slug: 'playa-del-carmen', nightly: '$110–$260', occupancy: '78–88%', uplift: '+$680–$1,800/mo', href: '/playa-del-carmen/' },
                  { city: 'Tulum',            slug: 'tulum',            nightly: '$150–$450', occupancy: '65–82%', uplift: '+$680–$2,400/mo', href: '/tulum/' },
                  { city: 'Akumal',           slug: 'akumal',           nightly: '$120–$320', occupancy: '72–85%', uplift: '+$550–$1,320/mo', href: '/akumal/' },
                ]
            ).map(item => (
              <a
                key={item.slug}
                href={item.href}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  background: 'var(--white)',
                  border: '1px solid var(--sand-dark)',
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  transition: 'all var(--t)',
                  height: '100%',
                }}>
                  <div style={{ padding: '16px 22px 12px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 10 }}>
                      {item.city}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>
                          {locale === 'es' ? 'Tarifa/noche' : 'Nightly rate'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--teal)' }}>{item.nightly}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>
                          {locale === 'es' ? 'Ocupación' : 'Occupancy'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--charcoal)' }}>{item.occupancy}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--gold)', padding: '8px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--deep)' }}>
                      {locale === 'es' ? 'Ingreso extra' : 'Extra income'}: {item.uplift}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--deep)' }}>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom link row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {(locale === 'es'
              ? ['Puerto Morelos', 'Xpu-Ha', 'Chetumal']
              : ['Puerto Morelos', 'Xpu-Ha', 'Chetumal']
            ).map((city, i) => {
              const slugs = ['puerto-morelos', 'xpu-ha', 'chetumal']
              const href = locale === 'es'
                ? `/es/${slugs[i]}/`
                : `/${slugs[i]}/`
              return (
                <a key={city} href={href} className="btn btn-ghost btn-sm">
                  {city} {locale === 'es' ? 'precios →' : 'pricing →'}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <BeforeAfter
        locale={locale}
        citySlug="playa-del-carmen"
        cityName="Playa del Carmen"
        estimateHref={estimateHref}
      />

      {/* ── ACTIVITY FEED ── */}
      <ActivityFeed locale={locale} />

      {/* ── BLOG ── */}
      {posts.length > 0 && (
        <section className="pad-lg bg-sand">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="eyebrow mb-8">Owner Insights</div>
                <h2 className="section-title mt-8">From the PlayaStays Blog</h2>
              </div>
              <Link href="/blog/" className="btn btn-ghost">All Articles</Link>
            </div>
            <div className="blog-grid">
              {posts.slice(0, 3).map(p => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST STACK ── */}
      <section className="pad-sm bg-ivory">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow mb-16">{isEs ? 'Por qué nos eligen los propietarios' : 'Why owners choose PlayaStays'}</div>
          <div style={{ marginTop: 16 }}>
            <TrustStack locale={locale} variant="grid" theme="light" />
          </div>
        </div>
      </section>

      {/* ── PRE-FOOTER CTA ── */}
      <CtaStrip
        eyebrow="Ready to start?"
        headline="Get a free revenue estimate — no commitment, no sales pitch."
        cta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
      />
    </>
  )
}

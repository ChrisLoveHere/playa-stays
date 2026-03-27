import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getFAQs, getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { TrustBar, StepsGrid, CtaStrip } from '@/components/sections'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'List Your Property | Get a Free Revenue Estimate | PlayaStays',
  description: 'List your Playa del Carmen vacation rental with PlayaStays. Get a free income estimate based on real market data. 200+ properties managed. No commitment required.',
  canonical: 'https://www.playastays.com/list-your-property/',
  hreflangEs: 'https://www.playastays.com/es/publica-tu-propiedad/',
})

export default async function ListYourPropertyPage() {
  const { isEnabled: preview } = draftMode()

  const [faqs, config] = await Promise.all([
    getFAQs({ categorySlug: 'list-your-property', preview }),
    getSiteConfig(),
  ])

  const steps = [
    {
      num: 1,
      icon: <PhoneIcon />,
      title: 'Tell us about your property',
      desc: 'Fill in the form. It takes 2 minutes. We review every submission the same day.',
    },
    {
      num: 2,
      icon: <ChartIcon />,
      title: 'We send your revenue estimate',
      desc: 'A personalised income projection based on real market data from our managed portfolio — within 24 hours.',
    },
    {
      num: 3,
      icon: <CameraIcon />,
      title: 'We set everything up',
      desc: 'Photography, listing, pricing, compliance. Live on Airbnb, VRBO, and Booking.com within 7 days.',
    },
    {
      num: 4,
      icon: <MoneyIcon />,
      title: 'You collect monthly income',
      desc: 'Monthly deposits to your account. Full transparency via your owner portal.',
    },
  ]

  return (
    <>
      <Hero
        variant="split"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'List Your Property', href: null },
        ]}
        tag="🏡 List Your Property"
        headline="Maximize your<br /><em>rental income</em><br />in paradise"
        sub="Full-service vacation rental management across the Riviera Maya. We handle everything — you collect the revenue."
        stats={config.trust_stats}
        primaryCta={{ label: 'Get Free Estimate', href: '#estimate-form' }}
        secondaryCta={{ label: 'How It Works', href: '#how-it-works' }}
        formSlot={
          <LeadForm
            variant="dark"
            source="list-your-property"
            title="Get a free revenue estimate"
            subtitle="Based on real market data. No commitment required. Response within 24 hours."
          />
        }
      />

      <TrustBar stats={config.trust_stats} />

      <StepsGrid
        eyebrow="How It Works"
        headline="From listing to revenue in 7 days"
        body="Our onboarding process is fast, systematic, and entirely hands-off for you."
        steps={steps}
      />

      {faqs.length > 0 && (
        <section className="pad-lg bg-sand" id="faq">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            <FaqAccordion
              eyebrow="Common Questions"
              headline="FAQ"
              items={faqs.map(f => ({ question: f.title.rendered, answer: f.meta.ps_answer }))}
            />
            <div style={{
              background: 'var(--white)', borderRadius: 'var(--r-lg)',
              padding: 32, boxShadow: 'var(--sh-sm)', border: '1px solid var(--sand-dark)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
                Still have questions?
              </h3>
              <p className="body-sm mb-20">
                Our team is available every day. Reach us on WhatsApp, phone, or email.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <a
                  href={`https://wa.me/${config.whatsapp}`}
                  className="btn btn-wa btn-full"
                  target="_blank" rel="noopener"
                >
                  Chat on WhatsApp
                </a>
                <a href={`tel:${config.phone.replace(/\s/g,'')}`} className="btn btn-ghost btn-full">
                  {config.phone}
                </a>
                <a href={`mailto:${config.email}`} className="btn btn-ghost btn-full">
                  {config.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaStrip
        eyebrow="Ready to start?"
        headline="Get a free revenue estimate — no commitment, no sales pitch."
        cta={{ label: 'Get My Free Estimate →', href: '#estimate-form' }}
      />
    </>
  )
}

// Icons
function PhoneIcon()  { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a2 2 0 012-2z"/></svg> }
function ChartIcon()  { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> }
function CameraIcon() { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg> }
function MoneyIcon()  { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1"/></svg> }

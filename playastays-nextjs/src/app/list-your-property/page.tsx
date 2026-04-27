import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { CtaStrip } from '@/components/sections'
import { LeadForm } from '@/components/forms/LeadForm'
import { ContactFounderWidget } from '@/components/contact/ContactFounderWidget'
import { TestimonialPlaceholder } from '@/components/contact/TestimonialPlaceholder'
import { PersonOrganizationSchema } from '@/components/seo/PersonOrganizationSchema'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'List Your Property | Get a Free Revenue Estimate | PlayaStays',
  description:
    'List your Playa del Carmen vacation rental with PlayaStays. Get a free income estimate based on real market data. No commitment required.',
  canonical: 'https://www.playastays.com/list-your-property/',
  hreflangEs: 'https://www.playastays.com/es/publica-tu-propiedad/',
})

export default async function ListYourPropertyPage() {
  const config = await getSiteConfig()

  return (
    <>
      <PersonOrganizationSchema />
      <Hero
        variant="split"
        locale="en"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'List Your Property', href: null },
        ]}
        tag="🏡 List Your Property"
        headline="Tell us about your property.<br />We'll send a <em>real revenue number</em> in 24 hours."
        sub="Full-service vacation rental management across the Riviera Maya — photography, listings, pricing, and guest operations."
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

      <section className="pad-lg bg-deep" id="how-it-works" aria-label="How it works">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto 2.5rem' }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.76)' }}>HOW IT WORKS</div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.8vw, 2.2rem)',
                fontWeight: 500,
                color: 'var(--white)',
                lineHeight: 1.2,
                margin: '0.7rem 0 0.65rem',
              }}
            >
              Three steps to hands-off.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 1.1vw, 0.98rem)',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.86)',
                margin: 0,
              }}
            >
              Our onboarding process is fast, systematic, and entirely hands-off for you.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            <StepCard
              num="1"
              title="Tell us about your property"
              body="Fill the form. Two minutes. We review every submission the same day."
            />
            <StepCard
              num="2"
              title="We send your revenue estimate"
              body="A personalized income projection based on real market data — within 24 hours."
            />
            <StepCard
              num="3"
              title="PlayaStays handles the rest"
              body="Photography, listings, pricing, compliance, guest support, cleaning. Live on Airbnb, VRBO, and Booking.com within 7 days. Monthly direct deposits."
            />
          </div>
        </div>
      </section>

      <ContactFounderWidget
        locale="en"
        heading="I personally review every property submission."
        body="Whether you have one condo in Playa or a portfolio of homes across Quintana Roo, I look at every submission within 24 hours and send back an honest revenue projection. No outsourcing, no template responses."
      />

      <TestimonialPlaceholder locale="en" headingOverride="Real owners. Real outcomes." />

      <CtaStrip
        eyebrow="Ready to start?"
        headline="Get a free revenue estimate — no commitment, no sales pitch."
        cta={{ label: 'Get My Free Estimate →', href: '#estimate-form' }}
      />
    </>
  )
}

function StepCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <article
      style={{
        background: 'var(--white)',
        border: '1px solid var(--sand-dark)',
        borderRadius: 'var(--r-lg)',
        padding: '1.35rem 1.25rem 1.2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.25rem, 7vw, 5.4rem)',
          fontWeight: 600,
          lineHeight: 1,
          color: 'var(--gold)',
          margin: '0 0 0.65rem',
        }}
      >
        {num}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--charcoal)',
          lineHeight: 1.3,
          margin: '0 0 0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.86rem',
          lineHeight: 1.6,
          color: 'var(--mid)',
          margin: 0,
        }}
      >
        {body}
      </p>
    </article>
  )
}

import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { CtaStrip } from '@/components/sections'
import { ContactLocationSection } from '@/components/contact/ContactLocationSection'
import { TestimonialPlaceholder } from '@/components/contact/TestimonialPlaceholder'
import { PersonOrganizationSchema } from '@/components/seo/PersonOrganizationSchema'
import { SmartLeadForm } from '@/components/contact/SmartLeadForm'
import { ContactMethodsGrid } from '@/components/contact/ContactMethodsGrid'
import { TeamSection } from '@/components/contact/TeamSection'
import { MobileWhatsAppSticky } from '@/components/contact/MobileWhatsAppSticky'

export const revalidate = false

export const metadata: Metadata = buildMetadata({
  title: 'Contact PlayaStays | Property Management in Playa del Carmen',
  description:
    'Get in touch with PlayaStays. WhatsApp, phone, email. Playa del Carmen\'s leading vacation rental management company.',
  canonical: 'https://www.playastays.com/contact/',
  hreflangEs: 'https://www.playastays.com/es/contacto/',
})

const LOCATION_COPY_EN = {
  eyebrow: 'Visit us',
  title: 'Our Playa del Carmen office',
  lead:
    'We’re on the ground in Zazil-ha — the same neighborhood where we manage properties. Stop by during business hours, or message us anytime.',
  mapAriaLabel: 'Map showing PlayaStays office in Playa del Carmen, Mexico',
  directionsLabel: 'Open in Google Maps →',
}

export default async function ContactPage() {
  return (
    <>
      <PersonOrganizationSchema />
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: null }]}
        tag="Get in Touch"
        headline="We're <em>local</em> and available"
        sub="Our team is based in Playa del Carmen. Reach us on WhatsApp, phone, or email — we respond the same day."
      />

      <section className="pad-lg bg-white">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 1.4rem' }}>
            <div className="eyebrow mb-8">SEND US A MESSAGE</div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.8vw, 2.35rem)',
                color: 'var(--charcoal)',
                lineHeight: 1.16,
              }}
            >
              Tell us how we can help.
            </h2>
          </div>
          <SmartLeadForm source="contact-page-smart" />
        </div>
      </section>

      <ContactMethodsGrid locale="en" />

      <TeamSection locale="en" />

      <ContactLocationSection copy={LOCATION_COPY_EN} />

      <TestimonialPlaceholder
        locale="en"
        headingOverride="Real conversations, real outcomes."
      />

      <CtaStrip
        eyebrow="Own a property in the Riviera Maya?"
        headline="Get a free rental income estimate — no commitment required."
        cta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
      />
      {/* Mobile-only WhatsApp shortcut for contact page. Desktop users use the team section's WhatsApp Chris button. */}
      <MobileWhatsAppSticky locale="en" />
    </>
  )
}

import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata, contactPageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Hero } from '@/components/hero/Hero'
import { LeadForm } from '@/components/forms/LeadForm'
import { CtaStrip } from '@/components/sections'
import { FounderWidget } from '@/components/contact/FounderWidget'
import { ContactDirectColumn } from '@/components/contact/ContactDirectColumn'
import { ContactLocationSection } from '@/components/contact/ContactLocationSection'
import { TestimonialPlaceholder } from '@/components/contact/TestimonialPlaceholder'
import { PersonOrganizationSchema } from '@/components/seo/PersonOrganizationSchema'
import styles from '@/components/contact/ContactPageLayout.module.css'

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
  const config = await getSiteConfig()

  return (
    <>
      <JsonLd data={contactPageJsonLd('en')} />
      <PersonOrganizationSchema />
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: null }]}
        tag="Get in Touch"
        headline="We're <em>local</em> and available"
        sub="Our team is based in Playa del Carmen. Reach us on WhatsApp, phone, or email — we respond the same day."
      />

      <FounderWidget
        locale="en"
        headingOverride="Talk to a real local team — not a call center."
        bodyOverride="Every message comes to me first. Whether you're an owner figuring out what to do with your property or a guest looking to book, I read every inquiry personally and route it to whoever can help fastest."
      />

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className={styles.mainGrid}>
            <div>
              <div className="eyebrow mb-8">Send us a message</div>
              <h2 className={styles.channelTitle}>Tell us how we can help.</h2>
              <LeadForm variant="light" source="contact-page" />
            </div>

            <ContactDirectColumn
              config={config}
              labels={{
                eyebrow: 'Direct contact',
                title: 'Reach us directly',
                whatsappTitle: 'WhatsApp',
                whatsappSub: 'Available 7am – 10pm · Usually replies in minutes',
                phoneSub: 'Mon – Sat 8am – 8pm MX',
                emailSub: 'Response within 24 hours',
              }}
            />
          </div>
        </div>
      </section>

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
    </>
  )
}

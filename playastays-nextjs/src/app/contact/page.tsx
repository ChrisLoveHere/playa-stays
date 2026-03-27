import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { LeadForm } from '@/components/forms/LeadForm'

export const revalidate = false

export const metadata: Metadata = buildMetadata({
  title: 'Contact PlayaStays | Property Management in Playa del Carmen',
  description: 'Get in touch with PlayaStays. WhatsApp, phone, email. Playa del Carmen\'s leading vacation rental management company.',
  canonical: 'https://www.playastays.com/contact/',
})

export default async function ContactPage() {
  const config = await getSiteConfig()

  return (
    <>
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: null }]}
        tag="Get in Touch"
        headline="We're <em>local</em> and available"
        sub="Our team is based in Playa del Carmen. Reach us on WhatsApp, phone, or email — we respond the same day."
      />

      <section className="pad-lg bg-ivory">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="eyebrow mb-8">Send Us a Message</div>
            <h2 className="section-title mt-12 mb-32" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Get a free revenue estimate
            </h2>
            <LeadForm variant="light" source="contact-page" />
          </div>

          <div>
            <div className="eyebrow mb-8">Direct Contact</div>
            <h2 className="section-title mt-12 mb-32" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Reach us directly
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank" rel="noopener"
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'var(--white)', borderRadius: 'var(--r-md)', border: '1.5px solid var(--sand-dark)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: '1.5rem' }}>💬</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--charcoal)' }}>WhatsApp</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Available 7am – 10pm · Usually replies in minutes</div>
                </div>
              </a>
              <a
                href={`tel:${config.phone.replace(/\s/g,'')}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'var(--white)', borderRadius: 'var(--r-md)', border: '1.5px solid var(--sand-dark)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: '1.5rem' }}>📞</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--charcoal)' }}>{config.phone}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Mon – Sat 8am – 8pm MX</div>
                </div>
              </a>
              <a
                href={`mailto:${config.email}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'var(--white)', borderRadius: 'var(--r-md)', border: '1.5px solid var(--sand-dark)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: '1.5rem' }}>✉️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--charcoal)' }}>{config.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Response within 24 hours</div>
                </div>
              </a>
            </div>

            <div style={{ marginTop: 28, padding: '18px 22px', background: 'var(--sand)', borderRadius: 'var(--r-md)', fontSize: '0.83rem', color: 'var(--mid)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--charcoal)' }}>Office location</strong><br />
              {config.address}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

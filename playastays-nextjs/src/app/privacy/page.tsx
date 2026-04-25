import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { SITE_CONTACT_EMAIL } from '@/lib/site-contact'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | PlayaStays',
  description:
    'How PlayaStays collects, uses, and protects personal information when you use our website and get in touch about property management in the Riviera Maya.',
  canonical: 'https://www.playastays.com/privacy/',
  hreflangEs: 'https://www.playastays.com/es/privacidad/',
})

export default function PrivacyPage() {
  const updated = '2026-04-06'

  return (
    <>
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy', href: null }]}
        tag="Legal"
        headline="Privacy <em>policy</em>"
        sub="This policy explains what we collect through this website, how we use it, and how you can reach us with questions. It is a practical summary — not a substitute for legal advice for your specific situation."
      />
      <section className="pad-lg bg-ivory">
        <div className="container trust-prose legal-section">
          <p>
            <strong>Who we are.</strong> PlayaStays operates this website to share information about vacation rental management, property management, and related services in Playa del Carmen, the Riviera Maya, and Quintana Roo. For privacy questions, contact{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            . Mailing address: Calle 34 Nte 103, Zazil-ha, 77720 Playa del Carmen, Q.R., Mexico.
          </p>

          <h2>Information we collect</h2>
          <p>
            <strong>Information you provide.</strong> When you submit a contact or lead form, we collect the fields you choose to send — commonly name, email, phone, property location or type, and message details — so we can respond. If you email or message us directly, we retain those communications as part of servicing your inquiry.
          </p>
          <p>
            <strong>Technical data.</strong> Like most websites, our hosting and infrastructure may automatically process technical information such as IP address, browser type, device type, general geographic region (e.g. country or city), referring URLs, and pages viewed. We use this to operate, secure, and improve the site.
          </p>

          <h2>How we use information</h2>
          <p>
            We use personal information to respond to inquiries, provide estimates or consultations when requested, coordinate follow-up communication, deliver or improve our services if you engage PlayaStays, and meet applicable legal or safety obligations. We do not sell your personal information as a product.
          </p>

          <h2>Lead and contact forms</h2>
          <p>
            When you submit a form, your information is delivered to our team through the site’s normal processing flow (including email or CRM-style tools our team uses to respond). Submission does not create a client relationship by itself; it starts a conversation. You can ask us to stop follow-up marketing communication at any time by replying to an email or writing to{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            .
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            The site may use cookies or similar technologies for essential functionality (for example session or security), preferences where applicable, and limited measurement to understand how pages are used. You can control or delete cookies through your browser settings; blocking some cookies may affect how certain features work.
          </p>

          <h2>Third-party services</h2>
          <p>
            We rely on common service providers to run the site and communicate with you — for example secure hosting, email delivery, form processing, analytics, or messaging integrations. Those providers process data only as needed to perform their services and under appropriate confidentiality and security expectations. Links to third-party sites (such as Airbnb or social networks) are governed by those parties’ policies.
          </p>

          <h2>Retention</h2>
          <p>
            We retain information for as long as needed to fulfill the purposes above, maintain business records, resolve disputes, and comply with legal requirements. Retention periods vary depending on the type of data and context.
          </p>

          <h2>Security</h2>
          <p>
            We take reasonable administrative and technical measures to protect information against unauthorized access, loss, or misuse. No website or email transmission is completely secure; please do not send highly sensitive information unless we have agreed on a secure channel.
          </p>

          <h2>Your choices</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, delete, or restrict certain processing of your personal information. To make a request, contact{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            . We may need to verify your identity before fulfilling certain requests.
          </p>

          <h2>Children</h2>
          <p>
            This site is intended for adults making property-related inquiries. We do not knowingly collect personal information from children.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this policy from time to time. The “Last updated” date below reflects substantive revisions when we post them.
          </p>

          <p style={{ fontSize: '0.85rem', color: 'var(--light)', marginTop: 28 }}>
            Last updated: {updated}. This page is provided for transparency and is not legal advice. For regulated or high-stakes matters, consult qualified counsel.
          </p>
          <p className="body-text" style={{ marginTop: 16 }}>
            <Link href="/contact/" className="trust-link">
              Contact PlayaStays
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

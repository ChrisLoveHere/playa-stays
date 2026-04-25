import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { SITE_CONTACT_EMAIL } from '@/lib/site-contact'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use | PlayaStays',
  description:
    'Terms governing use of the PlayaStays website: informational content, inquiries, estimates, limitations, and how to contact us.',
  canonical: 'https://www.playastays.com/terms/',
  hreflangEs: 'https://www.playastays.com/es/terminos/',
})

export default function TermsPage() {
  const updated = '2026-04-06'

  return (
    <>
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Terms', href: null }]}
        tag="Legal"
        headline="Terms of <em>use</em>"
        sub="These terms govern your use of this website. Separate written agreements apply when you formally engage PlayaStays for services."
      />
      <section className="pad-lg bg-ivory">
        <div className="container trust-prose legal-section">
          <h2>Agreement to these terms</h2>
          <p>
            By accessing or using www.playastays.com (the “Site”), you agree to these Terms of Use. If you do not agree, please do not use the Site.
          </p>

          <h2>Nature of the website</h2>
          <p>
            The Site provides general information about PlayaStays, our services, and markets we work in (including Playa del Carmen, the Riviera Maya, and Quintana Roo). Content is for informational purposes and may change without notice. Nothing on the Site is a guarantee of future performance, availability, pricing, or results for any specific property.
          </p>

          <h2>No professional advice</h2>
          <p>
            Nothing on the Site constitutes legal, tax, accounting, immigration, or investment advice. Decisions about property ownership, rental regulation, contracts, or taxes should be made with qualified professionals who understand your situation.
          </p>

          <h2>Inquiries, estimates, and consultations</h2>
          <p>
            Contact forms, estimates, and informal discussions are intended to help you evaluate whether we’re a fit. They do not create a binding service agreement until both parties have explicitly agreed in writing (or as otherwise stated in a proposal or contract we provide). Numbers, examples, or illustrations on the Site are not offers capable of acceptance by browsing alone.
          </p>

          <h2>Property information and listings</h2>
          <p>
            Where the Site describes rental properties, availability, amenities, or pricing, information may come from owners, platforms, or third parties and can change at any time. We do not warrant that all descriptive details are error-free or current. Always confirm material facts before relying on them for decisions.
          </p>

          <h2>Acceptable use</h2>
          <p>
            You agree not to misuse the Site — for example by attempting to disrupt servers, scrape content in violation of applicable terms, upload malware, or use the Site for unlawful purposes. We may suspend or block access we reasonably believe violates these rules or threatens security.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The PlayaStays name, branding, text, layout, graphics, and other content on the Site are owned by PlayaStays or its licensors. You may not copy, reproduce, distribute, or create derivative works without prior written permission, except for limited personal viewing or sharing of page links in ordinary use.
          </p>

          <h2>Third-party links</h2>
          <p>
            The Site may link to third-party websites or services (for example booking platforms or social networks). Those sites have their own terms and privacy policies; we are not responsible for their content or practices.
          </p>

          <h2>Disclaimer of warranties</h2>
          <p>
            The Site is provided “as is” and “as available.” To the fullest extent permitted by law, PlayaStays disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, PlayaStays and its founder, team, and suppliers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill, arising from your use of the Site or reliance on its content — even if we have been advised of the possibility of such damages. Our total liability for any claim arising out of or relating to the Site shall not exceed the greater of (a) the amount you paid us solely for access to the Site in the twelve months before the claim (typically zero) or (b) one hundred U.S. dollars (USD $100), except where such limitations are prohibited by applicable law.
          </p>

          <h2>Indemnity</h2>
          <p>
            You agree to defend and indemnify PlayaStays against claims arising from your misuse of the Site, your violation of these terms, or your violation of third-party rights, to the extent permitted by law.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are intended to be interpreted in a commercially reasonable way. If you access the Site from outside Mexico, you are responsible for compliance with local laws. For disputes relating solely to use of this Site (not separate service contracts), these terms are governed by the laws of Mexico, without regard to conflict-of-law principles, except where mandatory consumer protections in your country apply. Courts located in Quintana Roo, Mexico, may have jurisdiction over such disputes where permitted by law.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms periodically. Continued use of the Site after changes constitutes acceptance of the revised terms. The date below indicates the latest revision.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms:{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            , or use the options on our{' '}
            <Link href="/contact/" className="trust-link">
              contact page
            </Link>
            .
          </p>

          <p style={{ fontSize: '0.85rem', color: 'var(--light)', marginTop: 28 }}>
            Last updated: {updated}. This summary is not a substitute for legal counsel. Review with qualified advisors for your situation.
          </p>
        </div>
      </section>
    </>
  )
}

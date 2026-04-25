import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata, aboutPageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Hero } from '@/components/hero/Hero'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'About PlayaStays | Local Property & Vacation Rental Management',
  description:
    'PlayaStays supports absentee and second-home owners in Playa del Carmen and the Riviera Maya with local oversight, clear communication, and practical property management.',
  canonical: 'https://www.playastays.com/about/',
  hreflangEs: 'https://www.playastays.com/es/acerca-de-playastays/',
})

export default async function AboutPage() {
  const config = await getSiteConfig()
  const waHref = `https://wa.me/${config.whatsapp}`

  return (
    <>
      <JsonLd data={aboutPageJsonLd('/about/')} />
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: null }]}
        tag="About PlayaStays"
        headline="Local, reliable property management in <em>Playa del Carmen</em> — for owners who need peace of mind"
        sub="We help owners who are not on the ground every day: clear updates, practical operations, and someone local who can walk the property, coordinate vendors, and respond when the unexpected happens — across Playa del Carmen, the Riviera Maya, and Quintana Roo."
        primaryCta={{ href: '/list-your-property/', label: 'Request a free estimate' }}
        secondaryCta={{ href: '/contact/', label: 'Schedule a consultation' }}
        tertiaryCta={{ href: waHref, label: 'Message on WhatsApp' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Why PlayaStays exists</div>
          <h2 className="section-title mt-12 mb-24">Ownership should feel like an asset — not a second job</h2>
          <div className="body-text" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p>
              Many owners love Playa del Carmen and the Riviera Maya — but distance, time zones, and coastal wear-and-tear make “hands-off” ownership harder than it sounds. Small issues become expensive when nobody local is watching.
            </p>
            <p>
              PlayaStays exists to give foreign and absentee owners a dependable local layer: oversight you can trust, communication you can actually use, and operations that match how you want to use the property — short-term stays, longer bookings, or a thoughtful hybrid — without you having to manage every detail from abroad.
            </p>
          </div>
        </div>
      </section>

      <section className="pad-lg" style={{ background: 'var(--white)' }}>
        <div className="container trust-prose">
          <div className="eyebrow mb-8">What makes us different</div>
          <h2 className="section-title mt-12 mb-24">Local presence, practical execution</h2>
          <ul className="body-text trust-list">
            <li>
              <strong>We operate where your property is.</strong> Local walk-throughs, vendor coordination, and real-time problem-solving beat remote guesswork — especially in a coastal market with humidity, salt air, pools, and HOAs.
            </li>
            <li>
              <strong>Strategy that fits your goals.</strong> We help you think through short-term, longer-term, and hybrid approaches so the plan matches your risk tolerance, cash-flow needs, and how often you use the home.
            </li>
            <li>
              <strong>Owner visibility.</strong> You get structured updates and reporting so you know what happened, what it cost, and what comes next — without having to chase people across time zones.
            </li>
            <li>
              <strong>Coordination, not chaos.</strong> Maintenance, cleaning schedules, and HOA or building logistics are handled as part of a clear operating rhythm — so guests and residents experience consistency, and small issues are caught early.
            </li>
            <li>
              <strong>Compliance-minded operations.</strong> We work in a way that respects community rules and platform requirements; specifics depend on your building, municipality, and channels — we’ll be direct about what applies to your situation rather than making blanket promises.
            </li>
          </ul>
        </div>
      </section>

      <section className="pad-lg bg-ivory">
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Who we serve</div>
          <h2 className="section-title mt-12 mb-24">Built for owners who need structure and communication</h2>
          <ul className="body-text trust-list">
            <li>Absentee owners who need a reliable local partner</li>
            <li>Second-home owners who visit sometimes — but can’t run operations from the airport</li>
            <li>Condo investors who want professional oversight and clear reporting</li>
            <li>Villa and single-family owners who need vendor depth and higher-touch coordination</li>
            <li>Owners who value responsiveness, transparency, and a long-term working relationship</li>
          </ul>
        </div>
      </section>

      <section className="pad-lg" style={{ background: 'var(--white)' }}>
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Founder</div>
          <h2 className="section-title mt-12 mb-24">Chris Love</h2>
          <p className="body-text mb-16" style={{ color: 'var(--mid)', fontSize: '0.95rem' }}>
            Founder, PlayaStays
          </p>
          <div className="body-text" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p>
              Chris founded PlayaStays with a simple focus: owner experience, disciplined systems, and management quality rooted in the day-to-day reality of Playa del Carmen and the Riviera Maya. He has been using Airbnb since 2012, and years of travel and living across markets inform how we design communication, guest experience, and local execution.
            </p>
            <p>
              You won’t see a wall of fake bios here. Day-to-day work is handled by our <strong>local operations team in Playa del Carmen</strong> — the same people coordinating vendors, turnovers, and guest communication so owners get consistency, not promises on a slide deck.
            </p>
            <p className="mb-0">
              <strong>Office:</strong> Calle 34 Nte 103, Zazil-ha, 77720 Playa del Carmen, Q.R., Mexico ·{' '}
              <a href="tel:+529842420434" className="trust-link">
                +52 984 242 0434
              </a>
              {' · '}
              <a href="mailto:Chris@PlayaStays.com" className="trust-link">
                Chris@PlayaStays.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="pad-lg bg-ivory">
        <div className="container trust-prose">
          <div className="eyebrow mb-8">How we work with owners</div>
          <h2 className="section-title mt-12 mb-24">Values that match serious ownership</h2>
          <ul className="body-text trust-list">
            <li>
              <strong>Transparency.</strong> Clear expectations, documented decisions, and reporting you can rely on.
            </li>
            <li>
              <strong>Responsiveness.</strong> When something needs attention, you’re not left guessing whether anyone saw the message.
            </li>
            <li>
              <strong>Operational discipline.</strong> We prioritize sustainable processes — for your property, your guests, and your reputation in the building or community.
            </li>
            <li>
              <strong>Long-term partnership.</strong> We’re built for owners who want a stable manager relationship — not a revolving door of vendors and excuses.
            </li>
            <li>
              <strong>Protecting asset value.</strong> Good management is preventative: maintenance, presentation, and guest experience all affect long-term resale and rental performance.
            </li>
          </ul>
        </div>
      </section>

      <section className="pad-lg" style={{ background: 'var(--white)' }}>
        <div className="container trust-prose">
          <div className="eyebrow mb-8">What owners get from strong local management</div>
          <h2 className="section-title mt-12 mb-24">Less stress. Fewer surprises.</h2>
          <ul className="body-text trust-list">
            <li>Fewer emergency trips caused by small problems that went unnoticed</li>
            <li>Better guest and neighbor outcomes when turnovers and standards stay consistent</li>
            <li>Clearer picture of revenue, costs, and property condition over time</li>
            <li>Confidence that someone local is accountable — not an inbox abroad</li>
          </ul>
        </div>
      </section>

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div
            className="trust-cta"
            style={{
              maxWidth: 720,
              margin: '0 auto',
              padding: 'clamp(28px, 4vw, 40px)',
              borderRadius: 'var(--r-md)',
              background: 'linear-gradient(135deg, var(--deep) 0%, #0e3a40 100%)',
              color: 'rgba(255,255,255,0.92)',
              textAlign: 'center',
            }}
          >
            <h2 className="section-title mb-16" style={{ color: 'var(--white)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Tell us about your property
            </h2>
            <p className="body-text mb-28" style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Start with a free revenue estimate, book a consultation, or message us on WhatsApp — we’ll help you understand options without pressure.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/list-your-property/" className="btn btn-gold btn-lg">
                Request a free estimate
              </Link>
              <Link href="/contact/" className="btn btn-outline">
                Contact
              </Link>
              <a href={waHref} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

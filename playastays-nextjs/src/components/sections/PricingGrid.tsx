// ============================================================
// PricingGrid — server component
// Renders 3-column pricing cards from CMS-driven props.
// Matches the .pricing-card / .pricing-grid design system.
// ============================================================

import Link from 'next/link'

export interface PricingPlan {
  tier: string         // e.g. "Essential"
  name: string         // e.g. "15%" or "Launch"
  unit?: string        // e.g. "of gross revenue"
  desc: string
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
  badge?: string       // e.g. "Most Popular"
}

interface PricingGridProps {
  plans: PricingPlan[]
  eyebrow?: string
  headline?: string
  body?: string
}

export function PricingGrid({ plans, eyebrow, headline, body }: PricingGridProps) {
  return (
    <section className="pad-lg bg-sand">
      <div className="container">
        {(eyebrow || headline) && (
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 48px' }}>
            {eyebrow  && <div className="eyebrow mb-8">{eyebrow}</div>}
            {headline && <h2 className="section-title mt-12 mb-8">{headline}</h2>}
            {body     && <p className="body-text">{body}</p>}
          </div>
        )}

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`pricing-card${plan.featured ? ' featured' : ''}`}
            >
              {plan.badge && (
                <div className="pricing-badge">{plan.badge}</div>
              )}
              <div className="pricing-tier">{plan.tier}</div>
              <div className="pricing-price">{plan.name}</div>
              {plan.unit && <div className="pricing-unit">{plan.unit}</div>}
              <div className="pricing-desc">{plan.desc}</div>
              <ul className="pricing-features">
                {plan.features.map((f, fi) => (
                  <li key={fi}>{f}</li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`btn btn-full${plan.featured ? ' btn-gold' : ' btn-ghost'}`}
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

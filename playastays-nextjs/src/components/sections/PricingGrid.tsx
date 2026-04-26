// ============================================================
// PricingGrid — server component
// Renders 3-column pricing cards from CMS-driven props.
// Matches the .pricing-card / .pricing-grid design system.
// ============================================================

import Link from 'next/link'
import type { PricingPlan } from '@/types'

export type { PricingPlan } from '@/types'

interface PricingGridProps {
  plans: PricingPlan[]
  eyebrow?: string
  headline?: string
  body?: string
}

export function PricingGrid({ plans, eyebrow, headline, body }: PricingGridProps) {
  const hasIntro = Boolean(eyebrow || headline || body)

  return (
    <section className="pad-lg bg-sand">
      <div className="container">
        {hasIntro && (
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 48px' }}>
            {eyebrow  && <div className="eyebrow mb-8">{eyebrow}</div>}
            {headline && <h2 className="section-title mt-12 mb-8">{headline}</h2>}
            {body     && <p className="body-text">{body}</p>}
          </div>
        )}

        <div className="pricing-grid">
          {plans.map((plan, i) => {
            if (plan.hubFeeLayout && plan.commissionAmount != null && plan.propertyCareAddOnLine) {
              const isFeatured = plan.featured
              const isPlus = plan.tier === 'PLUS'
              const tierOnWhite = 'var(--light)'
              const tierColor = isFeatured ? 'var(--white)' : tierOnWhite
              const audienceColor = isFeatured ? 'var(--white)' : 'var(--mid)'
              const sublineColor = isFeatured ? 'var(--white)' : 'var(--light)'
              const careColor = isFeatured ? 'var(--white)' : 'var(--mid)'
              const tierSize = isPlus && isFeatured ? '1.05rem' : isPlus ? '0.9rem' : '0.82rem'
              const audSize = isPlus && isFeatured ? '1.02rem' : '0.95rem'
              return (
            <div
              key={i}
              className={`pricing-card${isFeatured ? ' featured' : ''}`}
              style={{ paddingTop: 22, paddingBottom: 26 }}
            >
              {plan.badge && (
                <div className="pricing-badge">{plan.badge}</div>
              )}
              <div
                className="pricing-tier"
                style={{
                  fontSize: tierSize,
                  fontWeight: 800,
                  letterSpacing: isPlus ? '0.1em' : '0.1em',
                  marginBottom: 10,
                  color: tierColor,
                  display: 'flex',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: isPlus ? 5 : 0,
                }}
              >
                {isPlus ? (
                  <>
                    <span>PLUS</span>
                    <span
                      style={{
                        fontSize: isFeatured ? '1.35em' : '1.2em',
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: 0,
                      }}
                      aria-hidden
                    >
                      +
                    </span>
                  </>
                ) : (
                  plan.tier
                )}
              </div>
              {plan.audience && (
                <div
                  className="pricing-hub-audience"
                  style={{
                    fontSize: audSize,
                    fontWeight: 600,
                    lineHeight: 1.45,
                    color: audienceColor,
                    marginBottom: 18,
                    minHeight: '2.5em',
                  }}
                >
                  {plan.audience}
                </div>
              )}

              <div
                className="pricing-price"
                style={{
                  fontSize: plan.tier === 'PRO'
                    ? 'clamp(2rem, 4.2vw, 2.85rem)'
                    : 'clamp(2.2rem, 4.5vw, 3rem)',
                  lineHeight: 1.05,
                  marginBottom: 6,
                }}
              >
                {plan.commissionAmount}
              </div>
              {plan.commissionLabel && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                    color: sublineColor,
                    marginBottom: 18,
                  }}
                >
                  {plan.commissionLabel}
                </div>
              )}

              <div
                style={{
                  fontSize: '0.81rem',
                  lineHeight: 1.45,
                  color: careColor,
                  marginBottom: 20,
                  paddingTop: 4,
                  borderTop: isFeatured ? '1px solid rgba(255,255,255,0.22)' : '1px solid var(--sand-dark)',
                  paddingBottom: 2,
                }}
              >
                {plan.propertyCareAddOnLine}
              </div>

              <ul className="pricing-features" style={{ marginBottom: 22, gap: 10 }}>
                {plan.features.map((f, fi) => (
                  <li
                    key={fi}
                    style={{
                      fontSize: '0.8rem',
                      lineHeight: 1.45,
                      color: isFeatured ? 'var(--white)' : undefined,
                    }}
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`btn btn-full btn-lg${isFeatured ? ' btn-gold' : ' btn-ghost'}`}
              >
                {plan.cta.label}
              </Link>
            </div>
              )
            }

            return (
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
                className={`btn btn-full btn-lg${plan.featured ? ' btn-gold' : ' btn-ghost'}`}
              >
                {plan.cta.label}
              </Link>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

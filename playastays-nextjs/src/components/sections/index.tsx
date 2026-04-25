// ============================================================
// PlayaStays — Section Components
// All server components. Receive typed props. No data fetching.
// Use global CSS classes from globals.css — no inline styles
// except for layout values that vary by instance.
// ============================================================

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { localizeTrustStatKey } from '@/lib/i18n'
import type { Stat, CtaLink, Neighborhood } from '@/types'

// ── TrustBar ──────────────────────────────────────────────

interface TrustBarProps {
  stats:  Stat[]
  locale?: Locale
  /** Optional extra class on the trust strip wrapper */
  className?: string
}

export function TrustBar({ stats, locale = 'en', className }: TrustBarProps) {
  // Split stat values that contain em-formatted suffixes
  // e.g. "4.9★" → base + suffix split for styling
  function splitStat(val: string) {
    const match = val.match(/^([^+%★/]+)(.*)$/)
    return match ? { base: match[1], suffix: match[2] } : { base: val, suffix: '' }
  }

  return (
    <div
      className={['trust-bar-shell', className].filter(Boolean).join(' ')}
      role="region"
      aria-label={locale === 'es' ? 'Indicadores de confianza' : 'Trust highlights'}
    >
      <div className="container">
        <div className="trust-bar-grid">
          {stats.map((s, i) => {
            const { base, suffix } = splitStat(String(s.val))
            return (
              <div key={i} className="trust-item">
                <div className="trust-num">{base}{suffix && <em>{suffix}</em>}</div>
                <div className="trust-label">{localizeTrustStatKey(s.key, locale)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── ServiceGrid ───────────────────────────────────────────

export interface ServiceCardItem {
  icon?: React.ReactNode
  title: string
  desc: string
  href?: string
  /** Optional CTA line (e.g. city hub service highlights) */
  ctaLabel?: string
}

export function ServiceGrid({ items, eyebrow, headline, body, sectionClassName }: {
  items: ServiceCardItem[]
  eyebrow?: string
  headline?: string
  body?: string
  sectionClassName?: string
}) {
  return (
    <section className={['pad-lg', 'bg-ivory', sectionClassName].filter(Boolean).join(' ')}>
      <div className="container">
        {(eyebrow || headline) && (
          <div className="mb-40">
            {eyebrow  && <div className="eyebrow mb-8">{eyebrow}</div>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {body     && <p className="body-text mt-12" style={{ maxWidth: 560 }}>{body}</p>}
          </div>
        )}
        <div className="service-cards">
          {items.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                href={item.href}
                className="service-card service-card--link"
              >
                {item.icon && <div className="service-card-icon">{item.icon}</div>}
                <div className="service-card-title">{item.title}</div>
                <div className="service-card-text">{item.desc}</div>
                {item.ctaLabel && (
                  <span className="service-card-cta">{item.ctaLabel}</span>
                )}
                <span className="service-card-arrow" aria-hidden>→</span>
              </Link>
            ) : (
              <div key={i} className="service-card">
                {item.icon && <div className="service-card-icon">{item.icon}</div>}
                <div className="service-card-title">{item.title}</div>
                <div className="service-card-text">{item.desc}</div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

// ── StepsGrid ─────────────────────────────────────────────

interface Step {
  num: number
  icon: React.ReactNode
  title: string
  desc: string
}

export function StepsGrid({ steps, eyebrow, headline, body }: {
  steps: Step[]
  eyebrow?: string
  headline?: string
  body?: string
}) {
  return (
    <section className="pad-lg bg-sand">
      <div className="container">
        {(eyebrow || headline) && (
          <div className="mb-48">
            {eyebrow  && <div className="eyebrow mb-8">{eyebrow}</div>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {body     && <p className="body-text mt-12" style={{ maxWidth: 560 }}>{body}</p>}
          </div>
        )}
        <div className="pm-steps-grid">
          {steps.map(s => (
            <div key={s.num} className="pm-step">
              <div className="pm-step-num">{s.num}</div>
              <div className="pm-step-icon">{s.icon}</div>
              <div className="pm-step-title">{s.title}</div>
              <div className="pm-step-text">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SvcList ───────────────────────────────────────────────

interface SvcItem {
  icon: React.ReactNode
  title: string
  desc: string
}

export function SvcList({ items }: { items: SvcItem[] }) {
  return (
    <div className="svc-list">
      {items.map((item, i) => (
        <div key={i} className="svc-row">
          <div className="svc-icon">{item.icon}</div>
          <div>
            <div className="svc-title">{item.title}</div>
            <div className="svc-desc">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── NeighborhoodList ──────────────────────────────────────

export function NeighborhoodList({ neighborhoods, cityName, eyebrow }: {
  neighborhoods: Neighborhood[]
  cityName: string
  eyebrow?: string
}) {
  return (
    <div>
      {eyebrow && <div className="eyebrow mb-8">{eyebrow ?? `${cityName} Neighborhoods`}</div>}
      {neighborhoods.map((n, i) => (
        <div key={i} style={{
          padding: '14px 0',
          borderBottom: i < neighborhoods.length - 1 ? '1px solid var(--sand-dark)' : 'none',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 3 }}>
            {n.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--mid)', lineHeight: 1.55 }}>
            {n.desc}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── CaseStats ─────────────────────────────────────────────

export function CaseStats({ stats, headline, sub, eyebrow, cta }: {
  stats: Stat[]
  headline?: string
  sub?: string
  eyebrow?: string
  cta?: CtaLink
}) {
  return (
    <div style={{ background: 'var(--deep)', borderRadius: 'var(--r-xl)', padding: 36 }}>
      {eyebrow  && <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>{eyebrow}</div>}
      {headline && <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 500, color: 'var(--white)', margin: '10px 0 20px', lineHeight: 1.3 }}>{headline}</h3>}
      <div className="case-stats" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 2)},1fr)` }}>
        {stats.map((s, i) => (
          <div key={i} className="case-stat">
            <div className="case-stat-val">{s.val}</div>
            <div className="case-stat-key">{s.key}</div>
          </div>
        ))}
      </div>
      {sub && <p className="case-stats-sub">{sub}</p>}
      {cta && (
        <Link href={cta.href} className="btn btn-gold btn-full" style={{ marginTop: 24 }}>
          {cta.label} →
        </Link>
      )}
    </div>
  )
}

// ── OwnerBanner ───────────────────────────────────────────

export function OwnerBanner({ eyebrow, headline, body, primaryCta, secondaryCta }: {
  eyebrow?: string
  headline: string
  body?: string
  primaryCta: CtaLink
  secondaryCta?: CtaLink
}) {
  return (
    <section className="pad-sm bg-sand">
      <div className="container">
        <div className="owner-banner">
          <div>
            {eyebrow && <div className="eyebrow" style={{ color: 'var(--gold)' }}>{eyebrow}</div>}
            <h3>{headline}</h3>
            {body && <p>{body}</p>}
          </div>
          <div className="owner-banner-actions">
            <Link href={primaryCta.href} className="btn btn-gold">{primaryCta.label}</Link>
            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn btn-outline">{secondaryCta.label}</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── CtaStrip ──────────────────────────────────────────────

export function CtaStrip({ eyebrow, headline, cta }: {
  eyebrow?: string
  headline: string
  cta: CtaLink
}) {
  return (
    <section className="cta-strip bg-deep">
      <div className="container cta-strip__inner">
        <div className="cta-strip__copy">
          {eyebrow && <div className="eyebrow" style={{ color: 'var(--gold)' }}>{eyebrow}</div>}
          <h2 className="section-title light mt-10" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)', lineHeight: 1.2 }}>
            {headline}
          </h2>
        </div>
        <Link href={cta.href} className="btn btn-gold btn-lg cta-strip__btn">
          {cta.label}
        </Link>
      </div>
    </section>
  )
}

// ── InternalLinks ─────────────────────────────────────────

interface InternalLink {
  label: string
  href: string
}

export function InternalLinks({
  heading,
  links,
  hubNavEyebrow,
  parentCityHref,
  parentCityLabel,
  parentServiceHref,
  parentServiceLabel,
  rentalsHref,
  rentalsLabel,
  /** @deprecated Prefer rentalsHref — treated as guest browse URL when rentalsHref unset */
  cityHubHref,
  cityHubLabel,
}: {
  heading: string
  links: InternalLink[]
  /** Shown above parent links, e.g. “Hub pages” */
  hubNavEyebrow?: string
  parentCityHref?: string
  parentCityLabel?: string
  parentServiceHref?: string
  parentServiceLabel?: string
  rentalsHref?: string
  rentalsLabel?: string
  cityHubHref?: string
  cityHubLabel?: string
}) {
  const browseHref = rentalsHref ?? cityHubHref
  const browseLabel = rentalsLabel ?? cityHubLabel
  const showParents = Boolean(parentCityHref || parentServiceHref)

  return (
    <div style={{ background: 'var(--deep)', borderRadius: 'var(--r-lg)', padding: '22px 24px' }}>
      {showParents && (
        <div style={{ marginBottom: 16 }}>
          {hubNavEyebrow && (
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 8, fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              {hubNavEyebrow}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {parentCityHref && (
              <Link href={parentCityHref} style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>
                → {parentCityLabel ?? 'City overview'}
              </Link>
            )}
            {parentServiceHref && (
              <Link href={parentServiceHref} style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>
                → {parentServiceLabel ?? 'Service overview'}
              </Link>
            )}
          </div>
        </div>
      )}
      <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 10 }}>{heading}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        {links.map((l, i) => (
          <Link key={i} href={l.href} style={{ fontSize: '0.83rem', color: 'var(--teal-light)', fontWeight: 500 }}>
            → {l.label}
          </Link>
        ))}
      </div>
      {browseHref && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href={browseHref} style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)' }}>
            → {browseLabel ?? 'Browse city rentals'}
          </Link>
        </div>
      )}
    </div>
  )
}

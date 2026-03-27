// ============================================================
// PlayaStays — Section Components
// All server components. Receive typed props. No data fetching.
// Use global CSS classes from globals.css — no inline styles
// except for layout values that vary by instance.
// ============================================================

import Link from 'next/link'
import type { Stat, CtaLink, Neighborhood } from '@/types'

// ── TrustBar ──────────────────────────────────────────────

interface TrustBarProps {
  stats: Stat[]
}

export function TrustBar({ stats }: TrustBarProps) {
  // Split stat values that contain em-formatted suffixes
  // e.g. "200+" → val="200" em="+"
  function splitStat(val: string) {
    const match = val.match(/^([^+%★/]+)(.*)$/)
    return match ? { base: match[1], suffix: match[2] } : { base: val, suffix: '' }
  }

  return (
    <div className="trust-bar">
      <div className="container">
        <div className="trust-bar-grid">
          {stats.map((s, i) => {
            const { base, suffix } = splitStat(s.val)
            return (
              <div key={i} className="trust-item">
                <div className="trust-num">{base}{suffix && <em>{suffix}</em>}</div>
                <div className="trust-label">{s.key}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── ServiceGrid ───────────────────────────────────────────

interface ServiceCardItem {
  icon?: React.ReactNode
  title: string
  desc: string
  href?: string
}

export function ServiceGrid({ items, eyebrow, headline, body }: {
  items: ServiceCardItem[]
  eyebrow?: string
  headline?: string
  body?: string
}) {
  return (
    <section className="pad-lg bg-ivory">
      <div className="container">
        {(eyebrow || headline) && (
          <div className="mb-40">
            {eyebrow  && <div className="eyebrow mb-8">{eyebrow}</div>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {body     && <p className="body-text mt-12" style={{ maxWidth: 560 }}>{body}</p>}
          </div>
        )}
        <div className="service-cards">
          {items.map((item, i) => (
            <div key={i} className="service-card">
              {item.icon && <div className="service-card-icon">{item.icon}</div>}
              <div className="service-card-title">
                {item.href
                  ? <Link href={item.href} style={{ color: 'inherit' }}>{item.title}</Link>
                  : item.title
                }
              </div>
              <div className="service-card-text">{item.desc}</div>
            </div>
          ))}
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
      {sub && <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: '16px 0 20px' }}>{sub}</p>}
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
    <section className="bg-deep" style={{ padding: '48px 0' }}>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 36, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div>
          {eyebrow && <div className="eyebrow" style={{ color: 'var(--gold)' }}>{eyebrow}</div>}
          <h2 className="section-title light mt-10" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            {headline}
          </h2>
        </div>
        <Link href={cta.href} className="btn btn-gold btn-lg" style={{ flexShrink: 0 }}>
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

export function InternalLinks({ heading, links, cityHubLabel, cityHubHref }: {
  heading: string
  links: InternalLink[]
  cityHubLabel?: string
  cityHubHref?: string
}) {
  return (
    <div style={{ background: 'var(--deep)', borderRadius: 'var(--r-lg)', padding: '22px 24px' }}>
      <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 10 }}>{heading}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        {links.map((l, i) => (
          <Link key={i} href={l.href} style={{ fontSize: '0.83rem', color: 'var(--teal-light)', fontWeight: 500 }}>
            → {l.label}
          </Link>
        ))}
      </div>
      {cityHubHref && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href={cityHubHref} style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)' }}>
            ← {cityHubLabel ?? 'Back to city hub'}
          </Link>
        </div>
      )}
    </div>
  )
}

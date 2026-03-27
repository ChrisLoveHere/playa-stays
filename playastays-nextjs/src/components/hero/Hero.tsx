// ============================================================
// PlayaStays — Hero Component
// Three variants driven by a single prop.
// All content comes from props — nothing hardcoded.
// ============================================================

import type { Stat, CtaLink } from '@/types'
import { Breadcrumb, type BreadcrumbItem } from '@/components/layout/Breadcrumb'

interface HeroProps {
  variant: 'split' | 'centred' | 'overlay'
  tag?: string
  headline: string                // supports <em> via dangerouslySetInnerHTML
  sub?: string
  stats?: Stat[]
  primaryCta?: CtaLink
  secondaryCta?: CtaLink
  breadcrumbs?: BreadcrumbItem[]
  // split variant only
  formSlot?: React.ReactNode
  // overlay variant only
  backgroundImageUrl?: string
  // centred variant — optional count/subtitle
  subtitle?: string
}

export function Hero({
  variant,
  tag,
  headline,
  sub,
  stats,
  primaryCta,
  secondaryCta,
  breadcrumbs,
  formSlot,
  backgroundImageUrl,
  subtitle,
}: HeroProps) {

  if (variant === 'split') {
    return (
      <section className="page-hero">
        <div className="container">
          {breadcrumbs && <Breadcrumb crumbs={breadcrumbs} />}
          <div className="svc-hero-grid" style={{ marginTop: breadcrumbs ? 12 : 0 }}>

            {/* Left: pitch */}
            <div>
              {tag && <div className="hero-tag fade-1">{tag}</div>}
              <h1
                className="display-title fade-2"
                style={{ fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', marginBottom: 18 }}
                dangerouslySetInnerHTML={{ __html: headline }}
              />
              {sub && (
                <p className="fade-3" style={{
                  fontSize: '1rem', color: 'rgba(255,255,255,0.68)',
                  lineHeight: 1.77, maxWidth: 440, marginBottom: 28,
                }}>
                  {sub}
                </p>
              )}
              {(primaryCta || secondaryCta) && (
                <div className="hero-btns fade-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: stats ? 0 : undefined }}>
                  {primaryCta  && <a href={primaryCta.href}  className="btn btn-gold btn-lg">{primaryCta.label}</a>}
                  {secondaryCta && <a href={secondaryCta.href} className="btn btn-outline">{secondaryCta.label}</a>}
                </div>
              )}
              {stats && stats.length > 0 && (
                <div className="hero-inline-stats fade-5">
                  {stats.map((s, i) => (
                    <div key={i}>
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-key">{s.key}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: form slot */}
            {formSlot && (
              <div className="hero-form-card" id="estimate-form">
                {formSlot}
              </div>
            )}

          </div>
        </div>
      </section>
    )
  }

  if (variant === 'centred') {
    return (
      <section className="page-hero">
        <div className="container">
          {breadcrumbs && <Breadcrumb crumbs={breadcrumbs} />}
          <div style={{ position: 'relative', zIndex: 2, paddingTop: breadcrumbs ? 12 : 0 }}>
            {tag && <div className="hero-tag fade-1">{tag}</div>}
            <h1
              className="display-title fade-2"
              style={{ fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', marginBottom: 18, maxWidth: 720 }}
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            {sub && (
              <p className="fade-3" style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.77, maxWidth: 620, marginBottom: 28,
              }}>
                {sub}
              </p>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="fade-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {primaryCta   && <a href={primaryCta.href}  className="btn btn-gold btn-lg">{primaryCta.label}</a>}
                {secondaryCta && <a href={secondaryCta.href} className="btn btn-outline">{secondaryCta.label}</a>}
              </div>
            )}
            {stats && stats.length > 0 && (
              <div className="hero-inline-stats fade-5">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="stat-val">{s.val}</div>
                    <div className="stat-key">{s.key}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // overlay variant — for property detail pages
  return (
    <section style={{
      position: 'relative',
      minHeight: 420,
      background: backgroundImageUrl
        ? `url(${backgroundImageUrl}) center/cover no-repeat`
        : 'var(--deep)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,43,47,0.92) 0%, rgba(10,43,47,0.4) 60%, rgba(10,43,47,0.1) 100%)',
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 40 }}>
        {breadcrumbs && <Breadcrumb crumbs={breadcrumbs} />}
        {tag && <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>{tag}</div>}
        <h1
          className="page-title"
          dangerouslySetInnerHTML={{ __html: headline }}
        />
        {subtitle && (
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>{subtitle}</p>
        )}
      </div>
    </section>
  )
}

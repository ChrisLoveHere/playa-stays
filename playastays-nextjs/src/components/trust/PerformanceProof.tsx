// ============================================================
// PerformanceProof — server component
//
// Shows real aggregated portfolio stats pulled from live
// ps_monthly_income and ps_avg_occupancy fields.
// Used on: city hubs, pricing pages, service pages.
//
// Data flow: template fetches properties (already cached) →
// passes to getDisplayStats() → passes stats as props here.
// Zero extra fetch calls.
// ============================================================

import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Locale } from '@/lib/i18n'
import type { PortfolioStats } from '@/lib/portfolio-stats'

interface PerformanceProofProps {
  stats:        PortfolioStats
  cityName:     string
  locale:       Locale
  estimateHref: string
  /**
   * City hubs: softer framing so this block does not compete with city × service pages
   * for “earnings / commercial proof” intent (@/content/page-roles).
   */
  hubSnapshot?: boolean
  /** When false, headline row has no duplicate estimate button (use on homepage / hubs with CTAs nearby). */
  showEstimateCta?: boolean
  /**
   * Property-management global hub: qualitative portfolio framing (no unsourced dollar/% figures).
   */
  variant?: 'default' | 'qualitative-hub'
}

function fmt( n: number ): string {
  if ( n >= 10000 ) return '$' + ( n / 1000 ).toFixed( 0 ) + 'k'
  return '$' + n.toLocaleString( 'en-US' )
}

export function PerformanceProof( {
  stats, cityName, locale, estimateHref, hubSnapshot = false,
  showEstimateCta = true,
  variant = 'default',
}: PerformanceProofProps ) {
  const isEs = locale === 'es'

  if (variant === 'qualitative-hub') {
    const headline = isEs
      ? 'Resultados reales en nuestro portafolio'
      : 'Real outcomes across our portfolio'
    const sub = isEs
      ? 'Los propietarios con PlayaStays suelen ver un desempeño más sólido frente a la autogestión; las cifras exactas dependen de tu propiedad y mercado. Hablemos de tu caso.'
      : 'Owners with PlayaStays see consistent performance lift versus self-managing — exact numbers depend on your property and market. Talk to us about your specific situation.'
    const cards = isEs
      ? [
          { val: 'Fuerte', key: 'Ingreso mensual frente a autogestión', note: 'en propiedades administradas por nosotros', accent: 'var(--gold)' },
          { val: 'Alta', key: 'Tasas de ocupación', note: 'en el portafolio administrado', accent: 'var(--teal-light)' },
          { val: 'Boutique', key: 'Enfoque de servicio', note: 'equipo pequeño, cada propiedad conocida', accent: 'var(--gold-light)' },
        ]
      : [
          { val: 'Strong', key: 'Monthly income vs self-managing', note: 'across our managed properties', accent: 'var(--gold)' },
          { val: 'High', key: 'Occupancy rates', note: 'across managed portfolio', accent: 'var(--teal-light)' },
          { val: 'Boutique', key: 'Service approach', note: 'small team, every property known', accent: 'var(--gold-light)' },
        ]

    return (
      <section
        className={[
          'pad-lg',
          'bg-deep',
          'performance-proof',
          !showEstimateCta ? 'performance-proof--no-top-cta' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="container">
          <div className="performance-proof-head">
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>
                {isEs ? '📊 Resultados reales' : '📊 Real results'}
              </div>
              <h2 className="section-title light performance-proof-title">
                {headline}
              </h2>
              <p className="performance-proof-sub">{sub}</p>
            </div>
            {showEstimateCta ? (
              <Link href={estimateHref} className="btn btn-gold" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                {isEs ? 'Estimar mis ingresos →' : 'Estimate my income →'}
              </Link>
            ) : null}
          </div>

          <div className="performance-proof-metrics">
            {cards.map((m, i) => (
              <div
                key={i}
                className="performance-proof-card"
                style={{ '--card-accent': m.accent } as CSSProperties}
              >
                <div className="performance-proof-card-accent" aria-hidden />
                <div className="performance-proof-card-value">{m.val}</div>
                <div className="performance-proof-card-key">{m.key}</div>
                <div className="performance-proof-card-note">{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const headline = hubSnapshot
    ? (isEs
        ? `Datos del portafolio en ${cityName}`
        : `Managed portfolio snapshot — ${cityName}`)
    : (isEs
        ? `Lo que ganan los propietarios en ${cityName}`
        : `What owners earn in ${cityName}`)

  const sub = hubSnapshot
    ? (isEs
        ? 'Cifras ilustrativas de propiedades gestionadas. Honorarios, alcance y detalle comercial por servicio están en la página de ciudad + servicio correspondiente.'
        : 'Illustrative figures from managed inventory. Fees, scope, and service-specific economics belong on each city + service page.')
    : (isEs
        ? `Basado en datos reales de nuestro portafolio gestionado. Ingresos netos después de comisión de gestión.`
        : `Based on real data from our managed portfolio. Net income after management fee.`)

  const metrics = [
    {
      val:    fmt( stats.avgMonthlyIncome ),
      key:    isEs ? 'Ingreso mensual promedio' : 'Avg monthly income',
      note:   isEs ? 'neto, después de la comisión' : 'net, after management fee',
      accent: 'var(--gold)',
    },
    {
      val:    stats.avgOccupancy + '%',
      key:    isEs ? 'Ocupación promedio' : 'Avg occupancy',
      note:   isEs ? 'en el portafolio gestionado' : 'across managed portfolio',
      accent: 'var(--teal-light)',
    },
    {
      val:    fmt( stats.topMonthlyIncome ),
      key:    isEs ? 'Mejor propiedad este mes' : 'Top property this month',
      note:   isEs ? 'mayor ingreso en el portafolio' : 'highest earner in portfolio',
      accent: 'var(--gold-light)',
    },
  ]

  return (
    <section
      className={[
        'pad-lg',
        'bg-deep',
        'performance-proof',
        !showEstimateCta ? 'performance-proof--no-top-cta' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="container">
        <div className="performance-proof-head">
          <div>
            <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>
              {isEs ? '📊 Resultados reales' : '📊 Real results'}
            </div>
            <h2 className="section-title light performance-proof-title">
              {headline}
            </h2>
            <p className="performance-proof-sub">{sub}</p>
          </div>
          {showEstimateCta ? (
            <Link href={estimateHref} className="btn btn-gold" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
              {isEs ? 'Estimar mis ingresos →' : 'Estimate my income →'}
            </Link>
          ) : null}
        </div>

        <div className="performance-proof-metrics">
          {metrics.map( ( m, i ) => (
            <div
              key={i}
              className="performance-proof-card"
              style={{ '--card-accent': m.accent } as CSSProperties}
            >
              <div className="performance-proof-card-accent" aria-hidden />
              <div className="performance-proof-card-value">{m.val}</div>
              <div className="performance-proof-card-key">{m.key}</div>
              <div className="performance-proof-card-note">{m.note}</div>
            </div>
          ) )}
        </div>

        <p className="performance-proof-disclaimer">
          {isEs
            ? '* Promedios calculados sobre propiedades activas con datos de desempeño en los últimos 12 meses.'
            : '* Averages calculated across active properties with trailing 12-month performance data.'}
        </p>
      </div>
    </section>
  )
}

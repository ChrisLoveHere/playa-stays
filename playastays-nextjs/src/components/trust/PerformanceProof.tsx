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
import type { Locale } from '@/lib/i18n'
import type { PortfolioStats } from '@/lib/portfolio-stats'

interface PerformanceProofProps {
  stats:        PortfolioStats
  cityName:     string
  locale:       Locale
  estimateHref: string
}

function fmt( n: number ): string {
  if ( n >= 10000 ) return '$' + ( n / 1000 ).toFixed( 0 ) + 'k'
  return '$' + n.toLocaleString( 'en-US' )
}

export function PerformanceProof( {
  stats, cityName, locale, estimateHref,
}: PerformanceProofProps ) {
  const isEs = locale === 'es'

  const headline = isEs
    ? `Lo que ganan los propietarios en ${cityName}`
    : `What owners earn in ${cityName}`

  const sub = isEs
    ? `Basado en datos reales de nuestro portafolio gestionado. Ingresos netos después de comisión de gestión.`
    : `Based on real data from our managed portfolio. Net income after management fee.`

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
    {
      val:    stats.totalActive + '+',
      key:    isEs ? 'Propiedades activas' : 'Active properties',
      note:   isEs ? 'gestionadas por PlayaStays' : 'managed by PlayaStays',
      accent: 'var(--teal)',
    },
  ]

  return (
    <section className="pad-lg bg-deep">
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 24,
          alignItems: 'end',
          marginBottom: 40,
          flexWrap: 'wrap',
        }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>
              {isEs ? '📊 Resultados reales' : '📊 Real results'}
            </div>
            <h2
              className="section-title light"
              style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', marginTop: 10 }}
            >
              {headline}
            </h2>
            <p style={{
              fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.65,
              maxWidth: 500,
              marginTop: 10,
            }}>
              {sub}
            </p>
          </div>
          <Link href={estimateHref} className="btn btn-gold" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
            {isEs ? 'Estimar mis ingresos →' : 'Estimate my income →'}
          </Link>
        </div>

        {/* Metrics grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {metrics.map( ( m, i ) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--r-lg)',
              padding: '24px 22px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Accent bar */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: m.accent,
                borderRadius: 'var(--r-lg) var(--r-lg) 0 0',
              }} />
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem,4vw,2.8rem)',
                fontWeight: 700,
                color: m.accent,
                lineHeight: 1,
                marginBottom: 6,
              }}>
                {m.val}
              </div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--white)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {m.key}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.4)' }}>
                {m.note}
              </div>
            </div>
          ) )}
        </div>

        {/* Disclaimer */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.25)',
          marginTop: 24,
          fontStyle: 'italic',
        }}>
          {isEs
            ? '* Promedios calculados sobre propiedades activas con datos de desempeño en los últimos 12 meses.'
            : '* Averages calculated across active properties with trailing 12-month performance data.'}
        </p>
      </div>
    </section>
  )
}

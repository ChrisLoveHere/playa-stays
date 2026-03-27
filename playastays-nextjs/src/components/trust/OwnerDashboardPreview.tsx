'use client'
// ============================================================
// OwnerDashboardPreview — client component
//
// A marketing preview of the owner portal UI.
// NOT a real dashboard — pure visual proof-of-concept.
// Uses the same data shapes as the actual portal so it feels
// real. Numbers are illustrative (plucked from pricing-data).
//
// Animates in on mount. No API calls. No auth required.
// Used on: pricing pages, list-your-property page.
// ============================================================

import { useState, useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n'

interface OwnerDashboardPreviewProps {
  locale:       Locale
  cityName?:    string
  estimateHref: string
}

// ── Illustrative data ─────────────────────────────────────
// Based on a typical 2BR condo in Playa del Carmen.
// These numbers are labeled as "Example" — not real client data.

const MONTHS_EN = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul']
const MONTHS_ES = ['Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May','Jun','Jul']

const REVENUE_DATA = [2800, 2950, 3100, 3450, 4200, 4800, 4100, 4600, 3800, 3200, 2700, 3100]
const OCCUPANCY_DATA = [72, 75, 78, 82, 91, 96, 88, 92, 84, 79, 68, 76]

const MAX_REV = Math.max(...REVENUE_DATA)

export function OwnerDashboardPreview({
  locale,
  cityName = 'Playa del Carmen',
  estimateHref,
}: OwnerDashboardPreviewProps) {
  const isEs = locale === 'es'
  const [mounted, setMounted] = useState(false)
  const [activeMonth, setActiveMonth] = useState(11)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(timer)
  }, [])

  // Rotate active month every 2s for demo feel
  useEffect(() => {
    const iv = setInterval(() => {
      setActiveMonth(m => (m + 1) % 12)
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  const months      = isEs ? MONTHS_ES : MONTHS_EN
  const totalRevenue = REVENUE_DATA.reduce((a, b) => a + b, 0)
  const avgOcc       = Math.round(OCCUPANCY_DATA.reduce((a, b) => a + b, 0) / 12)
  const mgmtFee      = Math.round(totalRevenue * 0.15 / 12)
  const netPayout    = Math.round(totalRevenue / 12 * 0.85)

  const recentActivity = isEs ? [
    { icon: '✓', text: '3 noches reservadas', sub: 'Check-in: 28 ene', amount: '+$390' },
    { icon: '✓', text: 'Huésped con check-in', sub: 'Playa del Carmen, estudio', amount: '—' },
    { icon: '₊', text: 'Limpieza completada',  sub: 'Cargo al costo: $45',      amount: '-$45' },
    { icon: '✓', text: '5 noches reservadas',  sub: 'Check-in: 4 feb',          amount: '+$650' },
  ] : [
    { icon: '✓', text: '3 nights booked',      sub: 'Check-in Jan 28', amount: '+$390' },
    { icon: '✓', text: 'Guest checked in',      sub: 'Playa del Carmen, studio', amount: '—' },
    { icon: '₊', text: 'Cleaning completed',    sub: 'At-cost charge: $45',     amount: '-$45' },
    { icon: '✓', text: '5 nights booked',       sub: 'Check-in Feb 4',          amount: '+$650' },
  ]

  const labels = {
    exampleBadge: isEs ? '✦ Ejemplo de portal' : '✦ Example owner portal',
    title:        isEs ? `Portal del Propietario · ${cityName}` : `Owner Portal · ${cityName}`,
    annualRevenue:isEs ? 'Ingresos anuales (12 meses)'     : 'Annual Revenue (12 months)',
    avgOccupancy: isEs ? 'Ocupación promedio'              : 'Avg Occupancy',
    mgmtFeeLabel: isEs ? 'Comisión de gestión (15%)'       : 'Management Fee (15%)',
    netPayoutLabel:isEs ? 'Pago neto mensual promedio'     : 'Avg Monthly Net Payout',
    revenueChart: isEs ? 'Ingresos brutos por mes (USD)'  : 'Monthly Gross Revenue (USD)',
    activity:     isEs ? 'Actividad reciente'              : 'Recent Activity',
    cta:          isEs ? 'Ver cómo funciona tu estimado →' : 'See how your estimate works →',
    footnote:     isEs
      ? '* Ejemplo basado en un condo de 2 recámaras típico en Playa del Carmen. Los resultados reales varían.'
      : '* Example based on a typical 2BR condo in Playa del Carmen. Actual results vary.',
  }

  return (
    <section className="pad-lg bg-sand">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
          <div className="eyebrow mb-8">
            {isEs ? '🖥️ Portal del propietario' : '🖥️ Owner portal'}
          </div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
            {isEs
              ? 'Ve exactamente cómo rinde tu propiedad'
              : 'See exactly how your property performs'}
          </h2>
          <p className="body-text">
            {isEs
              ? 'Cada propietario accede a un portal en tiempo real con ingresos, reservas, gastos y pagos — todo transparente.'
              : 'Every owner gets a real-time dashboard showing revenue, bookings, expenses, and payouts — fully transparent.'}
          </p>
        </div>

        {/* Mock dashboard */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--r-xl)',
          boxShadow: 'var(--sh-lg)',
          overflow: 'hidden',
          border: '1px solid var(--sand-dark)',
          maxWidth: 900,
          margin: '0 auto',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(16px)',
          transition: 'all 0.5s ease',
        }}>
          {/* Dashboard header bar */}
          <div style={{
            background: 'var(--deep)',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Traffic light dots */}
              {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.7)',
                marginLeft: 8,
              }}>
                {labels.title}
              </span>
            </div>
            <span style={{
              fontSize: '0.68rem',
              background: 'rgba(200,164,74,0.2)',
              color: 'var(--gold)',
              padding: '3px 10px',
              borderRadius: 'var(--r-pill)',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}>
              {labels.exampleBadge}
            </span>
          </div>

          {/* Dashboard body */}
          <div style={{ padding: 24 }}>
            {/* KPI row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
              marginBottom: 24,
            }}>
              {[
                { val: '$' + totalRevenue.toLocaleString('en-US'), key: labels.annualRevenue,  accent: 'var(--teal)' },
                { val: avgOcc + '%',                                key: labels.avgOccupancy,   accent: 'var(--gold)' },
                { val: '$' + mgmtFee.toLocaleString('en-US'),      key: labels.mgmtFeeLabel,   accent: 'var(--mid)' },
                { val: '$' + netPayout.toLocaleString('en-US'),     key: labels.netPayoutLabel, accent: 'var(--teal)' },
              ].map((kpi, i) => (
                <div key={i} style={{
                  background: 'var(--ivory)',
                  borderRadius: 'var(--r-md)',
                  padding: '14px 16px',
                  borderLeft: `3px solid ${kpi.accent}`,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: kpi.accent,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {kpi.val}
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'var(--mid)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    lineHeight: 1.35,
                  }}>
                    {kpi.key}
                  </div>
                </div>
              ))}
            </div>

            {/* Two-column: chart + activity */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 280px',
              gap: 20,
            }}>
              {/* Revenue bar chart */}
              <div style={{
                background: 'var(--ivory)',
                borderRadius: 'var(--r-md)',
                padding: '18px 20px',
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--mid)',
                  marginBottom: 16,
                }}>
                  {labels.revenueChart}
                </div>
                {/* Chart */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 5,
                  height: 100,
                  padding: '0 4px',
                }}>
                  {REVENUE_DATA.map((rev, i) => {
                    const pct  = (rev / MAX_REV) * 100
                    const isActive = i === activeMonth
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveMonth(i)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{
                          width: '100%',
                          height: `${pct}%`,
                          background: isActive ? 'var(--teal)' : 'var(--sand-dark)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'background 0.25s, height 0.4s',
                          position: 'relative',
                        }}>
                          {isActive && (
                            <div style={{
                              position: 'absolute',
                              bottom: 'calc(100% + 4px)',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: 'var(--deep)',
                              color: 'var(--white)',
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              padding: '2px 5px',
                              borderRadius: 3,
                              whiteSpace: 'nowrap',
                            }}>
                              ${rev.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div style={{
                          fontSize: '0.58rem',
                          color: isActive ? 'var(--teal)' : 'var(--light)',
                          fontWeight: isActive ? 700 : 400,
                        }}>
                          {months[i]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Activity feed */}
              <div style={{
                background: 'var(--ivory)',
                borderRadius: 'var(--r-md)',
                padding: '18px 16px',
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--mid)',
                  marginBottom: 12,
                }}>
                  {labels.activity}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {recentActivity.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      padding: '9px 0',
                      borderBottom: i < recentActivity.length - 1 ? '1px solid var(--sand-dark)' : 'none',
                      gap: 8,
                    }}>
                      <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: item.icon === '✓' ? 'rgba(24,104,112,0.12)' : 'rgba(200,164,74,0.12)',
                          color: item.icon === '✓' ? 'var(--teal)' : 'var(--gold)',
                          fontSize: '0.65rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: 1,
                        }}>
                          {item.icon}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.3 }}>
                            {item.text}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--light)', marginTop: 1 }}>
                            {item.sub}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: item.amount.startsWith('+') ? 'var(--teal)' : item.amount === '—' ? 'var(--light)' : 'var(--coral)',
                        flexShrink: 0,
                      }}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote + CTA */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--light)', fontStyle: 'italic', marginBottom: 16 }}>
            {labels.footnote}
          </p>
          <a href={estimateHref} className="btn btn-gold">
            {labels.cta}
          </a>
        </div>
      </div>
    </section>
  )
}

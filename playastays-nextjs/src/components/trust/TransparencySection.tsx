// ============================================================
// TransparencySection — server component
//
// "No hidden fees. No markups." — builds trust by explicitly
// listing what is charged at cost and what is never charged.
// Used on: pricing pages, list-your-property, service pages.
// ============================================================

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface TransparencySectionProps {
  locale:       Locale
  estimateHref: string
  cityName?:    string
}

export function TransparencySection({
  locale,
  estimateHref,
  cityName = 'Playa del Carmen',
}: TransparencySectionProps) {
  const isEs = locale === 'es'

  const headline = isEs
    ? 'Sin costos ocultos. Sin sobreprecios.'
    : 'No hidden fees. No markups.'

  const sub = isEs
    ? `Sabemos que otros gestores añaden márgenes a todo. En PlayaStays cobramos solo nuestra comisión — el resto va a tu bolsillo.`
    : `We know other managers mark up everything. PlayaStays charges only our management fee — everything else goes straight to you.`

  // Left column: what we charge — explicit fee list
  const feeItems = isEs ? [
    {
      label:  'Comisión de gestión',
      value:  '10–25% de ingresos brutos',
      detail: 'Se acuerda antes de firmar. Sin sorpresas.',
      icon:   '✓',
      style:  'positive',
    },
    {
      label:  'Fotografía profesional',
      value:  'Incluida en el plan',
      detail: 'Sesión completa, sin costo adicional para ti.',
      icon:   '✓',
      style:  'positive',
    },
    {
      label:  'Configuración y publicación',
      value:  '$0 cuota de inicio',
      detail: 'Listamos tu propiedad sin costos de setup.',
      icon:   '✓',
      style:  'positive',
    },
    {
      label:  'Limpieza',
      value:  'Al costo real',
      detail: 'Te cobramos exactamente lo que pagamos. Ver recibo.',
      icon:   '=',
      style:  'neutral',
    },
    {
      label:  'Suministros y reposición',
      value:  'Al costo real',
      detail: 'Artículos de tocador, café, etc. Sin margen.',
      icon:   '=',
      style:  'neutral',
    },
    {
      label:  'Mantenimiento',
      value:  'Al costo real + tu aprobación',
      detail: 'Nunca iniciamos reparaciones sin avisarte primero.',
      icon:   '=',
      style:  'neutral',
    },
  ] : [
    {
      label:  'Management fee',
      value:  '10–25% of gross revenue',
      detail: 'Agreed before you sign. No surprises.',
      icon:   '✓',
      style:  'positive',
    },
    {
      label:  'Professional photography',
      value:  'Included in plan',
      detail: 'Full shoot at no extra charge to you.',
      icon:   '✓',
      style:  'positive',
    },
    {
      label:  'Listing setup & publishing',
      value:  '$0 setup fee',
      detail: 'We list your property on all platforms. No onboarding charge.',
      icon:   '✓',
      style:  'positive',
    },
    {
      label:  'Cleaning',
      value:  'At cost — no markup',
      detail: 'You pay exactly what we pay. Receipt provided.',
      icon:   '=',
      style:  'neutral',
    },
    {
      label:  'Supplies & restocking',
      value:  'At cost — no markup',
      detail: 'Toiletries, coffee, essentials. Zero margin.',
      icon:   '=',
      style:  'neutral',
    },
    {
      label:  'Maintenance & repairs',
      value:  'At cost + your approval',
      detail: 'We never start work without notifying you first.',
      icon:   '=',
      style:  'neutral',
    },
  ]

  // Right column: what is NEVER charged
  const neverItems = isEs ? [
    'Cuota de inicio o configuración',
    'Penalización por salida anticipada',
    'Margen sobre limpieza o suministros',
    'Cuota por "gestión de mantenimiento"',
    'Comisión sobre reservas canceladas',
    'Cargos por cambios de temporada en precios',
    'Cuotas ocultas en los extractos mensuales',
  ] : [
    'Setup or onboarding fee',
    'Early-exit or cancellation penalty',
    'Markup on cleaning or supplies',
    '"Maintenance management" surcharge',
    'Commission on cancelled bookings',
    'Seasonal repricing fees',
    'Hidden charges on monthly statements',
  ]

  const contractNote = isEs
    ? '30 días de aviso para salir — sin penalización. Nuestro incentivo es que ganes más, no que te quedes atrapado.'
    : '30-day notice to exit — no penalty. Our incentive is to make you more money, not to lock you in.'

  const iconColor = (s: string) =>
    s === 'positive' ? 'var(--teal)' : 'var(--gold)'

  return (
    <section className="pad-lg bg-ivory">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 48px' }}>
          <div className="eyebrow mb-8">
            {isEs ? '🔍 Transparencia total' : '🔍 Full transparency'}
          </div>
          <h2 className="section-title mt-12 mb-12" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
            {headline}
          </h2>
          <p className="body-text">{sub}</p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'start',
        }}>
          {/* Left — fee breakdown */}
          <div>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--mid)',
              marginBottom: 16,
            }}>
              {isEs ? 'Lo que cobramos' : 'What we charge'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {feeItems.map((item, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr auto',
                  gap: '0 14px',
                  padding: '12px 16px',
                  background: 'var(--white)',
                  borderRadius: i === 0
                    ? 'var(--r-md) var(--r-md) 0 0'
                    : i === feeItems.length - 1
                      ? '0 0 var(--r-md) var(--r-md)'
                      : 0,
                  border: '1px solid var(--sand-dark)',
                  borderTop: i === 0 ? '1px solid var(--sand-dark)' : 'none',
                  alignItems: 'start',
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 20, height: 20,
                    borderRadius: '50%',
                    background: iconColor(item.style) + '1a',
                    color: iconColor(item.style),
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {item.icon}
                  </div>
                  {/* Label + detail */}
                  <div>
                    <div style={{
                      fontSize: '0.83rem',
                      fontWeight: 600,
                      color: 'var(--charcoal)',
                      lineHeight: 1.3,
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: '0.71rem',
                      color: 'var(--light)',
                      marginTop: 2,
                      lineHeight: 1.4,
                    }}>
                      {item.detail}
                    </div>
                  </div>
                  {/* Value */}
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: iconColor(item.style),
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    paddingTop: 2,
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — never charged + contract note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--sand-dark)',
              borderRadius: 'var(--r-lg)',
              padding: '24px 26px',
            }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--mid)',
                marginBottom: 16,
              }}>
                {isEs ? 'Lo que NUNCA cobramos' : 'What we NEVER charge'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {neverItems.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: i < neverItems.length - 1 ? '1px solid var(--sand)' : 'none',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(224,90,54,0.1)',
                      color: 'var(--coral)',
                      fontSize: '0.6rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      ✕
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--mid)', lineHeight: 1.4 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract flexibility callout */}
            <div style={{
              background: 'var(--deep)',
              borderRadius: 'var(--r-lg)',
              padding: '20px 24px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: '1.4rem',
                lineHeight: 1,
                flexShrink: 0,
                marginTop: 2,
              }}>
                🔓
              </div>
              <div>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}>
                  {isEs ? 'Sin contrato de largo plazo' : 'No long-term lock-in'}
                </div>
                <p style={{
                  fontSize: '0.77rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {contractNote}
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link href={estimateHref} className="btn btn-coral btn-full">
              {isEs ? 'Ver mi estimado gratis →' : 'Get my free estimate →'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// BeforeAfter — server component
//
// "Before vs After Management" — side-by-side comparison
// using real CalcOutputs from runCalculator so numbers are
// always consistent with the full Revenue Calculator.
//
// Uses CALC_RANGES for a specific city + size to derive the
// concrete self-managed and managed figures shown.
//
// Used on: homepage, pricing pages.
// ============================================================

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { runCalculator, fmt } from '@/lib/calculator-data'

interface BeforeAfterProps {
  locale:       Locale
  citySlug?:    string
  cityName?:    string
  estimateHref: string
}

// Illustrative property: 2BR condo — most common type
const DEMO_SIZE  = '2br' as const

export function BeforeAfter({
  locale,
  citySlug    = 'playa-del-carmen',
  cityName    = 'Playa del Carmen',
  estimateHref,
}: BeforeAfterProps) {
  const isEs  = locale === 'es'
  const calc  = runCalculator({ citySlug, propertySize: DEMO_SIZE })

  const selfMid    = Math.round((calc.selfManagedLo + calc.selfManagedHi) / 2)
  const managedMid = Math.round((calc.monthlyManagedLo + calc.monthlyManagedHi) / 2)
  const netMid     = Math.round((calc.netPlusLo + calc.netPlusHi) / 2)
  const upliftMid  = Math.max(0, netMid - selfMid)
  const upliftPct  = selfMid > 0 ? Math.round((upliftMid / selfMid) * 100) : 0

  // Self-managed "before" column — problems
  const selfRows = isEs ? [
    { label: 'Ingresos brutos mensuales',    val: fmt(selfMid),    note: 'sin gestión profesional' },
    { label: 'Tarifa dinámica',               val: '✕ Manual',     note: 'tú ajustas las tarifas' },
    { label: 'Respuesta a huéspedes',         val: 'Sólo disponible', note: 'cuando tú estás disponible' },
    { label: 'Plataformas de reserva',        val: '1–2',          note: 'Airbnb típicamente' },
    { label: 'Fotografía profesional',        val: 'No incluida',  note: 'gasto adicional tuyo' },
    { label: 'Tu tiempo al mes',              val: '10–20 hrs',    note: 'coordinación, mensajes, limpieza' },
    { label: 'Reporte de ingresos',           val: '✕ Ninguno',    note: 'sin transparencia' },
  ] : [
    { label: 'Gross monthly revenue',         val: fmt(selfMid),   note: 'without professional management' },
    { label: 'Dynamic pricing',               val: '✕ Manual',     note: 'you adjust rates yourself' },
    { label: 'Guest response',                val: 'When available',note: 'limited to your own hours' },
    { label: 'Booking platforms',             val: '1–2',          note: 'typically Airbnb only' },
    { label: 'Professional photography',      val: 'Not included', note: 'your own cost if done' },
    { label: 'Your time per month',           val: '10–20 hrs',    note: 'messaging, logistics, cleaning' },
    { label: 'Income reporting',              val: '✕ None',       note: 'no visibility into performance' },
  ]

  // PlayaStays "after" column — results
  const psRows = isEs ? [
    { label: 'Ingresos brutos mensuales',    val: fmt(managedMid),  note: 'con gestión PlayaStays' },
    { label: 'Tarifa dinámica',               val: '✓ Diaria',      note: 'IA + mercado en tiempo real' },
    { label: 'Respuesta a huéspedes',         val: '24/7 bilingüe', note: 'menos de 5 min en promedio' },
    { label: 'Plataformas de reserva',        val: 'Airbnb + VRBO + Booking', note: 'máxima exposición' },
    { label: 'Fotografía profesional',        val: '✓ Incluida',    note: 'sin costo adicional' },
    { label: 'Tu tiempo al mes',              val: '0 horas',       note: 'tú cobras, nosotros trabajamos' },
    { label: 'Reporte de ingresos',           val: 'Tiempo real',   note: 'portal + reporte mensual' },
  ] : [
    { label: 'Gross monthly revenue',         val: fmt(managedMid),  note: 'with PlayaStays management' },
    { label: 'Dynamic pricing',               val: '✓ Daily',        note: 'AI + real-time market data' },
    { label: 'Guest response',                val: '24/7 bilingual', note: '<5 min average response' },
    { label: 'Booking platforms',             val: 'Airbnb + VRBO + Booking', note: 'maximum reach' },
    { label: 'Professional photography',      val: '✓ Included',     note: 'no extra charge to you' },
    { label: 'Your time per month',           val: '0 hours',        note: 'you earn, we work' },
    { label: 'Income reporting',              val: 'Real-time',      note: 'live dashboard + monthly report' },
  ]

  const demoNote = isEs
    ? `* Estimación para un condo de 2 recámaras en ${cityName}. Tus resultados dependen de la propiedad y la temporada.`
    : `* Estimate for a 2BR condo in ${cityName}. Your results depend on property and season.`

  return (
    <section className="pad-lg bg-sand">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 44px' }}>
          <div className="eyebrow mb-8">
            {isEs ? '📈 Antes vs después' : '📈 Before vs after'}
          </div>
          <h2 className="section-title mt-12 mb-12" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
            {isEs
              ? `¿Qué cambia con PlayaStays en ${cityName}?`
              : `What changes with PlayaStays in ${cityName}?`}
          </h2>
          <p className="body-text">
            {isEs
              ? `Un condo de 2 recámaras típico pasa de ${fmt(selfMid)}/mes autogestionado a ${fmt(netMid)}/mes neto con nosotros — ${upliftPct > 0 ? `+${upliftPct}% más` : 'sin cambio'}.`
              : `A typical 2BR condo goes from ${fmt(selfMid)}/mo self-managed to ${fmt(netMid)}/mo net with us — ${upliftPct > 0 ? `+${upliftPct}% more` : 'no change'}.`}
          </p>
        </div>

        {/* Uplift callout */}
        {upliftMid > 0 && (
          <div style={{
            background: 'var(--deep)',
            borderRadius: 'var(--r-lg)',
            padding: '20px 28px',
            marginBottom: 32,
            display: 'flex',
            gap: 40,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { val: fmt(selfMid) + '/mo',    key: isEs ? 'Sin gestión' : 'Self-managed',     sub: isEs ? 'ingresos brutos' : 'gross revenue' },
              { val: '→',                     key: '',                                          sub: '' },
              { val: fmt(netMid) + '/mo',      key: isEs ? 'Con PlayaStays' : 'With PlayaStays', sub: isEs ? 'ingresos netos' : 'net to you' },
              { val: '+' + fmt(upliftMid),     key: isEs ? `+${upliftPct}% de uplift` : `+${upliftPct}% uplift`, sub: isEs ? 'ingresos extra al mes' : 'extra income per month' },
            ].map((s, i) => s.val === '→' ? (
              <div key={i} style={{ fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 200 }}>→</div>
            ) : (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem,3vw,2rem)',
                  fontWeight: 700,
                  color: i === 2 || i === 3 ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                  lineHeight: 1,
                }}>
                  {s.val}
                </div>
                {s.key && (
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {s.key}
                  </div>
                )}
                {s.sub && (
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                    {s.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Comparison table */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3,
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--sh-sm)',
        }}>
          {/* Column headers */}
          <div style={{
            background: 'var(--mid)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: '1rem' }}>😰</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--white)' }}>
              {isEs ? 'Auto-gestionado' : 'Self-managed'}
            </span>
          </div>
          <div style={{
            background: 'var(--teal)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: '1rem' }}>✦</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--white)' }}>
              {isEs ? 'PlayaStays' : 'PlayaStays'}
            </span>
          </div>

          {/* Row pairs */}
          {selfRows.map((row, i) => {
            const psRow = psRows[i]
            const isLast = i === selfRows.length - 1
            const isFirst = i === 0
            return [
              // Self column
              <div key={`self-${i}`} style={{
                background: 'var(--white)',
                padding: '13px 20px',
                borderBottom: isLast ? 'none' : '1px solid var(--sand)',
                borderBottomLeftRadius: isLast ? 'var(--r-lg)' : 0,
              }}>
                <div style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--light)', marginBottom: 3 }}>
                  {row.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.2 }}>
                  {row.val}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--light)', marginTop: 2 }}>
                  {row.note}
                </div>
              </div>,

              // PlayaStays column
              <div key={`ps-${i}`} style={{
                background: isFirst ? 'rgba(24,104,112,0.06)' : 'var(--white)',
                padding: '13px 20px',
                borderBottom: isLast ? 'none' : '1px solid var(--sand)',
                borderLeft: '2px solid var(--teal)',
                borderBottomRightRadius: isLast ? 'var(--r-lg)' : 0,
              }}>
                <div style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--light)', marginBottom: 3 }}>
                  {psRow.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: isFirst ? 'var(--teal)' : 'var(--charcoal)',
                  lineHeight: 1.2,
                }}>
                  {psRow.val}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--light)', marginTop: 2 }}>
                  {psRow.note}
                </div>
              </div>,
            ]
          })}
        </div>

        {/* Footer: disclaimer + CTA */}
        <div style={{
          marginTop: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{ fontSize: '0.71rem', color: 'var(--light)', fontStyle: 'italic', maxWidth: 440 }}>
            {demoNote}
          </p>
          <Link href={estimateHref} className="btn btn-gold" style={{ flexShrink: 0 }}>
            {isEs ? 'Calcular mis ingresos →' : 'Calculate my income →'}
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// TrustStack — server component
//
// A compact row of trust signals placed directly above or
// below a primary CTA. No section wrapper — meant to be
// inserted inline near buttons.
//
// Two variants:
//   'row'  — horizontal pill row (hero area, below CTA button)
//   'grid' — 2×2 card grid (pricing page, sidebar)
//
// Used on: hompage (pre-footer), pricing pages (near form),
//          service pages (PM pages, near lead form).
// ============================================================

import type { Locale } from '@/lib/i18n'

interface TrustStackProps {
  locale:   Locale
  variant?: 'row' | 'grid'
  theme?:   'light' | 'dark'
}

interface TrustSignal {
  icon:   string
  textEn: string
  textEs: string
  subEn?: string
  subEs?: string
}

const SIGNALS: TrustSignal[] = [
  {
    icon:   '📍',
    textEn: 'Local team in Playa del Carmen',
    textEs: 'Equipo local en Playa del Carmen',
    subEn:  'On the ground — not remote',
    subEs:  'Presencia local, no remota',
  },
  {
    icon:   '💬',
    textEn: '24/7 guest communication',
    textEs: 'Comunicación con huéspedes 24/7',
    subEn:  'Bilingual, < 5 min response',
    subEs:  'Bilingüe, menos de 5 min',
  },
  {
    icon:   '📊',
    textEn: 'Transparent reporting',
    textEs: 'Reportes transparentes',
    subEn:  'Real-time owner dashboard',
    subEs:  'Portal en tiempo real',
  },
  {
    icon:   '🔍',
    textEn: 'No markup on expenses',
    textEs: 'Sin sobreprecios en gastos',
    subEn:  'Cleaning & supplies at cost',
    subEs:  'Limpieza y suministros al costo',
  },
  {
    icon:   '🔓',
    textEn: '30-day exit, no penalty',
    textEs: '30 días de aviso, sin penalización',
    subEn:  'No lock-in contracts',
    subEs:  'Sin contratos forzosos',
  },
  {
    icon:   '⭐',
    textEn: '4.9★ owner satisfaction',
    textEs: '4.9★ satisfacción del propietario',
    subEn:  'Across 200+ managed properties',
    subEs:  'En más de 200 propiedades',
  },
]

export function TrustStack({
  locale,
  variant = 'row',
  theme   = 'light',
}: TrustStackProps) {
  const isEs   = locale === 'es'
  const isDark = theme === 'dark'

  if (variant === 'row') {
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 12px',
        alignItems: 'center',
      }}>
        {SIGNALS.slice(0, 4).map((s, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 'var(--r-pill)',
            background: isDark
              ? 'rgba(255,255,255,0.07)'
              : 'rgba(24,104,112,0.07)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(24,104,112,0.15)',
          }}>
            <span style={{ fontSize: '0.85rem' }}>{s.icon}</span>
            <span style={{
              fontSize: '0.73rem',
              fontWeight: 600,
              color: isDark ? 'rgba(255,255,255,0.75)' : 'var(--mid)',
              whiteSpace: 'nowrap',
            }}>
              {isEs ? s.textEs : s.textEn}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Grid variant — 2×2 or 3×2 cards with sub-text
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 12,
    }}>
      {SIGNALS.map((s, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          padding: '14px 16px',
          borderRadius: 'var(--r-md)',
          background: isDark
            ? 'rgba(255,255,255,0.05)'
            : 'var(--white)',
          border: isDark
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid var(--sand-dark)',
        }}>
          <span style={{
            fontSize: '1.15rem',
            lineHeight: 1,
            flexShrink: 0,
            marginTop: 2,
          }}>
            {s.icon}
          </span>
          <div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: isDark ? 'var(--white)' : 'var(--charcoal)',
              lineHeight: 1.3,
              marginBottom: 3,
            }}>
              {isEs ? s.textEs : s.textEn}
            </div>
            {(s.subEn || s.subEs) && (
              <div style={{
                fontSize: '0.7rem',
                color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light)',
                lineHeight: 1.4,
              }}>
                {isEs ? s.subEs : s.subEn}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

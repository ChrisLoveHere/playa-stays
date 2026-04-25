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
import styles from './TrustStack.module.css'

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

  // Grid variant — explicit 3×2 on desktop (equal row heights via grid stretch)
  return (
    <div className={styles.trustStackGrid}>
      {SIGNALS.map((s, i) => (
        <div
          key={i}
          className={`${styles.card} ${isDark ? styles.cardDark : ''}`}
        >
          <span
            className={`${styles.iconWrap} ${isDark ? styles.iconWrapDark : ''}`}
            aria-hidden
          >
            {s.icon}
          </span>
          <div className={styles.text}>
            <div
              className={`${styles.title} ${isDark ? styles.titleDark : styles.titleLight}`}
            >
              {isEs ? s.textEs : s.textEn}
            </div>
            {(s.subEn || s.subEs) && (
              <div
                className={`${styles.sub} ${isDark ? styles.subDark : styles.subLight}`}
              >
                {isEs ? s.subEs : s.subEn}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

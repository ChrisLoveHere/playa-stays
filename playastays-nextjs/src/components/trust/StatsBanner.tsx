// ============================================================
// StatsBanner — structural “current truths” (no invented volumes)
// Icons: inline SVG (line style) — 3 items after removing “plan count”
// ============================================================

import type { Locale } from '@/lib/i18n'
import styles from './StatsBanner.module.css'

type Stat = { value: string; label: string }

const STATS: Record<Locale, Stat[]> = {
  en: [
    { value: '8 cities', label: 'Across Quintana Roo' },
    { value: 'Bilingual', label: 'EN + ES guest support' },
    { value: '24/7', label: 'Emergency line included' },
  ],
  es: [
    { value: '8 ciudades', label: 'En todo Quintana Roo' },
    { value: 'Bilingüe', label: 'Soporte EN + ES para huéspedes' },
    { value: '24/7', label: 'Línea de emergencia incluida' },
  ],
}

const ICONS = [StatIconMapPin, StatIconGlobe, StatIconClock] as const

function StatIconMapPin() {
  return (
    <svg
      className={styles.iconSvg}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function StatIconGlobe() {
  return (
    <svg
      className={styles.iconSvg}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  )
}

function StatIconClock() {
  return (
    <svg
      className={styles.iconSvg}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

export function StatsBanner({ locale }: { locale: Locale }) {
  const items = STATS[locale] ?? STATS.en
  return (
    <section className={styles.root} aria-label={locale === 'es' ? 'Datos de PlayaStays' : 'PlayaStays at a glance'}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.grid}>
            {items.map((s, i) => {
              const Icon = ICONS[i] ?? StatIconMapPin
              return (
                <div key={i} className={styles.cell}>
                  <div className={styles.iconWrap} aria-hidden>
                    <Icon />
                  </div>
                  <div className={styles.value}>{s.value}</div>
                  <div className={styles.label}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

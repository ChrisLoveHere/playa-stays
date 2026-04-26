// ============================================================
// HomeStatsBanner — reach / trust numbers for homepage
// (Pricing StatsBanner is separate — do not import it here)
// ============================================================

import type { Locale } from '@/lib/i18n'
import styles from './HomeStatsBanner.module.css'

type Stat = { value: string; label: string }

const STATS: Record<Locale, Stat[]> = {
  en: [
    { value: '8 cities', label: 'Across Quintana Roo' },
    { value: 'Bilingual', label: 'EN + ES support' },
    { value: '24/7', label: 'Emergency response' },
    { value: '4.97★', label: 'Avg owner rating' },
  ],
  es: [
    { value: '8 ciudades', label: 'En todo Quintana Roo' },
    { value: 'Bilingüe', label: 'Soporte EN + ES' },
    { value: '24/7', label: 'Respuesta de emergencia' },
    { value: '4.97★', label: 'Calificación promedio' },
  ],
}

const ICONS = [StatIconMap, StatIconGlobe, StatIconClock, StatIconStar] as const

function StatIconMap() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function StatIconGlobe() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  )
}
function StatIconClock() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
function StatIconStar() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function HomeStatsBanner({ locale }: { locale: Locale }) {
  const items = STATS[locale] ?? STATS.en
  return (
    <section className={styles.root} aria-label={locale === 'es' ? 'PlayaStays en cifras' : 'PlayaStays in numbers'}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.grid}>
            {items.map((s, i) => {
              const Icon = ICONS[i] ?? StatIconMap
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

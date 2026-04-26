// ============================================================
// StatsBanner — structural “current truths” (no invented volumes)
// ============================================================

import type { Locale } from '@/lib/i18n'
import styles from './StatsBanner.module.css'

type Stat = { value: string; label: string }

const STATS: Record<Locale, Stat[]> = {
  en: [
    { value: '8 cities', label: 'Across Quintana Roo' },
    { value: '4 plan options', label: 'Performance-based pricing' },
    { value: 'Bilingual', label: 'EN + ES guest support' },
    { value: '24/7', label: 'Emergency line included' },
  ],
  es: [
    { value: '8 ciudades', label: 'En todo Quintana Roo' },
    { value: '4 niveles de plan', label: 'Precios basados en desempeño' },
    { value: 'Bilingüe', label: 'Soporte EN + ES para huéspedes' },
    { value: '24/7', label: 'Línea de emergencia incluida' },
  ],
}

export function StatsBanner({ locale }: { locale: Locale }) {
  const items = STATS[locale] ?? STATS.en
  return (
    <section className="pad-lg bg-deep" aria-label={locale === 'es' ? 'Datos de PlayaStays' : 'PlayaStays at a glance'}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.grid}>
            {items.map((s, i) => (
              <div key={i} className={styles.cell}>
                <div className={styles.value}>{s.value}</div>
                <div className={styles.label}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import type { Locale } from '@/lib/i18n'
import styles from './TestimonialPlaceholder.module.css'

export function TestimonialPlaceholder({
  locale,
  headingOverride,
}: {
  locale: Locale
  headingOverride?: string
}) {
  const isEs = locale === 'es'
  const heading =
    headingOverride ?? (isEs ? 'Conversaciones reales, resultados reales.' : 'Real conversations, real outcomes.')

  return (
    <section className={`pad-lg bg-white ${styles.section}`} aria-label={heading}>
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow">{isEs ? 'LO QUE DICEN LOS PROPIETARIOS' : 'WHAT OWNERS SAY'}</div>
          <h2 className={styles.heading}>{heading}</h2>
        </div>
        {/* TODO: Replace with real owner testimonial when available. Pattern matches /pricing-page testimonial component. */}
        <div className={styles.card}>
          <div className={styles.avatar} aria-hidden />
          <div className={styles.body}>
            <p className={styles.quote}>
              {isEs
                ? 'Testimonial próximamente — estamos recopilando historias frescas de propietarios actuales.'
                : "Testimonial coming soon — we're collecting fresh stories from current owners."}
            </p>
            <p className={styles.attrib}>
              {isEs ? 'Próximamente — Propietario, Quintana Roo' : 'Coming soon — Owner, Quintana Roo'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

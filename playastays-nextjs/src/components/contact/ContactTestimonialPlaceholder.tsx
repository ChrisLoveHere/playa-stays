import type { Locale } from '@/lib/i18n'
import styles from './ContactTestimonialPlaceholder.module.css'

export function ContactTestimonialPlaceholder({
  locale,
  heading,
}: {
  locale: Locale
  heading: string
}) {
  const isEs = locale === 'es'

  return (
    <section className={`pad-lg bg-white ${styles.section}`} aria-label={heading}>
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow">{isEs ? 'LO QUE DICEN LOS PROPIETARIOS' : 'WHAT OWNERS SAY'}</div>
          <h2 className={styles.heading}>{heading}</h2>
        </div>
        {/* TODO: Replace with real owner testimonial when available. Component pattern matches /pricing-page testimonial. */}
        <div className={styles.card}>
          <div className={styles.avatar} aria-hidden />
          <div className={styles.body}>
            <p className={styles.quote}>
              {isEs
                ? 'Testimonial próximamente — estamos recopilando historias frescas de propietarios actuales.'
                : "Testimonial coming soon — we're collecting fresh stories from current owners."}
            </p>
            <p className={styles.attrib}>
              {isEs
                ? 'Próximamente — Propietario, Quintana Roo'
                : 'Coming soon — Owner, Quintana Roo'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

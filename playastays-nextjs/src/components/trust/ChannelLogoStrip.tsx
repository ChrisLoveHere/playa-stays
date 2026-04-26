// ============================================================
// ChannelLogoStrip — distribution partners (text wordmarks;
// drop in /public/ SVG logos later if desired)
// ============================================================

import type { Locale } from '@/lib/i18n'
import styles from './ChannelLogoStrip.module.css'

const COPY: Record<Locale, { heading: string; aria: string }> = {
  en: {
    heading: 'We list your property on the platforms guests trust',
    aria: 'Booking platforms we list on',
  },
  es: {
    heading: 'Listamos tu propiedad en las plataformas que los huéspedes conocen',
    aria: 'Plataformas de reservas en las que publicamos',
  },
}

export function ChannelLogoStrip({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  return (
    <section className="pad-lg bg-ivory" aria-label={c.aria}>
      <div className="container">
        <div className={styles.wrap}>
          <h2 className={styles.heading}>{c.heading}</h2>
          <ul className={styles.logos} aria-label={c.aria}>
            <li className={styles.wordmark}>airbnb</li>
            <li className={`${styles.wordmark} ${styles.wordmarkVrbo}`}>vrbo</li>
            <li className={`${styles.wordmark} ${styles.wordmarkBooking}`}>Booking.com</li>
            <li className={`${styles.wordmark} ${styles.wordmarkExpedia}`}>Expedia</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

// Homepage channel logos — do not import pricing ChannelLogoStrip
import type { Locale } from '@/lib/i18n'
import styles from './HomeChannelLogoStrip.module.css'

const COPY: Record<Locale, { heading: string; aria: string }> = {
  en: {
    heading: 'List your property where guests are already searching',
    aria: 'Booking platforms we list on',
  },
  es: {
    heading: 'Lista tu propiedad donde los huéspedes ya están buscando',
    aria: 'Plataformas de reservas en las que publicamos',
  },
}

export function HomeChannelLogoStrip({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  return (
    <section className={styles.root} aria-label={c.aria}>
      <div className="container">
        <div className={styles.wrap}>
          <h2 className={styles.heading}>{c.heading}</h2>
          <div className={styles.band}>
            <ul className={styles.logos} aria-label={c.aria}>
              <li className={`${styles.wordmark} ${styles.wordmarkAirbnb}`}>Airbnb</li>
              <li className={`${styles.wordmark} ${styles.wordmarkVrbo}`}>VRBO</li>
              <li className={`${styles.wordmark} ${styles.wordmarkBooking}`}>Booking.com</li>
              <li className={`${styles.wordmark} ${styles.wordmarkExpedia}`}>Expedia</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

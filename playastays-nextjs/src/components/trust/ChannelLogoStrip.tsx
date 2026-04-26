// ============================================================
// ChannelLogoStrip — OTA wordmarks in brand-approximate colors
// (replace with /public/ SVGs when you have brand kit assets)
// ============================================================

import type { Locale } from '@/lib/i18n'
import styles from './ChannelLogoStrip.module.css'

const COPY: Record<Locale, { heading: string; bridge: string; aria: string }> = {
  en: {
    heading: 'We list your property on the platforms guests trust',
    bridge:
      'From your first live listing to a guest-ready turnover, the same care runs through every plan — it starts on the major booking channels and continues with the work behind each stay.',
    aria: 'Booking platforms we list on',
  },
  es: {
    heading: 'Listamos tu propiedad en las plataformas que los huéspedes conocen',
    bridge:
      'Desde que tu anuncio está en línea hasta la entrega lista para el huésped, el mismo cuidado atraviesa cada plan: empieza en los canales de reservas principales y sigue con el trabajo detrás de cada estancia.',
    aria: 'Plataformas de reservas en las que publicamos',
  },
}

export function ChannelLogoStrip({ locale }: { locale: Locale }) {
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
          <p className={styles.bridge}>{c.bridge}</p>
        </div>
      </div>
    </section>
  )
}

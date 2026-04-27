import { SITE_BUSINESS_ADDRESS } from '@/lib/site-contact'
import { googleMapsEmbedPlaceSrc, googleMapsPlaceSearchUrl } from '@/lib/google-maps-embed'
import styles from './ContactPageLayout.module.css'

export interface ContactLocationCopy {
  eyebrow: string
  title: string
  lead: string
  mapAriaLabel: string
  directionsLabel: string
}

export function ContactLocationSection({ copy }: { copy: ContactLocationCopy }) {
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY?.trim()
  const mapSrc = embedKey
    ? googleMapsEmbedPlaceSrc(embedKey)
    : `https://www.google.com/maps?q=${encodeURIComponent(SITE_BUSINESS_ADDRESS)}&output=embed`

  return (
    <section className={`${styles.locationSection} pad-md bg-sand`}>
      <div className="container">
        <div className={styles.locationGrid}>
          <div>
            <div className="eyebrow mb-8">{copy.eyebrow}</div>
            <h2 className={`section-title ${styles.locationTitle}`}>{copy.title}</h2>
            <p className={styles.locationLead}>{copy.lead}</p>
            <address className={styles.locationAddress}>{SITE_BUSINESS_ADDRESS}</address>
            <a
              href={googleMapsPlaceSearchUrl()}
              className={styles.locationDirections}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.directionsLabel}
            </a>
          </div>
          <div className={styles.mapShell}>
            <div className={styles.mapFrame}>
              <iframe
                title={copy.mapAriaLabel}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

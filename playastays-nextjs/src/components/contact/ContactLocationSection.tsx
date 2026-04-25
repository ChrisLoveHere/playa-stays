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
  const gridClass = embedKey ? styles.locationGrid : styles.locationGridSingle

  return (
    <section className={`${styles.locationSection} pad-md bg-sand`}>
      <div className="container">
        <div className={gridClass}>
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
          {embedKey ? (
            <div className={styles.mapShell}>
              <div className={styles.mapFrame}>
                <iframe
                  title={copy.mapAriaLabel}
                  src={googleMapsEmbedPlaceSrc(embedKey)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

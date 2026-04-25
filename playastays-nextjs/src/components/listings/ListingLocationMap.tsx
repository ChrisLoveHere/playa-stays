'use client'

import type { ListingMapResolution } from '@/lib/listing-map-embed'
import styles from './ListingLocationMap.module.css'

interface Props {
  resolution: ListingMapResolution
}

/**
 * Compact Maps Embed iframe + external link for property detail pages.
 * Resolution is computed server-side; no API calls in the browser.
 */
export function ListingLocationMap({ resolution }: Props) {
  const {
    showIframe,
    embedSrc,
    mapsUrl,
    subline,
    privacyNote,
    iframeTitle,
    openInMapsLabel,
  } = resolution

  return (
    <div className={styles.wrap}>
      {subline ? <p className={styles.subline}>{subline}</p> : null}
      {privacyNote ? <p className={styles.privacy}>{privacyNote}</p> : null}

      {showIframe && embedSrc ? (
        <div className={styles.frame}>
          <iframe
            title={iframeTitle}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className={styles.iframe}
          />
        </div>
      ) : null}

      <p className={styles.mapsLink}>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapsAnchor}>
          {openInMapsLabel}
        </a>
      </p>
    </div>
  )
}

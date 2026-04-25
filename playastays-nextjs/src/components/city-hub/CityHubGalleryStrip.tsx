// ============================================================
// Compact horizontal gallery for city hub — neighborhoods / insights
// ============================================================

import type { CityHubImageAsset } from '@/content/city-hubs/types'

interface CityHubGalleryStripProps {
  images: CityHubImageAsset[] | undefined
  /** Accessible name for the strip (locale-specific from template) */
  ariaLabel: string
  className?: string
}

export function CityHubGalleryStrip({ images, ariaLabel, className }: CityHubGalleryStripProps) {
  if (!images?.length) return null
  return (
    <div
      className={['city-hub-gallery-strip', className].filter(Boolean).join(' ')}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="city-hub-gallery-strip__track">
        {images.map((img, i) => (
          <figure key={`${img.src}-${i}`} className="city-hub-gallery-strip__cell">
            <img src={img.src} alt={img.alt} loading="lazy" decoding="async" sizes="(max-width: 640px) 50vw, 25vw" />
          </figure>
        ))}
      </div>
    </div>
  )
}

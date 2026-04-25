// ============================================================
// Lightweight iframe map — OSM / Google embed URL from content model
// ============================================================

interface CityHubMapEmbedProps {
  embedUrl: string
  /** iframe title — must be meaningful for a11y (locale-specific) */
  frameTitle: string
  caption?: string
}

export function CityHubMapEmbed({ embedUrl, frameTitle, caption }: CityHubMapEmbedProps) {
  return (
    <figure className="city-hub-map-embed">
      <div className="city-hub-map-embed__frame">
        <iframe
          title={frameTitle}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {caption ? <figcaption className="city-hub-map-embed__caption">{caption}</figcaption> : null}
    </figure>
  )
}

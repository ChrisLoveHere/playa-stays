import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { PropertyCard } from '@/components/content/Cards'

export function RelatedListings({
  properties,
  locale = 'en',
}: {
  properties: Property[]
  locale?: Locale
}) {
  if (!properties.length) return null
  const ui = t(locale)
  return (
    <section className="pad-lg bg-sand">
      <div className="container">
        <h2
          className="section-title mt-12 mb-24"
          style={{ fontSize: 'clamp(1.45rem,2.5vw,2rem)' }}
        >
          {ui.browseRelatedTitle}
        </h2>
        <div className="listings-grid">
          {properties.map(p => (
            <PropertyCard key={p.id} property={p} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}

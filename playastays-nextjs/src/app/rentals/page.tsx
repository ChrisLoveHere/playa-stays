import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { buildMetadata } from '@/lib/seo'
import { RentalCategoryTemplate } from '@/components/templates/RentalCategoryTemplate'
import { loadBrowseProperties } from '@/lib/property-browse'
import { getCitiesForNavigation } from '@/lib/wordpress'

export const revalidate = 1800

export const metadata: Metadata = buildMetadata({
  title: 'Vacation Rentals in Playa del Carmen | PlayaStays',
  description: 'Browse professionally managed vacation rentals across Quintana Roo. All properties managed by PlayaStays\' local team. Verified listings, bilingual support.',
  canonical: 'https://www.playastays.com/rentals/',
  hreflangEs: 'https://www.playastays.com/es/rentas/',
})

interface Props {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function RentalsPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()

  const cities = await getCitiesForNavigation(preview)
  const browseCities = cities.map(c => ({ slug: c.slug, name: c.title.rendered }))

  const properties = await loadBrowseProperties(searchParams, {
    citySlug: typeof searchParams.city === 'string' ? searchParams.city : undefined,
    preview,
  })

  return (
    <RentalCategoryTemplate
      title='Vacation Rentals Across <span class="rentals-search-hero__accent">Quintana Roo</span>'
      tag=""
      description="Browse professionally managed vacation rentals, monthly stays, long-term rentals, and properties for sale across Playa del Carmen, Tulum, and Riviera Maya destinations."
      canonicalHref="/rentals/"
      properties={properties}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Rentals', href: null },
      ]}
      browseCities={browseCities}
      browseLayout="search-led"
    />
  )
}

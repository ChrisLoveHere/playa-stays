import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getProperties } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { RentalCategoryTemplate } from '@/components/templates/RentalCategoryTemplate'

export const revalidate = 1800

export const metadata: Metadata = buildMetadata({
  title: 'Vacation Rentals in Playa del Carmen | PlayaStays',
  description: 'Browse professionally managed vacation rentals across Quintana Roo. All properties managed by PlayaStays\' local team. Verified listings, bilingual support.',
  canonical: 'https://www.playastays.com/rentals/',
  hreflangEs: 'https://www.playastays.com/es/rentas-vacacionales/',
})

interface Props {
  searchParams: {
    bedrooms?: string
    type?:     string
    feature?:  string | string[]
    city?:     string
    sort?:     string
  }
}

export default async function RentalsPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()

  const features = Array.isArray(searchParams.feature)
    ? searchParams.feature
    : searchParams.feature ? [searchParams.feature] : []

  const properties = await getProperties({
    bedrooms:     searchParams.bedrooms,
    propertyType: searchParams.type,
    feature:      features[0],       // WP REST supports one feature filter at a time
    citySlug:     searchParams.city,
    perPage:      18,
    preview,
  })

  return (
    <RentalCategoryTemplate
      title="Vacation Rentals Across Quintana Roo"
      tag="🏖️ PlayaStays Managed Rentals"
      description="Browse professionally managed vacation rentals in Playa del Carmen, Tulum, Akumal, and beyond. Every property is managed by our local bilingual team."
      canonicalHref="/rentals/"
      properties={properties}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Rentals', href: null },
      ]}
      stats={[
        { val: '200+', key: 'Properties managed' },
        { val: '4.97★', key: 'Avg. rating' },
        { val: '6',     key: 'Cities' },
        { val: '24/7',  key: 'Guest support' },
      ]}
    />
  )
}

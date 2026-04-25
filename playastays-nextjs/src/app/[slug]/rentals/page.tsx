import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCitySlugs, getCity, getCitiesForNavigation } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { RentalCategoryTemplate } from '@/components/templates/RentalCategoryTemplate'
import { loadBrowseProperties } from '@/lib/property-browse'

export const revalidate = 1800

export const dynamicParams = true

export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  return citySlugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const city = await getCity(params.slug)
  if (!city) return {}
  const name = city.title.rendered
  return buildMetadata({
    title: `Vacation Rentals in ${name} | PlayaStays`,
    description:
      city.meta.ps_seo_desc ||
      `Browse professionally managed vacation rentals in ${name}. All properties managed by PlayaStays' local team.`,
    canonical: `https://www.playastays.com/${params.slug}/rentals/`,
    hreflangEs: `https://www.playastays.com/es/${params.slug}/rentas/`,
  })
}

interface Props {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function CityRentalsPage({ params, searchParams }: Props) {
  const { isEnabled: preview } = draftMode()

  const city = await getCity(params.slug, preview)
  if (!city) notFound()

  const cities = await getCitiesForNavigation(preview)
  const browseCities = cities.map(c => ({ slug: c.slug, name: c.title.rendered }))

  const properties = await loadBrowseProperties(searchParams, {
    citySlug: params.slug,
    preview,
  })

  const name = city.title.rendered

  return (
    <RentalCategoryTemplate
      title={`Vacation Rentals in ${name}`}
      tag="🏖️ PlayaStays Managed Rentals"
      description={`Browse professionally managed vacation rentals in ${name}. Every listing is managed by our local bilingual team.`}
      canonicalHref={`/${params.slug}/rentals/`}
      properties={properties}
      city={city}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: name, href: `/${params.slug}/` },
        { label: 'Rentals', href: null },
      ]}
      stats={[
        { val: '4.97★', key: 'Avg. rating' },
        { val: '6', key: 'Cities' },
        { val: '24/7', key: 'Guest support' },
      ]}
      browseCities={browseCities}
    />
  )
}

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCities, getCitySlugs, getCity, getServices, getProperties } from '@/lib/wordpress'
import { cityMetadata } from '@/lib/seo'
import { CityHubTemplate } from '@/components/templates/CityHubTemplate'

export const revalidate = 86400

export async function generateStaticParams() {
  const slugs = await getCitySlugs()
  return slugs.map(city => ({ city }))
}

export async function generateMetadata(
  { params }: { params: { city: string } }
): Promise<Metadata> {
  const city = await getCity(params.city)
  if (!city) return {}
  return cityMetadata(city)
}

export default async function CityPage(
  { params }: { params: { city: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [city, services, allCities, properties] = await Promise.all([
    getCity(params.city, preview),
    getServices({ citySlug: params.city, preview }),
    getCities(preview),
    getProperties({ citySlug: params.city, perPage: 100, preview }),
  ])

  if (!city) notFound()

  return (
    <CityHubTemplate
      city={city}
      services={services}
      allCities={allCities}
      properties={properties}
    />
  )
}

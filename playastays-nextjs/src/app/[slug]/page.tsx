import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getCitiesForNavigation,
  getCitySlugs,
  getCity,
  getServices,
  getProperties,
  getFAQs,
  getSiteConfig,
} from '@/lib/wordpress'
import { cityMetadata, serviceHubMetadata } from '@/lib/seo'
import { CityHubTemplate } from '@/components/templates/CityHubTemplate'
import { ServiceHubTemplate } from '@/components/templates/ServiceHubTemplate'
import {
  SERVICE_HUB_IDS,
  isServiceHubEnSegment,
  type ServiceHubId,
} from '@/lib/service-hub-routes'

export const revalidate = 86400

/** Allow city/hub URLs not listed at build time (new WP cities, previews). */
export const dynamicParams = true

export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  const map = new Map<string, { slug: string }>()
  for (const s of citySlugs) map.set(s, { slug: s })
  for (const h of SERVICE_HUB_IDS) map.set(h, { slug: h })
  return Array.from(map.values())
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const { slug } = params
  if (isServiceHubEnSegment(slug)) {
    return serviceHubMetadata(slug as ServiceHubId, 'en')
  }
  const city = await getCity(slug)
  if (!city) {
    return { title: 'Not found | PlayaStays', robots: { index: false, follow: false } }
  }
  return cityMetadata(city)
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { isEnabled: preview } = draftMode()
  const slug = typeof params.slug === 'string' ? params.slug.trim() : ''
  if (!slug) notFound()

  if (isServiceHubEnSegment(slug)) {
    const hubId = slug as ServiceHubId
    const [hubCities, siteConfig] = await Promise.all([
      getCitiesForNavigation(preview),
      getSiteConfig(),
    ])
    return (
      <ServiceHubTemplate
        hubId={hubId}
        cities={hubCities}
        siteConfig={siteConfig}
        locale="en"
      />
    )
  }

  const [city, services, allCities, properties, faqs, siteConfig] = await Promise.all([
    getCity(slug, preview),
    getServices({ citySlug: slug, preview }),
    getCitiesForNavigation(preview),
    getProperties({ citySlug: slug, perPage: 100, preview }),
    getFAQs({ citySlug: slug, preview }),
    getSiteConfig(),
  ])

  if (!city) notFound()

  return (
    <CityHubTemplate
      city={city}
      services={services}
      allCities={allCities}
      properties={properties}
      faqs={faqs}
      siteConfig={siteConfig}
    />
  )
}

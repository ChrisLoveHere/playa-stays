// ============================================================
// /es/[slug]/page.tsx
//
// Spanish city hub OR top-level service hub:
//   /es/playa-del-carmen/ … /es/administracion-de-propiedades/
// City slugs match EN; hub segments are ES (SERVICE_HUB_ES_TO_EN).
// ============================================================

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
import { buildMetadata, serviceHubMetadata } from '@/lib/seo'
import { CityHubTemplate } from '@/components/templates/CityHubTemplate'
import { ServiceHubTemplate } from '@/components/templates/ServiceHubTemplate'
import {
  SERVICE_HUB_ES_TO_EN,
  isServiceHubEsSegment,
  type ServiceHubId,
} from '@/lib/service-hub-routes'

export const revalidate = 86400

export const dynamicParams = true

export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  const map = new Map<string, { slug: string }>()
  for (const s of citySlugs) map.set(s, { slug: s })
  for (const esSeg of Object.keys(SERVICE_HUB_ES_TO_EN)) {
    map.set(esSeg, { slug: esSeg })
  }
  return Array.from(map.values())
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const { slug } = params

  if (isServiceHubEsSegment(slug)) {
    const hubId = SERVICE_HUB_ES_TO_EN[slug]
    return serviceHubMetadata(hubId, 'es')
  }

  const city = await getCity(slug)
  if (!city) {
    return { title: 'Not found | PlayaStays', robots: { index: false, follow: false } }
  }

  const cityName = city.title.rendered
  const hasSeoTitle = Boolean(city.meta.ps_title_es)
  const canonical = `https://www.playastays.com/es/${slug}/`
  const enHref = `https://www.playastays.com/${slug}/`

  if (!hasSeoTitle) {
    return buildMetadata({
      title: `Administración de Propiedades en ${cityName} | PlayaStays`,
      description:
        city.excerpt.rendered.replace(/<[^>]*>/g, '') ||
        `Gestión profesional de rentas vacacionales en ${cityName}.`,
      canonical,
      noindex: true,
    })
  }

  return buildMetadata({
    title: city.meta.ps_title_es || `Administración de Propiedades en ${cityName} | PlayaStays`,
    description:
      city.meta.ps_excerpt_es ||
      city.meta.ps_seo_desc ||
      `Gestión profesional de rentas vacacionales en ${cityName}. Equipo local. Ingresos máximos. Estimado gratis.`,
    canonical,
    hreflangEn: enHref,
  })
}

export default async function EsSlugPage({ params }: { params: { slug: string } }) {
  const { isEnabled: preview } = draftMode()
  const slug = typeof params.slug === 'string' ? params.slug.trim() : ''
  if (!slug) notFound()

  if (isServiceHubEsSegment(slug)) {
    const hubId = SERVICE_HUB_ES_TO_EN[slug] as ServiceHubId
    const [hubCities, siteConfig] = await Promise.all([
      getCitiesForNavigation(preview),
      getSiteConfig(),
    ])
    return (
      <ServiceHubTemplate
        hubId={hubId}
        cities={hubCities}
        siteConfig={siteConfig}
        locale="es"
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
      locale="es"
    />
  )
}

// ============================================================
// /es/[ciudad]/page.tsx
//
// Spanish city hub pages:
//   /es/playa-del-carmen/
//   /es/tulum/
//   /es/akumal/
//   /es/puerto-morelos/
//   /es/xpu-ha/
//   /es/chetumal/
//
// [ciudad] slugs are identical to EN slugs — the WP data
// layer is slug-agnostic; locale="es" flips template copy.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCities, getCitySlugs, getCity, getServices, getProperties } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { CityHubTemplate } from '@/components/templates/CityHubTemplate'

export const revalidate = 86400

export async function generateStaticParams() {
  const slugs = await getCitySlugs()
  return slugs.map(ciudad => ({ ciudad }))
}

export async function generateMetadata(
  { params }: { params: { ciudad: string } }
): Promise<Metadata> {
  const city = await getCity(params.ciudad)
  if (!city) return {}

  const cityName   = city.title.rendered
  const hasSeoTitle = Boolean(city.meta.ps_title_es)
  const canonical   = `https://www.playastays.com/es/${params.ciudad}/`
  const enHref      = `https://www.playastays.com/${params.ciudad}/`

  if (!hasSeoTitle) {
    return buildMetadata({
      title:    `Administración de Propiedades en ${cityName} | PlayaStays`,
      description: city.excerpt.rendered.replace(/<[^>]*>/g, '') || `Gestión profesional de rentas vacacionales en ${cityName}.`,
      canonical,
      noindex: true,
    })
  }

  return buildMetadata({
    title:    city.meta.ps_title_es || `Administración de Propiedades en ${cityName} | PlayaStays`,
    description: city.meta.ps_excerpt_es || city.meta.ps_seo_desc || `Gestión profesional de rentas vacacionales en ${cityName}. Equipo local. Ingresos máximos. Estimado gratis.`,
    canonical,
    hreflangEn: enHref,
  })
}

export default async function EsCityPage(
  { params }: { params: { ciudad: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [city, services, allCities, properties] = await Promise.all([
    getCity(params.ciudad, preview),
    getServices({ citySlug: params.ciudad, preview }),
    getCities(preview),
    getProperties({ citySlug: params.ciudad, perPage: 100, preview }),
  ])

  if (!city) notFound()

  return (
    <CityHubTemplate
      city={city}
      services={services}
      allCities={allCities}
      properties={properties}
      locale="es"
    />
  )
}

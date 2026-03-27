// ============================================================
// /es/[ciudad]/costo-administracion-propiedades/page.tsx
//
// Dynamic route — one file handles all 6 cities in Spanish:
//   /es/playa-del-carmen/costo-administracion-propiedades/
//   /es/tulum/costo-administracion-propiedades/
//   /es/akumal/costo-administracion-propiedades/
//   /es/puerto-morelos/costo-administracion-propiedades/
//   /es/xpu-ha/costo-administracion-propiedades/
//   /es/chetumal/costo-administracion-propiedades/
//
// [ciudad] captures the city slug (same slug in EN and ES —
// city slugs are identical across both languages per architecture).
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCitySlugs, getCity, getProperties } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { esRouteToEn } from '@/lib/i18n'
import { CITY_PRICING } from '@/lib/pricing-data'
import { PricingTemplate } from '@/components/templates/PricingTemplate'

export const revalidate = 86400

// Ciudad slugs are identical to EN city slugs
export async function generateStaticParams() {
  const slugs = await getCitySlugs()
  return slugs.map(ciudad => ({ ciudad }))
}

export async function generateMetadata(
  { params }: { params: { ciudad: string } }
): Promise<Metadata> {
  const city = await getCity(params.ciudad)
  if (!city) return {}

  const cityName  = city.title.rendered
  const canonical = `https://www.playastays.com/es/${params.ciudad}/costo-administracion-propiedades/`
  const enPath    = esRouteToEn(`/es/${params.ciudad}/costo-administracion-propiedades/`)

  // Check for ES SEO fields — noindex if missing (per architecture §6)
  const hasSeoTitle = Boolean(city.meta.ps_title_es)
  if (!hasSeoTitle) {
    // Missing ES SEO fields — noindex until editor fills them in.
    // No hreflang on noindex pages (prevents Google confusion).
    return buildMetadata({
      title: `Costo Administración Propiedades en ${cityName} | PlayaStays`,
      description: `Administración de propiedades en ${cityName} cuesta entre el 10% y el 25% de los ingresos brutos.`,
      canonical,
      noindex: true,
    })
  }

  return buildMetadata({
    title: `Costo de Administración de Propiedades en ${cityName} — Tarifas y Precios | PlayaStays`,
    description: `La administración de propiedades en ${cityName} cuesta entre el 10% y el 25% de los ingresos brutos. Ve ejemplos de ingresos reales y cómo la gestión profesional aumenta tus ganancias netas.`,
    canonical,
    // hreflangEn triggers the "ES page" branch in buildMetadata:
    // sets hreflang en → EN URL, hreflang es-MX → canonical (this ES page), x-default → EN URL
    hreflangEn: `https://www.playastays.com${enPath}`,
  })
}

export default async function EsCityPricingPage(
  { params }: { params: { ciudad: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [city, properties] = await Promise.all([
    getCity(params.ciudad, preview),
    getProperties({ citySlug: params.ciudad, perPage: 100, preview }),
  ])
  if (!city) notFound()

  const cityData = CITY_PRICING[params.ciudad]
  if (!cityData) notFound()

  const cityName = city.title.rendered

  const breadcrumbs = [
    { label: 'Inicio', href: '/es/' },
    { label: cityName, href: `/es/${params.ciudad}/` },
    { label: 'Precios de administración', href: null },
  ]

  return (
    <PricingTemplate
      locale="es"
      city={city}
      cityData={cityData}
      breadcrumbs={breadcrumbs}
      estimateHref="/es/publica-tu-propiedad/"
      pmPageHref={`/es/${params.ciudad}/administracion-de-propiedades/`}
      properties={properties}
    />
  )
}

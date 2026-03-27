// ============================================================
// /[city]/property-management-cost/page.tsx
//
// Dynamic route — one file handles all 6 cities:
//   /playa-del-carmen/property-management-cost/
//   /tulum/property-management-cost/
//   /akumal/property-management-cost/
//   /puerto-morelos/property-management-cost/
//   /xpu-ha/property-management-cost/
//   /chetumal/property-management-cost/
//
// Rendered at build time via generateStaticParams.
// ISR revalidation: 86400s (city data changes rarely).
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCitySlugs, getCity, getProperties } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { enRouteToEs } from '@/lib/i18n'
import { CITY_PRICING } from '@/lib/pricing-data'
import { PricingTemplate } from '@/components/templates/PricingTemplate'

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

  const cityName = city.title.rendered
  const canonical = `https://www.playastays.com/${params.city}/property-management-cost/`
  const esPath   = enRouteToEs(`/${params.city}/property-management-cost/`)

  return buildMetadata({
    title: `Property Management Cost in ${cityName} — Fees & Pricing | PlayaStays`,
    description: `Property management in ${cityName} costs 10–25% of gross revenue. See real income examples, what's included, and how professional management grows your net income. Free estimate.`,
    canonical,
    hreflangEs: `https://www.playastays.com${esPath}`,
  })
}

export default async function CityPricingPage(
  { params }: { params: { city: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [city, properties] = await Promise.all([
    getCity(params.city, preview),
    getProperties({ citySlug: params.city, perPage: 100, preview }),
  ])
  if (!city) notFound()

  const cityData = CITY_PRICING[params.city]
  if (!cityData) notFound()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: city.title.rendered, href: `/${params.city}/` },
    { label: 'Management Pricing', href: null },
  ]

  return (
    <PricingTemplate
      locale="en"
      city={city}
      cityData={cityData}
      breadcrumbs={breadcrumbs}
      estimateHref="/list-your-property/"
      pmPageHref={`/${params.city}/property-management/`}
      properties={properties}
    />
  )
}

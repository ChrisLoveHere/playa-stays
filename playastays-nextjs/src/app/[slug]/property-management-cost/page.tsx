// ============================================================
// /[slug]/property-management-cost/page.tsx
//
// Dynamic route — one file per city slug from WP (pricing data in CITY_PRICING), e.g.:
//   /playa-del-carmen/property-management-cost/
//   /tulum/ … /cozumel/ … /isla-mujeres/ … /chetumal/ …
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

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getCitySlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const city = await getCity(params.slug)
  if (!city) return {}

  const cityName = city.title.rendered
  const canonical = `https://www.playastays.com/${params.slug}/property-management-cost/`
  const esPath   = enRouteToEs(`/${params.slug}/property-management-cost/`)

  return buildMetadata({
    title: `Property Management Cost in ${cityName} — Fees & Pricing`,
    description: `Property management in ${cityName} costs 10–25% of gross revenue. See real income examples, what affects your fee in this market, and how professional management grows net income. Free estimate.`,
    canonical,
    hreflangEs: `https://www.playastays.com${esPath}`,
  })
}

export default async function CityPricingPage(
  { params }: { params: { slug: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [city, properties] = await Promise.all([
    getCity(params.slug, preview),
    getProperties({ citySlug: params.slug, perPage: 100, preview }),
  ])
  if (!city) notFound()

  const cityData = CITY_PRICING[params.slug]
  if (!cityData) notFound()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Management pricing', href: '/property-management-pricing/' },
    { label: city.title.rendered, href: `/${params.slug}/` },
    { label: 'Fees & pricing', href: null },
  ]

  return (
    <PricingTemplate
      locale="en"
      city={city}
      cityData={cityData}
      breadcrumbs={breadcrumbs}
      estimateHref="/list-your-property/"
      pmPageHref={`/${params.slug}/property-management/`}
      properties={properties}
    />
  )
}

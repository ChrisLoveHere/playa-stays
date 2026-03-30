// ============================================================
// /es/[ciudad]/[servicio]/page.tsx
//
// Spanish service pages — 42 pages via two dynamic segments:
//   /es/playa-del-carmen/administracion-de-propiedades/
//   /es/playa-del-carmen/administracion-airbnb/
//   /es/tulum/rentas-vacacionales/
//   … etc (6 cities × 7 services)
//
// KEY: [servicio] is a Spanish slug. We translate it to the
// canonical EN slug before querying WP, which always stores
// data keyed by EN service slug.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getCitySlugs, getCity, getService,
  getServices, getFAQs, getTestimonials,
} from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { SERVICE_SLUG_ES_TO_EN, ES_SERVICE_SLUGS } from '@/lib/i18n'
import { ServicePageTemplate } from '@/components/templates/ServicePageTemplate'

export const revalidate = 86400

// Build all ciudad × servicio combinations at build time
export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  return citySlugs.flatMap(ciudad =>
    ES_SERVICE_SLUGS.map(servicio => ({ ciudad, servicio }))
  )
}

export async function generateMetadata(
  { params }: { params: { ciudad: string; servicio: string } }
): Promise<Metadata> {
  const enServiceSlug = SERVICE_SLUG_ES_TO_EN[params.servicio]
  if (!enServiceSlug) return {}

  const [city, service] = await Promise.all([
    getCity(params.ciudad),
    getService(params.ciudad, enServiceSlug),
  ])
  if (!city || !service) return {}

  const canonical  = `https://www.playastays.com/es/${params.ciudad}/${params.servicio}/`
  const enHref     = `https://www.playastays.com/${params.ciudad}/${enServiceSlug}/`
  const meta = service.meta as any
  const hasSeoEs = Boolean(meta.ps_seo_title_es || meta.ps_hero_headline_es)

  if (!hasSeoEs) {
    return buildMetadata({
      title:       service.title.rendered,
      description: service.excerpt.rendered.replace(/<[^>]*>/g, ''),
      canonical,
      noindex: true,
    })
  }

  return buildMetadata({
    title:       meta.ps_seo_title_es || `${meta.ps_hero_headline_es} | PlayaStays`,
    description: service.meta.ps_seo_desc || meta.ps_hero_subheadline_es || service.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical,
    hreflangEn: enHref,
  })
}

export default async function EsServicePage(
  { params }: { params: { ciudad: string; servicio: string } }
) {
  const { isEnabled: preview } = draftMode()

  // Translate ES slug → EN slug for WP query
  const enServiceSlug = SERVICE_SLUG_ES_TO_EN[params.servicio]
  if (!enServiceSlug) notFound()

  const [city, service] = await Promise.all([
    getCity(params.ciudad, preview),
    getService(params.ciudad, enServiceSlug, preview),
  ])
  if (!city || !service) notFound()

  const [faqs, testimonials, allCityServices] = await Promise.all([
    getFAQs({ serviceSlug: enServiceSlug, citySlug: params.ciudad, preview }),
    getTestimonials({ serviceId: service.id, preview }),
    getServices({ citySlug: params.ciudad, preview }),
  ])

  const relatedServices = allCityServices
    .filter(s => s.meta.ps_service_slug !== enServiceSlug)
    .slice(0, 4)

  return (
    <ServicePageTemplate
      city={city}
      service={service}
      faqs={faqs}
      testimonials={testimonials}
      relatedServices={relatedServices}
      locale="es"
    />
  )
}

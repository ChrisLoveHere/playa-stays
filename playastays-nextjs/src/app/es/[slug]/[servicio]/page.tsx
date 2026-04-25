// ============================================================
// /es/[slug]/[servicio]/page.tsx
// Spanish city × service — ServicePageTemplate for all servicios
// in SERVICE_SLUG_EN_TO_ES.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getCitySlugs, getCity, getService,
  getServices, getFAQs, getTestimonials,
} from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { PLAYA_AIRBNB_SEO } from '@/content/service-pages/playa-del-carmen-airbnb-management'
import { SERVICE_SLUG_EN_TO_ES, SERVICE_SLUG_ES_TO_EN } from '@/lib/i18n'
import * as serviceUrlSlugs from '@/lib/service-url-slugs'
import { ServicePageTemplate } from '@/components/templates/ServicePageTemplate'

export const revalidate = 86400

export const dynamicParams = true

function publicEnFromServicio(servicio: string): string | undefined {
  return SERVICE_SLUG_ES_TO_EN[servicio]
}

export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  const out: { slug: string; servicio: string }[] = []
  for (const slug of citySlugs) {
    const services = await getServices({ citySlug: slug })
    for (const s of services) {
      const ps = s.meta?.ps_service_slug
      const publicEn = ps ? serviceUrlSlugs.publicEnSlugFromPs(ps) : ''
      const servicio = publicEn ? SERVICE_SLUG_EN_TO_ES[publicEn] : undefined
      if (servicio) out.push({ slug, servicio })
    }
  }
  return out
}

export async function generateMetadata(
  { params }: { params: { slug: string; servicio: string } }
): Promise<Metadata> {
  const publicEn = publicEnFromServicio(params.servicio)
  if (!publicEn) return {}
  const psSlug = serviceUrlSlugs.psServiceSlugFromPublicEnSegment(publicEn)

  const [city, service] = await Promise.all([
    getCity(params.slug),
    getService(params.slug, psSlug),
  ])
  if (!city || !service) return {}

  const canonical = `https://www.playastays.com/es/${params.slug}/${params.servicio}/`
  const enHref = `https://www.playastays.com/${params.slug}/${publicEn}/`

  if (params.slug === 'playa-del-carmen' && params.servicio === 'administracion-airbnb') {
    return buildMetadata({
      title: PLAYA_AIRBNB_SEO.es.title,
      description: PLAYA_AIRBNB_SEO.es.description,
      canonical,
      hreflangEn: enHref,
    })
  }

  const meta = service.meta as {
    ps_seo_title_es?: string
    ps_hero_headline_es?: string
    ps_hero_subheadline_es?: string
    ps_seo_desc?: string
  }
  const hasSeoEs = Boolean(meta.ps_seo_title_es || meta.ps_hero_headline_es)

  if (!hasSeoEs) {
    return buildMetadata({
      title: service.title.rendered,
      description: service.excerpt.rendered.replace(/<[^>]*>/g, ''),
      canonical,
      noindex: true,
    })
  }

  return buildMetadata({
    title: meta.ps_seo_title_es || `${meta.ps_hero_headline_es} | PlayaStays`,
    description:
      meta.ps_seo_desc || meta.ps_hero_subheadline_es || service.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical,
    hreflangEn: enHref,
  })
}

export default async function EsServicePage(
  { params }: { params: { slug: string; servicio: string } }
) {
  const { isEnabled: preview } = draftMode()

  const slug = typeof params.slug === 'string' ? params.slug.trim() : ''
  const servicio = typeof params.servicio === 'string' ? params.servicio.trim() : ''
  if (!slug || !servicio) notFound()

  const publicEn = publicEnFromServicio(servicio)
  if (!publicEn) notFound()
  const psSlug = serviceUrlSlugs.psServiceSlugFromPublicEnSegment(publicEn)

  const [city, service] = await Promise.all([
    getCity(slug, preview),
    getService(slug, psSlug, preview),
  ])
  if (!city || !service) notFound()

  const canonicalPs = service.meta.ps_service_slug

  const [faqs, testimonials, allCityServices] = await Promise.all([
    getFAQs({ serviceSlug: canonicalPs, citySlug: slug, preview }),
    getTestimonials({ serviceId: service.id, preview }),
    getServices({ citySlug: slug, preview }),
  ])

  const relatedServices = allCityServices
    .filter(s => s.meta.ps_service_slug !== canonicalPs)
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

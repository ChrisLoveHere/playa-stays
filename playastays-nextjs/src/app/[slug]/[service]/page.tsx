import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getCitySlugs, getCity, getService,
  getServices, getFAQs, getTestimonials,
} from '@/lib/wordpress'
import { buildMetadata, serviceMetadata } from '@/lib/seo'
import { PLAYA_AIRBNB_SEO } from '@/content/service-pages/playa-del-carmen-airbnb-management'
import { SERVICE_SLUG_EN_TO_ES } from '@/lib/i18n'
import { publicEnSlugFromPs, psServiceSlugFromPublicEnSegment } from '@/lib/service-url-slugs'
import { ServicePageTemplate } from '@/components/templates/ServicePageTemplate'

export const revalidate = 86400

export const dynamicParams = true

// Only city × service pairs that exist in WordPress (avoids 404s from empty Cartesian).
export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  const out: { slug: string; service: string }[] = []
  for (const slug of citySlugs) {
    const services = await getServices({ citySlug: slug })
    for (const s of services) {
      const ps = s.meta?.ps_service_slug
      if (ps && SERVICE_SLUG_EN_TO_ES[publicEnSlugFromPs(ps)]) {
        out.push({ slug, service: publicEnSlugFromPs(ps) })
      }
    }
  }
  return out
}

export async function generateMetadata(
  { params }: { params: { slug: string; service: string } }
): Promise<Metadata> {
  const psSlug = psServiceSlugFromPublicEnSegment(params.service)
  const [city, service] = await Promise.all([
    getCity(params.slug),
    getService(params.slug, psSlug),
  ])
  if (!city || !service) return {}

  if (params.slug === 'playa-del-carmen' && params.service === 'airbnb-management') {
    return buildMetadata({
      title: PLAYA_AIRBNB_SEO.en.title,
      description: PLAYA_AIRBNB_SEO.en.description,
      canonical: `https://www.playastays.com/${params.slug}/${params.service}/`,
      hreflangEs: 'https://www.playastays.com/es/playa-del-carmen/administracion-airbnb/',
    })
  }

  return serviceMetadata(service, city)
}

export default async function ServicePage(
  { params }: { params: { slug: string; service: string } }
) {
  const { isEnabled: preview } = draftMode()

  const slug = typeof params.slug === 'string' ? params.slug.trim() : ''
  const serviceSeg = typeof params.service === 'string' ? params.service.trim() : ''
  if (!slug || !serviceSeg) notFound()

  const psSlug = psServiceSlugFromPublicEnSegment(serviceSeg)
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
    />
  )
}

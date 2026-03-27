import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getCitySlugs, getCity, getService,
  getServices, getFAQs, getTestimonials,
} from '@/lib/wordpress'
import { serviceMetadata } from '@/lib/seo'
import { ServicePageTemplate } from '@/components/templates/ServicePageTemplate'
import type { ServiceSlug } from '@/types'

export const revalidate = 86400

// Every city × every service slug, generated at build time
// from WP city slugs — no hardcoding required.
const SERVICE_SLUGS: ServiceSlug[] = [
  'property-management',
  'airbnb-management',
  'vacation-rentals',
  'condos-for-rent',
  'beachfront-rentals',
  'investment-property',
  'sell-property',
]

export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  return citySlugs.flatMap(city =>
    SERVICE_SLUGS.map(service => ({ city, service }))
  )
}

export async function generateMetadata(
  { params }: { params: { city: string; service: string } }
): Promise<Metadata> {
  const [city, service] = await Promise.all([
    getCity(params.city),
    getService(params.city, params.service),
  ])
  if (!city || !service) return {}
  return serviceMetadata(service, city)
}

export default async function ServicePage(
  { params }: { params: { city: string; service: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [city, service] = await Promise.all([
    getCity(params.city, preview),
    getService(params.city, params.service, preview),
  ])

  if (!city || !service) notFound()

  // Fetch FAQs, testimonials, and related services in parallel
  const [faqs, testimonials, allCityServices] = await Promise.all([
    getFAQs({ serviceSlug: params.service, citySlug: params.city, preview }),
    getTestimonials({ serviceId: service.id, preview }),
    getServices({ citySlug: params.city, preview }),
  ])

  const relatedServices = allCityServices.filter(
    s => s.meta.ps_service_slug !== params.service
  ).slice(0, 4)

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

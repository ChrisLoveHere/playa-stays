// ============================================================
// /es/page.tsx  →  https://www.playastays.com/es/
// Spanish homepage. Mirrors EN /page.tsx exactly.
// Same data fetches, same template — locale="es" flips all copy.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import {
  getCities, getServices, getProperties,
  getTestimonials, getBlogPosts, getFAQs, getSiteConfig,
} from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { HomepageTemplate } from '@/components/templates/HomepageTemplate'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'PlayaStays — Administración de Propiedades | Playa del Carmen & Riviera Maya',
  description: 'PlayaStays es la empresa líder en administración de rentas vacacionales en Playa del Carmen. 200+ propiedades administradas. Maximiza tus ingresos — sin complicaciones. Estimado gratis.',
  canonical: 'https://www.playastays.com/es/',
  hreflangEn: 'https://www.playastays.com/',
})

export default async function EsHomePage() {
  const { isEnabled: preview } = draftMode()

  const [config, cities, services, properties, testimonials, posts, faqs] = await Promise.all([
    getSiteConfig(),
    getCities(preview),
    getServices({ preview }),
    getProperties({ featured: true, perPage: 3, preview }),
    getTestimonials({ featured: true, preview }),
    getBlogPosts({ perPage: 3, preview }),
    getFAQs({ categorySlug: 'homepage', preview }),
  ])

  return (
    <HomepageTemplate
      config={config}
      cities={cities}
      services={services}
      properties={properties}
      testimonials={testimonials}
      posts={posts}
      faqs={faqs}
      locale="es"
    />
  )
}

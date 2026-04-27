import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import {
  getCities, getServices, getProperties,
  getTestimonials, getBlogPosts, getFAQs, getSiteConfig,
} from '@/lib/wordpress'
import { homepageMetadata } from '@/lib/seo'
import { HomepageTemplate } from '@/components/templates/HomepageTemplate'
import { PersonOrganizationSchema } from '@/components/seo/PersonOrganizationSchema'

export const revalidate = 3600

export const metadata: Metadata = homepageMetadata()

export default async function HomePage() {
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
    <>
      <PersonOrganizationSchema />
      <HomepageTemplate
        config={config}
        cities={cities}
        services={services}
        properties={properties}
        testimonials={testimonials}
        posts={posts}
        faqs={faqs}
      />
    </>
  )
}

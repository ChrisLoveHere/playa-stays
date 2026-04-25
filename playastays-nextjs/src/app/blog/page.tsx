import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import {
  getBlogPosts,
  getBlogTopicTerms,
  getBlogAreaTerms,
} from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site-url'
import { BlogHubView } from '@/components/blog/BlogHubView'
import { CtaStrip } from '@/components/sections'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Property Management Blog | PlayaStays',
  description:
    'Expert insights on vacation rental management, Airbnb strategy, and property investment in Playa del Carmen and the Riviera Maya.',
  canonical: `${SITE_URL}/blog/`,
  hreflangEs: `${SITE_URL}/es/blog/`,
})

interface Props {
  searchParams: { page?: string; q?: string; topic?: string; area?: string }
}

export default async function BlogPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1)
  const q = searchParams.q ?? ''
  const topicSlug = searchParams.topic?.trim() ?? ''
  const areaSlug = searchParams.area?.trim() ?? ''

  const [posts, topicTerms, areaTerms] = await Promise.all([
    getBlogPosts({
      perPage: 9,
      page,
      preview,
      topicSlug: topicSlug || null,
      areaSlug: areaSlug || null,
      search: q || null,
    }),
    getBlogTopicTerms(),
    getBlogAreaTerms(),
  ])

  const hasTaxonomies = topicTerms.length > 0 && areaTerms.length > 0

  return (
    <>
      <BlogHubView
        posts={posts}
        page={page}
        locale="en"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: null },
        ]}
        kicker="Insights & Guides"
        title="PlayaStays Journal"
        intro="Local insights, owner guides, market perspectives, and practical articles about property management, vacation rentals, and owning in Playa del Carmen and the Riviera Maya."
        q={q}
        topicSlug={topicSlug}
        areaSlug={areaSlug}
        topicTerms={topicTerms}
        areaTerms={areaTerms}
        hasTaxonomies={hasTaxonomies}
      />

      <CtaStrip
        eyebrow="Own a property in the Riviera Maya?"
        headline="Get a free rental income estimate — no commitment required."
        cta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
      />
    </>
  )
}

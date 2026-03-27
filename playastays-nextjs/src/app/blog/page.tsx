import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { BlogCard } from '@/components/content/Cards'
import { Hero } from '@/components/hero/Hero'
import { CtaStrip } from '@/components/sections'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Property Management Blog | PlayaStays',
  description: 'Expert insights on vacation rental management, Airbnb strategy, and property investment in Playa del Carmen and the Riviera Maya.',
  canonical: 'https://www.playastays.com/blog/',
})

interface Props {
  searchParams: { page?: string }
}

export default async function BlogPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()
  const page = Number(searchParams.page ?? 1)

  const posts = await getBlogPosts({ perPage: 9, page, preview })

  return (
    <>
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: null }]}
        tag="Owner Insights"
        headline="Rental management knowledge,<br /><em>straight from Playa del Carmen</em>"
        sub="Airbnb strategy, investment guides, market data, and operational advice for Riviera Maya property owners."
        primaryCta={{ label: 'Get Free Revenue Estimate', href: '/list-your-property/' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--light)' }}>
              No posts yet. Check back soon.
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(p => <BlogCard key={p.id} post={p} />)}
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 48 }}>
            {page > 1 && (
              <Link href={`/blog/?page=${page - 1}`} className="btn btn-ghost btn-sm">
                ← Previous
              </Link>
            )}
            {posts.length === 9 && (
              <Link href={`/blog/?page=${page + 1}`} className="btn btn-ghost btn-sm">
                Next →
              </Link>
            )}
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Own a property in the Riviera Maya?"
        headline="Get a free rental income estimate — no commitment required."
        cta={{ label: 'Get My Free Estimate →', href: '/list-your-property/' }}
      />
    </>
  )
}

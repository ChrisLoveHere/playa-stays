// ============================================================
// /es/blog/[slug]/page.tsx
//
// Spanish blog post pages — same slug as EN per architecture.
// Renders ps_title_es + ps_content_es from WP meta when set.
// Noindex when ES content fields are empty.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getBlogPost,
  getBlogPosts,
  getBlogSlugs,
  getBlogTopicTerms,
  getBlogAreaTerms,
} from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site-url'
import { BlogPostTemplate } from '@/components/templates/BlogPostTemplate'
import { blogPostDisplayFields } from '@/components/blog/blog-hub-display'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  if (!post) return {}

  const canonical = `${SITE_URL}/es/blog/${params.slug}/`
  const enHref    = `${SITE_URL}/blog/${params.slug}/`
  const image     = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

  // Noindex if no Spanish content — never rank ES page with EN title
  const hasTitleEs = Boolean(post.meta.ps_title_es)
  if (!hasTitleEs) {
    return buildMetadata({
      title:       post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
      canonical,
      noindex: true,
    })
  }

  const titleEsPlain = (post.meta.ps_title_es || post.title.rendered).replace(/<[^>]*>/g, '').trim()

  return buildMetadata({
    title:
      (post.meta.ps_seo_title && post.meta.ps_seo_title.trim()) ||
      `${titleEsPlain} | PlayaStays`,
    description: post.meta.ps_seo_desc     || post.meta.ps_excerpt_es || post.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical,
    hreflangEn:  enHref,
    ogImage:     image,
  })
}

export default async function EsBlogPostPage(
  { params }: { params: { slug: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [post, relatedPosts, topicTerms, areaTerms] = await Promise.all([
    getBlogPost(params.slug, preview),
    getBlogPosts({ perPage: 4, preview }),
    getBlogTopicTerms(),
    getBlogAreaTerms(),
  ])

  if (!post) notFound()

  const related = relatedPosts.filter(p => p.slug !== params.slug).slice(0, 3)
  const tagPillLabel = blogPostDisplayFields(post, 'es', topicTerms, areaTerms).tag

  return (
    <BlogPostTemplate
      post={post}
      relatedPosts={related}
      locale="es"
      tagPillLabel={tagPillLabel}
    />
  )
}

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts, getBlogSlugs } from '@/lib/wordpress'
import { blogPostMetadata, blogPostSchema } from '@/lib/seo'
import { BlogPostTemplate } from '@/components/templates/BlogPostTemplate'

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
  return blogPostMetadata(post)
}

export default async function BlogPostPage(
  { params }: { params: { slug: string } }
) {
  const { isEnabled: preview } = draftMode()

  const [post, relatedPosts] = await Promise.all([
    getBlogPost(params.slug, preview),
    getBlogPosts({ perPage: 3, preview }),
  ])

  if (!post) notFound()

  const schema = blogPostSchema(post)
  const related = relatedPosts.filter(p => p.slug !== params.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogPostTemplate post={post} relatedPosts={related} />
    </>
  )
}

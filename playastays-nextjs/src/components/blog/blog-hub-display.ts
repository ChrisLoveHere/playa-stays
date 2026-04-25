// Shared display fields for blog hub cards (EN/ES) + taxonomy labels
import type { BlogPost, WpTerm } from '@/types'
import type { Locale } from '@/lib/i18n'
import { blogTermDisplayName } from '@/lib/blog-taxonomy-labels'

function primaryTermLabel(
  ids: number[] | undefined,
  terms: WpTerm[],
  locale: Locale
): string | null {
  if (!ids?.length || !terms.length) return null
  const t = terms.find(x => x.id === ids[0])
  return t ? blogTermDisplayName(t, locale) : null
}

export function blogPostDisplayFields(
  post: BlogPost,
  locale: Locale,
  topicTerms: WpTerm[],
  areaTerms: WpTerm[]
) {
  const isEs = locale === 'es'
  const titleHtml = isEs && post.meta.ps_title_es ? post.meta.ps_title_es : post.title.rendered
  const titlePlain = titleHtml.replace(/<[^>]*>/g, '').trim()
  const excerptRaw =
    isEs && post.meta.ps_excerpt_es ? post.meta.ps_excerpt_es : post.excerpt.rendered
  const excerptPlain = excerptRaw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const href = isEs ? `/es/blog/${post.slug}/` : `/blog/${post.slug}/`
  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const alt =
    post._embedded?.['wp:featuredmedia']?.[0]?.alt_text?.trim() || titlePlain
  const dateStr = new Date(post.date).toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const topicName = primaryTermLabel(post.ps_blog_topic, topicTerms, locale)
  const areaName = primaryTermLabel(post.ps_blog_area, areaTerms, locale)
  const fallbackTag = isEs ? 'Perspectivas y guías' : 'Insights & Guides'
  const tag = topicName || fallbackTag
  const subline = areaName

  return {
    titleHtml,
    titlePlain,
    excerptPlain,
    href,
    img,
    alt,
    dateStr,
    tag,
    /** Optional area label for secondary line */
    subline,
  }
}

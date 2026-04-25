// URL builders for blog hub (server-safe; shareable filters + search).
import type { Locale } from '@/lib/i18n'

export function blogHubPath(locale: Locale): string {
  return locale === 'es' ? '/es/blog/' : '/blog/'
}

export function buildBlogHubHref(opts: {
  locale: Locale
  q?: string | null
  topic?: string | null
  area?: string | null
  page?: number
}): string {
  const base = blogHubPath(opts.locale)
  const p = new URLSearchParams()
  const q = opts.q?.trim()
  const topic = opts.topic?.trim()
  const area = opts.area?.trim()
  if (q) p.set('q', q)
  if (topic) p.set('topic', topic)
  if (area) p.set('area', area)
  if (opts.page && opts.page > 1) p.set('page', String(opts.page))
  const qs = p.toString()
  return qs ? `${base}?${qs}` : base
}

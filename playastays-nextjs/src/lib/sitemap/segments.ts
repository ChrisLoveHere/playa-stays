// ============================================================
// Segmented sitemap URL builders — one fetch scope per segment
// for crawl efficiency and clearer inclusion rules.
//
// Excluded by design (not in any segment):
//   /admin/*, /portal/*, /login/*, /api/*
//   query-string browse URLs, tag archives, thin placeholders
//
// Future: image sitemap — add lib/sitemap/images.ts when WP REST
// exposes stable image URLs + dimensions for properties/blog in bulk.
// ============================================================

import { SITE_URL } from '@/lib/schema'
import {
  getCities,
  getAllPublishedBlogPostsForSitemap,
  getAllPublishedPropertiesForSitemap,
} from '@/lib/wordpress'
import { SERVICE_SLUG_EN_TO_ES } from '@/lib/i18n'
import { SERVICE_HUB_EN_TO_ES, SERVICE_HUB_IDS } from '@/lib/service-hub-constants'
import { propertyAbsoluteUrl } from '@/lib/property-url'
import type { UrlsetEntry } from '@/lib/sitemap/xml'
import type { Property } from '@/types'

const DEPLOY_DATE = process.env.NEXT_PUBLIC_DEPLOY_DATE ?? new Date().toISOString().slice(0, 10)

function isoDate(d: string | undefined): string | undefined {
  if (!d) return undefined
  try {
    return new Date(d).toISOString().slice(0, 10)
  } catch {
    return undefined
  }
}

function propertyLastMod(p: Property): string {
  return isoDate(p.modified) ?? DEPLOY_DATE
}

/**
 * Segmented child sitemaps (rewritten to `/sitemaps/[segment]` in `next.config.mjs`).
 * - core: money / discovery URLs (hubs, cities, browse, pricing)
 * - legal: about, contact, privacy, terms (EN + ES) — lower crawl priority, separate bucket
 * - rentals: indexable property detail URLs only (canonical `propertyAbsoluteUrl`)
 * - blog: posts (EN + ES when translation exists)
 */
export const SITEMAP_SEGMENTS = ['core', 'legal', 'rentals', 'blog'] as const
export type SitemapSegment = (typeof SITEMAP_SEGMENTS)[number]

/**
 * Matches property detail templates that inject `noindex` when review count is low.
 * Keep in sync with `/rentals/[slug]` and `/es/rentas/[slug]` pages.
 */
export const MIN_PROPERTY_REVIEWS_FOR_SITEMAP = 3

function propertyIsIndexableInSitemap(p: Property): boolean {
  if (p.meta.ps_listing_status !== 'active') return false
  return (p.meta.ps_review_count ?? 0) >= MIN_PROPERTY_REVIEWS_FOR_SITEMAP
}

export function isSitemapSegment(s: string): s is SitemapSegment {
  return (SITEMAP_SEGMENTS as readonly string[]).includes(s)
}

/**
 * Core / money pages: static marketing, service hubs, city hubs,
 * city pricing, city guest browse, city × service — EN + ES (ES gated on CMS fields).
 */
export async function getCoreSitemapEntries(): Promise<UrlsetEntry[]> {
  const cities = await getCities()
  const map: UrlsetEntry[] = []

  const staticEn: Array<{ path: string; priority: number; changefreq: string }> = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/rentals/', priority: 0.8, changefreq: 'daily' },
    { path: '/blog/', priority: 0.7, changefreq: 'weekly' },
    { path: '/list-your-property/', priority: 0.9, changefreq: 'monthly' },
    { path: '/property-management-pricing/', priority: 0.9, changefreq: 'monthly' },
    ...SERVICE_HUB_IDS.map(hub => ({
      path: `/${hub}/`,
      priority: 0.92,
      changefreq: 'monthly',
    })),
  ]

  for (const p of staticEn) {
    map.push({
      loc: `${SITE_URL}${p.path}`,
      lastmod: DEPLOY_DATE,
      changefreq: p.changefreq,
      priority: p.priority,
    })
  }

  const staticEs: Array<{ path: string; priority: number; changefreq: string }> = [
    { path: '/es/', priority: 1.0, changefreq: 'weekly' },
    { path: '/es/rentas/', priority: 0.8, changefreq: 'daily' },
    { path: '/es/blog/', priority: 0.7, changefreq: 'weekly' },
    { path: '/es/publica-tu-propiedad/', priority: 0.9, changefreq: 'monthly' },
    { path: '/es/precios-administracion-propiedades/', priority: 0.9, changefreq: 'monthly' },
    ...SERVICE_HUB_IDS.map(hub => ({
      path: `/es/${SERVICE_HUB_EN_TO_ES[hub]}/`,
      priority: 0.92,
      changefreq: 'monthly',
    })),
  ]

  for (const p of staticEs) {
    map.push({
      loc: `${SITE_URL}${p.path}`,
      lastmod: DEPLOY_DATE,
      changefreq: p.changefreq,
      priority: p.priority,
    })
  }

  for (const city of cities) {
    const slug = city.slug

    map.push({
      loc: `${SITE_URL}/${slug}/`,
      lastmod: DEPLOY_DATE,
      changefreq: 'weekly',
      priority: 0.9,
    })
    map.push({
      loc: `${SITE_URL}/${slug}/property-management-cost/`,
      lastmod: DEPLOY_DATE,
      changefreq: 'monthly',
      priority: 0.8,
    })
    map.push({
      loc: `${SITE_URL}/${slug}/rentals/`,
      lastmod: DEPLOY_DATE,
      changefreq: 'daily',
      priority: 0.75,
    })

    if (city.meta.ps_title_es) {
      map.push({
        loc: `${SITE_URL}/es/${slug}/`,
        lastmod: DEPLOY_DATE,
        changefreq: 'weekly',
        priority: 0.9,
      })
      map.push({
        loc: `${SITE_URL}/es/${slug}/costo-administracion-propiedades/`,
        lastmod: DEPLOY_DATE,
        changefreq: 'monthly',
        priority: 0.8,
      })
      map.push({
        loc: `${SITE_URL}/es/${slug}/rentas/`,
        lastmod: DEPLOY_DATE,
        changefreq: 'daily',
        priority: 0.75,
      })
    }

    for (const [enSlug, esSlug] of Object.entries(SERVICE_SLUG_EN_TO_ES)) {
      map.push({
        loc: `${SITE_URL}/${slug}/${enSlug}/`,
        lastmod: DEPLOY_DATE,
        changefreq: 'monthly',
        priority: 0.8,
      })
      if (city.meta.ps_title_es) {
        map.push({
          loc: `${SITE_URL}/es/${slug}/${esSlug}/`,
          lastmod: DEPLOY_DATE,
          changefreq: 'monthly',
          priority: 0.8,
        })
      }
    }
  }

  return map
}

/** About, contact, privacy, terms — separated from core so crawlers can prioritize money pages first. */
export async function getLegalSitemapEntries(): Promise<UrlsetEntry[]> {
  const staticEn: Array<{ path: string; priority: number; changefreq: string }> = [
    { path: '/about/', priority: 0.55, changefreq: 'monthly' },
    { path: '/contact/', priority: 0.5, changefreq: 'monthly' },
    { path: '/privacy/', priority: 0.35, changefreq: 'yearly' },
    { path: '/terms/', priority: 0.35, changefreq: 'yearly' },
  ]
  const staticEs: Array<{ path: string; priority: number; changefreq: string }> = [
    { path: '/es/acerca-de-playastays/', priority: 0.55, changefreq: 'monthly' },
    { path: '/es/contacto/', priority: 0.5, changefreq: 'monthly' },
    { path: '/es/privacidad/', priority: 0.35, changefreq: 'yearly' },
    { path: '/es/terminos/', priority: 0.35, changefreq: 'yearly' },
  ]
  const rows: UrlsetEntry[] = []
  for (const p of staticEn) {
    rows.push({
      loc: `${SITE_URL}${p.path}`,
      lastmod: DEPLOY_DATE,
      changefreq: p.changefreq,
      priority: p.priority,
    })
  }
  for (const p of staticEs) {
    rows.push({
      loc: `${SITE_URL}${p.path}`,
      lastmod: DEPLOY_DATE,
      changefreq: p.changefreq,
      priority: p.priority,
    })
  }
  return rows
}

/**
 * Active, indexable listings only — canonical location-aware URLs (`propertyAbsoluteUrl`).
 * Excludes noindex-equivalent inventory (see `propertyIsIndexableInSitemap`).
 */
export async function getRentalsSitemapEntries(): Promise<UrlsetEntry[]> {
  const properties = await getAllPublishedPropertiesForSitemap()
  const map: UrlsetEntry[] = []

  for (const property of properties) {
    if (!propertyIsIndexableInSitemap(property)) continue

    map.push({
      loc: propertyAbsoluteUrl(property, 'en', SITE_URL),
      lastmod: propertyLastMod(property),
      changefreq: 'weekly',
      priority: 0.7,
    })

    if (property.meta.ps_title_es) {
      map.push({
        loc: propertyAbsoluteUrl(property, 'es', SITE_URL),
        lastmod: propertyLastMod(property),
        changefreq: 'weekly',
        priority: 0.7,
      })
    }
  }

  return map
}

/** Blog posts — ES only when ES title exists (matches noindex rules in templates). */
export async function getBlogSitemapEntries(): Promise<UrlsetEntry[]> {
  const posts = await getAllPublishedBlogPostsForSitemap()
  const map: UrlsetEntry[] = []

  for (const post of posts) {
    const lastmod = isoDate(post.modified) ?? DEPLOY_DATE
    map.push({
      loc: `${SITE_URL}/blog/${post.slug}/`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.6,
    })
    if (post.meta.ps_title_es) {
      map.push({
        loc: `${SITE_URL}/es/blog/${post.slug}/`,
        lastmod,
        changefreq: 'monthly',
        priority: 0.6,
      })
    }
  }

  return map
}

export async function getSegmentEntries(segment: SitemapSegment): Promise<UrlsetEntry[]> {
  switch (segment) {
    case 'core':
      return getCoreSitemapEntries()
    case 'legal':
      return getLegalSitemapEntries()
    case 'rentals':
      return getRentalsSitemapEntries()
    case 'blog':
      return getBlogSitemapEntries()
    default:
      return []
  }
}

// ============================================================
// src/app/sitemap.ts
//
// Generates the full sitemap for all EN + ES routes.
// Served at /sitemap.xml by Next.js App Router automatically.
//
// Rules (per architecture spec §5):
//   - All EN routes included
//   - ES routes included only when they have valid ES SEO fields
//   - Blog posts: included when published
//   - Properties: included when ps_listing_status === 'active'
//   - /api/* routes excluded
// ============================================================

import type { MetadataRoute } from 'next'
import { getCities, getServices, getBlogPosts, getProperties } from '@/lib/wordpress'
import { SERVICE_SLUG_EN_TO_ES } from '@/lib/i18n'

const SITE_URL = 'https://www.playastays.com'
const DEPLOY_DATE = process.env.NEXT_PUBLIC_DEPLOY_DATE ?? new Date().toISOString().slice(0, 10)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, posts, properties] = await Promise.all([
    getCities(),
    getBlogPosts({ perPage: 200 }),
    getProperties({ perPage: 500 }),
  ])

  const map: MetadataRoute.Sitemap = []

  // ── Static EN pages ──────────────────────────────────────
  const staticEn: Array<{ url: string; priority: number; changefreq?: MetadataRoute.Sitemap[0]['changeFrequency'] }> = [
    { url: '/',                                  priority: 1.0, changefreq: 'weekly' },
    { url: '/rentals/',                          priority: 0.8, changefreq: 'daily' },
    { url: '/blog/',                             priority: 0.7, changefreq: 'weekly' },
    { url: '/list-your-property/',               priority: 0.9, changefreq: 'monthly' },
    { url: '/contact/',                          priority: 0.5, changefreq: 'monthly' },
    { url: '/property-management-pricing/',      priority: 0.9, changefreq: 'monthly' },
  ]

  for (const p of staticEn) {
    map.push({
      url:          `${SITE_URL}${p.url}`,
      lastModified: DEPLOY_DATE,
      changeFrequency: p.changefreq,
      priority: p.priority,
    })
  }

  // ── Static ES pages ──────────────────────────────────────
  const staticEs: Array<{ url: string; priority: number; changefreq?: MetadataRoute.Sitemap[0]['changeFrequency'] }> = [
    { url: '/es/',                                             priority: 1.0, changefreq: 'weekly' },
    { url: '/es/rentas/',                                      priority: 0.8, changefreq: 'daily' },
    { url: '/es/blog/',                                        priority: 0.7, changefreq: 'weekly' },
    { url: '/es/publica-tu-propiedad/',                        priority: 0.9, changefreq: 'monthly' },
    { url: '/es/contacto/',                                    priority: 0.5, changefreq: 'monthly' },
    { url: '/es/precios-administracion-propiedades/',          priority: 0.9, changefreq: 'monthly' },
  ]

  for (const p of staticEs) {
    map.push({
      url:          `${SITE_URL}${p.url}`,
      lastModified: DEPLOY_DATE,
      changeFrequency: p.changefreq,
      priority: p.priority,
    })
  }

  // ── City hubs + service pages ─────────────────────────────
  for (const city of cities) {
    const slug = city.slug

    // EN city hub
    map.push({
      url:          `${SITE_URL}/${slug}/`,
      lastModified: DEPLOY_DATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // EN city pricing
    map.push({
      url:          `${SITE_URL}/${slug}/property-management-cost/`,
      lastModified: DEPLOY_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    // ES city hub (only if has ES title)
    if (city.meta.ps_title_es) {
      map.push({
        url:          `${SITE_URL}/es/${slug}/`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'weekly',
        priority: 0.9,
      })

      // ES city pricing
      map.push({
        url:          `${SITE_URL}/es/${slug}/costo-administracion-propiedades/`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    // EN service pages
    for (const [enSlug, esSlug] of Object.entries(SERVICE_SLUG_EN_TO_ES)) {
      map.push({
        url:          `${SITE_URL}/${slug}/${enSlug}/`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'monthly',
        priority: 0.8,
      })

      // ES service pages (only if city has ES fields — service noindex logic handled in route)
      if (city.meta.ps_title_es) {
        map.push({
          url:          `${SITE_URL}/es/${slug}/${esSlug}/`,
          lastModified: DEPLOY_DATE,
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      }
    }
  }

  // ── Blog posts ────────────────────────────────────────────
  for (const post of posts) {
    // EN blog post
    map.push({
      url:          `${SITE_URL}/blog/${post.slug}/`,
      lastModified: post.modified,
      changeFrequency: 'monthly',
      priority: 0.6,
    })

    // ES blog post (only if has ES title — noindex otherwise)
    if (post.meta.ps_title_es) {
      map.push({
        url:          `${SITE_URL}/es/blog/${post.slug}/`,
        lastModified: post.modified,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  // ── Properties ────────────────────────────────────────────
  for (const property of properties) {
    if (property.meta.ps_listing_status !== 'active') continue

    // EN property
    map.push({
      url:          `${SITE_URL}/rentals/${property.slug}/`,
      lastModified: DEPLOY_DATE,
      changeFrequency: 'daily',
      priority: 0.7,
    })

    // ES property (only if has ES title)
    if (property.meta.ps_title_es) {
      map.push({
        url:          `${SITE_URL}/es/rentas/${property.slug}/`,
        lastModified: DEPLOY_DATE,
        changeFrequency: 'daily',
        priority: 0.7,
      })
    }
  }

  return map
}

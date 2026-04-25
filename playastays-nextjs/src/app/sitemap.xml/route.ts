// ============================================================
// Sitemap index — references segmented child sitemaps:
//   sitemap-core | sitemap-legal | sitemap-rentals | sitemap-blog
// GET /sitemap.xml  (alias: /sitemap-index.xml → redirect)
// ============================================================

import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/schema'
import { SITEMAP_SEGMENTS, buildSitemapIndexXml } from '@/lib/sitemap'

export const revalidate = 1800

export async function GET() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const children = SITEMAP_SEGMENTS.map(seg => ({
    loc: `${SITE_URL}/sitemap-${seg}.xml`,
    lastmod,
  }))
  const xml = buildSitemapIndexXml(children)
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  })
}

// ============================================================
// Segmented urlset sitemaps — core | legal | rentals | blog
// GET /sitemaps/[segment]  (also /sitemap-{segment}.xml via rewrites)
// ============================================================

import { NextResponse } from 'next/server'
import { buildUrlsetXml, getSegmentEntries, isSitemapSegment } from '@/lib/sitemap'

export const revalidate = 1800

export async function GET(
  _request: Request,
  { params }: { params: { segment: string } },
) {
  const { segment } = params
  if (!isSitemapSegment(segment)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const entries = await getSegmentEntries(segment)
  const xml = buildUrlsetXml(entries)

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  })
}

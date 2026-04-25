// ============================================================
// Sitemap XML serialization (sitemap index + urlset)
// Public URLs only — no image namespace until data layer is ready.
// ============================================================

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export interface UrlsetEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

/**
 * Future: Google image extension (`xmlns:image`) for property galleries / blog heroes.
 * Not rendered by `buildUrlsetXml` yet — add namespace + `<image:image>` when
 * bulk image URLs and optional dimensions are available from WP without faking data.
 */
export interface SitemapImageRef {
  loc: string
  caption?: string
  title?: string
}

export interface UrlsetEntryWithImages extends UrlsetEntry {
  images?: SitemapImageRef[]
}

export function buildUrlsetXml(entries: UrlsetEntry[]): string {
  const rows = entries
    .map(e => {
      const parts = [`<loc>${escapeXml(e.loc)}</loc>`]
      if (e.lastmod) parts.push(`<lastmod>${escapeXml(e.lastmod)}</lastmod>`)
      if (e.changefreq) parts.push(`<changefreq>${escapeXml(e.changefreq)}</changefreq>`)
      if (e.priority != null) parts.push(`<priority>${e.priority.toFixed(2)}</priority>`)
      return `<url>${parts.join('')}</url>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>`
}

export interface SitemapIndexChild {
  loc: string
  lastmod?: string
}

export function buildSitemapIndexXml(children: SitemapIndexChild[]): string {
  const rows = children
    .map(c => {
      const lines = [`    <loc>${escapeXml(c.loc)}</loc>`]
      if (c.lastmod) lines.push(`    <lastmod>${escapeXml(c.lastmod)}</lastmod>`)
      return `  <sitemap>\n${lines.join('\n')}\n  </sitemap>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</sitemapindex>
`
}

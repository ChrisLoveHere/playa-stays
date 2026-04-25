// ============================================================
// Blog post HTML helpers — TOC anchors + inline CTA injection
// ============================================================

export type BlogTocItem = { id: string; text: string; level: 2 | 3 }

export function slugifyHeading(text: string): string {
  const s = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'section'
}

/**
 * Ensures h2/h3 have stable ids for anchor links; collects entries for the table of contents.
 */
export function prepareBlogHtml(html: string): { html: string; toc: BlogTocItem[] } {
  const used = new Set<string>()
  const toc: BlogTocItem[] = []

  const processed = html.replace(
    /<h([23])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/gi,
    (full, levelStr: string, attrs: string, inner: string) => {
      const level = (levelStr === '2' ? 2 : 3) as 2 | 3
      const plain = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      if (!plain) return full

      const attrStr = String(attrs || '')
      const idMatch = attrStr.match(/\bid\s*=\s*["']([^"']+)["']/i)
      let id: string
      if (idMatch) {
        id = idMatch[1]
      } else {
        let base = slugifyHeading(plain)
        id = base
        let n = 0
        while (used.has(id)) {
          id = `${base}-${++n}`
        }
      }
      used.add(id)

      toc.push({ id, text: plain, level })

      if (idMatch) return full

      const trimmed = attrStr.trim()
      const newOpen = trimmed
        ? `<h${levelStr} ${trimmed} id="${id}">`
        : `<h${levelStr} id="${id}">`
      return `${newOpen}${inner}</h${levelStr}>`
    }
  )

  return { html: processed, toc }
}

/**
 * Inserts a contextual CTA after the first closing `</p>` in the article body.
 */
export function injectInlineCta(html: string, isEs = false): string {
  const eyebrow = isEs ? 'Administración en la Riviera Maya' : 'Riviera Maya property management'
  const body = isEs
    ? 'PlayaStays administra rentas vacacionales en Quintana Roo.'
    : 'PlayaStays manages vacation rentals across Quintana Roo.'
  const link = isEs ? 'Obtén un estimado gratis →' : 'Get a free revenue estimate →'
  const href = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'

  const ctaHtml = `
    <aside class="article-inline-cta">
      <div class="article-inline-cta__eyebrow">${eyebrow}</div>
      <p class="article-inline-cta__text">${body}
        <a href="${href}" class="article-inline-cta__link">${link}</a>
      </p>
    </aside>
  `
  const insertPoint = html.indexOf('</p>')
  if (insertPoint === -1) return html
  return html.slice(0, insertPoint + 4) + ctaHtml + html.slice(insertPoint + 4)
}

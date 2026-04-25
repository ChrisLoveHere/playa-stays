/**
 * Display labels for blog hub taxonomies (ps_blog_topic / ps_blog_area).
 * WordPress stores canonical English names; we map known slugs to polished EN/ES UI strings.
 * Unknown slugs fall back to REST `name`.
 */
import type { Locale } from '@/lib/i18n'
import type { WpTerm } from '@/types'

/** Seeded + expected slugs — see playastays-content-model.php `ps_maybe_seed_blog_taxonomies`. */
const LABELS: Record<string, { en: string; es: string }> = {
  'owner-guides': { en: 'Owner Guides', es: 'Guías para propietarios' },
  'property-management': { en: 'Property Management', es: 'Administración de propiedades' },
  'vacation-rentals': { en: 'Vacation Rentals', es: 'Rentas vacacionales' },
  'long-term-rentals': { en: 'Long-Term Rentals', es: 'Rentas a largo plazo' },
  'market-insights': { en: 'Market Insights', es: 'Perspectivas de mercado' },
  'playa-del-carmen': { en: 'Playa del Carmen', es: 'Playa del Carmen' },
  tulum: { en: 'Tulum', es: 'Tulum' },
  'puerto-morelos': { en: 'Puerto Morelos', es: 'Puerto Morelos' },
  akumal: { en: 'Akumal', es: 'Akumal' },
  cozumel: { en: 'Cozumel', es: 'Cozumel' },
  'isla-mujeres': { en: 'Isla Mujeres', es: 'Isla Mujeres' },
  'xpu-ha': { en: 'Xpu-Ha', es: 'Xpu-Ha' },
}

const TOPIC_SLUG_ORDER = [
  'owner-guides',
  'property-management',
  'vacation-rentals',
  'long-term-rentals',
  'market-insights',
] as const

const AREA_SLUG_ORDER = [
  'playa-del-carmen',
  'tulum',
  'puerto-morelos',
  'akumal',
  'cozumel',
  'isla-mujeres',
  'xpu-ha',
] as const

export function blogTermDisplayName(term: WpTerm, locale: Locale): string {
  const row = LABELS[term.slug]
  if (row) return locale === 'es' ? row.es : row.en
  return term.name
}

function orderIndex(slug: string, order: readonly string[]): number {
  const i = order.indexOf(slug)
  return i === -1 ? 999 : i
}

/** Stable editorial order (not A–Z) so chips match the product grouping. */
export function sortBlogTopicTermsForHub(terms: WpTerm[]): WpTerm[] {
  return [...terms].sort((a, b) => {
    const da = orderIndex(a.slug, TOPIC_SLUG_ORDER)
    const db = orderIndex(b.slug, TOPIC_SLUG_ORDER)
    if (da !== db) return da - db
    return a.name.localeCompare(b.name)
  })
}

export function sortBlogAreaTermsForHub(terms: WpTerm[]): WpTerm[] {
  return [...terms].sort((a, b) => {
    const d = orderIndex(a.slug, AREA_SLUG_ORDER) - orderIndex(b.slug, AREA_SLUG_ORDER)
    if (d !== 0) return d
    return a.name.localeCompare(b.name)
  })
}

// ============================================================
// Major markets — two lists on purpose
//
// 1) FEATURED / MAJOR_MARKET_CITY_SLUGS — exactly six cities for homepage
//    “Across Quintana Roo” and other fixed 6-card marketing grids only.
//    Akumal is omitted here so the grid stays visually even.
//
// 2) ALL_MAJOR_MARKET_CITY_SLUGS — full major-market order for header nav,
//    footer, sortCitiesForNavigation, and hub “other cities” lists. Includes Akumal.
//
// Only cities published in WordPress appear where lists are filtered against CMS data.
// ============================================================

import type { City } from '@/types'

/** Six slugs — homepage featured grid & similar tight marketing rows only (no Akumal). */
export const MAJOR_MARKET_CITY_SLUGS = [
  'playa-del-carmen',
  'tulum',
  'puerto-morelos',
  'cozumel',
  'isla-mujeres',
  'xpu-ha',
] as const

/**
 * All primary resort markets in canonical order for nav, footer, and coverage lists.
 * Includes Akumal (aligned with global pricing hub resort ordering).
 */
export const ALL_MAJOR_MARKET_CITY_SLUGS = [
  'playa-del-carmen',
  'tulum',
  'puerto-morelos',
  'akumal',
  'xpu-ha',
  'cozumel',
  'isla-mujeres',
] as const

const ALL_MAJOR_SET = new Set<string>(ALL_MAJOR_MARKET_CITY_SLUGS)

/**
 * Cities for homepage “Across Quintana Roo” grid: six featured hubs only, WP data only.
 */
export function citiesInMarketingHubOrder(cities: City[]): City[] {
  const bySlug = new Map(cities.map(c => [c.slug, c]))
  return MAJOR_MARKET_CITY_SLUGS.map(slug => bySlug.get(slug)).filter((c): c is City => Boolean(c))
}

/**
 * Cities for nav, footer sources that consume sorted CMS lists, service-hub side lists:
 * all major markets first (when present in `cities`), then any other WP cities A→Z by title.
 */
export function sortCitiesForNavigation(cities: City[]): City[] {
  const bySlug = new Map(cities.map(c => [c.slug, c]))
  const major: City[] = []
  for (const slug of ALL_MAJOR_MARKET_CITY_SLUGS) {
    const c = bySlug.get(slug)
    if (c) major.push(c)
  }
  const rest = cities.filter(c => !ALL_MAJOR_SET.has(c.slug))
  rest.sort((a, b) =>
    a.title.rendered.localeCompare(b.title.rendered, 'und', { sensitivity: 'base' }),
  )
  return [...major, ...rest]
}

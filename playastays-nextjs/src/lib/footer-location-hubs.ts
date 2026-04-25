/**
 * Canonical city hub links for the footer Locations column.
 * Same order as `ALL_MAJOR_MARKET_CITY_SLUGS` in `major-market-cities.ts`
 * (all supported major markets, including Akumal). Always rendered so the column
 * stays complete even when the CMS city list is empty or fails.
 */
export const FOOTER_LOCATION_HUBS = [
  { slug: 'playa-del-carmen', labelEn: 'Playa del Carmen', labelEs: 'Playa del Carmen' },
  { slug: 'tulum', labelEn: 'Tulum', labelEs: 'Tulum' },
  { slug: 'puerto-morelos', labelEn: 'Puerto Morelos', labelEs: 'Puerto Morelos' },
  { slug: 'akumal', labelEn: 'Akumal', labelEs: 'Akumal' },
  { slug: 'xpu-ha', labelEn: 'Xpu-Ha', labelEs: 'Xpu-Ha' },
  { slug: 'cozumel', labelEn: 'Cozumel', labelEs: 'Cozumel' },
  { slug: 'isla-mujeres', labelEn: 'Isla Mujeres', labelEs: 'Isla Mujeres' },
] as const

/** Minimal shape for nav when CMS returns no cities — real slugs/labels only. */
export function getCityNavFallbackLinks(locale: 'en' | 'es'): Array<{ slug: string; title: { rendered: string } }> {
  return FOOTER_LOCATION_HUBS.map(h => ({
    slug: h.slug,
    title: { rendered: locale === 'es' ? h.labelEs : h.labelEn },
  }))
}

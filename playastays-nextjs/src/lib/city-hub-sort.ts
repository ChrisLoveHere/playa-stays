// ============================================================
// City list ordering for hubs and cross-links — same rules as nav
// ============================================================

import type { City } from '@/types'
import { sortCitiesForNavigation } from '@/lib/major-market-cities'

/**
 * Sort cities for hub cross-links: same order as header/footer (major markets first).
 */
export function sortCitiesForHub(cities: City[]): City[] {
  return sortCitiesForNavigation(cities)
}

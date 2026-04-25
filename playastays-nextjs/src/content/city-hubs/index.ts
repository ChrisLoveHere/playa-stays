// ============================================================
// City hub content — fallback + optional registry overrides (merge)
// ============================================================

import type { City } from '@/types'
import type { Locale } from '@/lib/i18n'
import { playaDelCarmenHub } from './playa-del-carmen'
import { buildFallbackCityHubContent, heroImageForCitySlug } from './fallback'
import { mergeCityHubContent } from './merge'
import type { CityHubLocaleContent, CityHubRegistryEntry } from './types'

export type { CityHubLocaleContent, CityHubRegistryEntry, CityHubImageAsset, CityHubServiceHighlight } from './types'
export { mergeCityHubContent } from './merge'
export { buildFallbackCityHubContent, heroImageForCitySlug } from './fallback'

const CITY_HUB_REGISTRY: Record<string, CityHubRegistryEntry> = {
  'playa-del-carmen': playaDelCarmenHub,
}

/**
 * Universal city hub copy: premium fallback for every city, merged with optional registry overrides.
 * CMS `heroImageUrl` (page prop) should be applied in the template after this call when present.
 */
export function getCityHubMergedContent(city: City, locale: Locale): CityHubLocaleContent {
  const base = buildFallbackCityHubContent(city, locale)
  const patch = CITY_HUB_REGISTRY[city.slug]?.[locale === 'es' ? 'es' : 'en']
  return mergeCityHubContent(base, patch)
}

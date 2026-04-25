// ============================================================
// Merge base city hub copy with optional per-city overrides.
// Only keys present in `patch` replace base values.
// ============================================================

import type { CityHubLocaleContent } from './types'

export function mergeCityHubContent(
  base: CityHubLocaleContent,
  patch?: Partial<CityHubLocaleContent> | null,
): CityHubLocaleContent {
  if (!patch) return base
  return { ...base, ...patch }
}

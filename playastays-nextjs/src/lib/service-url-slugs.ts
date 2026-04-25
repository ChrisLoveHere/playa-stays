// ============================================================
// Public URL segments ↔ WordPress ps_service_slug
//
// Management service pages use intent-clear slugs (e.g. vacation-rental-management).
// WordPress still stores ps_service_slug as vacation-rentals, condos-for-rent, etc.
// Guest/inventory browse lives at /[city]/rentals/ (EN) and /es/[ciudad]/rentas/.
// ============================================================

/** WP meta ps_service_slug → public EN path segment for /[city]/[service]/ */
const PS_TO_PUBLIC_EN: Record<string, string> = {
  'vacation-rentals': 'vacation-rental-management',
  'condos-for-rent': 'condo-rental-management',
  'beachfront-rentals': 'beachfront-rental-management',
  // Legacy/alternate WP slug → canonical public URL (plugin may use either)
  'sell-your-property': 'sell-property',
}

/** Public EN segment → ps_service_slug for getService() */
export const PS_SERVICE_SLUG_FROM_PUBLIC_EN: Record<string, string> = Object.fromEntries(
  Object.entries(PS_TO_PUBLIC_EN).map(([ps, pub]) => [pub, ps])
)

/** WP ps_service_slug → public EN URL segment (default: identity) */
export function publicEnSlugFromPs(ps: string): string {
  return PS_TO_PUBLIC_EN[ps] ?? ps
}

/** /[city]/[service] segment → WP ps_service_slug for API */
export function psServiceSlugFromPublicEnSegment(segment: string): string {
  return PS_SERVICE_SLUG_FROM_PUBLIC_EN[segment] ?? segment
}

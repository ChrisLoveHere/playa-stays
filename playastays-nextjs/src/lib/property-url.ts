// ============================================================
// PlayaStays — Property URL builder
//
// Single source of truth for generating public property detail
// URLs. Produces location-aware segmented paths:
//
//   /rentals/{city}/{neighborhood}/{slug}/
//   /rentals/{city}/{slug}/              (no neighborhood)
//   /es/rentas/{city}/{neighborhood}/{slug}/
//
// Used by: route pages, cards, breadcrumbs, sitemap, SEO,
//          admin "view on site" links, JSON-LD schema.
// ============================================================

import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import { cityNameToSlug } from '@/lib/location-data'
import { SITE_URL } from '@/lib/site-url'

/**
 * Normalise any string to a URL-safe slug segment.
 * Handles display names ("Zazil-Ha"), already-slugified ("zazil-ha"),
 * accented characters ("Loltún"), and spaces.
 */
export function toLocationSlug(s: string | undefined | null): string {
  if (!s) return ''
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Resolve the city slug for a property.
 * Handles both admin-stored slugs (playa-del-carmen) and
 * legacy display names (Playa del Carmen).
 */
function resolveCity(property: { meta: { ps_city?: string; ps_city_slug?: string } }): string {
  const raw = property.meta.ps_city || ''
  return cityNameToSlug(raw) || toLocationSlug(raw)
}

function resolveNeighborhood(property: { meta: { ps_neighborhood?: string } }): string {
  return toLocationSlug(property.meta.ps_neighborhood)
}

/**
 * Build the canonical public URL for a property detail page.
 */
export function propertyHref(
  property: Pick<Property, 'slug' | 'meta'>,
  locale: Locale = 'en',
): string {
  const base = locale === 'es' ? '/es/rentas' : '/rentals'
  const city = resolveCity(property)
  const neighborhood = resolveNeighborhood(property)

  if (city && neighborhood) {
    return `${base}/${city}/${neighborhood}/${property.slug}/`
  }
  if (city) {
    return `${base}/${city}/${property.slug}/`
  }
  // Legacy fallback — property with no structured city data
  return `${base}/${property.slug}/`
}

/**
 * Build the path segments (without /rentals/ prefix) for
 * generateStaticParams in catch-all route.
 */
export function propertyPathSegments(
  property: Pick<Property, 'slug' | 'meta'>,
): string[] {
  const city = resolveCity(property)
  const neighborhood = resolveNeighborhood(property)

  if (city && neighborhood) return [city, neighborhood, property.slug]
  if (city) return [city, property.slug]
  return [property.slug]
}

/**
 * Full absolute URL for a property (for sitemap, canonical, JSON-LD).
 */
export function propertyAbsoluteUrl(
  property: Pick<Property, 'slug' | 'meta'>,
  locale: Locale = 'en',
  siteUrl: string = SITE_URL,
): string {
  return `${siteUrl}${propertyHref(property, locale)}`
}

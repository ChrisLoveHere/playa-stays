// ============================================================
// Property browse — strict, data-true filtering & sorting
//
// All rules run against Property objects returned from WordPress.
// If CMS fields are missing, filters requiring those fields exclude
// the row (no “loose” guessing).
// ============================================================

import type { Property } from '@/types'
import { getPropertyAvailabilitySummary, stayWindowIsAvailable } from '@/lib/availability'
import { getPropertiesForBrowse } from '@/lib/wordpress'
import { propertyHasAmenity } from '@/lib/amenity-taxonomy'
import { rentalStrategyForFilter, type RentalStrategy } from '@/lib/rental-strategy'

export type BrowseListingMode = 'all' | 'rent' | 'sale'

export interface BrowseQuery {
  bedrooms: string
  bathrooms: string
  type: string
  features: string[]
  sort: string
  citySlug: string
  neighborhood: string
  listing: BrowseListingMode
  managedOnly: boolean
  priceMin: string
  priceMax: string
  guestsMin: string
  checkIn: string
  checkOut: string
  /** True when URL has monthly=1 — requires ps_monthly_rate > 0 */
  monthlyOnly: boolean
  /** vacation_rental | long_term | hybrid — strict match via meta or rate inference */
  rentalStrategy: '' | RentalStrategy
}

const BEDROOMS_STUDIO = 'studio'
const BEDROOMS_1 = '1br'
const BEDROOMS_2 = '2br'
/** Exactly 3 bedrooms */
const BEDROOMS_3 = '3br'
/** 4 or more bedrooms */
const BEDROOMS_4_PLUS = '4br'

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Infer rent/sale/both from explicit meta or rates */
export function inferListingRole(p: Property): 'rent' | 'sale' | 'both' {
  const t = p.meta.ps_listing_type
  if (t === 'rent' || t === 'sale' || t === 'both') return t
  const nightly = Number(p.meta.ps_nightly_rate) || 0
  const sale = Number(p.meta.ps_sale_price) || 0
  if (nightly > 0 && sale > 0) return 'both'
  if (sale > 0 && nightly <= 0) return 'sale'
  if (nightly > 0) return 'rent'
  if (sale > 0) return 'sale'
  return 'rent'
}

function isCatalogActive(p: Property): boolean {
  const s = p.meta.ps_listing_status
  if (!s) return true
  return s === 'active'
}

/**
 * Strict feature check: structured keys first, blob regex fallback.
 * Delegates to `propertyHasAmenity` which encodes the full precedence chain.
 */
function matchesFeature(p: Property, feature: string): boolean {
  return propertyHasAmenity(p, feature)
}

function matchesBedrooms(p: Property, bedrooms: string): boolean {
  if (!bedrooms) return true
  const n = p.meta.ps_bedrooms
  switch (bedrooms) {
    case BEDROOMS_STUDIO:
      return n === 0
    case BEDROOMS_1:
      return n === 1
    case BEDROOMS_2:
      return n === 2
    case BEDROOMS_3:
      return n === 3
    case BEDROOMS_4_PLUS:
      return n >= 4
    default:
      return true
  }
}

function matchesBathroomsMin(p: Property, bathrooms: string): boolean {
  if (!bathrooms) return true
  const min = parseInt(bathrooms, 10)
  if (Number.isNaN(min)) return true
  return p.meta.ps_bathrooms >= min
}

function matchesGuestsMin(p: Property, guestsMin: string): boolean {
  if (!guestsMin) return true
  const min = parseInt(guestsMin, 10)
  if (Number.isNaN(min)) return true
  return p.meta.ps_guests >= min
}

function matchesPropertyType(p: Property, type: string): boolean {
  if (!type) return true
  const raw = norm(p.meta.ps_property_type || '')
  if (raw) {
    if (type === 'condo') return raw.includes('condo')
    if (type === 'villa') return raw.includes('villa')
    if (type === 'penthouse') return raw.includes('penthouse')
    if (type === 'studio') return raw.includes('studio') || p.meta.ps_bedrooms === 0
    if (type === 'house') return /\bhouse\b|\bcasa\b|\bhome\b/i.test(raw)
    if (type === 'resort') return /resort|hotel|boutique\s*hotel/i.test(raw)
  }
  if (type === 'studio') return p.meta.ps_bedrooms === 0
  return false
}

function matchesMonthlyAvailable(p: Property, monthlyOnly: boolean): boolean {
  if (!monthlyOnly) return true
  const m = Number(p.meta.ps_monthly_rate) || 0
  return m > 0
}

function matchesRentalStrategy(p: Property, strategy: '' | RentalStrategy): boolean {
  if (!strategy) return true
  return rentalStrategyForFilter(p) === strategy
}

function matchesListingMode(p: Property, listing: BrowseListingMode): boolean {
  if (listing === 'all') return true
  const role = inferListingRole(p)
  if (listing === 'rent') return role === 'rent' || role === 'both'
  if (listing === 'sale') return role === 'sale' || role === 'both'
  return true
}

function matchesNeighborhood(p: Property, neighborhood: string): boolean {
  if (!neighborhood) return true
  const n = norm(p.meta.ps_neighborhood || '')
  return n === norm(neighborhood) || n.includes(norm(neighborhood))
}

function matchesCitySlug(p: Property, citySlug: string): boolean {
  if (!citySlug) return true
  if (p.meta.ps_city === citySlug) return true
  return norm(p.meta.ps_city) === norm(citySlug.replace(/-/g, ' '))
}

function matchesPrice(p: Property, q: BrowseQuery): boolean {
  const min = q.priceMin ? parseFloat(q.priceMin) : NaN
  const max = q.priceMax ? parseFloat(q.priceMax) : NaN
  const role = inferListingRole(p)
  const useNightly = q.listing !== 'sale' && (role === 'rent' || role === 'both' || q.listing === 'all')
  const rate = useNightly && p.meta.ps_nightly_rate > 0
    ? p.meta.ps_nightly_rate
    : Number(p.meta.ps_sale_price) || 0
  if (!Number.isFinite(rate) || rate <= 0) {
    if (q.priceMin || q.priceMax) return false
    return true
  }
  if (Number.isFinite(min) && rate < min) return false
  if (Number.isFinite(max) && rate > max) return false
  return true
}

function matchesManaged(p: Property, managedOnly: boolean): boolean {
  if (!managedOnly) return true
  return p.meta.ps_managed_by_ps === true
}

/**
 * Date-aware browse filter:
 * - Sale-only listings: excluded when the user is searching travel dates
 *   (listing mode ≠ sale) — dates do not apply to purchase inventory.
 * - Rental listings: if `ps_availability_json` yields blocks, stay must not overlap
 *   booked/blocked/owner/maintenance spans (half-open dates).
 * - If no structured calendar exists yet, do not exclude (honest until CMS connects).
 */
function matchesAvailabilityWindow(p: Property, q: BrowseQuery): boolean {
  const checkIn = q.checkIn
  const checkOut = q.checkOut
  if (!checkIn || !checkOut) return true

  if (q.listing === 'sale') return true

  const role = inferListingRole(p)
  if (role === 'sale') return false

  const summary = getPropertyAvailabilitySummary(p)
  if (!summary.hasStructuredCalendar) return true

  return stayWindowIsAvailable(summary.blocks, checkIn, checkOut)
}

export function propertyMatchesBrowse(p: Property, q: BrowseQuery): boolean {
  if (!isCatalogActive(p)) return false

  if (!matchesListingMode(p, q.listing)) return false
  if (!matchesManaged(p, q.managedOnly)) return false
  if (!matchesBedrooms(p, q.bedrooms)) return false
  if (!matchesBathroomsMin(p, q.bathrooms)) return false
  if (!matchesPropertyType(p, q.type)) return false
  if (!matchesGuestsMin(p, q.guestsMin)) return false
  if (!matchesNeighborhood(p, q.neighborhood)) return false
  if (q.citySlug && !matchesCitySlug(p, q.citySlug)) return false
  if (!matchesPrice(p, q)) return false
  if (!matchesAvailabilityWindow(p, q)) return false
  if (!matchesMonthlyAvailable(p, q.monthlyOnly)) return false
  if (!matchesRentalStrategy(p, q.rentalStrategy)) return false

  for (const f of q.features) {
    if (!matchesFeature(p, f)) return false
  }

  return true
}

export function filterBrowseProperties(properties: Property[], q: BrowseQuery): Property[] {
  return properties.filter(p => propertyMatchesBrowse(p, q))
}

export function sortBrowseProperties(properties: Property[], sort: string): Property[] {
  const arr = [...properties]
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => {
        const pa = a.meta.ps_nightly_rate || a.meta.ps_sale_price || 0
        const pb = b.meta.ps_nightly_rate || b.meta.ps_sale_price || 0
        return pa - pb
      })
    case 'price-desc':
      return arr.sort((a, b) => {
        const pa = a.meta.ps_nightly_rate || a.meta.ps_sale_price || 0
        const pb = b.meta.ps_nightly_rate || b.meta.ps_sale_price || 0
        return pb - pa
      })
    case 'bedrooms-desc':
      return arr.sort((a, b) => b.meta.ps_bedrooms - a.meta.ps_bedrooms)
    case 'bedrooms-asc':
      return arr.sort((a, b) => a.meta.ps_bedrooms - b.meta.ps_bedrooms)
    case 'newest':
      return arr.sort((a, b) => b.id - a.id)
    case 'rating':
      return arr.sort((a, b) => (b.meta.ps_avg_rating || 0) - (a.meta.ps_avg_rating || 0))
    case 'recommended':
    default:
      return arr.sort((a, b) => {
        const ma = a.meta.ps_managed_by_ps ? 1 : 0
        const mb = b.meta.ps_managed_by_ps ? 1 : 0
        if (mb !== ma) return mb - ma
        return (b.meta.ps_avg_rating || 0) - (a.meta.ps_avg_rating || 0)
      })
  }
}

/**
 * Server-only: fetch broad inventory, apply strict filters + sort from URL.
 */
export async function loadBrowseProperties(
  searchParams: Record<string, string | string[] | undefined>,
  opts: { citySlug?: string; preview?: boolean }
): Promise<Property[]> {
  const q = parseBrowseQuery(searchParams, { citySlug: opts.citySlug })
  const fetchCity = opts.citySlug || q.citySlug || undefined
  const raw = await getPropertiesForBrowse({
    citySlug: fetchCity,
    perPage: 100,
    preview: opts.preview,
  })
  const scoped: BrowseQuery = {
    ...q,
    citySlug: opts.citySlug || q.citySlug,
  }
  const filtered = filterBrowseProperties(raw, scoped)
  return sortBrowseProperties(filtered, q.sort)
}

export function parseBrowseQuery(
  sp: Record<string, string | string[] | undefined>,
  defaults: { citySlug?: string } = {}
): BrowseQuery {
  const feat = sp.feature
  const features = Array.isArray(feat) ? feat : feat ? [feat] : []

  const listingRaw = (typeof sp.listing === 'string' ? sp.listing : '') as string
  const listing: BrowseListingMode =
    listingRaw === 'sale' || listingRaw === 'rent' || listingRaw === 'all'
      ? listingRaw
      : 'all'

  const rsRaw = typeof sp.rentalStrategy === 'string' ? sp.rentalStrategy : ''
  const rentalStrategy: '' | RentalStrategy =
    rsRaw === 'vacation_rental' || rsRaw === 'long_term' || rsRaw === 'hybrid' ? rsRaw : ''

  return {
    bedrooms: typeof sp.bedrooms === 'string' ? sp.bedrooms : '',
    bathrooms: typeof sp.bathrooms === 'string' ? sp.bathrooms : '',
    type: typeof sp.type === 'string' ? sp.type : '',
    features,
    sort: typeof sp.sort === 'string' ? sp.sort : 'recommended',
    citySlug:
      (typeof sp.city === 'string' && sp.city) ||
      defaults.citySlug ||
      '',
    neighborhood: typeof sp.neighborhood === 'string' ? sp.neighborhood : '',
    listing,
    managedOnly: sp.managed === '1' || sp.managed === 'true',
    priceMin: typeof sp.priceMin === 'string' ? sp.priceMin : '',
    priceMax: typeof sp.priceMax === 'string' ? sp.priceMax : '',
    guestsMin: typeof sp.guestsMin === 'string' ? sp.guestsMin : '',
    checkIn: typeof sp.checkIn === 'string' ? sp.checkIn : '',
    checkOut: typeof sp.checkOut === 'string' ? sp.checkOut : '',
    monthlyOnly: sp.monthly === '1' || sp.monthly === 'true',
    rentalStrategy,
  }
}

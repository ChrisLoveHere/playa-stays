// ============================================================
// PlayaStays — Rental strategy (separate from listing type)
//
// Listing type: rent | sale | both  (inventory / transaction mode)
// Rental strategy: vacation_rental | long_term | hybrid
//
// Used for: browse filters, property cards, detail badges, admin.
// Not part of public URL structure.
// ============================================================

import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'

/** Local copy to avoid circular import with property-browse.ts */
function inferListingRoleLocal(p: Property): 'rent' | 'sale' | 'both' {
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

export type RentalStrategy = 'vacation_rental' | 'long_term' | 'hybrid'

export const RENTAL_STRATEGY_VALUES: RentalStrategy[] = ['vacation_rental', 'long_term', 'hybrid']

export function isValidRentalStrategy(s: string | undefined | null): s is RentalStrategy {
  return s === 'vacation_rental' || s === 'long_term' || s === 'hybrid'
}

/** Normalised meta value for save (empty → omit / default handled upstream) */
export function normalizeRentalStrategyInput(s: string | undefined): RentalStrategy | '' {
  if (isValidRentalStrategy(s)) return s
  return ''
}

/**
 * Strategy for strict browse filtering.
 * Returns `null` when the concept does not apply (sale-only) or data is insufficient
 * to classify — those rows do not match any active strategy filter.
 */
export function rentalStrategyForFilter(p: Property): RentalStrategy | null {
  const role = inferListingRoleLocal(p)
  if (role === 'sale') return null

  const meta = p.meta.ps_rental_strategy
  if (isValidRentalStrategy(meta)) return meta

  const nightly = Number(p.meta.ps_nightly_rate) || 0
  const monthly = Number(p.meta.ps_monthly_rate) || 0
  if (nightly > 0 && monthly > 0) return 'hybrid'
  if (nightly > 0 && monthly <= 0) return 'vacation_rental'
  if (nightly <= 0 && monthly > 0) return 'long_term'
  return null
}

/**
 * Strategy for public badges — same as filter when inferrable; otherwise a sensible
 * default for rent/both listings so operators see something after setting meta.
 */
export function rentalStrategyForDisplay(p: Property): RentalStrategy | null {
  const role = inferListingRoleLocal(p)
  if (role === 'sale') return null

  const meta = p.meta.ps_rental_strategy
  if (isValidRentalStrategy(meta)) return meta

  const fromRates = rentalStrategyForFilter(p)
  if (fromRates) return fromRates

  return null
}

export function rentalStrategyLabel(strategy: RentalStrategy, locale: Locale): string {
  const es = locale === 'es'
  switch (strategy) {
    case 'vacation_rental':
      return es ? 'Renta vacacional' : 'Vacation rental'
    case 'long_term':
      return es ? 'Renta a largo plazo' : 'Long-term rental'
    case 'hybrid':
      return es ? 'Renta mixta' : 'Hybrid rental'
    default:
      return ''
  }
}

export function monthlyStayFriendlyLabel(locale: Locale): string {
  return locale === 'es' ? 'Estancias mensuales' : 'Monthly stay friendly'
}

export function showMonthlyStayFriendlyBadge(p: Property): boolean {
  const role = inferListingRoleLocal(p)
  if (role === 'sale') return false
  const monthly = Number(p.meta.ps_monthly_rate) || 0
  if (monthly <= 0) return false
  const s = rentalStrategyForDisplay(p)
  return s === 'vacation_rental' || s === 'hybrid'
}

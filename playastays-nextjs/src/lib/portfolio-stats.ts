// ============================================================
// PlayaStays — Portfolio Stats
//
// Pure aggregation helpers that derive marketing-safe stats
// from an already-fetched Property[] array.
// No additional fetch calls — uses data already in scope.
// ============================================================

import type { Property } from '@/types'

export interface PortfolioStats {
  totalActive:       number
  avgMonthlyIncome:  number   // USD, across all active properties
  topMonthlyIncome:  number   // highest single ps_monthly_income
  avgOccupancy:      number   // percentage (0–100)
  totalRevenue12mo:  number   // sum across portfolio × 12
  propertiesWithData:number   // count of properties with income > 0
}

/**
 * Derive portfolio stats from a live Property[] array.
 * Called server-side inside templates — no fetch.
 */
export function computePortfolioStats(
  properties: Property[],
  citySlug?: string
): PortfolioStats {
  // Filter to active managed properties, optionally by city
  const active = properties.filter( p =>
    p.meta.ps_managed_by_ps &&
    p.meta.ps_listing_status === 'active' &&
    ( ! citySlug || p.meta.ps_city === citySlug )
  )

  const withIncome = active.filter( p => p.meta.ps_monthly_income > 0 )
  const withOcc    = active.filter( p => p.meta.ps_avg_occupancy  > 0 )

  const totalIncome = withIncome.reduce( ( s, p ) => s + p.meta.ps_monthly_income, 0 )
  const topIncome   = withIncome.reduce( ( m, p ) => Math.max( m, p.meta.ps_monthly_income ), 0 )
  const totalOcc    = withOcc.reduce( ( s, p ) => s + p.meta.ps_avg_occupancy, 0 )

  return {
    totalActive:        active.length,
    avgMonthlyIncome:   withIncome.length > 0 ? Math.round( totalIncome / withIncome.length ) : 0,
    topMonthlyIncome:   Math.round( topIncome ),
    avgOccupancy:       withOcc.length > 0 ? Math.round( totalOcc / withOcc.length ) : 0,
    totalRevenue12mo:   Math.round( totalIncome * 12 ),
    propertiesWithData: withIncome.length,
  }
}

/**
 * Fallback stats used when no live property data is available
 * (e.g. first load before CMS is seeded).
 * Based on the market averages in pricing-data.ts.
 */
export const FALLBACK_PORTFOLIO_STATS: PortfolioStats = {
  totalActive:        200,
  avgMonthlyIncome:   3200,
  topMonthlyIncome:   9800,
  avgOccupancy:       82,
  totalRevenue12mo:   0,
  propertiesWithData: 0,
}

/**
 * Return stats, falling back gracefully if data is sparse.
 */
export function getDisplayStats(
  properties: Property[],
  citySlug?: string
): PortfolioStats {
  const computed = computePortfolioStats( properties, citySlug )

  // If we have fewer than 3 properties with income data, use fallbacks
  // so marketing numbers are never misleadingly small or zero
  if ( computed.propertiesWithData < 3 ) return FALLBACK_PORTFOLIO_STATS
  return computed
}

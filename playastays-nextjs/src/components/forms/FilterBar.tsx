'use client'
// ============================================================
// FilterBar — client component
// URL-driven: reads/writes search params, triggers navigation.
// Used on rental category pages and /rentals/ index.
// ============================================================

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface FilterOption {
  label: string
  value: string
}

const BEDROOM_OPTIONS: FilterOption[] = [
  { label: 'Any',    value: '' },
  { label: 'Studio', value: 'studio' },
  { label: '1 Bed',  value: '1br' },
  { label: '2 Beds', value: '2br' },
  { label: '3+ Beds',value: '3br' },
]

const TYPE_OPTIONS: FilterOption[] = [
  { label: 'Any Type',   value: '' },
  { label: 'Condo',      value: 'condo' },
  { label: 'Villa',      value: 'villa' },
  { label: 'Penthouse',  value: 'penthouse' },
  { label: 'Studio',     value: 'studio' },
]

const FEATURE_OPTIONS: FilterOption[] = [
  { label: 'Beachfront', value: 'beachfront' },
  { label: 'Pool',       value: 'pool' },
  { label: 'Pet-Friendly', value: 'pet-friendly' },
  { label: 'Ocean View', value: 'ocean-view' },
]

const SORT_OPTIONS: FilterOption[] = [
  { label: 'Recommended',  value: 'recommended' },
  { label: 'Price: Low',   value: 'price-asc' },
  { label: 'Price: High',  value: 'price-desc' },
  { label: 'Top Rated',    value: 'rating' },
]

export function FilterBar() {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  const current = {
    bedrooms: searchParams.get('bedrooms') ?? '',
    type:     searchParams.get('type')     ?? '',
    features: searchParams.getAll('feature'),
    sort:     searchParams.get('sort')     ?? 'recommended',
  }

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const toggleFeature = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const existing = params.getAll('feature')
    params.delete('feature')
    if (existing.includes(value)) {
      existing.filter(f => f !== value).forEach(f => params.append('feature', f))
    } else {
      [...existing, value].forEach(f => params.append('feature', f))
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  return (
    <div className="filter-bar">
      {/* Bedrooms */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {BEDROOM_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`filter-chip${current.bedrooms === opt.value ? ' active' : ''}`}
            onClick={() => update('bedrooms', opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Type */}
      <select
        className="sort-select"
        value={current.type}
        onChange={e => update('type', e.target.value)}
        aria-label="Property type"
      >
        {TYPE_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Features */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 4 }}>
        {FEATURE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`filter-chip${current.features.includes(opt.value) ? ' active' : ''}`}
            onClick={() => toggleFeature(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        className="sort-select"
        value={current.sort}
        onChange={e => update('sort', e.target.value)}
        aria-label="Sort by"
        style={{ marginLeft: 'auto' }}
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

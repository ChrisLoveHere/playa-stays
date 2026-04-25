'use client'
// ============================================================
// FilterBar — URL-driven browse filters (client)
// Maps to server-side strict filtering in property-browse.ts
//
// Layout: compact inline search bar → "Filters" button opens
// a structured panel grouped by amenity taxonomy categories.
// ============================================================

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import type { Neighborhood } from '@/types'
import { AMENITY_CATEGORIES, amenityLabel, amenityIcon } from '@/lib/amenity-taxonomy'

// ── constants ─────────────────────────────────────────────

const BEDROOM_VALUES = ['', 'studio', '1br', '2br', '3br', '4br'] as const
const BATH_VALUES    = ['', '1', '2', '3', '4'] as const
const GUEST_VALUES   = ['', '2', '4', '6', '8'] as const

function typeOpts(isEs: boolean) {
  const any = isEs ? 'Cualquiera' : 'Any'
  return [
    { label: any, value: '' },
    { label: 'Condo', value: 'condo' },
    { label: 'Villa', value: 'villa' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: isEs ? 'Casa' : 'House', value: 'house' },
    { label: isEs ? 'Estudio' : 'Studio', value: 'studio' },
  ]
}

// ── types ─────────────────────────────────────────────────

export interface BrowseCityOption { slug: string; name: string }

interface FilterBarProps {
  locale?: Locale
  neighborhoods?: Neighborhood[]
  browseCities?: BrowseCityOption[]
  scopedCitySlug?: string
  resultCount?: number
  /** Larger bar for /rentals search-first hero */
  variant?: 'default' | 'prominent'
}

// ── component ─────────────────────────────────────────────

export function FilterBar({
  locale = 'en',
  neighborhoods = [],
  browseCities = [],
  scopedCitySlug,
  resultCount,
  variant = 'default',
}: FilterBarProps) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const ui           = t(locale)
  const isEs         = locale === 'es'

  const [panelOpen, setPanelOpen] = useState(false)

  const listingParam = searchParams.get('listing')

  const current = useMemo(() => ({
    bedrooms:     searchParams.get('bedrooms') ?? '',
    type:         searchParams.get('type') ?? '',
    features:     searchParams.getAll('feature'),
    sort:         searchParams.get('sort') ?? 'recommended',
    listing:      listingParam ?? 'all',
    bathrooms:    searchParams.get('bathrooms') ?? '',
    neighborhood: searchParams.get('neighborhood') ?? '',
    priceMin:     searchParams.get('priceMin') ?? '',
    priceMax:     searchParams.get('priceMax') ?? '',
    guestsMin:    searchParams.get('guestsMin') ?? '',
    managed:      searchParams.get('managed') === '1',
    checkIn:      searchParams.get('checkIn') ?? '',
    checkOut:     searchParams.get('checkOut') ?? '',
    city:         searchParams.get('city') ?? '',
    rentalStrategy:
      searchParams.get('rentalStrategy') === 'vacation_rental' ||
      searchParams.get('rentalStrategy') === 'long_term' ||
      searchParams.get('rentalStrategy') === 'hybrid'
        ? (searchParams.get('rentalStrategy') as 'vacation_rental' | 'long_term' | 'hybrid')
        : '',
  }), [searchParams, listingParam])

  // ── URL helpers ─────────────────────────────────────────
  const rentalsRoot = isEs ? '/es/rentas' : '/rentals'

  const pushParams = useCallback((next: URLSearchParams) => {
    next.delete('page')
    const q = next.toString()
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false })
  }, [router, pathname])

  const update = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value); else p.delete(key)
    pushParams(p)
  }, [searchParams, pushParams])

  const toggleFeature = useCallback((value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    const ex = p.getAll('feature')
    p.delete('feature')
    if (ex.includes(value)) ex.filter(f => f !== value).forEach(f => p.append('feature', f))
    else [...ex, value].forEach(f => p.append('feature', f))
    pushParams(p)
  }, [searchParams, pushParams])

  const toggleManaged = useCallback(() => {
    const p = new URLSearchParams(searchParams.toString())
    if (p.get('managed') === '1') p.delete('managed'); else p.set('managed', '1')
    pushParams(p)
  }, [searchParams, pushParams])

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const onCityChange = useCallback((slug: string) => {
    const p = new URLSearchParams(searchParams.toString())
    p.delete('city')
    const qs = p.toString()
    if (scopedCitySlug) {
      if (!slug) { router.push(`${rentalsRoot}${qs ? `?${qs}` : ''}`, { scroll: false }); return }
      if (slug === scopedCitySlug) { router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }); return }
      const prefix = isEs ? '/es' : ''
      router.push(`${prefix}/${slug}/${isEs ? 'rentas' : 'rentals'}${qs ? `?${qs}` : ''}`, { scroll: false })
      return
    }
    if (!slug) { router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }); return }
    p.set('city', slug)
    pushParams(p)
  }, [searchParams, router, pathname, scopedCitySlug, isEs, pushParams, rentalsRoot])

  // ── labels ──────────────────────────────────────────────
  const bedLabels   = isEs ? ['Cualq.', 'Est.', '1', '2', '3', '4+'] : ['Any', 'Studio', '1', '2', '3', '4+']
  const bathLabels  = isEs ? ['Cualq.', '1+', '2+', '3+', '4+']      : ['Any', '1+', '2+', '3+', '4+']
  const guestLabels = isEs ? ['Cualq.', '2+', '4+', '6+', '8+']      : ['Any', '2+', '4+', '6+', '8+']

  const fLabel = useCallback((key: string) => amenityLabel(key, locale), [locale])

  const filterCount = useMemo(() => {
    let n = 0
    if (current.bedrooms) n++
    if (current.bathrooms) n++
    if (current.type) n++
    if (current.priceMin || current.priceMax) n++
    if (current.neighborhood) n++
    if (current.features.length) n += current.features.length
    if (current.managed) n++
    if (current.sort !== 'recommended') n++
    if (current.rentalStrategy) n++
    return n
  }, [current])

  const selectedCityValue = scopedCitySlug ?? current.city ?? ''

  const sortOptions = [
    { label: ui.browseSortRecommended, value: 'recommended' },
    { label: ui.browseSortNewest,      value: 'newest' },
    { label: ui.browseSortPriceAsc,    value: 'price-asc' },
    { label: ui.browseSortPriceDesc,   value: 'price-desc' },
    { label: ui.browseSortRating,      value: 'rating' },
    { label: ui.browseSortBedsDesc,    value: 'bedrooms-desc' },
    { label: ui.browseSortBedsAsc,     value: 'bedrooms-asc' },
  ]

  const bfClass = variant === 'prominent' ? 'bf bf--prominent' : 'bf'

  // ── render ──────────────────────────────────────────────
  return (
    <div className={bfClass}>
      {/* ── Compact inline bar ── */}
      <div className="bf-bar">
        <div className="bf-bar__fields">
          <label className="bf-bar__field">
            <span className="bf-bar__label">{ui.browseCheckIn}</span>
            <input type="date" className="bf-bar__input" value={current.checkIn}
              onChange={e => update('checkIn', e.target.value)} />
          </label>
          <label className="bf-bar__field">
            <span className="bf-bar__label">{ui.browseCheckOut}</span>
            <input type="date" className="bf-bar__input" value={current.checkOut}
              min={current.checkIn || undefined}
              onChange={e => update('checkOut', e.target.value)} />
          </label>
          <label className="bf-bar__field bf-bar__field--guests">
            <span className="bf-bar__label">{ui.browseGuests}</span>
            <select className="bf-bar__input bf-bar__input--sel" value={current.guestsMin}
              onChange={e => update('guestsMin', e.target.value)} aria-label={ui.browseGuests}>
              {GUEST_VALUES.map((v, i) => <option key={v||'any'} value={v}>{guestLabels[i]}</option>)}
            </select>
          </label>
          <label className="bf-bar__field bf-bar__field--city">
            <span className="bf-bar__label">{ui.browseCity}</span>
            <select className="bf-bar__input bf-bar__input--sel" value={selectedCityValue}
              onChange={e => onCityChange(e.target.value)} aria-label={ui.browseCity}>
              <option value="">{ui.browseCityAll}</option>
              {browseCities.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <div className="bf-bar__listing" role="group" aria-label={ui.browseListingType}>
            {(['all', 'rent', 'sale'] as const).map(v => {
              const lab = v === 'all' ? ui.browseListingAll : v === 'rent' ? ui.browseListingRent : ui.browseListingSale
              const act = v === 'all' ? (!listingParam || listingParam === 'all') : listingParam === v
              return <button key={v} type="button" className={`bf-bar__lt-btn${act ? ' is-active' : ''}`}
                onClick={() => update('listing', v === 'all' ? '' : v)}>{lab}</button>
            })}
          </div>
        </div>

        <button type="button" className="bf-bar__filters-btn" onClick={() => setPanelOpen(o => !o)}
          aria-expanded={panelOpen}>
          <FilterIcon />
          <span>{ui.browseMoreFilters}</span>
          {filterCount > 0 && <span className="bf-bar__badge">{filterCount}</span>}
        </button>
      </div>

      {/* ── Active chips (only when panel closed) ── */}
      {!panelOpen && filterCount > 0 && (
        <div className="bf-chips">
          {current.bedrooms && (
            <Chip label={`${ui.browseBedrooms}: ${bedLabels[BEDROOM_VALUES.indexOf(current.bedrooms as (typeof BEDROOM_VALUES)[number])] ?? current.bedrooms}`}
              onRemove={() => update('bedrooms', '')} />
          )}
          {current.bathrooms && <Chip label={`${ui.browseBathrooms}: ${current.bathrooms}+`} onRemove={() => update('bathrooms', '')} />}
          {current.type && <Chip label={current.type} onRemove={() => update('type', '')} />}
          {(current.priceMin || current.priceMax) && (
            <Chip label={`$${current.priceMin || '—'} – $${current.priceMax || '—'}`} onRemove={() => {
              const p = new URLSearchParams(searchParams.toString()); p.delete('priceMin'); p.delete('priceMax'); pushParams(p)
            }} />
          )}
          {current.neighborhood && <Chip label={current.neighborhood} onRemove={() => update('neighborhood', '')} />}
          {current.features.map(f => <Chip key={f} label={fLabel(f)} onRemove={() => toggleFeature(f)} />)}
          {current.managed && <Chip label={ui.browseManagedOnly} onRemove={() => { const p = new URLSearchParams(searchParams.toString()); p.delete('managed'); pushParams(p) }} />}
          {current.rentalStrategy === 'vacation_rental' && (
            <Chip label={ui.browseRentalStrategyVacation} onRemove={() => update('rentalStrategy', '')} />
          )}
          {current.rentalStrategy === 'long_term' && (
            <Chip label={ui.browseRentalStrategyLongTerm} onRemove={() => update('rentalStrategy', '')} />
          )}
          {current.rentalStrategy === 'hybrid' && (
            <Chip label={ui.browseRentalStrategyHybrid} onRemove={() => update('rentalStrategy', '')} />
          )}
          <button type="button" className="bf-chips__clear" onClick={clearAll}>{ui.browseClearAll}</button>
        </div>
      )}

      {/* ── Filter panel ── */}
      {panelOpen && (
        <div className="bf-panel">
          {/* Rooms & beds */}
          <PanelSection title={isEs ? 'Habitaciones' : 'Rooms & beds'}>
            <SegRow label={ui.browseBedrooms} values={[...BEDROOM_VALUES]} labels={bedLabels}
              current={current.bedrooms} onChange={v => update('bedrooms', v)} />
            <SegRow label={ui.browseBathrooms} values={[...BATH_VALUES]} labels={bathLabels}
              current={current.bathrooms} onChange={v => update('bathrooms', v)} />
            <SegRow label={ui.browseGuests} values={[...GUEST_VALUES]} labels={guestLabels}
              current={current.guestsMin} onChange={v => update('guestsMin', v)} />
          </PanelSection>

          {/* Price range */}
          <PanelSection title={isEs ? 'Precio' : 'Price range'}>
            <div className="bf-panel__row-tight">
              <label className="bf-panel__field">
                <span className="bf-panel__flabel">{ui.browsePriceMinPh}</span>
                <input type="number" min={0} className="bf-panel__input" placeholder="—"
                  value={current.priceMin} onChange={e => update('priceMin', e.target.value)} />
              </label>
              <span className="bf-panel__dash">–</span>
              <label className="bf-panel__field">
                <span className="bf-panel__flabel">{ui.browsePriceMaxPh}</span>
                <input type="number" min={0} className="bf-panel__input" placeholder="—"
                  value={current.priceMax} onChange={e => update('priceMax', e.target.value)} />
              </label>
            </div>
          </PanelSection>

          {/* Rental strategy (secondary — under More filters) */}
          <PanelSection title={ui.browseRentalStrategy}>
            <p className="bf-panel__hint" style={{ margin: '0 0 .65rem', fontSize: '.78rem', color: 'var(--muted, #6b7280)' }}>{ui.browseRentalStrategyHint}</p>
            <div className="bf-panel__chip-grid">
              <button
                type="button"
                className={`bf-chip${current.rentalStrategy === '' ? ' is-active' : ''}`}
                onClick={() => update('rentalStrategy', '')}
              >
                {ui.browseRentalStrategyAny}
              </button>
              <button
                type="button"
                className={`bf-chip${current.rentalStrategy === 'vacation_rental' ? ' is-active' : ''}`}
                onClick={() => update('rentalStrategy', current.rentalStrategy === 'vacation_rental' ? '' : 'vacation_rental')}
              >
                {ui.browseRentalStrategyVacation}
              </button>
              <button
                type="button"
                className={`bf-chip${current.rentalStrategy === 'long_term' ? ' is-active' : ''}`}
                onClick={() => update('rentalStrategy', current.rentalStrategy === 'long_term' ? '' : 'long_term')}
              >
                {ui.browseRentalStrategyLongTerm}
              </button>
              <button
                type="button"
                className={`bf-chip${current.rentalStrategy === 'hybrid' ? ' is-active' : ''}`}
                onClick={() => update('rentalStrategy', current.rentalStrategy === 'hybrid' ? '' : 'hybrid')}
              >
                {ui.browseRentalStrategyHybrid}
              </button>
            </div>
          </PanelSection>

          {/* Property type */}
          <PanelSection title={ui.browsePropertyType}>
            <div className="bf-panel__chip-grid">
              {typeOpts(isEs).slice(1).map(o => (
                <button key={o.value} type="button"
                  className={`bf-chip${current.type === o.value ? ' is-active' : ''}`}
                  onClick={() => update('type', current.type === o.value ? '' : o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          </PanelSection>

          {/* Amenity categories from taxonomy */}
          {AMENITY_CATEGORIES.map(cat => (
            <PanelSection key={cat.id} title={isEs ? cat.es : cat.en}>
              <div className="bf-panel__chip-grid">
                {cat.items.filter(item => item.filterEligible !== false).map(item => (
                  <button key={item.key} type="button"
                    className={`bf-chip bf-chip--icon${current.features.includes(item.key) ? ' is-active' : ''}`}
                    onClick={() => toggleFeature(item.key)}>
                    <span className="bf-chip__ico" aria-hidden>{item.icon}</span>
                    <span>{isEs ? item.es : item.en}</span>
                  </button>
                ))}
              </div>
            </PanelSection>
          ))}

          {/* Neighborhood */}
          {neighborhoods.length > 0 && (
            <PanelSection title={ui.browseNeighborhood}>
              <select className="bf-panel__select" value={current.neighborhood}
                onChange={e => update('neighborhood', e.target.value)}>
                <option value="">{ui.browseNeighborhoodAny}</option>
                {neighborhoods.map((n, i) =>
                  <option key={n.slug ?? `${n.name}-${i}`} value={n.name}>{n.name}</option>)}
              </select>
            </PanelSection>
          )}

          {/* PlayaStays managed */}
          <PanelSection title="PlayaStays">
            <button type="button"
              className={`bf-chip bf-chip--icon${current.managed ? ' is-active' : ''}`}
              onClick={toggleManaged}>
              <span className="bf-chip__ico" aria-hidden>✦</span>
              <span>{ui.browseManagedOnly}</span>
            </button>
          </PanelSection>

          {/* Sort */}
          <PanelSection title={ui.browseSortBy}>
            <select className="bf-panel__select" value={current.sort}
              onChange={e => update('sort', e.target.value)}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </PanelSection>

          {/* Sticky footer */}
          <div className="bf-panel__foot">
            <button type="button" className="bf-panel__clear" onClick={clearAll}>
              {ui.browseClearAll}
            </button>
            <button type="button" className="bf-panel__apply" onClick={() => setPanelOpen(false)}>
              {resultCount != null
                ? (isEs ? `Mostrar ${resultCount} propiedades` : `Show ${resultCount} properties`)
                : (isEs ? 'Ver resultados' : 'Show results')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── sub-components ────────────────────────────────────────

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bf-section">
      <h4 className="bf-section__title">{title}</h4>
      {children}
    </div>
  )
}

function SegRow({ label, values, labels, current, onChange }: {
  label: string; values: string[]; labels: string[]
  current: string; onChange: (v: string) => void
}) {
  return (
    <div className="bf-seg-row">
      <span className="bf-seg-row__label">{label}</span>
      <div className="bf-seg-row__btns" role="group">
        {values.map((v, i) => (
          <button key={v || 'any'} type="button"
            className={`bf-seg-row__btn${current === v ? ' is-active' : ''}`}
            onClick={() => onChange(v)}>
            {labels[i]}
          </button>
        ))}
      </div>
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button type="button" className="bf-chip-rem" onClick={onRemove}>
      <span>{label}</span>
      <span className="bf-chip-rem__x" aria-hidden>×</span>
    </button>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" />
      <line x1="12" y1="18" x2="20" y2="18" />
    </svg>
  )
}

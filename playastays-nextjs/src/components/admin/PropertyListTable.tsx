'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { CompletenessReport } from '@/lib/property-completeness'
import type { LaunchReadiness } from '@/lib/admin-readiness'

export interface PropertyRow {
  id: number
  slug: string
  title: string
  city: string
  neighborhood: string
  buildingName: string
  rentalStrategyLabel: string
  propertyType: string
  listingType: 'rent' | 'sale' | 'both'
  status: string
  managed: boolean
  featured: boolean
  nightlyRate: number
  monthlyRate: number
  salePrice: number
  rating: number
  reviews: number
  photoCount: number
  completeness: CompletenessReport
  launch: LaunchReadiness
  imageUrl?: string
}

interface Props {
  rows: PropertyRow[]
}

type BulkActionBody =
  | { action: 'set_featured'; value: boolean }
  | { action: 'set_managed'; value: boolean }
  | { action: 'set_listing_status'; value: string }
  | { action: 'set_rental_strategy'; value: string }

function tierPill(tier: CompletenessReport['tier']) {
  switch (tier) {
    case 'complete': return <span className="adm-pill adm-pill--green">Ready</span>
    case 'good': return <span className="adm-pill adm-pill--blue">Good</span>
    case 'needs-work': return <span className="adm-pill adm-pill--yellow">Needs work</span>
    case 'incomplete': return <span className="adm-pill adm-pill--red">Incomplete</span>
  }
}

function queuePill(queue: LaunchReadiness['queue']) {
  switch (queue) {
    case 'launch_ready':
      return <span className="adm-queue-pill adm-queue-pill--ok" title="Operational launch queue">Launch-ready</span>
    case 'blocked':
      return <span className="adm-queue-pill adm-queue-pill--blocked" title="Operational launch queue">Blocked</span>
    default:
      return <span className="adm-queue-pill adm-queue-pill--work" title="Operational launch queue">Needs work</span>
  }
}

function statusPill(status: string) {
  switch (status) {
    case 'active': return <span className="adm-pill adm-pill--green">Active</span>
    case 'draft': return <span className="adm-pill adm-pill--gray">Draft</span>
    case 'inactive': return <span className="adm-pill adm-pill--gray">Inactive</span>
    case 'archived': return <span className="adm-pill adm-pill--red">Archived</span>
    default: return <span className="adm-pill adm-pill--green">{status || 'Active'}</span>
  }
}

function listingBadge(lt: string) {
  switch (lt) {
    case 'rent': return <span className="adm-pill adm-pill--teal">Rent</span>
    case 'sale': return <span className="adm-pill adm-pill--blue">Sale</span>
    case 'both': return <><span className="adm-pill adm-pill--teal">Rent</span>{' '}<span className="adm-pill adm-pill--blue">Sale</span></>
    default: return <span className="adm-pill adm-pill--gray">—</span>
  }
}

function scoreFill(score: number) {
  if (score >= 90) return 'adm-score__fill--green'
  if (score >= 60) return 'adm-score__fill--yellow'
  return 'adm-score__fill--red'
}

export function PropertyListTable({ rows }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterManaged, setFilterManaged] = useState(false)
  const [filterFeatured, setFilterFeatured] = useState(false)
  const [filterIncomplete, setFilterIncomplete] = useState(false)
  const [filterQueue, setFilterQueue] = useState<'' | LaunchReadiness['queue']>('')
  const [filterMissingPhotos, setFilterMissingPhotos] = useState(false)
  const [filterMissingNeighborhood, setFilterMissingNeighborhood] = useState(false)
  const [filterMissingBuilding, setFilterMissingBuilding] = useState(false)
  const [sort, setSort] = useState<'name' | 'score' | 'price' | 'city'>('name')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [bulkBusy, setBulkBusy] = useState(false)
  const [bulkMsg, setBulkMsg] = useState<string | null>(null)

  const cities = useMemo(() => [...new Set(rows.map(r => r.city).filter(Boolean))].sort(), [rows])

  const filtered = useMemo(() => {
    let list = rows
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.neighborhood.toLowerCase().includes(q) ||
        r.buildingName.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q),
      )
    }
    if (filterCity) list = list.filter(r => r.city === filterCity)
    if (filterType) list = list.filter(r => r.listingType === filterType)
    if (filterStatus) list = list.filter(r => (r.status || 'active') === filterStatus)
    if (filterManaged) list = list.filter(r => r.managed)
    if (filterFeatured) list = list.filter(r => r.featured)
    if (filterIncomplete) list = list.filter(r => r.completeness.tier === 'incomplete' || r.completeness.tier === 'needs-work')
    if (filterQueue) list = list.filter(r => r.launch.queue === filterQueue)
    if (filterMissingPhotos) list = list.filter(r => r.launch.flags.missingPhotos)
    if (filterMissingNeighborhood) list = list.filter(r => r.launch.flags.missingNeighborhood)
    if (filterMissingBuilding) list = list.filter(r => r.launch.flags.missingBuilding)

    const sorted = [...list]
    switch (sort) {
      case 'score': sorted.sort((a, b) => a.completeness.score - b.completeness.score); break
      case 'price': sorted.sort((a, b) => (b.nightlyRate || b.salePrice) - (a.nightlyRate || a.salePrice)); break
      case 'city': sorted.sort((a, b) => a.city.localeCompare(b.city)); break
      default: sorted.sort((a, b) => a.title.localeCompare(b.title))
    }
    return sorted
  }, [rows, search, filterCity, filterType, filterStatus, filterManaged, filterFeatured, filterIncomplete, filterQueue, filterMissingPhotos, filterMissingNeighborhood, filterMissingBuilding, sort])

  const activeFilterCount =
    [filterCity, filterType, filterStatus, filterQueue].filter(Boolean).length
    + (filterManaged ? 1 : 0)
    + (filterFeatured ? 1 : 0)
    + (filterIncomplete ? 1 : 0)
    + (filterMissingPhotos ? 1 : 0)
    + (filterMissingNeighborhood ? 1 : 0)
    + (filterMissingBuilding ? 1 : 0)

  const allFilteredSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id))
  const someSelected = selected.size > 0

  function clearFilters() {
    setSearch('')
    setFilterCity('')
    setFilterType('')
    setFilterStatus('')
    setFilterManaged(false)
    setFilterFeatured(false)
    setFilterIncomplete(false)
    setFilterQueue('')
    setFilterMissingPhotos(false)
    setFilterMissingNeighborhood(false)
    setFilterMissingBuilding(false)
  }

  const toggleRow = useCallback((id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAllFiltered = useCallback(() => {
    if (allFilteredSelected) {
      setSelected(prev => {
        const next = new Set(prev)
        for (const r of filtered) next.delete(r.id)
        return next
      })
    } else {
      setSelected(prev => {
        const next = new Set(prev)
        for (const r of filtered) next.add(r.id)
        return next
      })
    }
  }, [allFilteredSelected, filtered])

  const runBulk = useCallback(async (bulk: BulkActionBody) => {
    const ids = [...selected]
    if (ids.length === 0) return
    setBulkBusy(true)
    setBulkMsg(null)
    try {
      const res = await fetch('/api/admin/properties/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, bulk }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setBulkMsg(data.error || `Bulk update failed (${res.status})`)
        return
      }
      if (!data.ok && data.failed > 0) {
        setBulkMsg(`Updated ${data.updated}; ${data.failed} failed. Check WordPress credentials and IDs.`)
      } else {
        setBulkMsg(`Updated ${data.updated} listing${data.updated === 1 ? '' : 's'}.`)
      }
      setSelected(new Set())
      router.refresh()
    } catch {
      setBulkMsg('Network error during bulk update.')
    } finally {
      setBulkBusy(false)
    }
  }, [selected, router])

  return (
    <>
      <div className="adm-filters">
        <div className="adm-filters__search">
          <input
            type="search"
            className="adm-field__input"
            placeholder="Search properties..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <select className="adm-field__select" value={filterCity} onChange={e => setFilterCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="adm-field__select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All types</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
          <option value="both">Both</option>
        </select>
        <select className="adm-field__select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
        <select className="adm-field__select" value={filterQueue} onChange={e => setFilterQueue(e.target.value as typeof filterQueue)}>
          <option value="">All queues</option>
          <option value="launch_ready">Launch-ready</option>
          <option value="needs_work">Needs work</option>
          <option value="blocked">Blocked / draft</option>
        </select>
        <label className="adm-field__check-row" style={{ fontSize: '.82rem' }}>
          <input type="checkbox" checked={filterManaged} onChange={e => setFilterManaged(e.target.checked)} />
          PS Managed
        </label>
        <label className="adm-field__check-row" style={{ fontSize: '.82rem' }}>
          <input type="checkbox" checked={filterFeatured} onChange={e => setFilterFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="adm-field__check-row" style={{ fontSize: '.82rem' }}>
          <input type="checkbox" checked={filterIncomplete} onChange={e => setFilterIncomplete(e.target.checked)} />
          Low completeness
        </label>
        <label className="adm-field__check-row" style={{ fontSize: '.82rem' }}>
          <input type="checkbox" checked={filterMissingPhotos} onChange={e => setFilterMissingPhotos(e.target.checked)} />
          Missing photos
        </label>
        <label className="adm-field__check-row" style={{ fontSize: '.82rem' }}>
          <input type="checkbox" checked={filterMissingNeighborhood} onChange={e => setFilterMissingNeighborhood(e.target.checked)} />
          Missing neighborhood
        </label>
        <label className="adm-field__check-row" style={{ fontSize: '.82rem' }}>
          <input type="checkbox" checked={filterMissingBuilding} onChange={e => setFilterMissingBuilding(e.target.checked)} />
          Missing building
        </label>
        <select className="adm-field__select" value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
          <option value="name">Sort: Name</option>
          <option value="score">Sort: Completeness</option>
          <option value="price">Sort: Price</option>
          <option value="city">Sort: City</option>
        </select>
      </div>

      {someSelected && (
        <div className="adm-bulk-bar">
          <span className="adm-bulk-bar__count">{selected.size} selected</span>
          <div className="adm-bulk-bar__actions">
            <button type="button" className="adm-btn adm-btn--sm adm-btn--secondary" disabled={bulkBusy} onClick={() => runBulk({ action: 'set_featured', value: true })}>Feature</button>
            <button type="button" className="adm-btn adm-btn--sm adm-btn--ghost" disabled={bulkBusy} onClick={() => runBulk({ action: 'set_featured', value: false })}>Unfeature</button>
            <button type="button" className="adm-btn adm-btn--sm adm-btn--secondary" disabled={bulkBusy} onClick={() => runBulk({ action: 'set_managed', value: true })}>Mark managed</button>
            <button type="button" className="adm-btn adm-btn--sm adm-btn--ghost" disabled={bulkBusy} onClick={() => runBulk({ action: 'set_managed', value: false })}>Unmanaged</button>
            <select
              className="adm-field__select adm-bulk-bar__select"
              defaultValue=""
              disabled={bulkBusy}
              onChange={e => {
                const v = e.target.value
                if (!v) return
                runBulk({ action: 'set_listing_status', value: v })
                e.target.value = ''
              }}
            >
              <option value="">Set status…</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
            <select
              className="adm-field__select adm-bulk-bar__select"
              defaultValue=""
              disabled={bulkBusy}
              onChange={e => {
                const v = e.target.value
                if (!v) return
                runBulk({
                  action: 'set_rental_strategy',
                  value: v === '__clear__' ? '' : v,
                })
                e.target.value = ''
              }}
            >
              <option value="">Rental strategy…</option>
              <option value="vacation_rental">Vacation</option>
              <option value="long_term">Long-term</option>
              <option value="hybrid">Hybrid</option>
              <option value="__clear__">Clear strategy</option>
            </select>
            <button type="button" className="adm-btn adm-btn--sm adm-btn--ghost" disabled={bulkBusy} onClick={() => setSelected(new Set())}>Clear selection</button>
          </div>
          {bulkMsg && <div className="adm-bulk-bar__msg">{bulkMsg}</div>}
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card__header">
          <div className="adm-card__title">
            {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
            {activeFilterCount > 0 && (
              <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={clearFilters} style={{ marginLeft: '.75rem' }}>
                Clear filters
              </button>
            )}
          </div>
          <Link href="/admin/properties/new" className="adm-btn adm-btn--primary adm-btn--sm">+ New property</Link>
        </div>

        {filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty__icon">🏠</div>
            {rows.length === 0 ? (
              <>
                <div className="adm-empty__title">No properties yet</div>
                <div className="adm-empty__desc">Create your first listing to get started.</div>
                <Link href="/admin/properties/new" className="adm-btn adm-btn--primary" style={{ marginTop: '.75rem' }}>Create first listing</Link>
              </>
            ) : (
              <>
                <div className="adm-empty__title">No matching properties</div>
                <div className="adm-empty__desc">Try adjusting your search or filters.</div>
                <button type="button" className="adm-btn adm-btn--ghost" onClick={clearFilters} style={{ marginTop: '.75rem' }}>Clear all filters</button>
              </>
            )}
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="adm-table__check">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAllFiltered}
                      aria-label="Select all visible"
                    />
                  </th>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Strategy</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Photos</th>
                  <th>Queue</th>
                  <th>Readiness</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr
                    key={r.id}
                    className={r.completeness.tier === 'incomplete' || r.launch.queue === 'blocked' ? 'adm-table__row--alert' : ''}
                  >
                    <td className="adm-table__check">
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleRow(r.id)}
                        aria-label={`Select ${r.title}`}
                      />
                    </td>
                    <td>
                      <div className="adm-table__name">
                        <Link href={`/admin/properties/${r.id}`} className="adm-table__name-link">{r.title}</Link>
                      </div>
                      <div className="adm-table__sub">
                        {r.managed && <span className="adm-pill adm-pill--teal" style={{ marginRight: '.25rem' }}>Managed</span>}
                        {r.featured && <span className="adm-pill adm-pill--yellow" style={{ marginRight: '.25rem' }}>Featured</span>}
                        {r.propertyType}
                      </div>
                    </td>
                    <td>
                      <div>{r.city || '—'}</div>
                      {r.neighborhood && <div className="adm-table__sub">{r.neighborhood}</div>}
                      {r.buildingName && <div className="adm-table__sub">{r.buildingName}</div>}
                    </td>
                    <td><span className="adm-table__sub" style={{ fontSize: '.78rem' }}>{r.rentalStrategyLabel}</span></td>
                    <td>{listingBadge(r.listingType)}</td>
                    <td>{statusPill(r.status)}</td>
                    <td>
                      {r.nightlyRate > 0 && <div>${r.nightlyRate}/nt</div>}
                      {r.monthlyRate > 0 && <div className="adm-table__sub">${r.monthlyRate.toLocaleString()}/mo</div>}
                      {r.salePrice > 0 && <div>${r.salePrice.toLocaleString()}</div>}
                      {!r.nightlyRate && !r.salePrice && <span className="adm-table__sub">—</span>}
                    </td>
                    <td>
                      <span
                        className={r.photoCount < 2 ? 'adm-table__photo-warn' : ''}
                        title={r.photoCount < 2 ? 'Need at least 2 unique photos' : ''}
                      >
                        {r.photoCount}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {queuePill(r.launch.queue)}
                        {r.launch.blockers.length > 0 && (
                          <span className="adm-table__blockers" title={r.launch.blockers.join(', ')}>
                            {r.launch.blockers.slice(0, 3).join(' · ')}
                            {r.launch.blockers.length > 3 ? '…' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="adm-table__score-cell">
                        <div className="adm-score">
                          <div className="adm-score__bar">
                            <div className={`adm-score__fill ${scoreFill(r.completeness.score)}`} style={{ width: `${r.completeness.score}%` }} />
                          </div>
                        </div>
                        {tierPill(r.completeness.tier)}
                      </div>
                    </td>
                    <td>
                      <Link href={`/admin/properties/${r.id}`} className="adm-btn adm-btn--secondary adm-btn--sm">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

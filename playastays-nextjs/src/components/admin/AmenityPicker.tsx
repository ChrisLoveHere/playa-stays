'use client'

import { useMemo } from 'react'
import { AMENITY_CATEGORIES } from '@/lib/amenity-taxonomy'

interface Props {
  selected: string[]
  onChange: (keys: string[]) => void
}

export function AmenityPicker({ selected, onChange }: Props) {
  const selectedSet = useMemo(() => new Set(selected), [selected])

  function toggle(key: string) {
    const next = new Set(selectedSet)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onChange([...next])
  }

  const activeSections = AMENITY_CATEGORIES
    .map(cat => ({
      ...cat,
      blobItems: cat.items.filter(i => i.dataSource === 'blob' || i.dataSource === 'future'),
    }))
    .filter(cat => cat.blobItems.length > 0)

  const totalAvailable = activeSections.reduce((n, cat) => n + cat.blobItems.length, 0)

  return (
    <div className="adm-amenity">
      <div className="adm-amenity__summary">
        <span className="adm-amenity__total">
          {selected.length} of {totalAvailable} selected
        </span>
        {selected.length === 0 && (
          <span className="adm-amenity__hint">Select amenities this property offers</span>
        )}
      </div>
      {activeSections.map(cat => {
        const catSelectedCount = cat.blobItems.filter(i => selectedSet.has(i.key)).length
        return (
          <div key={cat.id} className="adm-amenity-section">
            <div className="adm-amenity-section__title">
              <span>{cat.en}</span>
              <span className={`adm-amenity-section__count${catSelectedCount > 0 ? ' has-selection' : ''}`}>
                {catSelectedCount}/{cat.blobItems.length}
              </span>
            </div>
            <div className="adm-amenity-grid">
              {cat.blobItems.map(item => {
                const active = selectedSet.has(item.key)
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`adm-amenity-chip${active ? ' is-active' : ''}`}
                    onClick={() => toggle(item.key)}
                    aria-pressed={active}
                  >
                    <span className="adm-amenity-chip__icon">{item.icon}</span>
                    <span className="adm-amenity-chip__label">{item.en}</span>
                    {active && <span className="adm-amenity-chip__check"><CheckIcon /></span>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

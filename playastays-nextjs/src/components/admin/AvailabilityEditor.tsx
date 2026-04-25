'use client'

import { useState, useMemo, useCallback } from 'react'
import type { AvailabilityBlock, AvailabilityBlockKind } from '@/types/availability'

interface Props {
  blocks: AvailabilityBlock[]
  onChange: (blocks: AvailabilityBlock[]) => void
  nextAvailableDate: string
  onNextAvailableDateChange: (date: string) => void
  checkInTime: string
  onCheckInTimeChange: (time: string) => void
  checkOutTime: string
  onCheckOutTimeChange: (time: string) => void
  minStayNights: number
  onMinStayNightsChange: (n: number) => void
  bookingMode: string
  onBookingModeChange: (mode: string) => void
  /** Full JSON stored in WP — read-only reference for operators who sync externally */
  rawCalendarJson?: string
}

const BLOCK_KINDS: { value: AvailabilityBlockKind; label: string; color: string }[] = [
  { value: 'booked',             label: 'Booked (guest)',    color: '#ef4444' },
  { value: 'blocked',            label: 'Blocked',           color: '#f59e0b' },
  { value: 'owner_use',          label: 'Owner use',         color: '#8b5cf6' },
  { value: 'maintenance',        label: 'Maintenance',       color: '#6b7280' },
  { value: 'available_override', label: 'Available override', color: '#10b981' },
]

const KIND_LABEL = Object.fromEntries(BLOCK_KINDS.map(k => [k.value, k.label]))
const KIND_COLOR = Object.fromEntries(BLOCK_KINDS.map(k => [k.value, k.color]))

function generateId() {
  return 'blk-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6)
}

function formatDateShort(iso: string): string {
  try {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return iso }
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end + 'T12:00:00')
  return Math.round((e.getTime() - s.getTime()) / 86400000)
}

function blockFingerprint(b: AvailabilityBlock): string {
  return [b.id || '', b.start, b.end, b.kind, b.note || ''].join('|')
}

export function AvailabilityEditor({
  blocks,
  onChange,
  nextAvailableDate,
  onNextAvailableDateChange,
  checkInTime,
  onCheckInTimeChange,
  checkOutTime,
  onCheckOutTimeChange,
  minStayNights,
  onMinStayNightsChange,
  bookingMode,
  onBookingModeChange,
  rawCalendarJson,
}: Props) {
  const [addStart, setAddStart] = useState('')
  const [addEnd, setAddEnd] = useState('')
  const [addKind, setAddKind] = useState<AvailabilityBlockKind>('booked')
  const [addNote, setAddNote] = useState('')
  const [addError, setAddError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editingFp, setEditingFp] = useState<string | null>(null)
  const [editStart, setEditStart] = useState('')
  const [editEnd, setEditEnd] = useState('')
  const [editKind, setEditKind] = useState<AvailabilityBlockKind>('blocked')
  const [editNote, setEditNote] = useState('')
  const [editError, setEditError] = useState('')

  const sorted = useMemo(
    () => [...blocks].sort((a, b) => a.start.localeCompare(b.start)),
    [blocks],
  )

  const addBlock = useCallback(() => {
    setAddError('')
    if (!addStart || !addEnd) {
      setAddError('Both start and end dates are required.')
      return
    }
    if (addStart >= addEnd) {
      setAddError('End date must be after start date.')
      return
    }
    const newBlock: AvailabilityBlock = {
      start: addStart,
      end: addEnd,
      kind: addKind,
      id: generateId(),
      note: addNote.trim() || undefined,
    }
    onChange([...blocks, newBlock])
    setAddStart('')
    setAddEnd('')
    setAddNote('')
    setShowAdd(false)
  }, [addStart, addEnd, addKind, addNote, blocks, onChange])

  const removeBlock = useCallback((idx: number) => {
    const updated = sorted.filter((_, i) => i !== idx)
    onChange(updated)
    const removed = sorted[idx]
    if (removed && editingFp === blockFingerprint(removed)) setEditingFp(null)
  }, [sorted, onChange, editingFp])

  const startEditBlock = useCallback((block: AvailabilityBlock) => {
    setEditingFp(blockFingerprint(block))
    setEditStart(block.start)
    setEditEnd(block.end)
    setEditKind(block.kind)
    setEditNote(block.note || '')
    setEditError('')
    setShowAdd(false)
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingFp(null)
    setEditError('')
  }, [])

  const saveEdit = useCallback(() => {
    if (!editingFp) return
    setEditError('')
    if (!editStart || !editEnd) {
      setEditError('Start and end dates are required.')
      return
    }
    if (editStart >= editEnd) {
      setEditError('End date must be after start date.')
      return
    }
    let found = false
    const next = blocks.map(b => {
      const fp = blockFingerprint(b)
      if (fp !== editingFp) return b
      found = true
      return {
        ...b,
        id: b.id || generateId(),
        start: editStart,
        end: editEnd,
        kind: editKind,
        note: editNote.trim() || undefined,
      }
    })
    if (!found) return
    onChange(next)
    setEditingFp(null)
  }, [blocks, editingFp, editStart, editEnd, editKind, editNote, onChange])

  const today = new Date().toISOString().split('T')[0]
  const futureBlocks = sorted.filter(b => b.end > today)
  const pastBlocks = sorted.filter(b => b.end <= today)

  const countsByKind = useMemo(() => {
    const m: Partial<Record<AvailabilityBlockKind, number>> = {}
    for (const b of sorted) {
      m[b.kind] = (m[b.kind] || 0) + 1
    }
    return m
  }, [sorted])

  return (
    <div className="adm-avail">
      {sorted.length > 0 && (
        <div className="adm-avail__summary" aria-label="Blocks by type">
          {BLOCK_KINDS.map(k => {
            const n = countsByKind[k.value] || 0
            if (n === 0) return null
            return (
              <span key={k.value} className="adm-avail__summary-chip" title={k.label}>
                <span className="adm-avail__kind-dot" style={{ backgroundColor: k.color }} />
                {k.label}: {n}
              </span>
            )
          })}
        </div>
      )}
      {/* Booking settings row */}
      <div className="adm-avail__settings">
        <div className="adm-field">
          <label className="adm-field__label">How guests book</label>
          <select className="adm-field__select" value={bookingMode} onChange={e => onBookingModeChange(e.target.value)}>
            <option value="">Not specified</option>
            <option value="instant">Instant book</option>
            <option value="inquiry">Inquiry required</option>
            <option value="external">External booking only</option>
          </select>
        </div>
        <div className="adm-field">
          <label className="adm-field__label">Next available date</label>
          <input type="date" className="adm-field__input" value={nextAvailableDate} onChange={e => onNextAvailableDateChange(e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-field__label">Min stay</label>
          <div className="adm-field__input-group">
            <input type="number" min={1} className="adm-field__input" value={minStayNights || ''} onChange={e => onMinStayNightsChange(+e.target.value)} />
            <span className="adm-field__suffix">nights</span>
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-field__label">Check-in</label>
          <input type="time" className="adm-field__input" value={checkInTime} onChange={e => onCheckInTimeChange(e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-field__label">Check-out</label>
          <input type="time" className="adm-field__input" value={checkOutTime} onChange={e => onCheckOutTimeChange(e.target.value)} />
        </div>
      </div>

      {/* Calendar blocks */}
      <div className="adm-avail__blocks-header">
        <h4 className="adm-avail__title">
          Availability blocks
          <span className="adm-avail__count">{futureBlocks.length} upcoming{pastBlocks.length > 0 ? `, ${pastBlocks.length} past` : ''}</span>
        </h4>
        <button type="button" className="adm-btn adm-btn--sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add block'}
        </button>
      </div>

      {showAdd && (
        <div className="adm-avail__add-form">
          <div className="adm-avail__add-row">
            <div className="adm-field">
              <label className="adm-field__label">Start date</label>
              <input type="date" className="adm-field__input" value={addStart} onChange={e => setAddStart(e.target.value)} />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">End date</label>
              <input type="date" className="adm-field__input" value={addEnd} onChange={e => setAddEnd(e.target.value)} />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Type</label>
              <select className="adm-field__select" value={addKind} onChange={e => setAddKind(e.target.value as AvailabilityBlockKind)}>
                {BLOCK_KINDS.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="adm-avail__add-row">
            <div className="adm-field" style={{ flex: 1 }}>
              <label className="adm-field__label">Note (optional)</label>
              <input type="text" className="adm-field__input" value={addNote} onChange={e => setAddNote(e.target.value)} placeholder="e.g. Booking ref #1234" />
            </div>
            <button type="button" className="adm-btn adm-btn--primary adm-avail__add-btn" onClick={addBlock}>
              Add block
            </button>
          </div>
          {addError && <div className="adm-avail__error">{addError}</div>}
        </div>
      )}

      {futureBlocks.length === 0 && pastBlocks.length === 0 && (
        <div className="adm-avail__empty">
          <p>No availability blocks set.</p>
          <p className="adm-avail__empty-hint">Add blocks to mark dates as booked, blocked, or reserved for owner use. This powers the availability calendar on the listing page.</p>
        </div>
      )}

      {futureBlocks.length > 0 && (
        <div className="adm-avail__list">
          {futureBlocks.map((block, idx) => {
            const originalIdx = sorted.indexOf(block)
            const days = daysBetween(block.start, block.end)
            const fp = blockFingerprint(block)
            const isEditing = editingFp === fp
            if (isEditing) {
              return (
                <div key={fp} className="adm-avail__block-edit">
                  <div className="adm-avail__edit-row">
                    <div className="adm-field">
                      <label className="adm-field__label">Start</label>
                      <input type="date" className="adm-field__input" value={editStart} onChange={e => setEditStart(e.target.value)} />
                    </div>
                    <div className="adm-field">
                      <label className="adm-field__label">End</label>
                      <input type="date" className="adm-field__input" value={editEnd} onChange={e => setEditEnd(e.target.value)} />
                    </div>
                    <div className="adm-field">
                      <label className="adm-field__label">Type</label>
                      <select className="adm-field__select" value={editKind} onChange={e => setEditKind(e.target.value as AvailabilityBlockKind)}>
                        {BLOCK_KINDS.map(k => (
                          <option key={k.value} value={k.value}>{k.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="adm-field" style={{ marginTop: '.35rem' }}>
                    <label className="adm-field__label">Note</label>
                    <input type="text" className="adm-field__input" value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="Optional" />
                  </div>
                  {editError && <div className="adm-avail__error">{editError}</div>}
                  <div className="adm-avail__edit-actions">
                    <button type="button" className="adm-btn adm-btn--primary adm-btn--sm" onClick={saveEdit}>Save</button>
                    <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              )
            }
            return (
              <div key={fp} className="adm-avail__block-row">
                <span
                  className="adm-avail__kind-dot"
                  style={{ backgroundColor: KIND_COLOR[block.kind] || '#6b7280' }}
                  title={KIND_LABEL[block.kind] || block.kind}
                />
                <div className="adm-avail__block-dates">
                  <span className="adm-avail__date">{formatDateShort(block.start)}</span>
                  <span className="adm-avail__arrow">→</span>
                  <span className="adm-avail__date">{formatDateShort(block.end)}</span>
                  <span className="adm-avail__days">{days} night{days !== 1 ? 's' : ''}</span>
                </div>
                <span className="adm-avail__kind-label">{KIND_LABEL[block.kind] || block.kind}</span>
                {block.note && <span className="adm-avail__note" title={block.note}>{block.note}</span>}
                <div className="adm-avail__row-actions">
                  <button
                    type="button"
                    className="adm-avail__edit-btn"
                    onClick={() => startEditBlock(block)}
                    title="Edit range"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="adm-avail__remove"
                    onClick={() => removeBlock(originalIdx)}
                    title="Remove block"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {pastBlocks.length > 0 && (
        <details className="adm-avail__past">
          <summary className="adm-avail__past-toggle">{pastBlocks.length} past block{pastBlocks.length !== 1 ? 's' : ''}</summary>
          <div className="adm-avail__list adm-avail__list--past">
            {pastBlocks.map((block, idx) => {
              const originalIdx = sorted.indexOf(block)
              const days = daysBetween(block.start, block.end)
              return (
                <div key={block.id || idx} className="adm-avail__block-row adm-avail__block-row--past">
                  <span
                    className="adm-avail__kind-dot"
                    style={{ backgroundColor: KIND_COLOR[block.kind] || '#6b7280' }}
                  />
                  <div className="adm-avail__block-dates">
                    <span className="adm-avail__date">{formatDateShort(block.start)}</span>
                    <span className="adm-avail__arrow">→</span>
                    <span className="adm-avail__date">{formatDateShort(block.end)}</span>
                    <span className="adm-avail__days">{days}n</span>
                  </div>
                  <span className="adm-avail__kind-label">{KIND_LABEL[block.kind] || block.kind}</span>
                  <button
                    type="button"
                    className="adm-avail__remove"
                    onClick={() => removeBlock(originalIdx)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </details>
      )}

      {/* Legend */}
      <div className="adm-avail__legend">
        {BLOCK_KINDS.map(k => (
          <span key={k.value} className="adm-avail__legend-item">
            <span className="adm-avail__kind-dot" style={{ backgroundColor: k.color }} />
            {k.label}
          </span>
        ))}
      </div>

      {rawCalendarJson?.trim() && (
        <details className="adm-avail__raw">
          <summary className="adm-avail__raw-toggle">Raw calendar JSON (reference)</summary>
          <pre className="adm-avail__raw-pre">{rawCalendarJson}</pre>
        </details>
      )}
    </div>
  )
}

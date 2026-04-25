'use client'

import { useState, useCallback } from 'react'
import type { ActivityCategory, ActivityEntry } from '@/lib/activity-log'
import {
  ACTIVITY_CATEGORY_LABELS,
  appendActivityEntry,
} from '@/lib/activity-log'

interface Props {
  entries: ActivityEntry[]
  onChange: (next: ActivityEntry[]) => void
  onDirty?: () => void
}

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function ActivityLogPanel({ entries, onChange, onDirty }: Props) {
  const [category, setCategory] = useState<ActivityCategory>('general')
  const [body, setBody] = useState('')
  const [err, setErr] = useState('')

  const add = useCallback(() => {
    setErr('')
    const t = body.trim()
    if (t.length < 2) {
      setErr('Enter a short note (2+ characters).')
      return
    }
    onChange(appendActivityEntry(entries, category, t))
    setBody('')
    onDirty?.()
  }, [body, category, entries, onChange, onDirty])

  return (
    <div className="adm-activity">
      <div className="adm-activity__intro">
        Append-only log for onboarding, maintenance, and comms. Saved with the property.
      </div>

      <div className="adm-activity__composer">
        <div className="adm-field">
          <label className="adm-field__label">Category</label>
          <select
            className="adm-field__select"
            value={category}
            onChange={e => setCategory(e.target.value as ActivityCategory)}
          >
            {(Object.keys(ACTIVITY_CATEGORY_LABELS) as ActivityCategory[]).map(k => (
              <option key={k} value={k}>{ACTIVITY_CATEGORY_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div className="adm-field adm-field--full">
          <label className="adm-field__label">Add note</label>
          <textarea
            className="adm-field__textarea"
            rows={2}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What happened? Next step?"
          />
        </div>
        {err && <div className="adm-activity__err">{err}</div>}
        <button type="button" className="adm-btn adm-btn--secondary adm-btn--sm" onClick={add}>
          Add to log
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="adm-activity__empty">No entries yet.</p>
      ) : (
        <ul className="adm-activity__list">
          {entries.map(e => (
            <li key={e.id} className="adm-activity__item">
              <div className="adm-activity__item-head">
                <span className="adm-activity__cat">{ACTIVITY_CATEGORY_LABELS[e.category]}</span>
                <time className="adm-activity__time" dateTime={e.at}>{formatWhen(e.at)}</time>
              </div>
              <p className="adm-activity__body">{e.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

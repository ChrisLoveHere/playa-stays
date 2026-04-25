'use client'

import { useState, useCallback } from 'react'
import type { OpsIssue, OpsIssuePriority, OpsIssueStatus, OpsIssueType } from '@/lib/ops-issues'
import {
  newOpsIssue,
  OPS_ISSUE_PRIORITY_LABELS,
  OPS_ISSUE_STATUS_LABELS,
  OPS_ISSUE_TYPE_LABELS,
} from '@/lib/ops-issues'
import { UserPicker } from './UserPicker'

interface Props {
  issues: OpsIssue[]
  onChange: (next: OpsIssue[]) => void
  onDirty?: () => void
}

function touch(i: OpsIssue): OpsIssue {
  return { ...i, updatedAt: new Date().toISOString() }
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function OpsIssuesPanel({ issues, onChange, onDirty }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(issues[0]?.id ?? null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<OpsIssueType>('maintenance')
  const [priority, setPriority] = useState<OpsIssuePriority>('medium')
  const [notes, setNotes] = useState('')
  const [assigneeId, setAssigneeId] = useState(0)
  const [addErr, setAddErr] = useState('')

  const updateIssue = useCallback((id: string, fn: (i: OpsIssue) => OpsIssue) => {
    onChange(issues.map(i => (i.id === id ? touch(fn(i)) : i)))
    onDirty?.()
  }, [issues, onChange, onDirty])

  const removeIssue = useCallback((id: string) => {
    onChange(issues.filter(i => i.id !== id))
    if (expandedId === id) setExpandedId(null)
    onDirty?.()
  }, [issues, onChange, expandedId, onDirty])

  function addIssue() {
    setAddErr('')
    const t = title.trim()
    if (t.length < 2) {
      setAddErr('Enter a short title.')
      return
    }
    const row = newOpsIssue({ title: t, type, priority, notes, assigneeUserId: assigneeId || undefined })
    onChange([row, ...issues])
    setTitle('')
    setNotes('')
    setAssigneeId(0)
    setExpandedId(row.id)
    onDirty?.()
  }

  return (
    <div className="adm-issues">
      <p className="adm-issues__intro">
        Track maintenance and property issues. Saved with the listing (JSON in WordPress). This is not a full ticket system yet.
      </p>

      <div className="adm-issues__composer">
        <div className="adm-field adm-field--full">
          <label className="adm-field__label">New issue title</label>
          <input className="adm-field__input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AC leak — master bedroom" />
        </div>
        <div className="adm-issues__composer-row">
          <div className="adm-field">
            <label className="adm-field__label">Type</label>
            <select className="adm-field__select" value={type} onChange={e => setType(e.target.value as OpsIssueType)}>
              {(Object.keys(OPS_ISSUE_TYPE_LABELS) as OpsIssueType[]).map(k => (
                <option key={k} value={k}>{OPS_ISSUE_TYPE_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-field__label">Priority</label>
            <select className="adm-field__select" value={priority} onChange={e => setPriority(e.target.value as OpsIssuePriority)}>
              {(Object.keys(OPS_ISSUE_PRIORITY_LABELS) as OpsIssuePriority[]).map(k => (
                <option key={k} value={k}>{OPS_ISSUE_PRIORITY_LABELS[k]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="adm-field adm-field--full">
          <label className="adm-field__label">Notes</label>
          <textarea className="adm-field__textarea" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Context, vendor, access…" />
        </div>
        <UserPicker
          label="Assignee (optional)"
          hint="Search a WordPress user to own this issue."
          value={assigneeId}
          onChange={setAssigneeId}
        />
        {addErr && <div className="adm-issues__err">{addErr}</div>}
        <button type="button" className="adm-btn adm-btn--secondary adm-btn--sm" onClick={addIssue}>Add issue</button>
      </div>

      {issues.length === 0 ? (
        <p className="adm-issues__empty">No open issues recorded.</p>
      ) : (
        <ul className="adm-issues__list">
          {issues.map(issue => {
            const open = expandedId === issue.id
            return (
              <li key={issue.id} className="adm-issues__card">
                <button
                  type="button"
                  className="adm-issues__card-head"
                  onClick={() => setExpandedId(open ? null : issue.id)}
                  aria-expanded={open}
                >
                  <span className="adm-issues__card-title">{issue.title}</span>
                  <span className="adm-issues__badges">
                    <span className="adm-issues__badge">{OPS_ISSUE_TYPE_LABELS[issue.type]}</span>
                    <span className="adm-issues__badge">{OPS_ISSUE_PRIORITY_LABELS[issue.priority]}</span>
                    <span className="adm-issues__badge adm-issues__badge--status">{OPS_ISSUE_STATUS_LABELS[issue.status]}</span>
                  </span>
                  <span className="adm-issues__updated">Updated {formatWhen(issue.updatedAt)}</span>
                </button>
                {open && (
                  <div className="adm-issues__card-body">
                    <div className="adm-field adm-field--full">
                      <label className="adm-field__label">Title</label>
                      <input
                        className="adm-field__input"
                        value={issue.title}
                        onChange={e => updateIssue(issue.id, i => ({ ...i, title: e.target.value }))}
                      />
                    </div>
                    <div className="adm-issues__composer-row">
                      <div className="adm-field">
                        <label className="adm-field__label">Type</label>
                        <select
                          className="adm-field__select"
                          value={issue.type}
                          onChange={e => updateIssue(issue.id, i => ({ ...i, type: e.target.value as OpsIssueType }))}
                        >
                          {(Object.keys(OPS_ISSUE_TYPE_LABELS) as OpsIssueType[]).map(k => (
                            <option key={k} value={k}>{OPS_ISSUE_TYPE_LABELS[k]}</option>
                          ))}
                        </select>
                      </div>
                      <div className="adm-field">
                        <label className="adm-field__label">Priority</label>
                        <select
                          className="adm-field__select"
                          value={issue.priority}
                          onChange={e => updateIssue(issue.id, i => ({ ...i, priority: e.target.value as OpsIssuePriority }))}
                        >
                          {(Object.keys(OPS_ISSUE_PRIORITY_LABELS) as OpsIssuePriority[]).map(k => (
                            <option key={k} value={k}>{OPS_ISSUE_PRIORITY_LABELS[k]}</option>
                          ))}
                        </select>
                      </div>
                      <div className="adm-field">
                        <label className="adm-field__label">Status</label>
                        <select
                          className="adm-field__select"
                          value={issue.status}
                          onChange={e => updateIssue(issue.id, i => ({ ...i, status: e.target.value as OpsIssueStatus }))}
                        >
                          {(Object.keys(OPS_ISSUE_STATUS_LABELS) as OpsIssueStatus[]).map(k => (
                            <option key={k} value={k}>{OPS_ISSUE_STATUS_LABELS[k]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="adm-field adm-field--full">
                      <label className="adm-field__label">Notes</label>
                      <textarea
                        className="adm-field__textarea"
                        rows={3}
                        value={issue.notes}
                        onChange={e => updateIssue(issue.id, i => ({ ...i, notes: e.target.value }))}
                      />
                    </div>
                    <UserPicker
                      label="Assignee"
                      hint="Who is owning resolution?"
                      value={issue.assigneeUserId}
                      onChange={uid => updateIssue(issue.id, i => ({ ...i, assigneeUserId: uid }))}
                    />
                    <div className="adm-issues__card-actions">
                      <span className="adm-issues__meta">Created {formatWhen(issue.createdAt)}</span>
                      <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => removeIssue(issue.id)}>Remove</button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

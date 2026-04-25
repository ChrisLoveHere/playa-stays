'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export interface ResolvedUser {
  id: number
  name: string
  email: string
  role: string
  avatar: string
}

interface Props {
  label: string
  hint?: string
  value: number
  onChange: (userId: number) => void
  /** Pre-resolved user data from the server (e.g. ps_computed.owner) */
  resolvedUser?: { id: number; display_name: string } | null
}

function toSelected(u: { id: number; display_name: string }): ResolvedUser {
  return {
    id: u.id,
    name: u.display_name,
    email: '',
    role: '',
    avatar: '',
  }
}

export function UserPicker({ label, hint, value, onChange, resolvedUser }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ResolvedUser[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<ResolvedUser | null>(null)
  const [resolving, setResolving] = useState(false)
  const [replacing, setReplacing] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const resolveById = useCallback((id: number) => {
    setResolving(true)
    fetch(`/api/admin/users?ids=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.users?.[0]) {
          setSelected(data.users[0])
        } else {
          setSelected({ id, name: `User #${id}`, email: '', role: '', avatar: '' })
        }
      })
      .catch(() => {
        setSelected({ id, name: `User #${id}`, email: '', role: '', avatar: '' })
      })
      .finally(() => setResolving(false))
  }, [])

  useEffect(() => {
    if (value <= 0) {
      setSelected(null)
      setReplacing(false)
      return
    }
    if (replacing) return

    if (resolvedUser && resolvedUser.id === value) {
      setSelected(prev => {
        if (prev?.id === value && prev.name === resolvedUser.display_name) return prev
        return toSelected(resolvedUser)
      })
      return
    }

    if (selected?.id === value) return

    resolveById(value)
  }, [value, resolvedUser?.id, resolvedUser?.display_name, replacing, selected?.id, resolveById])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const search = useCallback((q: string) => {
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    fetch(`/api/admin/users?search=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        setResults(data.users || [])
        setOpen(true)
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [])

  function handleInputChange(val: string) {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  function handleSelect(user: ResolvedUser) {
    setSelected(user)
    setQuery('')
    setResults([])
    setOpen(false)
    setReplacing(false)
    onChange(user.id)
  }

  function handleClear() {
    setSelected(null)
    setQuery('')
    setResults([])
    setReplacing(false)
    onChange(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function startReplace() {
    setReplacing(true)
    setQuery('')
    setResults([])
    setOpen(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function cancelReplace() {
    setReplacing(false)
    setQuery('')
    setResults([])
    if (value > 0) {
      if (resolvedUser && resolvedUser.id === value) {
        setSelected(toSelected(resolvedUser))
      } else {
        resolveById(value)
      }
    }
  }

  function getInitial(user: ResolvedUser): string {
    if (user.name && !user.name.startsWith('User #')) {
      return user.name.charAt(0).toUpperCase()
    }
    return '?'
  }

  const showCard = value > 0 && selected && !replacing && !resolving
  const showLoadingCard = value > 0 && resolving && !replacing

  return (
    <div className="adm-field" ref={containerRef}>
      <label className="adm-field__label">{label}</label>

      {showLoadingCard && (
        <div className="adm-user-card adm-user-card--loading">
          <span className="adm-user-card__avatar">…</span>
          <div className="adm-user-card__info">
            <div className="adm-user-card__name">Loading…</div>
          </div>
        </div>
      )}

      {showCard && (
        <div className="adm-user-card">
          {selected!.avatar ? (
            <img src={selected!.avatar} alt="" className="adm-user-card__avatar-img" />
          ) : (
            <span className="adm-user-card__avatar">{getInitial(selected!)}</span>
          )}
          <div className="adm-user-card__info">
            <div className="adm-user-card__name">{selected!.name}</div>
            <div className="adm-user-card__meta">
              {selected!.email && <span>{selected!.email}</span>}
              {selected!.role && <span className="adm-user-card__role">{selected!.role}</span>}
              {!selected!.email && !selected!.role && (
                <span className="adm-user-card__id-hint">WordPress user</span>
              )}
            </div>
          </div>
          <div className="adm-user-card__actions">
            <button type="button" className="adm-user-card__linkish" onClick={startReplace}>
              Change
            </button>
            <button type="button" className="adm-user-card__clear" onClick={handleClear} title="Remove assignment">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {(replacing || value <= 0 || (!showCard && !showLoadingCard)) && (
        <>
          {replacing && value > 0 && (
            <div className="adm-user-replace-hint">
              Pick a different user, or{' '}
              <button type="button" className="adm-user-card__linkish" onClick={cancelReplace}>cancel</button>
            </div>
          )}
          <div className="adm-user-search">
            <div className="adm-user-search__input-wrap">
              <svg className="adm-user-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className="adm-user-search__input"
                value={query}
                onChange={e => handleInputChange(e.target.value)}
                onFocus={() => { if (results.length > 0) setOpen(true) }}
                placeholder="Search by name or email…"
                autoComplete="off"
              />
              {loading && <span className="adm-user-search__spinner" />}
            </div>

            {open && (
              <div className="adm-user-search__dropdown">
                {results.length === 0 ? (
                  <div className="adm-user-search__empty">
                    {loading ? 'Searching…' : 'No users found'}
                  </div>
                ) : (
                  results.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      className="adm-user-search__result"
                      onClick={() => handleSelect(user)}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="adm-user-search__result-avatar-img" />
                      ) : (
                        <span className="adm-user-search__result-avatar">{getInitial(user)}</span>
                      )}
                      <div className="adm-user-search__result-info">
                        <div className="adm-user-search__result-name">{user.name}</div>
                        <div className="adm-user-search__result-meta">
                          {user.email && <span>{user.email}</span>}
                          {user.role && <span className="adm-user-search__result-role">{user.role}</span>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}

      {hint && <span className="adm-field__hint">{hint}</span>}
    </div>
  )
}

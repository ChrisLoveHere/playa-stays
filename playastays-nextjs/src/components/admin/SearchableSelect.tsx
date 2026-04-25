'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  label: string
  hint?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  allowCustom?: boolean
  customLabel?: string
}

export function SearchableSelect({
  label,
  hint,
  options,
  value,
  onChange,
  placeholder = 'Search or select...',
  disabled = false,
  required = false,
  allowCustom = false,
  customLabel = 'Other (custom)',
}: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [customMode, setCustomMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = useMemo(
    () => options.find(o => o.value === value),
    [options, value],
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isCustomValue = value && !options.some(o => o.value === value)

  useEffect(() => {
    if (isCustomValue) setCustomMode(true)
  }, [isCustomValue])

  const handleSelect = useCallback((opt: SelectOption) => {
    onChange(opt.value)
    setQuery('')
    setOpen(false)
    setCustomMode(false)
  }, [onChange])

  function handleClear() {
    onChange('')
    setQuery('')
    setCustomMode(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleEnterCustom() {
    setCustomMode(true)
    setOpen(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (disabled) {
    return (
      <div className="adm-field">
        <label className="adm-field__label">
          {label}
          {required && <span className="adm-field__req">*</span>}
        </label>
        <div className="adm-ss adm-ss--disabled">
          <span className="adm-ss__placeholder">Select {label.toLowerCase()} first</span>
        </div>
        {hint && <span className="adm-field__hint">{hint}</span>}
      </div>
    )
  }

  if (customMode) {
    return (
      <div className="adm-field">
        <label className="adm-field__label">
          {label} <span className="adm-field__label-tag">custom</span>
          {required && <span className="adm-field__req">*</span>}
        </label>
        <div className="adm-ss__custom-wrap">
          <input
            ref={inputRef}
            type="text"
            className="adm-field__input"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Enter custom value..."
          />
          <button type="button" className="adm-ss__back-btn" onClick={() => { setCustomMode(false); onChange(''); }}>
            ← Back to list
          </button>
        </div>
        {hint && <span className="adm-field__hint">{hint}</span>}
      </div>
    )
  }

  if (selectedOption) {
    return (
      <div className="adm-field">
        <label className="adm-field__label">
          {label}
          {required && <span className="adm-field__req">*</span>}
        </label>
        <div className="adm-ss adm-ss--selected" onClick={handleClear} role="button" tabIndex={0}>
          <span className="adm-ss__value">{selectedOption.label}</span>
          <span className="adm-ss__clear" title="Change">✕</span>
        </div>
        {hint && <span className="adm-field__hint">{hint}</span>}
      </div>
    )
  }

  return (
    <div className="adm-field" ref={containerRef}>
      <label className="adm-field__label">
        {label}
        {required && <span className="adm-field__req">*</span>}
      </label>
      <div className="adm-ss">
        <div className="adm-ss__input-wrap">
          <svg className="adm-ss__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="adm-ss__input"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
          />
        </div>
        {open && (
          <div className="adm-ss__dropdown">
            {filtered.length === 0 && !allowCustom && (
              <div className="adm-ss__empty">No matches</div>
            )}
            {filtered.length === 0 && allowCustom && (
              <div className="adm-ss__empty">
                No matches.{' '}
                <button type="button" className="adm-ss__custom-link" onClick={handleEnterCustom}>
                  Enter custom value
                </button>
              </div>
            )}
            {filtered.map(opt => (
              <button
                key={opt.value}
                type="button"
                className="adm-ss__option"
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            ))}
            {allowCustom && filtered.length > 0 && (
              <button
                type="button"
                className="adm-ss__option adm-ss__option--custom"
                onClick={handleEnterCustom}
              >
                {customLabel}
              </button>
            )}
          </div>
        )}
      </div>
      {hint && <span className="adm-field__hint">{hint}</span>}
    </div>
  )
}

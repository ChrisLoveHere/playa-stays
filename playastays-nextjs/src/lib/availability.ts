// ============================================================
// Availability helpers — parse CMS data, validate stay windows
//
// Used by: property-browse (date filter), detail page, future APIs.
// No synthetic blocks; empty JSON => honest “no calendar data”.
// ============================================================

import type {
  AvailabilityBlock,
  AvailabilityJsonPayload,
  PropertyAvailabilitySummary,
} from '@/types/availability'

/** Avoid circular imports with `@/types` — only fields this module reads */
export interface PropertyAvailabilityInput {
  meta: {
    ps_availability_json?: string
    ps_next_available_date?: string
    ps_min_stay_nights?: number
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function isValidIsoDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false
  const d = new Date(s + 'T12:00:00')
  return !Number.isNaN(d.getTime())
}

/** Half-open [start, end): overlap iff a.start < b.end && b.start < a.end */
export function rangesOverlapHalfOpen(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  if (!isValidIsoDate(aStart) || !isValidIsoDate(aEnd) || !isValidIsoDate(bStart) || !isValidIsoDate(bEnd)) {
    return false
  }
  return aStart < bEnd && bStart < aEnd
}

function normalizeBlock(b: Partial<AvailabilityBlock>): AvailabilityBlock | null {
  if (!b.start || !b.end || !b.kind) return null
  if (!isValidIsoDate(b.start) || !isValidIsoDate(b.end)) return null
  if (b.start >= b.end) return null
  return {
    start: b.start,
    end: b.end,
    kind: b.kind,
    id: b.id,
    note: b.note,
  }
}

export function parseAvailabilityJson(raw: string | undefined | null): AvailabilityJsonPayload | null {
  if (!raw || typeof raw !== 'string') return null
  try {
    const v = JSON.parse(raw) as AvailabilityJsonPayload
    if (!v || typeof v !== 'object') return null
    return v
  } catch {
    return null
  }
}

/**
 * Build a normalized summary for a property. Safe to call on every request.
 */
export function getPropertyAvailabilitySummary(property: PropertyAvailabilityInput): PropertyAvailabilitySummary {
  const meta = property.meta
  const fromJson = parseAvailabilityJson(meta.ps_availability_json)
  const rawBlocks = fromJson?.blocks ?? []
  const blocks: AvailabilityBlock[] = []
  for (const b of rawBlocks) {
    const n = normalizeBlock(b)
    if (n) blocks.push(n)
  }

  const nextFromMeta = meta.ps_next_available_date
  const nextFromJson = fromJson?.nextAvailable
  let nextAvailableDate: string | null = null
  if (nextFromJson && isValidIsoDate(nextFromJson)) nextAvailableDate = nextFromJson
  else if (nextFromMeta && isValidIsoDate(String(nextFromMeta))) nextAvailableDate = String(nextFromMeta)

  const minFromJson = fromJson?.minStayNights
  const minFromMeta = meta.ps_min_stay_nights
  let minStayNights: number | null = null
  if (typeof minFromJson === 'number' && minFromJson > 0) minStayNights = minFromJson
  else if (typeof minFromMeta === 'number' && minFromMeta > 0) minStayNights = minFromMeta

  const hasStructuredCalendar = blocks.length > 0

  return {
    hasStructuredCalendar,
    source: hasStructuredCalendar ? 'cms_json' : 'none',
    blocks,
    nextAvailableDate,
    minStayNights,
  }
}

/**
 * Stay window [checkIn, checkOut) must not overlap any blocking block.
 * `available_override` blocks are ignored for “unavailable” logic (future use).
 */
export function stayWindowIsAvailable(
  blocks: AvailabilityBlock[],
  checkIn: string,
  checkOut: string
): boolean {
  if (!isValidIsoDate(checkIn) || !isValidIsoDate(checkOut)) return false
  if (checkIn >= checkOut) return false

  for (const b of blocks) {
    if (b.kind === 'available_override') continue
    if (rangesOverlapHalfOpen(checkIn, checkOut, b.start, b.end)) return false
  }
  return true
}

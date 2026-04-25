// ============================================================
// PlayaStays — availability / calendar domain model
//
// Single source-of-truth shape for:
// - browse date filtering
// - property detail calendars
// - future owner portal + internal admin (reporting aggregates same blocks)
//
// Blocks are stored in CMS as JSON (ps_availability_json) or derived later
// from PMS/iCal sync. Do not invent blocks in the app.
//
// Example `ps_availability_json` (versioned, extensible):
// {
//   "version": 1,
//   "blocks": [
//     { "start": "2026-06-01", "end": "2026-06-10", "kind": "booked", "id": "res-123" },
//     { "start": "2026-07-01", "end": "2026-07-05", "kind": "owner_use" }
//   ],
//   "nextAvailable": "2026-06-11",
//   "minStayNights": 3
// }
// Dates use half-open intervals [start, end) as ISO calendar days.
// ============================================================

/**
 * Why a stay is unavailable for the given nights.
 * Extensible for admin/owner dashboards (occupancy vs owner-use vs maintenance).
 */
export type AvailabilityBlockKind =
  | 'booked'
  | 'blocked'
  | 'owner_use'
  | 'maintenance'
  /** Rare: explicit “open” override on top of defaults */
  | 'available_override'

/**
 * One contiguous unavailable (or override) span in the rental calendar.
 * Dates are ISO `YYYY-MM-DD` (local calendar day for the property).
 *
 * Interpretation: **half-open interval** [start, end) — `start` is first
 * affected night; `end` is the first morning after the last affected night
 * (same convention as typical OTA check-in / check-out).
 */
export interface AvailabilityBlock {
  start: string
  end: string
  kind: AvailabilityBlockKind
  /** Optional id for admin tools / sync reconciliation */
  id?: string
  /** Freeform note for dashboards (not shown to guests unless you choose) */
  note?: string
}

/**
 * Parsed payload from `ps_availability_json` (optional CMS field).
 * Versioned so the plugin can evolve without breaking the headless app.
 */
export interface AvailabilityJsonPayload {
  version?: number
  blocks?: AvailabilityBlock[]
  /** First night a short stay could start (optional; can also use meta ps_next_available_date) */
  nextAvailable?: string
  /** Overrides meta.ps_min_stay_nights when present */
  minStayNights?: number
}

/**
 * Normalized view consumed by UI + browse filter (computed in Node from Property).
 */
export interface PropertyAvailabilitySummary {
  /** True when we have enough structured data to validate stay windows */
  hasStructuredCalendar: boolean
  /** Source of block data for debugging / support */
  source: 'cms_json' | 'none'
  blocks: AvailabilityBlock[]
  /** Earliest night a guest could check in (if known) */
  nextAvailableDate: string | null
  /** Effective minimum nights (JSON overrides meta) */
  minStayNights: number | null
}

/**
 * Wire format for `ps_computed.availability` from WordPress REST (optional).
 * Mirrors PropertyAvailabilitySummary for hydration without re-parsing on client.
 */
export interface PropertyAvailabilityComputed extends PropertyAvailabilitySummary {}

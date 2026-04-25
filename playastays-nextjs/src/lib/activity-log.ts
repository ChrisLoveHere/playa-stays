// ============================================================
// Admin — per-property activity log (append-only JSON in WP meta)
// Foundation for operational history — not a full ticketing system.
// ============================================================

export type ActivityCategory =
  | 'general'
  | 'onboarding'
  | 'maintenance'
  | 'owner'
  | 'guest'
  | 'compliance'

export interface ActivityEntry {
  id: string
  at: string
  category: ActivityCategory
  body: string
}

const MAX_ENTRIES = 80

export function parseActivityLog(raw: string | undefined | null): ActivityEntry[] {
  if (!raw || typeof raw !== 'string') return []
  try {
    const v = JSON.parse(raw) as unknown
    if (!Array.isArray(v)) return []
    const out: ActivityEntry[] = []
    for (const row of v) {
      if (!row || typeof row !== 'object') continue
      const o = row as Record<string, unknown>
      if (typeof o.id !== 'string' || typeof o.at !== 'string' || typeof o.body !== 'string') continue
      const cat = o.category
      if (
        cat === 'general' || cat === 'onboarding' || cat === 'maintenance' ||
        cat === 'owner' || cat === 'guest' || cat === 'compliance'
      ) {
        out.push({ id: o.id, at: o.at, category: cat, body: o.body })
      }
    }
    return out.sort((a, b) => b.at.localeCompare(a.at))
  } catch {
    return []
  }
}

export function serializeActivityLog(entries: ActivityEntry[]): string {
  const trimmed = entries.slice(0, MAX_ENTRIES)
  return JSON.stringify(trimmed)
}

export function appendActivityEntry(
  entries: ActivityEntry[],
  category: ActivityCategory,
  body: string,
): ActivityEntry[] {
  const text = body.trim()
  if (!text) return entries
  const entry: ActivityEntry = {
    id: `log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    category,
    body: text,
  }
  return [entry, ...entries].slice(0, MAX_ENTRIES)
}

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  general: 'General',
  onboarding: 'Onboarding',
  maintenance: 'Maintenance',
  owner: 'Owner communication',
  guest: 'Guest issue',
  compliance: 'Admin / compliance',
}

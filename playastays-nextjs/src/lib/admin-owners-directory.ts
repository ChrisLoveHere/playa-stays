// ============================================================
// Admin — derive owner directory from property → ps_owner_id
// Source of truth: WordPress user ID on each property; display
// enriched via REST user fetch + ps_computed.owner when present.
// ============================================================

import type { Property } from '@/types'
import type { AdminWpUser } from '@/lib/admin-wp-users'

export interface OwnerDirectoryRow {
  ownerId: number
  /** Best display name we have */
  name: string
  email: string
  role: string
  /** WP user meta phone not standard — empty until integrated */
  phone: string | null
  propertyCount: number
  properties: Property[]
}

export function groupPropertiesByOwnerId(properties: Property[]): Map<number, Property[]> {
  const m = new Map<number, Property[]>()
  for (const p of properties) {
    const oid = p.meta.ps_owner_id
    if (typeof oid !== 'number' || oid <= 0) continue
    if (!m.has(oid)) m.set(oid, [])
    m.get(oid)!.push(p)
  }
  return m
}

function displayNameFromProperty(p: Property): string | null {
  const o = p.ps_computed?.owner
  if (o?.id && o.display_name?.trim()) return o.display_name.trim()
  return null
}

/**
 * Build directory rows: one per owner ID that has ≥1 property.
 * Merge WP user rows when available; fall back to computed display_name.
 */
export function buildOwnerDirectoryRows(
  properties: Property[],
  wpUsers: AdminWpUser[],
): OwnerDirectoryRow[] {
  const byOwner = groupPropertiesByOwnerId(properties)
  const userById = new Map(wpUsers.map(u => [u.id, u]))

  const rows: OwnerDirectoryRow[] = []

  for (const [ownerId, props] of byOwner) {
    const u = userById.get(ownerId)
    const fromProp = props.map(displayNameFromProperty).find(Boolean)
    const name = u?.name ?? fromProp ?? `User #${ownerId}`
    rows.push({
      ownerId,
      name,
      email: u?.email ?? '',
      role: u?.role ?? '—',
      phone: null,
      propertyCount: props.length,
      properties: props,
    })
  }

  rows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  return rows
}

export function propertiesForOwner(properties: Property[], ownerId: number): Property[] {
  return properties.filter(
    p => typeof p.meta.ps_owner_id === 'number' && p.meta.ps_owner_id === ownerId,
  )
}

// ============================================================
// POST /api/admin/properties/bulk — batch update meta fields
//
// Low-risk bulk actions: featured, managed, listing status,
// rental strategy. Loops WordPress REST PUT per id.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server'
import { getWordPressApiBaseUrl } from '@/lib/wp-api-base'

const WP_API = getWordPressApiBaseUrl()
const WP_AUTH = process.env.WP_APP_PASSWORD

function authHeaders(): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' }
  if (WP_AUTH) {
    h['Authorization'] = `Basic ${Buffer.from(WP_AUTH).toString('base64')}`
  }
  return h
}

export type BulkAction =
  | { action: 'set_featured'; value: boolean }
  | { action: 'set_managed'; value: boolean }
  | { action: 'set_listing_status'; value: string }
  | { action: 'set_rental_strategy'; value: string }

export async function POST(request: NextRequest) {
  if (!WP_API || !WP_AUTH) {
    return NextResponse.json(
      { error: 'WordPress API credentials not configured.' },
      { status: 503 }
    )
  }

  let body: { ids: number[]; bulk: BulkAction }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const ids = Array.isArray(body.ids) ? body.ids.map(Number).filter(n => n > 0) : []
  if (ids.length === 0) {
    return NextResponse.json({ error: 'No property ids' }, { status: 400 })
  }
  if (ids.length > 50) {
    return NextResponse.json({ error: 'Maximum 50 properties per batch' }, { status: 400 })
  }

  const { bulk } = body
  if (!bulk || typeof bulk !== 'object' || !bulk.action) {
    return NextResponse.json({ error: 'Missing bulk action' }, { status: 400 })
  }

  const meta: Record<string, unknown> = {}
  if (bulk.action === 'set_featured') {
    meta.ps_featured = !!bulk.value
  } else if (bulk.action === 'set_managed') {
    meta.ps_managed_by_ps = !!bulk.value
  } else if (bulk.action === 'set_listing_status') {
    const v = String(bulk.value || '')
    if (!['active', 'draft', 'inactive', 'archived'].includes(v)) {
      return NextResponse.json({ error: 'Invalid listing status' }, { status: 400 })
    }
    meta.ps_listing_status = v
  } else if (bulk.action === 'set_rental_strategy') {
    const v = String(bulk.value || '')
    if (!['vacation_rental', 'long_term', 'hybrid', ''].includes(v)) {
      return NextResponse.json({ error: 'Invalid rental strategy' }, { status: 400 })
    }
    meta.ps_rental_strategy = v || null
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  const statusMap: Record<string, string> = {
    active: 'publish',
    draft: 'draft',
    inactive: 'draft',
    archived: 'draft',
  }

  const results: { id: number; ok: boolean; error?: string }[] = []

  for (const id of ids) {
    try {
      const wpBody: Record<string, unknown> = { meta }
      if (bulk.action === 'set_listing_status') {
        wpBody.status = statusMap[String(bulk.value)] || 'draft'
      }
      const res = await fetch(`${WP_API}/properties/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(wpBody),
      })
      if (!res.ok) {
        const text = await res.text()
        results.push({ id, ok: false, error: `${res.status}: ${text.slice(0, 120)}` })
      } else {
        results.push({ id, ok: true })
      }
    } catch (e) {
      results.push({ id, ok: false, error: e instanceof Error ? e.message : 'Request failed' })
    }
  }

  const failed = results.filter(r => !r.ok)
  return NextResponse.json({
    ok: failed.length === 0,
    updated: results.filter(r => r.ok).length,
    failed: failed.length,
    results,
  })
}

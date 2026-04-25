// ============================================================
// /api/admin/users — Search WordPress users for admin assignment
//
// GET ?search=<query> — search by name or email
// GET ?ids=1,2,3      — resolve specific user IDs to display data
//
// Proxies authenticated requests to WP REST /wp/v2/users.
// The WP plugin already blocks /wp/v2/users for unauthenticated
// requests, and this route adds a second layer: it only works
// when WP_APP_PASSWORD is configured (admin-only context).
//
// Returns: { users: [{ id, name, email, role, avatar }] }
// ============================================================

import { NextResponse, type NextRequest } from 'next/server'
import {
  fetchWpUsersByIds,
  isWpUserFetchConfigured,
  searchWpUsers,
} from '@/lib/admin-wp-users'

export async function GET(request: NextRequest) {
  if (!isWpUserFetchConfigured()) {
    return NextResponse.json(
      { error: 'WordPress API credentials not configured.' },
      { status: 503 },
    )
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim()
  const idsParam = searchParams.get('ids')?.trim()

  if (!search && !idsParam) {
    return NextResponse.json({ users: [] })
  }

  try {
    if (idsParam) {
      const ids = idsParam.split(',').map(s => Number(s)).filter(n => n > 0)
      const users = await fetchWpUsersByIds(ids)
      return NextResponse.json({ users })
    }

    const users = await searchWpUsers(search ?? '')
    return NextResponse.json({ users })
  } catch (err) {
    console.error('User search error:', err)
    return NextResponse.json({ error: 'User search failed', users: [] }, { status: 500 })
  }
}

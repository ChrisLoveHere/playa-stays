// ============================================================
// Admin — WordPress user resolution (server-side, app password)
// Shared by /api/admin/users and admin Owners module pages.
// ============================================================

import { getWordPressApiBaseUrl } from '@/lib/wp-api-base'

const WP_API = getWordPressApiBaseUrl()
const WP_AUTH = process.env.WP_APP_PASSWORD

interface WpUser {
  id: number
  name: string
  slug: string
  email?: string
  roles?: string[]
  avatar_urls?: Record<string, string>
}

export interface AdminWpUser {
  id: number
  name: string
  email: string
  role: string
  avatar: string
}

function mapUser(u: WpUser): AdminWpUser {
  const avatarUrls = u.avatar_urls || {}
  const avatar = avatarUrls['96'] || avatarUrls['48'] || avatarUrls['24'] || ''

  const roles = u.roles || []
  const roleName = roles[0] || 'user'
  const friendlyRole: Record<string, string> = {
    administrator: 'Admin',
    ps_manager: 'Manager',
    ps_editor: 'Editor',
    ps_owner: 'Owner',
    editor: 'Editor',
    author: 'Author',
    subscriber: 'Subscriber',
  }

  return {
    id: u.id,
    name: u.name || u.slug || `User #${u.id}`,
    email: u.email || '',
    role: friendlyRole[roleName] || roleName,
    avatar,
  }
}

function authHeader(): string | null {
  if (!WP_AUTH) return null
  return `Basic ${Buffer.from(WP_AUTH).toString('base64')}`
}

/** True when WP credentials exist (does not verify connectivity). */
export function isWpUserFetchConfigured(): boolean {
  return !!(WP_API && WP_AUTH)
}

/**
 * Resolve WordPress users by ID (context=edit for email).
 * Batches include= to stay within typical REST limits.
 */
export async function fetchWpUsersByIds(ids: number[]): Promise<AdminWpUser[]> {
  const h = authHeader()
  if (!WP_API || !h) return []

  const unique = [...new Set(ids.filter(id => typeof id === 'number' && id > 0))]
  if (!unique.length) return []

  const out: AdminWpUser[] = []
  const chunkSize = 50

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize)
    const url = new URL(`${WP_API}/users`)
    url.searchParams.set('per_page', '100')
    url.searchParams.set('context', 'edit')
    url.searchParams.set('include', chunk.join(','))

    try {
      const res = await fetch(url.toString(), {
        headers: { Authorization: h, 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      if (!res.ok) continue
      const wpUsers: WpUser[] = await res.json()
      if (Array.isArray(wpUsers)) {
        out.push(...wpUsers.map(mapUser))
      }
    } catch {
      /* ignore chunk */
    }
  }

  return out
}

/** Search users by name or email (same behavior as picker search). */
export async function searchWpUsers(search: string): Promise<AdminWpUser[]> {
  const h = authHeader()
  if (!WP_API || !h || !search.trim()) return []

  const url = new URL(`${WP_API}/users`)
  url.searchParams.set('per_page', '20')
  url.searchParams.set('context', 'edit')
  url.searchParams.set('search', search.trim())

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: h, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const wpUsers: WpUser[] = await res.json()
    return Array.isArray(wpUsers) ? wpUsers.map(mapUser) : []
  } catch {
    return []
  }
}

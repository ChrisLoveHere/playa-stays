/**
 * Build wp-admin URLs from WP_API_URL (same origin as /wp-json).
 */

import { getWordPressApiBaseUrl } from '@/lib/wp-api-base'

function wpOrigin(): string | null {
  const base = getWordPressApiBaseUrl()
  if (!base) return null
  try {
    return new URL(`${base}/`).origin
  } catch {
    return null
  }
}

export function wpAdminPostEditUrl(postId: number): string | null {
  const origin = wpOrigin()
  if (!origin) return null
  return `${origin}/wp-admin/post.php?post=${postId}&action=edit`
}

export function wpAdminPostNewUrl(): string | null {
  const origin = wpOrigin()
  if (!origin) return null
  return `${origin}/wp-admin/post-new.php`
}

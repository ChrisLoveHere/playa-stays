// ============================================================
// /api/preview — Next.js Draft Mode entry point
// Called by WordPress "Preview" button via the signed URL
// generated in playastays-content-model.php (Section 8).
//
// Query params from WP:
//   secret  — must match PREVIEW_SECRET env var
//   type    — 'properties' | 'services' | 'cities' | 'blog'
//   id      — WP post ID
//   token   — wp_create_nonce result (validated server-side)
// ============================================================

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

const SLUG_MAP: Record<string, (id: string) => string> = {
  properties: (id) => `/rentals/preview-${id}/`,
  services:   (id) => `/playa-del-carmen/property-management/`,
  cities:     (id) => `/playa-del-carmen/`,
  blog:       (id) => `/blog/preview-${id}/`,
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const secret = searchParams.get('secret')
  const type   = searchParams.get('type') ?? 'blog'
  const id     = searchParams.get('id')  ?? '0'

  // Validate secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview token', { status: 401 })
  }

  // Enable Draft Mode — sets a cookie that bypasses ISR cache
  draftMode().enable()

  // Redirect to the appropriate page
  const getPath = SLUG_MAP[type] ?? SLUG_MAP.blog
  redirect(getPath(id))
}

// ============================================================
// /api/revalidate — ISR cache invalidation webhook
// WordPress calls this via HTTP after publishing/updating content.
// The WP plugin (Section 12 of playastays-content-model.php) fires
// this when any ps_property, ps_service, ps_city, or post is saved.
//
// Body (JSON):
//   secret    — must match REVALIDATION_SECRET env var
//   post_type — 'ps_property' | 'ps_service' | 'ps_city' | 'post'
//   post_id   — WP post ID
//   slug      — post slug
// ============================================================

import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

interface RevalidatePayload {
  secret:    string
  post_type: string
  post_id:   number
  slug?:     string
}

// Maps WP post type → Next.js cache tags to invalidate
const TAG_MAP: Record<string, string[]> = {
  ps_property:   ['properties'],
  ps_service:    ['services'],
  ps_city:       ['cities'],
  post:          ['blog'],
  ps_faq:        ['faqs'],
  ps_testimonial:['testimonials'],
}

export async function POST(req: NextRequest) {
  let body: RevalidatePayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Validate secret
  if (body.secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const tags = TAG_MAP[body.post_type]
  if (!tags) {
    return NextResponse.json({ error: `Unknown post_type: ${body.post_type}` }, { status: 400 })
  }

  // Revalidate broad tags (all content of this type)
  tags.forEach(tag => revalidateTag(tag))

  // Also revalidate the specific item if we have a slug
  if (body.slug) {
    const specificTag = `${body.post_type.replace('ps_', '')}-${body.slug}`
    revalidateTag(specificTag)
  }

  // Always revalidate site-wide config on any content change
  revalidateTag('site-config')

  console.log(`[revalidate] post_type=${body.post_type} slug=${body.slug ?? body.post_id} tags=[${tags.join(', ')}]`)

  return NextResponse.json({
    revalidated: true,
    tags: [...tags, body.slug ? `item-${body.slug}` : null].filter(Boolean),
    timestamp: new Date().toISOString(),
  })
}

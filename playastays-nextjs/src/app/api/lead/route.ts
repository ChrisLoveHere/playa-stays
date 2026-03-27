// ============================================================
// /api/lead — Lead form submission
// Receives form data from LeadForm.tsx client component.
// Forwards to WordPress custom REST endpoint.
// Rate-limited by IP to prevent spam.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import type { LeadFormData } from '@/types'

// Minimal in-memory rate limit: 5 submissions per IP per 10 minutes.
// In production replace with Upstash Redis or Vercel KV.
const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 10 * 60 * 1000  // 10 minutes
  const limit = 5

  const entry = rateLimitMap.get(ip)
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please contact us via WhatsApp.' },
      { status: 429 }
    )
  }

  let data: LeadFormData
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Basic validation
  if (!data.first_name?.trim() || !data.email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  // Forward to WordPress custom endpoint
  try {
    const wpRes = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/playastays/v1/submit-lead`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No auth required for lead submission — WP endpoint is public
        },
        body: JSON.stringify({
          ...data,
          // Append server-side metadata
          submitted_at: new Date().toISOString(),
          source_ip:    ip,
          user_agent:   req.headers.get('user-agent') ?? '',
        }),
      }
    )

    if (!wpRes.ok) {
      const text = await wpRes.text()
      console.error('[lead] WP submission failed:', wpRes.status, text)
      // Don't expose WP errors to client — fail gracefully
      return NextResponse.json({ error: 'Submission failed. Please try WhatsApp.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[lead] Network error:', err)
    return NextResponse.json({ error: 'Network error. Please try WhatsApp.' }, { status: 503 })
  }
}

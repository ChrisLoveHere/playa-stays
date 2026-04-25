// ============================================================
// /api/lead — Lead form submission
// Primary: HubSpot (Forms API) when HUBSPOT_PORTAL_ID + HUBSPOT_FORM_GUID are set.
// Secondary: WordPress `playastays/v1/submit-lead` for internal / backup record.
// Rate-limited by IP.
//
// Ops / Airtable: see `lib/integrations/lead-handoff.ts` (expansion hook after each attempt).
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import type { LeadSubmissionPayload } from '@/types'
import { isHubSpotFormsConfigured, submitLeadToHubSpot } from '@/lib/hubspot-leads'
import {
  createLeadCorrelationId,
  onWebsiteLeadPipelineComplete,
} from '@/lib/integrations/lead-handoff'

const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 10 * 60 * 1000
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

function wpBaseUrl(): string | null {
  const u = process.env.NEXT_PUBLIC_WP_API_URL?.trim()
  return u || null
}

/** For support matching without logging full email addresses. */
function emailDomain(email: string): string {
  const at = email.indexOf('@')
  if (at < 1 || at === email.length - 1) return 'invalid'
  return email.slice(at + 1).toLowerCase()
}

async function submitToWordPress(
  payload: Record<string, unknown>,
  ref: string
): Promise<{ ok: boolean; skipped?: boolean; httpStatus?: number }> {
  const base = wpBaseUrl()
  if (!base) {
    console.info(`[lead] ref=${ref} wordpress_backup=skipped reason=no_NEXT_PUBLIC_WP_API_URL`)
    return { ok: false, skipped: true }
  }

  try {
    const wpRes = await fetch(`${base}/playastays/v1/submit-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!wpRes.ok) {
      const text = await wpRes.text()
      console.error(
        `[lead] ref=${ref} wordpress_backup=fail http=${wpRes.status} body=${text.slice(0, 280)}`
      )
      return { ok: false, httpStatus: wpRes.status }
    }
    console.info(`[lead] ref=${ref} wordpress_backup=success`)
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[lead] ref=${ref} wordpress_backup=fail reason=network err=${msg}`)
    return { ok: false }
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please contact us via WhatsApp.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const first_name = typeof body.first_name === 'string' ? body.first_name : ''
  const email = typeof body.email === 'string' ? body.email : ''

  if (!first_name.trim() || !email.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const correlationId = createLeadCorrelationId()
  const domain = emailDomain(email)

  const payload: LeadSubmissionPayload = {
    first_name,
    email,
    phone: typeof body.phone === 'string' ? body.phone : undefined,
    property_type: typeof body.property_type === 'string' ? body.property_type : undefined,
    current_status: typeof body.current_status === 'string' ? body.current_status : undefined,
    city: typeof body.city === 'string' ? body.city : undefined,
    source: typeof body.source === 'string' ? body.source : undefined,
    locale: typeof body.locale === 'string' ? body.locale : undefined,
    page_url: typeof body.page_url === 'string' ? body.page_url : undefined,
    referrer: typeof body.referrer === 'string' ? body.referrer : undefined,
    utm_source: typeof body.utm_source === 'string' ? body.utm_source : undefined,
    utm_medium: typeof body.utm_medium === 'string' ? body.utm_medium : undefined,
    utm_campaign: typeof body.utm_campaign === 'string' ? body.utm_campaign : undefined,
    utm_term: typeof body.utm_term === 'string' ? body.utm_term : undefined,
    utm_content: typeof body.utm_content === 'string' ? body.utm_content : undefined,
    submitted_at: new Date().toISOString(),
    source_ip: ip,
    user_agent: req.headers.get('user-agent') ?? '',
  }

  const wpPayload = { ...payload }

  console.info(
    `[lead] ref=${correlationId} stage=start email_domain=${domain} locale=${payload.locale ?? '—'} source=${payload.source ?? '—'}`
  )

  const hubspot = await submitLeadToHubSpot(payload, { correlationId })
  const wordpress = await submitToWordPress(wpPayload, correlationId)

  const hsConfigured = isHubSpotFormsConfigured()
  const wpConfigured = Boolean(wpBaseUrl())

  onWebsiteLeadPipelineComplete(payload, {
    correlationId,
    destinations: { hubspot: hubspot.ok, wordpress: wordpress.ok },
    hubspotError: hubspot.ok ? undefined : hubspot.error,
    wordpressHttpStatus: wordpress.httpStatus,
  })

  if (hubspot.ok) {
    if (!wordpress.ok && wpConfigured && !wordpress.skipped) {
      console.warn(
        `[lead] ref=${correlationId} note=hubspot_ok_wordpress_backup_failed email_domain=${domain}`
      )
    }
    console.info(
      `[lead] ref=${correlationId} outcome=success primary=hubspot wordpress_backup=${wordpress.ok ? 'ok' : wpConfigured ? 'fail' : 'skipped'}`
    )
    return NextResponse.json({ success: true, destination: 'hubspot' })
  }

  if (wordpress.ok) {
    if (hsConfigured) {
      console.warn(
        `[lead] ref=${correlationId} note=wordpress_ok_hubspot_failed hubspot_error=${hubspot.error ?? 'unknown'} email_domain=${domain}`
      )
    }
    console.info(
      `[lead] ref=${correlationId} outcome=success primary=wordpress wordpress_backup=n/a`
    )
    return NextResponse.json({
      success: true,
      destination: 'wordpress',
    })
  }

  if (!hsConfigured && !wpConfigured) {
    console.error(
      `[lead] ref=${correlationId} outcome=fail reason=no_destinations (set HUBSPOT_* or NEXT_PUBLIC_WP_API_URL)`
    )
    return NextResponse.json(
      { error: 'Submission unavailable. Please try WhatsApp or email.' },
      { status: 503 }
    )
  }

  console.error(
    `[lead] ref=${correlationId} outcome=fail hubspot_error=${hubspot.error ?? 'n/a'} wordpress=${wordpress.skipped ? 'skipped' : 'fail'} email_domain=${domain}`
  )
  return NextResponse.json({ error: 'Submission failed. Please try WhatsApp.' }, { status: 500 })
}

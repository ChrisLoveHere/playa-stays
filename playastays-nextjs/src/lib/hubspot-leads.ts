// ============================================================
// HubSpot — website lead submission (server-side)
//
// Production form: "PlayaStays Website Lead Form"
// Forms Integration API (no OAuth):
//   POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
//
// Internal field names must match the HubSpot form (override via HUBSPOT_FIELD_* if needed).
// Docs: https://developers.hubspot.com/docs/api-reference/legacy/forms-v3-integrations
// ============================================================

import type { LeadSubmissionPayload } from '@/types'

const FORMS_SUBMIT_BASE = 'https://api.hsforms.com/submissions/v3/integration/submit'

/** Production defaults — "PlayaStays Website Lead Form" field internal names */
const HS_FIELD = {
  email: 'email',
  firstname: 'firstname',
  lastname: 'lastname',
  phone: 'phone',
  city: 'city',
  message: 'message',
  lead_source_detail: 'lead_source_detail',
  current_management_status: 'current_management_status',
} as const

/** Split "Maria Garcia" → firstname / lastname for HubSpot */
function splitName(full: string): { firstname: string; lastname: string } {
  const t = full.trim()
  if (!t) return { firstname: 'Unknown', lastname: '' }
  const parts = t.split(/\s+/)
  if (parts.length === 1) return { firstname: parts[0], lastname: '' }
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') }
}

function fieldName(envKey: string, production: string): string {
  return (process.env[envKey] ?? production).trim() || production
}

function buildLeadSourceDetail(data: LeadSubmissionPayload): string {
  const parts = [
    data.source && `source:${data.source}`,
    data.locale && `locale:${data.locale}`,
    data.page_url && `page:${data.page_url}`,
    data.referrer && `referrer:${data.referrer}`,
    data.utm_source && `utm_source:${data.utm_source}`,
    data.utm_medium && `utm_medium:${data.utm_medium}`,
    data.utm_campaign && `utm_campaign:${data.utm_campaign}`,
    data.utm_term && `utm_term:${data.utm_term}`,
    data.utm_content && `utm_content:${data.utm_content}`,
  ].filter(Boolean) as string[]
  return parts.length ? parts.join(' | ') : 'website'
}

/**
 * Human-readable note for HubSpot `message` only.
 * Structured fields (email, city, lead_source_detail, etc.) are mapped separately — do not duplicate them here.
 */
function buildHubSpotMessageNote(data: LeadSubmissionPayload): string {
  return [
    'PlayaStays website lead',
    '',
    `Property type: ${data.property_type?.trim() || '—'}`,
    `Source: ${data.source?.trim() || '—'}`,
    `Locale: ${data.locale?.trim() || '—'}`,
    `Page URL: ${data.page_url?.trim() || '—'}`,
    `Submitted at: ${data.submitted_at?.trim() || '—'}`,
  ].join('\n')
}

/**
 * Returns true if HubSpot env is configured.
 */
export function isHubSpotFormsConfigured(): boolean {
  const portal = process.env.HUBSPOT_PORTAL_ID?.trim()
  const form = process.env.HUBSPOT_FORM_GUID?.trim()
  return Boolean(portal && form)
}

export type HubSpotSubmitContext = {
  /** Correlates with `[lead]` logs in `/api/lead` */
  correlationId?: string
}

/**
 * Submit lead to HubSpot via Forms API. Does not throw — returns { ok, error? }.
 */
export async function submitLeadToHubSpot(
  data: LeadSubmissionPayload,
  ctx?: HubSpotSubmitContext
): Promise<{ ok: boolean; error?: string }> {
  const ref = ctx?.correlationId ?? ''

  if (!isHubSpotFormsConfigured()) {
    console.info(
      `[hubspot] ref=${ref || '—'} result=skip reason=hubspot_not_configured`
    )
    return { ok: false, error: 'hubspot_not_configured' }
  }

  const portalId = process.env.HUBSPOT_PORTAL_ID!.trim()
  const formGuid = process.env.HUBSPOT_FORM_GUID!.trim()

  const { firstname, lastname } = splitName(data.first_name ?? '')

  const n = {
    email: fieldName('HUBSPOT_FIELD_EMAIL', HS_FIELD.email),
    firstname: fieldName('HUBSPOT_FIELD_FIRSTNAME', HS_FIELD.firstname),
    lastname: fieldName('HUBSPOT_FIELD_LASTNAME', HS_FIELD.lastname),
    phone: fieldName('HUBSPOT_FIELD_PHONE', HS_FIELD.phone),
    city: fieldName('HUBSPOT_FIELD_CITY', HS_FIELD.city),
    message: fieldName('HUBSPOT_FIELD_MESSAGE', HS_FIELD.message),
    lead_source_detail: fieldName(
      'HUBSPOT_FIELD_LEAD_SOURCE_DETAIL',
      HS_FIELD.lead_source_detail
    ),
    current_management_status: fieldName(
      'HUBSPOT_FIELD_CURRENT_MANAGEMENT_STATUS',
      HS_FIELD.current_management_status
    ),
  }

  const leadSourceDetail = buildLeadSourceDetail(data)
  const messageBody = buildHubSpotMessageNote(data)

  const fields: Array<{ name: string; value: string }> = [
    { name: n.email, value: data.email.trim() },
    { name: n.firstname, value: firstname },
    { name: n.lastname, value: lastname.trim() ? lastname : '—' },
    { name: n.lead_source_detail, value: leadSourceDetail },
    {
      name: n.current_management_status,
      value: (data.current_status ?? '').trim() || '—',
    },
    { name: n.message, value: messageBody },
  ]

  if (data.phone?.trim()) fields.push({ name: n.phone, value: data.phone.trim() })
  if (data.city?.trim()) fields.push({ name: n.city, value: data.city.trim() })

  const context: Record<string, string> = {}
  if (data.page_url) {
    context.pageUri = data.page_url
    try {
      context.pageName = new URL(data.page_url).pathname || 'PlayaStays'
    } catch {
      context.pageName = 'PlayaStays'
    }
  }

  const payload: { fields: typeof fields; context?: Record<string, string> } = { fields }
  if (Object.keys(context).length) payload.context = context

  try {
    const url = `${FORMS_SUBMIT_BASE}/${portalId}/${formGuid}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(
        `[hubspot] ref=${ref || '—'} result=fail http=${res.status} body=${text.slice(0, 280)}`
      )
      return { ok: false, error: `hubspot_${res.status}` }
    }

    console.info(`[hubspot] ref=${ref || '—'} result=success`)
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`[hubspot] ref=${ref || '—'} result=fail reason=network err=${msg}`)
    return { ok: false, error: 'hubspot_network' }
  }
}

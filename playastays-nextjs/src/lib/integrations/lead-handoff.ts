import { randomBytes } from 'crypto'

// ============================================================
// Lead pipeline — expansion hooks (HubSpot live; Airtable later)
//
// Sales truth: HubSpot (website form → Forms API in `hubspot-leads.ts`).
// Operations truth: Airtable (intake / properties / owners) — wired outside or
// via this module once base IDs, tokens, and field mapping are finalized.
//
// This file stays intentionally small: one place for “what happens next” without
// scattering TODOs across the app.
// ============================================================

import type { LeadSubmissionPayload } from '@/types'

/** Short id for correlating server logs across HubSpot + WordPress + future jobs. */
export function createLeadCorrelationId(): string {
  return randomBytes(4).toString('hex')
}

export type WebsiteLeadDestinations = {
  hubspot: boolean
  wordpress: boolean
}

/**
 * Called once per POST `/api/lead` after HubSpot + WordPress attempts finish.
 * Safe no-op today; use for Airtable queue, internal webhook, or audit log later.
 *
 * Future handoff points (typical patterns — not all are app-side):
 *
 * 1. **Website lead submitted (raw)** — here, or a queue worker fed by the same payload.
 * 2. **Lead qualified** — usually HubSpot workflow / sales process; app rarely involved.
 * 3. **Move-forward / onboarding** — CRM stage change → automation; optional app webhook.
 * 4. **Property or owner created** — `app/api/admin/*` or WordPress sync → ops base row.
 */
export function onWebsiteLeadPipelineComplete(
  _payload: LeadSubmissionPayload,
  _ctx: {
    correlationId: string
    destinations: WebsiteLeadDestinations
    hubspotError?: string
    wordpressHttpStatus?: number
  }
): void {
  // Intentionally empty. Example future use: enqueue Airtable record, Segment event, etc.
}

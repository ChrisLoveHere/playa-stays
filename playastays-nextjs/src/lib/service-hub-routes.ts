// ============================================================
// Top-level service hub routes (no city prefix)
// EN: /property-management/  ↔  ES: /es/administracion-de-propiedades/
// City-scoped URLs reuse the same public EN/ES segments under /[city]/.
// ============================================================

import type { Locale } from '@/types'
import { SERVICE_SLUG_EN_TO_ES } from '@/lib/i18n'
import {
  SERVICE_HUB_EN_TO_ES,
  SERVICE_HUB_ES_TO_EN,
  SERVICE_HUB_IDS,
  type ServiceHubId,
} from '@/lib/service-hub-constants'

export { SERVICE_HUB_IDS, SERVICE_HUB_EN_TO_ES, SERVICE_HUB_ES_TO_EN, type ServiceHubId } from '@/lib/service-hub-constants'

export function isServiceHubEnSegment(seg: string): seg is ServiceHubId {
  return (SERVICE_HUB_IDS as readonly string[]).includes(seg)
}

export function isServiceHubEsSegment(seg: string): boolean {
  return seg in SERVICE_HUB_ES_TO_EN
}

/** Top-level hub URL for nav, footers, cross-links */
export function serviceHubHref(locale: Locale, hubId: ServiceHubId): string {
  if (locale === 'es') return `/es/${SERVICE_HUB_EN_TO_ES[hubId]}/`
  return `/${hubId}/`
}

/**
 * City-scoped service page for this hub (WP ps_service_slug layer uses vacation-rentals → vacation-rental-management URL).
 */
export function cityServiceHrefForHub(citySlug: string, hubId: ServiceHubId, locale: Locale): string {
  const enSeg = hubId
  if (locale === 'es') {
    const esSeg = SERVICE_SLUG_EN_TO_ES[enSeg] ?? enSeg
    return `/es/${citySlug}/${esSeg}/`
  }
  return `/${citySlug}/${enSeg}/`
}

/** Map WP service slug → global hub id when one exists */
export function wpSlugToServiceHubId(svcSlug: string): ServiceHubId | null {
  const m: Record<string, ServiceHubId> = {
    'property-management': 'property-management',
    'airbnb-management': 'airbnb-management',
    'vacation-rentals': 'vacation-rental-management',
    'sell-your-property': 'sell-property',
  }
  return m[svcSlug] ?? null
}

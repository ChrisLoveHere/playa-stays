/**
 * Privacy-safe listing map embed resolution for property detail pages.
 * Uses Maps Embed API (iframe) only — no JS API, Places, or Geocoding calls.
 */
import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import {
  googleMapsEmbedPlaceByPlaceId,
  googleMapsEmbedPlaceByQuery,
  googleMapsEmbedViewByCenter,
  googleMapsExternalPlaceIdUrl,
  googleMapsExternalSearchUrl,
  googleMapsExternalLatLngUrl,
} from '@/lib/google-maps-embed'

export interface ListingMapResolution {
  /** When true, render iframe (requires embedSrc). */
  showIframe: boolean
  embedSrc: string | null
  /** External Google Maps URL (always set when section is shown). */
  mapsUrl: string
  sectionTitle: string
  subline: string | null
  /** Shown for private / approximate modes. */
  privacyNote: string | null
  iframeTitle: string
  openInMapsLabel: string
}

function isPublicBuilding(meta: Property['meta']): boolean {
  return meta.ps_location_type === 'public_building'
}

function publicBuildingQuery(meta: Property['meta']): {
  kind: 'place_id' | 'query' | 'building_city'
  value: string
} | null {
  const placeId = meta.ps_google_place_id?.trim()
  if (placeId) return { kind: 'place_id', value: placeId }

  const mq = meta.ps_map_query?.trim()
  if (mq) return { kind: 'query', value: mq }

  const building = meta.ps_building_name?.trim()
  const city = meta.ps_city?.trim()
  if (building && city) return { kind: 'building_city', value: `${building}, ${city}` }

  return null
}

function privateApproximateQuery(meta: Property['meta']): {
  kind: 'view'
  lat: number
  lng: number
} | {
  kind: 'place'
  q: string
  zoom: number
} | null {
  const lat = meta.ps_approximate_lat
  const lng = meta.ps_approximate_lng
  if (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  ) {
    return { kind: 'view', lat, lng }
  }

  const city = meta.ps_city?.trim()
  const hood = meta.ps_neighborhood?.trim()
  if (hood && city) {
    return { kind: 'place', q: `${hood}, ${city}`, zoom: 13 }
  }

  const svc = meta.ps_service_area?.trim()
  if (svc) {
    return { kind: 'place', q: svc, zoom: 12 }
  }

  if (city) {
    return { kind: 'place', q: city, zoom: 11 }
  }

  return null
}

function externalUrlForPublic(
  spec: NonNullable<ReturnType<typeof publicBuildingQuery>>
): string {
  if (spec.kind === 'place_id') {
    return googleMapsExternalPlaceIdUrl(spec.value)
  }
  return googleMapsExternalSearchUrl(spec.value)
}

function baseIframeTitle(locale: Locale): string {
  return locale === 'es'
    ? 'Mapa de la ubicación de la propiedad'
    : 'Map showing property location'
}

function openMapsLabel(locale: Locale): string {
  return locale === 'es' ? 'Abrir en Google Maps →' : 'Open in Google Maps →'
}

/**
 * Returns map UI resolution for the listing page, or `null` when no map section
 * should appear (insufficient data for public_building listings).
 * Private / unknown types always get at least city-level approximate when `ps_city` exists.
 */
export function resolveListingMapEmbed(
  property: Property,
  locale: Locale,
  embedApiKey: string | undefined
): ListingMapResolution | null {
  const meta = property.meta
  const key = embedApiKey?.trim()
  const isEs = locale === 'es'

  if (isPublicBuilding(meta)) {
    const spec = publicBuildingQuery(meta)
    if (!spec) return null

    const mapsUrl = externalUrlForPublic(spec)
    let embedSrc: string | null = null
    if (key) {
      if (spec.kind === 'place_id') {
        embedSrc = googleMapsEmbedPlaceByPlaceId(key, spec.value)
      } else {
        embedSrc = googleMapsEmbedPlaceByQuery(key, spec.value, 16)
      }
    }

    let subline: string | null = null
    if (meta.ps_building_name?.trim() && meta.ps_city?.trim()) {
      subline = isEs
        ? `En ${meta.ps_building_name}, ${meta.ps_city}`
        : `Located in ${meta.ps_building_name}, ${meta.ps_city}`
    } else if (meta.ps_map_query?.trim()) {
      subline = isEs ? `Ubicación: ${meta.ps_map_query}` : `Location: ${meta.ps_map_query}`
    }

    return {
      showIframe: Boolean(key && embedSrc),
      embedSrc,
      mapsUrl,
      sectionTitle: isEs ? 'Ubicación' : 'Location',
      subline,
      privacyNote: null,
      iframeTitle: baseIframeTitle(locale),
      openInMapsLabel: openMapsLabel(locale),
    }
  }

  // private_address or unknown → private behavior
  const approx = privateApproximateQuery(meta)
  if (!approx) return null

  const mapsUrl =
    approx.kind === 'view'
      ? googleMapsExternalLatLngUrl(approx.lat, approx.lng)
      : googleMapsExternalSearchUrl(approx.q)

  let embedSrc: string | null = null
  if (key) {
    if (approx.kind === 'view') {
      embedSrc = googleMapsEmbedViewByCenter(key, approx.lat, approx.lng, 14)
    } else {
      embedSrc = googleMapsEmbedPlaceByQuery(key, approx.q, approx.zoom)
    }
  }

  return {
    showIframe: Boolean(key && embedSrc),
    embedSrc,
    mapsUrl,
    sectionTitle: isEs ? 'Ubicación aproximada' : 'Approximate location',
    subline: isEs
      ? 'Zona general mostrada por privacidad.'
      : 'Shown at neighborhood or area level for privacy.',
    privacyNote: isEs
      ? 'La ubicación exacta no se muestra en el mapa.'
      : 'Exact address is not shown on the map.',
    iframeTitle: isEs ? 'Ubicación aproximada (privacidad)' : 'Approximate location (privacy)',
    openInMapsLabel: openMapsLabel(locale),
  }
}

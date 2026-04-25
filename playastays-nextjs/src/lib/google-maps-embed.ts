import { SITE_BUSINESS_ADDRESS } from '@/lib/site-contact'

/** Google Maps Embed API (iframe) — requires Maps Embed API enabled for the key. */
export function googleMapsEmbedPlaceSrc(embedApiKey: string): string {
  const q = encodeURIComponent(SITE_BUSINESS_ADDRESS)
  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedApiKey)}&q=${q}&zoom=16`
}

/** Opens the same place in Google Maps (no API key). */
export function googleMapsPlaceSearchUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_BUSINESS_ADDRESS)}`
}

// ── Listing / generic embeds (Maps Embed API — iframe `src` only) ──

export function googleMapsEmbedPlaceByQuery(
  embedApiKey: string,
  query: string,
  zoom = 15
): string {
  const q = encodeURIComponent(query)
  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedApiKey)}&q=${q}&zoom=${zoom}`
}

export function googleMapsEmbedPlaceByPlaceId(embedApiKey: string, placeId: string): string {
  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedApiKey)}&place_id=${encodeURIComponent(placeId)}`
}

export function googleMapsEmbedViewByCenter(
  embedApiKey: string,
  lat: number,
  lng: number,
  zoom = 14
): string {
  return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(embedApiKey)}&center=${lat},${lng}&zoom=${zoom}`
}

/** External Maps (no API key) — search by free-text query. */
export function googleMapsExternalSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/** External Maps — open by `place_id`. */
export function googleMapsExternalPlaceIdUrl(placeId: string): string {
  return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`
}

/** External Maps — lat,lng search. */
export function googleMapsExternalLatLngUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`
}

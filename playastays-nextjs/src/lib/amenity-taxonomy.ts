// ============================================================
// PlayaStays — Amenity taxonomy (single source of truth)
//
// Powers: browse filters, property detail grouped amenities,
// card tags/badges, and future owner/admin amenity pickers.
//
// Canonical keys are kebab-case (URL `feature` params & JSON storage).
// ============================================================

import type { Property } from '@/types'

export type AmenityDataSource = 'blob' | 'meta' | 'future'

export interface AmenityDef {
  /** Canonical slug — URL param / ps_amenity_keys value */
  key: string
  en: string
  es: string
  /** Display icon (emoji); optional string token for future icon font swap */
  icon: string
  /** How this is resolved today */
  dataSource: AmenityDataSource
  /** Include in browse FilterBar (false = badge/detail only; managed uses separate toggle) */
  filterEligible?: boolean
  /** Safe to show as a card/detail badge when the key resolves */
  badgeEligible?: boolean
}

export interface AmenityCategory {
  id: string
  en: string
  es: string
  items: AmenityDef[]
}

/** Property count fields — not amenities, but aligned for future listing forms */
export const PROPERTY_COUNT_FIELDS = [
  { key: 'guests', en: 'Guests', es: 'Huéspedes', meta: 'ps_guests' as const },
  { key: 'bedrooms', en: 'Bedrooms', es: 'Recámaras', meta: 'ps_bedrooms' as const },
  { key: 'beds', en: 'Beds', es: 'Camas', meta: 'ps_beds' as const },
  { key: 'bathrooms', en: 'Bathrooms', es: 'Baños', meta: 'ps_bathrooms' as const },
] as const

// ── Category catalog (reference-aligned groups) ───────────

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    id: 'guest-favorites',
    en: 'Guest favorites',
    es: 'Favoritos de huéspedes',
    items: [
      { key: 'wifi', en: 'Wi‑Fi', es: 'Wi‑Fi', icon: '📶', dataSource: 'blob' },
      { key: 'tv', en: 'TV', es: 'TV', icon: '📺', dataSource: 'blob' },
      { key: 'kitchen', en: 'Kitchen', es: 'Cocina', icon: '🍳', dataSource: 'blob' },
      { key: 'washer-dryer', en: 'Washer / dryer', es: 'Lavadora / secadora', icon: '🧺', dataSource: 'blob' },
      { key: 'air-conditioning', en: 'Air conditioning', es: 'Aire acondicionado', icon: '❄️', dataSource: 'blob' },
      { key: 'workspace', en: 'Dedicated workspace', es: 'Espacio de trabajo', icon: '💻', dataSource: 'blob' },
      { key: 'free-parking', en: 'Free parking', es: 'Estacionamiento gratis', icon: '🅿️', dataSource: 'blob' },
      { key: 'paid-parking', en: 'Paid parking', es: 'Estacionamiento de pago', icon: '🅿️', dataSource: 'blob' },
    ],
  },
  {
    id: 'standout',
    en: 'Standout amenities',
    es: 'Amenidades destacadas',
    items: [
      { key: 'pool', en: 'Pool', es: 'Alberca / piscina', icon: '🏊', dataSource: 'blob' },
      { key: 'hot-tub-private', en: 'Private hot tub', es: 'Jacuzzi privado', icon: '♨️', dataSource: 'blob' },
      { key: 'hot-tub-shared', en: 'Shared hot tub', es: 'Jacuzzi compartido', icon: '♨️', dataSource: 'blob' },
      { key: 'patio', en: 'Patio', es: 'Patio', icon: '🌿', dataSource: 'blob' },
      { key: 'bbq-grill', en: 'BBQ grill', es: 'Asador / parrilla', icon: '🔥', dataSource: 'blob' },
      { key: 'outdoor-dining', en: 'Outdoor dining', es: 'Comedor exterior', icon: '🍽️', dataSource: 'blob' },
      { key: 'fire-pit', en: 'Fire pit', es: 'Fogata', icon: '🔥', dataSource: 'blob' },
      { key: 'pool-table', en: 'Pool table', es: 'Mesa de billar', icon: '🎱', dataSource: 'blob' },
      { key: 'indoor-fireplace', en: 'Indoor fireplace', es: 'Chimenea interior', icon: '🪵', dataSource: 'blob' },
      { key: 'piano', en: 'Piano', es: 'Piano', icon: '🎹', dataSource: 'blob' },
      { key: 'exercise-equipment', en: 'Exercise equipment', es: 'Equipo de ejercicio', icon: '🏋️', dataSource: 'blob' },
      { key: 'beach-access', en: 'Beach access', es: 'Acceso a playa', icon: '🏖️', dataSource: 'blob' },
    ],
  },
  {
    id: 'safety',
    en: 'Safety',
    es: 'Seguridad',
    items: [
      { key: 'smoke-alarm', en: 'Smoke alarm', es: 'Detector de humo', icon: '🔔', dataSource: 'blob' },
      { key: 'carbon-monoxide-alarm', en: 'Carbon monoxide alarm', es: 'Detector de monóxido', icon: '🛡️', dataSource: 'blob' },
      { key: 'first-aid-kit', en: 'First aid kit', es: 'Botiquín', icon: '🩹', dataSource: 'blob' },
      { key: 'fire-extinguisher', en: 'Fire extinguisher', es: 'Extintor', icon: '🧯', dataSource: 'blob' },
    ],
  },
  {
    id: 'location',
    en: 'Location & views',
    es: 'Ubicación y vistas',
    items: [
      { key: 'beachfront', en: 'Beachfront', es: 'Frente al mar', icon: '🏖️', dataSource: 'blob' },
      { key: 'waterfront', en: 'Waterfront', es: 'Frente al agua', icon: '🌊', dataSource: 'blob' },
      { key: 'ocean-view', en: 'Ocean view', es: 'Vista al mar', icon: '🌅', dataSource: 'blob' },
      { key: 'walk-beach', en: 'Walk to beach', es: 'Cerca de la playa', icon: '🚶', dataSource: 'blob' },
      { key: 'downtown', en: 'Downtown / Centro', es: 'Centro / Quinta Avenida', icon: '🏙️', dataSource: 'blob' },
      { key: 'gated-community', en: 'Gated community', es: 'Fraccionamiento cerrado', icon: '🔒', dataSource: 'blob' },
      { key: 'quiet-area', en: 'Quiet area', es: 'Zona tranquila', icon: '🤫', dataSource: 'blob' },
    ],
  },
  {
    id: 'practical',
    en: 'Practical & stay features',
    es: 'Comodidad y estancia',
    items: [
      { key: 'furnished', en: 'Furnished', es: 'Amueblado', icon: '🛋️', dataSource: 'blob' },
      { key: 'elevator', en: 'Elevator', es: 'Ascensor', icon: '🛗', dataSource: 'blob' },
      { key: 'balcony', en: 'Balcony / terrace', es: 'Balcón / terraza', icon: '🌅', dataSource: 'blob' },
      { key: 'pet-friendly', en: 'Pet-friendly', es: 'Mascotas', icon: '🐾', dataSource: 'blob' },
      {
        key: 'long-term-stay-friendly',
        en: 'Great for longer stays',
        es: 'Ideal para estancias largas',
        icon: '📆',
        dataSource: 'meta',
        filterEligible: true,
        badgeEligible: true,
      },
      {
        key: 'monthly-stay-available',
        en: 'Monthly stay friendly',
        es: 'Estancia mensual',
        icon: '📅',
        dataSource: 'meta',
        filterEligible: false,
        badgeEligible: true,
      },
      {
        key: 'playastays-managed',
        en: 'PlayaStays Managed',
        es: 'Gestionada por PlayaStays',
        icon: '✦',
        dataSource: 'meta',
        filterEligible: false,
        badgeEligible: true,
      },
      { key: 'family-friendly', en: 'Family-friendly', es: 'Para familias', icon: '👨‍👩‍👧', dataSource: 'blob' },
    ],
  },
]

// ── Regex matchers (CMS amenity text + title + excerpt) ─────
// Keep in sync with `amenityMatchesFeature` / browse filters.

export const AMENITY_MATCHERS: Record<string, RegExp> = {
  wifi: /wi-?fi|internet|wireless/i,
  tv: /\btv\b|television|smart\s*tv|flat\s*screen|pantalla/i,
  kitchen: /kitchen|cocina|kitchenette|full\s*kitchen/i,
  'washer-dryer': /washer|dryer|lavadora|secadora|laundry(\s+room)?/i,
  'air-conditioning': /air\s*condition|a\/?c\b|aire\s*acondicionado|climate\s*control|minisplit/i,
  workspace: /workspace|home\s*office|escritorio|dedicated\s*desk|office\s*space/i,
  'free-parking': /free\s*parking|parking\s*included|estacionamiento\s*gratis|sin\s*costo.{0,20}estacion/i,
  'paid-parking': /paid\s*parking|valet|estacionamiento\s*(de\s*)?pago|parking\s*fee/i,
  /** Legacy browse key — any parking mention */
  parking: /parking|estacionamiento|garage|garaje/i,
  pool: /\bpool\b|\bpiscina\b|alberca/i,
  'hot-tub-private':
    /(private|privado|privada)\s*(jacuzzi|hot\s*tub)|(jacuzzi|hot\s*tub)\s*(private|privado|privada)/i,
  'hot-tub-shared':
    /(shared|communal|compartid|comunitari|área\s+común).{0,40}(jacuzzi|hot\s*tub)|(jacuzzi|hot\s*tub).{0,40}(shared|compartid|comunal|comunitari)/i,
  patio: /\bpatio\b|courtyard|jardín|garden\s*area/i,
  'bbq-grill': /\bbbq\b|grill|asador|parrilla|barbecue/i,
  'outdoor-dining': /outdoor\s*dining|comedor\s*exterior|al\s*fresco|terrace\s*dining/i,
  'fire-pit': /fire\s*pit|fogata|hoguera/i,
  'pool-table': /pool\s*table|billiard|mesa\s*de\s*billar|billar/i,
  'indoor-fireplace': /indoor\s*fireplace|chimenea|fireplace/i,
  piano: /\bpiano\b/i,
  'exercise-equipment': /gym|exercise|fitness|gimnasio|workout|exercise\s*equipment/i,
  'beach-access': /beach\s*access|acceso\s*(a\s*la\s*)?playa|beach\s*club|club\s*de\s*playa/i,
  'smoke-alarm': /smoke\s*(alarm|detector)|alarma\s*de\s*humo|detector\s*de\s*humo/i,
  'carbon-monoxide-alarm': /carbon\s*monoxide|co\s*alarm|co\s*detector|monóxido|detector\s*de\s*co/i,
  'first-aid-kit': /first\s*aid|botiquín|primeros\s*auxilios/i,
  'fire-extinguisher': /fire\s*extinguisher|extintor|extinguidor/i,
  beachfront: /beach\s*front|frente\s*al\s*mar|ocean\s*front|beachfront|primera\s*fila/i,
  waterfront: /waterfront|frente\s*(al)?\s*(canal|laguna|marina)|overwater|orilla/i,
  'ocean-view': /ocean\s*view|vista\s*(al\s*)?(mar|océano)|sea\s*view/i,
  'walk-beach':
    /walk\s*to\s*(the\s*)?beach|a\s*pie\s*(de\s*la\s*)?playa|minutes?\s*(to|from)\s*beach|minutos?\s*(a|de)\s*la\s*playa/i,
  downtown: /downtown|centro|quinta\s*avenida|5th\s*avenue|la\s*quinta|centro\s*histórico/i,
  'gated-community': /gated|fraccionamiento|privada\s*cerrada|controlled\s*access/i,
  'quiet-area': /quiet|tranquilo|residencial|peaceful|calm/i,
  furnished: /furnished|amueblado|amoblado/i,
  elevator: /elevator|ascensor/i,
  balcony: /balcony|balcón|terraza|terrace/i,
  'pet-friendly': /pet|mascota|dog|perro|cat|gato/i,
  'family-friendly': /family|familia|niños|kids|kid.friendly|child|familiar/i,
  /** Blob-only — meta overrides via `long-term-stay-friendly` resolver */
  'long-term-stay-friendly':
    /long[\s-]term|monthly\s*(rent|stay)|estancia\s+larga|28[\s+]*night|30[\s+]*night/i,
}

const _flat = AMENITY_CATEGORIES.flatMap(c => c.items)
const _map = new Map(_flat.map(a => [a.key, a]))

export function getAmenityDef(key: string): AmenityDef | undefined {
  return _map.get(key)
}

export function amenityLabel(key: string, locale: 'en' | 'es'): string {
  const d = _map.get(key)
  if (!d) return key.replace(/-/g, ' ')
  return locale === 'es' ? d.es : d.en
}

export function amenityIcon(key: string): string {
  return _map.get(key)?.icon ?? ''
}

export function allAmenityKeys(): string[] {
  return _flat.map(a => a.key)
}

/** Keys exposed as browse `feature` filters (taxonomy + regex-backed). */
export function filterFeatureKeys(): string[] {
  const fromCats = _flat.filter(a => a.filterEligible !== false).map(a => a.key)
  return [...new Set([...fromCats, 'parking'])]
}

/**
 * Strict feature match for browse — same rules as historical `matchesFeature`
 * (text blob from amenities + title + excerpt).
 */
export function amenityMatchesFeature(blob: string, feature: string): boolean {
  const rx = AMENITY_MATCHERS[feature]
  if (rx) return rx.test(blob)
  return false
}

function normBlob(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function propertyAmenityBlob(p: Property): string {
  return normBlob(
    [...p.ps_computed.amenities, p.title.rendered, p.excerpt.rendered.replace(/<[^>]*>/g, ' ')].join(' ')
  )
}

export function parseStructuredAmenityKeys(raw: string | undefined): string[] {
  if (!raw?.trim()) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const out: string[] = []
    for (const el of parsed) {
      if (typeof el !== 'string') continue
      const k = el.trim().toLowerCase().replace(/_/g, '-')
      if (k) out.push(k)
    }
    return out
  } catch {
    return []
  }
}

/** True when the property has CMS-populated structured amenity keys. */
export function hasStructuredAmenityKeys(p: Property): boolean {
  return parseStructuredAmenityKeys(p.meta.ps_amenity_keys).length > 0
}

function resolveMetaAmenityKeys(p: Property): string[] {
  const keys: string[] = []
  if (p.meta.ps_managed_by_ps) keys.push('playastays-managed')
  if ((Number(p.meta.ps_monthly_rate) || 0) > 0) keys.push('monthly-stay-available')
  const minStay = p.meta.ps_min_stay_nights ?? 0
  if (minStay >= 28) keys.push('long-term-stay-friendly')
  return keys
}

/**
 * Resolve amenity keys for a property.
 *
 * Resolution order (most-trusted first):
 * 1. CMS structured keys (`ps_amenity_keys`) — authoritative when populated
 * 2. Meta-derived keys (managed, monthly, long-term) — always applied
 * 3. Regex/blob fallback — ONLY when structured keys are absent
 *
 * When structured keys exist, blob regex is NOT run. This prevents
 * false positives from ambiguous description text (e.g. "no pool"
 * matching pool, or mixed-language copy triggering wrong keys).
 */
export function collectResolvedAmenityKeys(p: Property): string[] {
  const structured = parseStructuredAmenityKeys(p.meta.ps_amenity_keys)
  const isStructured = structured.length > 0
  const set = new Set<string>(structured)

  if (!isStructured) {
    const blob = propertyAmenityBlob(p)
    for (const key of allAmenityKeys()) {
      if (set.has(key)) continue
      const def = getAmenityDef(key)
      if (!def) continue
      if (def.dataSource === 'meta' || def.dataSource === 'future') continue
      const rx = AMENITY_MATCHERS[key]
      if (rx && rx.test(blob)) set.add(key)
    }
  }

  for (const k of resolveMetaAmenityKeys(p)) set.add(k)

  if (!isStructured) {
    const blob = propertyAmenityBlob(p)
    if (AMENITY_MATCHERS['long-term-stay-friendly']?.test(blob)) {
      set.add('long-term-stay-friendly')
    }
  }

  return [...set]
}

/**
 * Central predicate: does this property have a specific amenity?
 *
 * Used by browse filtering, badge logic, and any per-key check.
 * Follows the same structured→meta→blob precedence as collectResolvedAmenityKeys.
 */
export function propertyHasAmenity(p: Property, feature: string): boolean {
  if (feature === 'managed') return p.meta.ps_managed_by_ps === true

  const structured = parseStructuredAmenityKeys(p.meta.ps_amenity_keys)
  const isStructured = structured.length > 0

  if (isStructured) {
    if (structured.includes(feature)) return true
    if (feature === 'parking') {
      return structured.includes('free-parking') || structured.includes('paid-parking')
    }
  }

  const metaKeys = resolveMetaAmenityKeys(p)
  if (metaKeys.includes(feature)) return true

  if (isStructured) return false

  const blob = propertyAmenityBlob(p)
  return amenityMatchesFeature(blob, feature)
}

export interface AmenityDisplayGroup {
  categoryId: string
  category: string
  items: Array<{ key: string; icon: string; label: string }>
}

export function buildAmenityDisplayGroups(
  p: Property,
  locale: 'en' | 'es'
): AmenityDisplayGroup[] {
  const resolved = new Set(collectResolvedAmenityKeys(p))
  const out: AmenityDisplayGroup[] = []

  for (const cat of AMENITY_CATEGORIES) {
    const items: AmenityDisplayGroup['items'] = []
    for (const item of cat.items) {
      if (!resolved.has(item.key)) continue
      items.push({
        key: item.key,
        icon: item.icon,
        label: locale === 'es' ? item.es : item.en,
      })
    }
    if (items.length > 0) {
      out.push({
        categoryId: cat.id,
        category: locale === 'es' ? cat.es : cat.en,
        items,
      })
    }
  }
  return out
}

/**
 * @deprecated Prefer `buildAmenityDisplayGroups` + `collectResolvedAmenityKeys`.
 * Regex-only grouping (no structured meta keys) — used for quick tests / legacy callers.
 */
export function matchAmenitiesFromBlob(
  blob: string,
  locale: 'en' | 'es'
): Array<{ category: string; items: Array<{ icon: string; label: string }> }> {
  const results: Array<{ category: string; items: Array<{ icon: string; label: string }> }> = []
  for (const cat of AMENITY_CATEGORIES) {
    const matched: Array<{ icon: string; label: string }> = []
    for (const item of cat.items) {
      if (item.dataSource !== 'blob') continue
      const rx = AMENITY_MATCHERS[item.key]
      if (rx && rx.test(blob)) {
        matched.push({ icon: item.icon, label: locale === 'es' ? item.es : item.en })
      }
    }
    if (matched.length > 0) {
      results.push({ category: locale === 'es' ? cat.es : cat.en, items: matched })
    }
  }
  return results
}

/** Priority order for property detail + card emphasis (first wins when limiting). */
export const BADGE_PRIORITY_KEYS: readonly string[] = [
  'playastays-managed',
  'monthly-stay-available',
  'long-term-stay-friendly',
  'beachfront',
  'ocean-view',
  'waterfront',
  'walk-beach',
  'pool',
  'pet-friendly',
  'gated-community',
]

/**
 * Truthful badges: meta-driven tags + taxonomy labels grounded in `collectResolvedAmenityKeys`.
 */
export function buildPropertyBadges(p: Property, locale: 'en' | 'es', max = 6): string[] {
  const keys = new Set(collectResolvedAmenityKeys(p))
  const labels: string[] = []

  for (const key of BADGE_PRIORITY_KEYS) {
    if (labels.length >= max) break
    if (!keys.has(key)) continue
    const def = getAmenityDef(key)
    if (!def || def.badgeEligible === false) continue
    labels.push(locale === 'es' ? def.es : def.en)
  }

  return labels
}

/** Smart tags for browse cards (compact; emoji + label). */
export const CARD_TAG_KEYS: readonly string[] = [
  'beachfront',
  'ocean-view',
  'pool',
  'walk-beach',
  'pet-friendly',
  'workspace',
  'family-friendly',
]

export function deriveCardSmartTags(p: Property, locale: 'en' | 'es'): string[] {
  const tags: string[] = []
  if ((Number(p.meta.ps_monthly_rate) || 0) > 0) {
    tags.push(locale === 'es' ? '📅 Estancia mensual' : '📅 Monthly stays')
  }
  const keys = collectResolvedAmenityKeys(p)
  const have = new Set(keys)

  for (const key of CARD_TAG_KEYS) {
    if (tags.length >= 3) break
    if (!have.has(key)) continue
    const icon = amenityIcon(key)
    const label = amenityLabel(key, locale)
    tags.push(`${icon} ${label}`.trim())
  }

  return tags
}

/**
 * Keys that need reliable CMS fields (not only regex on blobs).
 * `carbon-monoxide-alarm` etc. are weaker until explicitly listed in CMS.
 */
export const CMS_STRUCTURED_AMENITY_KEYS_RECOMMENDED: readonly string[] = [
  'wifi',
  'tv',
  'kitchen',
  'washer-dryer',
  'air-conditioning',
  'workspace',
  'free-parking',
  'paid-parking',
  'pool',
  'hot-tub-private',
  'hot-tub-shared',
  'patio',
  'bbq-grill',
  'outdoor-dining',
  'fire-pit',
  'pool-table',
  'indoor-fireplace',
  'piano',
  'exercise-equipment',
  'beach-access',
  'smoke-alarm',
  'carbon-monoxide-alarm',
  'first-aid-kit',
  'fire-extinguisher',
  'beachfront',
  'waterfront',
  'ocean-view',
  'walk-beach',
  'downtown',
  'gated-community',
  'quiet-area',
  'furnished',
  'elevator',
  'balcony',
  'pet-friendly',
  'long-term-stay-friendly',
  'monthly-stay-available',
  'playastays-managed',
  'family-friendly',
] as const

// ============================================================
// Admin — Launch readiness / operational queue
//
// Builds on property-completeness scoring with explicit flags
// for day-to-day operations (what to fix next).
// ============================================================

import type { Property } from '@/types'
import type { CompletenessReport } from '@/lib/property-completeness'
import { parseStructuredAmenityKeys } from '@/lib/amenity-taxonomy'
import { parseAvailabilityJson } from '@/lib/availability'
import { inferListingRole } from '@/lib/property-browse'
import { isValidRentalStrategy } from '@/lib/rental-strategy'

/** Merge live form state over server property for accurate readiness while editing */
export function mergePropertyWithFormDraft(
  base: Property,
  form: {
    city: string
    neighborhood: string
    buildingName: string
    nightlyRate: number
    monthlyRate: number
    salePrice: number
    listingType: string
    rentalStrategy: string
    listingStatus: string
    availabilityJson: string
    nextAvailableDate: string
    airbnbUrl: string
    vrboUrl: string
    bookingUrl: string
    directUrl: string
    ownerId: number
    managerId: number
    amenityKeys: string[]
  },
  images: Array<{ url: string; isFeatured?: boolean; alt?: string; wpId?: number }>,
): Property {
  const featured = images.find(i => i.isFeatured) || images[0]
  const galleryMapped = images.map((g, i) => ({
    id: g.wpId ?? i + 1,
    url: g.url,
    alt: g.alt ?? '',
  }))
  return {
    ...base,
    meta: {
      ...base.meta,
      ps_city: form.city || base.meta.ps_city,
      ps_neighborhood: form.neighborhood || base.meta.ps_neighborhood,
      ps_building_name: form.buildingName || base.meta.ps_building_name,
      ps_nightly_rate: form.nightlyRate,
      ps_monthly_rate: form.monthlyRate,
      ps_sale_price: form.salePrice,
      ps_listing_type: form.listingType as Property['meta']['ps_listing_type'],
      ps_rental_strategy: form.rentalStrategy || undefined,
      ps_listing_status: form.listingStatus,
      ps_availability_json: form.availabilityJson,
      ps_next_available_date: form.nextAvailableDate,
      ps_airbnb_url: form.airbnbUrl,
      ps_vrbo_url: form.vrboUrl,
      ps_booking_url: form.bookingUrl,
      ps_direct_url: form.directUrl,
      ps_owner_id: form.ownerId || undefined,
      ps_manager_id: form.managerId || undefined,
      ps_amenity_keys: form.amenityKeys.length ? JSON.stringify(form.amenityKeys) : base.meta.ps_amenity_keys,
    },
    ps_computed: {
      ...base.ps_computed,
      featured_image: featured
        ? { url: featured.url, alt: featured.alt ?? '', id: featured.wpId ?? 0 }
        : base.ps_computed.featured_image,
      gallery: galleryMapped.length ? galleryMapped : base.ps_computed.gallery,
      amenities: base.ps_computed.amenities,
      booking_links: {
        airbnb: form.airbnbUrl || base.ps_computed.booking_links?.airbnb,
        vrbo: form.vrboUrl || base.ps_computed.booking_links?.vrbo,
        booking: form.bookingUrl || base.ps_computed.booking_links?.booking,
        direct: form.directUrl || base.ps_computed.booking_links?.direct,
      },
    },
  } as Property
}

export interface LaunchReadinessFlags {
  missingPhotos: boolean
  missingPricing: boolean
  missingAmenities: boolean
  missingAvailability: boolean
  missingLocation: boolean
  missingBookingLinks: boolean
  missingOwnerAssignment: boolean
  missingManagerAssignment: boolean
  /** No neighborhood when city is set */
  missingNeighborhood: boolean
  /** Neighborhood set but no building/development (structured portfolio hygiene) */
  missingBuilding: boolean
  /** Either neighborhood or building gap when city is set */
  missingNeighborhoodOrBuilding: boolean
}

export interface LaunchReadiness {
  flags: LaunchReadinessFlags
  /** True when safe to treat as launch-ready (active publish + solid data) */
  readyToPublish: boolean
  /** Short labels for chips / dashboard (max ~8 items) */
  blockers: string[]
  /** One of: launch_ready | needs_work | blocked */
  queue: 'launch_ready' | 'needs_work' | 'blocked'
}

/** Deduped photo count (featured + gallery) — use for admin lists and readiness */
export function countPropertyPhotos(p: Property): number {
  const urls = new Set<string>()
  if (p.ps_computed.featured_image?.url) urls.add(p.ps_computed.featured_image.url)
  for (const im of p.ps_computed.gallery) {
    if (im.url) urls.add(im.url)
  }
  return urls.size
}

export function getLaunchReadiness(property: Property, report: CompletenessReport): LaunchReadiness {
  const m = property.meta
  const role = inferListingRole(property)

  const missingPhotos = countPropertyPhotos(property) < 2

  let missingPricing = false
  if (role === 'sale') {
    missingPricing = !(Number(m.ps_sale_price) > 0)
  } else if (role === 'rent') {
    missingPricing = !(m.ps_nightly_rate > 0)
  } else {
    missingPricing = !(m.ps_nightly_rate > 0) && !(Number(m.ps_sale_price) > 0)
  }

  const keys = parseStructuredAmenityKeys(m.ps_amenity_keys)
  const missingAmenities = keys.length === 0 && property.ps_computed.amenities.length === 0

  const avail = parseAvailabilityJson(m.ps_availability_json)
  const hasBlocks = (avail?.blocks?.length ?? 0) > 0
  const missingAvailability = !hasBlocks && !m.ps_next_available_date

  const missingLocation = !m.ps_city?.trim()

  const hasBooking =
    !!(m.ps_airbnb_url || m.ps_vrbo_url || m.ps_booking_url || m.ps_direct_url)
  const missingBookingLinks = !hasBooking

  const missingOwnerAssignment = !(m.ps_owner_id && m.ps_owner_id > 0)
  const missingManagerAssignment = !(m.ps_manager_id && m.ps_manager_id > 0)

  const cityOk = !!m.ps_city?.trim()
  const nh = m.ps_neighborhood?.trim()
  const bd = m.ps_building_name?.trim()
  const missingNeighborhood = cityOk && !nh
  const missingBuilding = cityOk && !!nh && !bd
  const missingNeighborhoodOrBuilding = missingNeighborhood || missingBuilding

  const flags: LaunchReadinessFlags = {
    missingPhotos,
    missingPricing,
    missingAmenities,
    missingAvailability,
    missingLocation,
    missingBookingLinks,
    missingOwnerAssignment,
    missingManagerAssignment,
    missingNeighborhood,
    missingBuilding,
    missingNeighborhoodOrBuilding,
  }

  const blockers: string[] = []
  if (missingPhotos) blockers.push('Photos')
  if (missingPricing) blockers.push('Pricing')
  if (missingAmenities) blockers.push('Amenities')
  if (missingAvailability) blockers.push('Availability')
  if (missingLocation) blockers.push('Location')
  if (missingBookingLinks) blockers.push('Booking links')
  if (missingOwnerAssignment) blockers.push('Owner')
  if (missingManagerAssignment) blockers.push('Manager')
  if (missingNeighborhood) blockers.push('Neighborhood')
  if (missingBuilding) blockers.push('Building')

  const status = m.ps_listing_status || 'active'
  const critical =
    missingPhotos ||
    missingPricing ||
    missingLocation ||
    report.requiredMissing > 0

  let queue: LaunchReadiness['queue']
  if (status === 'draft' || critical) queue = 'blocked'
  else if (blockers.length > 0 || report.tier === 'needs-work' || report.tier === 'incomplete') {
    queue = 'needs_work'
  } else if (report.tier === 'complete' || report.tier === 'good') {
    queue = 'launch_ready'
  } else {
    queue = 'needs_work'
  }

  const readyToPublish =
    status === 'active' &&
    !critical &&
    report.tier !== 'incomplete' &&
    report.score >= 70 &&
    !missingPhotos &&
    !missingPricing

  return {
    flags,
    readyToPublish,
    blockers: blockers.slice(0, 10),
    queue,
  }
}

/** Aggregate counts for /admin dashboard */
export function summarizeReadinessForPortfolio(properties: Property[], reports: Map<number, CompletenessReport>) {
  let launchReady = 0
  let needsWork = 0
  let blocked = 0
  let missingPhotos = 0
  let missingPricing = 0
  let missingAmenities = 0
  let missingAvailability = 0
  let missingLocation = 0
  let missingBooking = 0
  let missingAssignment = 0
  let missingAreaDetail = 0
  const byCity: Record<string, number> = {}
  const byStrategy: Record<string, number> = {}
  const byType: Record<string, number> = {}

  for (const p of properties) {
    const r = reports.get(p.id)
    if (!r) continue
    const lr = getLaunchReadiness(p, r)
    if (lr.queue === 'launch_ready') launchReady++
    else if (lr.queue === 'needs_work') needsWork++
    else blocked++

    if (lr.flags.missingPhotos) missingPhotos++
    if (lr.flags.missingPricing) missingPricing++
    if (lr.flags.missingAmenities) missingAmenities++
    if (lr.flags.missingAvailability) missingAvailability++
    if (lr.flags.missingLocation) missingLocation++
    if (lr.flags.missingBookingLinks) missingBooking++
    if (lr.flags.missingOwnerAssignment || lr.flags.missingManagerAssignment) missingAssignment++
    if (lr.flags.missingNeighborhoodOrBuilding) missingAreaDetail++

    const city = p.meta.ps_city || 'Unknown'
    byCity[city] = (byCity[city] || 0) + 1

    const st = isValidRentalStrategy(p.meta.ps_rental_strategy)
      ? p.meta.ps_rental_strategy
      : 'unset'
    byStrategy[st] = (byStrategy[st] || 0) + 1

    const pt = p.meta.ps_property_type || 'unset'
    byType[pt] = (byType[pt] || 0) + 1
  }

  return {
    launchReady,
    needsWork,
    blocked,
    missingPhotos,
    missingPricing,
    missingAmenities,
    missingAvailability,
    missingLocation,
    missingBooking,
    missingAssignment,
    missingAreaDetail,
    byCity,
    byStrategy,
    byType,
  }
}

// ============================================================
// /api/admin/property — Create / Update properties via WP REST
//
// POST = create new property
// PUT  = update existing property
//
// Sends title, content, status, and meta fields to WordPress.
// Requires WP_APP_PASSWORD in env for authentication.
//
// Future: operational mirror in Airtable (properties base) — hook near successful POST/PUT
// response, coordinated with `lib/integrations/lead-handoff.ts` patterns.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server'
import { getWordPressApiBaseUrl } from '@/lib/wp-api-base'

const WP_API = getWordPressApiBaseUrl()
const WP_AUTH = process.env.WP_APP_PASSWORD

function authHeaders(): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' }
  if (WP_AUTH) {
    h['Authorization'] = `Basic ${Buffer.from(WP_AUTH).toString('base64')}`
  }
  return h
}

interface PropertyFormPayload {
  id?: number
  form: {
    title: string
    slug: string
    city: string
    neighborhood: string
    propertyType: string
    listingType: string
    /** vacation_rental | long_term | hybrid — separate from listingType */
    rentalStrategy: string
    listingStatus: string
    managed: boolean
    featured: boolean
    bedrooms: number
    bathrooms: number
    guests: number
    beds: number
    sqm: number
    floor: number
    nightlyRate: number
    monthlyRate: number
    salePrice: number
    cleaningFee: number
    currency: string
    minStayNights: number
    description: string
    excerpt: string
    titleEs: string
    contentEs: string
    bookingMode: string
    airbnbUrl: string
    vrboUrl: string
    bookingUrl: string
    directUrl: string
    nextAvailableDate: string
    availabilityJson: string
    checkInTime: string
    checkOutTime: string
    houseRules: string
    houseRulesEs: string
    ownerId: number
    managerId: number
    buildingName: string
    opsStatus: string
    internalNotes: string
    seoTitle: string
    seoDesc: string
    lat: number
    lng: number
    mapDisplayMode: string
  }
  amenityKeys: string[]
  /** Serialized JSON activity log (optional; preserves entries on save) */
  opsActivityLog?: string
  /** Serialized JSON ops issues list */
  opsIssues?: string
  /** WP attachment ID for the post thumbnail */
  featuredMediaId?: number
  /** Ordered array of WP attachment IDs for the gallery */
  galleryIds?: number[]
}

function buildWpBody(data: PropertyFormPayload) {
  const f = data.form
  const statusMap: Record<string, string> = {
    active: 'publish',
    draft: 'draft',
    inactive: 'draft',
    archived: 'draft',
  }

  const body: Record<string, unknown> = {
    title: f.title,
    content: f.description,
    excerpt: f.excerpt,
    slug: f.slug || undefined,
    status: statusMap[f.listingStatus] || 'draft',
    meta: {
      ps_city: f.city,
      ps_neighborhood: f.neighborhood,
      ps_property_type: f.propertyType,
      ps_listing_type: f.listingType,
      ps_rental_strategy: f.rentalStrategy || null,
      ps_listing_status: f.listingStatus,
      ps_managed_by_ps: f.managed,
      ps_featured: f.featured,
      ps_bedrooms: f.bedrooms,
      ps_bathrooms: f.bathrooms,
      ps_guests: f.guests,
      ps_beds: f.beds,
      ps_sqm: f.sqm,
      ps_floor: f.floor,
      ps_nightly_rate: f.nightlyRate,
      ps_monthly_rate: f.monthlyRate,
      ps_sale_price: f.salePrice,
      ps_cleaning_fee: f.cleaningFee,
      ps_currency: f.currency,
      ps_min_stay_nights: f.minStayNights,
      ps_title_es: f.titleEs,
      ps_content_es: f.contentEs,
      ps_amenity_keys: JSON.stringify(data.amenityKeys),
      ps_booking_mode: f.bookingMode,
      ps_airbnb_url: f.airbnbUrl,
      ps_vrbo_url: f.vrboUrl,
      ps_booking_url: f.bookingUrl,
      ps_direct_url: f.directUrl,
      ps_next_available_date: f.nextAvailableDate,
      ps_availability_json: f.availabilityJson || null,
      ps_check_in_time: f.checkInTime,
      ps_check_out_time: f.checkOutTime,
      ps_house_rules: f.houseRules,
      ps_house_rules_es: f.houseRulesEs,
      ps_owner_id: f.ownerId || null,
      ps_manager_id: f.managerId || null,
      ps_building_name: f.buildingName,
      ps_ops_status: f.opsStatus,
      ps_internal_notes: f.internalNotes,
      ps_ops_activity_log: data.opsActivityLog != null ? data.opsActivityLog : undefined,
      ps_ops_issues: data.opsIssues != null ? data.opsIssues : undefined,
      ps_seo_title: f.seoTitle,
      ps_seo_desc: f.seoDesc,
      ps_lat: f.lat || null,
      ps_lng: f.lng || null,
      ps_map_display_mode: f.mapDisplayMode,
      ps_gallery: data.galleryIds ? JSON.stringify(data.galleryIds) : undefined,
    },
  }

  if (data.featuredMediaId) {
    body.featured_media = data.featuredMediaId
  }

  return body
}

export async function POST(request: NextRequest) {
  if (!WP_API || !WP_AUTH) {
    return NextResponse.json(
      { error: 'WordPress API credentials not configured. Set WP_API_URL and WP_APP_PASSWORD in .env.local.' },
      { status: 503 }
    )
  }

  try {
    const data = (await request.json()) as PropertyFormPayload
    const body = buildWpBody(data)

    const res = await fetch(`${WP_API}/properties`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('WP create failed:', res.status, text)
      return NextResponse.json({ error: `WordPress error: ${res.status}`, detail: text }, { status: res.status })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, id: created.id, slug: created.slug })
  } catch (err) {
    console.error('Property create error:', err)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!WP_API || !WP_AUTH) {
    return NextResponse.json(
      { error: 'WordPress API credentials not configured. Set WP_API_URL and WP_APP_PASSWORD in .env.local.' },
      { status: 503 }
    )
  }

  try {
    const data = (await request.json()) as PropertyFormPayload
    if (!data.id) {
      return NextResponse.json({ error: 'Property ID required for update' }, { status: 400 })
    }

    const body = buildWpBody(data)

    const res = await fetch(`${WP_API}/properties/${data.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('WP update failed:', res.status, text)
      return NextResponse.json({ error: `WordPress error: ${res.status}`, detail: text }, { status: res.status })
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, id: updated.id, slug: updated.slug })
  } catch (err) {
    console.error('Property update error:', err)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

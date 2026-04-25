/**
 * Development-only fake rental for Maps Embed / listing UI testing.
 * Not used unless `PLAYASTAYS_DEV_FAKE_RENTAL=1` — never enable in production.
 *
 * Canonical URL (EN): `/rentals/playa-del-carmen/gonzalo-guerrero/map-embed-test-unit/`
 * ES: `/es/rentas/playa-del-carmen/gonzalo-guerrero/map-embed-test-unit/`
 */
import type { Property } from '@/types'
import { propertyPathSegments } from '@/lib/property-url'

export const DEV_FAKE_RENTAL_SLUG = 'map-embed-test-unit'

function devFakeRentalEnabled(): boolean {
  return process.env.PLAYASTAYS_DEV_FAKE_RENTAL === '1'
}

function buildDevFakeRentalProperty(): Property {
  const meta = {
    ps_city: 'Playa del Carmen',
    ps_neighborhood: 'Gonzalo Guerrero',
    ps_state: 'Quintana Roo',
    ps_country: 'Mexico',
    ps_location_type: 'public_building' as const,
    /** Well-known area query — works with Maps Embed `place` mode without a place_id. */
    ps_map_query: 'Parque Los Fundadores, Playa del Carmen, Quintana Roo, Mexico',
    ps_building_name: 'Map Embed Test Residences',
    ps_property_type: 'condo',
    ps_bedrooms: 2,
    ps_bathrooms: 2,
    ps_guests: 4,
    ps_listing_type: 'rent' as const,
    ps_rental_strategy: 'vacation_rental' as const,
    ps_listing_status: 'active',
    ps_managed_by_ps: true,
    ps_nightly_rate: 250,
    ps_monthly_rate: 0,
    ps_sale_price: 0,
    ps_currency: 'USD',
    ps_avg_rating: 4.8,
    ps_review_count: 12,
    ps_monthly_income: 0,
    ps_avg_occupancy: 72,
    ps_booking_mode: 'external',
    ps_amenity_keys: JSON.stringify(['wifi', 'pool', 'air-conditioning']),
  }

  return {
    id: 9_000_001,
    slug: DEV_FAKE_RENTAL_SLUG,
    modified: new Date().toISOString(),
    title: { rendered: 'Dev — Map embed test unit' },
    excerpt: {
      rendered: '<p>Fake listing for local Maps Embed QA. Not in WordPress.</p>',
    },
    content: {
      rendered:
        '<p>This is a <strong>development-only</strong> rental used to test the listing map embed. ' +
        'Enable <code>PLAYASTAYS_DEV_FAKE_RENTAL=1</code> and open the canonical URL below.</p>',
    },
    meta,
    ps_computed: {
      gallery: [],
      amenities: ['WiFi', 'Air conditioning', 'Pool'],
      booking_links: {},
    },
  }
}

/** Returns a full `Property` when dev fake mode is on and slug matches. */
export function getDevFakeRentalPropertyIfEnabled(slug: string): Property | null {
  if (!devFakeRentalEnabled() || slug !== DEV_FAKE_RENTAL_SLUG) return null
  return buildDevFakeRentalProperty()
}

/** For `generateStaticParams` — includes the fake route when dev fake is enabled. */
export function devFakeRentalStaticParam(): { params: string[] } | null {
  if (!devFakeRentalEnabled()) return null
  return { params: propertyPathSegments(buildDevFakeRentalProperty()) }
}

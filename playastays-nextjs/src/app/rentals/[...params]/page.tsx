// ============================================================
// /rentals/[...params]/page.tsx
//
// Location-aware property detail route (EN).
//
// Handles three URL shapes:
//   /rentals/{city}/{neighborhood}/{slug}/    — canonical 3-seg
//   /rentals/{city}/{slug}/                   — 2-seg (no hood)
//   /rentals/{slug}/                          — legacy 1-seg → redirect
//
// Lookup is always by property slug (last segment).
// City/neighborhood segments are validated against property data.
// Mismatched segments → 301 redirect to canonical URL.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getProperty, getPropertiesForBrowse, getSiteConfig } from '@/lib/wordpress'
import { propertyMetadata, propertySchema } from '@/lib/seo'
import { propertyPathSegments } from '@/lib/property-url'
import { resolveListingMapEmbed } from '@/lib/listing-map-embed'
import { PropertyDetailTemplate } from '@/components/templates/PropertyDetailTemplate'
import { RelatedListings } from '@/components/content/RelatedListings'

export const revalidate = 1800

interface RouteParams {
  params: { params: string[] }
}

export async function generateStaticParams() {
  const properties = await getPropertiesForBrowse({ perPage: 100 })
  const base = properties.map(p => ({ params: propertyPathSegments(p) }))
  const { devFakeRentalStaticParam } = await import('@/lib/dev-fake-rental-property')
  const fake = devFakeRentalStaticParam()
  return fake ? [...base, fake] : base
}

function extractSlug(segments: string[]): string | null {
  if (segments.length >= 1 && segments.length <= 3) {
    return segments[segments.length - 1]
  }
  return null
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const slug = extractSlug(params.params)
  if (!slug) return {}
  const property = await getProperty(slug)
  if (!property) return {}
  return propertyMetadata(property)
}

export default async function PropertyPage({ params }: RouteParams) {
  const segments = params.params
  if (segments.length < 1 || segments.length > 3) notFound()

  const slug = segments[segments.length - 1]
  const { isEnabled: preview } = draftMode()
  const property = await getProperty(slug, preview)
  if (!property) notFound()

  // Compute canonical path and redirect if current URL doesn't match
  const canonicalSegments = propertyPathSegments(property)
  const currentPath = `/rentals/${segments.join('/')}/`
  const canonicalPath = `/rentals/${canonicalSegments.join('/')}/`

  if (currentPath !== canonicalPath) {
    redirect(canonicalPath)
  }

  const shouldNoindex = property.meta.ps_review_count < 3
  const schema = propertySchema(property)
  const site = await getSiteConfig()
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
  const listingMap = resolveListingMapEmbed(property, 'en', embedKey)

  const pool = await getPropertiesForBrowse({
    citySlug: property.meta.ps_city,
    perPage: 24,
    preview,
  })
  const relatedProperties = pool
    .filter(
      p =>
        p.slug !== slug &&
        p.meta.ps_listing_status !== 'inactive' &&
        p.meta.ps_listing_status !== 'archived'
    )
    .slice(0, 3)

  return (
    <>
      {shouldNoindex && (
        <meta name="robots" content="noindex, follow" />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PropertyDetailTemplate
        property={property}
        whatsappDigits={site.whatsapp}
        listingMap={listingMap}
      />
      <RelatedListings properties={relatedProperties} locale="en" />
    </>
  )
}

// ============================================================
// /es/rentas/[slug]/page.tsx
//
// Spanish property detail pages.
// Slug is identical to EN — globally unique per architecture.
// locale="es" makes templates render ps_title_es / ps_content_es.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getProperty, getProperties } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { PropertyDetailTemplate } from '@/components/templates/PropertyDetailTemplate'

export const revalidate = 1800

export async function generateStaticParams() {
  const properties = await getProperties({ featured: true, perPage: 100 })
  return properties.map(p => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const property = await getProperty(params.slug)
  if (!property) return {}

  const canonical = `https://www.playastays.com/es/rentas/${params.slug}/`
  const enHref    = `https://www.playastays.com/rentals/${params.slug}/`

  // Noindex if no Spanish translation fields
  const hasTitleEs = Boolean(property.meta.ps_title_es)
  if (!hasTitleEs) {
    return buildMetadata({
      title:       `${property.title.rendered} | PlayaStays`,
      description: property.excerpt.rendered.replace(/<[^>]*>/g, ''),
      canonical,
      noindex: true,
    })
  }

  return buildMetadata({
    title:       property.meta.ps_seo_title || `${property.meta.ps_title_es} | PlayaStays`,
    description: property.meta.ps_seo_desc  || property.meta.ps_excerpt_es || property.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical,
    hreflangEn:  enHref,
  })
}

export default async function EsPropertyPage(
  { params }: { params: { slug: string } }
) {
  const { isEnabled: preview } = draftMode()
  const property = await getProperty(params.slug, preview)
  if (!property) notFound()

  const shouldNoindex = property.meta.ps_review_count < 3

  return (
    <>
      {shouldNoindex && <meta name="robots" content="noindex, follow" />}
      <PropertyDetailTemplate property={property} locale="es" />
    </>
  )
}

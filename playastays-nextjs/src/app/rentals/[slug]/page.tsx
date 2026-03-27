import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getProperty, getProperties } from '@/lib/wordpress'
import { propertyMetadata, propertySchema } from '@/lib/seo'
import { PropertyDetailTemplate } from '@/components/templates/PropertyDetailTemplate'

export const revalidate = 1800

export async function generateStaticParams() {
  // Pre-generate active managed properties at build time
  const properties = await getProperties({ featured: true, perPage: 100 })
  return properties.map(p => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const property = await getProperty(params.slug)
  if (!property) return {}
  return propertyMetadata(property)
}

export default async function PropertyPage(
  { params }: { params: { slug: string } }
) {
  const { isEnabled: preview } = draftMode()
  const property = await getProperty(params.slug, preview)

  if (!property) notFound()

  // noindex for properties with no reviews yet
  const shouldNoindex = property.meta.ps_review_count < 3

  const schema = propertySchema(property)

  return (
    <>
      {shouldNoindex && (
        // Next.js metadata API handles robots — this is belt-and-suspenders
        <meta name="robots" content="noindex, follow" />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PropertyDetailTemplate property={property} />
    </>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPropertiesForBrowse } from '@/lib/wordpress'
import { getPropertyCompleteness } from '@/lib/property-completeness'
import { PropertyEditorForm } from '@/components/admin/PropertyEditorForm'
import { propertyHref } from '@/lib/property-url'

export const revalidate = 300

export default async function AdminPropertyEditPage(
  { params }: { params: { id: string } }
) {
  const propertyId = parseInt(params.id, 10)
  if (Number.isNaN(propertyId)) notFound()

  const allProperties = await getPropertiesForBrowse({ perPage: 100 })
  const property = allProperties.find(p => p.id === propertyId)
  if (!property) notFound()

  const completeness = getPropertyCompleteness(property)

  return (
    <>
      <div className="adm-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <Link href="/admin/properties" className="adm-btn adm-btn--ghost adm-btn--sm">← Properties</Link>
          <h1 className="adm-topbar__title">{property.title.rendered.replace(/<[^>]*>/g, '')}</h1>
        </div>
        <div className="adm-topbar__actions">
          <Link href={propertyHref(property)} className="adm-btn adm-btn--secondary adm-btn--sm" target="_blank" rel="noopener">
            View on site ↗
          </Link>
        </div>
      </div>
      <div className="adm-page">
        <PropertyEditorForm property={property} completeness={completeness} />
      </div>
    </>
  )
}

import Link from 'next/link'
import { getPropertiesForBrowse } from '@/lib/wordpress'
import { getPropertyCompleteness } from '@/lib/property-completeness'
import { inferListingRole } from '@/lib/property-browse'
import { getLaunchReadiness, countPropertyPhotos } from '@/lib/admin-readiness'
import { PropertyListTable, type PropertyRow } from '@/components/admin/PropertyListTable'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'

export const revalidate = 300

function rentalStrategyLabel(raw: string | undefined): string {
  if (raw === 'vacation_rental') return 'Vacation'
  if (raw === 'long_term') return 'Long-term'
  if (raw === 'hybrid') return 'Hybrid'
  return '—'
}

export default async function AdminPropertiesPage() {
  const properties = await getPropertiesForBrowse({ perPage: 100 })

  const rows: PropertyRow[] = properties.map(p => {
    const completeness = getPropertyCompleteness(p)
    const launch = getLaunchReadiness(p, completeness)
    return {
      id: p.id,
      slug: p.slug,
      title: p.title.rendered.replace(/<[^>]*>/g, ''),
      city: p.meta.ps_city || '',
      neighborhood: p.meta.ps_neighborhood || '',
      buildingName: p.meta.ps_building_name || '',
      rentalStrategyLabel: rentalStrategyLabel(p.meta.ps_rental_strategy),
      propertyType: p.meta.ps_property_type || '',
      listingType: inferListingRole(p),
      status: p.meta.ps_listing_status || 'active',
      managed: p.meta.ps_managed_by_ps,
      featured: p.meta.ps_featured || false,
      nightlyRate: p.meta.ps_nightly_rate,
      monthlyRate: Number(p.meta.ps_monthly_rate) || 0,
      salePrice: Number(p.meta.ps_sale_price) || 0,
      rating: p.meta.ps_avg_rating,
      reviews: p.meta.ps_review_count,
      photoCount: countPropertyPhotos(p),
      completeness,
      launch,
      imageUrl: p.ps_computed.featured_image?.url,
    }
  })

  return (
    <>
      <AdminModuleHeader
        title="Properties"
        status="live"
        subtitle="Listing records, media, pricing, and readiness — this is the operational core for inventory today."
        actions={(
          <Link href="/admin/properties/new" className="adm-btn adm-btn--primary">+ New Property</Link>
        )}
      />
      <div className="adm-page">
        <PropertyListTable rows={rows} />
      </div>
    </>
  )
}

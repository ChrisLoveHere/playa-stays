import Link from 'next/link'
import { getPropertyCompleteness } from '@/lib/property-completeness'
import { PropertyEditorForm } from '@/components/admin/PropertyEditorForm'

const EMPTY_COMPLETENESS = getPropertyCompleteness({
  title: { rendered: '' },
  content: { rendered: '' },
  excerpt: { rendered: '' },
  meta: {
    ps_city: '',
    ps_bedrooms: 0,
    ps_bathrooms: 0,
    ps_guests: 0,
    ps_nightly_rate: 0,
    ps_avg_rating: 0,
    ps_review_count: 0,
    ps_managed_by_ps: false,
  },
  ps_computed: {
    gallery: [],
    amenities: [],
    booking_links: {},
  },
})

export default function AdminNewPropertyPage() {
  return (
    <>
      <div className="adm-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <Link href="/admin/properties" className="adm-btn adm-btn--ghost adm-btn--sm">← Properties</Link>
          <h1 className="adm-topbar__title">New Property</h1>
        </div>
      </div>
      <div className="adm-page">
        <PropertyEditorForm property={null} completeness={EMPTY_COMPLETENESS} isNew />
      </div>
    </>
  )
}

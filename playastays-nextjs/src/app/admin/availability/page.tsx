import Link from 'next/link'
import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'

export const metadata: Metadata = { title: 'Availability' }

export default function AdminAvailabilityPage() {
  return (
    <>
      <AdminModuleHeader
        title="Availability"
        status="partial"
        subtitle="Portfolio-wide calendar and sync are not built yet. Per-listing availability and next-available fields in the property editor are live."
        hint="Public rentals and booking links are unaffected — this admin view is internal only."
      />
      <div className="adm-page">
        <div className="adm-card">
          <div className="adm-card__header">
            <div className="adm-card__title">Multi-property calendar</div>
            <span className="adm-pill adm-pill--yellow">Roadmap</span>
          </div>
          <div className="adm-card__body adm-framework-intro">
            <p>
              When shipped, this area will show blocked dates, booking sync, and cross-property views. Until then, set availability JSON and next-available dates in each{' '}
              <Link href="/admin/properties" className="adm-link-inline">property editor</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

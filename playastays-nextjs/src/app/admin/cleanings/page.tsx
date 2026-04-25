import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { FrameworkModuleBody } from '@/components/admin/FrameworkModuleBody'

export const metadata: Metadata = { title: 'Cleanings' }

export default function AdminCleaningsPage() {
  return (
    <>
      <AdminModuleHeader
        title="Cleanings"
        status="framework"
        subtitle="Scheduling and status for turnovers and deep cleans — eventually tied to bookings and vendor assignments."
        hint="Availability blocks in the property editor remain the source of truth for dates until this module ships."
      />
      <FrameworkModuleBody
        intro="Plan for a calendar of clean events per property, handoff from guest departure, and vendor dispatch. Not connected to live booking data in this release."
        roadmap={[
          { title: 'Job list', body: 'Upcoming and in-progress cleans by date.' },
          { title: 'Checklists', body: 'Property-specific cleaning standards.' },
          { title: 'Vendor link', body: 'Assign from the vendor directory (future).' },
        ]}
        relatedLink={{ href: '/admin/properties', label: 'Properties (availability in editor)' }}
      />
    </>
  )
}

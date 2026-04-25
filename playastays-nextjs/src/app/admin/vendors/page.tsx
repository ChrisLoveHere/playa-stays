import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { FrameworkModuleBody } from '@/components/admin/FrameworkModuleBody'

export const metadata: Metadata = { title: 'Vendors' }

export default function AdminVendorsPage() {
  return (
    <>
      <AdminModuleHeader
        title="Vendors"
        status="framework"
        subtitle="Preferred cleaners, handymen, photographers, and other partners — scoped by city and service category."
      />
      <FrameworkModuleBody
        intro="Vendor records will link to maintenance issues and cleaning jobs when those workflows go live. No vendor data is stored in this pass."
        roadmap={[
          { title: 'Directory', body: 'Contact, coverage area, rates, insurance on file.' },
          { title: 'Dispatch', body: 'Attach vendors to jobs from Issues or Cleanings.' },
          { title: 'Performance', body: 'Simple scorecards over time (future).' },
        ]}
        relatedLink={{ href: '/admin/issues', label: 'Issues queue (partial)' }}
      />
    </>
  )
}

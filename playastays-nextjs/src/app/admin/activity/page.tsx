import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { FrameworkModuleBody } from '@/components/admin/FrameworkModuleBody'

export const metadata: Metadata = { title: 'Activity & logs' }

export default function AdminActivityPage() {
  return (
    <>
      <AdminModuleHeader
        title="Activity & logs"
        status="framework"
        subtitle="Cross-property timeline of operational events — distinct from the per-property activity log already in the property editor."
        hint="Append-only notes on each property are live today in the editor. This page will aggregate them when we add server-side event indexing."
      />
      <FrameworkModuleBody
        intro="Today, activity is stored per listing in WordPress. A global feed will require indexed events or synced webhooks — intentionally deferred."
        roadmap={[
          { title: 'Global feed', body: 'Filter by property, user, category, date.' },
          { title: 'Exports', body: 'CSV for audits and handoffs.' },
          { title: 'Alerts', body: 'Subscribe to property or city (future).' },
        ]}
        relatedLink={{ href: '/admin/properties', label: 'Open a property for its log' }}
      />
    </>
  )
}

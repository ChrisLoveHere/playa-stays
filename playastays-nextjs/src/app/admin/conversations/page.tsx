import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { FrameworkModuleBody } from '@/components/admin/FrameworkModuleBody'

export const metadata: Metadata = { title: 'Conversations' }

export default function AdminConversationsPage() {
  return (
    <>
      <AdminModuleHeader
        title="Conversations / Inbox"
        status="framework"
        subtitle="Future unified thread for owner leads, guest inquiries, and internal notes — without replacing the live booking and lead forms on the public site."
        hint="Public lead and inquiry flows stay on the marketing site and listing pages. Nothing here touches customer-facing booking yet."
      />
      <FrameworkModuleBody
        intro="When built, this module will centralize threaded communication tied to properties and contacts. For now, continue using your existing channels and property-level notes."
        roadmap={[
          { title: 'Inbound routing', body: 'Assign conversations by property, city, or intent.' },
          { title: 'SLA & queues', body: 'First-response targets and escalation.' },
          { title: 'CRM handoff', body: 'Optional sync to external CRM when you adopt one.' },
        ]}
        relatedLink={{ href: '/contact/', label: 'Public contact (live site)' }}
      />
    </>
  )
}

import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { FrameworkModuleBody } from '@/components/admin/FrameworkModuleBody'

export const metadata: Metadata = { title: 'Tasks & workflows' }

export default function AdminTasksPage() {
  return (
    <>
      <AdminModuleHeader
        title="Tasks & workflows"
        status="framework"
        subtitle="Operational checklists and repeatable playbooks — onboarding, turnovers, owner updates — layered on top of property records."
        hint="Does not replace the launch-readiness queue on the dashboard; it will complement it with assignable tasks."
      />
      <FrameworkModuleBody
        intro="Designed for repeatable ops: “new owner lead,” “listing needs photos,” “cleaning block,” etc. Implementation will connect to properties and optional owners when those models mature."
        roadmap={[
          { title: 'Templates', body: 'Save sequences per property type or city.' },
          { title: 'Assignments', body: 'Owner vs internal vs vendor tasks.' },
          { title: 'Due dates', body: 'Calendar and reminders (future).' },
        ]}
        relatedLink={{ href: '/admin', label: 'Dashboard workflow signals' }}
      />
    </>
  )
}

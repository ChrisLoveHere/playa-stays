import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { FrameworkModuleBody } from '@/components/admin/FrameworkModuleBody'

export const metadata: Metadata = { title: 'Settings' }

export default function AdminSettingsPage() {
  return (
    <>
      <AdminModuleHeader
        title="Settings"
        status="framework"
        subtitle="Site configuration, integrations, defaults, and team access — framework only in this pass."
        hint="Does not change live site behavior until each setting is implemented and validated."
      />
      <FrameworkModuleBody
        intro="Central place for API credentials, notification defaults, pricing templates, and environment-specific toggles. Nothing here is wired to production controls yet."
        roadmap={[
          { title: 'Team & roles', body: 'Who can access which modules.' },
          { title: 'Integrations', body: 'PMS, channel manager, webhooks.' },
          { title: 'Defaults', body: 'City-level pricing and fee templates.' },
        ]}
      />
    </>
  )
}

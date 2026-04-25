import type { Metadata } from 'next'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { FrameworkModuleBody } from '@/components/admin/FrameworkModuleBody'

export const metadata: Metadata = { title: 'Payments & statements' }

export default function AdminPaymentsPage() {
  return (
    <>
      <AdminModuleHeader
        title="Payments & statements"
        status="framework"
        subtitle="Owner statements, invoices, and payout visibility — accounting-grade workflows, not implemented in this pass."
        hint="No payment processing or financial data is stored here yet. Do not use this area for compliance or tax reporting."
      />
      <FrameworkModuleBody
        intro="Long-term home for revenue share reconciliation, owner remittances, and exportable reporting. Requires a deliberate data model and integrations."
        roadmap={[
          { title: 'Statements', body: 'Monthly PDF / CSV per owner and property.' },
          { title: 'Line items', body: 'Tie to bookings and fees when connected.' },
          { title: 'Audit trail', body: 'Who viewed and exported what (future).' },
        ]}
      />
    </>
  )
}

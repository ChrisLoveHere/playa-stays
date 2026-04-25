import type { Metadata } from 'next'
import '@/styles/admin.css'
import { AdminNav } from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | PlayaStays Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-shell">
      <AdminNav />
      <div className="adm-main">{children}</div>
    </div>
  )
}

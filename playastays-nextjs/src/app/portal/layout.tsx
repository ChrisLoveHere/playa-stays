import type { Metadata } from 'next'
import '@/styles/admin.css'
import { PortalNav } from '@/components/portal/PortalNav'

export const metadata: Metadata = {
  title: { default: 'Owner Portal', template: '%s | PlayaStays Portal' },
  robots: { index: false, follow: false },
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-shell">
      <PortalNav />
      <div className="adm-main">{children}</div>
    </div>
  )
}

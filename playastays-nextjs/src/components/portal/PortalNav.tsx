'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/portal', label: 'Overview', icon: '🏠', match: /^\/portal\/?$/ },
  { href: '/portal/properties', label: 'My Properties', icon: '🔑', match: /^\/portal\/properties/ },
  { href: '/portal/revenue', label: 'Revenue', icon: '💰', match: /^\/portal\/revenue/ },
  { href: '/portal/availability', label: 'Availability', icon: '📅', match: /^\/portal\/availability/ },
  { href: '/portal/statements', label: 'Statements', icon: '📄', match: /^\/portal\/statements/ },
]

export function PortalNav() {
  const pathname = usePathname()

  return (
    <aside className="adm-sidebar" style={{ background: '#1a242e' }}>
      <div className="adm-sidebar__brand">
        <div>
          <div className="adm-sidebar__brand-text">PlayaStays</div>
          <div className="adm-sidebar__brand-tag" style={{ color: '#d4a853' }}>Owner Portal</div>
        </div>
      </div>
      <nav className="adm-sidebar__nav">
        <div className="adm-sidebar__section">
          {ITEMS.map(item => {
            const active = item.match.test(pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`adm-sidebar__link${active ? ' is-active' : ''}`}
              >
                <span className="adm-sidebar__link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="adm-sidebar__footer">
        <Link href="/">← Back to PlayaStays.com</Link>
      </div>
    </aside>
  )
}

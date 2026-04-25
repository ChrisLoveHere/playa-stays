'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
  match?: RegExp
}

const SECTIONS: { label?: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '▣', match: /^\/admin\/?$/ },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/blog', label: 'Blog', icon: '✎', match: /^\/admin\/blog/ },
    ],
  },
  {
    label: 'Portfolio',
    items: [
      { href: '/admin/properties', label: 'Properties', icon: '🏠', match: /^\/admin\/properties/ },
      { href: '/admin/availability', label: 'Availability', icon: '📅', match: /^\/admin\/availability/ },
    ],
  },
  {
    label: 'People & comms',
    items: [
      { href: '/admin/owners', label: 'Owners', icon: '◎', match: /^\/admin\/owners/ },
      { href: '/admin/conversations', label: 'Conversations', icon: '💬', match: /^\/admin\/conversations/ },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/tasks', label: 'Tasks', icon: '☑', match: /^\/admin\/tasks/ },
      { href: '/admin/issues', label: 'Issues', icon: '⚑', match: /^\/admin\/issues/ },
      { href: '/admin/vendors', label: 'Vendors', icon: '✦', match: /^\/admin\/vendors/ },
      { href: '/admin/cleanings', label: 'Cleanings', icon: '✧', match: /^\/admin\/cleanings/ },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/payments', label: 'Payments', icon: '$', match: /^\/admin\/payments/ },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/activity', label: 'Activity', icon: '↻', match: /^\/admin\/activity/ },
      { href: '/admin/settings', label: 'Settings', icon: '⚙', match: /^\/admin\/settings/ },
    ],
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar__brand">
        <div>
          <div className="adm-sidebar__brand-text">PlayaStays</div>
          <div className="adm-sidebar__brand-tag">Ops platform</div>
        </div>
      </div>
      <nav className="adm-sidebar__nav">
        {SECTIONS.map((section, si) => (
          <div key={si} className="adm-sidebar__section">
            {section.label && (
              <div className="adm-sidebar__section-label">{section.label}</div>
            )}
            {section.items.map(item => {
              const active = item.match
                ? item.match.test(pathname)
                : pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`adm-sidebar__link${active ? ' is-active' : ''}`}
                >
                  <span className="adm-sidebar__link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="adm-sidebar__badge">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="adm-sidebar__footer">
        <Link href="/">← Back to site</Link>
      </div>
    </aside>
  )
}

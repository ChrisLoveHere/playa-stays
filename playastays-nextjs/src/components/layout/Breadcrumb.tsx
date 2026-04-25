// ============================================================
// PlayaStays — Breadcrumb (Server Component)
// ============================================================

import Link from 'next/link'
import type { BreadcrumbItem } from '@/types'

export type { BreadcrumbItem } from '@/types'

/** `light` = ivory / editorial pages (blog). Default = dark heroes (city hubs, pricing). */
export function Breadcrumb({
  crumbs,
  variant = 'dark',
}: {
  crumbs: BreadcrumbItem[]
  variant?: 'dark' | 'light'
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={variant === 'light' ? 'breadcrumb-nav--light' : undefined}
    >
      <ol className="breadcrumb">
        {crumbs.map((c, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            {i < crumbs.length - 1 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

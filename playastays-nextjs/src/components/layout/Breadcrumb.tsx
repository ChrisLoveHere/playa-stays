// ============================================================
// Breadcrumb — server component
// ============================================================

import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string | null
}

export function Breadcrumb({ crumbs }: { crumbs: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {crumbs.map((c, i) => (
          <li key={i} style={{ display: 'contents' }}>
            {c.href
              ? <Link href={c.href}>{c.label}</Link>
              : <span aria-current="page">{c.label}</span>
            }
            {i < crumbs.length - 1 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ============================================================
// PreviewBar — client component, shown only in Draft Mode
// ============================================================
'use client'

import { useRouter } from 'next/navigation'

export function PreviewBar() {
  const router = useRouter()

  const exitPreview = async () => {
    await fetch('/api/preview-exit')
    router.refresh()
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: '#1a2326', color: '#fff',
      padding: '8px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: '0.78rem', fontWeight: 600,
    }}>
      <span>🔍 Preview Mode — viewing unpublished content</span>
      <button
        onClick={exitPreview}
        style={{
          background: 'var(--coral)', color: '#fff',
          border: 'none', borderRadius: 'var(--r-pill)',
          padding: '5px 14px', fontSize: '0.76rem',
          fontWeight: 700, cursor: 'pointer',
        }}
      >
        Exit Preview
      </button>
    </div>
  )
}

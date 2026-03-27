'use client'
// PreviewBar — shown when Next.js Draft Mode is active.
// Allows editors to exit preview from any page.

import Link from 'next/link'

export function PreviewBar() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: 'var(--coral)', color: 'var(--white)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 24px', fontSize: '0.8rem', fontWeight: 600,
    }}>
      <span>⚠ Draft Mode — you are previewing unpublished content</span>
      <Link
        href="/api/preview-exit"
        style={{ color: 'var(--white)', textDecoration: 'underline', fontWeight: 700 }}
      >
        Exit Preview
      </Link>
    </div>
  )
}

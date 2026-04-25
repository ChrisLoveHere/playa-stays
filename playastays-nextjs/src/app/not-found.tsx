import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found | PlayaStays',
  description: 'That URL is not on PlayaStays. Use the menu or contact us for help.',
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Page not found | PlayaStays',
    description: 'That URL is not on PlayaStays.',
    siteName: 'PlayaStays',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page not found | PlayaStays',
  },
}

const linkStyle: CSSProperties = {
  display: 'inline-block',
  marginRight: 12,
  marginBottom: 8,
  fontSize: '0.95rem',
  color: 'rgba(255,255,255,0.9)',
  textDecoration: 'underline',
  textUnderlineOffset: 3,
}

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 80 }}>
        <h1 className="display-title" style={{ marginBottom: 16 }}>
          Page not found
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 560,
            marginBottom: 28,
          }}
        >
          That URL does not exist or has moved. Start from the homepage, explore regional services, pick a
          city, or get in touch.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <Link href="/" className="btn btn-gold">
            Go home
          </Link>
          <Link href="/contact/" className="btn btn-outline">
            Contact
          </Link>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20 }}>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
            Popular destinations
          </p>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 0' }}>
            <Link href="/property-management/" style={linkStyle}>
              Property management
            </Link>
            <Link href="/vacation-rental-management/" style={linkStyle}>
              Vacation rentals (owners)
            </Link>
            <Link href="/rentals/" style={linkStyle}>
              Guest rentals
            </Link>
            <Link href="/playa-del-carmen/" style={linkStyle}>
              Playa del Carmen
            </Link>
            <Link href="/tulum/" style={linkStyle}>
              Tulum
            </Link>
            <Link href="/blog/" style={linkStyle}>
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </section>
  )
}

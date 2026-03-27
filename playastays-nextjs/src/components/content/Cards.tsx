// ============================================================
// PlayaStays — Card Components (server)
// ============================================================

import Image from 'next/image'
import Link from 'next/link'
import type { Property, Testimonial, BlogPost } from '@/types'
import type { Locale } from '@/lib/i18n'

// ── PropertyCard ──────────────────────────────────────────

export function PropertyCard({ property }: { property: Property }) {
  const img = property.ps_computed.featured_image
  const name = property.title.rendered
  const loc  = `${property.meta.ps_neighborhood || property.meta.ps_city}`
  const beds = property.meta.ps_bedrooms
  const baths = property.meta.ps_bathrooms
  const guests = property.meta.ps_guests
  const rate = property.meta.ps_nightly_rate
  const rating = property.meta.ps_avg_rating
  const reviews = property.meta.ps_review_count
  const managed = property.meta.ps_managed_by_ps

  return (
    <Link href={`/rentals/${property.slug}/`} className="prop-card">
      <div className="card-img">
        {img
          ? <Image src={img.url} alt={img.alt || name} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
          : <div style={{ background: 'var(--sand)', width: '100%', height: '100%' }} />
        }
        <span className={`card-badge${managed ? ' managed' : ''}`}>
          {managed ? 'PlayaStays Managed' : 'Verified'}
        </span>
      </div>
      <div className="card-body">
        <div className="card-loc">{loc}</div>
        <div className="card-name">{name}</div>
        <div className="card-specs">
          {beds === 0 ? 'Studio' : `${beds} bed`} · {baths} bath · Sleeps {guests}
        </div>
        <div className="card-foot">
          <div className="card-rating">
            <StarIcon />
            {rating > 0 ? rating.toFixed(2) : '—'}
            {reviews > 0 && <span className="card-rating-count">({reviews})</span>}
          </div>
          <div>
            <span className="card-price">${rate}</span>
            <span className="card-night"> /night</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (!properties.length) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--light)' }}>
        No properties found.
      </div>
    )
  }
  return (
    <div className="listings-grid">
      {properties.map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
  )
}

// ── TestimonialCard ───────────────────────────────────────

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const m = testimonial.meta
  return (
    <div className="test-card">
      <div className="test-stars">{'★'.repeat(Math.round(m.ps_rating || 5))}</div>
      <div
        className="test-quote"
        dangerouslySetInnerHTML={{ __html: testimonial.content.rendered }}
      />
      <div className="test-author">
        <div className="test-avatar">{m.ps_author_initials || m.ps_author_name.slice(0,2)}</div>
        <div>
          <div className="test-name">{m.ps_author_name}</div>
          <div className="test-detail">{m.ps_author_role}</div>
        </div>
      </div>
    </div>
  )
}

// ── BlogCard ──────────────────────────────────────────────

export function BlogCard({ post }: { post: BlogPost }) {
  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const alt = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered
  const dateStr = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link href={`/blog/${post.slug}/`} className="blog-card">
      <div className="blog-img">
        {img
          ? <Image src={img} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
          : <div style={{ background: 'var(--sand)', width: '100%', height: '100%' }} />
        }
      </div>
      <div className="blog-body">
        <span className="blog-tag">Insights</span>
        <div className="blog-title">{post.title.rendered}</div>
        <div
          className="blog-excerpt"
          dangerouslySetInnerHTML={{
            __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 120) + '…'
          }}
        />
        <div className="blog-foot">
          <span>{dateStr}</span>
          <span className="blog-read">Read more →</span>
        </div>
      </div>
    </Link>
  )
}

// ── EsBlogCard ────────────────────────────────────────────
// Locale-aware blog card: renders ES title/excerpt when
// locale='es' and the post has ES meta fields; falls back to EN.

export function EsBlogCard({ post, locale = 'en' }: { post: BlogPost; locale?: Locale }) {
  const isEs    = locale === 'es'
  const img     = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const alt     = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered
  const title   = isEs && post.meta.ps_title_es   ? post.meta.ps_title_es   : post.title.rendered
  const excerpt = isEs && post.meta.ps_excerpt_es  ? post.meta.ps_excerpt_es  : post.excerpt.rendered.replace(/<[^>]*>/g, '')
  const href    = isEs ? `/es/blog/${post.slug}/` : `/blog/${post.slug}/`
  const tag     = isEs ? 'Artículos' : 'Insights'
  const readMore = isEs ? 'Leer más →' : 'Read more →'
  const dateStr = new Date(post.date).toLocaleDateString(isEs ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link href={href} className="blog-card">
      <div className="blog-img">
        {img
          ? <Image src={img} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
          : <div style={{ background: 'var(--sand)', width: '100%', height: '100%' }} />
        }
      </div>
      <div className="blog-body">
        <span className="blog-tag">{tag}</span>
        <div className="blog-title">{title}</div>
        <div className="blog-excerpt">{excerpt.slice(0, 120)}…</div>
        <div className="blog-foot">
          <span>{dateStr}</span>
          <span className="blog-read">{readMore}</span>
        </div>
      </div>
    </Link>
  )
}

// ── SVG ───────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

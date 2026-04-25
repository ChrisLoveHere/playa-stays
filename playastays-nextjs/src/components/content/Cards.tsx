// ============================================================
// PlayaStays — Card Components (server)
// ============================================================

import Image from 'next/image'
import Link from 'next/link'
import type { Property, Testimonial, BlogPost } from '@/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { inferListingRole } from '@/lib/property-browse'
import { deriveCardSmartTags, collectResolvedAmenityKeys, amenityLabel } from '@/lib/amenity-taxonomy'
import { propertyHref } from '@/lib/property-url'
import {
  rentalStrategyForDisplay,
  rentalStrategyLabel,
  showMonthlyStayFriendlyBadge,
  monthlyStayFriendlyLabel,
} from '@/lib/rental-strategy'
import { BLOG_HERO_JPG } from '@/lib/public-assets'

// ── PropertyCard ──────────────────────────────────────────

export function PropertyCard({
  property,
  locale = 'en',
  variant = 'browse',
}: {
  property: Property
  locale?: Locale
  /** `featured-compact` — smaller homepage carousel tiles (fewer lines, tighter type). */
  variant?: 'browse' | 'featured-compact'
}) {
  const ui   = t(locale)
  const isEs = locale === 'es'
  const href = propertyHref(property, locale)
  const img  = property.ps_computed.featured_image
  const name = property.title.rendered
  const neighborhood = property.meta.ps_neighborhood
  const city  = property.meta.ps_city
  const loc   = neighborhood ? `${neighborhood}, ${city}` : city
  const beds  = property.meta.ps_bedrooms
  const baths = property.meta.ps_bathrooms
  const guests = property.meta.ps_guests
  const rate  = property.meta.ps_nightly_rate
  const monthly = Number(property.meta.ps_monthly_rate) || 0
  const salePrice = Number(property.meta.ps_sale_price) || 0
  const rating  = property.meta.ps_avg_rating
  const reviews = property.meta.ps_review_count
  const managed = property.meta.ps_managed_by_ps
  const role = inferListingRole(property)

  const bedPart = beds === 0
    ? ui.propStudio
    : (isEs ? `${beds} rec` : `${beds} ${ui.propBed.toLowerCase()}`)

  const resolvedKeys = collectResolvedAmenityKeys(property)
  const amenityHighlights = resolvedKeys.slice(0, 3).map(k => amenityLabel(k, locale))

  const strategy = rentalStrategyForDisplay(property)
  const listingBadges: Array<{ text: string; cls: string }> = []
  if (strategy) {
    listingBadges.push({
      text: rentalStrategyLabel(strategy, locale),
      cls: `rental-strat rental-strat--${strategy}`,
    })
  }
  if (showMonthlyStayFriendlyBadge(property)) {
    listingBadges.push({ text: monthlyStayFriendlyLabel(locale), cls: 'rental-monthly' })
  }
  if (role === 'rent' || role === 'both') listingBadges.push({ text: ui.propForRent, cls: '' })
  if (role === 'sale' || role === 'both') listingBadges.push({ text: ui.propForSale, cls: 'sale' })
  if (managed) listingBadges.push({ text: ui.propManaged, cls: 'managed' })

  const smartTags = deriveCardSmartTags(property, locale)
  const compact = variant === 'featured-compact'

  const priceLine =
    role === 'sale' && salePrice > 0 && rate <= 0
      ? <><span className="card-price">${salePrice.toLocaleString()}</span><span className="card-night"> {isEs ? 'venta' : 'sale'}</span></>
      : <><span className="card-price">${rate}</span><span className="card-night"> {ui.propNight}</span></>

  return (
    <Link
      href={href}
      className={`prop-card prop-card--browse${compact ? ' prop-card--featured-compact' : ''}`}
    >
      <div className="card-img card-img--browse">
        {img
          ? (
            <Image
              src={img.url}
              alt={img.alt || name}
              fill
              style={{ objectFit: 'cover' }}
              sizes={compact ? '(max-width:768px) 88vw, 30vw' : '(max-width:768px) 100vw, 33vw'}
            />
          )
          : <div className="card-img__placeholder" />}
        <div className="card-img__shade" aria-hidden />
        <div className="card-badges">
          {listingBadges.map((b, i) => (
            <span key={i} className={`card-badge-pill${b.cls ? ` ${b.cls}` : ''}`}>{b.text}</span>
          ))}
        </div>
      </div>
      <div className="card-body">
        <div className="card-loc">{loc}</div>
        <h3 className="card-name">{name}</h3>
        <div className="card-price-block">
          {priceLine}
          {monthly > 0 && role !== 'sale' && (
            <span className="card-monthly"> · ${monthly.toLocaleString()}{isEs ? '/mes' : '/mo'}</span>
          )}
        </div>
        <div className="card-specs">
          {bedPart} · {baths} {ui.propBath.toLowerCase()} · {ui.propSleeps} {guests}
        </div>
        {!compact && amenityHighlights.length > 0 && (
          <div className="card-amenities">{amenityHighlights.join(' · ')}</div>
        )}
        {!compact && smartTags.length > 0 && (
          <div className="card-tags">
            {smartTags.map(tag => <span key={tag} className="card-tag">{tag}</span>)}
          </div>
        )}
        <div className="card-foot">
          <div className="card-rating">
            <StarIcon />
            {rating > 0 ? rating.toFixed(2) : '—'}
            {reviews > 0 && <span className="card-rating-count">({reviews})</span>}
          </div>
          <span className="card-cta card-cta--browse">{isEs ? 'Ver detalles →' : 'View details →'}</span>
        </div>
      </div>
    </Link>
  )
}

export function PropertyGrid({
  properties,
  locale = 'en',
  emptyHint,
}: {
  properties: Property[]
  locale?: Locale
  /** Extra guidance when filters yield zero results */
  emptyHint?: string
}) {
  const ui = t(locale)
  if (!properties.length) {
    return (
      <div className="browse-empty">
        <p className="browse-empty__title">{ui.noResults}</p>
        {emptyHint ? <p className="browse-empty__hint">{emptyHint}</p> : null}
      </div>
    )
  }
  return (
    <div className="listings-grid">
      {properties.map(p => <PropertyCard key={p.id} property={p} locale={locale} />)}
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
        <div className="test-avatar">
          {m.ps_author_initials || (m.ps_author_name ? m.ps_author_name.slice(0, 2) : 'PS')}
        </div>
        <div>
          <div className="test-name">{m.ps_author_name || '—'}</div>
          <div className="test-detail">{m.ps_author_role || ''}</div>
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
        {img ? (
          <Image src={img} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <Image src={BLOG_HERO_JPG} alt="" fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
        )}
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
        {img ? (
          <Image src={img} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <Image src={BLOG_HERO_JPG} alt="" fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
        )}
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

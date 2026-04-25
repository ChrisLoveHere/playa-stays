'use client'
// ============================================================
// PropertyDetailTemplate — property detail page
// Layout: gallery → header → content + sidebar → owner CTA
// Amenities: shared taxonomy (amenity-taxonomy.ts)
// ============================================================

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { OwnerBanner, CtaStrip } from '@/components/sections'
import { PropertyAvailabilityPanel } from '@/components/property/PropertyAvailabilityPanel'
import { inferListingRole } from '@/lib/property-browse'
import { buildAmenityDisplayGroups, buildPropertyBadges, getAmenityDef } from '@/lib/amenity-taxonomy'
import { citySlugToLabel } from '@/lib/location-data'
import { toLocationSlug } from '@/lib/property-url'
import {
  rentalStrategyForDisplay,
  rentalStrategyLabel,
  showMonthlyStayFriendlyBadge,
  monthlyStayFriendlyLabel,
} from '@/lib/rental-strategy'
import type { ListingMapResolution } from '@/lib/listing-map-embed'
import { ListingLocationMap } from '@/components/listings/ListingLocationMap'

interface Props {
  property: Property
  locale?: Locale
  whatsappDigits: string
  /** From `resolveListingMapEmbed` on the server — omit for text-only location block. */
  listingMap?: ListingMapResolution | null
}

export function PropertyDetailTemplate({
  property,
  locale = 'en',
  whatsappDigits,
  listingMap = null,
}: Props) {
  const p    = property
  const meta = p.meta
  const comp = p.ps_computed
  const isEs = locale === 'es'
  const ui   = t(locale)
  const role = inferListingRole(p)

  const name    = isEs && meta.ps_title_es   ? meta.ps_title_es   : p.title.rendered
  const content = isEs && meta.ps_content_es ? meta.ps_content_es : p.content.rendered

  // ── images ──────────────────────────────────────────────
  const allImages = [
    ...(comp.featured_image ? [comp.featured_image] : []),
    ...comp.gallery,
  ]
  const [activeIdx, setActiveIdx] = useState(0)
  const mainImg = allImages[activeIdx] ?? allImages[0]
  const hasMultiple = allImages.length > 1

  const goPrev = useCallback(() => {
    setActiveIdx(i => (i === 0 ? allImages.length - 1 : i - 1))
  }, [allImages.length])

  const goNext = useCallback(() => {
    setActiveIdx(i => (i === allImages.length - 1 ? 0 : i + 1))
  }, [allImages.length])

  // ── derived data ────────────────────────────────────────
  const studioLabel = isEs ? 'Estudio' : 'Studio'
  const beds   = meta.ps_bedrooms === 0 ? studioLabel : `${meta.ps_bedrooms} ${isEs ? 'Rec' : 'Bed'}`
  const baths  = meta.ps_bathrooms
  const guests = meta.ps_guests
  const rate   = meta.ps_nightly_rate
  const monthly = Number(meta.ps_monthly_rate) || 0
  const salePrice = Number(meta.ps_sale_price) || 0
  const rating  = meta.ps_avg_rating
  const reviews = meta.ps_review_count
  const managed = meta.ps_managed_by_ps

  const propType = meta.ps_property_type
  const checkIn  = meta.ps_check_in_time
  const checkOut = meta.ps_check_out_time

  const citySlug     = toLocationSlug(meta.ps_city)
  const neighborhoodSlug = toLocationSlug(meta.ps_neighborhood)
  const cityLabel    = citySlugToLabel(citySlug) || meta.ps_city
  const base         = isEs ? '/es' : ''
  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const rentalsBase  = isEs ? '/es/rentas' : '/rentals'
  const rentalsHref  = `${rentalsBase}/`
  const pmHref       = `${base}/${citySlug}/${isEs ? 'administracion-de-propiedades' : 'property-management'}/`
  const cityRentalsHref = citySlug ? `${rentalsBase}/?city=${citySlug}` : rentalsHref

  const bookingLinks = [
    { label: isEs ? 'Reservar en Airbnb'  : 'Book on Airbnb',  href: comp.booking_links.airbnb,  color: '#FF5A5F' },
    { label: isEs ? 'Reservar en VRBO'    : 'Book on VRBO',    href: comp.booking_links.vrbo,    color: '#3D6AB8' },
    { label: isEs ? 'Reservar en Booking' : 'Book on Booking', href: comp.booking_links.booking, color: '#003580' },
    { label: isEs ? 'Reserva directa'     : 'Book Direct',     href: comp.booking_links.direct,  color: 'var(--teal)' },
  ].filter(b => b.href)

  // ── badges + amenities (shared taxonomy) ────────────────
  const badges = buildPropertyBadges(p, locale, 5)
  const amenityGroups = buildAmenityDisplayGroups(p, locale)
  const showSalePrice = role === 'sale' && salePrice > 0 && rate <= 0

  // ── listing type label ──────────────────────────────────
  const listingLabel = role === 'sale'
    ? (isEs ? 'En venta' : 'For sale')
    : role === 'both'
      ? (isEs ? 'Renta y venta' : 'Rent & sale')
      : null

  const rentalStrat = rentalStrategyForDisplay(p)
  const rentalStratMonthly = showMonthlyStayFriendlyBadge(p)

  return (
    <>
      {/* ════════════════════════════════════════════════════
          GALLERY
         ════════════════════════════════════════════════════ */}
      <section className="pd-gallery">
        <div className="pd-gallery__main">
          {mainImg ? (
            <Image
              key={activeIdx}
              src={mainImg.url}
              alt={mainImg.alt || name}
              fill
              priority={activeIdx === 0}
              style={{ objectFit: 'cover' }}
              sizes="(max-width:768px) 100vw, 70vw"
            />
          ) : (
            <div className="pd-gallery__placeholder" />
          )}

          {(rentalStrat || rentalStratMonthly) && (
            <div className="pd-gallery__badges" aria-hidden>
              {rentalStrat && (
                <span className={`card-badge-pill rental-strat rental-strat--${rentalStrat}`}>
                  {rentalStrategyLabel(rentalStrat, locale)}
                </span>
              )}
              {rentalStratMonthly && (
                <span className="card-badge-pill rental-monthly">{monthlyStayFriendlyLabel(locale)}</span>
              )}
            </div>
          )}

          {hasMultiple && (
            <>
              <button type="button" className="pd-gallery__arrow pd-gallery__arrow--prev" onClick={goPrev} aria-label="Previous photo">‹</button>
              <button type="button" className="pd-gallery__arrow pd-gallery__arrow--next" onClick={goNext} aria-label="Next photo">›</button>
              <span className="pd-gallery__count">{activeIdx + 1} / {allImages.length}</span>
            </>
          )}
        </div>

        {hasMultiple && (
          <div className="pd-gallery__thumbs">
            {allImages.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`pd-gallery__thumb${activeIdx === i ? ' is-active' : ''}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`Photo ${i + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${name} photo ${i + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════
          PROPERTY HEADER (below gallery)
         ════════════════════════════════════════════════════ */}
      <div className="pd-header">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: isEs ? 'Inicio' : 'Home', href: isEs ? '/es/' : '/' },
            { label: isEs ? 'Rentas' : 'Rentals', href: rentalsHref },
            ...(citySlug ? [{ label: cityLabel, href: cityRentalsHref }] : []),
            ...(neighborhoodSlug && meta.ps_neighborhood ? [{ label: meta.ps_neighborhood, href: null as string | null }] : []),
            { label: name, href: null },
          ]} />

          <div className="pd-header__top">
            <div>
              <p className="pd-header__loc">{meta.ps_neighborhood || meta.ps_city}</p>
              <h1 className="pd-header__title">{name}</h1>
            </div>
            {rating > 0 && (
              <div className="pd-header__rating-block">
                <span className="pd-header__star">★</span>
                <span className="pd-header__rating-val">{rating.toFixed(2)}</span>
                <span className="pd-header__reviews">({reviews} {isEs ? 'reseñas' : 'reviews'})</span>
              </div>
            )}
          </div>

          <p className="pd-header__specs">
            {propType && <span className="pd-header__type">{propType}</span>}
            {propType && <span className="pd-header__dot">·</span>}
            <span>{beds}</span>
            <span className="pd-header__dot">·</span>
            <span>{baths} {isEs ? 'Baño' : 'Bath'}</span>
            <span className="pd-header__dot">·</span>
            <span>{isEs ? 'Huéspedes' : 'Sleeps'} {guests}</span>
            {listingLabel && (
              <>
                <span className="pd-header__dot">·</span>
                <span className="pd-header__listing-type">{listingLabel}</span>
              </>
            )}
          </p>

          {badges.length > 0 && (
            <div className="pd-header__badges">
              {badges.map((b, i) => {
                const isManaged = i === 0 && managed
                return (
                  <span key={i} className={`pd-badge${isManaged ? ' pd-badge--managed' : ''}`}>
                    {isManaged && <span className="pd-badge__icon">✦</span>}
                    {b}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MAIN CONTENT + SIDEBAR
         ════════════════════════════════════════════════════ */}
      <div className="pd-body">
        <div className="container pd-body__grid">
          {/* ── Left column ── */}
          <div className="pd-content">
            {/* Description */}
            <section className="pd-section">
              <h2 className="pd-section__title">
                {isEs ? 'Sobre esta propiedad' : 'About this property'}
              </h2>
              <div className="pd-prose" dangerouslySetInnerHTML={{ __html: content }} />
            </section>

            {/* Amenities — grouped by shared taxonomy */}
            {amenityGroups.length > 0 && (
              <section className="pd-section">
                <h2 className="pd-section__title">
                  {isEs ? 'Qué ofrece este lugar' : 'What this place offers'}
                </h2>
                <div className="pd-amenity-groups">
                  {amenityGroups.map(g => (
                    <div key={g.categoryId} className="pd-amenity-group">
                      <h4 className="pd-amenity-group__heading">{g.category}</h4>
                      <div className="pd-amenity-group__grid">
                        {g.items.map(item => (
                          <div key={item.key} className="pd-amenity-chip">
                            <span className="pd-amenity-chip__ico" aria-hidden>{item.icon}</span>
                            <span className="pd-amenity-chip__label">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {comp.amenities.length > 0 && (
                  <details className="pd-amenity-more">
                    <summary className="pd-amenity-more__toggle">
                      {isEs ? `Ver las ${comp.amenities.length} amenidades` : `Show all ${comp.amenities.length} amenities`}
                    </summary>
                    <div className="pd-amenity-group__grid pd-amenity-group__grid--flat">
                      {comp.amenities.map((a, i) => (
                        <div key={i} className="pd-amenity-chip pd-amenity-chip--raw">
                          <span className="pd-amenity-chip__check">✓</span>
                          <span className="pd-amenity-chip__label">{a}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </section>
            )}

            {/* Fallback: raw amenities when taxonomy matched nothing */}
            {amenityGroups.length === 0 && comp.amenities.length > 0 && (
              <section className="pd-section">
                <h2 className="pd-section__title">{isEs ? 'Amenidades' : 'Amenities'}</h2>
                <div className="pd-amenity-group__grid pd-amenity-group__grid--flat">
                  {comp.amenities.map((a, i) => (
                    <div key={i} className="pd-amenity-chip pd-amenity-chip--raw">
                      <span className="pd-amenity-chip__check">✓</span>
                      <span className="pd-amenity-chip__label">{a}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Availability */}
            <section className="pd-section">
              <PropertyAvailabilityPanel property={p} locale={locale} />
            </section>

            {/* Location */}
            <section className="pd-section">
              <h2 className="pd-section__title">
                {listingMap ? listingMap.sectionTitle : isEs ? 'Ubicación' : 'Location'}
              </h2>
              <p
                className="pd-prose"
                style={{ marginBottom: listingMap ? '0.5rem' : 0 }}
              >
                {meta.ps_neighborhood
                  ? (isEs
                    ? `Esta propiedad se encuentra en ${meta.ps_neighborhood}, ${meta.ps_city}.`
                    : `This property is located in ${meta.ps_neighborhood}, ${meta.ps_city}.`)
                  : (isEs
                    ? `Ubicada en ${meta.ps_city}.`
                    : `Located in ${meta.ps_city}.`)}
              </p>
              {listingMap ? <ListingLocationMap resolution={listingMap} /> : null}
            </section>

            {/* Owner CTA */}
            {managed && (
              <div className="pd-owner-note">
                <div className="eyebrow mb-8">{isEs ? 'Propiedad gestionada por PlayaStays' : 'PlayaStays Managed Property'}</div>
                <p className="pd-owner-note__body">
                  {isEs
                    ? `Esta propiedad es gestionada profesionalmente por el equipo local de PlayaStays en ${meta.ps_city}. ¿Tienes una propiedad similar?`
                    : `This property is professionally managed by PlayaStays' local team in ${meta.ps_city}. Own a similar property?`}{' '}
                  <Link href={pmHref} className="pd-owner-note__link">
                    {isEs ? 'Obtener estimado gratis →' : 'Get a free revenue estimate →'}
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="pd-sidebar">
            <div className="pd-card">
              {/* Price */}
              <div className="pd-card__price-row">
                {showSalePrice ? (
                  <div>
                    <span className="pd-card__price">${salePrice.toLocaleString()}</span>
                    <span className="pd-card__unit"> {isEs ? 'USD' : 'USD'}</span>
                  </div>
                ) : (
                  <div>
                    <span className="pd-card__price">${rate}</span>
                    <span className="pd-card__unit">{isEs ? '/noche' : '/night'}</span>
                  </div>
                )}
                {rating > 0 && (
                  <div className="pd-card__rating">
                    ★ {rating.toFixed(2)}
                    <span className="pd-card__rating-count">({reviews})</span>
                  </div>
                )}
              </div>

              {/* Monthly callout */}
              {monthly > 0 && role !== 'sale' && (
                <div className="pd-card__monthly">
                  <span className="pd-card__monthly-icon">📅</span>
                  {isEs ? 'Tarifa mensual:' : 'Monthly rate:'}{' '}
                  <strong>${monthly.toLocaleString()}{isEs ? '/mes' : '/mo'}</strong>
                </div>
              )}

              {/* Quick facts strip */}
              <div className="pd-card__facts">
                <span>{beds}</span>
                <span className="pd-card__dot">·</span>
                <span>{baths} {isEs ? 'baño' : 'bath'}</span>
                <span className="pd-card__dot">·</span>
                <span>{isEs ? 'Huéspedes' : 'Sleeps'} {guests}</span>
                {(meta.ps_min_stay_nights ?? 0) > 1 && (
                  <>
                    <span className="pd-card__dot">·</span>
                    <span>{meta.ps_min_stay_nights}{isEs ? ' noches mín.' : '-night min.'}</span>
                  </>
                )}
              </div>

              {/* Check-in / check-out times */}
              {(checkIn || checkOut) && (
                <div className="pd-card__times">
                  {checkIn && <span>🕒 {isEs ? 'Check‑in:' : 'Check‑in:'} <strong>{checkIn}</strong></span>}
                  {checkOut && <span>🕒 {isEs ? 'Check‑out:' : 'Check‑out:'} <strong>{checkOut}</strong></span>}
                </div>
              )}

              {/* Booking CTAs */}
              <div className="pd-card__actions">
                {bookingLinks.map((b, i) => (
                  <a
                    key={i}
                    href={b.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`pd-card__btn${i === 0 ? ' pd-card__btn--primary' : ''}`}
                    style={i === 0 ? undefined : { color: b.color, borderColor: b.color }}
                  >
                    {b.label}
                  </a>
                ))}
                <a
                  href={`https://wa.me/${whatsappDigits.replace(/\D/g, '')}?text=${encodeURIComponent(isEs ? `Hola, me interesa ${name}` : `Hi, I'm interested in ${name}`)}`}
                  target="_blank"
                  rel="noopener"
                  className="pd-card__btn pd-card__btn--wa"
                >
                  {isEs ? 'Consultar por WhatsApp' : 'Enquire on WhatsApp'}
                </a>
              </div>

              <p className="pd-card__note">{ui.browseAvailabilityNote}</p>
            </div>
          </aside>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          OWNER / CTA SECTIONS
         ════════════════════════════════════════════════════ */}
      <OwnerBanner
        eyebrow={isEs ? `¿Tienes propiedad en ${meta.ps_city}?` : `Own property in ${meta.ps_city}?`}
        headline={isEs ? 'Propiedades como esta generan más con gestión profesional' : 'Properties like this earn more under professional management'}
        body={isEs ? 'Obtén un estimado gratis basado en datos reales de nuestro portafolio.' : 'Get a free income estimate based on real data from our managed portfolio.'}
        primaryCta={{ label: isEs ? 'Obtener estimado gratis →' : 'Get Free Estimate →', href: estimateHref }}
        secondaryCta={{ label: isEs ? 'Administración de propiedades' : 'Property Management', href: pmHref }}
      />
      <CtaStrip
        eyebrow={isEs ? 'Administración de propiedades PlayaStays' : 'PlayaStays Property Management'}
        headline={isEs ? 'Maximiza tus ingresos de renta — obtén un estimado gratis.' : 'Maximize your rental income — get a free revenue estimate.'}
        cta={{ label: isEs ? 'Obtener mi estimado →' : 'Get My Free Estimate →', href: estimateHref }}
      />
    </>
  )
}

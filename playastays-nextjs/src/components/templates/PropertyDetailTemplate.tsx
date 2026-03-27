'use client'
// ============================================================
// PropertyDetailTemplate — server component
// Used by: app/rentals/[slug]/page.tsx
// ============================================================



import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { OwnerBanner, CtaStrip } from '@/components/sections'

interface PropertyDetailTemplateProps {
  property: Property
  locale?:  Locale
}

export function PropertyDetailTemplate({ property, locale = 'en' }: PropertyDetailTemplateProps) {
  const p        = property
  const meta     = p.meta
  const computed = p.ps_computed
  const isEs     = locale === 'es'

  const name    = isEs && meta.ps_title_es    ? meta.ps_title_es    : p.title.rendered
  const content = isEs && meta.ps_content_es  ? meta.ps_content_es  : p.content.rendered

  const [activeImg, setActiveImg] = useState(0)

  const allImages = [
    ...(computed.featured_image ? [computed.featured_image] : []),
    ...computed.gallery,
  ]

  const studioLabel = isEs ? 'Estudio' : 'Studio'
  const beds   = meta.ps_bedrooms === 0 ? studioLabel : `${meta.ps_bedrooms} ${isEs ? 'Rec' : 'Bed'}`
  const baths  = meta.ps_bathrooms
  const guests = meta.ps_guests
  const rate   = meta.ps_nightly_rate
  const rating = meta.ps_avg_rating
  const reviews = meta.ps_review_count

  const citySlugForLink = meta.ps_city.toLowerCase().replace(/\s+/g, '-')
  const base            = isEs ? '/es' : ''
  const estimateHref    = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const rentalsHref     = isEs ? '/es/rentas/' : '/rentals/'
  const pmHref          = `${base}/${citySlugForLink}/${isEs ? 'administracion-de-propiedades' : 'property-management'}/`

  const bookingLinks = [
    { label: isEs ? 'Reservar en Airbnb'  : 'Book on Airbnb',   href: computed.booking_links.airbnb,   color: '#FF5A5F' },
    { label: isEs ? 'Reservar en VRBO'    : 'Book on VRBO',     href: computed.booking_links.vrbo,     color: '#3D6AB8' },
    { label: isEs ? 'Reservar en Booking' : 'Book on Booking',  href: computed.booking_links.booking,  color: '#003580' },
    { label: isEs ? 'Reserva directa'     : 'Book Direct',      href: computed.booking_links.direct,   color: 'var(--teal)' },
  ].filter(b => b.href)

  return (
    <>
      {/* HERO — overlay with featured image */}
      <section style={{
        position: 'relative',
        minHeight: 480,
        background: allImages[0] ? `url(${allImages[0].url}) center/cover no-repeat` : 'var(--deep)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,43,47,0.92) 0%, rgba(10,43,47,0.3) 60%, transparent 100%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 36 }}>
          <Breadcrumb crumbs={[
            { label: isEs ? 'Inicio' : 'Home', href: isEs ? '/es/' : '/' },
            { label: isEs ? 'Rentas' : 'Rentals', href: rentalsHref },
            { label: name, href: null },
          ]} />
          <div className="eyebrow" style={{ color: 'var(--gold)', marginTop: 8 }}>
            {meta.ps_neighborhood || meta.ps_city}
          </div>
          <h1 className="page-title" style={{ marginTop: 6 }}>{name}</h1>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>
            {beds} · {baths} {isEs ? 'Baño' : 'Bath'} · {isEs ? 'Huéspedes' : 'Sleeps'} {guests}
            {rating > 0 && ` · ★ ${rating.toFixed(2)} (${reviews} ${isEs ? 'reseñas' : 'reviews'})`}
          </p>
        </div>
      </section>

      {/* GALLERY STRIP */}
      {allImages.length > 1 && (
        <div style={{ background: 'var(--charcoal)', overflowX: 'auto', display: 'flex', gap: 4, padding: '4px 0' }}>
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              style={{
                flexShrink: 0, width: 120, height: 80, padding: 0, border: 'none',
                cursor: 'pointer', opacity: activeImg === i ? 1 : 0.55,
                transition: 'opacity 0.2s',
                position: 'relative',
              }}
            >
              <Image
                src={img.url}
                alt={img.alt || `${name} photo ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}

      {/* MAIN CONTENT + BOOKING SIDEBAR */}
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 48,
        padding: '48px 24px',
        alignItems: 'start',
      }}>
        {/* Left: description + amenities */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: 16 }}>
            {isEs ? 'Sobre esta propiedad' : 'About this property'}
          </h2>
          <div
            className="wp-content"
            style={{ fontSize: '0.92rem', color: 'var(--mid)', lineHeight: 1.78, marginBottom: 36 }}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {computed.amenities.length > 0 && (
            <>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 16 }}>
                {isEs ? 'Amenidades' : 'Amenities'}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '8px 16px',
                marginBottom: 36,
              }}>
                {computed.amenities.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: 'var(--mid)' }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '0.75rem' }}>✓</span>
                    {a}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Owner CTA — inline within content */}
          <div style={{ padding: '20px 24px', background: 'var(--sand)', borderRadius: 'var(--r-md)', border: '1px solid var(--sand-dark)', marginTop: 24 }}>
            <div className="eyebrow mb-8">{isEs ? 'Propiedad gestionada por PlayaStays' : 'PlayaStays Managed Property'}</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--mid)', lineHeight: 1.65, marginBottom: 14 }}>
              {isEs
                ? `Esta propiedad es gestionada profesionalmente por el equipo local de PlayaStays en ${meta.ps_city}. ¿Tienes una propiedad similar?`
                : `This property is professionally managed by PlayaStays' local team in ${meta.ps_city}. Own a similar property?`}{' '}
              <Link href={pmHref} style={{ color: 'var(--teal)', fontWeight: 600 }}>
                {isEs ? 'Obtener estimado gratis →' : 'Get a free revenue estimate →'}
              </Link>
            </p>
          </div>
        </div>

        {/* Right: booking card (sticky) */}
        <div style={{
          position: 'sticky', top: 88,
          background: 'var(--white)',
          borderRadius: 'var(--r-lg)',
          padding: 28,
          border: '1px solid var(--sand-dark)',
          boxShadow: 'var(--sh-md)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--teal)' }}>
                ${rate}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--light)', marginLeft: 4 }}>{isEs ? '/noche' : '/night'}</span>
            </div>
            {rating > 0 && (
              <div style={{ fontSize: '0.82rem', color: 'var(--mid)', fontWeight: 600 }}>
                ★ {rating.toFixed(2)}
                <span style={{ fontWeight: 400, marginLeft: 4 }}>({reviews})</span>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--light)', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--sand-dark)' }}>
            {beds} · {baths} {isEs ? 'baño' : 'bath'} · {isEs ? 'Huéspedes' : 'Sleeps'} {guests}
            {meta.ps_min_stay_nights > 1 && ` · ${meta.ps_min_stay_nights}${isEs ? ' noches mínimo' : '-night minimum'}`}
          </div>

          {/* Booking buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bookingLinks.map((b, i) => (
              <a
                key={i}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-full"
                style={{ background: i === 0 ? 'var(--gold)' : 'transparent', color: i === 0 ? 'var(--deep)' : b.color, border: i === 0 ? 'none' : `1.5px solid ${b.color}` }}
              >
                {b.label}
              </a>
            ))}
            {bookingLinks.length === 0 && (
              <a
                href={`https://wa.me/529841234567?text=Hi, I'm interested in ${encodeURIComponent(name)}`}
                className="btn btn-gold btn-full"
                target="_blank" rel="noopener"
              >
                {isEs ? 'Consultar por WhatsApp' : 'Enquire on WhatsApp'}
              </a>
            )}
          </div>

          {meta.ps_monthly_rate > 0 && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--sand)', borderRadius: 'var(--r-sm)', fontSize: '0.78rem', color: 'var(--mid)' }}>
              {isEs ? 'Tarifa mensual disponible:' : 'Monthly rate available:'} <strong style={{ color: 'var(--teal)' }}>${meta.ps_monthly_rate}{isEs ? '/mes' : '/mo'}</strong>
            </div>
          )}
        </div>
      </div>

      {/* OWNER CTA */}
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

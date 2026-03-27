// ============================================================
// RentalCategoryTemplate — mixed server/client
// Handles /rentals/, /[city]/vacation-rentals/, /[city]/condos-for-rent/
// FilterBar is client-only; grid and hero are server-rendered.
// ============================================================

import { Suspense } from 'react'
import Link from 'next/link'
import type { Property, City } from '@/types'
import type { Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero/Hero'
import { TrustBar, OwnerBanner, CtaStrip } from '@/components/sections'
import { PropertyGrid } from '@/components/content/Cards'
import { FilterBar } from '@/components/forms/FilterBar'

interface RentalCategoryTemplateProps {
  // Page identity
  title:       string   // H1
  tag:         string   // hero eyebrow badge
  description: string   // hero sub-paragraph
  canonicalHref: string

  // Data
  properties: Property[]
  city?:      City       // set when scoped to a city; null on /rentals/ index

  // Breadcrumbs
  breadcrumbs: Array<{ label: string; href: string | null }>

  // Stats for hero
  stats?: Array<{ val: string; key: string }>

  locale?: Locale
}

export function RentalCategoryTemplate({
  title,
  tag,
  description,
  properties,
  city,
  breadcrumbs,
  stats,
  locale = 'en',
}: RentalCategoryTemplateProps) {
  const isEs      = locale === 'es'
  const citySlug  = city?.slug
  const cityName  = city?.title.rendered
  const base      = isEs ? '/es' : ''
  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const allRentalsHref = isEs ? '/es/rentas/' : '/rentals/'
  const pmBase    = citySlug
    ? `${base}/${citySlug}/${isEs ? 'administracion-de-propiedades' : 'property-management'}/`
    : estimateHref

  return (
    <>
      {/* HERO — centred variant (guest-first, no form above fold) */}
      <Hero
        variant="centred"
        breadcrumbs={breadcrumbs}
        tag={tag}
        headline={title}
        sub={description}
        primaryCta={{ label: isEs ? 'Ver todas las rentas' : 'Browse All Rentals', href: allRentalsHref }}
        secondaryCta={citySlug
          ? { label: isEs ? 'Publicar mi propiedad' : 'List Your Property', href: pmBase }
          : { label: isEs ? 'Publicar mi propiedad' : 'List Your Property', href: estimateHref }
        }
        stats={stats}
      />

      {/* TRUST BAR */}
      <TrustBar stats={[
        { val: '200+', key: 'Properties managed' },
        { val: '4.97★', key: 'Avg. portfolio rating' },
        { val: '24/7', key: 'Guest support' },
        { val: '100%', key: 'Professionally managed' },
        { val: 'ES/EN', key: 'Bilingual hosts' },
      ]} />

      {/* FILTER + LISTINGS */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          {/* FilterBar is a client component — wrapped in Suspense for streaming */}
          <Suspense fallback={<div className="filter-bar" style={{ minHeight: 56 }} />}>
            <FilterBar />
          </Suspense>
          <div style={{ marginTop: 28 }}>
            <PropertyGrid properties={properties} />
          </div>
        </div>
      </section>

      {/* OWNER BANNER — after the listing grid */}
      <OwnerBanner
        eyebrow={cityName
          ? (isEs ? `¿Tienes propiedad en ${cityName}?` : `Own property in ${cityName}?`)
          : (isEs ? '¿Tienes una propiedad de renta?' : 'Own a rental property?')}
        headline={
          cityName
            ? (isEs ? `Tu propiedad en ${cityName} podría aparecer aquí` : `Your ${cityName} property could be listed here`)
            : (isEs ? '¿Tu propiedad está en PlayaStays?' : 'Is your property listed on PlayaStays?')
        }
        body={isEs
          ? 'PlayaStays administra propiedades en Quintana Roo. Estimado gratis — sin compromisos.'
          : 'PlayaStays manages properties across Quintana Roo. Get a free income estimate — no commitment required.'}
        primaryCta={{ label: isEs ? 'Obtener estimado →' : 'Get Free Estimate →', href: estimateHref }}
        secondaryCta={
          citySlug
            ? { label: isEs ? 'Servicios de gestión' : 'Management Services', href: pmBase }
            : { label: isEs ? 'Cómo funciona' : 'How It Works', href: `${base}/playa-del-carmen/${isEs ? 'administracion-de-propiedades' : 'property-management'}/` }
        }
      />

      {/* CITY CONTEXT — if scoped to a city */}
      {city && (
        <section className="pad-lg bg-sand">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">{isEs ? `Sobre ${cityName}` : `About ${cityName}`}</div>
              <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                {isEs ? `Por qué ${cityName}` : `Why stay in ${cityName}`}
              </h2>
              <p className="body-text mb-16">
                {isEs && city.meta.ps_excerpt_es
                  ? city.meta.ps_excerpt_es
                  : city.excerpt.rendered.replace(/<[^>]*>/g, '')}
              </p>
              <p className="body-text mb-32">
                {isEs && city.meta.ps_market_note_es ? city.meta.ps_market_note_es : city.meta.ps_market_note}
              </p>
              <Link href={`${base}/${citySlug}/`} className="btn btn-ghost">
                {isEs ? `Guía de ${cityName} →` : `${cityName} Guide →`}
              </Link>
            </div>
            <div>
              <div className="eyebrow mb-8">{isEs ? 'Dónde quedarse' : 'Where to Stay'}</div>
              <h2 className="section-title mt-12 mb-20" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                {isEs ? `Colonias en ${cityName}` : `${cityName} neighborhoods`}
              </h2>
              {city.ps_computed.neighborhoods.map((n, i) => (
                <div key={i} style={{
                  padding: '13px 0',
                  borderBottom: i < city.ps_computed.neighborhoods.length - 1
                    ? '1px solid var(--sand-dark)'
                    : 'none',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.97rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 3 }}>
                    {n.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mid)', lineHeight: 1.55 }}>
                    {n.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRE-FOOTER CTA */}
      <CtaStrip
        eyebrow={cityName
          ? (isEs ? `¿Tienes propiedad en ${cityName}?` : `Own property in ${cityName}?`)
          : (isEs ? 'Propietarios' : 'Property owners')}
        headline={isEs
          ? 'Obtén un estimado de ingresos gratis — sin compromisos.'
          : 'Get a free rental income estimate — no commitment required.'}
        cta={{ label: isEs ? 'Obtener mi estimado →' : 'Get My Free Estimate →', href: estimateHref }}
      />
    </>
  )
}

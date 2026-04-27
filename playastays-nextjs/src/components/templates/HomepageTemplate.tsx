// ============================================================
// HomepageTemplate — server component
// Home: hero → channels → owner pain → segmentation → capabilities →
// how it works → founder → stats → testimonial → cities → CTA
// ============================================================

import Link from 'next/link'
import type { City, Service, Testimonial, BlogPost, SiteConfig, FAQ } from '@/types'
import { CtaStrip } from '@/components/sections'
import { CustomerSegmentationCards } from '@/components/home/CustomerSegmentationCards'
import { HomeStatsBanner } from '@/components/home/HomeStatsBanner'
import { HomeCapabilitiesGrid } from '@/components/home/HomeCapabilitiesGrid'
import { HomeChannelLogoStrip } from '@/components/home/HomeChannelLogoStrip'
import { HomeFounderWidget } from '@/components/home/HomeFounderWidget'
import { HomeOwnerTestimonial } from '@/components/home/HomeOwnerTestimonial'
import { HomeFeaturedCities } from '@/components/home/HomeFeaturedCities'
import { HomeOwnerPain } from '@/components/home/HomeOwnerPain'
import { HomeHowItWorks } from '@/components/home/HomeHowItWorks'
import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'

interface HomepageTemplateProps {
  config:       SiteConfig
  cities:       City[]
  services:     Service[]
  properties:   Property[]
  testimonials: Testimonial[]
  posts:        BlogPost[]
  faqs:         FAQ[]
  locale?:      Locale
}

export function HomepageTemplate({
  config: _config,
  cities: _cities,
  services: _services,
  properties: _properties,
  testimonials: _testimonials,
  posts: _posts,
  faqs: _faqs,
  locale = 'en',
}: HomepageTemplateProps) {
  const isEs         = locale === 'es'
  const primaryCtaLabel = isEs ? 'Solicita un Estimado Gratuito' : 'Get Free Estimate'
  const primaryCtaHref  = isEs ? '/es/contacto/' : '/contact/'
  const secondaryCtaLabel = isEs ? 'Explorar Rentas' : 'Browse Rentals'
  const secondaryCtaHref  = isEs ? '/es/rentas/' : '/rentals/'

  const heroTag = isEs
    ? '✦ Líder en administración de rentas — Playa del Carmen'
    : "✦ Playa del Carmen's #1 Property Manager"
  const heroSub = isEs
    ? 'Administración integral de rentas en Playa del Carmen — vacacionales o de largo plazo, según convenga. Nosotros operamos, tú cobras los ingresos.'
    : 'Full-service rental management in Playa del Carmen — vacation, lease, or somewhere in between. We run operations, you collect the revenue.'

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-left" />
          <div className="hero-bg-right">
            <div
              className="hero-slide active"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80')" }}
            />
            <div
              className="hero-slide"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80')" }}
            />
            <div
              className="hero-slide"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80')" }}
            />
          </div>
        </div>

        <div
          className="hero-content"
          style={{ gridTemplateColumns: 'minmax(0, 1fr)', maxWidth: 680 }}
        >
          <div>
            <div className="hero-tag fade-1">{heroTag}</div>
            <h1 className="display-title fade-2" style={{ marginBottom: 18 }}>
              {isEs ? (
                <>Maximiza tus <em>ingresos por renta</em> en el paraíso</>
              ) : (
                <>Maximize your <em>rental income</em> in paradise</>
              )}
            </h1>
            <p className="hero-sub fade-3">{heroSub}</p>
            <div className="hero-btns fade-4">
              <Link href={primaryCtaHref} className="btn btn-gold btn-lg">
                {primaryCtaLabel}
              </Link>
              <Link
                href={secondaryCtaHref}
                className="btn btn-lg"
                style={{
                  background: 'var(--teal)',
                  color: 'var(--white)',
                  border: '1px solid var(--teal)',
                  boxShadow: '0 3px 10px rgba(10, 43, 47, 0.18)',
                }}
              >
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeChannelLogoStrip locale={locale} />

      <HomeOwnerPain locale={locale} />

      <CustomerSegmentationCards locale={locale} />

      <HomeCapabilitiesGrid locale={locale} />

      <HomeHowItWorks locale={locale} />

      <HomeFounderWidget locale={locale} />

      <HomeStatsBanner locale={locale} />

      <HomeOwnerTestimonial locale={locale} />

      <HomeFeaturedCities locale={locale} />

      {/* TODO: Re-add blog section when 3+ real posts exist (exclude placeholder “Hello world” if filtering) */}

      <CtaStrip
        eyebrow={isEs ? '¿Listo para empezar?' : 'Ready to start?'}
        headline={
          isEs
            ? 'Obtén un estimado de ingresos gratis — sin compromiso ni charla de ventas.'
            : 'Get a free revenue estimate — no commitment, no sales pitch.'
        }
        cta={{
          label: isEs ? 'Obtener mi estimado gratis →' : 'Get My Free Estimate →',
          href: isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/',
        }}
      />
    </>
  )
}

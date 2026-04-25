// ============================================================
// /es/precios-administracion-propiedades/
//
// Hub global de precios (todos los mercados en Quintana Roo).
// Calculadoras y ejemplos por ciudad: /es/[slug]/costo-administracion-propiedades/
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { OwnerBanner } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getPricingPlans, getPricingFAQs, getValueItems, CITY_PRICING, PRICING_HUB_PRIMARY_SLUGS } from '@/lib/pricing-data'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Precios de administración en Quintana Roo — Core, Plus y Pro',
  description:
    'Tres niveles de plan: Core (10%), Plus (15%, más popular) y Pro (personalizado). Las mismas tarifas de administración en cada mercado PlayaStays en Quintana Roo. Sin cuotas iniciales ni contratos largos: comisión basada en desempeño.',
  canonical: 'https://www.playastays.com/es/precios-administracion-propiedades/',
  hreflangEn: 'https://www.playastays.com/property-management-pricing/',
})

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cómo están estructuradas las comisiones de administración de PlayaStays en Quintana Roo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PlayaStays ofrece tres niveles: Core (10% de ingresos brutos por renta), Plus (15%, el más popular) y Pro (personalizado para inversionistas y portafolios multi-propiedad). La misma estructura de tarifas aplica en cada mercado donde operamos en Quintana Roo. No hay comisión de configuración ni contratos largos. El modelo es basado en desempeño: ganamos cuando tú ganas.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Vale la pena la gestión profesional de rentas vacacionales en la Riviera Maya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Las propiedades gestionadas por PlayaStays generan en promedio un 22–38% más de ingresos netos que las autogestionadas, incluso después de la comisión, gracias al precio dinámico, mayor ocupación y optimización del anuncio.',
          },
        },
      ],
    },
    {
      '@type': 'Service',
      name: 'Administración de Rentas Vacacionales — Riviera Maya y Quintana Roo',
      provider: { '@id': 'https://www.playastays.com/#org' },
      areaServed: { '@type': 'State', name: 'Quintana Roo' },
      offers: [
        { '@type': 'Offer', name: 'Plan Core',  price: '10%', priceCurrency: 'percent' },
        { '@type': 'Offer', name: 'Plan Plus',  price: '15%', priceCurrency: 'percent' },
        { '@type': 'Offer', name: 'Plan Pro',   price: 'Personalizado', priceCurrency: 'percent' },
      ],
    },
  ],
}

export default function EsPricingHubPage() {
  const plans = getPricingPlans('es', 'Playa del Carmen', '/es/publica-tu-propiedad/')
  const faqs = getPricingFAQs('es', 'Playa del Carmen / Riviera Maya')
  const valueItems = getValueItems('es')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <section className="page-hero">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Inicio', href: '/es/' },
            { label: 'Precios de administración', href: null },
          ]} />

          <div style={{ marginTop: 12, maxWidth: 720 }}>
            <div className="hero-tag fade-1">Precios de administración</div>
            <h1
              className="display-title fade-2"
              style={{ fontSize: 'clamp(1.65rem,3.5vw,2.85rem)', marginBottom: 18, lineHeight: 1.08 }}
            >
              Precios de administración en <em>Playa del Carmen y la Riviera Maya</em>
            </h1>
            <p
              className="fade-3"
              style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.77,
                maxWidth: 520,
                marginBottom: 24,
              }}
            >
              Tres niveles de plan. Las mismas tarifas en cada mercado de Quintana Roo.
              <br />
              Sin cuotas iniciales. Sin contratos largos. Basado en desempeño — ganamos cuando tú ganas.
            </p>
            <div className="fade-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/es/publica-tu-propiedad/" className="btn btn-gold btn-lg">
                Obtener estimado de ingresos gratis →
              </Link>
              <a href="https://wa.me/529841234567" className="btn btn-wa" target="_blank" rel="noopener">
                Hablar con un asesor local
              </a>
            </div>
            <div style={{ marginTop: 14 }} className="fade-5">
              <Link href="/es/playa-del-carmen/administracion-de-propiedades/" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
                Ver servicios completos de administración →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div id="management-plans">
        <PricingGrid
          eyebrow="Planes de Administración"
          headline="Tarifas claras. Sin sorpresas."
          body="Todos los planes son basados en desempeño — ganamos cuando tú ganas. Sin cuota de instalación, sin retención mensual."
          plans={plans}
          locale="es"
        />
      </div>

      <section className="pad-lg bg-ivory">
        <div className="container" style={{ maxWidth: 720 }}>
          <FaqAccordion
            eyebrow="Preguntas frecuentes"
            headline="FAQ sobre precios"
            items={faqs}
          />
        </div>
      </section>

      <section className="pad-lg bg-sand">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
            <div className="eyebrow mb-8">En todos los planes</div>
            <h2 className="section-title mt-12 mb-8">Qué incluye cada plan</h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto' }}>
              Los niveles (Core, Plus, Pro) añaden servicios y profundidad de apoyo. El porcentaje de comisión no cambia por ciudad dentro de Quintana Roo; lo que varía por destino son los ejemplos e ilustraciones de mercado en cada página local.
            </p>
            <p className="body-text" style={{ maxWidth: 640, margin: '16px auto 0' }}>
              No subcontratamos. Nuestro equipo local en la Riviera Maya cubre el núcleo operativo en todos los planes.
            </p>
          </div>
          <div className="service-cards">
            {valueItems.map((item, i) => (
              <div key={i} className="service-card">
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                <div className="service-card-title">{item.title}</div>
                <div className="service-card-text">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OwnerBanner
        eyebrow="Propietarios en Quintana Roo"
        headline="Obtén un estimado de ingresos gratuito para tu propiedad"
        body="Comparte unos datos básicos y nuestro equipo local responderá con un panorama de ingresos personalizado, no un resultado genérico de calculadora."
        primaryCta={{ label: 'Obtener mi estimado gratis →', href: '/es/publica-tu-propiedad/' }}
        secondaryCta={{ label: 'Ver servicios de administración', href: '/es/playa-del-carmen/administracion-de-propiedades/' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className="eyebrow mb-8">Contexto local</div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>
            Mira los precios en contexto de tu destino
          </h2>
          <p className="body-text mb-24" style={{ maxWidth: 560 }}>
            Cada página por ciudad incluye contexto de tarifa y ocupación, escenarios de ejemplo y la misma estructura Core / Plus / Pro que ves aquí.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PRICING_HUB_PRIMARY_SLUGS.map(slug => {
              const cityData = CITY_PRICING[slug]
              if (!cityData) return null
              return (
                <Link
                  key={cityData.slug}
                  href={`/es/${cityData.slug}/costo-administracion-propiedades/`}
                  className="btn btn-ghost"
                >
                  {cityData.nameEs} — precios locales →
                </Link>
              )
            })}
            <Link href="/es/chetumal/costo-administracion-propiedades/" className="btn btn-ghost">
              Chetumal — precios locales →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

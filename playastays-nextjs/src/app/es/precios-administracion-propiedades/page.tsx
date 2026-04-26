// ============================================================
// /es/precios-administracion-propiedades/
//
// Hub global de precios (todos los mercados en Quintana Roo).
// Ilustraciones de mercado por ciudad: guías locales (CITY_PRICING en el hub de ciudad).
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { OwnerBanner } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { FounderWidget } from '@/components/contact/FounderWidget'
import {
  getPricingPlans,
  getPricingFAQs,
  getValueItems,
  getPropertyCareDeliverables,
  CITY_PRICING,
  PRICING_HUB_PRIMARY_SLUGS,
} from '@/lib/pricing-data'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Precios de administración en Quintana Roo — Core, Plus y Pro',
  description:
    'Cuidado de propiedad (US$125/mes en Core y Plus) más comisión: 10% sobre renta a largo plazo en Core, 15% sobre renta corta en Plus, y términos a medida en Pro. Misma estructura en todos los mercados PlayaStays en Quintana Roo.',
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
            text: 'Cada plan incluye Cuidado de propiedad con tarifa fija más una comisión según el tipo de plan. Core: cuidado mensual (US$125 en Core y Plus) + 10% de ingresos de renta a largo plazo si aplica, sin renta a corta plazo. Plus: cuidado mensual (US$125) + 15% de ingresos de renta corta. Pro: términos a medida (la mensualidad puede bajar en portafolios grandes). Misma lógica en todo Quintana Roo.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Vale la pena la gestión profesional de rentas vacacionales en la Riviera Maya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Las propiedades gestionadas por PlayaStays suelen generar 22–38% más de ingresos netos, incluso después de comisiones, con precio dinámico y listados optimizados donde aplica la renta a corta plazo (Plus/Pro).',
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
        { '@type': 'Offer', name: 'Core — Cuidado de propiedad US$125/mes + 10% renta a largo plazo' },
        { '@type': 'Offer', name: 'Plus — Cuidado de propiedad US$125/mes + 15% renta a corta plazo' },
        { '@type': 'Offer', name: 'Pro — Cuidado a medida y comisión personalizada por portafolio' },
      ],
    },
  ],
}

export default function EsPricingHubPage() {
  const plans = getPricingPlans('es', 'Playa del Carmen', '/es/contacto/')
  const faqs = getPricingFAQs('es', 'Playa del Carmen / Riviera Maya')
  const valueItems = getValueItems('es')
  const propertyCare = getPropertyCareDeliverables('es')

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
              Tres niveles de plan. Misma estructura en cada mercado de Quintana Roo.
              <br />
              Sin contratos largos. Cuidado de propiedad incluido; el porcentaje sobre ingresos es basado en desempeño según lo que tú ganas.
            </p>
            <div className="fade-4">
              <Link href="/es/contacto/" className="btn btn-gold btn-lg">
                Habla con un administrador local →
              </Link>
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
        <PricingGrid plans={plans} />
      </div>

      <section className="pad-lg bg-sand">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 32px' }}>
            <div className="eyebrow mb-8">En todos los planes</div>
            <h2 className="section-title mt-12 mb-8">Qué incluye cada plan</h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto' }}>
              Los planes (Core, Plus, Pro) añaden servicios. La estructura de tarifas no cambia por ciudad en Quintana Roo: el detalle de mercado está en cada guía. Core es renta a largo plazo o segunda residencia; Plus es explícitamente renta a corta plazo.
            </p>
            <p className="body-text" style={{ maxWidth: 640, margin: '16px auto 0' }}>
              No subcontratamos. Nuestro equipo local en la Riviera Maya cubre la operación en todos los planes.
            </p>
          </div>

          <div
            style={{
              maxWidth: 640,
              margin: '0 auto 40px',
              background: 'var(--white)',
              border: '1px solid var(--sand-dark)',
              borderRadius: 'var(--r-lg)',
              padding: '24px 28px',
            }}
          >
            <h3
              className="section-title"
              style={{ fontSize: 'clamp(1.1rem, 2.1vw, 1.4rem)', marginBottom: 12, textAlign: 'left' }}
            >
              En todo plan: Cuidado de propiedad
            </h3>
            <p className="body-text" style={{ marginBottom: 16, textAlign: 'left' }}>
              Una línea mensual para que el hogar esté bajo cuidado local, planteada como valor incluido, no un impuesto añadido a tu comisión.
            </p>
            <ul style={{ margin: 0, paddingLeft: 22, color: 'var(--mid)', lineHeight: 1.75, fontSize: '0.92rem' }}>
              {propertyCare.map((line, j) => (
                <li key={j} style={{ marginBottom: 8 }}>{line}</li>
              ))}
            </ul>
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

      <FounderWidget locale="es" />

      <section className="pad-lg bg-ivory">
        <div className="container" style={{ maxWidth: 720 }}>
          <FaqAccordion
            eyebrow="Preguntas frecuentes"
            headline="FAQ sobre precios"
            items={faqs}
          />
        </div>
      </section>

      <OwnerBanner
        eyebrow="Propietarios en Quintana Roo"
        headline="¿Preguntas sobre tu propiedad o los precios?"
        body="Respondemos de forma directa, sin call center."
        primaryCta={{ label: 'Contáctame →', href: '/es/contacto/' }}
        secondaryCta={{ label: 'Ver servicios de administración', href: '/es/playa-del-carmen/administracion-de-propiedades/' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className="eyebrow mb-8">Contexto local</div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}>
            Mira los precios en contexto de tu destino
          </h2>
          <p className="body-text mb-24" style={{ maxWidth: 560 }}>
            Cada guía de ciudad incluye contexto de tarifa y ocupación, escenarios de ejemplo y la misma estructura Core / Plus / Pro que ves aquí.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PRICING_HUB_PRIMARY_SLUGS.map(slug => {
              const cityData = CITY_PRICING[slug]
              if (!cityData) return null
              return (
                <Link
                  key={cityData.slug}
                  href={`/es/${cityData.slug}/`}
                  className="btn btn-ghost"
                >
                  {cityData.nameEs} — guía del destino →
                </Link>
              )
            })}
            <Link href="/es/chetumal/" className="btn btn-ghost">
              Chetumal — guía del destino →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

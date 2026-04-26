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
import { getPricingPlans, getPricingFAQs, getValueItems } from '@/lib/pricing-data'
import { PropertyCareCard } from '@/components/sections/PropertyCareCard'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Precios de administración en Quintana Roo — Core, Plus y Pro',
  description:
    'Cuidado de propiedad ($2,150 MXN al mes en Core y Plus) más comisión: 10% sobre renta a largo plazo en Core, 15% sobre renta corta en Plus, y términos a medida en Pro. Misma estructura en todos los mercados PlayaStays en Quintana Roo.',
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
          name: '¿Cuánto cobra PlayaStays?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cada plan incluye una tarifa de $2,150 MXN al mes de Cuidado de Propiedad. Adicionalmente, CORE es 10% sobre ingresos de renta a largo plazo cuando hay inquilino; PLUS es 15% sobre ingresos de renta corta; PRO es personalizado para portafolios. No hay cuotas iniciales ni contratos largos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Vale la pena la administración profesional?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Para la mayoría de los propietarios, sí. Las propiedades autogestionadas suelen reservar entre 60–70% del ingreso de las gestionadas profesionalmente. Además del ingreso, el costo de tiempo es significativo. PlayaStays existe para quitarte eso de encima.',
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
        { '@type': 'Offer', name: 'Core — Cuidado de propiedad $2,150 MXN al mes + 10% renta a largo plazo' },
        { '@type': 'Offer', name: 'Plus — Cuidado de propiedad $2,150 MXN al mes + 15% renta a corta plazo' },
        { '@type': 'Offer', name: 'Pro — Cuidado a medida y comisión personalizada por portafolio' },
      ],
    },
  ],
}

export default function EsPricingHubPage() {
  const plans = getPricingPlans('es', 'Playa del Carmen', '/es/contacto/')
  const faqs = getPricingFAQs('es')
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

      <FounderWidget locale="es" />

      <section className="pad-lg bg-deep">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 32px' }}>
            <h2
              className="section-title light mt-12 mb-8"
              style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', textShadow: '0 1px 2px rgba(10, 43, 47, 0.15)' }}
            >
              Cuidado de Propiedad, incluido en cada plan
            </h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto', color: 'rgba(255, 255, 255, 0.9)' }}>
              Una tarifa mensual fija para que tu casa esté cuidada — valor incluido, no un cargo oculto sobre tu porcentaje.
            </p>
          </div>

          <PropertyCareCard locale="es" />
        </div>
      </section>

      <section className="pad-lg bg-gold pricing-hub-value-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 32px' }}>
            <h2
              className="section-title light mt-12 mb-8"
              style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', textShadow: '0 1px 2px rgba(10, 43, 47, 0.15)' }}
            >
              Capacidades de administración activa de la propiedad
            </h2>
            <p className="body-text" style={{ maxWidth: 640, margin: '0 auto' }}>
              Disponibles cuando tu propiedad genera ingresos de renta corta (planes PLUS y PRO).
            </p>
          </div>
          <div className="service-cards pricing-hub-value-cards">
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
        headline="¿Preguntas sobre tu propiedad o los precios?"
        body="Respondemos de forma directa, sin call center."
        primaryCta={{ label: 'Contáctame →', href: '/es/contacto/' }}
      />

      <section className="pad-lg bg-deep pricing-faq-section">
        <div className="container" style={{ maxWidth: 900 }}>
          <FaqAccordion
            headline="FAQ sobre precios"
            items={faqs}
            twoColumn
            initialOpenIndex={null}
          />
        </div>
      </section>
    </>
  )
}

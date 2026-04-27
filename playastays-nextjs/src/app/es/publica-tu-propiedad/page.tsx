// ============================================================
// /es/publica-tu-propiedad/page.tsx
// Spanish lead capture / list your property page.
// Mirrors EN /list-your-property/page.tsx fully translated.
// ============================================================

import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { CtaStrip } from '@/components/sections'
import { LeadForm } from '@/components/forms/LeadForm'
import { ContactFounderWidget } from '@/components/contact/ContactFounderWidget'
import { TestimonialPlaceholder } from '@/components/contact/TestimonialPlaceholder'
import { PersonOrganizationSchema } from '@/components/seo/PersonOrganizationSchema'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Publica tu Propiedad | Estimado de Ingresos Gratis | PlayaStays',
  description:
    'Publica tu renta vacacional en Playa del Carmen con PlayaStays. Estimado de ingresos gratis basado en datos reales del mercado. Sin compromiso.',
  canonical: 'https://www.playastays.com/es/publica-tu-propiedad/',
  hreflangEn: 'https://www.playastays.com/list-your-property/',
})

export default async function PublicaTuPropiedadPage() {
  const config = await getSiteConfig()

  return (
    <>
      <PersonOrganizationSchema />
      <Hero
        variant="split"
        locale="es"
        breadcrumbs={[
          { label: 'Inicio', href: '/es/' },
          { label: 'Publica tu Propiedad', href: null },
        ]}
        tag="🏡 Publica tu Propiedad"
        headline="Cuéntanos sobre tu propiedad.<br />Te enviamos un <em>número real de ingresos</em> en 24 horas."
        sub="Administración integral en la Riviera Maya: fotografía, anuncios, precios y operación con huéspedes."
        stats={config.trust_stats}
        primaryCta={{ label: 'Obtener estimado gratis', href: '#estimate-form' }}
        secondaryCta={{ label: 'Cómo funciona', href: '#how-it-works' }}
        formSlot={
          <LeadForm
            variant="dark"
            source="publica-tu-propiedad"
            locale="es"
            title="Obtén un estimado de ingresos gratis"
            subtitle="Basado en datos reales del mercado. Sin compromiso. Respuesta en 24 horas."
          />
        }
      />

      <section className="pad-lg bg-deep" id="how-it-works" aria-label="Cómo funciona">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto 2.5rem' }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.76)' }}>CÓMO FUNCIONA</div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.8vw, 2.2rem)',
                fontWeight: 500,
                color: 'var(--white)',
                lineHeight: 1.2,
                margin: '0.7rem 0 0.65rem',
              }}
            >
              Tres pasos hacia las manos libres.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 1.1vw, 0.98rem)',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.86)',
                margin: 0,
              }}
            >
              Nuestro proceso de incorporación es rápido, sistemático y sin complicaciones para ti.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            <StepCard
              num="1"
              title="Cuéntanos sobre tu propiedad"
              body="Llena el formulario. Dos minutos. Revisamos cada envío el mismo día."
            />
            <StepCard
              num="2"
              title="Te enviamos el estimado"
              body="Una proyección personalizada basada en datos reales del mercado — en 24 horas."
            />
            <StepCard
              num="3"
              title="PlayaStays se encarga del resto"
              body="Fotografía, listados, precios, cumplimiento, soporte de huéspedes, limpieza. En Airbnb, VRBO y Booking.com en 7 días. Depósitos directos mensuales."
            />
          </div>
        </div>
      </section>

      <ContactFounderWidget
        locale="es"
        heading="Yo personalmente reviso cada envío de propiedad."
        body="Ya tengas un condominio en Playa o un portafolio de casas por todo Quintana Roo, miro cada envío en 24 horas y envío una proyección honesta. Sin tercerización, sin respuestas plantilla."
      />

      <TestimonialPlaceholder locale="es" headingOverride="Propietarios reales. Resultados reales." />

      <CtaStrip
        eyebrow="¿Listo para empezar?"
        headline="Obtén un estimado de ingresos gratis — sin compromisos, sin presión."
        cta={{ label: 'Obtener mi estimado →', href: '#estimate-form' }}
      />
    </>
  )
}

function StepCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <article
      style={{
        background: 'var(--white)',
        border: '1px solid var(--sand-dark)',
        borderRadius: 'var(--r-lg)',
        padding: '1.35rem 1.25rem 1.2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.25rem, 7vw, 5.4rem)',
          fontWeight: 600,
          lineHeight: 1,
          color: 'var(--gold)',
          margin: '0 0 0.65rem',
        }}
      >
        {num}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--charcoal)',
          lineHeight: 1.3,
          margin: '0 0 0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.86rem',
          lineHeight: 1.6,
          color: 'var(--mid)',
          margin: 0,
        }}
      >
        {body}
      </p>
    </article>
  )
}

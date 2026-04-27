// ============================================================
// /es/contacto/page.tsx — Spanish contact (mirrors /contact/)
// ============================================================

import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { CtaStrip } from '@/components/sections'
import { ContactLocationSection } from '@/components/contact/ContactLocationSection'
import { TestimonialPlaceholder } from '@/components/contact/TestimonialPlaceholder'
import { PersonOrganizationSchema } from '@/components/seo/PersonOrganizationSchema'
import { SmartLeadForm } from '@/components/contact/SmartLeadForm'
import { ContactMethodsGrid } from '@/components/contact/ContactMethodsGrid'
import { TeamSection } from '@/components/contact/TeamSection'
import { MobileWhatsAppSticky } from '@/components/contact/MobileWhatsAppSticky'

export const revalidate = false

export const metadata: Metadata = buildMetadata({
  title: 'Contacto | PlayaStays — Administración de Propiedades en Playa del Carmen',
  description:
    'Contáctanos. WhatsApp, teléfono, correo electrónico. La empresa líder en gestión de rentas vacacionales en Playa del Carmen.',
  canonical: 'https://www.playastays.com/es/contacto/',
  hreflangEn: 'https://www.playastays.com/contact/',
})

const LOCATION_COPY_ES = {
  eyebrow: 'Visítanos',
  title: 'Nuestra oficina en Playa del Carmen',
  lead:
    'Estamos en Zazil-ha — el mismo barrio donde administramos propiedades. Pasa en horario de oficina o escríbenos cuando quieras.',
  mapAriaLabel: 'Mapa de la oficina PlayaStays en Playa del Carmen, México',
  directionsLabel: 'Abrir en Google Maps →',
}

export default async function ContactoPage() {
  return (
    <>
      <PersonOrganizationSchema />
      <Hero
        variant="centred"
        breadcrumbs={[
          { label: 'Inicio', href: '/es/' },
          { label: 'Contacto', href: null },
        ]}
        tag="Contáctanos"
        headline="Somos <em>locales</em> y estamos disponibles"
        sub="Nuestro equipo está en Playa del Carmen. Escríbenos por WhatsApp, teléfono o correo — respondemos el mismo día."
      />

      <section className="pad-lg bg-white">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '46rem', margin: '0 auto 1.4rem' }}>
            <div className="eyebrow mb-8">ENVÍANOS UN MENSAJE</div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 2.8vw, 2.35rem)',
                color: 'var(--charcoal)',
                lineHeight: 1.16,
              }}
            >
              Cuéntanos cómo podemos ayudarte.
            </h2>
          </div>
          <SmartLeadForm source="contacto-page-smart" locale="es" />
        </div>
      </section>

      <ContactMethodsGrid locale="es" />

      <TeamSection locale="es" />

      <ContactLocationSection copy={LOCATION_COPY_ES} />

      <TestimonialPlaceholder
        locale="es"
        headingOverride="Conversaciones reales, resultados reales."
      />

      <CtaStrip
        eyebrow="¿Tienes una propiedad en la Riviera Maya?"
        headline="Obtén un estimado de ingresos gratis — sin compromisos."
        cta={{ label: 'Obtener mi estimado →', href: '/es/publica-tu-propiedad/' }}
      />
      {/* Mobile-only WhatsApp shortcut for contact page. Desktop users use the team section's WhatsApp Chris button. */}
      <MobileWhatsAppSticky locale="es" />
    </>
  )
}

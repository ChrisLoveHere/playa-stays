// ============================================================
// /es/contacto/page.tsx — Spanish contact (mirrors /contact/)
// ============================================================

import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata, contactPageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Hero } from '@/components/hero/Hero'
import { LeadForm } from '@/components/forms/LeadForm'
import { CtaStrip } from '@/components/sections'
import { ContactDirectColumn } from '@/components/contact/ContactDirectColumn'
import { ContactLocationSection } from '@/components/contact/ContactLocationSection'
import styles from '@/components/contact/ContactPageLayout.module.css'

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
  const config = await getSiteConfig()

  return (
    <>
      <JsonLd data={contactPageJsonLd('es')} />
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

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div className={styles.mainGrid}>
            <div>
              <div className="eyebrow mb-8">Envíanos un mensaje</div>
              <h2 className={styles.channelTitle}>Obtén un estimado de ingresos gratis</h2>
              <LeadForm variant="light" source="contacto-page" locale="es" />
            </div>

            <ContactDirectColumn
              config={config}
              labels={{
                eyebrow: 'Contacto directo',
                title: 'Escríbenos directamente',
                whatsappTitle: 'WhatsApp',
                whatsappSub: 'Disponible 7am – 10pm · Respuesta en minutos',
                phoneSub: 'Lun – Sáb 8am – 8pm hora MX',
                emailSub: 'Respuesta en 24 horas',
              }}
            />
          </div>
        </div>
      </section>

      <ContactLocationSection copy={LOCATION_COPY_ES} />

      <CtaStrip
        eyebrow="¿Tienes una propiedad en la Riviera Maya?"
        headline="Obtén un estimado de ingresos gratis — sin compromisos."
        cta={{ label: 'Obtener mi estimado →', href: '/es/publica-tu-propiedad/' }}
      />
    </>
  )
}

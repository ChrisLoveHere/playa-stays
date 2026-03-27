// ============================================================
// /es/contacto/page.tsx
// Spanish contact page. Mirrors /contact/page.tsx fully.
// ============================================================

import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { LeadForm } from '@/components/forms/LeadForm'

export const revalidate = false

export const metadata: Metadata = buildMetadata({
  title: 'Contacto | PlayaStays — Administración de Propiedades en Playa del Carmen',
  description: 'Contáctanos. WhatsApp, teléfono, correo electrónico. La empresa líder en gestión de rentas vacacionales en Playa del Carmen.',
  canonical: 'https://www.playastays.com/es/contacto/',
  hreflangEn: 'https://www.playastays.com/contact/',
})

export default async function ContactoPage() {
  const config = await getSiteConfig()

  return (
    <>
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
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'start',
        }}>
          {/* Lead form */}
          <div>
            <div className="eyebrow mb-8">Envíanos un mensaje</div>
            <h2 className="section-title mt-12 mb-32" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Obtén un estimado de ingresos gratis
            </h2>
            <LeadForm
              variant="light"
              source="contacto-page"
              locale="es"
            />
          </div>

          {/* Direct contact */}
          <div>
            <div className="eyebrow mb-8">Contacto directo</div>
            <h2 className="section-title mt-12 mb-32" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Escríbenos directamente
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank" rel="noopener"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px', background: 'var(--white)',
                  borderRadius: 'var(--r-md)', border: '1.5px solid var(--sand-dark)',
                  textDecoration: 'none', color: 'inherit', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>💬</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--charcoal)' }}>
                    WhatsApp
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>
                    Disponible 7am – 10pm · Respuesta en minutos
                  </div>
                </div>
              </a>

              <a
                href={`tel:${config.phone.replace(/\s/g, '')}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px', background: 'var(--white)',
                  borderRadius: 'var(--r-md)', border: '1.5px solid var(--sand-dark)',
                  textDecoration: 'none', color: 'inherit', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>📞</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--charcoal)' }}>
                    {config.phone}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>
                    Lun – Sáb 8am – 8pm hora MX
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${config.email}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px', background: 'var(--white)',
                  borderRadius: 'var(--r-md)', border: '1.5px solid var(--sand-dark)',
                  textDecoration: 'none', color: 'inherit', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>✉️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--charcoal)' }}>
                    {config.email}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>
                    Respuesta en 24 horas
                  </div>
                </div>
              </a>
            </div>

            <div style={{
              marginTop: 28,
              padding: '18px 22px',
              background: 'var(--sand)',
              borderRadius: 'var(--r-md)',
              fontSize: '0.83rem',
              color: 'var(--mid)',
              lineHeight: 1.65,
            }}>
              <strong style={{ color: 'var(--charcoal)' }}>Ubicación de la oficina</strong><br />
              {config.address}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

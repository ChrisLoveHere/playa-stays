// ============================================================
// /es/publica-tu-propiedad/page.tsx
// Spanish lead capture / list your property page.
// Mirrors EN /list-your-property/page.tsx fully translated.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getFAQs, getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { TrustBar, StepsGrid, CtaStrip } from '@/components/sections'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Publica tu Propiedad | Estimado de Ingresos Gratis | PlayaStays',
  description: 'Publica tu renta vacacional en Playa del Carmen con PlayaStays. Estimado de ingresos gratis basado en datos reales del mercado. 200+ propiedades administradas. Sin compromiso.',
  canonical: 'https://www.playastays.com/es/publica-tu-propiedad/',
  hreflangEn: 'https://www.playastays.com/list-your-property/',
})

export default async function PublicaTuPropiedadPage() {
  const { isEnabled: preview } = draftMode()

  const [faqs, config] = await Promise.all([
    getFAQs({ categorySlug: 'list-your-property', preview }),
    getSiteConfig(),
  ])

  const steps = [
    {
      num: 1,
      icon: <PhoneIcon />,
      title: 'Cuéntanos sobre tu propiedad',
      desc: 'Llena el formulario. Son 2 minutos. Revisamos cada solicitud el mismo día.',
    },
    {
      num: 2,
      icon: <ChartIcon />,
      title: 'Te enviamos tu estimado de ingresos',
      desc: 'Una proyección personalizada basada en datos reales de nuestro portafolio — en 24 horas.',
    },
    {
      num: 3,
      icon: <CameraIcon />,
      title: 'Nosotros lo configuramos todo',
      desc: 'Fotografía, anuncio, precios, cumplimiento legal. En Airbnb, VRBO y Booking.com en 7 días.',
    },
    {
      num: 4,
      icon: <MoneyIcon />,
      title: 'Recibes ingresos mensuales',
      desc: 'Depósitos mensuales en tu cuenta. Transparencia total a través de tu portal de propietario.',
    },
  ]

  //// Use ES answers when available, fall back to EN
const faqItems = faqs.map(f => ({
  // cast meta to any and use bracket notation for Spanish fields
  question: (f.meta as any)['ps_question_es'] || f.title.rendered,
  answer:   (f.meta as any)['ps_answer_es']   || f.meta.ps_answer,
}))

  return (
    <>
      <Hero
        variant="split"
        breadcrumbs={[
          { label: 'Inicio', href: '/es/' },
          { label: 'Publica tu Propiedad', href: null },
        ]}
        tag="🏡 Publica tu Propiedad"
        headline="Maximiza tus<br /><em>ingresos de renta</em><br />en el paraíso"
        sub="Administración integral de rentas vacacionales en la Riviera Maya. Nosotros nos encargamos de todo — tú recibes los ingresos."
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

      <TrustBar stats={[
        { val: '200+', key: 'Propiedades administradas' },
        { val: '4.9★', key: 'Satisfacción del propietario' },
        { val: '22%+', key: 'Aumento de ingresos' },
        { val: '24/7', key: 'Soporte local' },
        { val: 'ES/EN', key: 'Equipo bilingüe' },
        { val: '<5min', key: 'Respuesta a huéspedes' },
      ]} />

      <StepsGrid
        eyebrow="Cómo Funciona"
        headline="Del anuncio a los ingresos en 7 días"
        body="Nuestro proceso de incorporación es rápido, sistemático y sin complicaciones para ti."
        steps={steps}
      />

      {faqItems.length > 0 && (
        <section className="pad-lg bg-sand" id="faq">
          <div className="container" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'start',
          }}>
            <FaqAccordion
              eyebrow="Preguntas frecuentes"
              headline="FAQ"
              items={faqItems}
            />
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--r-lg)',
              padding: 32,
              boxShadow: 'var(--sh-sm)',
              border: '1px solid var(--sand-dark)',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem', fontWeight: 600,
                color: 'var(--charcoal)', marginBottom: 8,
              }}>
                ¿Aún tienes preguntas?
              </h3>
              <p className="body-sm mb-20">
                Nuestro equipo está disponible todos los días. Escríbenos por WhatsApp, teléfono o correo.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <a
                  href={`https://wa.me/${config.whatsapp}`}
                  className="btn btn-wa btn-full"
                  target="_blank" rel="noopener"
                >
                  Chatear por WhatsApp
                </a>
                <a href={`tel:${config.phone.replace(/\s/g, '')}`} className="btn btn-ghost btn-full">
                  {config.phone}
                </a>
                <a href={`mailto:${config.email}`} className="btn btn-ghost btn-full">
                  {config.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaStrip
        eyebrow="¿Listo para empezar?"
        headline="Obtén un estimado de ingresos gratis — sin compromisos, sin presión."
        cta={{ label: 'Obtener mi estimado →', href: '#estimate-form' }}
      />
    </>
  )
}

// Icons
function PhoneIcon()  { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a2 2 0 012-2z"/></svg> }
function ChartIcon()  { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> }
function CameraIcon() { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg> }
function MoneyIcon()  { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1"/></svg> }

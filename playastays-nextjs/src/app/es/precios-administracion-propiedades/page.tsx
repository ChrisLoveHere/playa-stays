// ============================================================
// /es/precios-administracion-propiedades/page.tsx
//
// Spanish global pricing hub — mirrors the EN hub at
// /property-management-pricing/ using the same layout and
// data, fully translated, with all city links in Spanish.
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getCitiesForNavigation, getSiteConfig } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { TrustBar, OwnerBanner, CtaStrip } from '@/components/sections'
import { PricingGrid } from '@/components/sections/PricingGrid'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { LeadForm } from '@/components/forms/LeadForm'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getPricingPlans, getPricingFAQs, getValueItems, CITY_PRICING, PRICING_HUB_PRIMARY_SLUGS } from '@/lib/pricing-data'
import { ComparisonTable } from '@/components/content/ComparisonTable'
import { RevenueCalculator } from '@/components/forms/RevenueCalculator'
import { PerformanceProof } from '@/components/trust/PerformanceProof'
import { OwnerDashboardPreview } from '@/components/trust/OwnerDashboardPreview'
import { TransparencySection } from '@/components/trust/TransparencySection'
import { BeforeAfter } from '@/components/trust/BeforeAfter'
import { TrustStack } from '@/components/trust/TrustStack'
import { FALLBACK_PORTFOLIO_STATS } from '@/lib/portfolio-stats'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Precios de Administración en Playa del Carmen y la Riviera Maya — Tarifas',
  description:
    'Tarifas transparentes de administración de rentas vacacionales (10–25% de ingresos brutos) en Playa del Carmen, Tulum, Puerto Morelos, Akumal, Xpu-Ha, Cozumel, Isla Mujeres y Quintana Roo. Compara mercados, usa la calculadora y revisa ejemplos locales.',
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
          name: '¿Cuánto cuesta la administración de rentas vacacionales en la Riviera Maya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'En los mercados turísticos de Quintana Roo, las tarifas de administración suelen oscilar entre el 10% y el 35% de los ingresos brutos. PlayaStays cobra entre el 10% y el 25% según plan y propiedad, sin comisión de configuración ni contratos largos — basado en desempeño.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Vale la pena la gestión profesional en Playa del Carmen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Las propiedades gestionadas por PlayaStays generan en promedio un 22–38% más de ingresos netos que las autogestionadas, incluso después de la comisión, gracias al precio dinámico, mayor ocupación y optimización premium del anuncio.',
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

const TRUST_STATS = [
  { val: '4.9★', key: 'Owner satisfaction' },
  { val: '22%+', key: 'Net income uplift' },
  { val: '24/7', key: 'Local support' },
  { val: 'ES/EN', key: 'Bilingual team' },
]

export default async function EsPricingHubPage() {
  const { isEnabled: preview } = draftMode()
  const [cities, config] = await Promise.all([getCitiesForNavigation(preview), getSiteConfig()])

  const plans     = getPricingPlans('es', 'Playa del Carmen', '/es/publica-tu-propiedad/')
  const faqs      = getPricingFAQs('es', 'Playa del Carmen / Riviera Maya')
  const valueItems = getValueItems('es')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Inicio', href: '/es/' },
            { label: 'Precios de administración', href: null },
          ]} />

          <div className="svc-hero-grid" style={{ marginTop: 12 }}>
            <div>
              <div className="hero-tag fade-1">💰 Precios de Administración</div>
              <h1
                className="display-title fade-2"
                style={{ fontSize: 'clamp(1.65rem,3.5vw,2.85rem)', marginBottom: 18, lineHeight: 1.08 }}
              >
                Precios de administración en<br /><em>Playa del Carmen y la Riviera Maya</em>
              </h1>
              <p className="fade-3" style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.77, maxWidth: 480, marginBottom: 28,
              }}>
                Las tarifas varían por mercado incluso dentro de Quintana Roo. PlayaStays cobra entre el 10% y el 25% de los ingresos brutos (basado en desempeño, sin comisión de configuración ni contrato largo).{' '}
                Salta a la <a href="#revenue-calculator" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>calculadora</a>,{' '}
                <a href="#choose-your-market" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>tu mercado</a> o{' '}
                <a href="#management-plans" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>los planes</a> — luego abre la página local para el contexto completo.
              </p>
              <div className="hero-inline-stats fade-4">
                <div><div className="stat-val">10–25%</div><div className="stat-key">Rango de comisión</div></div>
                <div><div className="stat-val">22–38%</div><div className="stat-key">Aumento de ingresos netos</div></div>
                <div><div className="stat-val">$0</div><div className="stat-key">Comisión de configuración</div></div>
              </div>
              <div className="fade-5" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
                <Link href="/es/publica-tu-propiedad/" className="btn btn-gold btn-lg">
                  Obtener estimado de ingresos gratis →
                </Link>
                <a href="https://wa.me/529841234567" className="btn btn-wa" target="_blank" rel="noopener">
                  💬 Hablar con un asesor local
                </a>
              </div>
              <div style={{ marginTop: 14 }}>
                <Link href="/es/playa-del-carmen/administracion-de-propiedades/" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
                  Ver servicios completos de administración →
                </Link>
              </div>
            </div>
            <div className="hero-form-card" id="estimate-form">
              <LeadForm
                variant="dark"
                source="precios-hub-hero"
                title="Estimado de ingresos gratis"
                subtitle="Datos reales del mercado. Sin compromiso. Respuesta en 24 horas."
              />
            </div>
          </div>
        </div>
      </section>

      <TrustBar stats={TRUST_STATS} locale="es" />

      {/* ── RESUMEN DE PRECIOS ───────────────────────────── */}
      <section className="pad-sm bg-ivory" id="pricing-summary">
        <div className="container" style={{ maxWidth: 920 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            alignItems: 'center',
          }}>
            <div>
              <div className="eyebrow mb-8">Cómo cobra PlayaStays</div>
              <p className="body-text" style={{ marginBottom: 0 }}>
                <strong>10–25%</strong> sobre ingresos brutos — basado en desempeño, sin comisión de configuración ni contrato largo. Misma banda en Quintana Roo; los{' '}
                <Link href="#management-plans" style={{ color: 'var(--teal)', fontWeight: 600 }}>planes Core / Plus / Pro</Link>{' '}
                reflejan profundidad de servicio, no un recargo oculto por ciudad.
              </p>
            </div>
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--sand-dark)',
              borderRadius: 'var(--r-lg)',
              padding: '18px 22px',
              fontSize: '0.88rem',
              color: 'var(--mid)',
              lineHeight: 1.65,
            }}>
              <strong style={{ color: 'var(--charcoal)' }}>Qué cambia por mercado:</strong> ADR y ocupación alcanzables, logística de huéspedes, intensidad de turnovers y competencia — no la lógica de la tarifa.
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO DIFIEREN LOS PRECIOS ───────────────────── */}
      <section className="pad-sm bg-sand">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="eyebrow mb-8">Riviera Maya y Quintana Roo</div>
          <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.45rem,2.6vw,2rem)' }}>
            Cómo difieren los precios según el mercado
          </h2>
          <p className="body-text mb-24" style={{ maxWidth: 720 }}>
            PlayaStays usa una estructura transparente basada en desempeño en todas las zonas donde operamos — pero <strong>tu</strong> resultado neto depende de la demanda local, la estacionalidad y cuánto trabajo operativo requiere tu propiedad. Las páginas por ciudad existen para que elijas el mercado que coincide con tu casa, sin depender de un solo promedio genérico de &ldquo;México&rdquo;.
          </p>
          <ul className="pricing-hub-market-diff-list">
            <li><strong>Playa del Carmen</strong> — mucho inventario, bandas de ADR profundas en zonas prime; la comisión premia calidad de anuncio y operación rápida.</li>
            <li><strong>Tulum</strong> — rango nocturno amplio y estacionalidad marcada; distribución y posicionamiento importan tanto como la tarifa.</li>
            <li><strong>Puerto Morelos</strong> — franja más tranquila, huéspedes recurrentes; la constancia supera perseguir volumen.</li>
            <li><strong>Akumal y Xpu-Ha</strong> — menor oferta / mix distinto (condominios frente al mar hasta villas grandes); la carga operativa escala con tamaño y expectativas.</li>
            <li><strong>Cozumel e Isla Mujeres</strong> — logística de isla (ferry, llegadas, salitre); mensajería y turnovers llevan más fricción que muchos condominios en tierra firme.</li>
          </ul>
        </div>
      </section>

      {/* ── CALCULADORA (arriba) ─────────────────────────── */}
      <section className="pad-lg bg-ivory" id="revenue-calculator">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <div className="eyebrow mb-8">Herramienta gratuita</div>
              <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
                Estima tus ingresos en la Riviera Maya
              </h2>
              <p className="body-text mb-24">
                Selecciona tu ciudad y tipo de propiedad para ver un estimado de ingresos inmediato bajo gestión profesional. Ajusta tu tarifa nocturna para un resultado personalizado.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['El precio dinámico aumenta la ocupación un 15% en promedio',
                  'La fotografía profesional aumenta las reservas hasta un 40%',
                  'Tasa de respuesta <5 min mejora la posición en Airbnb',
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.83rem', color: 'var(--mid)' }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
            <RevenueCalculator
              locale="es"
              estimateHref="/es/publica-tu-propiedad/"
            />
          </div>
        </div>
      </section>

      {/* ── PRECIOS POR MERCADO ──────────────────────────── */}
      <section className="pad-lg bg-ivory" id="choose-your-market">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 40px' }}>
            <div className="eyebrow mb-8">Elige tu mercado</div>
            <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.65rem,2.8vw,2.35rem)' }}>
              Compara precios locales y rangos de ingresos
            </h2>
            <p className="body-text">
              Cada destino tiene una página dedicada: qué mueve la comisión, contexto de ocupación y ADR, y escenarios de ejemplo — sin promedios genéricos de &ldquo;México&rdquo;.
            </p>
          </div>
          <div className="pricing-hub-market-grid">
            {PRICING_HUB_PRIMARY_SLUGS.map(slug => {
              const cityData = CITY_PRICING[slug]
              if (!cityData) return null
              return (
                <Link
                  key={cityData.slug}
                  href={`/es/${cityData.slug}/costo-administracion-propiedades/`}
                  className="pricing-hub-market-card"
                >
                  <div className="pricing-hub-market-card-inner">
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem', fontWeight: 600,
                      color: 'var(--charcoal)', marginBottom: 12,
                    }}>
                      {cityData.nameEs}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Tarifa nocturna</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--teal)' }}>{cityData.avgNightly}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Ocupación</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--teal)' }}>{cityData.avgOccupancy}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Competencia</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)' }}>{cityData.competitionLevelEs}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--light)', fontWeight: 700 }}>Comisión</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)' }}>10–25%</div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.78rem', fontWeight: 600, color: 'var(--teal)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      Ver desglose local completo →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <p className="body-sm" style={{ textAlign: 'center', marginTop: 28, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', color: 'var(--light)' }}>
            ¿Buscas{' '}
            <Link href="/es/chetumal/costo-administracion-propiedades/" style={{ color: 'var(--teal)', fontWeight: 600 }}>
              Chetumal
            </Link>
            ? Tiene un perfil de demanda distinto al corredor turístico — mantenemos un desglose aparte.
          </p>
        </div>
      </section>

      {/* ── PERFORMANCE PROOF ── */}
      <PerformanceProof
        stats={FALLBACK_PORTFOLIO_STATS}
        cityName="Playa del Carmen"
        locale="es"
        estimateHref="/es/publica-tu-propiedad/"
      />

      {/* ── OWNER DASHBOARD PREVIEW ── */}
      <OwnerDashboardPreview
        locale="es"
        cityName="Playa del Carmen"
        estimateHref="/es/publica-tu-propiedad/"
      />

      {/* ── PRICING PLANS ────────────────────────────────── */}
      <div id="management-plans">
        <PricingGrid
          eyebrow="Planes de Administración"
          headline="Tarifas claras. Sin sorpresas."
          body="Todos los planes son basados en desempeño — ganamos cuando tú ganas. Sin cuota de instalación, sin retención mensual."
          plans={plans}
        />
      </div>

      {/* ── BEFORE / AFTER ── */}
      <BeforeAfter
        locale="es"
        citySlug="playa-del-carmen"
        cityName="Playa del Carmen"
        estimateHref="/es/publica-tu-propiedad/"
      />

      {/* ── TRANSPARENCY SECTION ── */}
      <TransparencySection
        locale="es"
        estimateHref="/es/publica-tu-propiedad/"
        cityName="Playa del Carmen"
      />

      {/* ── WHY MEXICO ROI ────────────────────────────────── */}
      <section className="pad-lg bg-sand">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="eyebrow mb-8">Por qué la Riviera Maya</div>
            <h2 className="section-title mt-12 mb-16" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Por qué Playa del Carmen tiene uno de los mejores ROI de renta vacacional en Latinoamérica
            </h2>
            <p className="body-text mb-16">
              La Riviera Maya recibe más de 12 millones de turistas al año. La infraestructura turística — aeropuertos internacionales, carreteras, salud — es de primer mundo. Sin embargo, los precios de los inmuebles siguen siendo una fracción de los mercados de playa comparables en EE.UU.
            </p>
            <p className="body-text mb-16">
              Un condominio de 2 recámaras por $200,000 USD en Playa del Carmen generando $3,500/mes representa un rendimiento bruto del 8.4% — casi el doble de lo que generan propiedades equivalentes en Florida.
            </p>
            <p className="body-text mb-32">
              El motor estructural es la oferta: la construcción en los mejores barrios está limitada por el arrecife, los cenotes y el desarrollo existente. A medida que crece la demanda, las propiedades bien gestionadas en ubicaciones privilegiadas continúan apreciándose y generando ingresos.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Más de 12M de turistas anuales en la Riviera Maya',
                'Tres aeropuertos internacionales a menos de 90 minutos',
                'Mercado de renta a corto plazo mejor posicionado de México',
                'Rendimientos brutos del 8–12% en ubicaciones prime',
                'Demanda sólida en USD y EUR — precios en moneda dura',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.85rem', color: 'var(--mid)' }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-8">Comparativa global de tarifas</div>
            <h2 className="section-title mt-12 mb-20" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              Tarifas de administración por mercado
            </h2>
            {[
              { market: 'Playa del Carmen (PlayaStays)', range: '10–25%', note: 'Equipo local, sin subcontratación' },
              { market: 'Riviera Maya (competencia)', range: '20–35%', note: 'Promedio del mercado' },
              { market: 'Florida / Playas de EE.UU.', range: '20–30%', note: 'Más cuotas de instalación y limpieza' },
              { market: 'Costa española (gestión Airbnb)', range: '15–25%', note: 'Varía por operador' },
              { market: 'Bali / Sudeste Asiático', range: '20–30%', note: 'Más gastos locales obligatorios' },
              { market: 'Dubái gestión renta a corto plazo', range: '15–25%', note: 'Se requiere licencia DET' },
            ].map((row, i) => (
              <div key={i} style={{
                padding: '13px 0',
                borderBottom: i < 5 ? '1px solid var(--sand-dark)' : 'none',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 16,
                alignItems: 'start',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 2 }}>
                    {row.market}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--light)' }}>{row.note}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem', fontWeight: 700,
                  color: i === 0 ? 'var(--teal)' : 'var(--charcoal)',
                  whiteSpace: 'nowrap',
                }}>
                  {row.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE BREAKDOWN ──────────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
            <div className="eyebrow mb-8">Lo que incluye tu tarifa</div>
            <h2 className="section-title mt-12 mb-8">Lo que obtienes por tu comisión de gestión</h2>
            <p className="body-text">No subcontratamos. Nuestro equipo local en la Riviera Maya maneja todo.</p>
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

      {/* ── COMPARATIVA ─────────────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
            <div className="eyebrow mb-8">La diferencia</div>
            <h2 className="section-title mt-12 mb-8">Empresa típica vs PlayaStays</h2>
            <p className="body-text">Una comparación directa y profesional de lo que ofrecemos.</p>
          </div>
          <ComparisonTable locale="es" />
        </div>
      </section>

      {/* ── ENLACES RÁPIDOS POR CIUDAD ───────────────────── */}
      <section className="pad-lg bg-sand">
        <div className="container">
          <div className="eyebrow mb-8">Páginas locales</div>
          <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)' }}>
            Ir al desglose por ciudad
          </h2>
          <p className="body-text mb-16" style={{ maxWidth: 520 }}>
            Abre el mercado de tu propiedad: contexto de ADR y ocupación, factores de comisión y escenarios de ejemplo.
          </p>
          <p className="body-sm mb-32" style={{ maxWidth: 520, color: 'var(--light)' }}>
            ¿Prefieres la vista en tarjetas con ocupación y tarifas?{' '}
            <a href="#choose-your-market" style={{ color: 'var(--teal)', fontWeight: 600 }}>
              Vuelve a Elige tu mercado
            </a>
            {' '}arriba en esta guía.
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
                  {cityData.nameEs} →
                </Link>
              )
            })}
            <Link href="/es/chetumal/costo-administracion-propiedades/" className="btn btn-ghost">
              Chetumal (región / frontera) →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="pad-lg bg-ivory">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <FaqAccordion
            eyebrow="Preguntas frecuentes"
            headline="FAQ sobre precios"
            items={faqs}
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
              ¿Cuánto generaría tu propiedad?
            </h3>
            <p className="body-sm mb-20">
              Estimado personalizado gratis basado en datos reales del mercado. Sin compromiso — solo un panorama claro de tu potencial de ingresos.
            </p>
            <LeadForm variant="light" source="precios-hub-faq" />
          </div>
        </div>
      </section>

      {/* ── TRUST STACK ── */}
      <section className="pad-sm bg-ivory">
        <div className="container">
          <TrustStack locale="es" variant="grid" theme="light" />
        </div>
      </section>

      {/* ── FORMULARIO FINAL ────────────────────────────── */}
      <section className="pad-lg bg-sand" id="obtener-estimado">
        <div className="container" style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="eyebrow mb-8">Estimado personalizado</div>
            <h2 className="section-title mt-12 mb-8" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>
              ¿Cuánto generaría tu propiedad?
            </h2>
            <p className="body-text">
              Nuestro equipo local revisará tu propiedad y enviará una proyección real de ingresos — no un estimado genérico — en 24 horas.
            </p>
          </div>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-lg)', padding: 40, boxShadow: 'var(--sh-md)', border: '1px solid var(--sand-dark)' }}>
            <LeadForm
              variant="light"
              source="precios-hub-bottom"
              title="Obtener estimado de ingresos gratis"
              subtitle="Sin compromiso. Respuesta en 24 horas."
            />
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="¿Listo para empezar?"
        headline="Obtén un estimado de ingresos gratis — sin compromisos, sin presión."
        cta={{ label: 'Obtener mi estimado gratis →', href: '/es/publica-tu-propiedad/' }}
      />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/wordpress'
import { buildMetadata, aboutPageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Hero } from '@/components/hero/Hero'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Acerca de PlayaStays | Administración local de propiedades en la Riviera Maya',
  description:
    'PlayaStays apoya a propietarios ausentes y de segunda residencia en Playa del Carmen y la Riviera Maya con supervisión local, comunicación clara y operación práctica.',
  canonical: 'https://www.playastays.com/es/acerca-de-playastays/',
  hreflangEn: 'https://www.playastays.com/about/',
})

export default async function AcercaPage() {
  const config = await getSiteConfig()
  const waHref = `https://wa.me/${config.whatsapp}`

  return (
    <>
      <JsonLd data={aboutPageJsonLd('/es/acerca-de-playastays/')} />
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Inicio', href: '/es/' }, { label: 'Acerca de', href: null }]}
        tag="Acerca de PlayaStays"
        headline="Administración local y confiable en <em>Playa del Carmen</em> — para propietarios que buscan tranquilidad"
        sub="Trabajamos con quienes no están todo el año en destino: información clara, operación práctica y alguien en sitio que puede ver la propiedad, coordinar proveedores y reaccionar cuando surge lo imprevisto — en Playa del Carmen, la Riviera Maya y Quintana Roo."
        primaryCta={{ href: '/es/publica-tu-propiedad/', label: 'Solicitar estimación gratuita' }}
        secondaryCta={{ href: '/es/contacto/', label: 'Agendar una consulta' }}
        tertiaryCta={{ href: waHref, label: 'Escríbenos por WhatsApp' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Por qué existe PlayaStays</div>
          <h2 className="section-title mt-12 mb-24">La propiedad debería sentirse como un activo — no como un segundo empleo</h2>
          <div className="body-text" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p>
              Muchos propietarios aman Playa del Carmen y la Riviera Maya — pero la distancia, la zona horaria y el desgaste costero hacen que “delegar” sea más difícil de lo que parece. Los detalles pequeños se vuelven caros cuando no hay quien vigile en local.
            </p>
            <p>
              PlayaStays existe para dar a propietarios en el extranjero o ausentes una capa local en la que puedan confiar: supervisión real, comunicación útil y operación alineada con cómo quieren usar el inmueble — estancias cortas, estancias más largas o un esquema híbrido — sin que usted tenga que coordinar cada detalle desde lejos.
            </p>
          </div>
        </div>
      </section>

      <section className="pad-lg" style={{ background: 'var(--white)' }}>
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Qué nos distingue</div>
          <h2 className="section-title mt-12 mb-24">Presencia local, ejecución práctica</h2>
          <ul className="body-text trust-list">
            <li>
              <strong>Operamos donde está su propiedad.</strong> Visitas en sitio, coordinación con proveedores y respuesta oportuna superan las suposiciones remotas — sobre todo en un mercado costero con humedad, salitre, albercas y administración de condominios.
            </li>
            <li>
              <strong>Estrategia acorde a sus metas.</strong> Le ayudamos a pensar en esquemas de corto plazo, largo plazo o mixtos para que el plan coincida con su tolerancia al riesgo, flujo de efectivo y frecuencia de uso.
            </li>
            <li>
              <strong>Visibilidad para el propietario.</strong> Actualizaciones e informes estructurados para que sepa qué pasó, cuánto costó y qué sigue — sin perseguir respuestas entre zonas horarias.
            </li>
            <li>
              <strong>Coordinación ordenada.</strong> Mantenimiento, limpiezas y trámites con administración o vecindario encajan en un ritmo claro — para huéspedes y residentes con estándares consistentes y problemas detectados a tiempo.
            </li>
            <li>
              <strong>Operación con sentido normativo.</strong> Trabajamos de forma que respete reglas comunitarias y requisitos de plataformas; lo concreto depende de su condominio, municipio y canales — seremos claros sobre qué aplica a su caso sin promesas genéricas.
            </li>
          </ul>
        </div>
      </section>

      <section className="pad-lg bg-ivory">
        <div className="container trust-prose">
          <div className="eyebrow mb-8">A quién servimos</div>
          <h2 className="section-title mt-12 mb-24">Pensado para quienes necesitan estructura y comunicación</h2>
          <ul className="body-text trust-list">
            <li>Propietarios ausentes que requieren un socio local confiable</li>
            <li>Segundas residencias: visita a veces, pero sin operar desde la maleta</li>
            <li>Inversionistas en condominio con supervisión profesional e informes claros</li>
            <li>Propietarios de villas o casas unifamiliares con mayor coordinación y proveedores</li>
            <li>Quienes valoran respuesta, transparencia y una relación a largo plazo</li>
          </ul>
        </div>
      </section>

      <section className="pad-lg" style={{ background: 'var(--white)' }}>
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Fundador</div>
          <h2 className="section-title mt-12 mb-24">Chris Love</h2>
          <p className="body-text mb-16" style={{ color: 'var(--mid)', fontSize: '0.95rem' }}>
            Fundador, PlayaStays
          </p>
          <div className="body-text" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p>
              Chris fundó PlayaStays con un enfoque claro: experiencia del propietario, sistemas disciplinados y calidad de gestión anclada en el día a día de Playa del Carmen y la Riviera Maya. Usa Airbnb desde 2012; años de viajes y vivir en distintos mercados informan cómo diseñamos comunicación, experiencia del huésped y ejecución local.
            </p>
            <p>
              No encontrará aquí una galería de perfiles inventados. El trabajo cotidiano lo realiza nuestro <strong>equipo de operaciones local en Playa del Carmen</strong> — las mismas personas que coordinan proveedores, entradas/salidas y comunicación con huéspedes para que usted obtenga constancia, no discursos en diapositivas.
            </p>
            <p className="mb-0">
              <strong>Oficina:</strong> Calle 34 Nte 103, Zazil-ha, 77720 Playa del Carmen, Q.R., México ·{' '}
              <a href="tel:+529842420434" className="trust-link">
                +52 984 242 0434
              </a>
              {' · '}
              <a href="mailto:Chris@PlayaStays.com" className="trust-link">
                Chris@PlayaStays.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="pad-lg bg-ivory">
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Cómo trabajamos con propietarios</div>
          <h2 className="section-title mt-12 mb-24">Valores que encajan con una propiedad seria</h2>
          <ul className="body-text trust-list">
            <li>
              <strong>Transparencia.</strong> Expectativas claras, decisiones documentadas e informes en los que puede confiar.
            </li>
            <li>
              <strong>Respuesta.</strong> Cuando algo requiere atención, no debe quedar la duda de si alguien vio el mensaje.
            </li>
            <li>
              <strong>Disciplina operativa.</strong> Priorizamos procesos sostenibles — para su inmueble, sus huéspedes y su reputación en el condominio o la comunidad.
            </li>
            <li>
              <strong>Asociación a largo plazo.</strong> Estamos orientados a propietarios que buscan estabilidad con su administrador — no un carrusel de excusas.
            </li>
            <li>
              <strong>Valor del activo.</strong> Una buena administración es preventiva: mantenimiento, presentación y experiencia del huésped impactan reventa y desempeño en renta.
            </li>
          </ul>
        </div>
      </section>

      <section className="pad-lg" style={{ background: 'var(--white)' }}>
        <div className="container trust-prose">
          <div className="eyebrow mb-8">Qué aporta una gestión local sólida</div>
          <h2 className="section-title mt-12 mb-24">Menos estrés. Menos sorpresas.</h2>
          <ul className="body-text trust-list">
            <li>Menos viajes de emergencia por problemas pequeños que nadie vio a tiempo</li>
            <li>Mejores resultados para huéspedes y vecinos cuando los estándares se mantienen</li>
            <li>Visión más clara de ingresos, costos y estado físico del inmueble</li>
            <li>Confianza en que alguien local asume responsabilidad — no solo un correo en el extranjero</li>
          </ul>
        </div>
      </section>

      <section className="pad-lg bg-ivory">
        <div className="container">
          <div
            className="trust-cta"
            style={{
              maxWidth: 720,
              margin: '0 auto',
              padding: 'clamp(28px, 4vw, 40px)',
              borderRadius: 'var(--r-md)',
              background: 'linear-gradient(135deg, var(--deep) 0%, #0e3a40 100%)',
              color: 'rgba(255,255,255,0.92)',
              textAlign: 'center',
            }}
          >
            <h2 className="section-title mb-16" style={{ color: 'var(--white)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Cuéntenos sobre su propiedad
            </h2>
            <p className="body-text mb-28" style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Comience con una estimación gratuita, agende una consulta o escríbanos por WhatsApp — le ayudamos a entender opciones sin presión.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/es/publica-tu-propiedad/" className="btn btn-gold btn-lg">
                Solicitar estimación gratuita
              </Link>
              <Link href="/es/contacto/" className="btn btn-outline">
                Contacto
              </Link>
              <a href={waHref} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

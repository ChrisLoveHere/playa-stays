import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { SITE_CONTACT_EMAIL } from '@/lib/site-contact'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Política de privacidad | PlayaStays',
  description:
    'Cómo PlayaStays recopila, usa y protege la información personal cuando usa nuestro sitio y se comunica sobre administración de propiedades en la Riviera Maya.',
  canonical: 'https://www.playastays.com/es/privacidad/',
  hreflangEn: 'https://www.playastays.com/privacy/',
})

export default function PrivacidadPage() {
  const updated = '2026-04-06'

  return (
    <>
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Inicio', href: '/es/' }, { label: 'Privacidad', href: null }]}
        tag="Legal"
        headline="Política de <em>privacidad</em>"
        sub="Esta política explica qué recopilamos a través de este sitio, cómo lo usamos y cómo puede contactarnos. Es un resumen práctico — no sustituye asesoría legal para su caso particular."
      />
      <section className="pad-lg bg-ivory">
        <div className="container trust-prose legal-section">
          <p>
            <strong>Responsable.</strong> PlayaStays opera este sitio para compartir información sobre administración de rentas vacacionales, administración de propiedades y servicios relacionados en Playa del Carmen, la Riviera Maya y Quintana Roo. Para temas de privacidad:{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            . Dirección postal: Calle 34 Nte 103, Zazil-ha, 77720 Playa del Carmen, Q.R., México.
          </p>

          <h2>Información que recopilamos</h2>
          <p>
            <strong>Datos que usted nos proporciona.</strong> Al enviar un formulario de contacto o lead, recopilamos los campos que decida enviar — por lo general nombre, correo, teléfono, ubicación o tipo de propiedad y el mensaje — para poder responder. Si nos escribe por correo o mensaje directo, conservamos esas comunicaciones como parte del seguimiento de su consulta.
          </p>
          <p>
            <strong>Datos técnicos.</strong> Como la mayoría de los sitios, nuestro alojamiento e infraestructura pueden procesar automáticamente información técnica como dirección IP, tipo de navegador, tipo de dispositivo, región geográfica general (por ejemplo país o ciudad), URL de referencia y páginas vistas. Lo usamos para operar, asegurar y mejorar el sitio.
          </p>

          <h2>Cómo usamos la información</h2>
          <p>
            Utilizamos datos personales para responder consultas, proporcionar estimaciones o consultas cuando lo solicite, coordinar seguimiento, prestar o mejorar nuestros servicios si contrata a PlayaStays, y cumplir obligaciones legales o de seguridad aplicables. No vendemos su información personal como mercancía.
          </p>

          <h2>Formularios de contacto y leads</h2>
          <p>
            Al enviar un formulario, la información llega a nuestro equipo mediante el flujo habitual del sitio (incluido correo o herramientas tipo CRM para dar respuesta). El envío por sí solo no crea una relación de cliente; inicia una conversación. Puede pedirnos que dejemos comunicación comercial de seguimiento respondiendo a un correo o escribiendo a{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            .
          </p>

          <h2>Cookies y analítica</h2>
          <p>
            El sitio puede usar cookies o tecnologías similares para funciones esenciales (por ejemplo sesión o seguridad), preferencias cuando aplique, y medición limitada para entender el uso de las páginas. Puede controlar o eliminar cookies desde su navegador; bloquear algunas puede afectar ciertas funciones.
          </p>

          <h2>Servicios de terceros</h2>
          <p>
            Dependemos de proveedores habituales para operar el sitio y comunicarnos — por ejemplo alojamiento seguro, envío de correo, procesamiento de formularios, analítica o integraciones de mensajería. Esos proveedores tratan datos solo en la medida necesaria para su servicio y con expectativas razonables de confidencialidad y seguridad. Los enlaces a sitios de terceros (por ejemplo Airbnb o redes sociales) se rigen por las políticas de esas partes.
          </p>

          <h2>Conservación</h2>
          <p>
            Conservamos la información el tiempo necesario para los fines anteriores, registros comerciales razonables, resolver disputas y cumplir requisitos legales. Los plazos varían según el tipo de dato y el contexto.
          </p>

          <h2>Seguridad</h2>
          <p>
            Aplicamos medidas razonables de índole administrativa y técnica para proteger la información frente a acceso no autorizado, pérdida o uso indebido. Ningún sitio o correo es totalmente seguro; no envíe información altamente sensible salvo que hayamos acordado un canal seguro.
          </p>

          <h2>Sus opciones</h2>
          <p>
            Según donde viva, puede tener derechos de acceso, rectificación, supresión o restricción de cierto tratamiento. Para solicitarlo, escriba a{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            . Podemos necesitar verificar su identidad antes de atender ciertas solicitudes.
          </p>

          <h2>Menores</h2>
          <p>
            Este sitio está dirigido a adultos que consultan temas inmobiliarios. No recopilamos a sabiendas datos personales de menores.
          </p>

          <h2>Cambios</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. La fecha de “Última actualización” refleja revisiones sustanciales cuando las publiquemos.
          </p>

          <p style={{ fontSize: '0.85rem', color: 'var(--light)', marginTop: 28 }}>
            Última actualización: {updated}. Esta página se ofrece con fines de transparencia y no constituye asesoría legal. Para asuntos regulados o de alto riesgo, consulte a un profesional capacitado.
          </p>
          <p className="body-text" style={{ marginTop: 16 }}>
            <Link href="/es/contacto/" className="trust-link">
              Contactar a PlayaStays
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

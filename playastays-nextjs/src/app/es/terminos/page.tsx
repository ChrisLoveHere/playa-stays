import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Hero } from '@/components/hero/Hero'
import { SITE_CONTACT_EMAIL } from '@/lib/site-contact'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Términos de uso | PlayaStays',
  description:
    'Términos de uso del sitio web de PlayaStays: contenido informativo, consultas, estimaciones, limitaciones y contacto.',
  canonical: 'https://www.playastays.com/es/terminos/',
  hreflangEn: 'https://www.playastays.com/terms/',
})

export default function TerminosPage() {
  const updated = '2026-04-06'

  return (
    <>
      <Hero
        variant="centred"
        breadcrumbs={[{ label: 'Inicio', href: '/es/' }, { label: 'Términos', href: null }]}
        tag="Legal"
        headline="Términos de <em>uso</em>"
        sub="Estos términos rigen el uso de este sitio web. Los acuerdos por escrito por separado aplican cuando contrata formalmente los servicios de PlayaStays."
      />
      <section className="pad-lg bg-ivory">
        <div className="container trust-prose legal-section">
          <h2>Aceptación de los términos</h2>
          <p>
            Al acceder o usar www.playastays.com (el “Sitio”), acepta estos Términos de uso. Si no está de acuerdo, absténgase de usar el Sitio.
          </p>

          <h2>Naturaleza del sitio</h2>
          <p>
            El Sitio ofrece información general sobre PlayaStays, nuestros servicios y mercados en los que trabajamos (incluidos Playa del Carmen, la Riviera Maya y Quintana Roo). El contenido es informativo y puede cambiar sin previo aviso. Nada en el Sitio garantiza resultados futuros, disponibilidad, precios o desempeño para un inmueble determinado.
          </p>

          <h2>Sin asesoría profesional</h2>
          <p>
            Nada en el Sitio constituye asesoría legal, fiscal, contable, migratoria o de inversión. Las decisiones sobre propiedad, regulación de rentas, contratos o impuestos deben tomarse con profesionales calificados que conozcan su situación.
          </p>

          <h2>Consultas, estimaciones y consultorías</h2>
          <p>
            Los formularios de contacto, estimaciones y conversaciones informales sirven para evaluar si somos una buena opción. No crean un acuerdo de servicio vinculante hasta que ambas partes lo acuerden por escrito (o según una propuesta o contrato que le proporcionemos). Cifras, ejemplos o ilustraciones en el Sitio no son ofertas que se acepten solo por navegar.
          </p>

          <h2>Información de propiedades y anuncios</h2>
          <p>
            Cuando el Sitio describe propiedades en renta, disponibilidad, amenidades o precios, la información puede provenir de propietarios, plataformas o terceros y cambiar en cualquier momento. No garantizamos que todos los detalles estén libres de error o actualizados. Confirme hechos materiales antes de decidir en función de ellos.
          </p>

          <h2>Uso aceptable</h2>
          <p>
            Se compromete a no hacer un uso indebido del Sitio — por ejemplo intentar interrumpir servidores, extraer contenido en violación de términos aplicables, cargar malware o usar el Sitio para fines ilícitos. Podemos suspender o bloquear el acceso que razonablemente consideremos contrario a estas reglas o que amenace la seguridad.
          </p>

          <h2>Propiedad intelectual</h2>
          <p>
            El nombre y marca PlayaStays, textos, diseño, gráficos y demás contenido del Sitio son propiedad de PlayaStays o sus licenciantes. No puede copiar, reproducir, distribuir ni crear obras derivadas sin autorización previa por escrito, salvo visualización personal o compartir enlaces de página en uso ordinario.
          </p>

          <h2>Enlaces de terceros</h2>
          <p>
            El Sitio puede enlazar a sitios o servicios de terceros (por ejemplo plataformas de reserva o redes sociales). Esos sitios tienen sus propios términos y políticas de privacidad; no somos responsables de su contenido o prácticas.
          </p>

          <h2>Exención de garantías</h2>
          <p>
            El Sitio se ofrece “tal cual” y “según disponibilidad.” En la medida máxima permitida por la ley, PlayaStays renuncia a todas las garantías, expresas o implícitas, incluidas comerciabilidad, idoneidad para un fin particular y no infracción. No garantizamos que el Sitio sea ininterrumpido, libre de errores o libre de componentes dañinos.
          </p>

          <h2>Limitación de responsabilidad</h2>
          <p>
            En la medida máxima permitida por la ley, PlayaStays y su fundador, equipo y proveedores no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, ni por lucro cesante, datos o fondo de comercio, derivados del uso del Sitio o de la confianza en su contenido — aunque se nos haya advertido de tales daños. Nuestra responsabilidad total por cualquier reclamo relacionado con el Sitio no excederá el mayor entre (a) lo que haya pagado solo por acceder al Sitio en los doce meses anteriores al reclamo (típicamente cero) o (b) cien dólares estadounidenses (USD $100), salvo donde tales límites estén prohibidos por la ley aplicable.
          </p>

          <h2>Indemnización</h2>
          <p>
            Usted acepta defender e indemnizar a PlayaStays frente a reclamos derivados del uso indebido del Sitio, del incumplimiento de estos términos o de la violación de derechos de terceros, en la medida permitida por la ley.
          </p>

          <h2>Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos deben interpretarse de manera comercialmente razonable. Si accede al Sitio desde fuera de México, usted es responsable del cumplimiento de las leyes locales. Para controversias relacionadas únicamente con el uso de este Sitio (no con contratos de servicio por separado), estas condiciones se rigen por las leyes aplicables en México, sin perjuicio de protecciones obligatorias al consumidor que puedan corresponder en su país. Los tribunales con sede en Quintana Roo, México, pueden tener jurisdicción sobre dichas controversias cuando la ley lo permita.
          </p>

          <h2>Cambios</h2>
          <p>
            Podemos actualizar estos términos periódicamente. El uso continuado del Sitio tras los cambios implica la aceptación de los términos revisados. La fecha inferior indica la última revisión.
          </p>

          <h2>Contacto</h2>
          <p>
            Preguntas sobre estos términos:{' '}
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="trust-link">
              {SITE_CONTACT_EMAIL}
            </a>
            , o use las opciones en nuestra página de{' '}
            <Link href="/es/contacto/" className="trust-link">
              contacto
            </Link>
            .
          </p>

          <p style={{ fontSize: '0.85rem', color: 'var(--light)', marginTop: 28 }}>
            Última actualización: {updated}. Este resumen no sustituye asesoría legal. Revíselo con profesionales para su situación.
          </p>
        </div>
      </section>
    </>
  )
}

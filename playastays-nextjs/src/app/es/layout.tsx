import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import { headers } from 'next/headers'
import { getCities, getSiteConfig } from '@/lib/wordpress'
import { getAltLangHref, serviceLabel, t } from '@/lib/i18n'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { PreviewBar } from '@/components/layout/PreviewBar'

// ES layout inherits globals.css from the root layout.
// It sets lang="es" and passes locale="es" to Nav and Footer.

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.playastays.com'),
  title: {
    default: 'PlayaStays — Administración de Propiedades | Playa del Carmen & Riviera Maya',
    template: '%s | PlayaStays',
  },
  description: 'PlayaStays es la empresa líder en administración de propiedades vacacionales en Playa del Carmen. 200+ propiedades. Maximiza tus ingresos.',
}

export default async function EsLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isPreview } = draftMode()
  const headersList = headers()
  const pathname    = headersList.get('x-pathname') ?? '/es/'

  const [cities, config] = await Promise.all([getCities(), getSiteConfig()])

  const s       = t('es')
  const altLang = getAltLangHref(pathname)

  const services = [
    {
      label: serviceLabel('property-management', 'es'),
      href:  '/es/playa-del-carmen/administracion-de-propiedades/',
      desc:  'Gestión integral de rentas',
    },
    {
      label: serviceLabel('airbnb-management', 'es'),
      href:  '/es/playa-del-carmen/administracion-airbnb/',
      desc:  'Rendimiento 5 estrellas',
    },
    {
      label: serviceLabel('vacation-rentals', 'es'),
      href:  '/es/playa-del-carmen/rentas-vacacionales/',
      desc:  'Rentas vacacionales gestionadas',
    },
    {
      label: serviceLabel('sell-property', 'es'),
      href:  '/es/playa-del-carmen/vender-propiedad/',
      desc:  'Acceso al mercado y asesoría',
    },
    {
      label: 'Precios de Administración',
      href:  '/es/precios-administracion-propiedades/',
      desc:  'Tarifas, planes y ejemplos de ingresos',
    },
  ]

  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {isPreview && <PreviewBar />}
        <Nav
          cities={cities}
          services={services}
          config={config}
          locale="es"
          altLangHref={altLang}
          homeHref="/es/"
          rentalsHref="/es/rentas/"
          blogHref="/es/blog/"
          estimateHref="/es/publica-tu-propiedad/"
          contactHref="/es/contacto/"
        />
        <main>{children}</main>
        <Footer cities={cities} config={config} locale="es" />
        <div className="sticky-cta" aria-hidden="true">
          <a href="/es/publica-tu-propiedad/" className="btn btn-gold">{s.ctaGetEstimate}</a>
          <a href={`https://wa.me/${config.whatsapp}`} className="btn btn-wa" target="_blank" rel="noopener">
            {s.ctaWhatsApp}
          </a>
        </div>
      </body>
    </html>
  )
}

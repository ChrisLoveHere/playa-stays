import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import { headers } from 'next/headers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getCities, getSiteConfig } from '@/lib/wordpress'
import { getAltLangHref, serviceLabel, t } from '@/lib/i18n'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { PreviewBar } from '@/components/layout/PreviewBar'
import '@/styles/globals.css'

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
    default: 'PlayaStays — Vacation Rental Management | Playa del Carmen & Riviera Maya',
    template: '%s | PlayaStays',
  },
  description: "PlayaStays is Playa del Carmen's leading property management company. 200+ managed properties.",
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isPreview } = draftMode()
  const headersList = headers()
  const pathname    = headersList.get('x-pathname') ?? '/'

  const [cities, config] = await Promise.all([getCities(), getSiteConfig()])

  const s        = t('en')
  const altLang  = getAltLangHref(pathname)

  const services = [
    {
      label: serviceLabel('property-management', 'en'),
      href:  '/playa-del-carmen/property-management/',
      desc:  'Full-service rental management',
    },
    {
      label: serviceLabel('airbnb-management', 'en'),
      href:  '/playa-del-carmen/airbnb-management/',
      desc:  '5-star performance',
    },
    {
      label: serviceLabel('vacation-rentals', 'en'),
      href:  '/playa-del-carmen/vacation-rentals/',
      desc:  'Managed vacation rentals',
    },
    {
      label: serviceLabel('sell-property', 'en'),
      href:  '/playa-del-carmen/sell-property/',
      desc:  'Market access & guidance',
    },
    {
      label: 'Management Pricing',
      href:  '/property-management-pricing/',
      desc:  'Fees, plans & income examples',
    },
  ]

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {isPreview && <PreviewBar />}
        <Nav
          cities={cities}
          services={services}
          config={config}
          locale="en"
          altLangHref={altLang}
          homeHref="/"
          rentalsHref="/rentals/"
          blogHref="/blog/"
          estimateHref="/list-your-property/"
          contactHref="/contact/"
        />
        <main>{children}</main>
        <Footer cities={cities} config={config} locale="en" />
        <div className="sticky-cta" aria-hidden="true">
          <a href="/list-your-property/" className="btn btn-gold">{s.ctaGetEstimate}</a>
          <a href={`https://wa.me/${config.whatsapp}`} className="btn btn-wa" target="_blank" rel="noopener">
            {s.ctaWhatsApp}
          </a>
        </div>
        <SpeedInsights />
      </body>
    </html>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import type { City, SiteConfig } from '@/types'
import { buildNavServices, getAltLangHref, localeFromPath, t } from '@/lib/i18n'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { PreviewBar } from '@/components/layout/PreviewBar'

const PRIVATE_ROUTE_PREFIXES = ['/admin', '/portal', '/login']

const STICKY_CTA_SUPPRESSED = [
  '/contact',
  '/list-your-property',
  '/es/contacto',
  '/es/publica-tu-propiedad',
]

function shouldHideStickyCta(pathname: string): boolean {
  const n = pathname.endsWith('/') ? pathname.slice(0, -1) || '/' : pathname
  return STICKY_CTA_SUPPRESSED.some(p => n === p || n.startsWith(p + '/'))
}

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_ROUTE_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export function AppChrome({
  children,
  cities,
  config,
  isPreview,
}: {
  children: React.ReactNode
  cities: City[]
  config: SiteConfig
  isPreview: boolean
}) {
  const pathname = usePathname() ?? '/'
  const privateShell = isPrivatePath(pathname)

  if (privateShell) {
    return <>{children}</>
  }

  const hideStickyCta = shouldHideStickyCta(pathname)
  const locale = localeFromPath(pathname)
  const s = t(locale)
  const altLang = getAltLangHref(pathname)
  const isEs = locale === 'es'
  const services = buildNavServices(locale)

  return (
    <>
      {isPreview ? <PreviewBar /> : null}
      <Nav
        cities={cities}
        services={services}
        config={config}
        locale={locale}
        altLangHref={altLang}
        homeHref={isEs ? '/es/' : '/'}
        pricingHref={isEs ? '/es/precios-administracion-propiedades/' : '/property-management-pricing/'}
        rentalsHref={isEs ? '/es/rentas/' : '/rentals/'}
        blogHref={isEs ? '/es/blog/' : '/blog/'}
        estimateHref={isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'}
        contactHref={isEs ? '/es/contacto/' : '/contact/'}
        draftPreview={isPreview}
      />
      <main>{children}</main>
      <Footer config={config} />
      {!hideStickyCta ? (
        <div className="sticky-cta" aria-hidden="true">
          <a href={isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'} className="btn btn-gold">
            {s.ctaGetEstimate}
          </a>
          <a href={`https://wa.me/${config.whatsapp}`} className="btn btn-wa" target="_blank" rel="noopener">
            {s.ctaWhatsApp}
          </a>
        </div>
      ) : null}
    </>
  )
}

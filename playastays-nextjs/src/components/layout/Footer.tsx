import Link from 'next/link'
import type { City, SiteConfig } from '@/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

interface FooterProps {
  cities: City[]
  config: SiteConfig
  locale?: Locale
}

export function Footer({ cities, config, locale = 'en' }: FooterProps) {
  const s       = t(locale)
  const isEs    = locale === 'es'
  const base    = isEs ? '/es' : ''
  const pmHref  = isEs
    ? '/es/playa-del-carmen/administracion-de-propiedades/'
    : '/playa-del-carmen/property-management/'
  const abHref  = isEs
    ? '/es/playa-del-carmen/administracion-airbnb/'
    : '/playa-del-carmen/airbnb-management/'
  const estHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const sellHref= isEs ? '/es/playa-del-carmen/vender-propiedad/' : '/playa-del-carmen/sell-property/'
  const rentHref= isEs ? '/es/rentas/' : '/rentals/'
  const blogHref= isEs ? '/es/blog/' : '/blog/'
  const ctcHref = isEs ? '/es/contacto/' : '/contact/'

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">PlayaStays</div>
            <p className="footer-tagline">{s.footerTagline}</p>
            <div className="footer-contacts">
              <a href={`tel:${config.phone.replace(/\s/g,'')}`} className="footer-contact">
                <PhoneIcon />{config.phone}
              </a>
              <a href={`https://wa.me/${config.whatsapp}`} className="footer-contact" target="_blank" rel="noopener">
                <ChatIcon />WhatsApp (7am – 10pm)
              </a>
              <a href={`mailto:${config.email}`} className="footer-contact">
                <MailIcon />{config.email}
              </a>
            </div>
            <div className="footer-socials">
              {config.social.facebook  && <a href={config.social.facebook}  className="footer-social" target="_blank" rel="noopener" aria-label="Facebook">fb</a>}
              {config.social.instagram && <a href={config.social.instagram} className="footer-social" target="_blank" rel="noopener" aria-label="Instagram">ig</a>}
              {config.social.linkedin  && <a href={config.social.linkedin}  className="footer-social" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>}
            </div>
          </div>

          <div className="footer-col">
            <h5>{s.footerServices}</h5>
            <div className="footer-links">
              <Link href={pmHref}   className="highlight">{isEs ? 'Administración de Propiedades' : 'Property Management'}</Link>
              <Link href={abHref}>  {isEs ? 'Administración Airbnb' : 'Airbnb Management'}</Link>
              <Link href={estHref}> {isEs ? 'Estimado de Ingresos' : 'Free Revenue Estimate'}</Link>
              <Link href={sellHref}>{isEs ? 'Vender tu Propiedad' : 'Sell Your Property'}</Link>
            </div>
          </div>

          <div className="footer-col">
            <h5>{s.footerLocations}</h5>
            <div className="footer-links">
              {cities.map(c => (
                <Link key={c.slug} href={`${base}/${c.slug}/`}>{c.title.rendered}</Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h5>{s.footerCompany}</h5>
            <div className="footer-links">
              <Link href={rentHref}>{isEs ? 'Ver Rentas' : 'Browse Rentals'}</Link>
              <Link href={blogHref}>{isEs ? 'Blog' : 'Blog'}</Link>
              <Link href={ctcHref}> {isEs ? 'Contacto' : 'Contact'}</Link>
              <Link href={estHref}> {isEs ? 'Publicar Propiedad' : 'List Your Property'}</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{s.footerCopy}</p>
          <nav className="footer-legal" aria-label="Legal">
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

function PhoneIcon() {
  return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a2 2 0 012-2z"/></svg>
}
function ChatIcon() {
  return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
}
function MailIcon() {
  return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import type { SiteConfig } from '@/types'
import { t, localeFromPath } from '@/lib/i18n'
import { SITE_BUSINESS_ADDRESS } from '@/lib/site-contact'
import { googleMapsPlaceSearchUrl } from '@/lib/google-maps-embed'
import { FOOTER_LOCATION_HUBS } from '@/lib/footer-location-hubs'

interface FooterProps {
  config: SiteConfig
}

export function Footer({ config }: FooterProps) {
  const pathname = usePathname() ?? '/'
  const locale = localeFromPath(pathname)
  const s = t(locale)
  const isEs = locale === 'es'
  const base = isEs ? '/es' : ''
  const pmHref = isEs ? '/es/administracion-de-propiedades/' : '/property-management/'
  const abHref = isEs ? '/es/administracion-airbnb/' : '/airbnb-management/'
  const vrHref = isEs ? '/es/gestion-rentas-vacacionales/' : '/vacation-rental-management/'
  const estHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const sellHref = isEs ? '/es/vender-propiedad/' : '/sell-property/'
  const rentHref = isEs ? '/es/rentas/' : '/rentals/'
  const blogHref = isEs ? '/es/blog/' : '/blog/'
  const ctcHref = isEs ? '/es/contacto/' : '/contact/'
  const aboutHref = isEs ? '/es/acerca-de-playastays/' : '/about/'
  const privacyHref = isEs ? '/es/privacidad/' : '/privacy/'
  const termsHref = isEs ? '/es/terminos/' : '/terms/'
  const pricingHref = isEs
    ? '/es/precios-administracion-propiedades/'
    : '/property-management-pricing/'

  const socialRow = (
    <nav className="footer-mid__social" aria-label="Social media">
      {config.social.facebook && (
        <a
          href={config.social.facebook}
          className="footer-social footer-social--facebook"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF className="footer-social__icon" size={20} aria-hidden />
        </a>
      )}
      {config.social.instagram && (
        <a
          href={config.social.instagram}
          className="footer-social footer-social--instagram"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram className="footer-social__icon" size={20} aria-hidden />
        </a>
      )}
      {config.social.linkedin && (
        <a
          href={config.social.linkedin}
          className="footer-social footer-social--linkedin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn className="footer-social__icon" size={20} aria-hidden />
        </a>
      )}
    </nav>
  )

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">PlayaStays</div>
            <p className="footer-tagline">{s.footerTagline}</p>
            <p style={{ marginBottom: 14 }}>
              <Link href={ctcHref} className="footer-contact-page-link">
                {s.footerContact} →
              </Link>
            </p>
            <div className="footer-contacts">
              <a href={`tel:${config.phone.replace(/\s/g, '')}`} className="footer-contact">
                <PhoneIcon />
                {config.phone}
              </a>
              <a
                href={`https://wa.me/${config.whatsapp}`}
                className="footer-contact"
                target="_blank"
                rel="noopener"
              >
                <ChatIcon />
                WhatsApp (7am – 10pm)
              </a>
              <a href={`mailto:${config.email}`} className="footer-contact">
                <MailIcon />
                {config.email}
              </a>
            </div>
            <p className="footer-address">{SITE_BUSINESS_ADDRESS}</p>
            <a
              href={googleMapsPlaceSearchUrl()}
              className="footer-maplink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.footerDirections}
            </a>
          </div>

          <div className="footer-mid">
            <div className="footer-mid__cols">
              <div className="footer-col">
                <h5>{s.footerServices}</h5>
                <div className="footer-links">
                  <Link href={pmHref} className="highlight">
                    {s.footerPm}
                  </Link>
                  <Link href={abHref}> {s.footerAirbnb}</Link>
                  <Link href={vrHref}>{s.footerVacationRental}</Link>
                  <Link href={sellHref}>{s.footerSellProperty}</Link>
                </div>
              </div>

              <div className="footer-col">
                <h5>{s.footerLocations}</h5>
                <div className="footer-links">
                  {FOOTER_LOCATION_HUBS.map((h) => (
                    <Link key={h.slug} href={`${base}/${h.slug}/`}>
                      {isEs ? h.labelEs : h.labelEn}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="footer-col">
                <h5>{s.footerCompany}</h5>
                <div className="footer-links">
                  <Link href={ctcHref} className="highlight">
                    {s.footerContact}
                  </Link>
                  <Link href={pricingHref}>{s.navPricing}</Link>
                  <Link href={aboutHref}>{s.footerAbout}</Link>
                  <Link href={rentHref}>{s.footerBrowseRentals}</Link>
                  <Link href={blogHref}>{s.footerBlog}</Link>
                  <Link href={estHref}>{s.footerFreeEstimate}</Link>
                  <Link href="/login">{s.footerLogin}</Link>
                </div>
              </div>
            </div>
            {socialRow}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">{s.footerCopy}</p>
          <nav className="footer-legal" aria-label="Legal">
            <Link href={privacyHref}>{s.footerLegalPrivacy}</Link>
            <Link href={termsHref}>{s.footerLegalTerms}</Link>
            <Link href="/sitemap.xml">{s.footerLegalSitemap}</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

function PhoneIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13">
      <path
        strokeLinecap="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V6a2 2 0 012-2z"
      />
    </svg>
  )
}
function ChatIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13">
      <path
        strokeLinecap="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2z"
      />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13">
      <path
        strokeLinecap="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

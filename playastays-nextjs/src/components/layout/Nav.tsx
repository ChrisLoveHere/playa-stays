'use client'
// ============================================================
// PlayaStays — Nav Component
// Client component — handles scroll, dropdown, mobile menu.
//
// altLangHref is computed server-side from the i18n route map
// and passed as a prop. The toggle never guesses — it always
// links to the real twin page in the other language.
// ============================================================

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { City, SiteConfig } from '@/types'
import type { Locale } from '@/lib/i18n'
import { t, localeFromPath, getAltLangHref, buildNavServices } from '@/lib/i18n'
import styles from './Nav.module.css'
import { getCityNavFallbackLinks } from '@/lib/footer-location-hubs'

interface ServiceLink {
  label: string
  href: string
  desc: string
}

/** Normalize path segments so `/foo` matches `/foo/` for active states */
function pathMatchesHref(pathname: string, href: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/'
  const h = href.replace(/\/$/, '') || '/'
  if (p === h) return true
  if (h === '/' || h === '/es') return p === h
  return p.startsWith(`${h}/`)
}

/**
 * Global pricing hub must only appear as the top-level "Pricing" link — never inside Services.
 * Filters dropdown + mobile service lists even if another source re-adds this URL (stale bundle, etc.).
 */
function isPricingHubHref(href: string): boolean {
  const p = href.replace(/\/$/, '') || '/'
  return p === '/property-management-pricing' || p === '/es/precios-administracion-propiedades'
}

interface NavProps {
  cities:       City[]
  services:     ServiceLink[]
  config:       SiteConfig
  locale:       Locale
  altLangHref:  string
  homeHref:     string
  pricingHref:  string
  rentalsHref:  string
  blogHref:     string
  estimateHref: string
  contactHref:  string
  /** When true, Draft Preview bar sits above the nav — offset nav so it stays clickable. */
  draftPreview?: boolean
}

export function Nav({
  cities,
  services: _servicesFromLayout,
  config,
  locale: _localeFromLayout,
  altLangHref: _altFromLayout,
  homeHref: _homeFromLayout,
  pricingHref: _pricingFromLayout,
  rentalsHref: _rentalsFromLayout,
  blogHref: _blogFromLayout,
  estimateHref: _estimateFromLayout,
  contactHref: _contactFromLayout,
  draftPreview = false,
}: NavProps) {
  const pathname = usePathname() ?? '/'
  /** Root layout props do not always refresh on client navigation; pathname is authoritative. */
  const activeLocale = useMemo(() => localeFromPath(pathname), [pathname])
  const s = t(activeLocale)
  const altLangHref = useMemo(() => getAltLangHref(pathname), [pathname])
  const homeHref = activeLocale === 'es' ? '/es/' : '/'
  const pricingHref =
    activeLocale === 'es' ? '/es/precios-administracion-propiedades/' : '/property-management-pricing/'
  const rentalsHref = activeLocale === 'es' ? '/es/rentas/' : '/rentals/'
  const blogHref = activeLocale === 'es' ? '/es/blog/' : '/blog/'
  const estimateHref = activeLocale === 'es' ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const contactHref = activeLocale === 'es' ? '/es/contacto/' : '/contact/'
  const serviceLinks = useMemo(
    () => buildNavServices(activeLocale).filter(svc => !isPricingHubHref(svc.href)),
    [activeLocale],
  )
  /** CMS list, or canonical hub slugs/labels when API returns nothing (nav still usable). */
  const cityLinks = useMemo(() => {
    if (cities.length > 0) return cities
    return getCityNavFallbackLinks(activeLocale)
  }, [cities, activeLocale])
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [svcOpen, setSvcOpen]       = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)
  const svcRef  = useRef<HTMLLIElement>(null)
  const cityRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setMenuOpen(false); setSvcOpen(false); setCitiesOpen(false)
  }, [pathname])

  // Outside-close: attach only while open, after a tick, so the opening click does not
  // immediately fire as “outside” (document listener + React ordering issue).
  useEffect(() => {
    if (!svcOpen) return
    const fn = (e: MouseEvent) => {
      if (svcRef.current && !svcRef.current.contains(e.target as Node)) setSvcOpen(false)
    }
    const t = window.setTimeout(() => {
      document.addEventListener('mousedown', fn)
    }, 0)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('mousedown', fn)
    }
  }, [svcOpen])

  useEffect(() => {
    if (!citiesOpen) return
    const fn = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCitiesOpen(false)
    }
    const t = window.setTimeout(() => {
      document.addEventListener('mousedown', fn)
    }, 0)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('mousedown', fn)
    }
  }, [citiesOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSvcOpen(false); setCitiesOpen(false); setMenuOpen(false) }
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  const toggleMenu = useCallback(() => setMenuOpen(o => !o), [])
  const navClass = [
    styles.nav,
    scrolled ? styles.scrolled : '',
    draftPreview ? styles.navDraftOffset : '',
  ]
    .filter(Boolean)
    .join(' ')
  const isEn       = activeLocale === 'en'

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18059131997"
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18059131997');
        `}
      </Script>
      <nav className={navClass} id="mainNav" aria-label={s.navAriaMain}>
        <div className={styles.inner}>
          <Link className={styles.logo} href={homeHref}>PlayaStays</Link>

          <ul className={styles.links} role="list">
            <li
              className={`${styles.dropdown} ${styles.primary} ${svcOpen ? styles.dropdownOpen : ''}`}
              ref={svcRef}
            >
              <button
                type="button"
                className={`${styles.trigger} ${svcOpen ? styles.open : ''}`}
                aria-haspopup="true"
                aria-expanded={svcOpen}
                onClick={e => {
                  e.stopPropagation()
                  setSvcOpen(o => !o)
                  setCitiesOpen(false)
                }}
              >
                {s.navServices}
                <ChevronIcon className={`${styles.chevron} ${svcOpen ? styles.rotated : ''}`} />
              </button>
              {svcOpen && (
                <div
                  className={styles.panel}
                  role="menu"
                  onClick={e => e.stopPropagation()}
                >
                  {serviceLinks.map(svc => (
                    <Link
                      key={svc.href}
                      href={svc.href}
                      className={`${styles.item} ${pathMatchesHref(pathname, svc.href) ? styles.itemPrimary : ''}`}
                      role="menuitem"
                    >
                      <div className={styles.itemIcon}><GridIcon /></div>
                      <div>
                        <div className={styles.itemLabel}>{svc.label}</div>
                        <div className={styles.itemDesc}>{svc.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li className={`${styles.dropdown} ${citiesOpen ? styles.dropdownOpen : ''}`} ref={cityRef}>
              <button
                type="button"
                className={`${styles.trigger} ${citiesOpen ? styles.open : ''}`}
                aria-haspopup="true"
                aria-expanded={citiesOpen}
                onClick={e => {
                  e.stopPropagation()
                  setCitiesOpen(o => !o)
                  setSvcOpen(false)
                }}
              >
                {s.navCities}
                <ChevronIcon className={`${styles.chevron} ${citiesOpen ? styles.rotated : ''}`} />
              </button>
              {citiesOpen && (
                <div
                  className={styles.panel}
                  role="menu"
                  onClick={e => e.stopPropagation()}
                >
                  {cityLinks.map(c => {
                    const href = activeLocale === 'es' ? `/es/${c.slug}/` : `/${c.slug}/`
                    return (
                      <Link key={c.slug} href={href} className={styles.item} role="menuitem">
                        <div><div className={styles.itemLabel}>{c.title.rendered}</div></div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </li>

            <li>
              <Link
                href={pricingHref}
                aria-current={pathMatchesHref(pathname, pricingHref) ? 'page' : undefined}
              >
                {s.navPricing}
              </Link>
            </li>

            <li>
              <Link
                href={rentalsHref}
                aria-current={pathMatchesHref(pathname, rentalsHref) ? 'page' : undefined}
              >
                {s.navBrowseRentals}
              </Link>
            </li>
            <li>
              <Link href={blogHref} aria-current={pathMatchesHref(pathname, blogHref) ? 'page' : undefined}>
                {s.navBlog}
              </Link>
            </li>
            <li>
              <Link
                href={contactHref}
                aria-current={pathMatchesHref(pathname, contactHref) ? 'page' : undefined}
              >
                {s.navContact}
              </Link>
            </li>
          </ul>

          <div className={styles.lang} role="navigation" aria-label="Language">
            {isEn ? (
              <>
                <span className={`${styles.langItem} ${styles.langActive}`}>EN</span>
                <span className={styles.langSep} />
                <Link href={altLangHref} hrefLang="es" className={styles.langItem}>ES</Link>
              </>
            ) : (
              <>
                <Link href={altLangHref} hrefLang="en" className={styles.langItem}>EN</Link>
                <span className={styles.langSep} />
                <span className={`${styles.langItem} ${styles.langActive}`}>ES</span>
              </>
            )}
          </div>

          <Link href={estimateHref} className={styles.cta}>{s.navGetEstimate}</Link>

          <button
            type="button"
            className={styles.hamburger}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={toggleMenu}
          >
            <span className={menuOpen ? styles.topOpen : ''} />
            <span className={menuOpen ? styles.midOpen : ''} />
            <span className={menuOpen ? styles.botOpen : ''} />
          </button>
        </div>
      </nav>

      <div
        id="mobileMenu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}
        hidden={!menuOpen}
        role="dialog"
        aria-label={s.navAriaMobile}
        aria-modal={menuOpen}
        {...(!menuOpen ? { 'aria-hidden': true as const } : {})}
      >
        <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)} />
        <div className={styles.mobilePanel}>
          <div className={styles.mobilePanelHead}>
            <span className={styles.mobileLogo}>PlayaStays</span>
            <button type="button" className={styles.mobileClose} onClick={() => setMenuOpen(false)} aria-label={s.navAriaCloseMenu}>
              <CloseIcon />
            </button>
          </div>
          <nav>
            <ul className={styles.mobileNavList} role="list">
              <li className={styles.mobileNavPrimary} aria-hidden style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.75 }}>
                {s.navServices}
              </li>
              {serviceLinks.map(svc => (
                <li key={svc.href}>
                  <Link href={svc.href}>{svc.label}</Link>
                </li>
              ))}
              <li className={styles.mobileNavPrimary} aria-hidden style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.75, marginTop: 8 }}>
                {s.navCities}
              </li>
              {cityLinks.map(c => {
                const href = activeLocale === 'es' ? `/es/${c.slug}/` : `/${c.slug}/`
                return <li key={c.slug}><Link href={href}>{c.title.rendered}</Link></li>
              })}
              <li><Link href={pricingHref} aria-current={pathMatchesHref(pathname, pricingHref) ? 'page' : undefined}>{s.navPricing}</Link></li>
              <li><Link href={rentalsHref}>{s.navBrowseRentals}</Link></li>
              <li><Link href={blogHref}>{s.navBlog}</Link></li>
              <li><Link href={contactHref}>{s.navContact}</Link></li>
            </ul>
          </nav>
          <div className={styles.mobileLang}>
            <span className={styles.mobileLangLabel}>{s.navLanguageLabel}</span>
            <div className={styles.mobileLangToggle}>
              {isEn ? (
                <>
                  <span className={styles.mobileLangActive}>EN</span>
                  <Link href={altLangHref} hrefLang="es">ES</Link>
                </>
              ) : (
                <>
                  <Link href={altLangHref} hrefLang="en">EN</Link>
                  <span className={styles.mobileLangActive}>ES</span>
                </>
              )}
            </div>
          </div>
          <div className={styles.mobileCta}>
            <Link href={estimateHref} className="btn btn-gold btn-full">{s.navGetEstimate}</Link>
            <Link href={contactHref} className="btn btn-ghost btn-full">{s.navContact}</Link>
            <Link href={rentalsHref} className="btn btn-ghost btn-full">{s.navBrowseRentals}</Link>
          </div>
        </div>
      </div>
    </>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

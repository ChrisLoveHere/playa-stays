'use client'
// ============================================================
// PlayaStays — Nav Component
// Client component — handles scroll, dropdown, mobile menu.
//
// altLangHref is computed server-side from the i18n route map
// and passed as a prop. The toggle never guesses — it always
// links to the real twin page in the other language.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { City, SiteConfig } from '@/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import styles from './Nav.module.css'

interface ServiceLink {
  label: string
  href: string
  desc: string
}

interface NavProps {
  cities:       City[]
  services:     ServiceLink[]
  config:       SiteConfig
  locale:       Locale
  altLangHref:  string
  homeHref:     string
  rentalsHref:  string
  blogHref:     string
  estimateHref: string
  contactHref:  string
}

export function Nav({
  cities, services, config, locale,
  altLangHref, homeHref, rentalsHref, blogHref, estimateHref, contactHref,
}: NavProps) {
  const s = t(locale)
  const pathname = usePathname()
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

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (svcRef.current  && !svcRef.current.contains(e.target as Node))  setSvcOpen(false)
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCitiesOpen(false)
    }
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [])

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
  const navClass   = [styles.nav, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')
  const isEn       = locale === 'en'

  return (
    <>
      <nav className={navClass} id="mainNav" aria-label="Main navigation">
        <div className={styles.inner}>
          <Link className={styles.logo} href={homeHref}>PlayaStays</Link>

          <ul className={styles.links} role="list">
            <li className={`${styles.dropdown} ${styles.primary}`} ref={svcRef}>
              <button
                className={`${styles.trigger} ${svcOpen ? styles.open : ''}`}
                aria-haspopup="true"
                aria-expanded={svcOpen}
                onClick={() => { setSvcOpen(o => !o); setCitiesOpen(false) }}
              >
                {s.navServices}
                <ChevronIcon className={`${styles.chevron} ${svcOpen ? styles.rotated : ''}`} />
              </button>
              {svcOpen && (
                <div className={styles.panel} role="menu">
                  {services.map(svc => (
                    <Link
                      key={svc.href}
                      href={svc.href}
                      className={`${styles.item} ${pathname.startsWith(svc.href) ? styles.itemPrimary : ''}`}
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

            <li className={styles.dropdown} ref={cityRef}>
              <button
                className={`${styles.trigger} ${citiesOpen ? styles.open : ''}`}
                aria-haspopup="true"
                aria-expanded={citiesOpen}
                onClick={() => { setCitiesOpen(o => !o); setSvcOpen(false) }}
              >
                {s.navCities}
                <ChevronIcon className={`${styles.chevron} ${citiesOpen ? styles.rotated : ''}`} />
              </button>
              {citiesOpen && (
                <div className={styles.panel} role="menu">
                  {cities.map(c => {
                    const href = locale === 'es' ? `/es/${c.slug}/` : `/${c.slug}/`
                    return (
                      <Link key={c.slug} href={href} className={styles.item} role="menuitem">
                        <div><div className={styles.itemLabel}>{c.title.rendered}</div></div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </li>

            <li><Link href={rentalsHref}>{s.navBrowseRentals}</Link></li>
            <li><Link href={blogHref}>{s.navBlog}</Link></li>
          </ul>

          <nav className={styles.lang} aria-label="Language">
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
          </nav>

          <Link href={estimateHref} className={styles.cta}>{s.navGetEstimate}</Link>

          <button
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
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)} />
        <div className={styles.mobilePanel}>
          <div className={styles.mobilePanelHead}>
            <span className={styles.mobileLogo}>PlayaStays</span>
            <button className={styles.mobileClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <nav>
            <ul className={styles.mobileNavList} role="list">
              <li className={styles.mobileNavPrimary}>
                <Link href={services[0]?.href ?? estimateHref}>{services[0]?.label ?? s.navServices}</Link>
              </li>
              {cities.map(c => {
                const href = locale === 'es' ? `/es/${c.slug}/` : `/${c.slug}/`
                return <li key={c.slug}><Link href={href}>{c.title.rendered}</Link></li>
              })}
              <li><Link href={rentalsHref}>{s.navBrowseRentals}</Link></li>
              <li><Link href={blogHref}>{s.navBlog}</Link></li>
              <li><Link href={contactHref}>{s.navContact}</Link></li>
            </ul>
          </nav>
          <div className={styles.mobileLang}>
            <span className={styles.mobileLangLabel}>Language</span>
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
            <Link href={rentalsHref}  className="btn btn-ghost btn-full">{s.navBrowseRentals}</Link>
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

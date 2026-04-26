// ============================================================
// CustomerSegmentationCards — “Who is PlayaStays for?” (home)
// ============================================================

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import styles from './CustomerSegmentationCards.module.css'

function IconHome() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}

function IconDollar() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const ICONS = [IconHome, IconDollar, IconMapPin] as const

type Card = { title: string; body: string; cta: string; href: string }

const EN: Card[] = [
  {
    title: 'I own a property I want managed',
    body:
      'Property care, multi-channel listing, and full operations across Quintana Roo.',
    cta: 'Explore management',
    href: '/property-management/',
  },
  {
    title: "I'm thinking about selling",
    body: 'Sell or rent? Real numbers on both paths, no brokerage pressure.',
    cta: 'See your options',
    href: '/sell-property/',
  },
  {
    title: "I'm a guest looking to book",
    body: 'Vacation rentals across Playa del Carmen, Tulum, Cozumel, and 5 more cities.',
    cta: 'Browse rentals',
    href: '/rentals/',
  },
]

const ES: Card[] = [
  {
    title: 'Tengo una propiedad que quiero administrar',
    body:
      'Cuidado de propiedad, listados multicanal y operación integral en Quintana Roo.',
    cta: 'Explorar administración',
    href: '/es/administracion-de-propiedades/',
  },
  {
    title: 'Estoy pensando en vender',
    body: '¿Vender o rentar? Números reales sobre ambas rutas, sin presión de corretaje.',
    cta: 'Ver tus opciones',
    href: '/es/vender-propiedad/',
  },
  {
    title: 'Soy un huésped buscando reservar',
    body: 'Rentas vacacionales en Playa del Carmen, Tulum, Cozumel y 5 ciudades más.',
    cta: 'Explorar rentas',
    href: '/es/rentas/',
  },
]

const INTRO: Record<Locale, { title: string; sub: string; aria: string }> = {
  en: {
    title: 'Who is PlayaStays for?',
    sub: 'Three paths through the site, depending on what brings you here.',
    aria: 'Ways to work with PlayaStays',
  },
  es: {
    title: '¿Para quién es PlayaStays?',
    sub: 'Tres rutas por el sitio, según lo que te traiga aquí.',
    aria: 'Formas de trabajar con PlayaStays',
  },
}

export function CustomerSegmentationCards({ locale }: { locale: Locale }) {
  const cards = locale === 'es' ? ES : EN
  const intro = INTRO[locale] ?? INTRO.en

  return (
    <section className={`pad-lg bg-sand ${styles.root}`} aria-label={intro.aria}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>{intro.title}</h2>
          <p className={styles.subhead}>{intro.sub}</p>
        </div>
        <div className={styles.grid}>
          {cards.map((card, i) => {
            const Icon = ICONS[i] ?? IconHome
            return (
              <article key={card.href} className={styles.card}>
                <div className={styles.icon} aria-hidden>
                  <Icon />
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.body}>{card.body}</p>
                <Link href={card.href} className={styles.cta}>
                  {card.cta}
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

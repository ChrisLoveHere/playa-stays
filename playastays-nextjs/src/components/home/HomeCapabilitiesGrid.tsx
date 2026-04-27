// ============================================================
// HomeCapabilitiesGrid — "what we do" for homepage (not pricing)
// ============================================================

'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import styles from './HomeCapabilitiesGrid.module.css'

const PORTAL_IMG = '/home/product/owner-portal.png'

const COPY: Record<
  Locale,
  {
    title: string
    sub: string
    items: { title: string; body: string }[]
    portalFallback: string
  }
> = {
  en: {
    title: 'We do the boring parts. You keep the income.',
    sub: 'From listing to clean-up. From pricing to legal compliance. PlayaStays handles every layer of rental management in Playa del Carmen, Tulum, and across Quintana Roo.',
    items: [
      {
        title: 'Multi-channel listing',
        body: 'Listings on Airbnb, VRBO, Booking.com, and direct — synced calendars across every platform.',
      },
      {
        title: 'Dynamic pricing',
        body: 'Real-time algorithms adjust your rate based on local demand and competition.',
      },
      {
        title: '24/7 bilingual support',
        body: 'Every guest enquiry answered in under 5 minutes. Screening and reviews included.',
      },
      {
        title: 'In-house cleaning',
        body: 'Hotel-standard cleaning team plus vetted local maintenance partners.',
      },
      {
        title: 'Owner portal',
        body: 'Real-time dashboard for income, bookings, and expenses. Monthly direct deposits.',
      },
      {
        title: 'Legal compliance',
        body: 'Tourist RFC, local licenses, and tax filing managed end-to-end. Full Quintana Roo compliance.',
      },
    ],
    portalFallback: 'Owner portal preview — coming soon',
  },
  es: {
    title: 'Hacemos las partes aburridas. Tú te quedas con el ingreso.',
    sub: 'Del listado a la limpieza. Del precio al cumplimiento legal. PlayaStays maneja cada capa de la administración de rentas en Playa del Carmen, Tulum, y todo Quintana Roo.',
    items: [
      {
        title: 'Listado multicanal',
        body: 'Anuncios en Airbnb, VRBO, Booking.com y directo — calendarios sincronizados en cada plataforma.',
      },
      {
        title: 'Precios dinámicos',
        body: 'Algoritmos en tiempo real ajustan tu tarifa según demanda local y competencia.',
      },
      {
        title: 'Soporte bilingüe 24/7',
        body: 'Cada consulta respondida en menos de 5 minutos. Filtrado y reseñas incluidos.',
      },
      {
        title: 'Limpieza interna',
        body: 'Equipo de limpieza nivel hotelero más socios locales de mantenimiento.',
      },
      {
        title: 'Portal de propietario',
        body: 'Panel en tiempo real para ingresos, reservas y gastos. Depósitos directos mensuales.',
      },
      {
        title: 'Cumplimiento legal',
        body: 'RFC turístico, licencias locales y declaraciones fiscales gestionadas. Cumplimiento total en Quintana Roo.',
      },
    ],
    portalFallback: 'Vista previa del portal — próximamente',
  },
}

function OwnerPortalSlot({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [ok, setOk] = useState(true)

  return (
    <div className={styles.product}>
      {/* TODO: Add real owner portal screenshot to /public/home/product/owner-portal.png */}
      <div className={styles.productFrame}>
        {ok ? (
          <Image
            src={PORTAL_IMG}
            alt=""
            width={1200}
            height={600}
            className={styles.productImg}
            sizes="(max-width: 899px) 100vw, min(1120px, 92vw)"
            onError={() => setOk(false)}
          />
        ) : (
          <div className={styles.productPlaceholder} role="img" aria-label={c.portalFallback}>
            <span className={styles.productPlaceholderText}>{c.portalFallback}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const ICONS = [IconGrid, IconTrend, IconHeadset, IconSparkle, IconLayout, IconScale] as const

function IconGrid() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function IconTrend() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="m3 17 6-6 4 4 7-7" />
      <path d="M14 8h7v7" />
    </svg>
  )
}
function IconHeadset() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 11a9 9 0 0 1 9-9h0a9 9 0 0 1 9 9" />
      <path d="M3 19a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2z" />
      <path d="M17 19a2 2 0 0 0 2-2v-2a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1" />
    </svg>
  )
}
function IconSparkle() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="m12 2 1.1 3.2L16 5l-2.2 1.6L15 9l-3-1.2L9 9l.2-2.4L7 5l2.9-.2L12 2Z" />
      <path d="M5 14.5l.8 1.4 1.5.1-1.2 1 .4 1.4-1.4-.8-1.4.8.4-1.4-1.2-1 1.5-.1.8-1.4Z" />
      <path d="M18 10l.5 1.2 1.2.1-.9.8.2 1.2-1.1-.6-1.1.6.2-1.2-.9-.8 1.2-.1L18 10Z" />
    </svg>
  )
}
function IconLayout() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}
function IconScale() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="m12 3-8 4v5c0 5.5 3.8 10.2 8 12 4.2-1.8 8-6.5 8-12V7l-8-4Z" />
      <path d="M9 12h6" />
    </svg>
  )
}

export function HomeCapabilitiesGrid({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  return (
    <section
      className={`pad-lg bg-white ${styles.root}`}
      aria-label={locale === 'es' ? 'Capacidades' : 'Capabilities'}
    >
      <div className="container">
        <div className={styles.split}>
          <div className={styles.left}>
            <div className={styles.header}>
              <h2 className={styles.heading}>{c.title}</h2>
              <p className={styles.subhead}>{c.sub}</p>
            </div>
            <ul className={styles.list}>
              {c.items.map((item, i) => {
                const Icon = ICONS[i] ?? IconGrid
                return (
                  <li key={item.title} className={styles.listItem}>
                    <div className={styles.listIcon} aria-hidden>
                      <Icon />
                    </div>
                    <div className={styles.listBody}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemText}>{item.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className={styles.right}>
            <OwnerPortalSlot locale={locale} />
          </div>
        </div>
      </div>
    </section>
  )
}

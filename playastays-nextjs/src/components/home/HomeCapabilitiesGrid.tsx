// ============================================================
// HomeCapabilitiesGrid — "what we do" for homepage (not pricing)
// ============================================================

import type { Locale } from '@/lib/i18n'
import styles from './HomeCapabilitiesGrid.module.css'

const COPY: Record<
  Locale,
  { title: string; sub: string; items: { title: string; body: string }[] }
> = {
  en: {
    title: 'What PlayaStays does for owners',
    sub: 'Full-service vacation rental management — every layer handled by a local team.',
    items: [
      {
        title: 'Multi-channel listing',
        body:
          'Listings on Airbnb, VRBO, Booking.com, and direct — synced calendars and pricing across every platform.',
      },
      {
        title: 'Dynamic pricing',
        body:
          'Real-time algorithms adjust your rate based on local demand, events, and competition.',
      },
      {
        title: '24/7 bilingual support',
        body:
          'Every guest enquiry answered in under 5 minutes. Screening, reviews, and conflict resolution included.',
      },
      {
        title: 'In-house cleaning',
        body: 'Hotel-standard cleaning team. Maintenance coordination with vetted local providers.',
      },
      {
        title: 'Owner portal',
        body:
          'Real-time dashboard showing income, bookings, occupancy, and expenses. Monthly direct deposits.',
      },
      {
        title: 'Legal compliance',
        body:
          'Tourist RFC registration, local licenses, and tax filing managed end-to-end. Full Quintana Roo compliance.',
      },
    ],
  },
  es: {
    title: 'Lo que PlayaStays hace por los propietarios',
    sub: 'Administración integral de rentas vacacionales — cada capa manejada por un equipo local.',
    items: [
      {
        title: 'Listado multicanal',
        body:
          'Anuncios en Airbnb, VRBO, Booking.com y directo — calendarios y precios sincronizados en cada plataforma.',
      },
      {
        title: 'Precios dinámicos',
        body: 'Algoritmos en tiempo real ajustan tu tarifa según demanda local, eventos y competencia.',
      },
      {
        title: 'Soporte bilingüe 24/7',
        body:
          'Cada consulta de huésped respondida en menos de 5 minutos. Filtrado, reseñas y resolución de conflictos incluidos.',
      },
      {
        title: 'Limpieza interna',
        body: 'Equipo de limpieza nivel hotelero. Coordinación de mantenimiento con proveedores locales verificados.',
      },
      {
        title: 'Portal de propietario',
        body:
          'Panel en tiempo real con ingresos, reservas, ocupación y gastos. Depósitos directos mensuales.',
      },
      {
        title: 'Cumplimiento legal',
        body:
          'Registro RFC turístico, licencias locales y declaraciones fiscales gestionadas. Cumplimiento total en Quintana Roo.',
      },
    ],
  },
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
      className={`pad-lg bg-sand ${styles.root}`}
      aria-label={locale === 'es' ? 'Capacidades' : 'Capabilities'}
    >
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>{c.title}</h2>
          <p className={styles.subhead}>{c.sub}</p>
        </div>
        <div className={styles.grid}>
          {c.items.map((item, i) => {
            const Icon = ICONS[i] ?? IconGrid
            return (
              <article key={item.title} className={styles.card}>
                <div className={styles.icon} aria-hidden>
                  <Icon />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.body}>{item.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

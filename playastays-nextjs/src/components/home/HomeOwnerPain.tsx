// HomeOwnerPain — owner pain points (homepage only; lucide not installed — inline SVG)
import type { Locale } from '@/lib/i18n'
import styles from './HomeOwnerPain.module.css'

const COPY: Record<
  Locale,
  { title: string; sub: string; closing: string; items: { title: string; body: string }[] }
> = {
  en: {
    title: 'Owning the property should be the easy part.',
    sub: "Vacation rental ownership in the Riviera Maya isn't supposed to feel like a second job.",
    closing: 'PlayaStays handles the daily work — so you can own with confidence, from anywhere.',
    items: [
      {
        title: 'Guests messaging at all hours',
        body: "Three timezones, midnight check-ins, and a phone that never stops buzzing.",
      },
      {
        title: 'Cleaning and maintenance issues',
        body: "Last-minute turnovers, broken AC units, and vendors who don't show up.",
      },
      {
        title: 'Pricing uncertainty',
        body: 'Empty weeks in low season, leaving money on the table in high season.',
      },
      {
        title: 'No clear view of your numbers',
        body: "Confusing reports, unclear deposits, and never knowing how the property is really performing.",
      },
    ],
  },
  es: {
    title: 'Ser dueño de la propiedad debería ser la parte fácil.',
    sub: 'Ser propietario de una renta vacacional en la Riviera Maya no debería sentirse como un segundo trabajo.',
    closing: 'PlayaStays maneja el trabajo diario — para que puedas ser dueño con confianza, desde donde estés.',
    items: [
      {
        title: 'Huéspedes escribiendo a toda hora',
        body: 'Tres zonas horarias, llegadas a medianoche, y un teléfono que no para de sonar.',
      },
      {
        title: 'Problemas de limpieza y mantenimiento',
        body: 'Cambios de huésped a último momento, aires rotos, y proveedores que no llegan.',
      },
      {
        title: 'Incertidumbre en los precios',
        body: 'Semanas vacías en temporada baja, dejando dinero en la mesa en temporada alta.',
      },
      {
        title: 'Sin visibilidad clara de tus números',
        body: 'Reportes confusos, depósitos poco claros, y nunca saber el desempeño real de tu propiedad.',
      },
    ],
  },
}

const ICONS = [IconClock, IconWrench, IconTrendingDown, IconEye] as const

function IconClock() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
function IconWrench() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
function IconTrendingDown() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 12 18 8 14 12 10 6 2 14" />
    </svg>
  )
}
function IconEye() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function HomeOwnerPain({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  return (
    <section
      className={`pad-lg bg-white ${styles.root}`}
      aria-labelledby="home-owner-pain-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <h2 id="home-owner-pain-heading" className={styles.heading}>
            {c.title}
          </h2>
          <p className={styles.subhead}>{c.sub}</p>
        </div>
        <div className={styles.grid}>
          {c.items.map((item, i) => {
            const Icon = ICONS[i] ?? IconClock
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
        <p className={styles.transition}>{c.closing}</p>
      </div>
    </section>
  )
}

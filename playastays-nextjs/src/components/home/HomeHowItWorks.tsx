import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import styles from './HomeHowItWorks.module.css'

const COPY: Record<
  Locale,
  {
    title: string
    sub: string
    cta: string
    ctaHref: string
    steps: { title: string; body: string }[]
  }
> = {
  en: {
    title: 'Three steps to hands-off.',
    sub: 'From first conversation to handed-off operations — three steps, no commitment to start.',
    cta: 'Get my free estimate →',
    ctaHref: '/contact/',
    steps: [
      {
        title: 'Request your free estimate',
        body: "Tell us about your property, location, and goals. Five minutes, no commitment.",
      },
      {
        title: 'We review your rental potential',
        body:
          'We look at seasonality, guest demand, pricing strategy, and platform mix — then share an honest revenue projection.',
      },
      {
        title: 'PlayaStays handles the rest',
        body:
          'From listings and guest support to cleaning, maintenance, owner reporting, and monthly payouts.',
      },
    ],
  },
  es: {
    title: 'Tres pasos hacia las manos libres.',
    sub: 'De la primera conversación a operaciones entregadas — tres pasos, sin compromiso para empezar.',
    cta: 'Obtener mi estimado gratuito →',
    ctaHref: '/es/contacto/',
    steps: [
      {
        title: 'Solicita tu estimado gratuito',
        body: 'Cuéntanos sobre tu propiedad, ubicación y objetivos. Cinco minutos, sin compromiso.',
      },
      {
        title: 'Revisamos el potencial de tu propiedad',
        body:
          'Analizamos la estacionalidad, demanda de huéspedes, estrategia de precios y mezcla de plataformas — y compartimos una proyección de ingresos honesta.',
      },
      {
        title: 'PlayaStays se encarga del resto',
        body:
          'Del listado y soporte de huéspedes a limpieza, mantenimiento, reportes y pagos mensuales.',
      },
    ],
  },
}

export function HomeHowItWorks({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [a, b, step3] = c.steps

  return (
    <section className={styles.root} aria-labelledby="home-how-it-works-heading">
      <div className="container">
        <div className={styles.header}>
          <h2 id="home-how-it-works-heading" className={styles.heading}>
            {c.title}
          </h2>
          <p className={styles.subhead}>{c.sub}</p>
        </div>
        <div className={styles.row}>
          <article className={styles.card}>
            <div className={styles.badge} aria-hidden>1</div>
            <h3 className={styles.stepTitle}>{a.title}</h3>
            <p className={styles.stepBody}>{a.body}</p>
          </article>
          <div className={styles.arrow} aria-hidden>›</div>
          <article className={styles.card}>
            <div className={styles.badge} aria-hidden>2</div>
            <h3 className={styles.stepTitle}>{b.title}</h3>
            <p className={styles.stepBody}>{b.body}</p>
          </article>
          <div className={styles.arrow} aria-hidden>›</div>
          <article className={styles.card}>
            <div className={styles.badge} aria-hidden>3</div>
            <h3 className={styles.stepTitle}>{step3.title}</h3>
            <p className={styles.stepBody}>{step3.body}</p>
          </article>
        </div>
        <div className={styles.ctaWrap}>
          <Link href={c.ctaHref} className="btn btn-gold btn-lg">
            {c.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}

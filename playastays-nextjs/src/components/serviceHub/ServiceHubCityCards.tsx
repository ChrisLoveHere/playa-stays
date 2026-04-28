import Image from 'next/image'
import Link from 'next/link'
import type { City } from '@/types'
import styles from '@/components/home/HomeFeaturedCities.module.css'

const CITY_FALLBACK = [
  {
    slug: 'playa-del-carmen',
    en: 'Playa del Carmen',
    es: 'Playa del Carmen',
    marketNoteEn: 'Local execution and on-the-ground operations in Playa del Carmen.',
    marketNoteEs: 'Ejecución local y operación en Playa del Carmen.',
  },
  {
    slug: 'tulum',
    en: 'Tulum',
    es: 'Tulum',
    marketNoteEn: 'Local execution and on-the-ground operations in Tulum.',
    marketNoteEs: 'Ejecución local y operación en Tulum.',
  },
  {
    slug: 'puerto-morelos',
    en: 'Puerto Morelos',
    es: 'Puerto Morelos',
    marketNoteEn: 'Local execution and on-the-ground operations in Puerto Morelos.',
    marketNoteEs: 'Ejecución local y operación en Puerto Morelos.',
  },
  {
    slug: 'akumal',
    en: 'Akumal',
    es: 'Akumal',
    marketNoteEn: 'Local execution and on-the-ground operations in Akumal.',
    marketNoteEs: 'Ejecución local y operación en Akumal.',
  },
  {
    slug: 'xpu-ha',
    en: 'Xpu-Ha',
    es: 'Xpu-Ha',
    marketNoteEn: 'Local execution and on-the-ground operations in Xpu-Ha.',
    marketNoteEs: 'Ejecución local y operación en Xpu-Ha.',
  },
  {
    slug: 'chetumal',
    en: 'Chetumal',
    es: 'Chetumal',
    marketNoteEn: 'Emerging market on the southern Caribbean coast.',
    marketNoteEs: 'Mercado emergente en la costa sur del Caribe.',
  },
  {
    slug: 'cozumel',
    en: 'Cozumel',
    es: 'Cozumel',
    marketNoteEn: 'Local execution and on-the-ground operations in Cozumel.',
    marketNoteEs: 'Ejecución local y operación en Cozumel.',
  },
  {
    slug: 'isla-mujeres',
    en: 'Isla Mujeres',
    es: 'Isla Mujeres',
    marketNoteEn: 'Local execution and on-the-ground operations in Isla Mujeres.',
    marketNoteEs: 'Ejecución local y operación en Isla Mujeres.',
  },
] as const

export function ServiceHubCityCards({
  locale,
  hubSlug,
  cities,
}: {
  locale: 'en' | 'es'
  hubSlug: string
  cities: City[]
}) {
  const isEs = locale === 'es'
  const base = isEs ? '/es' : ''
  const sectionLabel = isEs ? 'Selecciona tu mercado' : 'Choose your market'
  const bySlug = new Map(cities.map(c => [c.slug, c]))
  void bySlug

  return (
    <section className={`pad-lg bg-ivory ${styles.root}`} id="choose-city" aria-label={sectionLabel}>
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow mb-8">{isEs ? 'Elige tu mercado' : 'Choose your market'}</div>
          <h2 className="section-title mt-12 mb-16">
            {isEs ? 'Dónde operamos en Quintana Roo' : 'Where we operate across Quintana Roo'}
          </h2>
        </div>

        <div className={styles.layout}>
          <div className={styles.grid}>
          {CITY_FALLBACK.map(city => {
            const fromWp = bySlug.get(city.slug)
            const name = fromWp?.title?.rendered?.trim() || (isEs ? city.es : city.en)
            const hubHref = `${base}/${city.slug}/${hubSlug}/`
            return (
              <Link key={city.slug} href={hubHref} className={styles.card}>
                <div className={styles.media}>
                  <Image
                    src={`/home/cities/${city.slug}.jpg`}
                    alt=""
                    fill
                    className={styles.mediaImg}
                    sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    unoptimized
                  />
                  <div className={styles.mediaGradient} aria-hidden />
                </div>
                <div className={styles.body}>
                  <h3 className={styles.city}>{name}</h3>
                  <p className={`${styles.tagline} ${styles.taglineItalic}`}>
                    {isEs
                      ? `Explora administración de propiedades en ${name} →`
                      : `Explore property management in ${name} →`}
                  </p>
                </div>
              </Link>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// HomeFeaturedCities — city grid; optional /public/home/cities/<slug>.jpg
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import styles from './HomeFeaturedCities.module.css'

type City = { slug: string; name: string; en: string; es: string }

const CITIES: City[] = [
  { slug: 'playa-del-carmen', name: 'Playa del Carmen', en: "The hub of the Riviera Maya", es: 'El centro de la Riviera Maya' },
  { slug: 'tulum', name: 'Tulum', en: 'Eco-luxury and bohemian beach', es: 'Eco-lujo y playa bohemia' },
  { slug: 'akumal', name: 'Akumal', en: 'Turtle bay and reef-front living', es: 'Bahía de tortugas y vida frente al arrecife' },
  { slug: 'puerto-morelos', name: 'Puerto Morelos', en: 'Reef-adjacent and quietly beautiful', es: 'Junto al arrecife y silenciosamente hermoso' },
  { slug: 'xpu-ha', name: 'Xpu-Ha', en: 'Boutique beach villas', es: 'Villas boutique en la playa' },
  { slug: 'chetumal', name: 'Chetumal', en: 'Capital of Quintana Roo', es: 'Capital de Quintana Roo' },
  { slug: 'isla-mujeres', name: 'Isla Mujeres', en: "Island life on Mexico's Caribbean", es: 'Vida insular en el Caribe mexicano' },
  { slug: 'cozumel', name: 'Cozumel', en: 'World-class diving and cruise market', es: 'Buceo de clase mundial y mercado de cruceros' },
]

const INTRO: Record<Locale, { title: string; sub: string }> = {
  en: {
    title: 'Vacation rentals across Quintana Roo',
    sub:
      "From Tulum's eco-luxury to Cozumel's reefs to Isla Mujeres' beach culture — local expertise in every market.",
  },
  es: {
    title: 'Rentas vacacionales en todo Quintana Roo',
    sub:
      'Desde el eco-lujo de Tulum hasta los arrecifes de Cozumel y la cultura playera de Isla Mujeres — experiencia local en cada mercado.',
  },
}

function CityCardMedia({ slug, phClass }: { slug: string; phClass: string }) {
  const [showPhoto, setShowPhoto] = useState(true)
  const src = `/home/cities/${slug}.jpg`

  return (
    <div className={styles.media}>
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- public files optional; onError to gradient
        <img
          className={styles.mediaImg}
          src={src}
          alt=""
          width={800}
          height={450}
          loading="lazy"
          decoding="async"
          onError={() => setShowPhoto(false)}
        />
      ) : null}
      {!showPhoto && <span className={`${styles.placeholder} ${phClass}`} aria-hidden />}
    </div>
  )
}

export function HomeFeaturedCities({ locale }: { locale: Locale }) {
  const intro = INTRO[locale] ?? INTRO.en
  return (
    <section className={`pad-lg bg-sand ${styles.root}`} aria-label={intro.title}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>{intro.title}</h2>
          <p className={styles.subhead}>{intro.sub}</p>
        </div>
        <div className={styles.grid}>
          {CITIES.map((city, i) => {
            const href = locale === 'es' ? `/es/${city.slug}/` : `/${city.slug}/`
            const tag = locale === 'es' ? city.es : city.en
            const ph = i % 2 === 0 ? styles.placeholderA : styles.placeholderB
            return (
              <Link key={city.slug} href={href} className={styles.card}>
                <CityCardMedia slug={city.slug} phClass={ph} />
                <div className={styles.body}>
                  <h3 className={styles.city}>{city.name}</h3>
                  <p className={`${styles.tagline} ${styles.taglineItalic}`}>{tag}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

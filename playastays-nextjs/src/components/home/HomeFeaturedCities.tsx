// ============================================================
// HomeFeaturedCities — city photos from /public/home/cities/<slug>.jpg
// ============================================================
'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    title: "Local expertise across all of Quintana Roo's most valuable rental markets",
    sub: 'Eight cities. One local team. Boutique service in every market.',
  },
  es: {
    title: 'Experiencia local en todos los mercados de renta más valiosos de Quintana Roo',
    sub: 'Ocho ciudades. Un equipo local. Servicio boutique en cada mercado.',
  },
}

function CityCardMedia({ slug }: { slug: string }) {
  const [ok, setOk] = useState(true)
  const src = `/home/cities/${slug}.jpg`

  return (
    <div className={styles.media}>
      {ok ? (
        <>
          <Image
            src={src}
            alt=""
            fill
            className={styles.mediaImg}
            sizes="(max-width: 519px) 100vw, (max-width: 999px) 50vw, 25vw"
            unoptimized
            onError={() => setOk(false)}
          />
          <div className={styles.mediaGradient} aria-hidden />
        </>
      ) : (
        <span className={styles.placeholderFallback} aria-hidden />
      )}
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
        <div className={styles.layout}>
          <div className={styles.grid}>
            {CITIES.map(city => {
            const href = locale === 'es' ? `/es/${city.slug}/` : `/${city.slug}/`
            const tag = locale === 'es' ? city.es : city.en
            return (
              <Link key={city.slug} href={href} className={styles.card}>
                <CityCardMedia slug={city.slug} />
                <div className={styles.body}>
                  <h3 className={styles.city}>{city.name}</h3>
                  <p className={`${styles.tagline} ${styles.taglineItalic}`}>{tag}</p>
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

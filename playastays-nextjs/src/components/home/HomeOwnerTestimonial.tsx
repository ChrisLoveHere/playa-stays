'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'
import styles from './HomeOwnerTestimonial.module.css'

/* Peter Langelaar — GMB. Listing / reviews: */
const MAPS_LISTING_URL = 'https://maps.app.goo.gl/5Z9WVrEGUf5y2AiEA'

type TestimonialEntry = {
  name: string
  quote: string
  lineBeforeLink: string
  reviewLinkLabel: string
  photoPath: string
  mapsUrl: string
}

const ENTRIES: Record<Locale, TestimonialEntry[]> = {
  en: [
    {
      name: 'Peter Langelaar',
      quote:
        'Chris is approachable, professional, and communicates in a clear and straightforward manner. I highly recommend them as property managers for anyone looking to rent a condo or house in Playa del Carmen.',
      lineBeforeLink: 'Peter Langelaar — Playa del Carmen — ',
      reviewLinkLabel: 'Google review',
      photoPath: '/team/peter-langelaar.jpg',
      mapsUrl: MAPS_LISTING_URL,
    },
  ],
  es: [
    {
      name: 'Peter Langelaar',
      quote:
        'Chris es accesible, profesional y se comunica con claridad y de forma directa. Recomiendo ampliamente a PlayaStays como administrador de propiedades a quien busque rentar un condominio o una casa en Playa del Carmen.',
      lineBeforeLink: 'Peter Langelaar — Playa del Carmen — ',
      reviewLinkLabel: 'Reseña en Google',
      photoPath: '/team/peter-langelaar.jpg',
      mapsUrl: MAPS_LISTING_URL,
    },
  ],
}

/* TODO: Add second real owner testimonial when available
   Example structure:
   {
     quote: "Sarah's outcome statement here",
     author: "Sarah K.",
     location: "Tulum",
     photoPath: "/team/sarah-k.jpg",
     googleReviewUrl: "..."
   }
*/

function OwnerTestimonialCard({ entry }: { entry: TestimonialEntry }) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div className={styles.card}>
      {imgOk ? (
        <div className={styles.avatar} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element -- public /team asset */}
          <img
            src={entry.photoPath}
            key={entry.photoPath}
            alt={entry.name}
            width={92}
            height={92}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        </div>
      ) : (
        <div className={styles.avatar} aria-hidden>
          <span className={styles.avatarInitials}>
            {entry.name
              .trim()
              .split(/\s+/)
              .map(p => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join(' ')
              .toUpperCase()}
          </span>
        </div>
      )}
      <div className={styles.body}>
        <blockquote className={styles.quote}>&ldquo;{entry.quote}&rdquo;</blockquote>
        <p className={styles.attrib}>
          {entry.lineBeforeLink}
          <a
            href={entry.mapsUrl}
            className={styles.reviewLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {entry.reviewLinkLabel}
          </a>
        </p>
      </div>
    </div>
  )
}

export function HomeOwnerTestimonial({ locale }: { locale: Locale }) {
  const entries = ENTRIES[locale] ?? ENTRIES.en
  const multi = entries.length > 1

  return (
    <section className="pad-lg bg-white" aria-labelledby="home-owner-testimonial-heading">
      <div className="container">
        <h2 id="home-owner-testimonial-heading" className="sr-only">
          {locale === 'es' ? 'Testimonio de un propietario' : 'Owner testimonial'}
        </h2>
        <div className={`${styles.list} ${multi ? styles.listMulti : styles.listSingle}`}>
          {entries.map((entry, i) => (
            <OwnerTestimonialCard key={`${entry.name}-${entry.photoPath}-${i}`} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}

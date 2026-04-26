'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'
import styles from './HomeOwnerTestimonial.module.css'

/* Same review + link as pricing OwnerTestimonial (Peter Langelaar) */
const MAPS_LISTING_URL = 'https://share.google/SVk2Q2QPrgq524CcE'
const PHOTO = '/team/peter-langelaar.jpg'

const COPY: Record<Locale, { quote: string; lineBeforeLink: string; reviewLinkLabel: string }> = {
  en: {
    quote:
      'Chris is approachable, professional, and communicates in a clear and straightforward manner. I highly recommend them as property managers for anyone looking to rent a condo or house in Playa del Carmen.',
    lineBeforeLink: 'Peter Langelaar — Playa del Carmen — ',
    reviewLinkLabel: 'Google review',
  },
  es: {
    quote:
      'Chris es accesible, profesional y se comunica con claridad y de forma directa. Recomiendo ampliamente a PlayaStays como administrador de propiedades a quien busque rentar un condominio o una casa en Playa del Carmen.',
    lineBeforeLink: 'Peter Langelaar — Playa del Carmen — ',
    reviewLinkLabel: 'Reseña en Google',
  },
}

export function HomeOwnerTestimonial({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [imgOk, setImgOk] = useState(true)

  return (
    <section className="pad-lg bg-white" aria-labelledby="home-owner-testimonial-heading">
      <div className="container">
        <h2 id="home-owner-testimonial-heading" className="sr-only">
          {locale === 'es' ? 'Testimonio de un propietario' : 'Owner testimonial'}
        </h2>
        {/* TODO: Add a second testimonial when available — design for 1-2 testimonial slots */}
        <div className={styles.card}>
          {imgOk ? (
            <div className={styles.avatar} aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element -- public /team asset */}
              <img
                src={PHOTO}
                key={PHOTO}
                alt="Peter Langelaar"
                width={92}
                height={92}
                loading="lazy"
                onError={() => setImgOk(false)}
              />
            </div>
          ) : (
            <div className={styles.avatar} aria-hidden>
              <span className={styles.avatarInitials}>P L</span>
            </div>
          )}
          <div className={styles.body}>
            <blockquote className={styles.quote}>&ldquo;{c.quote}&rdquo;</blockquote>
            <p className={styles.attrib}>
              {c.lineBeforeLink}
              <a
                href={MAPS_LISTING_URL}
                className={styles.reviewLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.reviewLinkLabel}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

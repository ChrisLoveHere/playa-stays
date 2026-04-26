'use client'
// ============================================================
// OwnerTestimonial — GMB-sourced review (static copy, local avatar only)
//
// We do not fetch reviewer photos or reviews from Google at runtime: URLs expire,
// ToS/embedding rules apply, and the Places API is not for hotlinking profile pics.
// Link goes to the Maps listing (reviews); optional photo: add a file to /public/team/ with
// permission from the reviewer if required.
// ============================================================

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'
import styles from './OwnerTestimonial.module.css'

/**
 * Google Maps / Business Profile for PlayaStays (reviews). Replace with your canonical
 * “Get reviews on Google” link from Business Profile if you prefer the long `maps.google.com` URL.
 */
const MAPS_LISTING_URL = 'https://share.google/SVk2Q2QPrgq524CcE'

/** Must match a file in `public/team/` — URL path = `/team/<filename>`. */
const PHOTO = '/team/peter-langelaar.jpg'

/* Copy from Google Business Profile — Peter Langelaar. */
const COPY: Record<
  Locale,
  { quote: string; lineBeforeLink: string; reviewLinkLabel: string }
> = {
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

export function OwnerTestimonial({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [imgOk, setImgOk] = useState(true)

  return (
    <section className="pad-lg bg-white" aria-labelledby="owner-testimonial-heading">
      <div className="container">
        <h2 id="owner-testimonial-heading" className="sr-only">
          {locale === 'es' ? 'Testimonio de un propietario' : 'Owner testimonial'}
        </h2>
        <div className={styles.card}>
          {imgOk ? (
            <div className={styles.avatar} aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element -- public /team asset; onError to initials */}
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
            <blockquote className={styles.quote}>
              &ldquo;{c.quote}&rdquo;
            </blockquote>
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

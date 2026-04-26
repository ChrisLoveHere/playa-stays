'use client'
// ============================================================
// OwnerTestimonial — single quote block (replace copy + photo when ready)
// ============================================================

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'
import styles from './OwnerTestimonial.module.css'

const PHOTO = '/team/owner-placeholder.jpg'

const COPY: Record<Locale, { quote: string; attribution: string }> = {
  en: {
    quote:
      'Going from self-managing to PlayaStays felt like getting time back. The reporting is clearer than my old property manager and the team actually picks up the phone.',
    attribution: 'Sarah K. — 2BR condo owner, Playa del Carmen — Owner since 2024',
  },
  es: {
    quote:
      'Pasar de autogestión a PlayaStays se sintió como recuperar mi tiempo. Los reportes son más claros que mi administrador anterior y el equipo realmente contesta el teléfono.',
    attribution: 'Sarah K. — propietaria de condominio de 2 recámaras, Playa del Carmen — propietaria desde 2024',
  },
}

export function OwnerTestimonial({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [imgOk, setImgOk] = useState(true)

  return (
    <section
      className="pad-lg bg-white"
      aria-labelledby="owner-testimonial-heading"
    >
      {/* TODO: Replace with real owner testimonial when available */}
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
                alt=""
                width={92}
                height={92}
                loading="lazy"
                onError={() => setImgOk(false)}
              />
            </div>
          ) : (
            <div className={styles.avatar} aria-hidden>
              <span className={styles.avatarInitials}>S K</span>
            </div>
          )}
          <div className={styles.body}>
            <blockquote className={styles.quote}>
              &ldquo;{c.quote}&rdquo;
            </blockquote>
            <p className={styles.attrib}>{c.attribution}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

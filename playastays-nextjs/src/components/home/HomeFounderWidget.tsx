'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import styles from './HomeFounderWidget.module.css'

const COPY: Record<Locale, { heading: string; body: string; cta: string; contactHref: string }> = {
  en: {
    heading: "Hi, I'm Chris — founder of PlayaStays.",
    body:
      "We're a small, boutique team based in the Riviera Maya — not a national chain managing your property from another country. Local presence, owner-first transparency, bilingual communication, and a real focus on the guest experience that earns you better reviews. If you own a property in Quintana Roo, I'd love to help you think through it.",
    cta: 'WhatsApp Chris →',
    contactHref: 'https://wa.me/529841234567?text=Hi%20Chris%2C%20I%20found%20you%20on%20PlayaStays',
  },
  es: {
    heading: 'Hola, soy Chris — fundador de PlayaStays.',
    body:
      'Somos un equipo boutique pequeño basado en la Riviera Maya — no una cadena nacional administrando tu propiedad desde otro país. Presencia local, transparencia para el propietario, comunicación bilingüe, y un enfoque real en la experiencia del huésped que te genera mejores reseñas. Si tienes una propiedad en Quintana Roo, me encantaría ayudarte a pensarla.',
    cta: 'WhatsApp Chris →',
    contactHref: 'https://wa.me/529841234567?text=Hi%20Chris%2C%20I%20found%20you%20on%20PlayaStays',
  },
}

export function HomeFounderWidget({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [photoOk, setPhotoOk] = useState(true)
  const hid = useId()

  return (
    <section className={styles.section} aria-labelledby={`home-founder-widget-heading-${hid}`}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className={styles.card}>
          <div className={styles.main}>
            {photoOk ? (
              <div className={styles.photoFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element -- public /team asset */}
                <img
                  src="/team/chris-love.jpg"
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className={styles.photo}
                  onError={() => setPhotoOk(false)}
                />
              </div>
            ) : (
              <div aria-hidden className={`${styles.photoFrame} ${styles.photoPlaceholder}`} />
            )}
            <div className={styles.copy}>
              <h2 id={`home-founder-widget-heading-${hid}`} className={styles.heading}>{c.heading}</h2>
              <div className={styles.socials}>
                <a
                  href="https://www.linkedin.com/in/chrislove89"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chris Love on LinkedIn"
                  className={styles.socialLink}
                >
                  <IconLinkedIn />
                </a>
                <a
                  href="https://www.facebook.com/share/18PYA944yp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PlayaStays on Facebook"
                  className={styles.socialLink}
                >
                  <IconFacebook />
                </a>
                <a
                  href="https://www.instagram.com/playastays"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PlayaStays on Instagram"
                  className={styles.socialLink}
                >
                  <IconInstagram />
                </a>
              </div>
              <p className={styles.body}>{c.body}</p>
            </div>
          </div>
          <div className={`${styles.ctaWrap} home-founder-widget-cta`}>
            <Link
              href={c.contactHref}
              className="btn btn-white btn-full"
              style={{ whiteSpace: 'nowrap' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.96 1.96 0 1 0 5.3 6.9 1.96 1.96 0 0 0 5.25 3ZM20 13.4c0-3.45-1.84-5.05-4.3-5.05-1.98 0-2.87 1.09-3.37 1.86V8.5H8.95V20h3.38v-6.43c0-1.7.32-3.35 2.43-3.35 2.08 0 2.1 1.94 2.1 3.46V20H20v-6.6Z" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.87.24-1.46 1.48-1.46h1.58V5a21.9 21.9 0 0 0-2.3-.12c-2.27 0-3.83 1.38-3.83 3.92V11H8v3h2.37v7h3.13Z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.45 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.8A2.4 2.4 0 1 0 14.4 12 2.4 2.4 0 0 0 12 9.6Z" />
    </svg>
  )
}

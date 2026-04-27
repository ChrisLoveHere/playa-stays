'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import styles from './ContactFounderWidget.module.css'

export function ContactFounderWidget({
  locale,
  heading,
  body,
}: {
  locale: Locale
  heading: string
  body: string
}) {
  const [photoOk, setPhotoOk] = useState(true)
  const cta = locale === 'es' ? 'Contáctame →' : 'Get in touch →'
  const ctaHref = locale === 'es' ? '/es/contacto/' : '/contact/'

  return (
    <section className={`pad-lg ${styles.section}`} aria-label={heading}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className={styles.card}>
          <div className={styles.main}>
            <div className={styles.photoWrap}>
              {photoOk ? (
                // eslint-disable-next-line @next/next/no-img-element -- local /public/team asset with graceful fallback
                <img
                  src="/team/chris-love.jpg"
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className={styles.photo}
                  onError={() => setPhotoOk(false)}
                />
              ) : null}
            </div>
            <div className={styles.copy}>
              <h2 className={styles.heading}>{heading}</h2>
              <p className={styles.body}>{body}</p>
            </div>
          </div>
          <div className={styles.ctaWrap}>
            <Link href={ctaHref} className="btn btn-white btn-full" style={{ whiteSpace: 'nowrap' }}>
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

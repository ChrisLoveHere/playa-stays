'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

const COPY: Record<
  Locale,
  { heading: string; body: string; cta: string; contactHref: string }
> = {
  en: {
    heading: "Hi, I'm Chris — founder of PlayaStays.",
    body: 'Have a question about managing your property in Quintana Roo? I read every message personally.',
    cta: 'Get in touch →',
    contactHref: '/contact/',
  },
  es: {
    heading: 'Hola, soy Chris — fundador de PlayaStays.',
    body: '¿Tienes preguntas sobre la administración de tu propiedad en Quintana Roo? Yo leo cada mensaje personalmente.',
    cta: 'Contáctame →',
    contactHref: '/es/contacto/',
  },
}

export function FounderWidget({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <section className="pad-md bg-ivory" aria-labelledby="founder-widget-heading">
      <div className="container" style={{ maxWidth: 900 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 28px)',
            justifyContent: 'space-between',
            padding: 'clamp(18px, 3vw, 26px)',
            background: 'var(--white)',
            border: '1px solid var(--sand-dark)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--sh-sm)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, flex: '1 1 240px', minWidth: 0 }}>
            {photoOk ? (
              // eslint-disable-next-line @next/next/no-img-element -- optional asset; graceful fallback on error
              <img
                src="/team/chris-love.jpg"
                alt=""
                width={80}
                height={80}
                loading="lazy"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '2px solid var(--sand-dark)',
                }}
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <div
                aria-hidden
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--sand)',
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ minWidth: 0 }}>
              <h2
                id="founder-widget-heading"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)',
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                  margin: '0 0 8px',
                  lineHeight: 1.25,
                }}
              >
                {c.heading}
              </h2>
              <p className="body-text" style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--mid)' }}>
                {c.body}
              </p>
            </div>
          </div>
          <div style={{ flexShrink: 0, width: '100%', maxWidth: 200 }} className="founder-widget-cta">
            <Link href={c.contactHref} className="btn btn-gold btn-full" style={{ whiteSpace: 'nowrap' }}>
              {c.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

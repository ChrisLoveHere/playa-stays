'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

const COPY: Record<Locale, { heading: string; body: string; cta: string; contactHref: string }> = {
  en: {
    heading: "Hi, I'm Chris — founder of PlayaStays.",
    body: "We're a small, local team in the Riviera Maya. If you own a property in Quintana Roo, I'd love to help you think through it.",
    cta: 'Get in touch →',
    contactHref: '/contact/',
  },
  es: {
    heading: 'Hola, soy Chris — fundador de PlayaStays.',
    body: 'Somos un equipo local pequeño en la Riviera Maya. Si tienes una propiedad en Quintana Roo, me encantaría ayudarte a pensarla.',
    cta: 'Contáctame →',
    contactHref: '/es/contacto/',
  },
}

const PHOTO_ZOOM = 1.28

const photoFrame: CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  border: '4px solid var(--white)',
  boxShadow: '0 0 0 1px rgba(10, 43, 47, 0.12), 0 8px 24px rgba(10, 43, 47, 0.22)',
}

const photoInner: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center center',
  transform: `scale(${PHOTO_ZOOM})`,
  transformOrigin: 'center center',
  display: 'block',
}

export function HomeFounderWidget({ locale }: { locale: Locale }) {
  const c = COPY[locale] ?? COPY.en
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <section
      className="pad-lg"
      aria-labelledby="home-founder-widget-heading"
      style={{
        background: 'var(--gold)',
        borderTop: '1px solid rgba(10, 43, 47, 0.1)',
        borderBottom: '1px solid rgba(10, 43, 47, 0.08)',
      }}
    >
      <div className="container" style={{ maxWidth: 900 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 28px)',
            justifyContent: 'space-between',
            padding: 'clamp(20px, 3.5vw, 30px)',
            background: 'var(--deep)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--r-lg)',
            boxShadow: '0 12px 32px rgba(10, 43, 47, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, flex: '1 1 240px', minWidth: 0 }}>
            {photoOk ? (
              <div style={photoFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element -- public /team asset */}
                <img
                  src="/team/chris-love.jpg"
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  style={photoInner}
                  onError={() => setPhotoOk(false)}
                />
              </div>
            ) : (
              <div
                aria-hidden
                style={{
                  ...photoFrame,
                  background: 'rgba(255,255,255,0.25)',
                }}
              />
            )}
            <div style={{ minWidth: 0 }}>
              <h2
                id="home-founder-widget-heading"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)',
                  fontWeight: 600,
                  color: 'var(--white)',
                  margin: '0 0 8px',
                  lineHeight: 1.25,
                  textShadow: '0 1px 2px rgba(10, 43, 47, 0.12)',
                }}
              >
                {c.heading}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {c.body}
              </p>
            </div>
          </div>
          <div style={{ flexShrink: 0, width: '100%', maxWidth: 200 }} className="home-founder-widget-cta">
            <Link href={c.contactHref} className="btn btn-white btn-full" style={{ whiteSpace: 'nowrap' }}>
              {c.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

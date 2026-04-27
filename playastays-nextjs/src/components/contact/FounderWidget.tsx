'use client'

import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
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

/** Slight zoom (1 = none) so the subject reads larger in a wide shot. Adjust 1.1–1.3 if the source photo changes. */
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

export function FounderWidget({
  locale,
  headingOverride,
  bodyOverride,
}: {
  locale: Locale
  headingOverride?: string
  bodyOverride?: string
}) {
  const c = COPY[locale] ?? COPY.en
  const [photoOk, setPhotoOk] = useState(true)
  const hid = useId()
  const heading = headingOverride ?? c.heading
  const body = bodyOverride ?? c.body

  return (
    <section
      className="pad-lg"
      aria-labelledby={`founder-widget-heading-${hid}`}
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
                {/* eslint-disable-next-line @next/next/no-img-element -- public asset in /public/team */}
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
                id={`founder-widget-heading-${hid}`}
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
                {heading}
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  margin: '0 0 8px',
                }}
              >
                <a
                  href="https://www.linkedin.com/in/chrislove89"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chris Love on LinkedIn"
                  style={{ color: 'rgba(255,255,255,0.82)', display: 'inline-flex' }}
                >
                  <IconLinkedIn />
                </a>
                <a
                  href="https://www.facebook.com/share/18PYA944yp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PlayaStays on Facebook"
                  style={{ color: 'rgba(255,255,255,0.82)', display: 'inline-flex' }}
                >
                  <IconFacebook />
                </a>
                <a
                  href="https://www.instagram.com/playastays"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PlayaStays on Instagram"
                  style={{ color: 'rgba(255,255,255,0.82)', display: 'inline-flex' }}
                >
                  <IconInstagram />
                </a>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {body}
              </p>
            </div>
          </div>
          <div style={{ flexShrink: 0, width: '100%', maxWidth: 200 }} className="founder-widget-cta">
            <Link href={c.contactHref} className="btn btn-white btn-full" style={{ whiteSpace: 'nowrap' }}>
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

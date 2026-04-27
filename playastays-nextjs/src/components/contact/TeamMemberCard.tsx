'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './TeamMemberCard.module.css'

type Social = { platform: 'linkedin' | 'facebook' | 'instagram'; url: string; ariaLabel: string }

export function TeamMemberCard({
  photoPath,
  name,
  role,
  description,
  socials,
  whatsapp,
}: {
  photoPath: string
  name: string
  role: string
  description: string
  socials?: Social[]
  whatsapp?: { url: string; label: string }
}) {
  const [photoOk, setPhotoOk] = useState(true)
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase()

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {photoOk ? (
          <Image
            src={photoPath}
            alt=""
            width={600}
            height={480}
            className={styles.photo}
            onError={() => setPhotoOk(false)}
          />
        ) : (
          <div className={styles.placeholderPhoto} aria-hidden>
            {initials}
          </div>
        )}
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.role}>{role}</p>
      {!!socials?.length && (
        <div className={styles.socials}>
          {socials.map(s => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.ariaLabel} className={styles.socialLink}>
              {s.platform === 'linkedin' ? <IconLinkedIn /> : s.platform === 'facebook' ? <IconFacebook /> : <IconInstagram />}
            </a>
          ))}
        </div>
      )}
      <p className={styles.desc}>{description}</p>
      {whatsapp ? (
        <a href={whatsapp.url} className={`${styles.whatsAppCta} btn btn-gold`} target="_blank" rel="noopener noreferrer">
          {whatsapp.label}
        </a>
      ) : null}
    </article>
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

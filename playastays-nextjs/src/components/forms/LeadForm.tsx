'use client'
// ============================================================
// PlayaStays — LeadForm
// Client component. dark/light variants, bilingual, unique IDs.
// source prop is passed through to /api/lead for tracking.
// ============================================================

import { useState, useTransition, useId } from 'react'
import type { LeadFormData } from '@/types'
import type { Locale } from '@/lib/i18n'
import { trackLeadGeneration } from '@/lib/analytics'

interface LeadFormProps {
  variant?:  'dark' | 'light'
  city?:     string
  source?:   string
  title?:    string
  subtitle?: string
  locale?:   Locale
}

function formCopy(locale: Locale = 'en') {
  const es = locale === 'es'
  return {
    firstName:    es ? 'Nombre'                  : 'First Name',
    email:        es ? 'Correo electrónico'       : 'Email',
    phone:        es ? 'Teléfono / WhatsApp'      : 'Phone / WhatsApp',
    propType:     es ? 'Tipo de propiedad'        : 'Property Type',
    status:       es ? 'Situación actual'         : 'Current Situation',
    city:         es ? 'Ciudad'                   : 'City',
    selectCity:   es ? 'Seleccionar ciudad'       : 'Select city',
    select:       es ? 'Seleccionar'              : 'Select',
    types: [
      { value: 'studio-1br', label: es ? 'Estudio / 1 Recámara' : 'Studio / 1-Bedroom' },
      { value: '2br',        label: es ? 'Condo 2 Recámaras'    : '2-Bedroom Condo' },
      { value: '3br-villa',  label: es ? 'Villa / 3+ Recámaras' : '3BR+ / Villa' },
      { value: 'penthouse',  label: 'Penthouse' },
    ],
    statuses: [
      { value: 'self-managing', label: es ? 'Autogestionando actualmente' : 'Self-managing now' },
      { value: 'other-company', label: es ? 'Con otra empresa'            : 'With another company' },
      { value: 'not-renting',  label: es ? 'Sin rentar actualmente'       : 'Not currently renting' },
      { value: 'pre-con',      label: es ? 'Preventa / comprando pronto'  : 'Pre-construction / buying soon' },
    ],
    cities: [
      'Playa del Carmen', 'Tulum', 'Akumal',
      'Puerto Morelos', 'Xpu-Ha', 'Chetumal',
    ],
    submit:      es ? 'Obtener mi estimado gratis →' : 'Get My Free Estimate →',
    submitting:  es ? 'Enviando…'                    : 'Sending…',
    disclaimer:  es ? 'Respuesta en 24 horas. Sin compromiso.'
                    : 'Response within 24 hours. No commitment required.',
    successTitle: es ? 'Nos pondremos en contacto en 24 horas'
                     : "We'll be in touch within 24 hours",
    successSub:  es ? 'Revisa tu WhatsApp o correo para tu estimado gratuito.'
                    : 'Check WhatsApp or email for your free revenue estimate.',
    errorMsg:    es ? 'Algo salió mal. Contáctanos por'
                    : 'Something went wrong. Please',
    errorLink:   'WhatsApp',
  }
}

export function LeadForm({
  variant  = 'dark',
  city     = '',
  source   = 'website',
  title,
  subtitle,
  locale   = 'en',
}: LeadFormProps) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  // useId ensures unique label/input associations even when multiple forms are on one page
  const uid      = useId()
  const id       = (field: string) => `lf-${uid}-${field}`
  const formClass = variant === 'dark' ? 'form-dark' : ''
  const cp        = formCopy(locale)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as unknown as LeadFormData

    // Track form submission attempt (raw gtag for non-typed event)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'form_submit_attempt', { event_label: source })
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, city: city || data.city, source }),
        })
        if (!res.ok) throw new Error('failed')
        setStatus('success')
        form.reset()
        trackLeadGeneration({
          source,
          city:         city || data.city || 'unknown',
          propertyType: data.property_type,
          locale,
        })
      } catch {
        setStatus('error')
      }
    })
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>✓</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600,
          color: variant === 'dark' ? 'var(--white)' : 'var(--charcoal)', marginBottom: 6,
        }}>
          {cp.successTitle}
        </div>
        <p style={{ fontSize: '0.82rem', color: variant === 'dark' ? 'rgba(255,255,255,0.45)' : 'var(--mid)' }}>
          {cp.successSub}
        </p>
      </div>
    )
  }

  return (
    <div className={formClass}>
      {title    && <h3>{title}</h3>}
      {subtitle && <p>{subtitle}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor={id('fname')}>{cp.firstName}</label>
            <input id={id('fname')} className="form-input" name="first_name" placeholder="Maria" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor={id('email')}>{cp.email}</label>
            <input id={id('email')} className="form-input" type="email" name="email" placeholder="maria@email.com" required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor={id('phone')}>{cp.phone}</label>
          <input id={id('phone')} className="form-input" name="phone" placeholder="+1 555 000 0000" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor={id('type')}>{cp.propType}</label>
            <select id={id('type')} className="form-input" name="property_type">
              <option value="">{cp.select}</option>
              {cp.types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor={id('status')}>{cp.status}</label>
            <select id={id('status')} className="form-input" name="current_status">
              <option value="">{cp.select}</option>
              {cp.statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {!city && (
          <div className="form-group">
            <label className="form-label" htmlFor={id('city')}>{cp.city}</label>
            <select id={id('city')} className="form-input" name="city">
              <option value="">{cp.selectCity}</option>
              {cp.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {city && <input type="hidden" name="city" value={city} />}
        <input type="hidden" name="source" value={source} />

        {status === 'error' && (
          <div style={{ fontSize: '0.78rem', color: 'var(--coral)', marginBottom: 8 }}>
            {cp.errorMsg}{' '}
            <a href="https://wa.me/529841234567" style={{ color: 'var(--coral)', fontWeight: 600 }}>
              {cp.errorLink}
            </a>.
          </div>
        )}

        <button
          type="submit"
          className="btn btn-gold btn-full mt-8"
          disabled={isPending}
          style={{ opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? cp.submitting : cp.submit}
        </button>

        <div className="form-disclaimer">{cp.disclaimer}</div>
      </form>
    </div>
  )
}

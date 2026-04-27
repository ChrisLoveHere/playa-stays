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

/** All strings used by the form — explicit keys catch typos at compile time. */
interface FormCopy {
  firstName: string
  email: string
  phone: string
  propType: string
  city: string
  selectCity: string
  select: string
  types: Array<{ value: string; label: string }>
  cities: string[]
  submit: string
  submitting: string
  disclaimer: string
  successTitle: string
  successSub: string
  errorMsg: string
  errorLink: string
}

function formCopy(locale: Locale = 'en'): FormCopy {
  const es = locale === 'es'
  return {
    firstName:    es ? 'Nombre'                  : 'First Name',
    email:        es ? 'Correo electrónico'       : 'Email',
    phone:        es ? 'Teléfono / WhatsApp'      : 'Phone / WhatsApp',
    propType:     es ? 'Tipo de propiedad'        : 'Property Type',
    city:         es ? 'Ciudad'                   : 'City',
    selectCity:   es ? 'Seleccionar ciudad'       : 'Select city',
    select:       es ? 'Seleccionar'              : 'Select',
    types: [
      { value: 'studio-1br', label: es ? 'Estudio / 1 Recámara' : 'Studio / 1-Bedroom' },
      { value: '2br',        label: es ? 'Condo 2 Recámaras'    : '2-Bedroom Condo' },
      { value: '3br-villa',  label: es ? 'Villa / 3+ Recámaras' : '3BR+ / Villa' },
      { value: 'penthouse',  label: 'Penthouse' },
    ],
    cities: [
      'Playa del Carmen',
      'Tulum',
      'Puerto Morelos',
      'Akumal',
      'Xpu-Ha',
      'Cozumel',
      'Isla Mujeres',
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
        const pageUrl =
          typeof window !== 'undefined' ? window.location.href : ''
        const referrer =
          typeof document !== 'undefined' ? document.referrer : ''
        const sp =
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search)
            : null
        const utm = {
          utm_source: sp?.get('utm_source') ?? undefined,
          utm_medium: sp?.get('utm_medium') ?? undefined,
          utm_campaign: sp?.get('utm_campaign') ?? undefined,
          utm_term: sp?.get('utm_term') ?? undefined,
          utm_content: sp?.get('utm_content') ?? undefined,
        }

        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            city: city || data.city,
            source,
            locale,
            page_url: pageUrl || undefined,
            referrer: referrer || undefined,
            ...utm,
          }),
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
      <div
        className={[formClass, 'lead-form-success'].filter(Boolean).join(' ')}
        style={{ textAlign: 'center', padding: '32px 0' }}
      >
        <div className="lead-form-success-icon" aria-hidden>✓</div>
        <div className="lead-form-success-title">{cp.successTitle}</div>
        <p className="lead-form-success-sub">{cp.successSub}</p>
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
        {/* Backend compatibility: keep current_status in payload without showing field in UI. */}
        <input type="hidden" name="current_status" value="not-specified" />
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

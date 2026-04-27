'use client'

import { useEffect, useId, useMemo, useState, useTransition } from 'react'
import type { Locale } from '@/lib/i18n'
import { trackLeadGeneration } from '@/lib/analytics'
import styles from './SmartLeadForm.module.css'

type Audience = 'owner' | 'guest' | 'investor' | 'other'

type Copy = {
  audienceLabel: string
  audienceSelect: string
  audiences: Array<{ value: Audience; label: string }>
  firstName: string
  email: string
  phone: string
  propertyType: string
  city: string
  destinationCity: string
  travelDates: string
  portfolioSize: string
  citiesOfInterest: string
  tellUsMore: string
  sendBooking: string
  getEstimate: string
  talkPortfolio: string
  sendMessage: string
  sending: string
  successTitle: string
  successBody: string
  errorMsg: string
  ownerTypes: string[]
  cityOptions: string[]
  destinationOptions: string[]
  portfolioOptions: string[]
}

function copy(locale: Locale): Copy {
  const es = locale === 'es'
  return {
    audienceLabel: es ? 'Soy un...' : "I'm a...",
    audienceSelect: es ? 'Seleccionar' : 'Select',
    audiences: [
      {
        value: 'owner',
        label: es
          ? 'Propietario (con propiedad en Quintana Roo)'
          : 'Owner (with property in Quintana Roo)',
      },
      { value: 'guest', label: es ? 'Huésped (buscando reservar)' : 'Guest (looking to book)' },
      {
        value: 'investor',
        label: es ? 'Inversionista (con interés en portafolio)' : 'Investor (with portfolio interest)',
      },
      { value: 'other', label: es ? 'Otro' : 'Other' },
    ],
    firstName: es ? 'Nombre' : 'First Name',
    email: es ? 'Correo electrónico' : 'Email',
    phone: es ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp',
    propertyType: es ? 'Tipo de propiedad' : 'Property Type',
    city: es ? 'Ciudad' : 'City',
    destinationCity: es ? 'Ciudad destino' : 'Destination city',
    travelDates: es ? 'Fechas de viaje (opcional)' : 'Travel dates (optional)',
    portfolioSize: es ? 'Tamaño de portafolio' : 'Portfolio size',
    citiesOfInterest: es ? 'Ciudades de interés' : 'Cities of interest',
    tellUsMore: es ? 'Cuéntanos más' : 'Tell us more',
    sendBooking: es ? 'Enviar mi consulta →' : 'Send my booking inquiry →',
    getEstimate: es ? 'Obtener mi estimado gratuito →' : 'Get my free revenue estimate →',
    talkPortfolio: es ? 'Hablar sobre mi portafolio →' : 'Talk about my portfolio →',
    sendMessage: es ? 'Enviar mensaje →' : 'Send message →',
    sending: es ? 'Enviando…' : 'Sending…',
    successTitle: es ? 'Gracias — responderemos en 24 horas.' : "Thank you — we'll respond within 24 hours.",
    successBody: es ? 'Nuestro equipo te contactará pronto.' : 'Our team will follow up shortly.',
    errorMsg: es ? 'Algo salió mal. Escríbenos por WhatsApp.' : 'Something went wrong. Please message us on WhatsApp.',
    ownerTypes: es ? ['Condo', 'Villa', 'Casa individual', 'Múltiples propiedades'] : ['Condo', 'Villa', 'Single home', 'Multi-property'],
    cityOptions: ['Playa del Carmen', 'Tulum', 'Akumal', 'Puerto Morelos', 'Xpu-Ha', 'Chetumal', 'Isla Mujeres', 'Cozumel'],
    destinationOptions: ['Playa del Carmen', 'Tulum', 'Cozumel', 'Isla Mujeres', 'Akumal', 'Puerto Morelos', 'Xpu-Ha', 'Chetumal'],
    portfolioOptions: ['1-2 properties', '3-5 properties', '6+ properties', 'Considering acquisition'],
  }
}

export function SmartLeadForm({
  locale = 'en',
  source = 'contact-page-smart',
}: {
  locale?: Locale
  source?: string
}) {
  const uid = useId()
  const id = (name: string) => `slf-${uid}-${name}`
  const c = useMemo(() => copy(locale), [locale])
  const [audience, setAudience] = useState<Audience | ''>('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()
  const [showFields, setShowFields] = useState(false)

  useEffect(() => {
    setShowFields(false)
    if (!audience) return
    const t = setTimeout(() => setShowFields(true), 20)
    return () => clearTimeout(t)
  }, [audience])

  const submitLabel =
    audience === 'guest'
      ? c.sendBooking
      : audience === 'investor'
        ? c.talkPortfolio
        : audience === 'other'
          ? c.sendMessage
          : c.getEstimate

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = Object.fromEntries(data)

    startTransition(async () => {
      setStatus('idle')
      try {
        const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
        const referrer = typeof document !== 'undefined' ? document.referrer : ''
        const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            source,
            locale,
            page_url: pageUrl || undefined,
            referrer: referrer || undefined,
            utm_source: sp?.get('utm_source') ?? undefined,
            utm_medium: sp?.get('utm_medium') ?? undefined,
            utm_campaign: sp?.get('utm_campaign') ?? undefined,
            utm_term: sp?.get('utm_term') ?? undefined,
            utm_content: sp?.get('utm_content') ?? undefined,
            current_status: 'not-specified',
          }),
        })
        if (!res.ok) throw new Error('failed')
        setStatus('success')
        form.reset()
        setAudience('')
        trackLeadGeneration({
          source,
          city: String(payload.city || payload.destination_city || 'unknown'),
          propertyType: String(payload.property_type || payload.portfolio_size || 'unknown'),
          locale,
        })
      } catch {
        setStatus('error')
      }
    })
  }

  if (status === 'success') {
    return (
      <div className={styles.shell}>
        <div className={styles.success}>
          <h3 className={styles.successTitle}>{c.successTitle}</h3>
          <p className={styles.successBody}>{c.successBody}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor={id('audience')}>
            {c.audienceLabel}
          </label>
          <select
            id={id('audience')}
            name="audience_selector"
            className="form-input"
            value={audience}
            onChange={e => setAudience((e.target.value as Audience | '') ?? '')}
            required
          >
            <option value="">{c.audienceSelect}</option>
            {c.audiences.map(a => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {!!audience && (
          <div className={`${styles.transition} ${showFields ? styles.transitionVisible : ''}`}>
            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label" htmlFor={id('first_name')}>
                  {c.firstName}
                </label>
                <input id={id('first_name')} name="first_name" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={id('email')}>
                  {c.email}
                </label>
                <input id={id('email')} type="email" name="email" className="form-input" required />
              </div>
            </div>

            {audience !== 'other' && (
              <div className="form-group">
                <label className="form-label" htmlFor={id('phone')}>
                  {c.phone}
                </label>
                <input id={id('phone')} name="phone" className="form-input" />
              </div>
            )}

            {audience === 'owner' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor={id('property_type')}>
                    {c.propertyType}
                  </label>
                  <select id={id('property_type')} name="property_type" className="form-input">
                    <option value="">{c.audienceSelect}</option>
                    {c.ownerTypes.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={id('city')}>
                    {c.city}
                  </label>
                  <select id={id('city')} name="city" className="form-input">
                    <option value="">{c.audienceSelect}</option>
                    {c.cityOptions.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {audience === 'guest' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor={id('destination_city')}>
                    {c.destinationCity}
                  </label>
                  <select id={id('destination_city')} name="destination_city" className="form-input">
                    <option value="">{c.audienceSelect}</option>
                    {c.destinationOptions.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={id('travel_dates')}>
                    {c.travelDates}
                  </label>
                  <input
                    id={id('travel_dates')}
                    name="travel_dates"
                    className="form-input"
                    placeholder={locale === 'es' ? 'ej. 15-22 dic' : 'e.g. Dec 15-22'}
                  />
                </div>
              </>
            )}

            {audience === 'investor' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor={id('portfolio_size')}>
                    {c.portfolioSize}
                  </label>
                  <select id={id('portfolio_size')} name="portfolio_size" className="form-input">
                    <option value="">{c.audienceSelect}</option>
                    {c.portfolioOptions.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={id('cities_interest')}>
                    {c.citiesOfInterest}
                  </label>
                  <select id={id('cities_interest')} name="cities_of_interest" className="form-input" multiple size={4}>
                    {c.cityOptions.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {audience === 'other' && (
              <div className="form-group">
                <label className="form-label" htmlFor={id('message')}>
                  {c.tellUsMore}
                </label>
                <textarea id={id('message')} name="message" className="form-input" rows={4} required />
              </div>
            )}

            <input type="hidden" name="audience_type" value={audience} />
            <input type="hidden" name="current_status" value="not-specified" />

            {status === 'error' && <div className={styles.error}>{c.errorMsg}</div>}

            <button type="submit" className="btn btn-gold btn-full mt-8" disabled={isPending} style={{ opacity: isPending ? 0.7 : 1 }}>
              {isPending ? c.sending : submitLabel}
            </button>
            <div className={styles.disclaimer}>
              {locale === 'es' ? 'Respuesta dentro de 24 horas.' : 'Response within 24 hours.'}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

'use client'
// ============================================================
// RevenueCalculator — client component
//
// Interactive revenue estimate calculator for pricing pages.
// Purely a lead-generation tool — not a booking engine.
// All math runs in runCalculator() from calculator-data.ts.
// UI uses existing design-system classes exclusively.
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import type { Locale } from '@/lib/i18n'
import {
  runCalculator,
  fmt,
  type PropertySize,
  CALC_RANGES,
  GLOBAL_CALC_FALLBACK,
} from '@/lib/calculator-data'
import { CITY_PRICING } from '@/lib/pricing-data'
import { trackCalculatorUpdate, trackCtaClick } from '@/lib/analytics'

// ── Props ──────────────────────────────────────────────────

interface RevenueCalculatorProps {
  locale:          Locale
  defaultCitySlug?: string   // pre-selected city; blank = "choose a city" on global hub
  estimateHref:    string    // CTA href
}

// ── Copy ───────────────────────────────────────────────────

function c(locale: Locale) {
  const es = locale === 'es'
  return {
    eyebrow:         es ? 'Calculadora de ingresos' : 'Revenue calculator',
    h2:              es ? 'Estima tus ingresos en minutos' : 'Estimate your income in minutes',
    sub:             es
      ? 'Selecciona tu ciudad, tipo de propiedad y tarifa nocturna estimada. Resultado instantáneo.'
      : 'Select your city, property type, and estimated nightly rate. Instant result.',
    cityLabel:       es ? 'Ciudad' : 'City',
    cityPlaceholder: es ? 'Seleccionar ciudad' : 'Select city',
    sizeLabel:       es ? 'Tipo de propiedad' : 'Property type',
    sizes: [
      { value: 'studio', labelEn: 'Studio / 1-Bedroom', labelEs: 'Estudio / 1 Recámara' },
      { value: '2br',    labelEn: '2-Bedroom Condo',    labelEs: 'Condo 2 Recámaras' },
      { value: '3br',    labelEn: 'Villa / 3-Bedroom+', labelEs: 'Villa / 3+ Recámaras' },
    ],
    nightlyLabel:    es ? 'Tarifa nocturna estimada (opcional)' : 'Estimated nightly rate (optional)',
    nightlyPlaceholder: es ? 'ej. $180' : 'e.g. $180',
    nightlyHint:     es ? 'Deja en blanco para usar el promedio del mercado' : 'Leave blank to use city market average',
    calcBtn:         es ? 'Calcular ingresos' : 'Calculate income',
    monthlyLabel:    es ? 'Ingreso mensual estimado' : 'Estimated monthly income',
    annualLabel:     es ? 'Ingreso anual estimado' : 'Estimated annual income',
    selfLabel:       es ? 'Autogestión (referencia)' : 'Self-managed (reference)',
    managedLabel:    es ? 'Con PlayaStays (bruto)' : 'With PlayaStays (gross)',
    netCoreLabel:    es ? 'Tu pago neto — Plan Core (10%)' : 'Your net payout — Core plan (10%)',
    netPlusLabel:    es ? 'Tu pago neto — Plan Plus (15%)' : 'Your net payout — Plus plan (15%)',
    upliftLabel:     es ? 'Ingreso neto adicional vs autogestión' : 'Extra net income vs self-managed',
    disclaimerText:  es
      ? '* Estimaciones basadas en datos del portafolio de PlayaStays. Los ingresos reales varían según la propiedad, temporada y condiciones del mercado.'
      : '* Estimates based on PlayaStays portfolio data. Actual income varies by property, season, and market conditions.',
    ctaLabel:        es ? 'Obtener mi estimado personalizado →' : 'Get My Custom Estimate →',
    ctaSub:          es
      ? 'Nuestro equipo revisará tu propiedad específica y enviará una proyección real en 24 horas.'
      : 'Our team will review your specific property and send a real projection within 24 hours.',
    rangeLabel:      es ? 'rango' : 'range',
    perMonth:        es ? '/mes' : '/mo',
    perYear:         es ? '/año' : '/yr',
    chooseCity:      es ? 'Elige una ciudad para calcular' : 'Choose a city to calculate',
    withLabel:       es ? 'Con PlayaStays' : 'With PlayaStays',
    withoutLabel:    es ? 'Sin gestión' : 'Without mgmt',
  }
}

// ── City options ───────────────────────────────────────────

const CITY_OPTIONS = Object.values(CITY_PRICING).map(cd => ({
  value: cd.slug,
  label: cd.name,
}))

// ── Component ──────────────────────────────────────────────

export function RevenueCalculator({
  locale,
  defaultCitySlug,
  estimateHref,
}: RevenueCalculatorProps) {
  const copy = c(locale)
  const isEs = locale === 'es'

  const [citySlug,   setCitySlug]   = useState(defaultCitySlug ?? '')
  const [propSize,   setPropSize]   = useState<PropertySize>('2br')
  const [nightly,    setNightly]    = useState('')
  const [result,     setResult]     = useState<ReturnType<typeof runCalculator> | null>(null)
  const [calculated, setCalculated] = useState(false)

  // Auto-calculate whenever inputs change if a city is selected
  useEffect(() => {
    if (!citySlug) { setResult(null); setCalculated(false); return }
    const nightlyNum = nightly ? parseFloat(nightly.replace(/[^0-9.]/g, '')) : undefined
    const out = runCalculator({ citySlug, propertySize: propSize, nightlyRate: nightlyNum })
    setResult(out)
    setCalculated(true)
    // Track calculator interaction
    trackCalculatorUpdate({ citySlug, propertySize: propSize, hasCustomNightly: Boolean(nightly) })
  }, [citySlug, propSize, nightly])

  const cityRanges = citySlug
    ? CALC_RANGES[citySlug]?.[propSize]
    : null

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--sand-dark)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--sh-md)',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--deep)',
        padding: '28px 32px',
      }}>
        <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: 8 }}>
          {copy.eyebrow}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
          fontWeight: 500,
          color: 'var(--white)',
          marginBottom: 8,
          lineHeight: 1.25,
        }}>
          {copy.h2}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.6 }}>
          {copy.sub}
        </p>
      </div>

      {/* Inputs */}
      <div style={{ padding: '28px 32px', background: 'var(--sand)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}>
          {/* City select — shown only on global hub (no defaultCitySlug) */}
          {!defaultCitySlug && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--mid)', marginBottom: 6,
              }}>
                {copy.cityLabel}
              </label>
              <select
                className="form-input"
                value={citySlug}
                onChange={e => setCitySlug(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">{copy.cityPlaceholder}</option>
                {CITY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Property type */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--mid)', marginBottom: 6,
            }}>
              {copy.sizeLabel}
            </label>
            <select
              className="form-input"
              value={propSize}
              onChange={e => setPropSize(e.target.value as PropertySize)}
              style={{ width: '100%' }}
            >
              {copy.sizes.map(s => (
                <option key={s.value} value={s.value}>
                  {isEs ? s.labelEs : s.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Optional nightly rate */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--mid)', marginBottom: 6,
            }}>
              {copy.nightlyLabel}
            </label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder={cityRanges
                ? `${copy.nightlyPlaceholder} (${fmt(cityRanges.nightlyLo)}–${fmt(cityRanges.nightlyHi)})`
                : copy.nightlyPlaceholder
              }
              value={nightly}
              onChange={e => setNightly(e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--light)', marginTop: 4 }}>
              {copy.nightlyHint}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '28px 32px' }}>
        {!citySlug && (
          <div style={{
            textAlign: 'center',
            padding: '32px 0',
            color: 'var(--light)',
            fontSize: '0.88rem',
          }}>
            {copy.chooseCity}
          </div>
        )}

        {calculated && result && (
          <>
            {/* Primary result: gross managed range */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
              marginBottom: 20,
            }}>
              {/* Monthly */}
              <div style={{
                background: 'rgba(24,104,112,0.07)',
                border: '1px solid rgba(24,104,112,0.2)',
                borderRadius: 'var(--r-md)',
                padding: '16px 20px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '0.66rem', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--teal)', marginBottom: 8,
                }}>
                  {copy.monthlyLabel}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 700, color: 'var(--teal)', lineHeight: 1,
                }}>
                  {fmt(result.monthlyManagedLo)}–{fmt(result.monthlyManagedHi)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--mid)', marginTop: 4 }}>
                  {copy.rangeLabel}{copy.perMonth}
                </div>
              </div>

              {/* Annual */}
              <div style={{
                background: 'rgba(200,164,74,0.07)',
                border: '1px solid rgba(200,164,74,0.2)',
                borderRadius: 'var(--r-md)',
                padding: '16px 20px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '0.66rem', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--gold)', marginBottom: 8,
                }}>
                  {copy.annualLabel}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1,
                }}>
                  {fmt(result.annualManagedLo)}–{fmt(result.annualManagedHi)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--mid)', marginTop: 4 }}>
                  {copy.rangeLabel}{copy.perYear}
                </div>
              </div>
            </div>

            {/* Net payout breakdown */}
            <div style={{
              background: 'var(--sand)',
              borderRadius: 'var(--r-md)',
              padding: '16px 20px',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Self-managed reference */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--light)' }}>
                    {copy.selfLabel}
                  </span>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 600, color: 'var(--mid)',
                    textDecoration: 'line-through',
                  }}>
                    {fmt(result.selfManagedLo)}–{fmt(result.selfManagedHi)}{copy.perMonth}
                  </span>
                </div>

                <div style={{ height: 1, background: 'var(--sand-dark)' }} />

                {/* Net payout Core */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>
                    {copy.netCoreLabel}
                  </span>
                  <span style={{
                    fontSize: '0.88rem', fontWeight: 700, color: 'var(--charcoal)',
                  }}>
                    {fmt(result.netCoreLo)}–{fmt(result.netCoreHi)}{copy.perMonth}
                  </span>
                </div>

                {/* Net payout Plus */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>
                    {copy.netPlusLabel}
                  </span>
                  <span style={{
                    fontSize: '0.88rem', fontWeight: 700, color: 'var(--teal)',
                  }}>
                    {fmt(result.netPlusLo)}–{fmt(result.netPlusHi)}{copy.perMonth}
                  </span>
                </div>
              </div>
            </div>

            {/* Uplift chip */}
            {result.upliftLo > 0 && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--gold)',
                borderRadius: 'var(--r-pill)',
                padding: '7px 16px',
                marginBottom: 20,
              }}>
                <span style={{ fontSize: '1rem' }}>↑</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--deep)' }}>
                  {copy.upliftLabel}: {fmt(result.upliftLo)}–{fmt(result.upliftHi)}{copy.perMonth}
                </span>
              </div>
            )}

            <p style={{
              fontSize: '0.7rem', color: 'var(--light)',
              fontStyle: 'italic', marginBottom: 20,
            }}>
              {copy.disclaimerText}
            </p>
          </>
        )}

        {/* CTA */}
        <div style={{
          borderTop: calculated ? '1px solid var(--sand-dark)' : 'none',
          paddingTop: calculated ? 20 : 0,
        }}>
          <a
            href={estimateHref}
            className="btn btn-gold btn-full"
            style={{ marginBottom: 10 }}
            onClick={() => trackCtaClick({ label: 'calculator-get-estimate', location: 'calculator', city: citySlug })}
          >
            {copy.ctaLabel}
          </a>
          <p style={{
            fontSize: '0.75rem', color: 'var(--light)',
            textAlign: 'center', margin: 0, lineHeight: 1.5,
          }}>
            {copy.ctaSub}
          </p>
        </div>
      </div>
    </div>
  )
}

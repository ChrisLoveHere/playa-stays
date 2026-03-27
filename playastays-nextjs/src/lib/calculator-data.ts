// ============================================================
// PlayaStays — Calculator Data
//
// Numeric source-of-truth for the RevenueCalculator component.
// Strings in pricing-data.ts are for display; numbers here are
// for computation. All values are USD/month estimates.
//
// Methodology:
//   selfManagedLo/Hi = conservative/optimistic self-managed gross
//   managedLo/Hi     = conservative/optimistic professionally-managed gross
//                      (reflects higher occupancy + dynamic pricing)
//   occupancyLo/Hi   = decimal fraction (0.65 = 65%)
//   feeRate          = the plan tier used for this size (Core=0.10, Plus=0.15, Pro=0.20)
//
// The calculator shows gross revenue under management, then
// subtracts the fee to show net owner payout per plan tier.
// ============================================================

export type PropertySize = 'studio' | '2br' | '3br'

export interface CalcRange {
  nightlyLo:       number   // USD, conservative nightly
  nightlyHi:       number   // USD, optimistic nightly
  occupancyLo:     number   // fraction
  occupancyHi:     number   // fraction
  selfManagedLo:   number   // gross $/mo self-managed (conservative)
  selfManagedHi:   number   // gross $/mo self-managed (optimistic)
  managedLo:       number   // gross $/mo with professional management
  managedHi:       number   // gross $/mo with professional management
  typicalFeeRate:  number   // recommended plan tier fee rate
}

// city slug → property size → numeric ranges
export const CALC_RANGES: Record<string, Record<PropertySize, CalcRange>> = {
  'playa-del-carmen': {
    studio: {
      nightlyLo: 110, nightlyHi: 160,
      occupancyLo: 0.65, occupancyHi: 0.82,
      selfManagedLo: 1400, selfManagedHi: 2100,
      managedLo: 2200, managedHi: 3200,
      typicalFeeRate: 0.15,
    },
    '2br': {
      nightlyLo: 160, nightlyHi: 220,
      occupancyLo: 0.68, occupancyHi: 0.85,
      selfManagedLo: 2100, selfManagedHi: 3100,
      managedLo: 3200, managedHi: 4600,
      typicalFeeRate: 0.15,
    },
    '3br': {
      nightlyLo: 220, nightlyHi: 380,
      occupancyLo: 0.65, occupancyHi: 0.80,
      selfManagedLo: 3500, selfManagedHi: 5200,
      managedLo: 5200, managedHi: 8000,
      typicalFeeRate: 0.15,
    },
  },

  'tulum': {
    studio: {
      nightlyLo: 150, nightlyHi: 250,
      occupancyLo: 0.60, occupancyHi: 0.78,
      selfManagedLo: 1900, selfManagedHi: 2800,
      managedLo: 2800, managedHi: 4200,
      typicalFeeRate: 0.15,
    },
    '2br': {
      nightlyLo: 280, nightlyHi: 420,
      occupancyLo: 0.60, occupancyHi: 0.78,
      selfManagedLo: 3500, selfManagedHi: 5200,
      managedLo: 5000, managedHi: 7800,
      typicalFeeRate: 0.15,
    },
    '3br': {
      nightlyLo: 450, nightlyHi: 900,
      occupancyLo: 0.55, occupancyHi: 0.75,
      selfManagedLo: 6000, selfManagedHi: 9500,
      managedLo: 8000, managedHi: 14000,
      typicalFeeRate: 0.20,
    },
  },

  'akumal': {
    studio: {
      nightlyLo: 120, nightlyHi: 170,
      occupancyLo: 0.65, occupancyHi: 0.80,
      selfManagedLo: 1600, selfManagedHi: 2300,
      managedLo: 2400, managedHi: 3400,
      typicalFeeRate: 0.15,
    },
    '2br': {
      nightlyLo: 200, nightlyHi: 300,
      occupancyLo: 0.68, occupancyHi: 0.82,
      selfManagedLo: 2600, selfManagedHi: 3600,
      managedLo: 3800, managedHi: 5400,
      typicalFeeRate: 0.15,
    },
    '3br': {
      nightlyLo: 300, nightlyHi: 480,
      occupancyLo: 0.65, occupancyHi: 0.80,
      selfManagedLo: 4000, selfManagedHi: 5800,
      managedLo: 5800, managedHi: 8500,
      typicalFeeRate: 0.15,
    },
  },

  'puerto-morelos': {
    studio: {
      nightlyLo: 90, nightlyHi: 140,
      occupancyLo: 0.60, occupancyHi: 0.76,
      selfManagedLo: 1200, selfManagedHi: 1900,
      managedLo: 1800, managedHi: 2700,
      typicalFeeRate: 0.15,
    },
    '2br': {
      nightlyLo: 140, nightlyHi: 200,
      occupancyLo: 0.62, occupancyHi: 0.78,
      selfManagedLo: 1900, selfManagedHi: 2800,
      managedLo: 2800, managedHi: 4100,
      typicalFeeRate: 0.15,
    },
    '3br': {
      nightlyLo: 200, nightlyHi: 320,
      occupancyLo: 0.60, occupancyHi: 0.76,
      selfManagedLo: 2800, selfManagedHi: 4000,
      managedLo: 4000, managedHi: 6200,
      typicalFeeRate: 0.15,
    },
  },

  'xpu-ha': {
    studio: {
      nightlyLo: 180, nightlyHi: 280,
      occupancyLo: 0.55, occupancyHi: 0.72,
      selfManagedLo: 2200, selfManagedHi: 3200,
      managedLo: 3200, managedHi: 4800,
      typicalFeeRate: 0.15,
    },
    '2br': {
      nightlyLo: 320, nightlyHi: 500,
      occupancyLo: 0.55, occupancyHi: 0.72,
      selfManagedLo: 3800, selfManagedHi: 5800,
      managedLo: 5500, managedHi: 8600,
      typicalFeeRate: 0.20,
    },
    '3br': {
      nightlyLo: 500, nightlyHi: 1000,
      occupancyLo: 0.52, occupancyHi: 0.70,
      selfManagedLo: 7000, selfManagedHi: 12000,
      managedLo: 9500, managedHi: 17000,
      typicalFeeRate: 0.20,
    },
  },

  'chetumal': {
    studio: {
      nightlyLo: 55, nightlyHi: 90,
      occupancyLo: 0.58, occupancyHi: 0.72,
      selfManagedLo: 700, selfManagedHi: 1100,
      managedLo: 1100, managedHi: 1800,
      typicalFeeRate: 0.10,
    },
    '2br': {
      nightlyLo: 90, nightlyHi: 130,
      occupancyLo: 0.60, occupancyHi: 0.74,
      selfManagedLo: 1100, selfManagedHi: 1700,
      managedLo: 1700, managedHi: 2600,
      typicalFeeRate: 0.10,
    },
    '3br': {
      nightlyLo: 120, nightlyHi: 180,
      occupancyLo: 0.58, occupancyHi: 0.72,
      selfManagedLo: 1600, selfManagedHi: 2400,
      managedLo: 2400, managedHi: 3600,
      typicalFeeRate: 0.10,
    },
  },
}

// Fallback ranges used when city is "unknown" (global hub calculator)
export const GLOBAL_CALC_FALLBACK: Record<PropertySize, CalcRange> = {
  studio: {
    nightlyLo: 100, nightlyHi: 200,
    occupancyLo: 0.62, occupancyHi: 0.80,
    selfManagedLo: 1400, selfManagedHi: 2200,
    managedLo: 2100, managedHi: 3400,
    typicalFeeRate: 0.15,
  },
  '2br': {
    nightlyLo: 170, nightlyHi: 300,
    occupancyLo: 0.65, occupancyHi: 0.82,
    selfManagedLo: 2400, selfManagedHi: 3800,
    managedLo: 3600, managedHi: 5800,
    typicalFeeRate: 0.15,
  },
  '3br': {
    nightlyLo: 280, nightlyHi: 600,
    occupancyLo: 0.60, occupancyHi: 0.78,
    selfManagedLo: 4000, selfManagedHi: 7500,
    managedLo: 6000, managedHi: 11000,
    typicalFeeRate: 0.15,
  },
}

// ── Calculator engine (pure functions) ────────────────────
// All math lives here so the component stays thin.

export interface CalcInputs {
  citySlug:     string
  propertySize: PropertySize
  nightlyRate?: number   // optional override; if blank, use city midpoint
}

export interface CalcOutputs {
  // Monthly gross under management (with PlayaStays)
  monthlyManagedLo: number
  monthlyManagedHi: number
  // Annual gross under management
  annualManagedLo: number
  annualManagedHi: number
  // Management fee per plan tier (monthly, based on managed gross midpoint)
  feeCore:  number   // 10%
  feePlus:  number   // 15%
  // Net owner payout (mid-range managed gross minus each fee tier)
  netCoreLo: number; netCoreHi: number
  netPlusLo: number; netPlusHi: number
  // For reference: self-managed monthly estimate
  selfManagedLo: number
  selfManagedHi: number
  // Uplift (net managed minus self-managed, at midpoints)
  upliftLo: number
  upliftHi: number
}

export function runCalculator(inputs: CalcInputs): CalcOutputs {
  const cityRanges  = CALC_RANGES[inputs.citySlug] ?? GLOBAL_CALC_FALLBACK
  const sizeRanges  = cityRanges[inputs.propertySize]

  // If user provided a custom nightly rate, scale managed ranges proportionally
  let managedLo = sizeRanges.managedLo
  let managedHi = sizeRanges.managedHi
  let selfLo    = sizeRanges.selfManagedLo
  let selfHi    = sizeRanges.selfManagedHi

  if (inputs.nightlyRate && inputs.nightlyRate > 0) {
    const midNightly  = (sizeRanges.nightlyLo + sizeRanges.nightlyHi) / 2
    const scale       = inputs.nightlyRate / midNightly
    // Cap scale to ±60% to prevent wild extrapolation
    const clampedScale = Math.max(0.4, Math.min(1.6, scale))
    managedLo = Math.round(managedLo * clampedScale / 50) * 50
    managedHi = Math.round(managedHi * clampedScale / 50) * 50
    selfLo    = Math.round(selfLo    * clampedScale / 50) * 50
    selfHi    = Math.round(selfHi    * clampedScale / 50) * 50
  }

  const feeCore = Math.round((managedLo + managedHi) / 2 * 0.10 / 10) * 10
  const feePlus = Math.round((managedLo + managedHi) / 2 * 0.15 / 10) * 10

  const netPlusLo = managedLo - Math.round(managedLo * 0.15 / 10) * 10
  const netPlusHi = managedHi - Math.round(managedHi * 0.15 / 10) * 10

  return {
    monthlyManagedLo: managedLo,
    monthlyManagedHi: managedHi,
    annualManagedLo:  managedLo * 12,
    annualManagedHi:  managedHi * 12,
    feeCore,
    feePlus,
    netCoreLo: managedLo - Math.round(managedLo * 0.10 / 10) * 10,
    netCoreHi: managedHi - Math.round(managedHi * 0.10 / 10) * 10,
    netPlusLo,
    netPlusHi,
    selfManagedLo: selfLo,
    selfManagedHi: selfHi,
    // Clamp uplift to 0 — never show a negative uplift number in the UI
    upliftLo: Math.max(0, netPlusLo - selfLo),
    upliftHi: Math.max(0, netPlusHi - selfHi),
  }
}

export function fmt(n: number): string {
  // Deterministic integer formatter — no locale dependency.
  // Rounds to nearest integer, inserts commas every 3 digits.
  const int = Math.round(Math.abs(n))
  const str = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return (n < 0 ? '-$' : '$') + str
}

// ── Comparison table data ─────────────────────────────────
// "Typical manager vs PlayaStays"

export interface ComparisonRow {
  feature:    string
  featureEs:  string
  typical:    string
  typicalEs:  string
  playastays: string
  playastaysEs: string
  highlight:  boolean   // true = PlayaStays row is highlighted
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature:    'Management fee',
    featureEs:  'Comisión de gestión',
    typical:    '20–35% + setup fees',
    typicalEs:  '20–35% + cuotas de inicio',
    playastays: '10–25%, no setup fee',
    playastaysEs: '10–25%, sin cuota de inicio',
    highlight:  true,
  },
  {
    feature:    'Pricing strategy',
    featureEs:  'Estrategia de precios',
    typical:    'Fixed or semi-static rates',
    typicalEs:  'Tarifas fijas o semi-estáticas',
    playastays: 'Real-time dynamic pricing, updated daily',
    playastaysEs: 'Precio dinámico en tiempo real, actualizado diariamente',
    highlight:  true,
  },
  {
    feature:    'Guest communication',
    featureEs:  'Comunicación con huéspedes',
    typical:    'Business hours only, often outsourced',
    typicalEs:  'Solo en horario de oficina, frecuentemente subcontratado',
    playastays: '24/7 bilingual response, <5 min average',
    playastaysEs: 'Respuesta bilingüe 24/7, menos de 5 min en promedio',
    highlight:  true,
  },
  {
    feature:    'Cleaning',
    featureEs:  'Limpieza',
    typical:    'Third-party, variable quality',
    typicalEs:  'Terceros, calidad variable',
    playastays: 'In-house team, hotel standard',
    playastaysEs: 'Equipo propio, estándar hotelero',
    highlight:  false,
  },
  {
    feature:    'Photography',
    featureEs:  'Fotografía',
    typical:    'Owner-provided or extra charge',
    typicalEs:  'Provista por el propietario o cargo adicional',
    playastays: 'Professional photography included',
    playastaysEs: 'Fotografía profesional incluida',
    highlight:  false,
  },
  {
    feature:    'Owner reporting',
    featureEs:  'Reportes al propietario',
    typical:    'Monthly PDF, limited data',
    typicalEs:  'PDF mensual, datos limitados',
    playastays: 'Real-time dashboard + monthly detailed report',
    playastaysEs: 'Dashboard en tiempo real + reporte mensual detallado',
    highlight:  false,
  },
  {
    feature:    'Local expertise',
    featureEs:  'Experiencia local',
    typical:    'Varies — often remote management',
    typicalEs:  'Variable — frecuentemente gestión remota',
    playastays: 'On-the-ground team in Quintana Roo',
    playastaysEs: 'Equipo en campo en Quintana Roo',
    highlight:  false,
  },
  {
    feature:    'Bilingual support',
    featureEs:  'Soporte bilingüe',
    typical:    'Rarely offered',
    typicalEs:  'Raramente disponible',
    playastays: 'Full EN/ES for owners and guests',
    playastaysEs: 'Inglés/Español completo para propietarios y huéspedes',
    highlight:  false,
  },
  {
    feature:    'Contract terms',
    featureEs:  'Términos del contrato',
    typical:    'Annual contract, exit penalties',
    typicalEs:  'Contrato anual, penalizaciones de salida',
    playastays: '30-day notice, no exit fee',
    playastaysEs: '30 días de aviso, sin comisión de salida',
    highlight:  true,
  },
]

'use client'

import { useMemo } from 'react'
import type { CompletenessReport, FieldCheck, FieldCategory } from '@/lib/property-completeness'

interface Props {
  report: CompletenessReport
}

const CATEGORY_LABELS: Record<FieldCategory, string> = {
  identity: 'Identity',
  location: 'Location',
  specs: 'Specs',
  pricing: 'Pricing',
  media: 'Media',
  amenities: 'Amenities',
  booking: 'Booking',
  availability: 'Availability',
  guest_info: 'Guest info',
  operations: 'Operations',
  seo: 'SEO & i18n',
}

const TIER_COLORS: Record<CompletenessReport['tier'], string> = {
  complete: '#10b981',
  good: '#3b82f6',
  'needs-work': '#f59e0b',
  incomplete: '#ef4444',
}

const TIER_LABELS: Record<CompletenessReport['tier'], string> = {
  complete: 'Ready to publish',
  good: 'Almost there',
  'needs-work': 'Needs work',
  incomplete: 'Not ready yet',
}

const TIER_GUIDANCE: Record<CompletenessReport['tier'], string> = {
  complete: 'This listing has all the essentials covered.',
  good: 'Looking good — fill in a few more fields to make it complete.',
  'needs-work': 'Several important fields are still missing.',
  incomplete: 'This listing needs key information before it can go live.',
}

export function CompletenessPanel({ report }: Props) {
  const { requiredMissing, optionalMissing } = report

  const missingRequired = useMemo(
    () => report.fields.filter(f => f.required && !f.present),
    [report.fields]
  )
  const missingRecommended = useMemo(
    () => report.fields.filter(f => !f.required && !f.present),
    [report.fields]
  )
  const allPresentCategories = useMemo(() => {
    const grouped: Record<string, FieldCheck[]> = {}
    for (const f of report.fields) {
      if (!grouped[f.category]) grouped[f.category] = []
      grouped[f.category].push(f)
    }
    return (Object.entries(grouped) as [FieldCategory, FieldCheck[]][])
      .filter(([, fields]) => fields.every(f => f.present))
      .map(([cat]) => cat)
  }, [report.fields])

  return (
    <div className="adm-completeness">
      <div className="adm-completeness__header">
        <div className="adm-completeness__title">Listing Readiness</div>
        <div className="adm-completeness__score" style={{ color: TIER_COLORS[report.tier] }}>
          {report.score}%
        </div>
      </div>

      <div className="adm-score" style={{ marginBottom: '.5rem' }}>
        <div className="adm-score__bar" style={{ height: '8px' }}>
          <div
            className={`adm-score__fill ${report.score >= 90 ? 'adm-score__fill--green' : report.score >= 60 ? 'adm-score__fill--yellow' : 'adm-score__fill--red'}`}
            style={{ width: `${report.score}%` }}
          />
        </div>
      </div>

      <div className="adm-completeness__tier" style={{ color: TIER_COLORS[report.tier] }}>
        {TIER_LABELS[report.tier]}
      </div>
      <div className="adm-completeness__guidance">
        {TIER_GUIDANCE[report.tier]}
      </div>

      {/* Required missing — highest priority */}
      {missingRequired.length > 0 && (
        <div className="adm-completeness__group">
          <div className="adm-completeness__group-title adm-completeness__group-title--required">
            Required ({missingRequired.length})
          </div>
          <ul className="adm-completeness__list">
            {missingRequired.map(f => (
              <li key={f.key} className="adm-completeness__item adm-completeness__item--missing">
                <span className="adm-completeness__dot adm-completeness__dot--red" />
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended missing — secondary priority */}
      {missingRecommended.length > 0 && (
        <div className="adm-completeness__group">
          <div className="adm-completeness__group-title adm-completeness__group-title--recommended">
            Recommended ({missingRecommended.length})
          </div>
          <ul className="adm-completeness__list">
            {missingRecommended.map(f => (
              <li key={f.key} className="adm-completeness__item adm-completeness__item--optional">
                <span className="adm-completeness__dot adm-completeness__dot--amber" />
                {f.label}
                <span className="adm-completeness__cat-label">{CATEGORY_LABELS[f.category]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Categories fully complete */}
      {allPresentCategories.length > 0 && (
        <div className="adm-completeness__group">
          <div className="adm-completeness__group-title adm-completeness__group-title--done">
            Complete
          </div>
          <ul className="adm-completeness__list">
            {allPresentCategories.map(cat => (
              <li key={cat} className="adm-completeness__item adm-completeness__item--done">
                <span className="adm-completeness__dot adm-completeness__dot--green" />
                {CATEGORY_LABELS[cat]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="adm-completeness__footer">
        {report.totalChecked} fields checked
        {requiredMissing === 0 && optionalMissing > 0 && (
          <> &middot; all required fields filled</>
        )}
      </div>
    </div>
  )
}

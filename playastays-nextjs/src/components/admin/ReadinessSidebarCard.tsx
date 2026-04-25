'use client'

import { useMemo } from 'react'
import type { Property } from '@/types'
import type { CompletenessReport } from '@/lib/property-completeness'
import { getLaunchReadiness, mergePropertyWithFormDraft } from '@/lib/admin-readiness'
import type { GalleryImage } from './GalleryManager'

/** Minimal server-shaped property for merge when creating a new listing */
const READINESS_STUB: Property = {
  id: 0,
  slug: '',
  title: { rendered: '' },
  excerpt: { rendered: '' },
  content: { rendered: '' },
  meta: {
    ps_city: '',
    ps_bedrooms: 1,
    ps_bathrooms: 1,
    ps_guests: 2,
    ps_nightly_rate: 0,
    ps_monthly_income: 0,
    ps_avg_occupancy: 0,
    ps_avg_rating: 0,
    ps_review_count: 0,
    ps_managed_by_ps: false,
  },
  ps_computed: {
    gallery: [],
    amenities: [],
    booking_links: {},
  },
}

export type ReadinessFormSlice = {
  city: string
  neighborhood: string
  buildingName: string
  nightlyRate: number
  monthlyRate: number
  salePrice: number
  listingType: string
  rentalStrategy: string
  listingStatus: string
  availabilityJson: string
  nextAvailableDate: string
  airbnbUrl: string
  vrboUrl: string
  bookingUrl: string
  directUrl: string
  ownerId: number
  managerId: number
  amenityKeys: string[]
}

interface Props {
  baseProperty: Property | null
  form: ReadinessFormSlice
  images: GalleryImage[]
  liveCompleteness: CompletenessReport
}

function queueLabel(q: string): string {
  if (q === 'launch_ready') return 'Launch-ready'
  if (q === 'blocked') return 'Blocked / draft'
  return 'Needs work'
}

function queueClass(q: string): string {
  if (q === 'launch_ready') return 'adm-queue-pill adm-queue-pill--ok'
  if (q === 'blocked') return 'adm-queue-pill adm-queue-pill--blocked'
  return 'adm-queue-pill adm-queue-pill--work'
}

export function ReadinessSidebarCard({ baseProperty, form, images, liveCompleteness }: Props) {
  const launch = useMemo(() => {
    const base = baseProperty ?? READINESS_STUB
    const merged = mergePropertyWithFormDraft(base, form, images)
    return getLaunchReadiness(merged, liveCompleteness)
  }, [baseProperty, form, images, liveCompleteness])

  return (
    <div className="adm-readiness-card">
      <div className="adm-readiness-card__head">
        <span className="adm-readiness-card__title">Launch queue</span>
        <span className={queueClass(launch.queue)} title="Based on status, completeness, and required data">
          {queueLabel(launch.queue)}
        </span>
      </div>
      {launch.readyToPublish && (
        <p className="adm-readiness-card__ok">Ready to publish — meets score and core data checks.</p>
      )}
      {launch.blockers.length > 0 ? (
        <>
          <div className="adm-readiness-card__sub">Still needed</div>
          <ul className="adm-readiness-card__chips">
            {launch.blockers.map(b => (
              <li key={b} className="adm-readiness-card__chip">{b}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className="adm-readiness-card__muted">No blocking gaps in this checklist.</p>
      )}
    </div>
  )
}

'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types'
import type { CompletenessReport } from '@/lib/property-completeness'
import type { AvailabilityBlock } from '@/types/availability'
import { parseStructuredAmenityKeys, collectResolvedAmenityKeys } from '@/lib/amenity-taxonomy'
import {
  SERVICE_CITIES,
  cityNameToSlug,
  getNeighborhoodsForCity,
  getBuildingOptionsForAdmin,
} from '@/lib/location-data'
import { parseAvailabilityJson } from '@/lib/availability'
import { propertyHref } from '@/lib/property-url'
import { AmenityPicker } from './AmenityPicker'
import { GalleryManager, type GalleryImage } from './GalleryManager'
import { CompletenessPanel } from './CompletenessPanel'
import { UserPicker } from './UserPicker'
import { SearchableSelect } from './SearchableSelect'
import { AvailabilityEditor } from './AvailabilityEditor'
import { ActivityLogPanel } from './ActivityLogPanel'
import { OpsIssuesPanel } from './OpsIssuesPanel'
import { ReadinessSidebarCard } from './ReadinessSidebarCard'
import { getPropertyCompleteness } from '@/lib/property-completeness'
import { parseActivityLog, serializeActivityLog } from '@/lib/activity-log'
import type { ActivityEntry } from '@/lib/activity-log'
import { parseOpsIssues, serializeOpsIssues } from '@/lib/ops-issues'
import type { OpsIssue } from '@/lib/ops-issues'

interface Props {
  property: Property | null
  completeness: CompletenessReport
  isNew?: boolean
}

type FormData = {
  title: string
  slug: string
  city: string
  neighborhood: string
  buildingName: string
  propertyType: string
  listingType: string
  /** vacation_rental | long_term | hybrid — separate from listingType */
  rentalStrategy: string
  listingStatus: string
  managed: boolean
  featured: boolean
  bedrooms: number
  bathrooms: number
  guests: number
  beds: number
  sqm: number
  floor: number
  nightlyRate: number
  monthlyRate: number
  salePrice: number
  cleaningFee: number
  currency: string
  minStayNights: number
  description: string
  excerpt: string
  titleEs: string
  contentEs: string
  amenityKeys: string[]
  bookingMode: string
  airbnbUrl: string
  vrboUrl: string
  bookingUrl: string
  directUrl: string
  nextAvailableDate: string
  availabilityJson: string
  checkInTime: string
  checkOutTime: string
  houseRules: string
  houseRulesEs: string
  ownerId: number
  managerId: number
  opsStatus: string
  internalNotes: string
  seoTitle: string
  seoDesc: string
  lat: number
  lng: number
  mapDisplayMode: string
}

function propertyToFormData(p: Property | null): FormData {
  if (!p) return defaultFormData()
  const m = p.meta
  const rawCity = m.ps_city || ''
  const citySlug = cityNameToSlug(rawCity) || rawCity
  return {
    title: p.title.rendered.replace(/<[^>]*>/g, ''),
    slug: p.slug,
    city: citySlug,
    neighborhood: m.ps_neighborhood || '',
    buildingName: m.ps_building_name || '',
    propertyType: m.ps_property_type || '',
    listingType: m.ps_listing_type || '',
    rentalStrategy:
      m.ps_rental_strategy === 'vacation_rental' ||
      m.ps_rental_strategy === 'long_term' ||
      m.ps_rental_strategy === 'hybrid'
        ? m.ps_rental_strategy
        : '',
    listingStatus: m.ps_listing_status || 'active',
    managed: m.ps_managed_by_ps,
    featured: m.ps_featured || false,
    bedrooms: m.ps_bedrooms,
    bathrooms: m.ps_bathrooms,
    guests: m.ps_guests,
    beds: m.ps_beds || 0,
    sqm: m.ps_sqm || 0,
    floor: m.ps_floor || 0,
    nightlyRate: m.ps_nightly_rate,
    monthlyRate: Number(m.ps_monthly_rate) || 0,
    salePrice: Number(m.ps_sale_price) || 0,
    cleaningFee: Number(m.ps_cleaning_fee) || 0,
    currency: m.ps_currency || 'USD',
    minStayNights: m.ps_min_stay_nights || 1,
    description: p.content.rendered,
    excerpt: p.excerpt.rendered.replace(/<[^>]*>/g, ''),
    titleEs: m.ps_title_es || '',
    contentEs: m.ps_content_es || '',
    amenityKeys: parseStructuredAmenityKeys(m.ps_amenity_keys).length > 0
      ? parseStructuredAmenityKeys(m.ps_amenity_keys)
      : collectResolvedAmenityKeys(p).filter(k => k !== 'playastays-managed' && k !== 'monthly-stay-available' && k !== 'long-term-stay-friendly'),
    bookingMode: m.ps_booking_mode || '',
    airbnbUrl: m.ps_airbnb_url || '',
    vrboUrl: m.ps_vrbo_url || '',
    bookingUrl: m.ps_booking_url || '',
    directUrl: m.ps_direct_url || '',
    nextAvailableDate: m.ps_next_available_date || '',
    availabilityJson: m.ps_availability_json || '',
    checkInTime: m.ps_check_in_time || '',
    checkOutTime: m.ps_check_out_time || '',
    houseRules: m.ps_house_rules || '',
    houseRulesEs: m.ps_house_rules_es || '',
    ownerId: m.ps_owner_id || 0,
    managerId: m.ps_manager_id || 0,
    opsStatus: m.ps_ops_status || '',
    internalNotes: m.ps_internal_notes || '',
    seoTitle: m.ps_seo_title || '',
    seoDesc: m.ps_seo_desc || '',
    lat: m.ps_lat || 0,
    lng: m.ps_lng || 0,
    mapDisplayMode: m.ps_map_display_mode || 'approximate',
  }
}

function defaultFormData(): FormData {
  return {
    title: '', slug: '', city: '', neighborhood: '', buildingName: '',
    propertyType: 'condo', listingType: 'rent', rentalStrategy: 'vacation_rental', listingStatus: 'draft',
    managed: false, featured: false,
    bedrooms: 1, bathrooms: 1, guests: 2, beds: 1, sqm: 0, floor: 0,
    nightlyRate: 0, monthlyRate: 0, salePrice: 0, cleaningFee: 0, currency: 'USD', minStayNights: 1,
    description: '', excerpt: '', titleEs: '', contentEs: '',
    amenityKeys: [],
    bookingMode: '', airbnbUrl: '', vrboUrl: '', bookingUrl: '', directUrl: '',
    nextAvailableDate: '', availabilityJson: '', checkInTime: '15:00', checkOutTime: '11:00',
    houseRules: '', houseRulesEs: '',
    ownerId: 0, managerId: 0, opsStatus: '', internalNotes: '',
    seoTitle: '', seoDesc: '', lat: 0, lng: 0, mapDisplayMode: 'approximate',
  }
}

function formDataToCompleteness(fd: FormData, images: GalleryImage[]): CompletenessReport {
  const fakeProperty = {
    title: { rendered: fd.title },
    content: { rendered: fd.description },
    excerpt: { rendered: fd.excerpt },
    meta: {
      ps_city: fd.city,
      ps_neighborhood: fd.neighborhood,
      ps_property_type: fd.propertyType,
      ps_listing_type: fd.listingType as 'rent' | 'sale' | 'both',
      ps_rental_strategy: fd.rentalStrategy || undefined,
      ps_bedrooms: fd.bedrooms,
      ps_bathrooms: fd.bathrooms,
      ps_guests: fd.guests,
      ps_beds: fd.beds,
      ps_sqm: fd.sqm,
      ps_nightly_rate: fd.nightlyRate,
      ps_monthly_rate: fd.monthlyRate,
      ps_sale_price: fd.salePrice,
      ps_cleaning_fee: fd.cleaningFee,
      ps_managed_by_ps: fd.managed,
      ps_avg_rating: 0,
      ps_review_count: 0,
      ps_listing_status: fd.listingStatus,
      ps_lat: fd.lat,
      ps_lng: fd.lng,
      ps_map_display_mode: fd.mapDisplayMode,
      ps_airbnb_url: fd.airbnbUrl,
      ps_vrbo_url: fd.vrboUrl,
      ps_booking_url: fd.bookingUrl,
      ps_direct_url: fd.directUrl,
      ps_booking_mode: fd.bookingMode,
      ps_availability_json: fd.availabilityJson || undefined,
      ps_next_available_date: fd.nextAvailableDate,
      ps_amenity_keys: fd.amenityKeys.length > 0 ? JSON.stringify(fd.amenityKeys) : undefined,
      ps_check_in_time: fd.checkInTime,
      ps_check_out_time: fd.checkOutTime,
      ps_house_rules: fd.houseRules,
      ps_owner_id: fd.ownerId || undefined,
      ps_manager_id: fd.managerId || undefined,
      ps_building_name: fd.buildingName,
      ps_ops_status: fd.opsStatus,
      ps_seo_title: fd.seoTitle,
      ps_seo_desc: fd.seoDesc,
      ps_title_es: fd.titleEs,
      ps_content_es: fd.contentEs,
    },
    ps_computed: {
      featured_image: images.find(i => i.isFeatured) || images[0] ? { url: (images.find(i => i.isFeatured) || images[0])?.url || '' } : undefined,
      gallery: images,
      amenities: [],
      booking_links: {
        airbnb: fd.airbnbUrl || undefined,
        vrbo: fd.vrboUrl || undefined,
        booking: fd.bookingUrl || undefined,
        direct: fd.directUrl || undefined,
      },
    },
  }
  return getPropertyCompleteness(fakeProperty)
}

// ── Section heading component ─────────────────────────────

function SectionHead({ num, title, desc, icon }: { num: number; title: string; desc: string; icon: string }) {
  return (
    <div className="adm-form-section__head">
      <span className="adm-form-section__num">{icon}</span>
      <div>
        <div className="adm-form-section__title">
          <span className="adm-form-section__step">Step {num}</span>
          {title}
        </div>
        <div className="adm-form-section__desc">{desc}</div>
      </div>
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────

export function PropertyEditorForm({ property, completeness, isNew }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(() => propertyToFormData(property))
  const [images, setImages] = useState<GalleryImage[]>(() => {
    if (!property) return []
    const all: GalleryImage[] = []
    const fi = property.ps_computed.featured_image
    if (fi) {
      all.push({ wpId: fi.id, url: fi.url, alt: fi.alt, isFeatured: true })
    }
    property.ps_computed.gallery.forEach(img => {
      if (img.url !== fi?.url) {
        all.push({ wpId: img.id, url: img.url, alt: img.alt })
      }
    })
    return all
  })

  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err' | 'info'; text: string } | null>(
    isNew ? { type: 'info', text: 'Fill in the listing details below, then save to create.' } : null
  )
  const [dirty, setDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>(() =>
    parseActivityLog(property?.meta.ps_ops_activity_log),
  )
  const [opsIssues, setOpsIssues] = useState<OpsIssue[]>(() =>
    parseOpsIssues(property?.meta.ps_ops_issues),
  )

  useEffect(() => {
    setActivityEntries(parseActivityLog(property?.meta.ps_ops_activity_log))
  }, [property?.id])

  useEffect(() => {
    setOpsIssues(parseOpsIssues(property?.meta.ps_ops_issues))
  }, [property?.id])

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setDirty(true)
    if (saveMsg?.type === 'ok') setSaveMsg(null)
  }, [saveMsg])

  const handleImagesChange = useCallback((next: GalleryImage[]) => {
    setImages(next)
    setDirty(true)
    if (saveMsg?.type === 'ok') setSaveMsg(null)
  }, [saveMsg])

  const liveCompleteness = useMemo(() => formDataToCompleteness(form, images), [form, images])

  // Derived location options
  const neighborhoodOptions = useMemo(() =>
    getNeighborhoodsForCity(form.city).map(n => ({ value: n.value, label: n.label })),
    [form.city],
  )
  const buildingOptions = useMemo(
    () => getBuildingOptionsForAdmin(form.city, form.neighborhood),
    [form.city, form.neighborhood],
  )

  // Availability blocks — parse from JSON, sync back on change
  const availabilityBlocks = useMemo<AvailabilityBlock[]>(() => {
    const parsed = parseAvailabilityJson(form.availabilityJson)
    return (parsed?.blocks || []).filter(
      (b): b is AvailabilityBlock => !!b.start && !!b.end && !!b.kind,
    )
  }, [form.availabilityJson])

  const handleAvailabilityBlocksChange = useCallback((blocks: AvailabilityBlock[]) => {
    const parsed = parseAvailabilityJson(form.availabilityJson)
    const payload = {
      version: parsed?.version || 1,
      blocks,
      nextAvailable: form.nextAvailableDate || undefined,
      minStayNights: form.minStayNights || undefined,
    }
    update('availabilityJson', JSON.stringify(payload, null, 2))
  }, [form.availabilityJson, form.nextAvailableDate, form.minStayNights, update])

  useEffect(() => {
    if (!dirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  async function handleSave() {
    if (!form.title.trim()) {
      setSaveMsg({ type: 'err', text: 'A property title is required before saving.' })
      return
    }

    setSaving(true)
    setSaveMsg(null)
    try {
      const featuredImage = images.find(i => i.isFeatured) || images[0]
      const featuredMediaId = featuredImage?.wpId
      const galleryIds = images.filter(i => i.wpId && !(i.isFeatured && i.wpId === featuredMediaId)).map(i => i.wpId!)

      const res = await fetch('/api/admin/property', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: property?.id,
          form,
          amenityKeys: form.amenityKeys,
          opsActivityLog: serializeActivityLog(activityEntries),
          opsIssues: serializeOpsIssues(opsIssues),
          featuredMediaId,
          galleryIds,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const detail = data.detail || data.error || `Error ${res.status}`
        throw new Error(detail)
      }

      setDirty(false)
      setLastSavedAt(new Date())
      setSaveMsg({ type: 'ok', text: isNew ? 'Property created — continue editing below.' : 'All changes saved.' })

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        setSaveMsg(prev => prev?.type === 'ok' ? null : prev)
      }, 8000)

      if (isNew && data.id) {
        router.push(`/admin/properties/${data.id}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      if (msg.includes('503') || msg.includes('not configured')) {
        setSaveMsg({ type: 'err', text: 'WordPress credentials not configured — add WP_APP_PASSWORD to .env.local to enable saves.' })
      } else {
        setSaveMsg({ type: 'err', text: `Save failed: ${msg}` })
      }
    } finally {
      setSaving(false)
    }
  }

  const ownerData = property?.ps_computed.owner
  const managerData = property?.ps_computed.manager

  return (
    <div className="adm-editor">
      <div className="adm-editor__main">

        {/* ── 1. Listing identity ──────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={1} title="Listing Identity" desc="What is this property? Set the core details that identify and classify this listing." icon="🏠" />
          <div className="adm-form-grid">
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">Property title <span className="adm-field__req">*</span></label>
              <input className="adm-field__input adm-field__input--lg" value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Ocean View Penthouse in Playacar" />
              {!form.title.trim() && <span className="adm-field__hint" style={{ color: '#ef4444' }}>Required — this is the listing name guests will see.</span>}
            </div>

            {/* City — controlled dropdown */}
            <div className="adm-field">
              <label className="adm-field__label">City <span className="adm-field__req">*</span></label>
              <select
                className="adm-field__select"
                value={form.city}
                onChange={e => {
                  const newCity = e.target.value
                  update('city', newCity)
                  if (newCity !== form.city) {
                    update('neighborhood', '')
                    update('buildingName', '')
                  }
                }}
              >
                <option value="">Select city...</option>
                {SERVICE_CITIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
              {!form.city && <span className="adm-field__hint">Choose the service area this property is in.</span>}
            </div>

            {/* Neighborhood — searchable, filtered by city */}
            <SearchableSelect
              label="Neighborhood"
              hint={form.city ? 'Search or pick the neighborhood within the selected city.' : 'Select a city first.'}
              options={neighborhoodOptions}
              value={form.neighborhood}
              onChange={v => {
                update('neighborhood', v)
                if (v !== form.neighborhood) update('buildingName', '')
              }}
              placeholder="Search neighborhood..."
              disabled={!form.city}
              allowCustom
              customLabel="Other / not listed"
            />

            {/* Building — searchable, filtered by city + neighborhood */}
            <SearchableSelect
              label="Building / development"
              hint={
                !form.city
                  ? 'Select a city first.'
                  : form.neighborhood
                    ? 'Options match this neighborhood first; city-wide resorts appear with “· city-wide”. Use Other if yours is not listed.'
                    : 'Pick a neighborhood to narrow buildings; with city only, all developments in the city are shown.'
              }
              options={buildingOptions}
              value={form.buildingName}
              onChange={v => update('buildingName', v)}
              placeholder="Search building..."
              disabled={!form.city}
              allowCustom
              customLabel="Other / not listed"
            />

            <div className="adm-field">
              <label className="adm-field__label">Property type <span className="adm-field__req">*</span></label>
              <select className="adm-field__select" value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
                <option value="">Select type...</option>
                <option value="condo">Condo</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="resort">Resort unit</option>
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Listing type</label>
              <select className="adm-field__select" value={form.listingType} onChange={e => update('listingType', e.target.value)}>
                <option value="rent">For rent</option>
                <option value="sale">For sale</option>
                <option value="both">Rent + Sale</option>
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Rental strategy</label>
              <select
                className="adm-field__select"
                value={form.rentalStrategy}
                onChange={e => update('rentalStrategy', e.target.value)}
                disabled={form.listingType === 'sale'}
              >
                <option value="">Not set — browse infers from nightly / monthly rates</option>
                <option value="vacation_rental">Vacation rental (short-term)</option>
                <option value="long_term">Long-term rental</option>
                <option value="hybrid">Both / hybrid</option>
              </select>
              <span className="adm-field__hint">
                Separate from listing type. Drives browse filters and guest-facing badges; not part of the public URL.
                {form.listingType === 'sale' && ' N/A for sale-only listings.'}
              </span>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Status</label>
              <select className="adm-field__select" value={form.listingStatus} onChange={e => update('listingStatus', e.target.value)}>
                <option value="active">Active — visible on site</option>
                <option value="draft">Draft — not published</option>
                <option value="inactive">Inactive — hidden</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-field__check-row">
                <input type="checkbox" checked={form.managed} onChange={e => update('managed', e.target.checked)} />
                Managed by PlayaStays
              </label>
              <label className="adm-field__check-row">
                <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} />
                Featured listing
              </label>
            </div>
          </div>
        </div>

        {/* ── 2. Property specs ────────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={2} title="Property Specs" desc="How many guests can stay? Bedrooms, beds, bathrooms, and size." icon="📐" />
          <div className="adm-form-grid">
            <div className="adm-field">
              <label className="adm-field__label">Max guests <span className="adm-field__req">*</span></label>
              <input type="number" min={1} className="adm-field__input" value={form.guests} onChange={e => update('guests', +e.target.value)} />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Bedrooms <span className="adm-field__req">*</span></label>
              <input type="number" min={0} className="adm-field__input" value={form.bedrooms} onChange={e => update('bedrooms', +e.target.value)} />
              <span className="adm-field__hint">0 = Studio layout</span>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Beds</label>
              <input type="number" min={0} className="adm-field__input" value={form.beds} onChange={e => update('beds', +e.target.value)} />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Bathrooms <span className="adm-field__req">*</span></label>
              <input type="number" min={0} step={0.5} className="adm-field__input" value={form.bathrooms} onChange={e => update('bathrooms', +e.target.value)} />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Size (m²)</label>
              <input type="number" min={0} className="adm-field__input" value={form.sqm || ''} onChange={e => update('sqm', +e.target.value)} placeholder="Optional" />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Floor level</label>
              <input type="number" min={0} className="adm-field__input" value={form.floor || ''} onChange={e => update('floor', +e.target.value)} placeholder="Optional" />
            </div>
          </div>
        </div>

        {/* ── 3. Pricing ──────────────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={3} title="Pricing" desc="Set the rates guests will see. At least one price is required for the listing to be useful." icon="💰" />
          <div className="adm-form-grid">
            <div className="adm-field">
              <label className="adm-field__label">Nightly rate{form.listingType !== 'sale' && <span className="adm-field__req"> *</span>}</label>
              <div className="adm-field__input-group">
                <span className="adm-field__prefix">$</span>
                <input type="number" min={0} className="adm-field__input" value={form.nightlyRate || ''} onChange={e => update('nightlyRate', +e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Monthly rate</label>
              <div className="adm-field__input-group">
                <span className="adm-field__prefix">$</span>
                <input type="number" min={0} className="adm-field__input" value={form.monthlyRate || ''} onChange={e => update('monthlyRate', +e.target.value)} placeholder="Optional" />
              </div>
            </div>
            {(form.listingType === 'sale' || form.listingType === 'both') && (
              <div className="adm-field">
                <label className="adm-field__label">Sale price <span className="adm-field__req">*</span></label>
                <div className="adm-field__input-group">
                  <span className="adm-field__prefix">$</span>
                  <input type="number" min={0} className="adm-field__input" value={form.salePrice || ''} onChange={e => update('salePrice', +e.target.value)} />
                </div>
              </div>
            )}
            <div className="adm-field">
              <label className="adm-field__label">Cleaning fee</label>
              <div className="adm-field__input-group">
                <span className="adm-field__prefix">$</span>
                <input type="number" min={0} className="adm-field__input" value={form.cleaningFee || ''} onChange={e => update('cleaningFee', +e.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Minimum stay</label>
              <div className="adm-field__input-group">
                <input type="number" min={1} className="adm-field__input" value={form.minStayNights} onChange={e => update('minStayNights', +e.target.value)} />
                <span className="adm-field__suffix">nights</span>
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Currency</label>
              <select className="adm-field__select" value={form.currency} onChange={e => update('currency', e.target.value)}>
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── 4. Description ──────────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={4} title="Description & Copy" desc="Write the listing copy guests will read. English is the primary authoring language." icon="✍️" />
          <div className="adm-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="adm-field">
              <label className="adm-field__label">Description (English) <span className="adm-field__req">*</span></label>
              <textarea className="adm-field__textarea" value={form.description.replace(/<[^>]*>/g, '')} onChange={e => update('description', e.target.value)} rows={6} placeholder="Describe the property — what makes it special, the neighborhood feel, and what guests can expect..." />
              <span className="adm-field__hint">{form.description.replace(/<[^>]*>/g, '').trim().length} characters{form.description.replace(/<[^>]*>/g, '').trim().length < 30 ? ' — aim for 200+ for a strong listing' : ''}</span>
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Short excerpt</label>
              <textarea className="adm-field__textarea" value={form.excerpt} onChange={e => update('excerpt', e.target.value)} rows={2} style={{ minHeight: '60px' }} placeholder="One-line summary for cards and search results..." />
            </div>
          </div>

          {/* Spanish — collapsed by default, manual override only */}
          <details className="adm-form-section__advanced">
            <summary className="adm-form-section__advanced-toggle">
              Spanish translation overrides
              {(form.titleEs || form.contentEs) && <span className="adm-form-section__advanced-badge">has overrides</span>}
            </summary>
            <div className="adm-form-section__advanced-body">
              <p className="adm-form-section__advanced-note">
                Spanish content for /es/ pages is populated through the translation system. Only use these fields to manually override the translated text for this specific listing. Leave blank to use the default translation flow.
              </p>
              <div className="adm-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="adm-field">
                  <label className="adm-field__label">Title override (ES)</label>
                  <input className="adm-field__input" value={form.titleEs} onChange={e => update('titleEs', e.target.value)} placeholder="Leave blank to use translated title" />
                </div>
                <div className="adm-field">
                  <label className="adm-field__label">Description override (ES)</label>
                  <textarea className="adm-field__textarea" value={(form.contentEs || '').replace(/<[^>]*>/g, '')} onChange={e => update('contentEs', e.target.value)} rows={4} placeholder="Leave blank to use translated description" />
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* ── 5. Photos ───────────────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={5} title="Photos & Gallery" desc="Upload photos — the first one or the one you mark ★ becomes the main listing image. Aim for 5+ photos." icon="📸" />
          <GalleryManager images={images} onChange={handleImagesChange} propertyId={property?.id} />
        </div>

        {/* ── 6. Amenities ────────────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={6} title="Amenities" desc="Select what this property offers. These power the browse filters, detail page, and listing badges." icon="✅" />
          <AmenityPicker selected={form.amenityKeys} onChange={keys => update('amenityKeys', keys)} />
        </div>

        {/* ── 7. Location ─────────────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={7} title="Location" desc="GPS coordinates for the map pin. Set display mode to control what guests see." icon="📍" />
          <div className="adm-form-grid">
            <div className="adm-field">
              <label className="adm-field__label">Latitude</label>
              <input type="number" step="any" className="adm-field__input" value={form.lat || ''} onChange={e => update('lat', +e.target.value)} placeholder="20.6296" />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Longitude</label>
              <input type="number" step="any" className="adm-field__input" value={form.lng || ''} onChange={e => update('lng', +e.target.value)} placeholder="-87.0739" />
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Map display</label>
              <select className="adm-field__select" value={form.mapDisplayMode} onChange={e => update('mapDisplayMode', e.target.value)}>
                <option value="exact">Exact pin — show street address</option>
                <option value="approximate">Approximate — show neighborhood area</option>
                <option value="hidden">Hidden — no map shown</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── 8. Booking & availability ────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={8} title="Booking & Availability" desc="Configure booking channels, availability blocks, and guest policies." icon="🗓️" />

          <div className="adm-form-section__divider">Booking links</div>
          <div className="adm-form-grid">
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">Airbnb listing URL</label>
              <input type="url" className="adm-field__input" value={form.airbnbUrl} onChange={e => update('airbnbUrl', e.target.value)} placeholder="https://airbnb.com/rooms/..." />
            </div>
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">VRBO listing URL</label>
              <input type="url" className="adm-field__input" value={form.vrboUrl} onChange={e => update('vrboUrl', e.target.value)} placeholder="https://vrbo.com/..." />
            </div>
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">Booking.com URL</label>
              <input type="url" className="adm-field__input" value={form.bookingUrl} onChange={e => update('bookingUrl', e.target.value)} placeholder="https://booking.com/..." />
            </div>
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">Direct booking URL</label>
              <input type="url" className="adm-field__input" value={form.directUrl} onChange={e => update('directUrl', e.target.value)} placeholder="Your direct booking page" />
            </div>
          </div>

          <div className="adm-form-section__divider">Availability & scheduling</div>
          <AvailabilityEditor
            blocks={availabilityBlocks}
            onChange={handleAvailabilityBlocksChange}
            nextAvailableDate={form.nextAvailableDate}
            onNextAvailableDateChange={v => update('nextAvailableDate', v)}
            checkInTime={form.checkInTime}
            onCheckInTimeChange={v => update('checkInTime', v)}
            checkOutTime={form.checkOutTime}
            onCheckOutTimeChange={v => update('checkOutTime', v)}
            minStayNights={form.minStayNights}
            onMinStayNightsChange={v => update('minStayNights', v)}
            bookingMode={form.bookingMode}
            onBookingModeChange={v => update('bookingMode', v)}
            rawCalendarJson={form.availabilityJson}
          />

          <div className="adm-form-section__divider">Guest rules</div>
          <div className="adm-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="adm-field">
              <label className="adm-field__label">House rules</label>
              <textarea className="adm-field__textarea" value={form.houseRules} onChange={e => update('houseRules', e.target.value)} rows={3} style={{ minHeight: '80px' }} placeholder="No smoking, quiet hours after 10pm..." />
            </div>
          </div>
          <details className="adm-form-section__advanced">
            <summary className="adm-form-section__advanced-toggle">
              House rules — Spanish override
              {form.houseRulesEs && <span className="adm-form-section__advanced-badge">has override</span>}
            </summary>
            <div className="adm-form-section__advanced-body">
              <div className="adm-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="adm-field">
                  <label className="adm-field__label">Reglas de la casa (ES override)</label>
                  <textarea className="adm-field__textarea" value={form.houseRulesEs} onChange={e => update('houseRulesEs', e.target.value)} rows={3} style={{ minHeight: '80px' }} placeholder="Leave blank to use translated rules" />
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* ── 9. Operations & internal ─────────────────────── */}
        <div className="adm-form-section adm-form-section--internal">
          <SectionHead num={9} title="Operations & Internal" desc="Internal team data — never shown to guests or on the public site." icon="🔒" />
          <div className="adm-form-grid">
            <div className="adm-field">
              <label className="adm-field__label">Ops status</label>
              <select className="adm-field__select" value={form.opsStatus} onChange={e => update('opsStatus', e.target.value)}>
                <option value="">Not set</option>
                <option value="active">Active</option>
                <option value="needs-attention">Needs attention</option>
                <option value="maintenance">Maintenance</option>
                <option value="onboarding">Onboarding</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <UserPicker
              label="Property owner"
              hint="Search by name or email to assign the property owner."
              value={form.ownerId}
              onChange={v => update('ownerId', v)}
              resolvedUser={ownerData}
            />
            {form.ownerId > 0 && (
              <div className="adm-field adm-field--full" style={{ marginTop: '-0.25rem' }}>
                <Link href={`/admin/owners/${form.ownerId}`} className="adm-owner-profile-shortcut">
                  View owner profile →
                </Link>
                <span className="adm-field__hint">Opens the internal owner record and linked listings.</span>
              </div>
            )}
            <UserPicker
              label="Assigned manager"
              hint="The PlayaStays team member responsible for this property."
              value={form.managerId}
              onChange={v => update('managerId', v)}
              resolvedUser={managerData}
            />
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">Activity log</label>
              <ActivityLogPanel
                entries={activityEntries}
                onChange={setActivityEntries}
                onDirty={() => setDirty(true)}
              />
            </div>
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">Issues & maintenance</label>
              <OpsIssuesPanel issues={opsIssues} onChange={setOpsIssues} onDirty={() => setDirty(true)} />
            </div>
            <div className="adm-field adm-field--full">
              <label className="adm-field__label">Internal notes</label>
              <span className="adm-field__hint" style={{ display: 'block', marginBottom: '.35rem' }}>Free-form scratchpad (separate from the structured activity log and issues).</span>
              <textarea className="adm-field__textarea adm-field__textarea--internal" value={form.internalNotes} onChange={e => update('internalNotes', e.target.value)} rows={3} style={{ minHeight: '80px' }} placeholder="Private team notes — access codes, special instructions, owner preferences..." />
            </div>
          </div>
        </div>

        {/* ── 10. SEO ─────────────────────────────────────── */}
        <div className="adm-form-section">
          <SectionHead num={10} title="SEO Overrides" desc="Leave blank to use auto-generated titles and descriptions." icon="🔎" />
          <div className="adm-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="adm-field">
              <label className="adm-field__label">Custom SEO title</label>
              <input className="adm-field__input" value={form.seoTitle} onChange={e => update('seoTitle', e.target.value)} placeholder="Auto-generated from property title if blank" />
              {form.seoTitle && <span className="adm-field__hint">{form.seoTitle.length}/60 characters</span>}
            </div>
            <div className="adm-field">
              <label className="adm-field__label">Custom meta description</label>
              <textarea className="adm-field__textarea" value={form.seoDesc} onChange={e => update('seoDesc', e.target.value)} rows={2} style={{ minHeight: '60px' }} placeholder="Auto-generated from property description if blank" />
              {form.seoDesc && <span className="adm-field__hint">{form.seoDesc.length}/160 characters</span>}
            </div>
          </div>
        </div>

        {/* ── Save bar ────────────────────────────────────── */}
        <div className="adm-save-bar">
          <div className="adm-save-bar__left">
            <button type="button" className="adm-btn adm-btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : isNew ? 'Create Property' : 'Save Changes'}
            </button>
            {dirty && !saving && (
              <span className="adm-save-bar__dirty">Unsaved changes</span>
            )}
            {!dirty && lastSavedAt && !saveMsg && (
              <span className="adm-save-bar__saved">Last saved {lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          {saveMsg && (
            <span className={`adm-save-bar__msg adm-save-bar__msg--${saveMsg.type}`}>{saveMsg.text}</span>
          )}
        </div>
      </div>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <div className="adm-editor__aside">
        <ReadinessSidebarCard
          baseProperty={property}
          form={{
            city: form.city,
            neighborhood: form.neighborhood,
            buildingName: form.buildingName,
            nightlyRate: form.nightlyRate,
            monthlyRate: form.monthlyRate,
            salePrice: form.salePrice,
            listingType: form.listingType,
            rentalStrategy: form.rentalStrategy,
            listingStatus: form.listingStatus,
            availabilityJson: form.availabilityJson,
            nextAvailableDate: form.nextAvailableDate,
            airbnbUrl: form.airbnbUrl,
            vrboUrl: form.vrboUrl,
            bookingUrl: form.bookingUrl,
            directUrl: form.directUrl,
            ownerId: form.ownerId,
            managerId: form.managerId,
            amenityKeys: form.amenityKeys,
          }}
          images={images}
          liveCompleteness={liveCompleteness}
        />
        <CompletenessPanel report={liveCompleteness} />
        {property && (
          <div className="adm-sidebar-card" style={{ marginTop: '1rem' }}>
            <div className="adm-sidebar-card__title">Quick links</div>
            <a href={propertyHref(property)} target="_blank" rel="noopener" className="adm-sidebar-card__link">View on site ↗</a>
            {property.meta.ps_airbnb_url && <a href={property.meta.ps_airbnb_url} target="_blank" rel="noopener" className="adm-sidebar-card__link">Airbnb ↗</a>}
            {property.meta.ps_vrbo_url && <a href={property.meta.ps_vrbo_url} target="_blank" rel="noopener" className="adm-sidebar-card__link">VRBO ↗</a>}
          </div>
        )}
      </div>
    </div>
  )
}

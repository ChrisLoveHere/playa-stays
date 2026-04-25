// ============================================================
// PlayaStays — Admin / Backend Architecture Types
//
// Type definitions for the future admin dashboard and owner portal.
// These define the MODULE CONTRACTS — what each dashboard section
// expects as data, not the UI components themselves.
//
// Build order:
//  1. Property operations backend (CMS + structured data) ← CURRENT
//  2. Internal admin dashboard (KPIs, listings, operations)
//  3. Owner portal (property-scoped views for owners)
//
// All modules consume Property/City/Availability types from @/types.
// ============================================================

import type { FieldCategory, CompletenessReport } from '@/lib/property-completeness'

// ── Auth / Roles ──────────────────────────────────────────

export type AdminRole = 'ps_admin' | 'ps_manager' | 'ps_editor' | 'ps_owner'

export interface AdminUser {
  id: number
  display_name: string
  email: string
  role: AdminRole
  /** For owners: IDs of properties they own */
  property_ids?: number[]
}

// ── Admin Dashboard Modules ──────────────────────────────

/**
 * MODULE: Portfolio Overview
 * Shows aggregate health of all managed properties.
 * Data source: property list + computed fields
 */
export interface PortfolioOverviewData {
  totalProperties: number
  activeListings: number
  draftListings: number
  managedByPs: number
  forRent: number
  forSale: number
  forBoth: number
  cityCounts: Array<{ city: string; count: number }>
  typeCounts: Array<{ type: string; count: number }>
}

/**
 * MODULE: Revenue & Occupancy Snapshot
 * Aggregated from property-level performance meta.
 * Data source: ps_monthly_income, ps_avg_occupancy
 */
export interface RevenueSnapshotData {
  totalMonthlyIncome: number
  averageOccupancy: number
  averageNightlyRate: number
  averageRating: number
  totalReviews: number
  /** Properties grouped by occupancy tier */
  occupancyDistribution: Array<{ tier: string; count: number }>
}

/**
 * MODULE: Upcoming Turnovers
 * Properties with guests checking out within N days.
 * Data source: ps_availability_json blocks
 */
export interface TurnoverItem {
  propertyId: number
  propertyTitle: string
  city: string
  checkOutDate: string
  nextCheckInDate: string | null
  gapNights: number
  needsCleaning: boolean
}

export interface UpcomingTurnoversData {
  turnovers: TurnoverItem[]
  withinDays: number
}

/**
 * MODULE: Availability Alerts
 * Properties with calendar gaps, missing data, or upcoming blocks.
 * Data source: ps_availability_json, ps_next_available_date
 */
export interface AvailabilityAlertItem {
  propertyId: number
  propertyTitle: string
  alertType: 'no-calendar' | 'extended-vacancy' | 'owner-use-upcoming' | 'maintenance-upcoming'
  description: string
  dateRange?: { start: string; end: string }
}

export interface AvailabilityAlertsData {
  alerts: AvailabilityAlertItem[]
}

/**
 * MODULE: Listing Quality / Data Completeness
 * Properties ranked by completeness score from property-completeness.ts.
 * Data source: CompletenessReport per property
 */
export interface ListingQualityItem {
  propertyId: number
  propertyTitle: string
  city: string
  score: number
  tier: CompletenessReport['tier']
  missingCategories: FieldCategory[]
  requiredMissing: number
}

export interface ListingQualityData {
  properties: ListingQualityItem[]
  averageScore: number
  completeCount: number
  needsWorkCount: number
  incompleteCount: number
}

/**
 * MODULE: Maintenance / Issue Tickets
 * Per-property foundation: `ps_ops_issues` JSON on property meta (see `lib/ops-issues.ts`).
 * A fuller ticket CPT or external integration can replace or sync later.
 */
export interface TicketItem {
  id: number
  propertyId: number
  propertyTitle: string
  type: 'maintenance' | 'guest-issue' | 'owner-request' | 'compliance'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  title: string
  createdAt: string
  assignedTo?: string
}

export interface TicketsData {
  tickets: TicketItem[]
  openCount: number
  urgentCount: number
}

// ── Owner Portal Modules ─────────────────────────────────

/**
 * MODULE: Owner Property List
 * Properties owned by the logged-in owner.
 * Data source: ps_owner_id matching current user
 */
export interface OwnerPropertyItem {
  id: number
  title: string
  city: string
  neighborhood: string
  listingType: 'rent' | 'sale' | 'both'
  managedByPs: boolean
  opsStatus: string
  nightlyRate: number
  monthlyRate: number
  occupancy: number
  rating: number
  imageUrl: string
  completenessScore: number
}

/**
 * MODULE: Owner Revenue Snapshot
 * Revenue/occupancy for one owner's portfolio.
 * Data source: ps_monthly_income per owned property
 */
export interface OwnerRevenueData {
  totalMonthlyIncome: number
  averageOccupancy: number
  propertyCount: number
  /** Monthly breakdown — future: requires booking-level data */
  monthlyBreakdown?: Array<{ month: string; income: number; occupancy: number }>
}

/**
 * MODULE: Owner Availability View
 * Calendar visibility for owner's properties.
 * Data source: ps_availability_json per owned property
 */
export interface OwnerAvailabilityData {
  propertyId: number
  propertyTitle: string
  hasCalendar: boolean
  nextAvailable: string | null
  upcomingBlocks: Array<{
    start: string
    end: string
    kind: string
    note?: string
  }>
  ownerUsePeriodsCount: number
}

/**
 * MODULE: Owner Statements / Payouts
 * Future: requires financial data integration.
 */
export interface OwnerStatementPeriod {
  periodStart: string
  periodEnd: string
  grossRevenue: number
  managementFee: number
  expenses: number
  netPayout: number
  status: 'pending' | 'paid'
}

// ── Architecture: what lives where ───────────────────────

/**
 * Recommendation summary for where each concern should live.
 *
 * WORDPRESS CMS (current):
 *  - Property CRUD (content, media, meta fields)
 *  - Structured amenities (ps_amenity_keys via metabox)
 *  - Availability JSON (manual entry or PMS webhook)
 *  - Owner assignment (ps_owner_id)
 *  - Bilingual content (metabox)
 *  - Lead capture
 *  - ISR webhooks
 *  - Roles (ps_manager, ps_editor, ps_owner)
 *
 * NEXT.JS ADMIN LAYER (future /admin routes):
 *  - Portfolio dashboard (aggregates from WP REST)
 *  - Listing quality reports (CompletenessReport)
 *  - Availability alerts (derived from availability.ts)
 *  - Turnover planning (derived from availability blocks)
 *  - KPI snapshots (aggregated from property meta)
 *
 * NEXT.JS OWNER PORTAL (future /portal routes):
 *  - Owner-scoped property list
 *  - Revenue/occupancy views
 *  - Calendar visibility
 *  - Owner-use period requests
 *
 * SEPARATE SERVICE (future):
 *  - Booking engine / PMS sync
 *  - Financial ledger / payout calculations
 *  - Ticket/issue management
 *  - Guest communication
 *  - Channel manager integration
 */
export type ArchitectureLayer = 'wordpress' | 'nextjs-admin' | 'nextjs-portal' | 'external-service'

export interface ArchitectureModule {
  name: string
  layer: ArchitectureLayer
  description: string
  dataRequirements: string[]
  readyToImplement: boolean
  blockers?: string[]
}

export const ARCHITECTURE_MODULES: ArchitectureModule[] = [
  {
    name: 'Property CRUD + Structured Amenities',
    layer: 'wordpress',
    description: 'Full property creation/editing with structured amenity checkboxes, ops fields, and validation',
    dataRequirements: ['ps_property CPT', 'ps_amenity_keys meta', 'ps_ops_status meta'],
    readyToImplement: true,
  },
  {
    name: 'Portfolio Overview Dashboard',
    layer: 'nextjs-admin',
    description: 'Aggregate view of all managed properties — counts, city breakdown, status distribution',
    dataRequirements: ['All properties via REST', 'ps_listing_type', 'ps_managed_by_ps', 'ps_city'],
    readyToImplement: true,
  },
  {
    name: 'Listing Quality Report',
    layer: 'nextjs-admin',
    description: 'Ranked list of properties by data completeness score with per-field missing indicators',
    dataRequirements: ['All properties via REST', 'CompletenessReport from property-completeness.ts'],
    readyToImplement: true,
  },
  {
    name: 'Availability Alerts',
    layer: 'nextjs-admin',
    description: 'Properties with calendar gaps, no calendar data, or upcoming blocks requiring action',
    dataRequirements: ['ps_availability_json per property', 'PropertyAvailabilitySummary'],
    readyToImplement: true,
    blockers: ['Most properties do not yet have ps_availability_json populated'],
  },
  {
    name: 'Revenue Snapshot',
    layer: 'nextjs-admin',
    description: 'Aggregate revenue and occupancy metrics across managed portfolio',
    dataRequirements: ['ps_monthly_income', 'ps_avg_occupancy', 'ps_avg_rating'],
    readyToImplement: true,
    blockers: ['Performance metrics are static CMS values; real-time booking data requires PMS integration'],
  },
  {
    name: 'Turnover Planning',
    layer: 'nextjs-admin',
    description: 'Upcoming check-outs and gap analysis for cleaning/prep coordination',
    dataRequirements: ['ps_availability_json with booked blocks and dates'],
    readyToImplement: false,
    blockers: ['Requires populated availability blocks with booking-level granularity'],
  },
  {
    name: 'Owner Portal — Property List',
    layer: 'nextjs-portal',
    description: 'Owner-scoped view of their properties with status, performance, and completeness',
    dataRequirements: ['ps_owner_id matching authenticated user', 'Properties filtered by owner'],
    readyToImplement: false,
    blockers: ['Requires auth/session for owner users', 'ps_owner_id must be consistently populated'],
  },
  {
    name: 'Owner Portal — Revenue View',
    layer: 'nextjs-portal',
    description: 'Revenue and occupancy for owner\'s properties — initially from static meta, later from booking data',
    dataRequirements: ['Properties filtered by owner', 'ps_monthly_income', 'ps_avg_occupancy'],
    readyToImplement: false,
    blockers: ['Requires auth/session', 'Financial detail requires booking-level data'],
  },
  {
    name: 'Ticket / Issue System',
    layer: 'external-service',
    description: 'Maintenance requests, guest issues, owner requests — tracked per property',
    dataRequirements: ['Ticket CPT or external integration', 'Property linkage', 'User assignment'],
    readyToImplement: false,
    blockers: ['Requires dedicated ticket data model', 'UI/workflow design needed'],
  },
  {
    name: 'Financial Ledger / Payouts',
    layer: 'external-service',
    description: 'Per-property revenue tracking, expense allocation, owner payout calculation',
    dataRequirements: ['Booking-level revenue data', 'Expense records', 'Commission rates', 'Payout schedules'],
    readyToImplement: false,
    blockers: ['Requires accounting integration or dedicated ledger system', 'Not a CMS concern'],
  },
]

// ============================================================
// PlayaStays — WordPress REST API Client
// All fetch calls go through wpFetch() which handles:
//  - auth (Application Password)
//  - ISR cache tags for revalidateTag()
//  - Draft Mode (preview)
//  - error handling
// ============================================================

import { cache } from 'react'
import type {
  Property,
  City,
  Service,
  FAQ,
  Testimonial,
  BlogPost,
  SiteConfig,
  WpTerm,
} from '@/types'
import { SITE_BUSINESS_ADDRESS, SITE_CONTACT_EMAIL, SITE_WHATSAPP } from '@/lib/site-contact'
import {
  blogPreviewDraftsEnabled,
  getPreviewPostBySlug,
  mergeBlogPreviewDrafts,
} from '@/lib/blog-preview-posts'
import { sortCitiesForNavigation } from '@/lib/major-market-cities'
import { getWordPressApiBaseUrl } from '@/lib/wp-api-base'

const WP_API = getWordPressApiBaseUrl()                    // from WP_API_URL; legacy IP → cms.playastays.com
const WP_AUTH = process.env.WP_APP_PASSWORD                // "username:app_password" (base64 in header)

// WordPress may still return media `source_url` values pointing at an old EC2 IP. `next/image`
// fetches the remote during RSC; if that host is unreachable, the app returns 404 for the whole route.
const LEGACY_WP_MEDIA_HOST = /^https?:\/\/3\.238\.93\.162(?::\d+)?/i
const CANON_CMS_ORIGIN = 'https://cms.playastays.com'

function rewriteLegacyCmsInJson<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value === 'string') {
    if (!LEGACY_WP_MEDIA_HOST.test(value)) return value
    return value.replace(LEGACY_WP_MEDIA_HOST, CANON_CMS_ORIGIN) as T
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      (value as unknown[])[i] = rewriteLegacyCmsInJson((value as unknown[])[i])
    }
    return value
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>
    for (const k of Object.keys(o)) {
      o[k] = rewriteLegacyCmsInJson(o[k])
    }
    return value
  }
  return value
}

// ── Core fetch wrapper ────────────────────────────────────

type GlobalWithDnsLog = typeof globalThis & { __playaWpDnsEnotfoundLogged?: true }

function isDnsHostNotFound(err: unknown): boolean {
  let e: unknown = err
  for (let i = 0; i < 5 && e; i += 1) {
    if (typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'ENOTFOUND') {
      return true
    }
    e = typeof e === 'object' && e !== null && 'cause' in e ? (e as { cause: unknown }).cause : null
  }
  return false
}

interface FetchOptions {
  params?: Record<string, string | number | boolean>
  tags: string[]
  revalidate?: number | false
  preview?: boolean
}

async function wpFetch<T>(path: string, opts: FetchOptions): Promise<T | null> {
  if (!WP_API?.trim()) {
    console.error('playastays: WP_API_URL is not set; WordPress fetches are skipped.')
    return null
  }

  let url: URL
  try {
    url = new URL(`${WP_API}${path}`)
  } catch {
    console.error('playastays: WP_API_URL is not a valid base URL for REST requests.')
    return null
  }

  if (opts.params) {
    Object.entries(opts.params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v))
    })
  }

  // Always embed featured media and author
  url.searchParams.set('_embed', '1')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (WP_AUTH) {
    headers['Authorization'] = `Basic ${Buffer.from(WP_AUTH).toString('base64')}`
  }

  try {
    const res = await fetch(url.toString(), {
      headers,
      next: {
        tags: opts.tags,
        revalidate: opts.preview ? 0 : (opts.revalidate ?? 86400),
      },
    })

    if (!res.ok) {
      if (res.status === 404) return null
      if (res.status === 401 || res.status === 403) {
        console.error(
          `playastays: WordPress ${res.status} ${url.toString()} — if CPTs are not publicly readable, set WP_APP_PASSWORD in .env.local (Application Password) or allow anonymous REST read in WP.`
        )
      } else {
        console.error(`WP API error: ${res.status} ${url.toString()}`)
      }
      return null
    }

    const data = (await res.json()) as T
    return rewriteLegacyCmsInJson(data)
  } catch (err) {
    if (isDnsHostNotFound(err)) {
      // Use globalThis: Next may evaluate this module in more than one bundle/worker; module-level
      // `let` resets so the same help was printing repeatedly. Child workers still get one log each.
      const g = globalThis as GlobalWithDnsLog
      if (!g.__playaWpDnsEnotfoundLogged) {
        g.__playaWpDnsEnotfoundLogged = true
        const host = url.hostname
        console.error(
          `playastays: DNS could not resolve "${host}" (ENOTFOUND). This machine has no working lookup for the WordPress host — not a Next.js bug. ` +
            `Fix: use working internet; change DNS (e.g. System Settings → Wi‑Fi → DNS, or 8.8.8.8 / 1.1.1.1); connect VPN if the CMS is private; or add the host to /etc/hosts. ` +
            `You can set WP_API_URL in .env.local to a reachable base URL, or add "x.x.x.x ${host}" to /etc/hosts. ` +
            `Failing request example: ${url.toString()}`,
        )
      }
      return null
    }
    console.error(`WP fetch failed: ${url.toString()}`, err)
    return null
  }
}

// ── Cities ────────────────────────────────────────────────

/** Max cities per WP REST request; paginate so nav/footer never miss published cities past page 1. */
const CITIES_PER_PAGE = 100

export async function getCities(preview = false): Promise<City[]> {
  try {
    const all: City[] = []
    const seen = new Set<number>()
    let page = 1
    for (;;) {
      const data = await wpFetch<City[]>('/ps_city', {
        tags: ['cities'],
        revalidate: 86400,
        preview,
        params: {
          per_page: CITIES_PER_PAGE,
          page,
          status: preview ? 'any' : 'publish',
        },
      })
      if (!data || !Array.isArray(data) || data.length === 0) break
      for (const c of data) {
        if (!c || typeof c.id !== 'number') continue
        if (!seen.has(c.id)) {
          seen.add(c.id)
          all.push(c)
        }
      }
      if (data.length < CITIES_PER_PAGE) break
      page += 1
      if (page > 30) break // safety cap (3k cities)
    }
    return all
  } catch {
    return []
  }
}

/** Cities for nav, footer, and marketing surfaces — major markets first, then others. */
function cityNavUsable(c: City): boolean {
  return (
    c != null &&
    typeof c.slug === 'string' &&
    c.slug.length > 0 &&
    c.title != null &&
    typeof c.title.rendered === 'string'
  )
}

export async function getCitiesForNavigation(preview = false): Promise<City[]> {
  try {
    const raw = await getCities(preview)
    const list = Array.isArray(raw) ? raw.filter(cityNavUsable) : []
    return sortCitiesForNavigation(list)
  } catch {
    return []
  }
}

export async function getCity(slug: string, preview = false): Promise<City | null> {
  const s = typeof slug === 'string' ? slug.trim() : ''
  if (!s) return null

  const data = await wpFetch<City[]>('/ps_city', {
    tags: ['cities', `city-${s}`],
    revalidate: 86400,
    preview,
    params: { slug: s, status: preview ? 'any' : 'publish' },
  })
  return data?.[0] ?? null
}

export async function getCitySlugs(): Promise<string[]> {
  const cities = await getCities()
  return cities.map(c => c.slug)
}

// ── Services ──────────────────────────────────────────────

export async function getServices(opts: {
  citySlug?: string
  preview?: boolean
} = {}): Promise<Service[]> {
  const params: Record<string, string | number> = {
    per_page: 20,
    status: opts.preview ? 'any' : 'publish',
  }
  if (opts.citySlug) params['ps_city_tag'] = opts.citySlug

  const data = await wpFetch<Service[]>('/ps_service', {
    tags: ['services', ...(opts.citySlug ? [`services-${opts.citySlug}`] : [])],
    revalidate: 86400,
    preview: opts.preview,
    params,
  })
  return data ?? []
}

/** Same logical “sell” service — WP installs may use either ps_service_slug */
function serviceSlugMetaVariants(slug: string): string[] {
  if (slug === 'sell-property' || slug === 'sell-your-property') {
    return ['sell-property', 'sell-your-property']
  }
  return [slug]
}

export async function getService(
  citySlug: string,
  serviceSlug: string,
  preview = false
): Promise<Service | null> {
  // Services are linked to cities via ps_city_tag taxonomy
  // and identified by the ps_service_slug meta field
  for (const metaSlug of serviceSlugMetaVariants(serviceSlug)) {
    const data = await wpFetch<Service[]>('/ps_service', {
      tags: ['services', `service-${citySlug}-${metaSlug}`],
      revalidate: 86400,
      preview,
      params: {
        ps_city_tag: citySlug,
        meta_key: 'ps_service_slug',
        meta_value: metaSlug,
        status: preview ? 'any' : 'publish',
        per_page: 1,
      },
    })
    if (data?.[0]) return data[0]
  }
  return null
}

// ── Properties ────────────────────────────────────────────

export async function getProperties(opts: {
  citySlug?: string
  featured?: boolean
  perPage?: number
  propertyType?: string
  bedrooms?: string
  feature?: string
  preview?: boolean
} = {}): Promise<Property[]> {
  const params: Record<string, string | number | boolean> = {
    per_page: opts.perPage ?? 12,
    status: opts.preview ? 'any' : 'publish',
  }

  if (opts.citySlug)      params['ps_city_tag']      = opts.citySlug
  if (opts.propertyType)  params['ps_property_type'] = opts.propertyType
  if (opts.bedrooms)      params['ps_bedrooms']      = opts.bedrooms
  if (opts.feature)       params['ps_feature']       = opts.feature
  if (opts.featured) {
    params['meta_key']   = 'ps_managed_by_ps'
    params['meta_value'] = '1'
  }

  const tags = [
    'properties',
    ...(opts.citySlug     ? [`properties-${opts.citySlug}`]     : []),
    ...(opts.propertyType ? [`properties-type-${opts.propertyType}`] : []),
    ...(opts.bedrooms     ? [`properties-beds-${opts.bedrooms}`] : []),
    ...(opts.feature      ? [`properties-feat-${opts.feature}`]  : []),
  ]

  const data = await wpFetch<Property[]>('/properties', {
    tags, revalidate: 1800, preview: opts.preview, params,
  })
  return data ?? []
}

function isPropertyCatalogActive(p: Property): boolean {
  const s = p.meta.ps_listing_status
  if (!s) return true
  return s === 'active'
}

/**
 * Homepage portfolio carousel — same intent as {@link getProperties} with `featured: true`
 * (`ps_managed_by_ps`), matching “Properties we manage” copy.
 *
 * Tries the REST meta filter first. If it returns nothing (empty inventory, API error, or
 * older WP/plugin builds that did not apply meta filters on `/properties`), falls back to
 * {@link getPropertiesForBrowse} and filters in-app so valid managed listings still render.
 */
export async function getHomepagePortfolioProperties(preview = false): Promise<Property[]> {
  const direct = await getProperties({ featured: true, perPage: 10, preview })
  if (direct.length > 0) return direct

  const browse = await getPropertiesForBrowse({ perPage: 100, preview })
  const managed = browse.filter(
    p => p.meta.ps_managed_by_ps && isPropertyCatalogActive(p),
  )
  if (managed.length === 0) return []

  return [...managed]
    .sort((a, b) => Number(!!b.meta.ps_featured) - Number(!!a.meta.ps_featured))
    .slice(0, 10)
}

/**
 * Paginated fetch of all published properties for sitemap generation.
 * WordPress REST caps `per_page` (typically 100); this walks pages until empty.
 */
export async function getAllPublishedPropertiesForSitemap(preview = false): Promise<Property[]> {
  const all: Property[] = []
  let page = 1
  const perPage = 100
  for (;;) {
    const data = await wpFetch<Property[]>('/properties', {
      tags: ['properties', 'sitemap'],
      revalidate: 1800,
      preview,
      params: {
        per_page: perPage,
        page,
        status: preview ? 'any' : 'publish',
      },
    })
    if (!data?.length) break
    all.push(...data)
    if (data.length < perPage) break
    page += 1
    if (page > 100) break
  }
  return all
}

/**
 * Broad inventory fetch for browse pages — no bedroom/type/feature pre-filter.
 * Strict filtering runs in `lib/property-browse.ts` against full Property objects.
 */
export async function getPropertiesForBrowse(opts: {
  citySlug?: string
  perPage?: number
  preview?: boolean
} = {}): Promise<Property[]> {
  const params: Record<string, string | number | boolean> = {
    per_page: opts.perPage ?? 100,
    status: opts.preview ? 'any' : 'publish',
  }
  if (opts.citySlug) params['ps_city_tag'] = opts.citySlug

  const tags = ['properties', 'browse', ...(opts.citySlug ? [`properties-${opts.citySlug}`] : ['properties-all'])]

  const data = await wpFetch<Property[]>('/properties', {
    tags,
    revalidate: 1800,
    preview: opts.preview,
    params,
  })
  return data ?? []
}

export async function getProperty(slug: string, preview = false): Promise<Property | null> {
  const { getDevFakeRentalPropertyIfEnabled } = await import('@/lib/dev-fake-rental-property')
  const fake = getDevFakeRentalPropertyIfEnabled(slug)
  if (fake) return fake

  const data = await wpFetch<Property[]>('/properties', {
    tags: ['properties', `property-${slug}`],
    revalidate: 1800,
    preview,
    params: { slug, status: preview ? 'any' : 'publish' },
  })
  return data?.[0] ?? null
}

// ── FAQs ──────────────────────────────────────────────────

export async function getFAQs(opts: {
  serviceSlug?: string
  citySlug?: string
  categorySlug?: string
  ids?: number[]
  preview?: boolean
} = {}): Promise<FAQ[]> {
  const params: Record<string, string | number> = {
    per_page: 20,
    orderby: 'meta_value_num',
    meta_key: 'ps_sort_order',
    order: 'asc',
    status: opts.preview ? 'any' : 'publish',
  }

  if (opts.categorySlug) params['ps_faq_category'] = opts.categorySlug
  if (opts.ids?.length)  params['include'] = opts.ids.join(',')

  const tags = [
    'faqs',
    ...(opts.serviceSlug ? [`faqs-service-${opts.serviceSlug}`] : []),
    ...(opts.citySlug    ? [`faqs-city-${opts.citySlug}`]    : []),
  ]

  let data = await wpFetch<FAQ[]>('/ps_faq', {
    tags, revalidate: 86400, preview: opts.preview, params,
  })

  // Some WP installs do not expose ps_faq_category; retry without taxonomy filter.
  if (data === null && opts.categorySlug) {
    const fallback: Record<string, string | number> = {
      per_page: 20,
      orderby: 'meta_value_num',
      meta_key: 'ps_sort_order',
      order: 'asc',
      status: opts.preview ? 'any' : 'publish',
    }
    if (opts.ids?.length) {
      fallback['include'] = opts.ids.join(',')
    }
    data = await wpFetch<FAQ[]>('/ps_faq', {
      tags,
      revalidate: 86400,
      preview: opts.preview,
      params: fallback,
    })
  }

  return data ?? []
}

// ── Testimonials ──────────────────────────────────────────

export async function getTestimonials(opts: {
  featured?: boolean
  serviceId?: number
  citySlug?: string
  preview?: boolean
} = {}): Promise<Testimonial[]> {
  const baseParams = (): Record<string, string | number | boolean> => ({
    per_page: 6,
    orderby: 'meta_value_num',
    meta_key: 'ps_sort_order',
    order: 'asc',
    status: opts.preview ? 'any' : 'publish',
  })

  const params: Record<string, string | number | boolean> = { ...baseParams() }

  if (opts.featured) {
    params['meta_key']   = 'ps_featured'
    params['meta_value'] = '1'
  }

  let data = await wpFetch<Testimonial[]>('/ps_testimonial', {
    tags: ['testimonials'],
    revalidate: 86400,
    preview: opts.preview,
    params,
  })

  // Featured meta query may 400 if meta is not REST-registered; retry unfiltered list.
  if (data === null && opts.featured) {
    data = await wpFetch<Testimonial[]>('/ps_testimonial', {
      tags: ['testimonials'],
      revalidate: 86400,
      preview: opts.preview,
      params: baseParams(),
    })
  }

  return data ?? []
}

// ── Blog taxonomy terms (cached; requires WP plugin taxonomies) ──

export const getBlogTopicTerms = cache(async (): Promise<WpTerm[]> => {
  const data = await wpFetch<WpTerm[]>('/ps_blog_topic', {
    tags: ['blog-tax', 'ps_blog_topic'],
    revalidate: 3600,
    params: { per_page: 100 },
  })
  return data ?? []
})

export const getBlogAreaTerms = cache(async (): Promise<WpTerm[]> => {
  const data = await wpFetch<WpTerm[]>('/ps_blog_area', {
    tags: ['blog-tax', 'ps_blog_area'],
    revalidate: 3600,
    params: { per_page: 100 },
  })
  return data ?? []
})

// ── Blog Posts ────────────────────────────────────────────
//
// Hub filtering: `ps_blog_topic` / `ps_blog_area` are registered on `post` in
// playastays-content-model.php; collection params are handled by
// `ps_rest_post_collection_params` + `ps_rest_post_query_blog_tax`.
// Search: WordPress core `search` (title + content). All params compose with pagination.

export async function getBlogPosts(
  opts: {
    perPage?: number
    citySlug?: string
    page?: number
    preview?: boolean
    /** `ps_blog_topic` term slug (WordPress REST + playastays-content-model filter). */
    topicSlug?: string | null
    /** `ps_blog_area` term slug */
    areaSlug?: string | null
    /** Full-text search across post title and content (WordPress `search` param). */
    search?: string | null
  } = {},
): Promise<BlogPost[]> {
  const params: Record<string, string | number> = {
    per_page: opts.perPage ?? 9,
    page: opts.page ?? 1,
    status: opts.preview ? 'any' : 'publish',
  }
  if (opts.citySlug) params['ps_city_tag'] = opts.citySlug
  const t = opts.topicSlug?.trim()
  const a = opts.areaSlug?.trim()
  const q = opts.search?.trim()
  if (t) params.ps_blog_topic = t
  if (a) params.ps_blog_area = a
  if (q) params.search = q

  const data = await wpFetch<BlogPost[]>('/posts', {
    tags: ['blog', ...(opts.citySlug ? [`blog-${opts.citySlug}`] : [])],
    revalidate: 3600,
    preview: opts.preview,
    params,
  })
  let posts = data ?? []
  if (blogPreviewDraftsEnabled()) {
    const [topicTerms, areaTerms] = await Promise.all([
      getBlogTopicTerms(),
      getBlogAreaTerms(),
    ])
    posts = mergeBlogPreviewDrafts(posts, topicTerms, areaTerms)
  }
  return posts
}

/** All published posts for sitemap — paginates past REST `per_page` limits. */
export async function getAllPublishedBlogPostsForSitemap(preview = false): Promise<BlogPost[]> {
  const all: BlogPost[] = []
  let page = 1
  const perPage = 100
  for (;;) {
    const data = await wpFetch<BlogPost[]>('/posts', {
      tags: ['blog', 'sitemap'],
      revalidate: 3600,
      preview,
      params: { per_page: perPage, page, status: preview ? 'any' : 'publish' },
    })
    if (!data?.length) break
    all.push(...data)
    if (data.length < perPage) break
    page += 1
    if (page > 50) break
  }
  return all
}

export async function getBlogPost(slug: string, preview = false): Promise<BlogPost | null> {
  const data = await wpFetch<BlogPost[]>('/posts', {
    tags: ['blog', `post-${slug}`],
    revalidate: 3600,
    preview,
    params: { slug, status: preview ? 'any' : 'publish' },
  })
  if (data?.[0]) return data[0]
  if (blogPreviewDraftsEnabled()) {
    const [topicTerms, areaTerms] = await Promise.all([
      getBlogTopicTerms(),
      getBlogAreaTerms(),
    ])
    return getPreviewPostBySlug(slug, topicTerms, areaTerms)
  }
  return null
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts({ perPage: 100 })
  return posts.map(p => p.slug)
}

// ── Site config ───────────────────────────────────────────

const SITE_CONFIG_FALLBACK: SiteConfig = {
  phone: '+52 984 123 4567',
  whatsapp: SITE_WHATSAPP,
  email: SITE_CONTACT_EMAIL,
  address: SITE_BUSINESS_ADDRESS,
  trust_stats: [
    { val: '4.9★', key: 'Owner satisfaction' },
    { val: '20%+', key: 'Revenue uplift' },
    { val: '24/7', key: 'Local support' },
    { val: 'ES/EN', key: 'Bilingual team' },
  ],
  social: {},
}

/** WP `/settings` may omit or null `trust_stats` after schema changes — never pass non-arrays to `.map()`. */
function normalizeSiteConfig(partial: Partial<SiteConfig> | null | undefined): SiteConfig {
  const base = { ...SITE_CONFIG_FALLBACK, ...partial, email: SITE_CONTACT_EMAIL }
  const trust =
    Array.isArray(base.trust_stats) && base.trust_stats.length > 0
      ? base.trust_stats
      : SITE_CONFIG_FALLBACK.trust_stats
  const social =
    base.social && typeof base.social === 'object' && !Array.isArray(base.social)
      ? base.social
      : {}
  return {
    ...base,
    trust_stats: trust,
    social,
    email: SITE_CONTACT_EMAIL,
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const data = await wpFetch<SiteConfig>('/settings', {
      tags: ['site-config'],
      revalidate: false,  // manual revalidation only
    })
    return normalizeSiteConfig(data ?? undefined)
  } catch {
    return normalizeSiteConfig(undefined)
  }
}

// ── Leads ─────────────────────────────────────────────────
// Public lead capture goes through POST `/api/lead` (HubSpot primary, WordPress backup).
// Do not add a second path to `playastays/v1/submit-lead` here — it bypasses HubSpot.

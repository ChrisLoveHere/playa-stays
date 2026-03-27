// ============================================================
// PlayaStays — WordPress REST API Client
// All fetch calls go through wpFetch() which handles:
//  - auth (Application Password)
//  - ISR cache tags for revalidateTag()
//  - Draft Mode (preview)
//  - error handling
// ============================================================

import type {
  Property, City, Service, FAQ, Testimonial, BlogPost, SiteConfig
} from '@/types'

const WP_API = process.env.WP_API_URL!                     // https://cms.playastays.com/wp-json/wp/v2
const WP_AUTH = process.env.WP_APP_PASSWORD                // "username:app_password" (base64 in header)

// ── Core fetch wrapper ────────────────────────────────────

interface FetchOptions {
  params?: Record<string, string | number | boolean>
  tags: string[]
  revalidate?: number | false
  preview?: boolean
}

async function wpFetch<T>(path: string, opts: FetchOptions): Promise<T | null> {
  const url = new URL(`${WP_API}${path}`)

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
      console.error(`WP API error: ${res.status} ${url.toString()}`)
      return null
    }

    return res.json() as Promise<T>
  } catch (err) {
    console.error(`WP fetch failed: ${url.toString()}`, err)
    return null
  }
}

// ── Cities ────────────────────────────────────────────────

export async function getCities(preview = false): Promise<City[]> {
  const data = await wpFetch<City[]>('/ps_city', {
    tags: ['cities'],
    revalidate: 86400,
    preview,
    params: { per_page: 20, status: preview ? 'any' : 'publish' },
  })
  return data ?? []
}

export async function getCity(slug: string, preview = false): Promise<City | null> {
  const data = await wpFetch<City[]>('/ps_city', {
    tags: ['cities', `city-${slug}`],
    revalidate: 86400,
    preview,
    params: { slug, status: preview ? 'any' : 'publish' },
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

export async function getService(
  citySlug: string,
  serviceSlug: string,
  preview = false
): Promise<Service | null> {
  // Services are linked to cities via ps_city_tag taxonomy
  // and identified by the ps_service_slug meta field
  const data = await wpFetch<Service[]>('/ps_service', {
    tags: ['services', `service-${citySlug}-${serviceSlug}`],
    revalidate: 86400,
    preview,
    params: {
      ps_city_tag: citySlug,
      meta_key: 'ps_service_slug',
      meta_value: serviceSlug,
      status: preview ? 'any' : 'publish',
      per_page: 1,
    },
  })
  return data?.[0] ?? null
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

export async function getProperty(slug: string, preview = false): Promise<Property | null> {
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

  const data = await wpFetch<FAQ[]>('/ps_faq', {
    tags, revalidate: 86400, preview: opts.preview, params,
  })
  return data ?? []
}

// ── Testimonials ──────────────────────────────────────────

export async function getTestimonials(opts: {
  featured?: boolean
  serviceId?: number
  citySlug?: string
  preview?: boolean
} = {}): Promise<Testimonial[]> {
  const params: Record<string, string | number | boolean> = {
    per_page: 6,
    orderby: 'meta_value_num',
    meta_key: 'ps_sort_order',
    order: 'asc',
    status: opts.preview ? 'any' : 'publish',
  }

  if (opts.featured) {
    params['meta_key']   = 'ps_featured'
    params['meta_value'] = '1'
  }

  const data = await wpFetch<Testimonial[]>('/ps_testimonial', {
    tags: ['testimonials'],
    revalidate: 86400,
    preview: opts.preview,
    params,
  })
  return data ?? []
}

// ── Blog Posts ────────────────────────────────────────────

export async function getBlogPosts(opts: {
  perPage?: number
  citySlug?: string
  page?: number
  preview?: boolean
} = {}): Promise<BlogPost[]> {
  const params: Record<string, string | number> = {
    per_page: opts.perPage ?? 9,
    page: opts.page ?? 1,
    status: opts.preview ? 'any' : 'publish',
  }
  if (opts.citySlug) params['ps_city_tag'] = opts.citySlug

  const data = await wpFetch<BlogPost[]>('/posts', {
    tags: ['blog', ...(opts.citySlug ? [`blog-${opts.citySlug}`] : [])],
    revalidate: 3600,
    preview: opts.preview,
    params,
  })
  return data ?? []
}

export async function getBlogPost(slug: string, preview = false): Promise<BlogPost | null> {
  const data = await wpFetch<BlogPost[]>('/posts', {
    tags: ['blog', `post-${slug}`],
    revalidate: 3600,
    preview,
    params: { slug, status: preview ? 'any' : 'publish' },
  })
  return data?.[0] ?? null
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts({ perPage: 100 })
  return posts.map(p => p.slug)
}

// ── Site config ───────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig> {
  const fallback: SiteConfig = {
    phone: '+52 984 123 4567',
    whatsapp: '529841234567',
    email: 'hello@playastays.com',
    address: 'Playa del Carmen, Quintana Roo, Mexico',
    trust_stats: [
      { val: '200+', key: 'Properties managed' },
      { val: '4.9★', key: 'Owner satisfaction' },
      { val: '20%+', key: 'Revenue uplift' },
      { val: '24/7', key: 'Local support' },
      { val: 'ES/EN', key: 'Bilingual team' },
    ],
    social: {},
  }

  try {
    const data = await wpFetch<SiteConfig>('/settings', {
      tags: ['site-config'],
      revalidate: false,  // manual revalidation only
    })
    return data ?? fallback
  } catch {
    return fallback
  }
}

// ── Submit lead form ──────────────────────────────────────

export async function submitLead(data: import('@/types').LeadFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/playastays/v1/submit-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return { success: true }
  } catch (err) {
    console.error('Lead submission failed:', err)
    return { success: false, error: 'Submission failed. Please try WhatsApp or email.' }
  }
}

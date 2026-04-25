// ============================================================
// PlayaStays — SEO Helpers (metadata + re-exports for JSON-LD)
// Next.js owns public titles, canonicals, OG, hreflang, robots.
// ============================================================

import type { Metadata } from 'next'
import type { City, Service, Property, BlogPost, FAQ } from '@/types'
import { SERVICE_SLUG_EN_TO_ES } from '@/lib/i18n'
import { publicEnSlugFromPs } from '@/lib/service-url-slugs'
import { SERVICE_HUB_EN_TO_ES, type ServiceHubId } from '@/lib/service-hub-constants'
import { getServiceHubCopy } from '@/content/service-hubs'
import { propertyAbsoluteUrl } from '@/lib/property-url'
import { SITE_URL } from '@/lib/site-url'
import { defaultServicePageDescription } from '@/lib/service-page-fallbacks'

export {
  SITE_URL,
  ORG_SCHEMA,
  homePageJsonLd,
  serviceHubPageSchema,
  contactPageJsonLd,
  aboutPageJsonLd,
  serviceSchema,
  cityHubSchema,
  propertySchema,
  blogPostSchema,
} from '@/lib/schema'

const SITE_NAME = 'PlayaStays'
/** Exists in repo at public/brand/playastays-logo.png (og-default.jpg not shipped). */
const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/playastays-logo.png`

const DEFAULT_TITLE = 'PlayaStays — Vacation Rental & Property Management in the Riviera Maya'
const DEFAULT_DESCRIPTION =
  'Premium vacation rental and property management in Playa del Carmen and the Riviera Maya. Local team, transparent reporting, owner-first execution.'

/**
 * Absolute URL for canonicals and OG. Strips `?` / `#` junk; for same-host URLs as
 * {@link SITE_URL}, normalizes to that origin (https + www) so protocol/host stay consistent.
 */
export function absoluteUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed)
      u.search = ''
      u.hash = ''
      const site = new URL(SITE_URL)
      if (u.hostname.toLowerCase() === site.hostname.toLowerCase()) {
        const p = u.pathname || '/'
        return `${SITE_URL}${p}`
      }
      return u.toString()
    } catch {
      return trimmed
    }
  }
  const pathOnly = trimmed.split('?')[0].split('#')[0]
  const path = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
  return `${SITE_URL}${path}`
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// ── Metadata builders ─────────────────────────────────────

export function buildMetadata(opts: {
  title: string
  description: string
  canonical: string
  hreflangEs?: string
  hreflangEn?: string
  noindex?: boolean
  ogImage?: string
}): Metadata {
  const title = opts.title?.trim() || DEFAULT_TITLE
  const description = opts.description?.trim() || DEFAULT_DESCRIPTION

  const canonicalAbs = absoluteUrl(opts.canonical)

  const ogUrl = canonicalAbs
  const imageUrl = opts.ogImage?.startsWith('http')
    ? opts.ogImage
    : opts.ogImage
      ? absoluteUrl(opts.ogImage)
      : DEFAULT_OG_IMAGE

  const languages: Record<string, string> = {}
  if (opts.hreflangEn) {
    languages.en = absoluteUrl(opts.hreflangEn)
    languages['es-MX'] = canonicalAbs
    languages['x-default'] = absoluteUrl(opts.hreflangEn)
  } else if (opts.hreflangEs) {
    languages.en = canonicalAbs
    languages['es-MX'] = absoluteUrl(opts.hreflangEs)
    languages['x-default'] = canonicalAbs
  }

  const isEsPrimary = Boolean(opts.hreflangEn)
  const ogLocale = isEsPrimary ? 'es_MX' : 'en_US'
  const ogAlternateLocale = opts.hreflangEn || opts.hreflangEs ? (isEsPrimary ? 'en_US' : 'es_MX') : undefined

  return {
    title,
    description,
    robots: opts.noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalAbs,
      ...(Object.keys(languages).length > 0 && { languages }),
    },
    openGraph: {
      title,
      description,
      url: ogUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: ogLocale,
      ...(ogAlternateLocale ? { alternateLocale: [ogAlternateLocale] } : {}),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export function serviceHubMetadata(hubId: ServiceHubId, locale: 'en' | 'es'): Metadata {
  const c = getServiceHubCopy(hubId, locale)
  const canonical =
    locale === 'es'
      ? `${SITE_URL}/es/${SERVICE_HUB_EN_TO_ES[hubId]}/`
      : `${SITE_URL}/${hubId}/`
  return buildMetadata({
    title: c.seo.title,
    description: c.seo.description,
    canonical,
    ...(locale === 'en'
      ? { hreflangEs: `${SITE_URL}/es/${SERVICE_HUB_EN_TO_ES[hubId]}/` }
      : { hreflangEn: `${SITE_URL}/${hubId}/` }),
  })
}

export function homepageMetadata(): Metadata {
  return buildMetadata({
    title: 'Playa del Carmen Property Management & Vacation Rentals | PlayaStays',
    description:
      'Local Airbnb and vacation rental management in Playa del Carmen and the Riviera Maya. One team, owner-first execution. Free revenue estimate.',
    canonical: `${SITE_URL}/`,
    hreflangEs: `${SITE_URL}/es/`,
  })
}

export function cityMetadata(city: City): Metadata {
  const name = city.title.rendered
  const rawDesc =
    (city.meta.ps_seo_desc && city.meta.ps_seo_desc.trim()) ||
    stripHtml(city.excerpt?.rendered ?? '') ||
    stripHtml((city.content?.rendered ?? '').slice(0, 400))
  const description =
    rawDesc.slice(0, 320) ||
    `${stripHtml(name)} market overview: neighborhoods, where we operate, and clear next steps to local property and Airbnb management. PlayaStays.`

  return buildMetadata({
    title:
      city.meta.ps_seo_title ||
      `${stripHtml(name)} — Vacation rental market & services | PlayaStays`,
    description,
    canonical: `${SITE_URL}/${city.slug}/`,
    hreflangEs: `${SITE_URL}/es/${city.slug}/`,
  })
}

export function serviceMetadata(service: Service, city: City): Metadata {
  const psSlug = service.meta.ps_service_slug
  const enSeg = publicEnSlugFromPs(psSlug)
  const esSeg = SERVICE_SLUG_EN_TO_ES[enSeg] ?? enSeg

  const svcTitle = stripHtml(service.title.rendered)
  const cityTitle = stripHtml(city.title.rendered)

  const rawDesc =
    (service.meta.ps_seo_desc && service.meta.ps_seo_desc.trim()) ||
    stripHtml(service.excerpt?.rendered ?? '') ||
    stripHtml((service.content?.rendered ?? '').slice(0, 400))
  const description =
    rawDesc.slice(0, 320) ||
    defaultServicePageDescription(svcTitle, cityTitle, psSlug)

  return buildMetadata({
    title: service.meta.ps_seo_title || `${svcTitle} in ${cityTitle} | PlayaStays`,
    description,
    canonical: `${SITE_URL}/${city.slug}/${enSeg}/`,
    hreflangEs: `${SITE_URL}/es/${city.slug}/${esSeg}/`,
  })
}

export function propertyMetadata(property: Property): Metadata {
  const image = property.ps_computed?.featured_image?.url
  const rawDesc =
    (property.meta.ps_seo_desc && property.meta.ps_seo_desc.trim()) ||
    stripHtml(property.excerpt?.rendered ?? '')
  const description =
    rawDesc.slice(0, 320) ||
    `${property.title.rendered} — vacation rental in Riviera Maya | PlayaStays`

  const canonical = propertyAbsoluteUrl(property, 'en', SITE_URL)
  const esHref = property.meta.ps_title_es
    ? propertyAbsoluteUrl(property, 'es', SITE_URL)
    : undefined

  return buildMetadata({
    title: property.meta.ps_seo_title || property.title.rendered,
    description,
    canonical,
    ogImage: image,
    hreflangEs: esHref,
  })
}

/**
 * ES property detail metadata — same URL rules as {@link propertyMetadata}
 * (`propertyAbsoluteUrl` / `propertyHref`), so canonical, alternates, and OG
 * match sitemap loc and the live route after redirects.
 */
export function propertyMetadataEs(property: Property): Metadata {
  const image = property.ps_computed?.featured_image?.url
  const canonical = propertyAbsoluteUrl(property, 'es', SITE_URL)
  const enHref = propertyAbsoluteUrl(property, 'en', SITE_URL)

  const hasTitleEs = Boolean(property.meta.ps_title_es)
  if (!hasTitleEs) {
    return buildMetadata({
      title: property.title.rendered,
      description: stripHtml(property.excerpt?.rendered ?? ''),
      canonical,
      noindex: true,
      ogImage: image,
    })
  }

  const rawDesc =
    (property.meta.ps_seo_desc && property.meta.ps_seo_desc.trim()) ||
    (property.meta.ps_excerpt_es && property.meta.ps_excerpt_es.trim()) ||
    stripHtml(property.excerpt?.rendered ?? '')
  const description =
    rawDesc.slice(0, 320) ||
    `${property.meta.ps_title_es || property.title.rendered} — renta vacacional en Riviera Maya | PlayaStays`

  return buildMetadata({
    title: property.meta.ps_seo_title || property.meta.ps_title_es || property.title.rendered,
    description,
    canonical,
    ogImage: image,
    hreflangEn: enHref,
  })
}

export function blogPostMetadata(post: BlogPost): Metadata {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const rawDesc =
    (post.meta.ps_seo_desc && post.meta.ps_seo_desc.trim()) ||
    stripHtml(post.excerpt?.rendered ?? '')
  const titlePlain = stripHtml(post.title.rendered)
  const description = rawDesc.slice(0, 320) || `${titlePlain} | PlayaStays`
  const hasEs = Boolean(post.meta.ps_title_es?.trim())

  return buildMetadata({
    title: (post.meta.ps_seo_title && post.meta.ps_seo_title.trim()) || `${titlePlain} | PlayaStays`,
    description,
    canonical: `${SITE_URL}/blog/${post.slug}/`,
    ogImage: image,
    ...(hasEs ? { hreflangEs: `${SITE_URL}/es/blog/${post.slug}/` } : {}),
  })
}

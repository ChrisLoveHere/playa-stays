// ============================================================
// PlayaStays — SEO Helpers
// generateMetadata() wrappers and JSON-LD schema builders.
// All schema is rendered in <head> via Next.js metadata API.
// ============================================================

import type { Metadata } from 'next'
import type { City, Service, Property, BlogPost, FAQ } from '@/types'

const SITE_URL = 'https://www.playastays.com'
const SITE_NAME = 'PlayaStays'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

// ── Metadata builders ─────────────────────────────────────

export function buildMetadata(opts: {
  title: string
  description: string
  canonical: string
  hreflangEs?: string   // ES alternate URL (es-MX)
  hreflangEn?: string   // EN alternate URL (used when canonical IS the ES page)
  noindex?: boolean
  ogImage?: string
}): Metadata {
  // Build the hreflang languages block.
  // Case A: EN canonical → link to ES alternate.
  // Case B: ES canonical (hreflangEn provided) → link to EN alternate + self ES.
  const languages: Record<string, string> = {}
  if (opts.hreflangEn) {
    // This IS an ES page — hreflangEn is the EN equivalent
    languages['en']       = opts.hreflangEn
    languages['es-MX']    = opts.canonical
    languages['x-default'] = opts.hreflangEn   // x-default always points to EN
  } else if (opts.hreflangEs) {
    // This IS an EN page — hreflangEs is the ES equivalent
    languages['en']        = opts.canonical
    languages['es-MX']     = opts.hreflangEs
    languages['x-default'] = opts.canonical
  }

  return {
    title: opts.title,
    description: opts.description,
    robots: opts.noindex ? 'noindex, follow' : 'index, follow',
    alternates: {
      canonical: opts.canonical,
      ...(Object.keys(languages).length > 0 && { languages }),
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.canonical,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: opts.ogImage ?? DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
  }
}

export function homepageMetadata(): Metadata {
  return buildMetadata({
    title: 'Playa del Carmen Property Management & Vacation Rentals | PlayaStays',
    description: "PlayaStays is Playa del Carmen's leading property management company. 200+ managed properties. Maximize your Airbnb income — fully hands-off. Get a free revenue estimate.",
    canonical: SITE_URL + '/',
    hreflangEs: SITE_URL + '/es/',
  })
}

export function cityMetadata(city: City): Metadata {
  return buildMetadata({
    title: city.meta.ps_seo_title || `${city.title.rendered} Property Management & Vacation Rentals | PlayaStays`,
    description: city.meta.ps_seo_desc || city.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical: `${SITE_URL}/${city.slug}/`,
    hreflangEs: `${SITE_URL}/es/${city.slug}/`,
  })
}

export function serviceMetadata(service: Service, city: City): Metadata {
  const slug = service.meta.ps_service_slug
  const esSlugMap: Record<string, string> = {
    'property-management': 'administracion-de-propiedades',
    'airbnb-management':   'administracion-airbnb',
    'vacation-rentals':    'rentas-vacacionales',
    'condos-for-rent':     'condominios-en-renta',
    'beachfront-rentals':  'rentas-frente-al-mar',
    'investment-property': 'propiedades-de-inversion',
    'sell-property':       'vender-propiedad',
  }

  return buildMetadata({
    title: service.meta.ps_seo_title || service.title.rendered,
    description: service.meta.ps_seo_desc || service.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical: `${SITE_URL}/${city.slug}/${slug}/`,
    hreflangEs: `${SITE_URL}/es/${city.slug}/${esSlugMap[slug] ?? slug}/`,
  })
}

export function propertyMetadata(property: Property): Metadata {
  return buildMetadata({
    title: property.meta.ps_seo_title || `${property.title.rendered} | PlayaStays`,
    description: property.meta.ps_seo_desc || property.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical: `${SITE_URL}/rentals/${property.slug}/`,
  })
}

export function blogPostMetadata(post: BlogPost): Metadata {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  return buildMetadata({
    title: post.meta.ps_seo_title || post.title.rendered,
    description: post.meta.ps_seo_desc || post.excerpt.rendered.replace(/<[^>]*>/g, ''),
    canonical: `${SITE_URL}/blog/${post.slug}/`,
    ogImage: image,
  })
}

// ── Schema.org JSON-LD builders ───────────────────────────

export const ORG_SCHEMA = {
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#org`,
  name: 'PlayaStays',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  telephone: '+52-984-123-4567',
  email: 'hello@playastays.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Playa del Carmen',
    addressRegion: 'Quintana Roo',
    addressCountry: 'MX',
  },
  priceRange: '15%–25% of gross revenue',
  sameAs: [
    'https://www.facebook.com/playastays',
    'https://www.instagram.com/playastays',
  ],
}

export function serviceSchema(service: Service, city: City, faqs: FAQ[]) {
  const slug = service.meta.ps_service_slug
  const canonical = `${SITE_URL}/${city.slug}/${slug}/`

  const graph: object[] = [
    {
      '@type': 'Service',
      name: service.title.rendered,
      url: canonical,
      serviceType: service.title.rendered,
      provider: { '@id': `${SITE_URL}/#org` },
      areaServed: {
        '@type': 'City',
        name: city.title.rendered,
        containedInPlace: {
          '@type': 'State',
          name: city.meta.ps_state,
          containedInPlace: { '@type': 'Country', name: 'Mexico' },
        },
      },
    },
    breadcrumbSchema([
      { name: 'Home', url: SITE_URL + '/' },
      { name: city.title.rendered, url: `${SITE_URL}/${city.slug}/` },
      { name: service.title.rendered, url: canonical },
    ]),
  ]

  if (faqs.length) graph.push(faqSchema(faqs))

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function cityHubSchema(city: City) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Property Management in ${city.title.rendered}`,
        provider: { '@id': `${SITE_URL}/#org` },
        areaServed: { '@type': 'City', name: city.title.rendered },
      },
      breadcrumbSchema([
        { name: 'Home', url: SITE_URL + '/' },
        { name: city.title.rendered, url: `${SITE_URL}/${city.slug}/` },
      ]),
    ],
  }
}

export function propertySchema(property: Property) {
  const img = property.ps_computed.featured_image
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.title.rendered,
    url: `${SITE_URL}/rentals/${property.slug}/`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.meta.ps_city,
      addressRegion: 'Quintana Roo',
      addressCountry: 'MX',
    },
    ...(img && { image: img.url }),
    ...(property.meta.ps_avg_rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: property.meta.ps_avg_rating,
        reviewCount: property.meta.ps_review_count,
      },
    }),
  }
}

export function blogPostSchema(post: BlogPost) {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const author = post._embedded?.author?.[0]?.name ?? 'PlayaStays'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title.rendered,
        url: `${SITE_URL}/blog/${post.slug}/`,
        datePublished: post.date,
        dateModified: post.modified,
        author: { '@type': 'Person', name: author },
        publisher: { '@id': `${SITE_URL}/#org` },
        ...(image && { image }),
      },
      breadcrumbSchema([
        { name: 'Home', url: SITE_URL + '/' },
        { name: 'Blog', url: `${SITE_URL}/blog/` },
        { name: post.title.rendered, url: `${SITE_URL}/blog/${post.slug}/` },
      ]),
    ],
  }
}

function breadcrumbSchema(crumbs: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}

function faqSchema(faqs: FAQ[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.title.rendered,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.meta.ps_answer,
      },
    })),
  }
}

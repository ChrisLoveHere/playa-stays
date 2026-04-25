// ============================================================
// PlayaStays — JSON-LD schema.org helpers (public SEO surface)
// Used by templates and pages; keep claims factual — no invented reviews.
// ============================================================

import type { City, Service, Property, BlogPost, FAQ } from '@/types'
import { SITE_CONTACT_EMAIL } from '@/lib/site-contact'
import { publicEnSlugFromPs } from '@/lib/service-url-slugs'
import { getServiceHubCopy } from '@/content/service-hubs'
import { SERVICE_HUB_EN_TO_ES, type ServiceHubId } from '@/lib/service-hub-constants'
import { propertyAbsoluteUrl } from '@/lib/property-url'
import { SITE_URL } from '@/lib/site-url'

export { SITE_URL }

/** Organization / LocalBusiness — aligned with public contact info (Next.js is SEO source of truth). */
export const ORG_SCHEMA = {
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#org`,
  name: 'PlayaStays',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  telephone: '+52-984-242-0434',
  email: SITE_CONTACT_EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle 34 Nte 103, Zazil-ha',
    addressLocality: 'Playa del Carmen',
    addressRegion: 'Quintana Roo',
    postalCode: '77720',
    addressCountry: 'MX',
  },
  priceRange: '15%–25% of gross revenue',
  sameAs: [
    'https://www.facebook.com/Chrislove89/',
    'https://www.facebook.com/playastays',
    'https://www.linkedin.com/in/chrislove89/',
    'https://medium.com/@PlayaStays',
    'https://www.pinterest.com/PlayaStays/',
    'https://www.instagram.com/playastays',
    'https://share.google/wAAxgYf03x1mJBKiA',
  ],
}

export function homePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'PlayaStays',
        url: `${SITE_URL}/`,
        description:
          'Premium vacation rental and property management in Playa del Carmen and the Riviera Maya.',
        publisher: { '@id': `${SITE_URL}/#org` },
      },
      ORG_SCHEMA,
    ],
  }
}

/** Global service hub pages (/property-management, /es/...). */
export function serviceHubPageSchema(hubId: ServiceHubId, locale: 'en' | 'es') {
  const c = getServiceHubCopy(hubId, locale)
  const path =
    locale === 'es' ? `/es/${SERVICE_HUB_EN_TO_ES[hubId]}/` : `/${hubId}/`
  const url = `${SITE_URL}${path}`
  const crumbLabel =
    locale === 'es'
      ? c.seo.title.split('|')[0]?.trim() ?? 'Servicios'
      : c.seo.title.split('|')[0]?.trim() ?? 'Services'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: c.seo.title.replace(/\s*\|.*$/, '').trim(),
        description: c.seo.description,
        url,
        serviceType: 'Vacation rental property management',
        provider: { '@id': `${SITE_URL}/#org` },
      },
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: crumbLabel, url },
      ]),
    ],
  }
}

export function contactPageJsonLd(locale: 'en' | 'es') {
  const canonical =
    locale === 'es' ? `${SITE_URL}/es/contacto/` : `${SITE_URL}/contact/`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: 'Contact PlayaStays',
        url: canonical,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#org` },
      },
      ORG_SCHEMA,
    ],
  }
}

export function aboutPageJsonLd(path: '/about/' | '/es/acerca-de-playastays/') {
  const canonical = path.startsWith('/es')
    ? `${SITE_URL}/es/acerca-de-playastays/`
    : `${SITE_URL}/about/`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About PlayaStays',
        url: canonical,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#org` },
      },
      ORG_SCHEMA,
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#founder`,
        name: 'Chris Love',
        jobTitle: 'Founder',
        worksFor: { '@id': `${SITE_URL}/#org` },
        sameAs: ['https://www.linkedin.com/in/chrislove89/'],
      },
    ],
  }
}

export function serviceSchema(service: Service, city: City, faqs: FAQ[]) {
  const enSeg = publicEnSlugFromPs(service.meta.ps_service_slug)
  const canonical = `${SITE_URL}/${city.slug}/${enSeg}/`

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
          name: city.meta.ps_state ?? 'Quintana Roo',
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

export function propertySchema(property: Property, locale: 'en' | 'es' = 'en') {
  const img = property.ps_computed.featured_image
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.title.rendered,
    url: propertyAbsoluteUrl(property, locale, SITE_URL),
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

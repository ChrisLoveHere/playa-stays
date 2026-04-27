export function PersonOrganizationSchema() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.playastays.com/#organization',
    name: 'PlayaStays',
    alternateName: 'PlayaStays Vacation Rental Management',
    description:
      'Full-service vacation rental management across Quintana Roo, Mexico. Local team, multi-channel listings, owner-first transparency.',
    url: 'https://www.playastays.com',
    logo: 'https://www.playastays.com/brand/playastays-logo.png',
    image: 'https://www.playastays.com/hero.jpg',
    telephone: '+52-984-123-4567',
    email: 'Chris@PlayaStays.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 34 Nte 103, Zazil-ha',
      addressLocality: 'Playa del Carmen',
      addressRegion: 'Quintana Roo',
      postalCode: '77720',
      addressCountry: 'MX',
    },
    areaServed: [
      { '@type': 'City', name: 'Playa del Carmen' },
      { '@type': 'City', name: 'Tulum' },
      { '@type': 'City', name: 'Cozumel' },
      { '@type': 'City', name: 'Akumal' },
      { '@type': 'City', name: 'Puerto Morelos' },
      { '@type': 'City', name: 'Xpu-Ha' },
      { '@type': 'City', name: 'Isla Mujeres' },
      { '@type': 'City', name: 'Chetumal' },
    ],
    location: [
      {
        '@type': 'Place',
        name: 'PlayaStays Playa del Carmen Office',
        hasMap: 'https://maps.app.goo.gl/6nD8M9GXRaCmW1hJ9',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Calle 34 Nte 103, Zazil-ha',
          addressLocality: 'Playa del Carmen',
          addressRegion: 'Quintana Roo',
          postalCode: '77720',
          addressCountry: 'MX',
        },
      },
      {
        '@type': 'Place',
        name: 'PlayaStays Tulum',
        hasMap: 'https://maps.app.goo.gl/htkv7FwUC3KSmgP78',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tulum',
          addressRegion: 'Quintana Roo',
          addressCountry: 'MX',
        },
      },
      {
        '@type': 'Place',
        name: 'PlayaStays Cozumel',
        hasMap: 'https://maps.app.goo.gl/Q2DizooukNYmpJPm8',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cozumel',
          addressRegion: 'Quintana Roo',
          addressCountry: 'MX',
        },
      },
    ],
    sameAs: [
      'https://www.facebook.com/share/18PYA944yp/',
      'https://www.instagram.com/playastays',
      'https://www.linkedin.com/company/playastays/',
      'https://yelp.to/dortY22Uuc',
    ],
    founder: {
      '@id': 'https://www.playastays.com/#founder',
    },
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.playastays.com/#founder',
    name: 'Chris Love',
    jobTitle: 'Founder',
    image: 'https://www.playastays.com/team/chris-love.jpg',
    worksFor: {
      '@id': 'https://www.playastays.com/#organization',
    },
    sameAs: ['https://www.linkedin.com/in/chrislove89'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  )
}

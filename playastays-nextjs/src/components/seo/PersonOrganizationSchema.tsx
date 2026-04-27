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
      'https://www.reddit.com/user/PlayaStays/',
    ],
    employee: [
      { '@id': 'https://www.playastays.com/#founder' },
      { '@id': 'https://www.playastays.com/#person-tony-sparks' },
      { '@id': 'https://www.playastays.com/#person-carmen-castro' },
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
    sameAs: ['https://www.linkedin.com/in/chrislove89', 'https://www.facebook.com/Chrislove89'],
  }

  const tonySchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.playastays.com/#person-tony-sparks',
    name: 'Tony Sparks',
    jobTitle: 'Head of Operations',
    image: 'https://www.playastays.com/team/tony-sparks.jpg',
    worksFor: {
      '@id': 'https://www.playastays.com/#organization',
    },
    sameAs: [
      'https://www.linkedin.com/in/tony-sparks-industries/',
      'https://www.facebook.com/anthony.sparks1',
    ],
  }

  const carmenSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.playastays.com/#person-carmen-castro',
    name: 'Carmen Castro',
    jobTitle: 'Housekeeping Manager',
    image: 'https://www.playastays.com/team/carmen-castro.jpg',
    worksFor: {
      '@id': 'https://www.playastays.com/#organization',
    },
    sameAs: ['https://www.facebook.com/carmen.castro.735927'],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tonySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carmenSchema) }}
      />
    </>
  )
}

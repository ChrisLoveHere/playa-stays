// Minimal stroke icons for homepage service tiles (currentColor → CSS)
export function HomeServiceGlyph({ slug }: { slug: string }) {
  const c = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.55,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (slug) {
    case 'property-management':
      return (
        <svg {...c}>
          <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-4a2 2 0 014 0v4" />
        </svg>
      )
    case 'airbnb-management':
      return (
        <svg {...c}>
          <path d="M4 11h16M4 11a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8zM8 7V5a4 4 0 118 0v2" />
        </svg>
      )
    case 'investment-property':
      return (
        <svg {...c}>
          <path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6M9 9h.01M15 9h.01" />
        </svg>
      )
    case 'vacation-rentals':
    case 'vacation-rental-management':
      return (
        <svg {...c}>
          <path d="M3 10h18M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3M5 21v-6a2 2 0 012-2h10a2 2 0 012 2v6M9 14h.01M15 14h.01" />
        </svg>
      )
    case 'condos-for-rent':
      return (
        <svg {...c}>
          <path d="M6 22V10l6-4 6 4v12M6 22h12M10 22v-5h4v5M9 14h.01M15 14h.01" />
        </svg>
      )
    case 'beachfront-rentals':
      return (
        <svg {...c}>
          <path d="M2 12h20M4 12c2-4 6-6 8-6s6 2 8 6M6 22l2-6h8l2 6" />
        </svg>
      )
    case 'sell-property':
      return (
        <svg {...c}>
          <path d="M12 3v18M8 7l4-4 4 4M16 17l-4 4-4-4" />
        </svg>
      )
    case 'listing-optimization':
      return (
        <svg {...c}>
          <path d="M4 18V6M4 18h16" />
          <path d="M7 14l3-3 3 2 5-6" />
        </svg>
      )
    default:
      return (
        <svg {...c}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      )
  }
}

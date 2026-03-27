import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow images from the WP media library domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.playastays.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  // EMD redirect map — 301s from exact-match domains
  // These are also handled at the DNS/CDN layer but kept here as a fallback.
  async redirects() {
    return [
      // Legacy flat URL → new city-scoped URL
      { source: '/property-management-playa-del-carmen', destination: '/playa-del-carmen/property-management/', permanent: true },
      { source: '/airbnb-management-playa-del-carmen',   destination: '/playa-del-carmen/airbnb-management/',   permanent: true },
      { source: '/vacation-rental-management-playa-del-carmen', destination: '/playa-del-carmen/vacation-rentals/', permanent: true },
      { source: '/airbnb-setup-playa-del-carmen',        destination: '/playa-del-carmen/airbnb-management/',   permanent: true },
      { source: '/long-term-rental-management-playa-del-carmen', destination: '/playa-del-carmen/property-management/', permanent: true },
      { source: '/sell-your-property-playa-del-carmen',  destination: '/playa-del-carmen/sell-property/',       permanent: true },
    ]
  },
}

export default nextConfig

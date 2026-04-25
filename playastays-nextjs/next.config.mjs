/** @type {import('next').NextConfig} */

const nextConfig = {
  // Allow images from the WP media library domain
  images: {
    // Avoid `next/image` server fetch in dev (slow/unreachable hosts break RSC with 404-style failures).
    unoptimized: process.env.NODE_ENV === 'development',
    // Legacy `domains` helps some setups resolve IP hosts; `remotePatterns` is primary.
    domains: ['3.238.93.162'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.playastays.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '3.238.93.162',
        port: '',
        pathname: '/**',
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

  // Segmented sitemaps: friendly *.xml URLs → App Router handlers under /sitemaps/[segment]
  async rewrites() {
    return [
      { source: '/sitemap-core.xml', destination: '/sitemaps/core' },
      { source: '/sitemap-legal.xml', destination: '/sitemaps/legal' },
      { source: '/sitemap-rentals.xml', destination: '/sitemaps/rentals' },
      { source: '/sitemap-blog.xml', destination: '/sitemaps/blog' },
    ]
  },

  // EMD redirect map — 301s from exact-match domains
  // These are also handled at the DNS/CDN layer but kept here as a fallback.
  async redirects() {
    return [
      { source: '/sitemap-index.xml', destination: '/sitemap.xml', permanent: true },
      // ── Legacy flat EMD URLs ─────────────────────────────
      { source: '/property-management-playa-del-carmen', destination: '/playa-del-carmen/property-management/', permanent: true },
      { source: '/airbnb-management-playa-del-carmen', destination: '/playa-del-carmen/airbnb-management/', permanent: true },
      { source: '/vacation-rental-management-playa-del-carmen', destination: '/playa-del-carmen/vacation-rental-management/', permanent: true },
      { source: '/airbnb-setup-playa-del-carmen', destination: '/playa-del-carmen/airbnb-management/', permanent: true },
      { source: '/long-term-rental-management-playa-del-carmen', destination: '/playa-del-carmen/property-management/', permanent: true },
      { source: '/sell-your-property-playa-del-carmen', destination: '/playa-del-carmen/sell-property/', permanent: true },
      // ── Retired guest URL segments → /rentals/ with filters ──
      {
        source:
          '/:city((?!api|_next|rentals|blog|contact|list-your-property|property-management-pricing|about|terms|privacy|es|login|portal|admin|favicon.ico)[^/]+)/vacation-rentals',
        destination: '/rentals/?city=:city',
        permanent: true,
      },
      {
        source:
          '/:city((?!api|_next|rentals|blog|contact|list-your-property|property-management-pricing|about|terms|privacy|es|login|portal|admin|favicon.ico)[^/]+)/condos-for-rent',
        destination: '/rentals/?city=:city&type=condo',
        permanent: true,
      },
      {
        source:
          '/:city((?!api|_next|rentals|blog|contact|list-your-property|property-management-pricing|about|terms|privacy|es|login|portal|admin|favicon.ico)[^/]+)/beachfront-rentals',
        destination: '/rentals/?city=:city&feature=beachfront',
        permanent: true,
      },
      {
        source:
          '/es/:ciudad((?!api|_next|rentas|blog|contacto|publica-tu-propiedad|precios-administracion-propiedades|acerca-de-playastays|terminos|privacidad)[^/]+)/rentas-vacacionales',
        destination: '/es/rentas/?city=:ciudad',
        permanent: true,
      },
      {
        source:
          '/es/:ciudad((?!api|_next|rentas|blog|contacto|publica-tu-propiedad|precios-administracion-propiedades|acerca-de-playastays|terminos|privacidad)[^/]+)/condominios-en-renta',
        destination: '/es/rentas/?city=:ciudad&type=condo',
        permanent: true,
      },
      {
        source:
          '/es/:ciudad((?!api|_next|rentas|blog|contacto|publica-tu-propiedad|precios-administracion-propiedades|acerca-de-playastays|terminos|privacidad)[^/]+)/rentas-frente-al-mar',
        destination: '/es/rentas/?city=:ciudad&feature=beachfront',
        permanent: true,
      },
      // ── Retired city-scoped pricing pages → universal pricing page ──
      {
        source:
          '/:city((?!api|_next|rentals|blog|contact|list-your-property|property-management-pricing|about|terms|privacy|es|login|portal|admin|favicon.ico)[^/]+)/property-management-cost',
        destination: '/property-management-pricing/',
        permanent: true,
      },
      {
        source:
          '/es/:ciudad((?!api|_next|rentas|blog|contacto|publica-tu-propiedad|precios-administracion-propiedades|acerca-de-playastays|terminos|privacidad)[^/]+)/costo-administracion-propiedades',
        destination: '/es/precios-administracion-propiedades/',
        permanent: true,
      },
      {
        source:
          '/:city((?!api|_next|rentals|blog|contact|list-your-property|property-management-pricing|about|terms|privacy|es|login|portal|admin|favicon.ico)[^/]+)/property-management-cost/',
        destination: '/property-management-pricing/',
        permanent: true,
      },
      {
        source:
          '/es/:ciudad((?!api|_next|rentas|blog|contacto|publica-tu-propiedad|precios-administracion-propiedades|acerca-de-playastays|terminos|privacidad)[^/]+)/costo-administracion-propiedades/',
        destination: '/es/precios-administracion-propiedades/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

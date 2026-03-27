// ============================================================
// src/app/robots.ts
// Served at /robots.txt by Next.js App Router automatically.
// ============================================================

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.playastays.com/sitemap.xml',
  }
}

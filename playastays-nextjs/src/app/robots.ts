// ============================================================
// src/app/robots.ts
// Served at /robots.txt by Next.js App Router automatically.
// ============================================================

import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/schema'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/portal/', '/login/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  }
}

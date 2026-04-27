// ============================================================
// src/app/robots.ts
// Served at /robots.txt by Next.js App Router automatically.
// PRE-LAUNCH: Blocking all crawlers. Restore production rules on launch day.
// ============================================================

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  }
}

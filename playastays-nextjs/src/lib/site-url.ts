// ============================================================
// Single source of truth for public site origin (canonical host + HTTPS).
// Hosting should 301 http/non-www → this URL. Used by metadata, sitemap, schema.
// ============================================================

export const SITE_URL = 'https://www.playastays.com' as const

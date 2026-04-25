// Single place to resolve the WordPress REST base URL.
// Many machines still have WP_API_URL set to a legacy EC2 IP that is no longer reachable;
// the live CMS is on cms.playastays.com (same /wp-json/... path).

const LEGACY_WP_HOST = '3.238.93.162'
const CANON_CMS_HOST = 'cms.playastays.com'

/**
 * `WP_API_URL` with no trailing slash, suitable for `base + "/ps_city"`-style joins.
 * If the env host is the legacy IP, the hostname is replaced with the production CMS
 * and forced to HTTPS. Path (e.g. /wp-json/wp/v2) is preserved.
 */
export function getWordPressApiBaseUrl(): string {
  const raw = (process.env.WP_API_URL || '').trim()
  if (!raw) return ''
  try {
    const normalized = raw.replace(/\/+$/, '')
    const u = new URL(normalized)
    if (u.hostname === LEGACY_WP_HOST) {
      u.protocol = 'https:'
      u.port = ''
      u.hostname = CANON_CMS_HOST
    }
    return u.toString().replace(/\/$/, '')
  } catch {
    return raw.replace(/\/$/, '')
  }
}

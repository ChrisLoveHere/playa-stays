#!/usr/bin/env node
/**
 * Full-page screenshot sweep for local site review.
 * Usage: BASE_URL=http://localhost:3010 node scripts/screenshot-site-review.mjs
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.join(__dirname, '..', '..')
const OUT_BASE = path.join(REPO_ROOT, 'screenshots', 'site-review')
const DESKTOP_DIR = path.join(OUT_BASE, 'desktop')
const MOBILE_DIR = path.join(OUT_BASE, 'mobile')

const BASE = process.env.BASE_URL || 'http://localhost:3010'
const WP_POSTS = process.env.WP_POSTS_URL || 'https://cms.playastays.com/wp-json/wp/v2/posts?per_page=100&_fields=slug,status'

const DESKTOP_W = 1440
const MOBILE_W = 390

function buildStaticRoutes() {
  const routes = [
    { id: 'homepage', path: '/' },
    { id: 'blog-hub', path: '/blog/' },
    { id: 'blog-hub-es', path: '/es/blog/' },
    { id: 'contact', path: '/contact/' },
    { id: 'rentals', path: '/rentals/' },
    { id: 'property-management', path: '/property-management/' },
    { id: 'airbnb-management', path: '/airbnb-management/' },
    { id: 'vacation-rental-management', path: '/vacation-rental-management/' },
    { id: 'sell-property', path: '/sell-property/' },
    { id: 'list-your-property', path: '/list-your-property/' },
  ]

  const cities = [
    'playa-del-carmen',
    'tulum',
    'puerto-morelos',
    'akumal',
    'cozumel',
    'isla-mujeres',
    'xpu-ha',
  ]

  for (const c of cities) {
    routes.push({ id: `city-${c}`, path: `/${c}/` })
  }

  const cityServices = [
    ['playa-del-carmen', 'property-management'],
    ['playa-del-carmen', 'airbnb-management'],
    ['playa-del-carmen', 'vacation-rental-management'],
    ['playa-del-carmen', 'sell-property'],
    ['tulum', 'property-management'],
    ['tulum', 'airbnb-management'],
    ['cozumel', 'vacation-rental-management'],
  ]

  for (const [city, svc] of cityServices) {
    routes.push({
      id: `${city}-${svc}`,
      path: `/${city}/${svc}/`,
    })
  }

  return routes
}

async function fetchBlogSlugs() {
  try {
    const res = await fetch(WP_POSTS, { signal: AbortSignal.timeout(20000) })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map((p) => p.slug).filter(Boolean)
  } catch {
    return []
  }
}

/** When REST is unreachable, discover post URLs from the rendered blog hub (local only). */
async function discoverBlogRoutesFromHub(browser) {
  const page = await browser.newPage()
  const hub = `${BASE.replace(/\/$/, '')}/blog/`
  const routes = []
  try {
    await page.setViewportSize({ width: DESKTOP_W, height: 900 })
    await page.goto(hub, { waitUntil: 'domcontentloaded', timeout: 120000 })
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(2500)
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')).filter(Boolean))
    const baseObj = new URL(hub)
    const seen = new Set()
    for (const h of hrefs) {
      try {
        const u = new URL(h, baseObj.origin)
        if (u.origin !== baseObj.origin) continue
        const m = u.pathname.match(/^\/blog\/([^/]+)\/?$/)
        if (!m || m[1] === '') continue
        const slug = m[1]
        if (slug === 'page' || seen.has(slug)) continue
        seen.add(slug)
        routes.push({ id: `blog-${slug}`, path: `/blog/${slug}/` })
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    console.warn('Blog hub crawl failed:', e.message || e)
  } finally {
    await page.close()
  }
  return routes
}

async function capturePage(browser, route, results) {
  const url = `${BASE.replace(/\/$/, '')}${route.path}`
  const baseName = `${route.id}`
  const desktopFile = `${baseName}-desktop.png`
  const mobileFile = `${baseName}-mobile.png`
  const desktopPath = path.join(DESKTOP_DIR, desktopFile)
  const mobilePath = path.join(MOBILE_DIR, mobileFile)

  const row = {
    route: route.path,
    desktop: desktopFile,
    mobile: mobileFile,
    success: true,
    error: '',
    notes: '-',
  }

  const page = await browser.newPage()

  try {
    await page.setViewportSize({ width: DESKTOP_W, height: 900 })
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(2000)
    await page.screenshot({ path: desktopPath, fullPage: true })
  } catch (e) {
    row.success = false
    row.error = (e && e.message) || String(e)
    results.push(row)
    await page.close()
    return
  }

  try {
    await page.setViewportSize({ width: MOBILE_W, height: 844 })
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(2000)
    await page.screenshot({ path: mobilePath, fullPage: true })
  } catch (e) {
    row.success = false
    row.error = ((row.error || '') + ' | mobile: ' + ((e && e.message) || String(e))).trim()
  }

  await page.close()
  results.push(row)
}

async function main() {
  fs.mkdirSync(DESKTOP_DIR, { recursive: true })
  fs.mkdirSync(MOBILE_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  let blogRoutes = []
  const blogSlugs = await fetchBlogSlugs()
  if (blogSlugs.length > 0) {
    blogRoutes = blogSlugs.map((slug) => ({
      id: `blog-${slug}`,
      path: `/blog/${slug}/`,
    }))
  } else {
    blogRoutes = await discoverBlogRoutesFromHub(browser)
  }

  const allRoutes = [...buildStaticRoutes(), ...blogRoutes]

  const results = []

  for (const route of allRoutes) {
    await capturePage(browser, route, results)
  }

  await browser.close()

  const lines = [
    '# Site review screenshot manifest',
    '',
    `- **Base URL:** ${BASE}`,
    `- **Generated:** ${new Date().toISOString()}`,
    '',
    '| Route | Desktop | Mobile | Success | Notes |',
    '|-------|---------|--------|---------|-------|',
  ]

  for (const r of results) {
    const ok = r.success ? 'yes' : 'no'
    const err = r.error ? ` ${r.error}` : ''
    lines.push(
      `| ${r.route} | \`${r.desktop}\` | \`${r.mobile}\` | ${ok} | ${r.notes}${err ? ` — ${err}` : ''} |`,
    )
  }

  fs.writeFileSync(path.join(OUT_BASE, 'manifest.md'), lines.join('\n') + '\n', 'utf8')

  const failed = results.filter((r) => !r.success)
  console.log(`Done. ${results.length} pages, ${failed.length} failed. Output: ${OUT_BASE}`)
  if (failed.length) {
    console.error('Failures:', failed.map((f) => f.route + ' ' + f.error).join('\n'))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

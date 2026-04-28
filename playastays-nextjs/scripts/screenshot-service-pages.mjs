#!/usr/bin/env node
/**
 * Full-page screenshots: global EN service hubs + EN city × service (32 URLs).
 * Usage: BASE_URL=http://localhost:3010 node scripts/screenshot-service-pages.mjs
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(REPO_ROOT, 'screenshots', 'service-pages')

const BASE = process.env.BASE_URL || 'http://localhost:3010'
const VIEWPORT_W = parseInt(process.env.SCREENSHOT_W || '1440', 10)
const VIEWPORT_H = parseInt(process.env.SCREENSHOT_H || '900', 10)

/** Same hub order as SERVICE_HUB_IDS — EN URL segment */
const HUBS_EN = [
  'property-management',
  'airbnb-management',
  'vacation-rental-management',
  'sell-property',
]

/** Cities with service pages (aligned with scripts/screenshot-site-review.mjs) */
const CITIES = [
  'playa-del-carmen',
  'tulum',
  'puerto-morelos',
  'akumal',
  'cozumel',
  'isla-mujeres',
  'xpu-ha',
]

function buildRoutes() {
  const routes = []
  for (const hub of HUBS_EN) {
    routes.push({ id: `hub-en-${hub}`, path: `/${hub}/` })
  }
  for (const city of CITIES) {
    for (const hub of HUBS_EN) {
      routes.push({ id: `${city}__${hub}`, path: `/${city}/${hub}/` })
    }
  }
  return routes
}

async function main() {
  const routes = buildRoutes()
  if (routes.length !== 32) {
    console.error(`Expected 32 routes, got ${routes.length}`)
    process.exit(1)
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const results = []

  for (const route of routes) {
    const url = `${BASE.replace(/\/$/, '')}${route.path}`
    const fileName = `${route.id}.png`
    const outPath = path.join(OUT_DIR, fileName)
    const page = await browser.newPage()
    const row = { path: route.path, file: fileName, ok: true, err: '' }
    try {
      await page.setViewportSize({ width: VIEWPORT_W, height: VIEWPORT_H })
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
      await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {})
      await page.waitForTimeout(2000)
      await page.screenshot({ path: outPath, fullPage: true })
    } catch (e) {
      row.ok = false
      row.err = (e && e.message) || String(e)
    }
    results.push(row)
    await page.close()
  }

  await browser.close()

  const lines = [
    '# Service pages screenshot manifest',
    '',
    `- **Base URL:** ${BASE}`,
    `- **Count:** ${routes.length} (4 global EN hubs + 7 cities × 4 services)`,
    `- **Generated:** ${new Date().toISOString()}`,
    '',
    '| Path | File | OK |',
    '|------|------|-----|',
  ]
  for (const r of results) {
    lines.push(`| ${r.path} | \`${r.file}\` | ${r.ok ? 'yes' : 'no'}${r.err ? ` — ${r.err}` : ''} |`)
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.md'), lines.join('\n') + '\n', 'utf8')

  const failed = results.filter((r) => !r.ok)
  console.log(`Done. ${results.length} screenshots → ${OUT_DIR}`)
  if (failed.length) console.error('Failures:', failed.map((f) => f.path + ' ' + f.err).join('\n'))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

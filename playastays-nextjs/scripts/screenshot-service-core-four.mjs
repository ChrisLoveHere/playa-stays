#!/usr/bin/env node
/**
 * Four core service URLs (EN hubs + Playa city pages).
 * Usage: BASE_URL=http://localhost:3010 node scripts/screenshot-service-core-four.mjs
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(REPO_ROOT, 'screenshots', 'service-core-four')

const BASE = process.env.BASE_URL || 'http://localhost:3010'

const ROUTES = [
  { file: 'property-management.png', path: '/property-management/' },
  { file: 'playa-del-carmen-property-management.png', path: '/playa-del-carmen/property-management/' },
  { file: 'airbnb-management.png', path: '/airbnb-management/' },
  { file: 'playa-del-carmen-airbnb-management.png', path: '/playa-del-carmen/airbnb-management/' },
]

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  for (const r of ROUTES) {
    const url = `${BASE.replace(/\/$/, '')}${r.path}`
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(2000)
    await page.screenshot({ path: path.join(OUT_DIR, r.file), fullPage: true })
    await page.close()
    console.log('OK', r.path, '→', r.file)
  }
  await browser.close()
  console.log('Output:', OUT_DIR)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

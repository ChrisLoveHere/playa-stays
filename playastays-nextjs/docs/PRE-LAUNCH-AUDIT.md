# PlayaStays Pre-Launch Audit

**Last updated:** April 28, 2026
**Target launch:** within 1-2 weeks
**Architecture:** Next.js 14 on Vercel + Headless WordPress on AWS Lightsail
**Domain:** playastays.com (DNS access available)

---

## How to use this document

This audit lives in `docs/` and gets updated as you complete items. Status conventions:

- ⬜ Not started
- 🔄 In progress
- ✅ Complete
- ❌ Blocked or skipped (with reason)
- 🟡 Deferred to post-launch

Each section is ordered by dependency — earlier items often block later ones. Don't skip ahead unless you've explicitly decided to defer something.

**Realistic effort note:** A 1-2 week launch with self-managed Lightsail WordPress is achievable but tight. Expect 25-40 hours of total work across the next 14 days. If your time budget is much smaller, reconsider managed hosting (Kinsta/WP Engine) — that swap shaves 8-12 hours of WP infrastructure work.

---

## Recently Completed (since checkpoint `b398868`)

### Production Infrastructure (Day 4)

✅ **Lightsail WordPress production server hardened (`cms.playastays.com`)**
- SSL configured via Let's Encrypt + certbot, with HTTP → HTTPS redirect
- Squarespace DNS A record pointed to Lightsail (`54.84.210.137`)
- `WP_HOME` hardcoded HTTPS in `wp-config.php`
- Backup preserved at `/var/www/wp-config.php.backup-20260427-204720`

✅ **WordPress ↔ Vercel integration and auth unblocked**
- Wordfence application-password block disabled
- Application Password generated for Vercel ↔ WP authentication
- All 11 Vercel env vars configured:
  - `WP_API_URL`
  - `NEXT_PUBLIC_WP_API_URL`
  - `WP_APP_PASSWORD`
  - `PREVIEW_SECRET`
  - `REVALIDATION_SECRET`
  - `HUBSPOT_PORTAL_ID`
  - `HUBSPOT_FORM_GUID`
  - `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`
  - `NEXT_PUBLIC_DEPLOY_DATE`
  - `ADMIN_BASIC_AUTH_USER`
  - `ADMIN_BASIC_AUTH_PASSWORD`

✅ **Pre-launch security + indexing controls shipped**
- HTTP Basic Auth middleware deployed in `src/middleware.ts` for `/admin` and `/portal`
- Timing-safe credential comparison + fail-safe `503` fallback when creds are missing
- `robots.txt` configured to block all crawlers pre-launch
- Homepage "27%" claim softened to qualitative language for consistency
- Pre-launch audit checkpoint committed (`b398868`)

### /list-your-property/ Rebuild (Day 4 Part 1)

✅ **Conversion-oriented rebuild completed**
- New `SwitchingManagersSection`
- New `ListingFAQ` component
- New `QualitativeTrustBlock`

### Property Management Hub — 5-Pass Polish (evening completion)

✅ **Pass 5 finalized for EN + ES (`/property-management/` + `/es/administracion-de-propiedades/`)**
- Final structure now:
  - Hero → Promise → Founder → Process → Trust → Enhancement → Google Review → Cities → FAQ → Yelp Review → CTA strip

✅ **Major shipped pieces**
- PlayaStays Property Promise framework (4 pillars):
  - Property operations
  - Tenant & guest lifecycle
  - Marketing & listings
  - Compliance & reporting
- Founder card rewritten with operations-accountability angle (distinct from homepage origin story), including WhatsApp + LinkedIn + Facebook + Instagram links
- 4-step onboarding process section (quarterly review removed for cleaner horizontal layout)
- TrustBar restructured into one cohesive `bg-deep` block with centered eyebrow + 5 stats (dropped "200+ properties managed")
- Property Enhancement Packages renamed/refined:
  - Smart Home Upgrades
  - Pool & Hot Tub Care
  - Hurricane Prep & Backup Power
- Enhancement section now renders as a 3-card desktop row with image-led cards
- Reusable `ReviewCard` component (Google + Yelp placeholders) aligned to homepage testimonial pattern
- FAQ "Do you cover all of Quintana Roo?" enriched with 8 clickable city links
- Hero is now the single form entry point (footer form removed)
- CTA strip updated to: "Transparent pricing. No surprise fees." → `/property-management-pricing/`
- Full EN + ES bilingual sync completed
- New component set now in use:
  - `ServiceHubCityCards`
  - `ReviewCard`
- New asset scaffolds ready for content drops:
  - `/public/property-care/`
  - `/public/reviews/`

---

## Remaining work — prioritized tiers

### Tier 1 — Pre-launch must-have (1 week)

- ⬜ Apply Pass 5 design pattern to `/airbnb-management/`, `/vacation-rental-management/`, `/sell-property/` hubs (~3 focused sessions; `ServiceHubCityCards` is hub-aware, `TrustBar` is generic, enhancement-card pattern is reusable)
- ⬜ Replace placeholder Google + Yelp reviews with real text + reviewer photos in `/public/reviews/`
- ⬜ Add real Property Promise pillar photos in `/public/property-care/`
- ⬜ Wire `playastays.com` to Vercel production domain (when ready to remove crawler block)
- ⬜ Update `robots.txt` to allow crawlers at go-live
- ⬜ Move admin credentials from `~/Desktop/admin-creds-temp.txt` into Apple Passwords/Keychain, then delete temp file

### Tier 2 — Launch-week polish (can ship without, better with)

- ⬜ WP city/service shell SEO meta + hero content pass (8 cities × 56 services currently shell-heavy)
- ⬜ City × service page content depth review (32 combinations currently relying on generic `ServicePageTemplate`)
- ⬜ Image compression pass (Puerto Morelos ~1MB, Tulum/PDC ~680KB, Cozumel ~504KB)
- ⬜ OG image coverage for major pages
- ⬜ Build `/about/` page with full team bios
- ⬜ Review Cursor-generated Isla Mujeres/Cozumel pricing fields

### Tier 3 — Post-launch (iterate after go-live)

- 🟡 Hospitable MCP integration architecture (separate track from launch)
- 🟡 Real testimonial outreach (replace placeholders with named clients)
- 🟡 AI chat decision (HubSpot Chat preferred because HubSpot is already in stack)
- 🟡 Calendly real booking link (replace placeholder in contact methods)
- 🟡 `/admin` dashboard cleanup informed by Hospitable findings
- 🟡 Listings/rentals architecture + Google Maps property embed (geocode-on-submit pattern)
- 🟡 Schema consolidation cleanup (homepage + contact currently emit 4 JSON-LD blocks each)
- 🟡 Fix `ps_city_tag` REST API exposure in WordPress (non-blocking build warnings)
- 🟡 Verify "significantemente" Spanish typo fix is actually deployed
- 🟡 `/admin` module Hospitable integration track

---

## Section 1 — CRITICAL (must complete before launch)

These items are blockers. Without them, the site either doesn't render in production, fails security expectations, or violates basic SEO requirements.

### 1.1 — WordPress production deployment on Lightsail

⬜ **Spin up Lightsail WordPress instance**
- Size: minimum $5/mo plan ($10/mo recommended for headroom)
- Region: closest to your primary user base — likely us-east-1 or us-east-2
- Owner: You
- Effort: 30 min

⬜ **Migrate WordPress content from LocalWP**
- Export from LocalWP: All Content (XML) via Tools → Export
- Plus database export via Adminer or LocalWP's database tools
- Import into Lightsail WP via WordPress admin → Tools → Import
- Verify all custom post types transfer: `ps_property`, `ps_city`, `ps_service`, FAQ, testimonial, blog posts
- Verify the playastays-content-model plugin transfers (manual file copy via SFTP)
- Owner: You
- Effort: 2-3 hours (longer if content volume is large)

⬜ **Configure SSL on Lightsail**
- Use Bitnami's `bncert-tool` (comes pre-installed)
- Point to playastays.com or a subdomain like wp.playastays.com
- Verify auto-renewal is configured
- Owner: You
- Effort: 30 min

⬜ **Harden WordPress security**
- Create a dedicated REST API user (not the admin account)
- Generate Application Password for that user (Users → Profile → Application Passwords)
- Install: Limit Login Attempts plugin
- Install: 2FA plugin (Wordfence or Two Factor)
- Disable XML-RPC if not needed
- Configure automatic security updates
- Owner: You
- Effort: 1-2 hours

⬜ **Configure Lightsail snapshots**
- Schedule automated daily snapshots
- Verify retention policy (keep at least 7 days)
- Document the restore procedure for yourself
- Owner: You
- Effort: 15 min

⬜ **Test REST API from external network**
- From a browser NOT on your local network: hit `https://[your-wp-url]/wp-json/wp/v2/posts`
- Confirm returns JSON, not 401/403
- Confirm it returns expected post types
- Owner: You
- Effort: 5 min check

### 1.2 — Vercel environment variables

⬜ **Configure production environment variables in Vercel**
- `WP_API_URL` — production WP URL with `/wp-json/wp/v2`
- `NEXT_PUBLIC_WP_API_URL` — same as above (publicly exposed)
- `WP_APP_PASSWORD` — application password from the dedicated REST user (server-only, NOT exposed)
- `PREVIEW_SECRET` — random string for draft preview functionality
- `REVALIDATION_SECRET` — random string used by WP plugin to trigger Vercel revalidation
- Set scope: Production only (Preview/Development can stay pointed at LocalWP if you want)
- Owner: You
- Effort: 15 min

⬜ **Configure WordPress to call Vercel revalidation**
- In `wp-config.php` or via the playastays-content-model plugin settings:
  - `ps_revalidate_url` = your Vercel revalidation endpoint
  - `ps_revalidate_secret` = same value as `REVALIDATION_SECRET` in Vercel
- Owner: You
- Effort: 15 min

⬜ **Test build succeeds with production env vars**
- Trigger a Vercel deployment
- Watch build logs for WP API errors
- Verify a few pages render correctly: homepage, /contact/, a city hub
- Owner: You
- Effort: 30 min (longer if build fails and needs debugging)

### 1.3 — Domain configuration

⬜ **Point playastays.com at Vercel**
- In Vercel project: Settings → Domains → Add `playastays.com` and `www.playastays.com`
- In your DNS provider: add the records Vercel specifies
  - `A` record for apex pointing to `76.76.21.21` (Vercel's IP — confirm current value in Vercel UI)
  - `CNAME` for `www` pointing to `cname.vercel-dns.com`
- Choose canonical: redirect www → apex OR apex → www. Pick one and stick to it.
- Owner: You
- Effort: 15 min + 1-24 hours for DNS propagation

⬜ **Verify SSL on the domain**
- Vercel issues SSL automatically once DNS resolves
- Test: `https://playastays.com` and `https://www.playastays.com` both work without SSL warnings
- Owner: You
- Effort: 5 min check (after DNS propagates)

### 1.4 — Sitemap and robots.txt

⬜ **Regenerate sitemap.xml after content additions**
- Verify Next.js sitemap.ts (or sitemap configuration) reflects all current routes
- Confirm both EN and ES routes are included
- Confirm city × service combo pages are included
- Test: visit `https://playastays.com/sitemap.xml` after deploy, confirm valid XML
- Owner: You
- Effort: 30 min

⬜ **Verify robots.txt allows production indexing**
- Confirm production robots.txt does NOT have `Disallow: /` (which would block all crawlers)
- Confirm references `Sitemap: https://playastays.com/sitemap.xml`
- Owner: You
- Effort: 10 min

⬜ **EN noindex parity audit**
- Per your existing notes: ES routes have a noindex guard for non-production environments. EN routes do not.
- Decide: should EN also have the guard? If yes, implement before production.
- If the guard is purely environment-based (only blocks staging), this is fine. If it's accidentally blocking EN production, it's a launch blocker.
- Owner: You + Cursor for the implementation
- Effort: 30 min audit + 30 min fix if needed

### 1.5 — Smart form submission infrastructure

⬜ **Verify form submissions actually go somewhere**
- The smart form on /contact/ posts to an API endpoint. Where does that endpoint deliver the data?
- If email: confirm SMTP credentials are set in production env vars
- If WP: confirm new submissions create records in WP and you receive notifications
- If a third-party service (HubSpot, Mailchimp): confirm API key is set
- Test: submit a form on production, confirm you get the message
- Owner: You
- Effort: 30 min - 2 hours depending on current state

---

## Section 2 — IMPORTANT (should complete before launch)

These items affect launch quality. Site will technically work without them, but professional polish drops if skipped.

### 2.1 — Image optimization

⬜ **Compress oversized images**
- Per your existing notes:
  - Puerto Morelos hero: 1MB (target: under 200KB)
  - Tulum hero: 680KB (target: under 200KB)
  - Playa del Carmen hero: 680KB (target: under 200KB)
  - Cozumel hero: 504KB (target: under 200KB)
- Use TinyPNG, ImageOptim (Mac), or `cwebp` for WebP
- Owner: You
- Effort: 1-2 hours for the full image audit

⬜ **Convert critical images to WebP with JPG fallback**
- Hero images, OG images, founder photos, team photos
- Next.js Image component handles fallbacks if you provide both formats
- Owner: You
- Effort: 1 hour

⬜ **Audit team photos**
- Confirm chris-love.jpg, tony-sparks.png, carmen-castro.png are appropriately sized (under 100KB each, ideally)
- Confirm all three are roughly equivalent quality (resolution, lighting, framing)
- Owner: You
- Effort: 30 min

### 2.2 — Open Graph and social preview images

⬜ **Per-page OG images**
- Homepage: branded OG with founder photo + tagline
- /contact/: branded OG with contact details
- /list-your-property/: branded OG with the revenue promise
- /property-management-pricing/: branded OG with pricing summary
- Major city pages (Playa del Carmen, Tulum, Cozumel — at minimum)
- Recommended: 1200x630px, JPG or PNG, under 100KB each
- Tools: Canva, Figma, or programmatically generated via @vercel/og
- Owner: You
- Effort: 2-3 hours for a complete set

⬜ **Open Graph metadata audit**
- Each major page should have unique og:title, og:description, og:image
- Check via View Source on each page
- Test with Facebook Sharing Debugger and Twitter Card Validator
- Owner: You + small Cursor task if metadata isn't being set per-page
- Effort: 1 hour

### 2.3 — Schema additions and verification

⬜ **Verify schema actually renders on homepage and pricing page**
- Day 3 Part 4 added PersonOrganizationSchema to those pages but Cursor noted runtime verification was unstable due to local server issues
- After production deploy: View Source on https://playastays.com — confirm 4 ld+json blocks (Organization + 3 Person)
- Same for /property-management-pricing/, /es/, /es/precios-administracion-propiedades/
- Owner: You
- Effort: 15 min

⬜ **Validate JSON-LD with Google's Rich Results Test**
- Go to https://search.google.com/test/rich-results
- Test homepage, /contact/, pricing page
- Confirm no errors
- Confirm Person and Organization schema both detected
- Owner: You
- Effort: 30 min

### 2.4 — Form completeness

⬜ **Calendly link integration**
- The /contact/ page has a "Book a 30-minute call" item with placeholder text
- Set up Calendly account if not done
- Configure event type for "30-minute consultation"
- Replace placeholder text + add real link
- This is a small Cursor task once you have the URL
- Owner: You + small Cursor task
- Effort: 30 min Calendly setup + 5 min code update

⬜ **Form testing across all audience types**
- Test smart form submission as: owner, guest, investor, other
- Confirm correct fields submit, audience_type is captured, email/notification arrives
- Owner: You
- Effort: 30 min

### 2.5 — Hardcoded inconsistencies

⬜ **Soften 27% claim on homepage**
- Per Day 4 Part 1 work, /list-your-property/ now uses qualitative claim ("owners earn meaningfully more")
- Homepage still says "Owners earn 27% more with PlayaStays than self-managing"
- Apply same softening for site-wide consistency
- Small Cursor task — touch HomeStatsBanner.tsx or wherever the claim lives
- Owner: Small Cursor task
- Effort: 15 min

⬜ **Pricing page founder widget audit**
- Confirm pricing page founder widget got the WhatsApp Chris CTA + 3 social icons in Day 3 Part 2
- If not, small Cursor task to bring it in line with homepage and /list-your-property/
- Owner: You verify, Cursor fix if needed
- Effort: 10 min check + 15 min fix if needed

⬜ **Internal links audit**
- Run `grep -rn "href=" src/` and look for:
  - Links to retired slugs
  - Links to non-existent pages
  - Hardcoded localhost URLs
  - Inconsistent EN/ES path handling
- Owner: You + Cursor for fixes
- Effort: 1 hour

⬜ **Footer CTA consistency**
- Verify footer has same primary CTA across all pages
- Check both EN and ES footer
- Owner: You
- Effort: 15 min

### 2.6 — WP city/service shells content

⬜ **Populate empty city × service combo pages**
- Per your existing notes: 8 cities × 56 services exist as empty WP shells
- These render via the dynamic `[slug]/page.tsx` template
- They need at minimum: ps_seo_title, ps_seo_desc, hero content
- Strategic question: launch with all populated, or accept that these will be populated post-launch and just confirm they don't render visibly broken?
- Recommendation: ensure metadata exists so they don't return 404 or empty pages, defer rich content to post-launch
- Owner: You
- Effort: 4-8 hours (depending on how much content you write per shell)

⬜ **Cursor-generated pricing fields review**
- Per your existing notes: Isla Mujeres and Cozumel pricing fields (whatAffectsPricing, extraFaqs, whyMgmtValue, inventoryCondoVilla, seasonalityDemand) were auto-generated and need your review
- Walk through each and confirm accuracy or rewrite
- Owner: You
- Effort: 1-2 hours

---

## Section 3 — NICE-TO-HAVE (can ship without)

Polish items that improve launch but won't break things if missing.

### 3.1 — Performance

🟡 **Lighthouse audit baseline**
- After image compression and on production: run Lighthouse on key pages
- Target scores: Performance 80+, Accessibility 90+, Best Practices 90+, SEO 95+
- Capture baseline numbers for post-launch tracking
- Owner: You
- Effort: 1 hour

🟡 **Bundle analysis**
- Run `npm run build` and check bundle sizes
- Look for unexpectedly large dependencies
- Optimize if any single page bundle is > 250KB
- Owner: You
- Effort: 1 hour

🟡 **Core Web Vitals check**
- After production: monitor LCP, FID, CLS via PageSpeed Insights
- Flag any pages scoring poor on any metric
- Owner: You
- Effort: 30 min

### 3.2 — Branch consolidation

🟡 **Merge feature branches to main**
- Currently on `polish/site-conversion` (renamed from `polish/day-2-homepage`)
- Old `polish/day-1-pricing` and `polish/day-2-homepage` branches may exist locally
- Local main is stale — reconcile when ready to deploy
- Owner: You
- Effort: 30 min

### 3.3 — Real testimonials

🟡 **Replace testimonial placeholders**
- /contact/ and /list-your-property/ both have "Coming soon" testimonial slots
- Outreach to current owners (start with Peter Langelaar — already gave a Google review)
- Goal: 2-3 real testimonials, ideally one specific to switching from another manager
- Owner: You (outreach), small Cursor task for content swap once received
- Effort: 1-2 hours outreach + ongoing collection

### 3.4 — /about/ page

🟡 **Build proper /about/ page**
- Promised in Day 3 planning but never built
- Should include: Chris bio, full team (already have content), why-PlayaStays origin story, certifications
- Defer until you have real founder bio content prepared
- Owner: You for content, Cursor for build
- Effort: 2 hours content prep + 1 hour Cursor build

### 3.5 — Service hub template polish

🟡 **Polish the service hub template**
- Affects /sell-property/, /property-management/, /airbnb-management/, /vacation-rental-management/
- Currently functional but visually behind homepage and contact page
- Single dedicated session work
- Owner: Cursor task with your strategic input
- Effort: 1.5-2 hours

### 3.6 — llms.txt strategy

🟡 **Decide on llms.txt**
- llms.txt is an emerging standard for telling AI models how to interact with your site
- Optional, but adoption is growing among forward-thinking sites
- If you want this, it's a small file in /public/ describing your site
- Owner: You strategic decision, Cursor for implementation
- Effort: 30 min if you want it

---

## Section 4 — POST-LAUNCH

Things to set up AFTER going live, not before.

### 4.1 — Analytics and monitoring

⬜ **Google Analytics 4 setup**
- Set up GA4 property if not done
- Add tracking ID to Next.js (likely via env var + analytics component)
- Verify pageviews tracking
- Set up conversion goals: form submissions, WhatsApp clicks, phone clicks

⬜ **Google Search Console verification**
- Verify domain ownership in GSC
- Submit sitemap.xml
- Monitor for crawl errors weekly for first month

⬜ **Vercel Analytics**
- Free tier comes with Vercel
- Captures Core Web Vitals automatically
- Enable in Vercel project settings

⬜ **Uptime monitoring**
- UptimeRobot (free) or similar
- Monitor: homepage, /contact/, /property-management-pricing/
- Email alert on downtime

### 4.2 — Content cadence

🟡 **Blog content publishing rhythm**
- You said yes to active content production
- Goal: 1-2 posts per week minimum
- Topics already discussed: each city × service combo can become a blog topic, plus broader Riviera Maya owner education content
- Owner: You + your existing content production process
- Effort: ongoing

🟡 **Blog placeholder removal**
- If the blog page currently shows "Coming soon" type placeholders, remove once you have 3+ real posts published
- Owner: You
- Effort: 15 min once you cross the threshold

### 4.3 — SEO post-launch

🟡 **Submit to local directories**
- Verify Google Business Profiles (already have 3 — PDC, Tulum, Cozumel) are linked to playastays.com
- Submit to local Quintana Roo business directories
- Encourage Google reviews from current customers

🟡 **Backlink outreach**
- Local Riviera Maya business sites
- Property management industry publications
- Travel blogger partnerships
- Owner: You + content production process
- Effort: ongoing

### 4.4 — AI chat decision

🟡 **AI chat vendor decision and integration**
- Deferred during Day 3 planning
- Options reviewed: Crisp (recommended), HubSpot Chat (if you use HubSpot), Tawk.to (free)
- Once selected: small Cursor task to embed on /contact/ only (Pattern B)
- Owner: You research + decision, then small Cursor task
- Effort: 2 hours research + 30 min Cursor integration

### 4.5 — Rate limiting for Airbnb Title Checker tool

🟡 **Decide on rate limiting infrastructure**
- Per your notes: Airbnb Title Checker is a separate project at airbnboptimization.com
- Decision pending: in-memory Map vs Upstash Redis
- Out of scope for PlayaStays launch but on your radar
- Owner: You
- Effort: separate session

---

## Pre-launch sanity checklist (the day of launch)

Run this 24 hours before flipping DNS:

- [ ] Production WP responding to /wp-json requests from external IP
- [ ] Vercel build succeeds with production env vars
- [ ] Latest commit deployed to Vercel
- [ ] Test deployments work end-to-end (homepage → contact form submission → notification arrives)
- [ ] Sitemap.xml resolves and contains expected URLs
- [ ] robots.txt allows indexing
- [ ] All major pages return 200 OK (not 404 or 500)
- [ ] SSL certificates valid on both apex and www
- [ ] Mobile rendering check on real device (not just DevTools)
- [ ] Form submission test on production (one of each audience type)
- [ ] WhatsApp links open WhatsApp correctly with prefilled message
- [ ] Schema.org validates via Google Rich Results Test
- [ ] No console errors on any major page

---

## Realistic timeline estimate

**Site you can launch in 1 week (credible launch baseline):**
- Complete Tier 1 only:
  - Finish Pass 5 pattern rollout to the other 3 service hubs
  - Swap in real reviews
  - Drop real pillar photos
  - Wire domain to Vercel
  - Unblock crawlers for production indexing
- Outcome: a credible, professional vacation-rental management site ready to convert owners.

**Site fully polished + content-deep (3-4 weeks):**
- Tier 1 + Tier 2 + select Tier 3 polish items.
- Outcome: stronger SEO surface area, better content depth, and stronger conversion trust signals.

**Site with full Hospitable integration replacing `/admin` modules (6-8 weeks):**
- Treat as a dedicated project, not a launch blocker.
- Current `/admin` is functional now; Hospitable would replace ~6 of 12 modules cleanly:
  - properties
  - reservations
  - conversations
  - cleanings/tasks
  - payments
  - calendar

---

## What's NOT in this audit

Things that are genuinely deferred or out of scope:

- AI chat integration — separate project once vendor selected
- /about/ page — content prep needed first
- Full service hub template polish — separate session
- Real testimonials — outreach in parallel, can replace placeholders post-launch
- Major new feature work — focus is on launching what exists, not building new things

If any of these become "must have before launch" in your judgment, factor in additional time.

---

## How to use this document going forward

1. Update statuses as you complete items (⬜ → 🔄 → ✅)
2. Commit updates: `git add docs/PRE-LAUNCH-AUDIT.md && git commit -m "audit: [item] complete"`
3. Reference this when planning each session — pick from the next not-yet-done item
4. If a new blocker appears mid-launch prep, add it to the appropriate section
5. After launch: archive this file (rename to `PRE-LAUNCH-AUDIT-COMPLETED.md`) and create a new `POST-LAUNCH-OPERATIONS.md` for ongoing work

---

*Audit document created during Day 4 polish session. Owner: Chris Love. Stack: Next.js 14 + WordPress (headless on Lightsail) + Vercel.*

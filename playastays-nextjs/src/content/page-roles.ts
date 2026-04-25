/**
 * PlayaStays — page role guardrails (templates + CMS editorial).
 * Bump PAGE_ROLE_DOC_VERSION when this contract changes.
 *
 * ── CITY HUB — /[city]/, /es/[ciudad]/ ───────────────────────────────
 * Purpose: market overview, local context, neighborhoods, services in city,
 * route to city × service pages. NOT the primary page for exact [service]+[city] intent.
 *
 * H1: market-level only (no “Property Management in [City]” style).
 * Hero CTAs: pathway only (e.g. explore services, browse neighborhoods) — no service+city pitch.
 *
 * Section order (template):
 * 1. Hero
 * 2. Why this city matters (market context)
 * 3. Neighborhoods / areas served
 * 4. Services available in this city (cards → city × service)
 * 5. One market snapshot / proof (limited)
 * 6. FAQ (max 6)
 * 7. Final CTA (pathway before estimate; no competing stacks)
 * 8. Cross-city peer links (optional appendix)
 *
 * Required sections:
 * - Hero (city presence + primary navigation toward services)
 * - Market context (why this market matters — not a service pitch)
 * - Neighborhoods / coverage (local geography)
 * - Service pathways (grid → city × service URLs only; one-line blurbs)
 * - Cross-city links (peer hubs)
 *
 * Allowed but limited:
 * - TrustBar (generic trust, not service-specific claims)
 * - PerformanceProof with hubSnapshot (illustrative portfolio — not “full” commercial proof)
 * - Pricing pointer strip (link to city cost page — no fee tables on hub)
 * - FAQ when questions route users (navigation & context), not service-specific pricing/process essays
 * - Insights cards (market/operating context — not step-by-step service delivery)
 * - TrustStack, lead forms, CtaStrip (soft conversion OK)
 *
 * Forbidden / inappropriate:
 * - Step-by-step onboarding or “how we manage” process blocks (belongs on service hub + city×service)
 * - Detailed fee tiers, plan comparison grids, or long commercial body for a single service
 * - H1/H2 phrasing that targets exact [service] + [city] SEO as the primary promise of the hub
 * - Pasting WordPress service post body onto the hub
 *
 * ── SERVICE HUB — /property-management/, /airbnb-management/, etc. ─────
 * Purpose: explain the service across the region; route users to city × service.
 * H1: service-first, region-wide (not local city-intent).
 * Hero: broad commercial CTA + optional route/secondary CTA; no awkward “architecture” copy on city cards.
 *
 * Section order (template):
 * 1. Hero (+ lead form anchor)
 * 2. What this service is (editorial)
 * 3. What’s included
 * 4. Who it helps
 * 5. How it works (steps)
 * 6. Cities where we offer this service (primary → city × service; subtle → city hub)
 * 7. Related services (optional)
 * 8. One regional proof snapshot
 * 9. FAQ (max 6)
 * 10. Final CTA
 *
 * Required:
 * - What the service is, who it is for, what’s included (Riviera-wide)
 * - Process / steps at a high level
 * - City pathway cards → city × service (and optional city hub for context)
 *
 * Allowed but limited:
 * - PerformanceProof with regional framing
 * - FAQ for service-definition questions (not seven cities × repeated local copy)
 *
 * Forbidden:
 * - Long neighborhood guides or market essays per city (belongs on city hub)
 * - Competing with city×service for “[service] in [city]” as the main narrative in body copy
 *
 * ── CITY × SERVICE — /[city]/[service]/ ───────────────────────────────
 * Purpose: strongest page for exact [service] + [city] commercial intent.
 * H1: exact city + service.
 * NOT a city guide; link to city hub for neighborhoods / market map.
 *
 * Section order (template / pillar):
 * 1. Hero (conversion CTA + estimate form)
 * 2. Why this service matters in this city
 * 3. What’s included
 * 4. Local process / execution
 * 5. One local proof block
 * 6. FAQ (max 6)
 * 7. Light parent links (subtle)
 * 8. Final CTA
 *
 * Required:
 * - City + service hero, proof, process, pricing signals, FAQs, conversion — strongest commercial page
 * - Breadcrumb: Home → City hub → Service
 *
 * Forbidden:
 * - Acting as the Riviera-wide service definition (link to service hub instead)
 * - Replacing city hub market content (link up + summarize)
 *
 * CMS EDITORIAL (WordPress):
 * - City hub posts: sound like a market guide + map to services; end sections with “open the [service] page for…”
 * - Service hub pages: sound like product/ops definition; avoid “In Tulum…” blocks — use city cards
 * - City × service posts: sound like “we deliver this service here”; local rules, fees, neighborhoods, CTA
 * - Never paste the same 3+ paragraphs across two page types; rotate angle (market vs product vs local deal)
 * - Reserve phrases like “property management in [city]” / “your [city] Airbnb” primarily for city × service titles and intros
 */

export const PAGE_ROLE_DOC_VERSION = 2

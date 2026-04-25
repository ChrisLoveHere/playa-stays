// ============================================================
// Optional design-preview blog drafts (no WordPress required)
// Enable with BLOG_PREVIEW_DRAFTS=1 — see .env.local.example
// ============================================================

import type { BlogPost, WpTerm } from '@/types'
import { RETUR_Q_ARTICLE_BODY_HTML } from '@/lib/blog-preview-post-returq-qroo-body'
import { BLOG_HERO_JPG } from '@/lib/public-assets'

const DEFAULT_HERO = BLOG_HERO_JPG

function embeddedHero(alt: string, heroSrc?: string): BlogPost['_embedded'] {
  return {
    'wp:featuredmedia': [{ source_url: heroSrc ?? DEFAULT_HERO, alt_text: alt }],
    author: [{ name: 'PlayaStays' }],
  }
}

function termId(terms: WpTerm[], slug: string): number | undefined {
  return terms.find(t => t.slug === slug)?.id
}

/** True when local preview posts should merge with (or stand in for) WordPress. */
export function blogPreviewDraftsEnabled(): boolean {
  return process.env.BLOG_PREVIEW_DRAFTS === '1'
}

function basePost(p: {
  id: number
  slug: string
  date: string
  title: string
  excerptHtml: string
  seoTitle: string
  seoDesc: string
  contentHtml: string
  heroAlt: string
  /** Optional hero image URL (preview posts default to shared stock hero). */
  heroSrc?: string
}): Omit<BlogPost, 'ps_blog_topic' | 'ps_blog_area'> {
  return {
    id: p.id,
    slug: p.slug,
    date: p.date,
    modified: p.date,
    title: { rendered: p.title },
    excerpt: { rendered: `<p>${p.excerptHtml}</p>` },
    content: { rendered: p.contentHtml },
    meta: {
      ps_seo_title: p.seoTitle,
      ps_seo_desc: p.seoDesc,
    },
    _embedded: embeddedHero(p.heroAlt, p.heroSrc),
  }
}

/** Topic slug per post (index-aligned with POSTS). Index 2 = vacation-rentals comparison; index 3 = RETUR-Q guide. */
const TOPIC_SLUGS = [
  'property-management',
  'market-insights',
  'vacation-rentals',
  'property-management',
] as const
const AREA_SLUG = 'playa-del-carmen'

const POSTS = [
  basePost({
    id: 9100001,
    slug: 'how-property-management-works-playa-del-carmen-riviera-maya',
    date: '2026-02-03T14:00:00',
    title: 'How Property Management Works in Playa del Carmen and the Riviera Maya',
    excerptHtml:
      'What full-service vacation rental management covers in this market: guest communication, turnovers, pricing discipline, maintenance triage, and how owners stay informed.',
    seoTitle:
      'How Vacation Rental Property Management Works in Playa del Carmen | PlayaStays',
    seoDesc:
      'A practical overview of professional property management in Playa del Carmen and the Riviera Maya—operations, guest experience, and what owners should expect.',
    heroAlt: 'Palm trees and coastal light in the Riviera Maya',
    contentHtml: `
<h2>What “management” means on the ground</h2>
<p>If you own a rental here, “full-service property management” should translate into a predictable operating system: clear responsibilities, measurable standards, and a team that can execute without you running day-to-day messages.</p>
<h3>Guest communication and coordination</h3>
<p>Strong short-term rentals run on fast, accurate communication—before arrival, at check-in, and during the stay. That includes platform messaging, access coordination, and resolving issues without unnecessary back-and-forth with the owner.</p>
<h3>Turnovers and housekeeping</h3>
<p>Beach markets mean sand, humidity, and tight changeover windows. Management is not only “cleaning,” but a schedule with quality checks, supplies, and consistency—because guest reviews punish variability.</p>
<h3>Pricing and calendar strategy</h3>
<p>Dynamic pricing is a discipline: seasonality, local demand, minimum stays, and your goals (maximum revenue vs. balanced wear). A good manager aligns tactics with how you want the home used—not a one-size-fits-all rule.</p>
<h3>Maintenance triage</h3>
<p>Not every issue needs a contractor. A local team filters noise, handles small fixes, and escalates real problems with context and urgency.</p>
<h2>Why the Riviera Maya is its own playbook</h2>
<p>High tourism flow can mean faster response expectations and more operational moving parts (pools, AC, beach access). Bilingual expectations are also normal: guests may message in English while vendors work primarily in Spanish.</p>
<h2>Regulations, buildings, and HOAs</h2>
<p>Rules can vary by zone, building, and use. Practical management means aligning with what applies to your property and your community rules—confirm specifics with qualified local counsel or your administrator when something is unclear.</p>
<h2>What owners should expect from reporting</h2>
<p>You’ll want a clear rhythm for statements, fees, and payouts—without chasing numbers across multiple platforms.</p>
<div class="wp-block-group ps-inline-cta" data-ps-inline-cta="1"></div>
<h2>Closing thought</h2>
<p>Management here is less about a single “secret tactic” and more about disciplined operations in a high-expectation guest environment.</p>
<p><strong>Next step:</strong> If you want a grounded look at revenue potential and how operations would work for your home, <a href="/list-your-property/">request a free estimate</a>—no pressure, no jargon pile-ons.</p>
`.trim(),
  }),
  basePost({
    id: 9100002,
    slug: 'best-areas-own-rental-property-playa-del-carmen',
    date: '2026-02-02T14:00:00',
    title: 'Best Areas to Own a Rental Property in Playa del Carmen',
    excerptHtml:
      'A practical way to think about Playa del Carmen’s micro-markets—beach corridor, downtown energy, gated communities, and tradeoffs owners overlook.',
    seoTitle: 'Best Areas to Own a Rental in Playa del Carmen (Owner Guide) | PlayaStays',
    seoDesc:
      'Explore Playa del Carmen rental areas: what drives demand, operational tradeoffs, and how to choose a zone that matches your goals.',
    heroAlt: 'Coastal cityscape and ocean horizon',
    contentHtml: `
<h2>There isn’t one “best” zone—there’s a best fit</h2>
<p>“Best area” depends on what you’re optimizing: nightly rate, occupancy, ease of operations, HOA friction, or resale liquidity. Playa del Carmen is several micro-markets stitched together—use this as a map, not a guarantee.</p>
<h3>The beach corridor</h3>
<p>Proximity to sand and views still drives willingness-to-pay for shorter stays. The tradeoff is often higher wear, more vendor coordination, and sometimes stricter building rules. Beachfront can mean higher gross revenue with higher operating attention.</p>
<h3>Downtown and walkable zones</h3>
<p>Restaurants, services, and “city vacation” guests can be strong for shorter trips. Noise and variability by block are real—validate with local visits, not listing photos alone.</p>
<h3>Gated communities</h3>
<p>Clearer norms, security presence, and amenities can support consistency. Rental rules vary sharply by HOA—what’s allowed in one phase may not be allowed next door.</p>
<h3>Newer inventory and growth corridors</h3>
<p>New supply can mean modern amenities and strong marketing angles—but also competition and a ramp period. Underwrite conservatively and separate “beautiful product” from proven demand at your price point.</p>
<h2>Decision frame (simple)</h2>
<ul>
<li><strong>Guest type:</strong> families, groups, and remote workers prioritize different things.</li>
<li><strong>Operations:</strong> distance from service corridors affects cost and time if you self-manage.</li>
<li><strong>Professional help:</strong> tax, legal structure, and HOA interpretation deserve real advisors—not comment threads.</li>
</ul>
<div class="wp-block-group ps-inline-cta" data-ps-inline-cta="1"></div>
<p><strong>Want numbers for a specific neighborhood?</strong> <a href="/list-your-property/">Get a free revenue estimate</a> and we’ll talk candidly about what’s realistic.</p>
`.trim(),
  }),
  basePost({
    id: 9100003,
    slug: 'short-term-vs-long-term-rentals-riviera-maya',
    date: '2026-02-01T14:00:00',
    title: 'Short-Term vs. Long-Term Rentals in the Riviera Maya: How to Choose What Fits',
    excerptHtml:
      'Compare vacation (STR) and long-term strategies: cash-flow rhythm, workload, furnishing, tenant expectations, and when each approach makes sense.',
    seoTitle: 'Short-Term vs. Long-Term Rentals in the Riviera Maya | PlayaStays',
    seoDesc:
      'Compare short-term and long-term rental strategies in the Riviera Maya: income patterns, operations, and how to pick what fits your property and lifestyle.',
    heroAlt: 'Bright tropical interior with natural light',
    contentHtml: `
<h2>Short-term rentals (STR): the real workload</h2>
<p>STR can offer higher revenue potential in strong tourism seasons—but income is more variable. Operations are continuous: turnovers, guest messaging, and standards guests expect from a turnkey stay.</p>
<h3>What STR usually requires</h3>
<p>Strong Wi‑Fi, reliable AC, a well-equipped kitchen, and clear house rules. Professional management often pays for itself in time and consistency.</p>
<h2>Long-term rentals: predictability with different tradeoffs</h2>
<p>Monthly tenants can smooth cash flow and reduce turnover frequency. The emphasis shifts to screening, lease clarity, and a different maintenance pattern.</p>
<h2>Tradeoffs owners overlook</h2>
<ul>
<li><strong>Time vs. money:</strong> STR can gross more in peak windows but costs more in attention—yours or your manager’s.</li>
<li><strong>Wear patterns:</strong> frequent guest turnover vs. longer occupancy create different kinds of wear.</li>
<li><strong>Flexibility:</strong> STR can preserve more owner-calendar flexibility—when rules and operations allow it.</li>
</ul>
<h2>Regulations and community rules</h2>
<p>What’s permitted depends on your specific property, zone, and building. Treat compliance as a property-specific question.</p>
<div class="wp-block-group ps-inline-cta" data-ps-inline-cta="1"></div>
<h2>Closing</h2>
<p>The best strategy is the one that matches your numbers <em>and</em> your lifestyle. Start with honest underwriting, then build the operating plan that makes the strategy sustainable.</p>
<p><a href="/list-your-property/">Get a free revenue estimate</a> if you want a local team to map what’s realistic for your home.</p>
`.trim(),
  }),
  basePost({
    id: 9100004,
    slug: 'how-to-register-your-short-term-rental-in-quintana-roo',
    date: '2026-04-10T12:00:00',
    title: 'How to Register Your Short-Term Rental in Quintana Roo',
    excerptHtml: 'A Practical RETUR-Q Guide for Playa del Carmen Owners',
    seoTitle:
      'How to Register Your Short-Term Rental in Quintana Roo (RETUR-Q Guide) | PlayaStays',
    seoDesc:
      'RETUR-Q registration for Playa del Carmen owners: what to prepare, official links, step-by-step portal workflow, timing, costs, and common mistakes—verify details with agencies.',
    heroAlt: 'Playa del Carmen coastline and rooftops, Quintana Roo',
    heroSrc: BLOG_HERO_JPG,
    contentHtml: RETUR_Q_ARTICLE_BODY_HTML,
  }),
]

export function buildPreviewBlogPosts(topicTerms: WpTerm[], areaTerms: WpTerm[]): BlogPost[] {
  const areaId = termId(areaTerms, AREA_SLUG)
  return POSTS.map((post, i) => {
    const topicSlug = TOPIC_SLUGS[i]
    const tId = topicSlug ? termId(topicTerms, topicSlug) : undefined
    return {
      ...post,
      ps_blog_topic: tId != null ? [tId] : [],
      ps_blog_area: areaId != null ? [areaId] : [],
    }
  })
}

export function getPreviewPostBySlug(
  slug: string,
  topicTerms: WpTerm[],
  areaTerms: WpTerm[],
): BlogPost | null {
  return buildPreviewBlogPosts(topicTerms, areaTerms).find(p => p.slug === slug) ?? null
}

/**
 * Merge preview drafts with WordPress results. WordPress wins on slug collision.
 * Sorted by date descending (newest first) for hub featured card behavior.
 */
export function mergeBlogPreviewDrafts(
  wpPosts: BlogPost[],
  topicTerms: WpTerm[],
  areaTerms: WpTerm[],
): BlogPost[] {
  const preview = buildPreviewBlogPosts(topicTerms, areaTerms)
  const bySlug = new Map<string, BlogPost>()
  for (const p of preview) bySlug.set(p.slug, p)
  for (const p of wpPosts) bySlug.set(p.slug, p)
  return Array.from(bySlug.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

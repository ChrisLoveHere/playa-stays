# PlayaStays — content ownership & minimum publishable standard

This document is the **governance** layer for the intentional **hybrid** model: WordPress (dynamic/editor) + in-repo (strategic/controlled). It does **not** require merging the two into one system.

---

## 1. Ownership policy

### A. Repo-owned (SYSTEM 2 — `src/content/`, `src/lib` strategic modules, static routes)

| Group | Rule |
|--------|------|
| **Flagship city × service (bespoke)** | Pillar pages that require editorial control, legal precision, and stable URLs **without** daily CMS edits. **Current:** `playa-del-carmen` + `property-management` / `airbnb-management` via `PlayaDelCarmen*` templates + `src/content/service-pages/`. **Future:** same pattern for tier-1 markets (e.g. Tulum) when you clone the pattern. |
| **Service hubs (Riviera-wide)** | `src/content/service-hubs/` — definition-level copy, hero images, hub narrative. |
| **City hub fallbacks** | `src/content/city-hubs/fallback.ts`, registry patches (`playa-del-carmen.ts`) — when WP is thin or for consistent structure. |
| **Pricing framework** | `src/lib/pricing-data.ts`, `src/lib/calculator-data.ts` — fee tiers, market tables, earnings examples. |
| **Legal / high-trust static** | `app/terms`, `app/privacy`, `app/about`, etc. — prose lives in `page.tsx` (or you may later move only **body** to WP; URLs stay in Next). |
| **Homepage core positioning (current)** | `HomepageTemplate` + `getCities` / `getServices` from WP for data; **structural and fallback** copy in template + i18n. |
| **i18n marketing strings** | `src/lib/i18n.ts` — UI, nav, and repeated marketing phrases. |
| **Neighborhood / building lists** | `src/lib/location-data.ts`, `location-buildings-extra.ts` — structured geography for admin, maps, and filters. |
| **Default SEO for generic shells** | `src/lib/seo.ts` + `src/lib/service-page-fallbacks.ts` — **defaults only** when WP fields are empty; WP always wins when set. |
| **Amenity labels** | `src/lib/amenity-taxonomy.ts` (and mirrored checkboxes in WP plugin for admin). |

### B. WordPress-owned (SYSTEM 1)

| Group | Rule |
|--------|------|
| **Generic city × service pages** | Each `ps_service` per `ps_city_tag` — **title, excerpt, content,** `ps_hero_*`, `ps_seo_*`, Spanish fields when available. This is the default shell for all non-bespoke pairs. |
| **City hubs (primary copy)** | `ps_city` posts — market notes, stats, SEO, EN/ES. Repo fallbacks **supplement** when fields are empty. |
| **FAQs** | `ps_faq` — prefer real editorial FAQs in WP. **Next.js pads** to a minimum count with **generic** Q&A when fewer than 4 (owner-intent services) so shells never look empty. |
| **Testimonials** | `ps_testimonial` — all real quotes in WP. |
| **Blog** | `post` + taxonomies — source of truth is WP; optional `blog-preview` in repo for **dev** only. |
| **Properties** | `ps_property` / REST `properties` — listings, gallery, rates, `ps_city`. |
| **Site config** | `/wp/v2/settings` (phone, trust stats, address) with Next normalizing use. |

### C. SEO metadata

- **Bespoke** routes (e.g. PDC Airbnb) may override in `generateMetadata` via repo constants.
- **Generic** EN: `serviceMetadata()` — WP `ps_seo_title` / `ps_seo_desc` first; else **template defaults** in `seo.ts` + `service-page-fallbacks.ts`.
- **Generic** ES: prefer WP `ps_seo_title_es`, `ps_seo_desc_es`, hero ES fields; if missing, use **scripted fallbacks** (see `es/[slug]/[servicio]/page.tsx`) so pages are not stuck `noindex` with empty SERP text.

### D. Intentional overlap

- Repo **must not** duplicate full WP posts for every city. It **should** provide **baselines, fallbacks, and flagship exceptions** (PDC today; Tulum tomorrow if you add `src/content/service-pages/tulum-*.ts` and route branches similar to PDC).

---

## 2. Bespoke vs generic (current)

| Page / pattern | Bespoke (repo) | Generic (WP shell) | Mixed |
|----------------|----------------|----------------------|--------|
| **PDC property management** | **Yes** — `PlayaDelCarmenPropertyManagement` + `playa-del-carmen-property-management` content. | n/a (replaced) | — |
| **PDC Airbnb management** | **Yes** — `PlayaDelCarmenAirbnbManagement` + content module; SEO override in route. | n/a | — |
| **Tulum PM / Tulum Airbnb** | **No** (same as other cities) | **Yes** — `ServicePageTemplate` + `ps_service` for Tulum. | **Mixed quality** = WP content depth; **template fallbacks** now fill gaps. |
| **Other cities × services** | **No** | **Yes** | **Mixed** = same as Tulum. |
| **City hubs** (`/[slug]`) | **Partial** — `CityHubTemplate` + `getCityHubMergedContent` (repo fallbacks) + **WP** city. | n/a | **Yes** |
| **Pricing (global + city cost)** | **Repo** `pricing-data` + `PricingTemplate` | **WP** optional for edge cases; mostly static framework. | **Yes** |
| **About, Terms, Privacy** | **Repo** `page.tsx` prose | n/a | — |
| **Homepage** | **Template** + **WP** data (cities, services, posts, etc.) | — | **Yes** |

**Sparse / launch risk (before this pass):** any generic city×service with **no** hero meta, **no** body, **&lt;4 FAQs** — looked empty. **After this pass:** template provides **subhead, banner copy, description meta, and FAQ padding** so the shell is always **competent** (not flagship-grade).

---

## 3. Minimum publishable standard (MPS) — generic WP city × service

For **non-bespoke** `ServicePageTemplate` routes, **launch** means:

1. **H1** — from WP title + city context (existing); fallback headline when hero meta missing (`${service} in ${city}` pattern).
2. **Hero subhead** — WP `ps_hero_subheadline` or excerpt; else **one-sentence** template subhead in EN/ES.
3. **Meta title / description** — WP SEO fields; else **defaults** in `serviceMetadata` / ES `generateMetadata`.
4. **2–3 short intro ideas** — “Why it matters here” + optional WP Gutenberg block; if body thin, **local relevance** sentence still present.
5. **Service-specific value** — PM/AM: steps + “Why it matters” + optional pricing; guest intents: first section uses content or `ps_market_note`.
6. **4–6 FAQs** — **WP first**; if &lt;4, **repo generic FAQs** append (not replacing editorial).
7. **CTA** — estimate for owner-intent, rentals browse for guest-intent (existing logic).

Bespoke (PDC) pages are **exempt** from padding and remain **higher** bar by design.

---

## 4. Audit (template-level weaknesses addressed)

| Issue | Mitigation in code |
|--------|---------------------|
| ES pages had **noindex** + thin meta when `ps_seo_title_es` missing | **Indexed** fallbacks with generated ES title/description from service + city + i18n service labels. |
| `ownerBanner` showed **undefined** when `ps_avg_monthly_income` empty | **Conditional** copy without income. |
| **&lt;4 FAQs** on generic owner pages | **padServicePageFaqs** merges WP + generic Q&A. |
| Service meta **description** sometimes one line | **defaultServiceDescription** in `service-page-fallbacks` + `serviceMetadata` uses it. |

---

## 5. Next bespoke candidates (practical)

1. **Tulum + property-management** — largest revenue market after PDC; clone PDC file structure + `ServicePageTemplate` branch (same as PDC) when editorial is ready.  
2. **Tulum + airbnb-management** — same.  
3. **City hub deep content for Tulum** — optional `src/content/city-hubs/tulum.ts` when market note blocks need more than WP.  
4. **Do not** bespoke every city; keep **MPS** for long tail.

---

## 6. What we did *not* do (by design)

- No full migration of repo pricing into WP.  
- No removal of PDC components.  
- No single “one CMS for everything” rewrite.

# UI style spec — Footer, pricing FAQ, tokens

Spec derived from the **PlayaStays Next.js** implementation in `src/styles/globals.css`, `src/app/layout.tsx`, and the property management pricing pages. Use this to align Figma, emails, and other surfaces with the live site.

---

## 1. Color tokens (CSS variables)

| Token | Hex | Use |
|--------|-----|-----|
| `--deep` | `#0A2B2F` | Primary dark “brand blue” / hero, dark bands, `OwnerBanner` card, **pricing FAQ section background** |
| `--teal` | `#186870` | Brand green-teal: links, focus accents, **footer section labels (SERVICES, etc.)**, **copyright & legal** |
| `--teal-mid` | `#27868E` | Hover for teal-on-teal or teal links (e.g. map link, legal links) |
| `--sand` | `#F0EAD8` | **Footer background** (same family as **nav link hover** / active state in header) |
| `--sand-dark` | `#DDD1B6` | Dividers, subtle borders (e.g. footer rule, social pill border) |
| `--white` | `#FFFFFF` | Cards, text on dark |
| `--charcoal` | `#1A2326` | Body emphasis on light backgrounds; **default FAQ card question text** |
| `--mid` | `#4A5A60` | Secondary text (e.g. footer link list, support copy) |
| `--light` | `#8A9AA0` | Tertiary (e.g. **footer address** only; not the legal line anymore) |
| `--border` | `#DDD5BE` | **FAQ card** borders in grid mode |
| `--gold` | `#C8A44A` | CTAs, nav accents (unchanged in this workstream) |

**Utility classes** (in `globals.css`): `.bg-deep`, `.bg-sand`, `.bg-white`, `.bg-gold`, `.bg-ivory`, `.bg-teal` (teal = `--teal` mid; use `--deep` when matching hero / owner CTA “blue”).

---

## 2. Typography (site-wide)

| Role | Family | Weights loaded |
|------|--------|----------------|
| **Display** | Cormorant Garamond (`--font-display`) | 300–700 + italic |
| **Body / UI** | DM Sans (`--font-body`) | 300–700 (700 added for **footer column titles**) |

**Rule of thumb**

- **Headlines / wordmarks:** display serif, often `var(--deep)` on light sand.
- **UI labels, links, FAQ body:** sans; link color is usually `var(--mid)` with **`var(--teal)`** on hover unless specified below.

---

## 3. Footer

### 3.1 Section surface

- **Background:** `var(--sand)` — aligns with the **tan interaction color** in the header (not the white bar itself).
- **Default text color on the section:** `var(--charcoal)` (inherited; most type uses scoped rules below).
- **Main horizontal rule (above bottom bar):** `1px solid var(--sand-dark)`.

### 3.2 Brand block (left column)

| Element | Spec |
|--------|------|
| **“PlayaStays” (`.footer-logo`)** | Cormorant, **`clamp(2.2rem, 4vw, 3rem)`**, weight **700**, color **`var(--deep)`**, tight line-height **~1.08** |
| **Tagline** | `0.79rem`, **`var(--mid)`** |
| **Primary “Contact →”** (`.footer-contact-page-link`) | `0.91rem`, weight **500**, **`var(--mid)`**, hover **`var(--teal)`** (same treatment as other nav links; not a “green button”) |
| **Phone / email / WhatsApp (`.footer-contact`)** | `0.86rem`, **`var(--mid)`**, hover **`var(--teal)`**; icon **14px**, **`var(--teal)`** |
| **Address** | `0.72rem`, **`var(--light)`** (stays de-emphasized) |
| **Map / directions (`.footer-maplink`)** | `0.8rem`, weight **600**, **`var(--teal)`**, hover **`var(--teal-mid)`** |
| **Social pills** | 30×30, **`var(--white)`** fill, **1px `var(--sand-dark)`** border, text **`var(--mid)`**; hover: fill + border **`var(--teal)`**, text **`var(--white)`** |

### 3.3 Column titles — Services, Locations, Company (`.footer-col h5`)

- **Color:** **`var(--teal)`** (same green as section headers elsewhere).
- **Type:** DM Sans, **`clamp(1.02rem, 1.55vw, 1.22rem)`**, weight **700**, uppercase, **`letter-spacing: 0.08em`**, `margin-bottom: ~18px`.
- All three columns use **one style**; no “highlight” color on individual links in the list (list links are neutral, hover teal).

### 3.4 Column links (`.footer-links a`)

- **`0.88rem`**, **`var(--mid)`**, **`line-height: 1.45`**, hover **`var(--teal)`**.

### 3.5 Bottom bar — copyright & legal (`.footer-copy`, `.footer-legal a`)

- **Both use `var(--teal)`** to match the column titles (not gray).
- Copyright: `0.72rem`.
- Legal links: `0.8rem`, hover **`var(--teal-mid)`**.

### 3.6 Layout (`.footer-grid`)

- **Desktop:** `1.7fr` + three `1fr` columns; **gap 36px**; **`align-items: start`** so the three **column titles** share the same baseline (avoids misalignment from vertically centering columns with different link counts).
- **≤768px:** first column **full width** (`grid-column: 1 / -1`); next row is **3 equal columns** (Services | Locations | Company) so **titles line up in one row**.
- **≤480px:** single column; reset `grid-column` on the first child so stacking is normal.

---

## 4. Property management pricing — FAQ block

**Pages (EN/ES):** `property-management-pricing`, `es/precios-administracion-propiedades`.

| Layer | Spec |
|--------|------|
| **Section** | `pad-lg bg-deep pricing-faq-section` — **background `var(--deep)`** (same as **page hero** and **`.owner-banner`** inner card, not the mid `bg-teal` utility) |
| **Title (“Pricing FAQ” / ES equivalent)** | Centered, **`var(--white)`**, `text-align: center`, light `text-shadow` (see `.pricing-faq-section .faq-section-title`) — **no** eyebrow line |
| **Container max width** | `900px` (wider than the old 720 to fit the two-column card FAQ) |
| **Accordion “cards” (`.faq-list--grid .faq-item`)** | **White** surface, **`1px var(--border)`**, **`var(--r-lg)`** radius, light shadow `0 2px 14px rgba(10,43,47,0.08)` |
| **Question row** | `clamp(0.92rem, 1.1vw, 1.02rem)`, **`var(--charcoal)`**, generous padding; **+ / −** in **32px** circle, teal outline, filled teal when open |
| **Answer** | `clamp(0.9rem, 1vw, 0.98rem)`, **`var(--mid)`**; links **underline**, **`var(--teal)`** |
| **Grid** | 2 columns; **gap** ~14px / 22px; **≤700px** stacks to one column with same gap |
| **Initial state** | `initialOpenIndex={null}` (all closed on load) for this page only |

**Contrast rule:** On **`--deep`**, use **white** for the main FAQ title. **White cards** on deep carry **charcoal** / **mid** for text so readability matches the rest of the site (not light gray on white).

---

## 5. Quick “when to use which”

| Surface | Background | Primary text / heading | Notes |
|---------|------------|------------------------|--------|
| Header bar | `white` | `mid` / `gold` triggers | Unchanged; **sand** is for **hover** states only |
| Dark band (hero, owner card, CTA strip) | `deep` | `white` / rgba white for subcopy | |
| **Pricing FAQ** | `deep` | Title **white**; **card** content **charcoal / mid** | Cards are **not** `sand` or `deep`—they are **`white`**. |
| **Footer** | `sand` | Logo **`deep`**, link lists **`mid`**, section titles + legal + **©** **`teal`** | “Tan” in conversation = **`sand`**, not the header’s white bar |

---

## 6. File map (for dev / design handoff)

| Area | File(s) |
|------|--------|
| Tokens & footer & FAQ card styles | `src/styles/globals.css` |
| Font weights (incl. DM Sans 700) | `src/app/layout.tsx` |
| Pricing FAQ section markup | `src/app/property-management-pricing/page.tsx`, `src/app/es/precios-administracion-propiedades/page.tsx` |
| FAQ component API | `src/components/content/FaqAccordion.tsx` |
| Footer markup | `src/components/layout/Footer.tsx` |

---

## 7. Screenshot / QA

- **Full-page local capture:** `playastays-nextjs/screenshots/footer-site-home-full.png` (run `npm run dev`, then e.g. `npx playwright screenshot "http://127.0.0.1:3010/" screenshots/home.png --full-page` if Playwright is installed).

---

*Last updated to match the repo implementation; adjust this doc if tokens change in `:root`.*

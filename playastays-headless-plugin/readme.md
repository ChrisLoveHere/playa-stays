# PlayaStays Headless (WordPress plugin)

Standalone WordPress plugin source for the PlayaStays headless CMS backend. Intended to back the existing Next.js frontend via the REST API. **This folder does not depend on the Next.js app.**

## Status

**Scaffold only (v0.1.0).** Post types, taxonomies, sample meta, placeholder REST computed fields, options registration pattern, and a stub lead endpoint are in place. Business logic, full meta coverage, admin UI, email/CRM integration, and production hardening are **not** implemented yet.

## Layout

| File | Role |
|------|------|
| `playastays-headless.php` | Plugin header, constants, `require_once` of includes, `init` for CPTs/taxonomies/meta, `admin_init` for `register_setting`. |
| `includes/helpers.php` | Minimal shared helpers (e.g. string sanitize). |
| `includes/settings.php` | Option key, defaults (phone, WhatsApp, email, address, trust stats, social placeholders), `register_setting` + sanitize callback (invoked from `admin_init`). No settings screen yet. |
| `includes/post-types.php` | Registers `ps_city`, `ps_service`, `ps_faq`, `ps_testimonial`, `properties` with `show_in_rest => true`. |
| `includes/taxonomies.php` | Registers `ps_city_tag` on services/FAQs/testimonials/properties for city-scoped tagging. |
| `includes/meta.php` | Registers example post meta with `show_in_rest` (market notes, service slug, hero headlines, FAQ answers). |
| `includes/rest-fields.php` | Registers placeholder `ps_computed` REST fields on `ps_city`, `ps_service`, `properties` (returns stub objects). Hooks `rest_api_init`. |
| `includes/leads.php` | Registers `POST /wp-json/playastays/v1/submit-lead` with a success placeholder response. Hooks `rest_api_init`. |

## Installation (later)

1. Copy `playastays-headless-plugin` into `wp-content/plugins/`.
2. Activate **PlayaStays Headless** in WP Admin → Plugins.

## Next implementation steps

1. Align CPT/taxonomy/meta slugs with any existing production content (avoid duplicate registrations).
2. Flesh out `register_post_meta` for all fields the Next app expects (SEO, property attributes, etc.).
3. Implement `ps_computed` resolvers (images, permalinks, related IDs).
4. Add a read-only or authenticated REST route for `playastays_headless_settings` (or `show_in_rest` strategy) for site config.
5. Implement lead validation, storage, spam/rate limiting, and optional `wp_mail`/webhook.
6. Add a minimal Settings admin page using the registered option group `playastays_headless`.
7. Review `permission_callback` and meta `auth_callback` for least privilege before production.

## License / usage

Internal PlayaStays project; adjust license as needed.

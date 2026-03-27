// ============================================================
// BlogPostTemplate — server component
// Used by: app/blog/[slug]/page.tsx
// ============================================================

import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/types'
import type { Locale } from '@/lib/i18n'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { OwnerBanner, CtaStrip, InternalLinks } from '@/components/sections'
import { LeadForm } from '@/components/forms/LeadForm'
import { EsBlogCard } from '@/components/content/Cards'

interface BlogPostTemplateProps {
  post:         BlogPost
  relatedPosts: BlogPost[]
  locale?:      Locale
}

export function BlogPostTemplate({ post, relatedPosts, locale = 'en' }: BlogPostTemplateProps) {
  const isEs    = locale === 'es'
  const image   = post._embedded?.['wp:featuredmedia']?.[0]
  const author  = post._embedded?.author?.[0]

  const title   = isEs && post.meta.ps_title_es   ? post.meta.ps_title_es   : post.title.rendered
  const content = isEs && post.meta.ps_content_es ? post.meta.ps_content_es : post.content.rendered

  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const blogHref     = isEs ? '/es/blog/' : '/blog/'

  const dateStr = new Date(post.date).toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      {/* HERO — full-bleed featured image */}
      <section style={{
        position: 'relative',
        minHeight: 400,
        background: image?.source_url
          ? `url(${image.source_url}) center/cover no-repeat`
          : 'var(--deep)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,43,47,0.95) 0%, rgba(10,43,47,0.4) 60%, transparent 100%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 40 }}>
          <Breadcrumb crumbs={[
            { label: isEs ? 'Inicio' : 'Home', href: isEs ? '/es/' : '/' },
            { label: 'Blog', href: blogHref },
            { label: title, href: null },
          ]} />
          <div className="eyebrow" style={{ color: 'var(--gold)', marginTop: 8 }}>
            {isEs ? 'Información para Propietarios' : 'Owner Insights'}
          </div>
          <h1 className="page-title" style={{ marginTop: 8, maxWidth: 680 }}>
            {title}
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            {author && <span>By {author.name}</span>}
            <span>{dateStr}</span>
          </div>
        </div>
      </section>

      {/* ARTICLE + SIDEBAR */}
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 56,
        padding: '56px 24px',
        alignItems: 'start',
      }}>
        {/* Article */}
        <article>
          {/* Inline CTA after intro — contextual, owner-intent */}
          <div
            className="wp-content"
            style={{ fontSize: '0.94rem', color: 'var(--mid)', lineHeight: 1.82 }}
            dangerouslySetInnerHTML={{ __html: injectInlineCta(content, isEs) }}
          />

          {/* End-of-article owner banner */}
          <div style={{
            marginTop: 48, padding: '28px 32px',
            background: 'var(--deep)', borderRadius: 'var(--r-lg)',
            border: '1px solid rgba(200,164,74,0.2)',
          }}>
            <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 10 }}>
              {isEs ? '¿Pensando en rentar tu propiedad?' : 'Thinking about renting your property?'}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--white)', marginBottom: 12, lineHeight: 1.25 }}>
              {isEs ? 'Descubre cuánto podría ganar tu propiedad con PlayaStays' : 'Find out what your property could earn with PlayaStays'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: 20, lineHeight: 1.65 }}>
              {isEs ? 'Estimado gratis basado en datos reales de nuestro portafolio.' : 'Free revenue estimate. Based on real market data from our managed portfolio.'}
            </p>
            <Link href={estimateHref} className="btn btn-gold">
              {isEs ? 'Obtener mi estimado gratis →' : 'Get My Free Estimate →'}
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Sidebar lead form */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-lg)', padding: 28, border: '1px solid var(--sand-dark)', boxShadow: 'var(--sh-sm)' }}>
            <div className="eyebrow mb-8">{isEs ? 'Estimado de Ingresos Gratis' : 'Free Revenue Estimate'}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 12 }}>
              {isEs ? '¿Tienes una propiedad en la Riviera Maya?' : 'Own a property in the Riviera Maya?'}
            </h3>
            <LeadForm
              variant="light"
              source={`blog-${post.slug}`}
              locale={locale}
              title={undefined}
              subtitle={undefined}
            />
          </div>

          {/* Internal links */}
          <InternalLinks
            heading="Related Services"
            links={[
              { label: 'Property Management — Playa del Carmen', href: '/playa-del-carmen/property-management/' },
              { label: 'Airbnb Management — Tulum',              href: '/tulum/airbnb-management/' },
              { label: 'Investment Property Guide',              href: '/playa-del-carmen/investment-property/' },
              { label: 'Free Revenue Estimate',                  href: '/list-your-property/' },
            ]}
          />
        </aside>
      </div>

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="pad-lg bg-sand">
          <div className="container">
            <div className="eyebrow mb-8">{isEs ? 'Seguir leyendo' : 'Keep Reading'}</div>
            <h2 className="section-title mt-12 mb-40" style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)' }}>
              {isEs ? 'Más artículos para propietarios' : 'More Owner Insights'}
            </h2>
            <div className="blog-grid">
              {relatedPosts.slice(0, 3).map(p => <EsBlogCard key={p.id} post={p} locale={locale} />)}
            </div>
          </div>
        </section>
      )}

      {/* PRE-FOOTER CTA */}
      <CtaStrip
        eyebrow={isEs ? 'Administración de Propiedades PlayaStays' : 'PlayaStays Property Management'}
        headline={isEs ? 'Obtén un estimado de ingresos gratis — sin compromisos.' : 'Get a free rental income estimate — no commitment required.'}
        cta={{ label: isEs ? 'Obtener mi estimado →' : 'Get My Free Estimate →', href: estimateHref }}
      />
    </>
  )
}

// ── Inject inline CTA after first </p> in the article body ──
// This is safer than wrapping the entire Gutenberg HTML in JSX.
function injectInlineCta(html: string, isEs = false): string {
  const ctaHtml = `
    <div style="margin:28px 0;padding:18px 22px;background:var(--sand);border-radius:var(--r-md);border-left:3px solid var(--teal)">
      <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--teal);margin-bottom:6px">
        Property Management in Playa del Carmen
      </div>
      <p style="font-size:0.85rem;color:var(--mid);margin:0">
        PlayaStays manages vacation rental properties across Quintana Roo.
        <a href="/list-your-property/" style="color:var(--teal);font-weight:600;margin-left:4px">
          Get a free revenue estimate →
        </a>
      </p>
    </div>
  `
  const insertPoint = html.indexOf('</p>')
  if (insertPoint === -1) return html
  return html.slice(0, insertPoint + 4) + ctaHtml + html.slice(insertPoint + 4)
}

// ============================================================
// BlogPostTemplate — server component
// Used by: app/blog/[slug]/page.tsx, app/es/blog/[slug]/page.tsx
// ============================================================

import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/types'
import type { Locale } from '@/lib/i18n'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { EsBlogCard } from '@/components/content/Cards'
import { injectInlineCta, prepareBlogHtml } from '@/lib/blog-content'
import styles from './BlogPostTemplate.module.css'

interface BlogPostTemplateProps {
  post: BlogPost
  relatedPosts: BlogPost[]
  locale?: Locale
  /** When set (e.g. from WP topic taxonomy), replaces the static “Insights & Guides” pill. */
  tagPillLabel?: string | null
}

export function BlogPostTemplate({
  post,
  relatedPosts,
  locale = 'en',
  tagPillLabel,
}: BlogPostTemplateProps) {
  const isEs = locale === 'es'
  const image = post._embedded?.['wp:featuredmedia']?.[0]
  const author = post._embedded?.author?.[0]

  const title = isEs && post.meta.ps_title_es ? post.meta.ps_title_es : post.title.rendered
  const rawHtml = isEs && post.meta.ps_content_es ? post.meta.ps_content_es : post.content.rendered

  const deckSource = isEs && post.meta.ps_excerpt_es ? post.meta.ps_excerpt_es : post.excerpt.rendered
  const deck = deckSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

  const { html: htmlWithAnchors, toc } = prepareBlogHtml(rawHtml)
  const bodyHtml = injectInlineCta(htmlWithAnchors, isEs)

  const estimateHref = isEs ? '/es/publica-tu-propiedad/' : '/list-your-property/'
  const blogHref = isEs ? '/es/blog/' : '/blog/'

  const dateStr = new Date(post.date).toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const defaultTag = isEs ? 'Perspectivas y guías' : 'Insights & Guides'
  const tagLabel = tagPillLabel?.trim() || defaultTag
  const tocLabel = isEs ? 'En esta página' : 'On this page'
  const showToc = toc.length >= 2
  const titlePlain = title.replace(/<[^>]*>/g, '')

  return (
    <>
      <div
        className={`${styles.wrap} ps-chrome-pad-top`}
        style={{ backgroundColor: '#faf8f2', color: '#1a2326' }}
      >
        <header className={styles.articleHeader}>
          <div className={styles.articleHeaderInner}>
            <div className={styles.breadcrumbWrap}>
              <Breadcrumb
                variant="light"
                crumbs={[
                  { label: isEs ? 'Inicio' : 'Home', href: isEs ? '/es/' : '/' },
                  { label: 'Blog', href: blogHref },
                  { label: titlePlain, href: null },
                ]}
              />
            </div>
            <span className={styles.tagPill}>{tagLabel}</span>
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
            <div className={styles.meta}>
              {author?.name ? <span>{isEs ? 'Por ' : 'By '}{author.name}</span> : null}
              {author?.name ? <span className={styles.metaDot} aria-hidden>·</span> : null}
              <time dateTime={post.date}>{dateStr}</time>
            </div>
            {deck ? <p className={styles.deck}>{deck}</p> : null}
          </div>
        </header>

        <div className={styles.bodySection}>
          <div className={styles.articleWrap}>
            <article>
              {image?.source_url ? (
                <figure className={styles.articleFigure}>
                  <Image
                    src={image.source_url}
                    alt={image.alt_text?.trim() || titlePlain}
                    width={1200}
                    height={675}
                    className={styles.articleHeroImg}
                    sizes="(max-width: 768px) 100vw, 720px"
                    priority
                  />
                </figure>
              ) : null}
              {showToc ? (
                <nav className={styles.toc} aria-label={tocLabel}>
                  <p className={styles.tocTitle}>{tocLabel}</p>
                  <ul className={styles.tocList}>
                    {toc.map(item => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={
                            item.level === 3 ? `${styles.tocLink} ${styles.tocLinkL3}` : styles.tocLink
                          }
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <div
                className={`${styles.prose} wp-content article-prose`}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              <div className={styles.endBanner}>
                <div className={`eyebrow ${styles.endBannerEyebrow}`} style={{ color: 'var(--gold)' }}>
                  {isEs ? '¿Pensando en rentar tu propiedad?' : 'Thinking about renting your property?'}
                </div>
                <h3 className={styles.endBannerTitle}>
                  {isEs
                    ? 'Descubre cuánto podría ganar tu propiedad con PlayaStays'
                    : 'Find out what your property could earn with PlayaStays'}
                </h3>
                <p className={styles.endBannerText}>
                  {isEs
                    ? 'Estimado gratis basado en datos reales de nuestro portafolio.'
                    : 'Free revenue estimate. Based on real market data from our managed portfolio.'}
                </p>
                <Link href={estimateHref} className="btn btn-gold">
                  {isEs ? 'Obtener mi estimado gratis →' : 'Get My Free Estimate →'}
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 ? (
        <section className="pad-lg bg-ivory">
          <div className="container">
            <div className="eyebrow mb-8">{isEs ? 'Seguir leyendo' : 'Keep Reading'}</div>
            <h2 className="section-title mt-12 mb-28" style={{ fontSize: 'clamp(1.6rem,2.5vw,2.2rem)' }}>
              {isEs ? 'Más artículos para propietarios' : 'More Owner Insights'}
            </h2>
            <div className="blog-grid blog-grid--stretch">
              {relatedPosts.slice(0, 3).map(p => (
                <EsBlogCard key={p.id} post={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

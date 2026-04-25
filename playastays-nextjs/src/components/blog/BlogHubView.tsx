import type { BlogPost, WpTerm } from '@/types'
import type { Locale } from '@/lib/i18n'
import type { BreadcrumbItem } from '@/types'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { BlogHubToolbar } from './BlogHubToolbar'
import { BlogFeaturedCard } from './BlogFeaturedCard'
import { BlogHubFeedCard } from './BlogHubFeedCard'
import { buildBlogHubHref } from '@/lib/blog-hub-url'
import Link from 'next/link'
import styles from './BlogHub.module.css'

interface BlogHubViewProps {
  posts: BlogPost[]
  page: number
  locale: Locale
  breadcrumbs: BreadcrumbItem[]
  kicker: string
  title: string
  intro: string
  q: string
  topicSlug: string
  areaSlug: string
  topicTerms: WpTerm[]
  areaTerms: WpTerm[]
  hasTaxonomies: boolean
}

function hubFilterActive(q: string, topicSlug: string, areaSlug: string): boolean {
  return Boolean(q.trim() || topicSlug || areaSlug)
}

export function BlogHubView({
  posts,
  page,
  locale,
  breadcrumbs,
  kicker,
  title,
  intro,
  q,
  topicSlug,
  areaSlug,
  topicTerms,
  areaTerms,
  hasTaxonomies,
}: BlogHubViewProps) {
  let featured: BlogPost | null = null
  let gridPosts: BlogPost[] = []

  const filterActive = hubFilterActive(q, topicSlug, areaSlug)

  if (posts.length > 0) {
    if (filterActive) {
      featured = null
      gridPosts = posts
    } else if (page === 1) {
      featured = posts[0]
      gridPosts = posts.slice(1)
    } else {
      gridPosts = posts
    }
  }

  const emptyMsg =
    locale === 'es'
      ? 'Ningún artículo coincide con tu búsqueda. Ajusta filtros o términos de búsqueda.'
      : 'No articles match. Try different filters or search words.'
  const noPosts =
    locale === 'es' ? 'Aún no hay artículos. Vuelve pronto.' : 'No posts yet. Check back soon.'
  const hint =
    locale === 'es'
      ? 'Los filtros y la búsqueda usan el catálogo completo de artículos en WordPress.'
      : 'Filters and search run against the full blog archive in WordPress (not just one page).'
  const taxNote =
    locale === 'es'
      ? 'Asigna temas y zonas en WordPress (editor del artículo) para activar los filtros.'
      : 'Assign topics and areas in WordPress (post editor) to power these filters.'

  const showNext = posts.length === 9
  const showPrev = page > 1

  return (
    <div
      className={`${styles.page} ps-chrome-pad-top`}
      style={{ backgroundColor: '#faf8f2', color: '#1a2326' }}
    >
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.breadcrumbWrap}>
            <Breadcrumb variant="light" crumbs={breadcrumbs} />
          </div>
          <p className={styles.kicker}>{kicker}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.intro}>{intro}</p>
          <p style={{ marginTop: 14 }}>
            <Link href="#articles" className="btn btn-gold btn-sm">
              {locale === 'es' ? 'Ver últimos artículos' : 'Browse latest articles'}
            </Link>
          </p>

          {hasTaxonomies ? (
            <BlogHubToolbar
              locale={locale}
              q={q}
              topicSlug={topicSlug}
              areaSlug={areaSlug}
              topicTerms={topicTerms}
              areaTerms={areaTerms}
            />
          ) : (
            <p className={styles.taxMissing}>{taxNote}</p>
          )}
        </div>
      </header>

      <section
        id="articles"
        className={styles.main}
        aria-label={locale === 'es' ? 'Artículos' : 'Articles'}
      >
        <div className={styles.inner}>
          {posts.length === 0 ? (
            <p className={styles.empty}>{noPosts}</p>
          ) : (
            <>
              {featured ? (
                <BlogFeaturedCard
                  post={featured}
                  locale={locale}
                  topicTerms={topicTerms}
                  areaTerms={areaTerms}
                />
              ) : null}

              {gridPosts.length > 0 ? (
                <div className={styles.feed}>
                  {gridPosts.map(p => (
                    <BlogHubFeedCard
                      key={p.id}
                      post={p}
                      locale={locale}
                      topicTerms={topicTerms}
                      areaTerms={areaTerms}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.empty}>{emptyMsg}</p>
              )}

              {hasTaxonomies && posts.length > 0 ? <p className={styles.hint}>{hint}</p> : null}
            </>
          )}

          {posts.length > 0 ? (
            <div className={styles.pagination}>
              {showPrev ? (
                <Link
                  href={buildBlogHubHref({
                    locale,
                    q,
                    topic: topicSlug || null,
                    area: areaSlug || null,
                    page: page - 1,
                  })}
                  className="btn btn-ghost btn-sm"
                >
                  {locale === 'es' ? '← Anterior' : '← Previous'}
                </Link>
              ) : null}
              {showNext ? (
                <Link
                  href={buildBlogHubHref({
                    locale,
                    q,
                    topic: topicSlug || null,
                    area: areaSlug || null,
                    page: page + 1,
                  })}
                  className="btn btn-ghost btn-sm"
                >
                  {locale === 'es' ? 'Siguiente →' : 'Next →'}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

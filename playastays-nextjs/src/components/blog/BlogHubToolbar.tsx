import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import type { WpTerm } from '@/types'
import { blogHubPath, buildBlogHubHref } from '@/lib/blog-hub-url'
import {
  blogTermDisplayName,
  sortBlogAreaTermsForHub,
  sortBlogTopicTermsForHub,
} from '@/lib/blog-taxonomy-labels'
import styles from './BlogHub.module.css'

interface BlogHubToolbarProps {
  locale: Locale
  q: string
  topicSlug: string
  areaSlug: string
  topicTerms: WpTerm[]
  areaTerms: WpTerm[]
}

export function BlogHubToolbar({
  locale,
  q,
  topicSlug,
  areaSlug,
  topicTerms,
  areaTerms,
}: BlogHubToolbarProps) {
  const path = blogHubPath(locale)
  const searchLabel = locale === 'es' ? 'Buscar artículos' : 'Search articles'
  const searchPlaceholder = locale === 'es' ? 'Buscar artículos' : 'Search articles'
  const topicHeading = locale === 'es' ? 'Tema' : 'Topic'
  const areaHeading = locale === 'es' ? 'Zona' : 'Area'
  const anyTopic = locale === 'es' ? 'Cualquier tema' : 'Any topic'
  const anyArea = locale === 'es' ? 'Cualquier zona' : 'Any area'

  const topicsSorted = sortBlogTopicTermsForHub(topicTerms)
  const areasSorted = sortBlogAreaTermsForHub(areaTerms)

  return (
    <div className={styles.toolbar}>
      <form className={styles.toolbarForm} method="get" action={path}>
        <label className="sr-only" htmlFor="blog-hub-q">
          {searchLabel}
        </label>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M16.5 16.5 21 21"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            id="blog-hub-q"
            className={styles.searchInput}
            type="search"
            name="q"
            placeholder={searchPlaceholder}
            defaultValue={q}
            autoComplete="off"
          />
        </div>
        {topicSlug ? <input type="hidden" name="topic" value={topicSlug} /> : null}
        {areaSlug ? <input type="hidden" name="area" value={areaSlug} /> : null}
        <button type="submit" className="sr-only">
          {searchLabel}
        </button>
      </form>

      <div className={styles.filterBlock}>
        <p className={styles.filterLabel}>{topicHeading}</p>
        <div className={styles.chips} role="group" aria-label={topicHeading}>
          <Link
            href={buildBlogHubHref({ locale, q, topic: null, area: areaSlug || null })}
            className={`${styles.chip} ${!topicSlug ? styles.chipActive : ''}`}
          >
            {anyTopic}
          </Link>
          {topicsSorted.map(t => (
            <Link
              key={t.id}
              href={buildBlogHubHref({
                locale,
                q,
                topic: t.slug,
                area: areaSlug || null,
              })}
              className={`${styles.chip} ${topicSlug === t.slug ? styles.chipActive : ''}`}
            >
              {blogTermDisplayName(t, locale)}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.filterBlock}>
        <p className={styles.filterLabel}>{areaHeading}</p>
        <div className={styles.chips} role="group" aria-label={areaHeading}>
          <Link
            href={buildBlogHubHref({ locale, q, topic: topicSlug || null, area: null })}
            className={`${styles.chip} ${!areaSlug ? styles.chipActive : ''}`}
          >
            {anyArea}
          </Link>
          {areasSorted.map(t => (
            <Link
              key={t.id}
              href={buildBlogHubHref({
                locale,
                q,
                topic: topicSlug || null,
                area: t.slug,
              })}
              className={`${styles.chip} ${areaSlug === t.slug ? styles.chipActive : ''}`}
            >
              {blogTermDisplayName(t, locale)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

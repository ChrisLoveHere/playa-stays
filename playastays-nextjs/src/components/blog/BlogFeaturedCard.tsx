import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost, WpTerm } from '@/types'
import type { Locale } from '@/lib/i18n'
import { blogPostDisplayFields } from './blog-hub-display'
import { BLOG_HERO_JPG } from '@/lib/public-assets'
import styles from './BlogHub.module.css'

export function BlogFeaturedCard({
  post,
  locale,
  topicTerms,
  areaTerms,
}: {
  post: BlogPost
  locale: Locale
  topicTerms: WpTerm[]
  areaTerms: WpTerm[]
}) {
  const d = blogPostDisplayFields(post, locale, topicTerms, areaTerms)
  const read = locale === 'es' ? 'Leer artículo →' : 'Read article →'
  const hasImage = Boolean(d.img)

  return (
    <article className={styles.featured}>
      <Link href={d.href} className={styles.featuredLink}>
        <div className={styles.featuredGrid}>
          <div
            className={styles.featuredMedia}
            style={{ position: 'relative' }}
          >
            <Image
              src={d.img || BLOG_HERO_JPG}
              alt={d.img ? d.alt : ''}
              fill
              className={styles.featuredImg}
              sizes="(max-width:768px) 100vw, 55vw"
              priority
            />
            {hasImage ? (
              <div className={styles.featuredOverlay}>
                <span className={styles.featuredTagOnImage}>{d.tag}</span>
                <time className={styles.featuredTimeOnImage} dateTime={post.date}>
                  {d.dateStr}
                </time>
              </div>
            ) : null}
          </div>
          <div className={styles.featuredBody}>
            {!hasImage ? (
              <div className={styles.featuredMeta}>
                <span className={styles.featuredTag}>{d.tag}</span>
                <time dateTime={post.date}>{d.dateStr}</time>
              </div>
            ) : null}
            <h2
              className={styles.featuredTitle}
              dangerouslySetInnerHTML={{ __html: d.titleHtml }}
            />
            {d.subline ? <p className={styles.featuredAreaLine}>{d.subline}</p> : null}
            {d.excerptPlain ? <p className={styles.featuredDeck}>{d.excerptPlain}</p> : null}
            <span className={styles.featuredCta}>{read}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

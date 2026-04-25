import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost, WpTerm } from '@/types'
import type { Locale } from '@/lib/i18n'
import { BLOG_HERO_JPG } from '@/lib/public-assets'
import { blogPostDisplayFields } from './blog-hub-display'
import styles from './BlogHub.module.css'

export function BlogHubFeedCard({
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
  const imgSrc = d.img || BLOG_HERO_JPG

  return (
    <Link href={d.href} className={styles.feedCard}>
      <div
        className={styles.feedMedia}
        style={{ position: 'relative' }}
      >
        <Image
          src={imgSrc}
          alt={d.img ? d.alt : ''}
          fill
          className={styles.feedImg}
          sizes="(max-width:640px) 128px, (max-width:1099px) 190px, 45vw"
        />
      </div>
      <div className={styles.feedBody}>
        <span className={styles.feedTag}>{d.tag}</span>
        {d.subline ? <p className={styles.feedSubline}>{d.subline}</p> : null}
        <p className={styles.feedDate}>
          <time dateTime={post.date}>{d.dateStr}</time>
        </p>
        <h3 className={styles.feedTitle}>{d.titlePlain}</h3>
        {d.excerptPlain ? <p className={styles.feedExcerpt}>{d.excerptPlain}</p> : null}
      </div>
    </Link>
  )
}

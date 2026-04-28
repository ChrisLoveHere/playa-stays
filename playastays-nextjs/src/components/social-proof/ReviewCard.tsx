import Link from 'next/link'
import Image from 'next/image'
import styles from '@/components/home/HomeOwnerTestimonial.module.css'

export function ReviewCard({
  platform,
  reviewerName,
  reviewerPhotoSrc,
  rating,
  reviewText,
  reviewUrl,
  readMoreLabel,
}: {
  platform: 'google' | 'yelp'
  reviewerName: string
  reviewerPhotoSrc: string
  rating: 1 | 2 | 3 | 4 | 5
  reviewText: string
  reviewUrl: string
  readMoreLabel: string
}) {
  const lineBefore = platform === 'google' ? `${reviewerName} — ` : `${reviewerName} — `
  const clipped = reviewText.length > 250 ? `${reviewText.slice(0, 250).trim()}…` : reviewText
  return (
    <article className={styles.card}>
      <div className={styles.avatar} aria-hidden>
        <Image src={reviewerPhotoSrc} alt="" width={92} height={92} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className={styles.body}>
        <blockquote className={styles.quote}>
          &ldquo;{clipped}&rdquo;
        </blockquote>
        <p className={styles.attrib}>
          {lineBefore}
          <span style={{ color: 'rgba(255,255,255,0.84)', marginRight: 8 }}>{'★'.repeat(rating)}</span>
          <Link href={reviewUrl} target="_blank" rel="noopener noreferrer" className={styles.reviewLink}>
            {platform === 'google' ? 'Google' : 'Yelp'} · {readMoreLabel}
          </Link>
        </p>
      </div>
    </article>
  )
}

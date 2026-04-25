import type { SiteConfig } from '@/types'
import styles from './ContactPageLayout.module.css'

export interface ContactDirectLabels {
  eyebrow: string
  title: string
  whatsappTitle: string
  whatsappSub: string
  phoneSub: string
  emailSub: string
}

export function ContactDirectColumn({
  config,
  labels,
}: {
  config: SiteConfig
  labels: ContactDirectLabels
}) {
  return (
    <div>
      <div className="eyebrow mb-8">{labels.eyebrow}</div>
      <h2 className={styles.channelTitle}>{labels.title}</h2>
      <div className={styles.channelList}>
        <a
          href={`https://wa.me/${config.whatsapp}`}
          className={styles.channelCard}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.channelCardIcon} aria-hidden>
            💬
          </span>
          <div>
            <div className={styles.channelCardTitle}>{labels.whatsappTitle}</div>
            <div className={styles.channelCardSub}>{labels.whatsappSub}</div>
          </div>
        </a>
        <a href={`tel:${config.phone.replace(/\s/g, '')}`} className={styles.channelCard}>
          <span className={styles.channelCardIcon} aria-hidden>
            📞
          </span>
          <div>
            <div className={styles.channelCardTitle}>{config.phone}</div>
            <div className={styles.channelCardSub}>{labels.phoneSub}</div>
          </div>
        </a>
        <a href={`mailto:${config.email}`} className={styles.channelCard}>
          <span className={styles.channelCardIcon} aria-hidden>
            ✉️
          </span>
          <div>
            <div className={styles.channelCardTitle}>{config.email}</div>
            <div className={styles.channelCardSub}>{labels.emailSub}</div>
          </div>
        </a>
      </div>
    </div>
  )
}

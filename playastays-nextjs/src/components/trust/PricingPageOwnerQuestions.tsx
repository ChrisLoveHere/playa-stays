// ============================================================
// Wraps OwnerBanner on the pricing hub so it is not a second
// "footer" sand band — same component, separate page block.
// ============================================================

import { OwnerBanner } from '@/components/sections'
import type { CtaLink } from '@/types'
import styles from './PricingPageOwnerQuestions.module.css'

type Props = {
  eyebrow?: string
  headline: string
  body?: string
  primaryCta: CtaLink
  secondaryCta?: CtaLink
}

export function PricingPageOwnerQuestions({
  eyebrow,
  headline,
  body,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <div className={styles.region} id="pricing-owner-questions">
      <OwnerBanner
        eyebrow={eyebrow}
        headline={headline}
        body={body}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
    </div>
  )
}

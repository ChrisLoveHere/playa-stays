// ============================================================
// Top-level service hub pages — content model (EN + ES)
// ============================================================

import type { ServiceHubId } from '@/lib/service-hub-constants'

export type ServiceHubFaqItem = { question: string; answer: string }

export type ServiceHubLocaleCopy = {
  seo: { title: string; description: string }
  heroTag: string
  heroHeadline: string
  heroSub: string
  primaryCta: string
  secondaryCta: string
  whatEyebrow: string
  whatTitle: string
  whatBody: string[]
  includesEyebrow: string
  includesTitle: string
  includesLead: string
  includesItems: Array<{ title: string; desc: string; intro?: string; bullets?: string[]; photo?: string }>
  processEyebrow: string
  processTitle: string
  processLead: string
  processSteps: Array<{ title: string; desc: string }>
  whyEyebrow: string
  whyTitle: string
  whyLead: string
  whyItems: Array<{ title: string; desc: string }>
  citiesEyebrow: string
  citiesTitle: string
  citiesIntro: string
  relatedEyebrow: string
  relatedTitle: string
  relatedIntro: string
  addOnsEyebrow?: string
  addOnsTitle?: string
  addOnsIntro?: string
  addOnsItems?: Array<{ title: string; desc: string; bullets: string[]; cta: string; photo?: string }>
  addOnsNote?: string
  faqEyebrow: string
  faqTitle: string
  faqs: ServiceHubFaqItem[]
  finalEyebrow: string
  finalTitle: string
  finalSub: string
  formTitle: string
  formSubtitle: string
  /** Other hub ids for cross-links (3) */
  relatedHubIds: ServiceHubId[]
}

export type ServiceHubRegistry = Record<ServiceHubId, Record<'en' | 'es', ServiceHubLocaleCopy>>

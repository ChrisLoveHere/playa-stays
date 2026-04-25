// ============================================================
// FAQ — bilingual items for FaqAccordion (typed FAQMeta, no casts)
// ============================================================

import type { FAQ } from '@/types'
import type { Locale } from '@/lib/i18n'

export interface FaqAccordionItem {
  question: string
  answer: string
}

/**
 * Map WP FAQ posts to accordion items. For `locale === 'es'`, uses
 * `ps_question_es` / `ps_answer_es` when present; otherwise falls back
 * to title and `ps_answer`.
 */
/** Default cap for homepage, list-your-property, service hubs. */
export const PUBLIC_FAQ_LIMIT = 8

/** City hubs + city × service pages — keep FAQs tight. */
export const PUBLIC_FAQ_LIMIT_CITY = 6

export function limitPublicFaqs<T>(items: T[], max: number = PUBLIC_FAQ_LIMIT): T[] {
  return items.slice(0, max)
}

export function getBilingualFaqItems(faqs: FAQ[], locale: Locale): FaqAccordionItem[] {
  const isEs = locale === 'es'
  return faqs.map(f => {
    const m = f.meta
    const question = isEs && m.ps_question_es?.trim()
      ? m.ps_question_es.trim()
      : f.title.rendered
    const answer = isEs && m.ps_answer_es?.trim()
      ? m.ps_answer_es.trim()
      : m.ps_answer
    return { question, answer }
  })
}

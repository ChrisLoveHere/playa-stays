'use client'
// ============================================================
// FaqAccordion — client component (open/close state)
// ============================================================

import { useState } from 'react'
import type { FAQ } from '@/types'

interface FaqAccordionProps {
  items: Array<{ question: string; answer: string }>
  eyebrow?: string
  headline?: string
}

export function FaqAccordion({ items, eyebrow, headline }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div>
      {eyebrow  && <div className="eyebrow mb-8">{eyebrow}</div>}
      {headline && <h2 className="section-title mt-12 mb-40" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)' }}>{headline}</h2>}
      <div className="faq-list">
        {items.map((item, i) => (
          <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
            <button
              className="faq-q"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              aria-expanded={openIdx === i}
            >
              {item.question}
              <span className="faq-ico">{openIdx === i ? '−' : '+'}</span>
            </button>
            <div
              className="faq-a"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

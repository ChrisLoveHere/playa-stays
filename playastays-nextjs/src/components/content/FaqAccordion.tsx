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
  /**
   * Two columns (top-to-bottom in first column, then second), card-style; stacks to one column on small screens.
   */
  twoColumn?: boolean
  /** Which item starts open, or `null` for all closed. Default `0` (first open). */
  initialOpenIndex?: number | null
}

function FaqItemBlock({
  item,
  i,
  openIdx,
  setOpenIdx,
}: {
  item: { question: string; answer: string }
  i: number
  openIdx: number | null
  setOpenIdx: (n: number | null) => void
}) {
  const isOpen = openIdx === i
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button
        className="faq-q"
        type="button"
        onClick={() => setOpenIdx(isOpen ? null : i)}
        aria-expanded={isOpen}
      >
        {item.question}
        <span className="faq-ico" aria-hidden>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className="faq-a"
        dangerouslySetInnerHTML={{ __html: item.answer }}
      />
    </div>
  )
}

export function FaqAccordion({
  items,
  eyebrow,
  headline,
  twoColumn,
  initialOpenIndex = 0,
}: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(initialOpenIndex)
  const half = twoColumn ? Math.ceil(items.length / 2) : 0
  const leftColumn = twoColumn ? items.slice(0, half) : []
  const rightColumn = twoColumn ? items.slice(half) : []

  return (
    <div>
      {eyebrow && <div className="eyebrow mb-8">{eyebrow}</div>}
      {headline && <h2 className="section-title faq-section-title">{headline}</h2>}
      {twoColumn ? (
        <div className="faq-list faq-list--grid">
          <div className="faq-list--grid-col">
            {leftColumn.map((item, j) => (
              <FaqItemBlock
                key={j}
                item={item}
                i={j}
                openIdx={openIdx}
                setOpenIdx={setOpenIdx}
              />
            ))}
          </div>
          <div className="faq-list--grid-col">
            {rightColumn.map((item, j) => (
              <FaqItemBlock
                key={j + half}
                item={item}
                i={j + half}
                openIdx={openIdx}
                setOpenIdx={setOpenIdx}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="faq-list">
          {items.map((item, i) => (
            <FaqItemBlock
              key={i}
              item={item}
              i={i}
              openIdx={openIdx}
              setOpenIdx={setOpenIdx}
            />
          ))}
        </div>
      )}
    </div>
  )
}

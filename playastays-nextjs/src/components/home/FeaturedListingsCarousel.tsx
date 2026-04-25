'use client'

// Homepage featured listings — horizontal snap carousel with subtle active emphasis.

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import { PropertyCard } from '@/components/content/Cards'

interface FeaturedListingsCarouselProps {
  properties: Property[]
  locale?: Locale
}

export function FeaturedListingsCarousel({
  properties,
  locale = 'en',
}: FeaturedListingsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isEs = locale === 'es'
  const n = properties.length
  const showNav = n > 1

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(n - 1, index))
      const root = viewportRef.current
      if (!root) return
      const slide = root.querySelector<HTMLElement>(
        `[data-carousel-slide][data-index="${clamped}"]`,
      )
      slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    },
    [n],
  )

  useEffect(() => {
    const root = viewportRef.current
    if (!root || n === 0) return
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-slide]'))
    const io = new IntersectionObserver(
      entries => {
        let best: { idx: number; ratio: number } | null = null
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const idx = Number(e.target.getAttribute('data-index'))
          if (Number.isNaN(idx)) continue
          const r = e.intersectionRatio
          if (!best || r > best.ratio) best = { idx, ratio: r }
        }
        if (best) setActiveIndex(best.idx)
      },
      { root, rootMargin: '-10% 0px -10% 0px', threshold: [0.2, 0.4, 0.55, 0.75, 0.9] },
    )
    slides.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [n])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showNav) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollToIndex(activeIndex - 1)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollToIndex(activeIndex + 1)
      }
    },
    [activeIndex, scrollToIndex, showNav],
  )

  if (n === 0) return null

  const label = isEs ? 'Propiedades destacadas' : 'Featured properties'
  const prevLabel = isEs ? 'Anterior' : 'Previous listing'
  const nextLabel = isEs ? 'Siguiente' : 'Next listing'

  return (
    <div
      className="featured-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {showNav && (
        <button
          type="button"
          className="featured-carousel__nav featured-carousel__nav--prev"
          aria-label={prevLabel}
          disabled={activeIndex <= 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
        >
          <Chevron />
        </button>
      )}
      <div
        ref={viewportRef}
        className="featured-carousel__viewport"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="featured-carousel__track">
          {properties.map((p, i) => (
            <div
              key={p.id}
              className={`featured-carousel__slide${i === activeIndex ? ' is-active' : ''}`}
              data-carousel-slide
              data-index={i}
            >
              <PropertyCard property={p} locale={locale} variant="featured-compact" />
            </div>
          ))}
        </div>
      </div>
      {showNav && (
        <button
          type="button"
          className="featured-carousel__nav featured-carousel__nav--next"
          aria-label={nextLabel}
          disabled={activeIndex >= n - 1}
          onClick={() => scrollToIndex(activeIndex + 1)}
        >
          <Chevron flip />
        </button>
      )}
    </div>
  )
}

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

'use client'
// ============================================================
// ActivityFeed — client component
//
// Animated "recent activity" ticker that simulates portfolio
// activity: bookings, check-ins, and guest ratings.
//
// All entries are SIMULATED / ANONYMIZED — never real guest
// data. Labels make this clear ("Recent portfolio activity").
// Cities and amounts are realistic market numbers.
//
// Adds a layer of social proof: the portfolio is active,
// bookings are happening right now.
//
// Used on: homepage (between testimonials and FAQ).
// ============================================================

import { useState, useEffect } from 'react'
import type { Locale } from '@/lib/i18n'

interface ActivityFeedProps {
  locale: Locale
}

type EventType = 'booking' | 'checkin' | 'rating' | 'payout'

interface FeedItem {
  type:    EventType
  cityEn:  string
  cityEs:  string
  textEn:  string
  textEs:  string
  amount?: string
  ago:     string
  agoEs:   string
}

// Pool of plausible anonymized events across the portfolio.
// Amounts are rounded from real CALC_RANGES midpoints.
const FEED_POOL: FeedItem[] = [
  { type: 'booking', cityEn: 'Tulum',              cityEs: 'Tulum',              textEn: '4 nights booked',       textEs: '4 noches reservadas',        amount: '+$760',  ago: '2m ago',   agoEs: 'hace 2 min' },
  { type: 'checkin', cityEn: 'Playa del Carmen',    cityEs: 'Playa del Carmen',   textEn: 'Guest checked in',      textEs: 'Huésped con check-in',       amount: undefined,ago: '11m ago',  agoEs: 'hace 11 min' },
  { type: 'rating',  cityEn: 'Akumal',              cityEs: 'Akumal',             textEn: '5-star review received',textEs: 'Reseña de 5 estrellas',       amount: '★★★★★',  ago: '22m ago',  agoEs: 'hace 22 min' },
  { type: 'booking', cityEn: 'Puerto Morelos',      cityEs: 'Puerto Morelos',     textEn: '7 nights booked',       textEs: '7 noches reservadas',        amount: '+$1,260',ago: '35m ago',  agoEs: 'hace 35 min' },
  { type: 'payout',  cityEn: 'Playa del Carmen',    cityEs: 'Playa del Carmen',   textEn: 'Owner payout sent',     textEs: 'Pago enviado al propietario',amount: '$3,820', ago: '1h ago',   agoEs: 'hace 1 h' },
  { type: 'booking', cityEn: 'Tulum',               cityEs: 'Tulum',              textEn: '3 nights booked',       textEs: '3 noches reservadas',        amount: '+$540',  ago: '1.5h ago', agoEs: 'hace 1.5 h' },
  { type: 'checkin', cityEn: 'Xpu-Ha',              cityEs: 'Xpu-Ha',             textEn: 'Guest checked in',      textEs: 'Huésped con check-in',       amount: undefined,ago: '2h ago',   agoEs: 'hace 2 h' },
  { type: 'booking', cityEn: 'Akumal',              cityEs: 'Akumal',             textEn: '5 nights booked',       textEs: '5 noches reservadas',        amount: '+$900',  ago: '3h ago',   agoEs: 'hace 3 h' },
  { type: 'rating',  cityEn: 'Puerto Morelos',      cityEs: 'Puerto Morelos',     textEn: '5-star review received',textEs: 'Reseña de 5 estrellas',       amount: '★★★★★',  ago: '4h ago',   agoEs: 'hace 4 h' },
  { type: 'booking', cityEn: 'Playa del Carmen',    cityEs: 'Playa del Carmen',   textEn: '6 nights booked',       textEs: '6 noches reservadas',        amount: '+$1,020',ago: '5h ago',   agoEs: 'hace 5 h' },
  { type: 'payout',  cityEn: 'Tulum',               cityEs: 'Tulum',              textEn: 'Owner payout sent',     textEs: 'Pago enviado al propietario',amount: '$5,140', ago: '7h ago',   agoEs: 'hace 7 h' },
  { type: 'checkin', cityEn: 'Playa del Carmen',    cityEs: 'Playa del Carmen',   textEn: 'Guest checked in',      textEs: 'Huésped con check-in',       amount: undefined,ago: '8h ago',   agoEs: 'hace 8 h' },
]

const TYPE_CONFIG: Record<EventType, { icon: string; color: string; bg: string }> = {
  booking: { icon: '📅', color: 'var(--teal)',  bg: 'rgba(24,104,112,0.1)' },
  checkin: { icon: '🏡', color: 'var(--gold)',  bg: 'rgba(200,164,74,0.1)' },
  rating:  { icon: '⭐', color: '#e67e22',      bg: 'rgba(230,126,34,0.1)' },
  payout:  { icon: '💰', color: 'var(--teal)',  bg: 'rgba(24,104,112,0.1)' },
}

// Deterministically reorder the pool so it feels fresh each render
function getInitialItems(): FeedItem[] {
  // Return first 6 — no randomization (SSR-safe initial state)
  return FEED_POOL.slice(0, 6)
}

export function ActivityFeed({ locale }: ActivityFeedProps) {
  const isEs = locale === 'es'

  // Start with empty to avoid hydration mismatch, then mount
  const [items, setItems]     = useState<FeedItem[]>([])
  const [visible, setVisible] = useState(false)
  const [newIdx, setNewIdx]   = useState<number | null>(null)

  useEffect(() => {
    setItems(getInitialItems())
    const showTimer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(showTimer)
  }, [])

  // Cycle a new item in every 5 seconds
  useEffect(() => {
    if (!visible) return

    let cursor = 6 // start after initial 6
    const iv = setInterval(() => {
      const next = FEED_POOL[cursor % FEED_POOL.length]
      cursor++
      setNewIdx(0)
      setItems(prev => [next, ...prev.slice(0, 5)])
      setTimeout(() => setNewIdx(null), 600)
    }, 5000)

    return () => clearInterval(iv)
  }, [visible])

  const label = isEs ? '🔴 Actividad reciente del portafolio' : '🔴 Recent portfolio activity'
  const disclaimer = isEs
    ? 'Actividad simulada — datos reales anonimizados del portafolio PlayaStays.'
    : 'Simulated activity — representative of real anonymized PlayaStays portfolio data.'

  return (
    <section className="pad-lg bg-deep">
      <div className="container">
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
        }}>
          {/* Live indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#4caf50',
              boxShadow: '0 0 0 3px rgba(76,175,80,0.25)',
              animation: visible ? 'none' : 'none',
              flexShrink: 0,
            }} />
            <div style={{
              fontSize: '0.73rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {label}
            </div>
          </div>

          {/* Feed */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}>
            {items.map((item, i) => {
              const cfg    = TYPE_CONFIG[item.type]
              const isNew  = i === 0 && newIdx === 0
              const city   = isEs ? item.cityEs  : item.cityEn
              const text   = isEs ? item.textEs  : item.textEn
              const ago    = isEs ? item.agoEs   : item.ago

              return (
                <div
                  key={`${item.textEn}-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr auto',
                    gap: '0 14px',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: isNew
                      ? 'rgba(200,164,74,0.08)'
                      : 'rgba(255,255,255,0.04)',
                    border: isNew
                      ? '1px solid rgba(200,164,74,0.2)'
                      : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--r-md)',
                    opacity: i < 4 ? 1 : Math.max(0.3, 1 - i * 0.15),
                    transition: 'all 0.4s ease',
                    transform: isNew ? 'translateX(-4px)' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: cfg.bg,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--white)',
                      lineHeight: 1.3,
                    }}>
                      {text}
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.4)',
                        marginLeft: 8,
                      }}>
                        · {city}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                      {ago}
                    </div>
                  </div>

                  {/* Amount */}
                  {item.amount && (
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: item.amount.startsWith('+') || item.amount.startsWith('$')
                        ? 'var(--gold)'
                        : 'var(--gold-light)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {item.amount}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <p style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.2)',
            fontStyle: 'italic',
            marginTop: 14,
            textAlign: 'center',
          }}>
            {disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * Property Care visual (pricing hub).
 * REVERT-PROPERTY-CARE-PANEL: restore an older version from git if this layout is replaced.
 */
import type { ReactElement } from 'react'
import type { PropertyCareIconId } from '@/lib/pricing-data'
import { getPropertyCareItems } from '@/lib/pricing-data'
import type { Locale } from '@/lib/i18n'

const iconBase = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  'aria-hidden': true as const,
}

function IconInspection() {
  return (
    <svg {...iconBase}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

function IconUtilities() {
  return (
    <svg {...iconBase}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function IconEssentials() {
  return (
    <svg {...iconBase}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
      />
    </svg>
  )
}

function IconEmergency() {
  return (
    <svg {...iconBase}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5a2 2 0 012-2z" />
    </svg>
  )
}

function IconKeys() {
  return (
    <svg {...iconBase}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H3.75v-2.629c0-.696.275-1.364.768-1.855l8.25-8.25a2.25 2.25 0 012.122-.52z"
      />
    </svg>
  )
}

function IconVendors() {
  return (
    <svg {...iconBase}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

const CARE_ICONS = {
  inspection: IconInspection,
  utilities: IconUtilities,
  essentials: IconEssentials,
  emergency: IconEmergency,
  keys: IconKeys,
  vendors: IconVendors,
} satisfies Record<PropertyCareIconId, () => ReactElement>

export function PropertyCareCard({ locale }: { locale: Locale }) {
  const items = getPropertyCareItems(locale)

  return (
    <div className="property-care-panel">
      <div className="property-care-panes" role="list">
        {items.map((item) => {
          const Icon = CARE_ICONS[item.id]
          return (
            <div key={item.id} className="property-care-pane" role="listitem">
              <div className="property-care-pane__head">
                <span className="property-care-pane__icon" aria-hidden>
                  <Icon />
                </span>
                <div className="property-care-pane__titles">
                  <div className="property-care-pane__title">{item.title}</div>
                </div>
              </div>
              <p className="property-care-pane__desc">{item.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

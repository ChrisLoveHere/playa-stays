'use client'
// ============================================================
// Availability — honest calendar foundation for detail pages
// Renders real blocks from ps_availability_json only.
// ============================================================

import type { Property } from '@/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { getPropertyAvailabilitySummary } from '@/lib/availability'
import { inferListingRole } from '@/lib/property-browse'

export function PropertyAvailabilityPanel({ property, locale = 'en' }: { property: Property; locale?: Locale }) {
  const isEs = locale === 'es'
  const ui = t(locale)
  const role = inferListingRole(property)
  const av = getPropertyAvailabilitySummary(property)

  if (role === 'sale') {
    return (
      <section className="prop-avail prop-avail--sale" aria-labelledby="avail-heading">
        <h3 id="avail-heading" className="prop-avail__title">
          {ui.availabilityHeading}
        </h3>
        <p className="prop-avail__body">{ui.availabilitySaleOnly}</p>
      </section>
    )
  }

  if (av.hasStructuredCalendar) {
    return (
      <section className="prop-avail prop-avail--live" aria-labelledby="avail-heading">
        <h3 id="avail-heading" className="prop-avail__title">
          {ui.availabilityHeading}
        </h3>
        <p className="prop-avail__intro">{ui.availabilityConnectedIntro}</p>
        <ul className="prop-avail__facts">
          {av.nextAvailableDate && (
            <li>
              <strong>{ui.availabilityNextLabel}</strong> {av.nextAvailableDate}
            </li>
          )}
          {av.minStayNights != null && (
            <li>
              <strong>{ui.availabilityMinStayLabel}</strong> {av.minStayNights}{' '}
              {isEs ? (av.minStayNights === 1 ? 'noche' : 'noches') : av.minStayNights === 1 ? 'night' : 'nights'}
            </li>
          )}
          {property.meta.ps_booking_mode && (
            <li>
              <strong>{ui.availabilityBookingModeLabel}</strong> {property.meta.ps_booking_mode}
            </li>
          )}
        </ul>
        {av.blocks.length > 0 && (
          <div className="prop-avail__calendar-placeholder">
            <p className="prop-avail__sub">{ui.availabilityBlocksSummary}</p>
            <ul className="prop-avail__blocks">
              {av.blocks.slice(0, 12).map((b, i) => (
                <li key={i}>
                  <span className={`prop-avail__kind prop-avail__kind--${b.kind}`}>{b.kind}</span>
                  <span className="prop-avail__range">
                    {b.start} → {b.end}
                  </span>
                </li>
              ))}
            </ul>
            {av.blocks.length > 12 && (
              <p className="prop-avail__more">{ui.availabilityMoreBlocks.replace('{n}', String(av.blocks.length - 12))}</p>
            )}
          </div>
        )}
        <p className="prop-avail__foot">{ui.availabilityCalendarFuture}</p>
      </section>
    )
  }

  return (
    <section className="prop-avail prop-avail--pending" aria-labelledby="avail-heading">
      <h3 id="avail-heading" className="prop-avail__title">
        {ui.availabilityHeading}
      </h3>
      <p className="prop-avail__body">{ui.availabilityPlaceholderBody}</p>
      <div className="prop-avail__mini-grid" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="prop-avail__mini-cell" />
        ))}
      </div>
      <p className="prop-avail__foot">{ui.availabilityCalendarFuture}</p>
    </section>
  )
}

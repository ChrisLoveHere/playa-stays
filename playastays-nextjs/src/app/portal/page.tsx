import Link from 'next/link'

export default function PortalDashboard() {
  return (
    <>
      <div className="adm-topbar">
        <h1 className="adm-topbar__title">Owner Portal</h1>
      </div>
      <div className="adm-page">
        <div className="adm-stats">
          <div className="adm-stat">
            <div className="adm-stat__label">My Properties</div>
            <div className="adm-stat__value">—</div>
            <div className="adm-stat__sub">Sign in to view</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat__label">This Month</div>
            <div className="adm-stat__value">—</div>
            <div className="adm-stat__sub">Revenue</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat__label">Occupancy</div>
            <div className="adm-stat__value">—</div>
            <div className="adm-stat__sub">Avg rate</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">My Properties</div>
              <span className="adm-pill adm-pill--gray">Coming soon</span>
            </div>
            <div className="adm-card__body">
              <p style={{ color: '#9ca3af', fontSize: '.85rem' }}>
                View your properties, performance, and listing status. Owner authentication is being configured — contact PlayaStays for access.
              </p>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Revenue &amp; Statements</div>
              <span className="adm-pill adm-pill--gray">Coming soon</span>
            </div>
            <div className="adm-card__body">
              <p style={{ color: '#9ca3af', fontSize: '.85rem' }}>
                Monthly income, occupancy metrics, and payout statements will appear here once financial reporting is integrated.
              </p>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Availability Calendar</div>
              <span className="adm-pill adm-pill--gray">Coming soon</span>
            </div>
            <div className="adm-card__body">
              <p style={{ color: '#9ca3af', fontSize: '.85rem' }}>
                View bookings, block dates for personal use, and coordinate with the PlayaStays team on availability changes.
              </p>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Contact Your Manager</div>
            </div>
            <div className="adm-card__body">
              <p style={{ color: '#6b7280', fontSize: '.85rem', marginBottom: '.75rem' }}>
                Questions about your property? Reach out to the PlayaStays team directly.
              </p>
              <a href="mailto:Chris@PlayaStays.com" className="adm-btn adm-btn--secondary adm-btn--sm">Email PlayaStays</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

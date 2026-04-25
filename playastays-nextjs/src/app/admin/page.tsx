import Link from 'next/link'
import { getPropertiesForBrowse } from '@/lib/wordpress'
import { getPropertyCompleteness } from '@/lib/property-completeness'
import { inferListingRole } from '@/lib/property-browse'
import { getLaunchReadiness, summarizeReadinessForPortfolio } from '@/lib/admin-readiness'
import { buildWorkflowSignalStats } from '@/lib/admin-workflow-stats'
import { OpsWorkflowSignals } from '@/components/admin/OpsWorkflowSignals'
import type { Property } from '@/types'

export const revalidate = 300

function scoreFill(score: number) {
  if (score >= 90) return 'adm-score__fill--green'
  if (score >= 60) return 'adm-score__fill--yellow'
  return 'adm-score__fill--red'
}

function strategyLabel(k: string): string {
  if (k === 'vacation_rental') return 'Vacation rental'
  if (k === 'long_term') return 'Long-term'
  if (k === 'hybrid') return 'Hybrid'
  if (k === 'unset') return 'Not set'
  return k
}

/** Same normalized neighborhood key but different raw strings → possible typos */
function neighborhoodSpellingFlags(properties: Property[], limit: number) {
  const normToRaw = new Map<string, Set<string>>()
  for (const p of properties) {
    const c = p.meta.ps_city?.trim()
    const n = p.meta.ps_neighborhood?.trim()
    if (!c || !n) continue
    const key = `${c.toLowerCase()}|${n.toLowerCase()}`
    if (!normToRaw.has(key)) normToRaw.set(key, new Set())
    normToRaw.get(key)!.add(n)
  }
  return [...normToRaw.entries()]
    .filter(([, variants]) => variants.size > 1)
    .slice(0, limit)
    .map(([key, variants]) => ({
      key,
      variants: [...variants].sort(),
    }))
}

export default async function AdminDashboard() {
  const properties = await getPropertiesForBrowse({ perPage: 100 })

  const total = properties.length
  const active = properties.filter(p => (p.meta.ps_listing_status ?? 'active') === 'active').length
  const managed = properties.filter(p => p.meta.ps_managed_by_ps).length
  const forRent = properties.filter(p => { const r = inferListingRole(p); return r === 'rent' || r === 'both' }).length
  const forSale = properties.filter(p => { const r = inferListingRole(p); return r === 'sale' || r === 'both' }).length

  const reportMap = new Map(properties.map(p => [p.id, getPropertyCompleteness(p)]))
  const summary = summarizeReadinessForPortfolio(properties, reportMap)
  const workflowStats = buildWorkflowSignalStats(properties, summary)

  const avgScore = total > 0
    ? Math.round([...reportMap.values()].reduce((s, r) => s + r.score, 0) / total)
    : 0

  const attentionRows = properties
    .map(p => {
      const r = reportMap.get(p.id)!
      const l = getLaunchReadiness(p, r)
      return { p, r, l }
    })
    .filter(({ l }) => l.queue !== 'launch_ready')
    .sort((a, b) => a.r.score - b.r.score)
    .slice(0, 12)

  const topCities = Object.entries(summary.byCity).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const strategyRows = Object.entries(summary.byStrategy).sort((a, b) => b[1] - a[1])
  const typeRows = Object.entries(summary.byType).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const spellingFlags = neighborhoodSpellingFlags(properties, 6)

  return (
    <>
      <div className="adm-topbar">
        <h1 className="adm-topbar__title">Dashboard</h1>
        <div className="adm-topbar__actions">
          <Link href="/admin/properties" className="adm-btn adm-btn--secondary">Manage Properties</Link>
          <Link href="/admin/properties/new" className="adm-btn adm-btn--primary">+ New Property</Link>
        </div>
      </div>
      <div className="adm-page">
        <OpsWorkflowSignals stats={workflowStats} />
        <div className="adm-stats">
          <Link href="/admin/properties" className="adm-stat" style={{ textDecoration: 'none' }}>
            <div className="adm-stat__label">Total listings</div>
            <div className="adm-stat__value">{total}</div>
          </Link>
          <Link href="/admin/properties" className="adm-stat adm-stat--good" style={{ textDecoration: 'none' }}>
            <div className="adm-stat__label">Active</div>
            <div className="adm-stat__value">{active}</div>
          </Link>
          <div className="adm-stat adm-stat--good">
            <div className="adm-stat__label">PS managed</div>
            <div className="adm-stat__value">{managed}</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat__label">Avg completeness</div>
            <div className="adm-stat__value">{avgScore}%</div>
          </div>
          <div className={`adm-stat${summary.launchReady > 0 ? ' adm-stat--good' : ''}`}>
            <div className="adm-stat__label">Launch-ready queue</div>
            <div className="adm-stat__value">{summary.launchReady}</div>
          </div>
          <div className={`adm-stat${summary.needsWork > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Needs work</div>
            <div className="adm-stat__value">{summary.needsWork}</div>
          </div>
          <div className={`adm-stat${summary.blocked > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Blocked / draft</div>
            <div className="adm-stat__value">{summary.blocked}</div>
          </div>
          <div className={`adm-stat${summary.missingPhotos > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Missing photos</div>
            <div className="adm-stat__value">{summary.missingPhotos}</div>
          </div>
          <div className={`adm-stat${summary.missingAmenities > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Missing amenities</div>
            <div className="adm-stat__value">{summary.missingAmenities}</div>
          </div>
          <div className={`adm-stat${summary.missingAvailability > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Missing availability</div>
            <div className="adm-stat__value">{summary.missingAvailability}</div>
          </div>
          <div className={`adm-stat${summary.missingBooking > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Missing booking links</div>
            <div className="adm-stat__value">{summary.missingBooking}</div>
          </div>
          <div className={`adm-stat${summary.missingAssignment > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Owner / manager gaps</div>
            <div className="adm-stat__value">{summary.missingAssignment}</div>
          </div>
          <div className={`adm-stat${summary.missingAreaDetail > 0 ? ' adm-stat--warn' : ''}`}>
            <div className="adm-stat__label">Missing area detail</div>
            <div className="adm-stat__value">{summary.missingAreaDetail}</div>
          </div>
        </div>

        <div className="adm-card" style={{ marginBottom: '1.25rem' }}>
          <div className="adm-card__body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem', alignItems: 'center' }}>
            <Link href="/admin/properties" className="adm-btn adm-btn--secondary">
              View all {total} properties
            </Link>
            <Link href="/admin/properties/new" className="adm-btn adm-btn--primary">
              + Create new listing
            </Link>
            <Link href="/admin/properties" className="adm-btn adm-btn--ghost adm-btn--sm">
              Filter: needs work →
            </Link>
            <span style={{ fontSize: '.8rem', color: '#6b7280' }}>
              Launch queue uses listing status, completeness, photos, pricing, and operational gaps — not revenue estimates.
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="adm-card" style={{ gridColumn: '1 / -1' }}>
            <div className="adm-card__header">
              <div className="adm-card__title">Listings needing attention</div>
              <Link href="/admin/properties" className="adm-btn adm-btn--ghost adm-btn--sm">Full list →</Link>
            </div>
            <div className="adm-card__body">
              {attentionRows.length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: '.85rem' }}>Nothing in the non-launch-ready queue.</p>
              )}
              {attentionRows.length > 0 && (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Queue</th>
                        <th>Gaps</th>
                        <th>Score</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {attentionRows.map(({ p, r, l }) => (
                        <tr key={p.id}>
                          <td>
                            <div className="adm-table__name">{p.title.rendered.replace(/<[^>]*>/g, '')}</div>
                            <div className="adm-table__sub">{p.meta.ps_city || '—'}</div>
                          </td>
                          <td>
                            <span className={
                              l.queue === 'blocked' ? 'adm-queue-pill adm-queue-pill--blocked'
                                : 'adm-queue-pill adm-queue-pill--work'
                            }
                            >
                              {l.queue === 'blocked' ? 'Blocked' : 'Needs work'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '.78rem', color: '#6b7280' }} title={l.blockers.join(', ')}>
                              {l.blockers.slice(0, 4).join(' · ') || '—'}
                              {l.blockers.length > 4 ? '…' : ''}
                            </span>
                          </td>
                          <td>
                            <div className="adm-score">
                              <div className="adm-score__bar">
                                <div className={`adm-score__fill ${scoreFill(r.score)}`} style={{ width: `${r.score}%` }} />
                              </div>
                              <span className="adm-score__label">{r.score}%</span>
                            </div>
                          </td>
                          <td>
                            <Link href={`/admin/properties/${p.id}`} className="adm-btn adm-btn--ghost adm-btn--sm">Edit</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">By city</div>
            </div>
            <div className="adm-card__body">
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>City</th><th style={{ textAlign: 'right' }}>Listings</th></tr>
                  </thead>
                  <tbody>
                    {topCities.map(([city, count]) => (
                      <tr key={city}>
                        <td>{city}</td>
                        <td style={{ textAlign: 'right' }}><strong>{count}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '.75rem', marginTop: '.75rem', fontSize: '.8rem', color: '#6b7280' }}>
                {forRent} for rent · {forSale} for sale
              </div>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Rental strategy</div>
            </div>
            <div className="adm-card__body">
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Strategy</th><th style={{ textAlign: 'right' }}>Count</th></tr>
                  </thead>
                  <tbody>
                    {strategyRows.map(([key, count]) => (
                      <tr key={key}>
                        <td>{strategyLabel(key)}</td>
                        <td style={{ textAlign: 'right' }}><strong>{count}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Property type</div>
            </div>
            <div className="adm-card__body">
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Type</th><th style={{ textAlign: 'right' }}>Count</th></tr>
                  </thead>
                  <tbody>
                    {typeRows.map(([t, count]) => (
                      <tr key={t}>
                        <td>{t === 'unset' ? '—' : t}</td>
                        <td style={{ textAlign: 'right' }}><strong>{count}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="adm-card" style={{ gridColumn: '1 / -1' }}>
            <div className="adm-card__header">
              <div className="adm-card__title">Location data hygiene</div>
            </div>
            <div className="adm-card__body">
              <p style={{ fontSize: '.82rem', color: '#6b7280', marginBottom: '1rem' }}>
                Listings with a city but no neighborhood or building count toward “missing area detail.”
                Below: same normalized neighborhood with different spellings (possible duplicates).
              </p>
              {spellingFlags.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '.85rem' }}>No obvious duplicate spellings detected in neighborhood names.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Variants seen</th></tr>
                    </thead>
                    <tbody>
                      {spellingFlags.map(row => (
                        <tr key={row.key}>
                          <td style={{ fontSize: '.82rem' }}>{row.variants.join(' · ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

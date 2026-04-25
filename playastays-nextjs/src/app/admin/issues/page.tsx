import Link from 'next/link'
import type { Metadata } from 'next'
import { getPropertiesForBrowse } from '@/lib/wordpress'
import { parseOpsIssues, type OpsIssue } from '@/lib/ops-issues'
import type { Property } from '@/types'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'

export const metadata: Metadata = { title: 'Issues & maintenance' }

export const revalidate = 300

function collectOpenIssues(properties: Property[]): Array<{ property: Property; issue: OpsIssue }> {
  const rows: Array<{ property: Property; issue: OpsIssue }> = []
  for (const p of properties) {
    for (const issue of parseOpsIssues(p.meta.ps_ops_issues)) {
      if (issue.status === 'open' || issue.status === 'in_progress') {
        rows.push({ property: p, issue })
      }
    }
  }
  return rows.sort((a, b) => b.issue.updatedAt.localeCompare(a.issue.updatedAt))
}

export default async function AdminIssuesPage() {
  const properties = await getPropertiesForBrowse({ perPage: 100 })
  const rows = collectOpenIssues(properties)

  return (
    <>
      <AdminModuleHeader
        title="Issues & maintenance"
        status="partial"
        subtitle="Open and in-progress items from each property’s ops issue list. Create and edit issues on the property record."
        hint="This is not a full work-order system yet — it aggregates what is already stored in WordPress."
      />
      <div className="adm-page">
        <div className="adm-card">
          <div className="adm-card__header">
            <div className="adm-card__title">Open queue ({rows.length})</div>
            <Link href="/admin/properties" className="adm-btn adm-btn--ghost adm-btn--sm">
              All properties →
            </Link>
          </div>
          <div className="adm-card__body">
            {rows.length === 0 && (
              <p className="adm-empty-state">
                No open or in-progress issues across the portfolio. Add issues from a property’s editor when something needs tracking.
              </p>
            )}
            {rows.length > 0 && (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Issue</th>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Updated</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 80).map(({ property: p, issue: i }) => (
                      <tr key={`${p.id}-${i.id}`}>
                        <td>
                          <div className="adm-table__name">{i.title}</div>
                        </td>
                        <td>
                          <div className="adm-table__name">{p.title.rendered.replace(/<[^>]*>/g, '')}</div>
                          <div className="adm-table__sub">{p.meta.ps_city || '—'}</div>
                        </td>
                        <td>{i.type}</td>
                        <td>{i.priority}</td>
                        <td>
                          <span className="adm-queue-pill adm-queue-pill--work">{i.status.replace(/_/g, ' ')}</span>
                        </td>
                        <td style={{ fontSize: '.78rem', color: '#6b7280' }}>
                          {i.updatedAt.slice(0, 10)}
                        </td>
                        <td>
                          <Link href={`/admin/properties/${p.id}`} className="adm-btn adm-btn--ghost adm-btn--sm">
                            Property
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPublishedPropertiesForSitemap } from '@/lib/wordpress'
import { fetchWpUsersByIds } from '@/lib/admin-wp-users'
import { buildOwnerDirectoryRows } from '@/lib/admin-owners-directory'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'

export const metadata: Metadata = { title: 'Owners' }

export const revalidate = 300

export default async function AdminOwnersPage() {
  const properties = await getAllPublishedPropertiesForSitemap()
  const byOwner = [...new Set(
    properties
      .map(p => p.meta.ps_owner_id)
      .filter((id): id is number => typeof id === 'number' && id > 0),
  )]
  const wpUsers = await fetchWpUsersByIds(byOwner)
  const rows = buildOwnerDirectoryRows(properties, wpUsers)

  return (
    <>
      <AdminModuleHeader
        title="Owners"
        status="partial"
        subtitle="Each listing’s owner is a WordPress user (ps_owner_id). This directory aggregates assignments across your portfolio."
        hint="Live: property ↔ owner links and WP user details when credentials resolve. Phone and owner-level notes are not stored on the user yet — see roadmap cards on a profile."
      />
      <div className="adm-page">
        <div className="adm-card" style={{ marginBottom: '1rem' }}>
          <div className="adm-card__body adm-owner-intro">
            <p>
              <strong>Who appears here:</strong> WordPress users referenced as the property owner on at least one published listing.
              Assign or change owners in each property’s <strong>Operations &amp; Internal</strong> section.
            </p>
          </div>
        </div>

        {rows.length === 0 && (
          <div className="adm-card">
            <div className="adm-card__body adm-empty-state-wrap">
              <p className="adm-empty-state-title">No owners in the directory yet</p>
              <p className="adm-empty-state">
                Set a <strong>Property owner</strong> on a listing to see them here. The link is a WordPress user — search by name or email when editing a property.
              </p>
              <Link href="/admin/properties" className="adm-btn adm-btn--primary adm-btn--sm">
                Go to properties →
              </Link>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Directory ({rows.length})</div>
            </div>
            <div className="adm-card__body" style={{ padding: 0 }}>
              <div className="adm-table-wrap">
                <table className="adm-table adm-table--owners">
                  <thead>
                    <tr>
                      <th>Owner</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>WP role</th>
                      <th style={{ textAlign: 'right' }}>Properties</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.ownerId}>
                        <td>
                          <div className="adm-table__name">{row.name}</div>
                          <div className="adm-table__sub">ID {row.ownerId}</div>
                        </td>
                        <td>{row.email || '—'}</td>
                        <td>{row.phone ?? '—'}</td>
                        <td>{row.role}</td>
                        <td style={{ textAlign: 'right' }}>
                          <strong>{row.propertyCount}</strong>
                        </td>
                        <td>
                          <Link
                            href={`/admin/owners/${row.ownerId}`}
                            className="adm-btn adm-btn--ghost adm-btn--sm"
                          >
                            Profile →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

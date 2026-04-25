import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPublishedPropertiesForSitemap } from '@/lib/wordpress'
import { fetchWpUsersByIds, isWpUserFetchConfigured } from '@/lib/admin-wp-users'
import { propertiesForOwner } from '@/lib/admin-owners-directory'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const ownerId = Number(params.id)
  if (!Number.isFinite(ownerId) || ownerId <= 0) return { title: 'Owner' }
  return { title: `Owner #${ownerId}` }
}

export default async function AdminOwnerProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const ownerId = Number(params.id)
  if (!Number.isFinite(ownerId) || ownerId <= 0) notFound()

  const all = await getAllPublishedPropertiesForSitemap()
  const linked = propertiesForOwner(all, ownerId).sort((a, b) =>
    a.title.rendered.localeCompare(b.title.rendered, undefined, { sensitivity: 'base' }),
  )

  const users = isWpUserFetchConfigured() ? await fetchWpUsersByIds([ownerId]) : []
  const user = users[0]
  const fallbackName = linked[0]?.ps_computed?.owner?.display_name?.trim()

  if (!user && linked.length === 0) {
    notFound()
  }

  const name = user?.name ?? fallbackName ?? `User #${ownerId}`
  const email = user?.email ?? ''
  const role = user?.role ?? '—'
  const avatar = user?.avatar ?? ''

  return (
    <>
      <AdminModuleHeader
        title={name}
        status="partial"
        subtitle="WordPress user linked via ps_owner_id on one or more listings. Financials and messaging are roadmap-only."
        hint={
          !isWpUserFetchConfigured()
            ? 'WP credentials not configured in this environment — user details may be incomplete.'
            : undefined
        }
        actions={(
          <Link href="/admin/owners" className="adm-btn adm-btn--secondary adm-btn--sm">
            ← All owners
          </Link>
        )}
      />
      <div className="adm-page">
        <div className="adm-owner-profile-grid">
          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Contact</div>
              <span className="adm-pill adm-pill--teal">Live data</span>
            </div>
            <div className="adm-card__body">
              <div className="adm-owner-profile-identity">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element -- gravatar / WP URLs vary by env
                  <img src={avatar} alt="" width={64} height={64} className="adm-owner-profile-avatar" />
                ) : (
                  <div className="adm-owner-profile-avatar-fallback" aria-hidden>
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="adm-kv">
                    <span className="adm-kv__k">WordPress ID</span>
                    <span className="adm-kv__v">{ownerId}</span>
                  </div>
                  <div className="adm-kv">
                    <span className="adm-kv__k">Email</span>
                    <span className="adm-kv__v">{email || '—'}</span>
                  </div>
                  <div className="adm-kv">
                    <span className="adm-kv__k">Phone</span>
                    <span className="adm-kv__v">—</span>
                  </div>
                  <p className="adm-module-hint" style={{ marginTop: '0.75rem' }}>
                    Standard WordPress users do not expose a phone field here. Add phone to internal property notes or a future owner profile when modeled.
                  </p>
                  <div className="adm-kv">
                    <span className="adm-kv__k">Role</span>
                    <span className="adm-kv__v">{role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card__header">
              <div className="adm-card__title">Internal summary</div>
              <span className="adm-pill adm-pill--gray">Framework</span>
            </div>
            <div className="adm-card__body">
              <p style={{ margin: 0, fontSize: '.88rem', color: '#4b5563', lineHeight: 1.6 }}>
                A single owner-level memo field (synced to WordPress) is not wired yet. Until then, use{' '}
                <strong>Internal notes</strong> and the <strong>Activity log</strong> on each property for anything that must be recorded.
              </p>
            </div>
          </div>
        </div>

        <div className="adm-card" style={{ marginTop: '1.25rem' }}>
          <div className="adm-card__header">
            <div className="adm-card__title">Linked properties ({linked.length})</div>
            <Link href="/admin/properties" className="adm-btn adm-btn--ghost adm-btn--sm">
              Properties →
            </Link>
          </div>
          <div className="adm-card__body" style={{ padding: 0 }}>
            {linked.length === 0 && (
              <p className="adm-empty-state" style={{ padding: '1.25rem' }}>
                No published listings reference this user as owner. If you expected to see data, check the property’s owner assignment or draft status.
              </p>
            )}
            {linked.length > 0 && (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Listing</th>
                      <th>City</th>
                      <th>Ops status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {linked.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="adm-table__name">{p.title.rendered.replace(/<[^>]*>/g, '')}</div>
                          <div className="adm-table__sub">{p.slug}</div>
                        </td>
                        <td>{p.meta.ps_city || '—'}</td>
                        <td>{p.meta.ps_ops_status || '—'}</td>
                        <td>
                          <Link href={`/admin/properties/${p.id}`} className="adm-btn adm-btn--ghost adm-btn--sm">
                            Edit →
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

        <div className="adm-owner-future-grid">
          {[
            { t: 'Statements & payouts', d: 'Owner remittance and fee breakdown — not implemented.' },
            { t: 'Documents', d: 'Contracts, IDs, tax forms — not implemented.' },
            { t: 'Communications', d: 'Threaded history — use property logs for now.' },
            { t: 'Portal access', d: 'Self-serve owner login scope — separate initiative.' },
          ].map(x => (
            <div key={x.t} className="adm-card adm-card--muted">
              <div className="adm-card__header">
                <div className="adm-card__title" style={{ fontSize: '.9rem' }}>{x.t}</div>
                <span className="adm-pill adm-pill--gray">Soon</span>
              </div>
              <div className="adm-card__body">
                <p style={{ margin: 0, fontSize: '.82rem', color: '#6b7280', lineHeight: 1.5 }}>{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

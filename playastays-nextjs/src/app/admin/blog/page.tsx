import Link from 'next/link'
import {
  getBlogPosts,
  getBlogTopicTerms,
  getBlogAreaTerms,
} from '@/lib/wordpress'
import { AdminModuleHeader } from '@/components/admin/AdminModuleHeader'
import { wpAdminPostEditUrl, wpAdminPostNewUrl } from '@/lib/wp-admin-url'
import type { WpTerm } from '@/types'

export const revalidate = 120

function termLabels(ids: number[] | undefined, terms: WpTerm[]): string {
  if (!ids?.length) return '—'
  const names = ids
    .map(id => terms.find(t => t.id === id)?.name)
    .filter((n): n is string => Boolean(n))
  return names.length ? names.join(', ') : '—'
}

function stripTitle(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export default async function AdminBlogPage() {
  const [posts, topicTerms, areaTerms] = await Promise.all([
    getBlogPosts({ perPage: 50, page: 1 }),
    getBlogTopicTerms(),
    getBlogAreaTerms(),
  ])

  const newPostUrl = wpAdminPostNewUrl()
  const taxReady = topicTerms.length > 0 && areaTerms.length > 0

  return (
    <>
      <AdminModuleHeader
        title="Blog & editorial"
        status="partial"
        subtitle="Publishing lives in WordPress (Gutenberg body, featured image, taxonomies, SEO meta). This screen links your team into the right admin screens and shows readiness at a glance."
        hint="Set WP_API_URL in env so “New post” / “Edit” links resolve to your CMS host."
        actions={
          newPostUrl ? (
            <a href={newPostUrl} className="adm-btn adm-btn--primary" target="_blank" rel="noopener noreferrer">
              + New post in WordPress
            </a>
          ) : (
            <span className="adm-module-hint">Configure WP_API_URL for edit links.</span>
          )
        }
      />
      <div className="adm-page">
        <div className="adm-card adm-card--muted" style={{ marginBottom: '1.25rem' }}>
          <div className="adm-card__body">
            <p className="adm-module-desc" style={{ margin: 0 }}>
              <strong>Publishing checklist (per article):</strong> featured image → assign{' '}
              <em>Topic</em> and <em>Area</em> terms → optional overrides for <code>ps_seo_title</code> /{' '}
              <code>ps_seo_desc</code> → write the body in the block editor (headings, lists, links). Spanish:
              optional <code>ps_title_es</code>, <code>ps_excerpt_es</code>, <code>ps_content_es</code>.
            </p>
            {!taxReady ? (
              <p className="adm-module-hint" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                Blog taxonomies are empty or unreachable — deploy the PlayaStays Content Model plugin and ensure{' '}
                <code>ps_blog_topic</code> / <code>ps_blog_area</code> terms exist in REST.
              </p>
            ) : null}
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card__header">
            <h2 className="adm-card__title">Recent posts</h2>
          </div>
          <div className="adm-card__body" style={{ padding: 0 }}>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Topic</th>
                    <th>Area</th>
                    <th>Hero</th>
                    <th>SEO</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '1.25rem', color: '#6b7280' }}>
                        No posts returned from WordPress. Add posts in WP or check API credentials.
                      </td>
                    </tr>
                  ) : (
                    posts.map(post => {
                      const editUrl = wpAdminPostEditUrl(post.id)
                      const hasHero = Boolean(post._embedded?.['wp:featuredmedia']?.[0]?.source_url)
                      const hasSeo =
                        Boolean(post.meta.ps_seo_title?.trim()) &&
                        Boolean(post.meta.ps_seo_desc?.trim())
                      return (
                        <tr key={post.id}>
                          <td className="adm-table__name">
                            <span className="adm-table__name-link">
                              {stripTitle(post.title.rendered)}
                            </span>
                            <div className="adm-table__sub">/{post.slug}/</div>
                          </td>
                          <td>{termLabels(post.ps_blog_topic, topicTerms)}</td>
                          <td>{termLabels(post.ps_blog_area, areaTerms)}</td>
                          <td>{hasHero ? '✓' : '—'}</td>
                          <td>{hasSeo ? '✓' : '—'}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <Link href={`/blog/${post.slug}/`} className="adm-btn adm-btn--ghost adm-btn--sm">
                              View
                            </Link>
                            {editUrl ? (
                              <a
                                href={editUrl}
                                className="adm-btn adm-btn--primary adm-btn--sm"
                                style={{ marginLeft: 8 }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Edit in WP
                              </a>
                            ) : null}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

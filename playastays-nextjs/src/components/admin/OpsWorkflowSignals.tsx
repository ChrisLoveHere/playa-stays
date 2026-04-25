// ============================================================
// Admin — workflow-oriented signal strip (real metrics → deep links)
// ============================================================

import Link from 'next/link'
import type { WorkflowSignalStats } from '@/lib/admin-workflow-stats'

interface OpsWorkflowSignalsProps {
  stats: WorkflowSignalStats
}

export function OpsWorkflowSignals({ stats }: OpsWorkflowSignalsProps) {
  const items: Array<{
    key: string
    label: string
    value: number
    href: string
    detail: string
    warn?: boolean
  }> = [
    {
      key: 'needs-work',
      label: 'Listings in “needs work” queue',
      value: stats.needsWork,
      href: '/admin/properties',
      detail: 'Onboarding & readiness gaps',
      warn: stats.needsWork > 0,
    },
    {
      key: 'blocked',
      label: 'Blocked / draft',
      value: stats.blocked,
      href: '/admin/properties',
      detail: 'Not launch-ready',
      warn: stats.blocked > 0,
    },
    {
      key: 'photos',
      label: 'Missing photos (≥2)',
      value: stats.missingPhotos,
      href: '/admin/properties',
      detail: 'Portfolio-wide count',
      warn: stats.missingPhotos > 0,
    },
    {
      key: 'availability',
      label: 'Missing availability data',
      value: stats.missingAvailability,
      href: '/admin/availability',
      detail: 'Calendar blocks or next-available',
      warn: stats.missingAvailability > 0,
    },
    {
      key: 'issues',
      label: 'Open / in-progress ops issues',
      value: stats.openOpsIssues,
      href: '/admin/issues',
      detail: 'From property issue tracker',
      warn: stats.openOpsIssues > 0,
    },
  ]

  return (
    <section className="adm-workflow-signals" aria-label="Workflow signals">
      <div className="adm-workflow-signals__head">
        <h2 className="adm-workflow-signals__title">Workflow signals</h2>
        <p className="adm-workflow-signals__sub">
          Real counts from your portfolio — links go to the relevant module. This is not a CRM; it is an operational pulse.
        </p>
      </div>
      <div className="adm-workflow-signals__grid">
        {items.map(item => (
          <Link
            key={item.key}
            href={item.href}
            className={`adm-workflow-card${item.warn ? ' adm-workflow-card--warn' : ''}`}
          >
            <div className="adm-workflow-card__label">{item.label}</div>
            <div className="adm-workflow-card__value">{item.value}</div>
            <div className="adm-workflow-card__detail">{item.detail}</div>
            <span className="adm-workflow-card__cta">Open →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

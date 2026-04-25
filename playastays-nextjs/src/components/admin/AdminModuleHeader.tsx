// ============================================================
// Admin — consistent module title row + live / partial / framework label
// ============================================================

export type ModuleStatus = 'live' | 'partial' | 'framework'

const STATUS_LABEL: Record<ModuleStatus, string> = {
  live: 'Live',
  partial: 'Partially live',
  framework: 'Framework',
}

interface AdminModuleHeaderProps {
  title: string
  /** One line: what this module is for */
  subtitle?: string
  status: ModuleStatus
  /** Clarify scope under the status pill (e.g. “Per-property logs only today”) */
  hint?: string
  actions?: React.ReactNode
}

export function AdminModuleHeader({
  title,
  subtitle,
  status,
  hint,
  actions,
}: AdminModuleHeaderProps) {
  return (
    <div className="adm-topbar adm-topbar--split">
      <div className="adm-topbar__lead">
        <div className="adm-topbar__title-row">
          <h1 className="adm-topbar__title">{title}</h1>
          <span className={`adm-status-pill adm-status-pill--${status}`} title="Module readiness for your team">
            {STATUS_LABEL[status]}
          </span>
        </div>
        {subtitle && <p className="adm-module-desc">{subtitle}</p>}
        {hint && <p className="adm-module-hint">{hint}</p>}
      </div>
      {actions ? <div className="adm-topbar__actions">{actions}</div> : null}
    </div>
  )
}

// ============================================================
// Admin — per-property ops issues (JSON in WP meta ps_ops_issues)
// Lightweight issue tracker — not a full ticketing product.
// ============================================================

export type OpsIssueType = 'maintenance' | 'guest' | 'owner' | 'compliance' | 'other'
export type OpsIssuePriority = 'low' | 'medium' | 'high' | 'urgent'
export type OpsIssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface OpsIssue {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  type: OpsIssueType
  priority: OpsIssuePriority
  status: OpsIssueStatus
  notes: string
  /** WordPress user id, 0 = unassigned */
  assigneeUserId: number
}

const MAX_ISSUES = 40

function isIssueType(t: unknown): t is OpsIssueType {
  return t === 'maintenance' || t === 'guest' || t === 'owner' || t === 'compliance' || t === 'other'
}
function isPriority(p: unknown): p is OpsIssuePriority {
  return p === 'low' || p === 'medium' || p === 'high' || p === 'urgent'
}
function isStatus(s: unknown): s is OpsIssueStatus {
  return s === 'open' || s === 'in_progress' || s === 'resolved' || s === 'closed'
}

export function parseOpsIssues(raw: string | undefined | null): OpsIssue[] {
  if (!raw || typeof raw !== 'string') return []
  try {
    const v = JSON.parse(raw) as unknown
    if (!Array.isArray(v)) return []
    const out: OpsIssue[] = []
    for (const row of v) {
      if (!row || typeof row !== 'object') continue
      const o = row as Record<string, unknown>
      if (typeof o.id !== 'string' || typeof o.title !== 'string') continue
      if (!isIssueType(o.type) || !isPriority(o.priority) || !isStatus(o.status)) continue
      if (typeof o.createdAt !== 'string' || typeof o.updatedAt !== 'string') continue
      if (typeof o.notes !== 'string') continue
      const aid = typeof o.assigneeUserId === 'number' ? o.assigneeUserId : 0
      out.push({
        id: o.id,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        title: o.title,
        type: o.type,
        priority: o.priority,
        status: o.status,
        notes: o.notes,
        assigneeUserId: aid > 0 ? aid : 0,
      })
    }
    return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } catch {
    return []
  }
}

export function serializeOpsIssues(issues: OpsIssue[]): string {
  return JSON.stringify(issues.slice(0, MAX_ISSUES))
}

export function newOpsIssue(partial: Pick<OpsIssue, 'title' | 'type' | 'priority' | 'notes'> & { assigneeUserId?: number }): OpsIssue {
  const now = new Date().toISOString()
  return {
    id: `iss-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
    title: partial.title.trim(),
    type: partial.type,
    priority: partial.priority,
    status: 'open',
    notes: partial.notes.trim(),
    assigneeUserId: partial.assigneeUserId && partial.assigneeUserId > 0 ? partial.assigneeUserId : 0,
  }
}

export const OPS_ISSUE_TYPE_LABELS: Record<OpsIssueType, string> = {
  maintenance: 'Maintenance',
  guest: 'Guest issue',
  owner: 'Owner / communication',
  compliance: 'Compliance / admin',
  other: 'Other',
}

export const OPS_ISSUE_PRIORITY_LABELS: Record<OpsIssuePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const OPS_ISSUE_STATUS_LABELS: Record<OpsIssueStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

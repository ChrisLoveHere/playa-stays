// ============================================================
// Admin — workflow-oriented dashboard signals (real counts only)
// ============================================================

import type { Property } from '@/types'
import { parseOpsIssues } from '@/lib/ops-issues'
import { summarizeReadinessForPortfolio } from '@/lib/admin-readiness'

export function countOpenOpsIssuesAcrossPortfolio(properties: Property[]): number {
  let n = 0
  for (const p of properties) {
    for (const i of parseOpsIssues(p.meta.ps_ops_issues)) {
      if (i.status === 'open' || i.status === 'in_progress') n++
    }
  }
  return n
}

export interface WorkflowSignalStats {
  needsWork: number
  blocked: number
  missingPhotos: number
  missingAvailability: number
  openOpsIssues: number
}

type PortfolioSummary = ReturnType<typeof summarizeReadinessForPortfolio>

export function buildWorkflowSignalStats(
  properties: Property[],
  summary: PortfolioSummary,
): WorkflowSignalStats {
  return {
    needsWork: summary.needsWork,
    blocked: summary.blocked,
    missingPhotos: summary.missingPhotos,
    missingAvailability: summary.missingAvailability,
    openOpsIssues: countOpenOpsIssuesAcrossPortfolio(properties),
  }
}

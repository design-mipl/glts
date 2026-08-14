import type {
  DashboardAlertItem,
  DashboardKpiItem,
  DashboardProgressItem,
} from '../shared/types'
import type { MetricComparisonItem } from '../shared/widgets/common/MetricComparison'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { ApplicationPipelineStageData } from '../shared/widgets/operations/ApplicationPipeline'
import type { OpsOrgAgeingQueueRow, OpsOrgSegmentWorkload } from '../shared/widgets/operations/opsOrgQueueTypes'
import type { ApplicationMarketRankingPoint } from '../shared/widgets/operations/ApplicationMarketInfographics'

export type DocApplicationChannel = 'retail' | 'corporate' | 'marine' | 'b2b'
export type DocSlaStatus = 'on_track' | 'at_risk' | 'breached'
export type DocPriority = 'high' | 'medium' | 'low'
export type DocAlertPriority = 'critical' | 'high' | 'medium'

/** Docs QC outcomes — mirrors AM `qcCheckChecklistConfig`. */
export type DocQcOutcome = 'pending_qc' | 'ready' | 'correction' | 'blocked'

/**
 * Work desks — Docs owns Submission Pending + Pending Payment + Arrange Insurance.
 * Waiting on Ops = cases Docs sent back (correction / blocked).
 */
export type DocWorkDeskId =
  | 'submission_pending'
  | 'pending_payment'
  | 'arrange_insurance'
  | 'waiting_on_ops'

/** KPI click target — Work desk or Application Management listing tab. */
export type DocKpiTarget =
  | { kind: 'work'; desk: DocWorkDeskId }
  | { kind: 'am'; tab: string }

export interface DocumentationDashboardFilters {
  date: string
  country: string
  applicationType: string
  search: string
}

/** Unified Docs work row (Submission Pending / Pending Payment / Waiting on Ops). */
export interface DocumentationWorkRow {
  id: string
  glNumber: string
  applicant: string
  company: string
  country: string
  visaType: string
  /** Human-readable next step for the Docs executive. */
  nextAction: string
  qcOutcome: DocQcOutcome
  qcOutcomeLabel: string
  waitingOn: 'Me' | 'Ops' | 'Accounts' | 'Client'
  priority: DocPriority
  slaStatus: DocSlaStatus
  slaTimer: string
  dueDate: string
  dueDateSort: number
  channel: DocApplicationChannel
  executive: string
  applicationHref: string
  desk: DocWorkDeskId
}

export interface DocumentationActivityRow {
  id: string
  timestamp: string
  action: string
  application: string
  result: string
  executive: string
  recordedAt: Date
}

export interface DocumentationPerformanceMetric {
  id: string
  label: string
  value: string
  subtitle: string
  accent: 'primary' | 'success' | 'info'
}

export interface DocumentationToActionItem {
  id: string
  label: string
  count: number
  workDesk: DocWorkDeskId
}

export interface DocChartSlice {
  key: string
  label: string
  value: number
  color: string
}

export interface DocAgeingPoint {
  bucket: string
  count: number
}

export interface DocRankingPoint {
  name: string
  value: number
  /** Share of Docs queue volume (%) — same pattern as Accounts top lists. */
  sharePercent: number
}

export interface DocTrendPoint {
  label: string
  value: number
  secondary?: number
}

/** @deprecated Use OpsOrgSegmentWorkload — AM listing tabs by channel. */
export type DocSegmentWorkloadPoint = OpsOrgSegmentWorkload

export interface DocumentationDashboardData {
  executiveName: string
  quickStats: DashboardKpiItem[]
  /** Post-submission visibility counts — Overview strip only (AM redirect). */
  visibilityStats: DashboardKpiItem[]
  /** Per-KPI navigation target (Work desk or AM tab). */
  kpiTargets: Record<string, DocKpiTarget>
  notifications: NotificationItem[]
  criticalAlerts: DashboardAlertItem[]
  pipelineStages: ApplicationPipelineStageData[]
  toActionToday: DocumentationToActionItem[]
  deskMix: DocChartSlice[]
  qcOutcomeMix: DocChartSlice[]
  /** @deprecated Prefer {@link ageingByQueue} — flat ageing kept for reports. */
  ageingBuckets: DocAgeingPoint[]
  /** Same Queue ageing matrix as Ops (AM tabs × wait buckets). */
  ageingByQueue: OpsOrgAgeingQueueRow[]
  topCountries: DocRankingPoint[]
  topClients: DocRankingPoint[]
  /** Submissions grouped by VFS / consulate jurisdiction. */
  submissionByJurisdiction: ApplicationMarketRankingPoint[]
  visibilityFunnel: DocChartSlice[]
  processingTrend: DocTrendPoint[]
  /** Application Management queues by Retail · Corporate · Marine · B2B. */
  workloadBySegment: OpsOrgSegmentWorkload[]
  submissionPendingRows: DocumentationWorkRow[]
  pendingPaymentRows: DocumentationWorkRow[]
  arrangeInsuranceRows: DocumentationWorkRow[]
  waitingOnOpsRows: DocumentationWorkRow[]
  recentActivity: RecentActivityItem[]
  activityRows: DocumentationActivityRow[]
  performanceMetrics: DocumentationPerformanceMetric[]
  metricComparison: MetricComparisonItem[]
  personalSla: DashboardProgressItem[]
  stageSla: DashboardProgressItem[]
  showInactivityWarning: boolean
  minutesSinceLastActivity: number | null
}

export interface DocumentationDashboardTabProps {
  data: DocumentationDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onOpenApplication?: (row: DocumentationWorkRow) => void
  onOpenTab?: (tabId: string) => void
  onOpenWorkDesk?: (deskId: DocWorkDeskId) => void
  /** Hero / visibility KPI click (Work desk or AM redirect). */
  onKpiClick?: (kpiId: string) => void
}

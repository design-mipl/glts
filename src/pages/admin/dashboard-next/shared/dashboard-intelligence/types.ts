/**
 * Dashboard Intelligence — shared interactive BI layer for Dashboard Next.
 * Presentational dashboards / widgets stay isolated; they only consume this context.
 */

export type IntelligenceDatePreset =
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom'

export type IntelligenceComparisonMode =
  | 'none'
  | 'previous-period'
  | 'previous-year'
  | 'branch-vs-branch'
  | 'country-vs-country'
  | 'segment-vs-segment'
  | 'client-vs-client'

export interface DashboardIntelligenceFilters {
  datePreset: IntelligenceDatePreset
  dateFrom?: string
  dateTo?: string
  branch: string
  segment: string
  country: string
  visaType: string
  client: string
  salesPerson: string
  operationsTeam: string
  financeTeam: string
  employee: string
  status: string
  revenueType: string
  search: string
}

export interface IntelligenceFilterOption {
  label: string
  value: string
}

export interface IntelligenceFilterFieldConfig {
  id: keyof DashboardIntelligenceFilters
  label: string
  options: IntelligenceFilterOption[]
}

export interface ExecutiveSectionNavItem {
  id: string
  label: string
  /** Optional: when segment filter matches, auto-focus this section. */
  segmentFocus?: string
}

export type DrilldownSurface = 'drawer' | 'dialog' | 'slide-over'

export interface DrilldownPayload {
  id: string
  title: string
  subtitle?: string
  /** Domain entity type for future nested trails. */
  entityType:
    | 'kpi'
    | 'chart'
    | 'ranking'
    | 'timeline'
    | 'leaderboard'
    | 'client'
    | 'country'
    | 'application'
    | 'case'
    | 'custom'
  entityId?: string
  meta?: Record<string, string | number | boolean | null | undefined>
  surface?: DrilldownSurface
  /** Optional trail for nested drilldowns. */
  trail?: Array<{ id: string; label: string }>
}

export type InsightTone = 'neutral' | 'positive' | 'negative' | 'warning' | 'info'

export interface ExecutiveInsight {
  id: string
  title: string
  body: string
  tone?: InsightTone
  metricId?: string
  segment?: string
}

export interface ExecutiveRecommendation {
  id: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  owner?: string
  priority?: 'critical' | 'high' | 'medium' | 'low'
}

export type ManagementAlertSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface ManagementAlertRecord {
  id: string
  title: string
  description?: string
  severity: ManagementAlertSeverity
  businessImpact: string
  affectedSegment?: string
  recommendedAction?: string
  owner?: string
  status?: 'open' | 'in-progress' | 'resolved' | 'watching'
  financialImpact?: string
  count?: number
}

export interface ComparisonSelection {
  mode: IntelligenceComparisonMode
  primaryLabel: string
  secondaryLabel: string
  primaryKey?: string
  secondaryKey?: string
}

export interface ExecutiveSearchItem {
  id: string
  title: string
  subtitle?: string
  category:
    | 'client'
    | 'country'
    | 'application'
    | 'revenue'
    | 'employee'
    | 'marine'
    | 'action'
    | 'report'
    | 'section'
  href?: string
  onSelect?: () => void
}

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'pptx'

export interface ExportRequest {
  format: ExportFormat
  title: string
  filename?: string
  /** Opaque payload — dashboards supply their own serializable snapshot. */
  payload: unknown
}

export interface RefreshState {
  lastUpdatedAt: Date | null
  isRefreshing: boolean
  autoRefreshMs: number | null
}

export interface PredictivePanelModel {
  id: string
  title: string
  subtitle?: string
  horizonLabel: string
  projectedValue: string | number
  confidenceLabel?: string
  deltaLabel?: string
  notes?: string[]
}

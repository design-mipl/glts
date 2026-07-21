import type {
  DashboardAlertItem,
  DashboardKpiItem,
  DashboardProgressItem,
} from '../shared/types'
import type { MetricComparisonItem } from '../shared/widgets/common/MetricComparison'
import type { RecentActivityItem } from '../shared/widgets/common/RecentActivity'
import type { NotificationItem } from '../shared/widgets/common/NotificationPanel'
import type { RecentReportItem } from '../shared/widgets/common/RecentReports'
import type { RevenueSnapshotData } from '../shared/widgets/finance/RevenueSnapshot'
import type { CollectionSummaryData } from '../shared/widgets/finance/CollectionSummary'
import type { AgeingBucketValue } from '../shared/widgets/finance/AgeingAnalysis'
import type {
  DistributionSlice,
  NamedMetricPoint,
  TrendPoint,
} from '../shared/widgets/analytics/AnalyticsWidgets'

export interface AccountsDashboardFilters {
  date: string
  branch: string
  segment: string
  client: string
  invoiceStatus: string
  collectionStatus: string
  vendor: string
  country: string
  search: string
}

export interface AccountsCollectionRow {
  id: string
  invoiceNumber: string
  client: string
  branch: string
  outstandingAmount: string
  dueDate: string
  ageBucket: string
  status: string
  assignedExecutive: string
}

export interface AccountsInvoiceRow {
  id: string
  invoiceNumber: string
  client: string
  application: string
  invoiceDate: string
  amount: string
  status: string
  approval: string
}

export interface AccountsReconciliationRow {
  id: string
  reference: string
  vendor: string
  category: string
  amount: string
  status: string
  dueDate: string
  assignedTo: string
}

export interface AccountsQuickActionDefinition {
  id: string
  title: string
  description?: string
  badge?: string
  href: string
}

export interface AccountsDashboardData {
  quickStats: DashboardKpiItem[]
  notifications: NotificationItem[]
  revenueSnapshot: RevenueSnapshotData
  collectionSummary: CollectionSummaryData
  ageingBuckets: AgeingBucketValue[]
  recentActivity: RecentActivityItem[]
  quickActions: AccountsQuickActionDefinition[]
  collectionRows: AccountsCollectionRow[]
  invoiceStats: DashboardKpiItem[]
  invoiceRows: AccountsInvoiceRow[]
  invoiceActivity: RecentActivityItem[]
  invoiceNotifications: NotificationItem[]
  reconciliationSummary: CollectionSummaryData
  reconciliationRows: AccountsReconciliationRow[]
  reconciliationActivity: RecentActivityItem[]
  branchPerformance: NamedMetricPoint[]
  countryDistribution: DistributionSlice[]
  businessSegments: DistributionSlice[]
  processingTrend: TrendPoint[]
  metricComparison: MetricComparisonItem[]
  riskAlerts: DashboardAlertItem[]
  slaOverview: DashboardProgressItem[]
  recentReports: RecentReportItem[]
  reportNotifications: NotificationItem[]
}

export interface AccountsDashboardTabProps {
  data: AccountsDashboardData
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onOpenInvoice?: (invoiceId: string) => void
  onOpenCollection?: (rowId: string) => void
  onOpenReconciliation?: (rowId: string) => void
}

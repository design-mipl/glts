import type {
  AccountsActivityRow,
  AccountsDashboardFilters,
  AccountsKpiMetric,
  AgeingBucketSlice,
  CollectionPerformanceSnapshot,
  FinancialAlert,
  InvoicePostingRow,
  InvoiceSubmissionRow,
  OutstandingCollectionRow,
  PendingCollectionRow,
  PurchaseVsRevenueSnapshot,
  ReconciliationRow,
  RevenueOverviewSnapshot,
  TopRevenueRow,
  VendorPaymentRow,
} from '../data/accountsDashboardMock'

function matchesBranch(branch: string, filterBranch: string): boolean {
  if (filterBranch === 'all') return true
  return branch === filterBranch
}

function matchesCustomerType(customerType: string, filterType: string): boolean {
  if (filterType === 'all') return true
  return customerType === filterType
}

function matchesCompany(company: string, filterCompany: string): boolean {
  if (filterCompany === 'all') return true
  return company === filterCompany
}

function matchesInvoiceStatus(status: string, filterStatus: string): boolean {
  if (filterStatus === 'all') return true
  return status === filterStatus
}

export function getAccountsFilterScaleFactor(filters: AccountsDashboardFilters): number {
  let factor = 1
  if (filters.branch !== 'all') factor *= 0.55
  if (filters.customerType !== 'all') factor *= 0.6
  if (filters.company !== 'all') factor *= 0.4
  if (filters.invoiceStatus !== 'all') factor *= 0.65
  if (filters.dateRange[0] || filters.dateRange[1]) factor *= 0.9
  return factor
}

function scaleCount(value: number, filters: AccountsDashboardFilters): number {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return value
  return Math.max(0, Math.round(value * factor))
}

export function filterPendingCollections(
  rows: PendingCollectionRow[],
  filters: AccountsDashboardFilters,
): PendingCollectionRow[] {
  return rows
    .filter(
      (row) =>
        matchesBranch(row.branch, filters.branch) &&
        matchesCustomerType(row.customerType, filters.customerType) &&
        matchesCompany(row.company, filters.company) &&
        matchesInvoiceStatus(row.invoiceStatus, filters.invoiceStatus),
    )
    .sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1
      if (a.overdueDays !== b.overdueDays) return b.overdueDays - a.overdueDays
      if (a.followUpDateSort !== b.followUpDateSort) return a.followUpDateSort - b.followUpDateSort
      return b.outstandingAmountSort - a.outstandingAmountSort
    })
}

export function filterInvoicePostingQueue(
  rows: InvoicePostingRow[],
  filters: AccountsDashboardFilters,
): InvoicePostingRow[] {
  return rows.filter(
    (row) =>
      matchesBranch(row.branch, filters.branch) &&
      matchesCustomerType(row.customerType, filters.customerType) &&
      matchesCompany(row.company, filters.company),
  )
}

export function filterVendorPayments(
  rows: VendorPaymentRow[],
  filters: AccountsDashboardFilters,
): VendorPaymentRow[] {
  return rows
    .filter((row) => matchesBranch(row.branch, filters.branch))
    .sort((a, b) => a.dueDateSort - b.dueDateSort)
}

export function filterReconciliationQueue(
  rows: ReconciliationRow[],
  filters: AccountsDashboardFilters,
): ReconciliationRow[] {
  return rows.filter((row) => matchesBranch(row.branch, filters.branch))
}

export function filterOutstandingCollections(
  rows: OutstandingCollectionRow[],
  filters: AccountsDashboardFilters,
): OutstandingCollectionRow[] {
  return rows.filter(
    (row) =>
      matchesBranch(row.branch, filters.branch) &&
      matchesCustomerType(row.customerType, filters.customerType) &&
      matchesCompany(row.company, filters.company),
  )
}

export function filterInvoiceSubmissions(
  rows: InvoiceSubmissionRow[],
  filters: AccountsDashboardFilters,
): InvoiceSubmissionRow[] {
  return rows
    .filter((row) => matchesBranch(row.branch, filters.branch))
    .sort((a, b) => a.submissionDateSort - b.submissionDateSort)
}

export function scaleAccountsKpis(
  kpis: AccountsKpiMetric[],
  filters: AccountsDashboardFilters,
): AccountsKpiMetric[] {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return kpis
  return kpis.map((kpi) => {
    const numericMatch = kpi.primaryValue.match(/^₹?([\d.]+)(L|Cr)?$/)
    if (numericMatch && kpi.id !== 'monthly-collection-rate') {
      const num = parseFloat(numericMatch[1])
      const suffix = numericMatch[2] ?? ''
      const scaled = Math.max(0, Math.round(num * factor * 10) / 10)
      return { ...kpi, primaryValue: `₹${scaled}${suffix}` }
    }
    if (/^\d+$/.test(kpi.primaryValue)) {
      return { ...kpi, primaryValue: String(scaleCount(parseInt(kpi.primaryValue, 10), filters)) }
    }
    return kpi
  })
}

export function scaleFinancialAlerts(
  alerts: FinancialAlert[],
  filters: AccountsDashboardFilters,
): FinancialAlert[] {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return alerts
  return alerts.map((alert) => ({
    ...alert,
    count: scaleCount(alert.count, filters),
  }))
}

export function scaleAgeingAnalysis(
  slices: AgeingBucketSlice[],
  filters: AccountsDashboardFilters,
): AgeingBucketSlice[] {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return slices
  return slices.map((slice) => ({
    ...slice,
    value: scaleCount(slice.value, filters),
  }))
}

export function scaleTopRevenueRows(
  rows: TopRevenueRow[],
  filters: AccountsDashboardFilters,
): TopRevenueRow[] {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return rows
  return rows.map((row) => ({
    ...row,
    sharePercent: Math.max(1, Math.round(row.sharePercent * factor)),
  }))
}

export function scaleRevenueOverview(
  snapshot: RevenueOverviewSnapshot,
  filters: AccountsDashboardFilters,
): RevenueOverviewSnapshot {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return snapshot
  const scaleValue = (value: string) => {
    const match = value.match(/^₹([\d.]+)(L|Cr)$/)
    if (!match) return value
    const scaled = Math.max(0, Math.round(parseFloat(match[1]) * factor * 10) / 10)
    return `₹${scaled}${match[2]}`
  }
  return {
    today: scaleValue(snapshot.today),
    week: scaleValue(snapshot.week),
    month: scaleValue(snapshot.month),
    monthToDate: scaleValue(snapshot.monthToDate),
    yearToDate: scaleValue(snapshot.yearToDate),
  }
}

export function scaleCollectionPerformance(
  snapshot: CollectionPerformanceSnapshot,
  filters: AccountsDashboardFilters,
): CollectionPerformanceSnapshot {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return snapshot
  return {
    ...snapshot,
    monthlyTrend: snapshot.monthlyTrend.map((point) => ({
      ...point,
      value: Math.max(0, Math.min(100, Math.round(point.value * (0.85 + factor * 0.15)))),
    })),
  }
}

export function scalePurchaseVsRevenue(
  snapshot: PurchaseVsRevenueSnapshot,
  filters: AccountsDashboardFilters,
): PurchaseVsRevenueSnapshot {
  const factor = getAccountsFilterScaleFactor(filters)
  if (factor === 1) return snapshot
  const scaleCurrency = (value: string) => {
    const match = value.match(/^₹([\d.]+)(L|Cr)$/)
    if (!match) return value
    const scaled = Math.max(0, Math.round(parseFloat(match[1]) * factor * 10) / 10)
    return `₹${scaled}${match[2]}`
  }
  return {
    ...snapshot,
    purchaseCost: scaleCurrency(snapshot.purchaseCost),
    vendorCost: scaleCurrency(snapshot.vendorCost),
    revenue: scaleCurrency(snapshot.revenue),
    profitMargin: scaleCurrency(snapshot.profitMargin),
    trend: snapshot.trend.map((point) => ({
      ...point,
      revenue: Math.round(point.revenue * factor),
      purchase: Math.round(point.purchase * factor),
    })),
  }
}

export function filterAccountsActivity(
  rows: AccountsActivityRow[],
  executiveName: string,
): AccountsActivityRow[] {
  return rows
    .filter((row) => row.user === executiveName)
    .sort((a, b) => b.timestampSort - a.timestampSort)
}

export function ageingBucketColor(bucket: string): 'success' | 'warning' | 'error' | 'neutral' {
  if (bucket.includes('180')) return 'error'
  if (bucket.includes('90') || bucket.includes('60')) return 'error'
  if (bucket.includes('45')) return 'warning'
  return 'neutral'
}

export function collectionStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const lower = status.toLowerCase()
  if (lower.includes('overdue') || lower.includes('escalated')) return 'error'
  if (lower.includes('partial') || lower.includes('follow-up')) return 'warning'
  if (lower.includes('paid') || lower.includes('promised')) return 'success'
  if (lower.includes('awaiting')) return 'info'
  return 'neutral'
}

export function paymentStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const lower = status.toLowerCase()
  if (lower.includes('overdue')) return 'error'
  if (lower.includes('due today')) return 'warning'
  if (lower.includes('paid') || lower.includes('completed')) return 'success'
  if (lower.includes('scheduled')) return 'info'
  return 'neutral'
}

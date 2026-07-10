import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminSession } from '@/pages/admin/hooks/useAdminSession'
import {
  ACCOUNTS_ACTIVITY_TODAY,
  ACCOUNTS_KPIS,
  AGEING_ANALYSIS,
  COLLECTION_PERFORMANCE,
  DAILY_REPORTS,
  DEFAULT_ACCOUNTS_DASHBOARD_FILTERS,
  FINANCIAL_ALERTS,
  INVOICE_POSTING_QUEUE,
  INVOICE_SUBMISSIONS,
  MOCK_ACCOUNTS_EXECUTIVE_NAME,
  OUTSTANDING_COLLECTIONS,
  PENDING_COLLECTIONS,
  PURCHASE_VS_REVENUE,
  RECONCILIATION_QUEUE,
  REVENUE_BY_SEGMENT,
  REVENUE_OVERVIEW,
  TOP_CLIENTS,
  TOP_COUNTRIES,
  VENDOR_PAYMENTS,
  type AccountsDashboardFilters,
} from '../data/accountsDashboardMock'
import {
  filterAccountsActivity,
  filterInvoicePostingQueue,
  filterInvoiceSubmissions,
  filterOutstandingCollections,
  filterPendingCollections,
  filterReconciliationQueue,
  filterVendorPayments,
  scaleAccountsKpis,
  scaleAgeingAnalysis,
  scaleCollectionPerformance,
  scaleFinancialAlerts,
  scalePurchaseVsRevenue,
  scaleRevenueOverview,
  scaleTopRevenueRows,
} from '../utils/applyAccountsDashboardFilters'

export type AccountsDashboardStatus = 'loading' | 'ready' | 'error'

const LOAD_DELAY_MS = 400

export function useAccountsDashboard() {
  const { user } = useAdminSession()
  const executiveName =
    user.name === 'GLTS Admin' ? MOCK_ACCOUNTS_EXECUTIVE_NAME : user.name

  const [filters, setFilters] = useState<AccountsDashboardFilters>(
    DEFAULT_ACCOUNTS_DASHBOARD_FILTERS,
  )
  const [status, setStatus] = useState<AccountsDashboardStatus>('loading')
  const [loadKey, setLoadKey] = useState(0)

  useEffect(() => {
    setStatus('loading')
    const timer = window.setTimeout(() => setStatus('ready'), LOAD_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [loadKey, executiveName])

  const retry = useCallback(() => setLoadKey((key) => key + 1), [])

  const kpis = useMemo(() => scaleAccountsKpis(ACCOUNTS_KPIS, filters), [filters])
  const pendingCollections = useMemo(
    () => filterPendingCollections(PENDING_COLLECTIONS, filters),
    [filters],
  )
  const invoicePostingQueue = useMemo(
    () => filterInvoicePostingQueue(INVOICE_POSTING_QUEUE, filters),
    [filters],
  )
  const vendorPayments = useMemo(
    () => filterVendorPayments(VENDOR_PAYMENTS, filters),
    [filters],
  )
  const reconciliationQueue = useMemo(
    () => filterReconciliationQueue(RECONCILIATION_QUEUE, filters),
    [filters],
  )
  const outstandingCollections = useMemo(
    () => filterOutstandingCollections(OUTSTANDING_COLLECTIONS, filters),
    [filters],
  )
  const invoiceSubmissions = useMemo(
    () => filterInvoiceSubmissions(INVOICE_SUBMISSIONS, filters),
    [filters],
  )
  const revenueOverview = useMemo(
    () => scaleRevenueOverview(REVENUE_OVERVIEW, filters),
    [filters],
  )
  const collectionPerformance = useMemo(
    () => scaleCollectionPerformance(COLLECTION_PERFORMANCE, filters),
    [filters],
  )
  const ageingAnalysis = useMemo(
    () => scaleAgeingAnalysis(AGEING_ANALYSIS, filters),
    [filters],
  )
  const topClients = useMemo(() => scaleTopRevenueRows(TOP_CLIENTS, filters), [filters])
  const topCountries = useMemo(() => scaleTopRevenueRows(TOP_COUNTRIES, filters), [filters])
  const revenueBySegment = useMemo(
    () => scaleTopRevenueRows(REVENUE_BY_SEGMENT, filters),
    [filters],
  )
  const purchaseVsRevenue = useMemo(
    () => scalePurchaseVsRevenue(PURCHASE_VS_REVENUE, filters),
    [filters],
  )
  const dailyReports = useMemo(() => DAILY_REPORTS, [])
  const financialAlerts = useMemo(
    () => scaleFinancialAlerts(FINANCIAL_ALERTS, filters),
    [filters],
  )
  const accountsActivity = useMemo(
    () => filterAccountsActivity(ACCOUNTS_ACTIVITY_TODAY, executiveName),
    [executiveName],
  )

  const getPendingCollectionCellValue = useCallback(
    (row: (typeof PENDING_COLLECTIONS)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getInvoicePostingCellValue = useCallback(
    (row: (typeof INVOICE_POSTING_QUEUE)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getVendorPaymentCellValue = useCallback(
    (row: (typeof VENDOR_PAYMENTS)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getReconciliationCellValue = useCallback(
    (row: (typeof RECONCILIATION_QUEUE)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getOutstandingCollectionCellValue = useCallback(
    (row: (typeof OUTSTANDING_COLLECTIONS)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getTopRevenueCellValue = useCallback(
    (row: (typeof TOP_CLIENTS)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getActivityCellValue = useCallback(
    (row: (typeof ACCOUNTS_ACTIVITY_TODAY)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )

  return {
    executiveName,
    filters,
    setFilters,
    status,
    retry,
    kpis,
    pendingCollections,
    invoicePostingQueue,
    vendorPayments,
    reconciliationQueue,
    outstandingCollections,
    invoiceSubmissions,
    revenueOverview,
    collectionPerformance,
    ageingAnalysis,
    topClients,
    topCountries,
    revenueBySegment,
    purchaseVsRevenue,
    dailyReports,
    financialAlerts,
    accountsActivity,
    getPendingCollectionCellValue,
    getInvoicePostingCellValue,
    getVendorPaymentCellValue,
    getReconciliationCellValue,
    getOutstandingCollectionCellValue,
    getTopRevenueCellValue,
    getActivityCellValue,
  }
}

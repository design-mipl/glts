import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminSession } from '@/pages/admin/hooks/useAdminSession'
import {
  APPOINTMENT_SUBMISSION_QUEUE,
  AWAITING_DOCUMENTS,
  CORRECTION_REQUESTS,
  DEFAULT_OPERATIONS_DASHBOARD_FILTERS,
  MARINE_PRIORITY_CASES,
  MOCK_CONSULTANT_NAME,
  MY_ACTIVITY_TODAY,
  MY_APPLICATIONS,
  MY_PERFORMANCE_METRICS,
  OPERATIONS_CRITICAL_ALERTS,
  OPERATIONS_KPIS,
  REVIEW_QC_QUEUE,
  TODAY_TASKS,
  type OperationsDashboardFilters,
} from '../data/operationsConsultantDashboardMock'
import {
  filterAppointmentSubmissionQueue,
  filterAwaitingDocuments,
  filterCorrectionRequests,
  filterMarinePriorityCases,
  filterMyActivity,
  filterMyApplications,
  filterReviewQcQueue,
  filterTodayTasks,
  scaleMyPerformance,
  scaleOperationsAlerts,
  scaleOperationsKpis,
} from '../utils/applyOperationsConsultantFilters'

export type OperationsConsultantDashboardStatus = 'loading' | 'ready' | 'error'

const LOAD_DELAY_MS = 400

export function useOperationsConsultantDashboard() {
  const { user } = useAdminSession()
  const consultantName = user.name === 'GLTS Admin' ? MOCK_CONSULTANT_NAME : user.name

  const [filters, setFilters] = useState<OperationsDashboardFilters>(
    DEFAULT_OPERATIONS_DASHBOARD_FILTERS,
  )
  const [status, setStatus] = useState<OperationsConsultantDashboardStatus>('loading')
  const [loadKey, setLoadKey] = useState(0)

  useEffect(() => {
    setStatus('loading')
    const timer = window.setTimeout(() => setStatus('ready'), LOAD_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [loadKey, consultantName])

  const retry = useCallback(() => setLoadKey((key) => key + 1), [])

  const kpis = useMemo(
    () => scaleOperationsKpis(OPERATIONS_KPIS, filters),
    [filters],
  )
  const myApplications = useMemo(
    () => filterMyApplications(MY_APPLICATIONS, filters, consultantName),
    [filters, consultantName],
  )
  const todayTasks = useMemo(
    () => filterTodayTasks(TODAY_TASKS, consultantName),
    [consultantName],
  )
  const correctionRequests = useMemo(
    () => filterCorrectionRequests(CORRECTION_REQUESTS, consultantName),
    [consultantName],
  )
  const awaitingDocuments = useMemo(
    () => filterAwaitingDocuments(AWAITING_DOCUMENTS, filters, consultantName),
    [filters, consultantName],
  )
  const reviewQcQueue = useMemo(
    () => filterReviewQcQueue(REVIEW_QC_QUEUE, filters, consultantName),
    [filters, consultantName],
  )
  const appointmentSubmissionQueue = useMemo(
    () => filterAppointmentSubmissionQueue(APPOINTMENT_SUBMISSION_QUEUE, filters, consultantName),
    [filters, consultantName],
  )
  const marinePriorityCases = useMemo(
    () => filterMarinePriorityCases(MARINE_PRIORITY_CASES, consultantName),
    [consultantName],
  )
  const criticalAlerts = useMemo(
    () => scaleOperationsAlerts(OPERATIONS_CRITICAL_ALERTS, filters),
    [filters],
  )
  const myActivity = useMemo(
    () => filterMyActivity(MY_ACTIVITY_TODAY, consultantName),
    [consultantName],
  )
  const myPerformance = useMemo(
    () => scaleMyPerformance(MY_PERFORMANCE_METRICS, filters),
    [filters],
  )

  const getMyApplicationCellValue = useCallback(
    (row: (typeof MY_APPLICATIONS)[number], key: string) => String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getCorrectionCellValue = useCallback(
    (row: (typeof CORRECTION_REQUESTS)[number], key: string) => String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getAwaitingDocumentCellValue = useCallback(
    (row: (typeof AWAITING_DOCUMENTS)[number], key: string) => String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getReviewQcCellValue = useCallback(
    (row: (typeof REVIEW_QC_QUEUE)[number], key: string) => String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getAppointmentSubmissionCellValue = useCallback(
    (row: (typeof APPOINTMENT_SUBMISSION_QUEUE)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getMarinePriorityCellValue = useCallback(
    (row: (typeof MARINE_PRIORITY_CASES)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getMyActivityCellValue = useCallback(
    (row: (typeof MY_ACTIVITY_TODAY)[number], key: string) => String(row[key as keyof typeof row] ?? ''),
    [],
  )

  return {
    consultantName,
    filters,
    setFilters,
    status,
    retry,
    kpis,
    myApplications,
    todayTasks,
    correctionRequests,
    awaitingDocuments,
    reviewQcQueue,
    appointmentSubmissionQueue,
    marinePriorityCases,
    criticalAlerts,
    myActivity,
    myPerformance,
    getMyApplicationCellValue,
    getCorrectionCellValue,
    getAwaitingDocumentCellValue,
    getReviewQcCellValue,
    getAppointmentSubmissionCellValue,
    getMarinePriorityCellValue,
    getMyActivityCellValue,
  }
}

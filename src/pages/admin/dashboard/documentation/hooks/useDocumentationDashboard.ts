import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminSession } from '@/pages/admin/hooks/useAdminSession'
import {
  APPOINTMENTS_TO_BOOK,
  DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS,
  DOC_CORRECTION_REQUESTS,
  DOC_REVIEW_QC_QUEUE,
  DOCUMENTATION_ACTIVITY_TODAY,
  DOCUMENTATION_APPLICATIONS,
  DOCUMENTATION_CRITICAL_ALERTS,
  DOCUMENTATION_KPIS,
  DOCUMENTATION_PERFORMANCE_METRICS,
  FEES_TO_PAY_TODAY,
  FORMS_TO_FILL_TODAY,
  MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  READY_FOR_SUBMISSION,
  SUBMISSION_PENDING,
  type DocumentationDashboardFilters,
} from '../data/documentationDashboardMock'
import {
  filterAppointmentsToBook,
  filterDocCorrectionRequests,
  filterDocReviewQc,
  filterDocumentationActivity,
  filterDocumentationApplications,
  filterFeesToPay,
  filterFormsToFill,
  filterReadyForSubmission,
  filterSubmissionPending,
  getMinutesSinceLastActivity,
  isBusinessHours,
  scaleDocumentationAlerts,
  scaleDocumentationKpis,
  scaleDocumentationPerformance,
} from '../utils/applyDocumentationDashboardFilters'

export type DocumentationDashboardStatus = 'loading' | 'ready' | 'error'

const LOAD_DELAY_MS = 400

export function useDocumentationDashboard() {
  const { user } = useAdminSession()
  const executiveName =
    user.name === 'GLTS Admin' ? MOCK_DOCUMENTATION_EXECUTIVE_NAME : user.name

  const [filters, setFilters] = useState<DocumentationDashboardFilters>(
    DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS,
  )
  const [status, setStatus] = useState<DocumentationDashboardStatus>('loading')
  const [loadKey, setLoadKey] = useState(0)

  useEffect(() => {
    setStatus('loading')
    const timer = window.setTimeout(() => setStatus('ready'), LOAD_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [loadKey, executiveName])

  const retry = useCallback(() => setLoadKey((key) => key + 1), [])

  const kpis = useMemo(() => scaleDocumentationKpis(DOCUMENTATION_KPIS, filters), [filters])
  const myApplications = useMemo(
    () => filterDocumentationApplications(DOCUMENTATION_APPLICATIONS, filters, executiveName),
    [filters, executiveName],
  )
  const formsToFill = useMemo(
    () => filterFormsToFill(FORMS_TO_FILL_TODAY, filters, executiveName),
    [filters, executiveName],
  )
  const feesToPay = useMemo(
    () => filterFeesToPay(FEES_TO_PAY_TODAY, filters, executiveName),
    [filters, executiveName],
  )
  const appointmentsToBook = useMemo(
    () => filterAppointmentsToBook(APPOINTMENTS_TO_BOOK, filters, executiveName),
    [filters, executiveName],
  )
  const reviewQcQueue = useMemo(
    () => filterDocReviewQc(DOC_REVIEW_QC_QUEUE, filters, executiveName),
    [filters, executiveName],
  )
  const correctionRequests = useMemo(
    () => filterDocCorrectionRequests(DOC_CORRECTION_REQUESTS, executiveName),
    [executiveName],
  )
  const readyForSubmission = useMemo(
    () => filterReadyForSubmission(READY_FOR_SUBMISSION, filters, executiveName),
    [filters, executiveName],
  )
  const submissionPending = useMemo(
    () => filterSubmissionPending(SUBMISSION_PENDING, filters, executiveName),
    [filters, executiveName],
  )
  const criticalAlerts = useMemo(
    () => scaleDocumentationAlerts(DOCUMENTATION_CRITICAL_ALERTS, filters),
    [filters],
  )
  const myActivity = useMemo(
    () => filterDocumentationActivity(DOCUMENTATION_ACTIVITY_TODAY, executiveName),
    [executiveName],
  )
  const myPerformance = useMemo(
    () => scaleDocumentationPerformance(DOCUMENTATION_PERFORMANCE_METRICS, filters),
    [filters],
  )

  const minutesSinceLastActivity = useMemo(
    () => getMinutesSinceLastActivity(myActivity),
    [myActivity],
  )
  const showInactivityWarning = useMemo(
    () =>
      isBusinessHours() &&
      minutesSinceLastActivity !== null &&
      minutesSinceLastActivity > 60,
    [minutesSinceLastActivity],
  )

  const getApplicationCellValue = useCallback(
    (row: (typeof DOCUMENTATION_APPLICATIONS)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getFormCellValue = useCallback(
    (row: (typeof FORMS_TO_FILL_TODAY)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getFeeCellValue = useCallback(
    (row: (typeof FEES_TO_PAY_TODAY)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getAppointmentCellValue = useCallback(
    (row: (typeof APPOINTMENTS_TO_BOOK)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getReviewQcCellValue = useCallback(
    (row: (typeof DOC_REVIEW_QC_QUEUE)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getCorrectionCellValue = useCallback(
    (row: (typeof DOC_CORRECTION_REQUESTS)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getReadySubmissionCellValue = useCallback(
    (row: (typeof READY_FOR_SUBMISSION)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getSubmissionPendingCellValue = useCallback(
    (row: (typeof SUBMISSION_PENDING)[number], key: string) =>
      String(row[key as keyof typeof row] ?? ''),
    [],
  )
  const getActivityCellValue = useCallback(
    (row: (typeof DOCUMENTATION_ACTIVITY_TODAY)[number], key: string) =>
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
    myApplications,
    formsToFill,
    feesToPay,
    appointmentsToBook,
    reviewQcQueue,
    correctionRequests,
    readyForSubmission,
    submissionPending,
    criticalAlerts,
    myActivity,
    myPerformance,
    showInactivityWarning,
    minutesSinceLastActivity,
    getApplicationCellValue,
    getFormCellValue,
    getFeeCellValue,
    getAppointmentCellValue,
    getReviewQcCellValue,
    getCorrectionCellValue,
    getReadySubmissionCellValue,
    getSubmissionPendingCellValue,
    getActivityCellValue,
  }
}

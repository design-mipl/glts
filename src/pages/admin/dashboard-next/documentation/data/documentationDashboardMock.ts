import { APPLICATION_PIPELINE_STAGE_IDS } from '../../shared/config/applicationPipeline'
import type { DocumentationDashboardData, DocumentationDashboardFilters } from '../types'
import {
  APPOINTMENTS_TO_BOOK,
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
} from '@/pages/admin/dashboard/documentation/data/documentationDashboardMock'
import {
  computeShowInactivityWarning,
  filterAppointmentsToBook,
  filterDocCorrectionRequests,
  filterDocReviewQc,
  filterDocumentationActivity,
  filterDocumentationApplications,
  filterFeesToPay,
  filterFormsToFill,
  filterReadyForSubmission,
  filterSubmissionPending,
  getDocumentationFilterScaleFactor,
  getMinutesSinceLastActivity,
  scaleDocumentationAlerts,
  scaleDocumentationPerformance,
} from '../utils/applyDocumentationDashboardFilters'

export const DOC_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
]

export const DOC_COUNTRY_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'Germany', value: 'Germany' },
]

export const DOC_APPLICATION_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
]

export const DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS: DocumentationDashboardFilters = {
  date: 'today',
  country: 'all',
  applicationType: 'all',
  search: '',
}

function kpiToQuickStat(kpi: (typeof DOCUMENTATION_KPIS)[number]) {
  return {
    id: kpi.id,
    label: kpi.label,
    value: kpi.total,
    delta: kpi.overdue > 0 ? kpi.overdue : kpi.dueToday,
    deltaLabel: `${kpi.dueToday} due today · ${kpi.overdue} overdue`,
  }
}

function scaleKpis(filters: DocumentationDashboardFilters) {
  const factor = getDocumentationFilterScaleFactor(filters)
  if (factor === 1) return DOCUMENTATION_KPIS.map(kpiToQuickStat)
  return DOCUMENTATION_KPIS.map((kpi) => {
    const scaled = {
      ...kpi,
      total: Math.max(0, Math.round(kpi.total * factor)),
      dueToday: Math.max(0, Math.round(kpi.dueToday * factor)),
      overdue: Math.max(0, Math.round(kpi.overdue * factor)),
    }
    return kpiToQuickStat(scaled)
  })
}

function mapCriticalAlerts(
  filters: DocumentationDashboardFilters,
): DocumentationDashboardData['criticalAlerts'] {
  return scaleDocumentationAlerts(DOCUMENTATION_CRITICAL_ALERTS, filters).map((alert) => ({
    id: alert.id,
    title: alert.title,
    description: `Oldest waiting ${alert.oldestWaiting}`,
    severity:
      alert.priority === 'critical'
        ? ('critical' as const)
        : alert.priority === 'high'
          ? ('warning' as const)
          : ('info' as const),
    count: alert.count,
  }))
}

function mapNotifications(): DocumentationDashboardData['notifications'] {
  return [
    {
      id: 'doc-n1',
      title: 'Pending QC > 4 Hours',
      body: '2 applications need your review decision.',
      unread: true,
      createdAt: '5h 10m ago',
    },
    {
      id: 'doc-n2',
      title: 'SLA breached on GL-2026-01471',
      body: 'Crew transit case requires immediate QC.',
      unread: true,
      createdAt: '2h ago',
    },
    {
      id: 'doc-n3',
      title: 'Fee payment due today',
      body: 'US VAC fee for Ananya Desai — 12:00 PM.',
      unread: false,
      createdAt: '45 min ago',
    },
  ]
}

const DOC_PIPELINE_COUNTS: Record<
  (typeof APPLICATION_PIPELINE_STAGE_IDS)[number],
  { count: number; averageAgeHours: number; delayedCount: number; slaPercent: number }
> = {
  draft: { count: 2, averageAgeHours: 6, delayedCount: 0, slaPercent: 100 },
  'awaiting-documents': { count: 4, averageAgeHours: 20, delayedCount: 1, slaPercent: 88 },
  verification: { count: 5, averageAgeHours: 12, delayedCount: 1, slaPercent: 90 },
  qc: { count: 5, averageAgeHours: 9, delayedCount: 2, slaPercent: 84 },
  appointment: { count: 2, averageAgeHours: 16, delayedCount: 0, slaPercent: 92 },
  submission: { count: 4, averageAgeHours: 8, delayedCount: 1, slaPercent: 86 },
  embassy: { count: 3, averageAgeHours: 36, delayedCount: 1, slaPercent: 82 },
  collection: { count: 1, averageAgeHours: 10, delayedCount: 0, slaPercent: 100 },
  dispatch: { count: 1, averageAgeHours: 5, delayedCount: 0, slaPercent: 100 },
  delivered: { count: 6, averageAgeHours: 0, delayedCount: 0, slaPercent: 100 },
}

function mapPendingVerification(
  rows: typeof DOC_REVIEW_QC_QUEUE,
): DocumentationDashboardData['pendingVerification'] {
  return rows.map((row) => ({
    id: row.id,
    glNumber: row.applicationId,
    applicant: row.applicant,
    company: row.country,
    consultant: row.executive,
    priority:
      row.slaStatus === 'breached'
        ? ('critical' as const)
        : row.slaStatus === 'at_risk'
          ? ('high' as const)
          : ('medium' as const),
    waitingTime: row.slaTimer,
  }))
}

function mapRecentActivity(
  rows: ReturnType<typeof filterDocumentationActivity>,
): DocumentationDashboardData['recentActivity'] {
  return rows.map((row) => ({
    id: row.id,
    primary: `${row.action} · ${row.application}`,
    secondary: `${row.timestamp} — ${row.result}`,
    badgeLabel: row.action,
    badgeColor: row.action.includes('Correction') ? ('warning' as const) : ('success' as const),
  }))
}

function buildBaseMock(executiveName: string): DocumentationDashboardData {
  const filters = DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS
  const activityRows = filterDocumentationActivity(DOCUMENTATION_ACTIVITY_TODAY, executiveName)
  const performanceMetrics = scaleDocumentationPerformance(
    DOCUMENTATION_PERFORMANCE_METRICS,
    filters,
  )

  return {
    executiveName,
    quickStats: scaleKpis(filters),
    notifications: mapNotifications(),
    criticalAlerts: mapCriticalAlerts(filters),
    pipelineStages: APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
      id,
      ...DOC_PIPELINE_COUNTS[id],
    })),
    pendingVerification: mapPendingVerification(
      filterDocReviewQc(DOC_REVIEW_QC_QUEUE, filters, executiveName),
    ),
    quickActions: [
      {
        id: 'qa-my-apps',
        title: 'My applications',
        description: 'Open assigned documentation queue',
        badge: String(DOCUMENTATION_APPLICATIONS.length),
        href: '/admin/application-management/marine',
      },
      {
        id: 'qa-qc',
        title: 'QC queue',
        description: 'Pending review decisions',
        badge: String(DOC_REVIEW_QC_QUEUE.length),
        href: '/admin/dashboard-next/documentation?tab=qc',
      },
      {
        id: 'qa-forms',
        title: 'Forms today',
        description: 'Embassy forms due',
        href: '/admin/dashboard-next/documentation?tab=processing',
      },
      {
        id: 'qa-submit',
        title: 'Ready to submit',
        description: 'Submission preparation',
        href: '/admin/dashboard-next/documentation?tab=submission',
      },
    ],
    myApplications: filterDocumentationApplications(
      DOCUMENTATION_APPLICATIONS,
      filters,
      executiveName,
    ),
    formsToFill: filterFormsToFill(FORMS_TO_FILL_TODAY, filters, executiveName),
    feesToPay: filterFeesToPay(FEES_TO_PAY_TODAY, filters, executiveName),
    appointmentsToBook: filterAppointmentsToBook(APPOINTMENTS_TO_BOOK, filters, executiveName),
    reviewQcQueue: filterDocReviewQc(DOC_REVIEW_QC_QUEUE, filters, executiveName),
    correctionRequests: filterDocCorrectionRequests(DOC_CORRECTION_REQUESTS, executiveName),
    readyForSubmission: filterReadyForSubmission(READY_FOR_SUBMISSION, filters, executiveName),
    submissionPending: filterSubmissionPending(SUBMISSION_PENDING, filters, executiveName),
    recentActivity: mapRecentActivity(activityRows),
    activityRows,
    performanceMetrics,
    metricComparison: performanceMetrics.map((m) => ({
      label: m.label,
      value: m.value,
      delta: m.id === 'avg_processing' ? undefined : 8.5,
    })),
    personalSla: [
      { id: 'doc-sla-day', label: 'Today SLA', value: 93, helperText: 'Target 95%' },
      { id: 'doc-sla-week', label: 'Week SLA', value: 91, helperText: 'Target 95%' },
    ],
    showInactivityWarning: computeShowInactivityWarning(activityRows),
    minutesSinceLastActivity: getMinutesSinceLastActivity(activityRows),
  }
}

export const DOCUMENTATION_DASHBOARD_MOCK: DocumentationDashboardData = buildBaseMock(
  MOCK_DOCUMENTATION_EXECUTIVE_NAME,
)

export function applyDocumentationDashboardFilters(
  data: DocumentationDashboardData,
  filters: DocumentationDashboardFilters,
  executiveName: string = data.executiveName,
): DocumentationDashboardData {
  const activityRows = filterDocumentationActivity(DOCUMENTATION_ACTIVITY_TODAY, executiveName)
  const performanceMetrics = scaleDocumentationPerformance(
    DOCUMENTATION_PERFORMANCE_METRICS,
    filters,
  )

  const next: DocumentationDashboardData = {
    ...data,
    executiveName,
    quickStats: scaleKpis(filters),
    criticalAlerts: mapCriticalAlerts(filters),
    pendingVerification: mapPendingVerification(
      filterDocReviewQc(DOC_REVIEW_QC_QUEUE, filters, executiveName),
    ),
    myApplications: filterDocumentationApplications(
      DOCUMENTATION_APPLICATIONS,
      filters,
      executiveName,
    ),
    formsToFill: filterFormsToFill(FORMS_TO_FILL_TODAY, filters, executiveName),
    feesToPay: filterFeesToPay(FEES_TO_PAY_TODAY, filters, executiveName),
    appointmentsToBook: filterAppointmentsToBook(APPOINTMENTS_TO_BOOK, filters, executiveName),
    reviewQcQueue: filterDocReviewQc(DOC_REVIEW_QC_QUEUE, filters, executiveName),
    correctionRequests: filterDocCorrectionRequests(DOC_CORRECTION_REQUESTS, executiveName),
    readyForSubmission: filterReadyForSubmission(READY_FOR_SUBMISSION, filters, executiveName),
    submissionPending: filterSubmissionPending(SUBMISSION_PENDING, filters, executiveName),
    recentActivity: mapRecentActivity(activityRows),
    activityRows,
    performanceMetrics,
    metricComparison: performanceMetrics.map((m) => ({
      label: m.label,
      value: m.value,
      delta: m.id === 'avg_processing' ? undefined : 8.5,
    })),
    showInactivityWarning: computeShowInactivityWarning(activityRows),
    minutesSinceLastActivity: getMinutesSinceLastActivity(activityRows),
  }

  const query = filters.search.trim().toLowerCase()
  if (!query) return next

  const matchSearch = (...parts: Array<string | undefined>) =>
    parts.some((part) => part?.toLowerCase().includes(query))

  return {
    ...next,
    myApplications: next.myApplications.filter((row) =>
      matchSearch(row.glNumber, row.applicant, row.company, row.country),
    ),
    reviewQcQueue: next.reviewQcQueue.filter((row) =>
      matchSearch(row.applicationId, row.applicant, row.country),
    ),
  }
}

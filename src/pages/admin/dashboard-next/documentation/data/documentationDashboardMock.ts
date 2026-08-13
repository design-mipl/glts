import {
  APPLICATION_PIPELINE_STAGE_IDS,
} from '../../shared/config/applicationPipeline'
import {
  OPS_QUEUE_AGEING_ROWS,
  emptyOpsQueueAgeingCounts,
  emptyOpsSegmentWorkloadCounts,
  type OpsOrgAgeingQueueRow,
  type OpsOrgSegmentWorkload,
  type OpsQueueAgeingBucketId,
} from '../../shared/widgets/operations/opsOrgQueueTypes'
import { isMarineApplicationInQueueTab } from '@/pages/admin/application-management/marine/config/marineApplicationListingTabs'
import { getAllMarineListingRows } from '@/pages/admin/application-management/marine/utils/marineApplicationListingUtils'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { DashboardKpiItem } from '../../shared/types'
import type {
  DocApplicationChannel,
  DocKpiTarget,
  DocQcOutcome,
  DocRankingPoint,
  DocWorkDeskId,
  DocumentationActivityRow,
  DocumentationDashboardData,
  DocumentationDashboardFilters,
  DocumentationToActionItem,
  DocumentationWorkRow,
} from '../types'
import { DOC_CHART_COLORS } from './documentationChartColors'
import { buildSubmissionByJurisdiction } from '../../shared/utils/buildSubmissionByJurisdiction'
import { MOCK_DOCUMENTATION_EXECUTIVE_NAME } from '@/pages/admin/dashboard/documentation/data/documentationDashboardMock'
import {
  computeShowInactivityWarning,
  getDocumentationFilterScaleFactor,
  getMinutesSinceLastActivity,
  isBusinessHours,
} from '../utils/applyDocumentationDashboardFilters'

export const DOC_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'MTD', value: 'mtd' },
  { label: 'QTD', value: 'qtd' },
  { label: 'YTD', value: 'ytd' },
  { label: 'Custom', value: 'custom' },
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
  { label: 'B2B agent', value: 'b2b' },
]

export const DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS: DocumentationDashboardFilters = {
  date: 'today',
  country: 'all',
  applicationType: 'all',
  search: '',
}

const QC_LABEL: Record<DocQcOutcome, string> = {
  pending_qc: 'Pending QC',
  ready: 'Verified & ready for submission',
  correction: 'Correction required',
  blocked: 'Document missing / blocked',
}

function href(gl: string) {
  return `/admin/application-management/marine/${gl}`
}

/** Submission Pending — Docs primary queue (QC → form → mark submitted). */
export const DOC_SUBMISSION_PENDING_ROWS: DocumentationWorkRow[] = [
  {
    id: 'sp1',
    glNumber: 'GL-2026-01471',
    applicant: 'MV Ocean Star / Crew',
    company: 'Harborline Shipping',
    country: 'Singapore',
    visaType: 'Crew Transit',
    nextAction: 'Complete QC checklist',
    qcOutcome: 'pending_qc',
    qcOutcomeLabel: QC_LABEL.pending_qc,
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'breached',
    slaTimer: 'Breached',
    dueDate: '30 Jul 2026',
    dueDateSort: 20260730,
    channel: 'marine',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01471'),
    desk: 'submission_pending',
  },
  {
    id: 'sp2',
    glNumber: 'GL-2026-01465',
    applicant: 'TechNova Solutions Ltd',
    company: 'TechNova Solutions Ltd',
    country: 'Germany',
    visaType: 'Business Schengen',
    nextAction: 'Fill embassy application form',
    qcOutcome: 'ready',
    qcOutcomeLabel: QC_LABEL.ready,
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'at_risk',
    slaTimer: '3h 20m',
    dueDate: '01 Aug 2026',
    dueDateSort: 20260801,
    channel: 'corporate',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01465'),
    desk: 'submission_pending',
  },
  {
    id: 'sp3',
    glNumber: 'GL-2026-01444',
    applicant: 'James Okafor',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Student',
    nextAction: 'Mark as submitted',
    qcOutcome: 'ready',
    qcOutcomeLabel: QC_LABEL.ready,
    waitingOn: 'Me',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '1d 4h',
    dueDate: '02 Aug 2026',
    dueDateSort: 20260802,
    channel: 'retail',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01444'),
    desk: 'submission_pending',
  },
  {
    id: 'sp4',
    glNumber: 'GL-2026-01439',
    applicant: 'Global Freight Partners',
    company: 'Skyline Travel Agents',
    country: 'Germany',
    visaType: 'Business Schengen',
    nextAction: 'Upload missing bank statement pages',
    qcOutcome: 'pending_qc',
    qcOutcomeLabel: QC_LABEL.pending_qc,
    waitingOn: 'Me',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '6h 00m',
    dueDate: '02 Aug 2026',
    dueDateSort: 20260802,
    channel: 'b2b',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01439'),
    desk: 'submission_pending',
  },
  {
    id: 'sp5',
    glNumber: 'GL-2026-01420',
    applicant: 'Ananya Desai',
    company: 'Individual',
    country: 'United States',
    visaType: 'B1/B2',
    nextAction: 'Complete QC checklist',
    qcOutcome: 'pending_qc',
    qcOutcomeLabel: QC_LABEL.pending_qc,
    waitingOn: 'Me',
    priority: 'low',
    slaStatus: 'on_track',
    slaTimer: '1d 8h',
    dueDate: '03 Aug 2026',
    dueDateSort: 20260803,
    channel: 'retail',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01420'),
    desk: 'submission_pending',
  },
  {
    id: 'sp6',
    glNumber: 'GL-2026-01412',
    applicant: 'Ravi Mehta / party of 3',
    company: 'Horizon Visa Desk',
    country: 'United Arab Emirates',
    visaType: 'Tourist',
    nextAction: 'Fill embassy application form',
    qcOutcome: 'ready',
    qcOutcomeLabel: QC_LABEL.ready,
    waitingOn: 'Me',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '10h 00m',
    dueDate: '03 Aug 2026',
    dueDateSort: 20260803,
    channel: 'b2b',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01412'),
    desk: 'submission_pending',
  },
]

/** Pending Payment — Docs may update embassy/VFS fees. */
export const DOC_PENDING_PAYMENT_ROWS: DocumentationWorkRow[] = [
  {
    id: 'pp1',
    glNumber: 'GL-2026-01408',
    applicant: 'Sneha Pillai',
    company: 'Individual',
    country: 'Singapore',
    visaType: 'Employment',
    nextAction: 'Update embassy / VFS fee payment',
    qcOutcome: 'ready',
    qcOutcomeLabel: QC_LABEL.ready,
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'at_risk',
    slaTimer: '2h 15m',
    dueDate: '31 Jul 2026',
    dueDateSort: 20260731,
    channel: 'retail',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01408'),
    desk: 'pending_payment',
  },
  {
    id: 'pp2',
    glNumber: 'GL-2026-01396',
    applicant: 'Apex Logistics Group',
    company: 'Apex Travel Agents',
    country: 'United Arab Emirates',
    visaType: 'Business',
    nextAction: 'Confirm fee payment status',
    qcOutcome: 'ready',
    qcOutcomeLabel: QC_LABEL.ready,
    waitingOn: 'Accounts',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '8h 00m',
    dueDate: '01 Aug 2026',
    dueDateSort: 20260801,
    channel: 'b2b',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01396'),
    desk: 'pending_payment',
  },
]

/** Arrange Insurance — GLTS travel insurance still pending booking. */
export const DOC_ARRANGE_INSURANCE_ROWS: DocumentationWorkRow[] = [
  {
    id: 'ai1',
    glNumber: 'GL-2026-01422',
    applicant: 'Rahul Mehta',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Visit',
    nextAction: 'Arrange travel insurance (GLTS)',
    qcOutcome: 'ready',
    qcOutcomeLabel: QC_LABEL.ready,
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'at_risk',
    slaTimer: '3h 40m',
    dueDate: '31 Jul 2026',
    dueDateSort: 20260731,
    channel: 'retail',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01422'),
    desk: 'arrange_insurance',
  },
  {
    id: 'ai2',
    glNumber: 'GL-2026-01388',
    applicant: 'Nordic Marine Ltd',
    company: 'Nordic Marine Ltd',
    country: 'United Arab Emirates',
    visaType: 'Crew Transit',
    nextAction: 'Confirm insurance certificate upload',
    qcOutcome: 'pending_qc',
    qcOutcomeLabel: QC_LABEL.pending_qc,
    waitingOn: 'Me',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '6h 20m',
    dueDate: '01 Aug 2026',
    dueDateSort: 20260801,
    channel: 'marine',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01388'),
    desk: 'arrange_insurance',
  },
  {
    id: 'ai3',
    glNumber: 'GL-2026-01355',
    applicant: 'BrightCorp India',
    company: 'BrightCorp India',
    country: 'Singapore',
    visaType: 'Business',
    nextAction: 'Book GLTS insurance for traveler',
    qcOutcome: 'ready',
    qcOutcomeLabel: QC_LABEL.ready,
    waitingOn: 'Me',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '10h 00m',
    dueDate: '02 Aug 2026',
    dueDateSort: 20260802,
    channel: 'corporate',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01355'),
    desk: 'arrange_insurance',
  },
]

/** Waiting on Ops — Docs flagged correction / blocked; lives in Verification Pending until Ops returns. */
export const DOC_WAITING_ON_OPS_ROWS: DocumentationWorkRow[] = [
  {
    id: 'wo1',
    glNumber: 'GL-2026-01451',
    applicant: 'Harborline Shipping',
    company: 'Harborline Shipping',
    country: 'United Arab Emirates',
    visaType: 'Crew Offshore',
    nextAction: 'Await Ops — correction required',
    qcOutcome: 'correction',
    qcOutcomeLabel: QC_LABEL.correction,
    waitingOn: 'Ops',
    priority: 'high',
    slaStatus: 'at_risk',
    slaTimer: '1d 2h',
    dueDate: '01 Aug 2026',
    dueDateSort: 20260801,
    channel: 'marine',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01451'),
    desk: 'waiting_on_ops',
  },
  {
    id: 'wo2',
    glNumber: 'GL-2026-01380',
    applicant: 'Priya Nair',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Student',
    nextAction: 'Await Ops — documents missing / blocked',
    qcOutcome: 'blocked',
    qcOutcomeLabel: QC_LABEL.blocked,
    waitingOn: 'Ops',
    priority: 'medium',
    slaStatus: 'breached',
    slaTimer: '2d 4h',
    dueDate: '30 Jul 2026',
    dueDateSort: 20260730,
    channel: 'retail',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01380'),
    desk: 'waiting_on_ops',
  },
  {
    id: 'wo3',
    glNumber: 'GL-2026-01372',
    applicant: 'Neha Kapoor',
    company: 'Voyage Partner Agents',
    country: 'Singapore',
    visaType: 'Visit',
    nextAction: 'Await Ops — correction required',
    qcOutcome: 'correction',
    qcOutcomeLabel: QC_LABEL.correction,
    waitingOn: 'Ops',
    priority: 'medium',
    slaStatus: 'at_risk',
    slaTimer: '18h 00m',
    dueDate: '01 Aug 2026',
    dueDateSort: 20260801,
    channel: 'b2b',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: href('GL-2026-01372'),
    desk: 'waiting_on_ops',
  },
]

const now = Date.now()
export const DOC_ACTIVITY_TODAY: DocumentationActivityRow[] = [
  {
    id: 'dact1',
    timestamp: '09:15 AM',
    action: 'QC Completed',
    application: 'GL-2026-01465',
    result: 'Verified & ready for submission',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 4 * 3600000),
  },
  {
    id: 'dact2',
    timestamp: '10:30 AM',
    action: 'Form Filled',
    application: 'GL-2026-01444',
    result: 'UK student form completed',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 2.5 * 3600000),
  },
  {
    id: 'dact3',
    timestamp: '11:45 AM',
    action: 'Correction Raised',
    application: 'GL-2026-01451',
    result: 'Sent to Ops — Verification Pending',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 1.25 * 3600000),
  },
  {
    id: 'dact4',
    timestamp: '12:20 PM',
    action: 'Payment Updated',
    application: 'GL-2026-01408',
    result: 'Embassy fee recorded',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 90 * 60000),
  },
]

const DOC_PIPELINE_COUNTS: Record<
  (typeof APPLICATION_PIPELINE_STAGE_IDS)[number],
  { count: number; averageAgeHours: number; delayedCount: number; slaPercent: number }
> = {
  draft: { count: 1, averageAgeHours: 4, delayedCount: 0, slaPercent: 100 },
  verification_pending: { count: 2, averageAgeHours: 28, delayedCount: 1, slaPercent: 75 },
  online_submission_pending: { count: 5, averageAgeHours: 10, delayedCount: 1, slaPercent: 88 },
  pending_payment: { count: 2, averageAgeHours: 12, delayedCount: 1, slaPercent: 86 },
  vfs_submission_pending: { count: 4, averageAgeHours: 20, delayedCount: 0, slaPercent: 94 },
  collection_pending: { count: 2, averageAgeHours: 16, delayedCount: 0, slaPercent: 96 },
  collected: { count: 3, averageAgeHours: 8, delayedCount: 0, slaPercent: 100 },
  dispatched: { count: 6, averageAgeHours: 0, delayedCount: 0, slaPercent: 100 },
}

/** Visibility KPI counts — redirect to AM only (no Work listing). */
const VISIBILITY_KPI = {
  vfs_submitted: 4,
  collection_pending: 2,
  collected: 3,
  dispatched: 6,
}

export const DOC_KPI_TARGETS: Record<string, DocKpiTarget> = {
  submission_pending: { kind: 'work', desk: 'submission_pending' },
  form_pending: { kind: 'work', desk: 'submission_pending' },
  pending_payment: { kind: 'work', desk: 'pending_payment' },
  vfs_submission_pending: { kind: 'am', tab: 'vfs_submission_pending' },
  collection_pending: { kind: 'am', tab: 'collection_pending' },
  collected: { kind: 'am', tab: 'collected' },
  dispatched: { kind: 'am', tab: 'dispatched' },
}

function filterRows(
  rows: DocumentationWorkRow[],
  filters: DocumentationDashboardFilters,
  executiveName: string,
): DocumentationWorkRow[] {
  return rows
    .filter((row) => row.executive === executiveName)
    .filter((row) => filters.country === 'all' || row.country === filters.country)
    .filter((row) => filters.applicationType === 'all' || row.channel === filters.applicationType)
    .sort((a, b) => {
      if (a.dueDateSort !== b.dueDateSort) return a.dueDateSort - b.dueDateSort
      const p = { high: 0, medium: 1, low: 2 }
      return p[a.priority] - p[b.priority]
    })
}

function buildHeroKpis(
  submission: DocumentationWorkRow[],
  payment: DocumentationWorkRow[],
  _waiting: DocumentationWorkRow[],
  filters: DocumentationDashboardFilters,
) {
  const factor = getDocumentationFilterScaleFactor(filters)
  const scale = (n: number) => (factor === 1 ? n : Math.max(0, Math.round(n * factor)))

  const formPending = submission.filter((r) => r.qcOutcome === 'ready').length
  const pendingQc = submission.filter((r) => r.qcOutcome === 'pending_qc').length

  return [
    {
      id: 'submission_pending',
      label: 'Submission Pending',
      value: scale(submission.length),
      delta: pendingQc,
      deltaLabel: pendingQc > 0 ? `${pendingQc} Docs QC` : 'Docs queue',
    },
    {
      id: 'form_pending',
      label: 'Form Pending',
      value: scale(formPending),
      delta: formPending,
      deltaLabel: 'Form / portal submit',
    },
    {
      id: 'pending_payment',
      label: 'Pending Payment',
      value: scale(payment.length),
      delta: payment.length,
      deltaLabel: 'Fees open',
    },
    {
      id: 'vfs_submission_pending',
      label: 'Embassy/VFS Submission Pending',
      value: scale(VISIBILITY_KPI.vfs_submitted),
      deltaLabel: 'View in AM',
    },
    {
      id: 'collection_pending',
      label: 'Collection Pending',
      value: scale(VISIBILITY_KPI.collection_pending),
      deltaLabel: 'View in AM',
    },
    {
      id: 'collected',
      label: 'Collected',
      value: scale(VISIBILITY_KPI.collected),
      deltaLabel: 'View in AM',
    },
    {
      id: 'dispatched',
      label: 'Dispatched',
      value: scale(VISIBILITY_KPI.dispatched),
      deltaLabel: 'View in AM',
    },
  ]
}

function buildVisibilityStats(filters: DocumentationDashboardFilters): DashboardKpiItem[] {
  const factor = getDocumentationFilterScaleFactor(filters)
  const scale = (n: number) => (factor === 1 ? n : Math.max(0, Math.round(n * factor)))
  return [
    {
      id: 'vfs_submission_pending',
      label: 'Embassy/VFS Submission Pending',
      value: scale(VISIBILITY_KPI.vfs_submitted),
      deltaLabel: 'View in AM',
    },
    {
      id: 'collection_pending',
      label: 'Collection Pending',
      value: scale(VISIBILITY_KPI.collection_pending),
      deltaLabel: 'View in AM',
    },
    {
      id: 'collected',
      label: 'Collected',
      value: scale(VISIBILITY_KPI.collected),
      deltaLabel: 'View in AM',
    },
    {
      id: 'dispatched',
      label: 'Dispatched',
      value: scale(VISIBILITY_KPI.dispatched),
      deltaLabel: 'View in AM',
    },
  ]
}

function buildToAction(
  submission: DocumentationWorkRow[],
  payment: DocumentationWorkRow[],
  waiting: DocumentationWorkRow[],
): DocumentationToActionItem[] {
  const pendingQc = submission.filter((r) => r.qcOutcome === 'pending_qc').length
  const fillForm = submission.filter(
    (r) => r.qcOutcome === 'ready' && r.nextAction.toLowerCase().includes('form'),
  ).length
  const markSubmitted = submission.filter((r) =>
    r.nextAction.toLowerCase().includes('mark as submitted'),
  ).length
  const pay = payment.length
  const followOps = waiting.length

  return [
    {
      id: 'ta-qc',
      label: 'QC documents in Submission Pending',
      count: pendingQc,
      workDesk: 'submission_pending',
    },
    {
      id: 'ta-forms',
      label: 'Fill forms for verified applications',
      count: fillForm,
      workDesk: 'submission_pending',
    },
    {
      id: 'ta-payment',
      label: 'Update Pending Payment',
      count: pay,
      workDesk: 'pending_payment',
    },
    {
      id: 'ta-submit',
      label: 'Mark applications as submitted',
      count: markSubmitted,
      workDesk: 'submission_pending',
    },
    {
      id: 'ta-ops',
      label: 'Follow up cases waiting on Ops',
      count: followOps,
      workDesk: 'waiting_on_ops',
    },
  ].filter((item) => item.count > 0) as DocumentationToActionItem[]
}

function formatWaitingFromDate(value?: string): string {
  if (!value?.trim()) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  const hours = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 3_600_000))
  if (hours < 24) return `${Math.max(hours, 1)}h`
  const days = Math.floor(hours / 24)
  const rem = hours % 24
  return rem > 0 ? `${days}d ${rem}h` : `${days}d`
}

function ageingBucket(waitingLabel: string): OpsQueueAgeingBucketId {
  if (waitingLabel === '—') return '0–4h'
  const dayMatch = waitingLabel.match(/^(\d+)d/)
  if (dayMatch) {
    const days = Number(dayMatch[1])
    if (days >= 3) return '3d+'
    return '1–3d'
  }
  const hourMatch = waitingLabel.match(/^(\d+)h/)
  const hours = hourMatch ? Number(hourMatch[1]) : 0
  if (hours < 4) return '0–4h'
  if (hours < 24) return '4–24h'
  return '1–3d'
}

function buildInfographics(
  submission: DocumentationWorkRow[],
  payment: DocumentationWorkRow[],
  waiting: DocumentationWorkRow[],
) {
  const all = [...submission, ...payment, ...waiting]

  const deskMix = [
    {
      key: 'submission_pending',
      label: 'Submission Pending',
      value: submission.length,
      color: DOC_CHART_COLORS.navy,
    },
    {
      key: 'pending_payment',
      label: 'Pending Payment',
      value: payment.length,
      color: DOC_CHART_COLORS.amber,
    },
    {
      key: 'waiting_on_ops',
      label: 'Review Reupload',
      value: waiting.length,
      color: DOC_CHART_COLORS.coral,
    },
  ].filter((s) => s.value > 0)

  const qcCounts: Record<DocQcOutcome, number> = {
    pending_qc: 0,
    ready: 0,
    correction: 0,
    blocked: 0,
  }
  for (const row of all) qcCounts[row.qcOutcome] += 1

  const qcOutcomeMix = [
    {
      key: 'pending_qc',
      label: 'Pending QC',
      value: qcCounts.pending_qc,
      color: DOC_CHART_COLORS.blue,
    },
    {
      key: 'ready',
      label: 'Verified & ready',
      value: qcCounts.ready,
      color: DOC_CHART_COLORS.green,
    },
    {
      key: 'correction',
      label: 'Correction required',
      value: qcCounts.correction,
      color: DOC_CHART_COLORS.amber,
    },
    {
      key: 'blocked',
      label: 'Docs missing / blocked',
      value: qcCounts.blocked,
      color: DOC_CHART_COLORS.coral,
    },
  ].filter((s) => s.value > 0)

  const ageingBuckets = [
    { bucket: '0–4h', count: 2 },
    { bucket: '4–24h', count: 3 },
    { bucket: '1–3d', count: 4 },
    { bucket: '3d+', count: 2 },
  ]

  const countryMap = new Map<string, number>()
  const clientMap = new Map<string, number>()
  for (const row of all) {
    countryMap.set(row.country, (countryMap.get(row.country) ?? 0) + 1)
    clientMap.set(row.company, (clientMap.get(row.company) ?? 0) + 1)
  }

  /** Seed rankings (Accounts-style Top 10) — live queue counts override matching names. */
  const countrySeed: Array<[string, number]> = [
    ['United Kingdom', 6],
    ['United States', 5],
    ['Singapore', 4],
    ['United Arab Emirates', 3],
    ['Germany', 3],
    ['Canada', 2],
    ['Australia', 2],
    ['Japan', 1],
    ['Saudi Arabia', 1],
    ['France', 1],
  ]
  const clientSeed: Array<[string, number]> = [
    ['Horizon Visa Desk', 5],
    ['Skyline Travel Agents', 4],
    ['Apex Travel Agents', 4],
    ['Voyage Partner Agents', 3],
    ['TechNova Solutions Ltd', 3],
    ['Harborline Shipping', 3],
    ['Individual', 2],
    ['BrightCorp India', 2],
    ['Nordic Marine Ltd', 1],
    ['Vistara Travel Desk', 1],
  ]

  const mergeRanking = (
    seed: Array<[string, number]>,
    live: Map<string, number>,
  ): DocRankingPoint[] => {
    const merged = new Map(seed)
    for (const [name, value] of live) {
      merged.set(name, Math.max(merged.get(name) ?? 0, value))
    }
    const rows = [...merged.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
    const total = rows.reduce((sum, r) => sum + r.value, 0) || 1
    return rows.map((r) => ({
      ...r,
      sharePercent: Math.round((r.value / total) * 100),
    }))
  }

  const topCountries = mergeRanking(countrySeed, countryMap)
  const topClients = mergeRanking(clientSeed, clientMap)

  const visibilityFunnel = [
    {
      key: 'vfs',
      label: 'Embassy/VFS',
      value: VISIBILITY_KPI.vfs_submitted,
      color: DOC_CHART_COLORS.blue,
    },
    {
      key: 'collection',
      label: 'Collection',
      value: VISIBILITY_KPI.collection_pending,
      color: DOC_CHART_COLORS.amber,
    },
    {
      key: 'collected',
      label: 'Collected',
      value: VISIBILITY_KPI.collected,
      color: DOC_CHART_COLORS.teal,
    },
    {
      key: 'dispatched',
      label: 'Dispatched',
      value: VISIBILITY_KPI.dispatched,
      color: DOC_CHART_COLORS.green,
    },
  ]

  const processingTrend = [
    { label: 'Mon', value: 4, secondary: 3 },
    { label: 'Tue', value: 6, secondary: 5 },
    { label: 'Wed', value: 5, secondary: 4 },
    { label: 'Thu', value: 7, secondary: 6 },
    { label: 'Fri', value: 6, secondary: 5 },
    { label: 'Sat', value: 2, secondary: 2 },
    { label: 'Sun', value: 1, secondary: 1 },
  ]

  const segments: Array<{
    id: DocApplicationChannel
    label: string
    customerSegment: ApplicationCustomerSegment
  }> = [
    { id: 'retail', label: 'Retail', customerSegment: 'retail' },
    { id: 'corporate', label: 'Corporate', customerSegment: 'corporate' },
    { id: 'marine', label: 'Marine', customerSegment: 'marine' },
    { id: 'b2b', label: 'B2B', customerSegment: 'b2bAgents' },
  ]

  const appsById = new Map(
    getAllMarineListingRows(
      marineApplicationAdminService.listMarineApplications().singles,
      marineApplicationAdminService.listMarineApplications().bulks,
    ).map((row) => [row.id, row]),
  )
  for (const segment of segments) {
    const { singles, bulks } = marineApplicationAdminService.listAllSubmittedBySegment(
      segment.customerSegment,
    )
    for (const row of getAllMarineListingRows(singles, bulks)) {
      appsById.set(row.id, row)
    }
  }
  const apps = [...appsById.values()]

  const workloadBySegment: OpsOrgSegmentWorkload[] = segments.map(({ label, customerSegment }) => {
    const segmentApps = apps.filter((row) => row.customerSegment === customerSegment)
    const counts = emptyOpsSegmentWorkloadCounts()
    for (const stageId of APPLICATION_PIPELINE_STAGE_IDS) {
      counts[stageId] = segmentApps.filter((row) =>
        isMarineApplicationInQueueTab(row, stageId),
      ).length
    }
    return { segment: label, ...counts }
  })

  const ageingByQueue: OpsOrgAgeingQueueRow[] = OPS_QUEUE_AGEING_ROWS.map((meta) => {
    const counts = emptyOpsQueueAgeingCounts()
    for (const row of apps) {
      if (!isMarineApplicationInQueueTab(row, meta.key)) continue
      const waiting = formatWaitingFromDate(row.lastUpdated || row.submissionDate || row.createdAt)
      counts[ageingBucket(waiting)] += 1
    }
    return {
      key: meta.key,
      label: meta.label,
      counts,
    }
  })

  const ageingBucketTotals = emptyOpsQueueAgeingCounts()
  for (const row of ageingByQueue) {
    for (const bucket of Object.keys(ageingBucketTotals) as OpsQueueAgeingBucketId[]) {
      ageingBucketTotals[bucket] += row.counts[bucket] ?? 0
    }
  }
  const liveAgeingBuckets = (Object.entries(ageingBucketTotals) as Array<
    [OpsQueueAgeingBucketId, number]
  >).map(([bucket, count]) => ({ bucket, count }))

  const submissionByJurisdiction = buildSubmissionByJurisdiction(apps)

  return {
    deskMix,
    qcOutcomeMix,
    ageingBuckets: liveAgeingBuckets.some((b) => b.count > 0) ? liveAgeingBuckets : ageingBuckets,
    ageingByQueue,
    topCountries,
    topClients,
    submissionByJurisdiction,
    visibilityFunnel,
    processingTrend,
    workloadBySegment,
  }
}

function mapCriticalAlerts(
  submission: DocumentationWorkRow[],
  waiting: DocumentationWorkRow[],
): DocumentationDashboardData['criticalAlerts'] {
  const qcOver4 = submission.filter(
    (r) => r.qcOutcome === 'pending_qc' && (r.slaStatus === 'breached' || r.slaStatus === 'at_risk'),
  ).length
  const awaitingClient = waiting.filter((r) => r.qcOutcome === 'blocked').length
  const correctionOpen = waiting.filter((r) => r.qcOutcome === 'correction').length

  return [
    {
      id: 'dca-qc',
      title: 'Pending QC > 4 Hours',
      description: `${qcOver4} applications need Docs QC decision`,
      severity: qcOver4 > 0 ? ('critical' as const) : ('info' as const),
      count: qcOver4,
    },
    {
      id: 'dca-client',
      title: 'Awaiting Client Documents',
      description: `${awaitingClient} blocked — with Ops for client follow-up`,
      severity: awaitingClient > 0 ? ('warning' as const) : ('info' as const),
      count: awaitingClient,
    },
    {
      id: 'dca-correction',
      title: 'Correction with Ops',
      description: `${correctionOpen} cases in Verification Pending after Docs flag`,
      severity: correctionOpen > 0 ? ('warning' as const) : ('info' as const),
      count: correctionOpen,
    },
    {
      id: 'dca-sla',
      title: 'SLA Breached',
      description: 'Cases past Docs SLA on Submission Pending',
      severity: 'critical' as const,
      count: submission.filter((r) => r.slaStatus === 'breached').length,
    },
  ].filter((a) => (a.count ?? 0) > 0)
}

function mapActivity(rows: DocumentationActivityRow[]) {
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
  const submissionPendingRows = filterRows(DOC_SUBMISSION_PENDING_ROWS, filters, executiveName)
  const pendingPaymentRows = filterRows(DOC_PENDING_PAYMENT_ROWS, filters, executiveName)
  const arrangeInsuranceRows = filterRows(DOC_ARRANGE_INSURANCE_ROWS, filters, executiveName)
  const waitingOnOpsRows = filterRows(DOC_WAITING_ON_OPS_ROWS, filters, executiveName)
  const activityRows = DOC_ACTIVITY_TODAY.filter((r) => r.executive === executiveName)
  const charts = buildInfographics(submissionPendingRows, pendingPaymentRows, waitingOnOpsRows)

  const performanceMetrics = [
    {
      id: 'processed_today',
      label: 'Applications advanced today',
      value: '7',
      subtitle: 'QC, forms, payment, or marked submitted',
      accent: 'success' as const,
    },
    {
      id: 'qc_completed',
      label: 'QC completed today',
      value: '4',
      subtitle: 'Verified / correction / blocked',
      accent: 'primary' as const,
    },
    {
      id: 'avg_processing',
      label: 'Avg time in Submission Pending',
      value: '1.4 days',
      subtitle: 'This week',
      accent: 'info' as const,
    },
  ]

  const metricComparison = [
    {
      label: 'Completed today',
      value: '7',
      delta: 2,
    },
    {
      label: 'Avg cycle time',
      value: '1.4d',
      delta: -0.2,
    },
    {
      label: 'QC completed',
      value: '4',
      delta: 1,
    },
    {
      label: 'Personal SLA',
      value: '93%',
      delta: 1,
    },
  ]

  return {
    executiveName,
    quickStats: buildHeroKpis(
      submissionPendingRows,
      pendingPaymentRows,
      waitingOnOpsRows,
      filters,
    ),
    visibilityStats: buildVisibilityStats(filters),
    kpiTargets: DOC_KPI_TARGETS,
    notifications: [
      {
        id: 'doc-n1',
        title: 'Pending QC > 4 Hours',
        body: 'GL-2026-01471 needs your QC decision.',
        unread: true,
        createdAt: '5h 10m ago',
      },
      {
        id: 'doc-n2',
        title: 'Returned from Ops',
        body: 'Correction resolved — case back in Submission Pending.',
        unread: true,
        createdAt: '2h ago',
      },
      {
        id: 'doc-n3',
        title: 'Fee payment due today',
        body: 'GL-2026-01408 — update Pending Payment.',
        unread: false,
        createdAt: '45 min ago',
      },
    ],
    criticalAlerts: mapCriticalAlerts(submissionPendingRows, waitingOnOpsRows),
    pipelineStages: APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
      id,
      ...DOC_PIPELINE_COUNTS[id],
    })),
    toActionToday: buildToAction(submissionPendingRows, pendingPaymentRows, waitingOnOpsRows),
    ...charts,
    submissionPendingRows,
    pendingPaymentRows,
    arrangeInsuranceRows,
    waitingOnOpsRows,
    recentActivity: mapActivity(activityRows),
    activityRows,
    performanceMetrics,
    metricComparison,
    personalSla: [
      { id: 'doc-sla-day', label: 'Today SLA', value: 93, helperText: 'Target 95%' },
      { id: 'doc-sla-week', label: 'Week SLA', value: 91, helperText: 'Target 95%' },
    ],
    stageSla: [
      { id: 'sla-qc', label: 'QC (< 4h)', value: 80, helperText: 'Escalate past 4h' },
      { id: 'sla-ops', label: 'Review Reupload', value: 60, helperText: 'Correction / blocked' },
      { id: 'sla-submit', label: 'Mark submitted', value: 92, helperText: 'After form + payment' },
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
  const submissionPendingRows = filterRows(DOC_SUBMISSION_PENDING_ROWS, filters, executiveName)
  const pendingPaymentRows = filterRows(DOC_PENDING_PAYMENT_ROWS, filters, executiveName)
  const arrangeInsuranceRows = filterRows(DOC_ARRANGE_INSURANCE_ROWS, filters, executiveName)
  const waitingOnOpsRows = filterRows(DOC_WAITING_ON_OPS_ROWS, filters, executiveName)
  const activityRows = DOC_ACTIVITY_TODAY.filter((r) => r.executive === executiveName)
  const charts = buildInfographics(submissionPendingRows, pendingPaymentRows, waitingOnOpsRows)
  const factor = getDocumentationFilterScaleFactor(filters)

  let next: DocumentationDashboardData = {
    ...data,
    executiveName,
    quickStats: buildHeroKpis(submissionPendingRows, pendingPaymentRows, waitingOnOpsRows, filters),
    visibilityStats: buildVisibilityStats(filters),
    kpiTargets: DOC_KPI_TARGETS,
    criticalAlerts: mapCriticalAlerts(submissionPendingRows, waitingOnOpsRows),
    pipelineStages: APPLICATION_PIPELINE_STAGE_IDS.map((id) => {
      const base = DOC_PIPELINE_COUNTS[id]
      return {
        id,
        count: Math.max(0, Math.round(base.count * factor)),
        averageAgeHours: base.averageAgeHours,
        delayedCount: Math.max(0, Math.round(base.delayedCount * factor)),
        slaPercent: base.slaPercent,
      }
    }),
    toActionToday: buildToAction(submissionPendingRows, pendingPaymentRows, waitingOnOpsRows),
    ...charts,
    submissionPendingRows,
    pendingPaymentRows,
    arrangeInsuranceRows,
    waitingOnOpsRows,
    recentActivity: mapActivity(activityRows),
    activityRows,
    showInactivityWarning: computeShowInactivityWarning(activityRows),
    minutesSinceLastActivity: getMinutesSinceLastActivity(activityRows),
  }

  const query = filters.search.trim().toLowerCase()
  if (!query) return next

  const match = (...parts: Array<string | undefined>) =>
    parts.some((p) => p?.toLowerCase().includes(query))

  return {
    ...next,
    submissionPendingRows: next.submissionPendingRows.filter((r) =>
      match(r.glNumber, r.applicant, r.company, r.country),
    ),
    pendingPaymentRows: next.pendingPaymentRows.filter((r) =>
      match(r.glNumber, r.applicant, r.company, r.country),
    ),
    arrangeInsuranceRows: next.arrangeInsuranceRows.filter((r) =>
      match(r.glNumber, r.applicant, r.company, r.country),
    ),
    waitingOnOpsRows: next.waitingOnOpsRows.filter((r) =>
      match(r.glNumber, r.applicant, r.company, r.country),
    ),
  }
}

export function resolveDocWorkDesk(value: string | null): DocWorkDeskId {
  const allowed: DocWorkDeskId[] = [
    'submission_pending',
    'pending_payment',
    'arrange_insurance',
    'waiting_on_ops',
  ]
  if (value && (allowed as string[]).includes(value)) return value as DocWorkDeskId
  return 'submission_pending'
}

export function getAlertWorkDesk(alertId: string): DocWorkDeskId {
  if (alertId === 'dca-correction' || alertId === 'dca-client') return 'waiting_on_ops'
  if (alertId === 'dca-qc' || alertId === 'dca-sla') return 'submission_pending'
  return 'submission_pending'
}

/** Re-export for inactivity helpers used by Performance. */
export { isBusinessHours }

import {
  formatBulkApplicantListingLabel,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import {
  filterMarineRowsByTab,
  getAllMarineListingRows,
} from '@/pages/admin/application-management/marine/utils/marineApplicationListingUtils'
import { resolveMarineApplicationQueueTab } from '@/pages/admin/application-management/marine/config/marineApplicationListingTabs'
import { filterRowsByListingTab } from '@/pages/admin/assignment-priority/utils/assignmentQueueListingUtils'
import { buildPassengerId } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import { loadSession } from '@/shared/auth/session'
import { applicationVerificationService } from '@/shared/services/applicationVerificationService'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { operationalPassengerAssignmentService } from '@/shared/services/operationalPassengerAssignmentService'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import {
  getSimpleDocumentWorkflowStatus,
  isSimpleDocumentRequirement,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import { listPhysicalOriginalsPendingTravelers } from '../../shared/utils/physicalOriginalsDeskUtils'
import {
  APPLICATION_PIPELINE_STAGE_IDS,
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { OPS_QUEUE_DISPLAY_LABELS } from '../../shared/widgets/operations/opsQueueDisplayLabels'
import { OPS_CHART_COLORS } from './operationsDashboardMock'
import type {
  OperationsAlertRow,
  OperationsDashboardData,
  OperationsWorkRow,
  OpsAssigneeKind,
  OpsSegmentKey,
  OpsWorkQueueKind,
} from '../types'
import {
  opsApplicationDetailPath,
  opsApplicationListPath,
  opsAssignmentPath,
  opsGroundCasePath,
  opsLogisticsPath,
} from '../utils/opsSegmentPaths'

const APP_SEGMENTS: ApplicationCustomerSegment[] = ['marine', 'retail', 'corporate', 'b2bAgents']
const OPS_SEGMENTS: OpsSegmentKey[] = ['retail', 'corporate', 'marine', 'b2b']
const GLTS_ARRANGE_SCAN_LIMIT = 60

const QUEUE_LABEL: Record<OpsWorkQueueKind, string> = {
  verification: OPS_QUEUE_DISPLAY_LABELS.verification,
  recheck: OPS_QUEUE_DISPLAY_LABELS.recheck,
  payment: OPS_QUEUE_DISPLAY_LABELS.payment,
  glts_arrange: OPS_QUEUE_DISPLAY_LABELS.arrange,
  submission: OPS_QUEUE_DISPLAY_LABELS.submission,
  collection: OPS_QUEUE_DISPLAY_LABELS.collection,
  physical_originals: OPS_QUEUE_DISPLAY_LABELS.physicalOriginals,
  correction_watch: OPS_QUEUE_DISPLAY_LABELS.correctionWatch,
  assignment: 'Needs assignment',
}

function toOpsSegment(segment?: ApplicationCustomerSegment | string): OpsSegmentKey {
  if (segment === 'b2bAgents' || segment === 'b2b') return 'b2b'
  if (segment === 'retail' || segment === 'corporate' || segment === 'marine') return segment
  return 'marine'
}

function toCustomerSegment(segment: OpsSegmentKey): ApplicationCustomerSegment {
  return segment === 'b2b' ? 'b2bAgents' : segment
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

function ageingBucket(waitingLabel: string): string {
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

function applicantLabel(row: MarineApplicationRow): string {
  if (isBulkRow(row)) return formatBulkApplicantListingLabel(row)
  return row.applicantName
}

function listAllApplicationRows(): MarineApplicationRow[] {
  const byId = new Map<string, MarineApplicationRow>()
  const marine = marineApplicationAdminService.listMarineApplications()
  for (const row of getAllMarineListingRows(marine.singles, marine.bulks)) {
    byId.set(row.id, row)
  }
  for (const segment of APP_SEGMENTS) {
    const { singles, bulks } = marineApplicationAdminService.listAllSubmittedBySegment(segment)
    for (const row of getAllMarineListingRows(singles, bulks)) {
      byId.set(row.id, row)
    }
  }
  return [...byId.values()]
}

function resolveAppQueue(row: MarineApplicationRow): OpsWorkQueueKind | null {
  if (row.operationalStatus === 'Document Rejected') return 'recheck'
  if (row.operationalStatus === 'Correction Required') return 'correction_watch'
  const tab = resolveMarineApplicationQueueTab(row)
  switch (tab) {
    case 'verification_pending':
      return 'verification'
    case 'pending_payment':
      return 'payment'
    case 'online_submission_pending':
    case 'vfs_submission_pending':
      return 'submission'
    case 'collection_pending':
    case 'collected':
    case 'dispatched':
      return 'collection'
    default:
      return null
  }
}

function mapApplicationRow(row: MarineApplicationRow, queue: OpsWorkQueueKind): OperationsWorkRow {
  const segment = toOpsSegment(row.customerSegment)
  const waitingTime = formatWaitingFromDate(row.lastUpdated || row.submissionDate || row.createdAt)
  const workspace =
    queue === 'payment'
      ? 'pending_payment'
      : queue === 'verification' || queue === 'recheck' || queue === 'glts_arrange'
        ? 'verify'
        : undefined

  return {
    id: `app-${queue}-${row.id}`,
    glNumber: row.id,
    applicant: applicantLabel(row),
    company: resolveApplicationCompanyName(row),
    segment,
    country: row.country,
    visaType: row.visaType,
    queue,
    queueLabel: QUEUE_LABEL[queue],
    priority: row.operationalStatus === 'Document Rejected' ? 'High' : 'Medium',
    waitingTime,
    status: row.operationalStatus || row.status || 'Open',
    assigneeKind: row.assignedUserId ? 'user' : 'unassigned',
    assigneeLabel: row.assignedUserId ? 'Assigned ops' : 'Unassigned',
    showGroundBadge: false,
    applicationHref: opsApplicationDetailPath(segment, row.id, workspace ? { workspace } : undefined),
  }
}

function mapAssignmentRow(row: OperationalPassengerRow): OperationsWorkRow {
  const segment = toOpsSegment(row.customerSegment)
  const assigneeKind: OpsAssigneeKind =
    row.passengerStatus === 'Pending Assignment' || !row.assigneeType
      ? 'unassigned'
      : row.assigneeType
  const assigneeLabel =
    assigneeKind === 'unassigned'
      ? 'Unassigned'
      : assigneeKind === 'vendor'
        ? row.assignedVendor || row.assignedUser || 'Vendor'
        : assigneeKind === 'passenger'
          ? `Passenger · ${row.assignedUser || row.passengerName}`
          : row.assignedUser || row.assignedTeam || 'Ops user'

  return {
    id: `assign-${row.id}`,
    glNumber: row.gltsApplicationId,
    applicant: row.passengerName,
    company: row.companyName || '—',
    segment,
    country: row.country,
    visaType: row.visaType,
    queue: 'assignment',
    queueLabel: QUEUE_LABEL.assignment,
    priority: row.priority,
    waitingTime: formatWaitingFromDate(row.slaDueAt || row.operationalDate),
    status: row.passengerStatus,
    assigneeKind,
    assigneeLabel,
    showGroundBadge: assigneeKind === 'vendor' || assigneeKind === 'passenger',
    applicationHref: opsAssignmentPath(segment, row.gltsApplicationId),
    passengerId: row.id,
  }
}

function mapGroundCase(row: OperationalCase): OperationsWorkRow | null {
  const passengerId = buildPassengerId(row.applicationId, row.gltsApplicantId)
  let assigneeKind: OpsAssigneeKind = 'unassigned'
  let assigneeLabel = row.assignedExecutive || row.assignedTeam || 'Unassigned'

  for (const segment of APP_SEGMENTS) {
    const assignment = operationalPassengerAssignmentService.getById(passengerId, segment)
    if (!assignment) continue
    if (assignment.assigneeType === 'vendor') {
      assigneeKind = 'vendor'
      assigneeLabel =
        [assignment.assignedVendor, assignment.assignedUser].filter(Boolean).join(' · ') || 'Vendor'
    } else if (assignment.assigneeType === 'passenger') {
      assigneeKind = 'passenger'
      assigneeLabel = assignment.assignedUser
        ? `Passenger · ${assignment.assignedUser}`
        : `Passenger · ${row.passengerName}`
    } else if (assignment.assigneeType === 'user') {
      assigneeKind = 'user'
      assigneeLabel = assignment.assignedUser || assignment.assignedTeam || 'Ops user'
    }
    break
  }

  if (assigneeKind !== 'vendor' && assigneeKind !== 'passenger') return null

  return {
    id: `ground-${row.id}`,
    glNumber: row.applicationId,
    applicant: row.passengerName,
    company: row.companyName || '—',
    segment: 'marine',
    country: row.country,
    visaType: row.visaType,
    queue: 'collection',
    queueLabel: QUEUE_LABEL.collection,
    priority: row.priority,
    waitingTime: formatWaitingFromDate(row.operationalDate),
    status: row.status,
    assigneeKind,
    assigneeLabel,
    showGroundBadge: true,
    applicationHref: opsGroundCasePath(row.id),
    passengerId: row.id,
  }
}

function collectGltsArrangeRows(apps: MarineApplicationRow[]): OperationsWorkRow[] {
  const rows: OperationsWorkRow[] = []
  const candidates = filterMarineRowsByTab(apps, 'verification_pending').slice(0, GLTS_ARRANGE_SCAN_LIMIT)

  for (const app of candidates) {
    let detail
    try {
      detail = applicationVerificationService.getMergedDetail(app.id)
    } catch {
      continue
    }
    if (!detail) continue

    const docs = (detail.uploadQueueRows ?? []).flatMap((traveler) => traveler.documents ?? [])

    for (const doc of docs) {
      if (!isSimpleDocumentRequirement(doc.documentId)) continue
      const status = getSimpleDocumentWorkflowStatus(doc)
      if (status !== 'pending_glts_booking' && status !== 'pending_glts_insurance') continue

      const serviceType = doc.documentId === 'travel-ticket' ? 'ticket' : 'insurance'
      const segment = toOpsSegment(app.customerSegment)
      rows.push({
        id: `arrange-${app.id}-${doc.documentId}`,
        glNumber: app.id,
        applicant: applicantLabel(app),
        company: resolveApplicationCompanyName(app),
        segment,
        country: app.country,
        visaType: app.visaType,
        queue: 'glts_arrange',
        queueLabel: serviceType === 'ticket' ? 'Arrange Ticket' : 'Arrange Insurance',
        priority: 'High',
        waitingTime: formatWaitingFromDate(app.lastUpdated || app.submissionDate),
        status: status === 'pending_glts_booking' ? 'Pending GLTS booking' : 'Pending GLTS insurance',
        assigneeKind: 'user',
        assigneeLabel: 'Ops arrange',
        showGroundBadge: false,
        serviceType,
        applicationHref: opsApplicationDetailPath(segment, app.id, {
          workspace: 'verify',
          docId: doc.documentId,
        }),
      })
    }
  }

  return rows
}

function collectPhysicalOriginalRows(apps: MarineApplicationRow[]): OperationsWorkRow[] {
  const byId = new Map(apps.map(app => [app.id, app]))
  const pending = listPhysicalOriginalsPendingTravelers(apps, GLTS_ARRANGE_SCAN_LIMIT)
  const rows: OperationsWorkRow[] = []

  for (const item of pending) {
    const app = byId.get(item.applicationId)
    if (!app) continue
    const segment = toOpsSegment(app.customerSegment)
    rows.push({
      id: `physical-${app.id}-${item.travelerRowId}`,
      glNumber: app.id,
      applicant: item.travelerName || applicantLabel(app),
      company: resolveApplicationCompanyName(app),
      segment,
      country: app.country,
      visaType: app.visaType,
      queue: 'physical_originals',
      queueLabel: OPS_QUEUE_DISPLAY_LABELS.physicalOriginals,
      priority: item.receivedCount === 0 ? 'High' : 'Medium',
      waitingTime: formatWaitingFromDate(app.lastUpdated || app.submissionDate),
      status: `${item.receivedCount}/${item.totalCount} received`,
      assigneeKind: app.assignedUserId ? 'user' : 'unassigned',
      assigneeLabel: app.assignedUserId ? 'Assigned ops' : 'Unassigned',
      showGroundBadge: false,
      passengerId: item.travelerRowId,
      applicationHref: opsApplicationDetailPath(segment, app.id, {
        workspace: 'verify',
        passengerId: item.travelerRowId,
      }),
    })
  }

  return rows
}

function buildPipelineStages(apps: MarineApplicationRow[]) {
  const counts = Object.fromEntries(
    APPLICATION_PIPELINE_STAGE_IDS.map((id) => [id, 0]),
  ) as Record<ApplicationPipelineStageId, number>
  const delayed = Object.fromEntries(
    APPLICATION_PIPELINE_STAGE_IDS.map((id) => [id, 0]),
  ) as Record<ApplicationPipelineStageId, number>

  for (const row of apps) {
    const opsQueue = resolveAppQueue(row)

    // Ops desk splits AM "Verification Pending" into first review vs re-upload.
    // Keep Queue status counts aligned with the KPI strip / Queue mix.
    if (opsQueue === 'verification') {
      counts.verification_pending += 1
      continue
    }
    if (opsQueue === 'recheck') {
      delayed.verification_pending += 1
      continue
    }
    if (opsQueue === 'correction_watch') {
      // Waiting on customer — not an open verification queue on the ops desk.
      continue
    }
    if (opsQueue === 'payment') {
      counts.pending_payment += 1
      continue
    }

    const tab = resolveMarineApplicationQueueTab(row)
    if (tab && tab in counts) {
      counts[tab as ApplicationPipelineStageId] += 1
    }
  }

  return APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
    id,
    count: counts[id],
    averageAgeHours: counts[id] > 0 || delayed[id] > 0 ? 8 : 0,
    delayedCount: delayed[id],
    slaPercent: counts[id] > 0 || delayed[id] > 0 ? 92 : 100,
  }))
}

/** Raw Application Management listing-tab counts (same resolver as AM module tabs). */
function countAppsByAmTab(
  apps: MarineApplicationRow[],
): Record<ApplicationPipelineStageId, number> {
  const counts = Object.fromEntries(
    APPLICATION_PIPELINE_STAGE_IDS.map((id) => [id, 0]),
  ) as Record<ApplicationPipelineStageId, number>

  for (const row of apps) {
    const tab = resolveMarineApplicationQueueTab(row)
    if (tab && tab in counts) {
      counts[tab] += 1
    }
  }

  return counts
}

function amTabKpi(
  id: string,
  tab: ApplicationPipelineStageId,
  count: number,
  delta: number,
  deltaLabel: string,
) {
  return {
    id,
    label: APPLICATION_PIPELINE_STAGE_LABELS[tab],
    value: count,
    delta,
    deltaLabel,
    sparklineData: [count, count, count],
  }
}

function countByQueue(rows: OperationsWorkRow[], queue: OpsWorkQueueKind): number {
  return rows.filter((row) => row.queue === queue).length
}

function buildAlerts(rows: OperationsWorkRow[]): OperationsAlertRow[] {
  const alerts: OperationsAlertRow[] = []
  const recheck = rows.find((row) => row.queue === 'recheck')
  if (recheck) {
    alerts.push({
      id: 'al-recheck',
      title: `Re-upload ready — ${recheck.glNumber}`,
      description: `${recheck.applicant} · needs ops re-review`,
      severity: 'critical',
      type: 'recheck_ready',
      href: recheck.applicationHref,
    })
  }
  const payment = rows.find((row) => row.queue === 'payment')
  if (payment) {
    alerts.push({
      id: 'al-payment',
      title: `Payment pending — ${payment.glNumber}`,
      description: `${payment.applicant} · mark paid / release`,
      severity: 'warning',
      type: 'pending_payment',
      href: payment.applicationHref,
    })
  }
  const ticket = rows.find((row) => row.queue === 'glts_arrange' && row.serviceType === 'ticket')
  if (ticket) {
    alerts.push({
      id: 'al-ticket',
      title: `Arrange Ticket — ${ticket.glNumber}`,
      description: `${ticket.applicant} · Arrange Ticket/Insurance`,
      severity: 'warning',
      type: 'glts_ticket_needed',
      href: ticket.applicationHref,
    })
  }
  const insuranceCount = countByQueue(
    rows.filter((row) => row.serviceType === 'insurance'),
    'glts_arrange',
  )
  if (insuranceCount > 0) {
    alerts.push({
      id: 'al-insurance',
      title: 'Arrange Insurance',
      description: 'Cases awaiting GLTS insurance arrangement',
      severity: 'warning',
      type: 'glts_insurance_needed',
      count: insuranceCount,
      href: opsApplicationListPath('marine', 'verification_pending'),
    })
  }
  const unassigned = countByQueue(rows, 'assignment')
  if (unassigned > 0) {
    alerts.push({
      id: 'al-assign',
      title: 'Unassigned applications',
      description: 'Cases need user / vendor / passenger assignment',
      severity: 'warning',
      type: 'assignment_unassigned',
      count: unassigned,
      href: opsAssignmentPath('retail'),
    })
  }
  const ground = rows.find((row) => row.showGroundBadge)
  if (ground) {
    alerts.push({
      id: 'al-ground',
      title: `Ground handoff — ${ground.glNumber}`,
      description: `${ground.assigneeLabel} · open ground desk`,
      severity: 'info',
      type: 'ground_handoff',
      href: ground.applicationHref,
    })
  }
  const waiting = rows.find((row) => row.queue === 'correction_watch')
  if (waiting) {
    alerts.push({
      id: 'al-waiting',
      title: `Waiting on customer — ${waiting.glNumber}`,
      description: `${waiting.applicant} · correction raised`,
      severity: 'info',
      type: 'correction_waiting',
      href: waiting.applicationHref,
    })
  }
  const physicalCount = countByQueue(rows, 'physical_originals')
  if (physicalCount > 0) {
    const sample = rows.find((row) => row.queue === 'physical_originals')
    alerts.push({
      id: 'al-physical',
      title: 'Physical documents pending',
      description: sample
        ? `${sample.applicant} · ${sample.status} · mark originals received`
        : 'Cases awaiting physical original receipt',
      severity: 'warning',
      type: 'physical_originals_pending',
      count: physicalCount,
      href: sample?.applicationHref ?? opsApplicationListPath('marine', 'verification_pending'),
    })
  }
  return alerts
}

/** Build operations dashboard payload from live mock services. */
export function buildOperationsDashboardFromMocks(): OperationsDashboardData {
  const apps = listAllApplicationRows()
  const appWorkRows: OperationsWorkRow[] = []

  for (const app of apps) {
    const queue = resolveAppQueue(app)
    if (!queue) continue
    appWorkRows.push(mapApplicationRow(app, queue))
  }

  const arrangeRows = collectGltsArrangeRows(apps)
  const physicalRows = collectPhysicalOriginalRows(apps)

  const assignmentRows: OperationsWorkRow[] = []
  for (const segment of OPS_SEGMENTS) {
    const passengers = operationalPassengerAssignmentService.list(toCustomerSegment(segment))
    const pending = filterRowsByListingTab(passengers, 'pending_assignment')
    const urgent = passengers.filter(
      (row) =>
        row.priority === 'Urgent' ||
        row.priority === 'High' ||
        row.assigneeType === 'vendor' ||
        row.assigneeType === 'passenger',
    )
    const merged = new Map<string, OperationalPassengerRow>()
    for (const row of [...pending, ...urgent]) merged.set(row.id, row)
    for (const row of merged.values()) {
      assignmentRows.push(mapAssignmentRow(row))
    }
  }

  const groundRows = operationalCaseHandlingService
    .listForOperationsDesk()
    .map(mapGroundCase)
    .filter((row): row is OperationsWorkRow => Boolean(row))

  const queueRows = dedupeWorkRows([...appWorkRows, ...arrangeRows, ...physicalRows, ...groundRows])
  const myWorkRows = queueRows.slice(0, 40)
  const assignmentDeskRows = dedupeWorkRows(assignmentRows).slice(0, 40)

  const verifyCount = countByQueue(queueRows, 'verification')
  const recheckCount = countByQueue(queueRows, 'recheck')
  const paymentCount = countByQueue(queueRows, 'payment')
  const arrangeCount = countByQueue(queueRows, 'glts_arrange')
  const ticketCount = queueRows.filter(
    (row) => row.queue === 'glts_arrange' && row.serviceType === 'ticket',
  ).length
  const insuranceCount = queueRows.filter(
    (row) => row.queue === 'glts_arrange' && row.serviceType === 'insurance',
  ).length
  const submissionCount = countByQueue(queueRows, 'submission')
  const collectionCount = countByQueue(queueRows, 'collection')
  const physicalCount = countByQueue(queueRows, 'physical_originals')
  const unassignedCount = assignmentDeskRows.filter((row) => row.assigneeKind === 'unassigned').length

  const session = loadSession()
  const consultantName = session?.contactName || session?.email || 'Operations desk'
  const amTabCounts = countAppsByAmTab(apps)

  const workloadBySegment = OPS_SEGMENTS.map((segment) => {
    const segmentRows = queueRows.filter((row) => row.segment === segment)
    return {
      segment: segment === 'b2b' ? 'B2B' : segment[0].toUpperCase() + segment.slice(1),
      verification: countByQueue(segmentRows, 'verification') + countByQueue(segmentRows, 'recheck'),
      payment: countByQueue(segmentRows, 'payment'),
      arrange: countByQueue(segmentRows, 'glts_arrange'),
      submission: countByQueue(segmentRows, 'submission'),
    }
  })

  const ageingBuckets = ['0–4h', '4–24h', '1–3d', '3d+'].map((bucket) => ({
    bucket,
    count: queueRows.filter((row) => ageingBucket(row.waitingTime) === bucket).length,
  }))

  const assigneeMixSource = [...queueRows, ...assignmentDeskRows]
  const assigneeMix = [
    {
      key: 'user',
      label: 'user',
      value: assigneeMixSource.filter((row) => row.assigneeKind === 'user').length,
      color: OPS_CHART_COLORS.navy,
    },
    {
      key: 'vendor',
      label: 'Vendor',
      value: assigneeMixSource.filter((row) => row.assigneeKind === 'vendor').length,
      color: OPS_CHART_COLORS.amber,
    },
    {
      key: 'passenger',
      label: 'Passenger',
      value: assigneeMixSource.filter((row) => row.assigneeKind === 'passenger').length,
      color: OPS_CHART_COLORS.blue,
    },
    {
      key: 'unassigned',
      label: 'Unassigned',
      value: assigneeMixSource.filter((row) => row.assigneeKind === 'unassigned').length,
      color: OPS_CHART_COLORS.coral,
    },
  ]

  return {
    consultantName,
    myQuickStats: [
      {
        id: 'kpi-total-applications',
        label: 'Total applications',
        value: apps.length,
        delta: 8.4,
        deltaLabel: 'All active channels',
        sparklineData: [
          Math.max(apps.length - 12, 0),
          Math.max(apps.length - 8, 0),
          Math.max(apps.length - 4, 0),
          apps.length,
        ],
      },
      {
        id: 'kpi-total-verification',
        label: 'Pending OPS QC',
        value: verifyCount + recheckCount,
        delta: 6.2,
        deltaLabel: 'Pending + re-upload queue',
        sparklineData: [
          verifyCount + recheckCount,
          verifyCount + recheckCount,
          verifyCount + recheckCount,
        ],
      },
      {
        id: 'kpi-verification',
        label: OPS_QUEUE_DISPLAY_LABELS.verification,
        value: verifyCount,
        delta: 4.1,
        deltaLabel: 'Docs awaiting first review',
        sparklineData: [verifyCount, verifyCount, verifyCount],
      },
      {
        id: 'kpi-recheck',
        label: OPS_QUEUE_DISPLAY_LABELS.recheck,
        value: recheckCount,
        delta: 8.5,
        deltaLabel: 'Ready for re-check',
        sparklineData: [recheckCount, recheckCount, recheckCount],
      },
      {
        id: 'kpi-payment',
        label: OPS_QUEUE_DISPLAY_LABELS.payment,
        value: paymentCount,
        delta: 2.4,
        deltaLabel: 'Mark paid / release',
        sparklineData: [paymentCount, paymentCount, paymentCount],
      },
      {
        id: 'kpi-pending-ticket',
        label: 'Pending ticket',
        value: ticketCount,
        delta: ticketCount > 0 ? 3.1 : 0,
        deltaLabel: 'Ticket to arrange',
        sparklineData: [ticketCount, ticketCount, ticketCount],
      },
      {
        id: 'kpi-pending-insurance',
        label: 'Pending insurance',
        value: insuranceCount,
        delta: insuranceCount > 0 ? 2.7 : 0,
        deltaLabel: 'Insurance to arrange',
        sparklineData: [insuranceCount, insuranceCount, insuranceCount],
      },
      amTabKpi(
        'kpi-online-submission',
        'online_submission_pending',
        amTabCounts.online_submission_pending,
        1.8,
        'Application Management · Submission Pending',
      ),
      amTabKpi(
        'kpi-vfs-submission',
        'vfs_submission_pending',
        amTabCounts.vfs_submission_pending,
        3.2,
        'Application Management · Embassy/VFS',
      ),
      amTabKpi(
        'kpi-collection-pending',
        'collection_pending',
        amTabCounts.collection_pending,
        2.1,
        'Application Management · Collection Pending',
      ),
      amTabKpi(
        'kpi-collected',
        'collected',
        amTabCounts.collected,
        -1.4,
        'Application Management · Collected',
      ),
      amTabKpi(
        'kpi-dispatched',
        'dispatched',
        amTabCounts.dispatched,
        4.6,
        'Application Management · Dispatched',
      ),
      {
        id: 'kpi-physical-originals',
        label: OPS_QUEUE_DISPLAY_LABELS.physicalOriginals,
        value: physicalCount,
        delta: physicalCount > 0 ? 2.6 : 0,
        deltaLabel: 'Awaiting original receipt',
        sparklineData: [physicalCount, physicalCount, physicalCount],
      },
      {
        id: 'kpi-assignment',
        label: 'Ground OPs Unassigned',
        value: unassignedCount,
        delta: 5.8,
        deltaLabel: 'Needs consultant assignment',
        sparklineData: [unassignedCount, unassignedCount, unassignedCount],
      },
    ],
    alerts: buildAlerts([...queueRows, ...assignmentDeskRows]),
    notifications: buildAlerts([...queueRows, ...assignmentDeskRows])
      .slice(0, 5)
      .map((alert, index) => ({
        id: `on-${alert.id}`,
        title: alert.title,
        body: alert.description,
        unread: index < 2,
        createdAt: index === 0 ? 'Just now' : `${index * 20} min ago`,
      })),
    myPipelineStages: buildPipelineStages(apps),
    quickActions: [
      {
        id: 'qa-verification',
        title: 'Verification queue',
        description: 'Application Management · Verification Pending',
        badge: 'Verify',
        href: opsApplicationListPath('marine', 'verification_pending'),
      },
      {
        id: 'qa-assignment',
        title: 'Assignment desk',
        description: 'Assignment Priority · assign user / vendor / passenger',
        badge: 'Assign',
        href: opsAssignmentPath('retail'),
      },
      {
        id: 'qa-payment',
        title: 'Pending payment',
        description: 'Application Management · mark paid / release',
        badge: 'Payment',
        href: opsApplicationListPath('marine', 'pending_payment'),
      },
      {
        id: 'qa-physical',
        title: 'Physical documents',
        description: 'Verify · mark physical originals received',
        badge: 'Originals',
        href: opsApplicationListPath('marine', 'verification_pending'),
      },
      {
        id: 'qa-apps',
        title: 'Applications',
        description: 'Application Management listing',
        badge: 'Apps',
        href: opsApplicationListPath('marine'),
      },
      {
        id: 'qa-ground',
        title: 'Ground case handling',
        description: 'Ground Operations · vendor / passenger cases',
        badge: 'Ground',
        href: opsGroundCasePath(),
      },
      {
        id: 'qa-logistics',
        title: 'Logistics',
        description: 'Ground Operations · collection and dispatch',
        badge: 'Logistics',
        href: opsLogisticsPath(),
      },
    ],
    myWorkRows,
    queueRows,
    assignmentRows: assignmentDeskRows,
    queueMix: [
      {
        key: 'verification',
        label: OPS_QUEUE_DISPLAY_LABELS.verification,
        value: verifyCount,
        color: OPS_CHART_COLORS.navy,
      },
      {
        key: 'recheck',
        label: OPS_QUEUE_DISPLAY_LABELS.recheck,
        value: recheckCount,
        color: OPS_CHART_COLORS.amber,
      },
      {
        key: 'payment',
        label: OPS_QUEUE_DISPLAY_LABELS.payment,
        value: paymentCount,
        color: OPS_CHART_COLORS.coral,
      },
      {
        key: 'arrange',
        label: OPS_QUEUE_DISPLAY_LABELS.arrange,
        value: arrangeCount,
        color: OPS_CHART_COLORS.blue,
      },
      {
        key: 'submission',
        label: OPS_QUEUE_DISPLAY_LABELS.submission,
        value: submissionCount,
        color: OPS_CHART_COLORS.teal,
      },
      {
        key: 'collection',
        label: OPS_QUEUE_DISPLAY_LABELS.collection,
        value: collectionCount,
        color: OPS_CHART_COLORS.violet,
      },
      {
        key: 'physical_originals',
        label: OPS_QUEUE_DISPLAY_LABELS.physicalOriginals,
        value: physicalCount,
        color: OPS_CHART_COLORS.amber,
      },
    ],
    workloadBySegment,
    ageingBuckets,
    assigneeMix,
    myRecentActivity: queueRows.slice(0, 6).map((row) => ({
      id: `act-${row.id}`,
      primary: `${QUEUE_LABEL[row.queue]} · ${row.glNumber}`,
      secondary: `${row.applicant} · ${row.waitingTime}`,
      badgeLabel: row.queue === 'recheck' ? OPS_QUEUE_DISPLAY_LABELS.recheck : row.showGroundBadge ? 'Ground' : 'Ops',
      badgeColor: row.queue === 'recheck' ? 'warning' : row.showGroundBadge ? 'info' : 'primary',
    })),
    announcements: [
      {
        id: 'oa-1',
        title: 'Live mock queues',
        summary: 'Counts and rows come from Application Management, Assignment Priority, and Ground Operations.',
        publishedAt: 'Today',
        severity: 'info',
      },
    ],
    processingTrend: [
      { label: 'Mon', value: Math.max(verifyCount, 2), secondary: Math.max(submissionCount, 1) },
      { label: 'Tue', value: Math.max(verifyCount + 1, 3), secondary: Math.max(submissionCount, 2) },
      { label: 'Wed', value: Math.max(paymentCount + 2, 3), secondary: Math.max(collectionCount, 1) },
      { label: 'Thu', value: Math.max(arrangeCount + 2, 4), secondary: Math.max(submissionCount + 1, 2) },
      { label: 'Fri', value: Math.max(verifyCount + paymentCount, 3), secondary: Math.max(collectionCount + 1, 2) },
      { label: 'Sat', value: Math.max(Math.floor(verifyCount / 2), 1), secondary: 1 },
      { label: 'Sun', value: Math.max(Math.floor(paymentCount / 2), 1), secondary: 1 },
    ],
    metricComparison: [
      {
        label: 'Completed today',
        value: String(Math.max(1, Math.floor(myWorkRows.length / 4))),
        delta: 2,
      },
      {
        label: 'Avg cycle time',
        value: '4.2h',
        delta: -0.3,
      },
      {
        label: 'Re-checks done',
        value: String(Math.max(1, Math.floor(recheckCount * 0.6) || Math.min(recheckCount, 3))),
        delta: 1,
      },
      {
        label: 'Personal SLA',
        value: '94%',
        delta: 1,
      },
    ],
    teamCapacity: [
      {
        id: 'me',
        department: 'My load',
        openCases: myWorkRows.length,
        completedToday: Math.max(1, Math.floor(myWorkRows.length / 4)),
        capacity: Math.max(myWorkRows.length + 4, 12),
        slaPercent: 94,
      },
      {
        id: 'pod',
        department: 'Ops pod',
        openCases: queueRows.length,
        completedToday: Math.max(2, Math.floor(queueRows.length / 5)),
        capacity: Math.max(queueRows.length + 10, 40),
        slaPercent: 90,
      },
    ],
    personalSla: [
      { id: 'sla-day', label: 'Today SLA', value: 96, helperText: 'Target 95%' },
      { id: 'sla-week', label: 'Week SLA', value: 94, helperText: 'Target 95%' },
    ],
    reports: [
      {
        id: 'ops-daily',
        name: 'Daily work digest',
        category: 'Operational',
        lastGenerated: 'Today 07:00',
      },
      {
        id: 'ops-ageing',
        name: 'Queue ageing report',
        category: 'Operational',
        lastGenerated: 'Yesterday',
      },
      {
        id: 'ops-verify',
        name: 'Verification & re-check SLA',
        category: 'Operational',
        lastGenerated: 'Today 08:00',
      },
      {
        id: 'ops-payment',
        name: 'Pending payment release pack',
        category: 'Operational',
        lastGenerated: 'Today 09:00',
      },
      {
        id: 'ops-arrange',
        name: 'GLTS ticket / insurance backlog',
        category: 'Operational',
        lastGenerated: 'This week',
      },
      {
        id: 'ops-assign',
        name: 'Assignment utilisation',
        category: 'Executive',
        lastGenerated: 'This week',
      },
    ],
  }
}

function dedupeWorkRows(rows: OperationsWorkRow[]): OperationsWorkRow[] {
  const seen = new Map<string, OperationsWorkRow>()
  for (const row of rows) {
    const key = `${row.queue}:${row.glNumber}:${row.passengerId ?? ''}:${row.serviceType ?? ''}`
    if (!seen.has(key)) seen.set(key, row)
  }
  return [...seen.values()]
}

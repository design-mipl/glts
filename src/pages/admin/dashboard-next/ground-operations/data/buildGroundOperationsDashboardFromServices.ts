import { getCurrentUser } from '@/shared/services/authService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { groundOpsClaimSheetService } from '@/shared/services/groundOpsClaimSheetService'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { computeOverallFundBankSettlementSummary } from '@/shared/services/fundUtilizationService'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { CITY_TEAMS, isLogisticsStatus } from '@/shared/types/operationalCaseHandling'
import {
  CLAIM_SHEET_STATUS_LABEL,
  type GroundOpsClaimSheet,
} from '@/shared/types/groundOpsClaimSheet'
import type { FundAllocationBatchRow } from '@/shared/types/fundAllocation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { formatDisplayDate, formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'
import { PASSPORT_JOURNEY_STAGE_IDS } from '../../shared/config/passportJourney'
import {
  buildCourierTrackingFromInTransitRow,
  isLogisticsInTransitCase,
  listLogisticsInTransitRows,
  mapOperationalCaseToInTransitRow,
} from '../../shared/utils/mapLogisticsInTransitRows'
import type {
  GroundClaimSheetRow,
  GroundFundCaseRow,
  GroundOperationsDashboardData,
  GroundOperationsDashboardFilters,
  GroundPassportMovementRow,
  GroundQuickActionDefinition,
} from '../types'

function expenseByApplicantId(): Map<string, number> {
  const map = new Map<string, number>()
  for (const row of operationalCaseHandlingService.list()) {
    if (!row.gltsApplicantId) continue
    map.set(row.gltsApplicantId, (map.get(row.gltsApplicantId) ?? 0) + (row.actualExpense ?? 0))
  }
  return map
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function shiftDateKey(dateKey: string, deltaDays: number): string {
  const date = new Date(`${dateKey}T12:00:00`)
  date.setDate(date.getDate() + deltaDays)
  return date.toISOString().slice(0, 10)
}

function startOfWeekKey(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`)
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + mondayOffset)
  return date.toISOString().slice(0, 10)
}

function matchesDatePreset(operationalDate: string, preset: string): boolean {
  if (!operationalDate || preset === 'all' || preset === 'custom') return true
  const today = todayKey()
  switch (preset) {
    case 'today':
      return operationalDate === today
    case 'yesterday':
      return operationalDate === shiftDateKey(today, -1)
    case 'tomorrow':
      return operationalDate === shiftDateKey(today, 1)
    case 'last7': {
      const from = shiftDateKey(today, -6)
      return operationalDate >= from && operationalDate <= today
    }
    case 'last30': {
      const from = shiftDateKey(today, -29)
      return operationalDate >= from && operationalDate <= today
    }
    case 'mtd':
      return operationalDate.slice(0, 7) === today.slice(0, 7)
    case 'this_week': {
      const from = startOfWeekKey(today)
      return operationalDate >= from && operationalDate <= today
    }
    default:
      return true
  }
}

function teamFilterValue(team: string): string {
  const normalized = team.trim().toLowerCase()
  if (!normalized || normalized === 'all') return 'all'
  const match = CITY_TEAMS.find(entry => entry.toLowerCase().startsWith(normalized))
  return match ?? team
}

function matchesTeam(assignedTeam: string, filter: string): boolean {
  if (filter === 'all') return true
  const expected = teamFilterValue(filter)
  return assignedTeam.toLowerCase() === expected.toLowerCase()
}

function matchesCaseStatus(status: string, filter: string): boolean {
  if (filter === 'all') return true
  return status.toLowerCase().replace(/\s+/g, '-') === filter.toLowerCase()
}

function matchesPriority(priority: string, filter: string): boolean {
  if (filter === 'all') return true
  return priority.toLowerCase() === filter.toLowerCase()
}

function matchesExecutive(executive: string, filter: string): boolean {
  if (filter === 'all') return true
  return executive.toLowerCase().includes(filter.toLowerCase())
}

function matchesSearch(query: string, ...parts: Array<string | undefined>): boolean {
  if (!query) return true
  return parts.some(part => part?.toLowerCase().includes(query))
}

function filterCases(
  rows: OperationalCase[],
  filters: GroundOperationsDashboardFilters,
): OperationalCase[] {
  const query = filters.search.trim().toLowerCase()
  return rows.filter(row => {
    if (!matchesDatePreset(row.operationalDate, filters.date)) return false
    if (!matchesTeam(row.assignedTeam, filters.team)) return false
    if (!matchesExecutive(row.assignedExecutive, filters.executive)) return false
    if (!matchesCaseStatus(row.status, filters.caseStatus)) return false
    if (!matchesPriority(row.priority, filters.priority)) return false
    return matchesSearch(
      query,
      row.operationalId,
      row.applicationId,
      row.passengerName,
      row.companyName,
      row.country,
      row.assignedExecutive,
      row.assignedTeam,
      row.status,
    )
  })
}

function mapCaseToJob(row: OperationalCase) {
  return {
    id: row.id,
    jobRef: row.operationalId,
    type: row.visaType || row.servicesSummary || 'Ground case',
    location: [row.country, row.jurisdiction].filter(Boolean).join(' · ') || '—',
    assignee: row.assignedExecutive || row.assignedTeam || 'Unassigned',
    status: row.status,
    scheduledAt: formatDisplayDate(row.operationalDate),
  }
}

function mapCaseToSchedule(row: OperationalCase) {
  return {
    id: row.id,
    applicant: row.passengerName,
    embassy: [row.country, row.visaType].filter(Boolean).join(' · ') || '—',
    slot: formatDisplayDate(row.operationalDate),
    consultant: row.assignedExecutive || row.assignedTeam || '—',
    status: row.status,
  }
}

function mapCaseToAppointmentRow(row: OperationalCase) {
  return {
    id: row.id,
    applicationNumber: row.applicationId,
    applicant: row.passengerName,
    appointmentTime: formatDisplayDate(row.operationalDate),
    location: row.jurisdiction || row.country || '—',
    assignedExecutive: row.assignedExecutive || '—',
    status: row.status,
    priority: row.priority,
  }
}

function mapClaimSheet(sheet: GroundOpsClaimSheet): GroundClaimSheetRow {
  return {
    id: sheet.id,
    claimNumber: sheet.claimNumber,
    generatedBy: sheet.generatedBy,
    team: sheet.team,
    status: CLAIM_SHEET_STATUS_LABEL[sheet.status],
    caseCount: sheet.cases.length,
    grandTotal: formatInr(sheet.grandTotal),
    rejectionReason: sheet.rejectionReason,
    generatedAt: formatDisplayDateTime(sheet.generatedAt),
  }
}

function mapFundBatch(
  batch: FundAllocationBatchRow,
  expenseByApplicant: Map<string, number>,
): GroundFundCaseRow {
  const allocated = batch.allocatedAmount
  const expenses = batch.passengers.reduce((sum, passenger) => {
    return sum + (expenseByApplicant.get(passenger.gltsApplicantId) ?? 0)
  }, 0)
  const settlement = Math.round((expenses - allocated) * 100) / 100

  return {
    id: batch.id,
    caseRef: batch.allocationBatchId || batch.gltsApplicationId,
    allocatedAmount: formatInr(allocated),
    expensesIncurred: formatInr(expenses),
    availableBalance: formatInr(Math.max(0, allocated - expenses)),
    settlementAmount: formatInr(settlement),
    status: 'Allocated',
  }
}

function buildRouteTimeline(cases: OperationalCase[]) {
  return cases
    .flatMap(row =>
      (row.timeline ?? []).map(event => ({
        id: `${row.id}-${event.id}`,
        title: `${row.passengerName} · ${event.label}`,
        description: row.operationalId,
        date: event.displayDate || formatDisplayDateTime(event.occurredAt),
        status:
          row.status === 'Completed'
            ? ('completed' as const)
            : row.status === 'Dispatched'
              ? ('active' as const)
              : ('pending' as const),
      })),
    )
    .slice(0, 12)
}

function buildRecentActivity(
  cases: OperationalCase[],
  claims: GroundOpsClaimSheet[],
  inTransit: GroundPassportMovementRow[],
) {
  const fromCases = cases.slice(0, 6).map(row => ({
    id: `case-${row.id}`,
    primary: `${row.status} — ${row.passengerName}`,
    secondary: `${row.operationalId} · ${formatDisplayDate(row.lastUpdated)}`,
    badgeLabel: row.status,
    badgeColor:
      row.status === 'Completed'
        ? ('success' as const)
        : row.status === 'Pending'
          ? ('warning' as const)
          : ('info' as const),
  }))

  const fromClaims = claims.slice(0, 4).map(sheet => ({
    id: `claim-${sheet.id}`,
    primary: `${CLAIM_SHEET_STATUS_LABEL[sheet.status]} — ${sheet.claimNumber}`,
    secondary: `${sheet.generatedBy} · ${formatDisplayDateTime(sheet.generatedAt)}`,
    badgeLabel: CLAIM_SHEET_STATUS_LABEL[sheet.status],
    badgeColor:
      sheet.status === 'approved'
        ? ('success' as const)
        : sheet.status === 'rejected'
          ? ('error' as const)
          : ('warning' as const),
  }))

  const fromTransit = inTransit.slice(0, 3).map(row => ({
    id: `transit-${row.id}`,
    primary: `In transit — ${row.applicant}`,
    secondary: `${row.courier} · ${row.trackingNumber}`,
    badgeLabel: 'Courier',
    badgeColor: 'info' as const,
  }))

  return [...fromClaims, ...fromTransit, ...fromCases].slice(0, 10)
}

function buildNotifications(
  pending: OperationalCase[],
  moved: OperationalCase[],
  rejectedClaims: GroundOpsClaimSheet[],
  inTransit: GroundPassportMovementRow[],
) {
  const items = [
    ...rejectedClaims.slice(0, 3).map(sheet => ({
      id: `rej-${sheet.id}`,
      title: `Claim rejected — ${sheet.claimNumber}`,
      body: sheet.rejectionReason || 'Finance rejected this claim. Edit and resubmit from Operations Desk.',
      unread: true,
      createdAt: formatDisplayDateTime(sheet.reviewedAt || sheet.generatedAt),
    })),
    ...moved.slice(0, 2).map(row => ({
      id: `moved-${row.id}`,
      title: `Moved to next day — ${row.passengerName}`,
      body: `${row.operationalId} · ${formatDisplayDate(row.operationalDate)}`,
      unread: true,
      createdAt: formatDisplayDate(row.movedToNextDayAt || row.lastUpdated),
    })),
    ...pending.filter(row => row.delayed || row.priority === 'Critical' || row.priority === 'Urgent').slice(0, 2).map(row => ({
      id: `urgent-${row.id}`,
      title: `${row.priority} pending — ${row.passengerName}`,
      body: `${row.operationalId} · ${row.country}`,
      unread: true,
      createdAt: formatDisplayDate(row.lastUpdated),
    })),
    ...inTransit.filter(row => !row.trackingNumber || row.trackingNumber === '—').slice(0, 2).map(row => ({
      id: `awb-${row.id}`,
      title: `Missing AWB — ${row.applicant}`,
      body: `${row.applicationNumber} is in transit without a tracking number.`,
      unread: true,
      createdAt: row.eta,
    })),
  ]

  if (items.length === 0) {
    return [
      {
        id: 'ground-clear',
        title: 'No field alerts',
        body: 'Operations Desk, logistics, and claim sheets look clear for the current filters.',
        unread: false,
        createdAt: 'Just now',
      },
    ]
  }

  return items.slice(0, 8)
}

function passportStages(activeIndex: number) {
  return PASSPORT_JOURNEY_STAGE_IDS.map((id, index) => ({
    id,
    status:
      index < activeIndex
        ? ('completed' as const)
        : index === activeIndex
          ? ('active' as const)
          : ('pending' as const),
  }))
}

function buildQuickActions(counts: {
  pending: number
  inTransit: number
  rejectedClaims: number
  fundBatches: number
}): GroundQuickActionDefinition[] {
  return [
    {
      id: 'qa-desk',
      title: 'Operations desk',
      description: 'Pending and on-site ground cases.',
      badge: counts.pending > 0 ? String(counts.pending) : undefined,
      href: '/admin/ground-operations/case-handling',
    },
    {
      id: 'qa-logistics',
      title: 'Tracking & logistics',
      description: 'Collection, dispatch, and delivery.',
      badge: counts.inTransit > 0 ? String(counts.inTransit) : undefined,
      href: '/admin/ground-operations/logistics',
    },
    {
      id: 'qa-claims',
      title: 'Claim sheets',
      description: 'Create, track, and resubmit claims.',
      badge: counts.rejectedClaims > 0 ? String(counts.rejectedClaims) : undefined,
      href: '/admin/ground-operations/case-handling',
    },
    {
      id: 'qa-funds',
      title: 'Fund utilization',
      description: 'Allocated funds and settlement.',
      badge: counts.fundBatches > 0 ? String(counts.fundBatches) : undefined,
      href: '/admin/ground-operations/funds',
    },
  ]
}

export function buildGroundOperationsDashboardFromServices(
  filters: GroundOperationsDashboardFilters,
): GroundOperationsDashboardData {
  const allCases = operationalCaseHandlingService.list()
  const cases = filterCases(allCases, filters)
  const claims = groundOpsClaimSheetService.list().filter(sheet => {
    const query = filters.search.trim().toLowerCase()
    if (!query) return true
    return matchesSearch(
      query,
      sheet.claimNumber,
      sheet.generatedBy,
      sheet.team,
      CLAIM_SHEET_STATUS_LABEL[sheet.status],
      sheet.rejectionReason,
    )
  })

  const pending = cases.filter(row => row.status === 'Pending')
  const moved = cases.filter(row => row.status === 'Moved to Next Day')
  const docsSubmitted = cases.filter(row => row.status === 'Document Submitted')
  const completed = cases.filter(row => row.status === 'Completed')
  const logisticsCases = cases.filter(row => isLogisticsStatus(row.status))
  const inTransitLive = listLogisticsInTransitRows().filter(row => {
    const source = allCases.find(entry => entry.id === row.id)
    if (!source) return true
    return filterCases([source], { ...filters, caseStatus: 'all', date: 'all' }).length > 0
  })

  const passportRows: GroundPassportMovementRow[] = (
    inTransitLive.length > 0
      ? inTransitLive
      : logisticsCases.filter(isLogisticsInTransitCase).map(mapOperationalCaseToInTransitRow)
  ).map(row => ({
    id: row.id,
    applicationNumber: row.applicationNumber,
    applicant: row.applicant,
    currentLocation: row.currentLocation,
    courier: row.courier,
    trackingNumber: row.trackingNumber,
    trackingUrl: row.trackingUrl,
    deliveryMethod: row.deliveryMethod,
    eta: row.eta,
    status: row.status,
  }))

  const courierTracking = buildCourierTrackingFromInTransitRow(
    inTransitLive[0] ??
      (logisticsCases.filter(isLogisticsInTransitCase).map(mapOperationalCaseToInTransitRow)[0]),
  )

  const rejectedClaims = claims.filter(sheet => sheet.status === 'rejected')
  const submittedClaims = claims.filter(
    sheet => sheet.status === 'submitted' || sheet.status === 'under_review',
  )
  const approvedClaims = claims.filter(sheet => sheet.status === 'approved')

  const fundBatches = fundAllocationService.listAllocatedBatches()
  const expenseByApplicant = expenseByApplicantId()
  const fundCaseRows = fundBatches.slice(0, 12).map(batch => mapFundBatch(batch, expenseByApplicant))
  const settlementSummary = computeOverallFundBankSettlementSummary()

  const deskQueue = [...pending, ...moved, ...docsSubmitted].slice(0, 20)
  const scheduleRows = [...pending, ...moved].slice(0, 12)

  const currentUser = getCurrentUser()
  const executiveName =
    currentUser?.name?.trim() ||
    cases.find(row => row.assignedExecutive)?.assignedExecutive ||
    'Ground Operations'

  const quickStats = [
    {
      id: 'pending',
      label: 'Pending',
      value: pending.length,
      deltaLabel: 'Operations Desk',
    },
    {
      id: 'moved-next',
      label: 'Moved next day',
      value: moved.length,
      deltaLabel: 'Needs reschedule',
    },
    {
      id: 'docs-submitted',
      label: 'Docs submitted',
      value: docsSubmitted.length,
      deltaLabel: 'Ready for logistics',
    },
    {
      id: 'in-transit',
      label: 'In transit',
      value: passportRows.length,
      deltaLabel: 'Courier',
    },
    {
      id: 'claims-action',
      label: 'Claims action',
      value: submittedClaims.length + rejectedClaims.length,
      deltaLabel: `${rejectedClaims.length} rejected`,
    },
    {
      id: 'funds-allocated',
      label: 'Fund batches',
      value: fundBatches.length,
      deltaLabel: formatInr(settlementSummary.allocatedAmount),
    },
  ]

  const notifications = buildNotifications(pending, moved, rejectedClaims, passportRows)
  const recentActivity = buildRecentActivity(cases, claims, passportRows)
  const routeTimeline = buildRouteTimeline(deskQueue)

  const featuredTransit = passportRows[0]
  const journeyActiveIndex =
    featuredTransit != null ? 2 : completed.length > 0 ? 3 : docsSubmitted.length > 0 ? 1 : 0

  return {
    executiveName,
    quickStats,
    notifications,
    todaysJobs: deskQueue.map(mapCaseToJob),
    routeTimeline:
      routeTimeline.length > 0
        ? routeTimeline
        : deskQueue.slice(0, 6).map(row => ({
            id: row.id,
            title: row.passengerName,
            description: `${row.status} · ${row.operationalId}`,
            date: formatDisplayDate(row.operationalDate),
            status:
              row.status === 'Completed'
                ? ('completed' as const)
                : row.status === 'Pending'
                  ? ('active' as const)
                  : ('pending' as const),
          })),
    appointmentSchedule: scheduleRows.map(mapCaseToSchedule),
    courierTracking,
    quickActions: buildQuickActions({
      pending: pending.length,
      inTransit: passportRows.length,
      rejectedClaims: rejectedClaims.length,
      fundBatches: fundBatches.length,
    }),
    recentActivity,
    appointmentRows: scheduleRows.map(mapCaseToAppointmentRow),
    passportJourney: {
      stages: passportStages(journeyActiveIndex),
      journeyStatus: featuredTransit?.status ?? (completed.length > 0 ? 'Completed' : 'Pending'),
      eta: featuredTransit?.eta,
      trackingNumber: featuredTransit?.trackingNumber,
      courier: featuredTransit?.courier,
    },
    passportCourier: courierTracking,
    documentMovement: [
      { label: 'Pending', inbound: pending.length, outbound: 0 },
      { label: 'Docs submitted', inbound: docsSubmitted.length, outbound: 0 },
      { label: 'In transit', inbound: 0, outbound: passportRows.length },
      { label: 'Completed', inbound: 0, outbound: completed.length },
    ],
    passportRows,
    expenseSummary: {
      submitted: submittedClaims.length,
      approved: approvedClaims.length,
      pending: claims.filter(sheet => sheet.status === 'under_review').length,
      rejected: rejectedClaims.length,
    },
    settlementRows: fundCaseRows.slice(0, 6).map(row => ({
      id: row.id,
      settlementRef: row.caseRef,
      agent: 'Ground Ops',
      amount: row.settlementAmount,
      status: row.status,
      dueDate: formatDisplayDate(todayKey()),
    })),
    fundCaseRows,
    claimSheetRows: claims.map(mapClaimSheet),
    activityFeed: recentActivity,
    activityNotifications: notifications,
    activityRoute: routeTimeline,
    activityDocuments: [
      { label: 'Collected', inbound: cases.filter(row => row.status === 'Collected').length, outbound: 0 },
      { label: 'Dispatched', inbound: 0, outbound: passportRows.length },
      { label: 'Completed', inbound: 0, outbound: completed.length },
    ],
  }
}

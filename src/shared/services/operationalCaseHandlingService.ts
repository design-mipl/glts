import {
  SEED_OPERATIONAL_CASES,
  SEED_TEAM_CAPACITY,
} from '@/shared/data/mockOperationalCases'
import { ensureApplicationFeeCatalog, ensureGroundServiceCatalog } from '@/pages/admin/ground-operations/case-handling/utils/operationalCaseHandlingUtils'
import type {
  CityTeam,
  GroundServiceLine,
  OperationalCase,
  OperationalCasePriority,
  OperationalCaseStatus,
  OperationalExpense,
  OperationalTimelineEvent,
  TeamCapacity,
} from '@/shared/types/operationalCaseHandling'
import type {
  LogisticsDispatchDetails,
  LogisticsFinalQcChecks,
} from '@/shared/types/logisticsDispatch'
import {
  isLogisticsStatus,
  isOperationsDeskStatus,
} from '@/shared/types/operationalCaseHandling'
import {
  isLogisticsFinalQcComplete,
  validateLogisticsDispatchDetails,
} from '@/shared/utils/logisticsDispatchUtils'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function formatDisplayDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function nextTimelineId(caseId: string, timeline: OperationalTimelineEvent[]): string {
  return `${caseId}-tl-${timeline.length + 1}`
}

function appendTimeline(
  record: OperationalCase,
  label: string,
  actor?: string,
): OperationalTimelineEvent {
  const event: OperationalTimelineEvent = {
    id: nextTimelineId(record.id, record.timeline),
    occurredAt: nowIso(),
    displayDate: formatDisplayDate(nowIso()),
    label,
    actor: actor ?? getMasterActor(),
  }
  record.timeline = [event, ...record.timeline]
  return event
}

function touch(record: OperationalCase) {
  record.lastUpdated = nowIso()
}

function findIndex(id: string): number {
  return caseStore.findIndex(row => row.id === id)
}

function normalizeGroundServices(services: GroundServiceLine[]): GroundServiceLine[] {
  return ensureGroundServiceCatalog(services.map(service => ({ ...service })))
}

function normalizeApplicationFees(services: GroundServiceLine[]): GroundServiceLine[] {
  return ensureApplicationFeeCatalog(services.map(service => ({ ...service })))
}

function normalizeServiceLines(record: OperationalCase) {
  record.groundServices = normalizeGroundServices(record.groundServices)
  record.applicationFees = normalizeApplicationFees(record.applicationFees ?? [])
}

function selectedServiceLines(record: OperationalCase): GroundServiceLine[] {
  return record.applicationFees.filter(service => service.selected)
}

function recomputeServiceTotals(record: OperationalCase) {
  const selected = selectedServiceLines(record)
  record.servicesSummary = selected.map(service => service.serviceName).join(', ') || '—'
  record.estimatedExpense = selected.reduce((sum, service) => sum + service.prefilledAmount, 0)
  const serviceActual = selected.reduce((sum, service) => sum + service.actualAmount, 0)
  const extraActual = record.expenses.reduce((sum, expense) => sum + expense.actualAmount, 0)
  record.actualExpense = serviceActual + extraActual
  record.expenseSummary = `₹${record.estimatedExpense.toLocaleString('en-IN')} Est.${record.actualExpense > 0 ? ` · ₹${record.actualExpense.toLocaleString('en-IN')} Actual` : ''}`
}

function cloneOperationalCase(record: OperationalCase): OperationalCase {
  return {
    ...record,
    groundServices: normalizeGroundServices(record.groundServices),
    applicationFees: normalizeApplicationFees(record.applicationFees ?? []),
    expenses: [...record.expenses],
    timeline: [...record.timeline],
    finalQc: record.finalQc
      ? { ...record.finalQc, checks: { ...record.finalQc.checks } }
      : undefined,
    dispatchDetails: record.dispatchDetails ? { ...record.dispatchDetails } : undefined,
  }
}

function getRecord(id: string): OperationalCase | undefined {
  const index = findIndex(id)
  if (index < 0) return undefined
  return cloneOperationalCase(caseStore[index])
}

function mutate(id: string, updater: (record: OperationalCase) => void): OperationalCase | undefined {
  const index = findIndex(id)
  if (index < 0) return undefined
  const record = caseStore[index]
  normalizeServiceLines(record)
  updater(record)
  touch(record)
  return cloneOperationalCase(record)
}


let caseStore: OperationalCase[] = SEED_OPERATIONAL_CASES.map(row => ({
  ...row,
  groundServices: normalizeGroundServices(row.groundServices),
  applicationFees: normalizeApplicationFees(row.applicationFees ?? []),
  expenses: row.expenses.map(e => ({ ...e })),
  timeline: row.timeline.map(t => ({ ...t })),
}))

let capacityStore: TeamCapacity[] = [...SEED_TEAM_CAPACITY]

function recomputeTeamCapacity() {
  const counts: Record<CityTeam, number> = {
    'Mumbai Team': 0,
    'Delhi Team': 0,
    'Chennai Team': 0,
  }

  for (const row of caseStore) {
    if (row.assignedTeam && row.status !== 'Completed') {
      counts[row.assignedTeam] += 1
    }
  }

  capacityStore = SEED_TEAM_CAPACITY.map(cap => ({
    ...cap,
    assigned: counts[cap.team],
  }))
}

function applyAutoCarryForward() {
  // Moved to Next Day is updated manually by the Operations team only.
}

function mapStoreRows(): OperationalCase[] {
  return caseStore
    .map(row => ({
      ...row,
      groundServices: normalizeGroundServices(row.groundServices),
      applicationFees: normalizeApplicationFees(row.applicationFees ?? []),
      expenses: row.expenses.map(e => ({ ...e })),
      timeline: row.timeline.map(t => ({ ...t })),
    }))
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
}

export const operationalCaseHandlingService = {
  list(): OperationalCase[] {
    applyAutoCarryForward()
    recomputeTeamCapacity()
    return mapStoreRows()
  },

  listForOperationsDesk(): OperationalCase[] {
    return this.list()
  },

  listForLogistics(): OperationalCase[] {
    return this.list().filter(row => isLogisticsStatus(row.status))
  },

  getById(id: string): OperationalCase | undefined {
    return getRecord(id)
  },

  listByApplicationId(applicationId: string): OperationalCase[] {
    return this.list().filter(row => row.applicationId === applicationId)
  },

  getTeamCapacity(): TeamCapacity[] {
    recomputeTeamCapacity()
    return capacityStore.map(c => ({ ...c }))
  },

  setPriority(id: string, priority: OperationalCasePriority): OperationalCase | undefined {
    return mutate(id, record => {
      record.priority = priority
      appendTimeline(record, `Priority changed to ${priority}`)
    })
  },

  assignTeam(id: string, team: CityTeam): OperationalCase | undefined {
    return mutate(id, record => {
      record.assignedTeam = team
      appendTimeline(record, `Assigned to ${team}`)
    })
  },

  assignExecutive(id: string, executive: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.assignedExecutive = executive.trim()
      appendTimeline(record, `Assigned to ${executive.trim()}`)
    })
  },

  markForOperations(id: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.markedForOperations = true
      appendTimeline(record, 'Reallocated to Operations Desk')
    })
  },

  escalate(id: string): OperationalCase | undefined {
    return mutate(id, record => {
      const order: OperationalCasePriority[] = ['Normal', 'High', 'Urgent', 'Critical']
      const idx = order.indexOf(record.priority)
      if (idx < order.length - 1) {
        record.priority = order[idx + 1]
      }
      record.delayed = true
      appendTimeline(record, `Escalated to ${record.priority}`)
    })
  },

  reassign(id: string, team: CityTeam, executive: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.assignedTeam = team
      record.assignedExecutive = executive.trim()
      appendTimeline(record, `Reassigned to ${team} · ${executive.trim()}`)
    })
  },

  updateStatus(id: string, status: OperationalCaseStatus): OperationalCase | undefined {
    return mutate(id, record => {
      record.status = status
      if (status === 'Completed') {
        record.progressPercent = 100
      } else if (status === 'Dispatched') {
        record.progressPercent = Math.max(record.progressPercent, 90)
      } else if (status === 'Collected') {
        record.progressPercent = Math.max(record.progressPercent, 75)
      } else if (status === 'Document Submitted') {
        record.progressPercent = Math.max(record.progressPercent, 50)
      } else if (status === 'Moved to Next Day') {
        record.progressPercent = Math.max(record.progressPercent, 20)
      }
      appendTimeline(record, `Status updated to ${status}`)
    })
  },

  moveToNextDay(id: string): OperationalCase | undefined {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextDate = tomorrow.toISOString().slice(0, 10)

    return mutate(id, record => {
      record.operationalDate = nextDate
      record.carryForward = true
      record.movedToNextDayAt = nowIso()
      record.status = 'Moved to Next Day'
      appendTimeline(record, 'Moved to Next Day')
    })
  },

  updateGroundService(id: string, serviceId: string, patch: Partial<GroundServiceLine>): OperationalCase | undefined {
    return mutate(id, record => {
      const svc = record.groundServices.find(s => s.id === serviceId)
      if (!svc) return
      Object.assign(svc, patch)
      recomputeServiceTotals(record)
    })
  },

  updateApplicationFee(id: string, feeId: string, patch: Partial<GroundServiceLine>): OperationalCase | undefined {
    return mutate(id, record => {
      const fee = record.applicationFees.find(item => item.id === feeId)
      if (!fee) return
      Object.assign(fee, patch)
      recomputeServiceTotals(record)
    })
  },

  updateApplicationFeesPaidBy(
    id: string,
    paidBy: NonNullable<OperationalCase['applicationFeesPaidBy']>,
  ): OperationalCase | undefined {
    return mutate(id, record => {
      record.applicationFeesPaidBy = paidBy
    })
  },

  addExpense(id: string, expense: Omit<OperationalExpense, 'id'>): OperationalCase | undefined {
    return mutate(id, record => {
      const item: OperationalExpense = {
        ...expense,
        id: `${record.id}-exp-${record.expenses.length + 1}`,
        isExtra: expense.isExtra ?? true,
      }
      record.expenses.push(item)
      recomputeServiceTotals(record)
      appendTimeline(record, `Expense added · ${item.serviceName}`)
    })
  },

  updateRemarks(id: string, remarks: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.remarks = remarks
    })
  },

  updateSubmissionDetails(
    id: string,
    details: {
      submissionDate?: string
      collectionDate?: string
      submissionReferenceNumber?: string
    },
  ): OperationalCase | undefined {
    return mutate(id, record => {
      if (details.submissionDate !== undefined) {
        record.submissionDate = details.submissionDate
      }
      if (details.collectionDate !== undefined) {
        record.collectionDate = details.collectionDate
      }
      if (details.submissionReferenceNumber !== undefined) {
        record.submissionReferenceNumber = details.submissionReferenceNumber
      }
      appendTimeline(record, 'Submission details updated')
    })
  },

  submitDocuments(
    id: string,
    details: {
      submissionDate: string
      collectionDate?: string
      submissionReferenceNumber: string
    },
  ): OperationalCase | undefined {
    const submissionDate = details.submissionDate.trim()
    const submissionReferenceNumber = details.submissionReferenceNumber.trim()
    if (!submissionDate || !submissionReferenceNumber) return undefined

    return mutate(id, record => {
      if (!isOperationsDeskStatus(record.status)) return

      record.submissionDate = submissionDate
      record.collectionDate = details.collectionDate?.trim() ?? record.collectionDate ?? ''
      record.submissionReferenceNumber = submissionReferenceNumber
      record.status = 'Document Submitted'
      record.carryForward = false
      record.progressPercent = Math.max(record.progressPercent, 50)
      appendTimeline(record, 'Documents submitted to Embassy/VFS')
    })
  },

  markCollected(id: string): OperationalCase | undefined {
    return mutate(id, record => {
      if (record.status !== 'Document Submitted') return
      record.status = 'Collected'
      record.progressPercent = Math.max(record.progressPercent, 75)
      record.nextAction = 'Enter dispatch details'
      appendTimeline(record, 'Passport/documents collected from Embassy/VFS', 'Tracking & Logistics')
    })
  },

  saveFinalQc(
    id: string,
    payload: { checks: LogisticsFinalQcChecks; remarks: string },
  ): OperationalCase | undefined {
    if (!isLogisticsFinalQcComplete(payload.checks)) return undefined

    return mutate(id, record => {
      if (record.status !== 'Collected') return
      if (record.dispatchDetails?.dispatchedAt) return

      record.finalQc = {
        checks: { ...payload.checks },
        remarks: payload.remarks.trim(),
        verifiedBy: getMasterActor(),
        verifiedAt: nowIso(),
        completed: true,
      }
      appendTimeline(record, 'Final QC completed', 'Tracking & Logistics')
    })
  },

  dispatchPassport(id: string, details: LogisticsDispatchDetails): OperationalCase | undefined {
    const validation = validateLogisticsDispatchDetails(details)
    if (!validation.valid) return undefined

    return mutate(id, record => {
      if (record.status !== 'Collected') return

      const dispatchSnapshot: LogisticsDispatchDetails = {
        ...details,
        dispatchedAt: nowIso(),
      }

      record.dispatchDetails = dispatchSnapshot
      record.status = 'Dispatched'
      record.progressPercent = Math.max(record.progressPercent, 90)
      appendTimeline(
        record,
        `Passport dispatched via ${details.deliveryMethod}`,
        'Tracking & Logistics',
      )
      record.status = 'Completed'
      record.progressPercent = 100
      record.nextAction = '—'
      appendTimeline(record, 'Case completed', 'System')
    })
  },

  markDispatched(id: string): OperationalCase | undefined {
    return mutate(id, record => {
      if (record.status !== 'Collected') return
      record.status = 'Dispatched'
      record.progressPercent = Math.max(record.progressPercent, 90)
      appendTimeline(record, 'Passport/documents dispatched', 'Tracking & Logistics')
      record.status = 'Completed'
      record.progressPercent = 100
      appendTimeline(record, 'Case completed', 'System')
    })
  },

  markCompleted(id: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.status = 'Completed'
      record.progressPercent = 100
      appendTimeline(record, 'Marked Completed')
    })
  },

  resetToSeed() {
    caseStore = SEED_OPERATIONAL_CASES.map(row => ({
      ...row,
      groundServices: normalizeGroundServices(row.groundServices),
      applicationFees: normalizeApplicationFees(row.applicationFees ?? []),
      expenses: row.expenses.map(e => ({ ...e })),
      timeline: row.timeline.map(t => ({ ...t })),
    }))
    capacityStore = [...SEED_TEAM_CAPACITY]
  },
}

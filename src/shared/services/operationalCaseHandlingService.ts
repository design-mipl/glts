import {
  SEED_OPERATIONAL_CASES,
  SEED_TEAM_CAPACITY,
} from '@/shared/data/mockOperationalCases'
import { ensureGroundServiceCatalog } from '@/pages/admin/ground-operations/case-handling/utils/operationalCaseHandlingUtils'
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
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
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

function getRecord(id: string): OperationalCase | undefined {
  const index = findIndex(id)
  if (index < 0) return undefined
  const record = caseStore[index]
  return {
    ...record,
    groundServices: normalizeGroundServices(record.groundServices),
    expenses: [...record.expenses],
    timeline: [...record.timeline],
  }
}

function mutate(id: string, updater: (record: OperationalCase) => void): OperationalCase | undefined {
  const index = findIndex(id)
  if (index < 0) return undefined
  const record = caseStore[index]
  record.groundServices = normalizeGroundServices(record.groundServices)
  updater(record)
  touch(record)
  return {
    ...record,
    groundServices: normalizeGroundServices(record.groundServices),
    expenses: [...record.expenses],
    timeline: [...record.timeline],
  }
}

/** Cutoff hour (24h) for auto carry-forward demo. */
const OPERATIONAL_CUTOFF_HOUR = 18

let caseStore: OperationalCase[] = SEED_OPERATIONAL_CASES.map(row => ({
  ...row,
  groundServices: normalizeGroundServices(row.groundServices),
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
  const now = new Date()
  const today = todayIsoDate()

  for (const record of caseStore) {
    if (record.status === 'Completed') continue
    if (record.operationalDate >= today) continue

    const isStale =
      record.operationalDate < today &&
      (record.status === 'Pending' ||
        record.status === 'In Operations' ||
        record.status === 'Biometrics Pending')

    if (isStale || (now.getHours() >= OPERATIONAL_CUTOFF_HOUR && record.operationalDate < today)) {
      record.operationalDate = today
      record.carryForward = true
      record.movedToNextDayAt = nowIso()
      record.status = 'Moved to Next Day'
      appendTimeline(record, 'Moved to Next Day', 'System')
      appendTimeline(record, 'Requeued for today', 'System')
    }
  }
}

export const operationalCaseHandlingService = {
  list(): OperationalCase[] {
    applyAutoCarryForward()
    recomputeTeamCapacity()
    return caseStore
      .map(row => ({
        ...row,
        groundServices: normalizeGroundServices(row.groundServices),
        expenses: row.expenses.map(e => ({ ...e })),
        timeline: row.timeline.map(t => ({ ...t })),
      }))
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
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
      if (record.status === 'Pending') {
        record.status = 'In Operations'
        record.progressPercent = Math.max(record.progressPercent, 25)
      }
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
      } else if (status === 'Passport Collected') {
        record.progressPercent = Math.max(record.progressPercent, 90)
      } else if (status === 'VFS Completed') {
        record.progressPercent = Math.max(record.progressPercent, 75)
      } else if (status === 'Biometrics Pending') {
        record.progressPercent = Math.max(record.progressPercent, 40)
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
      const selected = record.groundServices.filter(s => s.selected)
      record.servicesSummary = selected.map(s => s.serviceName.split(' ')[0]).join(', ') || '—'
      record.estimatedExpense = selected.reduce((sum, s) => sum + s.prefilledAmount, 0)
      const serviceActual = selected.reduce((sum, s) => sum + s.actualAmount, 0)
      const extraActual = record.expenses.reduce((sum, e) => sum + e.actualAmount, 0)
      record.actualExpense = serviceActual + extraActual
      record.expenseSummary = `₹${record.estimatedExpense.toLocaleString('en-IN')} Est.${record.actualExpense > 0 ? ` · ₹${record.actualExpense.toLocaleString('en-IN')} Actual` : ''}`
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
      record.actualExpense =
        record.groundServices.filter(s => s.selected).reduce((sum, s) => sum + s.actualAmount, 0) +
        record.expenses.reduce((sum, e) => sum + e.actualAmount, 0)
      record.expenseSummary = `₹${record.estimatedExpense.toLocaleString('en-IN')} Est.${record.actualExpense > 0 ? ` · ₹${record.actualExpense.toLocaleString('en-IN')} Actual` : ''}`
      appendTimeline(record, `Expense added · ${item.serviceName}`)
    })
  },

  updateRemarks(id: string, remarks: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.remarks = remarks
    })
  },

  updateBiometrics(id: string, scheduled: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.biometricsScheduled = scheduled
      record.status = 'Biometrics Pending'
      record.progressPercent = Math.max(record.progressPercent, 40)
      appendTimeline(record, 'Biometrics Scheduled')
    })
  },

  updateVfsStatus(id: string, vfsStatus: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.vfsStatus = vfsStatus
      if (vfsStatus.toLowerCase().includes('completed') || vfsStatus.toLowerCase().includes('captured')) {
        record.status = 'VFS Completed'
        record.progressPercent = Math.max(record.progressPercent, 75)
      }
      appendTimeline(record, `VFS status · ${vfsStatus}`)
    })
  },

  updatePassportCollection(id: string, status: string): OperationalCase | undefined {
    return mutate(id, record => {
      record.passportCollectionStatus = status
      record.status = 'Passport Collected'
      record.progressPercent = Math.max(record.progressPercent, 90)
      appendTimeline(record, 'Passport Collected')
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
      groundServices: row.groundServices.map(s => ({ ...s })),
      expenses: row.expenses.map(e => ({ ...e })),
      timeline: row.timeline.map(t => ({ ...t })),
    }))
    capacityStore = [...SEED_TEAM_CAPACITY]
  },
}

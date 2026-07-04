import { deriveOperationalPassengerRows } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { SEED_OPERATIONAL_PASSENGER_OVERLAYS } from '@/shared/data/mockOperationalPassengerAssignments'
import type {
  AssignmentHistoryEntry,
  AssignmentPriority,
  AssignmentTimelineEvent,
  OperationalPassengerOverlay,
  OperationalPassengerRow,
  PassengerOperationalStatus,
} from '@/shared/types/operationalPassengerAssignment'
import type { CityTeam } from '@/shared/types/operationalCaseHandling'
import { getMasterActor } from '@/shared/utils/masterActor'

export type { OperationalPassengerRow }

const OPERATIONAL_CUTOFF_HOUR = 18

function nowIso() {
  return new Date().toISOString()
}

function todayIsoDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function cloneOverlay(overlay: OperationalPassengerOverlay): OperationalPassengerOverlay {
  return {
    ...overlay,
    assignmentHistory: overlay.assignmentHistory.map(h => ({ ...h })),
    timeline: overlay.timeline.map(t => ({ ...t })),
    attachmentNames: [...overlay.attachmentNames],
  }
}

let overlayStore = new Map<string, OperationalPassengerOverlay>(
  Object.entries(SEED_OPERATIONAL_PASSENGER_OVERLAYS).map(([id, o]) => [id, cloneOverlay(o)]),
)

function getOverlayMap(): Map<string, OperationalPassengerOverlay> {
  return overlayStore
}

function appendTimeline(
  overlay: OperationalPassengerOverlay,
  label: string,
  actor?: string,
): AssignmentTimelineEvent {
  const event: AssignmentTimelineEvent = {
    id: `tl-${Date.now()}-${overlay.timeline.length}`,
    occurredAt: nowIso(),
    displayDate: formatDisplayDate(nowIso()),
    label,
    actor: actor ?? getMasterActor(),
  }
  overlay.timeline = [event, ...overlay.timeline]
  return event
}

function appendHistory(
  overlay: OperationalPassengerOverlay,
  team: CityTeam | '',
  user: string,
  notes?: string,
): void {
  const entry: AssignmentHistoryEntry = {
    id: `ah-${Date.now()}-${overlay.assignmentHistory.length}`,
    occurredAt: nowIso(),
    assignedTeam: team,
    assignedUser: user,
    assignedBy: getMasterActor(),
    notes,
  }
  overlay.assignmentHistory = [entry, ...overlay.assignmentHistory]
}

function touch(overlay: OperationalPassengerOverlay) {
  overlay.lastUpdated = nowIso()
}

const ALL_SEGMENTS: ApplicationCustomerSegment[] = ['marine', 'retail', 'corporate', 'b2bAgents']

function findRowById(id: string): OperationalPassengerRow | undefined {
  for (const segment of ALL_SEGMENTS) {
    const row = deriveOperationalPassengerRows(segment, overlayStore).find(r => r.id === id)
    if (row) return row
  }
  return undefined
}

function ensureOverlay(id: string): OperationalPassengerOverlay | undefined {
  if (overlayStore.has(id)) return overlayStore.get(id)!

  const derived = findRowById(id)
  if (!derived) return undefined

  const fresh: OperationalPassengerOverlay = {
    priority: derived.priority,
    assignedTeam: derived.assignedTeam,
    assignedUser: derived.assignedUser,
    operationalDate: derived.operationalDate,
    passengerStatus: derived.passengerStatus,
    carryForward: derived.carryForward,
    escalated: derived.escalated,
    slaDueAt: derived.slaDueAt,
    operationalRemarks: derived.operationalRemarks,
    assignmentHistory: [...derived.assignmentHistory],
    timeline: [...derived.timeline],
    attachmentNames: [...derived.attachmentNames],
    lastUpdated: derived.lastUpdated,
  }
  overlayStore.set(id, fresh)
  return fresh
}

function mutate(id: string, updater: (overlay: OperationalPassengerOverlay) => void): OperationalPassengerRow | undefined {
  const overlay = ensureOverlay(id)
  if (!overlay) return undefined
  updater(overlay)
  touch(overlay)
  return findRowById(id)
}

function applyAutoCarryForward() {
  const now = new Date()
  const today = todayIsoDate()

  for (const [id, overlay] of overlayStore) {
    if (overlay.passengerStatus === 'Completed') continue
    if (overlay.operationalDate >= today) continue

    const isStale =
      overlay.operationalDate < today &&
      (overlay.passengerStatus === 'Pending Assignment' ||
        overlay.passengerStatus === 'Assigned' ||
        overlay.passengerStatus === 'In Progress')

    if (isStale || (now.getHours() >= OPERATIONAL_CUTOFF_HOUR && overlay.operationalDate < today)) {
      overlay.operationalDate = today
      overlay.carryForward = true
      overlay.passengerStatus = 'Carry Forward'
      overlay.escalated = overlay.priority === 'Urgent' || overlay.priority === 'High'
      appendTimeline(overlay, 'Auto carry forward — moved to next operational date', 'System')
      touch(overlay)
      overlayStore.set(id, overlay)
    }
  }
}

export const operationalPassengerAssignmentService = {
  list(segment: ApplicationCustomerSegment): OperationalPassengerRow[] {
    applyAutoCarryForward()
    return deriveOperationalPassengerRows(segment, getOverlayMap())
  },

  getById(id: string, segment: ApplicationCustomerSegment): OperationalPassengerRow | undefined {
    return this.list(segment).find(row => row.id === id)
  },

  setPriority(id: string, priority: AssignmentPriority): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      overlay.priority = priority
      if (priority === 'Urgent' || priority === 'High') {
        overlay.escalated = overlay.carryForward
      }
      appendTimeline(overlay, `Priority set to ${priority}`)
    })
  },

  assignVendor(
    id: string,
    vendor: string,
    priority?: AssignmentPriority,
  ): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      overlay.assignedTeam = ''
      overlay.assignedUser = vendor
      overlay.passengerStatus = vendor ? 'Assigned' : 'Pending Assignment'
      if (priority) {
        overlay.priority = priority
        if (priority === 'Urgent' || priority === 'High') {
          overlay.escalated = overlay.carryForward
        }
      }
      appendHistory(overlay, '', vendor, 'Vendor assigned')
      const priorityNote = priority ? ` · ${priority} priority` : ''
      appendTimeline(overlay, vendor ? `Assigned to vendor ${vendor}${priorityNote}` : 'Vendor assignment cleared')
    })
  },

  assignUser(
    id: string,
    team: CityTeam | '',
    user: string,
    priority?: AssignmentPriority,
  ): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      overlay.assignedTeam = team
      overlay.assignedUser = user
      overlay.passengerStatus = user ? 'Assigned' : 'Pending Assignment'
      if (priority) {
        overlay.priority = priority
        if (priority === 'Urgent' || priority === 'High') {
          overlay.escalated = overlay.carryForward
        }
      }
      appendHistory(overlay, team, user, 'User assigned')
      const priorityNote = priority ? ` · ${priority} priority` : ''
      appendTimeline(overlay, user ? `Assigned to ${user}${priorityNote}` : 'Assignment cleared')
    })
  },

  reassign(
    id: string,
    team: CityTeam | '',
    user: string,
    priority?: AssignmentPriority,
    assigneeType: 'user' | 'vendor' = 'user',
  ): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      if (assigneeType === 'vendor') {
        overlay.assignedTeam = ''
        overlay.assignedUser = user
      } else {
        overlay.assignedTeam = team
        overlay.assignedUser = user
      }
      overlay.passengerStatus = 'Assigned'
      if (priority) {
        overlay.priority = priority
        if (priority === 'Urgent' || priority === 'High') {
          overlay.escalated = overlay.carryForward
        }
      }
      const historyNote = assigneeType === 'vendor' ? 'Vendor reassigned' : 'Reassigned'
      appendHistory(overlay, assigneeType === 'vendor' ? '' : team, user, historyNote)
      const priorityNote = priority ? ` · ${priority} priority` : ''
      const assigneeLabel =
        assigneeType === 'vendor' ? `vendor ${user}` : user || team || 'unassigned'
      appendTimeline(overlay, `Reassigned to ${assigneeLabel}${priorityNote}`)
    })
  },

  updateStatus(
    id: string,
    status: PassengerOperationalStatus,
  ): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      overlay.passengerStatus = status
      if (status === 'Completed') {
        overlay.carryForward = false
      }
      appendTimeline(overlay, `Status updated to ${status}`)
    })
  },

  appendRemark(id: string, remark: string): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      const trimmed = remark.trim()
      if (!trimmed) return
      overlay.operationalRemarks = overlay.operationalRemarks
        ? `${overlay.operationalRemarks}\n${trimmed}`
        : trimmed
      appendTimeline(overlay, 'Operational note added')
    })
  },

  moveToNextOperationalDate(id: string): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      overlay.operationalDate = addDays(overlay.operationalDate, 1)
      overlay.carryForward = true
      overlay.passengerStatus = 'Carry Forward'
      overlay.escalated = overlay.priority === 'Urgent' || overlay.priority === 'High'
      appendTimeline(overlay, 'Moved to next operational date')
    })
  },

  addAttachment(id: string, fileName: string): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      if (!overlay.attachmentNames.includes(fileName)) {
        overlay.attachmentNames = [...overlay.attachmentNames, fileName]
      }
      appendTimeline(overlay, `Document uploaded: ${fileName}`)
    })
  },

  escalate(id: string): OperationalPassengerRow | undefined {
    return mutate(id, overlay => {
      overlay.escalated = true
      overlay.priority = 'Urgent'
      appendTimeline(overlay, 'Case escalated')
    })
  },

  markComplete(id: string): OperationalPassengerRow | undefined {
    return this.updateStatus(id, 'Completed')
  },

  resetStoreForDemo() {
    overlayStore = new Map(
      Object.entries(SEED_OPERATIONAL_PASSENGER_OVERLAYS).map(([id, o]) => [id, cloneOverlay(o)]),
    )
  },
}

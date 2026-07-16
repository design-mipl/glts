import { buildPassengerId } from '@/pages/admin/assignment-priority/utils/deriveOperationalPassengerRows'
import { GLTS_APPLICATION_IDS } from '@/pages/customer/data/portalIds'
import { GLTS_BATCH_IDS } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { OperationalPassengerOverlay } from '@/shared/types/operationalPassengerAssignment'

function localIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return localIsoDate(d)
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

function overlay(
  partial: Omit<OperationalPassengerOverlay, 'assigneeType' | 'assignedVendor'> &
    Partial<Pick<OperationalPassengerOverlay, 'assigneeType' | 'assignedVendor'>>,
): OperationalPassengerOverlay {
  return {
    assigneeType: 'user',
    assignedVendor: '',
    ...partial,
  }
}

/** Seed overlays keyed by operational passenger id (`applicationId:applicantId`). */
export const SEED_OPERATIONAL_PASSENGER_OVERLAYS: Record<string, OperationalPassengerOverlay> = {
  [buildPassengerId(GLTS_APPLICATION_IDS.schengen, `${GLTS_APPLICATION_IDS.schengen}-APL-001`)]: overlay({
    priority: 'High',
    assigneeType: 'vendor',
    assignedVendor: 'VFS Global Partner Desk',
    assignedTeam: 'Mumbai Team',
    assignedUser: 'Sneha Patel',
    operationalDate: daysFromNow(0),
    passengerStatus: 'In Progress',
    carryForward: false,
    escalated: false,
    slaDueAt: hoursFromNow(6),
    operationalRemarks: 'Embassy slot confirmed — monitor biometrics window.',
    assignmentHistory: [
      {
        id: 'ah-1',
        occurredAt: '2026-02-10T09:00:00.000Z',
        assignedTeam: 'Mumbai Team',
        assignedUser: 'Sneha Patel',
        assignedBy: 'Rajan Mehta',
        notes: 'Vendor allocation for VFS submission support.',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        occurredAt: '2026-02-10T11:30:00.000Z',
        displayDate: '10 Feb',
        label: 'Application submitted',
        actor: 'Priya Sharma',
      },
      {
        id: 'tl-2',
        occurredAt: '2026-02-11T08:00:00.000Z',
        displayDate: '11 Feb',
        label: 'Assigned to VFS Global Partner Desk',
        actor: 'Rajan Mehta',
      },
    ],
    attachmentNames: ['embassy-checklist.pdf'],
    lastUpdated: '2026-02-18T08:15:00.000Z',
  }),
  [buildPassengerId('GLTS-APP-2026-790', 'GLTS-APP-2026-790-APL-001')]: overlay({
    priority: 'Urgent',
    assignedTeam: 'Delhi Team',
    assignedUser: 'Arun Krishnan',
    operationalDate: daysFromNow(0),
    passengerStatus: 'Assigned',
    carryForward: false,
    escalated: false,
    slaDueAt: hoursFromNow(2),
    operationalRemarks: 'Appointment on 12 Mar — prep VFS pack.',
    assignmentHistory: [
      {
        id: 'ah-2',
        occurredAt: '2026-02-02T10:00:00.000Z',
        assignedTeam: 'Delhi Team',
        assignedUser: 'Arun Krishnan',
        assignedBy: 'Rajan Mehta',
      },
    ],
    timeline: [
      {
        id: 'tl-3',
        occurredAt: '2026-02-01T14:00:00.000Z',
        displayDate: '01 Feb',
        label: 'Submitted for processing',
      },
    ],
    attachmentNames: [],
    lastUpdated: '2026-02-15T10:00:00.000Z',
  }),
  [buildPassengerId('GLTS-APP-2026-744', 'GLTS-APP-2026-744-APL-001')]: overlay({
    priority: 'Medium',
    assignedTeam: 'Mumbai Team',
    assignedUser: 'Sneha Patel',
    operationalDate: daysFromNow(0),
    passengerStatus: 'Assigned',
    carryForward: false,
    escalated: false,
    slaDueAt: hoursFromNow(24),
    operationalRemarks: 'Fund requested — pending finance allocation.',
    assignmentHistory: [
      {
        id: 'ah-744',
        occurredAt: '2026-02-19T09:00:00.000Z',
        assignedTeam: 'Mumbai Team',
        assignedUser: 'Sneha Patel',
        assignedBy: 'Rajan Mehta',
        notes: 'Assigned with fund allocation request.',
      },
    ],
    timeline: [
      {
        id: 'tl-4',
        occurredAt: '2026-02-16T09:00:00.000Z',
        displayDate: '16 Feb',
        label: 'Entered assignment queue',
      },
    ],
    attachmentNames: [],
    lastUpdated: '2026-02-19T09:15:00.000Z',
  }),
  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-001')]: overlay({
    priority: 'High',
    assignedTeam: 'Delhi Team',
    assignedUser: 'Karan Mehta',
    operationalDate: daysFromNow(-1),
    passengerStatus: 'Carry Forward',
    carryForward: true,
    escalated: true,
    slaDueAt: hoursFromNow(-2),
    operationalRemarks: 'Moved from yesterday — VFS walk-in rescheduled.',
    assignmentHistory: [
      {
        id: 'ah-3',
        occurredAt: '2026-02-08T11:00:00.000Z',
        assignedTeam: 'Delhi Team',
        assignedUser: 'Karan Mehta',
        assignedBy: 'Rajan Mehta',
      },
    ],
    timeline: [
      {
        id: 'tl-5',
        occurredAt: '2026-02-17T18:00:00.000Z',
        displayDate: '17 Feb',
        label: 'Carry forward — operational date moved',
        actor: 'System',
      },
    ],
    attachmentNames: ['vfs-reschedule-note.pdf'],
    lastUpdated: '2026-02-18T06:00:00.000Z',
  }),
  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-002')]: overlay({
    priority: 'Medium',
    assignedTeam: 'Delhi Team',
    assignedUser: 'Karan Mehta',
    operationalDate: daysFromNow(0),
    passengerStatus: 'In Progress',
    carryForward: false,
    escalated: false,
    slaDueAt: hoursFromNow(8),
    operationalRemarks: '',
    assignmentHistory: [],
    timeline: [],
    attachmentNames: [],
    lastUpdated: '2026-02-18T08:00:00.000Z',
  }),
  [buildPassengerId(GLTS_BATCH_IDS.schengenCrew, 'GLTS-APL-003')]: overlay({
    priority: 'Medium',
    assignedTeam: 'Delhi Team',
    assignedUser: 'Sneha Patel',
    operationalDate: daysFromNow(0),
    passengerStatus: 'Assigned',
    carryForward: false,
    escalated: false,
    slaDueAt: hoursFromNow(8),
    operationalRemarks: 'Fund requested — awaiting finance allocation.',
    assignmentHistory: [
      {
        id: 'ah-4',
        occurredAt: '2026-02-18T10:00:00.000Z',
        assignedTeam: 'Delhi Team',
        assignedUser: 'Sneha Patel',
        assignedBy: 'Rajan Mehta',
      },
    ],
    timeline: [],
    attachmentNames: [],
    lastUpdated: '2026-02-18T10:05:00.000Z',
  }),
  [buildPassengerId(GLTS_APPLICATION_IDS.japan, `${GLTS_APPLICATION_IDS.japan}-APL-001`)]: overlay({
    priority: 'Low',
    assignedTeam: 'Chennai Team',
    assignedUser: 'Sneha Patel',
    operationalDate: daysFromNow(0),
    passengerStatus: 'In Progress',
    carryForward: false,
    escalated: false,
    slaDueAt: hoursFromNow(12),
    operationalRemarks: 'Correction requested — awaiting customer re-upload.',
    assignmentHistory: [],
    timeline: [],
    attachmentNames: [],
    lastUpdated: '2026-02-17T14:00:00.000Z',
  }),
  [buildPassengerId('GLTS-APP-2026-802', 'GLTS-APP-2026-802-APL-001')]: overlay({
    priority: 'High',
    assignedTeam: 'Mumbai Team',
    assignedUser: 'Arun Krishnan',
    operationalDate: daysFromNow(0),
    passengerStatus: 'Assigned',
    carryForward: false,
    escalated: false,
    slaDueAt: hoursFromNow(5),
    operationalRemarks: 'B2B agent submission — fund request pending allocation.',
    assignmentHistory: [
      {
        id: 'ah-802',
        occurredAt: '2026-02-17T10:30:00.000Z',
        assignedTeam: 'Mumbai Team',
        assignedUser: 'Arun Krishnan',
        assignedBy: 'Rajan Mehta',
      },
    ],
    timeline: [],
    attachmentNames: [],
    lastUpdated: '2026-02-17T11:00:00.000Z',
  }),
}

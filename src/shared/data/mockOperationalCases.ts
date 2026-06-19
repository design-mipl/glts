import type {
  GroundServiceLine,
  OperationalCase,
  OperationalCasePriority,
  OperationalCaseStatus,
  TeamCapacity,
} from '@/shared/types/operationalCaseHandling'
import {
  DEFAULT_GROUND_SERVICE_NAMES,
  GROUND_SERVICE_DEFAULT_RATES,
  formatOperationalExpenseSummary,
  formatOperationalId,
} from '@/shared/types/operationalCaseHandling'
import { GLTS_BATCH_IDS } from '@/pages/customer/features/applications/data/applicationFlowData'

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function buildGroundServices(
  selected: Partial<Record<(typeof DEFAULT_GROUND_SERVICE_NAMES)[number], number>>,
): GroundServiceLine[] {
  return DEFAULT_GROUND_SERVICE_NAMES.map((name, index) => ({
    id: `svc-${index}`,
    serviceName: name,
    selected: name in selected,
    prefilledAmount: GROUND_SERVICE_DEFAULT_RATES[name],
    actualAmount: selected[name] ?? GROUND_SERVICE_DEFAULT_RATES[name] ?? 0,
    remarks: '',
  }))
}

function timeline(
  events: Array<{ displayDate: string; label: string; actor?: string }>,
): OperationalCase['timeline'] {
  return events.map((event, index) => ({
    id: `tl-${index}`,
    occurredAt: new Date().toISOString(),
    displayDate: event.displayDate,
    label: event.label,
    actor: event.actor,
  }))
}

function sumEstimated(services: GroundServiceLine[]): number {
  return services.filter(s => s.selected).reduce((sum, s) => sum + s.prefilledAmount, 0)
}

function sumActual(services: GroundServiceLine[], extras: OperationalCase['expenses']): number {
  const serviceTotal = services.filter(s => s.selected).reduce((sum, s) => sum + s.actualAmount, 0)
  const extraTotal = extras.reduce((sum, e) => sum + e.actualAmount, 0)
  return serviceTotal + extraTotal
}

interface PassengerSeed {
  name: string
  rank: string
  passport: string
  cdc: string
  status: OperationalCaseStatus
  nextAction: string
  joiningDate: string
  priority?: OperationalCasePriority
  progressPercent?: number
  markedForOperations?: boolean
  delayed?: boolean
  carryForward?: boolean
  operationalDate?: string
  lastUpdated?: string
  assignedExecutive?: string
  assignedTeam?: OperationalCase['assignedTeam']
  groundServices?: Partial<Record<(typeof DEFAULT_GROUND_SERVICE_NAMES)[number], number>>
  expenses?: OperationalCase['expenses']
  biometricsScheduled?: string
  vfsStatus?: string
  passportCollectionStatus?: string
  remarks?: string
  attachmentNames?: string[]
  timelineEvents?: Array<{ displayDate: string; label: string; actor?: string }>
}

interface BatchSeed {
  applicationId: string
  companyName: string
  vesselName: string
  country: string
  visaType: string
  jurisdiction: string
  assignedTeam: OperationalCase['assignedTeam']
  assignedExecutive: string
  priority: OperationalCasePriority
  assignmentSourceId?: string
  passengers: PassengerSeed[]
}

function buildPassengerCase(
  batch: BatchSeed,
  passenger: PassengerSeed,
  sequence: number,
  caseKey: string,
): OperationalCase {
  const groundServices = buildGroundServices(passenger.groundServices ?? {})
  const expenses = passenger.expenses ?? []
  const estimated = sumEstimated(groundServices)
  const actual = sumActual(groundServices, expenses)
  const operationalId = formatOperationalId(batch.applicationId, sequence)
  const gltsApplicantId = `GLTS-APL-${batch.applicationId.slice(-4)}-${String(sequence).padStart(2, '0')}`

  return {
    id: caseKey,
    operationalId,
    applicationId: batch.applicationId,
    passengerSequence: sequence,
    passengerName: passenger.name,
    passengerRank: passenger.rank,
    passportNumber: passenger.passport,
    cdcNumber: passenger.cdc,
    vesselName: batch.vesselName,
    jurisdiction: batch.jurisdiction,
    joiningDate: passenger.joiningDate,
    nextAction: passenger.nextAction,
    gltsApplicantId,
    companyName: batch.companyName,
    country: batch.country,
    visaType: batch.visaType,
    applicantCount: batch.passengers.length,
    priority: passenger.priority ?? batch.priority,
    status: passenger.status,
    progressPercent: passenger.progressPercent ?? 25,
    assignedTeam: passenger.assignedTeam ?? batch.assignedTeam,
    assignedExecutive: passenger.assignedExecutive ?? batch.assignedExecutive,
    lastUpdated: passenger.lastUpdated ?? '2026-06-09T09:45:00.000Z',
    operationalDate: passenger.operationalDate ?? today,
    carryForward: passenger.carryForward ?? false,
    markedForOperations: passenger.markedForOperations ?? passenger.status !== 'Pending',
    delayed: passenger.delayed ?? false,
    servicesSummary:
      groundServices
        .filter(s => s.selected)
        .map(s => s.serviceName.split(' ')[0])
        .join(', ') || '—',
    estimatedExpense: estimated,
    actualExpense: actual,
    expenseSummary: formatOperationalExpenseSummary(estimated, actual),
    groundServices,
    expenses,
    biometricsScheduled: passenger.biometricsScheduled,
    vfsStatus: passenger.vfsStatus,
    passportCollectionStatus: passenger.passportCollectionStatus,
    remarks: passenger.remarks ?? '',
    attachmentNames: passenger.attachmentNames ?? [],
    timeline: timeline(
      passenger.timelineEvents ?? [
        { displayDate: '09 Jun', label: 'Operational record created', actor: 'System' },
      ],
    ),
    assignmentSourceId: batch.assignmentSourceId,
  }
}

function buildBatchCases(batch: BatchSeed, idPrefix: string): OperationalCase[] {
  return batch.passengers.map((passenger, index) =>
    buildPassengerCase(batch, passenger, index + 1, `${idPrefix}-${String(index + 1).padStart(2, '0')}`),
  )
}

const today = todayIsoDate()

export const SEED_TEAM_CAPACITY: TeamCapacity[] = [
  { team: 'Mumbai Team', assigned: 22, capacity: 25 },
  { team: 'Delhi Team', assigned: 18, capacity: 20 },
  { team: 'Chennai Team', assigned: 14, capacity: 15 },
]

const BATCH_SEEDS: BatchSeed[] = [
  {
    applicationId: 'GLTS-M-2026-0142',
    companyName: 'Oceanic Crew Services',
    vesselName: 'MV Green Horizon',
    country: 'China',
    visaType: 'M Visa',
    jurisdiction: 'Delhi',
    assignedTeam: 'Mumbai Team',
    assignedExecutive: 'Priya Sharma',
    priority: 'Urgent',
    assignmentSourceId: 'asgn-8821',
    passengers: [
      {
        name: 'Rajesh Kumar',
        rank: 'Chief Officer',
        passport: 'P1234567',
        cdc: 'MUM-CDC-8821',
        status: 'Biometrics Pending',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-06-28',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800, 'Local Travel': 1200 },
        biometricsScheduled: '12 Jun 2026 · 14:30 · VFS Mumbai',
        timelineEvents: [
          { displayDate: '09 Jun', label: 'Assigned to Mumbai Team', actor: 'Ops Manager' },
          { displayDate: '09 Jun', label: 'Documents Verified', actor: 'Priya Sharma' },
          { displayDate: '09 Jun', label: 'Biometrics Scheduled', actor: 'Priya Sharma' },
        ],
      },
      {
        name: 'Amit Singh',
        rank: '2nd Officer',
        passport: 'P2345678',
        cdc: 'MUM-CDC-8822',
        status: 'VFS Scheduled',
        nextAction: 'VFS Submission',
        joiningDate: '2026-06-28',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        vfsStatus: 'Appointment confirmed · 14 Jun',
        progressPercent: 55,
      },
      {
        name: 'Manoj Patel',
        rank: 'Chief Engineer',
        passport: 'P3456789',
        cdc: 'MUM-CDC-8823',
        status: 'Passport Collected',
        nextAction: 'Courier Dispatch',
        joiningDate: '2026-06-28',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800, Courier: 650 },
        passportCollectionStatus: 'Collected from VFS',
        progressPercent: 90,
      },
      {
        name: 'Ravi Nair',
        rank: 'Bosun',
        passport: 'P4567890',
        cdc: 'MUM-CDC-8824',
        status: 'Courier Pending',
        nextAction: 'Courier Tracking',
        joiningDate: '2026-06-28',
        groundServices: { Courier: 650, 'VFS Support': 1800, Printing: 350 },
        progressPercent: 85,
      },
      {
        name: 'Sunil Shah',
        rank: 'AB Seaman',
        passport: 'P5678901',
        cdc: 'MUM-CDC-8825',
        status: 'Completed',
        nextAction: '—',
        joiningDate: '2026-06-28',
        groundServices: {
          'Biometrics Coordination': 2500,
          'VFS Support': 1800,
          Courier: 650,
          'Local Travel': 1200,
          Printing: 350,
        },
        progressPercent: 100,
        lastUpdated: '2026-06-09T12:30:00.000Z',
        timelineEvents: [{ displayDate: '09 Jun', label: 'Marked Completed', actor: 'Priya Sharma' }],
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0138',
    companyName: 'Harbour Marine Pvt Ltd',
    vesselName: 'MV Coastal Star',
    country: 'Singapore',
    visaType: 'Maritime Crew Visa',
    jurisdiction: 'Chennai',
    assignedTeam: 'Chennai Team',
    assignedExecutive: 'Karthik Venkat',
    priority: 'High',
    assignmentSourceId: 'asgn-8815',
    passengers: [
      {
        name: 'Vikram Desai',
        rank: 'Master',
        passport: 'P6789012',
        cdc: 'CHE-CDC-4410',
        status: 'Biometrics Pending',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-07-05',
        groundServices: { 'Biometrics Coordination': 2500, Courier: 650 },
        biometricsScheduled: '09 Jun 2026 · 16:00 · VFS Chennai',
        progressPercent: 40,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0129',
    companyName: 'Blue Horizon Shipping',
    vesselName: 'MV Atlantic Voyager',
    country: 'Netherlands',
    visaType: 'Schengen Seafarer',
    jurisdiction: 'Delhi',
    assignedTeam: 'Delhi Team',
    assignedExecutive: 'Anita Rao',
    priority: 'Critical',
    assignmentSourceId: 'asgn-8802',
    passengers: [
      {
        name: 'Deepak Joshi',
        rank: 'Chief Officer',
        passport: 'P7890123',
        cdc: 'DEL-CDC-3301',
        status: 'Pending',
        nextAction: 'Documents Verification',
        joiningDate: '2026-06-20',
        markedForOperations: false,
        groundServices: { 'VFS Support': 1800, Printing: 350 },
        delayed: true,
        progressPercent: 15,
      },
      {
        name: 'Sanjay Mehta',
        rank: '2nd Engineer',
        passport: 'P8901234',
        cdc: 'DEL-CDC-3302',
        status: 'Pending',
        nextAction: 'Documents Verification',
        joiningDate: '2026-06-20',
        markedForOperations: false,
        groundServices: { 'VFS Support': 1800, Printing: 350 },
        progressPercent: 10,
      },
      {
        name: 'Arun Pillai',
        rank: '3rd Officer',
        passport: 'P9012345',
        cdc: 'DEL-CDC-3303',
        status: 'Documents Verified',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-06-20',
        markedForOperations: true,
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        progressPercent: 25,
      },
      {
        name: 'Naveen Reddy',
        rank: 'Electrician',
        passport: 'P0123456',
        cdc: 'DEL-CDC-3304',
        status: 'In Operations',
        nextAction: 'VFS Submission',
        joiningDate: '2026-06-20',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        progressPercent: 45,
      },
      {
        name: 'Kiran Bose',
        rank: 'Fitter',
        passport: 'P1122334',
        cdc: 'DEL-CDC-3305',
        status: 'VFS Pending',
        nextAction: 'VFS Follow-up',
        joiningDate: '2026-06-20',
        groundServices: { 'VFS Support': 1800, Printing: 350 },
        vfsStatus: 'Awaiting slot confirmation',
        progressPercent: 50,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0115',
    companyName: 'Seafarer Connect India',
    vesselName: 'MV North Sea',
    country: 'Germany',
    visaType: 'National D Visa',
    jurisdiction: 'Mumbai',
    assignedTeam: 'Mumbai Team',
    assignedExecutive: 'Rahul Mehta',
    priority: 'Normal',
    assignmentSourceId: 'asgn-8788',
    passengers: [
      {
        name: 'Pradeep Nair',
        rank: 'Chief Officer',
        passport: 'P2233445',
        cdc: 'MUM-CDC-7710',
        status: 'Moved to Next Day',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-07-01',
        carryForward: true,
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        remarks: 'Carried forward — biometrics slot not available yesterday.',
        progressPercent: 30,
        lastUpdated: '2026-06-08T18:30:00.000Z',
      },
      {
        name: 'Harish Iyer',
        rank: '2nd Officer',
        passport: 'P3344556',
        cdc: 'MUM-CDC-7711',
        status: 'Biometrics Pending',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-07-01',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        progressPercent: 35,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0108',
    companyName: 'Global Tanker Management',
    vesselName: 'MT Pacific Glory',
    country: 'United Arab Emirates',
    visaType: 'Crew Visa',
    jurisdiction: 'Delhi',
    assignedTeam: 'Delhi Team',
    assignedExecutive: 'Vikram Singh',
    priority: 'High',
    assignmentSourceId: 'asgn-8771',
    passengers: [
      {
        name: 'Mohammed Ali',
        rank: 'Master',
        passport: 'P4455667',
        cdc: 'DEL-CDC-6601',
        status: 'VFS Completed',
        nextAction: 'Passport Collection',
        joiningDate: '2026-06-25',
        groundServices: { 'VFS Support': 1800, 'Local Travel': 1200, Printing: 350 },
        vfsStatus: 'Submitted · biometrics captured',
        progressPercent: 75,
      },
      {
        name: 'Imran Khan',
        rank: 'Chief Engineer',
        passport: 'P5566778',
        cdc: 'DEL-CDC-6602',
        status: 'VFS Completed',
        nextAction: 'Passport Collection',
        joiningDate: '2026-06-25',
        groundServices: { 'VFS Support': 1800, 'Local Travel': 1200, Printing: 350 },
        expenses: [
          {
            id: 'exp-1',
            serviceName: 'Parking charges',
            prefilledAmount: 200,
            actualAmount: 180,
            isExtra: true,
            remarks: 'VFS Noida parking',
          },
        ],
        progressPercent: 75,
      },
      {
        name: 'Farhan Sheikh',
        rank: '2nd Officer',
        passport: 'P6677889',
        cdc: 'DEL-CDC-6603',
        status: 'Passport Collected',
        nextAction: 'Courier Dispatch',
        joiningDate: '2026-06-25',
        groundServices: { 'VFS Support': 1800, Courier: 650 },
        passportCollectionStatus: 'Awaiting embassy return',
        progressPercent: 90,
      },
      {
        name: 'Yusuf Ahmed',
        rank: 'Bosun',
        passport: 'P7788990',
        cdc: 'DEL-CDC-6604',
        status: 'In Operations',
        nextAction: 'VFS Submission',
        joiningDate: '2026-06-25',
        groundServices: { 'VFS Support': 1800, Printing: 350 },
        progressPercent: 55,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0096',
    companyName: 'Anchor Crewing Agency',
    vesselName: 'MV Nordic Wind',
    country: 'Norway',
    visaType: 'Seafarer Entry',
    jurisdiction: 'Chennai',
    assignedTeam: 'Chennai Team',
    assignedExecutive: 'Lakshmi Iyer',
    priority: 'Normal',
    assignmentSourceId: 'asgn-8755',
    passengers: [
      {
        name: 'Ganesh Raman',
        rank: 'Chief Officer',
        passport: 'P8899001',
        cdc: 'CHE-CDC-5501',
        status: 'Passport Collected',
        nextAction: 'Courier Dispatch',
        joiningDate: '2026-07-10',
        groundServices: { 'Biometrics Coordination': 2500, Courier: 650 },
        passportCollectionStatus: 'Collected from VFS · handed to client',
        progressPercent: 90,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0088',
    companyName: 'Pacific Maritime Solutions',
    vesselName: 'MV Liberty Bay',
    country: 'France',
    visaType: 'Schengen Crew',
    jurisdiction: 'Delhi',
    assignedTeam: '',
    assignedExecutive: '',
    priority: 'Urgent',
    assignmentSourceId: 'asgn-8740',
    passengers: [
      {
        name: 'Rohit Verma',
        rank: 'Master',
        passport: 'P9900112',
        cdc: 'DEL-CDC-4401',
        status: 'Pending',
        nextAction: 'Team Assignment',
        joiningDate: '2026-06-22',
        markedForOperations: false,
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800, 'Local Travel': 1200 },
        progressPercent: 10,
      },
      {
        name: 'Anil Kapoor',
        rank: 'Chief Engineer',
        passport: 'P1011223',
        cdc: 'DEL-CDC-4402',
        status: 'Pending',
        nextAction: 'Team Assignment',
        joiningDate: '2026-06-22',
        markedForOperations: false,
        progressPercent: 10,
      },
      {
        name: 'Suresh Menon',
        rank: '2nd Officer',
        passport: 'P2122334',
        cdc: 'DEL-CDC-4403',
        status: 'Pending',
        nextAction: 'Team Assignment',
        joiningDate: '2026-06-22',
        markedForOperations: false,
        progressPercent: 10,
      },
      {
        name: 'Vinod Thomas',
        rank: '3rd Engineer',
        passport: 'P3233445',
        cdc: 'DEL-CDC-4404',
        status: 'Pending',
        nextAction: 'Team Assignment',
        joiningDate: '2026-06-22',
        markedForOperations: false,
        progressPercent: 10,
      },
      {
        name: 'Ashok Das',
        rank: 'Electrician',
        passport: 'P4344556',
        cdc: 'DEL-CDC-4405',
        status: 'Pending',
        nextAction: 'Team Assignment',
        joiningDate: '2026-06-22',
        markedForOperations: false,
        progressPercent: 10,
      },
      {
        name: 'Mahesh Gowda',
        rank: 'AB Seaman',
        passport: 'P5455667',
        cdc: 'DEL-CDC-4406',
        status: 'Pending',
        nextAction: 'Team Assignment',
        joiningDate: '2026-06-22',
        markedForOperations: false,
        progressPercent: 10,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0075',
    companyName: 'Coastal Logistics Crew',
    vesselName: 'MV Adriatic Sun',
    country: 'Italy',
    visaType: 'Schengen Seafarer',
    jurisdiction: 'Mumbai',
    assignedTeam: 'Mumbai Team',
    assignedExecutive: 'Priya Sharma',
    priority: 'Normal',
    assignmentSourceId: 'asgn-8722',
    passengers: [
      {
        name: 'Dinesh Rao',
        rank: 'Chief Officer',
        passport: 'P6566778',
        cdc: 'MUM-CDC-3301',
        status: 'Completed',
        nextAction: '—',
        joiningDate: '2026-06-15',
        groundServices: {
          'Biometrics Coordination': 2500,
          'VFS Support': 1800,
          Courier: 650,
          'Local Travel': 1200,
          Printing: 350,
        },
        progressPercent: 100,
        lastUpdated: '2026-06-09T12:30:00.000Z',
      },
      {
        name: 'Kunal Shah',
        rank: '2nd Engineer',
        passport: 'P7677889',
        cdc: 'MUM-CDC-3302',
        status: 'Completed',
        nextAction: '—',
        joiningDate: '2026-06-15',
        groundServices: {
          'Biometrics Coordination': 2500,
          'VFS Support': 1800,
          Courier: 650,
          'Local Travel': 1200,
          Printing: 350,
        },
        progressPercent: 100,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0062',
    companyName: 'Eastern Star Shipping',
    vesselName: 'MV Iberian Star',
    country: 'Spain',
    visaType: 'Schengen Crew',
    jurisdiction: 'Delhi',
    assignedTeam: 'Delhi Team',
    assignedExecutive: 'Anita Rao',
    priority: 'High',
    assignmentSourceId: 'asgn-8701',
    passengers: [
      {
        name: 'Pavan Kumar',
        rank: 'Chief Officer',
        passport: 'P8788990',
        cdc: 'DEL-CDC-2201',
        status: 'In Operations',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-06-30',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        operationalDate: '2026-06-08',
        delayed: true,
        progressPercent: 50,
        lastUpdated: '2026-06-08T16:45:00.000Z',
      },
      {
        name: 'Rakesh Sinha',
        rank: '2nd Officer',
        passport: 'P9899001',
        cdc: 'DEL-CDC-2202',
        status: 'Biometrics Pending',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-06-30',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        operationalDate: '2026-06-08',
        progressPercent: 40,
      },
      {
        name: 'Tarun Malhotra',
        rank: '3rd Engineer',
        passport: 'P0900112',
        cdc: 'DEL-CDC-2203',
        status: 'Documents Verified',
        nextAction: 'Biometrics Coordination',
        joiningDate: '2026-06-30',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        operationalDate: '2026-06-08',
        progressPercent: 30,
      },
    ],
  },
  {
    applicationId: 'GLTS-M-2026-0055',
    companyName: 'Nordic Fleet Services',
    vesselName: 'MV Baltic Trader',
    country: 'Denmark',
    visaType: 'Crew Transit',
    jurisdiction: 'Chennai',
    assignedTeam: 'Chennai Team',
    assignedExecutive: 'Karthik Venkat',
    priority: 'Normal',
    assignmentSourceId: 'asgn-8690',
    passengers: [
      {
        name: 'Siddharth Banerjee',
        rank: 'Master',
        passport: 'P1011220',
        cdc: 'CHE-CDC-1101',
        status: 'Pending',
        nextAction: 'Mark for Operations',
        joiningDate: '2026-07-12',
        markedForOperations: false,
        groundServices: { Courier: 650 },
        progressPercent: 5,
        lastUpdated: '2026-06-09T05:30:00.000Z',
      },
    ],
  },
  {
    applicationId: GLTS_BATCH_IDS.schengenCrew,
    companyName: 'Oceanic Marine Ltd',
    vesselName: 'MV Schengen Express',
    country: 'France',
    visaType: 'Schengen Crew Visa',
    jurisdiction: 'Delhi',
    assignedTeam: 'Delhi Team',
    assignedExecutive: 'Karan Mehta',
    priority: 'High',
    assignmentSourceId: 'asgn-schengen-001',
    passengers: [
      {
        name: 'Aditya Sharma',
        rank: 'Chief Officer',
        passport: 'P2122330',
        cdc: 'DEL-CDC-9901',
        status: 'In Operations',
        nextAction: 'VFS Follow-up',
        joiningDate: '2026-02-25',
        groundServices: { 'Biometrics Coordination': 2500, 'VFS Support': 1800 },
        biometricsScheduled: '17 Feb 2026 · 11:00 · VFS Delhi',
        vfsStatus: 'Walk-in rescheduled',
        carryForward: true,
        operationalDate: '2026-02-17',
        lastUpdated: '2026-02-18T06:00:00.000Z',
        progressPercent: 60,
        remarks: 'Moved from yesterday — VFS walk-in rescheduled.',
        attachmentNames: ['vfs-reschedule-note.pdf'],
      },
      {
        name: 'Neeraj Gupta',
        rank: '2nd Engineer',
        passport: 'P3233440',
        cdc: 'DEL-CDC-9902',
        status: 'VFS Completed',
        nextAction: 'Passport Collection',
        joiningDate: '2026-02-25',
        groundServices: { 'Local Travel': 1200, Printing: 350 },
        expenses: [
          {
            id: 'exp-schengen-002-1',
            serviceName: 'Parking charges',
            prefilledAmount: 200,
            actualAmount: 180,
            isExtra: true,
            receiptFileName: 'vfs-parking-receipt.pdf',
            remarks: 'VFS Delhi parking',
          },
        ],
        vfsStatus: 'Documents submitted',
        operationalDate: '2026-02-18',
        lastUpdated: '2026-02-18T08:00:00.000Z',
        progressPercent: 75,
      },
    ],
  },
]

export const SEED_OPERATIONAL_CASES: OperationalCase[] = BATCH_SEEDS.flatMap((batch, batchIndex) =>
  buildBatchCases(batch, `op-case-${String(batchIndex + 1).padStart(3, '0')}`),
)

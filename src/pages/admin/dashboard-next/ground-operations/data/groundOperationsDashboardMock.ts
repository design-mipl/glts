import { PASSPORT_JOURNEY_STAGE_IDS } from '../../shared/config/passportJourney'
import type {
  GroundOperationsDashboardData,
  GroundOperationsDashboardFilters,
} from '../types'

export const GROUND_OPS_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This week', value: 'week' },
]

export const GROUND_OPS_BRANCH_OPTIONS = [
  { label: 'All branches', value: 'all' },
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Bengaluru', value: 'bengaluru' },
  { label: 'Chennai', value: 'chennai' },
]

export const GROUND_OPS_CITY_OPTIONS = [
  { label: 'All cities', value: 'all' },
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Delhi NCR', value: 'delhi' },
  { label: 'Bengaluru', value: 'bengaluru' },
  { label: 'Chennai', value: 'chennai' },
]

export const GROUND_OPS_EXECUTIVE_OPTIONS = [
  { label: 'All executives', value: 'all' },
  { label: 'Amit Desai', value: 'amit' },
  { label: 'Sana Qureshi', value: 'sana' },
  { label: 'Karan Mehta', value: 'karan' },
]

export const GROUND_OPS_ASSIGNMENT_STATUS_OPTIONS = [
  { label: 'All assignment statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Overdue', value: 'overdue' },
]

export const GROUND_OPS_APPOINTMENT_STATUS_OPTIONS = [
  { label: 'All appointment statuses', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rescheduled', value: 'rescheduled' },
  { label: 'Missed', value: 'missed' },
]

export const GROUND_OPS_PRIORITY_OPTIONS = [
  { label: 'All priorities', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

export const DEFAULT_GROUND_OPS_DASHBOARD_FILTERS: GroundOperationsDashboardFilters = {
  date: 'today',
  branch: 'all',
  city: 'all',
  executive: 'all',
  assignmentStatus: 'all',
  appointmentStatus: 'all',
  priority: 'all',
  search: '',
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
    detail: index === activeIndex ? 'Field action required' : undefined,
  }))
}

export const GROUND_OPERATIONS_DASHBOARD_MOCK: GroundOperationsDashboardData = {
  executiveName: 'Amit Desai',
  quickStats: [
    {
      id: 'assigned-today',
      label: "Today's assignments",
      value: 12,
      delta: 2.0,
      deltaLabel: 'vs yesterday',
      sparklineData: [8, 9, 10, 11, 11, 12, 12],
    },
    {
      id: 'completed',
      label: 'Completed',
      value: 5,
      delta: 8.0,
      deltaLabel: 'today',
      sparklineData: [2, 3, 3, 4, 4, 5, 5],
    },
    {
      id: 'pending',
      label: 'Pending',
      value: 5,
      delta: -1.0,
      deltaLabel: 'open',
      sparklineData: [7, 6, 6, 5, 5, 5, 5],
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: 2,
      delta: 1.0,
      deltaLabel: 'needs action',
      sparklineData: [1, 1, 1, 2, 2, 2, 2],
    },
    {
      id: 'appointments-today',
      label: 'Appointments today',
      value: 7,
      delta: 0,
      deltaLabel: 'scheduled',
      sparklineData: [5, 6, 6, 7, 7, 7, 7],
    },
    {
      id: 'funds-to-settle',
      label: 'Funds to settle',
      value: 3,
      delta: -1.0,
      deltaLabel: 'vs yesterday',
      sparklineData: [5, 4, 4, 3, 3, 3, 3],
    },
  ],
  notifications: [
    {
      id: 'gn-1',
      title: 'Airport pickup delayed — GLT-24081',
      body: 'Flight ETA slipped 40 minutes. Client waiting at T2.',
      unread: true,
      createdAt: '12 min ago',
    },
    {
      id: 'gn-2',
      title: 'VFS appointment in 90 minutes',
      body: 'GLT-24055 · BKC VFS · original docs required.',
      unread: true,
      createdAt: '28 min ago',
    },
    {
      id: 'gn-3',
      title: 'Settlement pending approval',
      body: 'Case FU-882 awaiting finance confirmation.',
      unread: false,
      createdAt: '2 hr ago',
    },
  ],
  todaysJobs: [
    {
      id: 'job-1',
      jobRef: 'GLT-24081',
      type: 'Airport pickup',
      location: 'BOM T2 · Priority Critical',
      assignee: 'Amit Desai',
      status: 'In progress',
      scheduledAt: 'Due 11:30',
    },
    {
      id: 'job-2',
      jobRef: 'GLT-24055',
      type: 'VFS appointment',
      location: 'BKC VFS · Priority High',
      assignee: 'Amit Desai',
      status: 'Pending',
      scheduledAt: 'Due 14:00',
    },
    {
      id: 'job-3',
      jobRef: 'GLT-24049',
      type: 'Passport collection',
      location: 'Embassy · Priority High',
      assignee: 'Amit Desai',
      status: 'Pending',
      scheduledAt: 'Due 16:30',
    },
    {
      id: 'job-4',
      jobRef: 'GLT-24041',
      type: 'Courier handover',
      location: 'Andheri hub · Priority Medium',
      assignee: 'Amit Desai',
      status: 'Overdue',
      scheduledAt: 'Due 10:00',
    },
    {
      id: 'job-5',
      jobRef: 'GLT-24033',
      type: 'Client meeting',
      location: 'BKC · Priority Medium',
      assignee: 'Amit Desai',
      status: 'Completed',
      scheduledAt: 'Done 09:15',
    },
  ],
  routeTimeline: [
    {
      id: 'rt-1',
      title: 'BOM T2 pickup',
      description: 'Collect applicants for embassy drop',
      date: '2026-07-21T11:30:00',
      status: 'active',
    },
    {
      id: 'rt-2',
      title: 'BKC VFS',
      description: 'GLT-24055 biometrics slot',
      date: '2026-07-21T14:00:00',
      status: 'pending',
    },
    {
      id: 'rt-3',
      title: 'Embassy collection',
      description: 'Passport pickup window',
      date: '2026-07-21T16:30:00',
      status: 'pending',
    },
    {
      id: 'rt-4',
      title: 'Andheri courier hub',
      description: 'Handover outbound consignments',
      date: '2026-07-21T18:00:00',
      status: 'pending',
    },
  ],
  appointmentSchedule: [
    {
      id: 'as-1',
      applicant: 'Aisha Khan',
      embassy: 'UAE VFS BKC',
      slot: '14:00',
      consultant: 'Amit Desai',
      status: 'Upcoming',
    },
    {
      id: 'as-2',
      applicant: 'Omar Al Farsi',
      embassy: 'Schengen VFS',
      slot: '15:30',
      consultant: 'Amit Desai',
      status: 'Upcoming',
    },
    {
      id: 'as-3',
      applicant: 'Meera Iyer',
      embassy: 'UK VAC',
      slot: '09:30',
      consultant: 'Amit Desai',
      status: 'Completed',
    },
  ],
  courierTracking: {
    trackingNumber: 'BLD-990211',
    courier: 'BlueDart',
    status: 'Out for delivery',
    eta: 'Today 17:45',
    stages: [
      { id: 's1', label: 'Picked up', status: 'completed' },
      { id: 's2', label: 'Hub', status: 'completed' },
      { id: 's3', label: 'Out for delivery', status: 'active' },
      { id: 's4', label: 'Delivered', status: 'pending' },
    ],
  },
  quickActions: [
    {
      id: 'qa-desk',
      title: 'Operations desk',
      description: 'Ground operations case handling.',
      badge: 'Assignments',
      href: '/admin/ground-operations/case-handling',
    },
    {
      id: 'qa-logistics',
      title: 'Passport tracking',
      description: 'Tracking & logistics workspace.',
      badge: 'Logistics',
      href: '/admin/ground-operations/logistics',
    },
    {
      id: 'qa-funds',
      title: 'Fund utilization',
      description: 'Field fund utilization cases.',
      badge: 'Funds',
      href: '/admin/ground-operations/funds',
    },
    {
      id: 'qa-allocation',
      title: 'Fund allocation',
      description: 'Finance fund allocation module.',
      badge: 'Allocation',
      href: '/admin/finance/fund-allocation',
    },
    {
      id: 'qa-expenses',
      title: 'Expense claims',
      description: 'Expense management workspace.',
      badge: 'Expenses',
      href: '/admin/finance/expenses',
    },
    {
      id: 'qa-apps',
      title: 'Applications',
      description: 'Retail application management.',
      badge: 'Apps',
      href: '/admin/application-management/retail',
    },
  ],
  recentActivity: [
    {
      id: 'ga-1',
      primary: 'Completed client meeting — GLT-24033',
      secondary: 'Today 09:20',
      badgeLabel: 'Done',
      badgeColor: 'success',
    },
    {
      id: 'ga-2',
      primary: 'Courier BLD-990211 scanned at hub',
      secondary: 'Today 10:05',
      badgeLabel: 'Courier',
      badgeColor: 'info',
    },
  ],
  appointmentRows: [
    {
      id: 'ap-1',
      applicationNumber: 'GLT-24055',
      applicant: 'Aisha Khan',
      appointmentTime: '14:00',
      location: 'UAE VFS BKC',
      assignedExecutive: 'Amit Desai',
      status: 'Upcoming',
      priority: 'High',
    },
    {
      id: 'ap-2',
      applicationNumber: 'GLT-24062',
      applicant: 'Omar Al Farsi',
      appointmentTime: '15:30',
      location: 'Schengen VFS',
      assignedExecutive: 'Amit Desai',
      status: 'Upcoming',
      priority: 'Critical',
    },
    {
      id: 'ap-3',
      applicationNumber: 'GLT-24033',
      applicant: 'Meera Iyer',
      appointmentTime: '09:30',
      location: 'UK VAC',
      assignedExecutive: 'Amit Desai',
      status: 'Completed',
      priority: 'Medium',
    },
    {
      id: 'ap-4',
      applicationNumber: 'GLT-24020',
      applicant: 'Rahul Menon',
      appointmentTime: '11:00',
      location: 'Embassy counter',
      assignedExecutive: 'Sana Qureshi',
      status: 'Rescheduled',
      priority: 'High',
    },
    {
      id: 'ap-5',
      applicationNumber: 'GLT-24011',
      applicant: 'Lina George',
      appointmentTime: '10:15',
      location: 'BKC VFS',
      assignedExecutive: 'Karan Mehta',
      status: 'Missed',
      priority: 'Critical',
    },
  ],
  passportJourney: {
    journeyStatus: 'Courier outbound',
    eta: 'Today 17:45',
    trackingNumber: 'BLD-990211',
    courier: 'BlueDart',
    stages: passportStages(1),
  },
  passportCourier: {
    trackingNumber: 'DTDC-441902',
    courier: 'DTDC',
    status: 'Awaiting pickup',
    eta: 'Today 18:30',
    stages: [
      { id: 'c1', label: 'Ready', status: 'completed' },
      { id: 'c2', label: 'Awaiting pickup', status: 'active' },
      { id: 'c3', label: 'In transit', status: 'pending' },
      { id: 'c4', label: 'Delivered', status: 'pending' },
    ],
  },
  documentMovement: [
    { label: 'Mon', inbound: 6, outbound: 5 },
    { label: 'Tue', inbound: 7, outbound: 6 },
    { label: 'Wed', inbound: 5, outbound: 7 },
    { label: 'Thu', inbound: 8, outbound: 6 },
    { label: 'Fri', inbound: 6, outbound: 8 },
  ],
  passportRows: [
    {
      id: 'pr-1',
      applicationNumber: 'GLT-24049',
      applicant: 'Omar Al Farsi',
      currentLocation: 'Embassy counter',
      courier: '—',
      trackingNumber: '—',
      eta: 'Today 16:30',
      status: 'Awaiting collection',
    },
    {
      id: 'pr-2',
      applicationNumber: 'GLT-24041',
      applicant: 'Sneha Kapoor',
      currentLocation: 'Courier hub',
      courier: 'BlueDart',
      trackingNumber: 'BLD-990211',
      eta: 'Today 17:45',
      status: 'In transit',
    },
    {
      id: 'pr-3',
      applicationNumber: 'GLT-24030',
      applicant: 'Dev Patel',
      currentLocation: 'Client',
      courier: 'DTDC',
      trackingNumber: 'DTDC-441100',
      eta: 'Delivered',
      status: 'Delivered',
    },
    {
      id: 'pr-4',
      applicationNumber: 'GLT-24022',
      applicant: 'Priya Nair',
      currentLocation: 'GLTS office',
      courier: 'BlueDart',
      trackingNumber: 'BLD-880100',
      eta: 'Tomorrow 11:00',
      status: 'Courier dispatch',
    },
  ],
  expenseSummary: {
    submitted: '₹48,200',
    approved: '₹31,500',
    pending: '₹12,400',
    rejected: '₹4,300',
  },
  settlementRows: [
    {
      id: 'st-1',
      settlementRef: 'SET-882',
      agent: 'Amit Desai',
      amount: '₹18,400',
      status: 'Pending',
      dueDate: '22 Jul',
    },
    {
      id: 'st-2',
      settlementRef: 'SET-871',
      agent: 'Amit Desai',
      amount: '₹9,200',
      status: 'Approved',
      dueDate: '18 Jul',
    },
  ],
  fundCaseRows: [
    {
      id: 'fc-1',
      caseRef: 'FU-882',
      allocatedAmount: '₹25,000',
      expensesIncurred: '₹18,400',
      availableBalance: '₹6,600',
      settlementAmount: '₹18,400',
      status: 'Pending settlement',
    },
    {
      id: 'fc-2',
      caseRef: 'FU-871',
      allocatedAmount: '₹15,000',
      expensesIncurred: '₹9,200',
      availableBalance: '₹5,800',
      settlementAmount: '₹9,200',
      status: 'Approved',
    },
    {
      id: 'fc-3',
      caseRef: 'FU-860',
      allocatedAmount: '₹20,000',
      expensesIncurred: '₹20,000',
      availableBalance: '₹0',
      settlementAmount: '₹20,000',
      status: 'Submitted',
    },
  ],
  activityFeed: [
    {
      id: 'af-1',
      primary: 'Assignment changed — GLT-24062 added to your day',
      secondary: 'Desk · 35 min ago',
      badgeLabel: 'Assign',
      badgeColor: 'primary',
    },
    {
      id: 'af-2',
      primary: 'Expense claim EXP-441 submitted',
      secondary: 'You · 1 hr ago',
      badgeLabel: 'Expense',
      badgeColor: 'warning',
    },
    {
      id: 'af-3',
      primary: 'Passport BLD-990211 out for delivery',
      secondary: 'Courier · 2 hr ago',
      badgeLabel: 'Passport',
      badgeColor: 'info',
    },
    {
      id: 'af-4',
      primary: 'Settlement SET-871 approved',
      secondary: 'Finance · Yesterday',
      badgeLabel: 'Settlement',
      badgeColor: 'success',
    },
  ],
  activityNotifications: [
    {
      id: 'an-1',
      title: 'Overdue courier handover',
      body: 'GLT-24041 still open past due time.',
      unread: true,
      createdAt: '20 min ago',
    },
  ],
  activityRoute: [
    {
      id: 'ar-1',
      title: 'Morning briefing complete',
      description: 'Desk sync closed',
      date: '2026-07-21T08:45:00',
      status: 'completed',
    },
    {
      id: 'ar-2',
      title: 'Airport lane active',
      description: 'BOM T2 pickup running',
      date: '2026-07-21T11:30:00',
      status: 'active',
    },
    {
      id: 'ar-3',
      title: 'Afternoon VFS block',
      description: 'Two slots remaining',
      date: '2026-07-21T14:00:00',
      status: 'pending',
    },
  ],
  activityDocuments: [
    { label: 'Pickup', inbound: 3, outbound: 1 },
    { label: 'VFS', inbound: 2, outbound: 2 },
    { label: 'Embassy', inbound: 1, outbound: 3 },
    { label: 'Courier', inbound: 4, outbound: 4 },
  ],
}

export function applyGroundOperationsDashboardFilters(
  data: GroundOperationsDashboardData,
  filters: GroundOperationsDashboardFilters,
): GroundOperationsDashboardData {
  const query = filters.search.trim().toLowerCase()
  const matchSearch = (...parts: Array<string | undefined>) =>
    !query || parts.some((part) => part?.toLowerCase().includes(query))

  const matchAssignmentStatus = (status: string) =>
    filters.assignmentStatus === 'all' ||
    status.toLowerCase().replace(/\s+/g, '-') === filters.assignmentStatus

  const matchAppointmentStatus = (status: string) =>
    filters.appointmentStatus === 'all' ||
    status.toLowerCase().replace(/\s+/g, '-') === filters.appointmentStatus

  const matchPriority = (priority: string) =>
    filters.priority === 'all' || priority.toLowerCase() === filters.priority

  const matchExecutive = (executive: string) =>
    filters.executive === 'all' ||
    executive.toLowerCase().includes(
      GROUND_OPS_EXECUTIVE_OPTIONS.find((opt) => opt.value === filters.executive)?.label
        .split(' ')[0]
        .toLowerCase() ?? filters.executive,
    )

  return {
    ...data,
    todaysJobs: data.todaysJobs.filter(
      (row) =>
        matchAssignmentStatus(row.status) &&
        matchSearch(row.jobRef, row.type, row.location, row.status),
    ),
    appointmentRows: data.appointmentRows.filter(
      (row) =>
        matchAppointmentStatus(row.status) &&
        matchPriority(row.priority) &&
        matchExecutive(row.assignedExecutive) &&
        matchSearch(row.applicationNumber, row.applicant, row.location),
    ),
    passportRows: data.passportRows.filter((row) =>
      matchSearch(
        row.applicationNumber,
        row.applicant,
        row.trackingNumber,
        row.courier,
        row.status,
      ),
    ),
    fundCaseRows: data.fundCaseRows.filter((row) =>
      matchSearch(row.caseRef, row.status),
    ),
  }
}

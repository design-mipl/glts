export type OpsApplicationChannel = 'retail' | 'corporate' | 'marine'
export type OpsSlaStatus = 'on_track' | 'at_risk' | 'breached'
export type OpsPriority = 'high' | 'medium' | 'low'
export type OpsAlertPriority = 'critical' | 'high' | 'medium'

export interface OperationsDashboardFilters {
  dateRange: [Date | null, Date | null]
  country: string
  applicationType: string
}

export const DEFAULT_OPERATIONS_DASHBOARD_FILTERS: OperationsDashboardFilters = {
  dateRange: [null, null],
  country: 'all',
  applicationType: 'all',
}

export const OPS_COUNTRY_FILTER_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'Germany', value: 'Germany' },
]

export const OPS_APPLICATION_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
]

export interface OperationsKpiMetric {
  id: string
  label: string
  total: number
  dueToday: number
  overdue: number
  delta?: number
  deltaLabel?: string
  accent: 'primary' | 'success' | 'warning' | 'error' | 'info'
  iconKey: string
  href: string
}

export interface MyApplicationRow {
  id: string
  glNumber: string
  applicant: string
  company: string
  country: string
  visaType: string
  currentStage: string
  nextActionRequired: string
  waitingOn: string
  priority: OpsPriority
  slaStatus: OpsSlaStatus
  slaTimer: string
  dueDate: string
  dueDateSort: number
  channel: OpsApplicationChannel
  consultant: string
  applicationHref: string
}

export interface TodayTaskItem {
  id: string
  title: string
  taskCount: number
  dueTime: string
  priority: OpsPriority
  consultant: string
}

export interface CorrectionRequestRow {
  id: string
  applicationId: string
  applicant: string
  raisedBy: string
  reason: string
  waitingSince: string
  waitingDays: number
  assignedTo: string
  isOverdue: boolean
  consultant: string
}

export interface AwaitingDocumentRow {
  id: string
  applicant: string
  outstandingDocuments: string
  lastReminderSent: string
  reminderCount: number
  daysWaiting: number
  consultant: string
  channel: OpsApplicationChannel
  country: string
}

export interface ReviewQcRow {
  id: string
  applicationId: string
  applicant: string
  country: string
  submittedBy: string
  currentStage: string
  slaTimer: string
  slaStatus: OpsSlaStatus
  consultant: string
}

export interface AppointmentSubmissionRow {
  id: string
  applicant: string
  appointmentDate: string
  country: string
  vfsLocation: string
  submissionStatus: string
  assignedExecutive: string
  consultant: string
}

export interface MarinePriorityRow {
  id: string
  vesselName: string
  crewName: string
  joiningPort: string
  joiningDate: string
  daysRemaining: number
  visaStatus: string
  priority: OpsPriority
  consultant: string
}

export interface OperationsCriticalAlert {
  id: string
  title: string
  count: number
  oldestWaiting: string
  priority: OpsAlertPriority
}

export interface MyActivityRow {
  id: string
  timestamp: string
  action: string
  application: string
  result: string
  consultant: string
}

export interface MyPerformanceMetric {
  id: string
  label: string
  value: string
  subtitle: string
  accent: 'primary' | 'success' | 'info'
}

export const MOCK_CONSULTANT_NAME = 'Riya Sharma'

export const OPERATIONS_KPIS: OperationsKpiMetric[] = [
  {
    id: 'my_applications',
    label: 'My Applications',
    total: 24,
    dueToday: 6,
    overdue: 2,
    delta: 4.2,
    deltaLabel: 'vs last week',
    accent: 'primary',
    iconKey: 'files',
    href: '/admin/application-management/marine',
  },
  {
    id: 'cases_draft',
    label: 'Cases in Draft',
    total: 5,
    dueToday: 2,
    overdue: 0,
    delta: -1.1,
    deltaLabel: 'vs last week',
    accent: 'info',
    iconKey: 'draft',
    href: '/admin/application-management/marine',
  },
  {
    id: 'awaiting_documents',
    label: 'Awaiting Client Documents',
    total: 8,
    dueToday: 3,
    overdue: 1,
    delta: 2.4,
    deltaLabel: 'vs last week',
    accent: 'warning',
    iconKey: 'documents',
    href: '/admin/application-management/marine',
  },
  {
    id: 'pending_review',
    label: 'Pending My Review / QC',
    total: 6,
    dueToday: 4,
    overdue: 1,
    accent: 'warning',
    iconKey: 'review',
    href: '/admin/application-management/marine',
  },
  {
    id: 'appointment_pending',
    label: 'Appointment Pending',
    total: 4,
    dueToday: 2,
    overdue: 0,
    accent: 'info',
    iconKey: 'calendar',
    href: '/admin/ground-operations/case-handling',
  },
  {
    id: 'submission_pending',
    label: 'Submission Pending',
    total: 3,
    dueToday: 1,
    overdue: 0,
    accent: 'info',
    iconKey: 'send',
    href: '/admin/ground-operations/case-handling',
  },
  {
    id: 'collections_pending',
    label: 'Collections Pending',
    total: 2,
    dueToday: 1,
    overdue: 0,
    accent: 'primary',
    iconKey: 'collection',
    href: '/admin/ground-operations/logistics',
  },
  {
    id: 'critical_cases',
    label: 'Critical Cases',
    total: 3,
    dueToday: 3,
    overdue: 2,
    delta: 1,
    deltaLabel: 'vs last week',
    accent: 'error',
    iconKey: 'alert',
    href: '/admin/ground-operations/case-handling',
  },
]

export const MY_APPLICATIONS: MyApplicationRow[] = [
  {
    id: 'ma1',
    glNumber: 'GL-2026-01482',
    applicant: 'Arjun Mehta',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Standard Visitor',
    currentStage: 'Verification Pending',
    nextActionRequired: 'Review submitted documents',
    waitingOn: 'Documentation Team',
    priority: 'high',
    slaStatus: 'at_risk',
    slaTimer: '4h 12m',
    dueDate: '01 Jul 2026',
    dueDateSort: 20260701,
    channel: 'retail',
    consultant: MOCK_CONSULTANT_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01482',
  },
  {
    id: 'ma2',
    glNumber: 'GL-2026-01471',
    applicant: 'MV Ocean Star / Crew',
    company: 'Harborline Shipping',
    country: 'Singapore',
    visaType: 'Crew Transit',
    currentStage: 'QC Pending',
    nextActionRequired: 'Approve QC checklist',
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'breached',
    slaTimer: 'Breached',
    dueDate: '30 Jun 2026',
    dueDateSort: 20260630,
    channel: 'marine',
    consultant: MOCK_CONSULTANT_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01471',
  },
  {
    id: 'ma3',
    glNumber: 'GL-2026-01465',
    applicant: 'TechNova Solutions Ltd',
    company: 'TechNova Solutions Ltd',
    country: 'Germany',
    visaType: 'Business Schengen',
    currentStage: 'Docs Pending',
    nextActionRequired: 'Follow up for bank statements',
    waitingOn: 'Client',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '1d 2h',
    dueDate: '03 Jul 2026',
    dueDateSort: 20260703,
    channel: 'corporate',
    consultant: MOCK_CONSULTANT_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01465',
  },
  {
    id: 'ma4',
    glNumber: 'GL-2026-01458',
    applicant: 'Priya Nair',
    company: 'Individual',
    country: 'United States',
    visaType: 'B1/B2',
    currentStage: 'Appointment Pending',
    nextActionRequired: 'Confirm VAC slot',
    waitingOn: 'VFS',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '6h 30m',
    dueDate: '02 Jul 2026',
    dueDateSort: 20260702,
    channel: 'retail',
    consultant: MOCK_CONSULTANT_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01458',
  },
  {
    id: 'ma5',
    glNumber: 'GL-2026-01451',
    applicant: 'James Okafor',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Student',
    currentStage: 'Submission Pending',
    nextActionRequired: 'Submit to embassy',
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'at_risk',
    slaTimer: '3h 45m',
    dueDate: '01 Jul 2026',
    dueDateSort: 20260701,
    channel: 'retail',
    consultant: MOCK_CONSULTANT_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01451',
  },
  {
    id: 'ma6',
    glNumber: 'GL-2026-01444',
    applicant: 'Global Freight Partners',
    company: 'Global Freight Partners',
    country: 'Germany',
    visaType: 'Business Schengen',
    currentStage: 'Collections Pending',
    nextActionRequired: 'Coordinate passport pickup',
    waitingOn: 'Ground Operations',
    priority: 'low',
    slaStatus: 'on_track',
    slaTimer: '2d 4h',
    dueDate: '05 Jul 2026',
    dueDateSort: 20260705,
    channel: 'corporate',
    consultant: MOCK_CONSULTANT_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01444',
  },
  {
    id: 'ma7',
    glNumber: 'GL-2026-01439',
    applicant: 'Ananya Desai',
    company: 'Individual',
    country: 'United States',
    visaType: 'F1 Student',
    currentStage: 'Draft',
    nextActionRequired: 'Complete application form',
    waitingOn: 'Me',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '5h 00m',
    dueDate: '04 Jul 2026',
    dueDateSort: 20260704,
    channel: 'retail',
    consultant: MOCK_CONSULTANT_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01439',
  },
]

export const TODAY_TASKS: TodayTaskItem[] = [
  {
    id: 'tt1',
    title: 'Follow up with client for missing documents',
    taskCount: 5,
    dueTime: '11:00 AM',
    priority: 'high',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'tt2',
    title: 'Review applications for QC',
    taskCount: 4,
    dueTime: '1:30 PM',
    priority: 'high',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'tt3',
    title: 'Follow up with Documentation Team',
    taskCount: 3,
    dueTime: '3:00 PM',
    priority: 'medium',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'tt4',
    title: 'Send application status updates',
    taskCount: 6,
    dueTime: '4:30 PM',
    priority: 'medium',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'tt5',
    title: 'Review correction requests',
    taskCount: 2,
    dueTime: '5:00 PM',
    priority: 'high',
    consultant: MOCK_CONSULTANT_NAME,
  },
]

export const CORRECTION_REQUESTS: CorrectionRequestRow[] = [
  {
    id: 'cr1',
    applicationId: 'GLTS-2026-01408',
    applicant: 'Sneha Pillai',
    raisedBy: 'Documentation Team',
    reason: 'Bank statement pages incomplete',
    waitingSince: '2d 4h',
    waitingDays: 2,
    assignedTo: MOCK_CONSULTANT_NAME,
    isOverdue: true,
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'cr2',
    applicationId: 'GLTS-2026-01396',
    applicant: 'Apex Logistics Group',
    raisedBy: 'QC Supervisor',
    reason: 'Invitation letter missing company seal',
    waitingSince: '6h 20m',
    waitingDays: 0,
    assignedTo: MOCK_CONSULTANT_NAME,
    isOverdue: false,
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'cr3',
    applicationId: 'GLTS-2026-01389',
    applicant: 'Michael Chen',
    raisedBy: 'Documentation Team',
    reason: 'Passport copy not legible',
    waitingSince: '1d 8h',
    waitingDays: 1,
    assignedTo: MOCK_CONSULTANT_NAME,
    isOverdue: false,
    consultant: MOCK_CONSULTANT_NAME,
  },
]

export const AWAITING_DOCUMENTS: AwaitingDocumentRow[] = [
  {
    id: 'ad1',
    applicant: 'TechNova Solutions Ltd',
    outstandingDocuments: 'Bank statements, invitation letter',
    lastReminderSent: '28 Jun 2026',
    reminderCount: 2,
    daysWaiting: 4,
    consultant: MOCK_CONSULTANT_NAME,
    channel: 'corporate',
    country: 'Germany',
  },
  {
    id: 'ad2',
    applicant: 'Arjun Mehta',
    outstandingDocuments: 'Travel insurance certificate',
    lastReminderSent: '29 Jun 2026',
    reminderCount: 1,
    daysWaiting: 2,
    consultant: MOCK_CONSULTANT_NAME,
    channel: 'retail',
    country: 'United Kingdom',
  },
  {
    id: 'ad3',
    applicant: 'Harborline Shipping',
    outstandingDocuments: 'Crew list, vessel registration',
    lastReminderSent: '27 Jun 2026',
    reminderCount: 3,
    daysWaiting: 5,
    consultant: MOCK_CONSULTANT_NAME,
    channel: 'marine',
    country: 'Singapore',
  },
]

export const REVIEW_QC_QUEUE: ReviewQcRow[] = [
  {
    id: 'rq1',
    applicationId: 'GLTS-2026-01471',
    applicant: 'MV Ocean Star / Crew',
    country: 'Singapore',
    submittedBy: 'Documentation Team',
    currentStage: 'QC Pending',
    slaTimer: 'Breached',
    slaStatus: 'breached',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'rq2',
    applicationId: 'GLTS-2026-01444',
    applicant: 'James Okafor',
    country: 'United Kingdom',
    submittedBy: 'Documentation Team',
    currentStage: 'QC Pending',
    slaTimer: '2h 10m',
    slaStatus: 'on_track',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'rq3',
    applicationId: 'GLTS-2026-01451',
    applicant: 'Harborline Shipping',
    country: 'United Arab Emirates',
    submittedBy: 'Documentation Team',
    currentStage: 'Verification Pending',
    slaTimer: '3h 45m',
    slaStatus: 'at_risk',
    consultant: MOCK_CONSULTANT_NAME,
  },
]

export const APPOINTMENT_SUBMISSION_QUEUE: AppointmentSubmissionRow[] = [
  {
    id: 'as1',
    applicant: 'Priya Nair',
    appointmentDate: '02 Jul 2026 — 10:30 AM',
    country: 'United States',
    vfsLocation: 'Mumbai VAC',
    submissionStatus: 'Appointment confirmed',
    assignedExecutive: MOCK_CONSULTANT_NAME,
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'as2',
    applicant: 'James Okafor',
    appointmentDate: '03 Jul 2026 — 2:00 PM',
    country: 'United Kingdom',
    vfsLocation: 'Delhi VAC',
    submissionStatus: 'Ready for submission',
    assignedExecutive: MOCK_CONSULTANT_NAME,
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'as3',
    applicant: 'Global Freight Partners',
    appointmentDate: '04 Jul 2026 — 11:00 AM',
    country: 'Germany',
    vfsLocation: 'Bengaluru VAC',
    submissionStatus: 'Slot pending',
    assignedExecutive: MOCK_CONSULTANT_NAME,
    consultant: MOCK_CONSULTANT_NAME,
  },
]

export const MARINE_PRIORITY_CASES: MarinePriorityRow[] = [
  {
    id: 'mp1',
    vesselName: 'MV Pacific Dawn',
    crewName: 'Rajesh Kumar',
    joiningPort: 'Singapore',
    joiningDate: '03 Jul 2026',
    daysRemaining: 5,
    visaStatus: 'QC Pending',
    priority: 'high',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'mp2',
    vesselName: 'MV Ocean Star',
    crewName: 'Crew Batch (12)',
    joiningPort: 'Dubai',
    joiningDate: '08 Jul 2026',
    daysRemaining: 9,
    visaStatus: 'Docs Pending',
    priority: 'high',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'mp3',
    vesselName: 'MV Atlantic Spirit',
    crewName: 'Suresh Menon',
    joiningPort: 'Chennai',
    joiningDate: '12 Jul 2026',
    daysRemaining: 13,
    visaStatus: 'Submitted',
    priority: 'medium',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'mp4',
    vesselName: 'MV Harbor Queen',
    crewName: 'Anil Verma',
    joiningPort: 'Mumbai',
    joiningDate: '15 Jul 2026',
    daysRemaining: 16,
    visaStatus: 'Embassy Processing',
    priority: 'low',
    consultant: MOCK_CONSULTANT_NAME,
  },
]

export const OPERATIONS_CRITICAL_ALERTS: OperationsCriticalAlert[] = [
  { id: 'oca1', title: 'SLA Breached', count: 2, oldestWaiting: '6h 20m', priority: 'critical' },
  { id: 'oca2', title: 'Awaiting Client Documents', count: 3, oldestWaiting: '5d 2h', priority: 'high' },
  { id: 'oca3', title: 'Pending QC > 4 Hours', count: 1, oldestWaiting: '5h 10m', priority: 'high' },
  { id: 'oca4', title: 'Appointment Missed', count: 1, oldestWaiting: '2h 30m', priority: 'critical' },
  { id: 'oca5', title: 'Marine Priority Cases', count: 2, oldestWaiting: '5d 0h', priority: 'critical' },
  { id: 'oca6', title: 'Escalations', count: 1, oldestWaiting: '8h 45m', priority: 'high' },
]

export const MY_ACTIVITY_TODAY: MyActivityRow[] = [
  {
    id: 'act1',
    timestamp: '09:12 AM',
    action: 'Status Updated',
    application: 'GL-2026-01482',
    result: 'Moved to Verification Pending',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'act2',
    timestamp: '10:05 AM',
    action: 'Reminder Sent',
    application: 'GL-2026-01465',
    result: 'Client notified for bank statements',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'act3',
    timestamp: '11:30 AM',
    action: 'QC Completed',
    application: 'GL-2026-01444',
    result: 'Approved for submission',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'act4',
    timestamp: '12:45 PM',
    action: 'Correction Raised',
    application: 'GLTS-2026-01408',
    result: 'Sent back to client',
    consultant: MOCK_CONSULTANT_NAME,
  },
  {
    id: 'act5',
    timestamp: '2:10 PM',
    action: 'Application Submitted',
    application: 'GL-2026-01451',
    result: 'Filed with UK VAC',
    consultant: MOCK_CONSULTANT_NAME,
  },
]

export const MY_PERFORMANCE_METRICS: MyPerformanceMetric[] = [
  {
    id: 'completed_today',
    label: 'Applications Completed Today',
    value: '5',
    subtitle: 'Closed or submitted today',
    accent: 'success',
  },
  {
    id: 'avg_processing',
    label: 'Average Processing Time',
    value: '2.4 days',
    subtitle: 'Per application this week',
    accent: 'primary',
  },
  {
    id: 'sla_compliance',
    label: 'SLA Compliance %',
    value: '94%',
    subtitle: 'Your cases this month',
    accent: 'info',
  },
]

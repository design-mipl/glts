export type DocApplicationChannel = 'retail' | 'corporate' | 'marine'
export type DocSlaStatus = 'on_track' | 'at_risk' | 'breached'
export type DocPriority = 'high' | 'medium' | 'low'
export type DocAlertPriority = 'critical' | 'high' | 'medium'

export interface DocumentationDashboardFilters {
  dateRange: [Date | null, Date | null]
  country: string
  applicationType: string
}

export const DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS: DocumentationDashboardFilters = {
  dateRange: [null, null],
  country: 'all',
  applicationType: 'all',
}

export const DOC_COUNTRY_FILTER_OPTIONS = [
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
]

export interface DocumentationKpiMetric {
  id: string
  label: string
  total: number
  dueToday: number
  overdue: number
  accent: 'primary' | 'success' | 'warning' | 'error' | 'info'
  iconKey: string
  href: string
}

export interface DocumentationApplicationRow {
  id: string
  glNumber: string
  applicant: string
  company: string
  country: string
  visaType: string
  currentStage: string
  nextAction: string
  waitingOn: string
  priority: DocPriority
  slaStatus: DocSlaStatus
  slaTimer: string
  dueDate: string
  dueDateSort: number
  channel: DocApplicationChannel
  executive: string
  applicationHref: string
}

export interface FormToFillRow {
  id: string
  applicant: string
  country: string
  visaType: string
  formStatus: string
  dueTime: string
  executive: string
  channel: DocApplicationChannel
}

export interface FeeToPayRow {
  id: string
  applicant: string
  country: string
  embassyVfs: string
  feeAmount: string
  paymentStatus: string
  dueTime: string
  executive: string
}

export interface AppointmentToBookRow {
  id: string
  applicant: string
  country: string
  visaType: string
  appointmentType: string
  preferredDate: string
  status: string
  executive: string
}

export interface DocReviewQcRow {
  id: string
  applicationId: string
  applicant: string
  country: string
  submittedBy: string
  currentStage: string
  slaTimer: string
  slaStatus: DocSlaStatus
  executive: string
}

export interface DocCorrectionRequestRow {
  id: string
  applicationId: string
  applicant: string
  raisedBy: string
  reason: string
  waitingSince: string
  waitingDays: number
  assignedTo: string
  status: string
  isOverdue: boolean
  executive: string
}

export interface ReadyForSubmissionRow {
  id: string
  applicant: string
  country: string
  visaType: string
  submissionReadiness: string
  documentsVerified: string
  executive: string
}

export interface SubmissionPendingRow {
  id: string
  applicant: string
  country: string
  embassy: string
  submissionDate: string
  submissionStatus: string
  assignedExecutive: string
  executive: string
}

export interface DocumentationCriticalAlert {
  id: string
  title: string
  count: number
  oldestWaiting: string
  priority: DocAlertPriority
}

export interface DocumentationActivityRow {
  id: string
  timestamp: string
  action: string
  application: string
  result: string
  executive: string
  recordedAt: Date
}

export interface DocumentationPerformanceMetric {
  id: string
  label: string
  value: string
  subtitle: string
  accent: 'primary' | 'success' | 'info'
}

export const MOCK_DOCUMENTATION_EXECUTIVE_NAME = 'Neha Kulkarni'

export const DOCUMENTATION_KPIS: DocumentationKpiMetric[] = [
  {
    id: 'my_applications',
    label: 'My Applications',
    total: 18,
    dueToday: 5,
    overdue: 1,
    accent: 'primary',
    iconKey: 'files',
    href: '/admin/application-management/marine',
  },
  {
    id: 'incomplete_documents',
    label: 'Incomplete Documents',
    total: 6,
    dueToday: 3,
    overdue: 1,
    accent: 'warning',
    iconKey: 'documents',
    href: '/admin/application-management/marine',
  },
  {
    id: 'pending_review',
    label: 'Pending My Review / QC',
    total: 5,
    dueToday: 4,
    overdue: 1,
    accent: 'warning',
    iconKey: 'review',
    href: '/admin/application-management/marine',
  },
  {
    id: 'forms_today',
    label: 'Forms To Be Filled Today',
    total: 4,
    dueToday: 4,
    overdue: 0,
    accent: 'info',
    iconKey: 'form',
    href: '/admin/application-management/marine',
  },
  {
    id: 'fees_today',
    label: 'Fees To Be Paid Today',
    total: 3,
    dueToday: 3,
    overdue: 0,
    accent: 'info',
    iconKey: 'fee',
    href: '/admin/finance/expenses',
  },
  {
    id: 'appointments_today',
    label: 'Appointments To Be Booked',
    total: 2,
    dueToday: 2,
    overdue: 0,
    accent: 'primary',
    iconKey: 'calendar',
    href: '/admin/ground-operations/case-handling',
  },
  {
    id: 'ready_submit',
    label: 'Ready To Submit',
    total: 4,
    dueToday: 2,
    overdue: 0,
    accent: 'success',
    iconKey: 'ready',
    href: '/admin/ground-operations/case-handling',
  },
  {
    id: 'submission_pending',
    label: 'Submission Pending',
    total: 3,
    dueToday: 1,
    overdue: 1,
    accent: 'error',
    iconKey: 'submit',
    href: '/admin/ground-operations/case-handling',
  },
]

export const DOCUMENTATION_APPLICATIONS: DocumentationApplicationRow[] = [
  {
    id: 'da1',
    glNumber: 'GL-2026-01471',
    applicant: 'MV Ocean Star / Crew',
    company: 'Harborline Shipping',
    country: 'Singapore',
    visaType: 'Crew Transit',
    currentStage: 'QC Pending',
    nextAction: 'Complete QC checklist',
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'breached',
    slaTimer: 'Breached',
    dueDate: '30 Jun 2026',
    dueDateSort: 20260630,
    channel: 'marine',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01471',
  },
  {
    id: 'da2',
    glNumber: 'GL-2026-01465',
    applicant: 'TechNova Solutions Ltd',
    company: 'TechNova Solutions Ltd',
    country: 'Germany',
    visaType: 'Business Schengen',
    currentStage: 'Verification Pending',
    nextAction: 'Verify bank statements',
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'at_risk',
    slaTimer: '3h 20m',
    dueDate: '01 Jul 2026',
    dueDateSort: 20260701,
    channel: 'corporate',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01465',
  },
  {
    id: 'da3',
    glNumber: 'GL-2026-01451',
    applicant: 'Harborline Shipping',
    company: 'Harborline Shipping',
    country: 'United Arab Emirates',
    visaType: 'Crew Offshore',
    currentStage: 'Docs Pending',
    nextAction: 'Request missing crew documents',
    waitingOn: 'Client',
    priority: 'medium',
    slaStatus: 'at_risk',
    slaTimer: '5h 10m',
    dueDate: '01 Jul 2026',
    dueDateSort: 20260701,
    channel: 'marine',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01451',
  },
  {
    id: 'da4',
    glNumber: 'GL-2026-01444',
    applicant: 'James Okafor',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Student',
    currentStage: 'Form Filling',
    nextAction: 'Complete embassy application form',
    waitingOn: 'Me',
    priority: 'medium',
    slaStatus: 'on_track',
    slaTimer: '1d 4h',
    dueDate: '02 Jul 2026',
    dueDateSort: 20260702,
    channel: 'retail',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01444',
  },
  {
    id: 'da5',
    glNumber: 'GL-2026-01439',
    applicant: 'Global Freight Partners',
    company: 'Global Freight Partners',
    country: 'Germany',
    visaType: 'Business Schengen',
    currentStage: 'Submission Pending',
    nextAction: 'Prepare embassy submission pack',
    waitingOn: 'Me',
    priority: 'high',
    slaStatus: 'on_track',
    slaTimer: '6h 00m',
    dueDate: '02 Jul 2026',
    dueDateSort: 20260702,
    channel: 'corporate',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01439',
  },
  {
    id: 'da6',
    glNumber: 'GL-2026-01433',
    applicant: 'Ananya Desai',
    company: 'Individual',
    country: 'United States',
    visaType: 'F1 Student',
    currentStage: 'Fee Payment',
    nextAction: 'Pay VFS fee',
    waitingOn: 'Me',
    priority: 'low',
    slaStatus: 'on_track',
    slaTimer: '2d 0h',
    dueDate: '04 Jul 2026',
    dueDateSort: 20260704,
    channel: 'retail',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    applicationHref: '/admin/application-management/marine/GL-2026-01433',
  },
]

export const FORMS_TO_FILL_TODAY: FormToFillRow[] = [
  {
    id: 'ff1',
    applicant: 'James Okafor',
    country: 'United Kingdom',
    visaType: 'Student',
    formStatus: 'In progress',
    dueTime: '11:00 AM',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    channel: 'retail',
  },
  {
    id: 'ff2',
    applicant: 'TechNova Solutions Ltd',
    country: 'Germany',
    visaType: 'Business Schengen',
    formStatus: 'Not started',
    dueTime: '1:00 PM',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    channel: 'corporate',
  },
  {
    id: 'ff3',
    applicant: 'MV Ocean Star / Crew',
    country: 'Singapore',
    visaType: 'Crew Transit',
    formStatus: 'Awaiting data',
    dueTime: '3:30 PM',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    channel: 'marine',
  },
]

export const FEES_TO_PAY_TODAY: FeeToPayRow[] = [
  {
    id: 'fp1',
    applicant: 'Ananya Desai',
    country: 'United States',
    embassyVfs: 'US VAC Mumbai',
    feeAmount: '₹18,500',
    paymentStatus: 'Pending',
    dueTime: '12:00 PM',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
  {
    id: 'fp2',
    applicant: 'Global Freight Partners',
    country: 'Germany',
    embassyVfs: 'Germany VAC Delhi',
    feeAmount: '₹12,400',
    paymentStatus: 'Pending',
    dueTime: '2:00 PM',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
]

export const APPOINTMENTS_TO_BOOK: AppointmentToBookRow[] = [
  {
    id: 'ab1',
    applicant: 'James Okafor',
    country: 'United Kingdom',
    visaType: 'Student',
    appointmentType: 'Biometric',
    preferredDate: '05 Jul 2026',
    status: 'Slot search',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
  {
    id: 'ab2',
    applicant: 'Harborline Shipping',
    country: 'United Arab Emirates',
    visaType: 'Crew Offshore',
    appointmentType: 'Document submission',
    preferredDate: '06 Jul 2026',
    status: 'Awaiting confirmation',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
]

export const DOC_REVIEW_QC_QUEUE: DocReviewQcRow[] = [
  {
    id: 'drq1',
    applicationId: 'GLTS-2026-01471',
    applicant: 'MV Ocean Star / Crew',
    country: 'Singapore',
    submittedBy: 'Operations — Vikram Patel',
    currentStage: 'QC Pending',
    slaTimer: 'Breached',
    slaStatus: 'breached',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
  {
    id: 'drq2',
    applicationId: 'GLTS-2026-01465',
    applicant: 'TechNova Solutions Ltd',
    country: 'Germany',
    submittedBy: 'Operations — Riya Sharma',
    currentStage: 'Verification Pending',
    slaTimer: '3h 20m',
    slaStatus: 'at_risk',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
  {
    id: 'drq3',
    applicationId: 'GLTS-2026-01451',
    applicant: 'Harborline Shipping',
    country: 'United Arab Emirates',
    submittedBy: 'Operations — Sana Iqbal',
    currentStage: 'Docs Pending',
    slaTimer: '5h 10m',
    slaStatus: 'at_risk',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
]

export const DOC_CORRECTION_REQUESTS: DocCorrectionRequestRow[] = [
  {
    id: 'dcr1',
    applicationId: 'GLTS-2026-01408',
    applicant: 'Sneha Pillai',
    raisedBy: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    reason: 'Bank statement pages incomplete',
    waitingSince: '2d 4h',
    waitingDays: 2,
    assignedTo: 'Operations — Riya Sharma',
    status: 'Open',
    isOverdue: true,
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
  {
    id: 'dcr2',
    applicationId: 'GLTS-2026-01396',
    applicant: 'Apex Logistics Group',
    raisedBy: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    reason: 'Invitation letter missing company seal',
    waitingSince: '6h 20m',
    waitingDays: 0,
    assignedTo: 'Operations — Riya Sharma',
    status: 'In progress',
    isOverdue: false,
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
]

export const READY_FOR_SUBMISSION: ReadyForSubmissionRow[] = [
  {
    id: 'rs1',
    applicant: 'Global Freight Partners',
    country: 'Germany',
    visaType: 'Business Schengen',
    submissionReadiness: '95%',
    documentsVerified: '12/12',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
  {
    id: 'rs2',
    applicant: 'James Okafor',
    country: 'United Kingdom',
    visaType: 'Student',
    submissionReadiness: '88%',
    documentsVerified: '10/11',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
]

export const SUBMISSION_PENDING: SubmissionPendingRow[] = [
  {
    id: 'sp1',
    applicant: 'TechNova Solutions Ltd',
    country: 'Germany',
    embassy: 'German Embassy',
    submissionDate: '02 Jul 2026',
    submissionStatus: 'Pack prepared',
    assignedExecutive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
  {
    id: 'sp2',
    applicant: 'MV Ocean Star / Crew',
    country: 'Singapore',
    embassy: 'Singapore ICA',
    submissionDate: '01 Jul 2026',
    submissionStatus: 'Delayed',
    assignedExecutive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
  },
]

export const DOCUMENTATION_CRITICAL_ALERTS: DocumentationCriticalAlert[] = [
  { id: 'dca1', title: 'Awaiting Client Documents', count: 4, oldestWaiting: '3d 6h', priority: 'high' },
  { id: 'dca2', title: 'Pending QC > 4 Hours', count: 2, oldestWaiting: '5h 10m', priority: 'critical' },
  { id: 'dca3', title: 'Forms Pending', count: 3, oldestWaiting: '4h 30m', priority: 'high' },
  { id: 'dca4', title: 'Fee Payment Pending', count: 2, oldestWaiting: '2h 15m', priority: 'medium' },
  { id: 'dca5', title: 'Appointment Booking Pending', count: 2, oldestWaiting: '1d 2h', priority: 'high' },
  { id: 'dca6', title: 'Submission Delayed', count: 1, oldestWaiting: '6h 40m', priority: 'critical' },
  { id: 'dca7', title: 'SLA Breached', count: 1, oldestWaiting: '8h 20m', priority: 'critical' },
]

const now = Date.now()
export const DOCUMENTATION_ACTIVITY_TODAY: DocumentationActivityRow[] = [
  {
    id: 'dact1',
    timestamp: '09:15 AM',
    action: 'Document Verified',
    application: 'GL-2026-01465',
    result: 'Bank statements approved',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 4 * 3600000),
  },
  {
    id: 'dact2',
    timestamp: '10:30 AM',
    action: 'Form Filled',
    application: 'GL-2026-01444',
    result: 'UK student form section 2 completed',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 2.5 * 3600000),
  },
  {
    id: 'dact3',
    timestamp: '11:45 AM',
    action: 'QC Completed',
    application: 'GL-2026-01471',
    result: 'Moved to fee payment stage',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 1.25 * 3600000),
  },
  {
    id: 'dact4',
    timestamp: '12:20 PM',
    action: 'Correction Raised',
    application: 'GLTS-2026-01408',
    result: 'Sent to operations for client follow-up',
    executive: MOCK_DOCUMENTATION_EXECUTIVE_NAME,
    recordedAt: new Date(now - 90 * 60000),
  },
]

export const DOCUMENTATION_PERFORMANCE_METRICS: DocumentationPerformanceMetric[] = [
  {
    id: 'processed_today',
    label: 'Applications Processed Today',
    value: '7',
    subtitle: 'Verified, QC completed, or advanced today',
    accent: 'success',
  },
  {
    id: 'qc_completed',
    label: 'QC Completed Today',
    value: '4',
    subtitle: 'Checklists signed off today',
    accent: 'primary',
  },
  {
    id: 'avg_processing',
    label: 'Average Processing Time',
    value: '1.8 days',
    subtitle: 'Per application this week',
    accent: 'info',
  },
]

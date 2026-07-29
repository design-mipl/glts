import {
  APPLICATION_PIPELINE_STAGE_IDS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { PASSPORT_JOURNEY_STAGE_IDS } from '../../shared/config/passportJourney'
import type { OperationsDashboardData, OperationsDashboardFilters } from '../types'

export const OPERATIONS_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
]

export const OPERATIONS_COUNTRY_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'UAE', value: 'uae' },
  { label: 'Schengen', value: 'schengen' },
  { label: 'UK', value: 'uk' },
  { label: 'USA', value: 'us' },
]

export const OPERATIONS_VISA_TYPE_OPTIONS = [
  { label: 'All visa types', value: 'all' },
  { label: 'Tourist', value: 'tourist' },
  { label: 'Business', value: 'business' },
  { label: 'Transit', value: 'transit' },
  { label: 'Marine', value: 'marine' },
]

export const OPERATIONS_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Completed', value: 'completed' },
]

export const OPERATIONS_PRIORITY_OPTIONS = [
  { label: 'All priorities', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

export const OPERATIONS_SEGMENT_OPTIONS = [
  { label: 'All segments', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
  { label: 'B2B', value: 'b2b' },
]

export const DEFAULT_OPERATIONS_DASHBOARD_FILTERS: OperationsDashboardFilters = {
  date: 'today',
  country: 'all',
  visaType: 'all',
  status: 'all',
  priority: 'all',
  segment: 'all',
  search: '',
}

const MY_PIPELINE: Record<
  ApplicationPipelineStageId,
  { count: number; averageAgeHours: number; delayedCount: number; slaPercent: number }
> = {
  draft: { count: 3, averageAgeHours: 4, delayedCount: 0, slaPercent: 100 },
  'awaiting-documents': { count: 5, averageAgeHours: 22, delayedCount: 2, slaPercent: 86 },
  verification: { count: 7, averageAgeHours: 10, delayedCount: 1, slaPercent: 92 },
  qc: { count: 4, averageAgeHours: 8, delayedCount: 1, slaPercent: 90 },
  appointment: { count: 3, averageAgeHours: 18, delayedCount: 1, slaPercent: 88 },
  submission: { count: 2, averageAgeHours: 6, delayedCount: 0, slaPercent: 100 },
  embassy: { count: 2, averageAgeHours: 48, delayedCount: 1, slaPercent: 80 },
  collection: { count: 1, averageAgeHours: 12, delayedCount: 0, slaPercent: 100 },
  dispatch: { count: 1, averageAgeHours: 4, delayedCount: 0, slaPercent: 100 },
  delivered: { count: 9, averageAgeHours: 0, delayedCount: 0, slaPercent: 100 },
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
    detail: index === activeIndex ? 'Needs your follow-up' : undefined,
  }))
}

export const OPERATIONS_DASHBOARD_MOCK: OperationsDashboardData = {
  consultantName: 'Riya Sharma',
  myQuickStats: [
    {
      id: 'my-assigned',
      label: 'Assigned to me',
      value: 28,
      delta: 3.2,
      deltaLabel: 'vs yesterday',
      sparklineData: [18, 20, 22, 24, 25, 27, 28],
    },
    {
      id: 'my-due-today',
      label: 'Due today',
      value: 9,
      delta: -1.1,
      deltaLabel: 'vs yesterday',
      sparklineData: [12, 11, 10, 10, 9, 9, 9],
    },
    {
      id: 'my-blocked',
      label: 'Blocked',
      value: 4,
      delta: 2.0,
      deltaLabel: 'vs yesterday',
      sparklineData: [2, 2, 3, 3, 3, 4, 4],
    },
    {
      id: 'my-completed',
      label: 'Completed today',
      value: 6,
      delta: 12.5,
      deltaLabel: 'vs yesterday',
      sparklineData: [3, 4, 4, 5, 5, 6, 6],
    },
    {
      id: 'my-verification',
      label: 'Pending verification',
      value: 7,
      delta: 1.0,
      deltaLabel: 'waiting on you',
      sparklineData: [5, 5, 6, 6, 7, 7, 7],
    },
    {
      id: 'my-sla',
      label: 'Personal SLA',
      value: '94%',
      delta: 1.5,
      deltaLabel: 'vs last week',
      sparklineData: [90, 91, 92, 92, 93, 94, 94],
    },
  ],
  notifications: [
    {
      id: 'on-1',
      title: 'Correction requested on GLT-24081',
      body: 'QC returned passport scan quality.',
      unread: true,
      createdAt: '8 min ago',
    },
    {
      id: 'on-2',
      title: 'Appointment tomorrow — GLT-24055',
      body: 'UAE tourist · 10:30 slot confirmed.',
      unread: true,
      createdAt: '32 min ago',
    },
    {
      id: 'on-3',
      title: 'Client follow-up overdue',
      body: 'BrightCorp waiting on missing bank statement.',
      unread: false,
      createdAt: '2 hr ago',
    },
  ],
  myPendingVerification: [
    {
      id: 'mpv-1',
      glNumber: 'GLT-24081',
      applicant: 'Aisha Khan',
      company: 'BrightCorp India',
      consultant: 'Riya Sharma',
      priority: 'critical',
      waitingTime: '5h 20m',
    },
    {
      id: 'mpv-2',
      glNumber: 'GLT-24074',
      applicant: 'Sameer Joshi',
      company: 'Retail walk-in',
      consultant: 'Riya Sharma',
      priority: 'high',
      waitingTime: '3h 05m',
    },
    {
      id: 'mpv-3',
      glNumber: 'GLT-24068',
      applicant: 'Lina George',
      company: 'Horizon Logistics',
      consultant: 'Riya Sharma',
      priority: 'medium',
      waitingTime: '1h 40m',
    },
  ],
  myPipelineStages: APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
    id,
    ...MY_PIPELINE[id],
  })),
  myPassportJourney: {
    journeyStatus: 'Courier outbound',
    eta: 'Today 17:30',
    trackingNumber: 'BLD-772190',
    courier: 'BlueDart',
    stages: passportStages(1),
  },
  myMarineTimeline: [
    {
      id: 'mm-1',
      vessel: 'MV Pacific Pearl',
      crew: '2 assigned',
      joiningPort: 'Kochi',
      signOn: '26 Jul',
      visaStatus: 'Docs pending',
      priority: 'Critical',
      ragStatus: 'red',
    },
    {
      id: 'mm-2',
      vessel: 'MV Gulf Horizon',
      crew: '1 assigned',
      joiningPort: 'Chennai',
      signOn: '28 Jul',
      visaStatus: 'Verification',
      priority: 'High',
      ragStatus: 'amber',
    },
  ],
  myRecentActivity: [
    {
      id: 'mra-1',
      primary: 'You claimed GLT-24081 for verification',
      secondary: '5 min ago',
      badgeLabel: 'Mine',
      badgeColor: 'primary',
    },
    {
      id: 'mra-2',
      primary: 'Correction raised on GLT-24060',
      secondary: '40 min ago',
      badgeLabel: 'Blocked',
      badgeColor: 'error',
    },
    {
      id: 'mra-3',
      primary: 'Appointment booked for GLT-24055',
      secondary: '1 hr ago',
      badgeLabel: 'Appt',
      badgeColor: 'info',
    },
  ],
  quickActions: [
    {
      id: 'qa-my-apps',
      title: 'My applications',
      description: 'Open retail applications assigned to you.',
      badge: 'Apps',
      href: '/admin/application-management/retail',
    },
    {
      id: 'qa-verification',
      title: 'Verification queue',
      description: 'Jump to retail assignment priority.',
      badge: 'Queue',
      href: '/admin/assignment-priority/retail',
    },
    {
      id: 'qa-appointments',
      title: 'Appointments',
      description: 'Review documentation appointment work.',
      badge: 'Appt',
      href: '/admin/dashboard-next/documentation',
    },
    {
      id: 'qa-marine',
      title: 'Marine cases',
      description: 'Open marine application management.',
      badge: 'Marine',
      href: '/admin/application-management/marine',
    },
    {
      id: 'qa-passport',
      title: 'Passport tracking',
      description: 'Tracking & logistics workspace.',
      badge: 'Logistics',
      href: '/admin/ground-operations/logistics',
    },
    {
      id: 'qa-followups',
      title: 'Follow-ups',
      description: 'Client follow-ups via operations desk.',
      badge: 'Follow-up',
      href: '/admin/ground-operations/case-handling',
    },
  ],
  myApplications: [
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
      channel: 'retail',
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
      channel: 'marine',
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
      channel: 'corporate',
      applicationHref: '/admin/application-management/marine/GL-2026-01465',
    },
    {
      id: 'ma4',
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
      channel: 'retail',
      applicationHref: '/admin/application-management/marine/GL-2026-01451',
    },
  ],
  todayTasks: [
    {
      id: 'tt1',
      title: 'Follow up with client for missing documents',
      taskCount: 5,
      dueTime: '11:00 AM',
      priority: 'high',
    },
    {
      id: 'tt2',
      title: 'Review applications for QC',
      taskCount: 4,
      dueTime: '1:30 PM',
      priority: 'high',
    },
    {
      id: 'tt3',
      title: 'Follow up with Documentation Team',
      taskCount: 3,
      dueTime: '3:00 PM',
      priority: 'medium',
    },
    {
      id: 'tt4',
      title: 'Review correction requests',
      taskCount: 2,
      dueTime: '5:00 PM',
      priority: 'high',
    },
  ],
  correctionRequests: [
    {
      id: 'cr1',
      applicationId: 'GLTS-2026-01408',
      applicant: 'Sneha Pillai',
      raisedBy: 'Documentation Team',
      reason: 'Bank statement pages incomplete',
      waitingSince: '2d 4h',
      assignedTo: 'Riya Sharma',
      isOverdue: true,
    },
    {
      id: 'cr2',
      applicationId: 'GLTS-2026-01396',
      applicant: 'Apex Logistics Group',
      raisedBy: 'QC Supervisor',
      reason: 'Invitation letter missing company seal',
      waitingSince: '6h 20m',
      assignedTo: 'Riya Sharma',
      isOverdue: false,
    },
    {
      id: 'cr3',
      applicationId: 'GLTS-2026-01389',
      applicant: 'Michael Chen',
      raisedBy: 'Documentation Team',
      reason: 'Passport copy not legible',
      waitingSince: '1d 8h',
      assignedTo: 'Riya Sharma',
      isOverdue: false,
    },
  ],
  awaitingDocuments: [
    {
      id: 'ad1',
      applicant: 'TechNova Solutions Ltd',
      outstandingDocuments: 'Bank statements, invitation letter',
      lastReminderSent: '28 Jun 2026',
      reminderCount: 2,
      daysWaiting: 4,
      country: 'Germany',
      channel: 'corporate',
    },
    {
      id: 'ad2',
      applicant: 'Arjun Mehta',
      outstandingDocuments: 'Travel insurance certificate',
      lastReminderSent: '29 Jun 2026',
      reminderCount: 1,
      daysWaiting: 2,
      country: 'United Kingdom',
      channel: 'retail',
    },
    {
      id: 'ad3',
      applicant: 'Harborline Shipping',
      outstandingDocuments: 'Crew list, vessel registration',
      lastReminderSent: '27 Jun 2026',
      reminderCount: 3,
      daysWaiting: 5,
      country: 'Singapore',
      channel: 'marine',
    },
  ],
  reviewQcQueue: [
    {
      id: 'rq1',
      applicationId: 'GLTS-2026-01471',
      applicant: 'MV Ocean Star / Crew',
      country: 'Singapore',
      submittedBy: 'Documentation Team',
      currentStage: 'QC Pending',
      slaTimer: 'Breached',
      slaStatus: 'breached',
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
    },
  ],
  appointmentSubmissionQueue: [
    {
      id: 'as1',
      applicant: 'Priya Nair',
      appointmentDate: '02 Jul 2026 — 10:30 AM',
      country: 'United States',
      vfsLocation: 'Mumbai VAC',
      submissionStatus: 'Appointment confirmed',
      assignedExecutive: 'Riya Sharma',
    },
    {
      id: 'as2',
      applicant: 'James Okafor',
      appointmentDate: '03 Jul 2026 — 2:00 PM',
      country: 'United Kingdom',
      vfsLocation: 'Delhi VAC',
      submissionStatus: 'Ready for submission',
      assignedExecutive: 'Riya Sharma',
    },
    {
      id: 'as3',
      applicant: 'Global Freight Partners',
      appointmentDate: '04 Jul 2026 — 11:00 AM',
      country: 'Germany',
      vfsLocation: 'Bengaluru VAC',
      submissionStatus: 'Slot pending',
      assignedExecutive: 'Riya Sharma',
    },
  ],
  marinePriorityCases: [
    {
      id: 'mp1',
      vesselName: 'MV Pacific Dawn',
      crewName: 'Rajesh Kumar',
      joiningPort: 'Singapore',
      joiningDate: '03 Jul 2026',
      daysRemaining: 5,
      visaStatus: 'QC Pending',
      priority: 'high',
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
    },
  ],
  queueItems: [
    {
      id: 'q-1',
      glNumber: 'GLT-24081',
      applicant: 'Aisha Khan',
      queue: 'pending-qc',
      queueLabel: 'Pending QC',
      priority: 'Critical',
      waitingTime: '5h 20m',
      status: 'Open',
    },
    {
      id: 'q-2',
      glNumber: 'GLT-24060',
      applicant: 'Rahul Menon',
      queue: 'correction',
      queueLabel: 'Correction Requests',
      priority: 'High',
      waitingTime: '1d 2h',
      status: 'Blocked',
    },
    {
      id: 'q-3',
      glNumber: 'GLT-24055',
      applicant: 'Meera Iyer',
      queue: 'appointment',
      queueLabel: 'Appointment Queue',
      priority: 'High',
      waitingTime: '18h',
      status: 'In progress',
    },
    {
      id: 'q-4',
      glNumber: 'GLT-24049',
      applicant: 'Omar Al Farsi',
      queue: 'submission',
      queueLabel: 'Submission Queue',
      priority: 'Medium',
      waitingTime: '6h',
      status: 'Open',
    },
    {
      id: 'q-5',
      glNumber: 'GLT-24041',
      applicant: 'Sneha Kapoor',
      queue: 'blocked',
      queueLabel: 'Blocked Applications',
      priority: 'Critical',
      waitingTime: '2d',
      status: 'Blocked',
    },
  ],
  queuePendingVerification: [
    {
      id: 'qpv-1',
      glNumber: 'GLT-24081',
      applicant: 'Aisha Khan',
      company: 'BrightCorp India',
      consultant: 'Riya Sharma',
      priority: 'critical',
      waitingTime: '5h 20m',
    },
    {
      id: 'qpv-2',
      glNumber: 'GLT-24066',
      applicant: 'Dev Patel',
      company: 'Retail walk-in',
      consultant: 'Unassigned',
      priority: 'high',
      waitingTime: '7h 10m',
    },
  ],
  queuePipelineStages: APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
    id,
    count: MY_PIPELINE[id].count + 2,
    averageAgeHours: MY_PIPELINE[id].averageAgeHours + 2,
    delayedCount: MY_PIPELINE[id].delayedCount,
    slaPercent: Math.max(78, MY_PIPELINE[id].slaPercent - 3),
  })),
  queuePassportJourney: {
    journeyStatus: 'At embassy',
    eta: 'Thu 11:00',
    trackingNumber: 'BLD-881002',
    courier: 'DTDC',
    stages: passportStages(2),
  },
  queueMarineTimeline: [
    {
      id: 'qm-1',
      vessel: 'MV Nordic Star',
      crew: '4 pending',
      joiningPort: 'Mumbai',
      signOn: '25 Jul',
      visaStatus: 'QC hold',
      priority: 'Critical',
      ragStatus: 'red',
    },
  ],
  queueRecentActivity: [
    {
      id: 'qra-1',
      primary: 'GLT-24060 blocked — missing affidavit',
      secondary: 'QC · 25 min ago',
      badgeLabel: 'Blocked',
      badgeColor: 'error',
    },
    {
      id: 'qra-2',
      primary: 'Appointment queue grew by 3',
      secondary: 'Ops · 1 hr ago',
      badgeLabel: 'Appt',
      badgeColor: 'warning',
    },
  ],
  todaysJobs: [
    {
      id: 'tj-1',
      jobRef: 'GLT-24081',
      type: 'Verification',
      location: 'Priority · Critical',
      assignee: 'Riya Sharma',
      status: 'Open',
      scheduledAt: 'Due 13:00',
    },
    {
      id: 'tj-2',
      jobRef: 'GLT-24055',
      type: 'Appointment prep',
      location: 'Priority · High',
      assignee: 'Riya Sharma',
      status: 'In progress',
      scheduledAt: 'Due 15:30',
    },
    {
      id: 'tj-3',
      jobRef: 'GLT-24060',
      type: 'Client follow-up',
      location: 'Priority · High',
      assignee: 'Riya Sharma',
      status: 'Open',
      scheduledAt: 'Due 16:00',
    },
    {
      id: 'tj-4',
      jobRef: 'GLT-24049',
      type: 'Submission pack',
      location: 'Priority · Medium',
      assignee: 'Riya Sharma',
      status: 'Open',
      scheduledAt: 'Due 17:00',
    },
  ],
  todaysActivity: [
    {
      id: 'ta-1',
      primary: 'Completed verification on GLT-24058',
      secondary: 'Today 09:40',
      badgeLabel: 'Done',
      badgeColor: 'success',
    },
    {
      id: 'ta-2',
      primary: 'Called BrightCorp for bank statement',
      secondary: 'Today 10:15',
      badgeLabel: 'Follow-up',
      badgeColor: 'info',
    },
  ],
  announcements: [
    {
      id: 'oa-1',
      title: 'UAE peak-season SLA reminder',
      summary: 'Same-day verification cutoff is 15:00 IST.',
      publishedAt: 'Today',
      severity: 'warning',
    },
    {
      id: 'oa-2',
      title: 'Marine joining-window change',
      summary: 'Kochi sign-on docs must clear QC 48h prior.',
      publishedAt: 'Yesterday',
      severity: 'info',
    },
  ],
  activityFeed: [
    {
      id: 'af-1',
      primary: 'Assignment changed: GLT-24074 → you',
      secondary: 'Team lead · 20 min ago',
      badgeLabel: 'Assign',
      badgeColor: 'primary',
    },
    {
      id: 'af-2',
      primary: 'Passport BLD-772190 handed to courier',
      secondary: 'Logistics · 1 hr ago',
      badgeLabel: 'Passport',
      badgeColor: 'info',
    },
    {
      id: 'af-3',
      primary: 'Submission pack uploaded for GLT-24049',
      secondary: 'You · 2 hr ago',
      badgeLabel: 'Submit',
      badgeColor: 'success',
    },
    {
      id: 'af-4',
      primary: 'Courier scan update — Dubai inbound',
      secondary: 'BlueDart · 3 hr ago',
      badgeLabel: 'Courier',
      badgeColor: 'default',
    },
  ],
  activityNotifications: [
    {
      id: 'an-1',
      title: 'Reassignment notice',
      body: 'Two retail cases moved to your queue.',
      unread: true,
      createdAt: '20 min ago',
    },
    {
      id: 'an-2',
      title: 'Courier delay SMS',
      body: 'BLD-772190 delayed 45 minutes.',
      unread: false,
      createdAt: '1 hr ago',
    },
  ],
  activityPassportJourney: {
    journeyStatus: 'In transit',
    eta: 'Today 17:30',
    trackingNumber: 'BLD-772190',
    courier: 'BlueDart',
    stages: passportStages(1),
  },
  documentMovement: [
    { label: 'Mon', inbound: 4, outbound: 3 },
    { label: 'Tue', inbound: 5, outbound: 4 },
    { label: 'Wed', inbound: 3, outbound: 5 },
    { label: 'Thu', inbound: 6, outbound: 4 },
    { label: 'Fri', inbound: 4, outbound: 6 },
  ],
  processingTrend: [
    { label: 'Mon', value: 7, secondary: 5 },
    { label: 'Tue', value: 8, secondary: 6 },
    { label: 'Wed', value: 6, secondary: 6 },
    { label: 'Thu', value: 9, secondary: 7 },
    { label: 'Fri', value: 8, secondary: 8 },
    { label: 'Sat', value: 4, secondary: 3 },
    { label: 'Sun', value: 2, secondary: 2 },
  ],
  metricComparison: [
    { label: 'Completed', value: '42', delta: 9.5 },
    { label: 'Avg time (hrs)', value: '11.4', delta: -6.2 },
    { label: 'Corrections', value: '5', delta: -12.0 },
    { label: 'SLA', value: '94%', delta: 1.8 },
  ],
  teamCapacity: [
    {
      id: 'me',
      department: 'My load',
      openCases: 28,
      completedToday: 6,
      capacity: 32,
      slaPercent: 94,
    },
    {
      id: 'pod',
      department: 'My pod',
      openCases: 96,
      completedToday: 22,
      capacity: 110,
      slaPercent: 90,
    },
  ],
  personalSla: [
    { id: 'sla-day', label: 'Today SLA', value: 96, helperText: 'Target 95%' },
    { id: 'sla-week', label: 'Week SLA', value: 94, helperText: 'Target 95%' },
  ],
}

/** Lightweight client-side filter so swapping to API later keeps the same contract. */
export function applyOperationsDashboardFilters(
  data: OperationsDashboardData,
  filters: OperationsDashboardFilters,
): OperationsDashboardData {
  const query = filters.search.trim().toLowerCase()
  if (!query && filters.priority === 'all' && filters.status === 'all') {
    return data
  }

  const matchPriority = (priority: string) =>
    filters.priority === 'all' || priority.toLowerCase() === filters.priority

  const matchStatus = (status: string) =>
    filters.status === 'all' || status.toLowerCase().replace(/\s+/g, '-') === filters.status

  const matchSearch = (...parts: Array<string | undefined>) =>
    !query || parts.some((part) => part?.toLowerCase().includes(query))

  return {
    ...data,
    myPendingVerification: data.myPendingVerification.filter(
      (row) =>
        matchPriority(row.priority) &&
        matchSearch(row.glNumber, row.applicant, row.company),
    ),
    myApplications: data.myApplications.filter(
      (row) =>
        matchPriority(row.priority) &&
        matchSearch(row.glNumber, row.applicant, row.company, row.country),
    ),
    correctionRequests: data.correctionRequests.filter((row) =>
      matchSearch(row.applicationId, row.applicant, row.reason),
    ),
    awaitingDocuments: data.awaitingDocuments.filter((row) =>
      matchSearch(row.applicant, row.outstandingDocuments, row.country),
    ),
    reviewQcQueue: data.reviewQcQueue.filter((row) =>
      matchSearch(row.applicationId, row.applicant, row.country),
    ),
    marinePriorityCases: data.marinePriorityCases.filter(
      (row) =>
        matchPriority(row.priority) &&
        matchSearch(row.vesselName, row.crewName, row.joiningPort),
    ),
    queueItems: data.queueItems.filter(
      (row) =>
        matchPriority(row.priority) &&
        matchStatus(row.status) &&
        matchSearch(row.glNumber, row.applicant, row.queueLabel),
    ),
    todaysJobs: data.todaysJobs.filter((row) =>
      matchSearch(row.jobRef, row.type, row.status, row.location),
    ),
  }
}

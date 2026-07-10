export type ApplicationChannel = 'retail' | 'corporate' | 'marine' | 'b2b'
export type SlaStatus = 'on_track' | 'at_risk' | 'breached'
export type Priority = 'high' | 'medium' | 'low'
export type PipelineProgress = 'on_track' | 'at_risk' | 'delayed'
export type AlertPriority = 'critical' | 'high' | 'medium'
export type TeamWorkloadStatus = 'balanced' | 'overloaded' | 'underutilized'
export type OperationalTeam =
  | 'Operations'
  | 'Documentation'
  | 'Ground Operations'
  | 'Accounts'

export interface DashboardFilters {
  dateRange: [Date | null, Date | null]
  country: string
  branch: string
  applicationType: string
  team: string
}

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  dateRange: [null, null],
  country: 'all',
  branch: 'all',
  applicationType: 'all',
  team: 'all',
}

export const COUNTRY_FILTER_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'Germany', value: 'Germany' },
]

export const BRANCH_FILTER_OPTIONS = [
  { label: 'All branches', value: 'all' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Chennai', value: 'Chennai' },
  { label: 'Bengaluru', value: 'Bengaluru' },
]

export const APPLICATION_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
]

export const TEAM_FILTER_OPTIONS = [
  { label: 'All teams', value: 'all' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Documentation', value: 'Documentation' },
  { label: 'Ground Operations', value: 'Ground Operations' },
  { label: 'Accounts', value: 'Accounts' },
]

export interface DashboardKpiMetric {
  id: string
  label: string
  value: number
  formattedValue?: string
  subtitle: string
  delta: number
  deltaLabel: string
  accent: 'primary' | 'success' | 'warning' | 'error' | 'info'
  iconKey: string
  href: string
}

export interface PipelineStage {
  id: string
  label: string
  total: number
  delayed: number
  progress: PipelineProgress
}

export interface TeamWorkloadRow {
  id: string
  team: OperationalTeam
  openCases: number
  completedToday: number
  capacityPct: number
  slaPct: number
  status: TeamWorkloadStatus
  branch: string
}

export interface ExecutiveCriticalAlert {
  id: string
  title: string
  count: number
  oldestWaiting: string
  priority: AlertPriority
}

export interface VerificationQueueRow {
  id: string
  glNumber: string
  passenger: string
  company: string
  country: string
  visaType: string
  consultant: string
  createdDate: string
  currentStage: string
  slaTimer: string
  slaStatus: SlaStatus
  channel: ApplicationChannel
  branch: string
  team: OperationalTeam
}

export interface PassportTrackerSummary {
  notOutForDelivery: number
  inTransit: number
  delivered: number
}

export interface PassportTransitRow {
  id: string
  applicant: string
  courier: string
  awbNumber: string
  destination: string
  eta: string
  trackingStatus: string
  branch: string
}

export interface SlaComplianceSegment {
  segment: string
  compliancePct: number
}

export interface TeamProductivityMetric {
  label: string
  value: string
}

export interface WeeklyCompletionPoint {
  day: string
  completed: number
}

export interface RevenueSnapshot {
  revenueToday: string
  mtdRevenue: string
  ytdRevenue: string
  revenueVsTarget: number
}

export interface DistributionSlice {
  key: string
  label: string
  value: number
}

export interface EscalationRow {
  id: string
  raisedBy: string
  escalationType: string
  currentOwner: string
  status: string
  slaCountdown: string
  branch: string
  team: OperationalTeam
}

export interface NoMovementCaseRow {
  id: string
  applicationId: string
  applicant: string
  consultant: string
  currentStage: string
  lastActivity: string
  daysIdle: number
  branch: string
  channel: ApplicationChannel
  team: OperationalTeam
}

export const EXECUTIVE_KPIS: DashboardKpiMetric[] = [
  {
    id: 'total_applications',
    label: 'Total Applications',
    value: 2847,
    subtitle: 'All active channels',
    delta: 8.4,
    deltaLabel: 'vs previous period',
    accent: 'primary',
    iconKey: 'files',
    href: '/admin/application-management/marine',
  },
  {
    id: 'in_progress',
    label: 'Applications In Progress',
    value: 612,
    subtitle: 'Processing & ops lanes',
    delta: 4.2,
    deltaLabel: 'vs previous period',
    accent: 'info',
    iconKey: 'activity',
    href: '/admin/assignment-priority/marine',
  },
  {
    id: 'completed_today',
    label: 'Completed Today',
    value: 48,
    subtitle: 'Delivered or closed today',
    delta: 12.1,
    deltaLabel: 'vs previous period',
    accent: 'success',
    iconKey: 'check',
    href: '/admin/ground-operations/case-handling',
  },
  {
    id: 'critical_cases',
    label: 'Critical Cases',
    value: 17,
    subtitle: 'SLA breach or escalation',
    delta: 1.2,
    deltaLabel: 'vs previous period',
    accent: 'error',
    iconKey: 'alert',
    href: '/admin/ground-operations/case-handling',
  },
  {
    id: 'sla_compliance',
    label: 'SLA Compliance %',
    value: 94,
    formattedValue: '94%',
    subtitle: 'Across all teams',
    delta: 2.3,
    deltaLabel: 'vs previous period',
    accent: 'success',
    iconKey: 'shield',
    href: '/admin/assignment-priority/marine',
  },
  {
    id: 'applications_delayed',
    label: 'Applications Delayed',
    value: 86,
    subtitle: 'Past SLA threshold',
    delta: -4.8,
    deltaLabel: 'vs previous period',
    accent: 'warning',
    iconKey: 'clock',
    href: '/admin/assignment-priority/marine',
  },
  {
    id: 'team_utilization',
    label: 'Team Utilization %',
    value: 87,
    formattedValue: '87%',
    subtitle: 'Weighted capacity usage',
    delta: 3.1,
    deltaLabel: 'vs previous period',
    accent: 'info',
    iconKey: 'users',
    href: '/admin/access/teams',
  },
  {
    id: 'revenue_today',
    label: 'Revenue Today',
    value: 1840000,
    formattedValue: '₹18.4L',
    subtitle: 'Recognized billing today',
    delta: 6.7,
    deltaLabel: 'vs previous period',
    accent: 'primary',
    iconKey: 'wallet',
    href: '/admin/finance/invoices',
  },
]

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'draft', label: 'Draft', total: 124, delayed: 8, progress: 'on_track' },
  { id: 'docs_pending', label: 'Docs Pending', total: 186, delayed: 22, progress: 'at_risk' },
  { id: 'verification_pending', label: 'Verification Pending', total: 148, delayed: 14, progress: 'at_risk' },
  { id: 'qc_pending', label: 'QC Pending', total: 92, delayed: 6, progress: 'on_track' },
  { id: 'appointment_pending', label: 'Appointment Pending', total: 74, delayed: 9, progress: 'delayed' },
  { id: 'submission_pending', label: 'Submission Pending', total: 96, delayed: 11, progress: 'at_risk' },
  { id: 'submitted', label: 'Submitted', total: 88, delayed: 7, progress: 'on_track' },
  { id: 'embassy_processing', label: 'Embassy Processing', total: 218, delayed: 18, progress: 'on_track' },
  { id: 'collections_pending', label: 'Collections Pending', total: 78, delayed: 10, progress: 'at_risk' },
  { id: 'collected', label: 'Collected', total: 66, delayed: 4, progress: 'on_track' },
  { id: 'delivered', label: 'Delivered', total: 412, delayed: 0, progress: 'on_track' },
  { id: 'completed', label: 'Completed', total: 376, delayed: 0, progress: 'on_track' },
]

export const TEAM_WORKLOAD_ROWS: TeamWorkloadRow[] = [
  { id: 'tw1', team: 'Operations', openCases: 186, completedToday: 24, capacityPct: 112, slaPct: 91, status: 'overloaded', branch: 'Mumbai' },
  { id: 'tw2', team: 'Documentation', openCases: 148, completedToday: 18, capacityPct: 98, slaPct: 94, status: 'balanced', branch: 'Delhi' },
  { id: 'tw3', team: 'Ground Operations', openCases: 92, completedToday: 14, capacityPct: 76, slaPct: 88, status: 'underutilized', branch: 'Chennai' },
  { id: 'tw4', team: 'Accounts', openCases: 64, completedToday: 11, capacityPct: 84, slaPct: 96, status: 'balanced', branch: 'Bengaluru' },
]

export const EXECUTIVE_CRITICAL_ALERTS: ExecutiveCriticalAlert[] = [
  { id: 'ca1', title: 'SLA Breached', count: 12, oldestWaiting: '6h 20m', priority: 'critical' },
  { id: 'ca2', title: 'Awaiting Client Documents', count: 28, oldestWaiting: '3d 4h', priority: 'high' },
  { id: 'ca3', title: 'Pending QC > 4 Hours', count: 9, oldestWaiting: '5h 10m', priority: 'high' },
  { id: 'ca4', title: 'Passport Expiring Soon', count: 6, oldestWaiting: '2d 1h', priority: 'medium' },
  { id: 'ca5', title: 'Marine Crew Joining Within 7 Days', count: 14, oldestWaiting: '4d 6h', priority: 'critical' },
  { id: 'ca6', title: 'Corrected Documents Pending', count: 11, oldestWaiting: '1d 8h', priority: 'high' },
  { id: 'ca7', title: 'No Movement Cases', count: 19, oldestWaiting: '5d 2h', priority: 'medium' },
  { id: 'ca8', title: 'Escalations', count: 7, oldestWaiting: '8h 45m', priority: 'critical' },
]

export const VERIFICATION_QUEUE: VerificationQueueRow[] = [
  {
    id: 'v1',
    glNumber: 'GL-2026-01482',
    passenger: 'Arjun Mehta',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Standard Visitor',
    consultant: 'Riya Sharma',
    createdDate: '28 Jun 2026',
    currentStage: 'Verification Pending',
    slaTimer: '4h 12m',
    slaStatus: 'at_risk',
    channel: 'retail',
    branch: 'Mumbai',
    team: 'Documentation',
  },
  {
    id: 'v2',
    glNumber: 'GL-2026-01471',
    passenger: 'MV Ocean Star / Crew Batch',
    company: 'Harborline Shipping',
    country: 'Singapore',
    visaType: 'Crew Transit',
    consultant: 'Vikram Patel',
    createdDate: '27 Jun 2026',
    currentStage: 'QC Pending',
    slaTimer: 'Breached',
    slaStatus: 'breached',
    channel: 'marine',
    branch: 'Chennai',
    team: 'Documentation',
  },
  {
    id: 'v3',
    glNumber: 'GL-2026-01465',
    passenger: 'TechNova Solutions Ltd',
    company: 'TechNova Solutions Ltd',
    country: 'Germany',
    visaType: 'Business Schengen',
    consultant: 'Neha Kulkarni',
    createdDate: '26 Jun 2026',
    currentStage: 'Verification Pending',
    slaTimer: '1d 2h',
    slaStatus: 'on_track',
    channel: 'corporate',
    branch: 'Delhi',
    team: 'Documentation',
  },
  {
    id: 'v4',
    glNumber: 'GL-2026-01458',
    passenger: 'Priya Nair',
    company: 'Individual',
    country: 'United States',
    visaType: 'B1/B2',
    consultant: 'Arun Menon',
    createdDate: '25 Jun 2026',
    currentStage: 'Docs Pending',
    slaTimer: '6h 30m',
    slaStatus: 'on_track',
    channel: 'retail',
    branch: 'Bengaluru',
    team: 'Operations',
  },
  {
    id: 'v5',
    glNumber: 'GL-2026-01451',
    passenger: 'Harborline Shipping',
    company: 'Harborline Shipping',
    country: 'United Arab Emirates',
    visaType: 'Crew Offshore',
    consultant: 'Sana Iqbal',
    createdDate: '24 Jun 2026',
    currentStage: 'Verification Pending',
    slaTimer: '3h 45m',
    slaStatus: 'at_risk',
    channel: 'marine',
    branch: 'Mumbai',
    team: 'Documentation',
  },
  {
    id: 'v6',
    glNumber: 'GL-2026-01444',
    passenger: 'James Okafor',
    company: 'Individual',
    country: 'United Kingdom',
    visaType: 'Student',
    consultant: 'Dev Mehta',
    createdDate: '23 Jun 2026',
    currentStage: 'QC Pending',
    slaTimer: '2h 10m',
    slaStatus: 'on_track',
    channel: 'retail',
    branch: 'Delhi',
    team: 'Documentation',
  },
]

export const PASSPORT_TRACKER_SUMMARY: PassportTrackerSummary = {
  notOutForDelivery: 42,
  inTransit: 18,
  delivered: 156,
}

export const PASSPORT_TRANSIT_ROWS: PassportTransitRow[] = [
  {
    id: 'pt1',
    applicant: 'Arjun Mehta',
    courier: 'BlueDart',
    awbNumber: 'BD7829345612',
    destination: 'Mumbai — Corporate HQ',
    eta: '01 Jul 2026',
    trackingStatus: 'In transit',
    branch: 'Mumbai',
  },
  {
    id: 'pt2',
    applicant: 'MV Pacific Dawn / Crew',
    courier: 'DTDC Express',
    awbNumber: 'DT9823410056',
    destination: 'Chennai — Vessel Agent',
    eta: '30 Jun 2026',
    trackingStatus: 'Out for delivery',
    branch: 'Chennai',
  },
  {
    id: 'pt3',
    applicant: 'Priya Nair',
    courier: 'FedEx',
    awbNumber: 'FX4412098871',
    destination: 'Bengaluru — Client Office',
    eta: '02 Jul 2026',
    trackingStatus: 'In transit',
    branch: 'Bengaluru',
  },
  {
    id: 'pt4',
    applicant: 'TechNova Solutions Ltd',
    courier: 'BlueDart',
    awbNumber: 'BD7829345890',
    destination: 'Delhi — Branch',
    eta: '01 Jul 2026',
    trackingStatus: 'In transit',
    branch: 'Delhi',
  },
]

export const SLA_COMPLIANCE_BY_SEGMENT: SlaComplianceSegment[] = [
  { segment: 'Marine', compliancePct: 92 },
  { segment: 'Corporate', compliancePct: 96 },
  { segment: 'Retail', compliancePct: 93 },
  { segment: 'B2B', compliancePct: 89 },
]

export const TEAM_PRODUCTIVITY_METRICS: TeamProductivityMetric[] = [
  { label: 'Open Cases', value: '490' },
  { label: 'Completed Today', value: '67' },
  { label: 'Capacity %', value: '92%' },
  { label: 'Target Achievement', value: '104%' },
]

export const WEEKLY_COMPLETION_TREND: WeeklyCompletionPoint[] = [
  { day: 'Mon', completed: 42 },
  { day: 'Tue', completed: 58 },
  { day: 'Wed', completed: 51 },
  { day: 'Thu', completed: 64 },
  { day: 'Fri', completed: 72 },
  { day: 'Sat', completed: 38 },
  { day: 'Sun', completed: 29 },
]

export const REVENUE_SNAPSHOT: RevenueSnapshot = {
  revenueToday: '₹18.4L',
  mtdRevenue: '₹2.8Cr',
  ytdRevenue: '₹18.6Cr',
  revenueVsTarget: 104,
}

export const COUNTRY_DISTRIBUTION: DistributionSlice[] = [
  { key: 'uk', label: 'UK', value: 420 },
  { key: 'us', label: 'US', value: 380 },
  { key: 'uae', label: 'UAE', value: 310 },
  { key: 'sg', label: 'SG', value: 245 },
  { key: 'de', label: 'DE', value: 198 },
]

export const VISA_TYPE_DISTRIBUTION: DistributionSlice[] = [
  { key: 'visitor', label: 'Visitor', value: 520 },
  { key: 'business', label: 'Business', value: 410 },
  { key: 'crew', label: 'Crew', value: 380 },
  { key: 'student', label: 'Student', value: 290 },
  { key: 'employment', label: 'Employment', value: 245 },
]

export const BUSINESS_SEGMENT_DISTRIBUTION: DistributionSlice[] = [
  { key: 'retail', label: 'Retail', value: 1240 },
  { key: 'corporate', label: 'Corporate', value: 680 },
  { key: 'marine', label: 'Marine', value: 927 },
  { key: 'b2b', label: 'B2B', value: 420 },
]

export const ESCALATION_ROWS: EscalationRow[] = [
  {
    id: 'e1',
    raisedBy: 'Riya Sharma',
    escalationType: 'SLA Breach',
    currentOwner: 'Ops Lead — West',
    status: 'Open',
    slaCountdown: '2h 15m',
    branch: 'Mumbai',
    team: 'Operations',
  },
  {
    id: 'e2',
    raisedBy: 'Vikram Patel',
    escalationType: 'Client Escalation',
    currentOwner: 'Marine Desk',
    status: 'In progress',
    slaCountdown: '5h 40m',
    branch: 'Chennai',
    team: 'Operations',
  },
  {
    id: 'e3',
    raisedBy: 'Neha Kulkarni',
    escalationType: 'Document Dispute',
    currentOwner: 'QC Supervisor',
    status: 'Open',
    slaCountdown: '1d 2h',
    branch: 'Delhi',
    team: 'Documentation',
  },
  {
    id: 'e4',
    raisedBy: 'Arun Menon',
    escalationType: 'Billing Dispute',
    currentOwner: 'Accounts Lead',
    status: 'Pending review',
    slaCountdown: '8h 20m',
    branch: 'Bengaluru',
    team: 'Accounts',
  },
  {
    id: 'e5',
    raisedBy: 'Sana Iqbal',
    escalationType: 'Logistics Delay',
    currentOwner: 'Ground Ops',
    status: 'Open',
    slaCountdown: '4h 05m',
    branch: 'Mumbai',
    team: 'Ground Operations',
  },
]

export const NO_MOVEMENT_CASES: NoMovementCaseRow[] = [
  {
    id: 'nm1',
    applicationId: 'GLTS-2026-01370',
    applicant: 'Global Freight Partners',
    consultant: 'Riya Sharma',
    currentStage: 'Embassy Processing',
    lastActivity: '24 Jun 2026',
    daysIdle: 6,
    branch: 'Mumbai',
    channel: 'corporate',
    team: 'Operations',
  },
  {
    id: 'nm2',
    applicationId: 'GLTS-2026-01355',
    applicant: 'MV Atlantic Spirit',
    consultant: 'Vikram Patel',
    currentStage: 'Submission Pending',
    lastActivity: '22 Jun 2026',
    daysIdle: 8,
    branch: 'Chennai',
    channel: 'marine',
    team: 'Operations',
  },
  {
    id: 'nm3',
    applicationId: 'GLTS-2026-01342',
    applicant: 'Michael Chen',
    consultant: 'Neha Kulkarni',
    currentStage: 'Docs Pending',
    lastActivity: '20 Jun 2026',
    daysIdle: 10,
    branch: 'Delhi',
    channel: 'retail',
    team: 'Documentation',
  },
  {
    id: 'nm4',
    applicationId: 'GLTS-2026-01328',
    applicant: 'FinEdge Corp',
    consultant: 'Arun Menon',
    currentStage: 'Collections Pending',
    lastActivity: '18 Jun 2026',
    daysIdle: 12,
    branch: 'Bengaluru',
    channel: 'corporate',
    team: 'Accounts',
  },
  {
    id: 'nm5',
    applicationId: 'GLTS-2026-01315',
    applicant: 'Sneha Pillai',
    consultant: 'Dev Mehta',
    currentStage: 'QC Pending',
    lastActivity: '25 Jun 2026',
    daysIdle: 5,
    branch: 'Mumbai',
    channel: 'retail',
    team: 'Documentation',
  },
]

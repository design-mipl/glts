import {
  APPLICATION_PIPELINE_STAGE_IDS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { PASSPORT_JOURNEY_STAGE_IDS } from '../../shared/config/passportJourney'
import type { AdminDashboardNextData, AdminDashboardNextFilters } from '../types'

export const ADMIN_DASHBOARD_NEXT_PERIOD_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This quarter', value: 'quarter' },
]

export const ADMIN_DASHBOARD_NEXT_REGION_OPTIONS = [
  { label: 'All regions', value: 'all' },
  { label: 'India', value: 'india' },
  { label: 'UAE', value: 'uae' },
  { label: 'Europe', value: 'europe' },
]

export const ADMIN_DASHBOARD_NEXT_SEGMENT_OPTIONS = [
  { label: 'All segments', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
]

export const DEFAULT_ADMIN_DASHBOARD_NEXT_FILTERS: AdminDashboardNextFilters = {
  period: 'week',
  region: 'all',
  segment: 'all',
}

const PIPELINE_COUNTS: Record<ApplicationPipelineStageId, {
  count: number
  averageAgeHours: number
  delayedCount: number
  slaPercent: number
}> = {
  draft: { count: 42, averageAgeHours: 6, delayedCount: 2, slaPercent: 96 },
  'awaiting-documents': { count: 38, averageAgeHours: 28, delayedCount: 7, slaPercent: 88 },
  verification: { count: 31, averageAgeHours: 18, delayedCount: 4, slaPercent: 91 },
  qc: { count: 27, averageAgeHours: 14, delayedCount: 5, slaPercent: 89 },
  appointment: { count: 22, averageAgeHours: 36, delayedCount: 3, slaPercent: 93 },
  submission: { count: 19, averageAgeHours: 12, delayedCount: 1, slaPercent: 97 },
  embassy: { count: 16, averageAgeHours: 72, delayedCount: 6, slaPercent: 84 },
  collection: { count: 11, averageAgeHours: 24, delayedCount: 2, slaPercent: 92 },
  dispatch: { count: 8, averageAgeHours: 10, delayedCount: 0, slaPercent: 99 },
  delivered: { count: 54, averageAgeHours: 0, delayedCount: 0, slaPercent: 100 },
}

export const ADMIN_DASHBOARD_NEXT_MOCK: AdminDashboardNextData = {
  quickStats: [
    {
      id: 'open-cases',
      label: 'Open cases',
      value: 148,
      delta: 4.2,
      deltaLabel: 'vs last week',
      sparklineData: [32, 40, 38, 45, 42, 50, 48],
    },
    {
      id: 'sla-at-risk',
      label: 'SLA at risk',
      value: 12,
      delta: -8.1,
      deltaLabel: 'vs last week',
      sparklineData: [18, 16, 14, 15, 13, 12, 12],
    },
    {
      id: 'completed-today',
      label: 'Completed today',
      value: 36,
      delta: 11.5,
      deltaLabel: 'vs yesterday',
      sparklineData: [20, 22, 25, 24, 30, 33, 36],
    },
    {
      id: 'revenue-mtd',
      label: 'Revenue MTD',
      value: '₹42.8L',
      delta: 6.3,
      deltaLabel: 'vs prior month',
      sparklineData: [28, 30, 32, 35, 38, 40, 43],
    },
    {
      id: 'verification-backlog',
      label: 'Verification backlog',
      value: 27,
      delta: 3.1,
      deltaLabel: 'vs yesterday',
      sparklineData: [22, 24, 23, 25, 26, 26, 27],
    },
    {
      id: 'avg-cycle',
      label: 'Avg cycle (hrs)',
      value: 36,
      delta: -4.1,
      deltaLabel: 'vs last week',
      sparklineData: [42, 40, 39, 38, 37, 36, 36],
    },
  ],
  metricComparison: [
    { label: 'Throughput', value: '124', delta: 8.2 },
    { label: 'Avg cycle (hrs)', value: '36', delta: -4.1 },
    { label: 'First-pass QC', value: '91%', delta: 2.4 },
  ],
  operationsHealth: {
    overallHealth: 86,
    delayedCases: 18,
    completedToday: 36,
    criticalCases: 7,
    slaPercent: 92,
  },
  notifications: [
    {
      id: 'n1',
      title: 'Embassy capacity alert — Schengen',
      body: 'Two corridors approaching booking limits this week.',
      unread: true,
      createdAt: '12 min ago',
    },
    {
      id: 'n2',
      title: 'Fund allocation approved',
      body: 'Ground ops Mumbai tranche released.',
      unread: true,
      createdAt: '45 min ago',
    },
    {
      id: 'n3',
      title: 'Vendor SLA review due',
      body: 'Courier partner Q2 review scheduled Friday.',
      unread: false,
      createdAt: '3 hr ago',
    },
  ],
  pipelineStages: APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
    id,
    ...PIPELINE_COUNTS[id],
  })),
  pendingVerification: [
    {
      id: 'pv-1',
      glNumber: 'GLT-24081',
      applicant: 'Aisha Khan',
      company: 'BrightCorp India',
      consultant: 'Riya Sharma',
      priority: 'critical',
      waitingTime: '6h 12m',
    },
    {
      id: 'pv-2',
      glNumber: 'GLT-24077',
      applicant: 'Omar Al Farsi',
      company: 'Horizon Logistics',
      consultant: 'Arjun Mehta',
      priority: 'high',
      waitingTime: '4h 40m',
    },
    {
      id: 'pv-3',
      glNumber: 'GLT-24070',
      applicant: 'Priya Nair',
      company: 'Nordic Marine Ltd',
      consultant: 'Neha Patel',
      priority: 'medium',
      waitingTime: '2h 05m',
    },
    {
      id: 'pv-4',
      glNumber: 'GLT-24065',
      applicant: 'Vikram Rao',
      company: 'Retail walk-in',
      consultant: 'Vikram Rao',
      priority: 'low',
      waitingTime: '55m',
    },
  ],
  passportJourney: {
    journeyStatus: 'In transit',
    eta: 'Tomorrow 14:00',
    trackingNumber: 'BLD-884221',
    courier: 'BlueDart',
    stages: PASSPORT_JOURNEY_STAGE_IDS.map((id, index) => ({
      id,
      status:
        index < 2 ? 'completed' : index === 2 ? 'active' : ('pending' as const),
      detail: index === 2 ? 'At mission counter' : undefined,
    })),
  },
  recentActivity: [
    {
      id: 'ra-1',
      primary: 'GLT-24081 moved to Verification',
      secondary: 'Riya Sharma · 2 min ago',
      badgeLabel: 'Ops',
      badgeColor: 'info',
    },
    {
      id: 'ra-2',
      primary: 'Passport consignment BLD-884221 delayed',
      secondary: 'Logistics · 18 min ago',
      badgeLabel: 'Risk',
      badgeColor: 'error',
    },
    {
      id: 'ra-3',
      primary: 'Invoice INV-9921 posted',
      secondary: 'Accounts · 1 hr ago',
      badgeLabel: 'Finance',
      badgeColor: 'success',
    },
    {
      id: 'ra-4',
      primary: 'Marine crew batch QC completed',
      secondary: 'Documentation · 2 hr ago',
      badgeLabel: 'Docs',
      badgeColor: 'primary',
    },
  ],
  quickActions: [
    {
      id: 'qa-retail-queue',
      title: 'Retail assignment queue',
      description: 'Open retail priority assignment.',
      badge: 'Ops',
      href: '/admin/assignment-priority/retail',
    },
    {
      id: 'qa-applications',
      title: 'Retail applications',
      description: 'Browse live application management.',
      badge: 'Apps',
      href: '/admin/application-management/retail',
    },
    {
      id: 'qa-finance',
      title: 'Billing & invoices',
      description: 'Jump to finance invoicing workspace.',
      badge: 'Finance',
      href: '/admin/finance/invoices',
    },
    {
      id: 'qa-ground',
      title: 'Operations desk',
      description: 'Ground operations case handling.',
      badge: 'Ground',
      href: '/admin/ground-operations/case-handling',
    },
  ],
  teamCapacity: [
    {
      id: 'tc-ops',
      department: 'Operations',
      openCases: 64,
      completedToday: 18,
      capacity: 80,
      slaPercent: 92,
    },
    {
      id: 'tc-docs',
      department: 'Documentation',
      openCases: 52,
      completedToday: 14,
      capacity: 60,
      slaPercent: 88,
    },
    {
      id: 'tc-finance',
      department: 'Accounts',
      openCases: 28,
      completedToday: 9,
      capacity: 40,
      slaPercent: 95,
    },
    {
      id: 'tc-ground',
      department: 'Ground Ops',
      openCases: 41,
      completedToday: 11,
      capacity: 45,
      slaPercent: 86,
    },
  ],
  marineTimeline: [
    {
      id: 'mt-1',
      vessel: 'MV Nordic Star',
      crew: '12',
      joiningPort: 'Mumbai',
      signOn: '24 Jul',
      visaStatus: 'QC',
      priority: 'High',
      ragStatus: 'amber',
    },
    {
      id: 'mt-2',
      vessel: 'MV Pacific Pearl',
      crew: '8',
      joiningPort: 'Kochi',
      signOn: '26 Jul',
      visaStatus: 'Embassy',
      priority: 'Critical',
      ragStatus: 'red',
    },
    {
      id: 'mt-3',
      vessel: 'MV Gulf Horizon',
      crew: '15',
      joiningPort: 'Chennai',
      signOn: '28 Jul',
      visaStatus: 'Verified',
      priority: 'Medium',
      ragStatus: 'green',
    },
  ],
  processingTrend: [
    { label: 'Mon', value: 24, secondary: 18 },
    { label: 'Tue', value: 28, secondary: 22 },
    { label: 'Wed', value: 26, secondary: 20 },
    { label: 'Thu', value: 32, secondary: 25 },
    { label: 'Fri', value: 30, secondary: 27 },
    { label: 'Sat', value: 18, secondary: 14 },
    { label: 'Sun', value: 12, secondary: 10 },
  ],
  announcements: [
    {
      id: 'an-1',
      title: 'Schengen peak-season playbook live',
      summary: 'Updated SLA and escalation matrix for July–Aug.',
      publishedAt: 'Today',
      severity: 'info',
    },
    {
      id: 'an-2',
      title: 'Courier cutoff change — Dubai lane',
      summary: 'Outbound cutoff moved to 15:30 IST.',
      publishedAt: 'Yesterday',
      severity: 'warning',
    },
  ],
  revenueSnapshot: {
    todayRevenue: '₹1.8L',
    monthlyRevenue: '₹42.8L',
    growthPercent: 6.3,
    trend: [28, 30, 32, 35, 38, 40, 43],
  },
  branchPerformance: [
    { id: 'br-mum', label: 'Mumbai', value: 86 },
    { id: 'br-del', label: 'Delhi', value: 72 },
    { id: 'br-blr', label: 'Bengaluru', value: 64 },
    { id: 'br-hyd', label: 'Hyderabad', value: 51 },
    { id: 'br-chn', label: 'Chennai', value: 48 },
  ],
  countryDistribution: [
    { id: 'ae', label: 'UAE', value: 34 },
    { id: 'schengen', label: 'Schengen', value: 28 },
    { id: 'uk', label: 'UK', value: 18 },
    { id: 'us', label: 'USA', value: 12 },
    { id: 'other', label: 'Other', value: 8 },
  ],
  visaDistribution: [
    { id: 'tourist', label: 'Tourist', value: 40 },
    { id: 'business', label: 'Business', value: 26 },
    { id: 'transit', label: 'Transit', value: 14 },
    { id: 'marine', label: 'Marine', value: 12 },
    { id: 'other', label: 'Other', value: 8 },
  ],
  businessSegments: [
    { id: 'retail', label: 'Retail', value: 38 },
    { id: 'corporate', label: 'Corporate', value: 34 },
    { id: 'marine', label: 'Marine', value: 18 },
    { id: 'b2b', label: 'B2B', value: 10 },
  ],
  riskAlerts: [
    {
      id: 'risk-1',
      title: 'Embassy appointment capacity',
      description: 'Two corridors approaching booking limits this week.',
      severity: 'warning',
      count: 2,
    },
    {
      id: 'risk-2',
      title: 'Vendor payment aging',
      description: 'Three vendors have invoices past net-30.',
      severity: 'critical',
      count: 3,
    },
    {
      id: 'risk-3',
      title: 'Passport transit SLA',
      description: 'Outbound Dubai lane above delay threshold.',
      severity: 'info',
      count: 5,
    },
  ],
  slaOverview: [
    { id: 'ops-sla', label: 'Operations SLA', value: 92, helperText: 'Target 95%' },
    { id: 'doc-sla', label: 'Documentation SLA', value: 88, helperText: 'Target 90%' },
    { id: 'finance-sla', label: 'Collections SLA', value: 81, helperText: 'Target 85%' },
    { id: 'ground-sla', label: 'Ground Ops SLA', value: 86, helperText: 'Target 90%' },
  ],
  recentReports: [
    {
      id: 'rep-1',
      name: 'Weekly operations digest',
      category: 'Operations',
      generatedAt: 'Today 08:00',
    },
    {
      id: 'rep-2',
      name: 'MTD revenue & collections',
      category: 'Finance',
      generatedAt: 'Yesterday',
    },
    {
      id: 'rep-3',
      name: 'Marine RAG summary',
      category: 'Marine',
      generatedAt: '2 days ago',
    },
  ],
}

import {
  APPLICATION_PIPELINE_STAGE_IDS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { PASSPORT_JOURNEY_STAGE_IDS } from '../../shared/config/passportJourney'
import { AGEING_BUCKET_IDS } from '../../shared/config/ageingBuckets'
import type { SuperAdminDashboardData, SuperAdminDashboardFilters } from '../types'

export const SUPER_ADMIN_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This quarter', value: 'quarter' },
]

export const SUPER_ADMIN_BRANCH_OPTIONS = [
  { label: 'All branches', value: 'all' },
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Bengaluru', value: 'bengaluru' },
  { label: 'Chennai', value: 'chennai' },
]

export const SUPER_ADMIN_COUNTRY_OPTIONS = [
  { label: 'All countries', value: 'all' },
  { label: 'UAE', value: 'uae' },
  { label: 'Schengen', value: 'schengen' },
  { label: 'UK', value: 'uk' },
  { label: 'USA', value: 'us' },
]

export const SUPER_ADMIN_SEGMENT_OPTIONS = [
  { label: 'All segments', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
  { label: 'B2B', value: 'b2b' },
]

export const SUPER_ADMIN_CLIENT_OPTIONS = [
  { label: 'All clients', value: 'all' },
  { label: 'BrightCorp India', value: 'brightcorp' },
  { label: 'Horizon Logistics', value: 'horizon' },
  { label: 'Nordic Marine Ltd', value: 'nordic' },
]

export const SUPER_ADMIN_VISA_TYPE_OPTIONS = [
  { label: 'All visa types', value: 'all' },
  { label: 'Tourist', value: 'tourist' },
  { label: 'Business', value: 'business' },
  { label: 'Transit', value: 'transit' },
  { label: 'Marine', value: 'marine' },
]

export const SUPER_ADMIN_APPLICATION_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'At risk', value: 'at-risk' },
]

export const DEFAULT_SUPER_ADMIN_DASHBOARD_FILTERS: SuperAdminDashboardFilters = {
  date: 'month',
  branch: 'all',
  country: 'all',
  segment: 'all',
  client: 'all',
  visaType: 'all',
  applicationStatus: 'all',
  search: '',
}

const PIPELINE: Record<
  ApplicationPipelineStageId,
  { count: number; averageAgeHours: number; delayedCount: number; slaPercent: number }
> = {
  draft: { count: 86, averageAgeHours: 8, delayedCount: 4, slaPercent: 96 },
  'awaiting-documents': { count: 112, averageAgeHours: 30, delayedCount: 18, slaPercent: 87 },
  verification: { count: 94, averageAgeHours: 16, delayedCount: 9, slaPercent: 91 },
  qc: { count: 71, averageAgeHours: 12, delayedCount: 11, slaPercent: 88 },
  appointment: { count: 58, averageAgeHours: 28, delayedCount: 7, slaPercent: 90 },
  submission: { count: 49, averageAgeHours: 10, delayedCount: 3, slaPercent: 95 },
  embassy: { count: 63, averageAgeHours: 64, delayedCount: 14, slaPercent: 82 },
  collection: { count: 34, averageAgeHours: 20, delayedCount: 4, slaPercent: 93 },
  dispatch: { count: 28, averageAgeHours: 9, delayedCount: 1, slaPercent: 98 },
  delivered: { count: 210, averageAgeHours: 0, delayedCount: 0, slaPercent: 100 },
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
  }))
}

export const SUPER_ADMIN_DASHBOARD_MOCK: SuperAdminDashboardData = {
  quickStats: [
    {
      id: 'total-apps',
      label: 'Total applications',
      value: 1284,
      delta: 5.4,
      deltaLabel: 'vs last month',
      sparklineData: [980, 1020, 1080, 1120, 1180, 1240, 1284],
    },
    {
      id: 'revenue',
      label: 'Revenue MTD',
      value: '₹2.18Cr',
      delta: 7.1,
      deltaLabel: 'vs prior month',
      sparklineData: [1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.18],
    },
    {
      id: 'profitability',
      label: 'Profitability (mock)',
      value: '18.4%',
      delta: 1.2,
      deltaLabel: 'margin',
      sparklineData: [16, 16.5, 17, 17.2, 17.8, 18.1, 18.4],
    },
    {
      id: 'open-cases',
      label: 'Open cases',
      value: 468,
      delta: -3.2,
      deltaLabel: 'vs last week',
      sparklineData: [510, 500, 490, 485, 478, 472, 468],
    },
  ],
  metricComparison: [
    { label: 'Completed today', value: '86', delta: 8.0 },
    { label: 'Collection rate', value: '74%', delta: 2.4 },
    { label: 'Overall SLA', value: '91%', delta: 1.1 },
    { label: 'Critical risks', value: '11', delta: -9.0 },
  ],
  revenueSnapshot: {
    todayRevenue: '₹8.6L',
    monthlyRevenue: '₹2.18Cr',
    growthPercent: 7.1,
    trend: [1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.18],
  },
  operationsHealth: {
    overallHealth: 88,
    delayedCases: 54,
    completedToday: 86,
    criticalCases: 11,
    slaPercent: 91,
  },
  branchPerformance: [
    { id: 'br-mum', label: 'Mumbai', value: 92 },
    { id: 'br-del', label: 'Delhi', value: 78 },
    { id: 'br-blr', label: 'Bengaluru', value: 71 },
    { id: 'br-chn', label: 'Chennai', value: 64 },
    { id: 'br-hyd', label: 'Hyderabad', value: 58 },
  ],
  businessSegments: [
    { id: 'corporate', label: 'Corporate', value: 36 },
    { id: 'retail', label: 'Retail', value: 32 },
    { id: 'marine', label: 'Marine', value: 20 },
    { id: 'b2b', label: 'B2B', value: 12 },
  ],
  notifications: [
    {
      id: 'sa-n1',
      title: 'SLA dip in Schengen corridor',
      body: 'Embassy lag raised delayed cases by 9 this week.',
      unread: true,
      createdAt: '25 min ago',
    },
    {
      id: 'sa-n2',
      title: 'Mumbai branch leading revenue',
      body: 'Branch contributed 28% of MTD revenue.',
      unread: false,
      createdAt: '2 hr ago',
    },
  ],
  quickActions: [
    {
      id: 'qa-admin-next',
      title: 'Admin dashboard',
      description: 'Open Dashboard Next admin command center.',
      badge: 'Admin',
      href: '/admin/dashboard-next',
    },
    {
      id: 'qa-ops-next',
      title: 'Operations dashboard',
      description: 'Open consultant workbench.',
      badge: 'Ops',
      href: '/admin/dashboard-next/operations',
    },
    {
      id: 'qa-accounts-next',
      title: 'Accounts dashboard',
      description: 'Open finance workspace.',
      badge: 'Finance',
      href: '/admin/dashboard-next/accounts',
    },
    {
      id: 'qa-clients',
      title: 'Client accounts',
      description: 'Corporate client directory.',
      badge: 'Clients',
      href: '/admin/customer-accounts/corporate-accounts',
    },
    {
      id: 'qa-finance',
      title: 'Billing & invoices',
      description: 'Finance invoicing module.',
      badge: 'Invoices',
      href: '/admin/finance/invoices',
    },
    {
      id: 'qa-legacy-admin',
      title: 'Legacy admin home',
      description: 'Current executive dashboard.',
      badge: 'Legacy',
      href: '/admin',
    },
  ],
  pipelineStages: APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
    id,
    ...PIPELINE[id],
  })),
  teamCapacity: [
    {
      id: 'ops',
      department: 'Operations',
      openCases: 186,
      completedToday: 42,
      capacity: 220,
      slaPercent: 92,
    },
    {
      id: 'docs',
      department: 'Documentation',
      openCases: 142,
      completedToday: 31,
      capacity: 160,
      slaPercent: 88,
    },
    {
      id: 'finance',
      department: 'Accounts',
      openCases: 64,
      completedToday: 18,
      capacity: 80,
      slaPercent: 94,
    },
    {
      id: 'ground',
      department: 'Ground Ops',
      openCases: 76,
      completedToday: 20,
      capacity: 90,
      slaPercent: 87,
    },
  ],
  marineTimeline: [
    {
      id: 'sm-1',
      vessel: 'MV Pacific Pearl',
      crew: '18',
      joiningPort: 'Kochi',
      signOn: '26 Jul',
      visaStatus: 'Embassy',
      priority: 'Critical',
      ragStatus: 'red',
    },
    {
      id: 'sm-2',
      vessel: 'MV Nordic Star',
      crew: '12',
      joiningPort: 'Mumbai',
      signOn: '28 Jul',
      visaStatus: 'QC',
      priority: 'High',
      ragStatus: 'amber',
    },
    {
      id: 'sm-3',
      vessel: 'MV Gulf Horizon',
      crew: '22',
      joiningPort: 'Chennai',
      signOn: '30 Jul',
      visaStatus: 'Verified',
      priority: 'Medium',
      ragStatus: 'green',
    },
  ],
  passportJourney: {
    journeyStatus: 'Network overview',
    eta: 'Multiple lanes',
    trackingNumber: 'ORG-NETWORK',
    courier: 'Multi-courier',
    stages: passportStages(2),
  },
  recentActivity: [
    {
      id: 'sa-a1',
      primary: 'Corporate win — BrightCorp quarterly MSA renewed',
      secondary: 'BD · 40 min ago',
      badgeLabel: 'Client',
      badgeColor: 'success',
    },
    {
      id: 'sa-a2',
      primary: 'Chennai branch cleared marine QC backlog',
      secondary: 'Ops · 2 hr ago',
      badgeLabel: 'Ops',
      badgeColor: 'info',
    },
  ],
  riskAlerts: [
    {
      id: 'sr-1',
      title: 'Schengen embassy capacity',
      description: 'Two corridors above delay threshold.',
      severity: 'warning',
      count: 2,
    },
    {
      id: 'sr-2',
      title: '90+ receivables concentration',
      description: 'Three accounts hold 41% of overdue.',
      severity: 'critical',
      count: 3,
    },
  ],
  collectionSummary: {
    outstanding: '₹3.42Cr',
    collected: '₹1.86Cr',
    overdue: '₹0.74Cr',
    collectionRate: 74,
  },
  ageingBuckets: AGEING_BUCKET_IDS.map((id, index) => ({
    id,
    amount: [0.92, 0.78, 0.61, 1.11][index] * 10000000,
    count: [84, 62, 41, 53][index],
  })),
  financeMetricComparison: [
    { label: 'Recovery rate', value: '74%', delta: 2.4 },
    { label: 'Vendor spend MTD', value: '₹48L', delta: -3.1 },
    { label: 'Outstanding trend', value: '₹3.42Cr', delta: -1.8 },
  ],
  processingTrend: [
    { label: 'Mon', value: 18, secondary: 14 },
    { label: 'Tue', value: 21, secondary: 16 },
    { label: 'Wed', value: 19, secondary: 17 },
    { label: 'Thu', value: 24, secondary: 19 },
    { label: 'Fri', value: 22, secondary: 20 },
    { label: 'Sat', value: 11, secondary: 9 },
    { label: 'Sun', value: 7, secondary: 5 },
  ],
  financeNotifications: [
    {
      id: 'sf-1',
      title: 'Collections above weekly target',
      body: 'Recovery rate improved 2.4 pts week-over-week.',
      unread: true,
      createdAt: '1 hr ago',
    },
  ],
  countryDistribution: [
    { id: 'ae', label: 'UAE', value: 34 },
    { id: 'schengen', label: 'Schengen', value: 27 },
    { id: 'uk', label: 'UK', value: 18 },
    { id: 'us', label: 'USA', value: 13 },
    { id: 'other', label: 'Other', value: 8 },
  ],
  clientRows: [
    {
      id: 'cl-1',
      client: 'BrightCorp India',
      segment: 'Corporate',
      applications: 148,
      revenue: '₹42.6L',
      collections: '₹31.2L',
      outstanding: '₹11.4L',
      status: 'Active',
    },
    {
      id: 'cl-2',
      client: 'Nordic Marine Ltd',
      segment: 'Marine',
      applications: 96,
      revenue: '₹38.1L',
      collections: '₹24.0L',
      outstanding: '₹14.1L',
      status: 'At risk',
    },
    {
      id: 'cl-3',
      client: 'Horizon Logistics',
      segment: 'Corporate',
      applications: 72,
      revenue: '₹21.8L',
      collections: '₹18.4L',
      outstanding: '₹3.4L',
      status: 'Active',
    },
    {
      id: 'cl-4',
      client: 'Retail network',
      segment: 'Retail',
      applications: 410,
      revenue: '₹56.2L',
      collections: '₹49.1L',
      outstanding: '₹7.1L',
      status: 'Active',
    },
  ],
  clientActivity: [
    {
      id: 'ca-1',
      primary: 'New corporate enquiry — Apex Shipping',
      secondary: 'Sales · 3 hr ago',
      badgeLabel: 'Lead',
      badgeColor: 'primary',
    },
    {
      id: 'ca-2',
      primary: 'BrightCorp volume up 12% MoM',
      secondary: 'Analytics · Yesterday',
      badgeLabel: 'Growth',
      badgeColor: 'success',
    },
  ],
  visaDistribution: [
    { id: 'tourist', label: 'Tourist', value: 38 },
    { id: 'business', label: 'Business', value: 28 },
    { id: 'marine', label: 'Marine', value: 18 },
    { id: 'transit', label: 'Transit', value: 10 },
    { id: 'other', label: 'Other', value: 6 },
  ],
  slaOverview: [
    { id: 'ops-sla', label: 'Operations SLA', value: 91, helperText: 'Target 95%' },
    { id: 'doc-sla', label: 'Documentation SLA', value: 88, helperText: 'Target 90%' },
    { id: 'fin-sla', label: 'Collections SLA', value: 81, helperText: 'Target 85%' },
    { id: 'ground-sla', label: 'Ground Ops SLA', value: 87, helperText: 'Target 90%' },
  ],
  recentReports: [
    {
      id: 'rep-1',
      name: 'Monthly executive pack — July',
      category: 'Monthly',
      generatedAt: 'Today 06:45',
    },
    {
      id: 'rep-2',
      name: 'Q2 branch scorecard',
      category: 'Branch',
      generatedAt: 'Yesterday',
    },
    {
      id: 'rep-3',
      name: 'Revenue & margin digest',
      category: 'Revenue',
      generatedAt: '2 days ago',
    },
    {
      id: 'rep-4',
      name: 'Operations risk register',
      category: 'Operations',
      generatedAt: '3 days ago',
    },
    {
      id: 'rep-5',
      name: 'Finance close summary',
      category: 'Finance',
      generatedAt: '4 days ago',
    },
  ],
  reportNotifications: [
    {
      id: 'rn-1',
      title: 'Quarterly board pack ready',
      body: 'Export available in shared leadership folder.',
      unread: true,
      createdAt: 'Today',
    },
  ],
}

export function applySuperAdminDashboardFilters(
  data: SuperAdminDashboardData,
  filters: SuperAdminDashboardFilters,
): SuperAdminDashboardData {
  const query = filters.search.trim().toLowerCase()
  const matchSearch = (...parts: Array<string | number | undefined>) =>
    !query || parts.some((part) => String(part ?? '').toLowerCase().includes(query))

  const matchSegment = (segment: string) =>
    filters.segment === 'all' || segment.toLowerCase() === filters.segment

  const matchStatus = (status: string) =>
    filters.applicationStatus === 'all' ||
    status.toLowerCase().replace(/\s+/g, '-') === filters.applicationStatus

  return {
    ...data,
    clientRows: data.clientRows.filter(
      (row) =>
        matchSegment(row.segment) &&
        matchStatus(row.status) &&
        matchSearch(row.client, row.segment, row.revenue),
    ),
  }
}

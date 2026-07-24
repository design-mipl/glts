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
  revenueHero: {
    today: {
      label: 'Today',
      value: '₹8.6L',
      delta: 4.2,
      deltaLabel: 'vs yesterday',
      targetLabel: '108% of daily target',
    },
    mtd: {
      label: 'MTD',
      value: '₹2.18Cr',
      delta: 7.1,
      deltaLabel: 'vs prior month',
      targetLabel: '91% of MTD target',
    },
    ytd: {
      label: 'YTD',
      value: '₹14.6Cr',
      delta: 11.4,
      deltaLabel: 'vs prior year',
      targetLabel: '87% of annual target',
    },
  },
  heroKpis: [
    {
      id: 'health',
      label: 'Business health',
      value: 88,
      delta: 2.1,
      deltaLabel: 'vs last month',
    },
    {
      id: 'gross-profit',
      label: 'Gross margin',
      value: '18.4%',
      delta: 1.2,
      deltaLabel: 'GP ₹40.1L MTD',
    },
    {
      id: 'outstanding',
      label: 'Outstanding',
      value: '₹3.42Cr',
      delta: -1.8,
      deltaLabel: 'vs last week',
    },
    {
      id: 'collections',
      label: 'Collections MTD',
      value: '₹1.86Cr',
      delta: 2.4,
      deltaLabel: 'MTD recovery',
    },
    {
      id: 'applications',
      label: 'Active applications',
      value: 1284,
      delta: 5.4,
      deltaLabel: 'vs last month',
    },
    {
      id: 'approval-rate',
      label: 'Approval rate',
      value: '91%',
      delta: 1.1,
      deltaLabel: '30-day rolling',
    },
    {
      id: 'at-risk',
      label: 'At risk (SLA)',
      value: 54,
      delta: -3.2,
      deltaLabel: 'vs last week',
    },
  ],
  blockedCash: {
    amount: '₹62.4L',
    applicationCount: 148,
    expectedReleaseLabel: 'As visas issue · ~12 days avg',
    note: 'Embassy/VFS fees paid, not yet passed through to client invoices.',
  },
  approvalRateTrend30d: [
    { label: 'D-29', value: 88 },
    { label: 'D-24', value: 89 },
    { label: 'D-19', value: 90 },
    { label: 'D-14', value: 89 },
    { label: 'D-9', value: 91 },
    { label: 'D-4', value: 92 },
    { label: 'Today', value: 91 },
  ],
  operationsToday: {
    receivedToday: 42,
    submittedToday: 31,
    collectedToday: 28,
    rejectedToday: 3,
    pendingEmbassy: 63,
    pendingClientDocuments: 112,
    slaBreaches: 14,
  },
  processingTimeByCountry: [
    { id: 'ae', label: 'UAE', value: 4.2 },
    { id: 'schengen', label: 'Schengen', value: 9.8 },
    { id: 'uk', label: 'UK', value: 7.1 },
    { id: 'us', label: 'USA', value: 11.4 },
    { id: 'sg', label: 'Singapore', value: 3.6 },
  ],
  cashPosition: {
    bankBalance: '₹4.80Cr',
    blockedInVisaFees: '₹62.4L',
    expectedCollections: '₹1.12Cr',
    availableFunds: '₹2.06Cr',
  },
  marginByVertical: [
    { id: 'mv-marine', primary: 'Marine', value: '16.2%', progress: 81, secondary: 'Rev ₹38.1L · Cost ₹31.9L', tone: 'warning' },
    { id: 'mv-corp', primary: 'Corporate', value: '21.4%', progress: 96, secondary: 'Rev ₹78.4L · Cost ₹61.6L', tone: 'positive' },
    { id: 'mv-retail', primary: 'Retail', value: '19.1%', progress: 90, secondary: 'Rev ₹56.2L · Cost ₹45.5L', tone: 'positive' },
    { id: 'mv-b2b', primary: 'B2B', value: '12.8%', progress: 64, secondary: 'Rev ₹24.8L · Cost ₹21.6L', tone: 'warning' },
  ],
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
  revenueTrend: [
    { label: 'Aug', value: 1.48, secondary: 1.12 },
    { label: 'Sep', value: 1.52, secondary: 1.18 },
    { label: 'Oct', value: 1.58, secondary: 1.22 },
    { label: 'Nov', value: 1.61, secondary: 1.24 },
    { label: 'Dec', value: 1.55, secondary: 1.19 },
    { label: 'Jan', value: 1.62, secondary: 1.21 },
    { label: 'Feb', value: 1.71, secondary: 1.28 },
    { label: 'Mar', value: 1.84, secondary: 1.35 },
    { label: 'Apr', value: 1.92, secondary: 1.42 },
    { label: 'May', value: 2.04, secondary: 1.51 },
    { label: 'Jun', value: 2.11, secondary: 1.58 },
    { label: 'Jul', value: 2.18, secondary: 1.86 },
  ],
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
  segmentCards: [
    {
      id: 'marine',
      label: 'Marine',
      status: 'live',
      revenue: '₹38.1L',
      cost: '₹31.9L',
      grossMarginPercent: '16.2%',
      applications: '96 active',
      approvalPercent: '89%',
      avgTat: '4.8d',
      outstanding: '₹14.1L',
      activeClients: '18',
      pipelineValue: '₹22.4L',
      growthLabel: '+9.4% MoM',
      insight: 'Joining-date risk elevated on 2 vessels.',
    },
    {
      id: 'corporate',
      label: 'Corporate',
      status: 'placeholder',
      revenue: '₹78.4L',
      cost: '₹61.6L',
      grossMarginPercent: '21.4%',
      applications: '312 MTD',
      approvalPercent: '93%',
      avgTat: '5.2d',
      outstanding: '₹48.6L',
      activeClients: '64',
      pipelineValue: '₹56.0L',
      growthLabel: '+6.1% MoM',
      insight: 'Preview metrics — live when Corporate apps ship.',
    },
    {
      id: 'retail',
      label: 'Retail',
      status: 'placeholder',
      revenue: '₹56.2L',
      cost: '₹45.5L',
      grossMarginPercent: '19.1%',
      applications: '410 MTD',
      approvalPercent: '90%',
      avgTat: '6.1d',
      outstanding: '₹7.1L',
      activeClients: '—',
      pipelineValue: '₹18.2L',
      growthLabel: '+4.8% MoM',
      insight: 'Preview — includes win rate & repeat signals.',
      repeatBusinessPercent: '34%',
      winRate: '28%',
    },
    {
      id: 'b2b',
      label: 'B2B',
      status: 'placeholder',
      revenue: '₹24.8L',
      cost: '₹21.6L',
      grossMarginPercent: '12.8%',
      applications: '88 MTD',
      approvalPercent: '87%',
      avgTat: '5.9d',
      outstanding: '₹9.4L',
      activeClients: '22 partners',
      pipelineValue: '₹11.0L',
      growthLabel: '+2.2% MoM',
      insight: 'Preview — partner channel scorecard.',
    },
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
  marineByCompany: [
    { id: 'mc-1', primary: 'Nordic Marine Ltd', value: 42, progress: 100, secondary: 'Active crew visas' },
    { id: 'mc-2', primary: 'Pacific Crewing', value: 28, progress: 67, secondary: 'Active crew visas' },
    { id: 'mc-3', primary: 'Gulf Ship Management', value: 18, progress: 43, secondary: 'Active crew visas' },
    { id: 'mc-4', primary: 'Apex Shipping', value: 8, progress: 19, secondary: 'Pipeline' },
  ],
  marineByCountry: [
    { id: 'mco-1', primary: 'UAE', value: 34, progress: 100 },
    { id: 'mco-2', primary: 'Singapore', value: 22, progress: 65 },
    { id: 'mco-3', primary: 'Schengen', value: 18, progress: 53 },
    { id: 'mco-4', primary: 'UK', value: 12, progress: 35 },
  ],
  pendingCrewVisas: [
    { id: 'pcv-1', primary: 'MV Pacific Pearl · 18 crew', value: 'Embassy', progress: 35, secondary: 'Sign-on 26 Jul', tone: 'negative' },
    { id: 'pcv-2', primary: 'MV Nordic Star · 12 crew', value: 'QC', progress: 55, secondary: 'Sign-on 28 Jul', tone: 'warning' },
    { id: 'pcv-3', primary: 'MV Gulf Horizon · 6 crew', value: 'Docs', progress: 70, secondary: 'Sign-on 02 Aug', tone: 'info' },
  ],
  topMarineClients: [
    { id: 'tmc-1', primary: 'Nordic Marine Ltd', value: '₹38.1L', progress: 100, secondary: 'At risk AR' },
    { id: 'tmc-2', primary: 'Pacific Crewing', value: '₹12.4L', progress: 33 },
    { id: 'tmc-3', primary: 'Gulf Ship Management', value: '₹8.6L', progress: 23 },
  ],
  corporatePreview: {
    kpis: [
      { label: 'Corporate revenue MTD', value: '₹78.4L', delta: 6.1 },
      { label: 'Approval rate', value: '93%', delta: 0.8 },
      { label: 'Pending business visas', value: '47', delta: -4.0 },
      { label: 'Active clients', value: '64', delta: 2.0 },
    ],
    byEntity: [
      { id: 'ce-1', primary: 'BrightCorp India', value: 148, progress: 100 },
      { id: 'ce-2', primary: 'Horizon Logistics', value: 72, progress: 49 },
      { id: 'ce-3', primary: 'Apex Industries', value: 41, progress: 28 },
    ],
    byCountry: [
      { id: 'cc-1', primary: 'Schengen', value: 38, progress: 100 },
      { id: 'cc-2', primary: 'UK', value: 24, progress: 63 },
      { id: 'cc-3', primary: 'USA', value: 18, progress: 47 },
    ],
    pending: [
      { id: 'cp-1', primary: 'BrightCorp · 12 business visas', value: 'Embassy', tone: 'warning' },
      { id: 'cp-2', primary: 'Horizon · 8 business visas', value: 'Docs', tone: 'info' },
    ],
    topClients: [
      { id: 'ctc-1', primary: 'BrightCorp India', value: '₹42.6L', progress: 100 },
      { id: 'ctc-2', primary: 'Horizon Logistics', value: '₹21.8L', progress: 51 },
    ],
    notes: [
      'Preview — sample data until Corporate application module matches Marine.',
    ],
  },
  retailPreview: {
    kpis: [
      { label: 'Walk-in apps MTD', value: '186', delta: 3.2 },
      { label: 'Online apps MTD', value: '224', delta: 5.1 },
      { label: 'Conversion rate', value: '28%', delta: 1.4 },
      { label: 'Not converted', value: '72%', delta: -1.4 },
    ],
    byEntity: [
      { id: 're-1', primary: 'Mumbai branch', value: 142, progress: 100, secondary: 'Walk-in heavy' },
      { id: 're-2', primary: 'Website / app', value: 224, progress: 100, secondary: 'Online' },
      { id: 're-3', primary: 'Delhi branch', value: 88, progress: 62 },
    ],
    byCountry: [
      { id: 'rc-1', primary: 'UAE', value: 40, progress: 100 },
      { id: 'rc-2', primary: 'Schengen', value: 28, progress: 70 },
      { id: 'rc-3', primary: 'Singapore', value: 16, progress: 40 },
    ],
    pending: [
      { id: 'rp-1', primary: 'Payment pending', value: '34 apps', tone: 'warning' },
      { id: 'rp-2', primary: 'Avg customer rating', value: '4.4 / 5', tone: 'positive' },
    ],
    topClients: [
      { id: 'rtc-1', primary: 'Top destination · UAE', value: '₹18.2L', progress: 100 },
      { id: 'rtc-2', primary: 'Top destination · Schengen', value: '₹12.6L', progress: 69 },
    ],
    notes: [
      'Preview — walk-in / online mix and ratings are sample until Retail ops is live.',
    ],
  },
  b2bPreview: {
    kpis: [
      { label: 'Partner revenue MTD', value: '₹24.8L', delta: 2.2 },
      { label: 'Active agencies', value: '22', delta: 1.0 },
      { label: 'Outstanding by partners', value: '₹9.4L', delta: -0.5 },
      { label: 'Partner health (avg)', value: '76', delta: 2.0 },
    ],
    byEntity: [
      { id: 'be-1', primary: 'Skyline Travels', value: 28, progress: 100 },
      { id: 'be-2', primary: 'Orient Holidays', value: 19, progress: 68 },
      { id: 'be-3', primary: 'Partner Desk — West', value: 14, progress: 50 },
    ],
    byCountry: [
      { id: 'bc-1', primary: 'UAE', value: 36, progress: 100 },
      { id: 'bc-2', primary: 'Thailand', value: 22, progress: 61 },
      { id: 'bc-3', primary: 'Singapore', value: 18, progress: 50 },
    ],
    pending: [
      { id: 'bp-1', primary: 'Skyline Travels outstanding', value: '₹3.2L', tone: 'warning' },
      { id: 'bp-2', primary: 'Fastest growing partner', value: 'Orient +18%', tone: 'positive' },
    ],
    topClients: [
      { id: 'btc-1', primary: 'Skyline Travels', value: '₹8.4L', progress: 100 },
      { id: 'btc-2', primary: 'Orient Holidays', value: '₹5.1L', progress: 61 },
    ],
    notes: [
      'Preview — partner health and agency trends are sample data.',
    ],
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
  managementAlerts: [
    {
      id: 'ma-1',
      title: 'Critical · 90+ receivables concentration',
      description: 'Financial impact ≈ ₹1.11Cr. Three accounts hold 41% of overdue AR.',
      severity: 'critical',
      count: 3,
    },
    {
      id: 'ma-2',
      title: 'Critical · MV Pacific Pearl joining risk',
      description: 'Sign-on in 4 days with embassy lag. Crew of 18 at risk.',
      severity: 'critical',
      count: 18,
    },
    {
      id: 'ma-3',
      title: 'High · Schengen embassy capacity',
      description: 'Two corridors above delay threshold. Approval SLA at risk.',
      severity: 'warning',
      count: 2,
    },
    {
      id: 'ma-4',
      title: 'High · Nordic Marine outstanding',
      description: '₹14.1L overdue. Collections cadence slipping two cycles.',
      severity: 'warning',
      count: 1,
    },
    {
      id: 'ma-5',
      title: 'Medium · Documentation SLA dip',
      description: 'Docs SLA at 88% vs 90% target. Rework queue growing.',
      severity: 'info',
      count: 4,
    },
    {
      id: 'ma-6',
      title: 'Low · Retail branch variance',
      description: 'Hyderabad trailing network average by 8 pts — monitor only.',
      severity: 'success',
      count: 1,
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
  topRevenueClients: [
    { id: 'trc-1', primary: 'Retail network', value: '₹56.2L', progress: 100, secondary: 'Retail' },
    { id: 'trc-2', primary: 'BrightCorp India', value: '₹42.6L', progress: 76, secondary: 'Corporate' },
    { id: 'trc-3', primary: 'Nordic Marine Ltd', value: '₹38.1L', progress: 68, secondary: 'Marine' },
    { id: 'trc-4', primary: 'Horizon Logistics', value: '₹21.8L', progress: 39, secondary: 'Corporate' },
  ],
  fastestGrowingClients: [
    { id: 'fgc-1', primary: 'BrightCorp India', value: '+12% MoM', progress: 92, tone: 'positive' },
    { id: 'fgc-2', primary: 'Apex Shipping (pipeline)', value: '+18% enquiries', progress: 78, tone: 'info' },
    { id: 'fgc-3', primary: 'Retail network', value: '+6% MoM', progress: 64, tone: 'positive' },
    { id: 'fgc-4', primary: 'Nordic Marine Ltd', value: '+3% MoM', progress: 42, tone: 'warning' },
  ],
  clientHealth: [
    { id: 'ch-1', primary: 'BrightCorp India', value: 'Healthy', progress: 94, secondary: 'Collections on track' },
    { id: 'ch-2', primary: 'Horizon Logistics', value: 'Stable', progress: 86, secondary: 'Low outstanding' },
    { id: 'ch-3', primary: 'Retail network', value: 'Watch', progress: 72, secondary: 'Seasonal variance' },
    { id: 'ch-4', primary: 'Nordic Marine Ltd', value: 'At risk', progress: 48, secondary: 'AR + joining risk' },
  ],
  dormantClients: [
    { id: 'dc-1', primary: 'Eastern Freight Co.', value: '84 days idle', progress: 20, secondary: 'Corporate' },
    { id: 'dc-2', primary: 'Bayview Holidays', value: '61 days idle', progress: 35, secondary: 'Retail' },
    { id: 'dc-3', primary: 'Partner Desk — West', value: '47 days idle', progress: 44, secondary: 'B2B' },
  ],
  highMarginClients: [
    { id: 'hm-1', primary: 'Horizon Logistics', value: '24% margin', progress: 96 },
    { id: 'hm-2', primary: 'BrightCorp India', value: '21% margin', progress: 88 },
    { id: 'hm-3', primary: 'Select retail lanes', value: '19% margin', progress: 80 },
  ],
  lowMarginClients: [
    { id: 'lm-1', primary: 'Nordic Marine Ltd', value: '11% margin', progress: 44, secondary: 'Embassy cost spike' },
    { id: 'lm-2', primary: 'Transit-heavy retail', value: '9% margin', progress: 36 },
    { id: 'lm-3', primary: 'B2B reseller tier', value: '8% margin', progress: 28 },
  ],
  highRiskClients: [
    { id: 'hr-1', primary: 'Nordic Marine Ltd', value: 'AR + joining', progress: 40, secondary: '₹14.1L overdue', tone: 'negative' },
    { id: 'hr-2', primary: 'Eastern Freight Co.', value: 'Dormant 84d', progress: 25, secondary: 'Re-engage', tone: 'warning' },
    { id: 'hr-3', primary: 'Skyline Travels', value: 'Credit watch', progress: 48, secondary: 'B2B preview', tone: 'warning' },
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
  staffLeaderboard: [
    { id: 'sl-1', primary: 'Operations', value: '42 done today', progress: 92, secondary: '186 open · 92% SLA' },
    { id: 'sl-2', primary: 'Accounts', value: '18 done today', progress: 94, secondary: '64 open · 94% SLA' },
    { id: 'sl-3', primary: 'Documentation', value: '31 done today', progress: 88, secondary: '142 open · 88% SLA' },
    { id: 'sl-4', primary: 'Ground Ops', value: '20 done today', progress: 87, secondary: '76 open · 87% SLA' },
  ],
  staffProductivity: [
    { id: 'sp-apps', label: 'Application throughput', value: 86, helperText: 'Completed vs planned today' },
    { id: 'sp-util', label: 'Team utilization', value: 78, helperText: 'Open load vs capacity' },
    { id: 'sp-rework', label: 'Rework rate (inverse)', value: 91, helperText: 'Lower rework is better' },
    { id: 'sp-queue', label: 'Queue health', value: 72, helperText: 'Backlog under control' },
  ],
  salesPlaceholder: {
    pipelineValue: '₹1.24Cr',
    winRate: '34%',
    avgDeal: '₹4.8L',
    conversion: '22%',
    notes: [
      'Corporate & retail sales scorecards are placeholders.',
      'Win / loss reasons and lead sources will attach when CRM sync lands.',
      'Marine commercial signals remain live in Marine Intelligence.',
    ],
  },
  marineMetrics: [
    { label: 'Marine revenue MTD', value: '₹38.1L', delta: 9.4 },
    { label: 'Approval rate', value: '89%', delta: 1.6 },
    { label: 'Collections', value: '₹24.0L', delta: 3.2 },
    { label: 'Outstanding', value: '₹14.1L', delta: -2.1 },
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

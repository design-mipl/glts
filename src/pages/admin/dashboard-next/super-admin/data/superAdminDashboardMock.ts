import { OPS_QUEUE_DISPLAY_LABELS } from '../../shared/widgets/operations/opsQueueDisplayLabels'
import {
  APPLICATION_PIPELINE_STAGE_IDS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { PASSPORT_JOURNEY_STAGE_IDS } from '../../shared/config/passportJourney'
import { AGEING_BUCKET_IDS } from '../../shared/config/ageingBuckets'
import {
  FINANCE_DASHBOARD_WORKSPACE_MOCK,
  FINANCE_KPI_STRIP_MOCK,
  FINANCE_RISK_CALLOUTS_MOCK,
} from '../../shared/data/financeDashboardWorkspaceMock'
import { buildTeamProductivityByChannel } from '../../shared/widgets/operations/teamProductivityData'
import type {
  SuperAdminAcquisitionFunnel,
  SuperAdminDashboardData,
  SuperAdminDashboardFilters,
  SuperAdminDestinationMixItem,
  SuperAdminClientRow,
} from '../types'
import { destinationLabelToCountryKey } from '../utils/applySegmentCountryScope'
import { buildClientMarginItems, type ClientMarginSeed } from '../utils/buildClientMarginItems'
import { SUPER_ADMIN_ANALYTICS_MOCK } from './superAdminAnalyticsMock'

/** Build destination mix rows (volume + revenue + GP + rejection). */
function destinationMix(
  rows: Array<{
    id: string
    label: string
    volume: number
    revenueL: number
    marginPct: number
    rejectionPct: number
    approvalPct?: number
    /** Optional override — net revenue per successful app in ₹. */
    netRevenuePerSuccessfulApp?: number
    successfulApplications?: number
  }>,
): SuperAdminDestinationMixItem[] {
  return rows.map((row) => {
    const decidedCount = Math.max(1, Math.round(row.volume * 0.88))
    const rejectedCount = Math.round((decidedCount * row.rejectionPct) / 100)
    const approvalPct =
      row.approvalPct ?? Math.round(Math.max(0, 100 - row.rejectionPct) * 10) / 10
    const successfulApplications =
      row.successfulApplications ??
      Math.max(1, Math.round(decidedCount * (approvalPct / 100)))

    const rejectionDragL = row.revenueL * (row.rejectionPct / 100) * 0.42
    const refundDragL = row.revenueL * 0.018
    const computedNetRevenueL = Math.max(0.1, row.revenueL - rejectionDragL - refundDragL)

    const netRevenuePerSuccessfulApp =
      row.netRevenuePerSuccessfulApp ??
      Math.round((computedNetRevenueL * 100_000) / successfulApplications)

    const netRevenueL =
      Math.round(((netRevenuePerSuccessfulApp * successfulApplications) / 100_000) * 10) / 10

    return {
      id: row.id,
      label: row.label,
      countryKey: destinationLabelToCountryKey(row.label),
      volume: row.volume,
      revenueL: row.revenueL,
      marginPct: row.marginPct,
      grossProfitL: Math.round(row.revenueL * (row.marginPct / 100) * 10) / 10,
      rejectionPct: row.rejectionPct,
      approvalPct,
      rejectedCount,
      decidedCount,
      netRevenueL,
      successfulApplications,
      netRevenuePerSuccessfulApp,
    }
  })
}

/** Commercial path: Lead → Quote → Agreement → Client Account. */
function commercialAcquisitionFunnel(
  counts: [number, number, number, number, number, number],
  workflowQuery: string,
): SuperAdminAcquisitionFunnel {
  const [leads, qualified, quotes, agreements, ready, activated] = counts
  const q = encodeURIComponent(workflowQuery)
  return {
    entryLabel: 'Leads created',
    exitLabel: 'Accounts activated',
    periodLabel: 'MTD',
    stages: [
      {
        id: 'leads',
        label: 'Leads created',
        count: leads,
        href: `/admin/customer-accounts/enquiries?customerType=${q}`,
      },
      {
        id: 'qualified',
        label: 'Qualified',
        count: qualified,
        href: `/admin/customer-accounts/enquiries?customerType=${q}&status=qualified`,
      },
      {
        id: 'quotations',
        label: 'Quotations created',
        count: quotes,
        href: `/admin/customer-accounts/quotations?workflowType=${q}`,
      },
      {
        id: 'agreements',
        label: 'Agreements created',
        count: agreements,
        href: `/admin/customer-accounts/agreements?workflowType=${q}`,
      },
      {
        id: 'ready',
        label: 'Ready for activation',
        count: ready,
        href: `/admin/customer-accounts/agreements?workflowType=${q}&status=ready_for_activation`,
      },
      {
        id: 'activated',
        label: 'Accounts activated',
        count: activated,
        href: `/admin/customer-accounts/corporate-accounts?workflowType=${q}`,
      },
    ],
  }
}

/** Retail path: Lead → Quote → Shared → Converted (no agreement/account). */
function retailAcquisitionFunnel(
  counts: [number, number, number, number, number],
): SuperAdminAcquisitionFunnel {
  const [leads, qualified, quotes, shared, converted] = counts
  return {
    entryLabel: 'Leads created',
    exitLabel: 'Quotes converted',
    periodLabel: 'MTD',
    stages: [
      {
        id: 'leads',
        label: 'Leads created',
        count: leads,
        href: '/admin/customer-accounts/enquiries?customerType=retail',
      },
      {
        id: 'qualified',
        label: 'Qualified',
        count: qualified,
        href: '/admin/customer-accounts/enquiries?customerType=retail&status=qualified',
      },
      {
        id: 'quotations',
        label: 'Quotations created',
        count: quotes,
        href: '/admin/customer-accounts/quotations?workflowType=retail',
      },
      {
        id: 'shared',
        label: 'Quotations shared',
        count: shared,
        href: '/admin/customer-accounts/quotations?workflowType=retail&sharedStatus=shared',
      },
      {
        id: 'converted',
        label: 'Quotes converted',
        count: converted,
        href: '/admin/customer-accounts/quotations?workflowType=retail&status=converted',
      },
    ],
  }
}

export const SUPER_ADMIN_DATE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'MTD', value: 'mtd' },
  { label: 'QTD', value: 'qtd' },
  { label: 'YTD', value: 'ytd' },
  { label: 'Custom', value: 'custom' },
]

/** Filter options — Jurisdiction Master cities (legacy export name kept via alias below). */
export const SUPER_ADMIN_JURISDICTION_OPTIONS = [
  { label: 'All jurisdictions', value: 'all' },
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Bengaluru', value: 'bengaluru' },
  { label: 'Chennai', value: 'chennai' },
]

/** @deprecated Prefer SUPER_ADMIN_JURISDICTION_OPTIONS */
export const SUPER_ADMIN_BRANCH_OPTIONS = SUPER_ADMIN_JURISDICTION_OPTIONS

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
  date: 'mtd',
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
  verification_pending: { count: 206, averageAgeHours: 22, delayedCount: 28, slaPercent: 88 },
  online_submission_pending: { count: 94, averageAgeHours: 14, delayedCount: 9, slaPercent: 91 },
  pending_payment: { count: 58, averageAgeHours: 18, delayedCount: 7, slaPercent: 89 },
  vfs_submission_pending: { count: 112, averageAgeHours: 48, delayedCount: 17, slaPercent: 83 },
  collection_pending: { count: 63, averageAgeHours: 24, delayedCount: 8, slaPercent: 90 },
  collected: { count: 34, averageAgeHours: 12, delayedCount: 2, slaPercent: 96 },
  dispatched: { count: 210, averageAgeHours: 0, delayedCount: 0, slaPercent: 100 },
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
  collectionsHero: {
    today: {
      label: 'Today',
      value: '₹6.2L',
      delta: 3.8,
      deltaLabel: 'vs yesterday',
      targetLabel: '104% of daily target',
    },
    mtd: {
      label: 'MTD',
      value: '₹1.86Cr',
      delta: 2.4,
      deltaLabel: 'MTD recovery',
      targetLabel: '88% of MTD target',
    },
    ytd: {
      label: 'YTD',
      value: '₹12.1Cr',
      delta: 9.2,
      deltaLabel: 'vs prior year',
      targetLabel: '84% of annual target',
    },
  },
  blockedCash: {
    amount: '₹62.4L',
    applicationCount: 148,
    expectedReleaseLabel: 'Est. release ~12 days',
    note: 'Embassy/VFS fees awaiting client invoice',
  },
  executiveSummary: {
    netRevenue: {
      value: '₹48.2L',
      marginPercent: '22.4%',
      delta: 3.2,
      deltaLabel: 'vs prior period',
    },
    outstanding: {
      amount: '₹3.42Cr',
      overdueInvoiceCount: 124,
      delta: -1.8,
      deltaLabel: 'vs last week',
    },
    businessHealth: {
      score: 88,
      statusLabel: 'Healthy',
      delta: 2.1,
      deltaLabel: 'vs last month',
    },
    activeApplications: {
      total: 1284,
      segments: [
        { id: 'marine', label: 'Marine', count: 420 },
        { id: 'corporate', label: 'Corporate', count: 360 },
        { id: 'retail', label: 'Retail', count: 280 },
        { id: 'b2b', label: 'B2B', count: 224 },
      ],
    },
    approvalRate: {
      value: '91%',
      delta: 1.1,
      deltaLabel: '30-day rolling',
    },
    atRisk: {
      total: 54,
      critical: 18,
      warning: 36,
    },
    visaCount: {
      count: 8420,
      target: 8000,
      delta: 5.2,
      deltaLabel: 'vs prior period',
    },
    receivedToday: {
      count: 86,
      delta: 12,
      deltaLabel: 'vs yesterday',
    },
    submittedToday: {
      count: 72,
      delta: 8,
      deltaLabel: 'vs yesterday',
    },
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
    receivedToday: 86,
    submittedToday: 72,
    collectedToday: 28,
    rejectedToday: 3,
    pendingEmbassy: 63,
    pendingClientDocuments: 112,
    slaBreaches: 14,
  },
  opsQueueSnapshot: {
    queueMix: [
      { key: 'verification', label: OPS_QUEUE_DISPLAY_LABELS.verification, value: 68 },
      { key: 'recheck', label: OPS_QUEUE_DISPLAY_LABELS.recheck, value: 22 },
      { key: 'payment', label: OPS_QUEUE_DISPLAY_LABELS.payment, value: 19 },
      { key: 'arrange', label: OPS_QUEUE_DISPLAY_LABELS.arrange, value: 11 },
      { key: 'submission', label: OPS_QUEUE_DISPLAY_LABELS.submission, value: 27 },
      { key: 'collection', label: OPS_QUEUE_DISPLAY_LABELS.collection, value: 16 },
    ],
    assigneeMix: [
      { key: 'user', label: 'user', value: 112 },
      { key: 'vendor', label: 'Vendor', value: 28 },
      { key: 'passenger', label: 'Passenger', value: 9 },
      { key: 'unassigned', label: 'Unassigned', value: 14 },
    ],
    ageingBuckets: [
      { bucket: '0–4h', count: 48 },
      { bucket: '4–24h', count: 61 },
      { bucket: '1–3d', count: 34 },
      { bucket: '3d+', count: 20 },
    ],
    workloadBySegment: [
      { segment: 'Retail', verification: 42, payment: 8, arrange: 4, submission: 11 },
      { segment: 'Corporate', verification: 28, payment: 6, arrange: 3, submission: 9 },
      { segment: 'Marine', verification: 36, payment: 4, arrange: 3, submission: 5 },
      { segment: 'B2B', verification: 18, payment: 3, arrange: 1, submission: 4 },
    ],
  },
  processingTimeByCountry: [
    { id: 'ae', label: 'UAE', value: 4.2 },
    { id: 'sg', label: 'Singapore', value: 3.6 },
    { id: 'qa', label: 'Qatar', value: 5.1 },
    { id: 'uk', label: 'UK', value: 7.1 },
    { id: 'schengen', label: 'Schengen', value: 9.8 },
    { id: 'us', label: 'USA', value: 11.4 },
    { id: 'ca', label: 'Canada', value: 10.2 },
    { id: 'au', label: 'Australia', value: 8.4 },
    { id: 'jp', label: 'Japan', value: 6.8 },
    { id: 'kr', label: 'South Korea', value: 7.6 },
    { id: 'th', label: 'Thailand', value: 5.4 },
    { id: 'my', label: 'Malaysia', value: 4.8 },
  ],
  cashPosition: {
    bankBalance: '₹4.80Cr',
    blockedInVisaFees: '₹62.4L',
    expectedCollections: '₹1.12Cr',
    availableFunds: '₹2.06Cr',
  },
  financeKpis: {
    ebitda: '₹36.8L',
    ebitdaDelta: 2.1,
    ebitdaDeltaLabel: 'vs prior month',
    dsoDays: 48,
    dsoDelta: -2.0,
    dsoDeltaLabel: 'days vs prior month',
    grossProfit: '₹40.1L',
    grossMarginPercent: '18.4%',
    grossProfitDelta: 1.2,
    netRevenue: '₹48.2L',
    netRevenueDelta: 3.2,
    collectionsToday: '₹6.2L',
    collectionsMtd: '₹1.86Cr',
    workingCapitalExposure: '₹4.16Cr',
    creditExposure: '₹2.84Cr',
  },
  financeKpiStrip: structuredClone(FINANCE_KPI_STRIP_MOCK),
  financeRiskCallouts: structuredClone(FINANCE_RISK_CALLOUTS_MOCK),
  financeWorkspace: structuredClone(FINANCE_DASHBOARD_WORKSPACE_MOCK),
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
      label: 'Profitability',
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
    mtd: 218,
    ytd: 2180,
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
    { id: 'br-pun', label: 'Pune', value: 61 },
    { id: 'br-amd', label: 'Ahmedabad', value: 55 },
    { id: 'br-cok', label: 'Kochi', value: 52 },
    { id: 'br-jai', label: 'Jaipur', value: 48 },
    { id: 'br-kol', label: 'Kolkata', value: 54 },
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
      netRevenue: '₹6.2L',
      cost: '₹31.9L',
      grossMarginPercent: '16.2%',
      applications: '96 active',
      approvalPercent: '89%',
      avgTat: '4.8d',
      outstanding: '₹14.1L',
      collections: '₹24.0L',
      activeClients: '18',
      pipelineValue: '₹22.4L',
      growthLabel: '+9.4% MoM',
      insight: 'Joining-date risk elevated on 2 vessels.',
      grossRevenueL: 38.1,
      netRevenueL: 6.2,
      collectionsL: 24.0,
      outstandingL: 14.1,
      activeApplications: 96,
      completedApplications: 142,
      pendingApplications: 54,
      approvalRate: 89,
      marginPercent: 16.2,
      growthPercent: 9.4,
      avgTatDays: 4.8,
    },
    {
      id: 'corporate',
      label: 'Corporate',
      status: 'placeholder',
      revenue: '₹78.4L',
      netRevenue: '₹16.8L',
      cost: '₹61.6L',
      grossMarginPercent: '21.4%',
      applications: '312 active',
      approvalPercent: '93%',
      avgTat: '5.2d',
      outstanding: '₹48.6L',
      collections: '₹58.2L',
      activeClients: '64',
      pipelineValue: '₹56.0L',
      growthLabel: '+6.1% MoM',
      insight: 'Strong margin · watch AR concentration.',
      grossRevenueL: 78.4,
      netRevenueL: 16.8,
      collectionsL: 58.2,
      outstandingL: 48.6,
      activeApplications: 312,
      completedApplications: 480,
      pendingApplications: 168,
      approvalRate: 93,
      marginPercent: 21.4,
      growthPercent: 6.1,
      avgTatDays: 5.2,
    },
    {
      id: 'retail',
      label: 'Retail',
      status: 'placeholder',
      revenue: '₹56.2L',
      netRevenue: '₹10.7L',
      cost: '₹45.5L',
      grossMarginPercent: '19.1%',
      applications: '410 active',
      approvalPercent: '90%',
      avgTat: '6.1d',
      outstanding: '₹7.1L',
      collections: '₹49.1L',
      activeClients: '—',
      pipelineValue: '₹18.2L',
      growthLabel: '+4.8% MoM',
      insight: 'Solid conversion · seasonal variance ahead.',
      repeatBusinessPercent: '34%',
      winRate: '28%',
      grossRevenueL: 56.2,
      netRevenueL: 10.7,
      collectionsL: 49.1,
      outstandingL: 7.1,
      activeApplications: 410,
      completedApplications: 620,
      pendingApplications: 210,
      approvalRate: 90,
      marginPercent: 19.1,
      growthPercent: 4.8,
      avgTatDays: 6.1,
    },
    {
      id: 'b2b',
      label: 'B2B',
      status: 'placeholder',
      revenue: '₹24.8L',
      netRevenue: '₹3.2L',
      cost: '₹21.6L',
      grossMarginPercent: '12.8%',
      applications: '88 active',
      approvalPercent: '87%',
      avgTat: '5.9d',
      outstanding: '₹9.4L',
      collections: '₹15.4L',
      activeClients: '22 partners',
      pipelineValue: '₹11.0L',
      growthLabel: '+2.2% MoM',
      insight: 'Partner channel healthy · credit watch on 1 agency.',
      grossRevenueL: 24.8,
      netRevenueL: 3.2,
      collectionsL: 15.4,
      outstandingL: 9.4,
      activeApplications: 88,
      completedApplications: 126,
      pendingApplications: 41,
      approvalRate: 87,
      marginPercent: 12.8,
      growthPercent: 2.2,
      avgTatDays: 5.9,
    },
  ],
  segmentRevenueTrend: [
    { label: 'Aug', marine: 28, corporate: 62, retail: 44, b2b: 18 },
    { label: 'Sep', marine: 30, corporate: 64, retail: 46, b2b: 19 },
    { label: 'Oct', marine: 31, corporate: 66, retail: 48, b2b: 20 },
    { label: 'Nov', marine: 32, corporate: 68, retail: 49, b2b: 20 },
    { label: 'Dec', marine: 30, corporate: 65, retail: 47, b2b: 19 },
    { label: 'Jan', marine: 33, corporate: 69, retail: 50, b2b: 21 },
    { label: 'Feb', marine: 34, corporate: 71, retail: 52, b2b: 22 },
    { label: 'Mar', marine: 35, corporate: 74, retail: 53, b2b: 23 },
    { label: 'Apr', marine: 36, corporate: 75, retail: 54, b2b: 23 },
    { label: 'May', marine: 37, corporate: 76, retail: 55, b2b: 24 },
    { label: 'Jun', marine: 37.5, corporate: 77, retail: 55.5, b2b: 24.2 },
    { label: 'Jul', marine: 38.1, corporate: 78.4, retail: 56.2, b2b: 24.8 },
  ],
  segmentApplicationTrend: [
    { label: 'Aug', marine: 72, corporate: 240, retail: 320, b2b: 64 },
    { label: 'Sep', marine: 76, corporate: 250, retail: 335, b2b: 68 },
    { label: 'Oct', marine: 80, corporate: 260, retail: 350, b2b: 70 },
    { label: 'Nov', marine: 82, corporate: 270, retail: 360, b2b: 72 },
    { label: 'Dec', marine: 78, corporate: 255, retail: 340, b2b: 68 },
    { label: 'Jan', marine: 84, corporate: 280, retail: 370, b2b: 74 },
    { label: 'Feb', marine: 86, corporate: 290, retail: 380, b2b: 78 },
    { label: 'Mar', marine: 90, corporate: 295, retail: 390, b2b: 80 },
    { label: 'Apr', marine: 92, corporate: 300, retail: 395, b2b: 82 },
    { label: 'May', marine: 94, corporate: 305, retail: 400, b2b: 84 },
    { label: 'Jun', marine: 95, corporate: 308, retail: 405, b2b: 86 },
    { label: 'Jul', marine: 96, corporate: 312, retail: 410, b2b: 88 },
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
      title: 'Mumbai jurisdiction leading revenue',
      body: 'Jurisdiction contributed 28% of MTD revenue.',
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
  teamProductivity: buildTeamProductivityByChannel([
    {
      teamId: 'ops',
      label: 'Operations',
      openCases: 186,
      completedToday: 42,
      capacity: 220,
      slaPercent: 92,
    },
    {
      teamId: 'docs',
      label: 'Documentation',
      openCases: 142,
      completedToday: 31,
      capacity: 160,
      slaPercent: 88,
    },
    {
      teamId: 'ground',
      label: 'Ground Ops',
      openCases: 76,
      completedToday: 20,
      capacity: 90,
      slaPercent: 87,
    },
    {
      teamId: 'accounts',
      label: 'Accounts',
      openCases: 64,
      completedToday: 18,
      capacity: 80,
      slaPercent: 94,
    },
  ]),
  marineTimeline: [
    {
      id: 'sm-1',
      vessel: 'MV Pacific Pearl',
      crew: '18',
      joiningPort: 'Kochi',
      joiningDate: '26 Jul',
      daysRemaining: 4,
      visaStatus: 'Embassy lag',
      priority: 'Critical',
      ragStatus: 'red',
      destinationCountry: 'schengen',
    },
    {
      id: 'sm-2',
      vessel: 'MV Nordic Star',
      crew: '12',
      joiningPort: 'Mumbai',
      joiningDate: '28 Jul',
      daysRemaining: 6,
      visaStatus: 'QC pending',
      priority: 'High',
      ragStatus: 'amber',
      destinationCountry: 'schengen',
    },
    {
      id: 'sm-4',
      vessel: 'MV Arabian Queen',
      crew: '9',
      joiningPort: 'Dubai',
      joiningDate: '29 Jul',
      daysRemaining: 7,
      visaStatus: 'VFS submission',
      priority: 'High',
      ragStatus: 'amber',
      destinationCountry: 'uae',
    },
    {
      id: 'sm-3',
      vessel: 'MV Gulf Horizon',
      crew: '22',
      joiningPort: 'Chennai',
      joiningDate: '30 Jul',
      daysRemaining: 8,
      visaStatus: 'Verified',
      priority: 'Medium',
      ragStatus: 'green',
      destinationCountry: 'uk',
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
    { id: 'mc-1', primary: 'Nordic Marine Ltd', value: 42, progress: 100, secondary: 'Active crew visas', destinationCountry: 'schengen' },
    { id: 'mc-2', primary: 'Pacific Crewing', value: 28, progress: 67, secondary: 'Active crew visas', destinationCountry: 'uk' },
    { id: 'mc-3', primary: 'Gulf Ship Management', value: 18, progress: 43, secondary: 'Active crew visas', destinationCountry: 'uae' },
    { id: 'mc-4', primary: 'Apex Shipping', value: 16, progress: 38, secondary: 'Active', destinationCountry: 'uae' },
    { id: 'mc-5', primary: 'Oceanic Crew Services', value: 14, progress: 33, destinationCountry: 'schengen' },
    { id: 'mc-6', primary: 'BlueWater Manning', value: 12, progress: 29, destinationCountry: 'uk' },
    { id: 'mc-7', primary: 'Eastern Seafarers', value: 11, progress: 26, destinationCountry: 'us' },
    { id: 'mc-8', primary: 'Horizon Marine HR', value: 9, progress: 21, destinationCountry: 'schengen' },
    { id: 'mc-9', primary: 'Coral Fleet Ops', value: 8, progress: 19 },
    { id: 'mc-10', primary: 'Atlas Crewing', value: 7, progress: 17 },
    { id: 'mc-11', primary: 'Neptune Staffing', value: 6, progress: 14 },
    { id: 'mc-12', primary: 'Harbor Line Crew', value: 5, progress: 12 },
    { id: 'mc-13', primary: 'SilverWave Manning', value: 5, progress: 12 },
    { id: 'mc-14', primary: 'Baycrest Crewing', value: 4, progress: 10 },
    { id: 'mc-15', primary: 'Polar Star HR', value: 4, progress: 10 },
    { id: 'mc-16', primary: 'Indigo Fleet Services', value: 4, progress: 9 },
    { id: 'mc-17', primary: 'Mariner Link', value: 3, progress: 8 },
    { id: 'mc-18', primary: 'Crestline Shipping HR', value: 3, progress: 7 },
    { id: 'mc-19', primary: 'AnchorPoint Crew', value: 3, progress: 7 },
    { id: 'mc-20', primary: 'DeepBlue Staffing', value: 2, progress: 6 },
    { id: 'mc-21', primary: 'SouthSea Manning', value: 2, progress: 5 },
    { id: 'mc-22', primary: 'Portside Crew Co', value: 2, progress: 5 },
    { id: 'mc-23', primary: 'Lumen Marine HR', value: 2, progress: 4 },
    { id: 'mc-24', primary: 'Tideworks Crewing', value: 1, progress: 3 },
    { id: 'mc-25', primary: 'NorthCape Seafarers', value: 1, progress: 2 },
  ],
  marineByDestination: destinationMix([
    { id: 'mco-1', label: 'UAE', volume: 34, revenueL: 12.4, marginPct: 15.2, rejectionPct: 11.8 },
    { id: 'mco-2', label: 'Singapore', volume: 22, revenueL: 8.1, marginPct: 17.4, rejectionPct: 8.4 },
    { id: 'mco-3', label: 'Schengen', volume: 18, revenueL: 6.6, marginPct: 14.8, rejectionPct: 14.2 },
    { id: 'mco-4', label: 'UK', volume: 14, revenueL: 5.2, marginPct: 16.1, rejectionPct: 9.6 },
    { id: 'mco-5', label: 'USA', volume: 12, revenueL: 4.8, marginPct: 13.9, rejectionPct: 12.5 },
    { id: 'mco-6', label: 'Qatar', volume: 10, revenueL: 3.6, marginPct: 18.2, rejectionPct: 7.1 },
    { id: 'mco-7', label: 'Saudi Arabia', volume: 9, revenueL: 3.1, marginPct: 15.6, rejectionPct: 10.2 },
    { id: 'mco-8', label: 'Australia', volume: 7, revenueL: 2.4, marginPct: 16.8, rejectionPct: 8.9 },
    { id: 'mco-9', label: 'Japan', volume: 6, revenueL: 2.1, marginPct: 14.2, rejectionPct: 6.4 },
    { id: 'mco-10', label: 'South Korea', volume: 5, revenueL: 1.7, marginPct: 15.0, rejectionPct: 7.8 },
    { id: 'mco-11', label: 'Brazil', volume: 4, revenueL: 1.3, marginPct: 12.8, rejectionPct: 13.1 },
    { id: 'mco-12', label: 'Canada', volume: 4, revenueL: 1.4, marginPct: 16.4, rejectionPct: 9.0 },
    { id: 'mco-13', label: 'Malaysia', volume: 3, revenueL: 0.9, marginPct: 17.1, rejectionPct: 5.5 },
    { id: 'mco-14', label: 'Indonesia', volume: 3, revenueL: 0.8, marginPct: 13.5, rejectionPct: 11.0 },
    { id: 'mco-15', label: 'Other', volume: 3, revenueL: 0.7, marginPct: 12.0, rejectionPct: 10.8 },
  ]),
  pendingCrewVisas: [
    { id: 'pcv-1', primary: 'MV Pacific Pearl · 18 crew', value: 'Embassy', progress: 35, secondary: 'Joining date 26 Jul', tone: 'negative', destinationCountry: 'schengen' },
    { id: 'pcv-2', primary: 'MV Nordic Star · 12 crew', value: 'QC', progress: 55, secondary: 'Joining date 28 Jul', tone: 'warning', destinationCountry: 'schengen' },
    { id: 'pcv-3', primary: 'MV Gulf Horizon · 6 crew', value: 'Docs', progress: 70, secondary: 'Joining date 02 Aug', tone: 'info', destinationCountry: 'uk' },
    { id: 'pcv-4', primary: 'MV Arabian Queen · 9 crew', value: 'Embassy', progress: 40, secondary: 'Joining date 04 Aug', tone: 'warning', destinationCountry: 'uae' },
    { id: 'pcv-5', primary: 'MV Coral Wave · 5 crew', value: 'Docs', progress: 62, secondary: 'Joining date 06 Aug', tone: 'info', destinationCountry: 'uae' },
  ],
  topMarineClients: [
    { id: 'tmc-1', primary: 'Nordic Marine Ltd', value: '₹38.1L', progress: 100, secondary: 'At risk AR' },
    { id: 'tmc-2', primary: 'Pacific Crewing', value: '₹18.4L', progress: 48 },
    { id: 'tmc-3', primary: 'Gulf Ship Management', value: '₹14.2L', progress: 37 },
    { id: 'tmc-4', primary: 'Apex Shipping', value: '₹12.4L', progress: 33 },
    { id: 'tmc-5', primary: 'Oceanic Crew Services', value: '₹9.8L', progress: 26 },
    { id: 'tmc-6', primary: 'BlueWater Manning', value: '₹8.6L', progress: 23 },
    { id: 'tmc-7', primary: 'Eastern Seafarers', value: '₹7.1L', progress: 19 },
    { id: 'tmc-8', primary: 'Horizon Marine HR', value: '₹5.4L', progress: 14 },
  ],
  corporatePreview: {
    commercialKpis: {
      revenue: {
        today: {
          label: 'Today',
          value: '₹2.6L',
          delta: 3.4,
          deltaLabel: 'vs yesterday',
          targetLabel: '102% of daily target',
        },
        mtd: {
          label: 'MTD',
          value: '₹78.4L',
          delta: 6.1,
          deltaLabel: 'vs prior month',
          targetLabel: '94% of MTD target',
        },
        ytd: {
          label: 'YTD',
          value: '₹5.9Cr',
          delta: 8.8,
          deltaLabel: 'vs prior year',
          targetLabel: '89% of annual target',
        },
      },
      grossMarginPercent: '21.4%',
      grossMarginDelta: 0.9,
      totalApplications: 312,
      totalApplicationsDelta: 4.2,
      approvalPercent: '93%',
      approvalDelta: 0.8,
      outstanding: '₹48.6L',
      outstandingDelta: -1.4,
      collections: '₹58.2L',
      collectionsDelta: 2.8,
      activeClients: 64,
      activeClientsDelta: 2.0,
      pipelineValue: '₹56.0L',
      pipelineDelta: 3.1,
      repeatRatePercent: '68%',
      repeatRateDelta: 1.8,
      repeatApplications: 212,
      repeatEligibleApplications: 312,
    },
    acquisitionFunnel: commercialAcquisitionFunnel(
      [186, 142, 98, 64, 52, 41],
      'corporate',
    ),
    byEntity: [
      { id: 'ce-1', primary: 'BrightCorp India', value: 148, progress: 100 },
      { id: 'ce-2', primary: 'Horizon Logistics', value: 72, progress: 49 },
      { id: 'ce-3', primary: 'Apex Industries', value: 61, progress: 41 },
      { id: 'ce-4', primary: 'Summit Tech', value: 54, progress: 36 },
      { id: 'ce-5', primary: 'NorthPeak Group', value: 48, progress: 32 },
      { id: 'ce-6', primary: 'Vertex Services', value: 41, progress: 28 },
      { id: 'ce-7', primary: 'Cascade Holdings', value: 36, progress: 24 },
      { id: 'ce-8', primary: 'PrimeWorks Ltd', value: 29, progress: 20 },
      { id: 'ce-9', primary: 'Atlas Corporate', value: 24, progress: 16 },
      { id: 'ce-10', primary: 'Delta Systems', value: 18, progress: 12 },
    ],
    byDestination: destinationMix([
      { id: 'cc-1', label: 'Schengen', volume: 38, revenueL: 22.4, marginPct: 22.8, rejectionPct: 13.6 },
      { id: 'cc-2', label: 'UK', volume: 24, revenueL: 16.2, marginPct: 21.1, rejectionPct: 8.9 },
      { id: 'cc-3', label: 'USA', volume: 18, revenueL: 14.8, marginPct: 19.6, rejectionPct: 11.2 },
      { id: 'cc-4', label: 'UAE', volume: 15, revenueL: 9.4, marginPct: 23.4, rejectionPct: 6.8 },
      { id: 'cc-5', label: 'Singapore', volume: 12, revenueL: 7.1, marginPct: 24.0, rejectionPct: 5.4 },
      { id: 'cc-6', label: 'Canada', volume: 10, revenueL: 5.6, marginPct: 20.2, rejectionPct: 7.6 },
      { id: 'cc-7', label: 'Australia', volume: 8, revenueL: 4.2, marginPct: 21.5, rejectionPct: 9.1 },
      { id: 'cc-8', label: 'Japan', volume: 6, revenueL: 3.1, marginPct: 18.9, rejectionPct: 4.8 },
    ]),
    pending: [
      { id: 'cp-1', primary: 'BrightCorp · 12 business visas', value: 'Embassy', progress: 40, tone: 'warning' },
      { id: 'cp-2', primary: 'Horizon · 8 business visas', value: 'Docs', progress: 55, tone: 'info' },
      { id: 'cp-3', primary: 'Summit · 6 business visas', value: 'Embassy', progress: 35, tone: 'warning' },
      { id: 'cp-4', primary: 'NorthPeak · 5 visas', value: 'QC', progress: 60, tone: 'info' },
    ],
    topClients: [
      { id: 'ctc-1', primary: 'BrightCorp India', value: '₹42.6L', progress: 100 },
      { id: 'ctc-2', primary: 'Horizon Logistics', value: '₹21.8L', progress: 51 },
      { id: 'ctc-3', primary: 'Apex Industries', value: '₹16.4L', progress: 38 },
      { id: 'ctc-4', primary: 'Summit Tech', value: '₹12.1L', progress: 28 },
      { id: 'ctc-5', primary: 'NorthPeak Group', value: '₹9.4L', progress: 22 },
      { id: 'ctc-6', primary: 'Vertex Services', value: '₹7.8L', progress: 18 },
    ],
    notes: [],
  },
  retailPreview: {
    commercialKpis: {
      revenue: {
        today: {
          label: 'Today',
          value: '₹1.9L',
          delta: 2.1,
          deltaLabel: 'vs yesterday',
          targetLabel: '96% of daily target',
        },
        mtd: {
          label: 'MTD',
          value: '₹56.2L',
          delta: 4.6,
          deltaLabel: 'vs prior month',
          targetLabel: '88% of MTD target',
        },
        ytd: {
          label: 'YTD',
          value: '₹4.1Cr',
          delta: 7.2,
          deltaLabel: 'vs prior year',
          targetLabel: '84% of annual target',
        },
      },
      grossMarginPercent: '19.1%',
      grossMarginDelta: 0.6,
      totalApplications: 410,
      totalApplicationsDelta: 5.1,
      approvalPercent: '91%',
      approvalDelta: 1.1,
      outstanding: '₹22.4L',
      outstandingDelta: -0.8,
      collections: '₹41.6L',
      collectionsDelta: 3.4,
      activeClients: 286,
      activeClientsDelta: 4.0,
      pipelineValue: '₹18.8L',
      pipelineDelta: 2.2,
      repeatRatePercent: '34%',
      repeatRateDelta: 2.1,
      repeatApplications: 140,
      repeatEligibleApplications: 410,
    },
    acquisitionFunnel: retailAcquisitionFunnel([410, 286, 224, 168, 118]),
    byEntity: [
      { id: 're-1', primary: 'Website / app', value: 224, progress: 100, secondary: 'Online' },
      { id: 're-2', primary: 'Mumbai jurisdiction', value: 142, progress: 63, secondary: 'Walk-in heavy' },
      { id: 're-3', primary: 'Delhi jurisdiction', value: 88, progress: 39 },
      { id: 're-4', primary: 'Bangalore jurisdiction', value: 74, progress: 33 },
      { id: 're-5', primary: 'Chennai jurisdiction', value: 61, progress: 27 },
      { id: 're-6', primary: 'Hyderabad jurisdiction', value: 48, progress: 21 },
      { id: 're-7', primary: 'Partner counters', value: 36, progress: 16 },
      { id: 're-8', primary: 'Kochi jurisdiction', value: 28, progress: 13 },
    ],
    byDestination: destinationMix([
      { id: 'rc-1', label: 'UAE', volume: 1240, revenueL: 12.4, marginPct: 19.4, rejectionPct: 5, approvalPct: 95, netRevenuePerSuccessfulApp: 949 },
      { id: 'rc-2', label: 'Schengen', volume: 580, revenueL: 20.3, marginPct: 18.8, rejectionPct: 3, approvalPct: 97, netRevenuePerSuccessfulApp: 3391 },
      { id: 'rc-3', label: 'Singapore', volume: 22, revenueL: 9.1, marginPct: 21.2, rejectionPct: 6.1 },
      { id: 'rc-4', label: 'Thailand', volume: 18, revenueL: 6.4, marginPct: 17.6, rejectionPct: 9.8 },
      { id: 'rc-5', label: 'UK', volume: 320, revenueL: 9.6, marginPct: 18.1, rejectionPct: 9, approvalPct: 91, netRevenuePerSuccessfulApp: 2850 },
      { id: 'rc-6', label: 'USA', volume: 12, revenueL: 5.2, marginPct: 16.9, rejectionPct: 12.0 },
      { id: 'rc-7', label: 'Malaysia', volume: 9, revenueL: 2.8, marginPct: 20.4, rejectionPct: 5.9 },
      { id: 'rc-8', label: 'Other', volume: 7, revenueL: 2.1, marginPct: 15.5, rejectionPct: 11.4 },
    ]),
    pending: [
      { id: 'rp-1', primary: 'Payment pending', value: '34 apps', progress: 34, tone: 'warning' },
      { id: 'rp-2', primary: 'Doc rework', value: '18 apps', progress: 18, tone: 'warning' },
      { id: 'rp-3', primary: 'Avg customer rating', value: '4.4 / 5', progress: 88, tone: 'positive' },
    ],
    topClients: [],
    notes: [],
  },
  b2bPreview: {
    commercialKpis: {
      revenue: {
        today: {
          label: 'Today',
          value: '₹0.9L',
          delta: 1.8,
          deltaLabel: 'vs yesterday',
          targetLabel: '91% of daily target',
        },
        mtd: {
          label: 'MTD',
          value: '₹24.8L',
          delta: 2.2,
          deltaLabel: 'vs prior month',
          targetLabel: '86% of MTD target',
        },
        ytd: {
          label: 'YTD',
          value: '₹1.9Cr',
          delta: 5.4,
          deltaLabel: 'vs prior year',
          targetLabel: '81% of annual target',
        },
      },
      grossMarginPercent: '12.8%',
      grossMarginDelta: -0.4,
      totalApplications: 118,
      totalApplicationsDelta: 1.6,
      approvalPercent: '87%',
      approvalDelta: 0.5,
      outstanding: '₹9.4L',
      outstandingDelta: -0.5,
      collections: '₹18.2L',
      collectionsDelta: 1.9,
      activeClients: 22,
      activeClientsDelta: 1.0,
      pipelineValue: '₹14.6L',
      pipelineDelta: 2.4,
      repeatRatePercent: '72%',
      repeatRateDelta: 0.9,
      repeatApplications: 85,
      repeatEligibleApplications: 118,
    },
    acquisitionFunnel: commercialAcquisitionFunnel(
      [74, 58, 42, 28, 22, 16],
      'b2b_agent',
    ),
    byEntity: [
      { id: 'be-1', primary: 'Skyline Travels', value: 28, progress: 100 },
      { id: 'be-2', primary: 'Orient Holidays', value: 24, progress: 86 },
      { id: 'be-3', primary: 'Partner Desk — West', value: 19, progress: 68 },
      { id: 'be-4', primary: 'Global Link Tours', value: 16, progress: 57 },
      { id: 'be-5', primary: 'Voyage Hub', value: 14, progress: 50 },
      { id: 'be-6', primary: 'Coastal Agents', value: 12, progress: 43 },
      { id: 'be-7', primary: 'Metro Travel Co', value: 10, progress: 36 },
      { id: 'be-8', primary: 'Sunrise Bookings', value: 8, progress: 29 },
    ],
    byDestination: destinationMix([
      { id: 'bc-1', label: 'UAE', volume: 36, revenueL: 8.6, marginPct: 13.2, rejectionPct: 9.4 },
      { id: 'bc-2', label: 'Thailand', volume: 22, revenueL: 4.8, marginPct: 11.8, rejectionPct: 11.6 },
      { id: 'bc-3', label: 'Singapore', volume: 18, revenueL: 4.1, marginPct: 14.6, rejectionPct: 7.2 },
      { id: 'bc-4', label: 'Schengen', volume: 15, revenueL: 3.6, marginPct: 12.4, rejectionPct: 14.8 },
      { id: 'bc-5', label: 'Malaysia', volume: 12, revenueL: 2.4, marginPct: 13.8, rejectionPct: 8.0 },
      { id: 'bc-6', label: 'UK', volume: 9, revenueL: 2.1, marginPct: 12.9, rejectionPct: 10.1 },
      { id: 'bc-7', label: 'USA', volume: 7, revenueL: 1.8, marginPct: 11.2, rejectionPct: 12.4 },
    ]),
    pending: [
      { id: 'bp-1', primary: 'Skyline Travels outstanding', value: '₹3.2L', progress: 32, tone: 'warning' },
      { id: 'bp-2', primary: 'Orient credit watch', value: '92% limit', progress: 48, tone: 'warning' },
      { id: 'bp-3', primary: 'Fastest growing partner', value: 'Orient +18%', progress: 78, tone: 'positive' },
    ],
    topClients: [
      { id: 'btc-1', primary: 'Skyline Travels', value: '₹8.4L', progress: 100 },
      { id: 'btc-2', primary: 'Orient Holidays', value: '₹5.1L', progress: 61 },
      { id: 'btc-3', primary: 'Global Link Tours', value: '₹3.8L', progress: 45 },
      { id: 'btc-4', primary: 'Voyage Hub', value: '₹2.9L', progress: 35 },
      { id: 'btc-5', primary: 'Coastal Agents', value: '₹2.1L', progress: 25 },
    ],
    notes: [],
  },
  recentActivity: [
    {
      id: 'sa-a1',
      primary: 'Invoice generated — BrightCorp MTD billing cycle',
      secondary: 'Finance · 12 min ago · Priya Nair',
      badgeLabel: 'Finance',
      badgeColor: 'primary',
    },
    {
      id: 'sa-a2',
      primary: 'Payment received — Nordic Marine ₹4.2L',
      secondary: 'Accounts · 28 min ago · Rahul Mehta',
      badgeLabel: 'Finance',
      badgeColor: 'success',
    },
    {
      id: 'sa-a3',
      primary: 'Visa approved — UAE employment · 6 applications',
      secondary: 'Operations · 45 min ago',
      badgeLabel: 'Ops',
      badgeColor: 'success',
    },
    {
      id: 'sa-a4',
      primary: 'Application submitted — Schengen tourism batch',
      secondary: 'Documentation · 1 hr ago',
      badgeLabel: 'Docs',
      badgeColor: 'info',
    },
    {
      id: 'sa-a5',
      primary: 'Collection completed — passport pouch dispatched',
      secondary: 'Ground Ops · 1.5 hr ago',
      badgeLabel: 'Ops',
      badgeColor: 'success',
    },
    {
      id: 'sa-a6',
      primary: 'Client added — Horizon Logistics (Corporate)',
      secondary: 'Sales · 2 hr ago',
      badgeLabel: 'Client',
      badgeColor: 'primary',
    },
    {
      id: 'sa-a7',
      primary: 'Application escalated — MV Pacific Pearl joining risk',
      secondary: 'Marine · 3 hr ago',
      badgeLabel: 'Risk',
      badgeColor: 'error',
    },
    {
      id: 'sa-a8',
      primary: 'Embassy submission — VFS Dubai · 14 files',
      secondary: 'Operations · 4 hr ago',
      badgeLabel: 'Embassy',
      badgeColor: 'warning',
    },
    {
      id: 'sa-a9',
      primary: 'Visa collected — Singapore work permit · 9 passports',
      secondary: 'Ground Ops · 5 hr ago',
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
      description: 'Joining date in 4 days with embassy lag. Crew of 18 at risk.',
      severity: 'critical',
      count: 18,
    },
    {
      id: 'ma-credit-1',
      title: 'Critical · Credit limit exceeded',
      description: 'Nordic Marine Ltd exceeded Agreement credit limit by ₹14.1L.',
      severity: 'critical',
      count: 1,
    },
    {
      id: 'ma-3',
      title: 'High · Schengen embassy capacity',
      description: 'Two corridors above delay threshold. Approval SLA at risk.',
      severity: 'warning',
      count: 2,
    },
    {
      id: 'ma-credit-2',
      title: 'High · Credit limit warning',
      description: 'BrightCorp India at 92% of Agreement credit limit.',
      severity: 'warning',
      count: 1,
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
      title: 'Low · Retail jurisdiction variance',
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
    { label: 'EBITDA', value: '₹36.8L', delta: 2.1 },
    { label: 'DSO (days)', value: '48', delta: -2.0 },
    { label: 'Gross profit', value: '₹40.1L', delta: 1.2 },
    { label: 'Net revenue (profit)', value: '₹48.2L', delta: 3.2 },
    { label: 'Recovery rate', value: '74%', delta: 2.4 },
    { label: 'Credit exposure', value: '₹2.84Cr', delta: 0.8 },
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
    {
      id: 'cl-5',
      client: 'Skyline Travels',
      segment: 'B2B',
      applications: 88,
      revenue: '₹18.4L',
      collections: '₹15.2L',
      outstanding: '₹3.2L',
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
    { id: 'trc-5', primary: 'Skyline Travels', value: '₹18.4L', progress: 33, secondary: 'B2B' },
    { id: 'trc-6', primary: 'Orient Holidays', value: '₹14.2L', progress: 25, secondary: 'B2B' },
    { id: 'trc-7', primary: 'Apex Industries', value: '₹12.6L', progress: 22, secondary: 'Corporate' },
    { id: 'trc-8', primary: 'Pacific Crewing', value: '₹11.1L', progress: 20, secondary: 'Marine' },
    { id: 'trc-9', primary: 'Summit Tech', value: '₹9.4L', progress: 17, secondary: 'Corporate' },
    { id: 'trc-10', primary: 'Global Link Tours', value: '₹7.8L', progress: 14, secondary: 'B2B' },
    { id: 'trc-11', primary: 'Voyage Hub', value: '₹6.2L', progress: 11, secondary: 'B2B' },
    { id: 'trc-12', primary: 'NorthPeak Group', value: '₹5.1L', progress: 9, secondary: 'Corporate' },
  ],
  fastestGrowingClients: [
    { id: 'fgc-1', primary: 'BrightCorp India', value: '+12% MoM', progress: 92, tone: 'positive' },
    { id: 'fgc-2', primary: 'Apex Shipping (pipeline)', value: '+18% enquiries', progress: 78, tone: 'info' },
    { id: 'fgc-3', primary: 'Retail network', value: '+6% MoM', progress: 64, tone: 'positive' },
    { id: 'fgc-4', primary: 'Orient Holidays', value: '+14% MoM', progress: 70, tone: 'positive' },
    { id: 'fgc-5', primary: 'Summit Tech', value: '+9% MoM', progress: 58, tone: 'positive' },
    { id: 'fgc-6', primary: 'Voyage Hub', value: '+11% MoM', progress: 62, tone: 'positive' },
    { id: 'fgc-7', primary: 'Nordic Marine Ltd', value: '+3% MoM', progress: 42, tone: 'warning' },
    { id: 'fgc-8', primary: 'Skyline Travels', value: '+5% MoM', progress: 48, tone: 'info' },
  ],
  clientHealth: [
    { id: 'ch-1', primary: 'Horizon Logistics', value: 'Healthy', progress: 94, secondary: 'Low outstanding' },
    { id: 'ch-2', primary: 'Retail network', value: 'Stable', progress: 86, secondary: 'Seasonal variance' },
    { id: 'ch-3', primary: 'Summit Tech', value: 'Healthy', progress: 88, secondary: 'Collections on track' },
    { id: 'ch-4', primary: 'Orient Holidays', value: 'Stable', progress: 81, secondary: 'Growing volume' },
    { id: 'ch-5', primary: 'BrightCorp India', value: 'Watch', progress: 72, secondary: 'Credit 92% of limit' },
    { id: 'ch-6', primary: 'Voyage Hub', value: 'Watch', progress: 68, secondary: 'New partner' },
    { id: 'ch-7', primary: 'Pacific Crewing', value: 'Stable', progress: 76, secondary: 'Marine OK' },
    { id: 'ch-8', primary: 'Nordic Marine Ltd', value: 'At risk', progress: 40, secondary: 'Credit exceeded · AR + joining' },
    { id: 'ch-9', primary: 'Skyline Travels', value: 'Watch', progress: 58, secondary: 'Credit watch' },
    { id: 'ch-10', primary: 'Apex Industries', value: 'Healthy', progress: 84, secondary: 'On track' },
  ],
  dormantClients: [
    { id: 'dc-1', primary: 'Eastern Freight Co.', value: '84 days idle', progress: 20, secondary: 'Corporate' },
    { id: 'dc-2', primary: 'Bayview Holidays', value: '61 days idle', progress: 35, secondary: 'Retail' },
    { id: 'dc-3', primary: 'Partner Desk — West', value: '47 days idle', progress: 44, secondary: 'B2B' },
    { id: 'dc-4', primary: 'Coastal Agents', value: '39 days idle', progress: 50, secondary: 'B2B' },
    { id: 'dc-5', primary: 'Metro Travel Co', value: '33 days idle', progress: 55, secondary: 'B2B' },
  ],
  highMarginClients: [
    { id: 'hm-1', primary: 'Horizon Logistics', value: '24% margin', progress: 96 },
    { id: 'hm-2', primary: 'BrightCorp India', value: '21% margin', progress: 88 },
    { id: 'hm-3', primary: 'Select retail lanes', value: '19% margin', progress: 80 },
    { id: 'hm-4', primary: 'Summit Tech', value: '18% margin', progress: 76 },
    { id: 'hm-5', primary: 'Voyage Hub', value: '17% margin', progress: 72 },
    { id: 'hm-6', primary: 'Orient Holidays', value: '16% margin', progress: 68 },
  ],
  lowMarginClients: [
    { id: 'lm-1', primary: 'Nordic Marine Ltd', value: '11% margin', progress: 44, secondary: 'Embassy cost spike' },
    { id: 'lm-2', primary: 'Transit-heavy retail', value: '9% margin', progress: 36 },
    { id: 'lm-3', primary: 'B2B reseller tier', value: '8% margin', progress: 28 },
    { id: 'lm-4', primary: 'Skyline Travels', value: '10% margin', progress: 40 },
    { id: 'lm-5', primary: 'Gulf Ship Management', value: '12% margin', progress: 48 },
  ],
  highMarginClientIntelligence: [],
  lowMarginClientIntelligence: [],
  highRiskClients: [
    {
      id: 'hr-1',
      primary: 'Nordic Marine Ltd',
      value: 'Credit exceeded',
      progress: 28,
      secondary: 'Agreement limit + ₹14.1L AR · joining risk',
      tone: 'negative',
    },
    {
      id: 'hr-2',
      primary: 'BrightCorp India',
      value: 'Credit 92%',
      progress: 48,
      secondary: 'Near Agreement credit limit',
      tone: 'warning',
    },
    {
      id: 'hr-3',
      primary: 'Eastern Freight Co.',
      value: 'Dormant 84d',
      progress: 25,
      secondary: 'Re-engage',
      tone: 'warning',
    },
    {
      id: 'hr-4',
      primary: 'Skyline Travels',
      value: 'Credit watch',
      progress: 48,
      secondary: 'B2B preview',
      tone: 'warning',
    },
    {
      id: 'hr-5',
      primary: 'Partner Desk — West',
      value: 'Dormant 47d',
      progress: 44,
      secondary: 'B2B',
      tone: 'warning',
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
    notes: [],
  },
  marineCommercialKpis: {
    revenue: {
      today: {
        label: 'Today',
        value: '₹1.4L',
        delta: 5.2,
        deltaLabel: 'vs yesterday',
        targetLabel: '110% of daily target',
      },
      mtd: {
        label: 'MTD',
        value: '₹38.1L',
        delta: 9.4,
        deltaLabel: 'vs prior month',
        targetLabel: '92% of MTD target',
      },
      ytd: {
        label: 'YTD',
        value: '₹2.8Cr',
        delta: 10.1,
        deltaLabel: 'vs prior year',
        targetLabel: '88% of annual target',
      },
    },
    grossMarginPercent: '16.2%',
    grossMarginDelta: 0.7,
    totalApplications: 96,
    totalApplicationsDelta: 3.8,
    approvalPercent: '89%',
    approvalDelta: 1.6,
    outstanding: '₹14.1L',
    outstandingDelta: -2.1,
    collections: '₹24.0L',
    collectionsDelta: 3.2,
    activeClients: 18,
    activeClientsDelta: 1.0,
    pipelineValue: '₹22.4L',
    pipelineDelta: 4.5,
    repeatRatePercent: '61%',
    repeatRateDelta: 1.4,
    repeatApplications: 59,
    repeatEligibleApplications: 96,
  },
  marineAcquisitionFunnel: commercialAcquisitionFunnel(
    [120, 88, 64, 42, 34, 28],
    'marine',
  ),
  recentReports: [
    {
      id: 'rep-1',
      name: 'Monthly executive pack — July',
      category: 'Monthly',
      generatedAt: 'Today 06:45',
    },
    {
      id: 'rep-2',
      name: 'Q2 jurisdiction scorecard',
      category: 'Jurisdiction',
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
  analytics: SUPER_ADMIN_ANALYTICS_MOCK,
}

const HIGH_MARGIN_CLIENT_SEEDS: ClientMarginSeed[] = [
  { id: 'hm-1', client: 'Horizon Logistics', marginPercent: 24 },
  { id: 'hm-2', client: 'BrightCorp India', marginPercent: 21 },
  {
    id: 'hm-3',
    client: 'Select retail lanes',
    segment: 'Retail',
    marginPercent: 19,
    revenueMtdL: 28.4,
    applicationsMtd: 186,
  },
  {
    id: 'hm-4',
    client: 'Summit Tech',
    segment: 'Corporate',
    marginPercent: 18,
    revenueMtdL: 16.8,
    applicationsMtd: 64,
  },
  {
    id: 'hm-5',
    client: 'Voyage Hub',
    segment: 'B2B',
    marginPercent: 17,
    revenueMtdL: 12.6,
    applicationsMtd: 52,
  },
  {
    id: 'hm-6',
    client: 'Orient Holidays',
    segment: 'Retail',
    marginPercent: 16,
    revenueMtdL: 9.8,
    applicationsMtd: 38,
  },
]

const LOW_MARGIN_CLIENT_SEEDS: ClientMarginSeed[] = [
  {
    id: 'lm-1',
    client: 'Nordic Marine Ltd',
    marginPercent: 11,
    detail: 'Embassy cost spike',
  },
  {
    id: 'lm-2',
    client: 'Retail network',
    marginPercent: 9,
    detail: 'Transit-heavy lanes',
  },
  {
    id: 'lm-3',
    client: 'Skyline Travels',
    marginPercent: 10,
    detail: 'Schengen + UK mix',
  },
  {
    id: 'lm-4',
    client: 'Gulf Ship Management',
    segment: 'Marine',
    marginPercent: 12,
    revenueMtdL: 14.2,
    applicationsMtd: 54,
  },
  {
    id: 'lm-5',
    client: 'Pacific Crewing',
    segment: 'Marine',
    marginPercent: 13,
    revenueMtdL: 4.2,
    applicationsMtd: 12,
  },
]

SUPER_ADMIN_DASHBOARD_MOCK.highMarginClientIntelligence = buildClientMarginItems(
  SUPER_ADMIN_DASHBOARD_MOCK.clientRows,
  HIGH_MARGIN_CLIENT_SEEDS,
)
SUPER_ADMIN_DASHBOARD_MOCK.lowMarginClientIntelligence = buildClientMarginItems(
  SUPER_ADMIN_DASHBOARD_MOCK.clientRows,
  LOW_MARGIN_CLIENT_SEEDS,
)

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

  let dateFactor = 1
  switch (filters.date) {
    case 'today':
      dateFactor *= 0.35
      break
    case 'yesterday':
      dateFactor *= 0.38
      break
    case 'last7':
    case 'week':
      dateFactor *= 0.72
      break
    case 'last30':
      dateFactor *= 0.95
      break
    case 'qtd':
    case 'quarter':
      dateFactor *= 1.18
      break
    case 'ytd':
    case 'year':
      dateFactor *= 1.35
      break
    default:
      break
  }

  /** Business comparison ignores segment + client (page compares all verticals). */
  let comparisonFactor = dateFactor
  if (filters.branch !== 'all') comparisonFactor *= 0.55
  if (filters.country !== 'all') comparisonFactor *= 0.7

  let factor = comparisonFactor
  if (filters.segment !== 'all') factor *= 0.28
  if (filters.client !== 'all') factor *= 0.45
  if (filters.visaType !== 'all') factor *= 0.75
  if (query) factor *= 0.4

  const pipelineStages = data.pipelineStages.map((stage) => ({
    ...stage,
    count: Math.max(0, Math.round(stage.count * factor)),
    delayedCount: Math.max(0, Math.round(stage.delayedCount * factor)),
  }))

  const scaleCount = (n: number) => Math.max(0, Math.round(n * factor))
  const scaleMetric = (n: number, digits = 2) =>
    Math.round(n * factor * 10 ** digits) / 10 ** digits
  const scaleComparison = (n: number, digits = 2) =>
    Math.round(n * comparisonFactor * 10 ** digits) / 10 ** digits
  const scaleComparisonCount = (n: number) => Math.max(0, Math.round(n * comparisonFactor))
  const summary = data.executiveSummary

  const revenueTrend = data.revenueTrend.map((point) => ({
    ...point,
    value: scaleMetric(point.value),
    secondary:
      point.secondary != null ? scaleMetric(point.secondary) : point.secondary,
  }))

  const formatL = (n: number) => `₹${n.toFixed(1)}L`

  const segmentCards = data.segmentCards.map((card) => {
    const gross = scaleComparison(card.grossRevenueL)
    const net = scaleComparison(card.netRevenueL)
    const collections = scaleComparison(card.collectionsL)
    const outstanding = scaleComparison(card.outstandingL)
    const active = scaleComparisonCount(card.activeApplications)
    const completed = scaleComparisonCount(card.completedApplications)
    const pending = scaleComparisonCount(card.pendingApplications)
    return {
      ...card,
      grossRevenueL: gross,
      netRevenueL: net,
      collectionsL: collections,
      outstandingL: outstanding,
      activeApplications: active,
      completedApplications: completed,
      pendingApplications: pending,
      revenue: formatL(gross),
      netRevenue: formatL(net),
      collections: formatL(collections),
      outstanding: formatL(outstanding),
      applications: `${active} active`,
      cost: formatL(scaleComparison(parseFloat(card.cost.replace(/[₹L]/g, '')) || card.grossRevenueL - card.netRevenueL)),
    }
  })

  const scaleTrend = (points: typeof data.segmentRevenueTrend) =>
    points.map((p) => ({
      label: p.label,
      marine: scaleComparison(p.marine),
      corporate: scaleComparison(p.corporate),
      retail: scaleComparison(p.retail),
      b2b: scaleComparison(p.b2b),
    }))

  return {
    ...data,
    pipelineStages,
    revenueTrend,
    segmentCards,
    segmentRevenueTrend: scaleTrend(data.segmentRevenueTrend),
    segmentApplicationTrend: data.segmentApplicationTrend.map((p) => ({
      label: p.label,
      marine: scaleComparisonCount(p.marine),
      corporate: scaleComparisonCount(p.corporate),
      retail: scaleComparisonCount(p.retail),
      b2b: scaleComparisonCount(p.b2b),
    })),
    operationsToday: {
      ...data.operationsToday,
      receivedToday: scaleCount(data.operationsToday.receivedToday),
      submittedToday: scaleCount(data.operationsToday.submittedToday),
      collectedToday: scaleCount(data.operationsToday.collectedToday),
      rejectedToday: scaleCount(data.operationsToday.rejectedToday),
      pendingEmbassy: scaleCount(data.operationsToday.pendingEmbassy),
      pendingClientDocuments: scaleCount(data.operationsToday.pendingClientDocuments),
      slaBreaches: scaleCount(data.operationsToday.slaBreaches),
    },
    opsQueueSnapshot: {
      queueMix: data.opsQueueSnapshot.queueMix.map((s) => ({
        ...s,
        value: scaleCount(s.value),
      })),
      assigneeMix: data.opsQueueSnapshot.assigneeMix.map((s) => ({
        ...s,
        value: scaleCount(s.value),
      })),
      ageingBuckets: data.opsQueueSnapshot.ageingBuckets.map((b) => ({
        ...b,
        count: scaleCount(b.count),
      })),
      workloadBySegment: data.opsQueueSnapshot.workloadBySegment.map((row) => ({
        segment: row.segment,
        verification: scaleCount(row.verification),
        payment: scaleCount(row.payment),
        arrange: scaleCount(row.arrange),
        submission: scaleCount(row.submission),
      })),
    },
    operationsHealth: {
      ...data.operationsHealth,
      delayedCases: scaleCount(data.operationsHealth.delayedCases),
      completedToday: scaleCount(data.operationsHealth.completedToday),
      criticalCases: scaleCount(data.operationsHealth.criticalCases),
    },
    blockedCash: {
      ...data.blockedCash,
      applicationCount: scaleCount(data.blockedCash.applicationCount),
    },
    executiveSummary: {
      ...summary,
      outstanding: {
        ...summary.outstanding,
        overdueInvoiceCount: scaleCount(summary.outstanding.overdueInvoiceCount),
      },
      activeApplications: {
        total: scaleCount(summary.activeApplications.total),
        segments: summary.activeApplications.segments.map((s) => ({
          ...s,
          count: scaleCount(s.count),
        })),
      },
      atRisk: {
        total: scaleCount(summary.atRisk.total),
        critical: scaleCount(summary.atRisk.critical),
        warning: scaleCount(summary.atRisk.warning),
      },
      receivedToday: {
        ...summary.receivedToday,
        count: scaleCount(summary.receivedToday.count),
      },
      submittedToday: {
        ...summary.submittedToday,
        count: scaleCount(summary.submittedToday.count),
      },
    },
    clientRows: data.clientRows.filter(
      (row) =>
        matchSegment(row.segment) &&
        matchStatus(row.status) &&
        matchSearch(row.client, row.segment, row.revenue),
    ),
  }
}

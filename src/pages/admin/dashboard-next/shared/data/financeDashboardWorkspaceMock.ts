import type {
  DashboardFinanceKpiStrip,
  DashboardFinanceRiskCallouts,
  FinanceDashboardWorkspaceData,
  ManagementFinanceDashboardData,
} from '../types'

const BLOCKED_CASH_BY_COUNTRY = [
  { country: 'Schengen', amountL: 28 },
  { country: 'UAE', amountL: 14 },
  { country: 'UK', amountL: 9 },
  { country: 'Other', amountL: 11.4 },
] as const

/** Shared finance workspace mock — Super Admin Finance tab + Accounts Overview. */
export const FINANCE_DASHBOARD_WORKSPACE_MOCK: FinanceDashboardWorkspaceData = {
  cashWaterfall: [
    { id: 'opening', label: 'Opening cash', amountL: 185, type: 'opening' },
    { id: 'collections', label: 'Actual collections', amountL: 62.4, type: 'inflow' },
    { id: 'other-inflows', label: 'Other inflows', amountL: 8.2, type: 'inflow' },
    { id: 'opex', label: 'Operating expenses', amountL: -28.6, type: 'outflow' },
    { id: 'salaries', label: 'Salaries', amountL: -18.4, type: 'outflow' },
    { id: 'taxes', label: 'Taxes', amountL: -6.2, type: 'outflow' },
    { id: 'refunds', label: 'Refunds', amountL: -3.8, type: 'outflow' },
    { id: 'blocked', label: 'Blocked Embassy/VFS', amountL: -62.4, type: 'outflow' },
    { id: 'other-outflows', label: 'Other outflows', amountL: -4.6, type: 'outflow' },
    { id: 'closing', label: 'Available funds', amountL: 206, type: 'closing' },
  ],
  availableFunds: {
    amount: '₹2.06Cr',
    floor: '₹1.50Cr',
    status: 'comfortable',
    statusLabel: 'Well above threshold',
  },
  blockedCash: {
    amount: '₹62.4L',
    amountL: 62.4,
    applicationCount: 148,
    expectedReleaseDays: 12,
    expectedReleaseLabel: 'Est. release ~12 days',
    expectedReleaseFrom: '18 Aug',
    expectedReleaseTo: '30 Aug',
    note: 'Embassy/VFS fees awaiting client invoice',
    byCountry: [...BLOCKED_CASH_BY_COUNTRY],
  },
  plMetrics: [
    {
      id: 'net-revenue',
      label: 'Net revenue',
      actual: '₹48.2L',
      target: '₹55L',
      achievementPercent: 87.6,
      priorMonth: '₹46.7L',
      priorMonthDelta: 3.2,
    },
    {
      id: 'gross-profit',
      label: 'Gross profit',
      actual: '₹18.6L',
      target: '₹20L',
      achievementPercent: 93,
      priorMonth: '₹17.4L',
      priorMonthDelta: 6.9,
    },
    {
      id: 'ebitda',
      label: 'EBITDA',
      actual: '₹8.2L',
      target: '₹9.5L',
      achievementPercent: 86.3,
      priorMonth: '₹7.6L',
      priorMonthDelta: 7.9,
    },
  ],
  arAgeingDetail: [
    {
      id: 'current',
      label: 'Current',
      amountL: 12.4,
      clients: [
        { name: 'BrightCorp India', amountL: 4.2 },
        { name: 'Horizon Logistics', amountL: 3.1 },
        { name: 'Maersk Line India', amountL: 2.8 },
      ],
    },
    {
      id: '1-30',
      label: '1–30 days',
      amountL: 5.8,
      clients: [
        { name: 'Tata Consultancy Services', amountL: 2.4 },
        { name: 'Reliance Industries', amountL: 1.9 },
        { name: 'Infosys Limited', amountL: 1.5 },
      ],
    },
    {
      id: '31-60',
      label: '31–60 days',
      amountL: 3.2,
      clients: [
        { name: 'MSC Crew Services', amountL: 1.6 },
        { name: 'Vistara Travel Desk', amountL: 1.0 },
      ],
    },
    {
      id: '61-90',
      label: '61–90 days',
      amountL: 1.8,
      clients: [{ name: 'Nordic Marine Ltd', amountL: 1.8 }],
    },
    {
      id: '90-plus',
      label: '90+ days',
      amountL: 2.6,
      clients: [
        { name: 'ABC Corp', amountL: 1.1 },
        { name: 'XYZ Ltd', amountL: 0.8 },
        { name: 'Global Travels', amountL: 0.7 },
      ],
    },
  ],
  creditExposureClients: [
    { id: 'ce-1', name: 'ABC Corp', amountL: 8.4 },
    { id: 'ce-2', name: 'Horizon Ltd', amountL: 6.7 },
    { id: 'ce-3', name: 'XYZ Travels', amountL: 5.9 },
    { id: 'ce-4', name: 'Global Corp', amountL: 4.8 },
    { id: 'ce-5', name: 'Acme Ltd', amountL: 4.2 },
  ],
  verticalMargins: [
    {
      id: 'marine',
      label: 'Marine',
      marginPercent: 16.2,
      trendDelta: -0.7,
      marginTrend6M: [18.1, 17.8, 17.2, 16.9, 16.5, 16.2],
      monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    },
    {
      id: 'corporate',
      label: 'Corporate',
      marginPercent: 21.4,
      trendDelta: 0.9,
      marginTrend6M: [19.8, 20.1, 20.4, 20.8, 21.0, 21.4],
      monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    },
    {
      id: 'retail',
      label: 'Retail',
      marginPercent: 19.1,
      trendDelta: 0.6,
      marginTrend6M: [17.2, 17.8, 18.0, 18.4, 18.8, 19.1],
      monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    },
    {
      id: 'b2b',
      label: 'B2B',
      marginPercent: 12.8,
      trendDelta: -0.4,
      marginTrend6M: [13.6, 13.4, 13.2, 13.0, 13.1, 12.8],
      monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    },
  ],
  registeredAgentCountries: [
    { country: 'UAE', agentCount: 12 },
    { country: 'UK', agentCount: 8 },
    { country: 'Germany', agentCount: 6 },
    { country: 'France', agentCount: 5 },
    { country: 'Canada', agentCount: 4 },
  ],
  forwardOutlook: [
    {
      horizonDays: 30,
      horizonLabel: '30 days',
      forecastL: 12.5,
      targetL: 14.0,
      achievementPercent: 89,
      downsideRisks: ['Overdue receivables', 'Renewal risk', 'Lower demand'],
    },
    {
      horizonDays: 60,
      horizonLabel: '60 days',
      forecastL: 25.8,
      targetL: 28.0,
      achievementPercent: 92,
      downsideRisks: ['Client renewals', 'Renewal risk', 'Lower demand'],
    },
    {
      horizonDays: 90,
      horizonLabel: '90 days',
      forecastL: 41.2,
      targetL: 45.0,
      achievementPercent: 92,
      downsideRisks: ['Lower application volume', 'Renewal risk', 'Lower demand'],
    },
  ],
}

export const FINANCE_KPI_STRIP_MOCK: DashboardFinanceKpiStrip = {
  availableFunds: '₹2.06Cr',
  availableFundsFloor: 'Floor ₹1.50Cr',
  availableFundsStatus: 'comfortable',
  availableFundsStatusLabel: 'Well above threshold',
  netRevenueMtd: '₹48.2L',
  netRevenueTarget: '₹55L',
  netRevenueTargetPercent: 87.6,
  netRevenuePriorMonth: '₹46.7L',
  netRevenueGrowthPercent: 3.2,
  netRevenueGrowthAmount: '+₹1.5L',
  grossMarginPercent: 38.5,
  grossMarginPriorPercent: 36.8,
  grossMarginDeltaPp: 1.7,
  overdueAmount: '₹6.4L',
  overdueInvoiceCount: 124,
  dsoDays: 47,
  dsoPriorDays: 51,
  dsoDeltaDays: -4,
}

export const FINANCE_RISK_CALLOUTS_MOCK: DashboardFinanceRiskCallouts = {
  creditExposure: '₹24.6L',
  creditExposureTop5: 'Top 5: ₹14.2L',
  slaCashAtRisk: '₹8.2L',
  slaCashAtRiskCases: 18,
}

export const MANAGEMENT_FINANCE_DASHBOARD_MOCK: ManagementFinanceDashboardData = {
  kpiStrip: FINANCE_KPI_STRIP_MOCK,
  riskCallouts: FINANCE_RISK_CALLOUTS_MOCK,
  workspace: structuredClone(FINANCE_DASHBOARD_WORKSPACE_MOCK),
}

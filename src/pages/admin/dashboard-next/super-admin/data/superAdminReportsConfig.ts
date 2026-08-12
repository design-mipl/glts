import type { Column } from '@/design-system/UIComponents'
import { formatDisplayDate, formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import type { SuperAdminDashboardData } from '../types'

/** Exact category labels for Super Admin Reports. */
export const SUPER_ADMIN_REPORT_CATEGORIES = [
  'Financial Reports',
  'Operational Reports',
  'Sales Reports',
  'Client Reports',
  'Embassy & Country Reports',
  'Quality Reports',
] as const

export type SuperAdminReportCategory = (typeof SUPER_ADMIN_REPORT_CATEGORIES)[number]

export type SuperAdminReportTypeId =
  // Financial
  | 'revenue_vs_daily_target'
  | 'cash_position'
  | 'collections_today_mtd'
  | 'gross_margin_by_vertical'
  | 'revenue_by_visa_country'
  | 'revenue_by_client_country'
  | 'outstanding_receivables_ageing'
  | 'embassy_fee_working_capital'
  | 'full_pl_vertical_breakdown'
  | 'revenue_forecast_per_country'
  | 'client_wise_profitability'
  | 'days_sales_outstanding'
  | 'daily_invoice_report'
  // Operational
  | 'daily_bulletin'
  | 'crew_change_risk'
  | 'sla_breach'
  | 'blocked_applications'
  | 'pipeline_by_stage'
  | 'avg_tat_by_country'
  | 'passport_custody'
  | 'team_productivity'
  // Sales
  | 'new_enquiries_received'
  | 'enquiry_to_application_conversion'
  | 'marine_corporate_pipeline'
  | 'b2b_agent_signup_tracker'
  | 'lost_opportunity_log'
  | 'registered_agent_country_acquisition'
  | 'sales_channel_performance'
  // Client
  | 'top_20_client_scorecard'
  | 'high_risk_client_list'
  | 'dormant_client_reactivation'
  | 'client_ltv_margin_ranking'
  | 'wallet_share_analysis'
  // Embassy & Country
  | 'embassy_processing_time_tracker'
  | 'embassy_rejection_rate_by_country'
  | 'registered_agent_countries_weekly'
  | 'country_profitability_ranking'
  | 'embassy_rule_change_log'
  | 'vfs_commission_report'
  // Quality
  | 'document_resubmission_rate'
  | 'rejection_cause_analysis'
  | 'complaint_log_ncr'
  | 'sla_performance_trend'
  | 'quality_to_revenue_correlation'
  | 'error_log'

export type SuperAdminReportPeriodId =
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'six_months'
  | 'custom'

export interface SuperAdminReportPreviewRow {
  id: string
  [key: string]: string
}

export interface SuperAdminReportMeta {
  id: SuperAdminReportTypeId
  label: string
  category: SuperAdminReportCategory
  source: string
}

export const SUPER_ADMIN_REPORT_META: readonly SuperAdminReportMeta[] = [
  // Financial
  {
    id: 'revenue_vs_daily_target',
    label: 'Revenue vs Daily Target',
    category: 'Financial Reports',
    source: 'Finance — daily / MTD / YTD revenue against targets.',
  },
  {
    id: 'cash_position',
    label: 'Cash Position (Available Funds)',
    category: 'Financial Reports',
    source: 'Finance — available funds after blocked embassy/VFS cash.',
  },
  {
    id: 'collections_today_mtd',
    label: 'Collections Today & MTD',
    category: 'Financial Reports',
    source: 'Finance — payments received today and MTD vs target.',
  },
  {
    id: 'gross_margin_by_vertical',
    label: 'Gross Margin by Vertical',
    category: 'Financial Reports',
    source: 'Finance — GP% by Marine / Corporate / Retail / B2B.',
  },
  {
    id: 'revenue_by_visa_country',
    label: 'Revenue by Visa Country',
    category: 'Financial Reports',
    source: 'Finance — country-wise revenue, applications, and targets.',
  },
  {
    id: 'revenue_by_client_country',
    label: 'Revenue by Client & Country',
    category: 'Financial Reports',
    source: 'Finance — client × country revenue mix.',
  },
  {
    id: 'outstanding_receivables_ageing',
    label: 'Outstanding Receivables Ageing',
    category: 'Financial Reports',
    source: 'Finance — AR ageing buckets across the network.',
  },
  {
    id: 'embassy_fee_working_capital',
    label: 'Embassy Fee Working Capital',
    category: 'Financial Reports',
    source: 'Finance — cash blocked in embassy / VFS fees.',
  },
  {
    id: 'full_pl_vertical_breakdown',
    label: 'Full P&L (4-Vertical Breakdown)',
    category: 'Financial Reports',
    source: 'Finance — revenue, cost, and margin by vertical.',
  },
  {
    id: 'revenue_forecast_per_country',
    label: 'Revenue Forecast per Country',
    category: 'Financial Reports',
    source: 'Finance — conservative / base / optimistic outlook.',
  },
  {
    id: 'client_wise_profitability',
    label: 'Client-wise Profitability',
    category: 'Financial Reports',
    source: 'Finance — client revenue, cost, margin, and MoM trend.',
  },
  {
    id: 'days_sales_outstanding',
    label: 'Days Sales Outstanding (DSO)',
    category: 'Financial Reports',
    source: 'Finance — DSO by vertical / client tier vs credit days.',
  },
  {
    id: 'daily_invoice_report',
    label: 'Daily Invoice Report',
    category: 'Financial Reports',
    source: 'Finance — case closed vs invoiced status with reason.',
  },
  // Operational
  {
    id: 'daily_bulletin',
    label: 'Daily Operations Bulletin',
    category: 'Operational Reports',
    source: 'Ops — case status log and dispatch records.',
  },
  {
    id: 'crew_change_risk',
    label: 'Crew Change Risk Board',
    category: 'Operational Reports',
    source: 'Ops — marine cases nearing joining dates.',
  },
  {
    id: 'sla_breach',
    label: 'SLA Breach Report',
    category: 'Operational Reports',
    source: 'Ops — cases past committed TAT.',
  },
  {
    id: 'blocked_applications',
    label: 'Blocked Applications',
    category: 'Operational Reports',
    source: 'Ops — stage stuck beyond 12 hours.',
  },
  {
    id: 'pipeline_by_stage',
    label: 'Pipeline by Stage / Vertical',
    category: 'Operational Reports',
    source: 'Ops — case stage aggregation week-on-week.',
  },
  {
    id: 'avg_tat_by_country',
    label: 'Average Turnaround Time by Country',
    category: 'Operational Reports',
    source: 'Ops — application-received to visa-issued timestamps.',
  },
  {
    id: 'passport_custody',
    label: 'Passport Custody Log',
    category: 'Operational Reports',
    source: 'Ops — custody status movements.',
  },
  {
    id: 'team_productivity',
    label: 'Team Productivity vs Capacity',
    category: 'Operational Reports',
    source: 'Ops — processed vs capacity benchmark (15/day).',
  },
  // Sales
  {
    id: 'new_enquiries_received',
    label: 'New Enquiries Received',
    category: 'Sales Reports',
    source: 'Sales — daily enquiry intake by channel.',
  },
  {
    id: 'enquiry_to_application_conversion',
    label: 'Enquiry to Application Conversion',
    category: 'Sales Reports',
    source: 'Sales — 7-day conversion vs 30-day rate.',
  },
  {
    id: 'marine_corporate_pipeline',
    label: 'Marine / Corporate Pipeline Report',
    category: 'Sales Reports',
    source: 'Sales — prospect pipeline and probability-weighted forecast.',
  },
  {
    id: 'b2b_agent_signup_tracker',
    label: 'B2B Travel Agent Signup Tracker',
    category: 'Sales Reports',
    source: 'Sales — agent activation and first application.',
  },
  {
    id: 'lost_opportunity_log',
    label: 'Lost Opportunity Log',
    category: 'Sales Reports',
    source: 'Sales — lost enquiries with reason and channel.',
  },
  {
    id: 'registered_agent_country_acquisition',
    label: 'Registered Agent Country Acquisition',
    category: 'Sales Reports',
    source: 'Sales — weekly / monthly applications by RA country.',
  },
  {
    id: 'sales_channel_performance',
    label: 'Sales Channel Performance',
    category: 'Sales Reports',
    source: 'Sales — applications, revenue, and conversion by channel.',
  },
  // Client
  {
    id: 'top_20_client_scorecard',
    label: 'Top 20 Client Scorecard',
    category: 'Client Reports',
    source: 'CRM — volume, approval, outstanding, and health score.',
  },
  {
    id: 'high_risk_client_list',
    label: 'High-Risk Client List',
    category: 'Client Reports',
    source: 'CRM — overdue, inactivity, and complaint flags.',
  },
  {
    id: 'dormant_client_reactivation',
    label: 'Dormant Client Reactivation',
    category: 'Client Reports',
    source: 'CRM — dormant accounts with reactivation potential.',
  },
  {
    id: 'client_ltv_margin_ranking',
    label: 'Client LTV & Margin Ranking',
    category: 'Client Reports',
    source: 'CRM — lifetime GP, margin, and projected annual value.',
  },
  {
    id: 'wallet_share_analysis',
    label: 'Wallet Share Analysis',
    category: 'Client Reports',
    source: 'CRM — estimated spend potential vs GLTS actual.',
  },
  // Embassy & Country
  {
    id: 'embassy_processing_time_tracker',
    label: 'Embassy Processing Time Tracker',
    category: 'Embassy & Country Reports',
    source: 'Ops — current vs 90-day embassy processing averages.',
  },
  {
    id: 'embassy_rejection_rate_by_country',
    label: 'Embassy Rejection Rate by Country',
    category: 'Embassy & Country Reports',
    source: 'Ops — weekly rejection mix and WoW flag.',
  },
  {
    id: 'registered_agent_countries_weekly',
    label: 'Registered Agent Countries – Weekly Performance',
    category: 'Embassy & Country Reports',
    source: 'Ops — submitted / approved / rejected / pending by country.',
  },
  {
    id: 'country_profitability_ranking',
    label: 'Country Profitability Ranking',
    category: 'Embassy & Country Reports',
    source: 'Finance — volume, revenue, cost, and margin by country.',
  },
  {
    id: 'embassy_rule_change_log',
    label: 'Embassy Rule Change Log',
    category: 'Embassy & Country Reports',
    source: 'Ops — rule / fee / document / policy change log.',
  },
  {
    id: 'vfs_commission_report',
    label: 'VFS Commission Report',
    category: 'Embassy & Country Reports',
    source: 'Finance — to be defined.',
  },
  // Quality
  {
    id: 'document_resubmission_rate',
    label: 'Document Resubmission Rate',
    category: 'Quality Reports',
    source: 'Quality — 2nd / 3rd document resubmissions.',
  },
  {
    id: 'rejection_cause_analysis',
    label: 'Rejection Cause Analysis',
    category: 'Quality Reports',
    source: 'Quality — GLTS / applicant / embassy rejection causes.',
  },
  {
    id: 'complaint_log_ncr',
    label: 'Complaint Log & Resolution Time (NCR)',
    category: 'Quality Reports',
    source: 'Quality — NCR complaints and resolution outcomes.',
  },
  {
    id: 'sla_performance_trend',
    label: 'SLA Performance Trend (6 Months)',
    category: 'Quality Reports',
    source: 'Quality — monthly SLA compliance by vertical.',
  },
  {
    id: 'quality_to_revenue_correlation',
    label: 'Quality-to-Revenue Correlation',
    category: 'Quality Reports',
    source: 'Quality — repeat rate and LTV/CAC correlation.',
  },
  {
    id: 'error_log',
    label: 'Error Log',
    category: 'Quality Reports',
    source: 'Quality — operational error register.',
  },
] as const

export const SUPER_ADMIN_REPORT_CATEGORY_OPTIONS = SUPER_ADMIN_REPORT_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}))

export function getReportTypesForCategory(category: SuperAdminReportCategory | '') {
  if (!category) return []
  return SUPER_ADMIN_REPORT_META.filter((meta) => meta.category === category).map((meta) => ({
    label: meta.label,
    value: meta.id,
  }))
}

export const SUPER_ADMIN_REPORT_PERIOD_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: '6 months', value: 'six_months' },
  { label: 'Custom', value: 'custom' },
] as const satisfies ReadonlyArray<{ label: string; value: SuperAdminReportPeriodId }>

function startOfDay(d: Date): Date {
  const next = new Date(d)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(d: Date): Date {
  const next = new Date(d)
  next.setHours(23, 59, 59, 999)
  return next
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

export function resolveSuperAdminReportRange(
  period: SuperAdminReportPeriodId,
  customRange: [Date | null, Date | null],
  now = new Date(),
): { from: Date; to: Date } {
  const today = startOfDay(now)
  const to = endOfDay(now)

  switch (period) {
    case 'day':
      return { from: today, to }
    case 'week':
      return { from: startOfDay(addDays(today, -6)), to }
    case 'month':
      return { from: startOfDay(addDays(today, -29)), to }
    case 'quarter':
      return { from: startOfDay(addDays(today, -89)), to }
    case 'six_months':
      return { from: startOfDay(addDays(today, -179)), to }
    case 'custom': {
      const [start, end] = customRange
      const from = start ? startOfDay(start) : today
      const customTo = end ? endOfDay(end) : to
      return { from, to: customTo }
    }
    default:
      return { from: today, to }
  }
}

export function formatSuperAdminReportRangeLabel(from: Date, to: Date): string {
  return `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
}

export function getSuperAdminReportTypeLabel(id: SuperAdminReportTypeId): string {
  return SUPER_ADMIN_REPORT_META.find((meta) => meta.id === id)?.label ?? id
}

export function getSuperAdminReportSource(id: SuperAdminReportTypeId): string {
  return SUPER_ADMIN_REPORT_META.find((meta) => meta.id === id)?.source ?? ''
}

function textColumn(
  key: string,
  label: string,
  widthSize: 'sm' | 'md' | 'lg' | 'xl' = 'md',
): Column<SuperAdminReportPreviewRow> {
  return {
    key,
    label,
    widthSize,
    sortable: false,
    filterable: false,
    searchable: false,
  }
}

function parseCurrencyNumber(value: string | number): number {
  if (typeof value === 'number') return value
  return Number.parseFloat(value.replace(/[₹,\sLCr]/gi, '')) || 0
}

function ragFromMargin(margin: number): string {
  if (margin >= 55) return 'Green'
  if (margin >= 40) return 'Amber'
  return 'Red'
}

function utilizationFlag(pct: number): string {
  if (pct < 70) return '<70%'
  if (pct > 120) return '>120%'
  return 'OK'
}

export function getSuperAdminReportColumns(
  reportType: SuperAdminReportTypeId,
): Column<SuperAdminReportPreviewRow>[] {
  switch (reportType) {
    // —— Financial ——
    case 'revenue_vs_daily_target':
      return [
        textColumn('todaysRevenue', "Today's Revenue", 'md'),
        textColumn('mtdRevenue', 'MTD Revenue', 'md'),
        textColumn('mtdTarget', 'MTD Target', 'md'),
        textColumn('ytdRevenue', 'YTD Revenue', 'md'),
        textColumn('annualTarget', 'Annual Target', 'md'),
        textColumn('ytdVsTarget', 'YTD vs Target (%)', 'md'),
      ]
    case 'cash_position':
      return [
        textColumn('approxBalance', 'Approx. Balance', 'md'),
        textColumn('cashBlocked', 'Cash Blocked (Embassy/VFS)', 'lg'),
        textColumn('refunds', 'Refunds', 'md'),
        textColumn('actualCollections', 'Actual Collections Till Date', 'lg'),
        textColumn('availableFunds', 'Available Funds', 'md'),
        textColumn('asOf', 'As-of Date/Time', 'md'),
      ]
    case 'collections_today_mtd':
      return [
        textColumn('paymentsToday', 'Payments Received Today', 'md'),
        textColumn('mtdCollections', 'MTD Collections', 'md'),
        textColumn('mtdTarget', 'MTD Target', 'md'),
        textColumn('topOverdueAccount', 'Top Overdue Account', 'lg'),
        textColumn('daysOverdue', 'Days Overdue', 'sm'),
      ]
    case 'gross_margin_by_vertical':
      return [
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('revenueThisWeek', 'Revenue This Week', 'md'),
        textColumn('directCost', 'Direct Cost', 'md'),
        textColumn('grossProfit', 'Gross Profit', 'md'),
        textColumn('grossMargin', 'Gross Margin (%)', 'sm'),
        textColumn('vsLastWeek', 'vs Last Week', 'sm'),
        textColumn('ragStatus', 'RAG Status', 'sm'),
      ]
    case 'revenue_by_visa_country':
    case 'revenue_by_client_country':
      return [
        textColumn('country', 'Country', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('applications', 'No. of Applications', 'sm'),
        textColumn('revenueThisWeek', 'Revenue This Week', 'md'),
        textColumn('margin', 'Margin (%)', 'sm'),
        textColumn('revenueMtd', 'Revenue MTD', 'md'),
        textColumn('targetedRevenueMtd', 'Targeted Revenue MTD', 'md'),
        textColumn('targetedYtdRevenue', 'Targeted YTD Revenue', 'md'),
        textColumn('pctOfTotal', '% of Total Revenue for each Client', 'md'),
      ]
    case 'outstanding_receivables_ageing':
      return [
        textColumn('agingBucket', 'Aging Bucket', 'md'),
        textColumn('clients', 'Clients', 'xl'),
        textColumn('totalOutstanding', 'Total Outstanding Agewise', 'md'),
        textColumn('reasons', 'Reasons of Outstandings', 'xl'),
      ]
    case 'embassy_fee_working_capital':
      return [
        textColumn('country', 'Country', 'md'),
        textColumn('totalBlocked', 'Total Blocked / Utilized', 'md'),
        textColumn('cases', 'No. of Cases', 'sm'),
        textColumn('avgDaysBlocked', 'Avg Days Blocked', 'sm'),
        textColumn('actualPaymentReceived', 'Actual Payment Received', 'md'),
        textColumn('oldestCaseDays', 'Oldest Case (Days)', 'sm'),
      ]
    case 'full_pl_vertical_breakdown':
      return [
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('directCost', 'Direct Cost', 'md'),
        textColumn('overheadAllocation', 'Overhead Allocation', 'md'),
        textColumn('ebitda', 'EBITDA', 'md'),
        textColumn('vsPriorMonth', 'vs Prior Month', 'sm'),
        textColumn('vsMtdTarget', 'vs MTD Target', 'sm'),
        textColumn('vsYtdTarget', 'vs YTD Target', 'sm'),
        textColumn('varianceNote', 'Variance Note', 'lg'),
      ]
    case 'revenue_forecast_per_country':
      return [
        textColumn('period', 'Period', 'md'),
        textColumn('conservative', 'Conservative', 'md'),
        textColumn('base', 'Base', 'md'),
        textColumn('optimistic', 'Optimistic', 'md'),
        textColumn('basis', 'Basis (Pipeline / Approval Rate / Seasonality)', 'xl'),
      ]
    case 'client_wise_profitability':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('directCost', 'Direct Cost', 'md'),
        textColumn('grossProfit', 'Gross Profit', 'md'),
        textColumn('grossMargin', 'Gross Margin (%)', 'sm'),
        textColumn('trendVsLastMonth', 'Trend vs Last Month', 'md'),
      ]
    case 'days_sales_outstanding':
      return [
        textColumn('verticalOrTier', 'Vertical / Client Tier', 'lg'),
        textColumn('avgDays', 'Avg Days (Invoice to Payment)', 'md'),
        textColumn('sixMonthTrend', '6-Month Trend', 'md'),
        textColumn('vsTarget', 'vs Target (Credit Days)', 'lg'),
      ]
    case 'daily_invoice_report':
      return [
        textColumn('caseId', 'Case ID', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('invoiceStatus', 'Invoice Status', 'md'),
        textColumn('reason', 'Reason (if Not Invoiced)', 'xl'),
        textColumn('daysSinceClosed', 'Days Since Case Closed', 'sm'),
      ]

    // —— Operational ——
    case 'daily_bulletin':
      return [
        textColumn('category', 'Category (Submissions/Collections/Delays/Dispatch)', 'lg'),
        textColumn('countToday', 'Count Today', 'sm'),
        textColumn('detailFlag', 'Detail / Flag', 'xl'),
        textColumn('owner', 'Owner', 'md'),
      ]
    case 'crew_change_risk':
      return [
        textColumn('vessel', 'Vessel', 'lg'),
        textColumn('country', 'Country', 'md'),
        textColumn('seafarerName', 'Seafarer Name', 'lg'),
        textColumn('nationality', 'Nationality', 'md'),
        textColumn('visaType', 'Visa Type', 'md'),
        textColumn('currentStatus', 'Current Status', 'md'),
        textColumn('joiningDate', 'Joining Date', 'md'),
        textColumn('daysRemaining', 'Days Left', 'sm'),
        textColumn('ragStatus', 'RAG Status', 'sm'),
      ]
    case 'sla_breach':
      return [
        textColumn('caseId', 'Case ID', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('committedTat', 'Committed TAT', 'md'),
        textColumn('actualDays', 'Actual/Current Days', 'md'),
        textColumn('breachDuration', 'Breach Duration', 'md'),
        textColumn('reason', 'Reason', 'xl'),
        textColumn('assignedExecutive', 'Assigned Executive', 'lg'),
        textColumn('vsLastWeek', 'vs Last Week Count', 'sm'),
      ]
    case 'blocked_applications':
      return [
        textColumn('caseId', 'Case ID', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('stageStuckAt', 'Stage Stuck At', 'md'),
        textColumn('hoursStuck', 'Hours Stuck', 'sm'),
        textColumn('reason', 'Reason', 'xl'),
        textColumn('assignedExecutive', 'Assigned Executive', 'lg'),
      ]
    case 'pipeline_by_stage':
      return [
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('draft', 'Draft', 'sm'),
        textColumn('docsPending', 'Docs Pending', 'sm'),
        textColumn('verification', 'Verification', 'sm'),
        textColumn('qc', 'QC', 'sm'),
        textColumn('submission', 'Submission', 'sm'),
        textColumn('issued', 'Issued', 'sm'),
        textColumn('collected', 'Collected', 'sm'),
        textColumn('dispatched', 'Dispatched', 'sm'),
        textColumn('bottleneckFlag', 'Bottleneck Flag', 'md'),
      ]
    case 'avg_tat_by_country':
      return [
        textColumn('country', 'Country', 'lg'),
        textColumn('meanTatDays', 'Mean TAT (Days)', 'md'),
        textColumn('slaCommitment', 'SLA Commitment', 'md'),
        textColumn('embassyBenchmark', 'Embassy Benchmark', 'md'),
        textColumn('fourWeekAvg', '4-Week Avg', 'md'),
        textColumn('varianceFlag', '>20% Variance Flag', 'md'),
      ]
    case 'passport_custody':
      return [
        textColumn('caseId', 'Case ID', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('passportStatus', 'Passport Status', 'md'),
        textColumn('daysInCustody', 'Days in Custody', 'sm'),
        textColumn('lastUpdate', 'Last Update', 'md'),
        textColumn('flag', 'Flag (>30 Days / No Update 2 Days)', 'lg'),
      ]
    case 'team_productivity':
      return [
        textColumn('teamMember', 'Team Member', 'lg'),
        textColumn('team', 'Team', 'md'),
        textColumn('applicationsProcessed', 'Applications Processed', 'md'),
        textColumn('benchmark', 'Benchmark (15/Day)', 'sm'),
        textColumn('utilization', 'Utilization (%)', 'sm'),
        textColumn('flag', 'Flag (<70% / >120%)', 'md'),
      ]

    // —— Sales ——
    case 'new_enquiries_received':
      return [
        textColumn('date', 'Date', 'md'),
        textColumn('channel', 'Channel (WhatsApp/Website/Referral/LinkedIn/Walk-in/BNI/Others)', 'xl'),
        textColumn('count', 'Count', 'sm'),
        textColumn('dailyAvg30', '30-Day Daily Avg', 'md'),
        textColumn('zeroEnquiryFlag', 'Zero-Enquiry Flag', 'md'),
      ]
    case 'enquiry_to_application_conversion':
      return [
        textColumn('channel', 'Channel', 'md'),
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('enquiries7d', 'Enquiries (7-Day)', 'sm'),
        textColumn('converted', 'Converted', 'sm'),
        textColumn('conversionRate7d', 'Conversion Rate (7-Day)', 'md'),
        textColumn('vs30DayRate', 'vs 30-Day Rate', 'md'),
      ]
    case 'marine_corporate_pipeline':
      return [
        textColumn('prospect', 'Prospect', 'lg'),
        textColumn('stage', 'Stage (Contacted/Discovery/Proposal/Pilot/Signed)', 'lg'),
        textColumn('value', 'Value', 'md'),
        textColumn('expectedClose', 'Expected Close Date', 'md'),
        textColumn('weightedForecast', 'Probability-Weighted Forecast', 'md'),
        textColumn('wowMovement', 'WoW Movement', 'sm'),
      ]
    case 'b2b_agent_signup_tracker':
      return [
        textColumn('agentName', 'Agent Name', 'lg'),
        textColumn('signupDate', 'Signup Date', 'md'),
        textColumn('status', 'Status (Active / Dormant)', 'md'),
        textColumn('applications30d', 'Applications (30 Days)', 'sm'),
        textColumn('firstApplicationDate', 'First Application Date', 'md'),
      ]
    case 'lost_opportunity_log':
      return [
        textColumn('enquiryDate', 'Enquiry Date', 'md'),
        textColumn('clientProspect', 'Client / Prospect', 'lg'),
        textColumn('reasonLost', 'Reason Lost (Price/Competitor/Changed Plans/No Response)', 'xl'),
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('channel', 'Channel', 'md'),
      ]
    case 'registered_agent_country_acquisition':
      return [
        textColumn('country', 'Country', 'lg'),
        textColumn('appsThisWeek', 'Applications This Week', 'sm'),
        textColumn('appsLastWeek', 'Applications Last Week', 'sm'),
        textColumn('totalMonthly', 'Total Monthly Applications', 'sm'),
      ]
    case 'sales_channel_performance':
      return [
        textColumn('channel', 'Channel', 'md'),
        textColumn('applicationsGenerated', 'Applications Generated', 'sm'),
        textColumn('revenueAttributed', 'Revenue Attributed', 'md'),
        textColumn('conversionRate', 'Conversion Rate', 'sm'),
        textColumn('trend', 'Trend (Growing / Declining)', 'md'),
      ]

    // —— Client ——
    case 'top_20_client_scorecard':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('applications', 'Applications (This Month vs Prior)', 'md'),
        textColumn('approvalRate', 'Approval Rate', 'sm'),
        textColumn('outstandingBalance', 'Outstanding Balance', 'md'),
        textColumn('lastContactDate', 'Last Contact Date', 'md'),
        textColumn('daysSinceLastTxn', 'Days Since Last Transaction', 'sm'),
        textColumn('healthScore', 'Health Score (RAG)', 'sm'),
      ]
    case 'high_risk_client_list':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('overdueBalance', 'Overdue Balance', 'md'),
        textColumn('daysSinceLastActivity', 'Days Since Last Activity', 'sm'),
        textColumn('recentRejection', 'Recent Rejection Not Followed Up', 'md'),
        textColumn('complaint30d', 'Complaint (30 Days)', 'sm'),
        textColumn('flagReason', 'Flag Reason', 'xl'),
      ]
    case 'dormant_client_reactivation':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('lastApplicationDate', 'Last Application Date', 'md'),
        textColumn('daysDormant', 'Days Dormant', 'sm'),
        textColumn('prior12mVolume', 'Prior 12-Month Volume', 'md'),
        textColumn('potentialValue', 'Potential Reactivation Value', 'md'),
      ]
    case 'client_ltv_margin_ranking':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('lifetimeGp', 'Lifetime Gross Profit', 'md'),
        textColumn('margin', 'Margin (%)', 'sm'),
        textColumn('avgAppsMonth', 'Avg Applications/Month', 'sm'),
        textColumn('tenure', 'Tenure', 'md'),
        textColumn('projectedAnnual', 'Projected Annual Value', 'md'),
      ]
    case 'wallet_share_analysis':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('estimatedPotential', 'Estimated Annual Spend Potential', 'md'),
        textColumn('actualSpend', 'Actual Annual Spend (GLTS)', 'md'),
        textColumn('walletShare', 'Wallet Share (%)', 'sm'),
        textColumn('walletGap', 'Wallet Share Gap (₹)', 'md'),
      ]

    // —— Embassy & Country ——
    case 'embassy_processing_time_tracker':
      return [
        textColumn('embassy', 'Embassy / Consulate', 'lg'),
        textColumn('currentAvg', 'Current Avg Processing Time', 'md'),
        textColumn('historical90d', '90-Day Historical Avg', 'md'),
        textColumn('variancePct', '% Variance', 'sm'),
        textColumn('flag', 'Flag (>30%)', 'sm'),
      ]
    case 'embassy_rejection_rate_by_country':
      return [
        textColumn('country', 'Country', 'md'),
        textColumn('rejectionThisWeek', 'Rejection Rate (This Week)', 'md'),
        textColumn('avg8Week', '8-Week Avg', 'sm'),
        textColumn('rejectedDocs', 'Rejected – Documents (GLTS)', 'md'),
        textColumn('rejectedMerit', 'Rejected – Merit', 'md'),
        textColumn('rejectedEmbassy', 'Rejected – Embassy', 'md'),
        textColumn('flag', 'Flag (>3% Increase)', 'md'),
      ]
    case 'registered_agent_countries_weekly':
      return [
        textColumn('country', 'Country', 'md'),
        textColumn('submitted', 'Submitted', 'sm'),
        textColumn('approved', 'Approved', 'sm'),
        textColumn('rejected', 'Rejected', 'sm'),
        textColumn('pending', 'Pending', 'sm'),
        textColumn('avgProcessing', 'Avg Processing Time', 'md'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('vsPriorWeek', 'vs Prior Week', 'sm'),
        textColumn('noticeFlag', 'Notice / Rule Change Flag', 'md'),
      ]
    case 'country_profitability_ranking':
      return [
        textColumn('country', 'Country', 'md'),
        textColumn('volume', 'Volume', 'sm'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('cost', 'Cost (Staff Time + Embassy Fee + Courier)', 'lg'),
        textColumn('grossMargin', 'Gross Margin (%)', 'sm'),
        textColumn('growRepriceFlag', 'Grow / Reprice Flag', 'md'),
      ]
    case 'embassy_rule_change_log':
      return [
        textColumn('date', 'Date', 'md'),
        textColumn('country', 'Country', 'md'),
        textColumn('changeType', 'Change Type (Rule/Fee/Document/Policy)', 'lg'),
        textColumn('description', 'Description', 'xl'),
        textColumn('actionTaken', 'Action Taken (Checklist/Client Notice/Pricing Update)', 'xl'),
      ]
    case 'vfs_commission_report':
      return [
        textColumn('status', 'Status', 'md'),
        textColumn('note', 'Note', 'xl'),
      ]

    // —— Quality ——
    case 'document_resubmission_rate':
      return [
        textColumn('dimension', 'Vertical / Executive / Client', 'lg'),
        textColumn('resubmissions', 'Applications with 2nd & 3rd Document Resubmissions', 'lg'),
        textColumn('pctOfTotal', '% of Total', 'sm'),
        textColumn('wowTrend', 'WoW Trend', 'sm'),
      ]
    case 'rejection_cause_analysis':
      return [
        textColumn('causeCategory', 'Cause Category (GLTS Error / Applicant Profile / Embassy Discretion)', 'xl'),
        textColumn('countThisWeek', 'Count This Week', 'sm'),
        textColumn('pctOfTotal', '% of Total', 'sm'),
        textColumn('vs4WeekAvg', 'vs 4-Week Avg', 'md'),
      ]
    case 'complaint_log_ncr':
      return [
        textColumn('complaintDate', 'Complaint Date', 'md'),
        textColumn('client', 'Client', 'lg'),
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('type', 'Type', 'md'),
        textColumn('resolutionTime', 'Resolution Time', 'md'),
        textColumn('outcome', 'Outcome', 'md'),
        textColumn('rootCauseAddressed', 'Root Cause Addressed (Y/N)', 'sm'),
        textColumn('repeatFlag', 'Repeat Flag', 'sm'),
      ]
    case 'sla_performance_trend':
      return [
        textColumn('month', 'Month', 'md'),
        textColumn('slaCompliance', 'SLA Compliance Rate', 'md'),
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('vsPriorMonth', 'vs Prior Month', 'sm'),
        textColumn('flagReason', 'Flag Reason (if Dropped)', 'xl'),
      ]
    case 'quality_to_revenue_correlation':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('repeatAppRate', 'Repeat Application Rate', 'md'),
        textColumn('ltvCac', 'LTV/CAC', 'md'),
        textColumn('correlationFlag', 'Correlation Flag', 'md'),
      ]
    case 'error_log':
      return [
        textColumn('errorId', 'Error ID', 'md'),
        textColumn('dateTime', 'Date/Time', 'md'),
        textColumn('roleTeam', 'Role/Team', 'md'),
        textColumn('caseId', 'Case ID', 'md'),
        textColumn('category', 'Category', 'md'),
        textColumn('severity', 'Severity', 'sm'),
        textColumn('clientFacing', 'Client-Facing?', 'sm'),
        textColumn('status', 'Status', 'sm'),
      ]
    default:
      return []
  }
}

export function buildSuperAdminReportRows(
  reportType: SuperAdminReportTypeId,
  data: SuperAdminDashboardData,
): SuperAdminReportPreviewRow[] {
  switch (reportType) {
    // —— Financial ——
    case 'revenue_vs_daily_target': {
      const today = data.revenueHero.today
      const mtd = data.revenueHero.mtd
      const ytd = data.revenueHero.ytd
      const mtdVal = parseCurrencyNumber(mtd.value)
      const ytdVal = parseCurrencyNumber(ytd.value)
      const mtdTarget = Math.round(mtdVal * 1.08)
      const annualTarget = Math.round(ytdVal * 1.35)
      return [
        {
          id: 'rvdt-1',
          todaysRevenue: String(today.value),
          mtdRevenue: String(mtd.value),
          mtdTarget: `₹${mtdTarget}L`,
          ytdRevenue: String(ytd.value),
          annualTarget: `₹${annualTarget}L`,
          ytdVsTarget: ytd.delta != null ? `${ytd.delta}%` : `${Math.round((ytdVal / annualTarget) * 100)}%`,
        },
      ]
    }

    case 'cash_position': {
      const asOf = formatDisplayDateTime(new Date())
      return [
        {
          id: 'cash-1',
          approxBalance: data.cashPosition.bankBalance,
          cashBlocked: data.cashPosition.blockedInVisaFees,
          refunds: '₹1.2L',
          actualCollections: data.cashPosition.expectedCollections,
          availableFunds: data.cashPosition.availableFunds,
          asOf,
        },
      ]
    }

    case 'collections_today_mtd': {
      const mtdVal = parseCurrencyNumber(data.collectionsHero.mtd.value)
      const mtdTarget = Math.round(mtdVal * 1.1) || 35
      return [
        {
          id: 'col-1',
          paymentsToday: String(data.collectionsHero.today.value),
          mtdCollections: String(data.collectionsHero.mtd.value),
          mtdTarget: `₹${mtdTarget}L`,
          topOverdueAccount:
            data.highRiskClients[0]?.primary ?? data.clientRows[0]?.client ?? '—',
          daysOverdue: String(data.collectionSummary.overdue ?? 45),
        },
      ]
    }

    case 'gross_margin_by_vertical':
      return data.segmentCards.map((card, index) => {
        const revenue = card.grossRevenueL
        const cost = parseCurrencyNumber(card.cost) || Math.round(revenue * 0.4)
        const gp = Math.round(revenue - cost)
        const margin = card.marginPercent || (revenue ? Math.round((gp / revenue) * 100) : 0)
        const vs = index % 3 === 0 ? '+4%' : index % 3 === 1 ? '-2%' : '+1%'
        return {
          id: `gmv-${card.id}`,
          vertical: card.label,
          revenueThisWeek: `₹${(revenue / 4).toFixed(1)}L`,
          directCost: `₹${cost}L`,
          grossProfit: `₹${gp}L`,
          grossMargin: `${margin}%`,
          vsLastWeek: vs,
          ragStatus: ragFromMargin(margin),
        }
      })

    case 'revenue_by_visa_country':
    case 'revenue_by_client_country': {
      const clients = data.clientRows
      const countries = data.countryDistribution
      const totalApps = clients.reduce((sum, c) => sum + c.applications, 0) || 1
      return clients.slice(0, 12).map((client, index) => {
        const country = countries[index % countries.length]
        const revenue = parseCurrencyNumber(client.revenue)
        return {
          id: `rvc-${client.id}`,
          country: country?.label ?? '—',
          client: client.client,
          applications: String(client.applications),
          revenueThisWeek: `₹${(revenue / 4).toFixed(1)}L`,
          margin: `${48 + (index % 5) * 3}%`,
          revenueMtd: client.revenue,
          targetedRevenueMtd: `₹${Math.round(revenue * 1.12)}L`,
          targetedYtdRevenue: `₹${Math.round(revenue * 4.8)}L`,
          pctOfTotal: `${Math.round((client.applications / totalApps) * 100)}%`,
        }
      })
    }

    case 'outstanding_receivables_ageing': {
      const reasons: Record<string, string> = {
        '0–30': 'Within credit terms',
        '31–45': 'Awaiting client confirmation',
        '46–60': 'Partial payment scheduled',
        '61–90': 'Dispute / documentation pending',
        '90+': 'Escalated — credit hold review',
      }
      return data.ageingBuckets.map((bucket, index) => {
        const label = AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id
        const clients =
          data.clientRows
            .slice(index, index + 3)
            .map((r) => r.client)
            .join(', ') || '—'
        return {
          id: `ora-${index}`,
          agingBucket: label,
          clients,
          totalOutstanding: `₹${(bucket.amount / 100000).toFixed(1)}L`,
          reasons: reasons[label] ?? 'Follow-up in progress',
        }
      })
    }

    case 'embassy_fee_working_capital':
      return data.countryDistribution.slice(0, 8).map((country, index) => {
        const cases = 4 + (index % 5) * 2
        const avgDays = 8 + (index % 6)
        const blocked = country.value * 0.22
        return {
          id: `efwc-${country.id}`,
          country: country.label,
          totalBlocked: `₹${blocked.toFixed(1)}L`,
          cases: String(cases),
          avgDaysBlocked: String(avgDays),
          actualPaymentReceived: `₹${(blocked * 0.7).toFixed(1)}L`,
          oldestCaseDays: String(avgDays + 6 + (index % 4)),
        }
      })

    case 'full_pl_vertical_breakdown':
      return data.segmentCards.map((card, index) => {
        const revenue = card.grossRevenueL
        const direct = Math.round(revenue * 0.42)
        const overhead = Math.round(revenue * 0.12)
        const ebitda = Math.round(revenue - direct - overhead)
        const variance = index % 2 === 0 ? 8 : 14
        return {
          id: `pl-${card.id}`,
          vertical: card.label,
          revenue: card.revenue,
          directCost: `₹${direct}L`,
          overheadAllocation: `₹${overhead}L`,
          ebitda: `₹${ebitda}L`,
          vsPriorMonth: card.growthLabel || (index % 2 === 0 ? '+3%' : '-1%'),
          vsMtdTarget: `${92 + (index % 5)}%`,
          vsYtdTarget: `${88 + (index % 6)}%`,
          varianceNote: variance > 10 ? `>${variance}% — review overhead & seasonality` : 'Within band',
        }
      })

    case 'revenue_forecast_per_country': {
      const base = parseCurrencyNumber(data.revenueHero.mtd.value)
      return [
        {
          id: 'rf-m',
          period: 'Monthly',
          conservative: `₹${Math.round(base * 0.9)}L`,
          base: `₹${base}L`,
          optimistic: `₹${Math.round(base * 1.12)}L`,
          basis: 'Pipeline',
        },
        {
          id: 'rf-q',
          period: 'Quarterly',
          conservative: `₹${Math.round(base * 2.6)}L`,
          base: `₹${Math.round(base * 3)}L`,
          optimistic: `₹${Math.round(base * 3.4)}L`,
          basis: 'Approval Rate',
        },
        {
          id: 'rf-y',
          period: 'Yearly',
          conservative: `₹${Math.round(parseCurrencyNumber(data.revenueHero.ytd.value) * 0.95)}L`,
          base: String(data.revenueHero.ytd.value),
          optimistic: `₹${Math.round(parseCurrencyNumber(data.revenueHero.ytd.value) * 1.18)}L`,
          basis: 'Seasonality',
        },
      ]
    }

    case 'client_wise_profitability':
      return data.clientRows.slice(0, 12).map((client, index) => {
        const revenue = parseCurrencyNumber(client.revenue)
        const cost = Math.round(revenue * (0.4 + (index % 4) * 0.03))
        const gp = Math.round(revenue - cost)
        const margin = revenue ? Math.round((gp / revenue) * 100) : 0
        const trend = index % 3 === 0 ? '↑ Improving' : index % 3 === 1 ? '→ Flat' : '↓ Softening'
        return {
          id: `cwp-${client.id}`,
          client: client.client,
          revenue: client.revenue,
          directCost: `₹${cost}L`,
          grossProfit: `₹${gp}L`,
          grossMargin: `${margin}%`,
          trendVsLastMonth: trend,
        }
      })

    case 'days_sales_outstanding': {
      const tiers = [
        ...data.segmentCards.map((s) => s.label),
        'Tier A clients',
        'Tier B clients',
      ]
      return tiers.slice(0, 6).map((label, index) => {
        const avgDays = data.financeKpis.dsoDays || 28 + (index % 5) * 7
        const target = 30 + (index % 3) * 15
        const delta = avgDays - target
        return {
          id: `dso-${index}`,
          verticalOrTier: label,
          avgDays: String(avgDays + (index % 4)),
          sixMonthTrend: index % 2 === 0 ? 'Improving' : 'Worsening',
          vsTarget: `${delta >= 0 ? '+' : ''}${delta} vs ${target} credit days`,
        }
      })
    }

    case 'daily_invoice_report':
      return data.clientRows.slice(0, 12).map((row, index) => {
        const invoiced = index % 3 !== 0
        return {
          id: `dir-${row.id}`,
          caseId: `GL-${1000 + index}`,
          client: row.client,
          invoiceStatus: invoiced ? 'Invoiced' : 'Not Invoiced',
          reason: invoiced ? '—' : 'Awaiting billing cycle / docs',
          daysSinceClosed: String(1 + (index % 8)),
        }
      })

    // —— Operational ——
    case 'daily_bulletin': {
      const ops = data.operationsToday
      return [
        {
          id: 'bul-1',
          category: 'Submissions',
          countToday: String(ops.submittedToday),
          detailFlag: ops.pendingEmbassy > 0 ? `${ops.pendingEmbassy} pending embassy` : 'On track',
          owner: 'Ops desk',
        },
        {
          id: 'bul-2',
          category: 'Collections',
          countToday: String(ops.collectedToday),
          detailFlag: 'Passports returned',
          owner: 'Ops desk',
        },
        {
          id: 'bul-3',
          category: 'Delays',
          countToday: String(ops.slaBreaches),
          detailFlag: ops.slaBreaches > 0 ? 'Requires attention' : 'None',
          owner: 'Ops desk',
        },
        {
          id: 'bul-4',
          category: 'Dispatch',
          countToday: String(Math.max(0, ops.collectedToday - 2)),
          detailFlag: 'Courier / hand delivery',
          owner: 'Ground Ops',
        },
      ]
    }

    case 'crew_change_risk':
      return data.pendingCrewVisas.slice(0, 15).map((item, index) => {
        const daysRemaining = Math.max(0, 14 - (index % 12))
        const rag = daysRemaining < 7 ? 'Red' : daysRemaining <= 10 ? 'Amber' : 'Green'
        const timeline = data.marineTimeline[index % Math.max(1, data.marineTimeline.length)]
        return {
          id: `crew-${item.id}`,
          vessel: item.primary,
          country: item.secondary?.split('·')[0]?.trim() ?? '—',
          seafarerName: item.secondary?.split('·')[1]?.trim() ?? item.primary,
          nationality: item.secondary?.split('·')[0]?.trim() ?? '—',
          visaType: 'C1/D',
          currentStatus: String(item.value ?? 'Pending'),
          joiningDate: timeline?.joiningDate ?? '—',
          daysRemaining: String(daysRemaining),
          ragStatus: rag,
        }
      })

    case 'sla_breach':
      return data.riskAlerts.slice(0, 12).map((alert, index) => {
        const committed = 5
        const actual = committed + 1 + (index % 4)
        return {
          id: `sla-${alert.id}`,
          caseId: `GL-SLA-${200 + index}`,
          client: alert.title,
          committedTat: `${committed} days`,
          actualDays: String(actual),
          breachDuration: `${actual - committed} day(s)`,
          reason: alert.description ?? 'Past committed TAT',
          assignedExecutive: data.staffLeaderboard[index % data.staffLeaderboard.length]?.primary ?? 'Ops desk',
          vsLastWeek: String(index % 3 === 0 ? '+2' : index % 3 === 1 ? '-1' : '0'),
        }
      })

    case 'blocked_applications':
      return data.pipelineStages
        .filter((stage) => stage.delayedCount > 0)
        .flatMap((stage, sIndex) => {
          const label =
            APPLICATION_PIPELINE_STAGE_LABELS[stage.id as ApplicationPipelineStageId] ?? stage.id
          return Array.from({ length: Math.min(3, stage.delayedCount) }, (_, i) => ({
            id: `blocked-${stage.id}-${i}`,
            caseId: `GL-BLK-${sIndex}${i}`,
            client: data.clientRows[(sIndex + i) % data.clientRows.length]?.client ?? '—',
            stageStuckAt: label,
            hoursStuck: String(stage.averageAgeHours || 12 + i * 4),
            reason: `Stuck beyond 12h at ${label}`,
            assignedExecutive:
              data.staffLeaderboard[(sIndex + i) % data.staffLeaderboard.length]?.primary ?? 'Unassigned',
          }))
        })
        .slice(0, 20)

    case 'pipeline_by_stage': {
      const countById = (id: string) => data.pipelineStages.find((s) => s.id === id)?.count ?? 0
      return data.segmentCards.map((card, index) => {
        const factor = 0.2 + (index % 4) * 0.05
        const draft = Math.round(countById('draft') * factor)
        const docsPending = Math.round(countById('online_submission_pending') * factor * 0.6)
        const verification = Math.round(countById('verification_pending') * factor)
        const qc = Math.round(countById('pending_payment') * factor * 0.5)
        const submission = Math.round(countById('vfs_submission_pending') * factor)
        const issued = Math.round(countById('collection_pending') * factor * 0.4)
        const collected = Math.round(countById('collected') * factor)
        const dispatched = Math.round(countById('dispatched') * factor)
        const peak = Math.max(
          draft,
          docsPending,
          verification,
          qc,
          submission,
          issued,
          collected,
          dispatched,
        )
        const bottleneck =
          peak === 0
            ? 'None'
            : peak === verification
              ? 'Verification'
              : peak === docsPending
                ? 'Docs Pending'
                : peak === qc
                  ? 'QC'
                  : peak === submission
                    ? 'Submission'
                    : peak === issued
                      ? 'Issued'
                      : 'None'
        return {
          id: `pipe-${card.id}`,
          vertical: card.label,
          draft: String(draft),
          docsPending: String(docsPending),
          verification: String(verification),
          qc: String(qc),
          submission: String(submission),
          issued: String(issued),
          collected: String(collected),
          dispatched: String(dispatched),
          bottleneckFlag: bottleneck,
        }
      })
    }

    case 'avg_tat_by_country':
      return data.processingTimeByCountry.slice(0, 12).map((point, index) => {
        const meanTat = point.value
        const slaCommitment = 5
        const embassyBenchmark = slaCommitment + 2
        const fourWeekAvg = meanTat * (0.9 + (index % 5) * 0.05)
        const variancePct = fourWeekAvg ? ((meanTat - fourWeekAvg) / fourWeekAvg) * 100 : 0
        return {
          id: `tat-${point.id}`,
          country: point.label,
          meanTatDays: String(meanTat),
          slaCommitment: `${slaCommitment} days`,
          embassyBenchmark: `${embassyBenchmark} days`,
          fourWeekAvg: fourWeekAvg.toFixed(1),
          varianceFlag: Math.abs(variancePct) > 20 ? 'Yes' : 'No',
        }
      })

    case 'passport_custody':
      return data.passportJourney.stages.map((stage, index) => {
        const days = 3 + (index % 10) * 4
        const noUpdate = index % 4 === 0
        const flagParts: string[] = []
        if (days > 30) flagParts.push('>30 Days')
        if (noUpdate) flagParts.push('No Update 2 Days')
        return {
          id: `custody-${index}`,
          caseId: `GL-PP-${300 + index}`,
          client: data.clientRows[index % data.clientRows.length]?.client ?? '—',
          passportStatus: stage.status,
          daysInCustody: String(days),
          lastUpdate: noUpdate ? '2+ days ago' : stage.detail ?? data.passportJourney.eta ?? 'Today',
          flag: flagParts.length > 0 ? flagParts.join(' / ') : 'OK',
        }
      })

    case 'team_productivity': {
      const benchmark = 15
      const fromCapacity = data.teamCapacity.map((row, index) => {
        const processed = row.completedToday
        const utilization = Math.round((processed / benchmark) * 100)
        return {
          id: `prod-${row.id}`,
          teamMember: data.staffLeaderboard[index]?.primary ?? row.department,
          team: row.department,
          applicationsProcessed: String(processed),
          benchmark: String(benchmark),
          utilization: `${utilization}%`,
          flag: utilizationFlag(utilization),
        }
      })
      if (fromCapacity.length > 0) return fromCapacity
      return data.staffLeaderboard.slice(0, 8).map((item, index) => {
        const processed = Number(item.value) || 8 + (index % 6)
        const utilization = Math.round((processed / benchmark) * 100)
        return {
          id: `prod-staff-${item.id}`,
          teamMember: item.primary,
          team: item.secondary ?? 'Ops',
          applicationsProcessed: String(processed),
          benchmark: String(benchmark),
          utilization: `${utilization}%`,
          flag: utilizationFlag(utilization),
        }
      })
    }

    // —— Sales ——
    case 'new_enquiries_received': {
      const channels = ['WhatsApp', 'Website', 'Referral', 'LinkedIn', 'Walk-in', 'BNI', 'Others']
      const todayLabel = formatDisplayDate(new Date())
      return channels.map((channel, index) => {
        const count = index === 6 ? 0 : 2 + (index % 5)
        return {
          id: `enq-${index}`,
          date: todayLabel,
          channel,
          count: String(count),
          dailyAvg30: (1.5 + index * 0.3).toFixed(1),
          zeroEnquiryFlag: count === 0 ? 'Yes' : 'No',
        }
      })
    }

    case 'enquiry_to_application_conversion': {
      const channels = ['WhatsApp', 'Website', 'Referral', 'LinkedIn']
      const verticals = data.segmentCards.map((c) => c.label)
      return channels.map((channel, index) => {
        const enquiries = 12 + index * 3
        const converted = Math.round(enquiries * (0.2 + index * 0.05))
        const rate7 = Math.round((converted / enquiries) * 100)
        const rate30 = rate7 - 2 + (index % 3)
        return {
          id: `conv-${index}`,
          channel,
          vertical: verticals[index % verticals.length] ?? 'Retail',
          enquiries7d: String(enquiries),
          converted: String(converted),
          conversionRate7d: `${rate7}%`,
          vs30DayRate: `${rate7 - rate30 >= 0 ? '+' : ''}${rate7 - rate30}pp`,
        }
      })
    }

    case 'marine_corporate_pipeline': {
      const stages = ['Contacted', 'Discovery', 'Proposal', 'Pilot', 'Signed'] as const
      const prospects = [
        ...data.topMarineClients.slice(0, 4),
        ...data.corporatePreview.topClients.slice(0, 4),
      ]
      return prospects.map((item, index) => {
        const value = 8 + index * 3.5
        const prob = [0.2, 0.35, 0.5, 0.7, 0.9][index % 5]
        return {
          id: `pipe-sales-${item.id}`,
          prospect: item.primary,
          stage: stages[index % stages.length],
          value: `₹${value.toFixed(1)}L`,
          expectedClose: formatDisplayDate(addDays(new Date(), 14 + index * 7)),
          weightedForecast: `₹${(value * prob).toFixed(1)}L`,
          wowMovement: index % 3 === 0 ? '+1 stage' : index % 3 === 1 ? 'Flat' : '-Value',
        }
      })
    }

    case 'b2b_agent_signup_tracker':
      return (data.b2bPreview.topClients.length > 0
        ? data.b2bPreview.topClients
        : data.clientRows.filter((c) => c.segment.toLowerCase().includes('b2b')).slice(0, 8)
      )
        .slice(0, 8)
        .map((item, index) => {
          const primary = 'primary' in item ? item.primary : item.client
          const apps = 'applications' in item ? item.applications : Number(item.value) || 2 + index
          const dormant = apps === 0 || index % 4 === 3
          return {
            id: `b2b-${item.id}`,
            agentName: primary,
            signupDate: formatDisplayDate(addDays(new Date(), -(30 + index * 10))),
            status: dormant ? 'Dormant' : 'Active',
            applications30d: String(apps),
            firstApplicationDate: dormant
              ? '—'
              : formatDisplayDate(addDays(new Date(), -(20 + index * 5))),
          }
        })

    case 'lost_opportunity_log': {
      const reasons = ['Price', 'Competitor', 'Changed Plans', 'No Response'] as const
      const channels = ['WhatsApp', 'Website', 'Referral', 'LinkedIn']
      return data.dormantClients.slice(0, 8).map((item, index) => ({
        id: `lost-${item.id}`,
        enquiryDate: formatDisplayDate(addDays(new Date(), -(7 + index * 3))),
        clientProspect: item.primary,
        reasonLost: reasons[index % reasons.length],
        vertical: data.segmentCards[index % data.segmentCards.length]?.label ?? 'Retail',
        channel: channels[index % channels.length],
      }))
    }

    case 'registered_agent_country_acquisition':
      return data.countryDistribution.slice(0, 10).map((country, index) => {
        const thisWeek = Math.round(country.value / 4) + (index % 3)
        const lastWeek = thisWeek - 1 + (index % 2)
        return {
          id: `ra-${country.id}`,
          country: country.label,
          appsThisWeek: String(thisWeek),
          appsLastWeek: String(Math.max(0, lastWeek)),
          totalMonthly: String(thisWeek * 4 + lastWeek),
        }
      })

    case 'sales_channel_performance': {
      const channels = ['WhatsApp', 'Website', 'Referral', 'LinkedIn', 'Walk-in', 'BNI']
      return channels.map((channel, index) => {
        const apps = 10 + index * 4
        const revenue = apps * (1.2 + index * 0.3)
        const conversion = 18 + index * 3
        return {
          id: `sch-${index}`,
          channel,
          applicationsGenerated: String(apps),
          revenueAttributed: `₹${revenue.toFixed(1)}L`,
          conversionRate: `${conversion}%`,
          trend: index % 2 === 0 ? 'Growing' : 'Declining',
        }
      })
    }

    // —— Client ——
    case 'top_20_client_scorecard':
      return data.clientRows.slice(0, 20).map((row, index) => {
        const health =
          data.clientHealth.find((h) => h.primary === row.client)?.tone ??
          (index % 3 === 0 ? 'positive' : index % 3 === 1 ? 'warning' : 'negative')
        const rag = health === 'positive' ? 'Green' : health === 'warning' ? 'Amber' : 'Red'
        return {
          id: `score-${row.id}`,
          client: row.client,
          applications: `${row.applications} vs ${Math.max(0, row.applications - 2 - (index % 3))}`,
          approvalRate: data.executiveSummary.approvalRate.value,
          outstandingBalance: row.outstanding,
          lastContactDate: formatDisplayDate(addDays(new Date(), -(index % 12))),
          daysSinceLastTxn: String(3 + (index % 20)),
          healthScore: rag,
        }
      })

    case 'high_risk_client_list':
      return data.highRiskClients.slice(0, 12).map((item, index) => ({
        id: `risk-${item.id}`,
        client: item.primary,
        overdueBalance: String(item.value ?? data.clientRows[index]?.outstanding ?? '—'),
        daysSinceLastActivity: String(20 + index * 5),
        recentRejection: index % 2 === 0 ? 'Yes' : 'No',
        complaint30d: String(index % 3),
        flagReason: item.secondary ?? 'Overdue + inactivity',
      }))

    case 'dormant_client_reactivation':
      return data.dormantClients.slice(0, 12).map((item, index) => ({
        id: `dorm-${item.id}`,
        client: item.primary,
        lastApplicationDate: formatDisplayDate(addDays(new Date(), -(60 + index * 15))),
        daysDormant: String(60 + index * 15),
        prior12mVolume: String(item.value ?? 12 + index * 2),
        potentialValue: `₹${(8 + index * 1.5).toFixed(1)}L`,
      }))

    case 'client_ltv_margin_ranking': {
      const ranked = [
        ...data.highMarginClients,
        ...data.topRevenueClients.filter(
          (t) => !data.highMarginClients.some((h) => h.id === t.id),
        ),
      ]
      return ranked.slice(0, 15).map((item, index) => {
        const gp = parseCurrencyNumber(String(item.value ?? 20 + index * 3))
        return {
          id: `ltv-${item.id}`,
          client: item.primary,
          lifetimeGp: `₹${gp}L`,
          margin: `${50 + (index % 8)}%`,
          avgAppsMonth: String(4 + (index % 6)),
          tenure: `${1 + (index % 5)} yr`,
          projectedAnnual: `₹${Math.round(gp * 0.4)}L`,
        }
      })
    }

    case 'wallet_share_analysis':
      return data.clientRows.slice(0, 12).map((row, index) => {
        const actual = parseCurrencyNumber(row.revenue) * 12
        const potential = Math.round(actual * (1.4 + (index % 4) * 0.15))
        const share = potential ? Math.round((actual / potential) * 100) : 0
        const gap = Math.max(0, potential - actual)
        return {
          id: `wallet-${row.id}`,
          client: row.client,
          estimatedPotential: `₹${potential}L`,
          actualSpend: `₹${actual}L`,
          walletShare: `${share}%`,
          walletGap: `₹${gap}L`,
        }
      })

    // —— Embassy & Country ——
    case 'embassy_processing_time_tracker':
      return data.processingTimeByCountry.slice(0, 10).map((point, index) => {
        const current = point.value
        const hist = current * (0.85 + (index % 4) * 0.05)
        const variance = hist ? Math.round(((current - hist) / hist) * 100) : 0
        return {
          id: `ept-${point.id}`,
          embassy: `${point.label} Mission`,
          currentAvg: `${current} days`,
          historical90d: `${hist.toFixed(1)} days`,
          variancePct: `${variance}%`,
          flag: Math.abs(variance) > 30 ? 'Yes' : 'No',
        }
      })

    case 'embassy_rejection_rate_by_country':
      return data.countryDistribution.slice(0, 10).map((country, index) => {
        const thisWeek = 2 + (index % 5) * 0.8
        const avg8 = thisWeek - 0.5 + (index % 3) * 0.2
        const increase = thisWeek - avg8
        return {
          id: `err-${country.id}`,
          country: country.label,
          rejectionThisWeek: `${thisWeek.toFixed(1)}%`,
          avg8Week: `${avg8.toFixed(1)}%`,
          rejectedDocs: String(1 + (index % 3)),
          rejectedMerit: String(index % 2),
          rejectedEmbassy: String(index % 4 === 0 ? 1 : 0),
          flag: increase > 3 ? 'Yes' : 'No',
        }
      })

    case 'registered_agent_countries_weekly':
      return data.countryDistribution.slice(0, 10).map((country, index) => {
        const submitted = Math.round(country.value) + 5
        const approved = Math.round(submitted * 0.7)
        const rejected = Math.round(submitted * 0.08)
        const pending = submitted - approved - rejected
        return {
          id: `racw-${country.id}`,
          country: country.label,
          submitted: String(submitted),
          approved: String(approved),
          rejected: String(rejected),
          pending: String(Math.max(0, pending)),
          avgProcessing: `${10 + (index % 6)} days`,
          revenue: `₹${(country.value * 1.2).toFixed(1)}L`,
          vsPriorWeek: index % 2 === 0 ? '+8%' : '-3%',
          noticeFlag: index % 5 === 0 ? 'Yes' : 'No',
        }
      })

    case 'country_profitability_ranking':
      return data.countryDistribution.slice(0, 12).map((country, index) => {
        const volume = Math.round(country.value * 3) + 10
        const revenue = country.value * 2.5
        const cost = revenue * (0.45 + (index % 4) * 0.03)
        const margin = revenue ? Math.round(((revenue - cost) / revenue) * 100) : 0
        return {
          id: `cpr-${country.id}`,
          country: country.label,
          volume: String(volume),
          revenue: `₹${revenue.toFixed(1)}L`,
          cost: `₹${cost.toFixed(1)}L`,
          grossMargin: `${margin}%`,
          growRepriceFlag: margin >= 50 ? 'Grow' : margin >= 35 ? 'Monitor' : 'Reprice',
        }
      })

    case 'embassy_rule_change_log': {
      const types = ['Rule', 'Fee', 'Document', 'Policy'] as const
      const actions = ['Checklist', 'Client Notice', 'Pricing Update'] as const
      return data.countryDistribution.slice(0, 6).map((country, index) => ({
        id: `rule-${country.id}`,
        date: formatDisplayDate(addDays(new Date(), -(index * 5 + 2))),
        country: country.label,
        changeType: types[index % types.length],
        description: `${types[index % types.length]} update for ${country.label} processing`,
        actionTaken: actions[index % actions.length],
      }))
    }

    case 'vfs_commission_report':
      return [
        {
          id: 'vfs-1',
          status: 'To be defined',
          note: 'VFS commission report structure pending product definition.',
        },
      ]

    // —— Quality ——
    case 'document_resubmission_rate': {
      const dims = [
        ...data.segmentCards.map((c) => c.label),
        ...data.staffLeaderboard.slice(0, 3).map((s) => s.primary),
        ...data.clientRows.slice(0, 3).map((c) => c.client),
      ]
      return dims.slice(0, 10).map((dimension, index) => {
        const count = 2 + (index % 5)
        const pct = 4 + index
        return {
          id: `resub-${index}`,
          dimension,
          resubmissions: String(count),
          pctOfTotal: `${pct}%`,
          wowTrend: index % 2 === 0 ? '+1%' : '-0.5%',
        }
      })
    }

    case 'rejection_cause_analysis': {
      const causes = ['GLTS Error', 'Applicant Profile', 'Embassy Discretion'] as const
      const total = data.operationsToday.rejectedToday || 12
      return causes.map((cause, index) => {
        const count = Math.round(total * [0.25, 0.4, 0.35][index])
        return {
          id: `rej-${index}`,
          causeCategory: cause,
          countThisWeek: String(count),
          pctOfTotal: `${Math.round((count / (total || 1)) * 100)}%`,
          vs4WeekAvg: index === 0 ? '+2' : index === 1 ? '-1' : '0',
        }
      })
    }

    case 'complaint_log_ncr':
      return data.managementAlerts.slice(0, 8).map((alert, index) => ({
        id: `ncr-${alert.id}`,
        complaintDate: formatDisplayDate(addDays(new Date(), -(index * 4))),
        client: data.clientRows[index % data.clientRows.length]?.client ?? alert.title,
        vertical: data.segmentCards[index % data.segmentCards.length]?.label ?? '—',
        type: alert.title,
        resolutionTime: `${1 + (index % 5)} days`,
        outcome: index % 2 === 0 ? 'Resolved' : 'Open',
        rootCauseAddressed: index % 3 === 0 ? 'N' : 'Y',
        repeatFlag: index % 4 === 0 ? 'Y' : 'N',
      }))

    case 'sla_performance_trend': {
      const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
      return months.flatMap((month, mIndex) =>
        data.segmentCards.map((card, cIndex) => {
          const rate = 88 + ((mIndex + cIndex) % 8)
          const prior = rate - (mIndex % 3 === 0 ? 3 : -1)
          const dropped = rate < prior
          return {
            id: `sla-trend-${month}-${card.id}`,
            month,
            slaCompliance: `${rate}%`,
            vertical: card.label,
            vsPriorMonth: `${rate - prior >= 0 ? '+' : ''}${rate - prior}pp`,
            flagReason: dropped ? 'Capacity / embassy delay' : '—',
          }
        }),
      )
    }

    case 'quality_to_revenue_correlation':
      return data.clientRows.slice(0, 10).map((row, index) => {
        const repeat = 20 + (index % 40)
        const ltvCac = (2.5 + index * 0.3).toFixed(1)
        return {
          id: `qtr-${row.id}`,
          client: row.client,
          repeatAppRate: `${repeat}%`,
          ltvCac: String(ltvCac),
          correlationFlag: repeat > 40 && Number(ltvCac) > 3 ? 'Strong' : 'Watch',
        }
      })

    case 'error_log':
      return data.recentActivity.slice(0, 12).map((item, index) => ({
        id: `errlog-${item.id ?? index}`,
        errorId: `ERR-${1000 + index}`,
        dateTime: item.secondary ?? '—',
        roleTeam: data.staffLeaderboard[index % data.staffLeaderboard.length]?.secondary ?? 'Ops',
        caseId: `GL-${500 + index}`,
        category: item.badgeLabel ?? 'Process',
        severity: index % 3 === 0 ? 'High' : index % 3 === 1 ? 'Medium' : 'Low',
        clientFacing: index % 2 === 0 ? 'Y' : 'N',
        status: index % 4 === 0 ? 'Open' : 'Closed',
      }))

    default:
      return []
  }
}

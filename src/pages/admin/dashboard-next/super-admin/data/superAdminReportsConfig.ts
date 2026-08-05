import type { Column } from '@/design-system/UIComponents'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import {
  PASSPORT_JOURNEY_STAGE_LABELS,
  type PassportJourneyStageId,
} from '../../shared/config/passportJourney'
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
  // Financial (from accounts)
  | 'cash_position'
  | 'collections_today_mtd'
  | 'outstanding_receivables_ageing'
  | 'full_pl_vertical_breakdown'
  | 'revenue_forecast'
  | 'days_sales_outstanding'
  | 'gross_margin_by_vertical'
  | 'weekly_gross_profit_flash'
  // Operational (from ops)
  | 'daily_bulletin'
  | 'crew_change_risk'
  | 'pipeline_by_stage'
  | 'passport_custody'
  | 'avg_tat_by_country'
  // Sales (from accounts analytics)
  | 'revenue'
  | 'revenue_vs_targets'
  | 'visa_count'
  | 'revenue_by_segment'
  | 'top_client_revenue'
  | 'top_country_revenue'
  // Client (from accounts)
  | 'client_wise_profitability'
  | 'ageing'
  | 'collections'
  | 'follow_ups'
  // Embassy & Country
  | 'revenue_by_visa_country'
  | 'revenue_by_client_country'
  | 'embassy_fee_working_capital'
  // Quality (from ops)
  | 'sla_breach'
  | 'blocked_applications'
  | 'team_productivity'

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
    id: 'outstanding_receivables_ageing',
    label: 'Outstanding Receivables Ageing',
    category: 'Financial Reports',
    source: 'Finance — AR ageing buckets across the network.',
  },
  {
    id: 'full_pl_vertical_breakdown',
    label: 'Full P&L – 4 Vertical Breakdown (Monthly)',
    category: 'Financial Reports',
    source: 'Finance — revenue, cost, and margin by vertical.',
  },
  {
    id: 'revenue_forecast',
    label: 'Revenue Forecast',
    category: 'Financial Reports',
    source: 'Finance — monthly / quarterly revenue outlook.',
  },
  {
    id: 'days_sales_outstanding',
    label: 'Days Sales Outstanding (DSO)',
    category: 'Financial Reports',
    source: 'Finance — DSO from outstanding receivables and revenue run-rate.',
  },
  {
    id: 'gross_margin_by_vertical',
    label: 'Gross Margin by Vertical',
    category: 'Financial Reports',
    source: 'Finance — GP% by Marine / Corporate / Retail / B2B.',
  },
  {
    id: 'weekly_gross_profit_flash',
    label: 'Weekly Gross Profit Flash',
    category: 'Financial Reports',
    source: 'Finance — weekly revenue booked vs direct costs.',
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
    source: 'Ops — marine cases nearing sign-on dates.',
  },
  {
    id: 'pipeline_by_stage',
    label: 'Pipeline by Stage / Vertical',
    category: 'Operational Reports',
    source: 'Ops — case stage aggregation week-on-week.',
  },
  {
    id: 'passport_custody',
    label: 'Passport Custody Log',
    category: 'Operational Reports',
    source: 'Ops — custody status movements.',
  },
  {
    id: 'avg_tat_by_country',
    label: 'Average Turnaround Time by Country',
    category: 'Operational Reports',
    source: 'Ops — application-received to visa-issued timestamps.',
  },
  // Sales
  {
    id: 'revenue',
    label: 'Revenue Report',
    category: 'Sales Reports',
    source: 'Finance analytics — revenue by period and vertical.',
  },
  {
    id: 'revenue_vs_targets',
    label: 'Revenue vs Targets',
    category: 'Sales Reports',
    source: 'Finance analytics — MTD / YTD vs target.',
  },
  {
    id: 'visa_count',
    label: 'Visa Count Report',
    category: 'Sales Reports',
    source: 'Finance analytics — visa volumes by type.',
  },
  {
    id: 'revenue_by_segment',
    label: 'Revenue by Segment',
    category: 'Sales Reports',
    source: 'Finance analytics — share by vertical.',
  },
  {
    id: 'top_client_revenue',
    label: 'Top 10 Client-wise Revenue',
    category: 'Sales Reports',
    source: 'Finance analytics — top clients by revenue.',
  },
  {
    id: 'top_country_revenue',
    label: 'Top 10 Country-wise Revenue',
    category: 'Sales Reports',
    source: 'Finance analytics — top destinations by revenue.',
  },
  // Client
  {
    id: 'client_wise_profitability',
    label: 'Client-Wise Profitability',
    category: 'Client Reports',
    source: 'Finance — revenue, collections, and outstanding by client.',
  },
  {
    id: 'ageing',
    label: 'Client Ageing Report',
    category: 'Client Reports',
    source: 'Finance — client AR ageing.',
  },
  {
    id: 'collections',
    label: 'Collections Report',
    category: 'Client Reports',
    source: 'Finance — collections vs outstanding by client.',
  },
  {
    id: 'follow_ups',
    label: 'Daily Follow-ups Report',
    category: 'Client Reports',
    source: 'Finance — credit-control follow-ups.',
  },
  // Embassy & Country
  {
    id: 'revenue_by_visa_country',
    label: 'Revenue by Visa Country',
    category: 'Embassy & Country Reports',
    source: 'Finance — revenue by destination country.',
  },
  {
    id: 'revenue_by_client_country',
    label: 'Revenue by Client and Country',
    category: 'Embassy & Country Reports',
    source: 'Finance — client × country revenue mix.',
  },
  {
    id: 'embassy_fee_working_capital',
    label: 'Embassy Fee Working Capital',
    category: 'Embassy & Country Reports',
    source: 'Finance — cash blocked in embassy / VFS fees.',
  },
  // Quality
  {
    id: 'sla_breach',
    label: 'SLA Breach Report',
    category: 'Quality Reports',
    source: 'Ops — cases past committed TAT.',
  },
  {
    id: 'blocked_applications',
    label: 'Blocked Applications',
    category: 'Quality Reports',
    source: 'Ops — stage stuck beyond 12 hours.',
  },
  {
    id: 'team_productivity',
    label: 'Team Productivity vs Capacity',
    category: 'Quality Reports',
    source: 'Ops — processed vs capacity benchmark.',
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

function formatDisplayDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
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

export function getSuperAdminReportColumns(
  reportType: SuperAdminReportTypeId,
): Column<SuperAdminReportPreviewRow>[] {
  switch (reportType) {
    case 'cash_position':
      return [
        textColumn('bankBalance', 'Bank Balance', 'md'),
        textColumn('blockedInVisaFees', 'Cash Blocked (Embassy/VFS)', 'lg'),
        textColumn('expectedCollections', 'Expected Collections', 'md'),
        textColumn('availableFunds', 'Available Funds', 'md'),
      ]
    case 'collections_today_mtd':
      return [
        textColumn('outstanding', 'Outstanding', 'md'),
        textColumn('collected', 'Collected', 'md'),
        textColumn('overdue', 'Overdue', 'md'),
        textColumn('collectionRate', 'Collection Rate %', 'sm'),
      ]
    case 'outstanding_receivables_ageing':
    case 'ageing':
      return [
        textColumn('bucket', 'Ageing Bucket', 'md'),
        textColumn('amount', 'Amount', 'md'),
        textColumn('count', 'Invoice Count', 'sm'),
      ]
    case 'full_pl_vertical_breakdown':
    case 'gross_margin_by_vertical':
      return [
        textColumn('vertical', 'Vertical', 'md'),
        textColumn('detail', 'Revenue · Cost', 'lg'),
        textColumn('grossMargin', 'Gross Margin %', 'sm'),
        textColumn('status', 'Status', 'sm'),
      ]
    case 'revenue_forecast':
    case 'revenue':
      return [
        textColumn('period', 'Period', 'md'),
        textColumn('revenue', 'Revenue (₹Cr)', 'md'),
        textColumn('collected', 'Collected (₹Cr)', 'md'),
      ]
    case 'days_sales_outstanding':
      return [
        textColumn('metric', 'Metric', 'lg'),
        textColumn('value', 'Value', 'md'),
        textColumn('note', 'Note', 'xl'),
      ]
    case 'weekly_gross_profit_flash':
      return [
        textColumn('metric', 'Metric', 'lg'),
        textColumn('value', 'Value', 'md'),
      ]
    case 'daily_bulletin':
      return [
        textColumn('metric', 'Signal', 'lg'),
        textColumn('value', 'Count', 'sm'),
        textColumn('note', 'Detail', 'xl'),
      ]
    case 'crew_change_risk':
      return [
        textColumn('vessel', 'Vessel / Crew', 'lg'),
        textColumn('status', 'Status', 'md'),
        textColumn('signOn', 'Sign-on', 'md'),
        textColumn('progress', 'Progress %', 'sm'),
      ]
    case 'pipeline_by_stage':
      return [
        textColumn('stage', 'Stage', 'lg'),
        textColumn('count', 'Count', 'sm'),
        textColumn('delayed', 'Delayed', 'sm'),
        textColumn('sla', 'SLA %', 'sm'),
      ]
    case 'passport_custody':
      return [
        textColumn('stage', 'Journey Stage', 'lg'),
        textColumn('status', 'Status', 'md'),
        textColumn('eta', 'ETA', 'md'),
      ]
    case 'avg_tat_by_country':
      return [
        textColumn('country', 'Country', 'lg'),
        textColumn('meanTatDays', 'Mean TAT (Days)', 'md'),
      ]
    case 'revenue_vs_targets':
      return [
        textColumn('period', 'Period', 'md'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('target', 'Target label', 'lg'),
        textColumn('delta', 'Delta', 'sm'),
      ]
    case 'visa_count':
      return [
        textColumn('visaType', 'Visa Type', 'md'),
        textColumn('share', 'Share %', 'sm'),
      ]
    case 'revenue_by_segment':
      return [
        textColumn('segment', 'Segment', 'md'),
        textColumn('share', 'Share %', 'sm'),
      ]
    case 'top_client_revenue':
    case 'client_wise_profitability':
    case 'collections':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('segment', 'Segment', 'md'),
        textColumn('revenue', 'Revenue', 'md'),
        textColumn('collections', 'Collections', 'md'),
        textColumn('outstanding', 'Outstanding', 'md'),
        textColumn('status', 'Status', 'sm'),
      ]
    case 'top_country_revenue':
    case 'revenue_by_visa_country':
    case 'revenue_by_client_country':
      return [
        textColumn('country', 'Country', 'lg'),
        textColumn('share', 'Share %', 'sm'),
      ]
    case 'follow_ups':
      return [
        textColumn('client', 'Client', 'lg'),
        textColumn('detail', 'Follow-up', 'xl'),
        textColumn('status', 'Status', 'sm'),
      ]
    case 'embassy_fee_working_capital':
      return [
        textColumn('metric', 'Metric', 'lg'),
        textColumn('value', 'Value', 'md'),
        textColumn('note', 'Note', 'xl'),
      ]
    case 'sla_breach':
      return [
        textColumn('area', 'Area', 'lg'),
        textColumn('value', 'SLA %', 'sm'),
        textColumn('target', 'Target', 'md'),
      ]
    case 'blocked_applications':
      return [
        textColumn('stage', 'Stage Stuck At', 'lg'),
        textColumn('count', 'Open', 'sm'),
        textColumn('delayed', 'Delayed', 'sm'),
        textColumn('avgAge', 'Avg Age (h)', 'sm'),
      ]
    case 'team_productivity':
      return [
        textColumn('team', 'Team', 'lg'),
        textColumn('open', 'Open Cases', 'sm'),
        textColumn('done', 'Completed Today', 'sm'),
        textColumn('capacity', 'Capacity', 'sm'),
        textColumn('sla', 'SLA %', 'sm'),
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
    case 'cash_position':
      return [
        {
          id: 'cash-1',
          bankBalance: data.cashPosition.bankBalance,
          blockedInVisaFees: data.cashPosition.blockedInVisaFees,
          expectedCollections: data.cashPosition.expectedCollections,
          availableFunds: data.cashPosition.availableFunds,
        },
      ]
    case 'collections_today_mtd':
      return [
        {
          id: 'col-1',
          outstanding: String(data.collectionSummary.outstanding),
          collected: String(data.collectionSummary.collected),
          overdue: String(data.collectionSummary.overdue),
          collectionRate: String(data.collectionSummary.collectionRate),
        },
      ]
    case 'outstanding_receivables_ageing':
    case 'ageing':
      return data.ageingBuckets.map((bucket) => ({
        id: `age-${bucket.id}`,
        bucket: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
        amount: `₹${(bucket.amount / 10000000).toFixed(2)}Cr`,
        count: String(bucket.count ?? 0),
      }))
    case 'full_pl_vertical_breakdown':
    case 'gross_margin_by_vertical':
      return data.marginByVertical.map((item) => ({
        id: item.id,
        vertical: item.primary,
        detail: item.secondary ?? '—',
        grossMargin: String(item.value ?? '—'),
        status: item.tone === 'positive' ? 'Green' : item.tone === 'warning' ? 'Amber' : 'Neutral',
      }))
    case 'revenue_forecast':
    case 'revenue':
      return data.revenueTrend.map((point, index) => ({
        id: `rev-${index}`,
        period: point.label,
        revenue: String(point.value),
        collected: String(point.secondary ?? 0),
      }))
    case 'days_sales_outstanding':
      return [
        {
          id: 'dso-1',
          metric: 'Outstanding receivables',
          value: String(data.collectionSummary.outstanding),
          note: `Collection rate ${data.collectionSummary.collectionRate}%`,
        },
        {
          id: 'dso-2',
          metric: 'Overdue',
          value: String(data.collectionSummary.overdue),
          note: 'Focus accounts in Client Reports',
        },
      ]
    case 'weekly_gross_profit_flash':
      return [
        {
          id: 'gp-1',
          metric: 'Revenue MTD',
          value: String(data.revenueHero.mtd.value),
        },
        {
          id: 'gp-2',
          metric: 'MTD vs target',
          value: data.revenueHero.mtd.targetLabel ?? data.revenueHero.mtd.deltaLabel ?? '—',
        },
        {
          id: 'gp-3',
          metric: 'Available funds',
          value: data.cashPosition.availableFunds,
        },
      ]
    case 'daily_bulletin': {
      const ops = data.operationsToday
      return [
        {
          id: 'bul-1',
          metric: 'Received today',
          value: String(ops.receivedToday),
          note: 'Network intake',
        },
        {
          id: 'bul-2',
          metric: 'Submitted today',
          value: String(ops.submittedToday),
          note: 'Embassy / VFS',
        },
        {
          id: 'bul-3',
          metric: 'Collected today',
          value: String(ops.collectedToday),
          note: 'Passports returned',
        },
        {
          id: 'bul-4',
          metric: 'SLA breaches',
          value: String(ops.slaBreaches),
          note: 'Requires attention',
        },
        {
          id: 'bul-5',
          metric: 'Pending embassy',
          value: String(ops.pendingEmbassy),
          note: 'Awaiting decision',
        },
      ]
    }
    case 'crew_change_risk':
      return data.pendingCrewVisas.map((item) => ({
        id: item.id,
        vessel: item.primary,
        status: String(item.value ?? 'Pending'),
        signOn: item.secondary ?? '—',
        progress: item.progress != null ? String(item.progress) : '—',
      }))
    case 'pipeline_by_stage':
      return data.pipelineStages.map((stage) => ({
        id: stage.id,
        stage:
          APPLICATION_PIPELINE_STAGE_LABELS[stage.id as ApplicationPipelineStageId] ?? stage.id,
        count: String(stage.count),
        delayed: String(stage.delayedCount),
        sla: String(stage.slaPercent),
      }))
    case 'passport_custody':
      return data.passportJourney.stages.map((stage, index) => ({
        id: `pj-${index}`,
        stage:
          PASSPORT_JOURNEY_STAGE_LABELS[stage.id as PassportJourneyStageId] ??
          stage.id.replace(/_/g, ' '),
        status: stage.status,
        eta: data.passportJourney.eta ?? stage.detail ?? '—',
      }))
    case 'avg_tat_by_country':
      return data.processingTimeByCountry.map((point) => ({
        id: point.id,
        country: point.label,
        meanTatDays: String(point.value),
      }))
    case 'revenue_vs_targets':
      return [
        {
          id: 'tgt-today',
          period: 'Today',
          revenue: String(data.revenueHero.today.value),
          target: data.revenueHero.today.targetLabel ?? '—',
          delta: data.revenueHero.today.delta != null ? `${data.revenueHero.today.delta}%` : '—',
        },
        {
          id: 'tgt-mtd',
          period: 'MTD',
          revenue: String(data.revenueHero.mtd.value),
          target: data.revenueHero.mtd.targetLabel ?? '—',
          delta: data.revenueHero.mtd.delta != null ? `${data.revenueHero.mtd.delta}%` : '—',
        },
        {
          id: 'tgt-ytd',
          period: 'YTD',
          revenue: String(data.revenueHero.ytd.value),
          target: data.revenueHero.ytd.targetLabel ?? '—',
          delta: data.revenueHero.ytd.delta != null ? `${data.revenueHero.ytd.delta}%` : '—',
        },
      ]
    case 'visa_count':
      return data.visaDistribution.map((slice) => ({
        id: slice.id,
        visaType: slice.label,
        share: String(slice.value),
      }))
    case 'revenue_by_segment':
      return data.businessSegments.map((slice) => ({
        id: slice.id,
        segment: slice.label,
        share: String(slice.value),
      }))
    case 'top_client_revenue':
    case 'client_wise_profitability':
    case 'collections':
      return data.clientRows.map((row) => ({
        id: row.id,
        client: row.client,
        segment: row.segment,
        revenue: row.revenue,
        collections: row.collections,
        outstanding: row.outstanding,
        status: row.status,
      }))
    case 'top_country_revenue':
    case 'revenue_by_visa_country':
    case 'revenue_by_client_country':
      return data.countryDistribution.map((slice) => ({
        id: slice.id,
        country: slice.label,
        share: String(slice.value),
      }))
    case 'follow_ups':
      return data.highRiskClients.map((item) => ({
        id: item.id,
        client: item.primary,
        detail: item.secondary ?? 'Follow up on outstanding',
        status: 'At risk',
      }))
    case 'embassy_fee_working_capital':
      return [
        {
          id: 'emb-1',
          metric: 'Blocked in visa fees',
          value: data.blockedCash.amount,
          note: data.blockedCash.note,
        },
        {
          id: 'emb-2',
          metric: 'Applications holding cash',
          value: String(data.blockedCash.applicationCount),
          note: data.blockedCash.expectedReleaseLabel,
        },
        {
          id: 'emb-3',
          metric: 'Cash position — blocked line',
          value: data.cashPosition.blockedInVisaFees,
          note: 'From cash position snapshot',
        },
      ]
    case 'sla_breach':
      return data.slaOverview.map((item) => ({
        id: item.id,
        area: item.label,
        value: String(item.value),
        target: item.helperText ?? '—',
      }))
    case 'blocked_applications':
      return data.pipelineStages
        .filter((stage) => stage.delayedCount > 0)
        .map((stage) => ({
          id: stage.id,
          stage:
            APPLICATION_PIPELINE_STAGE_LABELS[stage.id as ApplicationPipelineStageId] ?? stage.id,
          count: String(stage.count),
          delayed: String(stage.delayedCount),
          avgAge: String(stage.averageAgeHours),
        }))
    case 'team_productivity':
      return data.teamCapacity.map((row) => ({
        id: row.id,
        team: row.department,
        open: String(row.openCases),
        done: String(row.completedToday),
        capacity: String(row.capacity),
        sla: String(row.slaPercent),
      }))
    default:
      return []
  }
}

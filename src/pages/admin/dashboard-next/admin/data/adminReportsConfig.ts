import type { Column } from '@/design-system/UIComponents'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import {
  PASSPORT_JOURNEY_STAGE_LABELS,
  type PassportJourneyStageId,
} from '../../shared/config/passportJourney'
import { VISA_ANALYTICS_MOCK } from '../analytics/data/visaAnalyticsMock'
import type { AdminDashboardNextData } from '../types'

/** Admin Reports categories — ops-focused (no full finance catalog). */
export const ADMIN_REPORT_CATEGORIES = [
  'Operational Reports',
  'Embassy & Country Reports',
  'Quality Reports',
] as const

export type AdminReportCategory = (typeof ADMIN_REPORT_CATEGORIES)[number]

export type AdminReportTypeId =
  // Operational
  | 'daily_ops_bulletin'
  | 'pipeline_by_stage'
  | 'pending_verification'
  | 'passport_custody'
  | 'courier_in_transit'
  // Embassy & Country
  | 'volume_by_visa_country'
  | 'visa_type_mix'
  | 'branch_performance'
  | 'refusal_by_country'
  | 'refusal_by_embassy'
  // Quality
  | 'sla_breach'
  | 'blocked_applications'
  | 'team_productivity'
  | 'critical_attention'

export type AdminReportPeriodId =
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'six_months'
  | 'custom'

export interface AdminReportPreviewRow {
  id: string
  [key: string]: string
}

export interface AdminReportMeta {
  id: AdminReportTypeId
  label: string
  category: AdminReportCategory
  source: string
}

export const ADMIN_REPORT_META: readonly AdminReportMeta[] = [
  // Operational
  {
    id: 'daily_ops_bulletin',
    label: 'Daily Operations Bulletin',
    category: 'Operational Reports',
    source: 'Ops — hero KPIs and operations health snapshot.',
  },
  {
    id: 'pipeline_by_stage',
    label: 'Pipeline by Stage',
    category: 'Operational Reports',
    source: 'Ops — application stage aggregation with delay and SLA.',
  },
  {
    id: 'pending_verification',
    label: 'Pending Verification Queue',
    category: 'Operational Reports',
    source: 'Ops — applications awaiting document verification.',
  },
  {
    id: 'passport_custody',
    label: 'Passport Custody Log',
    category: 'Operational Reports',
    source: 'Ops — passport journey stage movements.',
  },
  {
    id: 'courier_in_transit',
    label: 'Courier In Transit',
    category: 'Operational Reports',
    source: 'Ground / logistics — IN TRANSIT courier consignments.',
  },
  // Embassy & Country
  {
    id: 'volume_by_visa_country',
    label: 'Volume by Visa Country',
    category: 'Embassy & Country Reports',
    source: 'Analytics — application share by destination country.',
  },
  {
    id: 'visa_type_mix',
    label: 'Visa Type Mix',
    category: 'Embassy & Country Reports',
    source: 'Analytics — volume mix by visa category.',
  },
  {
    id: 'branch_performance',
    label: 'Jurisdiction Performance',
    category: 'Embassy & Country Reports',
    source: 'Ops — throughput by jurisdiction / desk.',
  },
  {
    id: 'refusal_by_country',
    label: 'Refusal by Country',
    category: 'Embassy & Country Reports',
    source: 'Visa analytics — refusal volume by destination.',
  },
  {
    id: 'refusal_by_embassy',
    label: 'Refusal by Embassy / Mission',
    category: 'Embassy & Country Reports',
    source: 'Visa analytics — refusal volume by embassy / VFS mission.',
  },
  // Quality
  {
    id: 'sla_breach',
    label: 'SLA Breach Report',
    category: 'Quality Reports',
    source: 'Ops — SLA compliance vs target by area.',
  },
  {
    id: 'blocked_applications',
    label: 'Blocked / Delayed Applications',
    category: 'Quality Reports',
    source: 'Ops — pipeline stages with delayed cases.',
  },
  {
    id: 'team_productivity',
    label: 'Team Productivity vs Capacity',
    category: 'Quality Reports',
    source: 'Ops — open load, completions, and capacity by team.',
  },
  {
    id: 'critical_attention',
    label: 'Critical Attention Alerts',
    category: 'Quality Reports',
    source: 'Ops — needs-immediate-attention and risk alerts.',
  },
] as const

export const ADMIN_REPORT_CATEGORY_OPTIONS = ADMIN_REPORT_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}))

export function getReportTypesForCategory(category: AdminReportCategory | '') {
  if (!category) return []
  return ADMIN_REPORT_META.filter((meta) => meta.category === category).map((meta) => ({
    label: meta.label,
    value: meta.id,
  }))
}

export const ADMIN_REPORT_PERIOD_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: '6 months', value: 'six_months' },
  { label: 'Custom', value: 'custom' },
] as const satisfies ReadonlyArray<{ label: string; value: AdminReportPeriodId }>

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

export function resolveAdminReportRange(
  period: AdminReportPeriodId,
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

export function formatAdminReportRangeLabel(from: Date, to: Date): string {
  return `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
}

export function getAdminReportTypeLabel(id: AdminReportTypeId): string {
  return ADMIN_REPORT_META.find((meta) => meta.id === id)?.label ?? id
}

export function getAdminReportSource(id: AdminReportTypeId): string {
  return ADMIN_REPORT_META.find((meta) => meta.id === id)?.source ?? ''
}

function textColumn(
  key: string,
  label: string,
  widthSize: 'sm' | 'md' | 'lg' | 'xl' = 'md',
): Column<AdminReportPreviewRow> {
  return {
    key,
    label,
    widthSize,
    sortable: false,
    filterable: false,
    searchable: false,
  }
}

export function getAdminReportColumns(
  reportType: AdminReportTypeId,
): Column<AdminReportPreviewRow>[] {
  switch (reportType) {
    case 'daily_ops_bulletin':
      return [
        textColumn('metric', 'Signal', 'lg'),
        textColumn('value', 'Value', 'md'),
        textColumn('note', 'Detail', 'xl'),
      ]
    case 'pipeline_by_stage':
      return [
        textColumn('stage', 'Stage', 'lg'),
        textColumn('count', 'Count', 'sm'),
        textColumn('delayed', 'Delayed', 'sm'),
        textColumn('avgAge', 'Avg Age (h)', 'sm'),
        textColumn('sla', 'SLA %', 'sm'),
      ]
    case 'pending_verification':
      return [
        textColumn('glNumber', 'GL Number', 'md'),
        textColumn('applicant', 'Applicant', 'lg'),
        textColumn('company', 'Company', 'lg'),
        textColumn('consultant', 'Consultant', 'md'),
        textColumn('priority', 'Priority', 'sm'),
        textColumn('waitingTime', 'Waiting', 'sm'),
      ]
    case 'passport_custody':
      return [
        textColumn('stage', 'Journey Stage', 'lg'),
        textColumn('status', 'Status', 'md'),
        textColumn('eta', 'ETA', 'md'),
      ]
    case 'courier_in_transit':
      return [
        textColumn('awb', 'AWB / Ref', 'md'),
        textColumn('applicant', 'Applicant', 'lg'),
        textColumn('destination', 'Destination', 'md'),
        textColumn('courier', 'Courier', 'md'),
        textColumn('status', 'Status', 'sm'),
      ]
    case 'volume_by_visa_country':
    case 'visa_type_mix':
    case 'refusal_by_country':
    case 'refusal_by_embassy':
      return [
        textColumn('name', 'Name', 'lg'),
        textColumn('share', 'Share / Count', 'md'),
      ]
    case 'branch_performance':
      return [
        textColumn('branch', 'Jurisdiction', 'lg'),
        textColumn('value', 'Throughput', 'md'),
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
    case 'critical_attention':
      return [
        textColumn('title', 'Alert', 'lg'),
        textColumn('severity', 'Severity', 'sm'),
        textColumn('detail', 'Detail', 'xl'),
      ]
    default:
      return []
  }
}

export function buildAdminReportRows(
  reportType: AdminReportTypeId,
  data: AdminDashboardNextData,
): AdminReportPreviewRow[] {
  switch (reportType) {
    case 'daily_ops_bulletin': {
      const health = data.operationsHealth
      const stats = data.quickStats
      const find = (id: string) => stats.find((s) => s.id === id)
      return [
        {
          id: 'bul-1',
          metric: 'Total applications',
          value: String(find('total-applications')?.value ?? '—'),
          note: find('total-applications')?.deltaLabel ?? 'Active channels',
        },
        {
          id: 'bul-2',
          metric: 'In progress',
          value: String(find('applications-in-progress')?.value ?? '—'),
          note: 'Processing & ops lanes',
        },
        {
          id: 'bul-3',
          metric: 'Completed today',
          value: String(find('completed-today')?.value ?? '—'),
          note: 'Delivered or closed',
        },
        {
          id: 'bul-4',
          metric: 'Critical cases',
          value: String(find('critical-cases')?.value ?? '—'),
          note: 'SLA breach or escalation',
        },
        {
          id: 'bul-5',
          metric: 'Delayed applications',
          value: String(find('applications-delayed')?.value ?? health.delayedCases ?? '—'),
          note: 'Past SLA threshold',
        },
        {
          id: 'bul-6',
          metric: 'SLA compliance',
          value: String(find('sla-compliance')?.value ?? '—'),
          note: 'Across all teams',
        },
      ]
    }
    case 'pipeline_by_stage':
      return data.pipelineStages.map((stage) => ({
        id: stage.id,
        stage:
          APPLICATION_PIPELINE_STAGE_LABELS[stage.id as ApplicationPipelineStageId] ?? stage.id,
        count: String(stage.count),
        delayed: String(stage.delayedCount),
        avgAge: String(stage.averageAgeHours),
        sla: String(stage.slaPercent),
      }))
    case 'pending_verification':
      return data.pendingVerification.map((row) => ({
        id: row.id,
        glNumber: row.glNumber,
        applicant: row.applicant,
        company: row.company,
        consultant: row.consultant,
        priority: row.priority,
        waitingTime: row.waitingTime,
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
    case 'courier_in_transit': {
      const rows = data.inTransitCourierRows ?? []
      if (rows.length === 0) {
        return [
          {
            id: 'courier-empty',
            awb: '—',
            applicant: 'No consignments in transit',
            destination: '—',
            courier: '—',
            status: 'Empty',
          },
        ]
      }
      return rows.map((row) => ({
        id: row.id,
        awb: row.trackingNumber || row.applicationNumber,
        applicant: row.applicant,
        destination: row.currentLocation,
        courier: row.courier,
        status: row.status,
      }))
    }
    case 'volume_by_visa_country':
      return data.countryDistribution.map((slice) => ({
        id: slice.id,
        name: slice.label,
        share: `${slice.value}%`,
      }))
    case 'visa_type_mix':
      return data.visaDistribution.map((slice) => ({
        id: slice.id,
        name: slice.label,
        share: `${slice.value}%`,
      }))
    case 'branch_performance':
      return data.branchPerformance.map((point) => ({
        id: point.id,
        branch: point.label,
        value: String(point.value),
      }))
    case 'refusal_by_country':
      return VISA_ANALYTICS_MOCK.refusalByCountry.map((row) => ({
        id: row.id,
        name: row.label,
        share: String(row.value),
      }))
    case 'refusal_by_embassy':
      return VISA_ANALYTICS_MOCK.refusalByEmbassy.map((row) => ({
        id: row.id,
        name: row.label,
        share: String(row.value),
      }))
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
    case 'critical_attention': {
      const attention = data.attentionAlerts.map((alert) => ({
        id: `att-${alert.id}`,
        title: alert.title,
        severity: alert.priority,
        detail: `${alert.count} open · oldest ${alert.oldestWaiting}`,
      }))
      const risk = data.riskAlerts.map((alert) => ({
        id: `risk-${alert.id}`,
        title: alert.title,
        severity: alert.severity ?? 'info',
        detail: alert.description ?? (alert.count != null ? `${alert.count} items` : '—'),
      }))
      return [...attention, ...risk]
    }
    default:
      return []
  }
}

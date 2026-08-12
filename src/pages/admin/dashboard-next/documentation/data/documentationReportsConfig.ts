import type { Column } from '@/design-system/UIComponents'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import type { DocumentationDashboardData } from '../types'

export type DocReportTypeId =
  | 'daily_digest'
  | 'submission_pending_ageing'
  | 'qc_outcomes'
  | 'waiting_on_ops'
  | 'pending_payment'
  | 'marked_submitted'
  | 'top_countries'
  | 'top_clients'
  | 'sla_breach'
  | 'inactivity'

export type DocReportPeriodId = 'day' | 'week' | 'month' | 'custom'

export interface DocReportPreviewRow {
  id: string
  [key: string]: string
}

export interface DocReportMeta {
  id: DocReportTypeId
  label: string
  category: string
  source: string
}

export const DOC_REPORT_META: readonly DocReportMeta[] = [
  {
    id: 'daily_digest',
    label: 'Daily documentation digest',
    category: 'Operational',
    source: 'Portal — Submission Pending / Payment / Waiting on Ops snapshot.',
  },
  {
    id: 'submission_pending_ageing',
    label: 'Submission Pending ageing',
    category: 'Operational',
    source: 'Portal — Docs primary queue SLA timers.',
  },
  {
    id: 'qc_outcomes',
    label: 'QC outcomes',
    category: 'Quality',
    source: 'Portal — Verified & ready · Correction · Blocked · Pending QC.',
  },
  {
    id: 'waiting_on_ops',
    label: 'Waiting on Ops',
    category: 'Quality',
    source: 'Portal — cases Docs sent to Verification Pending.',
  },
  {
    id: 'pending_payment',
    label: 'Pending Payment',
    category: 'Operational',
    source: 'Portal — AM Pending Payment tab assigned to Docs.',
  },
  {
    id: 'marked_submitted',
    label: 'Ready to mark submitted',
    category: 'Operational',
    source: 'Portal — Verified applications awaiting Mark as submitted.',
  },
  {
    id: 'top_countries',
    label: 'Top countries',
    category: 'Analytics',
    source: 'Portal — Docs queue aggregated by country.',
  },
  {
    id: 'top_clients',
    label: 'Top clients',
    category: 'Analytics',
    source: 'Portal — Docs queue aggregated by client.',
  },
  {
    id: 'sla_breach',
    label: 'Documentation SLA breach',
    category: 'SLA',
    source: 'Portal — per-case SLA on Submission Pending.',
  },
  {
    id: 'inactivity',
    label: 'Executive inactivity soft alerts',
    category: 'Workforce',
    source: 'Portal — activity audit; soft alert after 60 minutes idle.',
  },
] as const

export const DOC_REPORT_TYPE_OPTIONS = DOC_REPORT_META.map((meta) => ({
  label: meta.label,
  value: meta.id,
}))

export const DOC_REPORT_PERIOD_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
] as const satisfies ReadonlyArray<{ label: string; value: DocReportPeriodId }>

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

export function resolveDocReportRange(
  period: DocReportPeriodId,
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
    case 'custom': {
      const [start, end] = customRange
      return {
        from: start ? startOfDay(start) : today,
        to: end ? endOfDay(end) : to,
      }
    }
    default:
      return { from: today, to }
  }
}

export function formatDocReportRangeLabel(from: Date, to: Date): string {
  return `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
}

export function getDocReportTypeLabel(id: DocReportTypeId): string {
  return DOC_REPORT_META.find((meta) => meta.id === id)?.label ?? id
}

export function getDocReportSource(id: DocReportTypeId): string {
  return DOC_REPORT_META.find((meta) => meta.id === id)?.source ?? ''
}

function textColumn(
  key: string,
  label: string,
  widthSize: 'sm' | 'md' | 'lg' | 'xl' = 'md',
): Column<DocReportPreviewRow> {
  return {
    key,
    label,
    widthSize,
    sortable: false,
    filterable: false,
    searchable: false,
  }
}

export function getDocReportColumns(reportType: DocReportTypeId): Column<DocReportPreviewRow>[] {
  switch (reportType) {
    case 'daily_digest':
      return [
        textColumn('metric', 'Metric', 'lg'),
        textColumn('count', 'Count', 'sm'),
        textColumn('detail', 'Detail', 'xl'),
      ]
    case 'submission_pending_ageing':
    case 'waiting_on_ops':
    case 'pending_payment':
    case 'marked_submitted':
    case 'sla_breach':
      return [
        textColumn('glNumber', 'GL Number', 'md'),
        textColumn('applicant', 'Applicant', 'lg'),
        textColumn('client', 'Client', 'lg'),
        textColumn('country', 'Country', 'md'),
        textColumn('nextAction', 'Next action', 'lg'),
        textColumn('qcOutcome', 'QC outcome', 'lg'),
        textColumn('slaTimer', 'SLA', 'sm'),
      ]
    case 'qc_outcomes':
      return [
        textColumn('outcome', 'QC outcome', 'lg'),
        textColumn('count', 'Count', 'sm'),
      ]
    case 'top_countries':
    case 'top_clients':
      return [textColumn('name', 'Name', 'lg'), textColumn('count', 'Applications', 'sm')]
    case 'inactivity':
      return [
        textColumn('executive', 'Executive', 'md'),
        textColumn('minutesIdle', 'Minutes idle', 'sm'),
        textColumn('lastAction', 'Last action', 'lg'),
        textColumn('alertSent', 'Supervisor alert', 'sm'),
      ]
    default:
      return []
  }
}

function mapWorkRows(
  rows: DocumentationDashboardData['submissionPendingRows'],
): DocReportPreviewRow[] {
  return rows.map((row) => ({
    id: row.id,
    glNumber: row.glNumber,
    applicant: row.applicant,
    client: row.company,
    country: row.country,
    nextAction: row.nextAction,
    qcOutcome: row.qcOutcomeLabel,
    slaTimer: row.slaTimer,
  }))
}

export function buildDocReportRows(
  reportType: DocReportTypeId,
  data: DocumentationDashboardData,
): DocReportPreviewRow[] {
  switch (reportType) {
    case 'daily_digest':
      return [
        {
          id: 'dd1',
          metric: 'Submission Pending',
          count: String(data.submissionPendingRows.length),
          detail: 'Docs primary queue',
        },
        {
          id: 'dd2',
          metric: 'Pending Payment',
          count: String(data.pendingPaymentRows.length),
          detail: 'Fee updates',
        },
        {
          id: 'dd3',
          metric: 'Waiting on Ops',
          count: String(data.waitingOnOpsRows.length),
          detail: 'Correction / blocked',
        },
        {
          id: 'dd4',
          metric: 'Activity today',
          count: String(data.activityRows.length),
          detail: 'Audit trail',
        },
      ]
    case 'submission_pending_ageing':
      return mapWorkRows(data.submissionPendingRows)
    case 'qc_outcomes':
      return data.qcOutcomeMix.map((s) => ({
        id: s.key,
        outcome: s.label,
        count: String(s.value),
      }))
    case 'waiting_on_ops':
      return mapWorkRows(data.waitingOnOpsRows)
    case 'pending_payment':
      return mapWorkRows(data.pendingPaymentRows)
    case 'marked_submitted':
      return mapWorkRows(
        data.submissionPendingRows.filter((r) =>
          r.nextAction.toLowerCase().includes('mark as submitted'),
        ),
      )
    case 'top_countries':
      return data.topCountries.map((r, i) => ({
        id: `c-${i}`,
        name: r.name,
        count: String(r.value),
        share: `${r.sharePercent}%`,
      }))
    case 'top_clients':
      return data.topClients.map((r, i) => ({
        id: `cl-${i}`,
        name: r.name,
        count: String(r.value),
        share: `${r.sharePercent}%`,
      }))
    case 'sla_breach':
      return mapWorkRows(
        data.submissionPendingRows.filter((r) => r.slaStatus === 'breached' || r.slaStatus === 'at_risk'),
      )
    case 'inactivity':
      return [
        {
          id: 'ina1',
          executive: data.executiveName,
          minutesIdle: String(data.minutesSinceLastActivity ?? 0),
          lastAction: data.activityRows[0]
            ? `${data.activityRows[0].action} · ${data.activityRows[0].application}`
            : '—',
          alertSent: data.showInactivityWarning ? 'Yes' : 'No',
        },
      ]
    default:
      return []
  }
}

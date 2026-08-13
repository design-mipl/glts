import type { Column } from '@/design-system/UIComponents'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import type { DocumentationDashboardData } from '../types'

/**
 * Documentation report catalog — listed in Reports dropdown.
 * Preview/export data is not wired yet (Coming soon).
 */
export type DocReportTypeId =
  | 'daily_bulletin'
  | 'sla_breach'
  | 'pipeline_by_stage'
  | 'avg_tat_by_country'
  | 'passport_custody'
  | 'mum_delhi_courier_charges'
  | 'insurance_report'

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
    id: 'daily_bulletin',
    label: 'Daily documentation bulletin',
    category: 'Operational',
    source: 'To be updated — Docs desk bulletin compiled daily.',
  },
  {
    id: 'sla_breach',
    label: 'SLA breach report',
    category: 'SLA',
    source: 'Portal — Docs SLA clocks per case.',
  },
  {
    id: 'pipeline_by_stage',
    label: 'Pipeline by stage / vertical',
    category: 'Analytics',
    source: 'Portal — AM stages × Retail / Corporate / Marine / B2B.',
  },
  {
    id: 'avg_tat_by_country',
    label: 'Average turnaround time by country',
    category: 'Analytics',
    source: 'Portal — received-to-complete timestamps by destination.',
  },
  {
    id: 'passport_custody',
    label: 'Passport custody log',
    category: 'Logistics',
    source: 'Portal — custody movements (Ground / Ops handoff).',
  },
  {
    id: 'mum_delhi_courier_charges',
    label: 'GLTS Mum – GLTS Delhi courier charges',
    category: 'Finance',
    source: 'TBD with Karthikey — inter-branch courier cost schedule.',
  },
  {
    id: 'insurance_report',
    label: 'Insurance Report',
    category: 'Operational',
    source: 'Portal — GLTS arrange-insurance bookings and status.',
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

/** Placeholder — report previews are Coming soon. */
export function getDocReportColumns(_reportType: DocReportTypeId): Column<DocReportPreviewRow>[] {
  return []
}

/** Placeholder — report previews are Coming soon. */
export function buildDocReportRows(
  _reportType: DocReportTypeId,
  _data: DocumentationDashboardData,
): DocReportPreviewRow[] {
  return []
}

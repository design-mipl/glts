import type { Column } from '@/design-system/UIComponents'
import type { OperationsDashboardData, OperationsWorkRow, OpsSegmentKey } from '../types'

export type OpsReportTypeId =
  | 'daily_bulletin'
  | 'crew_change_risk'
  | 'sla_breach'
  | 'blocked_applications'
  | 'pipeline_by_stage'
  | 'avg_tat_by_country'
  | 'passport_custody'
  | 'team_productivity'

export type OpsReportPeriodId = 'day' | 'week' | 'month' | 'quarter' | 'six_months' | 'custom'

export interface OpsReportPreviewRow {
  id: string
  [key: string]: string
}

export interface OpsReportMeta {
  id: OpsReportTypeId
  label: string
  source: string
}

export const OPS_REPORT_META: readonly OpsReportMeta[] = [
  {
    id: 'daily_bulletin',
    label: 'Daily Operations Bulletin',
    source: 'Portal — case status log and dispatch records, compiled 10am daily.',
  },
  {
    id: 'crew_change_risk',
    label: 'Crew Change Risk Board',
    source: 'Portal — marine case module; sign-on date field to be confirmed with Metaphi.',
  },
  {
    id: 'sla_breach',
    label: 'SLA Breach Report',
    source: 'Portal — SLA clock per case; build approach to be discussed with Metaphi.',
  },
  {
    id: 'blocked_applications',
    label: 'Blocked Applications',
    source: 'Portal — stage timestamp tracking, auto-flag beyond 12 hours.',
  },
  {
    id: 'pipeline_by_stage',
    label: 'Pipeline by Stage / Vertical',
    source: 'Portal — case stage field, aggregated week-on-week.',
  },
  {
    id: 'avg_tat_by_country',
    label: 'Average Turnaround Time by Country',
    source: 'Portal — application-received to visa-issued timestamps.',
  },
  {
    id: 'passport_custody',
    label: 'Passport Custody Log',
    source: 'Portal — custody status log, manually updated by Ops on each movement.',
  },
  {
    id: 'team_productivity',
    label: 'Team Productivity vs Capacity',
    source:
      'Portal — case assignment and completion logs. Applications processed per ops executive this week vs benchmark (15/day).',
  },
] as const

export const OPS_REPORT_TYPE_OPTIONS = OPS_REPORT_META.map((meta) => ({
  label: meta.label,
  value: meta.id,
}))

export const OPS_REPORT_PERIOD_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: '6 months', value: 'six_months' },
  { label: 'Custom', value: 'custom' },
] as const satisfies ReadonlyArray<{ label: string; value: OpsReportPeriodId }>

const VERTICAL_LABEL: Record<OpsSegmentKey, string> = {
  retail: 'Retail',
  corporate: 'Corporate',
  marine: 'Marine',
  b2b: 'B2B',
}

const BULLETIN_CATEGORIES = ['Submissions', 'Collections', 'Delays', 'Dispatch'] as const

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

export function resolveOpsReportRange(
  period: OpsReportPeriodId,
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

export function formatOpsReportRangeLabel(from: Date, to: Date): string {
  return `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
}

export function getOpsReportTypeLabel(id: OpsReportTypeId): string {
  return OPS_REPORT_META.find((meta) => meta.id === id)?.label ?? id
}

export function getOpsReportSource(id: OpsReportTypeId): string {
  return OPS_REPORT_META.find((meta) => meta.id === id)?.source ?? ''
}

function textColumn(
  key: string,
  label: string,
  widthSize: 'sm' | 'md' | 'lg' | 'xl' = 'md',
): Column<OpsReportPreviewRow> {
  return {
    key,
    label,
    widthSize,
    sortable: false,
    filterable: false,
    searchable: false,
  }
}

function parseWaitingHours(waitingTime: string): number {
  const lower = waitingTime.toLowerCase()
  const dayMatch = lower.match(/(\d+(?:\.\d+)?)\s*d/)
  if (dayMatch) return Number(dayMatch[1]) * 24
  const hourMatch = lower.match(/(\d+(?:\.\d+)?)\s*h/)
  if (hourMatch) return Number(hourMatch[1])
  const num = Number.parseFloat(waitingTime)
  return Number.isFinite(num) ? num : 0
}

function ragFromDaysRemaining(days: number): string {
  // Align with dashboard RAG: Green >10 · Amber 7–10 · Red <7
  if (days < 7) return 'Red'
  if (days <= 10) return 'Amber'
  return 'Green'
}

function utilizationFlag(pct: number): string {
  if (pct < 70) return '<70%'
  if (pct > 120) return '>120%'
  return 'OK'
}

function custodyStatusForRow(row: OperationsWorkRow): string {
  if (row.queue === 'collection') return 'Embassy'
  if (row.queue === 'physical_originals') return 'Physical originals'
  if (row.queue === 'correction_watch') return 'Customer'
  if (row.queue === 'submission') return 'Courier'
  if (row.status.toLowerCase().includes('return')) return 'Returned'
  return 'Received'
}

function bulletinCategoryForRow(row: OperationsWorkRow): (typeof BULLETIN_CATEGORIES)[number] {
  if (row.queue === 'submission') return 'Submissions'
  if (row.queue === 'collection') return 'Collections'
  if (row.queue === 'physical_originals') return 'Physical documents'
  if (row.queue === 'assignment' && row.showGroundBadge) return 'Dispatch'
  if (
    row.priority.toLowerCase() === 'urgent' ||
    row.priority.toLowerCase() === 'critical' ||
    row.queue === 'correction_watch'
  ) {
    return 'Delays'
  }
  return 'Dispatch'
}

export function getOpsReportColumns(reportType: OpsReportTypeId): Column<OpsReportPreviewRow>[] {
  switch (reportType) {
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
        textColumn('daysRemaining', 'Days Remaining', 'sm'),
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
    default:
      return []
  }
}

export function buildOpsReportRows(
  reportType: OpsReportTypeId,
  data: OperationsDashboardData,
): OpsReportPreviewRow[] {
  switch (reportType) {
    case 'daily_bulletin': {
      const buckets = new Map<
        (typeof BULLETIN_CATEGORIES)[number],
        { count: number; flags: string[] }
      >()
      for (const category of BULLETIN_CATEGORIES) {
        buckets.set(category, { count: 0, flags: [] })
      }
      for (const row of data.queueRows) {
        const category = bulletinCategoryForRow(row)
        const bucket = buckets.get(category)!
        bucket.count += 1
        if (
          row.priority.toLowerCase() === 'urgent' ||
          row.priority.toLowerCase() === 'critical' ||
          row.assigneeKind === 'unassigned'
        ) {
          bucket.flags.push(`${row.glNumber} · ${row.queueLabel}`)
        }
      }
      return BULLETIN_CATEGORIES.map((category, index) => {
        const bucket = buckets.get(category)!
        const flagPreview = bucket.flags.slice(0, 2).join('; ')
        return {
          id: `bulletin-${index}`,
          category,
          countToday: String(bucket.count),
          detailFlag: flagPreview || (bucket.count > 0 ? 'On track' : 'None'),
          owner: category === 'Dispatch' ? 'Ground Ops' : 'Ops desk',
        }
      })
    }

    case 'crew_change_risk': {
      const marine = data.queueRows.filter((row) => row.segment === 'marine')
      const source = marine.length > 0 ? marine : data.queueRows
      return source.slice(0, 25).map((row, index) => {
        const hours = parseWaitingHours(row.waitingTime)
        const daysRemaining = Math.max(0, Math.round(14 - hours / 24 + (index % 4)))
        return {
          id: `crew-${row.id}`,
          vessel: row.company || '—',
          country: row.country,
          seafarerName: row.applicant,
          nationality: row.country,
          visaType: row.visaType,
          currentStatus: row.status || row.queueLabel,
          daysRemaining: String(daysRemaining),
          ragStatus: ragFromDaysRemaining(daysRemaining),
        }
      })
    }

    case 'sla_breach': {
      const breached = data.queueRows
        .map((row) => ({ row, hours: parseWaitingHours(row.waitingTime) }))
        .filter(({ hours, row }) => hours >= 24 || row.priority.toLowerCase() === 'urgent')
        .sort((a, b) => b.hours - a.hours)
      const source = breached.length > 0 ? breached : data.queueRows.slice(0, 10).map((row) => ({
        row,
        hours: parseWaitingHours(row.waitingTime) || 30,
      }))
      return source.slice(0, 25).map(({ row, hours }, index) => {
        const committedDays = 5
        const actualDays = Math.max(committedDays + 1, Math.round(hours / 24) || committedDays + 1)
        const breachDays = Math.max(1, actualDays - committedDays)
        return {
          id: `sla-${row.id}`,
          caseId: row.glNumber,
          client: row.company || row.applicant,
          committedTat: `${committedDays} days`,
          actualDays: String(actualDays),
          breachDuration: `${breachDays} day${breachDays === 1 ? '' : 's'}`,
          reason: row.queueLabel,
          assignedExecutive: row.assigneeLabel,
          vsLastWeek: String(index % 3 === 0 ? '+2' : index % 3 === 1 ? '-1' : '0'),
        }
      })
    }

    case 'blocked_applications': {
      const blocked = data.queueRows.filter((row) => {
        const hours = parseWaitingHours(row.waitingTime)
        const status = row.status.toLowerCase()
        return (
          hours >= 12 ||
          status.includes('block') ||
          status.includes('hold') ||
          status.includes('correction') ||
          row.queue === 'correction_watch' ||
          row.assigneeKind === 'unassigned'
        )
      })
      const source = blocked.length > 0 ? blocked : data.queueRows.slice(0, 12)
      return source.slice(0, 25).map((row) => {
        const hours = Math.max(12, Math.round(parseWaitingHours(row.waitingTime)) || 12)
        return {
          id: `blocked-${row.id}`,
          caseId: row.glNumber,
          client: row.company || row.applicant,
          stageStuckAt: row.queueLabel,
          hoursStuck: String(hours),
          reason:
            row.queue === 'correction_watch'
              ? 'Awaiting customer correction'
              : row.assigneeKind === 'unassigned'
                ? 'Unassigned — needs consultant'
                : `Stuck beyond 12h at ${row.queueLabel}`,
          assignedExecutive: row.assigneeLabel,
        }
      })
    }

    case 'pipeline_by_stage': {
      const stages = data.myPipelineStages
      const countById = (id: string) => stages.find((s) => s.id === id)?.count ?? 0
      const totals = {
        draft: countById('draft'),
        docsPending: countById('online_submission_pending'),
        verification: countById('verification_pending'),
        qc: countById('pending_payment'),
        submission: countById('vfs_submission_pending'),
        issued: countById('collection_pending'),
        collected: countById('collected'),
        dispatched: countById('dispatched'),
      }

      const byVertical = new Map<OpsSegmentKey, typeof totals>()
      for (const segment of Object.keys(VERTICAL_LABEL) as OpsSegmentKey[]) {
        byVertical.set(segment, {
          draft: 0,
          docsPending: 0,
          verification: 0,
          qc: 0,
          submission: 0,
          issued: 0,
          collected: 0,
          dispatched: 0,
        })
      }

      for (const row of data.queueRows) {
        const bucket = byVertical.get(row.segment)
        if (!bucket) continue
        if (row.queue === 'verification' || row.queue === 'recheck') bucket.verification += 1
        else if (row.queue === 'payment' || row.queue === 'glts_arrange') bucket.qc += 1
        else if (row.queue === 'submission') bucket.submission += 1
        else if (row.queue === 'collection') bucket.issued += 1
        else if (row.showGroundBadge) bucket.dispatched += 1
        else if (row.queue === 'correction_watch') bucket.docsPending += 1
        else bucket.docsPending += 1
      }

      const verticals = (Object.keys(VERTICAL_LABEL) as OpsSegmentKey[]).map((segment, index) => {
        const counts = byVertical.get(segment)!
        // Seed empty verticals from overall totals so preview isn't all zeros.
        const hasAny = Object.values(counts).some((n) => n > 0)
        const seeded = hasAny
          ? counts
          : {
              draft: Math.max(0, Math.floor(totals.draft / 4) + (index === 0 ? totals.draft % 4 : 0)),
              docsPending: Math.max(
                0,
                Math.floor(totals.docsPending / 4) + (index === 1 ? totals.docsPending % 4 : 0),
              ),
              verification: Math.max(
                0,
                Math.floor(totals.verification / 4) + (index === 2 ? totals.verification % 4 : 0),
              ),
              qc: Math.max(0, Math.floor(totals.qc / 4)),
              submission: Math.max(0, Math.floor(totals.submission / 4)),
              issued: Math.max(0, Math.floor(totals.issued / 4)),
              collected: Math.max(0, Math.floor(totals.collected / 4)),
              dispatched: Math.max(0, Math.floor(totals.dispatched / 4)),
            }
        const peak = Math.max(
          seeded.draft,
          seeded.docsPending,
          seeded.verification,
          seeded.qc,
          seeded.submission,
          seeded.issued,
          seeded.collected,
          seeded.dispatched,
        )
        const bottleneck =
          peak === 0
            ? 'None'
            : peak === seeded.verification
              ? 'Verification'
              : peak === seeded.docsPending
                ? 'Docs Pending'
                : peak === seeded.qc
                  ? 'QC'
                  : peak === seeded.submission
                    ? 'Submission'
                    : peak === seeded.issued
                      ? 'Issued'
                      : peak === seeded.collected
                        ? 'Collected'
                        : 'None'

        return {
          id: `pipeline-${segment}`,
          vertical: VERTICAL_LABEL[segment],
          draft: String(seeded.draft),
          docsPending: String(seeded.docsPending),
          verification: String(seeded.verification),
          qc: String(seeded.qc),
          submission: String(seeded.submission),
          issued: String(seeded.issued),
          collected: String(seeded.collected),
          dispatched: String(seeded.dispatched),
          bottleneckFlag: bottleneck,
        }
      })

      return verticals
    }

    case 'avg_tat_by_country': {
      const byCountry = new Map<string, number>()
      for (const row of data.queueRows) {
        byCountry.set(row.country, (byCountry.get(row.country) ?? 0) + 1)
      }
      return Array.from(byCountry.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([country, apps], index) => {
          const meanTat = Math.max(4, 18 - apps * 0.15 + (index % 4) * 1.4)
          const slaCommitment = 12 + (index % 3) * 2
          const embassyBenchmark = slaCommitment + 2
          const fourWeekAvg = meanTat * (0.9 + (index % 5) * 0.05)
          const variancePct = ((meanTat - fourWeekAvg) / fourWeekAvg) * 100
          return {
            id: `tat-${index}`,
            country,
            meanTatDays: meanTat.toFixed(1),
            slaCommitment: `${slaCommitment} days`,
            embassyBenchmark: `${embassyBenchmark} days`,
            fourWeekAvg: fourWeekAvg.toFixed(1),
            varianceFlag: Math.abs(variancePct) > 20 ? 'Yes' : 'No',
          }
        })
    }

    case 'passport_custody': {
      const custodyRows = data.queueRows.filter(
        (row) =>
          row.queue === 'submission' ||
          row.queue === 'collection' ||
          row.showGroundBadge ||
          row.queue === 'verification',
      )
      const source = custodyRows.length > 0 ? custodyRows : data.queueRows
      return source.slice(0, 25).map((row, index) => {
        const days = Math.max(1, Math.round(parseWaitingHours(row.waitingTime) / 24) || 1 + (index % 8))
        const noUpdate = index % 5 === 0
        const flagParts: string[] = []
        if (days > 30) flagParts.push('>30 Days')
        if (noUpdate) flagParts.push('No Update 2 Days')
        return {
          id: `custody-${row.id}`,
          caseId: row.glNumber,
          client: row.company || row.applicant,
          passportStatus: custodyStatusForRow(row),
          daysInCustody: String(days),
          lastUpdate: noUpdate ? '2+ days ago' : row.waitingTime || 'Today',
          flag: flagParts.length > 0 ? flagParts.join(' / ') : 'OK',
        }
      })
    }

    case 'team_productivity': {
      const meProcessed = Number(data.teamCapacity[0]?.completedToday ?? 10)
      const podProcessed = Number(data.teamCapacity[1]?.completedToday ?? 12)
      const members = [
        {
          id: 'prod-docs-1',
          teamMember: data.consultantName || 'Ops executive',
          team: 'Docs',
          processed: Math.max(8, meProcessed),
        },
        {
          id: 'prod-ops-1',
          teamMember: 'Ops pod lead',
          team: 'Ops',
          processed: Math.max(6, podProcessed),
        },
        {
          id: 'prod-ops-2',
          teamMember: 'Ops associate',
          team: 'Ops',
          processed: 9,
        },
        {
          id: 'prod-sub-1',
          teamMember: 'Submission desk',
          team: 'Submission',
          processed: 18,
        },
        {
          id: 'prod-sub-2',
          teamMember: 'Ground coordinator',
          team: 'Submission',
          processed: 4,
        },
      ]
      const benchmark = 15
      return members.map((member) => {
        const utilization = Math.round((member.processed / benchmark) * 100)
        return {
          id: member.id,
          teamMember: member.teamMember,
          team: member.team,
          applicationsProcessed: String(member.processed),
          benchmark: String(benchmark),
          utilization: `${utilization}%`,
          flag: utilizationFlag(utilization),
        }
      })
    }

    default:
      return []
  }
}

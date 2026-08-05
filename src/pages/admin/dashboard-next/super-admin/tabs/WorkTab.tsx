import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { sortManagementAlerts } from '../../shared/dashboard-intelligence/alerts'
import type { ManagementAlertRecord } from '../../shared/dashboard-intelligence'
import { SuperAdminSection } from '../components/SuperAdminChrome'
import { SuperAdminWorkListing } from '../components/SuperAdminWorkListing'
import type { SuperAdminDashboardTabProps, SuperAdminWorkRow } from '../types'

type WorkDeskId = 'risk' | 'marine' | 'finance' | 'accounts' | 'ops'

const WORK_DESKS: Array<{ value: WorkDeskId; label: string }> = [
  { value: 'risk', label: 'Risk alerts' },
  { value: 'marine', label: 'Joining-date risk' },
  { value: 'finance', label: 'Finance exceptions' },
  { value: 'accounts', label: 'Key accounts' },
  { value: 'ops', label: 'Ops queue' },
]

const SEVERITY_PRIORITY: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  warning: 'High',
  medium: 'Medium',
  info: 'Medium',
  low: 'Low',
  success: 'Low',
}

function isManagementRecord(
  alert: ManagementAlertRecord | { severity: string; title: string },
): alert is ManagementAlertRecord {
  return 'businessImpact' in alert || 'financialImpact' in alert || 'affectedSegment' in alert
}

function priorityRank(priority: string): number {
  if (priority === 'Critical') return 0
  if (priority === 'High') return 1
  if (priority === 'Medium') return 2
  return 3
}

function sortWorkRows(rows: SuperAdminWorkRow[]): SuperAdminWorkRow[] {
  return [...rows].sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
}

function buildDeskRows(
  desk: WorkDeskId,
  data: SuperAdminDashboardTabProps['data'],
  managementAlerts: SuperAdminDashboardTabProps['managementAlerts'],
): SuperAdminWorkRow[] {
  switch (desk) {
    case 'risk': {
      const raw = managementAlerts?.length ? managementAlerts : data.managementAlerts
      const managementRows: SuperAdminWorkRow[] = (() => {
        if (raw.length && isManagementRecord(raw[0] as ManagementAlertRecord)) {
          return sortManagementAlerts(raw as ManagementAlertRecord[], 'severity').map((alert) => ({
            id: alert.id,
            primary: alert.title,
            secondary: [
              alert.description,
              alert.financialImpact ? `Impact ${alert.financialImpact}` : null,
              alert.count != null ? `${alert.count} affected` : null,
              alert.recommendedAction,
            ]
              .filter(Boolean)
              .join(' · '),
            category: alert.affectedSegment ?? 'Management',
            status: alert.severity,
            value: alert.financialImpact ?? (alert.count != null ? String(alert.count) : '—'),
            priority: SEVERITY_PRIORITY[alert.severity] ?? 'Medium',
          }))
        }
        return [...data.managementAlerts]
          .sort((a, b) => {
            const rank = (s: string) =>
              s === 'critical' ? 0 : s === 'warning' ? 1 : s === 'info' ? 2 : 3
            return rank(a.severity) - rank(b.severity)
          })
          .map((alert) => ({
            id: alert.id,
            primary: alert.title,
            secondary: alert.description ?? '',
            category: 'Management',
            status: alert.severity,
            value: alert.count != null ? String(alert.count) : '—',
            priority: SEVERITY_PRIORITY[alert.severity] ?? 'Medium',
          }))
      })()

      const fromRisk = data.riskAlerts.map((alert) => ({
        id: alert.id,
        primary: alert.title,
        secondary: alert.description ?? '',
        category: 'Risk',
        status: alert.severity,
        value: alert.count != null ? String(alert.count) : '—',
        priority: SEVERITY_PRIORITY[alert.severity] ?? 'Medium',
      }))

      return sortWorkRows([...managementRows, ...fromRisk])
    }
    case 'marine': {
      const ragPriority = (rag: string) =>
        rag === 'red' ? 'Critical' : rag === 'amber' ? 'High' : 'Medium'
      const joiningRows = [...data.marineTimeline]
        .sort((a, b) => {
          const rank = (r: string) => (r === 'red' ? 0 : r === 'amber' ? 1 : 2)
          return rank(a.ragStatus) - rank(b.ragStatus)
        })
        .map((row) => ({
          id: row.id,
          primary: `${row.vessel} · ${row.crew} crew`,
          secondary: `Sign-on ${row.signOn} · ${row.joiningPort} · ${row.visaStatus}`,
          category: 'Joining-date',
          status: row.priority,
          value: row.ragStatus.toUpperCase(),
          priority: ragPriority(row.ragStatus),
        }))
      const pendingRows = data.pendingCrewVisas.map((item) => ({
        id: item.id,
        primary: item.primary,
        secondary: item.secondary ?? 'Pending crew visa',
        category: 'Pending crew',
        status: String(item.value ?? 'Pending'),
        value: item.progress != null ? `${item.progress}%` : '—',
        priority:
          item.tone === 'negative' ? 'Critical' : item.tone === 'warning' ? 'High' : 'Medium',
      }))
      return sortWorkRows([...joiningRows, ...pendingRows])
    }
    case 'accounts':
      return sortWorkRows(
        data.clientRows.map((row) => ({
          id: row.id,
          primary: row.client,
          secondary: `${row.segment} · ${row.applications} apps`,
          category: row.segment,
          status: row.status,
          value: row.outstanding,
          priority: row.status.toLowerCase().includes('risk') ? 'High' : 'Medium',
        })),
      )
    case 'ops':
      return sortWorkRows(
        data.pipelineStages
          .filter((stage) => stage.count > 0)
          .map((stage) => ({
            id: stage.id,
            primary:
              APPLICATION_PIPELINE_STAGE_LABELS[stage.id as ApplicationPipelineStageId] ??
              stage.id,
            secondary: `${stage.delayedCount} delayed · ${stage.slaPercent}% SLA`,
            category: 'Pipeline',
            status: stage.delayedCount > 0 ? 'Delayed' : 'On track',
            value: String(stage.count),
            priority:
              stage.delayedCount > 5 ? 'High' : stage.delayedCount > 0 ? 'Medium' : 'Low',
          })),
      )
    case 'finance': {
      const creditAlerts = (
        managementAlerts?.length ? managementAlerts : data.managementAlerts
      ).filter((alert) => {
        const hay = `${alert.title} ${'description' in alert ? alert.description : ''}`.toLowerCase()
        return hay.includes('credit')
      })

      const creditRows: SuperAdminWorkRow[] = creditAlerts.map((alert) => {
        const mgmt = isManagementRecord(alert as ManagementAlertRecord)
          ? (alert as ManagementAlertRecord)
          : null
        return {
          id: alert.id,
          primary: alert.title.replace(/^Critical · |^High · |^Medium · |^Low · /i, ''),
          secondary: [
            'description' in alert ? alert.description : null,
            mgmt?.financialImpact ? `Impact ${mgmt.financialImpact}` : null,
            'Agreement credit limit',
          ]
            .filter(Boolean)
            .join(' · '),
          category: 'Credit limit',
          status: alert.severity,
          value: mgmt?.financialImpact ?? ('count' in alert && alert.count != null ? String(alert.count) : '—'),
          priority: SEVERITY_PRIORITY[alert.severity] ?? 'High',
        }
      })

      const ageingRows = data.ageingBuckets.map((bucket) => ({
        id: `age-${bucket.id}`,
        primary: `AR ${AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id}`,
        secondary: `${bucket.count ?? 0} invoices`,
        category: 'Ageing',
        status: bucket.id === '90-plus' ? 'Overdue' : 'Open',
        value: `₹${(bucket.amount / 10000000).toFixed(2)}Cr`,
        priority: bucket.id === '90-plus' ? 'Critical' : bucket.id === '61-90' ? 'High' : 'Medium',
      }))
      const blockedRow: SuperAdminWorkRow = {
        id: 'blocked-cash',
        primary: 'Cash blocked in Embassy / VFS fees',
        secondary: `${data.blockedCash.note} · ${data.blockedCash.expectedReleaseLabel}`,
        category: 'Blocked cash',
        status: 'Blocked',
        value: data.blockedCash.amount,
        priority: 'High',
      }
      const riskClients = data.highRiskClients.map((item) => ({
        id: item.id,
        primary: item.primary,
        secondary: item.secondary ?? 'High-risk receivable',
        category: 'Client AR',
        status: 'At risk',
        value: String(item.value ?? '—'),
        priority: 'High',
      }))
      return sortWorkRows([...creditRows, blockedRow, ...ageingRows, ...riskClients])
    }
    default:
      return []
  }
}

/**
 * Work — act-today desks. Ranked by severity · financial impact.
 * Includes credit-limit (Agreement) and joining-date risk. No VIP / complaint tickets.
 */
export function WorkTab({
  data,
  loading,
  onNavigate,
  onOpenClient,
  onOpenTab,
  managementAlerts,
}: SuperAdminDashboardTabProps) {
  const [desk, setDesk] = useState<WorkDeskId>('risk')

  const deskCounts = useMemo(() => {
    const counts: Record<WorkDeskId, number> = {
      risk:
        (managementAlerts?.length ? managementAlerts.length : data.managementAlerts.length) +
        data.riskAlerts.length,
      marine: data.marineTimeline.length + data.pendingCrewVisas.length,
      finance:
        1 +
        data.ageingBuckets.length +
        data.highRiskClients.length +
        (managementAlerts ?? data.managementAlerts).filter((a) =>
          `${a.title}`.toLowerCase().includes('credit'),
        ).length,
      accounts: data.clientRows.length,
      ops: data.pipelineStages.filter((s) => s.count > 0).length,
    }
    return counts
  }, [data, managementAlerts])

  const rows = useMemo(
    () => buildDeskRows(desk, data, managementAlerts),
    [desk, data, managementAlerts],
  )

  const tabItems = WORK_DESKS.map((d) => ({
    value: d.value,
    label: `${d.label} (${deskCounts[d.value]})`,
  }))

  const activeDesk = WORK_DESKS.find((d) => d.value === desk)

  const handleOpen = (row: SuperAdminWorkRow) => {
    switch (desk) {
      case 'accounts':
        onOpenClient?.(row.id)
        break
      case 'marine':
        onNavigate('/admin/application-management/marine')
        onOpenTab?.('segments')
        break
      case 'ops':
        onNavigate(`/admin/application-management/marine?tab=${encodeURIComponent(row.id)}`)
        break
      case 'finance':
        if (row.category === 'Credit limit') {
          onNavigate('/admin/dashboard-next/accounts')
        } else {
          onNavigate('/admin/finance/invoices')
        }
        break
      case 'risk':
        if (row.category === 'Marine' || row.primary.toLowerCase().includes('joining')) {
          onOpenTab?.('segments')
        } else if (
          row.category === 'Finance' ||
          row.primary.toLowerCase().includes('credit') ||
          row.primary.toLowerCase().includes('receivable')
        ) {
          onOpenTab?.('finance')
        } else {
          onNavigate('/admin/dashboard-next/operations')
        }
        break
      default:
        onNavigate('/admin/dashboard-next/operations')
    }
  }

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SuperAdminSection title="Work · act today">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={desk}
            onChange={(value) => setDesk(value as WorkDeskId)}
            variant="underline"
            size="sm"
            items={tabItems}
          />
        </Box>

        <SuperAdminWorkListing
          title={activeDesk?.label ?? 'Work'}
          rows={rows}
          loading={loading}
          openLabel="Open"
          onOpen={handleOpen}
          emptyTitle="No items on this desk"
          emptyDescription="Pick another desk or check back later."
        />
      </SuperAdminSection>
    </Stack>
  )
}

/** Sum of actionable Work desk items — used for workspace tab badge. */
export function getSuperAdminWorkBadgeCount(
  data: SuperAdminDashboardTabProps['data'],
  managementAlerts?: SuperAdminDashboardTabProps['managementAlerts'],
): number {
  const alerts = managementAlerts?.length ? managementAlerts : data.managementAlerts
  return (
    data.clientRows.length +
    alerts.length +
    data.riskAlerts.length +
    data.marineTimeline.length +
    data.pendingCrewVisas.length +
    data.pipelineStages.filter((s) => s.count > 0).length +
    1 +
    data.ageingBuckets.length +
    data.highRiskClients.length
  )
}

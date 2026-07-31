import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { SuperAdminWorkListing } from '../components/SuperAdminWorkListing'
import type { SuperAdminDashboardTabProps, SuperAdminWorkRow } from '../types'

type WorkDeskId = 'accounts' | 'risk' | 'marine' | 'ops' | 'finance'

const WORK_DESKS: Array<{ value: WorkDeskId; label: string }> = [
  { value: 'accounts', label: 'Key accounts' },
  { value: 'risk', label: 'Risk alerts' },
  { value: 'marine', label: 'Marine pending' },
  { value: 'ops', label: 'Ops queue' },
  { value: 'finance', label: 'Finance exceptions' },
]

function buildDeskRows(
  desk: WorkDeskId,
  data: SuperAdminDashboardTabProps['data'],
  managementAlerts: SuperAdminDashboardTabProps['managementAlerts'],
): SuperAdminWorkRow[] {
  switch (desk) {
    case 'accounts':
      return data.clientRows.map((row) => ({
        id: row.id,
        primary: row.client,
        secondary: `${row.segment} · ${row.applications} apps`,
        category: row.segment,
        status: row.status,
        value: row.outstanding,
        priority: row.status.toLowerCase().includes('risk') ? 'High' : 'Medium',
      }))
    case 'risk': {
      const alerts = managementAlerts?.length ? managementAlerts : data.managementAlerts
      const fromManagement = alerts.map((alert) => ({
        id: alert.id,
        primary: alert.title,
        secondary:
          'description' in alert && alert.description
            ? String(alert.description)
            : 'businessImpact' in alert
              ? String((alert as { businessImpact?: string }).businessImpact ?? '')
              : '',
        category: 'Management',
        status: alert.severity,
        value:
          'count' in alert && typeof (alert as { count?: number }).count === 'number'
            ? String((alert as { count: number }).count)
            : '—',
        priority:
          alert.severity === 'critical'
            ? 'Critical'
            : alert.severity === 'high' || alert.severity === 'warning'
              ? 'High'
              : 'Medium',
      }))
      const fromRisk = data.riskAlerts.map((alert) => ({
        id: alert.id,
        primary: alert.title,
        secondary: alert.description ?? '',
        category: 'Risk',
        status: alert.severity,
        value: alert.count != null ? String(alert.count) : '—',
        priority:
          alert.severity === 'critical'
            ? 'Critical'
            : alert.severity === 'warning'
              ? 'High'
              : 'Medium',
      }))
      return [...fromManagement, ...fromRisk]
    }
    case 'marine':
      return data.pendingCrewVisas.map((item) => ({
        id: item.id,
        primary: item.primary,
        secondary: item.secondary ?? '',
        category: 'Marine',
        status: String(item.value ?? 'Pending'),
        value: item.progress != null ? `${item.progress}%` : '—',
        priority:
          item.tone === 'negative' ? 'Critical' : item.tone === 'warning' ? 'High' : 'Medium',
      }))
    case 'ops':
      return data.pipelineStages
        .filter((stage) => stage.count > 0)
        .map((stage) => ({
          id: stage.id,
          primary:
            APPLICATION_PIPELINE_STAGE_LABELS[stage.id as ApplicationPipelineStageId] ?? stage.id,
          secondary: `${stage.delayedCount} delayed · ${stage.slaPercent}% SLA`,
          category: 'Pipeline',
          status: stage.delayedCount > 0 ? 'Delayed' : 'On track',
          value: String(stage.count),
          priority: stage.delayedCount > 5 ? 'High' : stage.delayedCount > 0 ? 'Medium' : 'Low',
        }))
    case 'finance': {
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
        primary: 'Cash blocked in visa fees',
        secondary: data.blockedCash.note,
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
      return [blockedRow, ...ageingRows, ...riskClients]
    }
    default:
      return []
  }
}

/** Work tab — executive desks across accounts, risk, marine, ops, finance. */
export function WorkTab({
  data,
  loading,
  onNavigate,
  onOpenClient,
  managementAlerts,
}: SuperAdminDashboardTabProps) {
  const [desk, setDesk] = useState<WorkDeskId>('accounts')

  const deskCounts = useMemo(() => {
    const counts: Record<WorkDeskId, number> = {
      accounts: data.clientRows.length,
      risk:
        (managementAlerts?.length ? managementAlerts.length : data.managementAlerts.length) +
        data.riskAlerts.length,
      marine: data.pendingCrewVisas.length,
      ops: data.pipelineStages.filter((s) => s.count > 0).length,
      finance: 1 + data.ageingBuckets.length + data.highRiskClients.length,
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
        break
      case 'ops':
        onNavigate(`/admin/application-management/marine?tab=${encodeURIComponent(row.id)}`)
        break
      case 'finance':
        onNavigate('/admin/finance/invoices')
        break
      default:
        onNavigate('/admin/dashboard-next/operations')
    }
  }

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
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
        description="Open the related module to act on the item."
        rows={rows}
        loading={loading}
        openLabel="Open"
        onOpen={handleOpen}
        emptyTitle="No items on this desk"
        emptyDescription="Pick another desk or check back later."
      />
    </Stack>
  )
}

/** Sum of actionable Work desk items — used for workspace tab badge. */
export function getSuperAdminWorkBadgeCount(
  data: SuperAdminDashboardTabProps['data'],
  managementAlerts?: SuperAdminDashboardTabProps['managementAlerts'],
): number {
  return (
    data.clientRows.length +
    (managementAlerts?.length ? managementAlerts.length : data.managementAlerts.length) +
    data.riskAlerts.length +
    data.pendingCrewVisas.length +
    data.pipelineStages.filter((s) => s.count > 0).length +
    1 +
    data.ageingBuckets.length +
    data.highRiskClients.length
  )
}

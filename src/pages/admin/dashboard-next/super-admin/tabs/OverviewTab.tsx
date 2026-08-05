import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { Building2, ClipboardList, HandCoins, LayoutDashboard, Users } from 'lucide-react'
import { RecentActivity, DASHBOARD_SPACING } from '../../shared'
import { SuperAdminSection } from '../components/SuperAdminChrome'
import { BusinessHealthSummary } from '../components/BusinessHealthSummary'
import { OperationalHealthSnapshot } from '../components/OperationalHealthSnapshot'
import { OverviewManagementAlerts } from '../components/OverviewManagementAlerts'
import { OverviewRevenueCollections } from '../components/OverviewRevenueCollections'
import type { SuperAdminDashboardTabProps } from '../types'

export const SA_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

/**
 * Overview — Executive Command Center (30-second health).
 * Hero KPI strip lives above the tab. Deep analytics live on other tabs.
 */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onOpenTab,
  onPipelineStageClick,
  managementAlerts,
}: SuperAdminDashboardTabProps) {
  const alertSource =
    managementAlerts && managementAlerts.length > 0
      ? managementAlerts
      : data.managementAlerts

  const activityItems = useMemo(
    () =>
      data.recentActivity.map((item) => {
        const badge = (item.badgeLabel ?? '').toLowerCase()
        let tab = 'work'
        if (badge.includes('finance') || badge.includes('accounts')) tab = 'finance'
        else if (
          badge.includes('ops') ||
          badge.includes('docs') ||
          badge.includes('marine') ||
          badge.includes('embassy')
        ) {
          tab = 'operations'
        } else if (badge.includes('client') || badge.includes('sales')) tab = 'clients'
        else if (badge.includes('risk')) tab = 'work'
        return {
          ...item,
          onClick: item.onClick ?? (() => onOpenTab?.(tab)),
        }
      }),
    [data.recentActivity, onOpenTab],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SuperAdminSection
        title="Performance & health"
        description="Gross vs collections and business health"
      >
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 8 }}>
            <OverviewRevenueCollections
              data={data}
              loading={loading}
              onDrillDown={() => onOpenTab?.('finance')}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <BusinessHealthSummary data={data} loading={loading} onOpenTab={onOpenTab} />
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection
        title="Risks & act today"
        description="Ops snapshot and management alerts"
      >
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 7 }}>
            <OperationalHealthSnapshot
              stages={data.pipelineStages}
              rejectedCount={data.operationsToday.rejectedToday}
              atRiskCount={
                data.executiveSummary.atRisk.total || data.operationsToday.slaBreaches
              }
              loading={loading}
              onOpenOperations={() => onOpenTab?.('operations')}
              onStageClick={(stageId) => {
                onPipelineStageClick?.(stageId)
                onOpenTab?.('operations')
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <OverviewManagementAlerts
              alerts={alertSource}
              loading={loading}
              onOpenWork={() => onOpenTab?.('work')}
              onOpenTab={onOpenTab}
            />
          </Grid>
        </Grid>
      </SuperAdminSection>

      <SuperAdminSection
        title="Recent activity"
        actionLabel="Open Work"
        onAction={() => onOpenTab?.('work')}
      >
        <Box sx={{ '& > *': { height: '100%' } }}>
          <RecentActivity
            title="Recent business activity"
            items={activityItems}
            loading={loading}
            onRetry={onRetry}
            maxItems={8}
            onShowMore={() => onOpenTab?.('work')}
          />
        </Box>
      </SuperAdminSection>
    </Stack>
  )
}

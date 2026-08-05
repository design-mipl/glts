import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { AlertTriangle, Building2, ClipboardList, HandCoins, LayoutDashboard, Users } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  AlertCenter,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import { SuperAdminExecutiveRow } from '../components/SuperAdminExecutiveRow'
import {
  SuperAdminInfographics,
  SuperAdminRevenueTrend,
} from '../components/SuperAdminInfographics'
import type { SuperAdminDashboardTabProps } from '../types'

export const SA_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

/** Overview — signal · revenue + alerts · slim mix strip · activity. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onOpenTab,
  managementAlerts,
}: SuperAdminDashboardTabProps) {
  const colors = usePublicBrandColors()

  const criticalAlerts = (managementAlerts?.length ? managementAlerts : data.managementAlerts).filter(
    (a) => a.severity === 'critical' || a.severity === 'high',
  ).length
  const slaBreaches = data.operationsToday.slaBreaches
  const blockedApps = data.blockedCash.applicationCount
  const atRiskClients = data.highRiskClients.length

  const signalParts = [
    criticalAlerts > 0 ? `${criticalAlerts} critical alerts` : null,
    slaBreaches > 0 ? `${slaBreaches} SLA breaches` : null,
    blockedApps > 0 ? `${data.blockedCash.amount} blocked cash` : null,
    atRiskClients > 0 ? `${atRiskClients} at-risk clients` : null,
  ].filter(Boolean)

  const moduleAlerts = (
    managementAlerts && managementAlerts.length > 0
      ? managementAlerts
      : data.managementAlerts
  )
    .slice(0, 5)
    .map((alert) => {
      const severity =
        alert.severity === 'critical'
          ? ('critical' as const)
          : alert.severity === 'high' || alert.severity === 'warning'
            ? ('warning' as const)
            : alert.severity === 'success'
              ? ('success' as const)
              : ('info' as const)
      return {
        id: alert.id,
        title: alert.title,
        description:
          'description' in alert && alert.description
            ? String(alert.description)
            : 'businessImpact' in alert
              ? String((alert as { businessImpact?: string }).businessImpact ?? '')
              : undefined,
        severity,
        onClick: () => onOpenTab?.('work'),
      }
    })

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {signalParts.length > 0 ? (
        <Box
          sx={{
            ...executiveCardLevel2Sx(colors),
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'error.main',
                color: 'error.contrastText',
                flexShrink: 0,
                opacity: 0.9,
              }}
            >
              <AlertTriangle size={16} />
            </Box>
            <Box minWidth={0}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                {signalParts.join(' · ')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Open Work desks for key accounts, risk, marine, ops, and finance exceptions.
              </Typography>
            </Box>
          </Stack>
          <Button
            label="Open Work"
            variant="outlined"
            size="sm"
            onClick={() => onOpenTab?.('work')}
          />
        </Box>
      ) : null}

      <SuperAdminExecutiveRow
        primaryVisualization={
          <SuperAdminRevenueTrend data={data} loading={loading} />
        }
        alerts={
          <AlertCenter
            title="Management alerts"
            subtitle="Risks · cash · SLA · clients"
            alerts={moduleAlerts}
            loading={loading}
            maxItems={5}
            onShowMore={() => onOpenTab?.('work')}
          />
        }
      />

      <SuperAdminInfographics data={data} loading={loading} onRetry={onRetry} />

      <RecentActivity
        title="Recent activity"
        items={data.recentActivity}
        loading={loading}
        onRetry={onRetry}
        maxItems={6}
      />
    </Stack>
  )
}

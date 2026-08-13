import { Box, Stack, Typography } from '@mui/material'
import { AlertTriangle, UserPlus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { RecentActivity, DASHBOARD_SPACING } from '../../shared'
import { PostSubmissionVisibility } from '../../shared/widgets/operations/ApplicationMarketInfographics'
import { VisaAnalyticsOverviewSnapshot } from '../analytics/VisaAnalyticsTab'
import {
  AdminInfographics,
  AdminWorkloadBySegment,
} from '../components/AdminInfographics'
import type { AdminDashboardTabProps } from '../types'
export { ACTION_ICONS, KPI_ICONS } from './overviewIcons'

export interface OverviewTabProps extends AdminDashboardTabProps {
  onOpenVisaAnalytics?: () => void
  onOpenTab?: (tabId: string) => void
}

/**
 * Overview story (aligned with Ops / Documentation):
 * 1. Signal strip — delayed · critical · unassigned
 * 2. Infographics — Queue ageing · market · workload
 * 3. Post-submission visibility + recent activity
 * 4. Visa performance snapshot (deep dive on Analytics)
 *
 * Funnel + Needs Immediate Attention live in the page executive row.
 */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenVisaAnalytics,
  onOpenTab,
}: OverviewTabProps) {
  const colors = usePublicBrandColors()
  const delayed = data.operationsHealth.delayedCases
  const critical = data.operationsHealth.criticalCases
  const unassigned = data.unassignedCount ?? 0

  const signalParts = [
    delayed > 0 ? `${delayed} delayed` : null,
    critical > 0 ? `${critical} critical` : null,
    unassigned > 0 ? `${unassigned} unassigned` : null,
  ].filter(Boolean)

  const openAssignment = () => onNavigate('/admin/assignment-priority/retail')
  const openOperations = () => onOpenTab?.('operations') ?? onNavigate('/admin/dashboard-next?tab=operations')

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
                bgcolor: unassigned > 0 || critical > 0 ? 'error.main' : 'warning.main',
                color: 'common.white',
                flexShrink: 0,
                opacity: 0.92,
              }}
            >
              {unassigned > 0 ? <UserPlus size={16} /> : <AlertTriangle size={16} />}
            </Box>
            <Box minWidth={0}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                {signalParts.join(' · ')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                {unassigned > 0
                  ? 'Open Assignment Priority to assign user, vendor, or passenger.'
                  : 'Review Operations for delayed cases, logistics, and joining-date risk.'}
              </Typography>
            </Box>
          </Stack>
          <Button
            label={unassigned > 0 ? 'Open assignment desk' : 'Open Operations'}
            variant="outlined"
            size="sm"
            onClick={unassigned > 0 ? openAssignment : openOperations}
          />
        </Box>
      ) : null}

      <AdminInfographics
        data={{
          opsQueueSnapshot: data.opsQueueSnapshot,
          topClients: data.topClients,
          topCountries: data.topCountries,
          submissionByJurisdiction: data.submissionByJurisdiction,
        }}
        loading={loading}
      />

      <AdminWorkloadBySegment
        data={{ opsQueueSnapshot: data.opsQueueSnapshot }}
        loading={loading}
      />

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={DASHBOARD_SPACING.field}
        alignItems="stretch"
      >
        <Box flex={1.2} minWidth={0} sx={{ '& > *': { height: '100%' } }}>
          <PostSubmissionVisibility data={data.visibilityFunnel} loading={loading} />
        </Box>
        <Box flex={1} minWidth={0} sx={{ '& > *': { height: '100%' } }}>
          <RecentActivity
            title="Recent activity"
            items={data.recentActivity}
            loading={loading}
            onRetry={onRetry}
            maxItems={6}
          />
        </Box>
      </Stack>

      <VisaAnalyticsOverviewSnapshot
        loading={loading}
        onOpenAnalytics={
          onOpenVisaAnalytics ?? (() => onNavigate('/admin/dashboard-next?tab=analytics'))
        }
      />
    </Stack>
  )
}

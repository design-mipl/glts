import { Box, Stack, Typography } from '@mui/material'
import { UserPlus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  AlertCenter,
  ApplicationPipeline,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import { OperationsExecutiveRow } from '../components/OperationsExecutiveRow'
import {
  OperationsInfographics,
  OperationsWorkloadBySegment,
} from '../components/OperationsInfographics'
import { ApplicationMarketInfographics, PostSubmissionVisibility } from '../../shared/widgets/operations/ApplicationMarketInfographics'
import type { OperationsDashboardTabProps } from '../types'
import { opsAssignmentPath } from '../utils/opsSegmentPaths'

/** Overview — alerts + pipeline, assignment signal deep-links to Assignment Priority. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
  onOpenTab,
}: OperationsDashboardTabProps) {
  const colors = usePublicBrandColors()
  const unassignedCount = data.assignmentRows.filter(
    (row) => row.assigneeKind === 'unassigned',
  ).length

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {unassignedCount > 0 ? (
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
              <UserPlus size={16} />
            </Box>
            <Box minWidth={0}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                {unassignedCount} unassigned
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Open Assignment Priority to assign user, vendor, or passenger.
              </Typography>
            </Box>
          </Stack>
          <Button
            label="Open assignment desk"
            variant="outlined"
            size="sm"
            onClick={() => onNavigate(opsAssignmentPath('retail'))}
          />
        </Box>
      ) : null}

      <OperationsExecutiveRow
        primaryVisualization={
          <ApplicationPipeline
            title="Queue status"
            subtitle="Same open-queue counts as the KPI strip (Delayed = re-uploads ready)"
            stages={data.myPipelineStages}
            loading={loading}
            onRetry={onRetry}
            onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
            card
          />
        }
        alerts={
          <AlertCenter
            title="Ops alerts"
            subtitle="Re-check · payment · Arrange Ticket/Insurance · assignment · ground"
            alerts={data.alerts.map((alert) => ({
              id: alert.id,
              title: alert.title,
              description: alert.description,
              severity: alert.severity,
              count: alert.count,
              onClick: () => onNavigate(alert.href),
            }))}
            loading={loading}
            maxItems={5}
            onShowMore={() => onOpenTab?.('work')}
          />
        }
      />

      <OperationsInfographics
        data={{
          queueMix: data.queueMix,
          assigneeMix: data.assigneeMix,
          ageingByQueue: data.ageingByQueue,
          workloadBySegment: data.workloadBySegment,
        }}
        loading={loading}
      />

      <ApplicationMarketInfographics
        topClients={data.topClients}
        topCountries={data.topCountries}
        submissionByJurisdiction={data.submissionByJurisdiction}
        loading={loading}
      />

      <OperationsWorkloadBySegment
        data={{
          queueMix: data.queueMix,
          assigneeMix: data.assigneeMix,
          ageingByQueue: data.ageingByQueue,
          workloadBySegment: data.workloadBySegment,
        }}
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
            items={data.myRecentActivity}
            loading={loading}
            onRetry={onRetry}
            maxItems={6}
          />
        </Box>
      </Stack>
    </Stack>
  )
}

import { Box, Stack, Typography } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  AlertCenter,
  ApplicationPipeline,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import { applicationPipelineStageHref } from '../../shared/config/applicationPipeline'
import { DocumentationExecutiveRow } from '../components/DocumentationExecutiveRow'
import {
  DocumentationInfographics,
  DocumentationWorkloadBySegment,
} from '../components/DocumentationInfographics'
import { PostSubmissionVisibility } from '../../shared/widgets/operations/ApplicationMarketInfographics'
import { getAlertWorkDesk } from '../data/documentationDashboardMock'
import type { DocumentationDashboardTabProps } from '../types'

/** Overview — signal · pipeline + alerts · infographics · workload · activity. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenTab,
  onOpenWorkDesk,
}: DocumentationDashboardTabProps) {
  const colors = usePublicBrandColors()

  const pendingQc = data.submissionPendingRows.filter((r) => r.qcOutcome === 'pending_qc').length
  const waitingOps = data.waitingOnOpsRows.length
  const paymentDue = data.pendingPaymentRows.length
  const breached = data.submissionPendingRows.filter((r) => r.slaStatus === 'breached').length

  const signalParts = [
    pendingQc > 0 ? `${pendingQc} Docs QC` : null,
    waitingOps > 0 ? `${waitingOps} Review Reupload` : null,
    paymentDue > 0 ? `${paymentDue} Pending Payment` : null,
    breached > 0 ? `${breached} SLA breached` : null,
  ].filter(Boolean)

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
                Open Work for Submission Pending, Pending Payment, Arrange Insurance, or Review Reupload.
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

      <DocumentationExecutiveRow
        primaryVisualization={
          <ApplicationPipeline
            title="Documentation pipeline"
            subtitle="AM stages — Docs owns Submission Pending & Pending Payment"
            stages={data.pipelineStages}
            loading={loading}
            onRetry={onRetry}
            onStageClick={(stageId) => onNavigate(applicationPipelineStageHref(stageId))}
            card
          />
        }
        alerts={
          <AlertCenter
            title="Critical alerts"
            subtitle="QC · awaiting client docs · correction with Ops · SLA"
            alerts={data.criticalAlerts.map((alert) => ({
              ...alert,
              onClick: () => onOpenWorkDesk?.(getAlertWorkDesk(alert.id)),
            }))}
            loading={loading}
            maxItems={6}
            onShowMore={() => onOpenTab?.('work')}
          />
        }
      />

      <DocumentationInfographics data={data} loading={loading} />

      <DocumentationWorkloadBySegment
        data={{ workloadBySegment: data.workloadBySegment }}
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
    </Stack>
  )
}

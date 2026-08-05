import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  ApplicationPipeline,
  MetricComparison,
  OperationsHealth,
  ProcessingTrend,
  TeamCapacity,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  ComparisonLayout,
  ExecutiveGrid,
  ExecutiveMetric,
  ProgressMetric,
  RankingList,
} from '../../shared/dashboard-ui-kit'
import type { SuperAdminDashboardTabProps, SuperAdminRankItem } from '../types'

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack spacing={0.5} sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {description}
          </Typography>
        ) : null}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

function toRankingItems(items: SuperAdminRankItem[]) {
  return items.map((item, index) => ({
    id: item.id,
    primary: item.primary,
    secondary: item.secondary,
    rank: index + 1,
    value: item.value,
    progress: item.progress,
  }))
}

export function OperationsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
}: SuperAdminDashboardTabProps) {
  const today = data.operationsToday

  const tatBars = useMemo(
    () => data.processingTimeByCountry.map((p) => ({ country: p.label, days: p.value })),
    [data.processingTimeByCountry],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Today’s operations
          </Typography>
          <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
            <ExecutiveMetric label="Received today" value={today.receivedToday} tone="info" />
            <ExecutiveMetric label="Submitted today" value={today.submittedToday} tone="positive" />
            <ExecutiveMetric label="Collected today" value={today.collectedToday} tone="positive" />
            <ExecutiveMetric label="Rejected today" value={today.rejectedToday} tone="negative" />
          </ExecutiveGrid>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ExecutiveGrid columns={3} spacing={DASHBOARD_SPACING.field}>
          <ExecutiveMetric
            label="Pending with embassy"
            value={today.pendingEmbassy}
            tone="warning"
          />
          <ExecutiveMetric
            label="Pending client documents"
            value={today.pendingClientDocuments}
            tone="warning"
          />
          <ExecutiveMetric label="SLA breaches" value={today.slaBreaches} tone="negative" />
        </ExecutiveGrid>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <OperationsHealth
          metrics={data.operationsHealth}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ApplicationPipeline
          stages={data.pipelineStages}
          loading={loading}
          onRetry={onRetry}
          onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Avg TAT by country" description="Days · network sample">
          <BarChart
            data={tatBars}
            xKey="country"
            height={220}
            barSize={16}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'days', label: 'Days' }]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProcessingTrend
          title="Processing trend"
          points={data.processingTrend}
          loading={loading}
          onRetry={onRetry}
          secondaryLabel="Completed"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          {data.staffProductivity.map((item) => (
            <ProgressMetric
              key={item.id}
              label={item.label}
              value={item.value}
              helperText={item.helperText}
              loading={loading}
            />
          ))}
        </ExecutiveGrid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ComparisonLayout
          left={
            <RankingList
              title="Department leaderboard"
              items={toRankingItems(data.staffLeaderboard)}
              loading={loading}
            />
          }
          right={
            <TeamCapacity
              rows={data.teamCapacity}
              loading={loading}
              onRetry={onRetry}
              onViewAll={() => onNavigate('/admin/user-management/teams')}
            />
          }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MetricComparison
          title="Working signals"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}

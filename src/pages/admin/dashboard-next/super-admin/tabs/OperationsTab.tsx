import { Grid, Stack, Typography } from '@mui/material'
import {
  ApplicationPipeline,
  MetricComparison,
  OperationsHealth,
  ProcessingTrend,
  RecentActivity,
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
        <BranchLikeCountryTat
          title="Avg processing time by country"
          subtitle="Days · sample network"
          points={data.processingTimeByCountry}
          loading={loading}
        />
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
              onViewAll={() => onNavigate('/admin/access/teams')}
            />
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MetricComparison
          title="Working signals"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <RecentActivity
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}

function BranchLikeCountryTat({
  title,
  subtitle,
  points,
  loading,
}: {
  title: string
  subtitle: string
  points: SuperAdminDashboardTabProps['data']['processingTimeByCountry']
  loading?: boolean
}) {
  return (
    <RankingList
      title={title}
      subtitle={subtitle}
      loading={loading}
      items={points.map((point, index) => ({
        id: point.id,
        primary: point.label,
        rank: index + 1,
        value: `${point.value}d`,
        progress: Math.min(100, Math.round((point.value / 12) * 100)),
      }))}
    />
  )
}

import { Stack, Typography } from '@mui/material'
import {
  ApplicationPipeline,
  CollectionSummary,
  MarineTimeline,
  MetricComparison,
  OperationsHealth,
  PassportJourney,
  RecentActivity,
  RiskOverview,
  DASHBOARD_SPACING,
} from '../../shared'
import { ComparisonLayout, RankingList } from '../../shared/dashboard-ui-kit'
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

/** Marine story — primary vertical intelligence (live). */
export function MarineTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
}: SuperAdminDashboardTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <MetricComparison
        title="Marine commercial KPIs"
        metrics={data.marineMetrics}
        loading={loading}
        onRetry={onRetry}
      />

      <MarineTimeline
        title="Joining date & crew risk"
        subtitle="Vessel sign-on pressure — act on red / amber first"
        rows={data.marineTimeline}
        loading={loading}
        onRetry={onRetry}
        onViewAll={() => onNavigate('/admin/application-management/marine')}
      />

      <ComparisonLayout
        left={
          <RankingList
            title="Applications by shipping company"
            items={toRankingItems(data.marineByCompany)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title="Applications by country"
            items={toRankingItems(data.marineByCountry)}
            loading={loading}
          />
        }
      />

      <ComparisonLayout
        left={
          <RankingList
            title="Pending crew visas"
            items={toRankingItems(data.pendingCrewVisas)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title="Top marine clients"
            items={toRankingItems(data.topMarineClients)}
            loading={loading}
          />
        }
      />

      <ComparisonLayout
        left={
          <OperationsHealth
            title="Marine operations health"
            metrics={data.operationsHealth}
            loading={loading}
            onRetry={onRetry}
          />
        }
        right={
          <ApplicationPipeline
            title="Marine application pipeline"
            stages={data.pipelineStages}
            loading={loading}
            onRetry={onRetry}
            onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
          />
        }
      />

      <ComparisonLayout
        left={
          <PassportJourney
            title="Passport journey"
            stages={data.passportJourney.stages}
            journeyStatus={data.passportJourney.journeyStatus}
            eta={data.passportJourney.eta}
            trackingNumber={data.passportJourney.trackingNumber}
            courier={data.passportJourney.courier}
            loading={loading}
            onRetry={onRetry}
          />
        }
        right={
          <RiskOverview
            title="Marine & embassy alerts"
            alerts={data.riskAlerts}
            loading={loading}
            onRetry={onRetry}
            onShowMore={() => onNavigate('/admin/application-management/marine')}
          />
        }
      />

      <ComparisonLayout
        left={
          <CollectionSummary
            title="Marine collections"
            data={data.collectionSummary}
            loading={loading}
            onRetry={onRetry}
          />
        }
        right={
          <RecentActivity
            title="Marine activity"
            items={data.recentActivity}
            loading={loading}
            onRetry={onRetry}
            maxItems={5}
          />
        }
      />

      <Typography variant="caption" color="text.secondary">
        Marine revenue & approval rate are in the KPI row above · joining-date risk is the primary
        action surface.
      </Typography>
    </Stack>
  )
}

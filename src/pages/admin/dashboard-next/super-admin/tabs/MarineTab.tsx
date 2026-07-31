import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
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
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
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

/** Marine story — primary vertical intelligence (live) + multi-color charts. */
export function MarineTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
}: SuperAdminDashboardTabProps) {
  const companyBars = useMemo(
    () =>
      data.marineByCompany.map((item) => ({
        company: item.primary.length > 16 ? `${item.primary.slice(0, 14)}…` : item.primary,
        score: item.progress ?? 0,
      })),
    [data.marineByCompany],
  )

  const countrySlices = useMemo(
    () =>
      data.marineByCountry.map((item, index) => ({
        key: item.id,
        label: item.primary,
        value: item.progress ?? (Number(item.value) || 1),
        color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
      })),
    [data.marineByCountry],
  )
  const countryTotal = countrySlices.reduce((sum, s) => sum + s.value, 0)

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <MetricComparison
        title="Marine commercial KPIs"
        metrics={data.marineMetrics}
        loading={loading}
        onRetry={onRetry}
      />

      <Grid container spacing={DASHBOARD_SPACING.field}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartPanel title="By shipping company" description="Application pressure score">
            <BarChart
              data={companyBars}
              xKey="company"
              height={220}
              barSize={16}
              showLegend={false}
              loading={loading}
              bars={[{ key: 'score', label: 'Score', color: SUPER_ADMIN_CHART_COLORS.blue }]}
            />
          </ChartPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartPanel title="By country" description="Marine destination mix">
            <DonutChart
              data={
                countrySlices.length > 0
                  ? countrySlices
                  : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
              }
              height={220}
              loading={loading}
              centerLabel="mix"
              centerValue={String(countryTotal)}
            />
          </ChartPanel>
        </Grid>
      </Grid>

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

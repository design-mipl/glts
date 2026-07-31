import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Anchor, Briefcase, Ship, Store } from 'lucide-react'
import { BarChart, DonutChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  BranchPerformance,
  ProcessingTrend,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  ComparisonLayout,
  ExecutiveGrid,
  RankingList,
  SegmentCard,
} from '../../shared/dashboard-ui-kit'
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
import type { SuperAdminDashboardTabProps, SuperAdminRankItem, SuperAdminSegmentCard } from '../types'

const SEGMENT_ICONS = {
  marine: <Ship size={20} />,
  corporate: <Briefcase size={20} />,
  retail: <Store size={20} />,
  b2b: <Anchor size={20} />,
} as const

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

function SegmentMetrics({ segment }: { segment: SuperAdminSegmentCard }) {
  const rows: Array<[string, string]> = [
    ['Cost', segment.cost],
    ['Gross margin', segment.grossMarginPercent],
    ['Approval', segment.approvalPercent],
    ['Avg TAT', segment.avgTat],
    ['Outstanding', segment.outstanding],
    ['Clients', segment.activeClients],
    ['Pipeline', segment.pipelineValue],
  ]
  if (segment.repeatBusinessPercent) {
    rows.push(['Repeat', segment.repeatBusinessPercent])
  }
  if (segment.winRate) {
    rows.push(['Win rate', segment.winRate])
  }

  return (
    <Stack spacing={1.25}>
      <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.4 }}>
        {segment.revenue}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {segment.applications} · {segment.growthLabel}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0.75,
        }}
      >
        {rows.map(([label, value]) => (
          <Box key={label}>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}
            >
              {label}
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {segment.insight}
      </Typography>
    </Stack>
  )
}

/** Business story — revenue, rich segment cards, multi-color mix charts, growth drivers. */
export function BusinessTab({ data, loading, onRetry }: SuperAdminDashboardTabProps) {
  const segmentSlices = useMemo(
    () =>
      data.businessSegments.map((slice, index) => ({
        key: slice.id,
        label: slice.label,
        value: slice.value,
        color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
      })),
    [data.businessSegments],
  )
  const segmentTotal = segmentSlices.reduce((sum, s) => sum + s.value, 0)

  const countryBars = useMemo(
    () => data.countryDistribution.map((s) => ({ country: s.label, share: s.value })),
    [data.countryDistribution],
  )

  const visaBars = useMemo(
    () => data.visaDistribution.map((s) => ({ visa: s.label, share: s.value })),
    [data.visaDistribution],
  )

  const branchBars = useMemo(
    () => data.branchPerformance.map((b) => ({ branch: b.label, score: b.value })),
    [data.branchPerformance],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <ProcessingTrend
        title="Monthly revenue trend"
        subtitle="₹ Cr · last 12 months · vs collections"
        points={data.revenueTrend}
        secondaryLabel="Collected"
        loading={loading}
        onRetry={onRetry}
      />

      <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
        {data.segmentCards.map((segment) => (
          <SegmentCard
            key={segment.id}
            icon={SEGMENT_ICONS[segment.id] as ReactNode}
            title={segment.label}
            subtitle={segment.status === 'live' ? 'Live' : 'Preview · sample data'}
            hoverable={segment.status === 'live'}
          >
            <SegmentMetrics segment={segment} />
          </SegmentCard>
        ))}
      </ExecutiveGrid>

      <Grid container spacing={DASHBOARD_SPACING.field}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <ChartPanel title="Revenue by segment" description="Share of network volume">
            <DonutChart
              data={
                segmentSlices.length > 0
                  ? segmentSlices
                  : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
              }
              height={220}
              loading={loading}
              centerLabel="%"
              centerValue={String(segmentTotal)}
            />
          </ChartPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <ChartPanel title="By country" description="Destination mix">
            <BarChart
              data={countryBars}
              xKey="country"
              height={220}
              barSize={14}
              showLegend={false}
              loading={loading}
              bars={[{ key: 'share', label: 'Share %', color: SUPER_ADMIN_CHART_COLORS.blue }]}
            />
          </ChartPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <ChartPanel title="By visa type" description="Product mix">
            <BarChart
              data={visaBars}
              xKey="visa"
              height={220}
              barSize={14}
              showLegend={false}
              loading={loading}
              bars={[{ key: 'share', label: 'Share %', color: SUPER_ADMIN_CHART_COLORS.violet }]}
            />
          </ChartPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <ChartPanel title="Branch contribution" description="Composite score">
            <BarChart
              data={branchBars}
              xKey="branch"
              height={220}
              barSize={14}
              showLegend={false}
              loading={loading}
              bars={[{ key: 'score', label: 'Score', color: SUPER_ADMIN_CHART_COLORS.teal }]}
            />
          </ChartPanel>
        </Grid>
      </Grid>

      <ComparisonLayout
        left={
          <BranchPerformance
            title="Branch detail"
            branches={data.branchPerformance}
            loading={loading}
            onRetry={onRetry}
          />
        }
        right={
          <RankingList
            title="Top 10 revenue clients"
            items={toRankingItems(data.topRevenueClients)}
            loading={loading}
          />
        }
      />
      <ComparisonLayout
        left={
          <RankingList
            title="Fastest growing clients"
            items={toRankingItems(data.fastestGrowingClients)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title="Margin by vertical"
            items={toRankingItems(data.marginByVertical)}
            loading={loading}
          />
        }
      />
    </Stack>
  )
}

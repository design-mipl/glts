import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import {
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { BarChart, DonutChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import {
  AgeingAnalysis,
  CollectionSummary,
  MetricComparison,
  NotificationPanel,
  ProcessingTrend,
  QuickActions,
  RevenueSnapshot,
  DASHBOARD_SPACING,
} from '../../shared'
import { PredictivePanel } from '../../shared/dashboard-intelligence'
import {
  ComparisonLayout,
  ExecutiveGrid,
  HighlightCard,
  RankingList,
} from '../../shared/dashboard-ui-kit'
import { SUPER_ADMIN_CHART_COLORS } from '../data/superAdminChartColors'
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

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
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

export function FinanceTab({
  data,
  loading,
  onRetry,
  onNavigate,
  forecasts = [],
}: SuperAdminDashboardTabProps) {
  const cash = data.cashPosition

  const ageingSlices = useMemo(() => {
    const colors = [
      SUPER_ADMIN_CHART_COLORS.green,
      SUPER_ADMIN_CHART_COLORS.amber,
      SUPER_ADMIN_CHART_COLORS.coral,
      SUPER_ADMIN_CHART_COLORS.navy,
    ]
    return data.ageingBuckets.map((bucket, index) => ({
      key: bucket.id,
      label: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
      value: Math.round(bucket.amount / 100000),
      color: colors[index % colors.length],
    }))
  }, [data.ageingBuckets])
  const ageingTotal = ageingSlices.reduce((sum, s) => sum + s.value, 0)

  const marginBars = useMemo(
    () =>
      data.marginByVertical.map((item) => ({
        vertical: item.primary,
        margin: Number.parseFloat(String(item.value).replace('%', '')) || 0,
      })),
    [data.marginByVertical],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          <HighlightCard
            title="Bank balance"
            highlight={cash.bankBalance}
            highlightLabel="On hand"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Mock cash position
            </Typography>
          </HighlightCard>
          <HighlightCard
            title="Blocked in visa fees"
            highlight={cash.blockedInVisaFees}
            highlightLabel="Embassy / VFS"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Pending pass-through
            </Typography>
          </HighlightCard>
          <HighlightCard
            title="Expected collections"
            highlight={cash.expectedCollections}
            highlightLabel="Near-term AR"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Due window
            </Typography>
          </HighlightCard>
          <HighlightCard
            title="Available funds"
            highlight={cash.availableFunds}
            highlightLabel="Net cash position"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Bank − blocked − expected buffer
            </Typography>
          </HighlightCard>
        </ExecutiveGrid>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="AR ageing" description="Outstanding ₹L by bucket">
          <DonutChart
            data={
              ageingSlices.length > 0
                ? ageingSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={220}
            loading={loading}
            centerLabel="₹L"
            centerValue={String(ageingTotal)}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Gross margin by vertical" description="GP % this month">
          <BarChart
            data={marginBars}
            xKey="vertical"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'margin', label: 'Margin %', color: SUPER_ADMIN_CHART_COLORS.green }]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <CollectionSummary
          data={data.collectionSummary}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot data={data.revenueSnapshot} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AgeingAnalysis buckets={data.ageingBuckets} loading={loading} onRetry={onRetry} />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <MetricComparison
          title="Finance KPIs"
          metrics={data.financeMetricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <ProcessingTrend
          title="Revenue vs collections"
          points={data.processingTrend}
          secondaryLabel="Collected"
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      {forecasts.length > 0 ? (
        <Grid size={{ xs: 12 }}>
          <PredictivePanel
            title="Revenue forecast"
            subtitle="30 / 60 / 90 day scenarios (heuristic)"
            models={forecasts}
            loading={loading}
          />
        </Grid>
      ) : null}

      <Grid size={{ xs: 12 }}>
        <ComparisonLayout
          left={
            <RankingList
              title="High margin clients"
              items={toRankingItems(data.highMarginClients)}
              loading={loading}
            />
          }
          right={
            <RankingList
              title="Low margin / credit pressure"
              items={toRankingItems(data.lowMarginClients)}
              loading={loading}
            />
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <NotificationPanel
          title="Finance notices"
          items={data.financeNotifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-accounts-next', 'qa-finance', 'qa-admin-next'].includes(action.id),
            )
            .map((action) => ({
              id: action.id,
              title: action.title,
              description: action.description,
              badge: action.badge,
              icon: ACTION_ICONS[action.id],
              onClick: () => onNavigate(action.href),
            }))}
        />
      </Grid>
    </Grid>
  )
}

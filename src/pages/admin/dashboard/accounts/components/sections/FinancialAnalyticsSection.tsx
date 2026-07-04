import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { BarChart, ChartCard, DonutChart, LineChart } from '@/design-system/UIComponents'
import { useChartTheme } from '@/design-system/UIComponents/Charts/utils/chartTheme'
import { BaseCard } from '@/design-system/UIComponents'
import type {
  AgeingBucketSlice,
  CollectionPerformanceSnapshot,
  RevenueOverviewSnapshot,
} from '../../data/accountsDashboardMock'

function RevenueStatRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Stack>
  )
}

function RevenueOverviewWidget({ snapshot }: { snapshot: RevenueOverviewSnapshot }) {
  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Revenue overview
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Billing performance across periods
        </Typography>
      </Box>
      <Stack spacing={1.25} sx={{ px: 2, pb: 2 }}>
        <RevenueStatRow label="Today" value={snapshot.today} />
        <RevenueStatRow label="Week" value={snapshot.week} />
        <RevenueStatRow label="Month" value={snapshot.month} />
        <RevenueStatRow label="Month to date" value={snapshot.monthToDate} />
        <RevenueStatRow label="Year to date" value={snapshot.yearToDate} />
      </Stack>
    </BaseCard>
  )
}

function CollectionPerformanceWidget({ snapshot }: { snapshot: CollectionPerformanceSnapshot }) {
  const theme = useTheme()
  const ct = useChartTheme()
  const donutData = [
    { key: 'collected', label: 'Collected', value: snapshot.collectionPercent, color: theme.palette.success.main },
    { key: 'outstanding', label: 'Outstanding', value: snapshot.outstandingPercent, color: theme.palette.warning.main },
    { key: 'overdue', label: 'Overdue', value: snapshot.overduePercent, color: theme.palette.error.main },
  ]

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Collection performance
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Collection %, outstanding %, and monthly trend
        </Typography>
      </Box>
      <Box sx={{ px: 2, pb: 1 }}>
        <DonutChart
          data={donutData}
          height={140}
          centerValue={`${snapshot.collectionPercent}%`}
          centerLabel="Collected"
        />
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <ChartCard title="Monthly trend" subtitle="Collection rate">
          <LineChart
            data={snapshot.monthlyTrend}
            lines={[{ key: 'value', label: 'Collection %', color: ct.colors[0] }]}
            xKey="label"
            height={120}
            showLegend={false}
          />
        </ChartCard>
      </Box>
    </BaseCard>
  )
}

function AgeingAnalysisWidget({ slices }: { slices: AgeingBucketSlice[] }) {
  const theme = useTheme()
  const barData = slices.map((slice) => ({
    label: slice.label,
    count: slice.value,
  }))

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Ageing analysis
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Outstanding receivables by ageing bucket
        </Typography>
      </Box>
      <Box sx={{ px: 2, pb: 1 }}>
        <BarChart
          data={barData}
          bars={[{ key: 'count', label: 'Invoices', color: theme.palette.primary.main }]}
          xKey="label"
          height={160}
          showLegend={false}
        />
      </Box>
      <Stack spacing={0.75} sx={{ px: 2, pb: 2 }}>
        {slices.map((slice) => (
          <Stack key={slice.key} direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {slice.label}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }}
            >
              {slice.value} invoices · {slice.amount}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </BaseCard>
  )
}

export interface FinancialAnalyticsSectionProps {
  revenueOverview: RevenueOverviewSnapshot
  collectionPerformance: CollectionPerformanceSnapshot
  ageingAnalysis: AgeingBucketSlice[]
}

export function FinancialAnalyticsSection({
  revenueOverview,
  collectionPerformance,
  ageingAnalysis,
}: FinancialAnalyticsSectionProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <RevenueOverviewWidget snapshot={revenueOverview} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <CollectionPerformanceWidget snapshot={collectionPerformance} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <AgeingAnalysisWidget slices={ageingAnalysis} />
      </Grid>
    </Grid>
  )
}

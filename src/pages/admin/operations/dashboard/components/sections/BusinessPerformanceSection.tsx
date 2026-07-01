import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { BarChart, ChartCard, DonutChart } from '@/design-system/UIComponents'
import { useChartTheme } from '@/design-system/UIComponents/Charts/utils/chartTheme'
import { BaseCard } from '@/design-system/UIComponents'
import type { DistributionSlice, RevenueSnapshot } from '../../data/operationsDashboardMock'

function RevenueStatCard({ label, value }: { label: string; value: string }) {
  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
        >
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      </Box>
    </BaseCard>
  )
}

function DistributionChart({
  title,
  subtitle,
  slices,
}: {
  title: string
  subtitle: string
  slices: DistributionSlice[]
}) {
  const theme = useTheme()
  const ct = useChartTheme()
  const barData = slices.map((slice) => ({
    label: slice.label,
    value: slice.value,
  }))
  const donutData = slices.map((slice, i) => ({
    key: slice.key,
    label: slice.label,
    value: slice.value,
    color: ct.colors[i % ct.colors.length],
  }))
  const total = slices.reduce((sum, s) => sum + s.value, 0)

  return (
    <ChartCard title={title} subtitle={subtitle}>
      {slices.length <= 4 ? (
        <DonutChart
          data={donutData}
          height={160}
          centerValue={String(total)}
          centerLabel="Total"
        />
      ) : (
        <BarChart
          data={barData}
          bars={[{ key: 'value', label: 'Applications', color: theme.palette.primary.main }]}
          xKey="label"
          height={160}
          showLegend={false}
        />
      )}
    </ChartCard>
  )
}

export interface BusinessPerformanceSectionProps {
  revenueSnapshot: RevenueSnapshot
  countryDistribution: DistributionSlice[]
  visaTypeDistribution: DistributionSlice[]
  segmentDistribution: DistributionSlice[]
}

export function BusinessPerformanceSection({
  revenueSnapshot,
  countryDistribution,
  visaTypeDistribution,
  segmentDistribution,
}: BusinessPerformanceSectionProps) {
  const theme = useTheme()

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <BaseCard sx={{ height: '100%' }}>
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Revenue snapshot
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Billing performance across the organization
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <RevenueStatCard label="Revenue Today" value={revenueSnapshot.revenueToday} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <RevenueStatCard label="MTD Revenue" value={revenueSnapshot.mtdRevenue} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <RevenueStatCard label="YTD Revenue" value={revenueSnapshot.ytdRevenue} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseCard sx={{ height: '100%' }}>
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
                  >
                    Revenue vs Target
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      mt: 0.5,
                      color:
                        revenueSnapshot.revenueVsTarget >= 100
                          ? 'success.main'
                          : 'warning.main',
                    }}
                  >
                    {revenueSnapshot.revenueVsTarget}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'inline-block',
                      mt: 0.5,
                      px: 1,
                      py: 0.25,
                      borderRadius: '10px',
                      bgcolor: alpha(
                        revenueSnapshot.revenueVsTarget >= 100
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        0.12,
                      ),
                    }}
                  >
                    {revenueSnapshot.revenueVsTarget >= 100 ? 'On target' : 'Below target'}
                  </Typography>
                </Box>
              </BaseCard>
            </Grid>
          </Grid>
        </BaseCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ px: 0.5 }}>
            Application distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <DistributionChart
                title="By country"
                subtitle="Active pipeline"
                slices={countryDistribution}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DistributionChart
                title="By visa type"
                subtitle="Case mix"
                slices={visaTypeDistribution}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DistributionChart
                title="By segment"
                subtitle="Business channel"
                slices={segmentDistribution}
              />
            </Grid>
          </Grid>
        </Stack>
      </Grid>
    </Grid>
  )
}

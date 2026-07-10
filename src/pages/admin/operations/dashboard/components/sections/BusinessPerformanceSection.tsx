import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { BarChart, DonutChart } from '@/design-system/UIComponents'
import { useChartTheme } from '@/design-system/UIComponents/Charts/utils/chartTheme'
import { Badge } from '@/design-system/UIComponents'
import {
  EXECUTIVE_CHART_HEIGHT,
  ExecutiveChartPanel,
  ExecutiveSectionHeader,
  executiveCardLevel2Sx,
} from '@/pages/admin/dashboard/components'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { DistributionSlice, RevenueSnapshot } from '../../data/operationsDashboardMock'

function RevenueKpiBlock({
  label,
  value,
  trend,
  statusLabel,
  statusColor,
}: {
  label: string
  value: string
  trend: number
  statusLabel: string
  statusColor: 'success' | 'warning' | 'info'
}) {
  const colors = usePublicBrandColors()
  const isUp = trend >= 0
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight

  return (
    <Box
      sx={{
        p: 1.75,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        height: '100%',
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.35 }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mt: 0.75 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 900, color: colors.navy, lineHeight: 1 }}>
          {value}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.25}>
          <TrendIcon size={14} color={isUp ? colors.greenDark : '#DC2626'} />
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: isUp ? colors.greenDark : '#DC2626' }}>
            {isUp ? '+' : ''}
            {trend}%
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ mt: 1 }}>
        <Badge label={statusLabel} color={statusColor} size="sm" />
      </Box>
    </Box>
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
  const barData = slices.map((slice) => ({ label: slice.label, value: slice.value }))
  const donutData = slices.map((slice, i) => ({
    key: slice.key,
    label: slice.label,
    value: slice.value,
    color: ct.colors[i % ct.colors.length],
  }))
  const total = slices.reduce((sum, s) => sum + s.value, 0)

  return (
    <ExecutiveChartPanel title={title} subtitle={subtitle}>
      {slices.length <= 4 ? (
        <DonutChart data={donutData} height={EXECUTIVE_CHART_HEIGHT - 20} centerValue={String(total)} centerLabel="Total" />
      ) : (
        <BarChart
          data={barData}
          bars={[{ key: 'value', label: 'Applications', color: theme.palette.primary.main }]}
          xKey="label"
          height={EXECUTIVE_CHART_HEIGHT - 20}
          showLegend={false}
        />
      )}
    </ExecutiveChartPanel>
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
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const onTarget = revenueSnapshot.revenueVsTarget >= 100

  return (
    <Box>
      <ExecutiveSectionHeader
        title="Revenue & application distribution"
        description="Billing performance and active pipeline mix across channels."
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ ...executiveCardLevel2Sx(colors), p: 2, height: '100%' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: colors.navy, mb: 0.25 }}>
              Revenue snapshot
            </Typography>
            <Typography sx={{ fontSize: 12, color: colors.textMuted, mb: 2 }}>
              Recognized billing and target attainment
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RevenueKpiBlock
                  label="Revenue today"
                  value={revenueSnapshot.revenueToday}
                  trend={6.7}
                  statusLabel="Above yesterday"
                  statusColor="success"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RevenueKpiBlock
                  label="MTD revenue"
                  value={revenueSnapshot.mtdRevenue}
                  trend={4.2}
                  statusLabel="On pace"
                  statusColor="info"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RevenueKpiBlock
                  label="YTD revenue"
                  value={revenueSnapshot.ytdRevenue}
                  trend={8.1}
                  statusLabel="Growing"
                  statusColor="success"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    bgcolor: alpha(onTarget ? theme.palette.success.main : theme.palette.warning.main, 0.08),
                    height: '100%',
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.35 }}>
                    Revenue vs target
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 900,
                      mt: 0.75,
                      color: onTarget ? 'success.main' : 'warning.main',
                    }}
                  >
                    {revenueSnapshot.revenueVsTarget}%
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Badge label={onTarget ? 'On target' : 'Below target'} color={onTarget ? 'success' : 'warning'} size="sm" />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <DistributionChart title="By country" subtitle="Active pipeline" slices={countryDistribution} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DistributionChart title="By visa type" subtitle="Case mix" slices={visaTypeDistribution} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DistributionChart title="By segment" subtitle="Business channel" slices={segmentDistribution} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

import { Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  BarChart,
  ChartCard,
  DonutChart,
  LineChart,
} from '@/design-system/UIComponents'
import { useChartTheme } from '@/design-system/UIComponents/Charts/utils/chartTheme'
import type { ChannelSlice, CountryChartRow } from '../utils/applyDashboardFilters'

export interface DashboardAnalyticsSectionProps {
  dailyTrend: { day: string; applications: number }[]
  countryBars: CountryChartRow[]
  channelSlices: ChannelSlice[]
}

export function DashboardAnalyticsSection({
  dailyTrend,
  countryBars,
  channelSlices,
}: DashboardAnalyticsSectionProps) {
  const theme = useTheme()
  const ct = useChartTheme()

  const donutData = channelSlices.map((slice, i) => ({
    key: slice.key,
    label: slice.label,
    value: slice.value,
    color: ct.colors[i % ct.colors.length],
  }))

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartCard title="Daily application trend" subtitle="Last 7 days">
          <LineChart
            data={dailyTrend}
            lines={[{ key: 'applications', label: 'Applications', color: theme.palette.primary.main }]}
            xKey="day"
            height={200}
            showLegend={false}
          />
        </ChartCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartCard title="Country-wise applications" subtitle="Active pipeline by destination">
          <BarChart
            data={countryBars}
            bars={[{ key: 'applications', label: 'Applications', color: theme.palette.primary.main }]}
            xKey="country"
            height={200}
            showLegend={false}
          />
        </ChartCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartCard title="Channel distribution" subtitle="Retail vs corporate vs marine">
          <DonutChart
            data={donutData}
            height={200}
            centerValue={String(channelSlices.reduce((sum, s) => sum + s.value, 0))}
            centerLabel="Total"
          />
        </ChartCard>
      </Grid>
    </Grid>
  )
}

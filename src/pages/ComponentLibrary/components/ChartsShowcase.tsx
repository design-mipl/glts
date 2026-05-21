import { Box, Typography, Grid } from '@mui/material'
import {
  LineChart, BarChart, AreaChart, PieChart, DonutChart,
  ScatterChart, RadarChart, FunnelChart, SparkLine, ChartCard,
} from '@/design-system/components'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const lineData = months.map((month, i) => ({
  month,
  revenue: 4000 + i * 800 + Math.round(Math.random() * 500),
  users: 2400 + i * 400 + Math.round(Math.random() * 300),
}))

const barData = months.map((month, i) => ({
  month,
  sales: 3000 + i * 500 + Math.round(Math.random() * 400),
  returns: 400 + i * 50 + Math.round(Math.random() * 100),
}))

const radarData = [
  { subject: 'Speed', a: 80, b: 65 },
  { subject: 'Design', a: 90, b: 70 },
  { subject: 'Quality', a: 70, b: 85 },
  { subject: 'Support', a: 85, b: 75 },
  { subject: 'Price', a: 60, b: 90 },
]

const pieData = [
  { key: 'direct', label: 'Direct', value: 400, color: '#6366F1' },
  { key: 'social', label: 'Social', value: 300, color: '#22C55E' },
  { key: 'email', label: 'Email', value: 250, color: '#F59E0B' },
  { key: 'organic', label: 'Organic', value: 200, color: '#EC4899' },
]

const funnelData = [
  { key: 'visited', label: 'Visited', value: 5000, color: '#6366F1' },
  { key: 'clicked', label: 'Clicked', value: 3200, color: '#7C3AED' },
  { key: 'cart', label: 'Added to Cart', value: 1800, color: '#EC4899' },
  { key: 'purchased', label: 'Purchased', value: 900, color: '#F59E0B' },
]

const scatterData = Array.from({ length: 20 }, (_) => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  z: Math.round(Math.random() * 30) + 10,
}))

const sparkData = [12, 18, 14, 22, 19, 27, 24, 30, 28, 35]

export function ChartsShowcase() {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* LineChart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Line Chart" subtitle="Revenue & Users over time">
            <LineChart
              data={lineData}
              lines={[
                { key: 'revenue', label: 'Revenue', color: '#6366F1' },
                { key: 'users', label: 'Users', color: '#22C55E' },
              ]}
              xKey="month"
              height={220}
            />
          </ChartCard>
        </Grid>

        {/* AreaChart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Area Chart" subtitle="Stacked area visualization">
            <AreaChart
              data={lineData}
              lines={[
                { key: 'revenue', label: 'Revenue', color: '#6366F1' },
                { key: 'users', label: 'Users', color: '#22C55E' },
              ]}
              xKey="month"
              height={220}
            />
          </ChartCard>
        </Grid>

        {/* BarChart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Bar Chart" subtitle="Sales & Returns by month">
            <BarChart
              data={barData}
              bars={[
                { key: 'sales', label: 'Sales', color: '#6366F1' },
                { key: 'returns', label: 'Returns', color: '#F59E0B' },
              ]}
              xKey="month"
              height={220}
            />
          </ChartCard>
        </Grid>

        {/* RadarChart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Radar Chart" subtitle="Product comparison">
            <RadarChart
              data={radarData}
              radars={[
                { key: 'a', label: 'Product A', color: '#6366F1' },
                { key: 'b', label: 'Product B', color: '#EC4899' },
              ]}
              angleKey="subject"
              height={220}
            />
          </ChartCard>
        </Grid>

        {/* PieChart */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ChartCard title="Pie Chart" subtitle="Traffic sources">
            <PieChart data={pieData} height={220} />
          </ChartCard>
        </Grid>

        {/* DonutChart */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ChartCard title="Donut Chart" subtitle="Traffic sources">
            <DonutChart data={pieData} height={220} centerValue="1,150" centerLabel="Total" />
          </ChartCard>
        </Grid>

        {/* FunnelChart */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ChartCard title="Funnel Chart" subtitle="Conversion funnel">
            <FunnelChart data={funnelData} height={220} />
          </ChartCard>
        </Grid>

        {/* ScatterChart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Scatter Chart" subtitle="Distribution plot">
            <ScatterChart data={scatterData} height={220} />
          </ChartCard>
        </Grid>

        {/* SparkLine */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="SparkLine" subtitle="Inline mini charts">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: 80 }}>Revenue</Typography>
                <SparkLine data={sparkData} color="#6366F1" width={200} height={40} />
                <Typography variant="body2" fontWeight={600}>+24%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: 80 }}>Users</Typography>
                <SparkLine data={[...sparkData].reverse()} color="#22C55E" width={200} height={40} />
                <Typography variant="body2" fontWeight={600}>+8%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: 80 }}>Tickets</Typography>
                <SparkLine data={[18, 22, 16, 28, 14, 20, 12, 18, 10, 14]} color="#F59E0B" width={200} height={40} />
                <Typography variant="body2" fontWeight={600}>-12%</Typography>
              </Box>
            </Box>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  )
}


import { Box, Typography, Grid } from '@mui/material'
import {
  KPIBlock, ProgressRing, Heatmap, Timeline,
  GaugeChart, TreeMap, ComparisonBar, TrendIndicator, Divider,
} from '@/design-system/UIComponents'

const timelineItems = [
  { id: '1', title: 'Project kickoff', description: 'Initial planning meeting', date: new Date('2024-01-15'), status: 'completed' as const },
  { id: '2', title: 'Design phase', description: 'UI/UX wireframes', date: new Date('2024-02-01'), status: 'completed' as const },
  { id: '3', title: 'Development', description: 'Frontend & backend build', date: new Date('2024-03-01'), status: 'active' as const },
  { id: '4', title: 'QA Testing', description: 'Quality assurance', date: new Date('2024-04-01'), status: 'pending' as const },
  { id: '5', title: 'Launch', description: 'Public release', date: new Date('2024-05-01'), status: 'pending' as const },
]

// Heatmap needs ISO date strings
const today = new Date()
const heatmapData = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(today)
  d.setDate(d.getDate() - (89 - i))
  return {
    date: d.toISOString().slice(0, 10),
    value: Math.random(),
  }
})

const treeMapData = [
  { name: 'Engineering', value: 420, color: '#6366F1' },
  { name: 'Marketing', value: 280, color: '#22C55E' },
  { name: 'Sales', value: 350, color: '#F59E0B' },
  { name: 'Support', value: 180, color: '#EC4899' },
  { name: 'Design', value: 240, color: '#06B6D4' },
]

export function InfographicsShowcase() {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* KPIBlock */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>KPIBlock</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPIBlock label="Total Users" value="12,480" delta={12.4} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPIBlock label="Revenue" value="$48.2K" delta={8.1} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPIBlock label="Growth" value="23.5%" delta={-2.3} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPIBlock label="Orders" value="1,024" delta={5.7} deltaLabel="vs last month" />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ProgressRing & GaugeChart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ProgressRing</Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <ProgressRing value={72} label="Storage" size={100} showValue />
            <ProgressRing value={45} label="CPU" size={100} showValue />
            <ProgressRing value={91} label="Uptime" size={100} showValue />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>GaugeChart</Typography>
          <GaugeChart value={68} min={0} max={100} label="Performance Score" size={180} />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* TrendIndicator */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>TrendIndicator</Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TrendIndicator value={12.4} />
            <TrendIndicator value={-3.2} />
            <TrendIndicator value={0} />
            <TrendIndicator value={8.6} label="vs last month" />
            <TrendIndicator value={-1.4} label="vs last week" />
          </Box>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ComparisonBar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ComparisonBar</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ComparisonBar leftLabel="This Year" rightLabel="Last Year" leftValue={420} rightValue={380} showLabels showValues />
            <ComparisonBar leftLabel="Mobile" rightLabel="Desktop" leftValue={65} rightValue={35} showLabels showPercentages />
          </Box>
        </Grid>

        {/* TreeMap */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>TreeMap</Typography>
          <TreeMap data={treeMapData} height={200} />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Timeline */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Timeline</Typography>
          <Timeline items={timelineItems} />
        </Grid>

        {/* Heatmap */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Heatmap</Typography>
          <Heatmap data={heatmapData} showMonthLabels showDayLabels />
        </Grid>
      </Grid>
    </Box>
  )
}


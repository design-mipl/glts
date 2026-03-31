import { Box, Typography, Paper, Divider } from '@mui/material';
import { 
  KPIBlock, 
  ProgressRing, 
  Heatmap, 
  Timeline, 
  GaugeChart, 
  TreeMap, 
  ComparisonBar, 
  TrendIndicator 
} from '../design-system/components/infographics';
import { 
  Error as ErrorIcon, 
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';

const heatmapData = Array.from({ length: 365 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));
  return {
    date: date.toISOString(),
    value: Math.floor(Math.random() * 5),
  };
});

const timelineItems = [
  {
    id: '1',
    title: 'Project Kickoff',
    description: 'Initial meeting with stakeholders and discovery phase started.',
    date: new Date('2026-01-01'),
    status: 'completed' as const,
    icon: <CheckCircleIcon />,
  },
  {
    id: '2',
    title: 'Design Phase',
    description: 'UI/UX design and prototyping for the new dashboard.',
    date: new Date('2026-02-15'),
    status: 'completed' as const,
    icon: <CheckCircleIcon />,
  },
  {
    id: '3',
    title: 'Development Start',
    description: 'Frontend and backend development in progress.',
    date: new Date('2026-03-20'),
    status: 'active' as const,
    icon: <PlayIcon />,
    metadata: { Team: 'Alpha', Sprint: '4' },
  },
  {
    id: '4',
    title: 'Beta Testing',
    description: 'External beta testing with selected users.',
    date: new Date('2026-04-10'),
    status: 'pending' as const,
  },
  {
    id: '5',
    title: 'Production Deploy',
    description: 'Final release to production environment.',
    date: new Date('2026-05-01'),
    status: 'error' as const,
    icon: <ErrorIcon />,
  },
];

const treeMapData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
  { name: 'Category E', value: 150 },
  { name: 'Category F', value: 100 },
];

export default function InfographicTest() {
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Typography variant="h2" gutterBottom>Infographics Component Test</Typography>

      {/* KPIBlock & TrendIndicator */}
      <section>
        <Typography variant="h4" gutterBottom>KPIBlock & TrendIndicator</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Paper sx={{ p: 3 }}>
              <KPIBlock 
                size="lg"
                label="Total Revenue"
                value={48295}
                prefix="$"
                delta={12.5}
                deltaLabel="vs last month"
                description="Total revenue generated across all channels this month."
              />
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 3 }}>
              <KPIBlock 
                size="md"
                label="Active Users"
                value={2847}
                delta={-3.2}
                deltaLabel="vs last week"
              />
            </Paper>
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
               <TrendIndicator value={12.5} label="vs last month" size="sm" />
               <TrendIndicator value={-3.2} label="vs last week" size="md" />
               <TrendIndicator value={0} label="no change" size="lg" />
            </Box>
          </Box>
        </Box>
      </section>

      <Divider />

      {/* ProgressRing */}
      <section>
        <Typography variant="h4" gutterBottom>ProgressRing</Typography>
        <Box sx={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <ProgressRing value={75} size={120} showValue label="Completion" />
          <ProgressRing value={42} size={80} color="#10B981" showValue label="Success Rate" />
          <ProgressRing value={90} size={100} thickness={12} animated={false} label="Static" />
        </Box>
      </section>

      <Divider />

      {/* Heatmap */}
      <section>
        <Typography variant="h4" gutterBottom>Heatmap</Typography>
         <Paper sx={{ p: 3, overflowX: 'auto' }}>
            <Heatmap 
              data={heatmapData} 
              showMonthLabels={true} 
              showDayLabels={true} 
              cellSize={12}
            />
         </Paper>
      </section>

      <Divider />

      {/* Timeline */}
      <section>
        <Typography variant="h4" gutterBottom>Timeline</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Vertical Alternating</Typography>
            <Timeline items={timelineItems} alternating={true} />
          </Box>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Horizontal Scroll</Typography>
            <Timeline items={timelineItems} orientation="horizontal" variant="outlined" />
          </Box>
        </Box>
      </section>

      <Divider />

      {/* GaugeChart */}
      <section>
        <Typography variant="h4" gutterBottom>GaugeChart</Typography>
        <Box sx={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <GaugeChart 
            value={68} 
            label="System Health" 
            ranges={[
              { from: 0, to: 33, color: '#EF4444' },
              { from: 34, to: 66, color: '#F59E0B' },
              { from: 67, to: 100, color: '#10B981' }
            ]}
          />
          <GaugeChart value={45} label="CPU Load" size={150} color="#3B82F6" />
        </Box>
      </section>

      <Divider />

      {/* TreeMap */}
      <section>
        <Typography variant="h4" gutterBottom>TreeMap</Typography>
        <Paper sx={{ p: 2 }}>
           <TreeMap data={treeMapData} height={250} />
        </Paper>
      </section>

      <Divider />

      {/* ComparisonBar */}
      <section>
        <Typography variant="h4" gutterBottom>ComparisonBar</Typography>
        <Paper sx={{ p: 4, maxWidth: 600 }}>
          <ComparisonBar 
            leftLabel="Desktop" 
            leftValue={65} 
            rightLabel="Mobile" 
            rightValue={35} 
            showLabels 
            showValues 
            showPercentages 
          />
        </Paper>
      </section>
    </Box>
  );
}

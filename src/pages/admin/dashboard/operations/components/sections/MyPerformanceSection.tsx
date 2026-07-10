import { Box, Grid, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { BaseCard } from '@/design-system/UIComponents'
import type { MyPerformanceMetric } from '../../data/operationsConsultantDashboardMock'

function PerformanceKpiCard({ metric }: { metric: MyPerformanceMetric }) {
  const theme = useTheme()
  const paletteColor =
    (metric.accent in theme.palette
      ? (theme.palette[metric.accent as keyof typeof theme.palette] as { main?: string })?.main
      : undefined) ?? theme.palette.primary.main

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
        >
          {metric.label}
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: paletteColor }}>
          {metric.value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'inline-block',
            mt: 0.75,
            px: 1,
            py: 0.25,
            borderRadius: '10px',
            bgcolor: alpha(paletteColor, 0.1),
            color: paletteColor,
          }}
        >
          {metric.subtitle}
        </Typography>
      </Box>
    </BaseCard>
  )
}

export interface MyPerformanceSectionProps {
  metrics: MyPerformanceMetric[]
}

export function MyPerformanceSection({ metrics }: MyPerformanceSectionProps) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid key={metric.id} size={{ xs: 12, md: 4 }}>
          <PerformanceKpiCard metric={metric} />
        </Grid>
      ))}
    </Grid>
  )
}

import { useState } from 'react'
import { Box, Grid, Stack, Typography, alpha } from '@mui/material'
import { BarChart, LineChart, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ProgressSummary, DASHBOARD_SPACING } from '../../shared'
import { OPS_CHART_COLORS } from '../data/operationsDashboardMock'
import type { OperationsDashboardTabProps } from '../types'

const PERIOD_OPTIONS = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
] as const

const PRODUCTIVITY_ACCENTS = [
  OPS_CHART_COLORS.green,
  OPS_CHART_COLORS.blue,
  OPS_CHART_COLORS.amber,
  OPS_CHART_COLORS.navy,
] as const

function ChartPanel({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1.25 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

export function PerformanceTab({ data, loading }: OperationsDashboardTabProps) {
  const brand = usePublicBrandColors()
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const trendPoints = data.processingTrend.map((p) => ({
    label: p.label,
    workedOn: p.value,
    finished: p.secondary ?? 0,
  }))

  const capacityBars = data.teamCapacity.map((row) => ({
    team: row.department,
    open: row.openCases,
    done: row.completedToday,
  }))

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ChartPanel
          title="Daily work"
          description="Cases you worked on vs finished each day"
          action={
            <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Performance period"
                value={period}
                options={[...PERIOD_OPTIONS]}
                onChange={(v) => setPeriod(String(v) as 'week' | 'month')}
              />
            </Box>
          }
        >
          <LineChart
            data={trendPoints}
            xKey="label"
            height={240}
            showLegend
            loading={loading}
            lines={[
              { key: 'workedOn', label: 'Under Process', color: OPS_CHART_COLORS.navy },
              { key: 'finished', label: 'Finished', color: OPS_CHART_COLORS.green },
            ]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Personal SLA
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block', mb: 1.5 }}
          >
            Daily and weekly compliance
          </Typography>
          <ProgressSummary items={data.personalSla} loading={loading} />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Personal productivity
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block', mb: 1.5 }}
          >
            Completed · cycle time · re-checks · SLA
          </Typography>
          <Grid container spacing={1.25}>
            {data.metricComparison.map((metric, index) => {
              const accent = PRODUCTIVITY_ACCENTS[index % PRODUCTIVITY_ACCENTS.length]
              const delta = metric.delta
              const deltaUp = delta != null && delta > 0
              const deltaDown = delta != null && delta < 0
              return (
                <Grid key={metric.label} size={{ xs: 6 }}>
                  <Box
                    sx={{
                      height: '100%',
                      p: 1.5,
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: brand.border,
                      borderLeft: `2px solid ${alpha(accent, 0.55)}`,
                      bgcolor: alpha(accent, 0.04),
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ fontSize: 12, display: 'block' }}
                    >
                      {metric.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        color: 'text.primary',
                      }}
                    >
                      {loading ? '—' : metric.value}
                    </Typography>
                    {delta != null ? (
                      <Typography
                        sx={{
                          mt: 0.35,
                          fontSize: 11,
                          fontWeight: 600,
                          color: deltaUp
                            ? alpha(OPS_CHART_COLORS.green, 0.9)
                            : deltaDown
                              ? alpha(OPS_CHART_COLORS.coral, 0.85)
                              : 'text.secondary',
                        }}
                      >
                        {delta > 0 ? '+' : ''}
                        {delta}
                        {typeof metric.value === 'string' && metric.value.includes('%')
                          ? ' pts'
                          : typeof metric.value === 'string' && metric.value.includes('h')
                            ? 'h'
                            : ''}
                      </Typography>
                    ) : null}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="Capacity" description="Open cases vs done today">
          <BarChart
            data={capacityBars}
            xKey="team"
            height={220}
            barSize={22}
            showLegend
            loading={loading}
            bars={[
              { key: 'open', label: 'Open', color: OPS_CHART_COLORS.amber },
              { key: 'done', label: 'Done today', color: OPS_CHART_COLORS.teal },
            ]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

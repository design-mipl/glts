import { useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, LineChart, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ProgressSummary, DASHBOARD_SPACING } from '../../shared'
import { DOC_CHART_COLORS, DOC_CHART_SERIES } from '../data/documentationChartColors'
import type { DocumentationDashboardTabProps } from '../types'

const PERIOD_OPTIONS = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
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

/** Performance — throughput, SLA, QC outcome productivity. */
export function PerformanceTab({ data, loading }: DocumentationDashboardTabProps) {
  const brand = usePublicBrandColors()
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const trendPoints = data.processingTrend.map((p) => ({
    label: p.label,
    processed: p.value,
    completed: p.secondary ?? 0,
  }))

  const qcBars = data.qcOutcomeMix.map((s) => ({
    outcome: s.label,
    value: s.value,
  }))

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <ChartPanel
          title="Throughput trend"
          description="Processed vs completed on Docs desks"
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
              { key: 'processed', label: 'Processed', color: DOC_CHART_COLORS.navy },
              { key: 'completed', label: 'Completed', color: DOC_CHART_COLORS.green },
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
            Daily and weekly compliance vs 95% target
          </Typography>
          <ProgressSummary items={data.personalSla} loading={loading} />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title="QC outcome mix" description="Current queue outcomes">
          <BarChart
            data={qcBars}
            xKey="outcome"
            height={220}
            barSize={18}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'value', label: 'Count', color: DOC_CHART_COLORS.teal }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Stage SLA clocks
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block', mb: 1.5 }}
          >
            QC · Waiting on Ops · Mark submitted
          </Typography>
          <ProgressSummary items={data.stageSla} loading={loading} />
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box sx={{ ...executiveCardLevel2Sx(brand), p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14, mb: 1.5 }}>
            Personal productivity
          </Typography>
          <Grid container spacing={1.25}>
            {data.performanceMetrics.map((metric, index) => {
              const accent = DOC_CHART_SERIES[index % DOC_CHART_SERIES.length]
              return (
                <Grid key={metric.id} size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderLeft: `3px solid ${accent}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: 20, lineHeight: 1.2 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                      {metric.subtitle}
                    </Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Grid>

      {data.showInactivityWarning ? (
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              ...executiveCardLevel2Sx(brand),
              px: 2,
              py: 1.5,
              borderColor: 'warning.main',
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                Inactivity soft alert
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                No activity for {data.minutesSinceLastActivity ?? 60}+ minutes during business hours.
                Supervisor notified.
              </Typography>
            </Stack>
          </Box>
        </Grid>
      ) : null}
    </Grid>
  )
}

import { Box, Grid, Stack, Typography } from '@mui/material'
import { Tooltip } from '@/design-system/UIComponents'
import { FunnelChart } from '@/design-system/UIComponents'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { StatusBadge } from '../StatusBadge'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../config/applicationPipeline'
import { DASHBOARD_CHART_HEIGHT_SPACING, DASHBOARD_SPACING } from '../../constants'
import { ChartPanel } from '../ChartPanel'

export interface ApplicationPipelineStageData {
  id: ApplicationPipelineStageId
  count: number
  averageAgeHours: number
  delayedCount: number
  slaPercent: number
}

export interface ApplicationPipelineProps {
  title?: string
  subtitle?: string
  stages: ApplicationPipelineStageData[]
  onStageClick?: (stageId: ApplicationPipelineStageId) => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function ApplicationPipeline({
  title = 'Application pipeline',
  subtitle = 'Visa workflow by stage',
  stages,
  onStageClick,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: ApplicationPipelineProps) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8
  const funnelData = stages.map((stage) => ({
    key: stage.id,
    label: APPLICATION_PIPELINE_STAGE_LABELS[stage.id],
    value: stage.count,
  }))

  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={empty ?? stages.length === 0}
      permission={permission}
      onRetry={onRetry}
      card={false}
      skeletonHeightSpacing={28}
    >
      <Grid container spacing={DASHBOARD_SPACING.field}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <ChartPanel title="Funnel" loading={false} empty={funnelData.length === 0}>
            <FunnelChart data={funnelData} height={chartHeight} />
          </ChartPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Grid container spacing={DASHBOARD_SPACING.field}>
            {stages.map((stage) => {
              const label = APPLICATION_PIPELINE_STAGE_LABELS[stage.id]
              const hover = `${label}: ${stage.count} cases · avg age ${stage.averageAgeHours}h · ${stage.delayedCount} delayed · SLA ${stage.slaPercent}%`

              return (
                <Grid key={stage.id} size={{ xs: 12, sm: 6 }}>
                  <Tooltip content={hover}>
                    <Box
                      role={onStageClick ? 'button' : undefined}
                      tabIndex={onStageClick ? 0 : undefined}
                      onClick={() => onStageClick?.(stage.id)}
                      onKeyDown={(event) => {
                        if (!onStageClick) return
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          onStageClick(stage.id)
                        }
                      }}
                      sx={{
                        p: DASHBOARD_SPACING.dense,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: (theme) => theme.shape.borderRadius,
                        bgcolor: 'background.paper',
                        cursor: onStageClick ? 'pointer' : 'default',
                        transition: (theme) =>
                          theme.transitions.create(['border-color', 'box-shadow'], {
                            duration: theme.transitions.duration.shorter,
                          }),
                        '&:hover': onStageClick
                          ? {
                              borderColor: 'primary.main',
                              boxShadow: 1,
                            }
                          : undefined,
                      }}
                    >
                      <Stack spacing={DASHBOARD_SPACING.field}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={600}>
                            {label}
                          </Typography>
                          <StatusBadge
                            label={`${stage.count}`}
                            tone={stage.delayedCount > 0 ? 'warning' : 'success'}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Avg age {stage.averageAgeHours}h · Delayed {stage.delayedCount} · SLA{' '}
                          {stage.slaPercent}%
                        </Typography>
                      </Stack>
                    </Box>
                  </Tooltip>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </BusinessWidgetFrame>
  )
}

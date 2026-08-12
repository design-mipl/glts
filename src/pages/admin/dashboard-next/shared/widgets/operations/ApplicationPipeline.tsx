import { Box, Stack, Typography } from '@mui/material'
import { BarChart, Tooltip } from '@/design-system/UIComponents'
import {
  ExecutiveGrid,
  InsightCard,
  UI_KIT_SPACING,
} from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { StatusBadge } from '../StatusBadge'
import {
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../config/applicationPipeline'
import { DASHBOARD_CHART_HEIGHT_SPACING } from '../../constants'

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
  /** Wrap in ExecutiveCard. Default false when parent already provides a card shell. */
  card?: boolean
  /** Skip SectionHeader — parent owns the title/tabs chrome. */
  hideHeader?: boolean
}

export function ApplicationPipeline({
  title = 'Application pipeline — by state',
  subtitle = 'Application Management listing queues',
  stages,
  onStageClick,
  loading,
  error,
  empty,
  permission,
  onRetry,
  card = false,
  hideHeader = false,
}: ApplicationPipelineProps) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8
  const barData = stages.map((stage) => ({
    stage: APPLICATION_PIPELINE_STAGE_LABELS[stage.id],
    count: stage.count,
  }))

  return (
    <BusinessWidgetFrame
      title={hideHeader ? undefined : title}
      subtitle={hideHeader ? undefined : subtitle}
      loading={loading}
      error={error}
      empty={empty ?? stages.length === 0}
      permission={permission}
      onRetry={onRetry}
      card={card}
      skeletonHeightSpacing={28}
    >
      <Stack spacing={UI_KIT_SPACING.section}>
        <Box sx={{ minHeight: chartHeight, minWidth: 0, width: '100%' }}>
          <BarChart
            data={barData}
            xKey="stage"
            bars={[{ key: 'count', label: 'Applications' }]}
            height={chartHeight}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend={false}
            barSize={18}
          />
        </Box>
        <ExecutiveGrid columns={3}>
          {stages.map((stage) => {
            const label = APPLICATION_PIPELINE_STAGE_LABELS[stage.id]
            const hover = `${label}: ${stage.count} cases · avg age ${stage.averageAgeHours}h · ${stage.delayedCount} delayed · SLA ${stage.slaPercent}%`

            return (
              <Tooltip key={stage.id} content={hover}>
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
                  sx={{ height: '100%', cursor: onStageClick ? 'pointer' : 'default' }}
                >
                  <InsightCard
                    accent="neutral"
                    density="compact"
                    elevation="flat"
                    sx={{
                      borderLeft: '1px solid',
                      borderLeftColor: 'divider',
                      boxShadow: 'none',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Stack spacing={UI_KIT_SPACING.field}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {label}
                        </Typography>
                        <StatusBadge
                          label={`${stage.count}`}
                          tone={stage.delayedCount > 0 ? 'warning' : 'neutral'}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Avg age {stage.averageAgeHours}h · Delayed {stage.delayedCount} · SLA{' '}
                        {stage.slaPercent}%
                      </Typography>
                    </Stack>
                  </InsightCard>
                </Box>
              </Tooltip>
            )
          })}
        </ExecutiveGrid>
      </Stack>
    </BusinessWidgetFrame>
  )
}

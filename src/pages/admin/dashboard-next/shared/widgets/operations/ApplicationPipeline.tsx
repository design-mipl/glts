import { Box, Stack, Typography } from '@mui/material'
import { FunnelChart, Tooltip } from '@/design-system/UIComponents'
import {
  ComparisonLayout,
  ExecutiveGrid,
  FunnelContainer,
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
      <ComparisonLayout
        left={
          <FunnelContainer title="Funnel" minHeight={chartHeight} width="auto">
            <FunnelChart data={funnelData} height={chartHeight} />
          </FunnelContainer>
        }
        right={
          <ExecutiveGrid columns={2}>
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
                      accent={stage.delayedCount > 0 ? 'warning' : 'success'}
                      density="compact"
                    >
                      <Stack spacing={UI_KIT_SPACING.field}>
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
                    </InsightCard>
                  </Box>
                </Tooltip>
              )
            })}
          </ExecutiveGrid>
        }
      />
    </BusinessWidgetFrame>
  )
}

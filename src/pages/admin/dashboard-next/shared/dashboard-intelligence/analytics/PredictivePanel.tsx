import { Stack, Typography } from '@mui/material'
import { HighlightCard, ExecutiveGrid } from '../../dashboard-ui-kit'
import type { PredictivePanelModel } from '../types'

export interface PredictivePanelProps {
  title?: string
  subtitle?: string
  models: PredictivePanelModel[]
  loading?: boolean
}

/**
 * Reusable forecast / predictive containers — mock-friendly, API-ready.
 */
export function PredictivePanel({
  title = 'Forward outlook',
  subtitle = 'Forecast panels for executive planning',
  models,
  loading,
}: PredictivePanelProps) {
  return (
    <Stack spacing={1.5} aria-label={title}>
      <Stack spacing={0.35}>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      <ExecutiveGrid columns={models.length >= 4 ? 4 : models.length === 3 ? 3 : 2}>
        {models.map((model) => (
          <HighlightCard
            key={model.id}
            title={model.title}
            subtitle={model.subtitle ?? model.horizonLabel}
            highlight={model.projectedValue}
            highlightLabel={model.confidenceLabel ?? model.deltaLabel}
            loading={loading}
          >
            {model.notes?.map((note) => (
              <Typography key={note} variant="caption" color="text.secondary" display="block">
                {note}
              </Typography>
            ))}
          </HighlightCard>
        ))}
      </ExecutiveGrid>
    </Stack>
  )
}

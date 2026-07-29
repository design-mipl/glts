import { Box, Stack, Typography } from '@mui/material'
import { Alert, AlertDescription, AlertTitle, Badge, Button } from '../../dashboard-ui-kit/shadcn'
import { InsightCard, RecommendationPanel as KitRecommendationPanel } from '../../dashboard-ui-kit'
import type { ExecutiveInsight, ExecutiveRecommendation, InsightTone } from '../types'

function alertVariant(tone?: InsightTone) {
  switch (tone) {
    case 'positive':
      return 'success' as const
    case 'negative':
      return 'destructive' as const
    case 'warning':
      return 'warning' as const
    case 'info':
      return 'info' as const
    default:
      return 'default' as const
  }
}

export interface InsightBannerProps {
  insight: ExecutiveInsight
  onDismiss?: () => void
}

/** Full-width insight callout for executive storytelling. */
export function InsightBanner({ insight, onDismiss }: InsightBannerProps) {
  return (
    <Alert variant={alertVariant(insight.tone)} role="status" aria-label={insight.title}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <AlertTitle>{insight.title}</AlertTitle>
          <AlertDescription>{insight.body}</AlertDescription>
          {insight.segment ? (
            <Box sx={{ mt: 1 }}>
              <Badge variant="secondary">{insight.segment}</Badge>
            </Box>
          ) : null}
        </Box>
        {onDismiss ? (
          <Button variant="ghost" size="sm" type="button" onClick={onDismiss}>
            Dismiss
          </Button>
        ) : null}
      </Stack>
    </Alert>
  )
}

export interface ExecutiveInsightCardProps {
  insight: ExecutiveInsight
}

/** Insight surface composed on UI Kit InsightCard — not a duplicate chrome system. */
export function ExecutiveInsightCard({ insight }: ExecutiveInsightCardProps) {
  const accent =
    insight.tone === 'positive'
      ? 'success'
      : insight.tone === 'negative'
        ? 'error'
        : insight.tone === 'warning'
          ? 'warning'
          : insight.tone === 'info'
            ? 'info'
            : 'neutral'

  return (
    <InsightCard title={insight.title} accent={accent} density="compact">
      <Typography variant="body2" color="text.secondary">
        {insight.body}
      </Typography>
    </InsightCard>
  )
}

export interface RecommendationCardProps {
  recommendation: ExecutiveRecommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <InsightCard
      title={recommendation.title}
      subtitle={recommendation.owner ? `Owner · ${recommendation.owner}` : undefined}
      actionLabel={recommendation.actionLabel}
      onAction={recommendation.onAction}
      density="compact"
      accent={
        recommendation.priority === 'critical' || recommendation.priority === 'high'
          ? 'warning'
          : 'info'
      }
    >
      <Typography variant="body2" color="text.secondary">
        {recommendation.description}
      </Typography>
    </InsightCard>
  )
}

export interface IntelligenceRecommendationPanelProps {
  title?: string
  items: ExecutiveRecommendation[]
}

export function IntelligenceRecommendationPanel({
  title = 'Recommendations',
  items,
}: IntelligenceRecommendationPanelProps) {
  return (
    <KitRecommendationPanel
      title={title}
      items={items.map((item) => ({
        id: item.id,
        primary: item.title,
        secondary: item.description,
      }))}
      onItemAction={(id) => items.find((item) => item.id === id)?.onAction?.()}
    />
  )
}

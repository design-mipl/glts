import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../../shared'
import { ExecutiveKpiCard } from '../ExecutiveKpiCard'
import type { AnalyticsMetricHeadline } from '../../types/analyticsTypes'

export interface AnalyticsMetricKpiRowProps {
  items: AnalyticsMetricHeadline[]
  loading?: boolean
}

/** Headline KPI row — current value, delta, target, and status tone per metric. */
export function AnalyticsMetricKpiRow({ items, loading }: AnalyticsMetricKpiRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <ExecutiveKpiCard
            title={item.title}
            tooltip={item.tooltip}
            value={item.value}
            tone={item.tone}
            delta={item.delta}
            deltaLabel={item.deltaLabel}
            supportingLines={[
              ...(item.priorValue ? [`Prior: ${item.priorValue}`] : []),
              ...(item.targetLabel ? [item.targetLabel] : []),
              ...(item.supportingLines ?? []),
            ]}
            loading={loading}
            animate={false}
          />
        </Grid>
      ))}
    </Grid>
  )
}

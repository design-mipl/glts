import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface OperationsExecutiveRowProps {
  alerts: ReactNode
  /** Primary visualization — Queue Status (visual focus). */
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/** Operations executive row: alerts · queue status (focus) · quick actions. */
export function OperationsExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: OperationsExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 3 }}>{alerts}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, md: 3 }}>{quickActions}</Grid>
    </Grid>
  )
}

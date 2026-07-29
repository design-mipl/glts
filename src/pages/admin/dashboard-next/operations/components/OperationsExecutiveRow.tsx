import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface OperationsExecutiveRowProps {
  alerts: ReactNode
  /** Primary visualization — Queue Status (visual focus). */
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/**
 * Operations executive layout:
 * 1) Primary visualization + quick actions
 * 2) Alerts & notifications
 */
export function OperationsExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: OperationsExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, lg: 4 }}>{quickActions}</Grid>
      <Grid size={{ xs: 12 }}>{alerts}</Grid>
    </Grid>
  )
}

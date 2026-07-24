import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface AdminExecutiveRowProps {
  alerts: ReactNode
  /** Primary visualization — Application Funnel (visual focus). */
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/** Admin executive row: alerts · primary funnel (focus) · quick actions. */
export function AdminExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: AdminExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 3 }}>{alerts}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, md: 3 }}>{quickActions}</Grid>
    </Grid>
  )
}

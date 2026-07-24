import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface GroundExecutiveRowProps {
  alerts: ReactNode
  /** Primary visualization — Today's Route Timeline (visual focus). */
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/** Ground Ops executive row: alerts · route timeline (focus) · quick actions. */
export function GroundExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: GroundExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 3 }}>{alerts}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, md: 3 }}>{quickActions}</Grid>
    </Grid>
  )
}

import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface DocumentationExecutiveRowProps {
  alerts: ReactNode
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/** Documentation executive row: alerts · pipeline / verification · quick actions. */
export function DocumentationExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: DocumentationExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 3 }}>{alerts}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, md: 3 }}>{quickActions}</Grid>
    </Grid>
  )
}

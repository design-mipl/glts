import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface DocumentationExecutiveRowProps {
  alerts: ReactNode
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/**
 * Documentation executive layout:
 * 1) Primary visualization + quick actions
 * 2) Alerts & notifications
 */
export function DocumentationExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: DocumentationExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, lg: 4 }}>{quickActions}</Grid>
      <Grid size={{ xs: 12 }}>{alerts}</Grid>
    </Grid>
  )
}

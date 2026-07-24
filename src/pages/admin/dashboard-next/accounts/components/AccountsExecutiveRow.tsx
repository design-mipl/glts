import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface AccountsExecutiveRowProps {
  alerts: ReactNode
  /** Primary visualization — Collections Funnel (visual focus). */
  primaryVisualization: ReactNode
  quickActions: ReactNode
}

/** Accounts executive row: alerts · collections funnel (focus) · quick actions. */
export function AccountsExecutiveRow({
  alerts,
  primaryVisualization,
  quickActions,
}: AccountsExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 3 }}>{alerts}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{primaryVisualization}</Grid>
      <Grid size={{ xs: 12, md: 3 }}>{quickActions}</Grid>
    </Grid>
  )
}

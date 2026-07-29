import type { ReactNode } from 'react'
import { Box, Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface AdminExecutiveRowProps {
  /** Primary visualization — Application Funnel (visual focus). */
  primaryVisualization: ReactNode
  /** Needs immediate attention (or other secondary executive surface). */
  quickActions: ReactNode
}

/**
 * Admin executive layout:
 * Application funnel + Needs immediate attention (single row).
 * Alerts & Recent activity live in OverviewTab below.
 */
export function AdminExecutiveRow({
  primaryVisualization,
  quickActions,
}: AdminExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
      <Grid size={{ xs: 12, lg: 8 }}>
        <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
          {primaryVisualization}
        </Box>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
          {quickActions}
        </Box>
      </Grid>
    </Grid>
  )
}

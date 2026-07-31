import type { ReactNode } from 'react'
import { Box, Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface DocumentationExecutiveRowProps {
  alerts: ReactNode
  /** Primary visualization — Documentation pipeline. */
  primaryVisualization: ReactNode
}

/**
 * Documentation executive layout:
 * Pipeline + Critical alerts in one parallel row (Ops/Accounts pattern).
 */
export function DocumentationExecutiveRow({
  alerts,
  primaryVisualization,
}: DocumentationExecutiveRowProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
      <Grid size={{ xs: 12, lg: 8 }}>
        <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
          {primaryVisualization}
        </Box>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
          {alerts}
        </Box>
      </Grid>
    </Grid>
  )
}

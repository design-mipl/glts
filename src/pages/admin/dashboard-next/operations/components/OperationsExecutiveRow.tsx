import type { ReactNode } from 'react'
import { Box, Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'

export interface OperationsExecutiveRowProps {
  alerts: ReactNode
  /** Primary visualization — Queue Status (visual focus). */
  primaryVisualization: ReactNode
}

/**
 * Operations executive layout:
 * Queue status + Ops alerts in one parallel row.
 */
export function OperationsExecutiveRow({
  alerts,
  primaryVisualization,
}: OperationsExecutiveRowProps) {
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

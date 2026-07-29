import type { ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import { EXECUTIVE_DASHBOARD_SPACING } from './executiveDashboardTokens'

export interface DashboardTabPanelProps {
  children: ReactNode
  /** Tighter padding inside the shared tabs container */
  dense?: boolean
}

/** Content area inside the shared tabs container. */
export function DashboardTabPanel({ children, dense = false }: DashboardTabPanelProps) {
  return (
    <Box sx={{ p: dense ? 1.5 : { xs: 1.5, sm: 2 } }}>
      <Stack spacing={EXECUTIVE_DASHBOARD_SPACING.card}>{children}</Stack>
    </Box>
  )
}

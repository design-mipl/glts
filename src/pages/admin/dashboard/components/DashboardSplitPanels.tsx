import type { ReactNode } from 'react'
import { Grid } from '@mui/material'

export interface DashboardSplitPanelsProps {
  /** Left / primary column */
  primary: ReactNode
  /** Right / secondary column — stacks below on mobile */
  secondary?: ReactNode
  /** When true, both columns take equal width on desktop */
  equal?: boolean
}

/** Two-column layout for tables/panels inside a dashboard tab. */
export function DashboardSplitPanels({
  primary,
  secondary,
  equal = true,
}: DashboardSplitPanelsProps) {
  if (!secondary) {
    return <>{primary}</>
  }

  const primarySize = equal ? { xs: 12, lg: 6 } : { xs: 12, lg: 8 }
  const secondarySize = equal ? { xs: 12, lg: 6 } : { xs: 12, lg: 4 }

  return (
    <Grid container spacing={2}>
      <Grid size={primarySize}>{primary}</Grid>
      <Grid size={secondarySize}>{secondary}</Grid>
    </Grid>
  )
}

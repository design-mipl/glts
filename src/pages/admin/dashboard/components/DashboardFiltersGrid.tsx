import { Box } from '@mui/material'
import type { ReactNode } from 'react'

export interface DashboardFiltersGridProps {
  children: ReactNode
  /** Total filter fields in the row — drives responsive column layout. */
  fieldCount: number
}

function resolveGridColumns(fieldCount: number): Record<string, string> {
  if (fieldCount >= 5) {
    return {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      lg: 'minmax(260px, 1.5fr) repeat(4, minmax(130px, 1fr))',
    }
  }

  if (fieldCount === 4) {
    return {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      lg: 'minmax(260px, 1.5fr) repeat(3, minmax(130px, 1fr))',
    }
  }

  return {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: `repeat(${fieldCount}, minmax(140px, 1fr))`,
  }
}

export function DashboardFiltersGrid({ children, fieldCount }: DashboardFiltersGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: resolveGridColumns(fieldCount),
        gap: 1.5,
        alignItems: 'start',
        width: '100%',
      }}
    >
      {children}
    </Box>
  )
}

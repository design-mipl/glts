import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { ChartCard } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { EXECUTIVE_CHART_HEIGHT, EXECUTIVE_CHART_PADDING, executiveCardLevel2Sx } from './executiveDashboardTokens'

export interface ExecutiveChartPanelProps {
  title: string
  subtitle?: string
  children: ReactNode
  minHeight?: number
  /** When true, skip outer card chrome (for use inside a parent section card). */
  embedded?: boolean
}

export function ExecutiveChartPanel({
  title,
  subtitle,
  children,
  minHeight = EXECUTIVE_CHART_HEIGHT + 72,
  embedded = false,
}: ExecutiveChartPanelProps) {
  const colors = usePublicBrandColors()

  const content = (
    <Box
      sx={{
        flex: 1,
        minHeight: embedded ? undefined : minHeight,
        display: 'flex',
        flexDirection: 'column',
        '& .MuiCard-root': { boxShadow: 'none', border: 'none', height: '100%' },
      }}
    >
      <ChartCard title={title} subtitle={subtitle} height={EXECUTIVE_CHART_HEIGHT}>
        <Box sx={{ px: EXECUTIVE_CHART_PADDING, pb: EXECUTIVE_CHART_PADDING }}>{children}</Box>
      </ChartCard>
    </Box>
  )

  if (embedded) {
    return (
      <Box
        sx={{
          height: '100%',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
          overflow: 'hidden',
        }}
      >
        {content}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        ...executiveCardLevel2Sx(colors),
        height: '100%',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {content}
    </Box>
  )
}

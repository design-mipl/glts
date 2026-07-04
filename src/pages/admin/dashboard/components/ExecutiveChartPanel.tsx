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
}

export function ExecutiveChartPanel({
  title,
  subtitle,
  children,
  minHeight = EXECUTIVE_CHART_HEIGHT + 72,
}: ExecutiveChartPanelProps) {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), height: '100%', minHeight, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, '& .MuiCard-root': { boxShadow: 'none', border: 'none', height: '100%' } }}>
        <ChartCard title={title} subtitle={subtitle} height={EXECUTIVE_CHART_HEIGHT}>
          <Box sx={{ px: EXECUTIVE_CHART_PADDING, pb: EXECUTIVE_CHART_PADDING }}>{children}</Box>
        </ChartCard>
      </Box>
    </Box>
  )
}

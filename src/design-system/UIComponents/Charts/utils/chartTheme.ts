import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { tokens } from '../../../tokens'
import { getDashboardChartSeries } from '@/shared/theme/dashboardChartColors'

export function useChartTheme() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'))

  // Multi-color series from brand + design tokens (not primary/success green twice).
  const colors = [...getDashboardChartSeries(theme.palette.mode)]

  const gridProps = {
    stroke:          theme.palette.divider,
    strokeDasharray: '3 3',
    strokeOpacity:   0.6,
  }

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: theme.palette.background.paper,
    border:          `1px solid ${theme.palette.divider}`,
    borderRadius:    tokens.borderRadius.md,
    boxShadow:       tokens.shadow.sm,
    padding:         '8px 12px',
    fontSize:        12,
    fontFamily:      theme.typography.fontFamily as string,
    color:           theme.palette.text.primary,
  }

  const axisStyle = {
    fill:       theme.palette.text.secondary,
    fontSize:   isMobile ? 10 : 12,
    fontFamily: theme.typography.fontFamily as string,
  }

  // Legend layout: below on mobile, right side on desktop
  const legendProps = {
    layout:        (isMobile ? 'horizontal' : 'vertical')  as 'horizontal' | 'vertical',
    verticalAlign: (isMobile ? 'bottom'     : 'middle')    as 'bottom' | 'middle' | 'top',
    align:         (isMobile ? 'center'     : 'right')     as 'center' | 'left' | 'right',
    wrapperStyle: {
      fontFamily: theme.typography.fontFamily as string,
      fontSize:   12,
      color:      theme.palette.text.secondary,
      paddingLeft: isMobile ? 0 : 16,
    },
  }

  return {
    colors,
    gridProps,
    tooltipStyle,
    axisStyle,
    legendProps,
    fontFamily: theme.typography.fontFamily as string,
    isMobile,
    theme,
  }
}

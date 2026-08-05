import { useTheme } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import {
  getPublicBrandColors,
  type PublicBrandMode,
} from '@/shared/theme/publicBrand'

/**
 * Shared multi-color chart palette for product dashboards.
 * Sourced from publicBrand + design-system tokens — no scattered hex literals.
 * Series language: navy · green · amber · coral · blue · teal · violet · slate.
 */
export function getDashboardChartColors(mode: PublicBrandMode = 'light') {
  const brand = getPublicBrandColors(mode)
  return {
    navy: brand.navy,
    green: brand.green,
    amber: tokens.color.warning[500],
    coral: tokens.color.error[500],
    blue: tokens.color.info[500],
    teal: tokens.color.chartTeal[500],
    violet: tokens.color.chartViolet[500],
    slate: brand.textSecondary,
  } as const
}

export type DashboardChartColors = ReturnType<typeof getDashboardChartColors>

export function getDashboardChartSeries(mode: PublicBrandMode = 'light'): readonly string[] {
  const c = getDashboardChartColors(mode)
  return [c.navy, c.green, c.amber, c.coral, c.blue, c.teal, c.violet, c.slate] as const
}

export function useDashboardChartColors(): DashboardChartColors {
  const theme = useTheme()
  return getDashboardChartColors(theme.palette.mode)
}

export function useDashboardChartSeries(): readonly string[] {
  const theme = useTheme()
  return getDashboardChartSeries(theme.palette.mode)
}

/** Assign series colors to donut / pie slices by index. */
export function colorSlices<T extends { key: string; label: string; value: number; color?: string }>(
  slices: T[],
  series: readonly string[],
): Array<T & { color: string }> {
  return slices.map((slice, index) => ({
    ...slice,
    color: slice.color ?? series[index % series.length],
  }))
}

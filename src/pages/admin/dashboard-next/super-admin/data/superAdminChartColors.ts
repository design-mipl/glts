/**
 * Super Admin chart palette — shared brand/token series (theme-aware).
 * Prefer hooks in components; static exports are light-mode fallbacks for non-React modules.
 */
export {
  getDashboardChartColors,
  getDashboardChartSeries,
  useDashboardChartColors,
  useDashboardChartSeries,
  colorSlices,
  type DashboardChartColors,
} from '@/shared/theme/dashboardChartColors'

import { getDashboardChartColors, getDashboardChartSeries } from '@/shared/theme/dashboardChartColors'

/** @deprecated Prefer useDashboardChartColors() for dark-mode correctness. */
export const SUPER_ADMIN_CHART_COLORS = getDashboardChartColors('light')
/** @deprecated Prefer useDashboardChartSeries() for dark-mode correctness. */
export const SUPER_ADMIN_CHART_SERIES = getDashboardChartSeries('light')

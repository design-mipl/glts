/**
 * Accounts chart palette — re-exports shared brand/token series.
 * Prefer `useDashboardChartColors()` in components when mode-aware colors are needed.
 */
import {
  getDashboardChartColors,
  getDashboardChartSeries,
} from '@/shared/theme/dashboardChartColors'

export const ACCOUNTS_CHART_COLORS = getDashboardChartColors('light')
export const ACCOUNTS_CHART_SERIES = getDashboardChartSeries('light')

/**
 * Admin dashboard chart palette — re-exports shared brand/token series.
 */
import {
  getDashboardChartColors,
  getDashboardChartSeries,
} from '@/shared/theme/dashboardChartColors'

export const ADMIN_CHART_COLORS = getDashboardChartColors('light')
export const ADMIN_CHART_SERIES = getDashboardChartSeries('light')

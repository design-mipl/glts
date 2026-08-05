/**
 * Super Admin chart palette — re-exports shared brand/token series.
 */
import {
  getDashboardChartColors,
  getDashboardChartSeries,
} from '@/shared/theme/dashboardChartColors'

export const SUPER_ADMIN_CHART_COLORS = getDashboardChartColors('light')
export const SUPER_ADMIN_CHART_SERIES = getDashboardChartSeries('light')

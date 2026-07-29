import type { ReactNode } from 'react'
import { ChartContainer } from '../dashboard-ui-kit'
import { DASHBOARD_CHART_HEIGHT_SPACING } from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'

export interface ChartPanelProps {
  title: string
  subtitle?: string
  children: ReactNode
  loading?: boolean
  empty?: boolean
  error?: boolean
  emptyTitle?: string
  emptyDescription?: string
  errorTitle?: string
  errorDescription?: string
  onRetry?: () => void
  action?: ReactNode
  /** Chart body height in theme spacing units (MUI spacing base 8). */
  heightSpacing?: number
  permission?: boolean
}

export function ChartPanel({
  title,
  subtitle,
  children,
  loading = false,
  empty = false,
  error = false,
  emptyTitle = 'No chart data',
  emptyDescription = 'There is nothing to plot for the current filters.',
  errorTitle = 'Chart failed to load',
  errorDescription = 'Try again or adjust filters.',
  onRetry,
  action,
  heightSpacing = DASHBOARD_CHART_HEIGHT_SPACING,
  permission,
}: ChartPanelProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const height = heightSpacing * 8

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      toolbar={action}
      loading={loading}
      empty={empty}
      error={error}
      onRetry={onRetry}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      errorTitle={errorTitle}
      errorDescription={errorDescription}
      minHeight={height}
      width="full"
    >
      {children}
    </ChartContainer>
  )
}

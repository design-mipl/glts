import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { Button, ChartCard, EmptyState, Skeleton } from '@/design-system/UIComponents'
import { tokens } from '@/design-system/tokens'
import { DASHBOARD_CHART_HEIGHT_SPACING, DASHBOARD_SPACING } from '../constants'
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

  // MUI theme spacing unit is 8 — heightSpacing is a tokenized multiplier.
  const height = heightSpacing * 8

  return (
    <ChartCard title={title} subtitle={subtitle} loading={loading} action={action} height={height}>
      {error ? (
        <Box sx={{ py: DASHBOARD_SPACING.card, textAlign: 'center' }}>
          <EmptyState
            variant="no-data"
            title={errorTitle}
            description={errorDescription}
            action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
          />
          {onRetry ? (
            <Box sx={{ mt: DASHBOARD_SPACING.field }}>
              <Button label="Retry" variant="outlined" size="sm" onClick={onRetry} />
            </Box>
          ) : null}
        </Box>
      ) : loading ? (
        <Skeleton
          variant="rect"
          height={height}
          sx={{ borderRadius: tokens.borderRadius.md }}
        />
      ) : empty ? (
        <Box sx={{ py: DASHBOARD_SPACING.card }}>
          <EmptyState variant="no-data" title={emptyTitle} description={emptyDescription} />
        </Box>
      ) : (
        <Box sx={{ width: '100%', minHeight: height }}>{children}</Box>
      )}
    </ChartCard>
  )
}

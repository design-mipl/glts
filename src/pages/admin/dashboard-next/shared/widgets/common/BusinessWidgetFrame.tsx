import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { Button, EmptyState, Skeleton } from '@/design-system/UIComponents'
import { tokens } from '@/design-system/tokens'
import { DashboardSection } from '../../components/DashboardSection'
import { DASHBOARD_SPACING } from '../../constants'
import { isDashboardPermissionGranted } from '../../utils/permission'

export interface BusinessWidgetFrameProps {
  title?: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  errorTitle?: string
  errorDescription?: string
  /** Skeleton block height in theme spacing units. */
  skeletonHeightSpacing?: number
  card?: boolean
  children: ReactNode
}

/**
 * Standard loading / error / empty / permission wrapper for business widgets.
 * Presentational only — callers own data.
 */
export function BusinessWidgetFrame({
  title,
  subtitle,
  actionLabel,
  onAction,
  loading = false,
  error = false,
  empty = false,
  permission,
  onRetry,
  emptyTitle = 'No data yet',
  emptyDescription = 'Nothing to show for the current filters.',
  errorTitle = 'Unable to load',
  errorDescription = 'Something went wrong. Try again.',
  skeletonHeightSpacing = 16,
  card = true,
  children,
}: BusinessWidgetFrameProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const skeletonHeight = skeletonHeightSpacing * 8

  let body: ReactNode
  if (error) {
    body = (
      <Box sx={{ py: DASHBOARD_SPACING.dense, textAlign: 'center' }}>
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
    )
  } else if (loading) {
    body = (
      <Skeleton
        variant="rect"
        height={skeletonHeight}
        sx={{ borderRadius: tokens.borderRadius.md }}
      />
    )
  } else if (empty) {
    body = (
      <EmptyState variant="no-data" title={emptyTitle} description={emptyDescription} />
    )
  } else {
    body = children
  }

  return (
    <DashboardSection
      title={title}
      subtitle={subtitle}
      actionLabel={actionLabel}
      onAction={onAction}
      card={card}
    >
      {body}
    </DashboardSection>
  )
}

import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import {
  ExecutiveCard,
  SectionHeader,
  UiKitStateFrame,
} from '../../dashboard-ui-kit'
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
 * Composes Dashboard UI Kit — presentational only; callers own data.
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

  if (!card) {
    return (
      <Box sx={{ height: '100%' }}>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          action={
            actionLabel && onAction ? (
              <Button label={actionLabel} variant="text" size="sm" onClick={onAction} />
            ) : undefined
          }
        />
        <UiKitStateFrame
          loading={loading}
          error={error}
          empty={empty}
          onRetry={onRetry}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          errorTitle={errorTitle}
          errorDescription={errorDescription}
          skeletonHeight={skeletonHeightSpacing * 8}
        >
          {children}
        </UiKitStateFrame>
      </Box>
    )
  }

  return (
    <ExecutiveCard
      title={title}
      subtitle={subtitle}
      actionLabel={actionLabel}
      onAction={onAction}
      loading={loading}
      error={error}
      empty={empty}
      onRetry={onRetry}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      errorTitle={errorTitle}
      errorDescription={errorDescription}
    >
      {children}
    </ExecutiveCard>
  )
}

import type { ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
} from '../shadcn'
import type { UiKitStateProps } from '../types'
import { resolveUiKitViewState } from '../utils'
import { UI_KIT_SPACING } from '../tokens'

export interface UiKitStateFrameProps extends UiKitStateProps {
  children: ReactNode
  skeletonHeight?: number
  /** Optional min height so layout does not jump. */
  minHeight?: number | string
}

/**
 * Shared loading / empty / error / restricted gate for kit surfaces.
 * Presentational only — no data ownership.
 */
export function UiKitStateFrame({
  children,
  loading = false,
  empty = false,
  error = false,
  permission,
  onRetry,
  emptyTitle = 'No data yet',
  emptyDescription = 'Nothing to show for the current filters.',
  errorTitle = 'Unable to load',
  errorDescription = 'Something went wrong. Try again.',
  restrictedTitle = 'Access restricted',
  restrictedDescription = 'You do not have permission to view this section.',
  skeletonHeight = 160,
  minHeight,
}: UiKitStateFrameProps) {
  const state = resolveUiKitViewState({ loading, empty, error, permission })

  if (state === 'restricted') {
    return (
      <Box sx={{ py: UI_KIT_SPACING.stack, minHeight }} role="status">
        <Alert variant="default">
          <AlertTitle>{restrictedTitle}</AlertTitle>
          <AlertDescription>{restrictedDescription}</AlertDescription>
        </Alert>
      </Box>
    )
  }

  if (state === 'error') {
    return (
      <Box sx={{ py: UI_KIT_SPACING.stack, minHeight }} role="alert">
        <Alert variant="destructive">
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{errorDescription}</AlertDescription>
          {onRetry ? (
            <Box sx={{ mt: UI_KIT_SPACING.field }}>
              <Button variant="outline" size="sm" type="button" onClick={onRetry}>
                Retry
              </Button>
            </Box>
          ) : null}
        </Alert>
      </Box>
    )
  }

  if (state === 'loading') {
    return (
      <Stack spacing={UI_KIT_SPACING.field} sx={{ minHeight }} aria-busy="true" aria-live="polite">
        <Skeleton sx={{ height: skeletonHeight * 0.28, width: '42%' }} />
        <Skeleton sx={{ height: skeletonHeight * 0.55, width: '100%' }} />
        <Skeleton sx={{ height: 12, width: '68%' }} />
      </Stack>
    )
  }

  if (state === 'empty') {
    return (
      <Box sx={{ py: UI_KIT_SPACING.stack, minHeight }} role="status">
        <Alert variant="default">
          <AlertTitle>{emptyTitle}</AlertTitle>
          <AlertDescription>{emptyDescription}</AlertDescription>
          {onRetry ? (
            <Box sx={{ mt: UI_KIT_SPACING.field }}>
              <Button variant="outline" size="sm" type="button" onClick={onRetry}>
                Refresh
              </Button>
            </Box>
          ) : null}
        </Alert>
      </Box>
    )
  }

  return <>{children}</>
}

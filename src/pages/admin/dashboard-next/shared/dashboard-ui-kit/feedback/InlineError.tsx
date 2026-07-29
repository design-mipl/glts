import { Box } from '@mui/material'
import { Alert, AlertDescription, AlertTitle, Button } from '../shadcn'
import { UI_KIT_SPACING } from '../tokens'

export interface InlineErrorProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function InlineError({
  title = 'Unable to load',
  description = 'Something went wrong. Try again.',
  onRetry,
}: InlineErrorProps) {
  return (
    <Box sx={{ py: UI_KIT_SPACING.stack }} role="alert">
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
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

import { Alert, AlertDescription, AlertTitle, Button } from '../shadcn'

export interface EmptyInsightProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyInsight({
  title = 'No insights yet',
  description = 'Insights will appear once enough activity is available.',
  actionLabel,
  onAction,
}: EmptyInsightProps) {
  return (
    <Alert variant="default" role="status">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {actionLabel && onAction ? (
        <Button variant="outline" size="sm" type="button" onClick={onAction} style={{ marginTop: 12 }}>
          {actionLabel}
        </Button>
      ) : null}
    </Alert>
  )
}

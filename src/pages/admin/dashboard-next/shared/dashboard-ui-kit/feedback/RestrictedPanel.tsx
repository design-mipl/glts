import { Alert, AlertDescription, AlertTitle } from '../shadcn'

export interface RestrictedPanelProps {
  title?: string
  description?: string
}

export function RestrictedPanel({
  title = 'Access restricted',
  description = 'You do not have permission to view this section.',
}: RestrictedPanelProps) {
  return (
    <Alert variant="default" role="status">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

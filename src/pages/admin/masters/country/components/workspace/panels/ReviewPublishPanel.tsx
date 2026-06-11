import type { CountryConfigSummary } from '@/shared/types/countryMaster'
import { ValidationSummary } from '../ValidationSummary'

interface ReviewPublishPanelProps {
  summary: CountryConfigSummary
  onWarningClick?: (nodePath: string) => void
}

export function ReviewPublishPanel({ summary, onWarningClick }: ReviewPublishPanelProps) {
  return <ValidationSummary summary={summary} onWarningClick={onWarningClick} />
}

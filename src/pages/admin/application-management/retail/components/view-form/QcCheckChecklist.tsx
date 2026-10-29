import { QcChecklistExecutePanel } from '@/shared/components/QcChecklistExecutePanel'
import type { CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import {
  QC_CHECK_OUTCOME_OPTIONS,
  type QcCheckOutcome,
} from '../../config/qcCheckChecklistConfig'

interface QcCheckChecklistProps {
  template: CountryQcChecklistTemplate
  checked: Record<string, boolean>
  outcome: QcCheckOutcome | ''
  onCheckedChange: (itemId: string, value: boolean) => void
  onOutcomeChange: (outcome: QcCheckOutcome | '') => void
  readOnly?: boolean
  submitLabel?: string
  submitDisabled?: boolean
  submitHint?: string
  onSubmit?: () => void
}

export function QcCheckChecklist({
  template,
  checked,
  outcome,
  onCheckedChange,
  onOutcomeChange,
  readOnly = false,
  submitLabel,
  submitDisabled = false,
  submitHint,
  onSubmit,
}: QcCheckChecklistProps) {
  return (
    <QcChecklistExecutePanel
      template={template}
      checked={checked}
      onCheckedChange={onCheckedChange}
      outcome={outcome}
      onOutcomeChange={value => onOutcomeChange(value as QcCheckOutcome | '')}
      outcomeLabel="QC outcome"
      outcomeOptions={QC_CHECK_OUTCOME_OPTIONS}
      readOnly={readOnly}
      actionLabel={submitLabel}
      actionDisabled={submitDisabled}
      actionHint={submitHint}
      onAction={onSubmit}
    />
  )
}

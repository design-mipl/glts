import { useMemo, useState } from 'react'
import { getDefaultQcChecklistTemplate } from '@/shared/data/countryQcChecklistDefaults'
import { QcChecklistExecutePanel } from '@/shared/components/QcChecklistExecutePanel'
import { resolveOfferingQcChecklist } from '@/shared/services/countryMasterService'
import { applyOpsVerificationOutcomeToListing } from '@/shared/utils/applicationQueueStatus'
import {
  VERIFICATION_OUTCOME_OPTIONS,
  type VerificationOutcome,
} from '../../config/documentVerificationChecklistConfig'

interface VerifyFinalVerificationChecklistProps {
  applicationId?: string
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  readOnly?: boolean
  onSubmitted?: (outcome: VerificationOutcome) => void
}

function canSubmitOpsOutcome(
  outcome: VerificationOutcome | '',
  checked: Record<string, boolean>,
  itemIds: string[],
): boolean {
  if (!outcome) return false
  if (outcome === 'correction' || outcome === 'missing') return true
  return itemIds.length > 0 && itemIds.every((id) => checked[id])
}

export function VerifyFinalVerificationChecklist({
  applicationId,
  countryId,
  visaOfferingId,
  jurisdictionId,
  readOnly = false,
  onSubmitted,
}: VerifyFinalVerificationChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [outcome, setOutcome] = useState<VerificationOutcome | ''>('')
  const [submitted, setSubmitted] = useState(false)

  const template = useMemo(() => {
    if (!countryId || !visaOfferingId) return getDefaultQcChecklistTemplate('ops')
    return resolveOfferingQcChecklist(countryId, visaOfferingId, 'ops', jurisdictionId)
  }, [countryId, jurisdictionId, visaOfferingId])

  const itemIds = useMemo(
    () => template.sections.flatMap((section) => section.items.map((item) => item.id)),
    [template],
  )

  const readyToSubmit = canSubmitOpsOutcome(outcome, checked, itemIds)

  const handleSubmit = () => {
    if (!applicationId || !outcome || !readyToSubmit || submitted) return
    applyOpsVerificationOutcomeToListing(applicationId, outcome)
    setSubmitted(true)
    onSubmitted?.(outcome)
  }

  return (
    <QcChecklistExecutePanel
      template={template}
      checked={checked}
      onCheckedChange={(itemId, value) => {
        setSubmitted(false)
        setChecked((prev) => ({ ...prev, [itemId]: value }))
      }}
      outcome={outcome}
      onOutcomeChange={(value) => {
        setSubmitted(false)
        setOutcome(value as VerificationOutcome)
      }}
      outcomeLabel="Verification outcome"
      outcomeOptions={VERIFICATION_OUTCOME_OPTIONS}
      readOnly={readOnly || submitted}
      actionLabel={submitted ? 'Verification submitted' : 'Submit verification outcome'}
      actionDisabled={!applicationId || submitted || !readyToSubmit}
      actionHint={
        submitted
          ? outcome === 'ready'
            ? 'Application moved to Submission Pending and Pending Payment.'
            : 'Application stays on Verification Pending with an Ops status mark.'
          : 'Verified & Ready requires every checklist item. Correction / Missing can submit without full checks.'
      }
      onAction={handleSubmit}
    />
  )
}

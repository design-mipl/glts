import { useMemo, useState } from 'react'
import { getDefaultQcChecklistTemplate } from '@/shared/data/countryQcChecklistDefaults'
import { QcChecklistExecutePanel } from '@/shared/components/QcChecklistExecutePanel'
import { resolveOfferingQcChecklist } from '@/shared/services/countryMasterService'
import {
  VERIFICATION_OUTCOME_OPTIONS,
  type VerificationOutcome,
} from '../../config/documentVerificationChecklistConfig'

interface VerifyFinalVerificationChecklistProps {
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  readOnly?: boolean
}

export function VerifyFinalVerificationChecklist({
  countryId,
  visaOfferingId,
  jurisdictionId,
  readOnly = false,
}: VerifyFinalVerificationChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [outcome, setOutcome] = useState<VerificationOutcome | ''>('')

  const template = useMemo(() => {
    if (!countryId || !visaOfferingId) return getDefaultQcChecklistTemplate('ops')
    return resolveOfferingQcChecklist(countryId, visaOfferingId, 'ops', jurisdictionId)
  }, [countryId, jurisdictionId, visaOfferingId])

  return (
    <QcChecklistExecutePanel
      template={template}
      checked={checked}
      onCheckedChange={(itemId, value) => setChecked((prev) => ({ ...prev, [itemId]: value }))}
      outcome={outcome}
      onOutcomeChange={(value) => setOutcome(value as VerificationOutcome)}
      outcomeLabel="Verification outcome"
      outcomeOptions={VERIFICATION_OUTCOME_OPTIONS}
      readOnly={readOnly}
    />
  )
}

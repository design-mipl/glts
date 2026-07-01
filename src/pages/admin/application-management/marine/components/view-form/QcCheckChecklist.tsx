import { useMemo, useState } from 'react'
import { getDefaultQcChecklistTemplate } from '@/shared/data/countryQcChecklistDefaults'
import { QcChecklistExecutePanel } from '@/shared/components/QcChecklistExecutePanel'
import { resolveOfferingQcChecklist } from '@/shared/services/countryMasterService'
import {
  QC_CHECK_OUTCOME_OPTIONS,
  type QcCheckOutcome,
} from '../../config/qcCheckChecklistConfig'

interface QcCheckChecklistProps {
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  readOnly?: boolean
}

export function QcCheckChecklist({
  countryId,
  visaOfferingId,
  jurisdictionId,
  readOnly = false,
}: QcCheckChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [outcome, setOutcome] = useState<QcCheckOutcome | ''>('')

  const template = useMemo(() => {
    if (!countryId || !visaOfferingId) return getDefaultQcChecklistTemplate('docs')
    return resolveOfferingQcChecklist(countryId, visaOfferingId, 'docs', jurisdictionId)
  }, [countryId, jurisdictionId, visaOfferingId])

  return (
    <QcChecklistExecutePanel
      template={template}
      checked={checked}
      onCheckedChange={(itemId, value) => setChecked((prev) => ({ ...prev, [itemId]: value }))}
      outcome={outcome}
      onOutcomeChange={(value) => setOutcome(value as QcCheckOutcome)}
      outcomeLabel="QC outcome"
      outcomeOptions={QC_CHECK_OUTCOME_OPTIONS}
      readOnly={readOnly}
    />
  )
}

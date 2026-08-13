import { getDefaultQcChecklistTemplate } from '@/shared/data/countryQcChecklistDefaults'
import { resolveOfferingQcChecklist } from '@/shared/services/countryMasterService'
import type { MarineDocsQcCheckRecord as B2bDocsQcCheckRecord } from '@/shared/services/applicationMarineQcCheckService'
import { applicationMarineQcCheckService } from '@/shared/services/applicationMarineQcCheckService'
import type { CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import type { MarineApplicationRow as B2bApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { resolveB2bWorkspaceMode } from '../config/B2bWorkspaceMode'

export function resolveDocsQcTemplate(
  countryId?: string,
  visaOfferingId?: string,
  jurisdictionId?: string,
): CountryQcChecklistTemplate {
  if (!countryId || !visaOfferingId) {
    return getDefaultQcChecklistTemplate('docs')
  }
  return resolveOfferingQcChecklist(countryId, visaOfferingId, 'docs', jurisdictionId)
}

export function isDocsQcFormViewUnlocked(
  template: CountryQcChecklistTemplate,
  record: B2bDocsQcCheckRecord,
  bypassGate: boolean,
): boolean {
  if (bypassGate) return true
  return applicationMarineQcCheckService.isComplete(template, record)
}

/** Form view is only available post-submission (read-only) or after Verified & ready QC is submitted. */
export function resolveFormViewTabEnabled(
  listingRow: B2bApplicationRow | undefined,
  record: B2bDocsQcCheckRecord | null,
): boolean {
  if (!listingRow || !record) return false

  const mode = resolveB2bWorkspaceMode(listingRow)
  if (mode === 'readonly' || mode === 'pending_payment') return true
  if (mode !== 'online_submission') return false

  return applicationMarineQcCheckService.isReadySubmitted(record)
}

export const FORM_VIEW_QC_LOCKED_MESSAGE =
  'Complete the internal QC checklist and mark Verified & ready for submission to open Form view.'

export const DOCS_QC_SUBMIT_HINT =
  'Select a QC outcome to submit. Verified & ready also requires every checklist item confirmed.'

export function getDocsQcSubmittedHint(outcome: B2bDocsQcCheckRecord['outcome']): string {
  if (outcome === 'correction' || outcome === 'blocked') {
    return 'QC submitted and flagged for Ops. Form view stays locked until Verified & ready.'
  }
  return 'QC already submitted. You can proceed in Form view.'
}

export function getDocsQcSubmitSuccessMessage(outcome: B2bDocsQcCheckRecord['outcome']): {
  title: string
  description: string
} {
  if (outcome === 'correction' || outcome === 'blocked') {
    return {
      title: 'QC check submitted',
      description: 'Flagged for Ops follow-up. Form view stays locked until Verified & ready.',
    }
  }
  return {
    title: 'QC check submitted',
    description: 'Form view is now unlocked for this traveler.',
  }
}

export function getDocsQcSubmitBlockedMessage(): { title: string; description: string } {
  return {
    title: 'Select a QC outcome first',
    description:
      'Choose Correction required, Document missing / blocked, or confirm every checklist item and select Verified & ready for submission.',
  }
}

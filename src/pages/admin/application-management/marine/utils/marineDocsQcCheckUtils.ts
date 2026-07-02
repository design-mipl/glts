import { getDefaultQcChecklistTemplate } from '@/shared/data/countryQcChecklistDefaults'
import { resolveOfferingQcChecklist } from '@/shared/services/countryMasterService'
import type { MarineDocsQcCheckRecord } from '@/shared/services/applicationMarineQcCheckService'
import { applicationMarineQcCheckService } from '@/shared/services/applicationMarineQcCheckService'
import type { CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { resolveMarineWorkspaceMode } from '../config/marineWorkspaceMode'

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
  record: MarineDocsQcCheckRecord,
  bypassGate: boolean,
): boolean {
  if (bypassGate) return true
  return applicationMarineQcCheckService.isComplete(template, record)
}

/** Form view is only available post-submission (read-only) or after QC completion is explicitly submitted in online submission. */
export function resolveFormViewTabEnabled(
  listingRow: MarineApplicationRow | undefined,
  record: MarineDocsQcCheckRecord | null,
): boolean {
  if (!listingRow || !record) return false

  const mode = resolveMarineWorkspaceMode(listingRow)
  if (mode === 'readonly') return true
  if (mode !== 'online_submission') return false

  return applicationMarineQcCheckService.isSubmitted(record)
}

export const FORM_VIEW_QC_LOCKED_MESSAGE =
  'Complete the internal QC checklist and mark Verified & ready for submission to open Form view.'

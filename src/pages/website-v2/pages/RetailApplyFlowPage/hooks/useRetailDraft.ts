import { useCallback, useEffect, useState } from 'react'
import {
  createRetailApplicantParty,
  emptyRetailFlowDraft,
  syncPrimaryApplicantMirror,
  type RetailApplicantParty,
  type RetailFlowDraft,
  type RetailSponsorSelection,
  type RetailTravellerSponsor,
} from '../types'

const STORAGE_KEY = 'glts:retail-apply-flow'

/**
 * Migrate legacy application-level `draft.sponsor` onto each applicant.
 * Old `traveller` mode (one person funds everyone) does not map cleanly —
 * we mark that applicant as individual and leave others unset so the user re-confirms.
 */
function migrateLegacySponsor(
  applicants: RetailApplicantParty[],
  legacy?: RetailSponsorSelection,
): RetailApplicantParty[] {
  const anyHasSponsor = applicants.some((a) => a.sponsor != null)
  if (anyHasSponsor || !legacy) return applicants

  if (legacy.mode === 'self_paying') {
    return applicants.map((a) => ({ ...a, sponsor: { mode: 'individual' as const } }))
  }

  if (legacy.mode === 'someone_else') {
    const someoneElse: RetailTravellerSponsor = {
      mode: 'someone_else',
      name: legacy.name ?? '',
      relationship: '',
      contact: '',
    }
    return applicants.map((a) => ({ ...a, sponsor: { ...someoneElse } }))
  }

  if (legacy.mode === 'traveller') {
    return applicants.map((a) =>
      a.id === legacy.applicantId
        ? { ...a, sponsor: { mode: 'individual' as const } }
        : a,
    )
  }

  return applicants
}

function normalizeDraft(draft: RetailFlowDraft): RetailFlowDraft {
  const applicantsRaw =
    draft.applicants?.length > 0
      ? draft.applicants
      : [
          {
            ...createRetailApplicantParty(0, draft.traveller),
            photo: draft.photo,
            passport: draft.passport,
            passportBack: draft.passportBack,
            passportFields: draft.passportFields,
          },
        ]

  const applicants = migrateLegacySponsor(applicantsRaw, draft.sponsor)
  const { sponsor: _legacySponsor, ...rest } = draft
  return syncPrimaryApplicantMirror({ ...rest, applicants })
}

function loadStoredDraft(countryId: string, visaOfferingId: string): RetailFlowDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyRetailFlowDraft(countryId, visaOfferingId)
    const parsed = JSON.parse(raw) as RetailFlowDraft
    if (parsed.countryId !== countryId || parsed.visaOfferingId !== visaOfferingId) {
      return emptyRetailFlowDraft(countryId, visaOfferingId)
    }
    return normalizeDraft({ ...emptyRetailFlowDraft(countryId, visaOfferingId), ...parsed })
  } catch {
    return emptyRetailFlowDraft(countryId, visaOfferingId)
  }
}

export function useRetailDraft(countryId: string, visaOfferingId: string) {
  const [draft, setDraft] = useState<RetailFlowDraft>(() => loadStoredDraft(countryId, visaOfferingId))

  useEffect(() => {
    setDraft(loadStoredDraft(countryId, visaOfferingId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, visaOfferingId])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // sessionStorage unavailable (e.g. private browsing quota) — draft stays in-memory only
    }
  }, [draft])

  const patchDraft = useCallback((patch: Partial<RetailFlowDraft> | ((prev: RetailFlowDraft) => Partial<RetailFlowDraft>)) => {
    setDraft((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      return next.applicants ? syncPrimaryApplicantMirror(next) : next
    })
  }, [])

  const resetDraft = useCallback(() => {
    setDraft(emptyRetailFlowDraft(countryId, visaOfferingId))
  }, [countryId, visaOfferingId])

  return { draft, patchDraft, resetDraft }
}

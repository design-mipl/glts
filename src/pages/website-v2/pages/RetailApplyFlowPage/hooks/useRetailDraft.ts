import { useCallback, useEffect, useState } from 'react'
import {
  createRetailApplicantParty,
  emptyRetailFlowDraft,
  syncPrimaryApplicantMirror,
  type RetailFlowDraft,
} from '../types'

const STORAGE_KEY = 'glts:retail-apply-flow'

function normalizeDraft(draft: RetailFlowDraft): RetailFlowDraft {
  const applicants =
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
  return syncPrimaryApplicantMirror({ ...draft, applicants })
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

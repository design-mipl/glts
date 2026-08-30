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
import {
  ensureRetailWebsiteApplicationDraft,
  getRetailWebsiteDraft,
} from '@/shared/services/retailWebsiteApplicationService'
import type { CustomerPortalRole } from '@/shared/auth/session'

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

export interface UseRetailDraftOptions {
  countryId: string
  visaOfferingId: string
  applicationId?: string
  startFresh?: boolean
  creatorEmail: string
  creatorRole: CustomerPortalRole
}

function loadInitial(options: UseRetailDraftOptions): { id: string; draft: RetailFlowDraft } {
  const ensured = ensureRetailWebsiteApplicationDraft({
    countryId: options.countryId,
    visaOfferingId: options.visaOfferingId,
    applicationId: options.applicationId,
    startFresh: options.startFresh,
    creatorEmail: options.creatorEmail,
    creatorRole: options.creatorRole,
  })
  const stored = getRetailWebsiteDraft(ensured.id)
  return {
    id: ensured.id,
    draft: normalizeDraft(
      stored ?? { ...emptyRetailFlowDraft(options.countryId, options.visaOfferingId), applicationId: ensured.id },
    ),
  }
}

export function useRetailDraft(options: UseRetailDraftOptions) {
  const [initial] = useState(() => loadInitial(options))
  const [applicationId] = useState(initial.id)
  const [draft, setDraft] = useState<RetailFlowDraft>(initial.draft)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // sessionStorage unavailable (e.g. private browsing quota) — draft stays in-memory only
    }
  }, [draft])

  const patchDraft = useCallback((patch: Partial<RetailFlowDraft> | ((prev: RetailFlowDraft) => Partial<RetailFlowDraft>)) => {
    setDraft((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch), applicationId }
      return next.applicants ? syncPrimaryApplicantMirror(next) : next
    })
  }, [applicationId])

  const resetDraft = useCallback(() => {
    setDraft({
      ...emptyRetailFlowDraft(options.countryId, options.visaOfferingId),
      applicationId,
    })
  }, [applicationId, options.countryId, options.visaOfferingId])

  return { draft, patchDraft, resetDraft, applicationId }
}

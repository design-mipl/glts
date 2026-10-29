import { useMemo } from 'react'
import { resolveRetailJourney } from '@/shared/services/retailJourneyResolver'
import { buildRetailStepPlan } from '../config/stepPlan'
import type { RetailFlowDraft } from '../types'

function needsSponsorDocsStep(draft: RetailFlowDraft): boolean {
  return draft.applicants.some(
    (applicant) =>
      applicant.sponsor?.mode === 'someone_else' && Boolean(applicant.sponsor.profileComplete),
  )
}

/**
 * Step existence mostly depends on country + offering. Sponsor bank-statement
 * step is draft-dependent: only when at least one traveller has a completed
 * “Someone else” sponsor profile.
 */
export function useRetailStepPlan(countryId: string, visaOfferingId: string, draft: RetailFlowDraft) {
  const baseJourney = useMemo(
    () => resolveRetailJourney({ countryId, visaOfferingId }),
    [countryId, visaOfferingId],
  )

  const steps = useMemo(() => {
    const plan = baseJourney ? buildRetailStepPlan(baseJourney) : []
    if (needsSponsorDocsStep(draft)) return plan
    return plan.filter((step) => step.id !== 'sponsorDocs')
  }, [baseJourney, draft.applicants])

  const journey = useMemo(
    () =>
      resolveRetailJourney({
        countryId,
        visaOfferingId,
        jurisdictionId: draft.jurisdictionId,
        answers: draft.answers,
      }),
    [countryId, visaOfferingId, draft.jurisdictionId, draft.answers],
  )

  return { baseJourney, journey, steps }
}

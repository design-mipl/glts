import { useMemo } from 'react'
import { resolveRetailJourney } from '@/shared/services/retailJourneyResolver'
import { buildRetailStepPlan } from '../config/stepPlan'
import type { RetailFlowDraft } from '../types'

/**
 * Step existence (which steps appear) only depends on country + offering — not on the
 * jurisdiction/answers collected along the way — because `retailJourneyRules` config and the
 * base document rules that drive `hasEligibilityGate` / `requiresJurisdictionSelection` /
 * `allowsPhysicalOriginalDocuments` are static per offering. So the step plan is resolved once
 * from a base (answer-less) journey, while step *content* uses the live journey below.
 */
export function useRetailStepPlan(countryId: string, visaOfferingId: string, draft: RetailFlowDraft) {
  const baseJourney = useMemo(
    () => resolveRetailJourney({ countryId, visaOfferingId }),
    [countryId, visaOfferingId],
  )

  const steps = useMemo(() => (baseJourney ? buildRetailStepPlan(baseJourney) : []), [baseJourney])

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

import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import type { RetailStepDefinition } from '../types'

export function buildRetailStepPlan(journey: RetailJourney): RetailStepDefinition[] {
  // Destination is chosen on the country page before apply starts.
  const steps: RetailStepDefinition[] = [
    { id: 'visa', phase: 'purpose', label: 'Visa type' },
  ]

  // Application centre (jurisdiction cities) — before traveller details.
  if (journey.requiresJurisdictionSelection) {
    steps.push({ id: 'jurisdiction', phase: 'purpose', label: 'Submission city' })
  }

  // Name + Build profile per traveller.
  steps.push({ id: 'travelProfile', phase: 'traveller', label: 'Travel profile' })

  // Trip sponsor — after profiles are ready.
  steps.push({ id: 'sponsor', phase: 'sponsor', label: 'Sponsor' })

  // Photo + passport immediately after sponsor.
  steps.push({ id: 'passport', phase: 'documents', label: 'Essential documents' })

  if (journey.hasEligibilityGate) {
    steps.push({ id: 'eligibility', phase: 'documents', label: 'Eligibility check' })
  }

  for (const question of journey.conditionalQuestions) {
    steps.push({ id: `question:${question.id}`, phase: 'documents', label: question.title })
  }

  steps.push({ id: 'checklist', phase: 'documents', label: 'Document checklist' })

  if (journey.allowsPhysicalOriginalDocuments) {
    steps.push(
      { id: 'originalDocuments', phase: 'documents', label: 'Original documents' },
      { id: 'collectionMethod', phase: 'documents', label: 'Collection method' },
      { id: 'collectionDetails', phase: 'documents', label: 'Collection details' },
      { id: 'collectionConfirmation', phase: 'documents', label: 'Confirm collection' },
    )
  }

  steps.push(
    { id: 'insurance', phase: 'extras', label: 'Travel insurance' },
    { id: 'flightTicket', phase: 'extras', label: 'Flight ticket' },
    { id: 'review', phase: 'pay', label: 'Review' },
    { id: 'payment', phase: 'pay', label: 'Payment' },
    { id: 'success', phase: 'pay', label: 'Success' },
  )

  return steps
}

/** Top stepper phases — aligned to the retail apply journey. */
export const RETAIL_PHASE_ORDER = [
  'purpose',
  'traveller',
  'sponsor',
  'documents',
  'extras',
  'pay',
] as const

export const RETAIL_PHASE_LABEL: Record<(typeof RETAIL_PHASE_ORDER)[number], string> = {
  purpose: 'Purpose',
  traveller: 'Travel profile',
  sponsor: 'Sponsor',
  documents: 'Documents',
  extras: 'Extras',
  pay: 'Payment',
}

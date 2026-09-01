import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import type { RetailStepDefinition } from '../types'

/**
 * Retail apply step sequence driven by Country Master + resolved journey flags.
 */
export const DESTINATION_STEP: RetailStepDefinition = {
  id: 'destination',
  phase: 'destination',
  label: 'Destination',
}

export function buildRetailStepPlan(journey: RetailJourney): RetailStepDefinition[] {
  const steps: RetailStepDefinition[] = [
    DESTINATION_STEP,
    { id: 'visa', phase: 'purpose', label: 'Visa type' },
    { id: 'jurisdiction', phase: 'purpose', label: 'Submission city' },
    { id: 'travelProfile', phase: 'traveller', label: 'Travel profile' },
    { id: 'sponsor', phase: 'sponsor', label: 'Sponsor' },
    { id: 'passport', phase: 'documents', label: 'Essential documents' },
  ]

  if (journey.hasEligibilityGate) {
    steps.push({ id: 'eligibility', phase: 'documents', label: 'Eligibility check' })
  }

  for (const question of journey.conditionalQuestions) {
    steps.push({ id: `question:${question.id}`, phase: 'documents', label: question.title })
  }

  steps.push({ id: 'checklist', phase: 'documents', label: 'Document checklist' })

  if (journey.allowsPhysicalOriginalDocuments) {
    steps.push({ id: 'originalDocuments', phase: 'documents', label: 'Original documents' })
    steps.push({ id: 'collectionDetails', phase: 'collection', label: 'Handover' })
  }

  steps.push(
    { id: 'insurance', phase: 'extras', label: 'Travel insurance' },
    { id: 'flightTicket', phase: 'extras', label: 'Flight ticket' },
    { id: 'review', phase: 'review', label: 'Review' },
    { id: 'payment', phase: 'pay', label: 'Payment' },
    { id: 'success', phase: 'pay', label: 'Success' },
  )

  return steps
}

/** Top stepper phases — aligned to the retail apply journey (B2–B19). */
export const RETAIL_PHASE_ORDER = [
  'destination',
  'purpose',
  'traveller',
  'sponsor',
  'documents',
  'collection',
  'extras',
  'review',
  'pay',
] as const

export const RETAIL_PHASE_LABEL: Record<(typeof RETAIL_PHASE_ORDER)[number], string> = {
  destination: 'Destination',
  purpose: 'Purpose',
  traveller: 'Profile',
  sponsor: 'Sponsor',
  documents: 'Documents',
  collection: 'Collection',
  extras: 'Extras',
  review: 'Review',
  pay: 'Payment',
}

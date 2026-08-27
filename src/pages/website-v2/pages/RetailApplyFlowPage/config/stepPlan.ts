import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import type { RetailStepDefinition } from '../types'

/**
 * Full retail apply step sequence for the V2 design pass.
 *
 * Always include the complete UX path for every application. Country-master
 * gating (which steps/docs apply per offering) comes later — do not hide
 * collection / jurisdiction / extras based on journey flags for now.
 *
 * Eligibility + conditional questions remain optional add-ons when the
 * journey resolver already surfaces them for a given offering.
 */
export function buildRetailStepPlan(journey: RetailJourney): RetailStepDefinition[] {
  // Destination is chosen on the country page before apply starts.
  const steps: RetailStepDefinition[] = [
    { id: 'visa', phase: 'purpose', label: 'Visa type' },
    // Always show city + travel date (cities may be empty until country master is wired).
    { id: 'jurisdiction', phase: 'purpose', label: 'Submission city' },
    { id: 'travelProfile', phase: 'traveller', label: 'Travel profile' },
    { id: 'sponsor', phase: 'sponsor', label: 'Sponsor' },
    { id: 'sponsorDocs', phase: 'sponsor', label: 'Sponsor documents' },
    { id: 'passport', phase: 'documents', label: 'Essential documents' },
  ]

  if (journey.hasEligibilityGate) {
    steps.push({ id: 'eligibility', phase: 'documents', label: 'Eligibility check' })
  }

  for (const question of journey.conditionalQuestions) {
    steps.push({ id: `question:${question.id}`, phase: 'documents', label: question.title })
  }

  steps.push(
    { id: 'checklist', phase: 'documents', label: 'Document checklist' },
    { id: 'originalDocuments', phase: 'documents', label: 'Original documents' },
    { id: 'collectionMethod', phase: 'collection', label: 'Collection method' },
    { id: 'collectionDetails', phase: 'collection', label: 'Collection details' },
    { id: 'collectionConfirmation', phase: 'collection', label: 'Confirm collection' },
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
  purpose: 'Purpose',
  traveller: 'Profile',
  sponsor: 'Sponsor',
  documents: 'Documents',
  collection: 'Collection',
  extras: 'Extras',
  review: 'Review',
  pay: 'Payment',
}

/**
 * Retail application flow — conditional question and eligibility config.
 *
 * Prefer mapping a Requirement Master pack on the retail visa type / segment in
 * Country Master (`requirementPackId`). `retailJourneyResolver` uses that pack
 * first; this file remains a fallback for demos that are not yet mapped, plus
 * eligibility gates (not yet modeled on Requirement Master).
 *
 * Keyed by (countryId, visaOfferingId) so it stays additive.
 */

export interface ConditionalQuestionOption {
  id: string
  label: string
  description?: string
  /** Document Master ids added to the retail checklist when this option is selected. */
  extraDocumentIds?: string[]
}

export interface ConditionalQuestionDefinition {
  id: string
  title: string
  helperText?: string
  options: ConditionalQuestionOption[]
}

export interface EligibilityOption {
  id: string
  label: string
  description?: string
  eligible: boolean
  /** Shown on the dead-end screen when this option is selected and `eligible` is false. */
  ineligibleReason?: string
}

export interface EligibilityRuleDefinition {
  id: string
  title: string
  helperText?: string
  options: EligibilityOption[]
}

export interface RetailJourneyRuleSet {
  /** Rendered in the Documents phase; answers add extra documents to the checklist. */
  conditionalQuestions?: ConditionalQuestionDefinition[]
  /** Rendered before Photo/Passport capture; failing routes to a dead-end screen. */
  eligibility?: EligibilityRuleDefinition[]
  /**
   * Document ids that must be collected as physical originals for this offering.
   * Falls back to whatever Country Master document rules already mark `originalDocument: true`
   * when not set here.
   */
  originalDocumentIdsOverride?: string[]
}

const EMPTY_RULE_SET: RetailJourneyRuleSet = {}

const RETAIL_JOURNEY_RULES: Record<string, Record<string, RetailJourneyRuleSet>> = {
  // Japan — Demo B: conditional documents via employment status.
  '2': {
    'jp-evisa-tourist': {
      conditionalQuestions: [
        {
          id: 'employmentStatus',
          title: "What's your current employment status?",
          helperText: 'This determines which financial documents we need from you.',
          options: [
            {
              id: 'employed',
              label: 'Salaried employee',
              description: 'Working full-time or part-time for an employer',
              extraDocumentIds: ['salary-slip', 'employment-certificate'],
            },
            {
              id: 'self_employed',
              label: 'Self-employed / business owner',
              description: 'Running your own business or freelancing',
              extraDocumentIds: ['income-tax-return', 'company-bank-statement'],
            },
            {
              id: 'student',
              label: 'Student',
              description: 'Currently enrolled in a school, college, or university',
              extraDocumentIds: ['authority-letter'],
            },
            {
              id: 'not_employed',
              label: 'Not currently employed',
              extraDocumentIds: ['bank-balance-certificate'],
            },
          ],
        },
      ],
    },
  },
  // France — Demo C: jurisdiction selection + sponsorship question + original documents.
  '14': {
    'schengen-tourist': {
      conditionalQuestions: [
        {
          id: 'sponsorship',
          title: 'Is your trip self-funded or sponsored by someone else?',
          helperText: 'Sponsored trips need an invitation and guarantee letter from your host.',
          options: [
            {
              id: 'self_funded',
              label: "I'm funding this trip myself",
              extraDocumentIds: [],
            },
            {
              id: 'sponsored',
              label: 'Someone else is sponsoring my trip',
              description: 'A friend, family member, or company in France is covering this visit',
              extraDocumentIds: ['invitation', 'letter-of-guarantee'],
            },
          ],
        },
      ],
      originalDocumentIdsOverride: ['passport', 'photo', 'bank-balance-certificate'],
    },
  },
  // Turkey — Demo D: eligibility gate before anything else.
  '32': {
    'tr-evisa-tourist': {
      eligibility: [
        {
          id: 'nationality-purpose',
          title: 'Quick eligibility check',
          helperText: "Turkey's e-Visa only covers a subset of nationalities and travel purposes.",
          options: [
            {
              id: 'eligible-tourist',
              label: 'Indian passport holder travelling for tourism or business',
              eligible: true,
            },
            {
              id: 'ineligible-purpose',
              label: 'Travelling for work, study, or a long-term stay',
              eligible: false,
              ineligibleReason:
                'The e-Visa only covers short tourism and business visits. You will need a sticker visa from the nearest Turkish consulate for this purpose.',
            },
          ],
        },
      ],
    },
  },
}

export function getRetailJourneyRules(countryId: string, visaOfferingId: string): RetailJourneyRuleSet {
  return RETAIL_JOURNEY_RULES[countryId]?.[visaOfferingId] ?? EMPTY_RULE_SET
}

export function offeringHasEligibilityGate(countryId: string, visaOfferingId: string): boolean {
  return (getRetailJourneyRules(countryId, visaOfferingId).eligibility?.length ?? 0) > 0
}

export function offeringHasConditionalQuestions(countryId: string, visaOfferingId: string): boolean {
  return (getRetailJourneyRules(countryId, visaOfferingId).conditionalQuestions?.length ?? 0) > 0
}

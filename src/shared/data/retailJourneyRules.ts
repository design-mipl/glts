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

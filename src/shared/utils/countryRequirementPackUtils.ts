import { requirementMasterService } from '@/shared/services/requirementMasterService'
import type {
  CountrySegmentConfig,
  CountryVisaJurisdiction,
  CountryVisaType,
} from '@/shared/types/countryMaster'
import type { RequirementMaster } from '@/shared/types/requirementMaster'
import type { ConditionalQuestionDefinition } from '@/shared/data/retailJourneyRules'

/**
 * Resolve pack id for retail:
 * jurisdiction (when jurisdictions enabled) → visa type → segment default.
 */
export function resolveCountryRequirementPackId(input: {
  segment?: Pick<CountrySegmentConfig, 'requirementPackId'> | null
  visaType?: Pick<CountryVisaType, 'requirementPackId' | 'jurisdictionEnabled'> | null
  jurisdiction?: Pick<CountryVisaJurisdiction, 'requirementPackId'> | null
}): string | undefined {
  const { segment, visaType, jurisdiction } = input
  const jurisdictionsEnabled = visaType?.jurisdictionEnabled === true

  if (jurisdictionsEnabled) {
    const fromJurisdiction = jurisdiction?.requirementPackId?.trim()
    if (fromJurisdiction) return fromJurisdiction
  } else {
    const fromVisaType = visaType?.requirementPackId?.trim()
    if (fromVisaType) return fromVisaType
  }

  // Fallback: allow visa-type pack even when jurisdictions are on (legacy / incomplete mapping),
  // then segment default.
  const fromVisaTypeFallback = visaType?.requirementPackId?.trim()
  if (fromVisaTypeFallback) return fromVisaTypeFallback

  const segmentId = segment?.requirementPackId?.trim()
  return segmentId || undefined
}

export function getActiveRequirementPackSelectOptions(): { value: string; label: string }[] {
  return requirementMasterService
    .list({ status: 'active' })
    .map((row) => ({ value: row.id, label: row.name }))
}

export function getRequirementPackDisplayName(packId: string | undefined | null): string {
  if (!packId?.trim()) return '—'
  return requirementMasterService.getById(packId)?.name ?? packId
}

/** Maps a Requirement Master pack into retail conditional-question shape. */
export function requirementPackToConditionalQuestions(
  pack: RequirementMaster,
): ConditionalQuestionDefinition[] {
  return pack.questions.map((question) => ({
    id: question.id,
    title: question.prompt,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      extraDocumentIds: [...option.documentIds],
    })),
  }))
}

export function resolveRequirementPackConditionalQuestions(input: {
  segment?: Pick<CountrySegmentConfig, 'requirementPackId'> | null
  visaType?: Pick<CountryVisaType, 'requirementPackId' | 'jurisdictionEnabled'> | null
  jurisdiction?: Pick<CountryVisaJurisdiction, 'requirementPackId'> | null
}): ConditionalQuestionDefinition[] | undefined {
  const packId = resolveCountryRequirementPackId(input)
  if (!packId) return undefined
  const pack = requirementMasterService.getById(packId)
  if (!pack || pack.status !== 'active') return undefined
  return requirementPackToConditionalQuestions(pack)
}

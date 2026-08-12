import { GLTS_APPLICATION_IDS } from '@/pages/customer/data/portalIds'
import { GLTS_BATCH_IDS, MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID } from './applicationFlowData'
import type { ApplicantDocumentItem } from './applicationFlowData'
import type { SimpleDocumentRequirementId } from '@/shared/utils/applicantDocumentWorkflowUtils'

/** Which ticket/insurance docs GLTS must arrange (upload) in demo data. */
export type GltsArrangeDocumentId = Extract<SimpleDocumentRequirementId, 'travel-ticket' | 'insurance'>

export interface GltsArrangedDocumentDemoSeed {
  applicationId: string
  /** Defaults to both travel-ticket and insurance. */
  documentIds?: readonly GltsArrangeDocumentId[]
  /**
   * 0-based traveler indices that receive the seed.
   * Omit → primary traveler only (index 0).
   */
  travelerIndices?: readonly number[]
}

const BOTH: readonly GltsArrangeDocumentId[] = ['travel-ticket', 'insurance']
const TICKET_ONLY: readonly GltsArrangeDocumentId[] = ['travel-ticket']
const INSURANCE_ONLY: readonly GltsArrangeDocumentId[] = ['insurance']

/**
 * Demo applications where GLTS must upload ticket and/or insurance.
 * Weighted toward marine; also covers corporate and B2B listing segments.
 */
export const GLTS_ARRANGED_DOCUMENT_DEMO_SEEDS: readonly GltsArrangedDocumentDemoSeed[] = [
  // —— Marine singles (majority) ——
  {
    applicationId: MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID,
    documentIds: BOTH,
  },
  {
    applicationId: GLTS_APPLICATION_IDS.schengen,
    documentIds: BOTH,
  },
  {
    applicationId: 'GLTS-APP-2026-889',
    documentIds: BOTH,
  },
  {
    applicationId: 'GLTS-APP-2026-891',
    documentIds: BOTH,
  },
  {
    applicationId: 'GLTS-APP-2026-868',
    documentIds: BOTH,
  },
  {
    applicationId: 'GLTS-APP-2026-739',
    documentIds: BOTH,
  },
  {
    applicationId: 'GLTS-APP-2026-881',
    documentIds: TICKET_ONLY,
  },
  {
    applicationId: 'GLTS-APP-2026-884',
    documentIds: TICKET_ONLY,
  },
  {
    applicationId: 'GLTS-APP-2026-887',
    documentIds: INSURANCE_ONLY,
  },
  {
    applicationId: 'GLTS-APP-2026-872',
    documentIds: INSURANCE_ONLY,
  },
  // —— Marine bulk ——
  {
    applicationId: GLTS_BATCH_IDS.schengenCrew,
    documentIds: BOTH,
    travelerIndices: [0, 1],
  },
  {
    applicationId: 'GLTS-BAT-2026-044',
    documentIds: BOTH,
    travelerIndices: [0, 1],
  },
  {
    applicationId: 'GLTS-BAT-2026-046',
    documentIds: TICKET_ONLY,
    travelerIndices: [0],
  },
  // —— Corporate singles ——
  {
    applicationId: 'GLTS-APP-2026-829',
    documentIds: BOTH,
  },
  {
    applicationId: 'GLTS-APP-2026-824',
    documentIds: TICKET_ONLY,
  },
  // —— Corporate bulk ——
  {
    applicationId: 'GLTS-BAT-2026-028',
    documentIds: BOTH,
    travelerIndices: [0],
  },
  // —— B2B singles ——
  {
    applicationId: 'GLTS-APP-2026-802',
    documentIds: INSURANCE_ONLY,
  },
  {
    applicationId: 'GLTS-APP-2026-818',
    documentIds: BOTH,
  },
  // —— B2B bulk ——
  {
    applicationId: 'GLTS-BAT-2026-024',
    documentIds: TICKET_ONLY,
    travelerIndices: [0],
  },
]

const SEED_BY_APPLICATION_ID = new Map(
  GLTS_ARRANGED_DOCUMENT_DEMO_SEEDS.map(seed => [seed.applicationId, seed]),
)

export function getGltsArrangedDocumentDemoSeed(
  applicationId: string,
): GltsArrangedDocumentDemoSeed | undefined {
  return SEED_BY_APPLICATION_ID.get(applicationId)
}

export function shouldApplyGltsArrangedDocuments(
  applicationId: string,
  travelerIndex = 0,
): boolean {
  const seed = getGltsArrangedDocumentDemoSeed(applicationId)
  if (!seed) return false
  const indices = seed.travelerIndices ?? [0]
  return indices.includes(travelerIndex)
}

export function applyGltsArrangedDocuments(
  documents: ApplicantDocumentItem[],
  applicationId: string,
  travelerIndex = 0,
): ApplicantDocumentItem[] {
  const seed = getGltsArrangedDocumentDemoSeed(applicationId)
  if (!seed || !shouldApplyGltsArrangedDocuments(applicationId, travelerIndex)) {
    return documents
  }
  const documentIds = new Set(seed.documentIds ?? BOTH)
  return documents.map(doc => {
    if (!documentIds.has(doc.documentId as GltsArrangeDocumentId)) return doc
    return { ...doc, handlingMode: 'arrange_by_glts' as const, status: 'missing' as const }
  })
}

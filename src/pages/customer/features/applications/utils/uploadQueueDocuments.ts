import { getDocumentWorkspaceItems } from '@/shared/services/countryMasterService'
import { resolveOriginalRequiredDocuments } from '@/shared/utils/originalDocumentCollectionUtils'
import {
  isApplicantDocumentSatisfied,
  seedSimpleDocumentWorkflowFields,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import {
  defaultChecklist,
  type ApplicantDocumentItem,
  type ChecklistItem,
  type ExtractedField,
  type UploadQueueRow,
} from '../data/applicationFlowData'

export interface ApplicantDocumentChecklistContext {
  countryLabel: string
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  seedIndex?: number
  passportFields?: ExtractedField[]
}

export function applicantDocumentChecklistSignature(documents: ApplicantDocumentItem[]): string {
  return documents
    .map(doc => `${doc.documentId}:${doc.required ? 1 : 0}:${doc.originalDocument ? 1 : 0}`)
    .join('|')
}

export function checklistToApplicantDocuments(
  checklist: ChecklistItem[],
  offset = 0,
): ApplicantDocumentItem[] {
  return checklist.map((item, index) => {
    const rotated = (index + offset) % 3
    const status =
      item.status === 'uploaded'
        ? 'verified'
        : item.status === 'pending'
          ? 'needs_review'
          : rotated === 0
            ? 'missing'
            : rotated === 1
              ? 'uploaded'
              : 'needs_review'
    return seedSimpleDocumentWorkflowFields({
      documentId: item.id,
      name: item.label,
      required: item.required,
      status,
      fields: [],
    })
  })
}

export function createApplicantDocuments(
  countryId: string,
  offeringId: string,
  passportFields: ExtractedField[],
  seedIndex = 0,
  jurisdictionId?: string,
): ApplicantDocumentItem[] {
  const workspace = getDocumentWorkspaceItems(countryId, offeringId, 'normal', jurisdictionId)
  const statusCycle: ApplicantDocumentItem['status'][] = [
    'verified',
    'uploaded',
    'missing',
    'missing',
    'needs_review',
    'missing',
    'missing',
  ]

  const documents = workspace.map((doc, i) => {
    const isPassport = doc.id === 'passport'
    let status = statusCycle[(seedIndex + i) % statusCycle.length]
    if (isPassport && passportFields.length > 0) status = 'verified'
    if (!doc.required && status === 'missing') status = 'missing'

    const item: ApplicantDocumentItem = {
      documentId: doc.id,
      name: doc.name,
      required: doc.required,
      description: doc.description,
      originalDocument: Boolean(doc.originalDocument),
      status,
      fields: isPassport ? passportFields : undefined,
    }
    return seedSimpleDocumentWorkflowFields(item)
  })

  return dedupeApplicantDocuments(documents)
}

function dedupeApplicantDocuments(documents: ApplicantDocumentItem[]): ApplicantDocumentItem[] {
  const byId = new Map<string, ApplicantDocumentItem>()
  const order: string[] = []

  for (const doc of documents) {
    const previous = byId.get(doc.documentId)
    if (previous) {
      byId.set(doc.documentId, {
        ...previous,
        ...doc,
        required: previous.required || doc.required,
        originalDocument: doc.originalDocument,
        description: doc.description?.trim() || previous.description?.trim() || doc.description,
        fields: previous.fields ?? doc.fields,
      })
    } else {
      byId.set(doc.documentId, doc)
      order.push(doc.documentId)
    }
  }

  return order.map((documentId) => byId.get(documentId)!)
}

export function resolveExpectedApplicantDocuments(
  ctx: ApplicantDocumentChecklistContext,
): ApplicantDocumentItem[] {
  const seedIndex = ctx.seedIndex ?? 0
  const passportFields = ctx.passportFields ?? []
  if (ctx.countryId && ctx.visaOfferingId) {
    return createApplicantDocuments(
      ctx.countryId,
      ctx.visaOfferingId,
      passportFields,
      seedIndex,
      ctx.jurisdictionId,
    )
  }
  return checklistToApplicantDocuments(defaultChecklist(ctx.countryLabel), seedIndex)
}

function mergeWithExpected(
  existing: ApplicantDocumentItem[],
  expected: ApplicantDocumentItem[],
): ApplicantDocumentItem[] {
  if (expected.length === 0) return existing
  if (existing.length === 0) return dedupeApplicantDocuments(expected)

  const byId = new Map(existing.map(doc => [doc.documentId, doc]))
  const merged = dedupeApplicantDocuments(expected).map(doc => {
    const kept = byId.get(doc.documentId)
    if (!kept) return doc
    return {
      ...doc,
      description: doc.description?.trim() || kept.description?.trim() || doc.description,
      originalDocument: doc.originalDocument,
      required: doc.required,
      status: kept.status,
      fields: kept.fields ?? doc.fields,
      reviewComment: kept.reviewComment,
      handlingMode: kept.handlingMode ?? doc.handlingMode,
      travelTicket: kept.travelTicket ?? doc.travelTicket,
      insurance: kept.insurance ?? doc.insurance,
      originalDocumentReceived: doc.originalDocument ? kept.originalDocumentReceived : undefined,
    }
  })
  return merged
}

/** Keeps uploaded/verified state for existing docs; adds any new checklist items from country master. */
export function mergeApplicantDocumentsWithChecklist(
  existing: ApplicantDocumentItem[],
  countryId: string,
  offeringId: string,
  passportFields: ExtractedField[],
  seedIndex = 0,
  jurisdictionId?: string,
): ApplicantDocumentItem[] {
  const expected = createApplicantDocuments(
    countryId,
    offeringId,
    passportFields,
    seedIndex,
    jurisdictionId,
  )
  return mergeWithExpected(existing, expected)
}

export function mergeApplicantDocumentsWithExpected(
  existing: ApplicantDocumentItem[],
  expected: ApplicantDocumentItem[],
): ApplicantDocumentItem[] {
  return mergeWithExpected(existing, expected)
}

function stripOriginalCollectionIfNotNeeded(
  row: UploadQueueRow,
  countryId?: string,
  visaOfferingId?: string,
  jurisdictionId?: string,
): UploadQueueRow {
  if (!countryId || !visaOfferingId) return row
  const hasPhysical = resolveOriginalRequiredDocuments(countryId, visaOfferingId, jurisdictionId).length > 0
  if (hasPhysical) return row
  if (!row.originalDocumentCollection) return row
  const { originalDocumentCollection: _removed, ...rest } = row
  return rest
}

export function normalizeUploadQueueRow(
  row: UploadQueueRow,
  ctx: ApplicantDocumentChecklistContext,
): UploadQueueRow {
  const expected = resolveExpectedApplicantDocuments({
    ...ctx,
    seedIndex: ctx.seedIndex,
    passportFields: ctx.passportFields ?? row.fields ?? [],
  })
  const documents = mergeApplicantDocumentsWithExpected(row.documents ?? [], expected)
  const withProgress = withDocumentProgress({ ...row, documents })
  return stripOriginalCollectionIfNotNeeded(
    withProgress,
    ctx.countryId,
    ctx.visaOfferingId,
    ctx.jurisdictionId,
  )
}

export function normalizeUploadQueueRows(
  rows: UploadQueueRow[],
  baseCtx: Omit<ApplicantDocumentChecklistContext, 'seedIndex' | 'passportFields'>,
): UploadQueueRow[] {
  return rows.map((row, index) =>
    normalizeUploadQueueRow(row, {
      ...baseCtx,
      seedIndex: index,
      passportFields: row.fields ?? [],
    }),
  )
}

export function countDocumentProgress(documents: ApplicantDocumentItem[]): {
  documentsComplete: number
  documentsTotal: number
} {
  const mandatory = documents.filter(d => d.required)
  const documentsTotal = mandatory.length
  const documentsComplete = mandatory.filter(d => isApplicantDocumentSatisfied(d)).length
  return { documentsComplete, documentsTotal }
}

export function withDocumentProgress(row: UploadQueueRow): UploadQueueRow {
  const { documentsComplete, documentsTotal } = countDocumentProgress(row.documents)
  return { ...row, documentsComplete, documentsTotal }
}

export function seedUploadQueueRows(
  rows: UploadQueueRow[],
  countryId: string,
  offeringId: string,
  jurisdictionId?: string,
): UploadQueueRow[] {
  if (!countryId || !offeringId) {
    return rows.map(r => ({ ...r, documents: r.documents ?? [], documentsComplete: 0, documentsTotal: 0 }))
  }

  return normalizeUploadQueueRows(rows, { countryId, visaOfferingId: offeringId, countryLabel: '', jurisdictionId })
}

export function isDocumentComplete(
  statusOrDoc: ApplicantDocumentItem['status'] | ApplicantDocumentItem,
): boolean {
  if (typeof statusOrDoc === 'object') {
    return isApplicantDocumentSatisfied(statusOrDoc)
  }
  return statusOrDoc === 'uploaded' || statusOrDoc === 'verified'
}

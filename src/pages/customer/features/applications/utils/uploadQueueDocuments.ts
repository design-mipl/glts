import { getDocumentWorkspaceItems } from '@/shared/services/countryMasterService'
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
  seedIndex?: number
  passportFields?: ExtractedField[]
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
): ApplicantDocumentItem[] {
  const workspace = getDocumentWorkspaceItems(countryId, offeringId)
  const statusCycle: ApplicantDocumentItem['status'][] = [
    'verified',
    'uploaded',
    'missing',
    'missing',
    'needs_review',
    'missing',
    'missing',
  ]

  return workspace.map((doc, i) => {
    const isPassport = doc.id === 'passport'
    let status = statusCycle[(seedIndex + i) % statusCycle.length]
    if (isPassport && passportFields.length > 0) status = 'verified'
    if (!doc.required && status === 'missing') status = 'missing'

    const item: ApplicantDocumentItem = {
      documentId: doc.id,
      name: doc.name,
      required: doc.required,
      status,
      fields: isPassport ? passportFields : undefined,
    }
    return seedSimpleDocumentWorkflowFields(item)
  })
}

export function resolveExpectedApplicantDocuments(
  ctx: ApplicantDocumentChecklistContext,
): ApplicantDocumentItem[] {
  const seedIndex = ctx.seedIndex ?? 0
  const passportFields = ctx.passportFields ?? []
  if (ctx.countryId && ctx.visaOfferingId) {
    return createApplicantDocuments(ctx.countryId, ctx.visaOfferingId, passportFields, seedIndex)
  }
  return checklistToApplicantDocuments(defaultChecklist(ctx.countryLabel), seedIndex)
}

function mergeWithExpected(
  existing: ApplicantDocumentItem[],
  expected: ApplicantDocumentItem[],
): ApplicantDocumentItem[] {
  if (expected.length === 0) return existing
  if (existing.length === 0) return expected

  const byId = new Map(existing.map(doc => [doc.documentId, doc]))
  return expected.map(doc => {
    const kept = byId.get(doc.documentId)
    if (!kept) return doc
    return {
      ...doc,
      status: kept.status,
      fields: kept.fields ?? doc.fields,
      reviewComment: kept.reviewComment,
      handlingMode: kept.handlingMode ?? doc.handlingMode,
      travelTicket: kept.travelTicket ?? doc.travelTicket,
      insurance: kept.insurance ?? doc.insurance,
    }
  })
}

/** Keeps uploaded/verified state for existing docs; adds any new checklist items from country master. */
export function mergeApplicantDocumentsWithChecklist(
  existing: ApplicantDocumentItem[],
  countryId: string,
  offeringId: string,
  passportFields: ExtractedField[],
  seedIndex = 0,
): ApplicantDocumentItem[] {
  const expected = createApplicantDocuments(countryId, offeringId, passportFields, seedIndex)
  return mergeWithExpected(existing, expected)
}

export function mergeApplicantDocumentsWithExpected(
  existing: ApplicantDocumentItem[],
  expected: ApplicantDocumentItem[],
): ApplicantDocumentItem[] {
  return mergeWithExpected(existing, expected)
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
  return withDocumentProgress({ ...row, documents })
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
): UploadQueueRow[] {
  if (!countryId || !offeringId) {
    return rows.map(r => ({ ...r, documents: r.documents ?? [], documentsComplete: 0, documentsTotal: 0 }))
  }

  return normalizeUploadQueueRows(rows, { countryId, visaOfferingId: offeringId, countryLabel: '' })
}

export function isDocumentComplete(
  statusOrDoc: ApplicantDocumentItem['status'] | ApplicantDocumentItem,
): boolean {
  if (typeof statusOrDoc === 'object') {
    return isApplicantDocumentSatisfied(statusOrDoc)
  }
  return statusOrDoc === 'uploaded' || statusOrDoc === 'verified'
}

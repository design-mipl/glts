import { getDocumentWorkspaceItems } from '@/shared/services/countryMasterService'
import type { ApplicantDocumentItem, ExtractedField, UploadQueueRow } from '../data/applicationFlowData'

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
  ]

  return workspace.map((doc, i) => {
    const isPassport = doc.id === 'passport'
    let status = statusCycle[(seedIndex + i) % statusCycle.length]
    if (isPassport && passportFields.length > 0) status = 'verified'
    if (!doc.required && status === 'missing') status = 'missing'

    return {
      documentId: doc.id,
      name: doc.name,
      required: doc.required,
      status,
      fields: isPassport ? passportFields : undefined,
    }
  })
}

export function countDocumentProgress(documents: ApplicantDocumentItem[]): {
  documentsComplete: number
  documentsTotal: number
} {
  const mandatory = documents.filter(d => d.required)
  const documentsTotal = mandatory.length
  const documentsComplete = mandatory.filter(
    d => d.status === 'uploaded' || d.status === 'verified',
  ).length
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
  if (!countryId || !offeringId) return rows.map(r => ({ ...r, documents: r.documents ?? [], documentsComplete: 0, documentsTotal: 0 }))

  return rows.map((row, index) => {
    const documents =
      row.documents?.length > 0
        ? row.documents
        : createApplicantDocuments(countryId, offeringId, row.fields, index)
    return withDocumentProgress({ ...row, documents })
  })
}

export function isDocumentComplete(status: ApplicantDocumentItem['status']): boolean {
  return status === 'uploaded' || status === 'verified'
}

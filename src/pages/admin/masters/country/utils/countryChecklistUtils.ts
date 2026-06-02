import { documentMasterService } from '@/shared/services/documentMasterService'
import type { CountryDocumentChecklistItem } from '@/shared/types/countryMaster'

export type CountryDocumentChecklistScope = 'common' | 'application'

export interface CountryDocumentChecklistRow extends CountryDocumentChecklistItem {
  scope: CountryDocumentChecklistScope
}

export function checklistItemFromDocumentMaster(
  documentId: string,
  sortOrder: number,
  mandatory = false,
): CountryDocumentChecklistItem {
  const master = documentMasterService.getById(documentId)
  return {
    documentId,
    mandatory,
    sortOrder,
    description: master?.description ?? '',
  }
}

export function resolveDocumentMasterLabel(documentId: string, fallback?: string): string {
  return documentMasterService.getById(documentId)?.documentType ?? fallback ?? documentId
}

export function resolveDocumentMasterDescription(documentId: string): string | undefined {
  return documentMasterService.getById(documentId)?.description
}

export function resolveChecklistItemDescription(item: CountryDocumentChecklistItem): string {
  const custom = item.description?.trim()
  if (custom) return custom
  return resolveDocumentMasterDescription(item.documentId) ?? ''
}

export function mergeVisaTypeChecklistRows(
  commonDocuments: CountryDocumentChecklistItem[],
  applicationDocuments: CountryDocumentChecklistItem[],
): CountryDocumentChecklistRow[] {
  const common = [...commonDocuments]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({ ...item, scope: 'common' as const }))
  const application = [...applicationDocuments]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({ ...item, scope: 'application' as const }))
  return [...common, ...application]
}

import type { ApplicantDocumentItem, UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  documentStatusLabel,
  formatWorkflowSummary,
  isSimpleDocumentRequirement,
  resolveHandlingMode,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'
import { REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS } from '@/pages/customer/features/applications/utils/globalDocumentChecklist'

export type DocumentVaultCategory =
  | 'traveler'
  | 'global'
  | 'submission'
  | 'source'

export interface DocumentVaultItem {
  id: string
  label: string
  fileName: string
  category: DocumentVaultCategory
  categoryLabel: string
  statusLabel: string
  travelerName?: string
  available: boolean
  uploadedAt?: string
}

const CATEGORY_LABELS: Record<DocumentVaultCategory, string> = {
  traveler: 'Traveler document',
  global: 'Global document',
  submission: 'Submission artifact',
  source: 'Source upload',
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

function simpleDocHasFile(doc: ApplicantDocumentItem): boolean {
  if (doc.documentId === 'travel-ticket') return Boolean(doc.travelTicket?.fileName?.trim())
  if (doc.documentId === 'insurance') return Boolean(doc.insurance?.fileName?.trim())
  return false
}

function isDocumentAvailable(doc: ApplicantDocumentItem): boolean {
  if (isSimpleDocumentRequirement(doc.documentId)) {
    return simpleDocHasFile(doc)
  }
  return doc.status !== 'missing'
}

function vaultFileNameForDocument(doc: ApplicantDocumentItem, row: UploadQueueRow): string {
  if (doc.documentId === 'passport' && row.fileName.trim()) {
    return row.fileName.trim()
  }

  if (isSimpleDocumentRequirement(doc.documentId)) {
    const uploadedName =
      doc.documentId === 'travel-ticket'
        ? doc.travelTicket?.fileName
        : doc.insurance?.fileName
    if (uploadedName?.trim()) return uploadedName.trim()
    if (resolveHandlingMode(doc) === 'arrange_by_glts') {
      return 'Pending GLTS upload'
    }
  }

  const passport = slugify(row.passportNo || 'traveler')
  const docSlug = slugify(doc.name)
  const ext =
    doc.documentId === 'photo'
      ? 'jpg'
      : doc.documentId === 'bank' ||
          doc.documentId === 'insurance' ||
          doc.documentId === 'travel-ticket'
        ? 'pdf'
        : 'pdf'

  return `${passport}_${docSlug}.${ext}`
}

function pushSubmissionArtifact(
  items: DocumentVaultItem[],
  seen: Set<string>,
  travelerName: string,
  label: string,
  fileName: string,
) {
  const trimmed = fileName.trim()
  if (!trimmed) return
  const id = `submission-${slugify(label)}`
  if (seen.has(id)) return
  seen.add(id)
  items.push({
    id,
    label,
    fileName: trimmed,
    category: 'submission',
    categoryLabel: CATEGORY_LABELS.submission,
    statusLabel: 'Uploaded',
    travelerName,
    available: true,
    uploadedAt: undefined,
  })
}

export function buildApplicationDocumentVaultItems(input: {
  applicationId: string
  selectedRow: UploadQueueRow
  detail: ApplicationDetailViewModel
  submission?: FormAssistSubmissionDraft
}): DocumentVaultItem[] {
  const { selectedRow, detail, submission } = input
  const items: DocumentVaultItem[] = []
  const seen = new Set<string>()

  if (selectedRow.fileName.trim()) {
    const id = `source-${selectedRow.id}`
    seen.add(id)
    items.push({
      id,
      label: 'Passport scan (source upload)',
      fileName: selectedRow.fileName.trim(),
      category: 'source',
      categoryLabel: CATEGORY_LABELS.source,
      statusLabel: selectedRow.status === 'processing' ? 'Processing' : 'Available',
      travelerName: selectedRow.travelerName,
      available: selectedRow.status !== 'processing',
    })
  }

  for (const doc of selectedRow.documents) {
    const id = `traveler-${selectedRow.id}-${doc.documentId}`
    if (seen.has(id)) continue
    seen.add(id)
    const summary = formatWorkflowSummary(doc)
    items.push({
      id,
      label: doc.name,
      fileName: vaultFileNameForDocument(doc, selectedRow),
      category: 'traveler',
      categoryLabel: CATEGORY_LABELS.traveler,
      statusLabel: summary
        ? `${documentStatusLabel(doc)} · ${summary}`
        : documentStatusLabel(doc),
      travelerName: selectedRow.travelerName,
      available: isDocumentAvailable(doc),
    })
  }

  for (const globalDoc of REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS) {
    const upload = detail.globalDocumentUploads[globalDoc.documentId]
    const id = `global-${globalDoc.documentId}`
    if (seen.has(id)) continue
    seen.add(id)
    items.push({
      id,
      label: globalDoc.name,
      fileName: upload?.fileName ?? `${slugify(globalDoc.name)}.pdf`,
      category: 'global',
      categoryLabel: CATEGORY_LABELS.global,
      statusLabel: upload ? 'Uploaded' : 'Missing',
      available: Boolean(upload?.fileName),
      uploadedAt: upload?.uploadedAt,
    })
  }

  if (submission) {
    pushSubmissionArtifact(
      items,
      seen,
      selectedRow.travelerName,
      'Confirmation PDF',
      submission.confirmationPdfFileName,
    )
    pushSubmissionArtifact(
      items,
      seen,
      selectedRow.travelerName,
      'Invoice PDF',
      submission.invoicePdfFileName,
    )
  }

  return items
}

function mockDocumentBlob(item: DocumentVaultItem): Blob {
  const body = [
    'GLTS Document Vault — mock export',
    `Application document: ${item.label}`,
    `Category: ${item.categoryLabel}`,
    `File: ${item.fileName}`,
    item.travelerName ? `Traveler: ${item.travelerName}` : '',
    `Exported: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n')

  return new Blob([body], { type: 'text/plain;charset=utf-8' })
}

export function downloadVaultDocument(item: DocumentVaultItem): void {
  if (!item.available) return

  const url = URL.createObjectURL(mockDocumentBlob(item))
  const link = document.createElement('a')
  link.href = url
  link.download = item.fileName
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadAllVaultDocuments(
  items: DocumentVaultItem[],
  bundleLabel: string,
): Promise<number> {
  const available = items.filter(item => item.available)
  if (available.length === 0) return 0

  for (const item of available) {
    downloadVaultDocument(item)
    await new Promise(resolve => setTimeout(resolve, 250))
  }

  const manifest = [
    `GLTS Document Vault bundle — ${bundleLabel}`,
    `Documents: ${available.length}`,
    `Exported: ${new Date().toISOString()}`,
    '',
    ...available.map(item => `- ${item.fileName} (${item.label})`),
  ].join('\n')

  const manifestBlob = new Blob([manifest], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(manifestBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${slugify(bundleLabel)}-document-manifest.txt`
  link.click()
  URL.revokeObjectURL(url)

  return available.length
}

import { createMockPdfBlob } from '@/shared/data/mockDocumentSampleTemplates'
import type { AgreementOnboardingDocument } from '@/shared/types/commercialAgreement'

export function isAgreementDocumentFileAvailable(document: AgreementOnboardingDocument): boolean {
  return (
    (document.status === 'uploaded' || document.status === 'verified') &&
    Boolean(document.fileName?.trim())
  )
}

function agreementDocumentBlob(document: AgreementOnboardingDocument): Blob {
  const fileName = document.fileName?.trim().toLowerCase() ?? ''
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')) {
    return new Blob([`Mock image placeholder for ${document.fileName}`], {
      type: fileName.endsWith('.png') ? 'image/png' : 'image/jpeg',
    })
  }
  return createMockPdfBlob()
}

export function previewAgreementDocument(document: AgreementOnboardingDocument): void {
  if (!isAgreementDocumentFileAvailable(document)) return
  const url = URL.createObjectURL(agreementDocumentBlob(document))
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function downloadAgreementDocument(document: AgreementOnboardingDocument): void {
  if (!isAgreementDocumentFileAvailable(document) || !document.fileName?.trim()) return
  const url = URL.createObjectURL(agreementDocumentBlob(document))
  const link = window.document.createElement('a')
  link.href = url
  link.download = document.fileName.trim()
  link.click()
  URL.revokeObjectURL(url)
}

import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { AgreementOnboardingDocument, CommercialAgreement } from '@/shared/types/commercialAgreement'
import { splitAgreementDocuments } from '@/shared/utils/agreementDocumentUtils'

export interface PortalAgreementDocument {
  id: string
  label: string
  fileName?: string
  status: 'available' | 'pending'
  uploadedAt?: string
  sourceDocument: AgreementOnboardingDocument
}

function mapDocument(doc: AgreementOnboardingDocument): PortalAgreementDocument {
  const available = doc.status === 'uploaded' || doc.status === 'verified'
  return {
    id: doc.documentKey,
    label: doc.name,
    fileName: doc.fileName,
    status: available ? 'available' : 'pending',
    uploadedAt: doc.uploadedAt,
    sourceDocument: doc,
  }
}

export function mapAgreementDocumentsForPortal(agreement: CommercialAgreement | undefined): {
  onboardingDocuments: PortalAgreementDocument[]
  agreementDocument?: PortalAgreementDocument
} {
  if (!agreement) {
    return { onboardingDocuments: [] }
  }

  const formData = commercialAgreementService.agreementToFormData(agreement)
  const { onboardingDocuments, agreementDocument } = splitAgreementDocuments(formData.documents)

  return {
    onboardingDocuments: onboardingDocuments.map(mapDocument),
    agreementDocument: agreementDocument ? mapDocument(agreementDocument) : undefined,
  }
}

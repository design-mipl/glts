import { clientDocumentMasterService } from '@/shared/services/clientDocumentMasterService'
import type {
  AgreementOnboardingDocument,
  AgreementType,
  AgreementWorkflowType,
} from '@/shared/types/commercialAgreement'
import type { ClientDocumentMaster } from '@/shared/types/clientDocumentMaster'
import type { MasterApplicability } from '@/shared/types/masterCommon'

export const AGREEMENT_DOCUMENT_MASTER_ID = 'agreement-document'

const LEGACY_DOCUMENT_KEY_MAP: Record<string, string> = {
  billing_entity: 'billing-entity',
  company_registration: 'company-registration',
  gst_certificate: 'gst-certificate',
  finance_contact: 'finance-contact',
  invoice_submission: 'invoice-submission',
  agreement_document: AGREEMENT_DOCUMENT_MASTER_ID,
}

/** Applicability segments for each agreement workflow (shared with service/pricing filters). */
export function applicabilityForWorkflow(workflow: AgreementWorkflowType): MasterApplicability[] {
  const map: Record<AgreementWorkflowType, MasterApplicability[]> = {
    marine: ['marine'],
    corporate: ['corporate', 'b2b'],
    b2b_agent: ['b2b', 'corporate'],
    retail: ['retail'],
    mixed: ['marine', 'corporate', 'b2b', 'retail'],
  }
  return map[workflow] ?? ['marine', 'corporate', 'b2b', 'retail']
}

export function normalizeDocumentKey(documentKey: string): string {
  return LEGACY_DOCUMENT_KEY_MAP[documentKey] ?? documentKey
}

export function isAgreementDocumentKey(documentKey: string): boolean {
  return normalizeDocumentKey(documentKey) === AGREEMENT_DOCUMENT_MASTER_ID
}

function isApplicableToWorkflow(row: ClientDocumentMaster, workflow: AgreementWorkflowType): boolean {
  if (row.status !== 'active') return false
  const allowed = applicabilityForWorkflow(workflow)
  return row.applicableFor.some((segment) => allowed.includes(segment))
}

export function listOnboardingDocumentsFromMaster(workflow: AgreementWorkflowType): ClientDocumentMaster[] {
  return clientDocumentMasterService
    .list({ status: 'active' })
    .filter((row) => row.id !== AGREEMENT_DOCUMENT_MASTER_ID && isApplicableToWorkflow(row, workflow))
    .sort((a, b) => a.documentType.localeCompare(b.documentType))
}

export function listAgreementDocumentFromMaster(): ClientDocumentMaster | undefined {
  return clientDocumentMasterService.getById(AGREEMENT_DOCUMENT_MASTER_ID)
}

function isDocumentRequiredFromMaster(row: ClientDocumentMaster): boolean {
  return row.isMandatory ?? false
}

function masterRowToDocument(
  row: ClientDocumentMaster,
  required: boolean,
  existing?: AgreementOnboardingDocument,
): AgreementOnboardingDocument {
  return {
    documentKey: normalizeDocumentKey(row.id),
    name: row.documentType,
    required,
    status: existing?.status ?? 'pending',
    fileName: existing?.fileName,
    uploadedAt: existing?.uploadedAt,
  }
}

function findExistingDocument(
  existing: AgreementOnboardingDocument[],
  masterId: string,
): AgreementOnboardingDocument | undefined {
  const normalized = normalizeDocumentKey(masterId)
  return existing.find((doc) => normalizeDocumentKey(doc.documentKey) === normalized)
}

export function mergeAgreementDocumentsWithExisting(
  defaults: AgreementOnboardingDocument[],
  existing: AgreementOnboardingDocument[],
): AgreementOnboardingDocument[] {
  return defaults.map((doc) => {
    const prev = findExistingDocument(existing, doc.documentKey)
    return prev
      ? {
          ...doc,
          status: prev.status,
          fileName: prev.fileName,
          uploadedAt: prev.uploadedAt,
        }
      : doc
  })
}

export function buildAgreementDocumentsFromMaster(
  workflow: AgreementWorkflowType,
  agreementType: AgreementType,
  existing: AgreementOnboardingDocument[] = [],
): AgreementOnboardingDocument[] {
  const onboardingRows = listOnboardingDocumentsFromMaster(workflow)
  const onboardingDocs = onboardingRows.map((row) => {
    const prev = findExistingDocument(existing, row.id)
    return masterRowToDocument(row, isDocumentRequiredFromMaster(row), prev)
  })

  if (agreementType !== 'agreemented') {
    return onboardingDocs
  }

  const agreementRow = listAgreementDocumentFromMaster()
  if (!agreementRow) {
    return onboardingDocs
  }

  const prev = findExistingDocument(existing, agreementRow.id)
  const agreementDoc = masterRowToDocument(agreementRow, isDocumentRequiredFromMaster(agreementRow), prev)
  return [...onboardingDocs, agreementDoc]
}

export function splitAgreementDocuments(documents: AgreementOnboardingDocument[]): {
  onboardingDocuments: AgreementOnboardingDocument[]
  agreementDocument: AgreementOnboardingDocument | undefined
} {
  const onboardingDocuments: AgreementOnboardingDocument[] = []
  let agreementDocument: AgreementOnboardingDocument | undefined

  for (const doc of documents) {
    if (isAgreementDocumentKey(doc.documentKey)) {
      agreementDocument = { ...doc, documentKey: normalizeDocumentKey(doc.documentKey) }
    } else {
      onboardingDocuments.push({ ...doc, documentKey: normalizeDocumentKey(doc.documentKey) })
    }
  }

  return { onboardingDocuments, agreementDocument }
}

export function findAgreementDocument(
  documents: AgreementOnboardingDocument[],
): AgreementOnboardingDocument | undefined {
  return documents.find((doc) => isAgreementDocumentKey(doc.documentKey))
}

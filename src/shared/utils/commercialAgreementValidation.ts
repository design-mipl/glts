import type {
  AgreementOnboardingDocument,
  AgreementType,
  CommercialAgreement,
  CommercialAgreementFormData,
} from '@/shared/types/commercialAgreement'

export const AGREEMENT_DOCUMENT_DEFINITIONS: {
  documentKey: string
  name: string
  alwaysRequired: boolean
  agreementedOnly?: boolean
}[] = [
  { documentKey: 'billing_entity', name: 'Billing Entity Details', alwaysRequired: true },
  { documentKey: 'company_registration', name: 'Company Registration Certificate', alwaysRequired: true },
  { documentKey: 'gst_certificate', name: 'GST Certificate (if applicable)', alwaysRequired: false },
  { documentKey: 'finance_contact', name: 'Accounts / Finance Team Contact Details', alwaysRequired: true },
  { documentKey: 'invoice_submission', name: 'Additional Documents for Invoice / Statement Submission', alwaysRequired: false },
  { documentKey: 'agreement_document', name: 'Agreement Document', alwaysRequired: false, agreementedOnly: true },
]

export function buildDefaultAgreementDocuments(agreementType: AgreementType): AgreementOnboardingDocument[] {
  return AGREEMENT_DOCUMENT_DEFINITIONS.filter(
    (d) => !d.agreementedOnly || agreementType === 'agreemented',
  ).map((d) => ({
    documentKey: d.documentKey,
    name: d.name,
    required: Boolean(d.alwaysRequired || (d.agreementedOnly && agreementType === 'agreemented')),
    status: 'pending' as const,
  }))
}

export function createEmptyAgreementFormData(): CommercialAgreementFormData {
  return {
    companyMode: 'existing',
    existingCompanyId: '',
    company: {
      companyName: '',
      companyType: 'private_limited',
      industryType: '',
      contactPersonName: '',
      contactNumber: '',
      emailAddress: '',
      companyAddress: '',
      billingEntityName: '',
      billingAddress: '',
      gstNumber: '',
      panNumber: '',
    },
    agreementType: 'agreemented',
    workflowType: 'marine',
    billingType: 'credit',
    startDate: '',
    endDate: '',
    pricingMatrix: [],
    miscellaneousCosts: [],
    billingConfig: {
      creditBillingEnabled: true,
      billingCycle: 'monthly',
      creditPeriodDays: 30,
      creditLimit: 0,
      gstApplicable: true,
      gstPercentage: 18,
      tdsApplicable: false,
      tdsPercentage: 0,
    },
    financeContacts: {
      accountsSpocName: '',
      accountsTeamEmail: '',
      accountsContactNumber: '',
      invoiceSubmissionEmail: '',
      paymentFollowUpContact: '',
    },
    documents: buildDefaultAgreementDocuments('agreemented'),
  }
}

export function validateAgreementStep(step: number, data: CommercialAgreementFormData): string[] {
  const issues: string[] = []
  if (step === 0) {
    if (data.companyMode === 'existing' && !data.existingCompanyId) {
      issues.push('Select an existing company')
    }
    if (data.companyMode === 'new') {
      if (!data.company.companyName.trim()) issues.push('Company name is required')
      if (!data.company.contactPersonName.trim()) issues.push('Contact person is required')
      if (!data.company.emailAddress.trim()) issues.push('Email address is required')
    }
  }
  if (step === 1 && data.pricingMatrix.length === 0) {
    issues.push('Add at least one pricing row')
  }
  if (step === 3) {
    if (!data.startDate) issues.push('Start date is required')
    if (!data.endDate) issues.push('End date is required')
  }
  if (step === 4) {
    if (!data.financeContacts.accountsSpocName.trim()) issues.push('Accounts SPOC name is required')
    if (!data.financeContacts.accountsTeamEmail.trim()) issues.push('Accounts team email is required')
  }
  return issues
}

export function validateForApproval(agreement: CommercialAgreement | CommercialAgreementFormData): {
  ok: boolean
  issues: string[]
} {
  const issues: string[] = []
  const docs = agreement.documents
  const agreementType = agreement.agreementType

  for (const doc of docs) {
    if (!doc.required) continue
    if (doc.status === 'pending' || doc.status === 'rejected') {
      issues.push(`Missing or rejected document: ${doc.name}`)
    }
  }

  if (agreementType === 'agreemented') {
    const agreementDoc = docs.find((d) => d.documentKey === 'agreement_document')
    if (!agreementDoc || agreementDoc.status === 'pending' || agreementDoc.status === 'rejected') {
      issues.push('Agreement document is required for agreemented type')
    }
  }

  if ('pricingMatrix' in agreement && agreement.pricingMatrix.length === 0) {
    issues.push('Pricing matrix must have at least one row')
  }

  return { ok: issues.length === 0, issues }
}

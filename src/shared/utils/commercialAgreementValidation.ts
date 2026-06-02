import type {
  AgreementOnboardingDocument,
  AgreementType,
  CommercialAgreement,
  CommercialAgreementFormData,
} from '@/shared/types/commercialAgreement'
import {
  getSelectedFinanceContactPersons,
} from '@/shared/utils/agreementFinanceContacts'

export const AGREEMENT_FIELD_MESSAGES = {
  referenceQuotation: 'Select a reference quotation',
  existingCustomer: 'Select an existing customer',
  companyName: 'Company name is required',
  companyType: 'Company type is required',
  industryType: 'Industry type is required',
  contactPerson: 'Contact person is required',
  contactNumber: 'Contact number is required',
  emailAddress: 'Email address is required',
  companyAddress: 'Company address is required',
  entityName: 'Entity name is required',
  entityBillingAddress: 'Billing address is required',
  entityContactPerson: 'Contact person is required',
  entityEmail: 'Email address is required',
  entityPhone: 'Phone number is required',
  pricingRequired: 'Add at least one pricing row',
  pricingCountry: 'Country is required',
  pricingVisaType: 'Visa type is required',
  pricingServicePreset: 'Service preset is required',
  billingType: 'Billing type is required',
  advanceType: 'Advance type is required',
  creditPeriod: 'Credit period is required',
  creditLimit: 'Credit limit is required',
  accountsSpocName: 'At least one finance contact is required',
  accountsTeamEmail: 'Accounts team email is required',
  accountsContactNumber: 'Accounts contact number is required',
  invoiceSubmissionEmail: 'Invoice submission email is required',
  paymentFollowUpContact: 'Payment follow-up contact is required',
  financeContactPerson: 'Contact person name is required',
  financeContactEmail: 'Contact email is required',
  financeContactPhone: 'Contact phone is required',
  financeContactsRequired: 'Add company, parent company, or entity contacts before continuing',
} as const

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

export function createDefaultBillingConfig(): CommercialAgreementFormData['billingConfig'] {
  return {
    creditBillingEnabled: true,
    billingCycle: 'monthly',
    creditPeriodDays: 30,
    creditLimit: 0,
    gracePeriodDays: 7,
    advanceType: 'percentage',
    advancePercentage: 100,
    fixedAdvanceAmount: 0,
    processingBlockRule: 'before_submission',
    serviceWiseBillingRules: [],
    gstApplicable: true,
    gstPercentage: 18,
    tdsApplicable: false,
    tdsPercentage: 0,
  }
}

export function createEmptyAgreementFormData(): CommercialAgreementFormData {
  return {
    customerSourceMode: 'existing',
    referenceQuotationId: '',
    existingCompanyId: '',
    parentCompanyId: '',
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
    entities: [],
    pricingMatrix: [],
    miscellaneousCosts: [],
    billingConfig: createDefaultBillingConfig(),
    financeContacts: {
      accountsSpocName: '',
      accountsTeamEmail: '',
      accountsContactNumber: '',
      invoiceSubmissionEmail: '',
      paymentFollowUpContact: '',
    },
    financeContactPersons: [],
    selectedFinanceContactIds: [],
    documents: buildDefaultAgreementDocuments('agreemented'),
  }
}

export function deriveAdvanceRuleSummary(
  billingType: CommercialAgreementFormData['billingType'],
  billingConfig: CommercialAgreementFormData['billingConfig'],
): string {
  if (billingType === 'credit') return '—'
  if (billingType === 'advance') {
    if (billingConfig.advanceType === 'full') return 'Full advance'
    if (billingConfig.advanceType === 'fixed') {
      return `Fixed ₹${billingConfig.fixedAdvanceAmount.toLocaleString('en-IN')}`
    }
    return `${billingConfig.advancePercentage}% advance`
  }
  return `${billingConfig.advancePercentage}% advance + credit`
}

function validateCompanyFields(data: CommercialAgreementFormData, errors: Record<string, string>) {
  if (data.customerSourceMode === 'new' || data.customerSourceMode === 'quotation') {
    if (!data.company.companyName.trim()) errors.companyName = AGREEMENT_FIELD_MESSAGES.companyName
    if (!data.company.companyType) errors.companyType = AGREEMENT_FIELD_MESSAGES.companyType
    if (!data.company.industryType.trim()) errors.industryType = AGREEMENT_FIELD_MESSAGES.industryType
    if (!data.company.contactPersonName.trim()) errors.contactPerson = AGREEMENT_FIELD_MESSAGES.contactPerson
    if (!data.company.contactNumber.trim()) errors.contactNumber = AGREEMENT_FIELD_MESSAGES.contactNumber
    if (!data.company.emailAddress.trim()) errors.emailAddress = AGREEMENT_FIELD_MESSAGES.emailAddress
    if (!data.company.companyAddress.trim()) errors.companyAddress = AGREEMENT_FIELD_MESSAGES.companyAddress
  }
}

export function validateCustomerSource(data: CommercialAgreementFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (data.customerSourceMode === 'quotation' && !data.referenceQuotationId) {
    errors.referenceQuotationId = AGREEMENT_FIELD_MESSAGES.referenceQuotation
  }
  if (data.customerSourceMode === 'existing' && !data.existingCompanyId) {
    errors.existingCompanyId = AGREEMENT_FIELD_MESSAGES.existingCustomer
  }
  return errors
}

export function validateCompanyInfo(data: CommercialAgreementFormData): Record<string, string> {
  const errors = validateCustomerSource(data)
  validateCompanyFields(data, errors)
  return errors
}

export function validateEntities(data: CommercialAgreementFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  data.entities.forEach((entity, index) => {
    if (!entity.entityName.trim()) errors[`entities.${index}.entityName`] = AGREEMENT_FIELD_MESSAGES.entityName
    if (!entity.billingAddress.trim()) errors[`entities.${index}.billingAddress`] = AGREEMENT_FIELD_MESSAGES.entityBillingAddress
    if (!entity.contactPerson.trim()) errors[`entities.${index}.contactPerson`] = AGREEMENT_FIELD_MESSAGES.entityContactPerson
    if (!entity.email.trim()) errors[`entities.${index}.email`] = AGREEMENT_FIELD_MESSAGES.entityEmail
    if (!entity.phone.trim()) errors[`entities.${index}.phone`] = AGREEMENT_FIELD_MESSAGES.entityPhone
  })
  return errors
}

export function validatePricing(data: CommercialAgreementFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (data.pricingMatrix.length === 0) {
    errors.pricingMatrix = AGREEMENT_FIELD_MESSAGES.pricingRequired
    return errors
  }
  data.pricingMatrix.forEach((row, index) => {
    if (!row.country.trim()) errors[`pricing.${index}.country`] = AGREEMENT_FIELD_MESSAGES.pricingCountry
    if (!row.visaType.trim()) errors[`pricing.${index}.visaType`] = AGREEMENT_FIELD_MESSAGES.pricingVisaType
    if (!row.servicePresetId.trim()) errors[`pricing.${index}.servicePresetId`] = AGREEMENT_FIELD_MESSAGES.pricingServicePreset
  })
  return errors
}

export function validateBilling(data: CommercialAgreementFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.billingType) errors.billingType = AGREEMENT_FIELD_MESSAGES.billingType

  if (data.billingType === 'advance') {
    if (!data.billingConfig.advanceType) errors.advanceType = AGREEMENT_FIELD_MESSAGES.advanceType
  }
  if (data.billingType === 'credit') {
    if (!data.billingConfig.creditPeriodDays) errors.creditPeriodDays = AGREEMENT_FIELD_MESSAGES.creditPeriod
    if (!data.billingConfig.creditLimit) errors.creditLimit = AGREEMENT_FIELD_MESSAGES.creditLimit
  }
  if (data.billingType === 'mixed') {
    if (!data.billingConfig.advancePercentage) errors.advancePercentage = 'Advance percentage is required'
    if (!data.billingConfig.creditPeriodDays) errors.creditPeriodDays = AGREEMENT_FIELD_MESSAGES.creditPeriod
  }
  return errors
}

export function validateTax(data: CommercialAgreementFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (data.billingConfig.gstApplicable && !data.billingConfig.gstPercentage) {
    errors.gstPercentage = 'GST percentage is required when GST is applicable'
  }
  if (data.billingConfig.tdsApplicable && !data.billingConfig.tdsPercentage) {
    errors.tdsPercentage = 'TDS percentage is required when TDS is applicable'
  }
  return errors
}

export function validateDocuments(data: CommercialAgreementFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  const contacts = getSelectedFinanceContactPersons(data)

  if (contacts.length === 0) {
    errors.financeContacts = AGREEMENT_FIELD_MESSAGES.financeContactsRequired
    return errors
  }

  contacts.forEach((contact, index) => {
    if (!contact.contactPerson.trim()) {
      errors[`financeContactPersons.${index}.contactPerson`] = AGREEMENT_FIELD_MESSAGES.financeContactPerson
    }
    if (!contact.email.trim()) {
      errors[`financeContactPersons.${index}.email`] = AGREEMENT_FIELD_MESSAGES.financeContactEmail
    }
    if (!contact.phone.trim()) {
      errors[`financeContactPersons.${index}.phone`] = AGREEMENT_FIELD_MESSAGES.financeContactPhone
    }
  })

  return errors
}

export type AgreementSectionId =
  | 'customerSource'
  | 'companyInfo'
  | 'entities'
  | 'pricing'
  | 'billing'
  | 'tax'
  | 'documents'
  | 'approval'

export function validateAgreementSection(
  sectionId: AgreementSectionId,
  data: CommercialAgreementFormData,
): Record<string, string> {
  switch (sectionId) {
    case 'customerSource':
      return validateCustomerSource(data)
    case 'companyInfo':
      return validateCompanyInfo(data)
    case 'entities':
      return validateEntities(data)
    case 'pricing':
      return validatePricing(data)
    case 'billing':
      return validateBilling(data)
    case 'tax':
      return validateTax(data)
    case 'documents':
      return validateDocuments(data)
    case 'approval':
      return {}
    default:
      return {}
  }
}

export function validateAgreementForm(data: CommercialAgreementFormData): Record<string, string> {
  return {
    ...validateCompanyInfo(data),
    ...validateEntities(data),
    ...validatePricing(data),
    ...validateBilling(data),
    ...validateTax(data),
    ...validateDocuments(data),
  }
}

/** @deprecated Stepper removed — use validateAgreementSection */
export function validateAgreementStep(step: number, data: CommercialAgreementFormData): string[] {
  const sectionIds: AgreementSectionId[] = [
    'companyInfo',
    'pricing',
    'entities',
    'billing',
    'documents',
    'approval',
  ]
  const section = sectionIds[step]
  if (!section) return []
  return Object.values(validateAgreementSection(section, data))
}

export function isAgreementFormData(
  agreement: CommercialAgreement | CommercialAgreementFormData,
): agreement is CommercialAgreementFormData {
  return 'company' in agreement
}

export function validateForApproval(
  agreement: CommercialAgreement | CommercialAgreementFormData,
  toFormData?: (record: CommercialAgreement) => CommercialAgreementFormData,
): {
  ok: boolean
  issues: string[]
} {
  const formData: CommercialAgreementFormData = isAgreementFormData(agreement)
    ? agreement
    : toFormData
      ? toFormData(agreement)
      : {
          ...createEmptyAgreementFormData(),
          customerSourceMode: agreement.customerSourceMode ?? 'existing',
          referenceQuotationId: agreement.referenceQuotationId ?? '',
          existingCompanyId: agreement.companyId,
          parentCompanyId: agreement.parentCompanyId ?? '',
          agreementType: agreement.agreementType,
          workflowType: agreement.workflowType,
          billingType: agreement.billingType,
          startDate: agreement.startDate,
          endDate: agreement.endDate,
          entities: agreement.entities ?? [],
          pricingMatrix: agreement.pricingMatrix ?? [],
          miscellaneousCosts: agreement.miscellaneousCosts ?? [],
          billingConfig: { ...createDefaultBillingConfig(), ...agreement.billingConfig },
          financeContacts: agreement.financeContacts,
          financeContactPersons: agreement.financeContactPersons ?? [],
          selectedFinanceContactIds: agreement.selectedFinanceContactIds ?? [],
          documents: agreement.documents,
        }

  const issues: string[] = []

  const fieldErrors = validateAgreementForm(formData)
  issues.push(...Object.values(fieldErrors))

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

  if (agreement.pricingMatrix.length === 0) {
    issues.push('Pricing matrix must have at least one row')
  }

  return { ok: issues.length === 0, issues: [...new Set(issues)] }
}

export function normalizeLegacyAgreement(record: CommercialAgreement): CommercialAgreement {
  const financeContactPersons =
    record.financeContactPersons && record.financeContactPersons.length > 0
      ? record.financeContactPersons
      : undefined
  const selectedFinanceContactIds =
    record.selectedFinanceContactIds && record.selectedFinanceContactIds.length > 0
      ? record.selectedFinanceContactIds
      : financeContactPersons?.map((contact) => contact.id)

  return {
    ...record,
    customerSourceMode: record.customerSourceMode ?? 'existing',
    referenceQuotationId: record.referenceQuotationId,
    parentCompanyId: record.parentCompanyId,
    entities: record.entities ?? [],
    financeContactPersons,
    selectedFinanceContactIds,
    pricingMatrix: (record.pricingMatrix ?? []).map((row) => ({
      ...row,
      servicePresetId: row.servicePresetId ?? '',
      servicePresetName: row.servicePresetName ?? '',
    })),
    billingConfig: {
      ...createDefaultBillingConfig(),
      ...record.billingConfig,
      gracePeriodDays: record.billingConfig?.gracePeriodDays ?? 7,
      advanceType: record.billingConfig?.advanceType ?? 'percentage',
      advancePercentage: record.billingConfig?.advancePercentage ?? 100,
      fixedAdvanceAmount: record.billingConfig?.fixedAdvanceAmount ?? 0,
      processingBlockRule: record.billingConfig?.processingBlockRule ?? 'before_submission',
      serviceWiseBillingRules: record.billingConfig?.serviceWiseBillingRules ?? [],
    },
  }
}

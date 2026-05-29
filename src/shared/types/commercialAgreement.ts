export type AgreementType = 'agreemented' | 'non_agreemented'

export type AgreementWorkflowType = 'marine' | 'corporate' | 'retail' | 'mixed'

export type AgreementBillingType = 'credit' | 'advance' | 'mixed'

export type AgreementStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'expired'

export type OnboardingDocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected'

export interface AgreementActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface AgreementPricingRow {
  id: string
  country: string
  visaType: string
  workflowType: string
  serviceFee: number
  gstApplicable: boolean
  remarks: string
}

export interface AgreementMiscCostRow {
  id: string
  serviceName: string
  pricingType: 'fixed' | 'per_unit' | 'percentage'
  amount: number
  gstApplicable: boolean
  remarks: string
}

export interface AgreementBillingConfig {
  creditBillingEnabled: boolean
  billingCycle: 'monthly' | 'quarterly' | 'custom'
  creditPeriodDays: number
  creditLimit: number
  gstApplicable: boolean
  gstPercentage: number
  tdsApplicable: boolean
  tdsPercentage: number
}

export interface AgreementFinanceContacts {
  accountsSpocName: string
  accountsTeamEmail: string
  accountsContactNumber: string
  invoiceSubmissionEmail: string
  paymentFollowUpContact: string
}

export interface AgreementOnboardingDocument {
  documentKey: string
  name: string
  required: boolean
  status: OnboardingDocumentStatus
  fileName?: string
  uploadedAt?: string
}

export interface CommercialAgreement {
  id: string
  agreementId: string
  companyId: string
  companyName: string
  agreementType: AgreementType
  workflowType: AgreementWorkflowType
  billingType: AgreementBillingType
  status: AgreementStatus
  startDate: string
  endDate: string
  pricingMatrix: AgreementPricingRow[]
  miscellaneousCosts: AgreementMiscCostRow[]
  billingConfig: AgreementBillingConfig
  financeContacts: AgreementFinanceContacts
  documents: AgreementOnboardingDocument[]
  createdAt: string
  updatedAt: string
  submittedAt?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  activities: AgreementActivity[]
}

export interface CommercialAgreementFormData {
  companyMode: 'existing' | 'new'
  existingCompanyId: string
  company: import('./companyMaster').CompanyMasterFormData
  agreementType: AgreementType
  workflowType: AgreementWorkflowType
  billingType: AgreementBillingType
  startDate: string
  endDate: string
  pricingMatrix: AgreementPricingRow[]
  miscellaneousCosts: AgreementMiscCostRow[]
  billingConfig: AgreementBillingConfig
  financeContacts: AgreementFinanceContacts
  documents: AgreementOnboardingDocument[]
}

export interface CommercialAgreementListFilters {
  status?: AgreementStatus | 'all'
  agreementType?: AgreementType | 'all'
  workflowType?: AgreementWorkflowType | 'all'
  billingType?: AgreementBillingType | 'all'
  companyId?: string
  query?: string
}

export interface AgreementApprovalValidation {
  ok: boolean
  issues: string[]
}

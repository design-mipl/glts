import type { CommercialVisaPricingRule, QuotationServiceLine } from './quotation'

export type AgreementType = 'agreemented' | 'non_agreemented'

export type AgreementWorkflowType = 'marine' | 'corporate' | 'b2b_agent' | 'retail'

export type AgreementBillingType = 'credit' | 'advance'

export type AgreementStatus =
  | 'draft'
  | 'ready_for_activation'
  | 'active'
  | 'expired'
  | 'on_hold'
  | 'terminated'

/** Statuses that require remarks when set via admin status update. */
export type AgreementHoldTerminateStatus = 'on_hold' | 'terminated'

export type CustomerSourceMode = 'quotation' | 'existing' | 'new'

export type AgreementEntityStatus = 'active' | 'inactive'

export type AdvanceType = 'full' | 'percentage' | 'fixed'

export type ProcessingBlockRule = 'before_submission' | 'before_appointment' | 'before_processing'

export type OnboardingDocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected'

export interface AgreementActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

/** Meeting minutes / MoM files attached to an agreement (PDF, Word, or any format). */
export interface AgreementMinute {
  id: string
  fileName: string
  fileType: string
  fileSizeKb: number
  uploadedAt: string
  uploadedBy: string
}

export interface AgreementEntity {
  id: string
  entityName: string
  billingAddress: string
  gstNumber: string
  contactPerson: string
  email: string
  phone: string
  landlineNumber?: string
  status: AgreementEntityStatus
}

export interface AgreementPricingRow {
  id: string
  country: string
  countryId?: string
  visaType: string
  workflowType: string
  servicePresetId: string
  servicePresetName: string
  serviceFee: number
  gstApplicable: boolean
  remarks: string
}

export type AgreementPricingAppliesTo = 'all' | 'entities'

/** Named fee schedule on an agreement. Quotations stay a single list; agreements may have several. */
export interface AgreementPricingSchedule {
  id: string
  name: string
  appliesTo: AgreementPricingAppliesTo
  /** Required when appliesTo is `entities`. Each entity may appear on at most one override. */
  entityIds: string[]
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
}

export interface AgreementMiscCostRow {
  id: string
  serviceName: string
  pricingType: 'fixed' | 'per_unit' | 'percentage'
  amount: number
  gstApplicable: boolean
  remarks: string
}

export interface AgreementServiceWiseBillingRule {
  servicePresetId: string
  servicePresetName: string
  billingRule: 'advance' | 'credit'
}

export interface AgreementBillingConfig {
  creditBillingEnabled: boolean
  billingCycle: 'monthly' | 'quarterly' | 'custom'
  /** Calendar day of the month invoices are generated (1–31). */
  billingDay: number
  creditPeriodDays: number
  creditLimit: number
  gracePeriodDays: number
  advanceType: AdvanceType
  advancePercentage: number
  fixedAdvanceAmount: number
  processingBlockRule: ProcessingBlockRule
  serviceWiseBillingRules: AgreementServiceWiseBillingRule[]
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

export type AgreementFinanceContactSource = 'company' | 'parent_company' | 'entity' | 'manual'

export interface AgreementFinanceContactPerson {
  id: string
  sourceType: AgreementFinanceContactSource
  sourceId?: string
  sourceLabel: string
  contactPerson: string
  email: string
  phone: string
  landlineNumber?: string
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
  customerSourceMode: CustomerSourceMode
  referenceQuotationId?: string
  parentCompanyId?: string
  agreementType: AgreementType
  workflowType: AgreementWorkflowType
  billingType: AgreementBillingType
  status: AgreementStatus
  startDate: string
  endDate: string
  entities: AgreementEntity[]
  /** Flattened compat projection for invoices / legacy readers. */
  pricingMatrix: AgreementPricingRow[]
  miscellaneousCosts: AgreementMiscCostRow[]
  /** Default-schedule visa fees (compat). Prefer `pricingSchedules`. */
  commercialVisaPricing?: CommercialVisaPricingRule[]
  miscellaneousServices?: QuotationServiceLine[]
  /** Default + entity-specific fee schedules. Source of truth in agreement UI. */
  pricingSchedules?: AgreementPricingSchedule[]
  billingConfig: AgreementBillingConfig
  financeContacts: AgreementFinanceContacts
  financeContactPersons?: AgreementFinanceContactPerson[]
  manualFinanceContacts?: AgreementFinanceContactPerson[]
  selectedFinanceContactIds?: string[]
  documents: AgreementOnboardingDocument[]
  /** Meeting minutes / MoM uploads (detail Minutes tab). */
  minutes?: AgreementMinute[]
  createdAt: string
  updatedAt: string
  readyForActivationAt?: string
  activatedAt?: string
  statusRemarks?: string
  activities: AgreementActivity[]
}

export interface CommercialAgreementFormData {
  customerSourceMode: CustomerSourceMode
  referenceQuotationId: string
  existingCompanyId: string
  parentCompanyId: string
  company: import('./companyMaster').CompanyMasterFormData
  agreementType: AgreementType
  workflowType: AgreementWorkflowType
  billingType: AgreementBillingType
  startDate: string
  endDate: string
  entities: AgreementEntity[]
  pricingMatrix: AgreementPricingRow[]
  miscellaneousCosts: AgreementMiscCostRow[]
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
  pricingSchedules: AgreementPricingSchedule[]
  billingConfig: AgreementBillingConfig
  financeContacts: AgreementFinanceContacts
  financeContactPersons: AgreementFinanceContactPerson[]
  manualFinanceContacts: AgreementFinanceContactPerson[]
  selectedFinanceContactIds: string[]
  documents: AgreementOnboardingDocument[]
}

export interface CommercialAgreementListFilters {
  status?: AgreementStatus | 'all'
  agreementType?: AgreementType | 'all'
  workflowType?: AgreementWorkflowType | 'all'
  billingType?: AgreementBillingType | 'all'
  companyId?: string
  entityName?: string
  dateFrom?: string
  dateTo?: string
  query?: string
}

export interface AgreementApprovalValidation {
  ok: boolean
  issues: string[]
}

/** @deprecated Use AgreementActivationValidation */
export type AgreementActivationValidation = AgreementApprovalValidation

/** @deprecated Use customerSourceMode === 'existing' */
export type LegacyCompanyMode = 'existing' | 'new'

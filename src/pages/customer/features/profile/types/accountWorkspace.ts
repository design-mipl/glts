import type { AgreementOnboardingDocument } from '@/shared/types/commercialAgreement'
import type { CommercialVisaPricingRule, QuotationServiceLine } from '@/shared/types/quotation'

export type DocumentStatus = 'verified' | 'pending' | 'expired' | 'missing'
export type AgreementStatus = 'active' | 'expiring' | 'expired' | 'pending'
export type PricingModel = 'credit' | 'advance' | 'mixed'
export type BillingType = 'credit' | 'advance' | 'mixed'

export interface CompanyOverview {
  companyName: string
  companyType: string
  industryType: string
  companyStatus: string
  customerCategory: string
  onboardingDate: string
}

export interface ProfileContact {
  id: string
  name: string
  role: string
  email: string
  phone: string
}

export interface OperationalInformation {
  gltsTeam: string
  assignedBranch: string
  supportContact: ProfileContact
  escalationContact: ProfileContact
}

export interface BillingIdentity {
  billingEntityName: string
  gstNumber: string
  panNumber: string
  billingEmail: string
  billingPhone: string
  billingAddress: string
  gstVerified?: boolean
  panVerified?: boolean
}

export interface CountryVisaCoverage {
  country: string
  visaTypes: string[]
}

export interface SupportedOperations {
  countryCoverage: CountryVisaCoverage[]
}

export interface CompanyProfileData {
  overview: CompanyOverview
  operational: OperationalInformation
  billing: BillingIdentity
  operations: SupportedOperations
}

export interface AgreementSummary {
  status: AgreementStatus
  agreementType: string
  billingType: BillingType
  workflowType: string
  startDate: string
  endDate: string
}

export interface CreditBillingConfig {
  creditLimit: string
  creditUsed: string
  availableCredit: string
  creditPeriod: string
  gracePeriod: string
}

export interface AdvanceBillingConfig {
  advanceBalance: string
  advanceUtilized: string
  advanceRemaining: string
  advanceRule: string
}

export interface MixedBillingConfig {
  advanceBalance: string
  creditLimit: string
  outstanding: string
  remainingCredit: string
}

export interface AgreementDocument {
  id: string
  label: string
  fileName?: string
  status: 'available' | 'pending'
  uploadedAt?: string
  sourceDocument?: AgreementOnboardingDocument
}

export interface FinanceContactsSummary {
  accountsSpocName: string
  invoiceSubmissionEmail: string
  paymentFollowUpContact: string
  accountsContactNumber?: string
}

export interface FinanceContactPerson {
  id: string
  sourceType: 'company' | 'parent_company' | 'entity'
  sourceId?: string
  sourceLabel: string
  contactPerson: string
  email: string
  phone: string
}

export interface BillingSummary {
  creditPeriodDays: string
  creditLimit: string
  gracePeriodDays: string
  advancePercentage?: string
}

export interface AdvanceAdjustmentPreview {
  invoiceTotal: string
  advanceUsed: string
  remainingPayable: string
}

export interface PricingRow {
  id: string
  country: string
  visaType: string
  serviceType: string
  baseFee: string
  additionalCharges?: string
  pricingModel: PricingModel
}

export interface PricingGroup {
  id: string
  title: string
  rows: PricingRow[]
}

export interface TaxSummary {
  gstApplicable: boolean
  tdsApplicable: boolean
  gstPercentage: string
  tdsPercentage: string
}

export interface BillingAgreementData {
  agreement: AgreementSummary
  billingEntity: BillingIdentity
  billingSummary: BillingSummary
  billingConfig:
    | { billingType: 'credit'; credit: CreditBillingConfig }
    | { billingType: 'advance'; advance: AdvanceBillingConfig }
    | { billingType: 'mixed'; mixed: MixedBillingConfig }
  pricingGroups: PricingGroup[]
  /** Structured commercial pricing from agreement / quotation (source of truth for portal display). */
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
  supportedOperations: SupportedOperations
  documents: AgreementDocument[]
  onboardingDocuments: AgreementDocument[]
  agreementDocument?: AgreementDocument
  financeContacts: FinanceContactsSummary
  financeContactPersons: FinanceContactPerson[]
  advanceAdjustmentPreview: AdvanceAdjustmentPreview
  tax: TaxSummary
}

export interface PersonalAccount {
  id: string
  name: string
  designation: string
  email: string
  phone: string
  username: string
  profilePhotoUrl?: string
  lastLogin: string
  canEditDesignation: boolean
}

export interface UserSession {
  id: string
  device: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface PersonalProfileData {
  account: PersonalAccount
  sessions: UserSession[]
}

export interface AccountWorkspace {
  company: CompanyProfileData
  billing: BillingAgreementData
  personal: PersonalProfileData
}

export type ProfileTabId = 'company' | 'billing' | 'personal'

export type DocumentStatus = 'verified' | 'pending' | 'expired' | 'missing'
export type AgreementStatus = 'active' | 'expiring' | 'expired' | 'pending'
export type PricingModel = 'credit' | 'advance' | 'mixed'

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

export interface SupportedOperations {
  countries: string[]
  visaTypes: string[]
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
  startDate: string
  endDate: string
  creditTerms: string
  slaSummary: string
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

export interface FinanceSnapshot {
  billingCycle: string
  creditLimit: string
  outstandingAmount: string
  outstandingAlert?: boolean
  invoiceSummary: string
  paymentSummary: string
}

export interface TaxSummary {
  gstApplicable: boolean
  tdsApplicable: boolean
  gstPercentage: string
  tdsPercentage: string
}

export interface BillingAgreementData {
  agreement: AgreementSummary
  pricingGroups: PricingGroup[]
  finance: FinanceSnapshot
  tax: TaxSummary
  invoiceRules: string
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

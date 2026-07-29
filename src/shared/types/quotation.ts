import type { AgreementPricingRow, AgreementMiscCostRow, AgreementWorkflowType } from './commercialAgreement'
import type { ClientManagementPipelineStatus } from './clientManagementPipeline'

export type QuotationSourceType = 'enquiry' | 'direct'

export type QuotationSharedStatus = 'not_shared' | 'shared'

/** Shared Client Management pipeline status (synced with linked lead). */
export type QuotationPipelineStatus = ClientManagementPipelineStatus

export type QuotationPricingMode = 'retail' | 'commercial'

export type CommercialVisaPricingScope =
  | 'country'
  | 'country_group'
  | 'rest_of_countries_online'
  | 'rest_of_countries_offline'

export interface QuotationCustomerInfo {
  companyName: string
  contactPersonName: string
  contactNumber: string
  alternateContactNumber?: string
  emailAddress: string
  companyAddress: string
}

export interface QuotationServiceLine {
  id: string
  serviceId: string
  serviceName: string
  amount: number
  gstApplicable: boolean
}

export interface QuotationVfsServiceLine {
  id: string
  serviceName: string
  amount: number
  gstIncluded?: boolean
  /** Visa-processing vendor mapped on Country Master Consulate Rates. */
  vendorId?: string
  vendorName?: string
}

export interface RetailVisaPricingItem {
  id: string
  countryId: string
  country: string
  visaTypeId?: string
  visaType: string
  jurisdictionId?: string
  jurisdictionName?: string
  gltsServices: QuotationServiceLine[]
  vfsServices: QuotationVfsServiceLine[]
}

export interface CommercialVisaPricingRule {
  id: string
  scope: CommercialVisaPricingScope
  countryId?: string
  country?: string
  countryGroupId?: string
  countryGroupName?: string
  visaType: string
  serviceFee: number
  gstApplicable: boolean
  remarks: string
}

export interface QuotationPricingTotals {
  subtotal: number
  gstAmount: number
  grandTotal: number
}

export interface QuotationPricingVersion {
  id: string
  versionLabel: string
  versionNumber: number
  /** Compat flatten for agreement conversion / legacy readers */
  pricingMatrix: AgreementPricingRow[]
  retailVisaPricing: RetailVisaPricingItem[]
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
  totals: QuotationPricingTotals
  createdBy: string
  createdAt: string
}

export interface QuotationAttachment {
  id: string
  fileName: string
  fileType: string
  fileSizeKb: number
  uploadedAt: string
  uploadedBy: string
}

export interface QuotationActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface QuotationRecord {
  id: string
  quotationNo: string
  sourceType: QuotationSourceType
  enquiryId?: string
  workflowType: AgreementWorkflowType
  customer: QuotationCustomerInfo
  quotationDate: string
  validTill: string
  notes: string
  gstRateId: string
  gstPercentage: number
  attachments: QuotationAttachment[]
  activities: QuotationActivity[]
  /** Client Management pipeline stage (mirrored to linked lead). */
  status: QuotationPipelineStatus
  sharedStatus: QuotationSharedStatus
  sharedAt?: string
  sharedBy?: string
  currentVersionId: string
  pricingVersions: QuotationPricingVersion[]
  convertedAgreementId?: string
  convertedFromVersionId?: string
  createdAt: string
  createdBy: string
  updatedAt: string
}

export interface QuotationFormData {
  sourceType: QuotationSourceType
  enquiryId?: string
  workflowType: AgreementWorkflowType
  customer: QuotationCustomerInfo
  quotationDate: string
  validTill: string
  notes: string
  gstRateId: string
  gstPercentage: number
  /** Kept in sync via flatten helpers for legacy consumers */
  pricingMatrix: AgreementPricingRow[]
  retailVisaPricing: RetailVisaPricingItem[]
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
}

export interface QuotationListingFilters {
  query?: string
  sourceType?: QuotationSourceType | 'all'
  workflowType?: AgreementWorkflowType | 'all'
  status?: QuotationPipelineStatus | 'all'
  sharedStatus?: QuotationSharedStatus | 'all'
  dateFrom?: string
  dateTo?: string
}

export interface QuotationSharePayload {
  recipientEmail: string
  message?: string
}

export type { AgreementMiscCostRow }

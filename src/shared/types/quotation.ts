import type { AgreementPricingRow, AgreementWorkflowType } from './commercialAgreement'

export type QuotationSourceType = 'enquiry' | 'direct'

export type QuotationVersionStatus = 'draft' | 'submitted' | 'approved' | 'rejected'

export type QuotationSharedStatus = 'not_shared' | 'shared'

export interface QuotationCustomerInfo {
  companyName: string
  contactPersonName: string
  contactNumber: string
  emailAddress: string
  companyAddress: string
}

export interface QuotationPricingTotals {
  subtotal: number
  gstAmount: number
  grandTotal: number
}

export interface QuotationApprovalEntry {
  status: QuotationVersionStatus | 'shared'
  actor: string
  timestamp: string
  remarks?: string
}

export interface QuotationPricingVersion {
  id: string
  versionLabel: string
  versionNumber: number
  status: QuotationVersionStatus
  pricingMatrix: AgreementPricingRow[]
  totals: QuotationPricingTotals
  createdBy: string
  createdAt: string
  approvalHistory: QuotationApprovalEntry[]
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
  gstPercentage: number
  attachments: QuotationAttachment[]
  activities: QuotationActivity[]
  sharedStatus: QuotationSharedStatus
  sharedAt?: string
  sharedBy?: string
  currentVersionId: string
  pricingVersions: QuotationPricingVersion[]
  convertedAgreementId?: string
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
  gstPercentage: number
  pricingMatrix: AgreementPricingRow[]
}

export interface QuotationListingFilters {
  query?: string
  sourceType?: QuotationSourceType | 'all'
  workflowType?: AgreementWorkflowType | 'all'
  approvalStatus?: QuotationVersionStatus | 'all'
  sharedStatus?: QuotationSharedStatus | 'all'
  dateFrom?: string
  dateTo?: string
}

export interface QuotationSharePayload {
  recipientEmail: string
  message?: string
}

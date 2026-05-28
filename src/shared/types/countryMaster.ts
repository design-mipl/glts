/** Admin Country master — aggregate root for portal visa & document configuration. */

export type CountryMasterStatus = 'active' | 'inactive'

export type RequirementPreviewVariant = 'crew' | 'shipping' | 'embassy' | 'glts'

export interface CountryDocumentMapping {
  documentId: string
  name: string
  mandatory: boolean
  remarks?: string
  hasSample?: boolean
  ocrSupported?: boolean
  description?: string
  formatNotes?: string
}

export interface RequirementDocumentRow {
  id: string
  name: string
  mandatory: boolean
  remarks?: string
  hasSample?: boolean
}

export interface RequirementPreviewCard {
  id: string
  title: string
  arrangedBy?: string
  alertNote?: string
  documents?: RequirementDocumentRow[]
  scopeItems?: string[]
  variant: RequirementPreviewVariant
}

export interface CountryVisaOffering {
  id: string
  visaTypeId: string
  visaTypeLabel: string
  purposeId: string
  purposeLabel: string
  processingTimeline: string
  entryType: string
  requirementSummary: string
  active: boolean
  /** Drives requirement preview & document workspace templates when sections are not overridden. */
  workflowProfile: 'standard' | 'crew'
  documentMappings: CountryDocumentMapping[]
  requirementPreviewCards?: RequirementPreviewCard[]
}

export interface CountryMaster {
  id: string
  code: string
  name: string
  flag: string
  region: string
  status: CountryMasterStatus
  cities: string
  heroPhotoId: string
  processingTime: string
  price: number
  rating: number
  trending: boolean
  trendingPercent: number
  visaCategory: string
  validity: string
  fastMinutes?: number
  visaOfferings: CountryVisaOffering[]
}

export type DocumentVerificationStatus =
  | 'Uploaded'
  | 'Verified'
  | 'Needs Review'
  | 'Needs Clarification'
  | 'Low Confidence'

export interface DocumentWorkspaceItem {
  id: string
  name: string
  required: boolean
  description: string
  formatNotes?: string
  remarks?: string
  status?: DocumentVerificationStatus
  ocrSupported?: boolean
  ocrMismatchAlert?: string
  extractedFields?: { label: string; value: string }[]
}

export type PortalChecklistStatus = 'uploaded' | 'missing' | 'pending'

export interface PortalChecklistItem {
  id: string
  label: string
  required: boolean
  status: PortalChecklistStatus
}

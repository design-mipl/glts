/** Admin Country master — aggregate root for portal visa & document configuration. */

export type CountryMasterStatus = 'active' | 'inactive' | 'draft'

export type BusinessSegment = 'retail' | 'corporate' | 'marine' | 'b2bAgents'

export type ProcessingType =
  | 'embassy'
  | 'e_visa'
  | 'vfs'
  | 'agent_submission'
  | 'hybrid'

export type VisaTypeStatus = 'active' | 'inactive'

export type VisaApplicationWindowUnit = 'days' | 'weeks' | 'months'

export interface VisaApplicationWindow {
  unit: VisaApplicationWindowUnit
  value: number
}

export type ConfigNodeStatus = 'enabled' | 'disabled' | 'draft' | 'warning'

export type JurisdictionPriorityLevel = 'standard' | 'express' | 'urgent'

export type JurisdictionDocumentGroup = 'common' | 'jurisdiction' | 'optional'

export type WorkflowProfile = 'standard' | 'crew'

export type RequirementPreviewVariant = 'crew' | 'shipping' | 'embassy' | 'glts'

/** Legacy document mapping shape — used by customer portal workspace. */
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

/** Reference to Document Master — name from master; description may be overridden per country. */
export interface CountryDocumentChecklistItem {
  documentId: string
  mandatory: boolean
  sortOrder: number
  /** Country-specific description; falls back to Document Master when empty. */
  description?: string
}

export interface CountryProcessingRules {
  submissionMode: 'embassy_direct' | 'vfs' | 'e_visa_portal' | 'agent_channel' | 'agent_submission'
  normalProcessingDays: string
  expressProcessingDays?: string
  expressFeeNotes?: string
  appointmentProvider?: string
  appointmentRequired: boolean
  appointmentLeadTimeDays?: number
  fundsHandlingMode: 'customer_pays' | 'glts_float' | 'embassy_direct' | 'agent_float'
  fundsNotes?: string
  ocrPolicyEnabled: boolean
  workflowProfile: WorkflowProfile
  slaTargetDays?: number
  escalationThresholdDays?: number
  biometricRequired: boolean
  interviewRequired: boolean
  physicalPassportRequired: boolean
  eVisaPortalUrl?: string
  agentChannelNotes?: string
}

export interface CountryJurisdictionDocumentRule {
  id: string
  documentId: string
  group: JurisdictionDocumentGroup
  mandatory: boolean
  ocrEnabled: boolean
  multipleUpload: boolean
  commonDocument: boolean
  description?: string
  acceptedFormats?: string[]
  validationRules?: string
  sortOrder: number
}

export interface CountryJurisdictionProcessingRules {
  biometricsRequired: boolean
  interviewRequired: boolean
  originalDocumentsRequired: boolean
  appointmentMandatory: boolean
}

export interface CountryVisaJurisdiction {
  id: string
  name: string
  embassyOrVfs: string
  submissionCenter: string
  processingTime: string
  priorityLevel: JurisdictionPriorityLevel
  status: VisaTypeStatus
  applicableStates: string[]
  processingRules: CountryJurisdictionProcessingRules
  documents: CountryJurisdictionDocumentRule[]
}

export interface CountryVisaType {
  id: string
  name: string
  visaCategory: string
  processingTime: string
  entryType: string
  validity: string
  stayDuration: string
  prioritySupport: boolean
  status: VisaTypeStatus
  pricing?: number
  jurisdictions: CountryVisaJurisdiction[]
  /** Visa-type / application-specific documents (in addition to segment common documents). */
  applicationDocuments: CountryDocumentChecklistItem[]
  processingRulesOverride?: Partial<CountryProcessingRules>
  /** Legacy sync fields */
  purposeId?: string
  purposeLabel?: string
  requirementSummary?: string
}

export interface CountryConfigValidationWarning {
  id: string
  message: string
  nodePath: string
  severity: 'warning' | 'error'
}

export interface CountryConfigSummary {
  totalSegments: number
  totalVisaTypes: number
  totalJurisdictions: number
  totalDocuments: number
  warnings: CountryConfigValidationWarning[]
}

export interface CountrySegmentConfig {
  segment: BusinessSegment
  enabled: boolean
  /** Shared across all visa types in this segment (e.g. passport, photo). */
  commonDocuments: CountryDocumentChecklistItem[]
  visaTypes: CountryVisaType[]
  processingRules: CountryProcessingRules
}

export interface CountryActivityEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  detail?: string
  segment?: BusinessSegment
}

/** Flat offering — synthesized for customer portal backward compatibility. */
export interface CountryVisaOffering {
  id: string
  visaTypeId: string
  visaTypeLabel: string
  purposeId: string
  purposeLabel: string
  processingTimeline: string
  entryType: string
  /** Visa-type pricing when set; otherwise falls back to country starting price. */
  approxCost?: number
  requirementSummary: string
  active: boolean
  workflowProfile: WorkflowProfile
  documentMappings: CountryDocumentMapping[]
  requirementPreviewCards?: RequirementPreviewCard[]
  segment?: BusinessSegment
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

/** Passport issuing city/office mapped to consulate/VFS jurisdiction for customer applications. */
export interface PassportIssueLocation {
  id: string
  label: string
  jurisdiction: string
  active?: boolean
}

export interface CountryMaster {
  id: string
  code: string
  name: string
  flag: string
  region: string
  status: CountryMasterStatus
  processingType: ProcessingType
  embassyNotes?: string
  internalNotes?: string
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
  visaApplicationWindow?: VisaApplicationWindow
  passportIssueLocations: PassportIssueLocation[]
  segments: CountrySegmentConfig[]
  /** Synced flat list for legacy consumers */
  visaOfferings: CountryVisaOffering[]
  createdAt: string
  updatedAt: string
  activities: CountryActivityEntry[]
}

export interface CountryMasterFormData {
  code: string
  name: string
  flag: string
  region: string
  status: CountryMasterStatus
  processingType: ProcessingType
  embassyNotes: string
  internalNotes: string
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
  visaApplicationWindow: VisaApplicationWindow
  passportIssueLocations: PassportIssueLocation[]
  segments: CountrySegmentConfig[]
}

export interface CountryMasterListFilters {
  status?: CountryMasterStatus | 'all'
  segment?: BusinessSegment | 'all'
  processingType?: ProcessingType | 'all'
  region?: string | 'all'
  query?: string
}

export interface CountryMasterKpiCounts {
  total: number
  active: number
  inactive: number
  draft: number
}

export interface CountrySegmentAggregates {
  visaTypeCount: number
  checklistCount: number
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

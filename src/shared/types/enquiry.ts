import type { ClientManagementPipelineStatus } from './clientManagementPipeline'

export type EnquiryCustomerType = 'retail' | 'corporate' | 'marine'

export type EnquiryPriority = 'low' | 'medium' | 'high' | 'critical'

/** Lead status uses the shared Client Management pipeline (synced with quotation). */
export type EnquiryStatus = ClientManagementPipelineStatus

export type EnquiryFollowupType = 'call' | 'email' | 'meeting' | 'whatsapp' | 'internal'

export type EnquiryFollowupStatus = 'scheduled' | 'completed' | 'missed' | 'rescheduled'

export type EnquiryFollowupOutcome =
  | 'interested'
  | 'quotation_sent'
  | 'follow_up_required'
  | 'no_response'
  | 'change_in_plans'
  | 'not_interested'

export type EnquiryActivityType =
  | 'created'
  | 'status_updated'
  | 'followup_added'
  | 'followup_completed'
  | 'assignment_updated'
  | 'note_added'
  | 'attachment_uploaded'
  | 'converted_to_quotation'
  | 'quotation_draft_started'

export interface EnquiryCustomerInfo {
  companyOrCustomerName: string
  customerType: EnquiryCustomerType
  contactPersonName: string
  contactNumber: string
  emailAddress: string
  alternateContactNumber?: string
  companyWebsite?: string
  companyAddress?: string
}

export type EnquiryProcessingType = 'standard' | 'express' | 'urgent'

export interface EnquiryVisaRequirementItem {
  id: string
  country: string
  visaType: string
  purposeOfVisit: string
}

export interface EnquiryVisaRequirement {
  /** Per-country visa requirements — preferred source when present. */
  items?: EnquiryVisaRequirementItem[]
  countries: string[]
  visaType: string
  purposeOfVisit: string
  processingType?: EnquiryProcessingType | string
  numberOfApplicants: number
  marineRequirement: boolean
  tentativeTravelDate?: string
  expectedProcessingTimeline?: string
  urgencyLevel: EnquiryPriority
}

export interface EnquiryOperationalRequirements {
  bulkUploadRequired: boolean
  documentPickupRequired: boolean
  groundOperationsRequired: boolean
  biometricsAssistanceRequired: boolean
  courierSupportRequired: boolean
  dedicatedSpocRequired: boolean
}

export type EnquirySource =
  | 'website'
  | 'referral'
  | 'existing_customer'
  | 'email'
  | 'call'
  | 'sales_team'

export interface EnquirySalesDetails {
  inquirySource: EnquirySource
  assignedSalesPerson?: string
  assignedOperationsTeam?: string
  branch?: string
  priorityLevel: EnquiryPriority
}

export interface EnquiryNotesSection {
  initialDiscussionNotes?: string
  customerExpectations?: string
  specialInstructions?: string
  internalNotes?: string
}

export interface EnquiryAttachment {
  id: string
  fileName: string
  fileType: string
  fileSizeKb: number
  uploadedAt: string
  uploadedBy: string
  version: number
}

export interface EnquiryFollowup {
  id: string
  followupType: EnquiryFollowupType
  followupDate: string
  followupTime: string
  discussionSummary: string
  nextAction: string
  assignedUser: string
  reminderRequired: boolean
  followupStatus: EnquiryFollowupStatus
  outcome?: EnquiryFollowupOutcome
  createdAt: string
  createdBy: string
}

export interface EnquiryActivityLog {
  id: string
  type: EnquiryActivityType
  title: string
  description: string
  actor: string
  timestamp: string
  metadata?: Record<string, string>
}

export interface EnquiryAssignment {
  assignedTeam?: string
  assignedUser?: string
  branch?: string
  priority: EnquiryPriority
  slaTarget?: string
  assignmentNotes?: string
  ownershipHistory: Array<{
    changedAt: string
    changedBy: string
    fromTeam?: string
    toTeam?: string
    fromUser?: string
    toUser?: string
    notes?: string
  }>
}

export interface EnquiryRecord {
  id: string
  enquiryDate: string
  createdBy: string
  status: EnquiryStatus
  customer: EnquiryCustomerInfo
  visaRequirement: EnquiryVisaRequirement
  operationalRequirements: EnquiryOperationalRequirements
  salesDetails: EnquirySalesDetails
  notes: EnquiryNotesSection
  attachments: EnquiryAttachment[]
  followups: EnquiryFollowup[]
  activities: EnquiryActivityLog[]
  assignment: EnquiryAssignment
  lastActivity: string
  nextFollowupDate?: string
}

export type EnquiryFormData = Omit<
  EnquiryRecord,
  'id' | 'createdBy' | 'enquiryDate' | 'status' | 'activities' | 'lastActivity' | 'assignment'
> & {
  status?: EnquiryStatus
  assignment?: Partial<EnquiryAssignment>
}

export interface EnquiryListingFilters {
  dateFrom?: string
  dateTo?: string
  customerType?: EnquiryCustomerType
  countryRequirement?: string
  visaType?: string
  priority?: EnquiryPriority
  assignedTeam?: string
  assignedUser?: string
  enquiryStatus?: EnquiryStatus
  marineRequirement?: boolean
  inquirySource?: EnquirySource
}

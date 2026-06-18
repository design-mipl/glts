import type { ApplicationProcessingStageDates } from '@/shared/types/applicationProcessingTimeline'
import type {
  ApplicationCustomerSegment,
  ApplicationOperationalStatus,
  ApplicationRecordType,
} from '../types/applicationListing.types'
import type { ApplicantAdditionalDetails } from '../config/applicantAdditionalDetailsConfig'
import type { ApplicantBasicDetails } from '../config/applicantBasicDetailsConfig'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'
import type { CustomerPortalRole } from '@/shared/auth/session'
import { statusToneFromOperational } from '../components/listing/applicationStatus'
import { GLTS_APPLICATION_IDS } from '../../../data/portalIds'

/** Inferred at submit from upload listing count — not chosen by the user in the create flow. */
export type ApplicationSubmitKind = 'single' | 'bulk'

/** @deprecated Use ApplicationSubmitKind */
export type ApplicationFlowMode = ApplicationSubmitKind

export type QueueRowStatus = 'verified' | 'needs_review' | 'processing' | 'error'

export interface SingleApplicationRow {
  id: string
  recordType: Extract<ApplicationRecordType, 'single'>
  applicantName: string
  passportNumber: string
  companyName?: string
  vesselName?: string
  country: string
  countryFlag?: string
  visaType: string
  jurisdiction?: string
  travelDate: string
  submissionDate: string
  createdAt: string
  lastUpdated: string
  processingStage: string
  operationalStatus: ApplicationOperationalStatus
  /** Display label — mirrors operationalStatus */
  status: string
  statusTone: 'review' | 'pending' | 'approved' | 'draft' | 'processing'
  createdByEmail: string
  createdByRole: CustomerPortalRole
  customerSegment: ApplicationCustomerSegment
  appointmentDate?: string
  poReference?: string
  processingStageDates?: ApplicationProcessingStageDates
  assignedTeamId?: string
  assignedUserId?: string
}

export interface BulkBatchRow {
  id: string
  recordType: Extract<ApplicationRecordType, 'bulk'>
  companyName: string
  vesselName?: string
  /** Lead passenger shown in listings as "Name × count". */
  primaryApplicantName?: string
  country: string
  countryFlag?: string
  visaType: string
  jurisdiction?: string
  totalApplicants: number
  verifiedApplicants: number
  pendingCorrections: number
  processed: number
  errors: number
  travelDate: string
  submissionDate: string
  createdAt: string
  lastUpdated: string
  processingStage: string
  operationalStatus: ApplicationOperationalStatus
  status: string
  statusTone: 'review' | 'pending' | 'approved' | 'processing' | 'draft'
  createdByEmail: string
  createdByRole: CustomerPortalRole
  customerSegment: ApplicationCustomerSegment
  appointmentDate?: string
  poReference?: string
  processingStageDates?: ApplicationProcessingStageDates
  assignedTeamId?: string
  assignedUserId?: string
}

export interface ExtractedField {
  key: string
  label: string
  value: string
  confidence: number
}

export type ApplicantDocumentStatus = 'missing' | 'uploaded' | 'verified' | 'needs_review' | 'rejected'

import type {
  DocumentHandlingMode,
  InsuranceWorkflow,
  TravelTicketWorkflow,
} from '@/shared/utils/applicantDocumentWorkflowUtils'

export type { DocumentHandlingMode, TravelTicketWorkflow, InsuranceWorkflow }

export interface ApplicantDocumentItem {
  documentId: string
  name: string
  required: boolean
  /** Country-master description for this document requirement. */
  description?: string
  /** Physical original required per country master jurisdiction rule. */
  originalDocument?: boolean
  /** GLTS marked the physical original as received (admin verification workflow). */
  originalDocumentReceived?: boolean
  status: ApplicantDocumentStatus
  /** Admin review note shown to the customer when a document is rejected or needs re-upload. */
  reviewComment?: string
  fields?: ExtractedField[]
  /** Simple requirement workflow — Travel Ticket / Insurance. */
  handlingMode?: DocumentHandlingMode
  travelTicket?: TravelTicketWorkflow
  insurance?: InsuranceWorkflow
}

export interface UploadQueueRow {
  id: string
  /** Internal — original upload filename; not shown in queue table. */
  fileName: string
  /** Client-side unique file fingerprint key for upload session diffing. */
  sourceFileKey?: string
  /** Parent GLTS application (shared across rows in one create flow). */
  gltsApplicationId?: string
  /** Per-traveler applicant reference (bulk / multi-row queue). */
  gltsApplicantId: string
  /** 1-based line number within the current upload session. */
  sequenceNo: number
  travelerName: string
  passportNo: string
  expiry: string
  nationality: string
  /** Legacy OCR score — prefer documentsComplete/documentsTotal in queue UI */
  confidence: number
  status: QueueRowStatus
  mrzLine?: string
  fields: ExtractedField[]
  documents: ApplicantDocumentItem[]
  documentsComplete: number
  documentsTotal: number
  /** Per-traveler supplemental fields on the Documents step. */
  additionalDetails?: ApplicantAdditionalDetails
  /** Per-traveler identity fields in the applicant drawer. */
  basicDetails?: ApplicantBasicDetails
  /** Physical original document collection intake for this traveler. */
  originalDocumentCollection?: OriginalDocumentCollectionState
  /** Milestone timestamps for the horizontal processing timeline. */
  processingStageDates?: ApplicationProcessingStageDates
}

export interface ChecklistItem {
  id: string
  label: string
  required: boolean
  status: 'uploaded' | 'missing' | 'invalid' | 'pending'
}

export const GLTS_BATCH_IDS = {
  schengenCrew: 'GLTS-BAT-2026-041',
  japanGroup: 'GLTS-BAT-2026-038',
} as const

/** Marine single-application demo — applicant chose GLTS to arrange ticket and insurance. */
export const MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID = 'GLTS-APP-2026-744' as const

function singleRow(
  partial: Omit<SingleApplicationRow, 'recordType' | 'status' | 'statusTone'> & {
    operationalStatus: ApplicationOperationalStatus
  },
): SingleApplicationRow {
  const { operationalStatus, ...rest } = partial
  return {
    recordType: 'single',
    status: operationalStatus,
    statusTone: statusToneFromOperational(operationalStatus),
    operationalStatus,
    ...rest,
  }
}

function bulkRow(
  partial: Omit<BulkBatchRow, 'recordType' | 'status' | 'statusTone'> & {
    operationalStatus: ApplicationOperationalStatus
  },
): BulkBatchRow {
  const { operationalStatus, ...rest } = partial
  const tone = statusToneFromOperational(operationalStatus)
  return {
    recordType: 'bulk',
    status: operationalStatus,
    statusTone: tone === 'draft' ? 'draft' : tone === 'approved' ? 'approved' : tone === 'pending' ? 'pending' : tone === 'review' ? 'review' : 'processing',
    operationalStatus,
    ...rest,
  }
}

export const mockSingleApplications: SingleApplicationRow[] = [
  singleRow({
    id: GLTS_APPLICATION_IDS.schengen,
    applicantName: 'Priya Sharma',
    passportNumber: 'Z1234567',
    companyName: 'Oceanic Marine Ltd',
    vesselName: 'MV Oceanic Star',
    country: 'Schengen',
    countryFlag: '🇫🇷',
    visaType: 'Sticker · Type C',
    jurisdiction: 'Mumbai',
    travelDate: '2026-05-01',
    submissionDate: '2026-02-10',
    createdAt: '2026-02-01',
    lastUpdated: '2026-02-18',
    processingStage: 'Embassy processing',
    operationalStatus: 'Under Review',
    createdByEmail: 'priya@glts.com',
    createdByRole: 'booker',
    customerSegment: 'marine',
    processingStageDates: {
      ready: '2026-02-01T09:00:00.000Z',
      submitted: '2026-02-10T11:30:00.000Z',
      appointment: '2026-02-14T10:00:00.000Z',
      embassy: '2026-02-18T08:15:00.000Z',
    },
  }),
  singleRow({
    id: GLTS_APPLICATION_IDS.japan,
    applicantName: 'Raj Kumar',
    passportNumber: 'M8829104',
    country: 'Japan',
    countryFlag: '🇯🇵',
    visaType: 'eVisa · Tourist',
    travelDate: '2026-04-18',
    submissionDate: '2026-02-05',
    createdAt: '2026-01-28',
    lastUpdated: '2026-02-17',
    processingStage: 'Document verification',
    operationalStatus: 'Correction Required',
    createdByEmail: 'james@glts.com',
    createdByRole: 'booker',
    customerSegment: 'retail',
    processingStageDates: {
      ready: '2026-01-28T09:00:00.000Z',
      submitted: '2026-02-05T14:00:00.000Z',
    },
  }),
  singleRow({
    id: GLTS_APPLICATION_IDS.uae,
    applicantName: 'James Chen',
    passportNumber: 'EJ4419283',
    country: 'UAE',
    countryFlag: '🇦🇪',
    visaType: 'e-Visa · 30d',
    travelDate: '2026-03-20',
    submissionDate: '2026-01-15',
    createdAt: '2026-01-10',
    lastUpdated: '2026-02-12',
    processingStage: 'Closed',
    operationalStatus: 'Completed',
    createdByEmail: 'james@glts.com',
    createdByRole: 'booker',
    customerSegment: 'retail',
    processingStageDates: {
      ready: '2026-01-10T08:00:00.000Z',
      submitted: '2026-01-15T10:30:00.000Z',
      appointment: '2026-01-20T09:00:00.000Z',
      embassy: '2026-02-01T11:00:00.000Z',
      'passport-ready': '2026-02-08T16:00:00.000Z',
      dispatch: '2026-02-10T09:30:00.000Z',
      delivered: '2026-02-12T13:00:00.000Z',
    },
  }),
  singleRow({
    id: 'GLTS-APP-2026-820',
    applicantName: 'Anita Desai',
    passportNumber: 'K5529103',
    country: 'UK',
    countryFlag: '🇬🇧',
    visaType: 'Visitor · Standard',
    travelDate: '2026-06-12',
    submissionDate: '',
    createdAt: '2026-02-20',
    lastUpdated: '2026-02-20',
    processingStage: 'Intake',
    operationalStatus: 'Draft',
    createdByEmail: 'sneha.patel@glts.com',
    createdByRole: 'admin',
    customerSegment: 'retail',
  }),
  singleRow({
    id: 'GLTS-APP-2026-815',
    applicantName: 'Carlos Mendez',
    passportNumber: 'PA8831200',
    companyName: 'Global Freight Co',
    country: 'Schengen',
    countryFlag: '🇩🇪',
    visaType: 'Business · Type C',
    travelDate: '2026-07-01',
    submissionDate: '',
    createdAt: '2026-02-19',
    lastUpdated: '2026-02-19',
    processingStage: 'Intake',
    operationalStatus: 'Draft',
    createdByEmail: 'admin@glts.com',
    createdByRole: 'super_admin',
    customerSegment: 'corporate',
  }),
  singleRow({
    id: 'GLTS-APP-2026-802',
    applicantName: 'Mei Lin',
    passportNumber: 'EH2291044',
    country: 'Singapore',
    countryFlag: '🇸🇬',
    visaType: 'Business · Short stay',
    travelDate: '2026-05-22',
    submissionDate: '2026-02-14',
    createdAt: '2026-02-08',
    lastUpdated: '2026-02-16',
    processingStage: 'Document verification',
    operationalStatus: 'Pending Documents',
    createdByEmail: 'arun.krishnan@glts.com',
    createdByRole: 'admin',
    customerSegment: 'b2bAgents',
  }),
  singleRow({
    id: 'GLTS-APP-2026-790',
    applicantName: 'Oliver Grant',
    passportNumber: 'XK9283746',
    companyName: 'Apex Marine Logistics',
    vesselName: 'MV Pacific Horizon',
    country: 'Japan',
    countryFlag: '🇯🇵',
    visaType: 'eVisa · Tourist',
    jurisdiction: 'Delhi',
    travelDate: '2026-04-02',
    submissionDate: '2026-02-01',
    createdAt: '2026-01-25',
    lastUpdated: '2026-02-15',
    processingStage: 'Appointment Booked',
    operationalStatus: 'Appointment Booked',
    appointmentDate: '2026-03-12',
    poReference: 'PO-AMX-2026-014',
    createdByEmail: 'priya@glts.com',
    createdByRole: 'booker',
    customerSegment: 'marine',
  }),
  singleRow({
    id: 'GLTS-APP-2026-778',
    applicantName: 'Sofia Petrov',
    passportNumber: 'TR3528471',
    companyName: 'Apex Marine Logistics',
    vesselName: 'MV Gulf Runner',
    country: 'UAE',
    countryFlag: '🇦🇪',
    visaType: 'e-Visa · 14d',
    jurisdiction: 'Mumbai',
    travelDate: '2026-03-28',
    submissionDate: '2026-01-20',
    createdAt: '2026-01-18',
    lastUpdated: '2026-02-10',
    processingStage: 'Appointment Booked',
    operationalStatus: 'Appointment Booked',
    appointmentDate: '2026-03-08',
    createdByEmail: 'admin@glts.com',
    createdByRole: 'super_admin',
    customerSegment: 'marine',
  }),
  singleRow({
    id: 'GLTS-APP-2026-744',
    applicantName: 'Mateo Alvarez',
    passportNumber: 'NQ5528931',
    companyName: 'BlueWave Marine Agency',
    vesselName: 'MV Atlantic Crest',
    country: 'Schengen',
    countryFlag: '🇪🇸',
    visaType: 'Crew · Type C',
    jurisdiction: 'Mumbai',
    travelDate: '2026-06-08',
    submissionDate: '2026-02-16',
    createdAt: '2026-02-10',
    lastUpdated: '2026-02-19',
    processingStage: 'Embassy processing',
    operationalStatus: 'Submitted',
    createdByEmail: 'operations@bluewavemarine.com',
    createdByRole: 'admin',
    customerSegment: 'marine',
  }),
  singleRow({
    id: 'GLTS-APP-2026-739',
    applicantName: 'Asha Nair',
    passportNumber: 'IN3387214',
    companyName: 'Neptune Crew Services',
    vesselName: 'MV Eastern Pearl',
    country: 'Japan',
    countryFlag: '🇯🇵',
    visaType: 'Crew · Transit',
    jurisdiction: 'Delhi',
    travelDate: '2026-06-20',
    submissionDate: '2026-02-11',
    createdAt: '2026-02-03',
    lastUpdated: '2026-02-17',
    processingStage: 'Embassy processing',
    operationalStatus: 'Under Review',
    createdByEmail: 'crewdesk@neptunecs.com',
    createdByRole: 'booker',
    customerSegment: 'marine',
  }),
  singleRow({
    id: 'GLTS-APP-2026-731',
    applicantName: 'Kenji Sato',
    passportNumber: 'JP7742019',
    companyName: 'Apex Marine Logistics',
    vesselName: 'MV Lion City',
    country: 'Singapore',
    countryFlag: '🇸🇬',
    visaType: 'Crew · Multi-entry',
    jurisdiction: 'Chennai',
    travelDate: '2026-05-28',
    submissionDate: '2026-02-09',
    createdAt: '2026-01-29',
    lastUpdated: '2026-02-18',
    processingStage: 'Passport dispatch',
    operationalStatus: 'Passport Ready',
    createdByEmail: 'admin@glts.com',
    createdByRole: 'super_admin',
    customerSegment: 'marine',
  }),
  singleRow({
    id: 'GLTS-APP-2026-726',
    applicantName: 'Liam O Connor',
    passportNumber: 'IE2298810',
    companyName: 'Oceanic Marine Ltd',
    vesselName: 'MV Oceanic Star',
    country: 'UK',
    countryFlag: '🇬🇧',
    visaType: 'Crew · Standard',
    jurisdiction: 'Delhi',
    travelDate: '2026-05-12',
    submissionDate: '2026-01-30',
    createdAt: '2026-01-16',
    lastUpdated: '2026-02-14',
    processingStage: 'Closed',
    operationalStatus: 'Completed',
    createdByEmail: 'priya@glts.com',
    createdByRole: 'booker',
    customerSegment: 'marine',
  }),
  singleRow({
    id: 'GLTS-APP-2026-765',
    applicantName: 'David Okonkwo',
    passportNumber: 'A10482931',
    country: 'UK',
    countryFlag: '🇬🇧',
    visaType: 'Visitor · Standard',
    travelDate: '2026-08-15',
    submissionDate: '2026-02-12',
    createdAt: '2026-02-01',
    lastUpdated: '2026-02-14',
    processingStage: 'Document verification',
    operationalStatus: 'Verification Pending',
    createdByEmail: 'sneha.patel@glts.com',
    createdByRole: 'admin',
    customerSegment: 'b2bAgents',
  }),
  singleRow({
    id: 'GLTS-APP-2026-751',
    applicantName: 'Yuki Tanaka',
    passportNumber: 'TR8829100',
    country: 'Japan',
    countryFlag: '🇯🇵',
    visaType: 'eVisa · Tourist',
    travelDate: '2026-04-30',
    submissionDate: '2026-01-05',
    createdAt: '2025-12-28',
    lastUpdated: '2026-01-22',
    processingStage: 'Closed',
    operationalStatus: 'Rejected',
    createdByEmail: 'james@glts.com',
    createdByRole: 'booker',
    customerSegment: 'retail',
  }),
]

export const mockBulkBatches: BulkBatchRow[] = [
  bulkRow({
    id: GLTS_BATCH_IDS.schengenCrew,
    companyName: 'Oceanic Marine Ltd',
    vesselName: 'MV Oceanic Star',
    primaryApplicantName: 'Brendan Ryan',
    country: 'Schengen',
    countryFlag: '🇫🇷',
    visaType: 'Crew · Type C',
    jurisdiction: 'Delhi',
    totalApplicants: 6,
    verifiedApplicants: 5,
    pendingCorrections: 0,
    processed: 5,
    errors: 0,
    travelDate: '2026-05-01',
    submissionDate: '2026-02-08',
    createdAt: '2026-01-30',
    lastUpdated: '2026-02-18',
    processingStage: 'Appointment Booked',
    operationalStatus: 'Appointment Booked',
    appointmentDate: '2026-03-15',
    createdByEmail: 'admin@glts.com',
    createdByRole: 'super_admin',
    customerSegment: 'marine',
  }),
  bulkRow({
    id: GLTS_BATCH_IDS.japanGroup,
    companyName: 'Pacific Tours Inc',
    primaryApplicantName: 'Hiroshi Tanaka',
    country: 'Japan',
    countryFlag: '🇯🇵',
    visaType: 'eVisa · Group',
    totalApplicants: 12,
    verifiedApplicants: 12,
    pendingCorrections: 0,
    processed: 12,
    errors: 0,
    travelDate: '2026-04-18',
    submissionDate: '2026-02-15',
    createdAt: '2026-02-01',
    lastUpdated: '2026-02-17',
    processingStage: 'Embassy submission',
    operationalStatus: 'Submitted',
    createdByEmail: 'james@glts.com',
    createdByRole: 'booker',
    customerSegment: 'retail',
  }),
  bulkRow({
    id: 'GLTS-BAT-2026-035',
    companyName: 'Global Freight Co',
    primaryApplicantName: 'Carlos Mendez',
    country: 'UAE',
    countryFlag: '🇦🇪',
    visaType: 'e-Visa · Group',
    totalApplicants: 18,
    verifiedApplicants: 15,
    pendingCorrections: 1,
    processed: 16,
    errors: 0,
    travelDate: '2026-06-01',
    submissionDate: '2026-01-28',
    createdAt: '2026-01-15',
    lastUpdated: '2026-02-12',
    processingStage: 'Passport dispatch',
    operationalStatus: 'Passport Ready',
    createdByEmail: 'sneha.patel@glts.com',
    createdByRole: 'admin',
    customerSegment: 'b2bAgents',
  }),
  bulkRow({
    id: 'GLTS-BAT-2026-032',
    companyName: 'Harbor Logistics',
    primaryApplicantName: 'Anita Desai',
    country: 'UK',
    countryFlag: '🇬🇧',
    visaType: 'Visitor · Group',
    totalApplicants: 8,
    verifiedApplicants: 0,
    pendingCorrections: 0,
    processed: 0,
    errors: 0,
    travelDate: '2026-07-10',
    submissionDate: '',
    createdAt: '2026-02-18',
    lastUpdated: '2026-02-18',
    processingStage: 'Intake',
    operationalStatus: 'Draft',
    createdByEmail: 'priya@glts.com',
    createdByRole: 'booker',
    customerSegment: 'retail',
  }),
  bulkRow({
    id: 'GLTS-BAT-2026-029',
    companyName: 'Seafarer Solutions',
    vesselName: 'MV Pacific Horizon',
    primaryApplicantName: 'Andreas Klein',
    country: 'Schengen',
    countryFlag: '🇩🇪',
    visaType: 'Crew · Type C',
    jurisdiction: 'Mumbai',
    totalApplicants: 30,
    verifiedApplicants: 30,
    pendingCorrections: 0,
    processed: 30,
    errors: 0,
    travelDate: '2026-05-15',
    submissionDate: '2026-02-01',
    createdAt: '2026-01-20',
    lastUpdated: '2026-02-16',
    processingStage: 'Appointment Booked',
    operationalStatus: 'Appointment Booked',
    appointmentDate: '2026-03-20',
    createdByEmail: 'arun.krishnan@glts.com',
    createdByRole: 'admin',
    customerSegment: 'marine',
  }),
  bulkRow({
    id: 'GLTS-BAT-2026-021',
    companyName: 'Harborline Crewing Co',
    vesselName: 'MV Atlantic Crest',
    primaryApplicantName: 'Luca Bergstrom',
    country: 'Schengen',
    countryFlag: '🇫🇷',
    visaType: 'Crew · Type C',
    jurisdiction: 'Delhi',
    totalApplicants: 16,
    verifiedApplicants: 15,
    pendingCorrections: 1,
    processed: 15,
    errors: 0,
    travelDate: '2026-06-02',
    submissionDate: '2026-02-13',
    createdAt: '2026-02-04',
    lastUpdated: '2026-02-18',
    processingStage: 'Embassy submission',
    operationalStatus: 'Under Review',
    createdByEmail: 'ops@harborlinecrew.com',
    createdByRole: 'admin',
    customerSegment: 'marine',
  }),
  bulkRow({
    id: 'GLTS-BAT-2026-018',
    companyName: 'NorthSea Manning',
    vesselName: 'MV Eastern Pearl',
    primaryApplicantName: 'Erik Johansson',
    country: 'Japan',
    countryFlag: '🇯🇵',
    visaType: 'Crew · Group',
    jurisdiction: 'Delhi',
    totalApplicants: 10,
    verifiedApplicants: 10,
    pendingCorrections: 0,
    processed: 10,
    errors: 0,
    travelDate: '2026-05-18',
    submissionDate: '2026-02-06',
    createdAt: '2026-01-26',
    lastUpdated: '2026-02-17',
    processingStage: 'Passport dispatch',
    operationalStatus: 'Passport Ready',
    createdByEmail: 'dispatch@northseamanning.com',
    createdByRole: 'booker',
    customerSegment: 'marine',
  }),
  bulkRow({
    id: 'GLTS-MAR-1025',
    companyName: 'Oceanic Crew Management Pvt Ltd',
    vesselName: 'MV Green Horizon',
    primaryApplicantName: 'Rajesh Kumar',
    country: 'China',
    countryFlag: '🇨🇳',
    visaType: 'M Type Visa',
    jurisdiction: 'Delhi',
    totalApplicants: 5,
    verifiedApplicants: 5,
    pendingCorrections: 0,
    processed: 5,
    errors: 0,
    travelDate: '2026-06-28',
    submissionDate: '2026-06-12',
    createdAt: '2026-06-01',
    lastUpdated: '2026-06-13',
    processingStage: 'Embassy processing',
    operationalStatus: 'Submitted',
    createdByEmail: 'crewdesk@oceaniccrew.com',
    createdByRole: 'booker',
    customerSegment: 'marine',
    assignedTeamId: 'team-marine',
    assignedUserId: 'user-marine-2',
  }),
  bulkRow({
    id: 'GLTS-BAT-2026-025',
    companyName: 'Asia Connect Ltd',
    primaryApplicantName: 'Mei Lin',
    country: 'Singapore',
    countryFlag: '🇸🇬',
    visaType: 'Business · Group',
    totalApplicants: 6,
    verifiedApplicants: 6,
    pendingCorrections: 0,
    processed: 6,
    errors: 0,
    travelDate: '2026-03-25',
    submissionDate: '2026-01-10',
    createdAt: '2025-12-20',
    lastUpdated: '2026-02-05',
    processingStage: 'Closed',
    operationalStatus: 'Completed',
    createdByEmail: 'admin@glts.com',
    createdByRole: 'super_admin',
    customerSegment: 'corporate',
  }),
]

const hiroshiFields: ExtractedField[] = [
  { key: 'surname', label: 'Surname', value: 'TANAKA', confidence: 99 },
  { key: 'given', label: 'Given names', value: 'HIROSHI', confidence: 99 },
  { key: 'sex', label: 'Sex', value: 'M', confidence: 100 },
  { key: 'docNo', label: 'Document no.', value: 'TR3528471', confidence: 97 },
  { key: 'issueDate', label: 'Date of issue', value: '09 Jun 2021', confidence: 95 },
  { key: 'dob', label: 'Date of birth', value: '14 Mar 1988', confidence: 96 },
  { key: 'expiry', label: 'Date of expiry', value: '09 Jun 2031', confidence: 98 },
  { key: 'pob', label: 'Place of birth', value: 'OSAKA', confidence: 91 },
  { key: 'issuer', label: 'Issuing state', value: 'JPN', confidence: 100 },
  { key: 'mrz', label: 'Machine-readable line', value: 'Valid', confidence: 100 },
]

const rawMockUploadQueue: Omit<UploadQueueRow, 'documents' | 'documentsComplete' | 'documentsTotal'>[] = [
  {
    id: 'q1',
    fileName: 'IMG_8821.heic',
    gltsApplicationId: GLTS_BATCH_IDS.schengenCrew,
    gltsApplicantId: 'GLTS-APL-001',
    sequenceNo: 1,
    travelerName: 'BRENDAN RYAN',
    passportNo: 'PA6831172',
    expiry: '20 Dec 2028',
    nationality: 'IRL',
    confidence: 98,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'RYAN' : f.key === 'given' ? 'BRENDAN' : f.value })),
  },
  {
    id: 'q2',
    fileName: 'passport_scan.jpg',
    gltsApplicationId: GLTS_BATCH_IDS.schengenCrew,
    gltsApplicantId: 'GLTS-APL-002',
    sequenceNo: 2,
    travelerName: 'SARAH MILES',
    passportNo: 'XK9283746',
    expiry: '03 Jan 2030',
    nationality: 'GBR',
    confidence: 96,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'MILES' : f.key === 'given' ? 'SARAH' : f.value })),
  },
  {
    id: 'q3',
    fileName: 'crew_03.pdf',
    gltsApplicationId: GLTS_BATCH_IDS.schengenCrew,
    gltsApplicantId: 'GLTS-APL-003',
    sequenceNo: 3,
    travelerName: 'HIROSHI TANAKA',
    passportNo: 'TR3528471',
    expiry: '09 Jun 2031',
    nationality: 'JPN',
    confidence: 88,
    status: 'needs_review',
    mrzLine: 'P<JPN TANAKA<<HIROSHI<<<<<<<<<<<<<<<<<<<<',
    fields: hiroshiFields,
  },
  {
    id: 'q4',
    fileName: 'IMG_9012.heic',
    gltsApplicationId: GLTS_BATCH_IDS.schengenCrew,
    gltsApplicantId: 'GLTS-APL-004',
    sequenceNo: 4,
    travelerName: 'PRIYA SHARMA',
    passportNo: 'Z1234567',
    expiry: '15 Aug 2032',
    nationality: 'IND',
    confidence: 97,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'SHARMA' : f.key === 'given' ? 'PRIYA' : f.value })),
  },
  {
    id: 'q5',
    fileName: 'crew_04.pdf',
    gltsApplicationId: GLTS_BATCH_IDS.schengenCrew,
    gltsApplicantId: 'GLTS-APL-005',
    sequenceNo: 5,
    travelerName: 'MIKE CHEN',
    passportNo: 'EJ4419283',
    expiry: '22 Nov 2029',
    nationality: 'USA',
    confidence: 94,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'CHEN' : f.key === 'given' ? 'MIKE' : f.value })),
  },
  {
    id: 'q-mar-1',
    fileName: 'crew_green_01.pdf',
    gltsApplicationId: 'GLTS-MAR-1025',
    gltsApplicantId: 'GLTS-APL-M1025-01',
    sequenceNo: 1,
    travelerName: 'RAJESH KUMAR',
    passportNo: 'IN8829103',
    expiry: '15 Aug 2031',
    nationality: 'IND',
    confidence: 97,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'KUMAR' : f.key === 'given' ? 'RAJESH' : f.value })),
  },
  {
    id: 'q-mar-2',
    fileName: 'crew_green_02.pdf',
    gltsApplicationId: 'GLTS-MAR-1025',
    gltsApplicantId: 'GLTS-APL-M1025-02',
    sequenceNo: 2,
    travelerName: 'VIKRAM SINGH',
    passportNo: 'IN7738291',
    expiry: '22 Nov 2030',
    nationality: 'IND',
    confidence: 96,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'SINGH' : f.key === 'given' ? 'VIKRAM' : f.value })),
  },
  {
    id: 'q-mar-3',
    fileName: 'crew_green_03.pdf',
    gltsApplicationId: 'GLTS-MAR-1025',
    gltsApplicantId: 'GLTS-APL-M1025-03',
    sequenceNo: 3,
    travelerName: 'ANIL MEHTA',
    passportNo: 'IN6647182',
    expiry: '09 Jun 2032',
    nationality: 'IND',
    confidence: 95,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'MEHTA' : f.key === 'given' ? 'ANIL' : f.value })),
  },
  {
    id: 'q-mar-4',
    fileName: 'crew_green_04.pdf',
    gltsApplicationId: 'GLTS-MAR-1025',
    gltsApplicantId: 'GLTS-APL-M1025-04',
    sequenceNo: 4,
    travelerName: 'SURESH NAIR',
    passportNo: 'IN5596073',
    expiry: '20 Dec 2029',
    nationality: 'IND',
    confidence: 94,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'NAIR' : f.key === 'given' ? 'SURESH' : f.value })),
  },
  {
    id: 'q-mar-5',
    fileName: 'crew_green_05.pdf',
    gltsApplicationId: 'GLTS-MAR-1025',
    gltsApplicantId: 'GLTS-APL-M1025-05',
    sequenceNo: 5,
    travelerName: 'DEEPAK PILLAI',
    passportNo: 'IN4485964',
    expiry: '03 Jan 2033',
    nationality: 'IND',
    confidence: 93,
    status: 'verified',
    fields: hiroshiFields.map(f => ({ ...f, value: f.key === 'surname' ? 'PILLAI' : f.key === 'given' ? 'DEEPAK' : f.value })),
  },
  {
    id: 'q6',
    fileName: 'scan_pending.heic',
    gltsApplicationId: GLTS_BATCH_IDS.schengenCrew,
    gltsApplicantId: 'GLTS-APL-006',
    sequenceNo: 6,
    travelerName: '—',
    passportNo: '—',
    expiry: '—',
    nationality: '—',
    confidence: 0,
    status: 'processing',
    fields: [],
  },
]

const MOCK_QUEUE_PROCESSING_STAGE_DATES: ApplicationProcessingStageDates = {
  ready: '2026-02-01T09:00:00.000Z',
  submitted: '2026-02-10T11:30:00.000Z',
  appointment: '2026-02-14T10:00:00.000Z',
  embassy: '2026-02-18T08:15:00.000Z',
}

export const mockUploadQueue: UploadQueueRow[] = rawMockUploadQueue.map(row => ({
  ...row,
  processingStageDates: MOCK_QUEUE_PROCESSING_STAGE_DATES,
  documents: [],
  documentsComplete: 0,
  documentsTotal: 0,
}))

function toApplicantDisplayName(value: string): string {
  if (!value || value === '—') return value
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/** Lead passenger for a bulk batch — used in listings as "Name × count". */
export function resolveBulkPrimaryApplicantName(batch: BulkBatchRow): string {
  if (batch.primaryApplicantName?.trim()) {
    return batch.primaryApplicantName.trim()
  }
  if (batch.id === GLTS_BATCH_IDS.schengenCrew) {
    const firstTraveler = mockUploadQueue[0]?.travelerName
    if (firstTraveler && firstTraveler !== '—') {
      return toApplicantDisplayName(firstTraveler)
    }
  }
  return 'Traveler 1'
}

export function formatBulkApplicantListingLabel(batch: BulkBatchRow): string {
  return `${resolveBulkPrimaryApplicantName(batch)} × ${batch.totalApplicants}`
}

export const defaultChecklist = (country: string): ChecklistItem[] => [
  { id: 'passport', label: 'Passport', required: true, status: 'uploaded' },
  { id: 'photo', label: 'Applicant Photo', required: true, status: 'uploaded' },
  { id: 'bank', label: 'Bank Statement', required: true, status: 'missing' },
  { id: 'travel-ticket', label: 'Travel Ticket', required: true, status: 'missing' },
  { id: 'insurance', label: 'Insurance', required: true, status: 'pending' },
  { id: 'itinerary', label: `Itinerary · ${country}`, required: false, status: 'missing' },
]

export const singleExtractedFields: ExtractedField[] = hiroshiFields.map(f => ({
  ...f,
  value: f.key === 'surname' ? 'SHARMA' : f.key === 'given' ? 'PRIYA' : f.value,
}))

function passportFieldsForApplicant(
  surname: string,
  given: string,
  docNo: string,
  dob: string,
  expiry: string,
  nationality: string,
  pob: string,
  sex: 'M' | 'F' = 'M',
): ExtractedField[] {
  return [
    { key: 'surname', label: 'Surname', value: surname, confidence: 99 },
    { key: 'given', label: 'Given names', value: given, confidence: 99 },
    { key: 'sex', label: 'Sex', value: sex, confidence: 100 },
    { key: 'docNo', label: 'Document no.', value: docNo, confidence: 97 },
    { key: 'issueDate', label: 'Date of issue', value: '16 Aug 2022', confidence: 95 },
    { key: 'dob', label: 'Date of birth', value: dob, confidence: 96 },
    { key: 'expiry', label: 'Date of expiry', value: expiry, confidence: 98 },
    { key: 'pob', label: 'Place of birth', value: pob, confidence: 91 },
    { key: 'issuer', label: 'Issuing state', value: nationality, confidence: 100 },
    { key: 'mrz', label: 'Machine-readable line', value: 'Valid', confidence: 100 },
  ]
}

export interface SingleApplicationFlowExtras {
  entityName: string
  location: string
  billingAddress: string
  vesselName: string
  imoNumber: string
  joiningPort: string
  jurisdiction?: string
}

export interface SingleApplicationDemoSeed {
  expiry: string
  nationality: string
  fields: ExtractedField[]
  mrzLine?: string
  basicDetails: ApplicantBasicDetails
  additionalDetails: ApplicantAdditionalDetails
  flowExtras: SingleApplicationFlowExtras
}

const priyaSharmaSeed: SingleApplicationDemoSeed = {
  expiry: '15 Aug 2032',
  nationality: 'IND',
  mrzLine: 'P<IND SHARMA<<PRIYA<<<<<<<<<<<<<<<<<<<<<<',
  fields: passportFieldsForApplicant(
    'SHARMA',
    'PRIYA',
    'Z1234567',
    '22 Jul 1990',
    '15 Aug 2032',
    'IND',
    'MUMBAI',
    'F',
  ),
  basicDetails: {
    crewId: 'GLTS-APL-847-001',
    applicantName: 'Priya Sharma',
    passportNumber: 'Z1234567',
    nationality: 'IND',
    dateOfBirth: '22 Jul 1990',
    cdcNumber: 'IN-CDC-884921',
  },
  additionalDetails: {
    paxContactNo: '+91 98765 43210',
    paxEmailId: 'priya.sharma@oceanicmarine.com',
    fatherName: 'Rajesh Sharma',
    fatherDob: '1958-04-12',
    fatherOccupation: 'Retired',
    fatherNationality: 'IND',
    motherName: 'Sunita Sharma',
    motherDob: '1962-09-03',
    motherOccupation: 'Homemaker',
    motherNationality: 'IND',
    spouseName: '',
    spouseDob: '',
    spousePlaceOfBirth: '',
    spouseOccupation: '',
    spouseNationality: '',
    childName: '',
    childDob: '',
    childPlaceOfBirth: '',
    lastContractSignDate: '2025-11-15',
    employmentOccupation: 'Third Officer',
    educationInstituteName: 'Tolani Maritime Institute',
    previousChinaVisaDetails: '',
    previousChinaVisaCategory: '',
    previousChinaVisaPlaceIssued: '',
    previousChinaVisaIssueDate: '',
    previousChinaVisaNo: '',
    validVisaInPassport: 'None',
    last12MonthsVisitedCountry: 'Singapore, UAE',
  },
  flowExtras: {
    entityName: 'Oceanic Marine Ltd',
    location: 'Mumbai Operations',
    billingAddress: '14 Harbour Road, Ballard Estate, Mumbai 400001, India',
    vesselName: 'MV Oceanic Star',
    imoNumber: '9434567',
    joiningPort: 'Rotterdam',
    jurisdiction: 'Mumbai',
  },
}

const oliverGrantSeed: SingleApplicationDemoSeed = {
  expiry: '03 Jan 2030',
  nationality: 'GBR',
  mrzLine: 'P<GBR GRANT<<OLIVER<<<<<<<<<<<<<<<<<<<<<<',
  fields: passportFieldsForApplicant(
    'GRANT',
    'OLIVER',
    'XK9283746',
    '14 Mar 1988',
    '03 Jan 2030',
    'GBR',
    'SOUTHAMPTON',
    'M',
  ),
  basicDetails: {
    crewId: 'GLTS-APL-790-001',
    applicantName: 'Oliver Grant',
    passportNumber: 'XK9283746',
    nationality: 'GBR',
    dateOfBirth: '14 Mar 1988',
    cdcNumber: 'GB-CDC-772104',
  },
  additionalDetails: {
    paxContactNo: '+44 7700 900482',
    paxEmailId: 'oliver.grant@seafarer-solutions.com',
    fatherName: 'Michael Grant',
    fatherDob: '1955-01-20',
    fatherOccupation: 'Engineer',
    fatherNationality: 'GBR',
    motherName: 'Helen Grant',
    motherDob: '1957-06-08',
    motherOccupation: 'Nurse',
    motherNationality: 'GBR',
    spouseName: 'Emma Grant',
    spouseDob: '1990-11-02',
    spousePlaceOfBirth: 'London',
    spouseOccupation: 'Teacher',
    spouseNationality: 'GBR',
    childName: 'Lucas Grant',
    childDob: '2018-07-19',
    childPlaceOfBirth: 'Southampton',
    lastContractSignDate: '2026-01-08',
    employmentOccupation: 'Chief Engineer',
    educationInstituteName: 'Southampton Solent University',
    previousChinaVisaDetails: '',
    previousChinaVisaCategory: '',
    previousChinaVisaPlaceIssued: '',
    previousChinaVisaIssueDate: '',
    previousChinaVisaNo: '',
    validVisaInPassport: 'Schengen C · valid until Sep 2026',
    last12MonthsVisitedCountry: 'Japan, South Korea',
  },
  flowExtras: {
    entityName: 'Seafarer Solutions',
    location: 'Southampton Crewing Office',
    billingAddress: 'Unit 4, Ocean Gate, Southampton SO14 3TL, United Kingdom',
    vesselName: 'MV Pacific Horizon',
    imoNumber: '9318765',
    joiningPort: 'Yokohama',
    jurisdiction: 'Delhi',
  },
}

const mateoAlvarezSeed: SingleApplicationDemoSeed = {
  expiry: '11 Sep 2031',
  nationality: 'ESP',
  mrzLine: 'P<ESP ALVAREZ<<MATEO<<<<<<<<<<<<<<<<<<<<<',
  fields: passportFieldsForApplicant(
    'ALVAREZ',
    'MATEO',
    'NQ5528931',
    '19 Feb 1992',
    '11 Sep 2031',
    'ESP',
    'VALENCIA',
    'M',
  ),
  basicDetails: {
    crewId: 'GLTS-APL-744-001',
    applicantName: 'Mateo Alvarez',
    passportNumber: 'NQ5528931',
    nationality: 'ESP',
    dateOfBirth: '19 Feb 1992',
    cdcNumber: 'ES-CDC-440912',
  },
  additionalDetails: {
    paxContactNo: '+34 61234 9988',
    paxEmailId: 'mateo.alvarez@bluewavemarine.com',
    fatherName: 'Rafael Alvarez',
    fatherDob: '1961-05-10',
    fatherOccupation: 'Captain',
    fatherNationality: 'ESP',
    motherName: 'Laura Alvarez',
    motherDob: '1964-11-09',
    motherOccupation: 'Teacher',
    motherNationality: 'ESP',
    spouseName: 'Ana Alvarez',
    spouseDob: '1993-03-01',
    spousePlaceOfBirth: 'Madrid',
    spouseOccupation: 'Accountant',
    spouseNationality: 'ESP',
    childName: '',
    childDob: '',
    childPlaceOfBirth: '',
    lastContractSignDate: '2025-10-19',
    employmentOccupation: 'Second Engineer',
    educationInstituteName: 'Escuela Nautica Valencia',
    previousChinaVisaDetails: '',
    previousChinaVisaCategory: '',
    previousChinaVisaPlaceIssued: '',
    previousChinaVisaIssueDate: '',
    previousChinaVisaNo: '',
    validVisaInPassport: 'Schengen C · valid until Nov 2026',
    last12MonthsVisitedCountry: 'Italy, Greece',
  },
  flowExtras: {
    entityName: 'BlueWave Marine Agency',
    location: 'Valencia Crewing Hub',
    billingAddress: 'Pier 8, Port of Valencia, 46024 Valencia, Spain',
    vesselName: 'MV Atlantic Crest',
    imoNumber: '9384112',
    joiningPort: 'Marseille',
    jurisdiction: 'Mumbai',
  },
}

const ashaNairSeed: SingleApplicationDemoSeed = {
  expiry: '17 Apr 2033',
  nationality: 'IND',
  mrzLine: 'P<IND NAIR<<ASHA<<<<<<<<<<<<<<<<<<<<<<<<',
  fields: passportFieldsForApplicant(
    'NAIR',
    'ASHA',
    'IN3387214',
    '08 Dec 1994',
    '17 Apr 2033',
    'IND',
    'KOCHI',
    'F',
  ),
  basicDetails: {
    crewId: 'GLTS-APL-739-001',
    applicantName: 'Asha Nair',
    passportNumber: 'IN3387214',
    nationality: 'IND',
    dateOfBirth: '08 Dec 1994',
    cdcNumber: 'IN-CDC-992107',
  },
  additionalDetails: {
    paxContactNo: '+91 99887 65432',
    paxEmailId: 'asha.nair@neptunecs.com',
    fatherName: 'Mohan Nair',
    fatherDob: '1960-02-21',
    fatherOccupation: 'Port Officer',
    fatherNationality: 'IND',
    motherName: 'Leela Nair',
    motherDob: '1965-08-14',
    motherOccupation: 'Teacher',
    motherNationality: 'IND',
    spouseName: '',
    spouseDob: '',
    spousePlaceOfBirth: '',
    spouseOccupation: '',
    spouseNationality: '',
    childName: '',
    childDob: '',
    childPlaceOfBirth: '',
    lastContractSignDate: '2025-12-12',
    employmentOccupation: 'Deck Cadet',
    educationInstituteName: 'Indian Maritime University',
    previousChinaVisaDetails: '',
    previousChinaVisaCategory: '',
    previousChinaVisaPlaceIssued: '',
    previousChinaVisaIssueDate: '',
    previousChinaVisaNo: '',
    validVisaInPassport: 'Japan C · valid until Jan 2027',
    last12MonthsVisitedCountry: 'UAE, Sri Lanka',
  },
  flowExtras: {
    entityName: 'Neptune Crew Services',
    location: 'Kochi Manning Office',
    billingAddress: '2nd Floor, Marine Tower, MG Road, Kochi 682011, India',
    vesselName: 'MV Eastern Pearl',
    imoNumber: '9457821',
    joiningPort: 'Osaka',
    jurisdiction: 'Delhi',
  },
}

/** Rich demo applicant data for single-application admin/customer flows (View Form, verify, etc.). */
export const SINGLE_APPLICATION_DEMO_SEEDS: Record<string, SingleApplicationDemoSeed> = {
  [GLTS_APPLICATION_IDS.schengen]: priyaSharmaSeed,
  'GLTS-APP-2026-790': oliverGrantSeed,
  'GLTS-APP-2026-744': mateoAlvarezSeed,
  'GLTS-APP-2026-739': ashaNairSeed,
}

export function getSingleApplicationDemoSeed(applicationId: string): SingleApplicationDemoSeed | undefined {
  return SINGLE_APPLICATION_DEMO_SEEDS[applicationId]
}

export function getSingleApplicationFlowExtras(applicationId: string): SingleApplicationFlowExtras | undefined {
  return SINGLE_APPLICATION_DEMO_SEEDS[applicationId]?.flowExtras
}

export function applySingleApplicationDemoSeed(
  row: SingleApplicationRow,
  queueRow: UploadQueueRow,
): UploadQueueRow {
  const seed = getSingleApplicationDemoSeed(row.id)
  if (!seed) return queueRow

  return {
    ...queueRow,
    travelerName: seed.basicDetails.applicantName,
    passportNo: seed.basicDetails.passportNumber,
    expiry: seed.expiry,
    nationality: seed.nationality,
    fields: seed.fields,
    mrzLine: seed.mrzLine,
    basicDetails: seed.basicDetails,
    additionalDetails: seed.additionalDetails,
  }
}

export const VISA_TYPE_OPTIONS = [
  { id: 'tourist', label: 'Tourist', sub: 'Leisure travel' },
  { id: 'business', label: 'Business', sub: 'Meetings & conferences' },
  { id: 'crew', label: 'Crew / Marine', sub: 'Seafarer manifests' },
  { id: 'transit', label: 'Transit', sub: 'Short stay connection' },
]

import type { CustomerApplication } from '@/pages/customer/data/mockData'
import type { ApplicantDocumentItem, UploadQueueRow } from '../data/applicationFlowData'
import type { ApplicationOperationalStatus } from './applicationListing.types'

export type SubmitTimelineStatus = 'completed' | 'active' | 'pending'

export interface ApplicationDetailDocumentRow {
  name: string
  tone: 'success' | 'warning' | 'neutral'
}

export interface ApplicationDetailViewModel {
  resolvedId?: string
  application: CustomerApplication | null
  isBulkBatch: boolean
  operationalStatus?: ApplicationOperationalStatus | string
  uploadQueueRows: UploadQueueRow[]
  documents: ApplicationDetailDocumentRow[]
  globalDocumentUploads: Record<string, { fileName: string; uploadedAt: string }>
  corrections: Array<{ id: string; field: string; reason: string; status: string }>
  timeline: Array<{ id: string; title: string; status: 'completed' | 'in_progress' | 'pending' }>
  selectedQueueHintId: string | null
  source: 'single' | 'bulk' | 'legacy' | 'missing'
}

export interface FlowDraftLikeState {
  gltsApplicationId: string
  gltsBatchId: string
  countryId?: string
  visaOfferingId?: string
  countryName: string
  countryFlag: string
  visaTypeLabel: string
  purposeLabel: string
  travelDate: string
  entityId?: string
  entityName?: string
  contactPerson?: string
  location?: string
  vesselId?: string
  vesselName?: string
  imoNumber?: string
  vesselType?: string
  flagCountry?: string
  portOfRegistry?: string
  referencePo?: string
  billingAddress?: string
  globalDocumentUploads: Record<string, { fileName: string; uploadedAt: string }>
  uploadQueueRows: UploadQueueRow[]
}

export interface RowDocumentProgress {
  documents: ApplicantDocumentItem[]
  documentsComplete: number
  documentsTotal: number
}

import {
  mockBulkBatches,
  mockSingleApplications,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationFlowState } from '@/pages/customer/features/applications/hooks/useApplicationFlowState'
import { statusToneFromOperational } from '@/pages/customer/features/applications/components/listing/applicationStatus'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { getSessionCreatorMeta } from '@/pages/customer/features/applications/utils/applicationAccessUtils'
import { deriveApplicationSubmitKind } from '@/pages/customer/features/applications/utils/applicationSubmitKind'
import {
  createGltsBatchId,
  ensureFlowGltsApplicationId,
} from '@/pages/customer/features/applications/utils/gltsReferenceIds'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import { loadSession } from '@/shared/auth/session'

export type MarineApplicationRow = SingleApplicationRow | BulkBatchRow

export function isCustomerSubmitted(row: MarineApplicationRow): boolean {
  return row.operationalStatus !== 'Draft' && Boolean(row.submissionDate?.trim())
}

function isMarineSegment(row: MarineApplicationRow): boolean {
  return row.customerSegment === 'marine'
}

function filterMarineSubmitted(rows: MarineApplicationRow[]): MarineApplicationRow[] {
  return rows.filter(row => isCustomerSubmitted(row) && isMarineSegment(row))
}

function flowPlaceholder(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (!trimmed || trimmed === '—') return fallback
  return trimmed
}

function buildSubmittedSingleRow(
  state: ApplicationFlowState,
  applicationId: string,
  now: string,
  creator: ReturnType<typeof getSessionCreatorMeta>,
): SingleApplicationRow {
  const readyRows = state.uploadQueueRows.filter(r => r.status !== 'processing')
  const primary = readyRows[0]
  const applicantName = primary
    ? flowPlaceholder(primary.travelerName, flowPlaceholder(state.applicantName, 'Pending applicant'))
    : flowPlaceholder(state.applicantName, 'Pending applicant')
  const passportNumber = primary
    ? flowPlaceholder(primary.passportNo, flowPlaceholder(state.passportNumber, '—'))
    : flowPlaceholder(state.passportNumber, '—')

  const operationalStatus = 'Submitted'
  return {
    id: applicationId,
    recordType: 'single',
    applicantName,
    passportNumber,
    ...(state.entityName?.trim()
      ? { companyName: flowPlaceholder(state.entityName, '—') }
      : {}),
    country: flowPlaceholder(state.countryName, 'Pending'),
    countryFlag: state.countryFlag || undefined,
    visaType: flowPlaceholder(state.visaTypeLabel, 'Pending'),
    travelDate: flowPlaceholder(state.travelDate, '—'),
    submissionDate: now,
    createdAt: now,
    lastUpdated: now,
    processingStage: 'Intake',
    operationalStatus,
    status: operationalStatus,
    statusTone: statusToneFromOperational(operationalStatus),
    createdByEmail: creator.createdByEmail,
    createdByRole: creator.createdByRole,
    customerSegment: 'marine',
    poReference: state.referencePo || undefined,
  }
}

function buildSubmittedBulkRow(
  state: ApplicationFlowState,
  batchId: string,
  now: string,
  creator: ReturnType<typeof getSessionCreatorMeta>,
): BulkBatchRow {
  const readyRows = state.uploadQueueRows.filter(r => r.status !== 'processing')
  const travelerCount = Math.max(readyRows.length, 1)
  const operationalStatus = 'Submitted'
  const tone = statusToneFromOperational(operationalStatus)

  return {
    id: batchId,
    recordType: 'bulk',
    companyName: flowPlaceholder(state.entityName, 'Pending'),
    country: flowPlaceholder(state.countryName, 'Pending'),
    countryFlag: state.countryFlag || undefined,
    visaType: flowPlaceholder(state.visaTypeLabel, 'Pending'),
    totalApplicants: travelerCount,
    verifiedApplicants: 0,
    pendingCorrections: 0,
    processed: readyRows.length,
    errors: 0,
    travelDate: flowPlaceholder(state.travelDate, '—'),
    submissionDate: now,
    createdAt: now,
    lastUpdated: now,
    processingStage: 'Intake',
    operationalStatus,
    status: operationalStatus,
    statusTone: tone === 'draft' ? 'processing' : tone,
    createdByEmail: creator.createdByEmail,
    createdByRole: creator.createdByRole,
    customerSegment: 'marine',
    poReference: state.referencePo || undefined,
  }
}

export const marineApplicationAdminService = {
  listSubmittedMarineApplications(): { singles: SingleApplicationRow[]; bulks: BulkBatchRow[] } {
    const singles = filterMarineSubmitted(mockSingleApplications) as SingleApplicationRow[]
    const bulks = filterMarineSubmitted(mockBulkBatches) as BulkBatchRow[]
    return { singles, bulks }
  },

  listAllSubmittedBySegment(segment: ApplicationCustomerSegment): {
    singles: SingleApplicationRow[]
    bulks: BulkBatchRow[]
  } {
    const singles = mockSingleApplications.filter(
      row => isCustomerSubmitted(row) && row.customerSegment === segment,
    )
    const bulks = mockBulkBatches.filter(
      row => isCustomerSubmitted(row) && row.customerSegment === segment,
    )
    return { singles, bulks }
  },

  getDetail(applicationId?: string): ApplicationDetailViewModel {
    return customerPortalService.getApplicationDetail(applicationId, { ignoreAccessControl: true })
  },

  createAndSubmitFromFlow(state: ApplicationFlowState): { id: string; kind: 'single' | 'bulk' } {
    const now = new Date().toISOString().slice(0, 10)
    const creator = getSessionCreatorMeta(loadSession())
    const kind = deriveApplicationSubmitKind(state.uploadQueueRows)
    const applicationId = ensureFlowGltsApplicationId(state)

    if (kind === 'bulk') {
      const batchId = state.gltsBatchId || createGltsBatchId()
      const existingIndex = mockBulkBatches.findIndex(r => r.id === batchId)
      const row = buildSubmittedBulkRow(state, batchId, now, creator)
      if (existingIndex >= 0) {
        mockBulkBatches[existingIndex] = row
      } else {
        mockBulkBatches.unshift(row)
      }
      return { id: batchId, kind: 'bulk' }
    }

    const existingIndex = mockSingleApplications.findIndex(r => r.id === applicationId)
    const row = buildSubmittedSingleRow(state, applicationId, now, creator)
    if (existingIndex >= 0) {
      mockSingleApplications[existingIndex] = row
    } else {
      mockSingleApplications.unshift(row)
    }
    return { id: applicationId, kind: 'single' }
  },
}

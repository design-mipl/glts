import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'

const FORM_ASSIST_STORAGE_KEY = 'glts:application-form-assist'

export type FormAssistPaymentMode = 'card' | 'cash' | 'bank_transfer' | 'upi'
export type FormAssistReceiptStatus = 'awaited' | 'received' | 'not_applicable'

export interface FormAssistVfsServiceChargeLine {
  id: string
  serviceName: string
  amount: number
  /** When true, the rate is GST-inclusive. */
  gstIncluded?: boolean
  /** Links to Embassy / VFS Fee Master service row when sourced from rate card. */
  embassyFeeServiceId?: string
}

export interface FormAssistSubmissionDraft {
  submissionDate: string
  submissionReferenceNumber: string
  submittedBy: string
  vfsSubmissionDate: string
  tentativeCollectionDate: string
  confirmationPdfFileName: string
  invoicePdfFileName: string
  paymentDate: string
  paymentMode: FormAssistPaymentMode
  cardName: string
  paymentReferenceNumber: string
  amountPaid: string
  receiptStatus: FormAssistReceiptStatus
  paymentRemarks: string
  vfsServiceCharges: FormAssistVfsServiceChargeLine[]
}

export interface FormAssistRecord {
  applicationId: string
  travelerRowId: string
  completedStepIds: string[]
  activeStepIndex: number
  draftSavedAt?: string
  submittedAt?: string
  externalPortalSubmitted: boolean
  submission: FormAssistSubmissionDraft
}

export const EMPTY_FORM_ASSIST_SUBMISSION: FormAssistSubmissionDraft = {
  submissionDate: '',
  submissionReferenceNumber: '',
  submittedBy: '',
  vfsSubmissionDate: '',
  tentativeCollectionDate: '',
  confirmationPdfFileName: '',
  invoicePdfFileName: '',
  paymentDate: '',
  paymentMode: 'card',
  cardName: '',
  paymentReferenceNumber: '',
  amountPaid: '',
  receiptStatus: 'awaited',
  paymentRemarks: '',
  vfsServiceCharges: [],
}

type FormAssistStore = Record<string, FormAssistRecord>

function recordKey(applicationId: string, travelerRowId: string): string {
  return `${applicationId}::${travelerRowId}`
}

function readStore(): FormAssistStore {
  try {
    const raw = localStorage.getItem(FORM_ASSIST_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as FormAssistStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: FormAssistStore) {
  try {
    localStorage.setItem(FORM_ASSIST_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore
  }
}

function isPaymentMode(value: string | undefined): value is FormAssistPaymentMode {
  return value === 'card' || value === 'cash' || value === 'bank_transfer' || value === 'upi'
}

function isReceiptStatus(value: string | undefined): value is FormAssistReceiptStatus {
  return value === 'awaited' || value === 'received' || value === 'not_applicable'
}

function normalizeVfsServiceCharges(
  lines: FormAssistVfsServiceChargeLine[] | undefined,
): FormAssistVfsServiceChargeLine[] {
  if (!Array.isArray(lines)) return []
  return lines.map((line, index) => ({
    id: line.id?.trim() || `vfs-charge-${index}`,
    serviceName: line.serviceName?.trim() ?? '',
    amount: Number(line.amount) || 0,
    gstIncluded: Boolean(line.gstIncluded),
    embassyFeeServiceId: line.embassyFeeServiceId?.trim() || undefined,
  }))
}

function normalizeSubmission(
  submission: Partial<FormAssistSubmissionDraft> & Record<string, string | undefined>,
): FormAssistSubmissionDraft {
  const legacy = submission as Record<string, string | undefined>
  return {
    ...EMPTY_FORM_ASSIST_SUBMISSION,
    submissionDate: submission.submissionDate ?? legacy.appointmentDate ?? '',
    submissionReferenceNumber:
      submission.submissionReferenceNumber ?? legacy.appointmentReference ?? '',
    submittedBy: submission.submittedBy ?? '',
    vfsSubmissionDate: submission.vfsSubmissionDate ?? '',
    tentativeCollectionDate: submission.tentativeCollectionDate ?? '',
    confirmationPdfFileName: submission.confirmationPdfFileName ?? legacy.confirmationPdfFileName ?? '',
    invoicePdfFileName: submission.invoicePdfFileName ?? legacy.invoicePdfFileName ?? '',
    paymentDate: submission.paymentDate ?? '',
    paymentMode: isPaymentMode(submission.paymentMode) ? submission.paymentMode : 'card',
    cardName: submission.cardName ?? '',
    paymentReferenceNumber:
      submission.paymentReferenceNumber ?? legacy.externalPortalReference ?? '',
    amountPaid: submission.amountPaid ?? '',
    receiptStatus: isReceiptStatus(submission.receiptStatus) ? submission.receiptStatus : 'awaited',
    paymentRemarks: submission.paymentRemarks ?? legacy.remarks ?? '',
    vfsServiceCharges: normalizeVfsServiceCharges(submission.vfsServiceCharges),
  }
}

function getRecord(applicationId: string, travelerRowId: string): FormAssistRecord {
  const store = readStore()
  const stored = store[recordKey(applicationId, travelerRowId)]
  if (!stored) {
    return {
      applicationId,
      travelerRowId,
      completedStepIds: [],
      activeStepIndex: 0,
      externalPortalSubmitted: false,
      submission: { ...EMPTY_FORM_ASSIST_SUBMISSION },
    }
  }
  return {
    ...stored,
    submission: normalizeSubmission(stored.submission as FormAssistSubmissionDraft & Record<string, string>),
  }
}

function saveRecord(record: FormAssistRecord) {
  const store = readStore()
  store[recordKey(record.applicationId, record.travelerRowId)] = record
  writeStore(store)
}

function syncListingAfterExternalSubmit(applicationId: string) {
  const patch = {
    operationalStatus: 'Submitted' as ApplicationOperationalStatus,
    processingStage: 'Embassy submission',
    status: 'Submitted',
    lastUpdated: new Date().toISOString().slice(0, 10),
  }
  const single = mockSingleApplications.find(r => r.id === applicationId)
  if (single) {
    Object.assign(single, patch)
    return
  }
  const bulk = mockBulkBatches.find(r => r.id === applicationId)
  if (bulk) {
    Object.assign(bulk, patch)
  }
}

export function isFormAssistExternallySubmitted(
  applicationId: string,
  travelerRowId?: string,
): boolean {
  const store = readStore()
  if (travelerRowId) {
    return Boolean(store[recordKey(applicationId, travelerRowId)]?.externalPortalSubmitted)
  }
  return Object.values(store).some(
    r => r.applicationId === applicationId && r.externalPortalSubmitted,
  )
}

export const applicationFormAssistService = {
  getRecord(applicationId: string, travelerRowId: string): FormAssistRecord {
    return getRecord(applicationId, travelerRowId)
  },

  saveDraft(
    applicationId: string,
    travelerRowId: string,
    patch: Partial<FormAssistRecord>,
  ): FormAssistRecord {
    const current = getRecord(applicationId, travelerRowId)
    const next: FormAssistRecord = {
      ...current,
      ...patch,
      submission: { ...current.submission, ...patch.submission },
      draftSavedAt: new Date().toISOString(),
    }
    saveRecord(next)
    return next
  },

  completeStep(applicationId: string, travelerRowId: string, stepId: string, nextStepIndex: number) {
    const current = getRecord(applicationId, travelerRowId)
    const completedStepIds = current.completedStepIds.includes(stepId)
      ? current.completedStepIds
      : [...current.completedStepIds, stepId]
    const next: FormAssistRecord = {
      ...current,
      completedStepIds,
      activeStepIndex: nextStepIndex,
    }
    saveRecord(next)
    return next
  },

  setActiveStep(applicationId: string, travelerRowId: string, activeStepIndex: number) {
    const current = getRecord(applicationId, travelerRowId)
    const next = { ...current, activeStepIndex }
    saveRecord(next)
    return next
  },

  updateSubmission(
    applicationId: string,
    travelerRowId: string,
    submission: Partial<FormAssistSubmissionDraft>,
  ) {
    const current = getRecord(applicationId, travelerRowId)
    const next: FormAssistRecord = {
      ...current,
      submission: { ...current.submission, ...submission },
    }
    saveRecord(next)
    return next
  },

  validateSubmission(submission: FormAssistSubmissionDraft): string[] {
    const errors: string[] = []
    if (!submission.submissionDate.trim()) errors.push('Online submission date is required')
    if (!submission.submissionReferenceNumber.trim()) {
      errors.push('Online submission reference no. is required')
    }
    if (!submission.submittedBy.trim()) errors.push('Online submitted by is required')
    if (!submission.tentativeCollectionDate.trim()) {
      errors.push('Tentative collection date is required')
    }
    if (!submission.confirmationPdfFileName.trim()) errors.push('Confirmation PDF is required')
    if (!submission.invoicePdfFileName.trim()) errors.push('Invoice PDF is required')
    if (!submission.paymentDate.trim()) errors.push('Payment date is required')
    if (!submission.paymentReferenceNumber.trim()) {
      errors.push('Payment Reference / CC Avenue Ref. No. is required')
    }
    if (!submission.amountPaid.trim()) errors.push('Amount paid is required')
    if (submission.paymentMode === 'card' && !submission.cardName.trim()) {
      errors.push('Card name is required for card payments')
    }
    return errors
  },

  markAsSubmitted(applicationId: string, travelerRowId: string) {
    const current = getRecord(applicationId, travelerRowId)
    const errors = this.validateSubmission(current.submission)
    if (errors.length > 0) {
      return { ok: false as const, errors, record: current }
    }
    const next: FormAssistRecord = {
      ...current,
      externalPortalSubmitted: true,
      submittedAt: new Date().toISOString(),
      completedStepIds: [...new Set([...current.completedStepIds, 'review', 'submission'])],
    }
    saveRecord(next)
    syncListingAfterExternalSubmit(applicationId)
    return { ok: true as const, errors: [], record: next }
  },
}

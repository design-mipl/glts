import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'

const FORM_ASSIST_STORAGE_KEY = 'glts:application-form-assist'

export interface FormAssistSubmissionDraft {
  appointmentDate: string
  appointmentReference: string
  externalPortalReference: string
  remarks: string
  appointmentPdfFileName: string
  submissionConfirmationPdfFileName: string
  confirmationEmailFileName: string
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
  appointmentDate: '',
  appointmentReference: '',
  externalPortalReference: '',
  remarks: '',
  appointmentPdfFileName: '',
  submissionConfirmationPdfFileName: '',
  confirmationEmailFileName: '',
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

function getRecord(applicationId: string, travelerRowId: string): FormAssistRecord {
  const store = readStore()
  return (
    store[recordKey(applicationId, travelerRowId)] ?? {
      applicationId,
      travelerRowId,
      completedStepIds: [],
      activeStepIndex: 0,
      externalPortalSubmitted: false,
      submission: { ...EMPTY_FORM_ASSIST_SUBMISSION },
    }
  )
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
    if (!submission.appointmentDate.trim()) errors.push('Appointment date is required')
    if (!submission.appointmentReference.trim()) errors.push('Appointment reference is required')
    if (!submission.externalPortalReference.trim()) errors.push('External portal reference no. is required')
    if (!submission.appointmentPdfFileName.trim()) errors.push('Appointment PDF is required')
    if (!submission.submissionConfirmationPdfFileName.trim()) {
      errors.push('Submission confirmation PDF is required')
    }
    if (!submission.confirmationEmailFileName.trim()) {
      errors.push('Confirmation email PDF/screenshot is required')
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
      completedStepIds: [...new Set([...current.completedStepIds, 'review'])],
    }
    saveRecord(next)
    syncListingAfterExternalSubmit(applicationId)
    return { ok: true as const, errors: [], record: next }
  },
}

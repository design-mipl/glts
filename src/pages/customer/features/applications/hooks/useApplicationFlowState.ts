import { useCallback, useState } from 'react'
import type { UploadQueueRow } from '../data/applicationFlowData'
import { singleExtractedFields } from '../data/applicationFlowData'

export const APPLICATION_FLOW_STORAGE_KEY = 'glts:application-flow'

export interface GlobalDocumentUploadMeta {
  fileName: string
  uploadedAt: string
}

export interface ApplicationFlowState {
  countryId: string
  countryName: string
  countryFlag: string
  /** Selected row from Country master visa offerings. */
  visaOfferingId: string
  visaType: string
  visaTypeLabel: string
  purpose: string
  purposeLabel: string
  travelDate: string
  billingAddress: string
  expectedReturnDate: string
  processingType: 'normal' | 'express'
  uploadSource: 'folder' | 'zip'
  passportUploaded: boolean
  ocrConfirmed: boolean
  entryType: string
  duration: string
  vesselName: string
  rank: string
  joiningPort: string
  applicantName: string
  passportNumber: string
  nationality: string
  dateOfBirth: string
  gender: string
  passportExpiry: string
  passportIssueDate: string
  /** Assigned when the create flow starts (country step onward). */
  gltsApplicationId: string
  /** Present when this submission has 2+ travelers (bulk). */
  gltsBatchId: string
  globalDocumentUploads: Record<string, GlobalDocumentUploadMeta>
  uploadQueueRows: UploadQueueRow[]
}

const defaultState: ApplicationFlowState = {
  countryId: '',
  countryName: '',
  countryFlag: '',
  visaOfferingId: '',
  visaType: '',
  visaTypeLabel: '',
  purpose: '',
  purposeLabel: '',
  travelDate: '',
  billingAddress: '',
  expectedReturnDate: '',
  processingType: 'normal',
  uploadSource: 'folder',
  passportUploaded: false,
  ocrConfirmed: false,
  entryType: '',
  duration: '30 days',
  vesselName: '',
  rank: '',
  joiningPort: '',
  applicantName: '',
  passportNumber: '',
  nationality: '',
  dateOfBirth: '',
  gender: '',
  passportExpiry: '',
  passportIssueDate: '',
  gltsApplicationId: '',
  gltsBatchId: '',
  globalDocumentUploads: {},
  uploadQueueRows: [],
}

function seedApplicantFromExtracted(): Partial<ApplicationFlowState> {
  const surname = singleExtractedFields.find(f => f.key === 'surname')?.value ?? ''
  const given = singleExtractedFields.find(f => f.key === 'given')?.value ?? ''
  return {
    applicantName: `${given} ${surname}`.trim(),
    passportNumber: singleExtractedFields.find(f => f.key === 'docNo')?.value ?? '',
    nationality: singleExtractedFields.find(f => f.key === 'issuer')?.value ?? '',
    dateOfBirth: singleExtractedFields.find(f => f.key === 'dob')?.value ?? '',
    gender: singleExtractedFields.find(f => f.key === 'sex')?.value ?? '',
    passportExpiry: singleExtractedFields.find(f => f.key === 'expiry')?.value ?? '',
    passportIssueDate: singleExtractedFields.find(f => f.key === 'issueDate')?.value ?? '',
  }
}

function loadStored(): ApplicationFlowState {
  try {
    const raw = sessionStorage.getItem(APPLICATION_FLOW_STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as Partial<ApplicationFlowState> & { mode?: string }
    const { mode: _removed, ...rest } = parsed
    return {
      ...defaultState,
      ...rest,
      gltsApplicationId: typeof parsed.gltsApplicationId === 'string' ? parsed.gltsApplicationId : '',
      gltsBatchId: typeof parsed.gltsBatchId === 'string' ? parsed.gltsBatchId : '',
      globalDocumentUploads:
        parsed.globalDocumentUploads && typeof parsed.globalDocumentUploads === 'object'
          ? (parsed.globalDocumentUploads as Record<string, GlobalDocumentUploadMeta>)
          : {},
      uploadQueueRows: Array.isArray(parsed.uploadQueueRows) ? parsed.uploadQueueRows : [],
    }
  } catch {
    return defaultState
  }
}

export function useApplicationFlowState(options?: { startFresh?: boolean }) {
  const [state, setState] = useState<ApplicationFlowState>(() => {
    if (options?.startFresh) {
      sessionStorage.removeItem(APPLICATION_FLOW_STORAGE_KEY)
      return defaultState
    }
    return loadStored()
  })

  const persist = useCallback((next: ApplicationFlowState) => {
    setState(next)
    sessionStorage.setItem(APPLICATION_FLOW_STORAGE_KEY, JSON.stringify(next))
  }, [])

  const reset = useCallback(() => {
    setState(defaultState)
    sessionStorage.removeItem(APPLICATION_FLOW_STORAGE_KEY)
  }, [])

  const update = useCallback((patch: Partial<ApplicationFlowState>) => {
    setState(prev => {
      const next = { ...prev, ...patch }
      sessionStorage.setItem(APPLICATION_FLOW_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const applyOcrDefaults = useCallback(() => {
    setState(prev => {
      const next = { ...prev, ...seedApplicantFromExtracted(), ocrConfirmed: true }
      sessionStorage.setItem(APPLICATION_FLOW_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { state, update, reset, applyOcrDefaults }
}


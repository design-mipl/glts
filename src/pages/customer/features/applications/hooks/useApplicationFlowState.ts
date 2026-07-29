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
  referencePo: string
  billingAddress: string
  expectedReturnDate: string
  /** Selected passport issuing state — maps to visa jurisdiction via applicable states. */
  issuedPassportState: string
  /** Current place of residence — takes priority over passport state for jurisdiction mapping. */
  placeOfResidence: string
  /** @deprecated Use issuedPassportState — kept for stored session compatibility. */
  issuedPassportLocationId: string
  /** Resolved country master jurisdiction id for document requirements. */
  jurisdictionId: string
  /** Jurisdiction display name (e.g. Delhi). */
  jurisdiction: string
  processingType: 'normal' | 'express'
  uploadSource: 'folder' | 'zip'
  passportUploaded: boolean
  ocrConfirmed: boolean
  entryType: string
  duration: string
  vesselName: string
  rank: string
  joiningPort: string
  /** Admin create flow: selected corporate account (company / customer). */
  corporateAccountId: string
  /** Admin create flow: company name from corporate account. */
  companyName: string
  entityId: string
  entityName: string
  contactPerson: string
  location: string
  vesselId: string
  imoNumber: string
  vesselType: string
  flagCountry: string
  portOfRegistry: string
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
  referencePo: '',
  billingAddress: '',
  expectedReturnDate: '',
  issuedPassportState: '',
  placeOfResidence: '',
  issuedPassportLocationId: '',
  jurisdictionId: '',
  jurisdiction: '',
  processingType: 'normal',
  uploadSource: 'folder',
  passportUploaded: false,
  ocrConfirmed: false,
  entryType: '',
  duration: '30 days',
  vesselName: '',
  rank: '',
  joiningPort: '',
  corporateAccountId: '',
  companyName: '',
  entityId: '',
  entityName: '',
  contactPerson: '',
  location: '',
  vesselId: '',
  imoNumber: '',
  vesselType: '',
  flagCountry: '',
  portOfRegistry: '',
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

function loadStored(storageKey: string): ApplicationFlowState {
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as Partial<ApplicationFlowState> & { mode?: string }
    const { mode: _removed, ...rest } = parsed
    const issuedPassportState =
      typeof parsed.issuedPassportState === 'string'
        ? parsed.issuedPassportState
        : typeof parsed.issuedPassportLocationId === 'string'
          ? parsed.issuedPassportLocationId
          : ''

    return {
      ...defaultState,
      ...rest,
      issuedPassportState,
      placeOfResidence: typeof parsed.placeOfResidence === 'string' ? parsed.placeOfResidence : '',
      jurisdictionId: typeof parsed.jurisdictionId === 'string' ? parsed.jurisdictionId : '',
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

export function useApplicationFlowState(options?: {
  startFresh?: boolean
  storageKey?: string
}) {
  const storageKey = options?.storageKey ?? APPLICATION_FLOW_STORAGE_KEY

  const [state, setState] = useState<ApplicationFlowState>(() => {
    if (options?.startFresh) {
      sessionStorage.removeItem(storageKey)
      return defaultState
    }
    return loadStored(storageKey)
  })

  const reset = useCallback(() => {
    setState(defaultState)
    sessionStorage.removeItem(storageKey)
  }, [storageKey])

  const update = useCallback(
    (patch: Partial<ApplicationFlowState>) => {
      setState(prev => {
        const next = { ...prev, ...patch }
        sessionStorage.setItem(storageKey, JSON.stringify(next))
        return next
      })
    },
    [storageKey],
  )

  const applyOcrDefaults = useCallback(() => {
    setState(prev => {
      const next = { ...prev, ...seedApplicantFromExtracted(), ocrConfirmed: true }
      sessionStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }, [storageKey])

  return { state, update, reset, applyOcrDefaults }
}


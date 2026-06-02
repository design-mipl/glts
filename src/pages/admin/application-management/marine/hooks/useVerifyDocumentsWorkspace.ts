import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isFormAssistExternallySubmitted } from '@/shared/services/applicationFormAssistService'
import type { ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  applicationVerificationService,
  buildGlobalDocumentsForVerification,
} from '@/shared/services/applicationVerificationService'
import {
  buildOverviewFromDetail,
  buildVerifyTimeline,
} from '../utils/verifyDocumentsUtils'

export function useVerifyDocumentsWorkspace(applicationId: string | undefined) {
  const [searchParams] = useSearchParams()
  const applicantParam = searchParams.get('applicant')

  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null)
  const [workspace, setWorkspace] = useState(() =>
    applicationId ? applicationVerificationService.getWorkspace(applicationId) : { ok: false as const },
  )

  const reload = useCallback(() => {
    if (!applicationId) return
    setWorkspace(applicationVerificationService.getWorkspace(applicationId))
  }, [applicationId])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    setSelectedTravelerId(null)
    if (!applicationId) {
      setWorkspace({ ok: false as const })
      return
    }
    setWorkspace(applicationVerificationService.getWorkspace(applicationId))
  }, [applicationId])

  const detail = workspace.ok ? workspace.detail : undefined
  const listingRow = workspace.ok ? workspace.listingRow : undefined
  const rows = detail?.uploadQueueRows ?? []
  const isBulk = detail?.isBulkBatch ?? false
  const isSubmitted = Boolean(listingRow && listingRow.submissionDate?.trim())

  const overview = useMemo(
    () =>
      applicationId
        ? buildOverviewFromDetail(applicationId, isBulk, rows, detail?.application)
        : {
            countryName: '—',
            countryFlag: '',
            visaTypeLabel: '—',
            travelDate: '—',
            travelerCount: 0,
          },
    [applicationId, isBulk, rows, detail?.application],
  )

  const selectableRows = useMemo(() => {
    const ready = rows.filter(r => r.status !== 'processing')
    if (ready.length > 0) return ready
    return rows
  }, [rows])

  const selectedRow = useMemo(() => {
    if (selectableRows.length === 0) return null

    if (applicantParam) {
      const match = selectableRows.find(
        r => r.gltsApplicantId === applicantParam || r.id === applicantParam,
      )
      if (match) return match
    }

    if (selectedTravelerId) {
      const match = selectableRows.find(r => r.id === selectedTravelerId)
      if (match) return match
    }

    return selectableRows[0]
  }, [selectableRows, applicantParam, selectedTravelerId])

  useEffect(() => {
    if (!selectedRow) return
    if (selectedTravelerId !== selectedRow.id) {
      setSelectedTravelerId(selectedRow.id)
    }
  }, [selectedRow, selectedTravelerId])

  const timelineSteps = useMemo(
    () =>
      buildVerifyTimeline(
        selectedRow,
        isSubmitted,
        applicationId ? isFormAssistExternallySubmitted(applicationId, selectedRow?.id) : false,
      ),
    [selectedRow, isSubmitted, applicationId],
  )

  const globalDocuments = useMemo(
    () =>
      applicationId
        ? buildGlobalDocumentsForVerification(applicationId, detail?.globalDocumentUploads ?? {})
        : [],
    [applicationId, detail?.globalDocumentUploads, workspace],
  )

  const updateTravelerDoc = useCallback(
    (documentId: string, status: ApplicantDocumentStatus, comment?: string) => {
      if (!applicationId || !selectedRow) return
      setWorkspace(
        applicationVerificationService.updateTravelerDocumentStatus(
          applicationId,
          selectedRow.id,
          documentId,
          status,
          comment,
        ),
      )
    },
    [applicationId, selectedRow],
  )

  const updateGlobalDoc = useCallback(
    (documentId: string, status: ApplicantDocumentStatus, comment?: string) => {
      if (!applicationId) return
      setWorkspace(
        applicationVerificationService.updateGlobalDocumentStatus(
          applicationId,
          documentId,
          status,
          comment,
        ),
      )
    },
    [applicationId],
  )

  const saveDraft = useCallback(() => {
    if (!applicationId) return
    setWorkspace(applicationVerificationService.saveDraft(applicationId))
  }, [applicationId])

  const submitVerification = useCallback(() => {
    if (!applicationId) return
    setWorkspace(applicationVerificationService.submitVerification(applicationId))
  }, [applicationId])

  return {
    loading: false,
    notFound: !workspace.ok,
    listingRow,
    detail,
    overview,
    rows,
    isBulk,
    isSubmitted,
    selectedTravelerId,
    setSelectedTravelerId,
    selectedRow,
    timelineSteps,
    globalDocuments,
    updateTravelerDoc,
    updateGlobalDoc,
    saveDraft,
    submitVerification,
    reload,
  }
}

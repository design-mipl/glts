import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isFormAssistExternallySubmitted } from '@/shared/services/applicationFormAssistService'
import { applicationProcessingStatusService } from '@/shared/services/applicationProcessingStatusService'
import type { ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  applicationVerificationService,
  buildGlobalDocumentsForVerification,
} from '@/shared/services/applicationVerificationService'
import type {
  DocumentHandlingMode,
  InsuranceWorkflow,
  TravelTicketWorkflow,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'
import { isApplicantDocumentSatisfied } from '@/shared/utils/applicantDocumentWorkflowUtils'
import {
  buildOverviewFromDetail,
  buildVerifyTimeline,
} from '../utils/verifyDocumentsUtils'
import {
  resolveApplicationCompanyName,
  resolveApplicationVesselName,
} from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import { getSingleApplicationFlowExtras } from '@/pages/customer/features/applications/data/applicationFlowData'

export function useVerifyDocumentsWorkspace(applicationId: string | undefined) {
  const [searchParams] = useSearchParams()
  const applicantParam = searchParams.get('applicant')

  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null)
  const [processingStatusTick, setProcessingStatusTick] = useState(0)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
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
        ? buildOverviewFromDetail(applicationId, isBulk, rows, {
            country: detail?.application?.country ?? listingRow?.country,
            countryFlag: detail?.application?.countryFlag ?? listingRow?.countryFlag,
            visaType: detail?.application?.visaType ?? listingRow?.visaType,
            travelDate: detail?.application?.travelDate ?? listingRow?.travelDate,
            jurisdiction: detail?.application?.jurisdiction ?? listingRow?.jurisdiction,
            companyName: listingRow ? resolveApplicationCompanyName(listingRow) : undefined,
            vesselName: listingRow ? resolveApplicationVesselName(listingRow) : undefined,
            poReference: listingRow?.poReference,
            entityName: applicationId
              ? getSingleApplicationFlowExtras(applicationId)?.entityName
              : undefined,
          })
        : {
            countryName: '—',
            countryFlag: '',
            visaTypeLabel: '—',
            travelDate: '—',
            travelerCount: 0,
          },
    [applicationId, isBulk, rows, detail?.application, listingRow],
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

  const processingStatusContext = useMemo(() => {
    if (!applicationId || !selectedRow) return undefined
    const required = selectedRow.documents.filter((doc) => doc.required)
    const docsDone =
      required.length === 0 || required.every((doc) => isApplicantDocumentSatisfied(doc))
    const allVerified = required.length > 0 && required.every((doc) => doc.status === 'verified')
    const countryName = detail?.application?.country ?? listingRow?.country
    const visaTypeLabel = detail?.application?.visaType ?? listingRow?.visaType
    return applicationProcessingStatusService.ensureState({
      applicationId,
      travelerRowId: selectedRow.id,
      docsDone,
      allVerified,
      countryName,
      visaTypeLabel,
    })
  }, [applicationId, selectedRow, detail, listingRow, processingStatusTick])

  const timelineSteps = useMemo(
    () =>
      buildVerifyTimeline(
        selectedRow,
        isSubmitted,
        applicationId ? isFormAssistExternallySubmitted(applicationId, selectedRow?.id) : false,
        {
          countryName: detail?.application?.country ?? listingRow?.country,
          visaTypeLabel: detail?.application?.visaType ?? listingRow?.visaType,
          operationalStatus: listingRow?.operationalStatus ?? detail?.operationalStatus,
          processingStage: listingRow?.processingStage,
          workflowId: processingStatusContext?.workflowId,
          currentStatusId: processingStatusContext?.currentStatusId,
          heldFromStatusId: processingStatusContext?.heldFromStatusId,
        },
      ),
    [
      selectedRow,
      isSubmitted,
      applicationId,
      detail,
      listingRow,
      processingStatusContext,
      processingStatusTick,
    ],
  )

  const refreshProcessingStatus = useCallback(() => {
    setProcessingStatusTick((n) => n + 1)
    reload()
  }, [reload])

  const openStatusModal = useCallback(() => setStatusModalOpen(true), [])
  const closeStatusModal = useCallback(() => setStatusModalOpen(false), [])

  const globalDocuments = useMemo(
    () =>
      applicationId
        ? buildGlobalDocumentsForVerification(applicationId, detail?.globalDocumentUploads ?? {})
        : [],
    [applicationId, detail?.globalDocumentUploads, workspace],
  )

  const updateTravelerDoc = useCallback(
    (
      documentId: string,
      status: ApplicantDocumentStatus,
      comment?: string,
      options?: { customerVisible?: boolean },
    ) => {
      if (!applicationId || !selectedRow) return
      setWorkspace(
        applicationVerificationService.updateTravelerDocumentStatus(
          applicationId,
          selectedRow.id,
          documentId,
          status,
          comment,
          options,
        ),
      )
    },
    [applicationId, selectedRow],
  )

  const updateTravelerDocForRow = useCallback(
    (
      rowId: string,
      documentId: string,
      status: ApplicantDocumentStatus,
      comment?: string,
      options?: { customerVisible?: boolean },
    ) => {
      if (!applicationId) return
      setWorkspace(
        applicationVerificationService.updateTravelerDocumentStatus(
          applicationId,
          rowId,
          documentId,
          status,
          comment,
          options,
        ),
      )
    },
    [applicationId],
  )

  const updateTravelerOriginalReceived = useCallback(
    (rowId: string, documentId: string, received: boolean) => {
      if (!applicationId) return
      setWorkspace(
        applicationVerificationService.updateTravelerOriginalDocumentReceived(
          applicationId,
          rowId,
          documentId,
          received,
        ),
      )
    },
    [applicationId],
  )

  const updateTravelerOriginalCollection = useCallback(
    (rowId: string, collection: OriginalDocumentCollectionState) => {
      if (!applicationId) return
      setWorkspace(
        applicationVerificationService.updateTravelerOriginalCollection(
          applicationId,
          rowId,
          collection,
        ),
      )
    },
    [applicationId],
  )

  const updateGlobalDoc = useCallback(
    (
      documentId: string,
      status: ApplicantDocumentStatus,
      comment?: string,
      options?: { customerVisible?: boolean },
    ) => {
      if (!applicationId) return
      setWorkspace(
        applicationVerificationService.updateGlobalDocumentStatus(
          applicationId,
          documentId,
          status,
          comment,
          options,
        ),
      )
    },
    [applicationId],
  )

  const updateTravelerDocumentWorkflow = useCallback(
    (
      documentId: string,
      patch: {
        handlingMode?: DocumentHandlingMode
        travelTicket?: Partial<TravelTicketWorkflow>
        insurance?: Partial<InsuranceWorkflow>
        status?: ApplicantDocumentStatus
        uploadedFileName?: string
      },
    ) => {
      if (!applicationId || !selectedRow) return
      setWorkspace(
        applicationVerificationService.updateTravelerDocumentWorkflow(
          applicationId,
          selectedRow.id,
          documentId,
          patch,
        ),
      )
    },
    [applicationId, selectedRow],
  )

  const returnToVerificationPending = useCallback(() => {
    if (!applicationId) return
    setWorkspace(applicationVerificationService.returnToVerificationPending(applicationId))
  }, [applicationId])

  const notifyCustomerOfDocumentRejection = useCallback(() => {
    if (!applicationId) return
    setWorkspace(applicationVerificationService.notifyCustomerOfDocumentRejection(applicationId))
  }, [applicationId])

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
    processingStatusContext,
    statusModalOpen,
    openStatusModal,
    closeStatusModal,
    refreshProcessingStatus,
    globalDocuments,
    updateTravelerDoc,
    updateTravelerDocForRow,
    updateTravelerOriginalReceived,
    updateTravelerOriginalCollection,
    updateTravelerDocumentWorkflow,
    updateGlobalDoc,
    returnToVerificationPending,
    notifyCustomerOfDocumentRejection,
    saveDraft,
    submitVerification,
    reload,
  }
}

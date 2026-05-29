import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { applicationVerificationService } from '@/shared/services/applicationVerificationService'
import {
  applicationFormAssistService,
  EMPTY_FORM_ASSIST_SUBMISSION,
  isFormAssistExternallySubmitted,
  type FormAssistRecord,
} from '@/shared/services/applicationFormAssistService'
import {
  GENERIC_FORM_ASSIST_STEPS,
  buildFormAssistFieldsForStep,
  resolveFormAssistFlowExtras,
  type FormAssistContext,
} from '../utils/formAssistFieldBuilder'
import { buildVerifyTimeline } from '../utils/verifyDocumentsUtils'

export function useViewFormWorkspace(applicationId: string | undefined) {
  const [searchParams] = useSearchParams()
  const travelerParam = searchParams.get('traveler')

  const [workspace, setWorkspace] = useState(() =>
    applicationId ? applicationVerificationService.getWorkspace(applicationId) : { ok: false as const },
  )
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null)
  const [assistRecord, setAssistRecord] = useState<FormAssistRecord | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingStepId, setPendingStepId] = useState<string | null>(null)

  const reload = useCallback(() => {
    if (!applicationId) return
    setWorkspace(applicationVerificationService.getWorkspace(applicationId))
  }, [applicationId])

  useEffect(() => {
    reload()
  }, [reload])

  const detail = workspace.ok ? workspace.detail : undefined
  const listingRow = workspace.ok ? workspace.listingRow : undefined
  const rows = detail?.uploadQueueRows ?? []
  const isBulk = detail?.isBulkBatch ?? false

  const selectableRows = useMemo(() => {
    const ready = rows.filter(r => r.status !== 'processing')
    if (ready.length > 0) return ready
    // View Form should still work when the only traveler row is mid-scan/processing.
    return rows
  }, [rows])

  useEffect(() => {
    setSelectedTravelerId(null)
    setConfirmModalOpen(false)
    setPendingStepId(null)
    if (!applicationId) {
      setWorkspace({ ok: false as const })
      return
    }
    setWorkspace(applicationVerificationService.getWorkspace(applicationId))
  }, [applicationId])

  const selectedRow = useMemo(() => {
    if (selectableRows.length === 0) return null

    if (travelerParam) {
      const match = selectableRows.find(
        r => r.gltsApplicantId === travelerParam || r.id === travelerParam,
      )
      if (match) return match
    }

    if (selectedTravelerId) {
      const match = selectableRows.find(r => r.id === selectedTravelerId)
      if (match) return match
    }

    return selectableRows[0]
  }, [selectableRows, travelerParam, selectedTravelerId])

  useEffect(() => {
    if (!selectedRow) return
    if (selectedTravelerId !== selectedRow.id) {
      setSelectedTravelerId(selectedRow.id)
    }
  }, [selectedRow, selectedTravelerId])

  useEffect(() => {
    if (!applicationId || !selectedRow) {
      setAssistRecord(null)
      return
    }
    setAssistRecord(applicationFormAssistService.getRecord(applicationId, selectedRow.id))
  }, [applicationId, selectedRow])

  const activeStepIndex = assistRecord?.activeStepIndex ?? 0
  const submission = assistRecord?.submission ?? { ...EMPTY_FORM_ASSIST_SUBMISSION }

  const formContext = useMemo((): FormAssistContext | null => {
    if (!selectedRow || !detail) return null
    return {
      row: selectedRow,
      detail,
      flowExtras: applicationId ? resolveFormAssistFlowExtras(applicationId) : undefined,
    }
  }, [selectedRow, detail, applicationId])

  const currentStep = GENERIC_FORM_ASSIST_STEPS[activeStepIndex]
  const currentFields = useMemo(() => {
    if (!formContext || !currentStep) return []
    return buildFormAssistFieldsForStep(currentStep.id, formContext)
  }, [formContext, currentStep])

  const isLastStep = activeStepIndex === GENERIC_FORM_ASSIST_STEPS.length - 1
  const externallySubmitted = Boolean(
    applicationId &&
      selectedRow &&
      isFormAssistExternallySubmitted(applicationId, selectedRow.id),
  )

  const timelineSteps = useMemo(
    () =>
      buildVerifyTimeline(
        selectedRow,
        Boolean(listingRow?.submissionDate?.trim()),
        externallySubmitted,
      ),
    [selectedRow, listingRow, externallySubmitted],
  )

  const refreshAssistRecord = useCallback(() => {
    if (!applicationId || !selectedRow) return
    setAssistRecord(applicationFormAssistService.getRecord(applicationId, selectedRow.id))
  }, [applicationId, selectedRow])

  const setActiveStep = useCallback(
    (index: number) => {
      if (!applicationId || !selectedRow) return
      applicationFormAssistService.setActiveStep(applicationId, selectedRow.id, index)
      refreshAssistRecord()
    },
    [applicationId, selectedRow, refreshAssistRecord],
  )

  const requestStepContinue = useCallback(() => {
    if (!currentStep || isLastStep) return
    setPendingStepId(currentStep.id)
    setConfirmModalOpen(true)
  }, [currentStep, isLastStep])

  const confirmStepContinue = useCallback(() => {
    if (!applicationId || !selectedRow || !pendingStepId) return
    applicationFormAssistService.completeStep(
      applicationId,
      selectedRow.id,
      pendingStepId,
      Math.min(activeStepIndex + 1, GENERIC_FORM_ASSIST_STEPS.length - 1),
    )
    setConfirmModalOpen(false)
    setPendingStepId(null)
    refreshAssistRecord()
  }, [applicationId, selectedRow, pendingStepId, activeStepIndex, refreshAssistRecord])

  const cancelStepConfirm = useCallback(() => {
    setConfirmModalOpen(false)
    setPendingStepId(null)
  }, [])

  const updateSubmission = useCallback(
    (patch: Partial<FormAssistRecord['submission']>) => {
      if (!applicationId || !selectedRow) return
      applicationFormAssistService.updateSubmission(applicationId, selectedRow.id, patch)
      refreshAssistRecord()
    },
    [applicationId, selectedRow, refreshAssistRecord],
  )

  const pickSubmissionFile = useCallback(
    (field: keyof FormAssistRecord['submission'], file: File) => {
      updateSubmission({ [field]: file.name })
    },
    [updateSubmission],
  )

  const saveDraft = useCallback(() => {
    if (!applicationId || !selectedRow) return
    applicationFormAssistService.saveDraft(applicationId, selectedRow.id, {})
    refreshAssistRecord()
  }, [applicationId, selectedRow, refreshAssistRecord])

  const markAsSubmitted = useCallback(() => {
    if (!applicationId || !selectedRow) return { ok: false as const, errors: ['Missing application'] }
    const result = applicationFormAssistService.markAsSubmitted(applicationId, selectedRow.id)
    refreshAssistRecord()
    reload()
    return result
  }, [applicationId, selectedRow, refreshAssistRecord, reload])

  return {
    notFound: Boolean(applicationId && !workspace.ok),
    detail,
    listingRow,
    rows: selectableRows,
    isBulk,
    selectedTravelerId,
    setSelectedTravelerId,
    selectedRow,
    steps: GENERIC_FORM_ASSIST_STEPS,
    activeStepIndex,
    setActiveStep,
    currentStep,
    currentFields,
    isLastStep,
    formContext,
    submission,
    updateSubmission,
    pickSubmissionFile,
    confirmModalOpen,
    requestStepContinue,
    confirmStepContinue,
    cancelStepConfirm,
    saveDraft,
    markAsSubmitted,
    externallySubmitted,
    timelineSteps,
  }
}

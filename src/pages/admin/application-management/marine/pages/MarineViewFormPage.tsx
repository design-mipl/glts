import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocation, useParams } from 'react-router-dom'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import {
  Badge,
  BaseCard,
  Button,
  ConfirmDialog,
  EmptyState,
  FormField,
  Modal,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import type { ApplicantDocumentItem, ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { AdminWorkspaceShell } from '@/pages/admin/components/AdminWorkspaceShell'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { applicationArrangedExpenseService } from '@/shared/services/applicationArrangedExpenseService'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import { resolveHandlingMode } from '@/shared/utils/applicantDocumentWorkflowUtils'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { useViewFormWorkspace } from '../hooks/useViewFormWorkspace'
import { useVerifyDocumentsWorkspace } from '../hooks/useVerifyDocumentsWorkspace'
import { CopyAssistFieldSections } from '../components/view-form/CopyAssistField'
import { ViewFormSubmissionSection } from '../components/view-form/ViewFormSubmissionSection'
import { ViewFormDocumentVault } from '../components/view-form/ViewFormDocumentVault'
import { ViewFormWorkspaceTabs } from '../components/view-form/ViewFormWorkspaceTabs'
import { ViewFormQcCheckSection } from '../components/view-form/ViewFormQcCheckSection'
import { PendingPaymentWorkspaceContent } from '../components/view-form/PendingPaymentWorkspaceContent'
import { VerifyApplicationSummary } from '../components/verify/VerifyApplicationSummary'
import { VerifyPassengerWorkspace } from '../components/verify/VerifyPassengerWorkspace'
import {
  GltsDocumentUploadDrawer,
  type GltsDocumentUploadPayload,
} from '../components/verify/GltsDocumentUploadDrawer'
import { buildFormAssistFieldSectionsForStep } from '../utils/formAssistFieldBuilder'
import { resolveMarineChecklistContext } from '../utils/marineChecklistContextUtils'
import { isMarineReadOnlyWorkspace, resolveMarineWorkspaceMode } from '../config/marineWorkspaceMode'
import type { QcCheckOutcome } from '../config/qcCheckChecklistConfig'
import {
  resolveDocsQcTemplate,
  resolveFormViewTabEnabled,
} from '../utils/marineDocsQcCheckUtils'
import {
  applicationMarineQcCheckService,
  type MarineDocsQcCheckRecord,
} from '@/shared/services/applicationMarineQcCheckService'
import {
  buildOverviewFromDetail,
  collectRejectedVerifyDocuments,
  filterVerifyTravelers,
  isRejectedVerifyDocument,
  type VerifyRejectedDocumentEntry,
  type VerifyTravelerListFilter,
} from '../utils/verifyDocumentsUtils'

export function MarineViewFormPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useAppNavigate()
  const location = useLocation()
  const listingPath = getListingReturnHref(location, '/admin/application-management/marine')
  const { showToast } = useToast()

  const workspace = useViewFormWorkspace(applicationId)
  const verifyWorkspace = useVerifyDocumentsWorkspace(applicationId)

  const {
    notFound,
    detail,
    listingRow,
    rows,
    isBulk,
    selectedTravelerId,
    setSelectedTravelerId,
    selectedRow,
    steps,
    activeStepIndex,
    setActiveStep,
    currentStep,
    isLastStep,
    formContext,
    submission,
    updateSubmission,
    pickSubmissionFile,
    requestStepContinue,
    saveDraft,
    markAsSubmitted,
    externallySubmitted,
    timelineSteps,
    completedStepIds,
    reload: reloadViewForm,
  } = workspace

  const {
    globalDocuments,
    updateTravelerDocForRow,
    updateTravelerDocumentWorkflow,
    updateGlobalDoc,
    updateTravelerOriginalCollection,
    reload: reloadVerify,
    setSelectedTravelerId: setVerifyTravelerId,
  } = verifyWorkspace

  const [reviewDialog, setReviewDialog] = useState<{
    scope: 'traveler' | 'global'
    travelerId?: string
    documentId: string
    documentName: string
    status: Extract<ApplicantDocumentStatus, 'rejected' | 'needs_review'>
  } | null>(null)
  const [reviewComment, setReviewComment] = useState('')
  const [gltsUploadDocument, setGltsUploadDocument] = useState<ApplicantDocumentItem | null>(null)
  const [verifyDialog, setVerifyDialog] = useState<{
    scope: 'traveler' | 'global'
    travelerId?: string
    documentId: string
    documentName: string
  } | null>(null)

  useEffect(() => {
    if (selectedTravelerId) {
      setVerifyTravelerId(selectedTravelerId)
    }
  }, [selectedTravelerId, setVerifyTravelerId])

  const syncWorkspaceAfterDocumentChange = () => {
    reloadVerify()
    reloadViewForm()
  }

  const verifyPath = `/admin/application-management/marine/${applicationId}`

  const [travelerSearch, setTravelerSearch] = useState('')
  const [travelerFilter, setTravelerFilter] = useState<VerifyTravelerListFilter>('all')

  const overview = useMemo(
    () =>
      applicationId && detail
        ? buildOverviewFromDetail(applicationId, isBulk, rows, detail.application)
        : null,
    [applicationId, detail, isBulk, rows],
  )

  const singleListing = !isBulk && rows.length <= 1
  const multiTraveler = rows.length > 1

  const filteredRows = useMemo(
    () => filterVerifyTravelers(rows, travelerSearch, travelerFilter),
    [rows, travelerSearch, travelerFilter],
  )

  useEffect(() => {
    if (filteredRows.length === 0) return
    if (selectedTravelerId && filteredRows.some(row => row.id === selectedTravelerId)) return
    setSelectedTravelerId(filteredRows[0].id)
  }, [filteredRows, selectedTravelerId, setSelectedTravelerId])

  const selectedIndex = useMemo(
    () => filteredRows.findIndex(row => row.id === selectedTravelerId),
    [filteredRows, selectedTravelerId],
  )

  const goPreviousPassenger = () => {
    if (selectedIndex <= 0) return
    setSelectedTravelerId(filteredRows[selectedIndex - 1].id)
  }

  const goNextPassenger = () => {
    if (selectedIndex < 0 || selectedIndex >= filteredRows.length - 1) return
    setSelectedTravelerId(filteredRows[selectedIndex + 1].id)
  }

  const checklistContext = useMemo(
    () =>
      resolveMarineChecklistContext({
        application: detail?.application,
        listingRow,
      }),
    [detail?.application, listingRow],
  )

  const readOnly = useMemo(
    () => Boolean(listingRow && isMarineReadOnlyWorkspace(listingRow)),
    [listingRow],
  )

  const workspaceMode = useMemo(
    () => (listingRow ? resolveMarineWorkspaceMode(listingRow) : 'verification'),
    [listingRow],
  )
  const isPendingPayment = workspaceMode === 'pending_payment'

  const formLocked = readOnly || externallySubmitted

  const docsQcTemplate = useMemo(
    () =>
      resolveDocsQcTemplate(
        checklistContext.countryId,
        checklistContext.visaOfferingId,
        checklistContext.jurisdictionId,
      ),
    [checklistContext],
  )

  const [docsQcRecord, setDocsQcRecord] = useState<MarineDocsQcCheckRecord | null>(null)

  useEffect(() => {
    if (!applicationId || !selectedRow || !listingRow) {
      setDocsQcRecord(null)
      return
    }
    const mode = resolveMarineWorkspaceMode(listingRow)
    const record = applicationMarineQcCheckService.ensureRecord(
      applicationId,
      selectedRow.id,
      mode === 'readonly' ? { seedCompleted: true, template: docsQcTemplate } : undefined,
    )
    setDocsQcRecord(record)
  }, [applicationId, selectedRow?.id, listingRow, docsQcTemplate])

  const formViewUnlocked = useMemo(
    () => resolveFormViewTabEnabled(listingRow, docsQcRecord),
    [listingRow, docsQcRecord],
  )
  const formInteractionDisabled = !formViewUnlocked
  const docsQcReadyForSubmit = useMemo(
    () => (docsQcRecord ? applicationMarineQcCheckService.isComplete(docsQcTemplate, docsQcRecord) : false),
    [docsQcRecord, docsQcTemplate],
  )
  const docsQcSubmitted = useMemo(
    () => (docsQcRecord ? applicationMarineQcCheckService.isSubmitted(docsQcRecord) : false),
    [docsQcRecord],
  )

  const handleDocsQcCheckedChange = useCallback(
    (itemId: string, value: boolean) => {
      if (!applicationId || !selectedRow || readOnly) return
      const next = applicationMarineQcCheckService.updateChecked(
        applicationId,
        selectedRow.id,
        itemId,
        value,
        docsQcTemplate,
      )
      setDocsQcRecord(next)
    },
    [applicationId, selectedRow, readOnly, docsQcTemplate],
  )

  const handleDocsQcOutcomeChange = useCallback(
    (outcome: QcCheckOutcome | '') => {
      if (!applicationId || !selectedRow || readOnly) return
      const next = applicationMarineQcCheckService.updateOutcome(
        applicationId,
        selectedRow.id,
        outcome,
        docsQcTemplate,
      )
      setDocsQcRecord(next)
    },
    [applicationId, selectedRow, readOnly, docsQcTemplate],
  )

  const handleSubmitDocsQc = useCallback(() => {
    if (!applicationId || !selectedRow || readOnly) return
    const next = applicationMarineQcCheckService.submit(applicationId, selectedRow.id, docsQcTemplate)
    if (!next) {
      showToast({
        title: 'Complete checklist first',
        description: 'Confirm all QC checklist items and set outcome to Verified & ready for submission.',
        variant: 'warning',
      })
      return
    }
    setDocsQcRecord(next)
    showToast({
      title: 'QC check submitted',
      description: 'Form view is now unlocked for this traveler.',
      variant: 'success',
    })
  }, [applicationId, selectedRow, readOnly, docsQcTemplate, showToast])

  const rejectedDocuments = useMemo(
    () => collectRejectedVerifyDocuments(rows, globalDocuments),
    [rows, globalDocuments],
  )

  const travelerChecklistDocuments = useMemo(
    () => selectedRow?.documents.filter(doc => !isRejectedVerifyDocument(doc)) ?? [],
    [selectedRow],
  )

  const globalChecklistDocuments = useMemo(
    () => globalDocuments.filter(doc => !isRejectedVerifyDocument(doc)),
    [globalDocuments],
  )

  const sectionNav = useMemo(
    () =>
      steps.map(step => ({
        id: step.id,
        label: step.label,
        complete: completedStepIds.includes(step.id),
      })),
    [steps, completedStepIds],
  )

  const reviewActionLabel = reviewDialog?.status === 'rejected' ? 'Reject' : 'Request re-upload'
  const reviewDialogTitle = reviewDialog ? `${reviewActionLabel} document` : ''
  const isReviewCommentValid = reviewComment.trim().length > 0

  if (!applicationId) {
    return (
      <EmptyState
        title="Application not found"
        description="No application reference was provided."
        action={{ label: 'Back to applications', onClick: () => navigate(listingPath) }}
      />
    )
  }

  if (notFound) {
    return (
      <EmptyState
        title="Application not found"
        description="This application may be a draft, non-marine, or unavailable for form assist."
        action={{ label: 'Back to applications', onClick: () => navigate(listingPath) }}
      />
    )
  }

  if (!detail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!selectedRow || !formContext || (!isPendingPayment && !currentStep)) {
    return (
      <EmptyState
        title="No traveler data yet"
        description="Applicant rows are still processing or unavailable. Try Verify Documents first, or check again once passport scan completes."
        action={{ label: 'Back to applications', onClick: () => navigate(listingPath) }}
      />
    )
  }

  const handlePreview = (documentId: string, scope: 'traveler' | 'global') => {
    showToast({
      title: 'Preview',
      description:
        documentId === 'passport'
          ? 'Passport preview will open here.'
          : `Preview for ${documentId} (${scope}) will open here.`,
      variant: 'info',
    })
  }

  const handleSaveDraft = () => {
    saveDraft()
    showToast({ title: 'Draft saved', description: 'Form assist progress saved.', variant: 'success' })
  }

  const handleMarkSubmitted = () => {
    const result = markAsSubmitted()
    if (!result.ok) {
      showToast({
        title: 'Cannot mark as submitted',
        description: result.errors.join(' · '),
        variant: 'error',
      })
      return
    }
    showToast({
      title: 'Marked as submitted',
      description: 'Status updated to Submitted.',
      variant: 'success',
    })
    navigate(listingPath)
  }

  const goToStep = (stepId: string) => {
    const index = steps.findIndex(step => step.id === stepId)
    if (index < 0) return
    setActiveStep(index)
  }

  const openReviewDialog = (
    scope: 'traveler' | 'global',
    document: ApplicantDocumentItem,
    status: Extract<ApplicantDocumentStatus, 'rejected' | 'needs_review'>,
    travelerId?: string,
  ) => {
    setReviewDialog({
      scope,
      travelerId,
      documentId: document.documentId,
      documentName: document.name,
      status,
    })
    setReviewComment('')
  }

  const openVerifyDialog = (
    scope: 'traveler' | 'global',
    document: ApplicantDocumentItem,
    travelerId?: string,
  ) => {
    setVerifyDialog({
      scope,
      travelerId,
      documentId: document.documentId,
      documentName: document.name,
    })
  }

  const closeVerifyDialog = () => {
    setVerifyDialog(null)
  }

  const confirmVerifyDocument = () => {
    if (!verifyDialog) return
    if (verifyDialog.scope === 'traveler') {
      const rowId = verifyDialog.travelerId ?? selectedRow?.id
      if (!rowId) return
      updateTravelerDocForRow(rowId, verifyDialog.documentId, 'verified')
    } else {
      updateGlobalDoc(verifyDialog.documentId, 'verified')
    }
    syncWorkspaceAfterDocumentChange()
    showToast({
      title: 'Document verified',
      description: `${verifyDialog.documentName} marked as verified.`,
      variant: 'success',
    })
    closeVerifyDialog()
  }

  const handleRejectedPreview = (entry: VerifyRejectedDocumentEntry) => {
    handlePreview(entry.document.documentId, entry.scope)
  }

  const handleRejectedVerify = (entry: VerifyRejectedDocumentEntry) => {
    openVerifyDialog(entry.scope, entry.document, entry.travelerId)
  }

  const handleRejectedReject = (entry: VerifyRejectedDocumentEntry) => {
    openReviewDialog(entry.scope, entry.document, 'rejected', entry.travelerId)
  }

  const handleRejectedReupload = (entry: VerifyRejectedDocumentEntry) => {
    openReviewDialog(entry.scope, entry.document, 'needs_review', entry.travelerId)
  }

  const handleRejectedGltsUpload = (entry: VerifyRejectedDocumentEntry) => {
    if (entry.scope !== 'traveler') return
    setGltsUploadDocument(entry.document)
    if (entry.travelerId) {
      setSelectedTravelerId(entry.travelerId)
    }
  }

  const closeReviewDialog = () => {
    setReviewDialog(null)
    setReviewComment('')
  }

  const submitReviewAction = () => {
    if (!reviewDialog || !isReviewCommentValid) return
    const comment = reviewComment.trim()
    if (reviewDialog.scope === 'traveler') {
      const rowId = reviewDialog.travelerId ?? selectedRow?.id
      if (!rowId) return
      updateTravelerDocForRow(rowId, reviewDialog.documentId, reviewDialog.status, comment)
    } else {
      updateGlobalDoc(reviewDialog.documentId, reviewDialog.status, comment)
    }
    syncWorkspaceAfterDocumentChange()
    showToast({
      title: `${reviewActionLabel} saved`,
      description: `Comment added for ${reviewDialog.documentName}.`,
      variant: 'success',
    })
    closeReviewDialog()
  }

  const renderStepContent = () => {
    if (!currentStep) return null
    if (currentStep.id === 'submission') {
      return (
        <ViewFormSubmissionSection
          submission={submission}
          country={listingRow?.country ?? detail?.countryName ?? ''}
          visaType={listingRow?.visaType ?? detail?.visaTypeLabel ?? ''}
          countryId={checklistContext.countryId}
          visaOfferingId={checklistContext.visaOfferingId}
          readOnly={readOnly || formInteractionDisabled}
          onChange={updateSubmission}
          onPickFile={pickSubmissionFile}
        />
      )
    }

    return (
      <CopyAssistFieldSections
        sections={buildFormAssistFieldSectionsForStep(currentStep.id, formContext)}
        disabled={formInteractionDisabled}
      />
    )
  }

  const statusBadge = (
    <Badge
      label={
        externallySubmitted || readOnly
          ? readOnly
            ? 'Post-submission view'
            : 'Externally submitted'
          : isPendingPayment
            ? 'Pending Payment'
            : (currentStep?.label ?? 'Form')
      }
      color={externallySubmitted || readOnly ? 'success' : 'info'}
      size="sm"
    />
  )

  const passengerNavFooter = (
    <BaseCard sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        useFlexGap
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Button
            label="Previous passenger"
            variant="neutral"
            startIcon={<ChevronLeft size={14} />}
            onClick={goPreviousPassenger}
            disabled={selectedIndex <= 0}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          />
          <Button
            label="Back to listing"
            variant="neutral"
            onClick={() => navigate(listingPath)}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          />
          {!isPendingPayment && !readOnly ? (
            <Button
              label="Back to verify"
              variant="outlined"
              onClick={() => navigate(verifyPath)}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
          ) : null}
        </Stack>
        <Button
          label="Next passenger"
          variant="contained"
          color="primary"
          endIcon={<ChevronRight size={14} />}
          onClick={goNextPassenger}
          disabled={selectedIndex < 0 || selectedIndex >= filteredRows.length - 1}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        />
      </Stack>
    </BaseCard>
  )

  const pendingPaymentDetail = (
    <PendingPaymentWorkspaceContent
      applicationId={applicationId}
      selectedRow={selectedRow}
      detail={detail}
      submission={submission}
      country={listingRow?.country ?? detail.countryName ?? ''}
      visaType={listingRow?.visaType ?? detail.visaTypeLabel ?? ''}
      countryId={checklistContext.countryId}
      visaOfferingId={checklistContext.visaOfferingId}
      readOnly={readOnly}
      onChange={updateSubmission}
      onBack={() => navigate(listingPath)}
      hideFooter
      headerActions={statusBadge}
    />
  )

  const viewFormDetail = overview ? (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        {statusBadge}
      </Stack>
      <ViewFormWorkspaceTabs
        formViewEnabled={formViewUnlocked}
        qcPanel={
          <ViewFormQcCheckSection
            overview={overview}
            detail={detail}
            selectedRow={selectedRow}
            rejectedDocuments={rejectedDocuments}
            travelerChecklistDocuments={travelerChecklistDocuments}
            globalChecklistDocuments={globalChecklistDocuments}
            countryId={checklistContext.countryId}
            visaOfferingId={checklistContext.visaOfferingId}
            docsQcTemplate={docsQcTemplate}
            docsQcChecked={docsQcRecord?.checked ?? {}}
            docsQcOutcome={docsQcRecord?.outcome ?? ''}
            onDocsQcCheckedChange={handleDocsQcCheckedChange}
            onDocsQcOutcomeChange={handleDocsQcOutcomeChange}
            docsQcSubmitLabel={docsQcSubmitted ? 'QC submitted' : 'Submit QC check'}
            docsQcSubmitDisabled={docsQcSubmitted || !docsQcReadyForSubmit}
            docsQcSubmitHint={
              docsQcSubmitted
                ? 'QC already submitted. You can proceed in Form view.'
                : 'Submit QC after confirming every checklist item and selecting Verified & ready for submission.'
            }
            onDocsQcSubmit={handleSubmitDocsQc}
            readOnly={readOnly}
            onPreview={handlePreview}
            onTravelerVerify={document => openVerifyDialog('traveler', document, selectedRow?.id)}
            onTravelerReject={document =>
              openReviewDialog('traveler', document, 'rejected', selectedRow?.id)
            }
            onTravelerRequestReupload={document =>
              openReviewDialog('traveler', document, 'needs_review', selectedRow?.id)
            }
            onGltsUpload={document => setGltsUploadDocument(document)}
            onGlobalVerify={document => openVerifyDialog('global', document)}
            onGlobalReject={document => openReviewDialog('global', document, 'rejected')}
            onGlobalRequestReupload={document =>
              openReviewDialog('global', document, 'needs_review')
            }
            onRejectedPreview={handleRejectedPreview}
            onRejectedVerify={handleRejectedVerify}
            onRejectedReject={handleRejectedReject}
            onRejectedReupload={handleRejectedReupload}
            onRejectedGltsUpload={handleRejectedGltsUpload}
            onOriginalCollectionChange={collection => {
              if (!selectedRow) return
              updateTravelerOriginalCollection(selectedRow.id, collection)
              syncWorkspaceAfterDocumentChange()
            }}
            onOriginalReceivedSubmit={() => {
              showToast({
                title: 'Physical documents updated',
                description: 'Received status and remarks saved.',
                variant: 'success',
              })
            }}
          />
        }
        formPanel={
          <>
            <ViewFormDocumentVault
              applicationId={applicationId}
              selectedRow={selectedRow}
              detail={detail}
              submission={submission}
            />

            <AdminWorkspaceShell
              hidePageChrome
              breadcrumbs={[]}
              title=""
              showTitleCard={false}
              navTitle="Steps"
              sections={sectionNav}
              activeSectionId={currentStep!.id}
              onSectionClick={goToStep}
              centerPanel={
                <Stack spacing={3}>
                  <Box sx={{ px: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 15 }}>
                      {currentStep!.label}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ px: 0.5, pt: 0.5 }}>{renderStepContent()}</Box>
                </Stack>
              }
              footer={
                <AdminStepperFormFooter
                  activeStep={activeStepIndex}
                  isLastStep={isLastStep}
                  onCancel={() => navigate(readOnly ? listingPath : verifyPath)}
                  cancelLabel={readOnly ? 'Back to listing' : 'Back to verify'}
                  onDraft={formLocked || formInteractionDisabled ? undefined : handleSaveDraft}
                  draftLabel="Save draft"
                  onBack={() => setActiveStep(Math.max(0, activeStepIndex - 1))}
                  onNext={formInteractionDisabled ? undefined : requestStepContinue}
                  nextLabel="Continue"
                  onSubmit={formLocked || formInteractionDisabled ? undefined : handleMarkSubmitted}
                  submitLabel="Mark as submitted"
                  disabled={(externallySubmitted && !readOnly) || formInteractionDisabled}
                  submissionLocked={formLocked}
                />
              }
            />
          </>
        }
      />
    </Stack>
  ) : null

  const pageTitle = isPendingPayment
    ? 'Pending payment'
    : readOnly
      ? 'View application'
      : 'View Form'

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Application Management', href: listingPath },
          { label: pageTitle },
        ]}
        summary={
          overview ? <VerifyApplicationSummary overview={overview} isBulk={isBulk} /> : null
        }
      >
        <Stack spacing={2}>
          <VerifyPassengerWorkspace
            rows={rows}
            filteredRows={filteredRows}
            overview={overview!}
            singleListing={singleListing}
            selectedTravelerId={selectedTravelerId}
            onSelectTraveler={setSelectedTravelerId}
            selectedRow={selectedRow}
            search={travelerSearch}
            onSearchChange={setTravelerSearch}
            filter={travelerFilter}
            onFilterChange={setTravelerFilter}
            timelineSteps={timelineSteps}
            multiTraveler={multiTraveler}
            detail={detail}
            applicationId={applicationId}
            detailContent={isPendingPayment ? pendingPaymentDetail : viewFormDetail}
          />
          {passengerNavFooter}
        </Stack>
      </AdminDetailShell>

      <GltsDocumentUploadDrawer
        open={Boolean(gltsUploadDocument)}
        document={gltsUploadDocument}
        onClose={() => setGltsUploadDocument(null)}
        onSave={(payload: GltsDocumentUploadPayload) => {
          if (!gltsUploadDocument) return
          const mode = resolveHandlingMode(gltsUploadDocument) ?? 'arrange_by_glts'
          updateTravelerDocumentWorkflow(gltsUploadDocument.documentId, {
            handlingMode: mode,
            status: 'uploaded',
            ...(gltsUploadDocument.documentId === 'travel-ticket'
              ? { travelTicket: payload.travelTicket }
              : { insurance: payload.insurance }),
          })
          if (selectedRow) {
            applicationArrangedExpenseService.upsertFromGltsDocumentUpload({
              applicationId,
              isBulk,
              travelerRowId: selectedRow.id,
              applicantId: selectedRow.gltsApplicantId,
              applicantName: selectedRow.travelerName,
              document: gltsUploadDocument,
              payload,
            })
            applicationExpenseManagementService.syncApplication(applicationId)
          }
          syncWorkspaceAfterDocumentChange()
          showToast({
            title: 'Document saved',
            description: `${gltsUploadDocument.name} uploaded by GLTS and mapped to billing expenses.`,
            variant: 'success',
          })
          setGltsUploadDocument(null)
        }}
      />

      <ConfirmDialog
        open={Boolean(verifyDialog)}
        onClose={closeVerifyDialog}
        onConfirm={confirmVerifyDocument}
        title="Verify document?"
        description={
          verifyDialog
            ? `Confirm that ${verifyDialog.documentName} meets verification requirements. This will mark the document as verified.`
            : undefined
        }
        confirmLabel="Verify"
        cancelLabel="Cancel"
      />

      <Modal
        open={Boolean(reviewDialog)}
        onClose={closeReviewDialog}
        title={reviewDialogTitle}
        subtitle={
          reviewDialog
            ? `${reviewDialog.documentName} · ${reviewDialog.scope === 'traveler' ? 'Traveler document' : 'Global document'}`
            : undefined
        }
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={closeReviewDialog} />
            <Button
              label={reviewActionLabel}
              color="error"
              onClick={submitReviewAction}
              disabled={!isReviewCommentValid}
            />
          </Stack>
        }
      >
        <FormField
          label="Comment"
          required
          helperText="Comment is required and will be visible in the customer portal."
        >
          <Textarea
            value={reviewComment}
            onChange={setReviewComment}
            placeholder="Add clear instruction for the customer"
            minRows={4}
            fullWidth
          />
        </FormField>
      </Modal>
    </>
  )
}

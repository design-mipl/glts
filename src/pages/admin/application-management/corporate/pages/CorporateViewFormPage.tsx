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
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { useViewFormWorkspace } from '../hooks/useViewFormWorkspace'
import { useVerifyDocumentsWorkspace } from '../hooks/useVerifyDocumentsWorkspace'
import { CopyAssistFieldSections } from '../components/view-form/CopyAssistField'
import { ViewFormSubmissionSection } from '../components/view-form/ViewFormSubmissionSection'
import { ViewFormDocumentVault } from '../components/view-form/ViewFormDocumentVault'
import { ViewFormQcCheckSection } from '../components/view-form/ViewFormQcCheckSection'
import { PendingPaymentWorkspaceContent } from '../components/view-form/PendingPaymentWorkspaceContent'
import { VerifyApplicationSummary } from '../components/verify/VerifyApplicationSummary'
import { VerifyPassengerWorkspace } from '../components/verify/VerifyPassengerWorkspace'
import { buildFormAssistFieldSectionsForStep } from '../utils/formAssistFieldBuilder'
import { resolveCorporateChecklistContext } from '../utils/CorporateChecklistContextUtils'
import { isCorporateReadOnlyWorkspace, resolveCorporateWorkspaceMode } from '../config/CorporateWorkspaceMode'
import type { QcCheckOutcome } from '../config/qcCheckChecklistConfig'
import {
  resolveDocsQcTemplate,
  resolveFormViewTabEnabled,
  FORM_VIEW_QC_LOCKED_MESSAGE,
} from '../utils/CorporateDocsQcCheckUtils'
import {
  applicationMarineQcCheckService,
  type MarineDocsQcCheckRecord as CorporateDocsQcCheckRecord,
} from '@/shared/services/applicationMarineQcCheckService'
import { applicationVerificationService } from '@/shared/services/applicationVerificationService'
import {
  buildOverviewFromDetail,
  collectRejectedVerifyDocuments,
  filterVerifyTravelers,
  isRejectedVerifyDocument,
  type VerifyRejectedDocumentEntry,
  type VerifyTravelerListFilter,
} from '../utils/verifyDocumentsUtils'

export function CorporateViewFormPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useAppNavigate()
  const location = useLocation()
  const listingPath = getListingReturnHref(location, '/admin/application-management/corporate')
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
    processingStatusContext,
    statusModalOpen,
    openStatusModal,
    closeStatusModal,
    refreshProcessingStatus,
    completedStepIds,
    reload: reloadViewForm,
  } = workspace

  const {
    globalDocuments,
    updateTravelerDocForRow,
    updateGlobalDoc,
    updateTravelerOriginalCollection,
    returnToVerificationPending,
    notifyCustomerOfDocumentRejection,
    reload: reloadVerify,
    setSelectedTravelerId: setVerifyTravelerId,
  } = verifyWorkspace

  const [reviewDialog, setReviewDialog] = useState<{
    scope: 'traveler' | 'global'
    travelerId?: string
    documentId: string
    documentName: string
    status: Extract<ApplicantDocumentStatus, 'rejected' | 'needs_review'>
    /** When true, rejection becomes customer-visible (moves to Rejected by Ops team). */
    promoteToOps?: boolean
  } | null>(null)
  const [reviewComment, setReviewComment] = useState('')
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

  const verifyPath = `/admin/application-management/corporate/${applicationId}`

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
      resolveCorporateChecklistContext({
        application: detail?.application,
        listingRow,
      }),
    [detail?.application, listingRow],
  )

  const readOnly = useMemo(
    () => Boolean(listingRow && isCorporateReadOnlyWorkspace(listingRow)),
    [listingRow],
  )

  const workspaceMode = useMemo(
    () => (listingRow ? resolveCorporateWorkspaceMode(listingRow) : 'verification'),
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

  const [docsQcRecord, setDocsQcRecord] = useState<CorporateDocsQcCheckRecord | null>(null)

  useEffect(() => {
    if (!applicationId || !selectedRow || !listingRow) {
      setDocsQcRecord(null)
      return
    }
    const mode = resolveCorporateWorkspaceMode(listingRow)
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

  const rejectedDocuments = useMemo(() => {
    if (!applicationId) return []
    const visibility = applicationVerificationService.getRejectionVisibilityMap(applicationId)
    return collectRejectedVerifyDocuments(rows, globalDocuments, visibility)
  }, [applicationId, rows, globalDocuments])

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
  const reviewDialogTitle = reviewDialog
    ? reviewDialog.promoteToOps
      ? 'Reject again — move to Ops team'
      : `${reviewActionLabel} document`
    : ''
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
        description="This application may be a draft, non-corporate, or unavailable for form assist."
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
    options?: { promoteToOps?: boolean },
  ) => {
    setReviewDialog({
      scope,
      travelerId,
      documentId: document.documentId,
      documentName: document.name,
      status,
      promoteToOps: options?.promoteToOps,
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
    // Document-team (internal) rejects → Reject again promotes to Ops / customer portal.
    const promoteToOps = entry.customerVisible === false
    openReviewDialog(entry.scope, entry.document, 'rejected', entry.travelerId, { promoteToOps })
  }

  const handleRejectedReupload = (entry: VerifyRejectedDocumentEntry) => {
    openReviewDialog(entry.scope, entry.document, 'needs_review', entry.travelerId)
  }

  const closeReviewDialog = () => {
    setReviewDialog(null)
    setReviewComment('')
  }

  const submitReviewAction = () => {
    if (!reviewDialog || !isReviewCommentValid) return
    const comment = reviewComment.trim()
    const isSubmissionPendingReject = workspaceMode === 'online_submission' && !reviewDialog.promoteToOps
    // Submission Pending rejects stay internal; Reject again from Document team card promotes to Ops.
    const options = {
      customerVisible: reviewDialog.promoteToOps ? true : !isSubmissionPendingReject,
    }

    if (reviewDialog.scope === 'traveler') {
      const rowId = reviewDialog.travelerId ?? selectedRow?.id
      if (!rowId) return
      updateTravelerDocForRow(rowId, reviewDialog.documentId, reviewDialog.status, comment, options)
    } else {
      updateGlobalDoc(reviewDialog.documentId, reviewDialog.status, comment, options)
    }

    if (isSubmissionPendingReject) {
      returnToVerificationPending()
      syncWorkspaceAfterDocumentChange()
      showToast({
        title: `${reviewActionLabel} saved`,
        description: `${reviewDialog.documentName} marked. Application moved to Verification Pending (Document Rejected). Customer is not notified yet.`,
        variant: 'success',
      })
      closeReviewDialog()
      navigate(listingPath)
      return
    }

    if (reviewDialog.promoteToOps) {
      notifyCustomerOfDocumentRejection()
    }
    syncWorkspaceAfterDocumentChange()
    showToast({
      title: reviewDialog.promoteToOps ? 'Moved to Rejected by Ops team' : `${reviewActionLabel} saved`,
      description: reviewDialog.promoteToOps
        ? `${reviewDialog.documentName} is now visible in the customer portal.`
        : `Comment added for ${reviewDialog.documentName}.`,
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
          country={listingRow?.country ?? detail?.application?.country ?? ''}
          visaType={listingRow?.visaType ?? detail?.application?.visaType ?? ''}
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

  const pendingPaymentContent = (
    <PendingPaymentWorkspaceContent
      applicationId={applicationId}
      selectedRow={selectedRow}
      detail={detail}
      submission={submission}
      country={listingRow?.country ?? detail?.application?.country ?? ''}
      visaType={listingRow?.visaType ?? detail?.application?.visaType ?? ''}
      countryId={checklistContext.countryId}
      visaOfferingId={checklistContext.visaOfferingId}
      readOnly={readOnly}
      onChange={updateSubmission}
      onBack={() => navigate(listingPath)}
      hideFooter
    />
  )

  const qcPanel = overview ? (
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
      onGlobalVerify={document => openVerifyDialog('global', document)}
      onGlobalReject={document => openReviewDialog('global', document, 'rejected')}
      onGlobalRequestReupload={document =>
        openReviewDialog('global', document, 'needs_review')
      }
      onRejectedPreview={handleRejectedPreview}
      onRejectedVerify={handleRejectedVerify}
      onRejectedReject={handleRejectedReject}
      onRejectedReupload={handleRejectedReupload}
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
  ) : null

  const formPanel = (
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
  )

  const workTabs = isPendingPayment
    ? [
        {
          value: 'payment',
          label: 'Payment',
          content: pendingPaymentContent,
        },
      ]
    : [
        {
          value: 'qc',
          label: 'QC check',
          content: qcPanel,
        },
        {
          value: 'form',
          label: 'Form',
          disabled: !formViewUnlocked,
          content: formPanel,
        },
      ]

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
            detail={detail}
            applicationId={applicationId}
            workTabs={workTabs}
            headerActions={statusBadge}
            workTabHint={
              !isPendingPayment && !formViewUnlocked ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.45 }}>
                  {FORM_VIEW_QC_LOCKED_MESSAGE}
                </Typography>
              ) : null
            }
            emptyMessage="Select a passenger to continue."
            processingStatus={
              processingStatusContext
                ? {
                    currentStatusId: processingStatusContext.currentStatusId,
                    countryName: detail?.application?.country ?? listingRow?.country,
                    visaTypeLabel: detail?.application?.visaType ?? listingRow?.visaType,
                    modalOpen: statusModalOpen,
                    onOpenModal: openStatusModal,
                    onCloseModal: closeStatusModal,
                    onUpdated: () => {
                      refreshProcessingStatus()
                      showToast({
                        title: 'Processing status updated',
                        variant: 'success',
                      })
                    },
                  }
                : undefined
            }
          />
          {passengerNavFooter}
        </Stack>
      </AdminDetailShell>

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
          helperText={
            reviewDialog?.promoteToOps
              ? 'Comment is required. This moves the document to Rejected by Ops team and makes it visible in the customer portal.'
              : workspaceMode === 'online_submission'
                ? 'Internal remark for Verification Pending. Customer is notified only after Ops rejects again.'
                : 'Comment is required and will be visible in the customer portal.'
          }
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

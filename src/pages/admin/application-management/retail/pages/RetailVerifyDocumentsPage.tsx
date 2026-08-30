import { useMemo, useState } from 'react'
import { Box, CircularProgress, Stack } from '@mui/material'
import { useLocation, useParams } from 'react-router-dom'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import {
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
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { useVerifyDocumentsWorkspace } from '../hooks/useVerifyDocumentsWorkspace'
import { VerifyApplicationSummary } from '../components/verify/VerifyApplicationSummary'
import { VerifyDocumentsPhaseContent } from '../components/verify/VerifyDocumentsPhaseContent'
import {
  GltsDocumentUploadDrawer,
  type GltsDocumentUploadPayload,
} from '../components/verify/GltsDocumentUploadDrawer'
import { resolveHandlingMode, isSimpleDocumentRequirement } from '@/shared/utils/applicantDocumentWorkflowUtils'
import { applicationArrangedExpenseService } from '@/shared/services/applicationArrangedExpenseService'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import { resolveRetailChecklistContext } from '../utils/RetailChecklistContextUtils'
import { isRetailReadOnlyWorkspace } from '../config/RetailWorkspaceMode'
import { CustomerPaymentPanel } from '../components/CustomerPaymentPanel'
import { ensureOriginalDocumentCollectionState } from '@/shared/utils/originalDocumentCollectionUtils'
import {
  collectRejectedVerifyDocuments,
  isRejectedVerifyDocument,
  type VerifyRejectedDocumentEntry,
} from '../utils/verifyDocumentsUtils'
import { applicationVerificationService } from '@/shared/services/applicationVerificationService'

export function RetailVerifyDocumentsPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useAppNavigate()
  const location = useLocation()
  const listingPath = getListingReturnHref(location, '/admin/application-management/retail')
  const { showToast } = useToast()
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

  const workspace = useVerifyDocumentsWorkspace(applicationId)
  const {
    notFound,
    detail,
    listingRow,
    overview,
    rows,
    isBulk,
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
    updateTravelerDocForRow,
    updateTravelerDocumentWorkflow,
    updateGlobalDoc,
    updateTravelerOriginalReceived,
    updateTravelerOriginalCollection,
    notifyCustomerOfDocumentRejection,
    saveDraft,
    submitVerification,
  } = workspace

  const reviewActionLabel = reviewDialog?.status === 'rejected' ? 'Reject' : 'Request re-upload'
  const reviewDialogTitle = useMemo(() => {
    if (!reviewDialog) return ''
    return `${reviewActionLabel} document`
  }, [reviewActionLabel, reviewDialog])

  const rejectedDocuments = useMemo(() => {
    if (!applicationId) return []
    const visibility = applicationVerificationService.getRejectionVisibilityMap(applicationId)
    return collectRejectedVerifyDocuments(rows, globalDocuments, visibility)
  }, [applicationId, rows, globalDocuments])


  const checklistContext = useMemo(
    () =>
      resolveRetailChecklistContext({
        application: detail?.application,
        listingRow,
      }),
    [detail?.application, listingRow],
  )

  const readOnly = useMemo(
    () => Boolean(listingRow && isRetailReadOnlyWorkspace(listingRow)),
    [listingRow],
  )

  const travelerChecklistDocuments = useMemo(
    () => selectedRow?.documents.filter(doc => !isRejectedVerifyDocument(doc)) ?? [],
    [selectedRow],
  )

  const globalChecklistDocuments = useMemo(
    () => globalDocuments.filter(doc => !isRejectedVerifyDocument(doc)),
    [globalDocuments],
  )

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
        description="This application may be non-retail or unavailable for verification."
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
    showToast({ title: 'Draft saved', description: 'Verification progress saved.', variant: 'success' })
  }

  const handleSubmit = () => {
    submitVerification()
    showToast({
      title: 'Verification submitted',
      description:
        'Rejected documents were published to the customer portal. Application status is Correction Required.',
      variant: 'success',
    })
    navigate(listingPath)
  }

  const isReviewCommentValid = reviewComment.trim().length > 0

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
    // Verification Pending rejections belong in Rejected by Ops team (customer-visible).
    const options = { customerVisible: true as const }
    if (reviewDialog.scope === 'traveler') {
      const rowId = reviewDialog.travelerId ?? selectedRow?.id
      if (!rowId) return
      updateTravelerDocForRow(rowId, reviewDialog.documentId, reviewDialog.status, comment, options)
    } else {
      updateGlobalDoc(reviewDialog.documentId, reviewDialog.status, comment, options)
    }
    // Publish to customer portal and refresh workspace from the latest store.
    notifyCustomerOfDocumentRejection()
    showToast({
      title: 'Document rejected',
      description: `${reviewDialog.documentName} moved to Rejected by Ops team.`,
      variant: 'success',
    })
    closeReviewDialog()
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Application Management', href: listingPath },
          { label: readOnly ? 'View application' : 'Verify Documents' },
        ]}
        summary={<VerifyApplicationSummary overview={overview} isBulk={isBulk} />}
      >
        <VerifyDocumentsPhaseContent
          phase="final"
          rows={rows}
          isBulk={isBulk}
          overview={overview}
          detail={detail}
          applicationId={applicationId}
          selectedTravelerId={selectedTravelerId}
          onSelectTraveler={setSelectedTravelerId}
          selectedRow={selectedRow}
          timelineSteps={timelineSteps}
          rejectedDocuments={rejectedDocuments}
          travelerChecklistDocuments={travelerChecklistDocuments}
          globalChecklistDocuments={globalChecklistDocuments}
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
          countryId={checklistContext.countryId}
          visaOfferingId={checklistContext.visaOfferingId}
          jurisdictionId={checklistContext.jurisdictionId}
          onOriginalDocumentReceivedChange={(documentId, received) => {
            if (!selectedRow) return
            updateTravelerOriginalReceived(selectedRow.id, documentId, received)
          }}
          onOriginalReceivedRemarksSave={remarks => {
            if (!selectedRow) return
            const docs = selectedRow.documents
              .filter(doc => doc.originalDocument)
              .map(doc => ({ documentId: doc.documentId, name: doc.name }))
            const next = {
              ...ensureOriginalDocumentCollectionState(selectedRow.originalDocumentCollection, docs),
              receivedRemarks: remarks,
            }
            updateTravelerOriginalCollection(selectedRow.id, next)
            showToast({
              title: 'Remarks saved',
              description: 'Physical document receipt remarks updated.',
              variant: 'success',
            })
          }}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          readOnly={readOnly}
          extraWorkTabs={[
            {
              value: 'customer_payment',
              label: 'Customer Payment',
              content: <CustomerPaymentPanel payment={listingRow?.customerPayment} />,
            },
          ]}
          processingStatus={
            processingStatusContext
              ? {
                  currentStatusId: processingStatusContext.currentStatusId,
                  countryName: detail.application?.country ?? listingRow?.country,
                  visaTypeLabel: detail.application?.visaType ?? listingRow?.visaType,
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
      </AdminDetailShell>

      <GltsDocumentUploadDrawer
        open={Boolean(gltsUploadDocument)}
        document={gltsUploadDocument}
        onClose={() => setGltsUploadDocument(null)}
        onSave={(payload: GltsDocumentUploadPayload) => {
          if (!gltsUploadDocument) return
          const isSimple = isSimpleDocumentRequirement(gltsUploadDocument.documentId)
          const mode = resolveHandlingMode(gltsUploadDocument) ?? (isSimple ? 'arrange_by_glts' : undefined)
          updateTravelerDocumentWorkflow(gltsUploadDocument.documentId, {
            ...(mode ? { handlingMode: mode } : {}),
            status: 'uploaded',
            uploadedFileName: payload.fileName,
            ...(gltsUploadDocument.documentId === 'travel-ticket'
              ? { travelTicket: payload.travelTicket }
              : gltsUploadDocument.documentId === 'insurance'
                ? { insurance: payload.insurance }
                : {}),
          })
          if (
            selectedRow &&
            isSimple &&
            mode === 'arrange_by_glts' &&
            (payload.travelTicket || payload.insurance)
          ) {
            const workflow =
              gltsUploadDocument.documentId === 'travel-ticket'
                ? payload.travelTicket
                : payload.insurance
            const hasArrangement =
              gltsUploadDocument.documentId === 'insurance'
                ? Boolean(
                    payload.insurance?.vendorId?.trim() &&
                      payload.insurance?.policyNumber?.trim() &&
                      payload.insurance?.arrangementAmount?.trim(),
                  )
                : Boolean(workflow?.arrangementAmount?.trim() && workflow?.vendorId?.trim())
            if (hasArrangement) {
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
          }
          showToast({
            title: 'Document saved',
            description: `${gltsUploadDocument.name} uploaded by GLTS.`,
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
            <Button label={reviewActionLabel} color="error" onClick={submitReviewAction} disabled={!isReviewCommentValid} />
          </Stack>
        }
      >
        <FormField
          label="Comment"
          required
          helperText="Comment is required and will be published to the customer portal (Rejected by Ops team)."
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

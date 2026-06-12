import { useMemo, useState } from 'react'
import { Box, CircularProgress, Stack } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import {
  BaseCard,
  Button,
  EmptyState,
  FormField,
  Modal,
  Tabs,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import type { ApplicantDocumentItem, ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { useVerifyDocumentsWorkspace } from '../hooks/useVerifyDocumentsWorkspace'
import { VerifyDocumentsOverview } from '../components/verify/VerifyDocumentsOverview'
import { VerifyDocumentsPhaseContent } from '../components/verify/VerifyDocumentsPhaseContent'
import {
  GltsDocumentUploadDrawer,
  type GltsDocumentUploadPayload,
} from '../components/verify/GltsDocumentUploadDrawer'
import { resolveHandlingMode } from '@/shared/utils/applicantDocumentWorkflowUtils'
import {
  collectRejectedVerifyDocuments,
  isRejectedVerifyDocument,
  type VerifyRejectedDocumentEntry,
} from '../utils/verifyDocumentsUtils'
import { toApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'

const VERIFICATION_TABS = [
  { label: 'Initial verification', value: 'initial' },
  { label: 'Final verification', value: 'final' },
] as const

type VerificationTab = (typeof VERIFICATION_TABS)[number]['value']

export function MarineVerifyDocumentsPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useAppNavigate()
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
  const [verificationTab, setVerificationTab] = useState<VerificationTab>('initial')

  const workspace = useVerifyDocumentsWorkspace(applicationId)
  const {
    notFound,
    detail,
    overview,
    rows,
    isBulk,
    selectedTravelerId,
    setSelectedTravelerId,
    selectedRow,
    timelineSteps,
    globalDocuments,
    updateTravelerDoc,
    updateTravelerDocForRow,
    updateTravelerDocumentWorkflow,
    updateGlobalDoc,
    saveDraft,
    submitVerification,
  } = workspace

  const listingPath = '/admin/application-management/marine'

  const reviewActionLabel = reviewDialog?.status === 'rejected' ? 'Reject' : 'Request re-upload'
  const reviewDialogTitle = useMemo(() => {
    if (!reviewDialog) return ''
    return `${reviewActionLabel} document`
  }, [reviewActionLabel, reviewDialog])

  const rejectedDocuments = useMemo(
    () => collectRejectedVerifyDocuments(rows, globalDocuments),
    [rows, globalDocuments],
  )

  const summaryOverview = useMemo(() => toApplicationReviewOverview(overview), [overview])

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
        description="This application may be a draft, non-marine, or unavailable for verification."
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
      title: 'Application submitted',
      description: 'Verification outcomes are reflected in the customer portal.',
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

  const handleRejectedPreview = (entry: VerifyRejectedDocumentEntry) => {
    handlePreview(entry.document.documentId, entry.scope)
  }

  const handleRejectedVerify = (entry: VerifyRejectedDocumentEntry) => {
    if (entry.scope === 'global') {
      updateGlobalDoc(entry.document.documentId, 'verified')
      return
    }
    if (entry.travelerId) {
      updateTravelerDocForRow(entry.travelerId, entry.document.documentId, 'verified')
    }
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
    showToast({
      title: `${reviewActionLabel} saved`,
      description: `Comment added for ${reviewDialog.documentName}.`,
      variant: 'success',
    })
    closeReviewDialog()
  }

  return (
    <AdminRecordPageChrome
      breadcrumbs={[
        { label: 'Application Management', href: listingPath },
        { label: 'Verify Documents' },
      ]}
    >
      <Stack spacing={2}>
        <VerifyDocumentsOverview overview={overview} />

        <BaseCard sx={{ overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs
              items={[...VERIFICATION_TABS]}
              value={verificationTab}
              onChange={value => setVerificationTab(value as VerificationTab)}
              variant="underline"
              size="sm"
              sx={{ mb: 0, minHeight: 44 }}
            />
          </Box>

          <Stack spacing={2} sx={{ p: 2 }}>
            <VerifyDocumentsPhaseContent
              phase={verificationTab}
              rows={rows}
              isBulk={isBulk}
              overview={overview}
              summaryOverview={summaryOverview}
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
              onTravelerVerify={documentId => updateTravelerDoc(documentId, 'verified')}
              onTravelerReject={document =>
                openReviewDialog('traveler', document, 'rejected', selectedRow?.id)
              }
              onTravelerRequestReupload={document =>
                openReviewDialog('traveler', document, 'needs_review', selectedRow?.id)
              }
              onGltsUpload={document => setGltsUploadDocument(document)}
              onGlobalVerify={documentId => updateGlobalDoc(documentId, 'verified')}
              onGlobalReject={document => openReviewDialog('global', document, 'rejected')}
              onGlobalRequestReupload={document =>
                openReviewDialog('global', document, 'needs_review')
              }
              onRejectedPreview={handleRejectedPreview}
              onRejectedVerify={handleRejectedVerify}
              onRejectedReject={handleRejectedReject}
              onRejectedReupload={handleRejectedReupload}
              onRejectedGltsUpload={handleRejectedGltsUpload}
              onBack={() => navigate(listingPath)}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              onViewForm={() =>
                navigate(`/admin/application-management/marine/${applicationId}/view-form`)
              }
            />
          </Stack>
        </BaseCard>
      </Stack>

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
          showToast({
            title: 'Document saved',
            description: `${gltsUploadDocument.name} uploaded by GLTS.`,
            variant: 'success',
          })
          setGltsUploadDocument(null)
        }}
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
            <Button label="Cancel" variant="outlined" onClick={closeReviewDialog} />
            <Button label={reviewActionLabel} color="error" onClick={submitReviewAction} disabled={!isReviewCommentValid} />
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
    </AdminRecordPageChrome>
  )
}

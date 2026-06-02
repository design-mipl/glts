import { useMemo, useState } from 'react'
import { Box, CircularProgress, Stack } from '@mui/material'
import { FileText } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  EmptyState,
  FormField,
  Modal,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import type { ApplicantDocumentItem, ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { useVerifyDocumentsWorkspace } from '../hooks/useVerifyDocumentsWorkspace'
import { VerifyDocumentsOverview } from '../components/verify/VerifyDocumentsOverview'
import { VerifyDocumentsTravelerSection } from '../components/verify/VerifyDocumentsTravelerSection'
import { VerifyDocumentsTimeline } from '../components/verify/VerifyDocumentsTimeline'
import { VerifyDocumentsSummary } from '../components/verify/VerifyDocumentsSummary'
import {
  VerifyDocumentChecklistSection,
  VerifyGlobalDocumentChecklist,
} from '../components/verify/VerifyDocumentChecklistSection'

export function MarineVerifyDocumentsPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [reviewDialog, setReviewDialog] = useState<{
    scope: 'traveler' | 'global'
    documentId: string
    documentName: string
    status: Extract<ApplicantDocumentStatus, 'rejected' | 'needs_review'>
  } | null>(null)
  const [reviewComment, setReviewComment] = useState('')

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
    updateGlobalDoc,
    saveDraft,
    submitVerification,
  } = workspace

  const listingPath = '/admin/application-management/marine'

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
  const reviewActionLabel = reviewDialog?.status === 'rejected' ? 'Reject' : 'Request re-upload'
  const reviewDialogTitle = useMemo(() => {
    if (!reviewDialog) return ''
    return `${reviewActionLabel} document`
  }, [reviewActionLabel, reviewDialog])

  const openReviewDialog = (
    scope: 'traveler' | 'global',
    document: ApplicantDocumentItem,
    status: Extract<ApplicantDocumentStatus, 'rejected' | 'needs_review'>,
  ) => {
    setReviewDialog({
      scope,
      documentId: document.documentId,
      documentName: document.name,
      status,
    })
    setReviewComment('')
  }

  const closeReviewDialog = () => {
    setReviewDialog(null)
    setReviewComment('')
  }

  const submitReviewAction = () => {
    if (!reviewDialog || !isReviewCommentValid) return
    const comment = reviewComment.trim()
    if (reviewDialog.scope === 'traveler') {
      updateTravelerDoc(reviewDialog.documentId, reviewDialog.status, comment)
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

        <VerifyDocumentsTravelerSection
          rows={rows}
          isBulk={isBulk}
          gltsApplicationId={overview.gltsApplicationId}
          gltsBatchId={overview.gltsBatchId}
          selectedTravelerId={selectedTravelerId}
          onSelectTraveler={setSelectedTravelerId}
        />

        <VerifyDocumentsTimeline steps={timelineSteps} multiTraveler={rows.filter(r => r.status !== 'processing').length > 1} />

        {selectedRow && detail ? (
          <>
            <VerifyDocumentsSummary
              selectedRow={selectedRow}
              detail={detail}
              applicationId={applicationId}
            />

            <VerifyDocumentChecklistSection
              countryTitle={overview.countryName}
              documents={selectedRow.documents}
              onPreview={documentId => handlePreview(documentId, 'traveler')}
              onVerify={documentId => updateTravelerDoc(documentId, 'verified')}
              onReject={document => openReviewDialog('traveler', document, 'rejected')}
              onRequestReupload={document => openReviewDialog('traveler', document, 'needs_review')}
            />
          </>
        ) : null}

        <VerifyGlobalDocumentChecklist
          documents={globalDocuments}
          onPreview={documentId => handlePreview(documentId, 'global')}
          onVerify={documentId => updateGlobalDoc(documentId, 'verified')}
          onReject={document => openReviewDialog('global', document, 'rejected')}
          onRequestReupload={document => openReviewDialog('global', document, 'needs_review')}
        />

        <AdminFullPageFormFooter
          onCancel={() => navigate(listingPath)}
          cancelLabel="Back to listing"
          onDraft={handleSaveDraft}
          draftLabel="Save draft"
          onSave={handleSubmit}
          saveLabel="Submit application"
          extraActions={
            <Button
              label="View Form"
              variant="outlined"
              startIcon={<FileText size={14} />}
              onClick={() => navigate(`/admin/application-management/marine/${applicationId}/view-form`)}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
          }
        />
      </Stack>

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

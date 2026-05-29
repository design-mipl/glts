import { Box, CircularProgress, Stack } from '@mui/material'
import { FileText } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, EmptyState, useToast } from '@/design-system/UIComponents'
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
              onReject={documentId => updateTravelerDoc(documentId, 'rejected')}
              onRequestReupload={documentId => updateTravelerDoc(documentId, 'needs_review')}
            />
          </>
        ) : null}

        <VerifyGlobalDocumentChecklist
          documents={globalDocuments}
          onPreview={documentId => handlePreview(documentId, 'global')}
          onVerify={documentId => updateGlobalDoc(documentId, 'verified')}
          onReject={documentId => updateGlobalDoc(documentId, 'rejected')}
          onRequestReupload={documentId => updateGlobalDoc(documentId, 'needs_review')}
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
    </AdminRecordPageChrome>
  )
}

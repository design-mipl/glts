import { FileText } from 'lucide-react'
import { Grid, Stack } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { VerifyDocumentsTravelerSection } from './VerifyDocumentsTravelerSection'
import { VerifyDocumentsTimeline } from './VerifyDocumentsTimeline'
import {
  VERIFY_DOCUMENT_SPLIT_GRID_SX,
  VerifyDocumentChecklistsPanel,
} from './VerifyDocumentChecklistSection'
import { VerifyRejectedDocumentsSection } from './VerifyRejectedDocumentsSection'
import { VerifyFinalVerificationChecklist } from './VerifyFinalVerificationChecklist'
import type { VerifyOverviewData, VerifyRejectedDocumentEntry } from '../../utils/verifyDocumentsUtils'

export type VerifyDocumentsPhase = 'initial' | 'final'

interface VerifyDocumentsPhaseContentProps {
  phase: VerifyDocumentsPhase
  rows: UploadQueueRow[]
  isBulk: boolean
  overview: VerifyOverviewData
  summaryOverview: ApplicationReviewOverview
  detail: ApplicationDetailViewModel
  applicationId: string
  selectedTravelerId: string | null
  onSelectTraveler: (id: string) => void
  selectedRow: UploadQueueRow | null
  timelineSteps: ApplicationProcessingTimelineStep[]
  rejectedDocuments: VerifyRejectedDocumentEntry[]
  travelerChecklistDocuments: ApplicantDocumentItem[]
  globalChecklistDocuments: ApplicantDocumentItem[]
  onPreview: (documentId: string, scope: 'traveler' | 'global') => void
  onTravelerVerify: (documentId: string) => void
  onTravelerReject: (document: ApplicantDocumentItem) => void
  onTravelerRequestReupload: (document: ApplicantDocumentItem) => void
  onGltsUpload: (document: ApplicantDocumentItem) => void
  onGlobalVerify: (documentId: string) => void
  onGlobalReject: (document: ApplicantDocumentItem) => void
  onGlobalRequestReupload: (document: ApplicantDocumentItem) => void
  onRejectedPreview: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedVerify: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedReject: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedReupload: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedGltsUpload: (entry: VerifyRejectedDocumentEntry) => void
  onBack: () => void
  onSaveDraft: () => void
  onSubmit: () => void
  onViewForm: () => void
}

export function VerifyDocumentsPhaseContent({
  phase,
  rows,
  isBulk,
  overview,
  summaryOverview,
  detail,
  applicationId,
  selectedTravelerId,
  onSelectTraveler,
  selectedRow,
  timelineSteps,
  rejectedDocuments,
  travelerChecklistDocuments,
  globalChecklistDocuments,
  onPreview,
  onTravelerVerify,
  onTravelerReject,
  onTravelerRequestReupload,
  onGltsUpload,
  onGlobalVerify,
  onGlobalReject,
  onGlobalRequestReupload,
  onRejectedPreview,
  onRejectedVerify,
  onRejectedReject,
  onRejectedReupload,
  onRejectedGltsUpload,
  onBack,
  onSaveDraft,
  onSubmit,
  onViewForm,
}: VerifyDocumentsPhaseContentProps) {
  const isFinalPhase = phase === 'final'
  const saveLabel = isFinalPhase ? 'Complete final verification' : 'Submit application'
  const splitGridSx = isFinalPhase ? VERIFY_DOCUMENT_SPLIT_GRID_SX : undefined

  const rejectedDocumentsSection =
    rejectedDocuments.length > 0 ? (
      <VerifyRejectedDocumentsSection
        entries={rejectedDocuments}
        gridSx={splitGridSx}
        onPreview={onRejectedPreview}
        onVerify={onRejectedVerify}
        onReject={onRejectedReject}
        onRequestReupload={onRejectedReupload}
        onGltsUpload={onRejectedGltsUpload}
      />
    ) : null

  const documentChecklistsSection = (
    <VerifyDocumentChecklistsPanel
      countryTitle={overview.countryName}
      travelerDocuments={selectedRow && detail ? travelerChecklistDocuments : []}
      globalDocuments={globalChecklistDocuments}
      gridSx={splitGridSx}
      onTravelerPreview={documentId => onPreview(documentId, 'traveler')}
      onTravelerVerify={onTravelerVerify}
      onTravelerReject={onTravelerReject}
      onTravelerRequestReupload={onTravelerRequestReupload}
      onTravelerGltsUpload={onGltsUpload}
      onGlobalPreview={documentId => onPreview(documentId, 'global')}
      onGlobalVerify={onGlobalVerify}
      onGlobalReject={onGlobalReject}
      onGlobalRequestReupload={onGlobalRequestReupload}
    />
  )

  const documentsPane = (
    <Stack spacing={2}>
      {rejectedDocumentsSection}
      {documentChecklistsSection}
    </Stack>
  )

  return (
    <>
      <VerifyDocumentsTravelerSection
        rows={rows}
        isBulk={isBulk}
        gltsApplicationId={overview.gltsApplicationId}
        gltsBatchId={overview.gltsBatchId}
        summaryOverview={summaryOverview}
        detail={detail}
        applicationId={applicationId}
        selectedTravelerId={selectedTravelerId}
        onSelectTraveler={onSelectTraveler}
      />

      <VerifyDocumentsTimeline
        steps={timelineSteps}
        multiTraveler={rows.filter(r => r.status !== 'processing').length > 1}
      />

      {isFinalPhase ? (
        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
            {documentsPane}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0, display: 'flex' }}>
            <VerifyFinalVerificationChecklist />
          </Grid>
        </Grid>
      ) : (
        documentsPane
      )}

      <AdminFullPageFormFooter
        onCancel={onBack}
        cancelLabel="Back to listing"
        onDraft={onSaveDraft}
        draftLabel="Save draft"
        onSave={onSubmit}
        saveLabel={saveLabel}
        extraActions={
          <Button
            label="View Form"
            variant="outlined"
            startIcon={<FileText size={14} />}
            onClick={onViewForm}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          />
        }
      />
    </>
  )
}

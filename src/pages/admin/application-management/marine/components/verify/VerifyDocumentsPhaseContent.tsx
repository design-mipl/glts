import { useEffect, useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { Grid, Stack } from '@mui/material'
import { Button, Tabs } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { VerifyDocumentsTravelerSection } from './VerifyDocumentsTravelerSection'
import { VerifyDocumentsTimeline } from './VerifyDocumentsTimeline'
import {
  VERIFY_DOCUMENT_SPLIT_GRID_SX,
  VerifyDocumentChecklistsPanel,
  VerifyDocumentsTabPanel,
} from './VerifyDocumentChecklistSection'
import { VerifyRejectedDocumentsSection } from './VerifyRejectedDocumentsSection'
import { VerifyFinalVerificationChecklist } from './VerifyFinalVerificationChecklist'
import { VerifyOriginalDocumentsSection } from './VerifyOriginalDocumentsSection'
import {
  isOriginalVerifyDocument,
  type VerifyOverviewData,
  type VerifyRejectedDocumentEntry,
} from '../../utils/verifyDocumentsUtils'
import { resolveOriginalRequiredDocuments } from '@/shared/utils/originalDocumentCollectionUtils'
import { PHYSICAL_DOCUMENT_LABEL } from '@/shared/constants/documentRequirementLabels'

export type VerifyDocumentsPhase = 'initial' | 'final'

type VerifyDocumentsTab = 'checklist' | 'original'

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
  onTravelerVerify: (document: ApplicantDocumentItem) => void
  onTravelerReject: (document: ApplicantDocumentItem) => void
  onTravelerRequestReupload: (document: ApplicantDocumentItem) => void
  onGltsUpload: (document: ApplicantDocumentItem) => void
  onGlobalVerify: (document: ApplicantDocumentItem) => void
  onGlobalReject: (document: ApplicantDocumentItem) => void
  onGlobalRequestReupload: (document: ApplicantDocumentItem) => void
  onRejectedPreview: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedVerify: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedReject: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedReupload: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedGltsUpload: (entry: VerifyRejectedDocumentEntry) => void
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  onOriginalCollectionChange?: (collection: OriginalDocumentCollectionState) => void
  onOriginalReceivedSubmit?: (collection: OriginalDocumentCollectionState) => void
  onBack: () => void
  onSaveDraft: () => void
  onSubmit: () => void
  onViewForm: () => void
  readOnly?: boolean
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
  countryId,
  visaOfferingId,
  jurisdictionId,
  onOriginalCollectionChange,
  onOriginalReceivedSubmit,
  onBack,
  onSaveDraft,
  onSubmit,
  onViewForm,
  readOnly = false,
}: VerifyDocumentsPhaseContentProps) {
  const isFinalPhase = phase === 'final'
  const saveLabel = isFinalPhase ? 'Complete final verification' : 'Submit application'
  const splitGridSx = isFinalPhase ? VERIFY_DOCUMENT_SPLIT_GRID_SX : undefined
  const [activeTab, setActiveTab] = useState<VerifyDocumentsTab>('checklist')

  const digitalTravelerDocuments = useMemo(
    () => travelerChecklistDocuments.filter(doc => !isOriginalVerifyDocument(doc)),
    [travelerChecklistDocuments],
  )

  const showOriginalTab = useMemo(() => {
    if (countryId && visaOfferingId) {
      return resolveOriginalRequiredDocuments(countryId, visaOfferingId).length > 0
    }
    return selectedRow?.documents.some(doc => doc.originalDocument) ?? false
  }, [countryId, visaOfferingId, selectedRow?.documents])

  useEffect(() => {
    if (!showOriginalTab && activeTab === 'original') {
      setActiveTab('checklist')
    }
  }, [showOriginalTab, activeTab])

  const tabItems = useMemo(
    () => [
      { value: 'checklist', label: 'Document check' },
      ...(showOriginalTab ? [{ value: 'original', label: PHYSICAL_DOCUMENT_LABEL }] : []),
    ],
    [showOriginalTab],
  )

  const rejectedDocumentsSection =
    rejectedDocuments.length > 0 ? (
      <VerifyRejectedDocumentsSection
        entries={rejectedDocuments}
        gridSx={splitGridSx}
        previewOnly={readOnly}
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
      travelerDocuments={selectedRow && detail ? digitalTravelerDocuments : []}
      globalDocuments={globalChecklistDocuments}
      gridSx={splitGridSx}
      previewOnly={readOnly}
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

  const originalDocumentsSection = (
    <VerifyOriginalDocumentsSection
      selectedRow={selectedRow}
      countryId={countryId}
      visaOfferingId={visaOfferingId}
      readOnly={readOnly}
      onCollectionChange={onOriginalCollectionChange}
      onReceivedSubmit={onOriginalReceivedSubmit}
    />
  )

  const documentsPane = (
    <VerifyDocumentsTabPanel>
      <Stack spacing={2}>
        {tabItems.length > 1 ? (
          <Tabs
            value={activeTab}
            onChange={value => setActiveTab(value as VerifyDocumentsTab)}
            variant="underline"
            size="sm"
            items={tabItems}
          />
        ) : null}
        {activeTab === 'checklist' ? (
          <>
            {rejectedDocumentsSection}
            {documentChecklistsSection}
          </>
        ) : null}
        {activeTab === 'original' ? originalDocumentsSection : null}
      </Stack>
    </VerifyDocumentsTabPanel>
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
        summaryApplicationId={applicationId}
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
            <VerifyFinalVerificationChecklist
              countryId={countryId}
              visaOfferingId={visaOfferingId}
              jurisdictionId={jurisdictionId}
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      ) : (
        documentsPane
      )}

      <AdminFullPageFormFooter
        onCancel={onBack}
        cancelLabel="Back to listing"
        onDraft={readOnly ? undefined : onSaveDraft}
        draftLabel="Save draft"
        onSave={readOnly ? undefined : onSubmit}
        saveLabel={saveLabel}
        extraActions={
          <Button
            label={readOnly ? 'View form' : 'View Form'}
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

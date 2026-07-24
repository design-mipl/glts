import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Grid, Stack } from '@mui/material'
import { BaseCard, Button, Tabs } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  VerifyDocumentChecklistsPanel,
  VerifyDocumentsTabPanel,
} from './VerifyDocumentChecklistSection'
import { VerifyRejectedDocumentsSection } from './VerifyRejectedDocumentsSection'
import { VerifyFinalVerificationChecklist } from './VerifyFinalVerificationChecklist'
import { VerifyOriginalDocumentsSection } from './VerifyOriginalDocumentsSection'
import { VerifyPassengerWorkspace } from './VerifyPassengerWorkspace'
import {
  filterVerifyTravelers,
  isOriginalVerifyDocument,
  type VerifyOverviewData,
  type VerifyRejectedDocumentEntry,
  type VerifyTravelerListFilter,
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
  const [activeTab, setActiveTab] = useState<VerifyDocumentsTab>('checklist')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<VerifyTravelerListFilter>('all')

  const selectableRows = useMemo(() => {
    const ready = rows.filter(r => r.status !== 'processing')
    return ready.length > 0 ? ready : rows
  }, [rows])

  const singleListing = !isBulk && selectableRows.length <= 1
  const multiTraveler = selectableRows.length > 1

  const filteredRows = useMemo(
    () => filterVerifyTravelers(selectableRows, search, filter),
    [selectableRows, search, filter],
  )

  useEffect(() => {
    if (filteredRows.length === 0) return
    if (selectedTravelerId && filteredRows.some(row => row.id === selectedTravelerId)) return
    onSelectTraveler(filteredRows[0].id)
  }, [filteredRows, selectedTravelerId, onSelectTraveler])

  useEffect(() => {
    setActiveTab('checklist')
  }, [selectedTravelerId])

  const selectedIndex = useMemo(
    () => filteredRows.findIndex(row => row.id === selectedTravelerId),
    [filteredRows, selectedTravelerId],
  )

  const goPrevious = () => {
    if (selectedIndex <= 0) return
    onSelectTraveler(filteredRows[selectedIndex - 1].id)
  }

  const goNext = () => {
    if (selectedIndex < 0 || selectedIndex >= filteredRows.length - 1) return
    onSelectTraveler(filteredRows[selectedIndex + 1].id)
  }

  const handleSaveAndNext = () => {
    onSaveDraft()
    if (selectedIndex >= 0 && selectedIndex < filteredRows.length - 1) {
      onSelectTraveler(filteredRows[selectedIndex + 1].id)
    }
  }

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

  const detailContent = isFinalPhase ? (
    <Grid container spacing={2} alignItems="stretch">
      <Grid size={{ xs: 12, lg: 7 }} sx={{ minWidth: 0 }}>
        {documentsPane}
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }} sx={{ minWidth: 0, display: 'flex' }}>
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
  )

  return (
    <Stack spacing={2}>
      <VerifyPassengerWorkspace
        rows={selectableRows}
        filteredRows={filteredRows}
        overview={overview}
        singleListing={singleListing}
        selectedTravelerId={selectedTravelerId}
        onSelectTraveler={onSelectTraveler}
        selectedRow={selectedRow}
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        timelineSteps={timelineSteps}
        multiTraveler={multiTraveler}
        detail={detail}
        applicationId={applicationId}
        detailContent={detailContent}
      />

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
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            <Button
              label="Previous passenger"
              variant="neutral"
              startIcon={<ChevronLeft size={14} />}
              onClick={goPrevious}
              disabled={selectedIndex <= 0}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
            <Button
              label={readOnly ? 'View form' : 'View Form'}
              variant="outlined"
              startIcon={<FileText size={14} />}
              onClick={onViewForm}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
            <Button
              label="Back to listing"
              variant="neutral"
              onClick={onBack}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
          >
            {!readOnly ? (
              <>
                <Button
                  label="Save draft"
                  variant="soft"
                  color="primary"
                  onClick={onSaveDraft}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
                <Button
                  label="Save"
                  variant="outlined"
                  color="primary"
                  onClick={onSaveDraft}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
                <Button
                  label="Save & Next"
                  variant="contained"
                  color="primary"
                  endIcon={<ChevronRight size={14} />}
                  onClick={handleSaveAndNext}
                  disabled={selectedIndex < 0 || selectedIndex >= filteredRows.length - 1}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
                <Button
                  label={saveLabel}
                  variant="soft"
                  color="primary"
                  onClick={onSubmit}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
              </>
            ) : null}
          </Stack>
        </Stack>
      </BaseCard>
    </Stack>
  )
}

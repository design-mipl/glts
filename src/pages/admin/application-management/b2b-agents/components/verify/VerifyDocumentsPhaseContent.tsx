import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BaseCard, Button, Tabs } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
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
  splitRejectedVerifyDocuments,
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
  onOriginalDocumentReceivedChange?: (documentId: string, received: boolean) => void
  onOriginalReceivedRemarksSave?: (remarks: string) => void
  onSaveDraft: () => void
  onSubmit: () => void
  readOnly?: boolean
  /** Admin B2B Document Not Required — files optional; checklist still required. */
  documentsNotRequired?: boolean
  processingStatus?: {
    currentStatusId: string
    countryId?: string
    countryName?: string
    visaTypeLabel?: string
    visaOfferingId?: string
    modalOpen: boolean
    onOpenModal: () => void
    onCloseModal: () => void
    onUpdated: () => void
  }
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
  onOriginalDocumentReceivedChange,
  onOriginalReceivedRemarksSave,
  onSaveDraft,
  onSubmit,
  readOnly = false,
  documentsNotRequired = false,
  processingStatus,
}: VerifyDocumentsPhaseContentProps) {
  const isFinalPhase = phase === 'final'
  const saveLabel = isFinalPhase ? 'Submit' : 'Submit application'
  const [activeTab, setActiveTab] = useState<VerifyDocumentsTab>('checklist')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<VerifyTravelerListFilter>('all')

  const selectableRows = useMemo(() => {
    const ready = rows.filter(r => r.status !== 'processing')
    return ready.length > 0 ? ready : rows
  }, [rows])

  const singleListing = !isBulk && selectableRows.length <= 1

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

  const { flaggedDuringQc, rejectedDocuments: customerRejectedDocuments } = useMemo(
    () => splitRejectedVerifyDocuments(rejectedDocuments),
    [rejectedDocuments],
  )

  const rejectedDocumentsSection =
    flaggedDuringQc.length > 0 || customerRejectedDocuments.length > 0 ? (
      <Stack spacing={1.5}>
        {customerRejectedDocuments.length > 0 ? (
          <VerifyRejectedDocumentsSection
            entries={customerRejectedDocuments}
            variant="customer_rejected"
            previewOnly={readOnly}
            onPreview={onRejectedPreview}
            onVerify={onRejectedVerify}
            onReject={onRejectedReject}
            onRequestReupload={onRejectedReupload}
            onGltsUpload={onRejectedGltsUpload}
          />
        ) : null}
        {flaggedDuringQc.length > 0 ? (
          <VerifyRejectedDocumentsSection
            entries={flaggedDuringQc}
            variant="qc_flagged"
            previewOnly={readOnly}
            onPreview={onRejectedPreview}
            onVerify={onRejectedVerify}
            onReject={onRejectedReject}
            onRequestReupload={onRejectedReupload}
            onGltsUpload={onRejectedGltsUpload}
          />
        ) : null}
      </Stack>
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
      onDocumentReceivedChange={onOriginalDocumentReceivedChange}
      onReceivedRemarksSave={onOriginalReceivedRemarksSave}
    />
  )

  const documentsPane = (
    <VerifyDocumentsTabPanel>
      <Stack spacing={2} sx={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
        {tabItems.length > 1 ? (
          <Box sx={{ flexShrink: 0 }}>
            <Tabs
              value={activeTab}
              onChange={value => setActiveTab(value as VerifyDocumentsTab)}
              variant="underline"
              size="sm"
              items={tabItems}
            />
          </Box>
        ) : null}
        <Box sx={{ flex: 1, height: 0, minHeight: 0, overflow: 'auto' }}>
          <Stack spacing={2}>
            {activeTab === 'checklist' ? (
              <>
                {rejectedDocumentsSection}
                {documentChecklistsSection}
              </>
            ) : null}
            {activeTab === 'original' ? originalDocumentsSection : null}
          </Stack>
        </Box>
      </Stack>
    </VerifyDocumentsTabPanel>
  )

  const detailContent = isFinalPhase ? (
    <Box
      sx={{
        flex: 1,
        height: 0,
        minHeight: 0,
        alignSelf: 'stretch',
        width: '100%',
        overflow: { xs: 'auto', lg: 'hidden' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="stretch"
        sx={{
          flex: 1,
          minHeight: 0,
          height: '100%',
          overflow: { lg: 'hidden' },
          gridAutoRows: { lg: 'minmax(0, 1fr)' },
        }}
      >
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            minWidth: 0,
            minHeight: 0,
            height: { lg: '100%' },
            maxHeight: { lg: '100%' },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {documentsPane}
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            minWidth: 0,
            minHeight: 0,
            height: { lg: '100%' },
            maxHeight: { lg: '100%' },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <VerifyFinalVerificationChecklist
              applicationId={applicationId}
              countryId={countryId}
              visaOfferingId={visaOfferingId}
              jurisdictionId={jurisdictionId}
              readOnly={readOnly}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box
      sx={{
        flex: 1,
        height: 0,
        minHeight: 0,
        alignSelf: 'stretch',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {documentsPane}
    </Box>
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
        detail={detail}
        applicationId={applicationId}
        workTabs={[
          {
            value: 'documents',
            label: 'Documents',
            content: detailContent,
          },
        ]}
        emptyMessage="Select a passenger to review documents and complete verification."
        workTabHint={
          documentsNotRequired ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.45 }}>
              Documents are optional for this application. Complete the verification checklist to move the queue.
            </Typography>
          ) : undefined
        }
        processingStatus={processingStatus}
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

import { useEffect, useMemo, useState } from 'react'
import { Grid, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  VERIFY_DOCUMENT_SPLIT_GRID_SX,
  VerifyDocumentChecklistsPanel,
  VerifyDocumentsTabPanel,
} from '../verify/VerifyDocumentChecklistSection'

import { VerifyRejectedDocumentsSection } from '../verify/VerifyRejectedDocumentsSection'
import { VerifyOriginalDocumentsSection } from '../verify/VerifyOriginalDocumentsSection'
import { QcCheckChecklist } from './QcCheckChecklist'
import {
  isOriginalVerifyDocument,
  type VerifyOverviewData,
  type VerifyRejectedDocumentEntry,
} from '../../utils/verifyDocumentsUtils'
import { resolveOriginalRequiredDocuments } from '@/shared/utils/originalDocumentCollectionUtils'
import { PHYSICAL_DOCUMENT_LABEL } from '@/shared/constants/documentRequirementLabels'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'

type QcDocumentTab = 'checklist' | 'original'

interface ViewFormQcCheckSectionProps {
  overview: VerifyOverviewData
  detail: ApplicationDetailViewModel
  selectedRow: UploadQueueRow | null
  rejectedDocuments: VerifyRejectedDocumentEntry[]
  travelerChecklistDocuments: ApplicantDocumentItem[]
  globalChecklistDocuments: ApplicantDocumentItem[]
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
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
  onOriginalCollectionChange?: (collection: OriginalDocumentCollectionState) => void
  onOriginalReceivedSubmit?: (collection: OriginalDocumentCollectionState) => void
  readOnly?: boolean
}

export function ViewFormQcCheckSection({
  overview,
  detail,
  selectedRow,
  rejectedDocuments,
  travelerChecklistDocuments,
  globalChecklistDocuments,
  countryId,
  visaOfferingId,
  jurisdictionId,
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
  onOriginalCollectionChange,
  onOriginalReceivedSubmit,
  readOnly = false,
}: ViewFormQcCheckSectionProps) {
  const [activeTab, setActiveTab] = useState<QcDocumentTab>('checklist')

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
        gridSx={VERIFY_DOCUMENT_SPLIT_GRID_SX}
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
      gridSx={VERIFY_DOCUMENT_SPLIT_GRID_SX}
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
            onChange={value => setActiveTab(value as QcDocumentTab)}
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
    <Grid container spacing={2} alignItems="stretch">
      <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
        {documentsPane}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0, display: 'flex' }}>
        <QcCheckChecklist
          countryId={countryId}
          visaOfferingId={visaOfferingId}
          jurisdictionId={jurisdictionId}
          readOnly={readOnly}
        />
      </Grid>
    </Grid>
  )
}

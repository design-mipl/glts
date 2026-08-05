import { useEffect, useMemo, useState } from 'react'
import { Box, Grid, Stack } from '@mui/material'
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
  splitRejectedVerifyDocuments,
  type VerifyOverviewData,
  type VerifyRejectedDocumentEntry,
} from '../../utils/verifyDocumentsUtils'
import { resolveOriginalRequiredDocuments } from '@/shared/utils/originalDocumentCollectionUtils'
import { PHYSICAL_DOCUMENT_LABEL } from '@/shared/constants/documentRequirementLabels'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'
import type { CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import type { QcCheckOutcome } from '../../config/qcCheckChecklistConfig'

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
  docsQcTemplate: CountryQcChecklistTemplate
  docsQcChecked: Record<string, boolean>
  docsQcOutcome: QcCheckOutcome | ''
  onDocsQcCheckedChange: (itemId: string, value: boolean) => void
  onDocsQcOutcomeChange: (outcome: QcCheckOutcome | '') => void
  onDocsQcSubmit?: () => void
  docsQcSubmitLabel?: string
  docsQcSubmitHint?: string
  docsQcSubmitDisabled?: boolean
  onPreview: (documentId: string, scope: 'traveler' | 'global') => void
  onTravelerVerify: (document: ApplicantDocumentItem) => void
  onTravelerReject: (document: ApplicantDocumentItem) => void
  onTravelerRequestReupload: (document: ApplicantDocumentItem) => void
  onGlobalVerify: (document: ApplicantDocumentItem) => void
  onGlobalReject: (document: ApplicantDocumentItem) => void
  onGlobalRequestReupload: (document: ApplicantDocumentItem) => void
  onRejectedPreview: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedVerify: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedReject: (entry: VerifyRejectedDocumentEntry) => void
  onRejectedReupload: (entry: VerifyRejectedDocumentEntry) => void
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
  onPreview,
  onTravelerVerify,
  onTravelerReject,
  onTravelerRequestReupload,
  onGlobalVerify,
  onGlobalReject,
  onGlobalRequestReupload,
  onRejectedPreview,
  onRejectedVerify,
  onRejectedReject,
  onRejectedReupload,
  onOriginalCollectionChange,
  onOriginalReceivedSubmit,
  readOnly = false,
  docsQcTemplate,
  docsQcChecked,
  docsQcOutcome,
  onDocsQcCheckedChange,
  onDocsQcOutcomeChange,
  onDocsQcSubmit,
  docsQcSubmitLabel,
  docsQcSubmitHint,
  docsQcSubmitDisabled,
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
          />
        ) : null}
      </Stack>
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
      <Stack spacing={2} sx={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
        {tabItems.length > 1 ? (
          <Box sx={{ flexShrink: 0 }}>
            <Tabs
              value={activeTab}
              onChange={value => setActiveTab(value as QcDocumentTab)}
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

  return (
    <Box
      sx={{
        // height: 0 + flex: 1 forces this flex child to the parent's remaining
        // space instead of growing with content (which breaks nested scroll).
        flex: 1,
        height: 0,
        minHeight: 0,
        alignSelf: 'stretch',
        width: '100%',
        // Mobile: stack scrolls as one column. Desktop: panes scroll independently.
        overflow: { xs: 'auto', md: 'hidden' },
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
          overflow: { md: 'hidden' },
          // Without minmax(0, 1fr), CSS grid rows size to content and nested
          // overflow:auto never activates — parents clip with no scrollbar.
          gridAutoRows: { md: 'minmax(0, 1fr)' },
        }}
      >
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            minWidth: 0,
            minHeight: 0,
            height: { md: '100%' },
            maxHeight: { md: '100%' },
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
          size={{ xs: 12, md: 6 }}
          sx={{
            minWidth: 0,
            minHeight: 0,
            height: { md: '100%' },
            maxHeight: { md: '100%' },
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
            <QcCheckChecklist
              template={docsQcTemplate}
              checked={docsQcChecked}
              outcome={docsQcOutcome}
              onCheckedChange={onDocsQcCheckedChange}
              onOutcomeChange={onDocsQcOutcomeChange}
              submitLabel={docsQcSubmitLabel}
              submitHint={docsQcSubmitHint}
              submitDisabled={docsQcSubmitDisabled}
              onSubmit={onDocsQcSubmit}
              readOnly={readOnly}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

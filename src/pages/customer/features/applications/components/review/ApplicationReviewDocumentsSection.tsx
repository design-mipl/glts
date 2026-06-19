import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import {
  CustomerChecklistPanel,
  CustomerDocumentChecklist,
  CustomerTabs,
  type CustomerChecklistItem,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { OriginalDocumentCollectionPanel } from '../originalCollection/OriginalDocumentCollectionPanel'
import { SimpleDocumentRequirementPanel } from '../documentWorkflow'
import { isSimpleDocumentRequirement } from '@/shared/utils/applicantDocumentWorkflowUtils'
import { ensureOriginalDocumentCollectionState } from '@/shared/utils/originalDocumentCollectionUtils'
import { PHYSICAL_DOCUMENT_LABEL } from '@/shared/constants/documentRequirementLabels'
import type { OriginalRequiredDocumentRef } from '@/shared/types/originalDocumentCollection'
import type { UploadQueueRow } from '../../data/applicationFlowData'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

type DocumentTab = 'checklist' | 'original'

function isDigitalDocument(originalDocument?: boolean): boolean {
  return !originalDocument
}

interface ApplicationReviewDocumentsSectionProps {
  countryName: string
  selectedRow: UploadQueueRow
  checklistItems: CustomerChecklistItem[]
  globalChecklistItems: CustomerChecklistItem[]
  onReuploadDocument?: (item: CustomerChecklistItem) => void
  onPreviewItem: (item: CustomerChecklistItem, scope: 'traveler' | 'global') => void
}

export function ApplicationReviewDocumentsSection({
  countryName,
  selectedRow,
  checklistItems,
  globalChecklistItems,
  onReuploadDocument,
  onPreviewItem,
}: ApplicationReviewDocumentsSectionProps) {
  const colors = usePublicBrandColors()
  const [activeTab, setActiveTab] = useState<DocumentTab>('checklist')

  const originalRequiredDocuments = useMemo<OriginalRequiredDocumentRef[]>(
    () =>
      selectedRow.documents
        .filter(doc => doc.originalDocument)
        .map(doc => ({ documentId: doc.documentId, name: doc.name })),
    [selectedRow.documents],
  )

  const showOriginalTab = originalRequiredDocuments.length > 0

  const resolvedOriginalCollection = useMemo(
    () =>
      ensureOriginalDocumentCollectionState(
        selectedRow.originalDocumentCollection,
        originalRequiredDocuments,
      ),
    [selectedRow.originalDocumentCollection, originalRequiredDocuments],
  )

  const digitalSimpleDocuments = useMemo(
    () =>
      selectedRow.documents.filter(
        doc => isSimpleDocumentRequirement(doc.documentId) && isDigitalDocument(doc.originalDocument),
      ),
    [selectedRow.documents],
  )

  const digitalChecklistItems = useMemo(
    () => checklistItems.filter(item => {
      const doc = selectedRow.documents.find(d => d.documentId === item.id)
      return isDigitalDocument(doc?.originalDocument)
    }),
    [checklistItems, selectedRow.documents],
  )

  useEffect(() => {
    if (!showOriginalTab && activeTab === 'original') {
      setActiveTab('checklist')
    }
  }, [showOriginalTab, activeTab])

  const tabItems = useMemo(
    () => [
      { value: 'checklist' as const, label: 'Document check' },
      ...(showOriginalTab
        ? [{ value: 'original' as const, label: PHYSICAL_DOCUMENT_LABEL }]
        : []),
    ],
    [showOriginalTab],
  )

  const hasChecklistContent =
    digitalSimpleDocuments.length > 0 || digitalChecklistItems.length > 0 || globalChecklistItems.length > 0

  if (!hasChecklistContent && !showOriginalTab) return null

  return (
    <CustomerChecklistPanel>
      <Stack spacing={2}>
        {tabItems.length > 1 ? (
          <CustomerTabs value={activeTab} onChange={value => setActiveTab(value as DocumentTab)} items={tabItems} />
        ) : null}

        {activeTab === 'checklist' ? (
          <Stack spacing={2}>
            {digitalSimpleDocuments.length > 0 ? (
              <Stack spacing={1.5}>
                {digitalSimpleDocuments.map(doc => (
                  <SimpleDocumentRequirementPanel
                    key={doc.documentId}
                    document={doc}
                    onChange={() => {}}
                    readOnly
                    travelerName={selectedRow.travelerName}
                  />
                ))}
              </Stack>
            ) : null}

            {digitalChecklistItems.length > 0 ? (
              <CustomerDocumentChecklist
                country={countryName}
                items={digitalChecklistItems}
                onReuploadItem={onReuploadDocument}
                onPreviewItem={item => onPreviewItem(item, 'traveler')}
                embedded
              />
            ) : null}

            {globalChecklistItems.length > 0 ? (
              <CustomerDocumentChecklist
                title="Common Document Checklist"
                items={globalChecklistItems}
                onReuploadItem={onReuploadDocument}
                onPreviewItem={item => onPreviewItem(item, 'global')}
                embedded
              />
            ) : null}

            {!hasChecklistContent ? (
              <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
                No digital documents in this checklist yet.
              </Typography>
            ) : null}
          </Stack>
        ) : null}

        {activeTab === 'original' && showOriginalTab ? (
          <Box
            sx={{
              p: 2,
              borderRadius: BORDER_RADIUS.lg,
              border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
              boxShadow: SHADOWS.sm,
              bgcolor: colors.white,
            }}
          >
            <OriginalDocumentCollectionPanel
              documents={originalRequiredDocuments}
              state={resolvedOriginalCollection}
              onChange={() => {}}
              readOnly
              variant="embedded"
            />
          </Box>
        ) : null}
      </Stack>
    </CustomerChecklistPanel>
  )
}

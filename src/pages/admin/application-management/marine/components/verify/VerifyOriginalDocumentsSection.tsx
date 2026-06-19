import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { OriginalDocumentCollectionPanel } from '@/pages/customer/features/applications/components/originalCollection/OriginalDocumentCollectionPanel'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'
import {
  ensureOriginalDocumentCollectionState,
  resolveOriginalRequiredDocuments,
} from '@/shared/utils/originalDocumentCollectionUtils'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PHYSICAL_DOCUMENTS_LABEL } from '@/shared/constants/documentRequirementLabels'

interface VerifyOriginalDocumentsSectionProps {
  selectedRow: UploadQueueRow | null
  countryId?: string
  visaOfferingId?: string
  onCollectionChange?: (collection: OriginalDocumentCollectionState) => void
  onReceivedSubmit?: (collection: OriginalDocumentCollectionState) => void
}

export function VerifyOriginalDocumentsSection({
  selectedRow,
  countryId,
  visaOfferingId,
  onCollectionChange,
  onReceivedSubmit,
}: VerifyOriginalDocumentsSectionProps) {
  const colors = usePublicBrandColors()

  const originalRequiredDocuments = useMemo(() => {
    if (countryId && visaOfferingId) {
      return resolveOriginalRequiredDocuments(countryId, visaOfferingId)
    }
    return (
      selectedRow?.documents
        .filter(doc => doc.originalDocument)
        .map(doc => ({ documentId: doc.documentId, name: doc.name })) ?? []
    )
  }, [countryId, visaOfferingId, selectedRow?.documents])

  const resolvedCollection = useMemo(() => {
    if (!selectedRow) return undefined
    return ensureOriginalDocumentCollectionState(
      selectedRow.originalDocumentCollection,
      originalRequiredDocuments,
    )
  }, [selectedRow, originalRequiredDocuments])

  if (!selectedRow) {
    return (
      <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
        Select a traveler to review {PHYSICAL_DOCUMENTS_LABEL.toLowerCase()} collection details.
      </Typography>
    )
  }

  if (originalRequiredDocuments.length === 0) {
    return (
      <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
        No {PHYSICAL_DOCUMENTS_LABEL.toLowerCase()} are required for this visa checklist.
      </Typography>
    )
  }

  if (!resolvedCollection) return null

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <OriginalDocumentCollectionPanel
        documents={originalRequiredDocuments}
        state={resolvedCollection}
        onChange={next => onCollectionChange?.(next)}
        onReceivedSubmit={onReceivedSubmit}
        showReceivedAction
        variant="embedded"
      />
    </Box>
  )
}

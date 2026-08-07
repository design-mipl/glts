import { useEffect, useMemo, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { Badge, Button, Checkbox, FormField, Textarea } from '@/design-system/UIComponents'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  ensureOriginalDocumentCollectionState,
  resolveOriginalRequiredDocuments,
} from '@/shared/utils/originalDocumentCollectionUtils'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  PHYSICAL_DOCUMENT_COLLECTION_LABEL,
  PHYSICAL_DOCUMENT_RECEIPT_LABEL,
  PHYSICAL_DOCUMENTS_LABEL,
} from '@/shared/constants/documentRequirementLabels'
import { OriginalDocumentSendPlanSummary } from '@/pages/admin/application-management/shared/components/OriginalDocumentSendPlanSummary'

interface VerifyOriginalDocumentsSectionProps {
  selectedRow: UploadQueueRow | null
  countryId?: string
  visaOfferingId?: string
  /** When true, receipt toggles and remarks are locked (view-only workspace). */
  readOnly?: boolean
  onDocumentReceivedChange?: (documentId: string, received: boolean) => void
  onReceivedRemarksSave?: (remarks: string) => void
}

export function VerifyOriginalDocumentsSection({
  selectedRow,
  countryId,
  visaOfferingId,
  readOnly = false,
  onDocumentReceivedChange,
  onReceivedRemarksSave,
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

  const physicalDocuments = useMemo(() => {
    if (!selectedRow) return []
    if (originalRequiredDocuments.length > 0) {
      const byId = new Map(selectedRow.documents.map(doc => [doc.documentId, doc]))
      return originalRequiredDocuments.map(ref => {
        const existing = byId.get(ref.documentId)
        return (
          existing ?? {
            documentId: ref.documentId,
            name: ref.name,
            required: true,
            status: 'missing' as const,
            originalDocument: true,
            originalDocumentReceived: false,
          }
        )
      })
    }
    return selectedRow.documents.filter(doc => doc.originalDocument)
  }, [selectedRow, originalRequiredDocuments])

  const receivedCount = physicalDocuments.filter(doc => doc.originalDocumentReceived).length
  const totalCount = physicalDocuments.length

  const [remarksDraft, setRemarksDraft] = useState(resolvedCollection?.receivedRemarks ?? '')

  useEffect(() => {
    setRemarksDraft(resolvedCollection?.receivedRemarks ?? '')
  }, [resolvedCollection?.receivedRemarks, selectedRow?.id])

  if (!selectedRow) {
    return (
      <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
        Select a traveler to review {PHYSICAL_DOCUMENTS_LABEL.toLowerCase()} sending details.
      </Typography>
    )
  }

  if (originalRequiredDocuments.length === 0 && physicalDocuments.length === 0) {
    return (
      <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
        No {PHYSICAL_DOCUMENTS_LABEL.toLowerCase()} are required for this visa checklist.
      </Typography>
    )
  }

  if (!resolvedCollection) return null

  const handleMarkAllReceived = () => {
    if (readOnly) return
    for (const doc of physicalDocuments) {
      if (!doc.originalDocumentReceived) {
        onDocumentReceivedChange?.(doc.documentId, true)
      }
    }
  }

  const handleSaveRemarks = () => {
    if (readOnly) return
    onReceivedRemarksSave?.(remarksDraft.trim())
  }

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
      <Stack spacing={2.5}>
        <Stack spacing={1.25}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
            {PHYSICAL_DOCUMENT_COLLECTION_LABEL}
          </Typography>
          <OriginalDocumentSendPlanSummary state={resolvedCollection} />
        </Stack>

        <Divider />

        <Stack spacing={1.25}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
            {PHYSICAL_DOCUMENT_RECEIPT_LABEL}
          </Typography>
          <Typography sx={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.45 }}>
            Mark each physical original when it arrives at GLTS.
          </Typography>

          <Stack spacing={0.75} sx={{ pl: 0.5 }}>
            {physicalDocuments.map(doc => (
              <Stack
                key={doc.documentId}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ py: 0.25 }}
              >
                <Checkbox
                  size="sm"
                  label={doc.name}
                  checked={Boolean(doc.originalDocumentReceived)}
                  disabled={readOnly}
                  onChange={checked => onDocumentReceivedChange?.(doc.documentId, checked)}
                />
                <Badge
                  label={doc.originalDocumentReceived ? 'Received' : 'Pending'}
                  color={doc.originalDocumentReceived ? 'info' : 'warning'}
                  size="sm"
                />
              </Stack>
            ))}
          </Stack>

          <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, pl: 0.5 }}>
            Documents received: {receivedCount} / {totalCount}
          </Typography>

          {readOnly ? (
            resolvedCollection.receivedRemarks?.trim() ? (
              <Stack spacing={0.25}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
                  Remarks
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                  {resolvedCollection.receivedRemarks}
                </Typography>
              </Stack>
            ) : null
          ) : (
            <>
              <FormField label="Remarks">
                <Textarea
                  value={remarksDraft}
                  onChange={setRemarksDraft}
                  placeholder="Add remarks for received physical documents"
                  rows={2}
                  fullWidth
                />
              </FormField>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  label="Mark all received"
                  size="sm"
                  variant="outlined"
                  disabled={totalCount === 0 || receivedCount === totalCount}
                  onClick={handleMarkAllReceived}
                />
                <Button label="Save remarks" size="sm" onClick={handleSaveRemarks} />
              </Box>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

import { Box, Stack, Typography } from '@mui/material'
import { FileText } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  downloadWorkflowDocumentFileName,
  formatWorkflowSummary,
  isSimpleDocumentRequirement,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { ApplicantDocumentItem } from '../data/applicationFlowData'
import type { UploadQueueRow } from '../data/applicationFlowData'
import { PassportPreviewCard } from './PassportPreviewCard'

interface CustomerDocumentPreviewModalProps {
  open: boolean
  onClose: () => void
  document: ApplicantDocumentItem | null
  travelerRow?: UploadQueueRow | null
  globalFileName?: string
}

function resolvePreviewFileName(
  document: ApplicantDocumentItem,
  globalFileName?: string,
): string | undefined {
  if (isSimpleDocumentRequirement(document.documentId)) {
    return downloadWorkflowDocumentFileName(document) ?? undefined
  }
  return globalFileName?.trim() || `${document.name.replace(/\s+/g, '_')}.pdf`
}

export function CustomerDocumentPreviewModal({
  open,
  onClose,
  document,
  travelerRow,
  globalFileName,
}: CustomerDocumentPreviewModalProps) {
  const colors = usePublicBrandColors()

  if (!document) return null

  const fileName = resolvePreviewFileName(document, globalFileName)
  const workflowSummary = formatWorkflowSummary(document)
  const showPassportPreview = document.documentId === 'passport' && travelerRow

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={document.name}
      subtitle={fileName}
      size="lg"
    >
      <Stack spacing={2}>
        {showPassportPreview ? <PassportPreviewCard row={travelerRow} /> : null}

        {!showPassportPreview ? (
          <Box
            sx={{
              borderRadius: BORDER_RADIUS.lg,
              border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
              bgcolor: colors.surface,
              minHeight: 220,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: BORDER_RADIUS.lg,
                display: 'grid',
                placeItems: 'center',
                bgcolor: colors.white,
                border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
                color: colors.textMuted,
              }}
            >
              <FileText size={22} />
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
              {fileName ?? document.name}
            </Typography>
            {workflowSummary ? (
              <Typography sx={{ fontSize: 13, color: colors.textSecondary, maxWidth: 420 }}>
                {workflowSummary}
              </Typography>
            ) : (
              <Typography sx={{ fontSize: 13, color: colors.textMuted, maxWidth: 420 }}>
                Document preview will open here when the file viewer is connected.
              </Typography>
            )}
          </Box>
        ) : null}
      </Stack>
    </Modal>
  )
}

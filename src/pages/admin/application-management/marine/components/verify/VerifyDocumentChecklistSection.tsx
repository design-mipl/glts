import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Eye, RotateCcw, ShieldCheck, Upload, XCircle } from 'lucide-react'
import { Badge, BaseCard, Button, IconButton } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem, ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  formatWorkflowSummary,
  isSimpleDocumentRequirement,
  requirementTypeLabel,
  resolveHandlingMode,
  simpleDocumentUploadActionLabel,
  type SimpleDocumentRequirementId,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import {
  documentBadgeColor,
  verifyDocumentBadgeLabel,
} from '../../utils/verifyDocumentsUtils'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

const VERIFY_DOCUMENT_CARD_SX = {
  p: 1.5,
  borderWidth: 1,
  borderColor: 'divider',
} as const

/** Stacked single-column list of document cards. */
export const VERIFY_DOCUMENT_STACK_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
} as const

/** @deprecated Prefer VERIFY_DOCUMENT_STACK_SX — kept for callers that still pass gridSx. */
export const VERIFY_DOCUMENT_GRID_SX = VERIFY_DOCUMENT_STACK_SX

/** @deprecated Prefer VERIFY_DOCUMENT_STACK_SX — multi-column grids removed from verify UI. */
export const VERIFY_DOCUMENT_SPLIT_GRID_SX = VERIFY_DOCUMENT_STACK_SX

export type VerifyDocumentGridSx = SxProps<Theme>

function getVerifyDocumentPanelSx(
  colors: ReturnType<typeof usePublicBrandColors>,
  variant: 'outer' | 'colored',
) {
  return {
    p: 2,
    borderWidth: 1,
    borderColor: colors.checklistBorder,
    bgcolor: variant === 'outer' ? 'background.paper' : colors.checklistMuted,
    boxShadow: 'none',
  } as const
}

export function VerifyDocumentsTabPanel({ children }: { children: ReactNode }) {
  const colors = usePublicBrandColors()

  return (
    <BaseCard sx={getVerifyDocumentPanelSx(colors, 'outer')}>
      {children}
    </BaseCard>
  )
}

interface VerifyDocumentCardProps {
  document: ApplicantDocumentItem
  previewOnly?: boolean
  onPreview: () => void
  onVerify: () => void
  onReject: () => void
  onRequestReupload: () => void
  onGltsUpload?: () => void
}

export function VerifyDocumentCard({
  document,
  previewOnly = false,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
  onGltsUpload,
}: VerifyDocumentCardProps) {
  const status = document.status as ApplicantDocumentStatus
  const workflowSummary = formatWorkflowSummary(document)
  const isSimple = isSimpleDocumentRequirement(document.documentId)
  const arrangeByGlts = isSimple && resolveHandlingMode(document) === 'arrange_by_glts'
  const customerUpload = isSimple && resolveHandlingMode(document) === 'upload_by_applicant'
  const hasFile =
    document.documentId === 'travel-ticket'
      ? Boolean(document.travelTicket?.fileName?.trim())
      : document.documentId === 'insurance'
        ? Boolean(document.insurance?.fileName?.trim())
        : true
  const previewDisabled = !hasFile
  const showReuploadRequest = customerUpload
  const showGltsUpload =
    arrangeByGlts && !hasFile && onGltsUpload && isSimpleDocumentRequirement(document.documentId)
  const pendingGltsArrangement = arrangeByGlts && !hasFile
  const isVerified = status === 'verified'
  const isRejected = status === 'rejected'
  const showVerifyRejectActions =
    !previewOnly && !pendingGltsArrangement && !isVerified && !isRejected
  const showPreview = previewOnly || isVerified || (hasFile && !pendingGltsArrangement)
  const reqType = requirementTypeLabel(document)
  const displayStatus = verifyDocumentBadgeLabel(document)
  const gltsNote = document.reviewComment?.trim() || ''

  return (
    <BaseCard sx={VERIFY_DOCUMENT_CARD_SX}>
      <Stack spacing={1}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          justifyContent="space-between"
          spacing={1}
        >
          <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13, lineHeight: 1.35 }}>
                  {document.name}
                  {document.required ? (
                    <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
                      *
                    </Typography>
                  ) : null}
                </Typography>
                {displayStatus ? (
                  <Badge
                    label={displayStatus}
                    color={documentBadgeColor(status, document)}
                    size="sm"
                  />
                ) : null}
              </Stack>
              {reqType || workflowSummary ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 11, lineHeight: 1.4, display: 'block', mt: 0.35 }}
                >
                  {[reqType, workflowSummary].filter(Boolean).join(' · ')}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={0.5}
            useFlexGap
            alignItems="center"
            justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
            sx={{ flexShrink: 0 }}
          >
            {showGltsUpload && !previewOnly ? (
              <Button
                label={simpleDocumentUploadActionLabel(document.documentId as SimpleDocumentRequirementId)}
                variant="contained"
                size="sm"
                startIcon={<Upload size={14} />}
                onClick={onGltsUpload}
              />
            ) : null}
            {showVerifyRejectActions ? (
              <>
                <IconButton
                  tooltip="Verify"
                  icon={<ShieldCheck size={14} />}
                  variant="soft"
                  color="success"
                  size="sm"
                  onClick={onVerify}
                />
                <IconButton
                  tooltip="Reject"
                  icon={<XCircle size={14} />}
                  variant="soft"
                  color="error"
                  size="sm"
                  onClick={onReject}
                />
              </>
            ) : null}
            {showReuploadRequest && showVerifyRejectActions ? (
              <IconButton
                tooltip="Request re-upload"
                icon={<RotateCcw size={14} />}
                variant="soft"
                color="warning"
                size="sm"
                onClick={onRequestReupload}
              />
            ) : null}
            {showPreview ? (
              <IconButton
                tooltip="Preview"
                icon={<Eye size={14} />}
                variant="soft"
                color="primary"
                size="sm"
                onClick={onPreview}
                disabled={previewDisabled}
              />
            ) : null}
          </Stack>
        </Stack>

        {gltsNote && !isVerified ? (
          <Box
            sx={{
              px: 1.25,
              py: 0.75,
              borderRadius: 1,
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, lineHeight: 1.5, display: 'block' }}
            >
              <Typography component="span" fontWeight={700} sx={{ fontSize: 12, color: 'text.primary' }}>
                GLTS Note:{' '}
              </Typography>
              {gltsNote}
            </Typography>
          </Box>
        ) : null}
      </Stack>
    </BaseCard>
  )
}

interface VerifyDocumentChecklistSectionProps {
  countryTitle: string
  /** When set, used as the full section heading instead of `Checklist · {countryTitle}`. */
  sectionTitle?: string
  documents: ApplicantDocumentItem[]
  gridSx?: VerifyDocumentGridSx
  previewOnly?: boolean
  onPreview: (documentId: string) => void
  onVerify: (document: ApplicantDocumentItem) => void
  onReject: (document: ApplicantDocumentItem) => void
  onRequestReupload: (document: ApplicantDocumentItem) => void
  onGltsUpload?: (document: ApplicantDocumentItem) => void
}

export function VerifyDocumentChecklistSection({
  countryTitle,
  sectionTitle,
  documents,
  gridSx = VERIFY_DOCUMENT_STACK_SX,
  previewOnly = false,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
  onGltsUpload,
}: VerifyDocumentChecklistSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" fontWeight={700}>
        {sectionTitle ?? `Checklist · ${countryTitle}`}
      </Typography>
      <Box sx={gridSx}>
        {documents.map(doc => (
          <VerifyDocumentCard
            key={doc.documentId}
            document={doc}
            previewOnly={previewOnly}
            onPreview={() => onPreview(doc.documentId)}
            onVerify={() => onVerify(doc)}
            onReject={() => onReject(doc)}
            onRequestReupload={() => onRequestReupload(doc)}
            onGltsUpload={onGltsUpload ? () => onGltsUpload(doc) : undefined}
          />
        ))}
      </Box>
    </Stack>
  )
}

interface VerifyDocumentChecklistsPanelProps {
  countryTitle: string
  travelerDocuments: ApplicantDocumentItem[]
  globalDocuments: ApplicantDocumentItem[]
  gridSx?: VerifyDocumentGridSx
  previewOnly?: boolean
  onTravelerPreview: (documentId: string) => void
  onTravelerVerify: (document: ApplicantDocumentItem) => void
  onTravelerReject: (document: ApplicantDocumentItem) => void
  onTravelerRequestReupload: (document: ApplicantDocumentItem) => void
  onTravelerGltsUpload?: (document: ApplicantDocumentItem) => void
  onGlobalPreview: (documentId: string) => void
  onGlobalVerify: (document: ApplicantDocumentItem) => void
  onGlobalReject: (document: ApplicantDocumentItem) => void
  onGlobalRequestReupload: (document: ApplicantDocumentItem) => void
}

export function VerifyDocumentChecklistsPanel({
  countryTitle,
  travelerDocuments,
  globalDocuments,
  gridSx,
  previewOnly = false,
  onTravelerPreview,
  onTravelerVerify,
  onTravelerReject,
  onTravelerRequestReupload,
  onTravelerGltsUpload,
  onGlobalPreview,
  onGlobalVerify,
  onGlobalReject,
  onGlobalRequestReupload,
}: VerifyDocumentChecklistsPanelProps) {
  const colors = usePublicBrandColors()
  const showTravelerChecklist = travelerDocuments.length > 0
  const showGlobalChecklist = globalDocuments.length > 0

  if (!showTravelerChecklist && !showGlobalChecklist) return null

  const panelSx = getVerifyDocumentPanelSx(colors, 'colored')

  return (
    <Stack spacing={2}>
      {showTravelerChecklist ? (
        <BaseCard sx={panelSx}>
          <VerifyDocumentChecklistSection
            countryTitle={countryTitle}
            documents={travelerDocuments}
            gridSx={gridSx}
            previewOnly={previewOnly}
            onPreview={onTravelerPreview}
            onVerify={onTravelerVerify}
            onReject={onTravelerReject}
            onRequestReupload={onTravelerRequestReupload}
            onGltsUpload={onTravelerGltsUpload}
          />
        </BaseCard>
      ) : null}
      {showGlobalChecklist ? (
        <BaseCard sx={panelSx}>
          <VerifyDocumentChecklistSection
            countryTitle="Common Document Checklist"
            sectionTitle="Common Document Checklist"
            documents={globalDocuments}
            gridSx={gridSx}
            previewOnly={previewOnly}
            onPreview={onGlobalPreview}
            onVerify={onGlobalVerify}
            onReject={onGlobalReject}
            onRequestReupload={onGlobalRequestReupload}
          />
        </BaseCard>
      ) : null}
    </Stack>
  )
}

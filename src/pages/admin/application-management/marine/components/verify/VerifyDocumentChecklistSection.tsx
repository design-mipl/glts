import { Box, Divider, Stack, Typography } from '@mui/material'
import { Eye, RotateCcw, ShieldCheck, Upload, XCircle } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem, ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  documentStatusLabel,
  formatWorkflowSummary,
  isSimpleDocumentRequirement,
  requirementTypeLabel,
  resolveHandlingMode,
  simpleDocumentUploadActionLabel,
  type SimpleDocumentRequirementId,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import { documentBadgeColor, verifyDocumentBadgeLabel } from '../../utils/verifyDocumentsUtils'

const VERIFY_DOCUMENT_CARD_SX = {
  p: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderWidth: 1,
  borderColor: 'divider',
} as const

export const VERIFY_DOCUMENT_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))',
    lg: 'repeat(4, minmax(0, 1fr))',
  },
  gap: 1.5,
} as const

/** Single-column grid for the documents pane in a 50/50 final verification layout. */
export const VERIFY_DOCUMENT_SPLIT_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 1.5,
} as const

interface VerifyDocumentCardProps {
  document: ApplicantDocumentItem
  onPreview: () => void
  onVerify: () => void
  onReject: () => void
  onRequestReupload: () => void
  onGltsUpload?: () => void
}

export function VerifyDocumentCard({
  document,
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
  const reuploadDisabled = !customerUpload
  const showGltsUpload =
    arrangeByGlts && !hasFile && onGltsUpload && isSimpleDocumentRequirement(document.documentId)
  const reqType = requirementTypeLabel(document)
  const displayStatus = verifyDocumentBadgeLabel(document)

  return (
    <BaseCard sx={VERIFY_DOCUMENT_CARD_SX}>
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 0, flex: 1, fontSize: 13 }}>
            {document.name}
            {document.required ? (
              <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
                *
              </Typography>
            ) : null}
          </Typography>
          <Badge
            label={displayStatus}
            color={documentBadgeColor(status, document)}
            size="sm"
          />
        </Stack>

        <Stack spacing={0.75} sx={{ flex: 1 }}>
          {reqType ? (
            <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Requirement type:
              </Typography>
              <Typography variant="caption" fontWeight={600} sx={{ fontSize: 12 }}>
                {reqType}
              </Typography>
            </Stack>
          ) : null}
          {!isSimple ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {documentStatusLabel(document)}
            </Typography>
          ) : null}
          {workflowSummary ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.45 }}>
              {workflowSummary}
            </Typography>
          ) : null}
          {document.reviewComment?.trim() ? (
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
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.5, display: 'block' }}>
                <Typography component="span" fontWeight={700} sx={{ fontSize: 12, color: 'text.primary' }}>
                  GLTS note:{' '}
                </Typography>
                {document.reviewComment.trim()}
              </Typography>
            </Box>
          ) : null}
        </Stack>

        <Divider />

        <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
          {showGltsUpload ? (
            <Button
              label={simpleDocumentUploadActionLabel(document.documentId as SimpleDocumentRequirementId)}
              variant="contained"
              size="sm"
              startIcon={<Upload size={14} />}
              onClick={onGltsUpload}
            />
          ) : null}
          <Button
            label="Preview"
            variant="outlined"
            size="sm"
            startIcon={<Eye size={14} />}
            onClick={onPreview}
            disabled={previewDisabled}
          />
          <Button
            label="Verify"
            variant="outlined"
            size="sm"
            startIcon={<ShieldCheck size={14} />}
            onClick={onVerify}
            disabled={!hasFile && arrangeByGlts}
          />
          <Button
            label="Reject"
            variant="outlined"
            color="error"
            size="sm"
            startIcon={<XCircle size={14} />}
            onClick={onReject}
          />
          <Button
            label="Request Re-upload"
            variant="text"
            size="sm"
            startIcon={<RotateCcw size={14} />}
            onClick={onRequestReupload}
            disabled={reuploadDisabled}
          />
        </Stack>
      </Stack>
    </BaseCard>
  )
}

interface VerifyDocumentChecklistSectionProps {
  countryTitle: string
  /** When set, used as the full section heading instead of `Checklist · {countryTitle}`. */
  sectionTitle?: string
  documents: ApplicantDocumentItem[]
  gridSx?: typeof VERIFY_DOCUMENT_GRID_SX
  onPreview: (documentId: string) => void
  onVerify: (documentId: string) => void
  onReject: (document: ApplicantDocumentItem) => void
  onRequestReupload: (document: ApplicantDocumentItem) => void
  onGltsUpload?: (document: ApplicantDocumentItem) => void
}

export function VerifyDocumentChecklistSection({
  countryTitle,
  sectionTitle,
  documents,
  gridSx = VERIFY_DOCUMENT_GRID_SX,
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
            onPreview={() => onPreview(doc.documentId)}
            onVerify={() => onVerify(doc.documentId)}
            onReject={() => onReject(doc)}
            onRequestReupload={() => onRequestReupload(doc)}
            onGltsUpload={onGltsUpload ? () => onGltsUpload(doc) : undefined}
          />
        ))}
      </Box>
    </Stack>
  )
}

interface VerifyGlobalDocumentChecklistProps {
  documents: ApplicantDocumentItem[]
  gridSx?: typeof VERIFY_DOCUMENT_GRID_SX
  onPreview: (documentId: string) => void
  onVerify: (documentId: string) => void
  onReject: (document: ApplicantDocumentItem) => void
  onRequestReupload: (document: ApplicantDocumentItem) => void
}

export function VerifyGlobalDocumentChecklist({
  documents,
  gridSx,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
}: VerifyGlobalDocumentChecklistProps) {
  if (documents.length === 0) return null

  return (
    <Stack spacing={2}>
      <Divider />
      <VerifyDocumentChecklistSection
        countryTitle="Common Document Checklist"
        sectionTitle="Common Document Checklist"
        documents={documents}
        gridSx={gridSx}
        onPreview={onPreview}
        onVerify={onVerify}
        onReject={onReject}
        onRequestReupload={onRequestReupload}
      />
    </Stack>
  )
}

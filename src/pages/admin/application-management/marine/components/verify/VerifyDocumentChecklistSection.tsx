import { Box, Stack, Typography } from '@mui/material'
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
    <BaseCard sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            {document.name}
            {document.required ? (
              <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
                *
              </Typography>
            ) : null}
          </Typography>
          {reqType ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Requirement type:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {reqType}
              </Typography>
            </Stack>
          ) : null}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Current status:
            </Typography>
            <Badge
              label={displayStatus}
              color={documentBadgeColor(status, document)}
              size="sm"
            />
          </Stack>
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
                mt: 0.5,
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
        <Stack direction="row" flexWrap="wrap" gap={1}>
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
  documents: ApplicantDocumentItem[]
  onPreview: (documentId: string) => void
  onVerify: (documentId: string) => void
  onReject: (document: ApplicantDocumentItem) => void
  onRequestReupload: (document: ApplicantDocumentItem) => void
  onGltsUpload?: (document: ApplicantDocumentItem) => void
}

export function VerifyDocumentChecklistSection({
  countryTitle,
  documents,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
  onGltsUpload,
}: VerifyDocumentChecklistSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" fontWeight={700}>
        Checklist · {countryTitle}
      </Typography>
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
    </Stack>
  )
}

interface VerifyGlobalDocumentChecklistProps {
  documents: ApplicantDocumentItem[]
  onPreview: (documentId: string) => void
  onVerify: (documentId: string) => void
  onReject: (document: ApplicantDocumentItem) => void
  onRequestReupload: (document: ApplicantDocumentItem) => void
}

export function VerifyGlobalDocumentChecklist({
  documents,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
}: VerifyGlobalDocumentChecklistProps) {
  if (documents.length === 0) return null

  return (
    <VerifyDocumentChecklistSection
      countryTitle="Global documents"
      documents={documents}
      onPreview={onPreview}
      onVerify={onVerify}
      onReject={onReject}
      onRequestReupload={onRequestReupload}
    />
  )
}

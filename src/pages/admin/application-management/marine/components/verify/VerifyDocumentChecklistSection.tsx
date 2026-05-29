import { Stack, Typography } from '@mui/material'
import { Eye, RotateCcw, ShieldCheck, XCircle } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem, ApplicantDocumentStatus } from '@/pages/customer/features/applications/data/applicationFlowData'
import { documentBadgeColor, documentBadgeLabel } from '../../utils/verifyDocumentsUtils'

interface VerifyDocumentCardProps {
  document: ApplicantDocumentItem
  onPreview: () => void
  onVerify: () => void
  onReject: () => void
  onRequestReupload: () => void
}

export function VerifyDocumentCard({
  document,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
}: VerifyDocumentCardProps) {
  const status = document.status as ApplicantDocumentStatus

  return (
    <BaseCard sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1.5 }}>
        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            {document.name}
            {document.required ? (
              <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
                *
              </Typography>
            ) : null}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Status:
            </Typography>
            <Badge
              label={documentBadgeLabel(status)}
              color={documentBadgeColor(status)}
              size="sm"
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Button label="Preview" variant="outlined" size="sm" startIcon={<Eye size={14} />} onClick={onPreview} />
        <Button
          label="Verify"
          variant="outlined"
          size="sm"
          startIcon={<ShieldCheck size={14} />}
          onClick={onVerify}
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
        />
      </Stack>
    </BaseCard>
  )
}

interface VerifyDocumentChecklistSectionProps {
  countryTitle: string
  documents: ApplicantDocumentItem[]
  onPreview: (documentId: string) => void
  onVerify: (documentId: string) => void
  onReject: (documentId: string) => void
  onRequestReupload: (documentId: string) => void
}

export function VerifyDocumentChecklistSection({
  countryTitle,
  documents,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
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
          onReject={() => onReject(doc.documentId)}
          onRequestReupload={() => onRequestReupload(doc.documentId)}
        />
      ))}
    </Stack>
  )
}

interface VerifyGlobalDocumentChecklistProps {
  documents: ApplicantDocumentItem[]
  onPreview: (documentId: string) => void
  onVerify: (documentId: string) => void
  onReject: (documentId: string) => void
  onRequestReupload: (documentId: string) => void
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

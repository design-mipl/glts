import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Download, Eye, RotateCcw, Upload } from 'lucide-react'
import { Badge, Button } from '@/design-system/UIComponents'
import type { AgreementOnboardingDocument } from '@/shared/types/commercialAgreement'
import {
  onboardingDocumentStatusColor,
  onboardingDocumentStatusLabel,
} from '../config/agreementStatusConfig'

interface AgreementOnboardingDocumentCardProps {
  document: AgreementOnboardingDocument
  onUpload: () => void
  onPreview: () => void
  onReplace: () => void
  onDownload: () => void
  readOnly?: boolean
}

export function AgreementOnboardingDocumentCard({
  document,
  onUpload,
  onPreview,
  onReplace,
  onDownload,
  readOnly = false,
}: AgreementOnboardingDocumentCardProps) {
  const theme = useTheme()
  const uploaded = document.status === 'uploaded' || document.status === 'verified'

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        p: 2,
        height: '100%',
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 1.5, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.75} useFlexGap flexWrap="wrap">
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {document.name}
            {document.required ? (
              <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
                *
              </Typography>
            ) : null}
          </Typography>
          <Badge
            label={onboardingDocumentStatusLabel[document.status]}
            color={onboardingDocumentStatusColor[document.status]}
            size="sm"
            sx={{
              height: 18,
              minHeight: 18,
              '& .MuiChip-label': { px: '6px', fontSize: '10px' },
            }}
          />
        </Stack>
        {document.fileName ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            {document.fileName}
            {document.uploadedAt
              ? ` · Uploaded ${new Date(document.uploadedAt).toLocaleDateString()}`
              : ''}
          </Typography>
        ) : null}
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {!readOnly ? (
          <Button
            label={uploaded ? 'Replace' : 'Upload'}
            variant="outlined"
            size="sm"
            startIcon={uploaded ? <RotateCcw size={14} /> : <Upload size={14} />}
            onClick={uploaded ? onReplace : onUpload}
          />
        ) : null}
        <Button label="Preview" variant="outlined" size="sm" startIcon={<Eye size={14} />} onClick={onPreview} disabled={!uploaded} />
        <Button label="Download" variant="outlined" size="sm" startIcon={<Download size={14} />} onClick={onDownload} disabled={!uploaded} />
      </Stack>
    </Box>
  )
}

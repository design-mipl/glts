import { Box, Typography, Card, Grid, Stack, Chip, Button } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ExtractedFieldsReview } from '../../../../components/ExtractedFieldsReview'
import { PassportPreviewCard } from '../../../../components/PassportPreviewCard'
import { singleExtractedFields } from '../../../../data/applicationFlowData'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'

interface OcrExtractionStepProps {
  state: ApplicationFlowState
  onConfirm: () => void
  onReupload: () => void
  onContinue: () => void
}

const OCR_STATUS = 'Verified' as const

export function OcrExtractionStep({ onConfirm, onReupload, onContinue }: OcrExtractionStepProps) {
  const colors = usePublicBrandColors()
  const previewRow = customerPortalService.getUploadQueue()[3]

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 0.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy }}>
          OCR extraction & review
        </Typography>
        <Chip
          label={OCR_STATUS}
          size="small"
          sx={{ fontWeight: 700, bgcolor: colors.greenMuted, color: colors.greenDark }}
        />
      </Stack>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2 }}>
        Confirm extracted passport fields. Edit any value before continuing to document upload workspace.
      </Typography>

      <Card sx={{ p: 2.5, borderRadius: '14px', border: `1px solid ${colors.border}`, mb: 2 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, mb: 1, textTransform: 'uppercase' }}>
              Passport preview
            </Typography>
            <PassportPreviewCard row={previewRow} />
            <Button
              size="small"
              startIcon={<RefreshCw size={14} />}
              onClick={onReupload}
              sx={{ mt: 1.5, textTransform: 'none', fontSize: 12 }}
            >
              Re-upload passport
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <ExtractedFieldsReview
              title="Extracted information"
              fields={singleExtractedFields}
            />
            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.5 }}>
              {['Verified', 'Needs review', 'Low confidence', 'Correction required'].map(label => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  variant={label === OCR_STATUS ? 'filled' : 'outlined'}
                  sx={{ fontSize: 10, height: 22, fontWeight: label === OCR_STATUS ? 700 : 500 }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <FlowStepActions
        onContinue={() => {
          onConfirm()
          onContinue()
        }}
        continueLabel="Confirm information"
        secondaryLabel="Edit later"
        onSecondary={onContinue}
      />
    </Box>
  )
}

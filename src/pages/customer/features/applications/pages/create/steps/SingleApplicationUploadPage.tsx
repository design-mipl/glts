import { useState } from 'react'
import { Box, Typography, Grid, Card, Stack, Button } from '@mui/material'
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react'
import { FileUpload } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import { ExtractedFieldsReview } from '../../../components/ExtractedFieldsReview'
import { PassportPreviewCard } from '../../../components/PassportPreviewCard'
import {
  defaultChecklist,
  singleExtractedFields,
} from '../../../data/applicationFlowData'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { CustomerDocumentChecklist } from '@/pages/customer/features/shared/components/CustomerPrimitives'

interface SingleApplicationUploadPageProps {
  state: ApplicationFlowState
  onBack: () => void
  onContinue: () => void
}

export function SingleApplicationUploadPage({ state, onBack, onContinue }: SingleApplicationUploadPageProps) {
  const colors = usePublicBrandColors()
  const [uploaded, setUploaded] = useState(false)
  const previewRow = customerPortalService.getUploadQueue()[3]
  const checklist = defaultChecklist(state.countryName)

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ mb: 2, textTransform: 'none', fontSize: '13px' }}>
        Back
      </Button>
      <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy, mb: 2 }}>
        Upload documents
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}` }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Upload size={18} color={colors.greenBright} />
              <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Upload passport & documents</Typography>
            </Stack>
            <Typography sx={{ fontSize: '12px', color: colors.textMuted, mb: 1.5 }}>
              Drag & drop · JPG, PNG, HEIC, PDF · Max 10 MB
            </Typography>
            <FileUpload onUpload={() => setUploaded(true)} accept="image/*,.pdf,.heic" />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <CustomerDocumentChecklist country={state.countryName} items={checklist} />
        </Grid>
      </Grid>

      {uploaded && (
        <Card sx={{ p: 2.5, borderRadius: '14px', border: `1px solid ${colors.border}`, mb: 3 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <PassportPreviewCard row={previewRow} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <ExtractedFieldsReview fields={singleExtractedFields} />
            </Grid>
          </Grid>
        </Card>
      )}

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          endIcon={<ArrowRight size={16} />}
          onClick={onContinue}
          disabled={!uploaded}
          sx={{ ...getPrimaryButtonSx(colors), fontSize: '13px' }}
        >
          Review & submit
        </Button>
      </Stack>
    </Box>
  )
}

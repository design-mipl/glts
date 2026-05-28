import { useMemo } from 'react'
import { Box, Typography, Card, Stack, Button, Chip, Grid } from '@mui/material'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import type { ApplicationFlowMode } from '../../../data/applicationFlowData'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'

interface ApplicationReviewStepProps {
  mode: ApplicationFlowMode
  state: ApplicationFlowState
  onBack: () => void
  onSubmitted: () => void
}

export function ApplicationReviewStep({ mode, state, onBack, onSubmitted }: ApplicationReviewStepProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()
  const refId = useMemo(
    () =>
      customerPortalService.submitApplication(mode, {
        applicationId: state.gltsApplicationId,
        batchId: state.gltsBatchId,
      }),
    [mode, state.gltsApplicationId, state.gltsBatchId],
  )

  const handleSubmit = () => {
    customerPortalService.submitApplication(mode, {
      applicationId: state.gltsApplicationId,
      batchId: state.gltsBatchId,
    })
    onSubmitted()
    showToast({
      title: mode === 'single' ? 'Application submitted' : 'Batch submitted',
      description: `${refId} is ready for GLTS review.`,
      variant: 'success',
    })
    navigate(`${base}/applications/${refId}`)
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', width: '100%' }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ mb: 2, textTransform: 'none', fontSize: '13px' }}>
        Back
      </Button>
      <Card sx={{ p: 3, borderRadius: '14px', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
        <CheckCircle2 size={48} color={colors.greenBright} style={{ marginBottom: 16 }} />
        <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy, mb: 2 }}>
          Ready to submit
        </Typography>
        <Chip label={refId} sx={{ fontWeight: 700, mb: 2 }} />
        <Grid container spacing={1} sx={{ mb: 3, textAlign: 'left' }}>
          {[
            ['Country', `${state.countryFlag} ${state.countryName}`],
            [
              'Visa',
              state.purposeLabel
                ? `${state.visaTypeLabel} · ${state.purposeLabel}`
                : state.visaTypeLabel || state.visaType,
            ],
            ['Travel date', state.travelDate],
            ['Mode', mode === 'single' ? 'Single traveler' : 'Bulk · crew/team'],
          ].map(([k, v]) => (
            <Grid size={{ xs: 6 }} key={k}>
              <Typography sx={{ fontSize: '11px', color: colors.textMuted }}>{k}</Typography>
              <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{v}</Typography>
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" spacing={1.5} justifyContent="center">
          <Button variant="outlined" onClick={onBack} sx={{ textTransform: 'none' }}>
            Edit details
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ ...getPrimaryButtonSx(colors), fontSize: '13px' }}
          >
            {mode === 'single' ? 'Submit application' : 'Submit batch'}
          </Button>
        </Stack>
      </Card>
    </Box>
  )
}

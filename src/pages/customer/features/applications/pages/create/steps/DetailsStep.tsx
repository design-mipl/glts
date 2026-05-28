import { Box, Card, Grid, TextField, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../components/create/FlowStepActions'

interface DetailsStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function DetailsStep({ state, onUpdate, onContinue }: DetailsStepProps) {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Additional details
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2 }}>
        Add billing and vessel details before final submission.
      </Typography>

      <Card
        sx={{
          p: { xs: 1.5, md: 2 },
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <Grid container spacing={1.25}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Billing address"
              value={state.billingAddress}
              onChange={e => onUpdate({ billingAddress: e.target.value })}
              multiline
              minRows={3}
              sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Vessel name"
              value={state.vesselName}
              onChange={e => onUpdate({ vesselName: e.target.value })}
              sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
            />
          </Grid>
        </Grid>
      </Card>

      <FlowStepActions
        onContinue={onContinue}
        continueLabel="Continue to submit"
      />
    </Box>
  )
}


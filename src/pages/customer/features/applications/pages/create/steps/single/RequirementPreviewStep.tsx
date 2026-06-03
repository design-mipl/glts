import { useMemo } from 'react'
import { Box, Typography, Chip, Stack, Card, Grid, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'
import { RequirementPreviewCarousel } from '../../../../components/create/RequirementPreviewCarousel'
import { getRequirementPreviewCards } from '../../../../data/singleApplicationFlowData'

interface RequirementPreviewStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function RequirementPreviewStep({ state, onUpdate, onContinue }: RequirementPreviewStepProps) {
  const colors = usePublicBrandColors()
  const cards = useMemo(
    () => getRequirementPreviewCards(state.countryId, state.visaOfferingId),
    [state.countryId, state.visaOfferingId],
  )

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Requirement preview
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
        <Chip label={state.visaTypeLabel} size="small" sx={{ fontWeight: 600 }} />
        <Chip label={state.purposeLabel} size="small" variant="outlined" />
      </Stack>

      <Card
        sx={{
          mb: 2,
          p: { xs: 1.5, md: 2 },
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', mb: 1 }}>
          Travel & processing
        </Typography>
        <Grid container spacing={1.25}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.5 }}>
              Intended travel date
            </Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              value={state.travelDate}
              onChange={e => onUpdate({ travelDate: e.target.value })}
              inputProps={{ 'aria-label': 'Intended travel date' }}
              sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.5 }}>
              Processing type
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={state.processingType}
              onChange={(_, v) => v && onUpdate({ processingType: v })}
              sx={{
                width: '100%',
                bgcolor: colors.white,
                borderRadius: '10px',
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  flex: 1,
                  borderColor: colors.border,
                },
                '& .Mui-selected': {
                  bgcolor: colors.greenMuted,
                  color: colors.greenDark,
                },
              }}
            >
              <ToggleButton value="normal">Normal</ToggleButton>
              <ToggleButton value="express">Express</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Card>

      <RequirementPreviewCarousel cards={cards} />

      <FlowStepActions
        onContinue={onContinue}
        continueLabel="Continue to documents"
        continueDisabled={!state.visaOfferingId || cards.length === 0 || !state.travelDate}
      />
    </Box>
  )
}

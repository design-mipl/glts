import { useEffect, useMemo } from 'react'
import { Box, Typography, Chip, Stack, Card, Grid, TextField, MenuItem } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getPassportIssueLocations,
  resolvePassportJurisdiction,
} from '@/shared/services/countryMasterService'
import {
  requiresFieldValidation,
  useApplicationFlowPolicy,
} from '../../../../context/ApplicationFlowPolicyContext'
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
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const cards = useMemo(
    () => getRequirementPreviewCards(state.countryId, state.visaOfferingId),
    [state.countryId, state.visaOfferingId],
  )
  const passportIssueLocations = useMemo(
    () => getPassportIssueLocations(state.countryId),
    [state.countryId],
  )
  const hasLocationOptions = passportIssueLocations.length > 0

  useEffect(() => {
    if (!state.issuedPassportLocationId) return
    const stillValid = passportIssueLocations.some((loc) => loc.id === state.issuedPassportLocationId)
    if (!stillValid) {
      onUpdate({ issuedPassportLocationId: '', jurisdiction: '' })
      return
    }
    const resolved = resolvePassportJurisdiction(state.countryId, state.issuedPassportLocationId)
    if (resolved && resolved !== state.jurisdiction) {
      onUpdate({ jurisdiction: resolved })
    }
  }, [state.countryId, state.issuedPassportLocationId, state.jurisdiction, passportIssueLocations, onUpdate])

  const handleLocationChange = (locationId: string) => {
    onUpdate({
      issuedPassportLocationId: locationId,
      jurisdiction: resolvePassportJurisdiction(state.countryId, locationId) ?? '',
    })
  }

  const canContinue = strict
    ? Boolean(state.visaOfferingId) &&
      cards.length > 0 &&
      Boolean(state.travelDate) &&
      Boolean(state.issuedPassportLocationId) &&
      Boolean(state.jurisdiction)
    : true

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
          Travel & jurisdiction
        </Typography>
        <Grid container spacing={1.25}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.5 }}>
              Issued passport location
            </Typography>
            <TextField
              select
              size="small"
              fullWidth
              value={state.issuedPassportLocationId}
              onChange={(e) => handleLocationChange(e.target.value)}
              disabled={!hasLocationOptions}
              inputProps={{ 'aria-label': 'Issued passport location' }}
              sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
            >
              <MenuItem value="">
                <em>Select location</em>
              </MenuItem>
              {passportIssueLocations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.label}
                </MenuItem>
              ))}
            </TextField>
            {!hasLocationOptions && (
              <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.5 }}>
                No passport issue locations configured for this country.
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.5 }}>
              Jurisdiction
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={state.jurisdiction}
              disabled
              placeholder="Auto-filled from location"
              inputProps={{ 'aria-label': 'Jurisdiction' }}
              sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.5 }}>
              Intended travel date
            </Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              value={state.travelDate}
              onChange={(e) => onUpdate({ travelDate: e.target.value })}
              inputProps={{ 'aria-label': 'Intended travel date' }}
              sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
            />
          </Grid>
        </Grid>
      </Card>

      <RequirementPreviewCarousel cards={cards} />

      <FlowStepActions
        onContinue={onContinue}
        continueLabel="Continue to documents"
        continueDisabled={!canContinue}
      />
    </Box>
  )
}

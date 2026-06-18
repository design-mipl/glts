import { useEffect, useMemo } from 'react'
import { Box, Typography, Stack, Card, Grid, TextField, MenuItem, Divider } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getApplicableStatesForOffering,
  getRequirementPreviewCards,
  getTravelFeasibilityConfig,
  getVisaApplicationWindow,
  offeringRequiresJurisdictionSelection,
  resolveJurisdictionForOfferingState,
} from '@/shared/services/countryMasterService'
import { DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS } from '@/shared/constants/travelDateFeasibility'
import { getTravelDateInputBounds } from '@/shared/utils/jurisdictionRequirementPreview'
import {
  requiresFieldValidation,
  useApplicationFlowPolicy,
} from '../../../../context/ApplicationFlowPolicyContext'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'
import { ApplicationFlowContextChips } from '../../../../components/create/ApplicationFlowContextChips'
import { RequirementPreviewCarousel } from '../../../../components/create/RequirementPreviewCarousel'
import { TravelDateFieldWithFeasibility } from '../../../../components/create/TravelDateFieldWithFeasibility'

interface RequirementPreviewStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function RequirementPreviewStep({ state, onUpdate, onContinue }: RequirementPreviewStepProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)

  const requiresJurisdiction = useMemo(
    () => offeringRequiresJurisdictionSelection(state.countryId, state.visaOfferingId),
    [state.countryId, state.visaOfferingId],
  )

  const applicableStates = useMemo(
    () => getApplicableStatesForOffering(state.countryId, state.visaOfferingId),
    [state.countryId, state.visaOfferingId],
  )

  const resolvedJurisdiction = useMemo(
    () =>
      requiresJurisdiction && state.issuedPassportState
        ? resolveJurisdictionForOfferingState(
            state.countryId,
            state.visaOfferingId,
            state.issuedPassportState,
          )
        : undefined,
    [
      requiresJurisdiction,
      state.countryId,
      state.visaOfferingId,
      state.issuedPassportState,
    ],
  )

  const jurisdictionId = resolvedJurisdiction?.id ?? state.jurisdictionId

  const cards = useMemo(() => {
    if (requiresJurisdiction && !jurisdictionId) return []
    return getRequirementPreviewCards(state.countryId, state.visaOfferingId, jurisdictionId || undefined)
  }, [requiresJurisdiction, jurisdictionId, state.countryId, state.visaOfferingId])

  const travelDateBounds = useMemo(
    () => getTravelDateInputBounds(getVisaApplicationWindow(state.countryId)),
    [state.countryId],
  )

  const travelFeasibilityConfig = useMemo(
    () =>
      state.countryId && state.visaOfferingId
        ? getTravelFeasibilityConfig(
            state.countryId,
            state.visaOfferingId,
            jurisdictionId || undefined,
          )
        : null,
    [jurisdictionId, state.countryId, state.visaOfferingId],
  )

  useEffect(() => {
    if (!requiresJurisdiction) {
      if (state.issuedPassportState || state.jurisdictionId || state.jurisdiction) {
        onUpdate({ issuedPassportState: '', jurisdictionId: '', jurisdiction: '' })
      }
      return
    }

    if (!state.issuedPassportState) {
      if (state.jurisdictionId || state.jurisdiction) {
        onUpdate({ jurisdictionId: '', jurisdiction: '' })
      }
      return
    }

    const stillValid = applicableStates.includes(state.issuedPassportState)
    if (!stillValid) {
      onUpdate({ issuedPassportState: '', jurisdictionId: '', jurisdiction: '' })
      return
    }

    if (!resolvedJurisdiction) {
      if (state.jurisdictionId || state.jurisdiction) {
        onUpdate({ jurisdictionId: '', jurisdiction: '' })
      }
      return
    }

    if (
      resolvedJurisdiction.id !== state.jurisdictionId ||
      resolvedJurisdiction.name !== state.jurisdiction
    ) {
      onUpdate({
        jurisdictionId: resolvedJurisdiction.id,
        jurisdiction: resolvedJurisdiction.name,
      })
    }
  }, [
    applicableStates,
    onUpdate,
    requiresJurisdiction,
    resolvedJurisdiction,
    state.issuedPassportState,
    state.jurisdiction,
    state.jurisdictionId,
  ])

  const handleStateChange = (stateName: string) => {
    const jurisdiction = resolveJurisdictionForOfferingState(
      state.countryId,
      state.visaOfferingId,
      stateName,
    )
    onUpdate({
      issuedPassportState: stateName,
      jurisdictionId: jurisdiction?.id ?? '',
      jurisdiction: jurisdiction?.name ?? '',
    })
  }

  const canContinue = strict
    ? Boolean(
        state.visaOfferingId &&
          cards.length > 0 &&
          state.travelDate &&
          (!requiresJurisdiction ||
            (state.issuedPassportState && state.jurisdictionId && state.jurisdiction)),
      )
    : true

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: 2 }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, m: 0 }}>
          Requirement preview
        </Typography>
        <ApplicationFlowContextChips
          countryFlag={state.countryFlag}
          countryName={state.countryName}
          visaTypeLabel={state.visaTypeLabel}
          purposeLabel={state.purposeLabel}
        />
      </Stack>

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: { xs: 1.25, md: 1.5 },
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              bgcolor: colors.surface,
              height: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.textSecondary,
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              {requiresJurisdiction ? 'Travel & jurisdiction' : 'Travel details'}
            </Typography>
            <Divider sx={{ mb: 1.5, borderColor: colors.border }} />
            <Stack spacing={2}>
              {requiresJurisdiction ? (
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.75 }}>
                        Issued passport state
                      </Typography>
                      <TextField
                        select
                        size="small"
                        fullWidth
                        value={state.issuedPassportState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        inputProps={{ 'aria-label': 'Issued passport state' }}
                        sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
                      >
                        <MenuItem value="">
                          <em>Select state</em>
                        </MenuItem>
                        {applicableStates.map((stateName) => (
                          <MenuItem key={stateName} value={stateName}>
                            {stateName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.75 }}>
                        Jurisdiction
                      </Typography>
                      <TextField
                        size="small"
                        fullWidth
                        value={state.jurisdiction}
                        disabled
                        placeholder="Auto-filled from state"
                        inputProps={{ 'aria-label': 'Jurisdiction' }}
                        sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              ) : null}
              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.75 }}>
                  Intended travel date
                </Typography>
                <TravelDateFieldWithFeasibility
                  value={state.travelDate}
                  onChange={(iso) => onUpdate({ travelDate: iso })}
                  config={
                    travelFeasibilityConfig ?? {
                      requiredWorkingDays: null,
                      thresholds: DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS,
                    }
                  }
                  applicationWindowHelper={travelDateBounds.helperText}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <RequirementPreviewCarousel
            cards={cards}
            requiresJurisdictionSelection={requiresJurisdiction}
          />
        </Grid>
      </Grid>

      <FlowStepActions
        onContinue={onContinue}
        continueLabel="Continue to documents"
        continueDisabled={!canContinue}
      />
    </Box>
  )
}

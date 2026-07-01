import { useEffect, useMemo } from 'react'
import { Box, Typography, Stack, Card, Grid, Divider } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getApplicableStatesForOffering,
  getRequirementPreviewCards,
  getTravelFeasibilityConfig,
  getVisaApplicationWindow,
  offeringRequiresJurisdictionSelection,
  resolveJurisdictionForOffering,
  resolveJurisdictionForOfferingState,
} from '@/shared/services/countryMasterService'
import { DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS } from '@/shared/constants/travelDateFeasibility'
import { getTravelDateInputBounds, resolveJurisdictionMappingState } from '@/shared/utils/jurisdictionRequirementPreview'
import {
  requiresFieldValidation,
  useApplicationFlowPolicy,
} from '../../../../context/ApplicationFlowPolicyContext'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'
import { ApplicationFlowContextChips } from '../../../../components/create/ApplicationFlowContextChips'
import { RequirementPreviewCarousel } from '../../../../components/create/RequirementPreviewCarousel'
import { TravelDateFieldWithFeasibility } from '../../../../components/create/TravelDateFieldWithFeasibility'
import { SearchableStateSelect } from '../../../../components/create/SearchableStateSelect'
import { JurisdictionReadOnlyField } from '../../../../components/create/JurisdictionReadOnlyField'

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

  const jurisdictionMappingState = useMemo(
    () => resolveJurisdictionMappingState(state.placeOfResidence, state.issuedPassportState),
    [state.placeOfResidence, state.issuedPassportState],
  )

  const resolvedJurisdiction = useMemo(
    () =>
      requiresJurisdiction && jurisdictionMappingState
        ? resolveJurisdictionForOffering(state.countryId, state.visaOfferingId, {
            placeOfResidence: state.placeOfResidence,
            issuedPassportState: state.issuedPassportState,
          })
        : undefined,
    [
      requiresJurisdiction,
      jurisdictionMappingState,
      state.countryId,
      state.visaOfferingId,
      state.placeOfResidence,
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
      if (
        state.issuedPassportState ||
        state.placeOfResidence ||
        state.jurisdictionId ||
        state.jurisdiction
      ) {
        onUpdate({
          issuedPassportState: '',
          placeOfResidence: '',
          jurisdictionId: '',
          jurisdiction: '',
        })
      }
      return
    }

    let nextPassportState = state.issuedPassportState
    let nextPlaceOfResidence = state.placeOfResidence

    if (nextPassportState && !applicableStates.includes(nextPassportState)) {
      nextPassportState = ''
    }
    if (nextPlaceOfResidence && !applicableStates.includes(nextPlaceOfResidence)) {
      nextPlaceOfResidence = ''
    }

    const mappingState = resolveJurisdictionMappingState(nextPlaceOfResidence, nextPassportState)
    const jurisdiction = mappingState
      ? resolveJurisdictionForOfferingState(state.countryId, state.visaOfferingId, mappingState)
      : undefined

    const patch: Partial<ApplicationFlowState> = {}

    if (nextPassportState !== state.issuedPassportState) {
      patch.issuedPassportState = nextPassportState
    }
    if (nextPlaceOfResidence !== state.placeOfResidence) {
      patch.placeOfResidence = nextPlaceOfResidence
    }

    if (!mappingState) {
      if (state.jurisdictionId || state.jurisdiction) {
        patch.jurisdictionId = ''
        patch.jurisdiction = ''
      }
    } else if (
      jurisdiction &&
      (jurisdiction.id !== state.jurisdictionId || jurisdiction.name !== state.jurisdiction)
    ) {
      patch.jurisdictionId = jurisdiction.id
      patch.jurisdiction = jurisdiction.name
    } else if (!jurisdiction && (state.jurisdictionId || state.jurisdiction)) {
      patch.jurisdictionId = ''
      patch.jurisdiction = ''
    }

    if (Object.keys(patch).length > 0) {
      onUpdate(patch)
    }
  }, [
    applicableStates,
    onUpdate,
    requiresJurisdiction,
    state.countryId,
    state.issuedPassportState,
    state.jurisdiction,
    state.jurisdictionId,
    state.placeOfResidence,
    state.visaOfferingId,
  ])

  const handlePassportStateChange = (stateName: string) => {
    if (state.placeOfResidence.trim()) {
      onUpdate({ issuedPassportState: stateName })
      return
    }

    const jurisdiction = stateName
      ? resolveJurisdictionForOfferingState(state.countryId, state.visaOfferingId, stateName)
      : undefined

    onUpdate({
      issuedPassportState: stateName,
      jurisdictionId: jurisdiction?.id ?? '',
      jurisdiction: jurisdiction?.name ?? '',
    })
  }

  const handlePlaceOfResidenceChange = (stateName: string) => {
    const jurisdiction = stateName
      ? resolveJurisdictionForOfferingState(state.countryId, state.visaOfferingId, stateName)
      : state.issuedPassportState
        ? resolveJurisdictionForOfferingState(
            state.countryId,
            state.visaOfferingId,
            state.issuedPassportState,
          )
        : undefined

    onUpdate({
      placeOfResidence: stateName,
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
            (state.issuedPassportState &&
              jurisdictionMappingState &&
              state.jurisdictionId &&
              state.jurisdiction)),
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
                      <SearchableStateSelect
                        value={state.issuedPassportState}
                        options={applicableStates}
                        onChange={handlePassportStateChange}
                        placeholder="Select issuing state"
                        aria-label="Issued passport state"
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.75 }}>
                        Place of residence
                      </Typography>
                      <SearchableStateSelect
                        value={state.placeOfResidence}
                        options={applicableStates}
                        onChange={handlePlaceOfResidenceChange}
                        placeholder="Select place of residence"
                        aria-label="Place of residence"
                        clearable
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, mb: 0.75 }}>
                        Jurisdiction
                      </Typography>
                      <JurisdictionReadOnlyField
                        value={state.jurisdiction}
                        placeholder="Resolved from residence or issuing state"
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

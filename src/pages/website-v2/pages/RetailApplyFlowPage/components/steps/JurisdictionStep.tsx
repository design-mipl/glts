import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { MapPin } from 'lucide-react'
import type { CountryVisaJurisdiction } from '@/shared/types/countryMaster'
import {
  getApplicableStatesForOffering,
  getTravelFeasibilityConfig,
  getVisaApplicationWindow,
  resolveJurisdictionForOfferingState,
} from '@/shared/services/countryMasterService'
import { DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS } from '@/shared/constants/travelDateFeasibility'
import {
  getTravelDateInputBounds,
  resolveJurisdictionMappingState,
} from '@/shared/utils/jurisdictionRequirementPreview'
import { BUTTON } from '@/design-system/formControl'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { SearchableStateSelect } from '@/pages/customer/features/applications/components/create/SearchableStateSelect'
import { TravelDateFieldWithFeasibility } from '@/pages/customer/features/applications/components/create/TravelDateFieldWithFeasibility'
import { brandPrimaryGreenRgb, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx, retailFlowEaseOut } from '@/pages/website-v2/theme/retailFlowTokens'
import { StepShell } from '../StepShell'

interface JurisdictionStepProps {
  countryId: string
  visaOfferingId: string
  jurisdictions: CountryVisaJurisdiction[]
  selectedId?: string
  jurisdictionName?: string
  issuedPassportState?: string
  placeOfResidence?: string
  travelDate?: string
  onSelect: (jurisdictionId: string, jurisdictionName?: string) => void
  onPassportStateChange: (stateName: string) => void
  onPlaceOfResidenceChange: (stateName: string) => void
  onTravelDateChange: (isoDate: string) => void
  onBack: () => void
  onContinue: () => void
}

function SectionLabel({ children }: { children: string }) {
  const colors = usePublicBrandColors()
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: colors.textMuted,
        mb: 1.25,
        textAlign: 'left',
      }}
    >
      {children}
    </Typography>
  )
}

/**
 * Submission centre + travel date — mirrors customer RequirementPreviewStep:
 * passport state + residence resolve the centre; travel date is collected beside it.
 */
export function JurisdictionStep({
  countryId,
  visaOfferingId,
  jurisdictions,
  selectedId,
  jurisdictionName,
  issuedPassportState = '',
  placeOfResidence = '',
  travelDate = '',
  onSelect,
  onPassportStateChange,
  onPlaceOfResidenceChange,
  onTravelDateChange,
  onBack,
  onContinue,
}: JurisdictionStepProps) {
  const colors = usePublicBrandColors()

  const applicableStates = useMemo(
    () => getApplicableStatesForOffering(countryId, visaOfferingId),
    [countryId, visaOfferingId],
  )

  const useStateMapping = applicableStates.length > 0
  const needsCity = jurisdictions.length > 0
  const mappingState = resolveJurisdictionMappingState(placeOfResidence, issuedPassportState)
  const resolved =
    selectedId
      ? jurisdictions.find((j) => j.id === selectedId)
      : undefined
  const centreLabel = resolved?.name ?? jurisdictionName ?? ''

  const travelDateBounds = useMemo(
    () => getTravelDateInputBounds(getVisaApplicationWindow(countryId)),
    [countryId],
  )

  const travelFeasibilityConfig = useMemo(
    () =>
      countryId && visaOfferingId
        ? getTravelFeasibilityConfig(countryId, visaOfferingId, selectedId)
        : null,
    [countryId, visaOfferingId, selectedId],
  )

  const continueDisabled =
    !travelDate.trim() ||
    (useStateMapping
      ? !(issuedPassportState.trim() && mappingState && selectedId)
      : needsCity && !selectedId)

  return (
    <StepShell
      title="Where will you submit your application?"
      helperText="We’ll use your residence to pick the right application centre — then lock in your travel date."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      contentMaxWidth={1100}
    >
      <Box
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          gap: { xs: 2, md: 2.5 },
          textAlign: 'left',
        }}
      >
        {/* Left — jurisdiction resolution */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '1 1 50%' },
            minWidth: 0,
            ...getElevatedCardSx(colors.border),
            borderRadius: BORDER_RADIUS.lg,
            bgcolor: colors.white,
            p: { xs: 1.75, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <SectionLabel>{useStateMapping ? 'Travel & jurisdiction' : 'Submission city'}</SectionLabel>

          {useStateMapping ? (
            <Stack spacing={1.75} sx={{ flex: '0 0 auto' }}>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.navy, mb: 0.75 }}>
                  Issued passport state
                </Typography>
                <SearchableStateSelect
                  value={issuedPassportState}
                  options={applicableStates}
                  onChange={onPassportStateChange}
                  placeholder="Select issuing state"
                  aria-label="Issued passport state"
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.navy, mb: 0.75 }}>
                  Place of residence
                </Typography>
                <SearchableStateSelect
                  value={placeOfResidence}
                  options={applicableStates}
                  onChange={onPlaceOfResidenceChange}
                  placeholder="Where you live (6+ months)"
                  aria-label="Place of residence (more than 6 months)"
                  clearable
                />
                <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.75, lineHeight: 1.4 }}>
                  Residence takes priority over passport state when both are set.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: BORDER_RADIUS.md,
                  bgcolor: centreLabel
                    ? `rgba(${brandPrimaryGreenRgb}, 0.08)`
                    : colors.surfaceAlt,
                  border: `1px solid ${
                    centreLabel ? `rgba(${brandPrimaryGreenRgb}, 0.28)` : colors.border
                  }`,
                  transition: `background-color 150ms ${retailFlowEaseOut}, border-color 150ms ${retailFlowEaseOut}`,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: colors.textMuted,
                      lineHeight: 1.2,
                    }}
                  >
                    Your application centre
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: centreLabel ? colors.navy : colors.textMuted,
                      mt: 0.25,
                      lineHeight: 1.25,
                    }}
                  >
                    {centreLabel || 'Select a state to resolve'}
                  </Typography>
                  {resolved?.submissionCenter || resolved?.embassyOrVfs ? (
                    <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.35 }}>
                      {[resolved.embassyOrVfs, resolved.submissionCenter].filter(Boolean).join(' · ')}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Stack>
          ) : needsCity ? (
            <Stack spacing={1} sx={{ flex: 1 }}>
              {jurisdictions.map((jurisdiction) => {
                const selected = jurisdiction.id === selectedId
                return (
                  <Box
                    key={jurisdiction.id}
                    component="button"
                    type="button"
                    onClick={() => onSelect(jurisdiction.id, jurisdiction.name)}
                    sx={{
                      appearance: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      width: '100%',
                      px: 1.75,
                      py: 1.5,
                      borderRadius: BORDER_RADIUS.md,
                      border: `1.5px solid ${selected ? colors.greenBright : colors.border}`,
                      bgcolor: selected ? `rgba(${brandPrimaryGreenRgb}, 0.06)` : colors.white,
                      fontFamily: 'inherit',
                      transition: `border-color 150ms ${retailFlowEaseOut}, background-color 150ms ${retailFlowEaseOut}`,
                      '&:hover': { borderColor: colors.greenBright },
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        borderRadius: BUTTON.borderRadius,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(colors.textSecondary, selected ? 0.14 : 0.1),
                        color: selected ? colors.greenBright : colors.textSecondary,
                      }}
                    >
                      <MapPin size={16} strokeWidth={selected ? 2.25 : 1.75} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: selected ? 700 : 600, color: colors.navy }}>
                        {jurisdiction.name}
                      </Typography>
                      {(jurisdiction.embassyOrVfs || jurisdiction.submissionCenter) && (
                        <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.2 }}>
                          {[jurisdiction.embassyOrVfs, jurisdiction.submissionCenter]
                            .filter(Boolean)
                            .join(' · ')}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      aria-hidden
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: `2px solid ${selected ? colors.greenBright : colors.border}`,
                        bgcolor: selected ? colors.greenBright : 'transparent',
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                )
              })}
            </Stack>
          ) : (
            <Typography sx={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.45 }}>
              No application centres are configured for this visa yet — continue with your travel
              date.
            </Typography>
          )}
        </Box>

        {/* Right — travel date calendar */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '1 1 50%' },
            minWidth: 0,
            ...getElevatedCardSx(colors.border),
            borderRadius: BORDER_RADIUS.lg,
            bgcolor: colors.white,
            p: { xs: 1.75, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <SectionLabel>Intended travel date</SectionLabel>
          <TravelDateFieldWithFeasibility
            value={travelDate}
            onChange={onTravelDateChange}
            config={
              travelFeasibilityConfig ?? {
                requiredWorkingDays: null,
                thresholds: DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS,
              }
            }
            applicationWindowHelper={travelDateBounds.helperText}
          />
        </Box>
      </Box>
    </StepShell>
  )
}

/** Helpers used by the shell to keep draft jurisdiction fields in sync. */
export function resolveRetailJurisdictionPatch(
  countryId: string,
  visaOfferingId: string,
  next: { issuedPassportState?: string; placeOfResidence?: string },
  current: { issuedPassportState?: string; placeOfResidence?: string },
) {
  const issuedPassportState =
    next.issuedPassportState !== undefined ? next.issuedPassportState : (current.issuedPassportState ?? '')
  const placeOfResidence =
    next.placeOfResidence !== undefined ? next.placeOfResidence : (current.placeOfResidence ?? '')
  const mappingState = resolveJurisdictionMappingState(placeOfResidence, issuedPassportState)
  const jurisdiction = mappingState
    ? resolveJurisdictionForOfferingState(countryId, visaOfferingId, mappingState)
    : undefined

  return {
    issuedPassportState,
    placeOfResidence,
    jurisdictionId: jurisdiction?.id,
    jurisdictionName: jurisdiction?.name,
  }
}

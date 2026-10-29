import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Check, MapPin } from 'lucide-react'
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
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getSelectableSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import { FieldLabel, SectionHeading } from '@/pages/website/theme/applyFormControls'
import { ApplyStateSelect } from '../ApplyStateSelect'
import { ApplyDateCalendar } from '../ApplyDateCalendar'
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
  travelDateEnd?: string
  onSelect: (jurisdictionId: string, jurisdictionName?: string) => void
  onPassportStateChange: (stateName: string) => void
  onPlaceOfResidenceChange: (stateName: string) => void
  onTravelDateChange: (isoDate: string) => void
  onTravelDateEndChange: (isoDate: string) => void
  onBack: () => void
  onContinue: () => void
}

/**
 * Submission centre + travel date.
 *
 * Composition: two zones inside one field, split by a vertical hairline — not two
 * elevated cards sitting next to each other. The resolved application centre is a
 * typographic readout anchored to a gold rule, which is the payoff of filling in the two
 * fields above it, so it reads as a result rather than another input box.
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
  travelDateEnd = '',
  onSelect,
  onPassportStateChange,
  onPlaceOfResidenceChange,
  onTravelDateChange,
  onTravelDateEndChange,
  onBack,
  onContinue,
}: JurisdictionStepProps) {
  const applicableStates = useMemo(
    () => getApplicableStatesForOffering(countryId, visaOfferingId),
    [countryId, visaOfferingId],
  )

  const useStateMapping = applicableStates.length > 0
  const needsCity = jurisdictions.length > 0
  const mappingState = resolveJurisdictionMappingState(placeOfResidence, issuedPassportState)
  const resolved = selectedId ? jurisdictions.find((j) => j.id === selectedId) : undefined
  const centreLabel = resolved?.name ?? jurisdictionName ?? ''
  const centreMeta = [resolved?.embassyOrVfs, resolved?.submissionCenter].filter(Boolean).join(' · ')

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
    !travelDateEnd.trim() ||
    (useStateMapping
      ? !(issuedPassportState.trim() && mappingState && selectedId)
      : needsCity && !selectedId)

  /**
   * The resolved centre sits directly under the fields that produce it, so the cause and
   * the result read as one thought. It is a bordered card rather than the plain text it
   * used to be — prominent enough to be the answer to the step's question, small enough
   * not to outweigh the inputs above it.
   */
  const centreCard = (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        px: 2.75,
        py: 2.25,
        borderRadius: applyRadius.card,
        border: `1px solid ${centreLabel ? applyFlow.accentBorder : applyFlow.hairline}`,
        backgroundColor: centreLabel ? applyFlow.accentSoft : applyFlow.canvas,
        transition: `border-color 220ms ${applyMotion.easeOut}, background-color 220ms ${applyMotion.easeOut}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 28,
          height: 28,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: applyRadius.chip,
          backgroundColor: applyFlow.surface,
          border: `1px solid ${centreLabel ? applyFlow.accentBorder : applyFlow.hairline}`,
          color: centreLabel ? applyFlow.accentInk : applyFlow.inkFaint,
        }}
      >
        <MapPin size={14} strokeWidth={1.9} />
      </Box>

      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Typography
          sx={{
            ...tabularNums,
            fontFamily: applyFont.mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
            mb: 0.75,
          }}
        >
          Your application centre
        </Typography>
        <Typography
          sx={{
            fontFamily: applyFont.display,
            fontSize: centreLabel ? 16 : 13.5,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: centreLabel ? applyFlow.ink : applyFlow.inkMuted,
          }}
        >
          {centreLabel || (useStateMapping ? 'Select a state to resolve your centre' : 'Choose a submission city')}
        </Typography>
        {centreMeta ? (
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10.5,
              color: applyFlow.inkMuted,
              mt: 0.75,
              lineHeight: 1.45,
            }}
          >
            {centreMeta}
          </Typography>
        ) : null}
      </Box>

    </Box>
  )

  return (
    <StepShell
      title="Where will you submit your application?"
      helperText="Your residence decides the application centre. Then lock in the dates you intend to travel."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      contentMaxWidth={1000}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'stretch',
          gap: { xs: 6, lg: 0 },
        }}
      >
        {/* ── Zone 1: resolve the centre ─────────────────────────── */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', lg: '1 1 46%' },
            minWidth: 0,
            pr: { xs: 0, lg: 6 },
          }}
        >
          <SectionHeading>{useStateMapping ? 'Jurisdiction' : 'Submission city'}</SectionHeading>

          {useStateMapping ? (
            <Stack spacing={3.5}>
              <Box>
                <FieldLabel htmlFor="passport-state" required>
                  Issued passport state
                </FieldLabel>
                <ApplyStateSelect
                  id="passport-state"
                  value={issuedPassportState}
                  options={applicableStates}
                  onChange={onPassportStateChange}
                  placeholder="Select issuing state"
                  aria-label="Issued passport state"
                />
              </Box>

              <Box>
                <FieldLabel htmlFor="residence-state">Place of residence</FieldLabel>
                <ApplyStateSelect
                  id="residence-state"
                  value={placeOfResidence}
                  options={applicableStates}
                  onChange={onPlaceOfResidenceChange}
                  placeholder="Where you live (6+ months)"
                  aria-label="Place of residence (more than 6 months)"
                  clearable
                />
                <Typography
                  sx={{
                    fontFamily: applyFont.body,
                    fontSize: 12.5,
                    color: applyFlow.inkMuted,
                    mt: 2,
                    lineHeight: 1.5,
                  }}
                >
                  If you set both, residence takes priority over passport state.
                </Typography>
              </Box>

              {centreCard}
            </Stack>
          ) : needsCity ? (
            <Stack spacing={2}>
            <Stack spacing={2} role="radiogroup" aria-label="Submission city">
              {jurisdictions.map((jurisdiction) => {
                const selected = jurisdiction.id === selectedId
                return (
                  <Box
                    key={jurisdiction.id}
                    component="button"
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onSelect(jurisdiction.id, jurisdiction.name)}
                    sx={{
                      ...getSelectableSx(selected),
                      appearance: 'none',
                      font: 'inherit',
                      textAlign: 'left',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3.5,
                      pl: 4.5,
                      pr: 4,
                      py: 3.5,
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 36,
                        height: 36,
                        flex: '0 0 auto',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: applyRadius.chip,
                        backgroundColor: selected ? 'transparent' : applyFlow.canvas,
                        border: `1px solid ${selected ? applyFlow.accentBorder : applyFlow.hairline}`,
                        color: selected ? applyFlow.accentInk : applyFlow.inkMuted,
                      }}
                    >
                      <MapPin size={16} strokeWidth={1.9} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: applyFont.body,
                          fontSize: 14.5,
                          fontWeight: 600,
                          color: applyFlow.ink,
                          lineHeight: 1.3,
                        }}
                      >
                        {jurisdiction.name}
                      </Typography>
                      {(jurisdiction.embassyOrVfs || jurisdiction.submissionCenter) && (
                        <Typography
                          sx={{
                            fontFamily: applyFont.mono,
                            fontSize: 11,
                            color: applyFlow.inkMuted,
                            mt: 0.8,
                          }}
                        >
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
                        flex: '0 0 auto',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        border: `1.5px solid ${selected ? applyFlow.accent : applyFlow.hairlineStrong}`,
                        backgroundColor: selected ? applyFlow.accent : 'transparent',
                        color: applyFlow.onAccent,
                      }}
                    >
                      {selected ? <Check size={11} strokeWidth={3.5} /> : null}
                    </Box>
                  </Box>
                )
              })}
            </Stack>
            {/* Card sits outside the radiogroup — it is the result, not another option. */}
            {centreCard}
            </Stack>
          ) : (
            <Typography
              sx={{ fontFamily: applyFont.body, fontSize: 13.5, color: applyFlow.inkMuted, lineHeight: 1.55 }}
            >
              No application centres are configured for this visa yet — continue with your travel
              date.
            </Typography>
          )}
        </Box>

        {/* ── Zone 2: travel date ────────────────────────────────── */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', lg: '1 1 54%' },
            minWidth: 0,
            pl: { xs: 0, lg: 6 },
            borderLeft: { xs: 'none', lg: `1px solid ${applyFlow.hairlineSoft}` },
          }}
        >
          <SectionHeading>Travel dates</SectionHeading>
          <ApplyDateCalendar
            value={travelDate}
            onChange={onTravelDateChange}
            endValue={travelDateEnd}
            onRangeEndChange={onTravelDateEndChange}
            config={
              travelFeasibilityConfig ?? {
                requiredWorkingDays: null,
                thresholds: DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS,
              }
            }
            min={travelDateBounds.min}
            max={travelDateBounds.max}
            helperText={travelDateBounds.helperText}
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

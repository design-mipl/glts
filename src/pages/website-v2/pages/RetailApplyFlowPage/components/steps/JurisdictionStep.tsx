import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import type { CountryVisaJurisdiction } from '@/shared/types/countryMaster'
import { getTravelFeasibilityConfig } from '@/shared/services/countryMasterService'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { brandPrimaryGreenRgb, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { TravelDateRiskCalendar } from '@/pages/customer/features/applications/components/create/TravelDateRiskCalendar'
import { StepShell } from '../StepShell'

interface JurisdictionStepProps {
  countryId: string
  visaOfferingId: string
  jurisdictions: CountryVisaJurisdiction[]
  selectedId?: string
  travelDate?: string
  onSelect: (jurisdictionId: string) => void
  onTravelDateChange: (isoDate: string) => void
  onBack: () => void
  onContinue: () => void
}

export function JurisdictionStep({
  countryId,
  visaOfferingId,
  jurisdictions,
  selectedId,
  travelDate = '',
  onSelect,
  onTravelDateChange,
  onBack,
  onContinue,
}: JurisdictionStepProps) {
  const colors = usePublicBrandColors()
  const feasibilityConfig = useMemo(
    () => getTravelFeasibilityConfig(countryId, visaOfferingId, selectedId),
    [countryId, visaOfferingId, selectedId],
  )

  return (
    <StepShell
      title="Where will you submit your application?"
      helperText="We'll use your residence to determine the appropriate application centre."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!selectedId || !travelDate.trim()}
      contentMaxWidth={960}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 3, md: 0 },
          textAlign: 'left',
          alignItems: 'start',
        }}
      >
        {/* Application city */}
        <Box
          sx={{
            pr: { md: 3 },
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              mb: 1.5,
              pb: 1.25,
              borderBottom: `1px dashed ${colors.border}`,
              textAlign: 'center',
            }}
          >
            Submission city
          </Typography>

          {jurisdictions.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: colors.textMuted }}>
              No application centres are configured for this visa yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.25,
                maxHeight: { md: 340 },
                overflowY: 'auto',
                pr: 0.5,
              }}
            >
              {jurisdictions.map((jurisdiction) => {
                const selected = jurisdiction.id === selectedId
                return (
                  <Box
                    key={jurisdiction.id}
                    component="button"
                    type="button"
                    onClick={() => onSelect(jurisdiction.id)}
                    sx={{
                      appearance: 'none',
                      cursor: 'pointer',
                      textAlign: 'center',
                      px: 2,
                      py: 1.5,
                      borderRadius: BORDER_RADIUS.lg,
                      border: `1px solid ${selected ? colors.greenBright : colors.border}`,
                      bgcolor: selected ? `rgba(${brandPrimaryGreenRgb}, 0.06)` : colors.white,
                      color: colors.navy,
                      fontFamily: 'inherit',
                      fontSize: 14,
                      fontWeight: selected ? 700 : 600,
                      lineHeight: 1.3,
                      transition: 'border-color 0.15s ease, background-color 0.15s ease',
                      '&:hover': {
                        borderColor: colors.greenBright,
                      },
                    }}
                  >
                    {jurisdiction.name}
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>

        {/* Travel / application calendar */}
        <Box sx={{ pl: { md: 3 }, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              mb: 1.5,
              pb: 1.25,
              borderBottom: `1px dashed ${colors.border}`,
              textAlign: 'center',
            }}
          >
            Intended travel date
          </Typography>
          <TravelDateRiskCalendar
            value={travelDate}
            onChange={onTravelDateChange}
            config={feasibilityConfig}
          />
        </Box>
      </Box>
    </StepShell>
  )
}

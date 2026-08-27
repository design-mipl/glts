import { Box, Typography } from '@mui/material'
import type { CountryVisaJurisdiction } from '@/shared/types/countryMaster'
import { FormField, Input } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { brandPrimaryGreenRgb, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx } from '@/pages/website-v2/theme/retailFlowTokens'
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

/**
 * Submission city + intended travel date.
 * Uses a plain date field (not MUI X StaticDatePicker) so the retail apply
 * chunk does not depend on Vite pre-bundled `@mui/x-date-pickers` / `dayjs` —
 * a missing dep cache was blanking the entire /apply/new route.
 */
export function JurisdictionStep({
  jurisdictions,
  selectedId,
  travelDate = '',
  onSelect,
  onTravelDateChange,
  onBack,
  onContinue,
}: JurisdictionStepProps) {
  const colors = usePublicBrandColors()
  const needsCity = jurisdictions.length > 0
  const continueDisabled = !travelDate.trim() || (needsCity && !selectedId)

  return (
    <StepShell
      title="Where will you submit your application?"
      helperText="We'll use your residence to determine the appropriate application centre."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
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
        <Box sx={{ pr: { md: 3 }, minWidth: 0 }}>
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

          {!needsCity ? (
            <Typography sx={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.45 }}>
              No application centres are configured for this visa yet — continue with your travel
              date. City options will come from country master later.
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
          <Box
            sx={{
              ...getElevatedCardSx(colors.border),
              borderRadius: BORDER_RADIUS.lg,
              bgcolor: colors.white,
              p: 2,
            }}
          >
            <FormField label="Travel date" required>
              <Input type="date" fullWidth value={travelDate} onChange={onTravelDateChange} />
            </FormField>
            <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mt: 1.5, lineHeight: 1.45 }}>
              Pick the date you plan to enter. We use this for appointment windows and document
              validity checks.
            </Typography>
          </Box>
        </Box>
      </Box>
    </StepShell>
  )
}

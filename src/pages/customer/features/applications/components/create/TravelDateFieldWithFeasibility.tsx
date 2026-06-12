import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import DatePicker from '@/design-system/UIComponents/Primitives/DatePicker'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { evaluateTravelDateFeasibility, type TravelFeasibilityConfig } from '@/shared/utils/travelDateFeasibility'
import { TravelDateFeasibilityCard } from './TravelDateFeasibilityCard'
import { TravelDateRiskCalendar } from './TravelDateRiskCalendar'

interface TravelDateFieldWithFeasibilityProps {
  value: string
  onChange: (isoDate: string) => void
  config: TravelFeasibilityConfig
  applicationWindowHelper?: string
  showCalendar?: boolean
}

function isoToDate(iso: string): Date | null {
  if (!iso.trim()) return null
  const parsed = new Date(iso)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function TravelDateFieldWithFeasibility({
  value,
  onChange,
  config,
  applicationWindowHelper,
  showCalendar = true,
}: TravelDateFieldWithFeasibilityProps) {
  const colors = usePublicBrandColors()
  const hasRiskConfig = Boolean(config.requiredWorkingDays && config.requiredWorkingDays > 0)

  const feasibility = useMemo(
    () =>
      value && hasRiskConfig
        ? evaluateTravelDateFeasibility({ travelDateIso: value, config })
        : null,
    [config, hasRiskConfig, value],
  )

  if (!hasRiskConfig) {
    return (
      <Box>
        <DatePicker
          value={isoToDate(value)}
          onChange={(date) => onChange(date ? date.toISOString().slice(0, 10) : '')}
          fullWidth
          size="sm"
          format="DD/MM/YYYY"
        />
        {applicationWindowHelper ? (
          <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.5 }}>
            {applicationWindowHelper}
          </Typography>
        ) : null}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {showCalendar ? (
        <TravelDateRiskCalendar value={value} onChange={onChange} config={config} />
      ) : (
        <DatePicker
          value={isoToDate(value)}
          onChange={(date) => onChange(date ? date.toISOString().slice(0, 10) : '')}
          fullWidth
          size="sm"
          format="DD/MM/YYYY"
        />
      )}
      {applicationWindowHelper ? (
        <Typography sx={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.35 }}>
          {applicationWindowHelper}
        </Typography>
      ) : null}
      {feasibility ? <TravelDateFeasibilityCard result={feasibility} /> : null}
    </Box>
  )
}

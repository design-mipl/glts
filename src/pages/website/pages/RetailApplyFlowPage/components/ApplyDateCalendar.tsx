import { useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TravelFeasibilityConfig } from '@/shared/utils/travelDateFeasibility'
import {
  assessTravelDateFeasibility,
  getCalendarHeatmapRiskLevel,
} from '@/shared/utils/travelDateFeasibility'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'

interface ApplyDateCalendarProps {
  value: string
  onChange: (isoDate: string) => void
  config: TravelFeasibilityConfig
  min?: string
  max?: string
  helperText?: string
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseIso(v: string): Date | null {
  if (!v) return null
  const [y, m, d] = v.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/** Monday-first offset for the 1st of the month. */
function leadingBlanks(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7
}

/**
 * V2-owned travel-date calendar.
 *
 * Built here rather than reusing the customer portal's `TravelDateFieldWithFeasibility`
 * because that component is shared with the signed-in portal and restyling it would change
 * a surface outside Website V2. The *logic* (feasibility, risk banding) still comes from
 * `@/shared/utils/travelDateFeasibility`, so behaviour stays identical.
 *
 * Risk is shown as a hairline underscore beneath the day, not a filled tile — filled risk
 * tiles turn the month into a heat blanket and fight the gold selection for attention.
 */
export function ApplyDateCalendar({
  value,
  onChange,
  config,
  min,
  max,
  helperText,
}: ApplyDateCalendarProps) {
  const selected = parseIso(value)
  const today = useMemo(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), t.getDate())
  }, [])

  const [cursor, setCursor] = useState(() => {
    const base = selected ?? today
    return { year: base.getFullYear(), month: base.getMonth() }
  })

  const minDate = min ? parseIso(min) : null
  const maxDate = max ? parseIso(max) : null

  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const blanks = leadingBlanks(cursor.year, cursor.month)

  const feasibility = useMemo(
    () =>
      value
        ? assessTravelDateFeasibility({
            applicationDate: new Date(),
            travelDateIso: value,
            requiredWorkingDays: config.requiredWorkingDays,
            thresholds: config.thresholds,
          })
        : null,
    [value, config],
  )

  function shift(delta: number) {
    setCursor((c) => {
      const next = new Date(c.year, c.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const riskTone = (iso: string) => {
    const level = getCalendarHeatmapRiskLevel(iso, config)
    if (level === 'safe') return applyFlow.success
    if (level === 'tight') return applyFlow.warning
    if (level === 'high') return applyFlow.critical
    return 'transparent'
  }

  const navBtnSx = {
    // Compact on a mouse, 44px on touch — density where it's cheap, reach where it matters.
    width: 40,
    height: 40,
    '@media (pointer: coarse)': { width: 44, height: 44 },
    display: 'grid',
    placeItems: 'center',
    appearance: 'none',
    border: `1px solid ${applyFlow.hairline}`,
    borderRadius: applyRadius.control,
    backgroundColor: 'transparent',
    color: applyFlow.inkMuted,
    cursor: 'pointer',
    transition: `border-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}`,
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': { borderColor: applyFlow.hairlineStrong, color: applyFlow.ink },
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: applyFlow.accent,
      boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
    },
  } as const

  return (
    <Box sx={{ width: '100%' }}>
      {/* Month header — slab month name, mono year. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: applyFont.display,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: applyFlow.ink,
              lineHeight: 1.1,
            }}
          >
            {MONTHS[cursor.month]}
          </Typography>
          <Typography
            sx={{
              ...tabularNums,
              fontFamily: applyFont.mono,
              fontSize: 13,
              fontWeight: 500,
              color: applyFlow.inkFaint,
            }}
          >
            {cursor.year}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flex: '0 0 auto' }}>
          <Box component="button" type="button" aria-label="Previous month" onClick={() => shift(-1)} sx={navBtnSx}>
            <ChevronLeft size={16} />
          </Box>
          <Box component="button" type="button" aria-label="Next month" onClick={() => shift(1)} sx={navBtnSx}>
            <ChevronRight size={16} />
          </Box>
        </Box>
      </Box>

      {/* Weekday header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1.5 }}>
        {WEEKDAYS.map((d, i) => (
          <Typography
            key={`${d}-${i}`}
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: applyFlow.inkFaint,
              textAlign: 'center',
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* Day grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {Array.from({ length: blanks }).map((_, i) => (
          <Box key={`b${i}`} aria-hidden />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(cursor.year, cursor.month, day)
          const iso = toIso(date)
          const isSelected = value === iso
          const isToday = date.getTime() === today.getTime()
          const disabled =
            date < today || (minDate && date < minDate) || (maxDate && date > maxDate)
          const tone = disabled ? 'transparent' : riskTone(iso)

          return (
            <Box
              key={iso}
              component="button"
              type="button"
              disabled={Boolean(disabled)}
              aria-label={`${day} ${MONTHS[cursor.month]} ${cursor.year}`}
              aria-pressed={isSelected}
              onClick={() => onChange(iso)}
              sx={{
                position: 'relative',
                appearance: 'none',
                border: 'none',
                background: 'none',
                p: 0,
                height: 38,
                '@media (pointer: coarse)': { height: 44 },
                display: 'grid',
                placeItems: 'center',
                borderRadius: applyRadius.control,
                cursor: disabled ? 'default' : 'pointer',
                backgroundColor: isSelected ? applyFlow.accent : 'transparent',
                color: disabled
                  ? applyFlow.inkDisabled
                  : isSelected
                    ? applyFlow.onAccent
                    : applyFlow.ink,
                fontFamily: applyFont.mono,
                fontSize: 13,
                fontWeight: isSelected || isToday ? 700 : 500,
                ...tabularNums,
                boxShadow: isToday && !isSelected ? `inset 0 0 0 1px ${applyFlow.hairlineStrong}` : 'none',
                transition: `background-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover:not(:disabled)': {
                    backgroundColor: isSelected ? applyFlow.accent : applyFlow.canvas,
                  },
                },
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: `0 0 0 2px ${applyFlow.accent}`,
                },
              }}
            >
              {day}
              {/* Risk underscore — hairline, never a filled tile. */}
              {!disabled && !isSelected && tone !== 'transparent' ? (
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    bottom: 7,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 12,
                    height: '2px',
                    borderRadius: '1px',
                    backgroundColor: tone,
                    opacity: 0.75,
                  }}
                />
              ) : null}
            </Box>
          )
        })}
      </Box>

      {/* Readout — the selected date and what it means for processing. */}
      <Box sx={{ mt: 3, pt: 2.75, borderTop: `1px solid ${applyFlow.hairlineSoft}` }}>
        {feasibility?.headline ? (
          <>
            <Typography
              sx={{
                ...tabularNums,
                fontFamily: applyFont.mono,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:
                  feasibility.status === 'green'
                    ? applyFlow.success
                    : feasibility.status === 'amber'
                      ? applyFlow.warning
                      : applyFlow.critical,
                mb: 1,
              }}
            >
              {feasibility.headline}
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13,
                color: applyFlow.inkMuted,
                lineHeight: 1.5,
              }}
            >
              {feasibility.summaryLine || feasibility.message}
            </Typography>
          </>
        ) : (
          <Typography
            sx={{ fontFamily: applyFont.body, fontSize: 13, color: applyFlow.inkMuted, lineHeight: 1.5 }}
          >
            {helperText || 'Pick your intended travel date to check processing time.'}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

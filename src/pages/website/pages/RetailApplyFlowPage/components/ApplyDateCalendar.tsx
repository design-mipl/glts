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
  /** Departure date (ISO). Doubles as the range start. */
  value: string
  onChange: (isoDate: string) => void
  /** Return date (ISO). When `onRangeEndChange` is supplied the calendar picks a range. */
  endValue?: string
  onRangeEndChange?: (isoDate: string) => void
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
  endValue = '',
  onRangeEndChange,
  config,
  min,
  max,
  helperText,
}: ApplyDateCalendarProps) {
  const selected = parseIso(value)
  const rangeMode = Boolean(onRangeEndChange)
  const today = useMemo(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), t.getDate())
  }, [])

  const [cursor, setCursor] = useState(() => {
    const base = selected ?? today
    return { year: base.getFullYear(), month: base.getMonth() }
  })

  /**
   * Which end of the range the next click sets. Standard travel-site behaviour: the first
   * click always re-arms the start, so changing a trip that's already picked is one click
   * rather than a "clear" affordance nobody finds.
   */
  const [picking, setPicking] = useState<'start' | 'end'>(() =>
    value && !endValue ? 'end' : 'start',
  )
  const [hoverIso, setHoverIso] = useState<string | null>(null)

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

  /** Range end used for painting — the live hover preview while choosing the return date. */
  const previewEndIso =
    rangeMode && picking === 'end' && value && hoverIso && hoverIso > value ? hoverIso : endValue

  function handleDayClick(iso: string) {
    if (!rangeMode) {
      onChange(iso)
      return
    }
    if (picking === 'start') {
      onChange(iso)
      onRangeEndChange?.('')
      setPicking('end')
      return
    }
    // Clicking before the departure date re-anchors the trip rather than rejecting the click.
    if (value && iso < value) {
      onChange(iso)
      onRangeEndChange?.('')
      return
    }
    onRangeEndChange?.(iso)
    setPicking('start')
  }

  const nights =
    value && endValue
      ? Math.round(
          (new Date(`${endValue}T12:00:00`).getTime() - new Date(`${value}T12:00:00`).getTime()) /
            86_400_000,
        )
      : null

  function formatDay(iso: string) {
    const d = parseIso(iso)
    if (!d) return '—'
    return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
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

      {/*
        Day grid. Column gap is 0 so the in-range wash reads as one continuous band across
        the week instead of a dotted line of separate tiles; breathing room comes from the
        row gap and the inner cell instead.
      */}
      <Box
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', columnGap: 0, rowGap: 0.5 }}
        onMouseLeave={() => setHoverIso(null)}
      >
        {Array.from({ length: blanks }).map((_, i) => (
          <Box key={`b${i}`} aria-hidden />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(cursor.year, cursor.month, day)
          const iso = toIso(date)
          const isStart = Boolean(value) && value === iso
          const isEnd = Boolean(previewEndIso) && previewEndIso === iso
          const inRange =
            Boolean(value && previewEndIso) && iso > value && iso < (previewEndIso as string)
          const isEdge = isStart || isEnd
          const isToday = date.getTime() === today.getTime()
          const disabled =
            date < today || (minDate && date < minDate) || (maxDate && date > maxDate)
          const tone = disabled ? 'transparent' : riskTone(iso)
          // Band caps: square the inner edge so start→end joins up, round the outer edge.
          const bandRadius =
            isStart && isEnd
              ? applyRadius.control
              : isStart
                ? `${applyRadius.control} 0 0 ${applyRadius.control}`
                : isEnd
                  ? `0 ${applyRadius.control} ${applyRadius.control} 0`
                  : 0

          return (
            <Box
              key={iso}
              sx={{
                position: 'relative',
                // The continuous range wash lives on the wrapper, the pill on the button.
                backgroundColor:
                  rangeMode && (inRange || (isEdge && previewEndIso && value !== previewEndIso))
                    ? applyFlow.accentSoft
                    : 'transparent',
                borderRadius: bandRadius,
              }}
            >
              <Box
                component="button"
                type="button"
                disabled={Boolean(disabled)}
                aria-label={`${day} ${MONTHS[cursor.month]} ${cursor.year}`}
                aria-pressed={isEdge}
                onClick={() => handleDayClick(iso)}
                onMouseEnter={() => setHoverIso(iso)}
                sx={{
                  position: 'relative',
                  width: '100%',
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
                  backgroundColor: isEdge ? applyFlow.accent : 'transparent',
                  color: disabled
                    ? applyFlow.inkDisabled
                    : isEdge
                      ? applyFlow.onAccent
                      : applyFlow.ink,
                  fontFamily: applyFont.mono,
                  fontSize: 13,
                  fontWeight: isEdge || isToday ? 700 : 500,
                  ...tabularNums,
                  boxShadow: isToday && !isEdge ? `inset 0 0 0 1px ${applyFlow.hairlineStrong}` : 'none',
                  transition: `background-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}`,
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover:not(:disabled)': {
                      backgroundColor: isEdge ? applyFlow.accent : applyFlow.canvas,
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
                {!disabled && !isEdge && tone !== 'transparent' ? (
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
              {/* Which end of the trip this is — the range is unreadable without it. */}
              {rangeMode && isEdge && !disabled ? (
                <Typography
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -1,
                    textAlign: 'center',
                    fontFamily: applyFont.mono,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: applyFlow.accentInk,
                    pointerEvents: 'none',
                  }}
                >
                  {isStart && isEnd ? '' : isStart ? 'OUT' : 'BACK'}
                </Typography>
              ) : null}
            </Box>
          )
        })}
      </Box>

      {/* Trip summary — two slots the customer can re-arm, like a flight search. */}
      {rangeMode ? (
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0, mt: 3 }}>
          {(
            [
              { key: 'start' as const, label: 'Departure', iso: value },
              { key: 'end' as const, label: 'Return', iso: endValue },
            ]
          ).map((slot, index) => {
            const active = picking === slot.key
            return (
              <Box
                key={slot.key}
                component="button"
                type="button"
                onClick={() => setPicking(slot.key)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  appearance: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  px: 3,
                  py: 2.25,
                  border: `1px solid ${active ? applyFlow.accent : applyFlow.hairline}`,
                  ...(index === 0
                    ? { borderRadius: `${applyRadius.control} 0 0 ${applyRadius.control}` }
                    : { borderRadius: `0 ${applyRadius.control} ${applyRadius.control} 0`, ml: '-1px' }),
                  backgroundColor: active ? applyFlow.accentSoft : applyFlow.surface,
                  zIndex: active ? 1 : 0,
                  transition: `border-color 150ms ${applyMotion.easeOut}, background-color 150ms ${applyMotion.easeOut}`,
                  '&:focus-visible': {
                    outline: 'none',
                    borderColor: applyFlow.accent,
                    boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
                    zIndex: 2,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: applyFont.mono,
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: applyFlow.inkFaint,
                  }}
                >
                  {slot.label}
                </Typography>
                <Typography
                  sx={{
                    ...tabularNums,
                    fontFamily: applyFont.body,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: slot.iso ? applyFlow.ink : applyFlow.inkFaint,
                    mt: 0.75,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {slot.iso ? formatDay(slot.iso) : 'Select a date'}
                </Typography>
              </Box>
            )
          })}
        </Box>
      ) : null}

      {/* Readout — the selected date and what it means for processing. */}
      <Box sx={{ mt: 3, pt: 2.75, borderTop: `1px solid ${applyFlow.hairlineSoft}` }}>
        {rangeMode && nights != null ? (
          <Typography
            sx={{
              ...tabularNums,
              fontFamily: applyFont.mono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
              mb: 1.5,
            }}
          >
            {nights === 0 ? 'Same-day trip' : `${nights} night${nights === 1 ? '' : 's'}`}
          </Typography>
        ) : null}
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
            {helperText ||
              (rangeMode
                ? 'Pick your departure date, then your return date.'
                : 'Pick your intended travel date to check processing time.')}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

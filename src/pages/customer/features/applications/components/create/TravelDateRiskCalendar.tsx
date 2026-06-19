import { createContext, useContext, useMemo } from 'react'
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import dayjs, { type Dayjs } from 'dayjs'
import { Calendar } from 'lucide-react'
import { FORM_CONTROL, formControlHeight, pickersOutlinedFieldSx } from '@/design-system/formControl'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getCalendarHeatmapRiskLevel,
  type CalendarRiskLevel,
  type TravelFeasibilityConfig,
} from '@/shared/utils/travelDateFeasibility'

const FeasibilityConfigContext = createContext<TravelFeasibilityConfig | null>(null)

const CALENDAR_CELL_GAP = 3
const CALENDAR_DAY_HEIGHT = 34
const CALENDAR_WEEKS_VISIBLE = 6
const calendarBodyMinHeight =
  CALENDAR_WEEKS_VISIBLE * CALENDAR_DAY_HEIGHT + (CALENDAR_WEEKS_VISIBLE - 1) * CALENDAR_CELL_GAP

/** Full-width day tiles — flex rows keep MUI week layout intact while stretching each cell. */
const compactCalendarLayoutSx = {
  overflow: 'hidden',
  borderRadius: BORDER_RADIUS.lg,
  '& .MuiPickersLayout-root, & [class*="MuiPickersLayout-root"]': {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    bgcolor: 'background.paper',
  },
  '& .MuiPickersLayout-contentWrapper, & [class*="MuiPickersLayout-contentWrapper"]': {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  '& .MuiDateCalendar-root': {
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    maxHeight: 'none',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    bgcolor: 'background.paper',
  },
  '& .MuiPickersCalendarHeader-root, & [class*="MuiPicker.CalendarHeader-root"]': {
    px: 2,
    mt: 0,
    mb: 1,
    pb: 1,
    minHeight: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: `${BORDER_WIDTH.thin} solid`,
    borderColor: 'divider',
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    '& .MuiPickersArrowSwitcher-root, & [class*="MuiPickersArrowSwitcher-root"]': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      mx: 0,
      position: 'relative',
    },
    '& .MuiPickersArrowSwitcher-spacer': {
      display: 'none',
    },
    '& .MuiPickersCalendarHeader-labelContainer': {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      margin: 0,
      pointerEvents: 'none',
    },
    '& .MuiPickersCalendarHeader-label': {
      fontSize: 13,
      fontWeight: 700,
      textAlign: 'center',
      margin: 0,
      pointerEvents: 'auto',
    },
    '& .MuiPickersArrowSwitcher-button': {
      width: 36,
      height: 36,
      flexShrink: 0,
      zIndex: 1,
    },
  },
  '& .MuiDayCalendar-header': {
    display: 'flex',
    justifyContent: 'space-between',
    gap: `${CALENDAR_CELL_GAP}px`,
    pl: 0,
    pr: 0,
    m: 0,
    mb: `${CALENDAR_CELL_GAP}px`,
  },
  '& .MuiDayCalendar-weekDayLabel': {
    flex: '1 1 0',
    minWidth: 0,
    m: 0,
    p: 0,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1.2,
    color: 'text.secondary',
  },
  '& .MuiDayCalendar-root': {
    width: '100%',
    maxWidth: '100%',
    px: 2,
    pb: 1.5,
    boxSizing: 'border-box',
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
  },
  '& .MuiDayCalendar-monthContainer': {
    width: '100%',
    pb: 0.5,
  },
  '& .MuiDayCalendar-weekContainer': {
    display: 'flex !important',
    justifyContent: 'space-between',
    gap: `${CALENDAR_CELL_GAP}px`,
    width: '100%',
    m: 0,
    mb: `${CALENDAR_CELL_GAP}px`,
    py: 0,
    '&:last-of-type': {
      mb: 0,
    },
  },
  '& .MuiPicker.Layout-contentWrapper, & .MuiPickersLayout-contentWrapper, & [class*="MuiPickersLayout-contentWrapper"]': {
    px: 2,
    pb: 1.5,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
  },
  '& .MuiDayCalendar-slideTransition': {
    minHeight: calendarBodyMinHeight,
    overflow: 'visible',
  },
  '& .MuiPickersDay-root': {
    flex: '1 1 0',
    minWidth: 0,
    width: 'auto',
    maxWidth: 'none',
    height: CALENDAR_DAY_HEIGHT,
    m: 0,
    p: 0,
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
} as const

function riskTileStyles(risk: CalendarRiskLevel, colors: ReturnType<typeof usePublicBrandColors>) {
  return {
    safe: {
      backgroundColor: colors.greenMuted,
      color: colors.greenDark,
      borderColor: 'rgba(115, 192, 100, 0.45)',
    },
    tight: {
      backgroundColor: 'rgba(245, 158, 11, 0.22)',
      color: '#B45309',
      borderColor: 'rgba(245, 158, 11, 0.45)',
    },
    high: {
      backgroundColor: 'rgba(239, 68, 68, 0.16)',
      color: '#DC2626',
      borderColor: 'rgba(239, 68, 68, 0.4)',
    },
    past: {
      backgroundColor: colors.white,
      color: colors.textMuted,
      borderColor: colors.border,
    },
    unavailable: {
      backgroundColor: colors.white,
      color: colors.textSecondary,
      borderColor: colors.border,
    },
  }[risk]
}

interface TravelDateRiskCalendarProps {
  value: string
  onChange: (isoDate: string) => void
  config: TravelFeasibilityConfig
}

function isoToDayjs(iso: string): Dayjs | null {
  if (!iso.trim()) return null
  const parsed = dayjs(iso)
  return parsed.isValid() ? parsed : null
}

function RiskPickersDay(props: PickersDayProps) {
  const colors = usePublicBrandColors()
  const config = useContext(FeasibilityConfigContext)
  const { sx: daySx, outsideCurrentMonth, selected, ...dayProps } = props
  const iso = props.day.format('YYYY-MM-DD')
  const risk: CalendarRiskLevel = config ? getCalendarHeatmapRiskLevel(iso, config) : 'unavailable'
  const isOutsideMonth = Boolean(outsideCurrentMonth)
  const tile = riskTileStyles(risk, colors)

  const outsideMonthNeutralSx = {
    backgroundColor: 'transparent',
    color: colors.textMuted,
    borderColor: 'transparent',
    '&&': {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: colors.textMuted,
    },
    '&.MuiPickersDay-today': {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: colors.textMuted,
    },
    '&.Mui-selected, &.Mui-focusVisible, &.Mui-selected.Mui-focusVisible': {
      backgroundColor: 'transparent',
      color: colors.textMuted,
      borderColor: 'transparent',
    },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': {
        backgroundColor: colors.surface,
        color: colors.textSecondary,
        borderColor: 'transparent',
      },
    },
  }

  const selectedBrandSx = {
    backgroundColor: colors.green,
    color: colors.onBrandFilled,
    borderColor: colors.greenDark,
    transition: 'background-color 120ms ease, border-color 120ms ease',
    '&&': {
      backgroundColor: colors.green,
      borderColor: colors.greenDark,
      color: colors.onBrandFilled,
    },
    '&.MuiPickersDay-today': {
      backgroundColor: colors.green,
      borderColor: colors.greenDark,
      color: colors.onBrandFilled,
    },
    '&.Mui-selected, &.Mui-focusVisible, &.Mui-selected.Mui-focusVisible': {
      backgroundColor: colors.green,
      color: colors.onBrandFilled,
      borderColor: colors.greenDark,
    },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover, &.Mui-selected:hover': {
        backgroundColor: colors.greenDark,
        color: colors.onBrandFilled,
        borderColor: colors.greenDark,
      },
    },
  }

  const riskTileSx = {
    color: tile.color,
    backgroundColor: tile.backgroundColor,
    borderColor: tile.borderColor,
    transition: 'background-color 120ms ease, border-color 120ms ease',
    '&&': {
      backgroundColor: tile.backgroundColor,
      borderColor: tile.borderColor,
      color: tile.color,
    },
    '&.MuiPickersDay-today': {
      backgroundColor: tile.backgroundColor,
      borderColor: tile.borderColor,
      color: tile.color,
    },
    '&.Mui-selected, &.Mui-focusVisible, &.Mui-selected.Mui-focusVisible': {
      backgroundColor: tile.backgroundColor,
      color: tile.color,
      borderColor: tile.borderColor,
    },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover, &.Mui-selected:hover': {
        backgroundColor: tile.backgroundColor,
        color: tile.color,
        borderColor: tile.borderColor,
      },
    },
  }

  return (
    <PickersDay
      {...dayProps}
      outsideCurrentMonth={outsideCurrentMonth}
      selected={selected}
      disableRipple
      disableHighlightToday
      onClick={(event, day) => {
        dayProps.onClick?.(event, day)
        ;(event.currentTarget as HTMLElement).blur()
      }}
      sx={[
        ...(Array.isArray(daySx) ? daySx : daySx ? [daySx] : []),
        {
          flex: '1 1 0',
          minWidth: 0,
          height: CALENDAR_DAY_HEIGHT,
          fontSize: isOutsideMonth && !selected ? '11px' : '12px',
          fontWeight: selected ? 700 : isOutsideMonth ? 400 : 600,
          lineHeight: 1,
          borderRadius: '6px',
          borderWidth: isOutsideMonth && !selected ? 0 : 1,
          borderStyle: 'solid',
          ...(selected ? selectedBrandSx : isOutsideMonth ? outsideMonthNeutralSx : riskTileSx),
          opacity: selected ? 1 : isOutsideMonth ? 0.38 : 1,
        },
      ]}
    />
  )
}

function CalendarLegend() {
  const colors = usePublicBrandColors()
  const items = [
    { key: 'safe', label: 'Safe to Apply', bg: colors.greenMuted, border: 'rgba(115, 192, 100, 0.35)' },
    { key: 'tight', label: 'Timeline Tight', bg: 'rgba(245, 158, 11, 0.22)', border: 'rgba(245, 158, 11, 0.35)' },
    { key: 'high', label: 'High Risk', bg: 'rgba(239, 68, 68, 0.16)', border: 'rgba(239, 68, 68, 0.35)' },
  ] as const

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
      {items.map((item) => (
        <Stack key={item.key} direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: BORDER_RADIUS.full,
              bgcolor: item.bg,
              border: `1px solid ${item.border}`,
            }}
          />
          <Typography sx={{ fontSize: 11, color: colors.textSecondary }}>{item.label}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export function TravelDateRiskCalendar({ value, onChange, config }: TravelDateRiskCalendarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dayjsValue = isoToDayjs(value)
  const inputHeight = formControlHeight('sm')

  const desktopPaperSx = useMemo(
    () => ({
      borderRadius: BORDER_RADIUS.lg,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      ...compactCalendarLayoutSx,
    }),
    [theme],
  )

  const handleChange = (next: Dayjs | null) => {
    onChange(next && next.isValid() ? next.format('YYYY-MM-DD') : '')
  }

  return (
    <FeasibilityConfigContext.Provider value={config}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {isMobile ? (
          <MuiDatePicker
            value={dayjsValue}
            onChange={handleChange}
            format="DD/MM/YYYY"
            disableHighlightToday
            showDaysOutsideCurrentMonth
            fixedWeekNumber={CALENDAR_WEEKS_VISIBLE}
            slots={{ openPickerIcon: () => <Calendar size={16} />, day: RiskPickersDay }}
            slotProps={{
              desktopPaper: { sx: desktopPaperSx },
              calendar: {
                showDaysOutsideCurrentMonth: true,
                fixedWeekNumber: CALENDAR_WEEKS_VISIBLE,
              },
              textField: {
                size: 'small',
                fullWidth: true,
                variant: 'outlined',
                placeholder: 'DD/MM/YYYY',
                sx: [
                  pickersOutlinedFieldSx(theme, inputHeight),
                  { '& .MuiPickersInputBase-sectionContainer': { fontSize: FORM_CONTROL.fontSize } },
                ],
              },
              openPickerButton: {
                size: 'small',
                sx: { color: 'text.secondary', mr: 0.5 },
              },
            }}
          />
        ) : (
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: BORDER_RADIUS.lg,
              bgcolor: 'background.paper',
              ...compactCalendarLayoutSx,
            }}
          >
            <StaticDatePicker
              value={dayjsValue}
              onChange={handleChange}
              disableHighlightToday
              showDaysOutsideCurrentMonth
              fixedWeekNumber={CALENDAR_WEEKS_VISIBLE}
              slots={{
                day: RiskPickersDay,
                toolbar: () => null,
                actionBar: () => null,
              }}
              sx={{
                width: '100%',
                borderRadius: BORDER_RADIUS.lg,
                overflow: 'hidden',
              }}
            />
          </Box>
        )}
        <CalendarLegend />
      </LocalizationProvider>
    </FeasibilityConfigContext.Provider>
  )
}

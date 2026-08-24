import { useMemo, useState, type MouseEvent } from 'react'
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  Card,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Popover,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { publicLayout, publicShadows, usePublicBrandColors } from '../../../theme/publicSiteTokens'

export type TripLengthChoice = '' | 'under-2-weeks' | '2-to-4-weeks' | 'month-or-longer'
export type ApplicantGroupChoice = 'just-me' | 'family-group'
export type ApplicantConcern =
  | 'first-time-applying'
  | 'previously-refused'
  | 'travelling-with-minor'
  | 'self-employed-no-salary-slips'

export interface DestinationPlanningFilters {
  travelDate: string
  tripLength: TripLengthChoice
  concerns: ApplicantConcern[]
  applicantGroup: ApplicantGroupChoice
}

interface FilterSidebarProps {
  filters: DestinationPlanningFilters
  onFiltersChange: (filters: DestinationPlanningFilters) => void
}

const defaultFilters: DestinationPlanningFilters = {
  travelDate: '',
  tripLength: '',
  concerns: [],
  applicantGroup: 'just-me',
}

const tripLengthOptions: { value: TripLengthChoice; label: string }[] = [
  { value: 'under-2-weeks', label: 'Under 2 weeks' },
  { value: '2-to-4-weeks', label: '2 to 4 weeks' },
  { value: 'month-or-longer', label: 'A month or longer' },
]

const concernOptions: { value: ApplicantConcern; label: string }[] = [
  { value: 'first-time-applying', label: 'First-time applying' },
  { value: 'previously-refused', label: 'Previously refused' },
  { value: 'travelling-with-minor', label: 'Travelling with a minor' },
  { value: 'self-employed-no-salary-slips', label: 'Self-employed/no salary slips' },
]

const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const displayDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})
const monthFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'long',
  year: 'numeric',
})

function parseIsoDate(value: string): Date | null {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null

  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1)
}

function buildCalendarDays(month: Date): Date[] {
  const firstDay = startOfMonth(month)
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
}

export function getDefaultDestinationPlanningFilters(): DestinationPlanningFilters {
  return defaultFilters
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const colors = usePublicBrandColors()
  const selectedDate = useMemo(() => parseIsoDate(filters.travelDate), [filters.travelDate])
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null)
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? new Date()))
  const isDatePickerOpen = Boolean(dateAnchorEl)
  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth])
  const todayIso = toIsoDate(new Date())
  const formattedTravelDate = selectedDate ? displayDateFormatter.format(selectedDate) : ''

  const openDatePicker = (event: MouseEvent<HTMLElement>) => {
    setVisibleMonth(startOfMonth(selectedDate ?? new Date()))
    setDateAnchorEl(event.currentTarget)
  }

  const selectTravelDate = (date: Date) => {
    onFiltersChange({ ...filters, travelDate: toIsoDate(date) })
    setDateAnchorEl(null)
  }

  const toggleConcern = (value: ApplicantConcern) => {
    const concerns = filters.concerns.includes(value)
      ? filters.concerns.filter(item => item !== value)
      : [...filters.concerns, value]
    onFiltersChange({ ...filters, concerns })
  }

  const hasActiveFilters =
    filters.travelDate ||
    filters.tripLength ||
    filters.concerns.length > 0 ||
    filters.applicantGroup !== defaultFilters.applicantGroup

  return (
    <>
      <Card
        sx={{
          p: { xs: 2, md: 2.25 },
          borderRadius: publicLayout.cardRadius,
          border: `1px solid ${colors.border}`,
          boxShadow: publicShadows.card,
          position: 'sticky',
          top: 96,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.25 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: colors.navy, letterSpacing: '0.5px' }}>
            PLAN YOUR VISA
          </Typography>
          <Button
            size="small"
            disabled={!hasActiveFilters}
            onClick={() => onFiltersChange(defaultFilters)}
            sx={{ color: colors.greenBright, fontWeight: 600, textTransform: 'none', minWidth: 'auto', p: 0 }}
          >
            Reset
          </Button>
        </Box>

        <Stack spacing={2.75}>
          <Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 1.25 }}>
              Plan around your trip
            </Typography>
            <Stack spacing={1}>
              <TextField
                fullWidth
                label="When do you fly?"
                placeholder="Select date"
                value={formattedTravelDate}
                onClick={openDatePicker}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarDays size={17} color={colors.greenDark} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ 'aria-label': 'When do you fly?' }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: colors.textMuted,
                    fontSize: '12px',
                    fontWeight: 700,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.greenBright,
                  },
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                    borderRadius: '10px',
                    bgcolor: colors.surface,
                    cursor: 'pointer',
                    '& fieldset': {
                      borderColor: colors.border,
                    },
                    '&:hover fieldset': {
                      borderColor: colors.greenBright,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.greenBright,
                      borderWidth: 1,
                    },
                  },
                  '& .MuiInputBase-input': {
                    cursor: 'pointer',
                    py: 1,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: colors.navy,
                  },
                }}
              />
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={filters.tripLength}
                onChange={(_, value: TripLengthChoice | null) => {
                  onFiltersChange({ ...filters, tripLength: value ?? '' })
                }}
                aria-label="Trip length"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 0.75,
                  '& .MuiToggleButton-root': {
                    minHeight: 34,
                    border: `1px solid ${colors.border} !important`,
                    borderRadius: '10px !important',
                    justifyContent: 'flex-start',
                    px: 1.25,
                    py: 0.65,
                    color: colors.textSecondary,
                    textTransform: 'none',
                    fontSize: '13px',
                    lineHeight: 1.2,
                    '&.Mui-selected': {
                      bgcolor: colors.greenMuted,
                      color: colors.greenDark,
                      fontWeight: 700,
                    },
                  },
                }}
              >
                {tripLengthOptions.map(option => (
                  <ToggleButton key={option.value} value={option.value}>
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 1 }}>
              Anything we should know?
            </Typography>
            <FormGroup sx={{ gap: 0.25 }}>
              {concernOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  sx={{ m: 0, minHeight: 26, alignItems: 'center' }}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.concerns.includes(option.value)}
                      onChange={() => toggleConcern(option.value)}
                      sx={{ p: 0.25, mr: 0.75, '&.Mui-checked': { color: colors.greenBright } }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '13px', lineHeight: 1.25 }}>{option.label}</Typography>}
                />
              ))}
            </FormGroup>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 1 }}>
              Who's applying?
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={filters.applicantGroup}
              onChange={(_, value: ApplicantGroupChoice | null) => {
                if (value) onFiltersChange({ ...filters, applicantGroup: value })
              }}
              aria-label="Applicant group"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                width: '100%',
                gap: 0.5,
                p: 0.5,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                bgcolor: colors.surface,
                '& .MuiToggleButtonGroup-grouped': {
                  m: 0,
                  border: '0 !important',
                },
                '& .MuiToggleButton-root': {
                  minHeight: 30,
                  borderRadius: '8px !important',
                  color: colors.textSecondary,
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  px: 0.75,
                  py: 0.5,
                  '&.Mui-selected': {
                    bgcolor: colors.greenMuted,
                    color: colors.greenDark,
                  },
                },
              }}
            >
              <ToggleButton value="just-me">Just me</ToggleButton>
              <ToggleButton value="family-group">Family / group</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Card>

      <Popover
        open={isDatePickerOpen}
        anchorEl={dateAnchorEl}
        onClose={() => setDateAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            width: 276,
            mt: 0.75,
            p: 1.5,
            borderRadius: '14px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
          },
        }}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ fontSize: '14px', fontWeight: 800, color: colors.navy }}>
              {monthFormatter.format(visibleMonth)}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" aria-label="Previous month" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}>
                <ChevronLeft size={16} />
              </IconButton>
              <IconButton size="small" aria-label="Next month" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}>
                <ChevronRight size={16} />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
            {weekdayLabels.map(label => (
              <Typography key={label} align="center" sx={{ fontSize: '11px', fontWeight: 800, color: colors.textMuted }}>
                {label}
              </Typography>
            ))}
            {calendarDays.map(date => {
              const isoDate = toIsoDate(date)
              const isSelected = filters.travelDate === isoDate
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
              const isToday = todayIso === isoDate

              return (
                <Button
                  key={isoDate}
                  onClick={() => selectTravelDate(date)}
                  sx={{
                    minWidth: 0,
                    width: 32,
                    height: 32,
                    p: 0,
                    borderRadius: '9px',
                    color: isSelected ? colors.white : isCurrentMonth ? colors.navy : colors.textMuted,
                    bgcolor: isSelected ? colors.greenBright : 'transparent',
                    border: isToday && !isSelected ? `1px solid ${colors.greenBright}` : '1px solid transparent',
                    fontSize: '13px',
                    fontWeight: isSelected || isToday ? 800 : 600,
                    '&:hover': {
                      bgcolor: isSelected ? colors.greenDark : colors.greenMuted,
                      color: isSelected ? colors.white : colors.greenDark,
                    },
                  }}
                >
                  {date.getDate()}
                </Button>
              )
            })}
          </Box>

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              onClick={() => {
                onFiltersChange({ ...filters, travelDate: '' })
                setDateAnchorEl(null)
              }}
              sx={{ textTransform: 'none', color: colors.textSecondary, fontWeight: 700 }}
            >
              Clear
            </Button>
            <Button
              size="small"
              onClick={() => selectTravelDate(new Date())}
              sx={{ textTransform: 'none', color: colors.greenBright, fontWeight: 800 }}
            >
              Today
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}

import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useTheme, alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { Calendar } from 'lucide-react'
import { formControlHeight, outlinedFieldSx } from '../../../formControl'

export interface DatePickerProps {
  label?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  error?: boolean
  helperText?: string
  required?: boolean
  size?: 'sm' | 'md'
  fullWidth?: boolean
  format?: string
  disablePast?: boolean
  disableFuture?: boolean
  sx?: SxProps<Theme>
}

export default function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  error = false,
  helperText,
  required = false,
  size = 'md',
  fullWidth = false,
  format = 'DD/MM/YYYY',
  disablePast = false,
  disableFuture = false,
  sx,
}: DatePickerProps) {
  const theme = useTheme()
  const inputHeight = formControlHeight(size)
  const dayjsValue = value ? dayjs(value) : null
  const dayjsMin = minDate ? dayjs(minDate) : undefined
  const dayjsMax = maxDate ? dayjs(maxDate) : undefined

  const handleChange = (newVal: Dayjs | null) => {
    onChange?.(newVal ? newVal.toDate() : null)
  }

  const sharedInputSx: SxProps<Theme> = [
    outlinedFieldSx(theme, inputHeight),
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ]

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label={label}
        value={dayjsValue}
        onChange={handleChange}
        minDate={dayjsMin}
        maxDate={dayjsMax}
        disabled={disabled}
        disablePast={disablePast}
        disableFuture={disableFuture}
        format={format}
        slots={{ openPickerIcon: () => <Calendar size={16} /> }}
        slotProps={{
          textField: {
            error,
            helperText,
            required,
            size: 'small',
            fullWidth,
            sx: sharedInputSx,
          },
          openPickerButton: {
            size: 'small',
            sx: { color: 'text.secondary' },
          },
          desktopPaper: {
            sx: {
              mt: 0.5,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: theme.shadows[4],
              '& .MuiPickersDay-root': {
                borderRadius: '6px',
                fontSize: '13px',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: theme.palette.primary.dark },
                },
                '&.MuiPickersDay-today:not(.Mui-selected)': {
                  borderColor: theme.palette.primary.main,
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  )
}

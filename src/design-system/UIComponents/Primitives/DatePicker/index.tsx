import Box from '@mui/material/Box'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useTheme, alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { Calendar } from 'lucide-react'
import { FORM_CONTROL, formControlHeight, pickersFullWidthSx, pickersOutlinedFieldSx } from '../../../formControl'

export interface DatePickerProps {
  label?: string
  placeholder?: string
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
  placeholder,
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  error = false,
  helperText,
  required = false,
  size = 'sm',
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
    pickersOutlinedFieldSx(theme, inputHeight),
    {
      '& .MuiPickersInputBase-sectionContainer': {
        fontSize: FORM_CONTROL.fontSize,
      },
      '& .MuiInputAdornment-root': {
        marginRight: '4px',
      },
    },
    ...(fullWidth ? [pickersFullWidthSx()] : []),
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ]

  return (
    <Box sx={{ width: fullWidth ? '100%' : undefined, minWidth: fullWidth ? 0 : undefined, display: fullWidth ? 'block' : undefined }}>
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
          sx={[
            ...(fullWidth ? [pickersFullWidthSx()] : []),
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
          slotProps={{
            textField: {
              error,
              helperText,
              required,
              size: 'small',
              fullWidth: fullWidth || undefined,
              variant: 'outlined',
              hiddenLabel: !label,
              placeholder: placeholder ?? (label ? undefined : format),
              sx: sharedInputSx,
              slotProps: {
                formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
              },
            },
            openPickerButton: {
              size: 'small',
              sx: { color: 'text.secondary', mr: 0.5 },
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
    </Box>
  )
}

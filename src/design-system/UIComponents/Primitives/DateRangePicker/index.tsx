import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'
import DatePicker from '../DatePicker'
import { FORM_CONTROL, formFieldLabelSx } from '../../../formControl'
import type { SxProps, Theme } from '@mui/material/styles'

export interface DateRangePickerProps {
  label?: string
  startLabel?: string
  endLabel?: string
  startPlaceholder?: string
  endPlaceholder?: string
  value?: [Date | null, Date | null]
  onChange?: (range: [Date | null, Date | null]) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  error?: boolean
  helperText?: string
  size?: 'sm' | 'md'
  fullWidth?: boolean
  sx?: SxProps<Theme>
}

export default function DateRangePicker({
  label,
  startLabel,
  endLabel,
  startPlaceholder = 'DD/MM/YYYY',
  endPlaceholder = 'DD/MM/YYYY',
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  error = false,
  helperText,
  size = 'sm',
  fullWidth = false,
  sx,
}: DateRangePickerProps) {
  const startVal = value?.[0] ?? null
  const endVal = value?.[1] ?? null

  const handleStartChange = (date: Date | null) => {
    onChange?.([date, endVal])
  }

  const handleEndChange = (date: Date | null) => {
    onChange?.([startVal, date])
  }

  return (
    <Stack spacing={1} sx={sx}>
      {label ? (
        <Typography component="span" sx={formFieldLabelSx()}>
          {label}
        </Typography>
      ) : null}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ sm: 'flex-start' }}
      >
        <Box sx={{ flex: 1, minWidth: 0, width: fullWidth ? '100%' : undefined }}>
          {startLabel ? (
            <Typography component="label" sx={formFieldLabelSx()}>
              {startLabel}
            </Typography>
          ) : null}
          <DatePicker
            value={startVal}
            onChange={handleStartChange}
            minDate={minDate}
            maxDate={endVal ?? maxDate}
            disabled={disabled}
            error={error}
            size={size}
            fullWidth={fullWidth}
            placeholder={startPlaceholder}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            flexShrink: 0,
            fontSize: '12px',
            userSelect: 'none',
            pt: startLabel || endLabel ? { sm: 3.25 } : { sm: 0.75 },
          }}
        >
          –
        </Typography>
        <Box sx={{ flex: 1, minWidth: 0, width: fullWidth ? '100%' : undefined }}>
          {endLabel ? (
            <Typography component="label" sx={formFieldLabelSx()}>
              {endLabel}
            </Typography>
          ) : null}
          <DatePicker
            value={endVal}
            onChange={handleEndChange}
            minDate={startVal ?? minDate}
            maxDate={maxDate}
            disabled={disabled}
            error={error}
            size={size}
            fullWidth={fullWidth}
            placeholder={endPlaceholder}
          />
        </Box>
      </Stack>
      {helperText ? (
        <FormHelperText error={error} sx={{ mt: 0, mx: 0, fontSize: FORM_CONTROL.helperFontSize }}>
          {helperText}
        </FormHelperText>
      ) : null}
    </Stack>
  )
}

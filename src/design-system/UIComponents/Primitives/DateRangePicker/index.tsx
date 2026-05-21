import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DatePicker from '../DatePicker'
import type { SxProps, Theme } from '@mui/material/styles'

export interface DateRangePickerProps {
  label?: string
  startLabel?: string
  endLabel?: string
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
  startLabel = 'Start date',
  endLabel = 'End date',
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  error = false,
  helperText,
  size = 'md',
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
      {label && (
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ sm: 'center' }}
      >
        <DatePicker
          label={startLabel}
          value={startVal}
          onChange={handleStartChange}
          minDate={minDate}
          maxDate={endVal ?? maxDate}
          disabled={disabled}
          error={error}
          size={size}
          fullWidth={fullWidth}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' }, flexShrink: 0, fontSize: '12px', userSelect: 'none' }}
        >
          –
        </Typography>
        <DatePicker
          label={endLabel}
          value={endVal}
          onChange={handleEndChange}
          minDate={startVal ?? minDate}
          maxDate={maxDate}
          disabled={disabled}
          error={error}
          helperText={helperText}
          size={size}
          fullWidth={fullWidth}
        />
      </Stack>
    </Stack>
  )
}

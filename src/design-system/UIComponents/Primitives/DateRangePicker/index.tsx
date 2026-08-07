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
  /**
   * `inline` (default) — start/end on one row.
   * `stacked` — vertical; use in narrow filter popovers.
   * `auto` — stacked until container ≥ 420px, then inline.
   */
  layout?: 'auto' | 'inline' | 'stacked'
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
  layout = 'inline',
  sx,
}: DateRangePickerProps) {
  const startVal = value?.[0] ?? null
  const endVal = value?.[1] ?? null
  const isStacked = layout === 'stacked'
  const isInline = layout === 'inline'
  const isAuto = layout === 'auto'
  const stretchFields = fullWidth || isInline || isAuto

  const handleStartChange = (date: Date | null) => {
    onChange?.([date, endVal])
  }

  const handleEndChange = (date: Date | null) => {
    onChange?.([startVal, date])
  }

  return (
    <Stack
      spacing={1}
      sx={{
        width: fullWidth ? '100%' : undefined,
        ...(isAuto ? { containerType: 'inline-size' } : undefined),
        ...sx,
      }}
    >
      {label ? (
        <Typography component="span" sx={formFieldLabelSx()}>
          {label}
        </Typography>
      ) : null}
      <Stack
        direction={isStacked ? 'column' : 'row'}
        spacing={1}
        alignItems={isStacked ? 'stretch' : 'center'}
        flexWrap="nowrap"
        sx={{
          width: fullWidth ? '100%' : undefined,
          ...(isAuto
            ? {
                flexDirection: 'column',
                alignItems: 'stretch',
                '@container (min-width: 420px)': {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              }
            : undefined),
        }}
      >
        <Box
          sx={{
            flex: stretchFields ? '1 1 0' : undefined,
            alignSelf: isStacked ? 'stretch' : undefined,
            minWidth: 0,
            width: isStacked && fullWidth ? '100%' : undefined,
          }}
        >
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
            fullWidth={stretchFields}
            placeholder={startPlaceholder}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: isStacked ? 'none' : 'flex',
            alignItems: 'center',
            flexShrink: 0,
            fontSize: '12px',
            userSelect: 'none',
            pt: startLabel || endLabel ? 2.5 : 0,
            ...(isAuto
              ? {
                  display: 'none',
                  '@container (min-width: 420px)': {
                    display: 'flex',
                  },
                }
              : undefined),
          }}
        >
          –
        </Typography>
        <Box
          sx={{
            flex: stretchFields ? '1 1 0' : undefined,
            alignSelf: isStacked ? 'stretch' : undefined,
            minWidth: 0,
            width: isStacked && fullWidth ? '100%' : undefined,
          }}
        >
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
            fullWidth={stretchFields}
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

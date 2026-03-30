import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import MuiRadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

interface RadioOption {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  label?: string
  value?: string | number
  onChange?: (value: string | number) => void
  options: RadioOption[]
  orientation?: 'horizontal' | 'vertical'
  error?: boolean
  helperText?: string
  size?: 'sm' | 'md'
  sx?: SxProps<Theme>
}

export default function RadioGroup({
  label,
  value,
  onChange,
  options,
  orientation = 'vertical',
  error = false,
  helperText,
  size = 'md',
  sx,
}: RadioGroupProps) {
  return (
    <FormControl error={error} sx={sx}>
      {label && <FormLabel>{label}</FormLabel>}
      <MuiRadioGroup
        value={value ?? ''}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        row={orientation === 'horizontal'}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            control={<Radio size={size === 'sm' ? 'small' : 'medium'} />}
            label={
              opt.description ? (
                <Box>
                  <Typography variant="body2">{opt.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {opt.description}
                  </Typography>
                </Box>
              ) : (
                opt.label
              )
            }
          />
        ))}
      </MuiRadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

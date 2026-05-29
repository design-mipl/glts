import MuiCheckbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { controlLabelSx, FORM_CONTROL } from '../../../formControl'

type CheckboxColor = 'primary' | 'secondary' | 'error' | 'success'
type LabelPlacement = 'end' | 'start' | 'top' | 'bottom'

export interface CheckboxProps {
  label?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  indeterminate?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  color?: CheckboxColor
  labelPlacement?: LabelPlacement
  sx?: SxProps<Theme>
}

const muiSize = { sm: 'small', md: 'medium', lg: 'medium' } as const

export default function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  indeterminate = false,
  disabled = false,
  error = false,
  helperText,
  size = 'md',
  color = 'primary',
  labelPlacement = 'end',
  sx,
}: CheckboxProps) {
  const theme = useTheme()

  const checkbox = (
    <MuiCheckbox
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      indeterminate={indeterminate}
      disabled={disabled}
      color={error ? 'error' : color}
      size={muiSize[size]}
      sx={[
        size === 'lg' ? { '& svg': { fontSize: 26 } } : { '& svg': { fontSize: 20 } },
        {
          borderRadius: '6px',
          transition: 'background-color 0.15s ease',
        },
      ]}
    />
  )

  return (
    <Box sx={sx}>
      {label ? (
        <FormControlLabel
          control={checkbox}
          label={label}
          labelPlacement={labelPlacement}
          sx={[
            controlLabelSx(theme),
            {
              '& .MuiFormControlLabel-label': error
                ? { color: 'error.main', fontSize: FORM_CONTROL.fontSize }
                : {},
            },
          ]}
        />
      ) : (
        checkbox
      )}
      {helperText && (
        <FormHelperText error={error} sx={{ ml: label ? 4 : 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}

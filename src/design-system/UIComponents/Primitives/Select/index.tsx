import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import MuiAvatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { X } from 'lucide-react'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ReactNode } from 'react'
import { FORM_CONTROL, formControlHeight, outlinedFieldSx, selectMenuSlotProps } from '../../../formControl'

interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  icon?: ReactNode
  avatar?: string
  description?: string
}

export interface SelectProps {
  label?: string
  placeholder?: string
  value?: string | number
  onChange?: (value: string | number) => void
  options: SelectOption[]
  error?: boolean
  helperText?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md'
  fullWidth?: boolean
  clearable?: boolean
  loading?: boolean
  sx?: SxProps<Theme>
}

export default function Select({
  label,
  placeholder,
  value,
  onChange,
  options,
  error = false,
  helperText,
  disabled = false,
  required = false,
  size = 'sm',
  fullWidth = false,
  clearable = false,
  loading = false,
  sx,
}: SelectProps) {
  const theme = useTheme()
  const labelId = label ? `select-label-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined
  const inputHeight = formControlHeight(size)
  const [open, setOpen] = useState(false)

  const handleChange = (e: SelectChangeEvent<string | number>) => {
    onChange?.(e.target.value)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
  }

  const showClear = clearable && value !== undefined && value !== ''
  const isEmpty = value === undefined || value === ''

  const renderValue = (selected: string | number) => {
    if (selected === '' || selected === undefined) {
      if (placeholder) {
        return (
          <Box component="span" sx={{ color: 'text.disabled', fontSize: FORM_CONTROL.fontSize }}>
            {placeholder}
          </Box>
        )
      }
      return ''
    }
    const opt = options.find((o) => o.value === selected)
    return opt?.label ?? String(selected)
  }

  return (
    <FormControl
      error={error}
      disabled={disabled || loading}
      required={required}
      fullWidth={fullWidth}
      size="small"
      sx={[outlinedFieldSx(theme, inputHeight), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        labelId={labelId}
        label={label}
        value={value ?? ''}
        onChange={handleChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty={!!placeholder || isEmpty}
        renderValue={renderValue}
        endAdornment={
          loading ? (
            <InputAdornment position="end" sx={{ mr: 2 }}>
              <CircularProgress size={16} />
            </InputAdornment>
          ) : showClear ? (
            <InputAdornment position="end" sx={{ mr: 2 }}>
              <IconButton size="small" onClick={handleClear} edge="end">
                <X size={16} />
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
        MenuProps={selectMenuSlotProps(theme)}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.avatar && (
              <MuiAvatar
                src={opt.avatar}
                sx={{ width: 24, height: 24, mr: 1, fontSize: '11px', flexShrink: 0 }}
              >
                {opt.label[0]}
              </MuiAvatar>
            )}
            {opt.icon && !opt.avatar && (
              <Box component="span" sx={{ mr: 1, display: 'inline-flex', alignItems: 'center', color: 'text.secondary' }}>
                {opt.icon}
              </Box>
            )}
            {opt.description ? (
              <Box>
                <Typography variant="body2" sx={{ fontSize: '13px', lineHeight: 1.3 }}>{opt.label}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>{opt.description}</Typography>
              </Box>
            ) : (
              opt.label
            )}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <FormHelperText sx={{ fontSize: FORM_CONTROL.helperFontSize, mx: 0, mt: '4px' }}>{helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

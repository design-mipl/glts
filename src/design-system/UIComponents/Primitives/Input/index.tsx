import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { FORM_CONTROL, formControlHeight, outlinedFieldSx } from '../../../formControl'

export interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  size?: 'sm' | 'md'
  type?: string
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  fullWidth?: boolean
  maxLength?: number
  showCount?: boolean
  autoFocus?: boolean
  name?: string
  sx?: SxProps<Theme>
}

export default function Input({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  error = false,
  helperText,
  disabled = false,
  required = false,
  readonly = false,
  size = 'sm',
  type = 'text',
  startAdornment,
  endAdornment,
  fullWidth = false,
  maxLength,
  showCount = false,
  autoFocus = false,
  name,
  sx,
}: InputProps) {
  const theme = useTheme()
  const inputHeight = formControlHeight(size)
  const charCount = value?.length ?? 0

  const helperContent =
    showCount && maxLength ? (
      <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{helperText ?? ''}</span>
        <Typography component="span" variant="caption" color={charCount > maxLength ? 'error' : 'text.secondary'}>
          {charCount}/{maxLength}
        </Typography>
      </Box>
    ) : (
      helperText
    )

  return (
    <TextField
      label={label}
      hiddenLabel={!label}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      onBlur={onBlur}
      error={error || (showCount && maxLength ? charCount > maxLength : false)}
      helperText={helperContent}
      disabled={disabled}
      required={required}
      type={type}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      name={name}
      variant="outlined"
      size={size === 'sm' ? 'small' : 'medium'}
      slotProps={{
        input: {
          readOnly: readonly,
          inputProps: { maxLength, 'aria-label': label },
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : undefined,
        },
        formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
      }}
      sx={[
        outlinedFieldSx(theme, inputHeight),
        {
          '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            cursor: 'not-allowed',
          },
          '& .MuiInputBase-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.text.disabled,
            cursor: 'not-allowed',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}

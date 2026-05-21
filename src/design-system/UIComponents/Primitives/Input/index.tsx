import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme, alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

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
  size = 'md',
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
  const inputHeight = size === 'sm' ? '34px' : '40px'
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
      size="small"
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
        formHelperText: { sx: { mx: 0, mt: '4px', fontSize: '11px' } },
      }}
      sx={[
        {
          '& .MuiInputBase-root': {
            height: inputHeight,
            fontSize: '13px',
            backgroundColor: disabled
              ? theme.palette.action.disabledBackground
              : theme.palette.background.paper,
            borderRadius: '6px',
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
            borderWidth: '1px',
          },
          '& .MuiInputBase-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.secondary,
          },
          '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1.5px',
          },
          '& .MuiInputBase-root.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
            borderRadius: '6px',
          },
          '& .MuiInputBase-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main,
            borderWidth: '1.5px',
          },
          '& .MuiInputBase-root.Mui-error.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.12)}`,
          },
          '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            cursor: 'not-allowed',
          },
          '& .MuiInputBase-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '& .MuiInputBase-input': {
            padding: '0 12px',
            fontSize: '13px',
            '&::placeholder': {
              color: theme.palette.text.disabled,
              opacity: 1,
            },
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.text.disabled,
            cursor: 'not-allowed',
          },
          '& .MuiFormHelperText-root': {
            fontSize: '11px',
            mt: '4px',
            mx: 0,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}

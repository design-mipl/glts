import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

export interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  maxRows?: number
  minRows?: number
  autoResize?: boolean
  maxLength?: number
  showCount?: boolean
  fullWidth?: boolean
  sx?: SxProps<Theme>
}

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  required = false,
  rows,
  maxRows,
  minRows = 3,
  autoResize = false,
  maxLength,
  showCount = false,
  fullWidth = false,
  sx,
}: TextareaProps) {
  const charCount = value?.length ?? 0
  const hasError = error || (showCount && maxLength ? charCount > maxLength : false)

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
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      error={hasError}
      helperText={helperContent}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      multiline
      rows={autoResize ? undefined : (rows ?? undefined)}
      minRows={autoResize ? minRows : undefined}
      maxRows={autoResize ? maxRows : undefined}
      variant="outlined"
      slotProps={{
        input: {
          inputProps: { maxLength },
        },
      }}
      sx={sx}
    />
  )
}

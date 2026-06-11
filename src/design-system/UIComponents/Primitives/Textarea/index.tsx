import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { FORM_CONTROL, readOnlyFieldWrapperSx, textareaOutlinedFieldSx } from '../../../formControl'

export interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  maxRows?: number
  minRows?: number
  /** Grow with content between minRows and maxRows (default when `rows` is not set). */
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
  readonly = false,
  required = false,
  rows,
  maxRows,
  minRows = 3,
  autoResize = true,
  maxLength,
  showCount = false,
  fullWidth = false,
  sx,
}: TextareaProps) {
  const theme = useTheme()
  const charCount = value?.length ?? 0
  const hasError = error || (showCount && maxLength ? charCount > maxLength : false)

  /** Explicit `rows` = fixed height; otherwise auto-size (default). */
  const isFixedHeight = rows != null
  const useAutoSize = !isFixedHeight && autoResize

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
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      error={hasError}
      helperText={helperContent}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      multiline
      rows={isFixedHeight ? rows : undefined}
      minRows={useAutoSize ? minRows : undefined}
      maxRows={useAutoSize ? maxRows : undefined}
      variant="outlined"
      size="small"
      slotProps={{
        input: {
          readOnly: readonly,
          inputProps: { maxLength },
        },
        formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
      }}
      sx={[
        textareaOutlinedFieldSx(theme),
        readonly ? readOnlyFieldWrapperSx(theme) : undefined,
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}

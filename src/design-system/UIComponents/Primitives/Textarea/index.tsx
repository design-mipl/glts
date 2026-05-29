import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { FORM_CONTROL, outlinedFieldSx } from '../../../formControl'

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
  const theme = useTheme()
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
      rows={autoResize ? undefined : (rows ?? undefined)}
      minRows={autoResize ? minRows : (rows ?? minRows)}
      maxRows={autoResize ? maxRows : undefined}
      variant="outlined"
      size="small"
      slotProps={{
        input: {
          inputProps: { maxLength },
        },
        formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
      }}
      sx={[
        outlinedFieldSx(theme, 'auto'),
        {
          '& .MuiOutlinedInput-root, & .MuiInputBase-root': {
            height: 'auto',
            minHeight: '120px',
            alignItems: 'flex-start',
          },
          '& .MuiInputBase-inputMultiline': {
            lineHeight: 1.6,
            fontFamily: 'inherit',
            resize: 'vertical',
          },
          '& .MuiOutlinedInput-root.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}

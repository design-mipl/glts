import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme, alpha } from '@mui/material/styles'
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
      slotProps={{
        input: {
          inputProps: { maxLength },
        },
        formHelperText: { sx: { mx: 0, mt: '4px', fontSize: '11px' } },
      }}
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            fontSize: '13px',
            lineHeight: 1.6,
            borderRadius: '6px',
            backgroundColor: disabled
              ? theme.palette.action.disabledBackground
              : theme.palette.background.paper,
            transition: 'box-shadow 0.2s ease',
            minHeight: '120px',
            alignItems: 'flex-start',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
            borderWidth: '1px',
          },
          '& .MuiOutlinedInput-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.secondary,
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1.5px',
          },
          '& .MuiOutlinedInput-root.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
          },
          '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main,
            borderWidth: '1.5px',
          },
          '& .MuiOutlinedInput-root.Mui-error.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.12)}`,
          },
          '& .MuiInputBase-inputMultiline': {
            fontSize: '13px',
            lineHeight: 1.6,
            fontFamily: 'inherit',
            resize: 'vertical',
            '&::placeholder': {
              color: theme.palette.text.disabled,
              opacity: 1,
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: '11px',
            mx: 0,
            mt: '4px',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}

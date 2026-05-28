import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

export interface FormFieldProps {
  label?: string
  required?: boolean
  optional?: boolean
  hint?: string
  error?: boolean
  helperText?: string
  children: ReactNode
  labelFor?: string
  sx?: SxProps<Theme>
}

export default function FormField({
  label,
  required = false,
  optional = false,
  hint,
  error = false,
  helperText,
  children,
  labelFor,
  sx,
}: FormFieldProps) {
  return (
    <Box
      sx={[
        { display: 'flex', flexDirection: 'column' },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {(label || hint) ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0.5,
            mb: 0.75,
          }}
        >
          {label ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                component="label"
                htmlFor={labelFor}
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.4,
                  cursor: labelFor ? 'pointer' : 'default',
                }}
              >
                {label}
              </Typography>
              {required ? (
                <Typography component="span" sx={{ color: 'error.main', fontSize: 13, lineHeight: 1 }}>
                  *
                </Typography>
              ) : null}
              {optional && !required ? (
                <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                  optional
                </Typography>
              ) : null}
            </Box>
          ) : (
            <Box />
          )}
          {hint ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, fontWeight: 400 }}>
              {hint}
            </Typography>
          ) : null}
        </Box>
      ) : null}
      {children}
      {helperText ? (
        <FormHelperText error={error} sx={{ mt: 0.5, mx: 0, fontSize: 12 }}>
          {helperText}
        </FormHelperText>
      ) : null}
    </Box>
  )
}

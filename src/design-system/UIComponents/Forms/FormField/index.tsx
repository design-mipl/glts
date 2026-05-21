import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import { AlertCircle } from 'lucide-react'

export interface FormFieldProps {
  label?: string
  required?: boolean
  error?: boolean
  helperText?: string
  hint?: string
  children: ReactNode
  labelFor?: string
  sx?: SxProps<Theme>
}

export default function FormField({
  label,
  required = false,
  error = false,
  helperText,
  hint,
  children,
  labelFor,
  sx,
}: FormFieldProps) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {(label || hint) ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: tokens.spacing[3],
          }}
        >
          {label ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                component="label"
                htmlFor={labelFor}
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.4,
                  cursor: labelFor ? 'pointer' : 'default',
                }}
              >
                {label}
              </Typography>
              {required ? (
                <Box component="span" sx={{ color: 'error.main', fontSize: '13px', lineHeight: 1 }}>
                  *
                </Box>
              ) : null}
            </Box>
          ) : <Box />}
          {hint ? (
            <Typography variant="caption" color="text.secondary" textAlign="right" sx={{ fontSize: '11px' }}>
              {hint}
            </Typography>
          ) : null}
        </Box>
      ) : null}
      {children}
      {helperText ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: '2px' }}>
          {error && <AlertCircle size={12} color="var(--mui-palette-error-main, #d32f2f)" style={{ flexShrink: 0 }} />}
          <Typography
            variant="caption"
            sx={{ fontSize: '11px', color: error ? 'error.main' : 'text.secondary', lineHeight: 1.4 }}
          >
            {helperText}
          </Typography>
        </Box>
      ) : null}
    </Box>
  )
}

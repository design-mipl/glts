import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

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
          gap: tokens.spacing[2],
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
            <Typography
              component="label"
              htmlFor={labelFor}
              variant="body2"
              fontWeight={tokens.fontWeight.medium}
            >
              {label}
              {required ? (
                <Box component="span" sx={{ color: 'error.main', ml: tokens.spacing[1] }}>
                  *
                </Box>
              ) : null}
            </Typography>
          ) : <Box />}
          {hint ? (
            <Typography variant="caption" color="text.secondary" textAlign="right">
              {hint}
            </Typography>
          ) : null}
        </Box>
      ) : null}
      {children}
      {helperText ? (
        <Typography variant="caption" color={error ? 'error.main' : 'text.secondary'}>
          {helperText}
        </Typography>
      ) : null}
    </Box>
  )
}

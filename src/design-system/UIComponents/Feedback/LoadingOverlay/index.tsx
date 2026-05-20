import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import { Spinner } from '../../Display'

type SpinnerSize = 'sm' | 'md' | 'lg'

export interface LoadingOverlayProps {
  loading: boolean
  children: ReactNode
  blur?: boolean
  spinnerSize?: SpinnerSize
  label?: string
  sx?: SxProps<Theme>
}

export default function LoadingOverlay({
  loading,
  children,
  blur = false,
  spinnerSize = 'md',
  label,
  sx,
}: LoadingOverlayProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Fade in={loading} mountOnEnter unmountOnExit timeout={200}>
        <Box
          sx={[
            {
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
              backdropFilter: blur ? 'blur(2px)' : 'none',
              zIndex: 10,
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: tokens.spacing[2],
            }}
          >
            <Spinner size={spinnerSize} />
            {label ? (
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Fade>
    </Box>
  )
}

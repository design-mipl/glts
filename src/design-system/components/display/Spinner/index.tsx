import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'inherit'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  label?: string
  overlay?: boolean
  sx?: SxProps<Theme>
}

const sizePx: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
}

export default function Spinner({
  size = 'md',
  color = 'primary',
  label,
  overlay = false,
  sx,
}: SpinnerProps) {
  const progress = (
    <CircularProgress
      size={sizePx[size]}
      color={color}
      aria-label={label}
      sx={overlay ? undefined : sx}
    />
  )

  if (label) {
    return (
      <Box sx={[{ display: 'inline-flex', alignItems: 'center', gap: 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
        {progress}
        <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
          {label}
        </Box>
      </Box>
    )
  }

  if (overlay) {
    return (
      <Box
        sx={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {progress}
      </Box>
    )
  }

  return progress
}

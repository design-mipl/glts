import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { tokens } from '../../../tokens'

type ProgressSize = 'sm' | 'md' | 'lg'
type ProgressVariant = 'linear' | 'circular'
type ProgressColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'

export interface ProgressBarProps {
  value?: number
  variant?: ProgressVariant
  color?: ProgressColor
  size?: ProgressSize
  label?: string
  showValue?: boolean
  animated?: boolean
  sx?: SxProps<Theme>
}

const stripeAnimation = keyframes`
  from {
    background-position: 0 0;
  }
  to {
    background-position: 40px 0;
  }
`

const linearHeights: Record<ProgressSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
}

const circularSizes: Record<ProgressSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
}

export default function ProgressBar({
  value,
  variant = 'linear',
  color = 'primary',
  size = 'md',
  label,
  showValue = false,
  animated = false,
  sx,
}: ProgressBarProps) {
  const resolvedValue = typeof value === 'number' ? Math.max(0, Math.min(100, value)) : undefined

  if (variant === 'circular') {
    const diameter = circularSizes[size]

    return (
      <Box
        sx={[
          {
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: tokens.spacing[2],
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {label ? <Typography variant="body2">{label}</Typography> : null}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant={resolvedValue === undefined ? 'indeterminate' : 'determinate'}
            value={resolvedValue}
            color={color}
            size={diameter}
          />
          {showValue && resolvedValue !== undefined ? (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" fontWeight={tokens.fontWeight.semibold}>
                {`${Math.round(resolvedValue)}%`}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={[
        {
          width: '100%',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {(label || showValue) ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: tokens.spacing[3],
            mb: tokens.spacing[2],
          }}
        >
          <Typography variant="body2">{label}</Typography>
          {showValue && resolvedValue !== undefined ? (
            <Typography variant="body2" color="text.secondary">
              {`${Math.round(resolvedValue)}%`}
            </Typography>
          ) : null}
        </Box>
      ) : null}
      <LinearProgress
        variant={resolvedValue === undefined ? 'indeterminate' : 'determinate'}
        value={resolvedValue}
        color={color}
        sx={{
          height: linearHeights[size],
          borderRadius: tokens.borderRadius.full,
          overflow: 'hidden',
          '& .MuiLinearProgress-bar': animated
            ? {
                backgroundImage:
                  'linear-gradient(135deg, rgba(255,255,255,0.24) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.24) 50%, rgba(255,255,255,0.24) 75%, transparent 75%, transparent)',
                backgroundSize: '40px 40px',
                animation: `${stripeAnimation} 1s linear infinite`,
              }
            : undefined,
        }}
      />
    </Box>
  )
}

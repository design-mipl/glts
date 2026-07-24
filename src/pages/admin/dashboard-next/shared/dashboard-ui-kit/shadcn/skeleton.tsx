import { forwardRef } from 'react'
import { Box, type BoxProps, keyframes } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { cn } from './utils'

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.45; }
  100% { opacity: 1; }
`

const SkeletonRoot = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.16 : 0.08),
  borderRadius: tokens.borderRadius.lg,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${pulse} 1.4s ease-in-out infinite`,
  },
}))

export const Skeleton = forwardRef<HTMLDivElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <SkeletonRoot
    ref={ref}
    className={cn('dui-skeleton', className)}
    aria-hidden
    sx={sx}
    {...props}
  />
))
Skeleton.displayName = 'Skeleton'

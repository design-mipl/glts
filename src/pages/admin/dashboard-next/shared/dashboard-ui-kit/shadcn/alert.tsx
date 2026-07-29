import { forwardRef } from 'react'
import { Box, type BoxProps } from '@mui/material'
import { cva, type VariantProps } from 'class-variance-authority'
import { alpha, styled } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { cn } from './utils'

const alertVariants = cva('dui-alert', {
  variants: {
    variant: {
      default: 'dui-alert--default',
      destructive: 'dui-alert--destructive',
      warning: 'dui-alert--warning',
      success: 'dui-alert--success',
      info: 'dui-alert--info',
    },
  },
  defaultVariants: { variant: 'default' },
})

const AlertRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'duiVariant',
})<{ duiVariant?: string }>(({ theme, duiVariant = 'default' }) => {
  const map: Record<string, { bg: string; border: string; fg: string }> = {
    default: {
      bg: alpha(theme.palette.primary.main, 0.06),
      border: theme.palette.divider,
      fg: theme.palette.text.primary,
    },
    destructive: {
      bg: alpha(theme.palette.error.main, 0.08),
      border: alpha(theme.palette.error.main, 0.35),
      fg: theme.palette.error.main,
    },
    warning: {
      bg: alpha(theme.palette.warning.main, 0.1),
      border: alpha(theme.palette.warning.main, 0.4),
      fg: theme.palette.warning.dark,
    },
    success: {
      bg: alpha(theme.palette.success.main, 0.08),
      border: alpha(theme.palette.success.main, 0.35),
      fg: theme.palette.success.main,
    },
    info: {
      bg: alpha(theme.palette.info.main, 0.08),
      border: alpha(theme.palette.info.main, 0.35),
      fg: theme.palette.info.main,
    },
  }
  const tone = map[duiVariant] ?? map.default
  return {
    position: 'relative',
    width: '100%',
    borderRadius: tokens.borderRadius.xl,
    border: `1px solid ${tone.border}`,
    backgroundColor: tone.bg,
    color: tone.fg,
    padding: theme.spacing(1.75, 2),
    display: 'grid',
    gap: theme.spacing(0.5),
  }
})

export interface AlertProps extends BoxProps, VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, role = 'alert', ...props }, ref) => (
    <AlertRoot
      ref={ref}
      role={role}
      className={cn(alertVariants({ variant }), className)}
      duiVariant={variant ?? 'default'}
      {...props}
    />
  ),
)
Alert.displayName = 'Alert'

export const AlertTitle = forwardRef<HTMLHeadingElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    component="h5"
    className={cn('dui-alert-title', className)}
    sx={{
      m: 0,
      fontWeight: 700,
      fontSize: tokens.fontSize.sm,
      letterSpacing: -0.1,
      ...((sx as object) ?? {}),
    }}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = forwardRef<HTMLParagraphElement, BoxProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      component="div"
      className={cn('dui-alert-description', className)}
      sx={{
        fontSize: tokens.fontSize.sm,
        opacity: 0.9,
        lineHeight: tokens.lineHeight.normal,
        color: 'text.secondary',
        ...((sx as object) ?? {}),
      }}
      {...props}
    />
  ),
)
AlertDescription.displayName = 'AlertDescription'

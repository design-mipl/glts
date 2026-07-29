import { forwardRef } from 'react'
import { Box, type BoxProps } from '@mui/material'
import { cva, type VariantProps } from 'class-variance-authority'
import { alpha, styled } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { cn } from './utils'

export const badgeVariants = cva('dui-badge', {
  variants: {
    variant: {
      default: 'dui-badge--default',
      secondary: 'dui-badge--secondary',
      destructive: 'dui-badge--destructive',
      outline: 'dui-badge--outline',
      success: 'dui-badge--success',
      warning: 'dui-badge--warning',
      info: 'dui-badge--info',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const BadgeRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'duiVariant',
})<{ duiVariant?: string }>(({ theme, duiVariant = 'default' }) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: tokens.borderRadius.full,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1.2,
    border: '1px solid transparent',
    whiteSpace: 'nowrap' as const,
  }

  switch (duiVariant) {
    case 'secondary':
      return {
        ...base,
        backgroundColor: alpha(theme.palette.text.primary, 0.06),
        color: theme.palette.text.secondary,
      }
    case 'destructive':
      return {
        ...base,
        backgroundColor: alpha(theme.palette.error.main, 0.12),
        color: theme.palette.error.main,
      }
    case 'outline':
      return {
        ...base,
        backgroundColor: 'transparent',
        borderColor: theme.palette.divider,
        color: theme.palette.text.secondary,
      }
    case 'success':
      return {
        ...base,
        backgroundColor: alpha(theme.palette.success.main, 0.12),
        color: theme.palette.success.main,
      }
    case 'warning':
      return {
        ...base,
        backgroundColor: alpha(theme.palette.warning.main, 0.14),
        color: theme.palette.warning.dark,
      }
    case 'info':
      return {
        ...base,
        backgroundColor: alpha(theme.palette.info.main, 0.12),
        color: theme.palette.info.main,
      }
    default:
      return {
        ...base,
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
      }
  }
})

export interface BadgeProps extends BoxProps, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <BadgeRoot
      ref={ref}
      component="span"
      className={cn(badgeVariants({ variant }), className)}
      duiVariant={variant ?? 'default'}
      {...props}
    />
  ),
)
Badge.displayName = 'Badge'
